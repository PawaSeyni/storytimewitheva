// Pinterest Conversions API — server-side signup conversion (TAG-001).
//
// Privacy-first alternative to a browser pixel: NO client-side tag, NO cookies,
// NO cross-site tracking. Fired ONLY on a confirmed MailerLite subscribe, from
// the server, with a SHA-256-hashed email (never the raw address) and no
// browsing data. This keeps the site's published "no advertising trackers / no
// cookies to follow you around the web / no profiles of children" promise intact
// while still giving Pinterest the signup signal (with per-magnet lead_type) so
// campaigns can optimise for conversions instead of clicks.
//
// The conversion tag id (2613658812609) is the event source; in the v5 CAPI it
// is implied by the ad-account path, not a body field.
//
// Env (Netlify → Environment variables):
//   PINTEREST_CONVERSIONS_TOKEN  required to send; unset → silently skipped
//   PINTEREST_AD_ACCOUNT_ID      optional; default 549770651316
// Best-effort: any failure here must NEVER affect the subscribe response.

import { createHash, randomUUID } from 'node:crypto';

const DEFAULT_AD_ACCOUNT = '549770651316'; // PaWa Press - Story Time with Eva

export const sha256Hex = (s) => createHash('sha256').update(String(s)).digest('hex');

/** SHA-256 of the normalised (trimmed, lowercased) email — Pinterest's `em` format. */
export const hashEmail = (email) => sha256Hex(String(email).trim().toLowerCase());

/**
 * Build one Pinterest CAPI `signup` event. Pure: no I/O, no clock, no
 * randomness (event_time / event_id are injected), so it is unit-testable.
 *
 * Privacy: the ONLY identifier sent is the SHA-256-hashed email. We deliberately
 * do NOT send the visitor's IP address or user-agent — Pinterest's `em` is
 * enough to attribute a conversion, and omitting IP/UA keeps the payload exactly
 * what the privacy policy discloses ("only a hashed version of your email, and
 * no other information about you").
 */
export function buildSignupEvent({ email, leadMagnet, eventId, eventTime }) {
  const user_data = { em: [hashEmail(email)] };

  const custom_data = { num_items: 1 };
  if (leadMagnet) {
    custom_data.content_ids = [leadMagnet];
    custom_data.content_category = leadMagnet; // which magnet converted (lead_type)
  }

  return {
    event_name: 'signup',
    action_source: 'web',
    event_time: eventTime,
    event_id: eventId,
    event_source_url: 'https://storytimewitheva.com/',
    user_data,
    custom_data,
  };
}

/**
 * Send the signup conversion to Pinterest. Returns a plain result object and
 * never throws for a normal API failure (the caller must not let this affect the
 * subscribe response). Clock/uuid/fetch are injectable for tests.
 */
export async function sendSignupConversion(
  { email, leadMagnet },
  { fetchImpl = fetch, now = Date.now, uuid = randomUUID } = {}
) {
  const token = process.env.PINTEREST_CONVERSIONS_TOKEN;
  if (!token) return { skipped: true, reason: 'not_configured' };

  const adAccount = process.env.PINTEREST_AD_ACCOUNT_ID || DEFAULT_AD_ACCOUNT;
  const data = buildSignupEvent({
    email,
    leadMagnet,
    eventId: uuid(),
    eventTime: Math.floor(now() / 1000),
  });

  const res = await fetchImpl(`https://api.pinterest.com/v5/ad_accounts/${adAccount}/events`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [data] }),
  });
  let respBody = null;
  try {
    respBody = await res.json();
  } catch {
    /* some responses have no JSON body */
  }
  return { skipped: false, ok: res.ok, status: res.status, data: respBody };
}
