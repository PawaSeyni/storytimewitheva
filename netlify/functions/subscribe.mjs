// Server-side newsletter subscribe (P0 fix).
//
// The site previously POSTed straight to MailerLite's JSONP embedded-form
// endpoint from the browser with mode:'no-cors'. That endpoint now returns 503
// to raw POSTs (it expects MailerLite's own webforms.js + a real CSRF token),
// and because no-cors hides the response the UI showed "success" while every
// email was dropped. This function calls MailerLite's official API server-side
// with the account token (never exposed to the browser) and returns a real
// success/error the form can act on.
//
// Env vars (set in Netlify → Site configuration → Environment variables):
//   MAILERLITE_API_KEY   (required)  a MailerLite API token
//   MAILERLITE_GROUP      (optional)  group name to add subscribers to
//                                     (default: "storytimewitheva-signups")
//
// MailerLite API: https://developers.mailerlite.com/docs — POST /api/subscribers
// upserts by email; `groups` takes group IDs, so we resolve the id by name once.

import { withLambda } from '@netlify/aws-lambda-compat';
import { checkRate, clientIp } from './_ratelimit.mjs';
import { verifyHuman } from './_verify.mjs';
import { sendSignupConversion } from './_pinterest.mjs';

const API = 'https://connect.mailerlite.com/api';
const GROUP_NAME = process.env.MAILERLITE_GROUP || 'storytimewitheva-signups';
const VALID_LANG = new Set(['en', 'es', 'fr']);

let cachedGroupId = null; // warm across invocations in the same container

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

// 429 carries Retry-After so a well-behaved client can back off instead of
// hammering. Deliberately honest rather than a fake success: a real person who
// trips this needs to know to wait, and a bot learning it is limited is fine.
const rateLimited = ({ retryAfter, degraded }) => ({
  statusCode: 429,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Retry-After': String(retryAfter || 60),
  },
  body: JSON.stringify({
    ok: false,
    error: 'rate_limited',
    retry_after: retryAfter || 60,
    // true = shared store unreachable and this instance is counting in memory.
    // Surfaced deliberately: it is the only way to tell a working shared-store
    // limiter from a degraded per-instance one without reading function logs.
    degraded: Boolean(degraded),
  }),
});

async function ml(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(opts.headers || {}),
    },
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* some responses have no body */
  }
  return { ok: res.ok, status: res.status, data };
}

async function resolveGroupId() {
  if (cachedGroupId) return cachedGroupId;
  const r = await ml(`/groups?filter[name]=${encodeURIComponent(GROUP_NAME)}&limit=50`);
  if (!r.ok) return null;
  const match = (r.data?.data || []).find(g => g.name === GROUP_NAME) || (r.data?.data || [])[0];
  cachedGroupId = match?.id || null;
  return cachedGroupId;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: { Allow: 'POST' } };
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });

  // Anti-abuse layer 1 — rate limit (IP scope). Deliberately FIRST: it must
  // apply to every caller, including ones that never send an Origin and ones
  // the honeypot would catch, and it should cost as little work as possible.
  // The email scope runs later, once the body has been parsed and validated.
  //
  // Defence in depth, not a replacement: the platform rule in the `config`
  // export below is kept and is the PREFERRED layer, because when it fires the
  // request is rejected at the edge and never invokes this function. Whether it
  // fires is not something this repo can observe or test (see _ratelimit.mjs);
  // this layer is the one whose behaviour is asserted by tests.
  const ip = clientIp(event.headers || {});
  const ipRate = await checkRate({ ip });
  if (!ipRate.allowed) {
    console.warn(`[ratelimit] blocked ${ipRate.scope}${ipRate.degraded ? ' (degraded store)' : ''}`);
    return rateLimited(ipRate);
  }

  // Anti-abuse layer 2 — origin check. A browser fetch from our own site always
  // sends an Origin; if one is present it must be ours (blocks another site
  // scripting fetches against this endpoint). A MISSING Origin (native-form
  // fallback, some privacy settings) is allowed so we never drop a real signup.
  // NOTE: this is defense-in-depth, not a rate limit — a header-less scripted
  // client can still reach the endpoint. The durable control is the platform
  // rate limit in the `config` export at the bottom of this file.
  const origin = event.headers['origin'] || event.headers['Origin'] || '';
  if (origin) {
    let host = '';
    try { host = new URL(origin).hostname; } catch { host = 'invalid'; }
    const allowed = host === 'storytimewitheva.com' || host.endsWith('.netlify.app') || host === 'localhost';
    if (!allowed) return json(403, { ok: false, error: 'bad_origin' });
  }

  if (!process.env.MAILERLITE_API_KEY) {
    console.error('MAILERLITE_API_KEY is not set');
    return json(500, { ok: false, error: 'not_configured' });
  }

  // Accept both the fetch() JSON path (normal) and a native form POST. The form
  // carries no `action` in the pre-hydration window, so before React attaches
  // its handler a submit would otherwise do a native GET to "/". Pointing the
  // form's action here (method=post) means even that early submit is captured;
  // we detect the form-encoded case and redirect back to the page instead of
  // returning raw JSON.
  const ct = (event.headers['content-type'] || event.headers['Content-Type'] || '').toLowerCase();
  const isForm = ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data');
  let body = {};
  try {
    if (isForm) {
      const params = new URLSearchParams(event.body || '');
      body = {
        email: params.get('email') || params.get('fields[email]'),
        name: params.get('name') || params.get('fields[name]'),
        language: params.get('language') || params.get('fields[language]'),
        lead_magnet: params.get('lead_magnet') || params.get('fields[lead_magnet]'),
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
        utm_content: params.get('utm_content'),
        company: params.get('company'),
      };
    } else {
      body = JSON.parse(event.body || '{}');
    }
  } catch {
    return json(400, { ok: false, error: 'bad_request' });
  }
  const redirect = to => ({ statusCode: 303, headers: { Location: to, 'Cache-Control': 'no-store' }, body: '' });

  // Anti-abuse layer 3 — honeypot. `company` is a hidden field no human sees.
  // Anything in it is a bot: return a success-shaped response WITHOUT creating a
  // subscriber, so the bot gets no signal it was filtered.
  if (String(body.company || '').trim()) {
    return isForm ? redirect('/?signup=ok#email-signup') : json(200, { ok: true, grouped: true });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim().slice(0, 80);
  const language = VALID_LANG.has(body.language) ? body.language : 'en';
  const leadMagnet = String(body.lead_magnet || '').trim().slice(0, 60);

  // Minimal server-side email sanity check (the client validates too).
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return isForm ? redirect('/?signup=invalid#email-signup') : json(422, { ok: false, error: 'invalid_email' });
  }

  // Anti-abuse layer 4 — rate limit (email scope). Caps repeated submissions of
  // one address regardless of source IP, which IP limiting alone cannot do.
  const emailRate = await checkRate({ email });
  if (!emailRate.allowed) {
    console.warn(`[ratelimit] blocked ${emailRate.scope}`);
    return isForm ? redirect('/?signup=error#email-signup') : rateLimited(emailRate);
  }

  // Anti-abuse layer 5 — human verification. A no-op seam today (see
  // _verify.mjs); wired here so adding Turnstile needs no change to this flow.
  const verdict = await verifyHuman({ token: body.verification_token, ip });
  if (!verdict.ok) {
    console.warn(`[verify] rejected by ${verdict.provider}: ${verdict.reason || 'no reason given'}`);
    return isForm ? redirect('/?signup=error#email-signup') : json(403, { ok: false, error: 'unverified' });
  }

  const coreFields = { language };
  if (name) coreFields.name = name;
  if (leadMagnet) coreFields.lead_magnet = leadMagnet;

  // Campaign attribution (utm_* mapped to source/medium/campaign/content). These
  // only persist if the matching MailerLite custom fields exist; if MailerLite
  // rejects an unknown field (non-email 422) we retry with core fields only, so
  // a signup is NEVER lost over attribution metadata.
  const utm = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    const v = String(body[k] || '').trim().slice(0, 120);
    if (v) utm[k] = v;
  }

  // The welcome automation is triggered by joining `storytimewitheva-signups`, so
  // grouping is mandatory. If the group id can't be resolved (transient MailerLite
  // failure or misconfig), fail with a retryable error rather than silently
  // creating an ungrouped subscriber who would never enter the welcome sequence.
  const groupId = await resolveGroupId();
  if (!groupId) {
    console.error('Group resolution failed; refusing to create an ungrouped subscriber');
    return isForm ? redirect('/?signup=error#email-signup') : json(503, { ok: false, error: 'group_unavailable' });
  }
  const subscribe = fields =>
    ml('/subscribers', { method: 'POST', body: JSON.stringify({ email, fields, groups: [groupId] }) });

  let r = await subscribe({ ...coreFields, ...utm });
  if (!r.ok && r.status === 422 && !r.data?.errors?.email && Object.keys(utm).length) {
    r = await subscribe(coreFields);
  }

  // 200/201 = created/updated. 422 with an email error is a real validation
  // failure; other non-2xx are upstream problems we surface as a retryable error.
  if (r.ok) {
    // Best-effort server-side Pinterest conversion (privacy-first: hashed email
    // ONLY — no browser pixel/cookie, and deliberately no IP or user-agent).
    // Fired only on confirmed success. A failure here must never affect the
    // signup result, so it is fully swallowed.
    try {
      await sendSignupConversion({ email, leadMagnet });
    } catch (err) {
      console.error('Pinterest conversion send failed', err);
    }
    return isForm ? redirect('/?signup=ok#email-signup') : json(200, { ok: true, grouped: true });
  }
  if (r.status === 422 && r.data?.errors?.email) {
    return isForm ? redirect('/?signup=invalid#email-signup') : json(422, { ok: false, error: 'invalid_email' });
  }
  console.error('MailerLite subscribe failed', r.status, JSON.stringify(r.data));
  return isForm ? redirect('/?signup=error#email-signup') : json(502, { ok: false, error: 'upstream_error' });
}

// ---------------------------------------------------------------------------
// Platform rate limit (audit #1). THIS is the durable anti-abuse control; the
// origin check and honeypot above are defense-in-depth that a scripted client
// can sidestep.
//
// It has to live here. Netlify applies function rate limits ONLY from a
// function's own `config` export — not from netlify.toml, and NOT from an edge
// function declared on this function's path. The previous attempt
// (netlify/edge-functions/rate-limit-subscribe.mjs, deleted in this change) was
// exactly that dead configuration: it declared 10/60s and enforced nothing.
// Verified before this fix: 13 rapid POSTs to production returned 13x 200.
//
// `config` is a v2-functions feature and the handler above is legacy
// Lambda-style, so withLambda() bridges the two. The named `handler` export is
// kept deliberately: the unit tests drive it directly, and wrapping must not
// cost us that coverage.
//
// 5 POSTs / 60s / IP. A human signs up once; five is generous headroom for a
// double-click or a retry after a network blip, while capping a single-source
// flood at 300/hour instead of unbounded. Rejected requests are blocked at the
// edge, so they never invoke this function or reach MailerLite.
export default withLambda(handler);

export const config = {
  // MUST match the endpoint the browser actually POSTs to
  // (src/components/EmailSignup.tsx SUBSCRIBE_ENDPOINT), for both the fetch()
  // path and the pre-hydration native form action. Binding the limit to a
  // different public path would leave this one reachable and unprotected:
  // Netlify always serves a function at /.netlify/functions/<name>, and
  // /.netlify/* cannot be intercepted by redirects, so it cannot be closed off.
  path: '/.netlify/functions/subscribe',
  // Deliberately NO `method` here. Declaring method: 'POST' restricts the
  // ROUTE, so anything else stops reaching the handler at all: it turned the
  // handler's 405 for GET into a 404, and silently dropped its OPTIONS -> 204
  // CORS preflight branch (both observed in production on 8ec408b). The
  // handler already rejects non-POST itself, and the rate limit applies to the
  // path regardless of method.
  rateLimit: {
    action: 'rate_limit',
    // ['ip', 'domain'] — "per domain & IP address" is the aggregation available
    // on non-Enterprise plans. ['ip'] alone is accepted by the deploy API and
    // stored in the rule, but did NOT enforce when tested on preview 125
    // (8 rapid POSTs, 8x 200); ['domain'] alone is Enterprise-only.
    aggregateBy: ['ip', 'domain'],
    windowLimit: 5,
    windowSize: 60,
  },
};
