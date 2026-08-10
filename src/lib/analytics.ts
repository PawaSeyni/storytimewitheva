// Privacy-first custom-event tracking (Plausible).
//
// Per the Privacy-First Lead Funnel design: aggregate, cookieless funnel
// measurement with NO advertising pixel, NO cookies, NO persistent visitor id,
// NO session replay, and NO PII in event properties. Plausible is loaded in
// index.html (cookieless); this dispatches named funnel events to
// `window.plausible` with only whitelisted aggregate dimensions.
//
// Critical separation rule (design §5): Plausible measures aggregate behavior;
// MailerLite holds subscriber identity. The two are deliberately NEVER joined —
// no email / name / subscriber_id ever reaches an event property.
//
// Funnel events fired at their call sites:
//   Landing View · Form View · Form Start · Form Submit · Lead Created ·
//   Magnet Download · Book View · Purchase Click
// (Language Switch / Read Aloud / Activity Complete are harmless product events.)

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props; callback?: () => void }) => void;
  }
}

// Campaign attribution we ARE allowed to attach (metadata only, from the URL).
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
// Identity / PII that must stay isolated in MailerLite and NEVER reach analytics.
const PII_KEYS = new Set(['email', 'name', 'first_name', 'firstname', 'subscriber_id', 'id']);

function utmProps(): Props {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  const out: Props = {};
  for (const k of UTM_KEYS) {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 120);
  }
  return out;
}

/**
 * Fire an aggregate funnel event. Campaign UTMs (from the current URL) are
 * attached automatically; any PII-shaped key is stripped defensively, so a
 * mistaken call site can never leak subscriber identity into analytics.
 */
export function track(event: string, props?: Props): void {
  if (typeof window === 'undefined') return;
  // Skip the build-time prerender crawler (headless Chromium sets
  // navigator.webdriver) so mount-fired events don't send phantom hits on deploy.
  if (typeof navigator !== 'undefined' && navigator.webdriver) return;
  const merged: Props = { ...utmProps(), ...(props || {}) };
  for (const k of Object.keys(merged)) if (PII_KEYS.has(k.toLowerCase())) delete merged[k];
  try {
    window.plausible?.(event, Object.keys(merged).length ? { props: merged } : undefined);
  } catch {
    // never let analytics break the page
  }
}
