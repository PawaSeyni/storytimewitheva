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
      };
    } else {
      body = JSON.parse(event.body || '{}');
    }
  } catch {
    return json(400, { ok: false, error: 'bad_request' });
  }
  const redirect = to => ({ statusCode: 303, headers: { Location: to, 'Cache-Control': 'no-store' }, body: '' });

  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim().slice(0, 80);
  const language = VALID_LANG.has(body.language) ? body.language : 'en';
  const leadMagnet = String(body.lead_magnet || '').trim().slice(0, 60);

  // Minimal server-side email sanity check (the client validates too).
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return isForm ? redirect('/?signup=invalid#email-signup') : json(422, { ok: false, error: 'invalid_email' });
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

  const groupId = await resolveGroupId();
  const subscribe = fields =>
    ml('/subscribers', { method: 'POST', body: JSON.stringify({ email, fields, ...(groupId ? { groups: [groupId] } : {}) }) });

  let r = await subscribe({ ...coreFields, ...utm });
  if (!r.ok && r.status === 422 && !r.data?.errors?.email && Object.keys(utm).length) {
    r = await subscribe(coreFields);
  }

  // 200/201 = created/updated. 422 with an email error is a real validation
  // failure; other non-2xx are upstream problems we surface as a retryable error.
  if (r.ok) {
    // Best-effort server-side Pinterest conversion (privacy-first: hashed email
    // only, no browser pixel/cookie). Fired only on confirmed success. A failure
    // here must never affect the signup result, so it is fully swallowed.
    try {
      const fwd = String(event.headers['x-forwarded-for'] || '').split(',')[0].trim();
      await sendSignupConversion({
        email,
        leadMagnet,
        clientIp: event.headers['x-nf-client-connection-ip'] || fwd || undefined,
        userAgent: event.headers['user-agent'] || event.headers['User-Agent'] || undefined,
      });
    } catch (err) {
      console.error('Pinterest conversion send failed', err);
    }
    return isForm ? redirect('/?signup=ok#email-signup') : json(200, { ok: true, grouped: !!groupId });
  }
  if (r.status === 422 && r.data?.errors?.email) {
    return isForm ? redirect('/?signup=invalid#email-signup') : json(422, { ok: false, error: 'invalid_email' });
  }
  console.error('MailerLite subscribe failed', r.status, JSON.stringify(r.data));
  return isForm ? redirect('/?signup=error#email-signup') : json(502, { ok: false, error: 'upstream_error' });
}
