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
// PII protection is DEFAULT-DENY: both the event name and the property keys are
// a fixed allowlist (compile-time via the types below, and again at runtime via
// sanitizeProps). A call site cannot introduce a new key (e.g. `customer_email`)
// — it won't type-check, and even a dynamically-typed caller is stripped at
// runtime because the key isn't in ALLOWED_PROP_KEYS.

// The complete funnel + product event taxonomy. Adding an event means adding it
// here first (so the name is intentional and greppable).
export type FunnelEvent =
  | 'Landing View'
  | 'Form View'
  | 'Form Start'
  | 'Form Submit'
  | 'Lead Created'
  | 'Magnet Download'
  | 'Book View'
  | 'Purchase Click'
  | 'Language Switch'
  | 'Read Aloud'
  | 'Activity Complete';

// The ONLY property keys allowed on any event. Aggregate dimensions only — never
// anything that identifies a person.
const ALLOWED_PROP_KEYS = [
  'language',
  'lead_magnet',
  'landing_page',
  'asset',
  'book',
  'destination',
  'activity',
] as const;
type PropKey = (typeof ALLOWED_PROP_KEYS)[number];

/** Aggregate, non-PII dimensions a call site may attach to an event. */
export type FunnelProps = Partial<Record<PropKey, string | number | boolean>>;

type PlausibleValue = string | number | boolean;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

// The inline stub in index.html sets `stub: true` on the function it installs.
// The real site-keyed script replaces window.plausible with its own function
// (no `stub` flag) once it loads. We use that to know when it's safe to send.
type PlausibleFn = ((event: string, options?: { props?: Record<string, PlausibleValue>; callback?: () => void }) => void) & {
  stub?: boolean;
};

// Campaign attribution we ARE allowed to attach (metadata only, from the URL).
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

// Runtime allowlist = approved dimensions + campaign UTMs. Anything else is
// dropped, so a mistaken or dynamically-typed call can never leak identity.
const ALLOWED = new Set<string>([...ALLOWED_PROP_KEYS, ...UTM_KEYS]);

function utmProps(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 120);
  }
  return out;
}

/**
 * Default-deny filter: keep ONLY allowlisted keys with primitive values.
 * Exported so the guarantee is unit-testable independently of the DOM.
 */
export function sanitizeProps(merged: Record<string, unknown>): Record<string, PlausibleValue> {
  const out: Record<string, PlausibleValue> = {};
  for (const [k, v] of Object.entries(merged)) {
    if (!ALLOWED.has(k)) continue;
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') out[k] = v;
  }
  return out;
}

// The site-keyed pa-*.js loads async and does NOT flush window.plausible.q, so
// any event fired before it loads would be lost (this is the bug that silently
// dropped Form Start → Lead Created for fast-interacting visitors). We buffer our
// events and flush them to the REAL function once it has replaced the stub.
type Queued = { event: FunnelEvent; props?: Record<string, PlausibleValue> };
const buffer: Queued[] = [];
let pollTimer: ReturnType<typeof setInterval> | undefined;

// Ready = window.plausible exists and is the real script, not our inline stub.
function plausibleReady(): boolean {
  const p = typeof window !== 'undefined' ? window.plausible : undefined;
  return typeof p === 'function' && p.stub !== true;
}

function flush(): void {
  if (!plausibleReady()) return;
  const p = window.plausible!;
  while (buffer.length) {
    const { event, props } = buffer.shift()!;
    try {
      p(event, props ? { props } : undefined);
    } catch {
      // never let analytics break the page
    }
  }
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = undefined;
  }
}

function scheduleFlush(): void {
  if (plausibleReady()) {
    flush();
    return;
  }
  // Real script not loaded yet — poll until it is, then flush the buffer.
  if (typeof window !== 'undefined' && !pollTimer) pollTimer = setInterval(flush, 200);
}

/**
 * Fire an aggregate funnel event. Campaign UTMs (from the current URL) are
 * attached automatically; only allowlisted, non-PII dimensions are ever sent.
 * Events are buffered and delivered once the analytics script is ready, so none
 * are lost to the async-load race.
 */
export function track(event: FunnelEvent, props?: FunnelProps): void {
  if (typeof window === 'undefined') return;
  // Skip the build-time prerender crawler (headless Chromium sets
  // navigator.webdriver) so mount-fired events don't send phantom hits on deploy.
  if (typeof navigator !== 'undefined' && navigator.webdriver) return;
  const clean = sanitizeProps({ ...utmProps(), ...(props || {}) });
  buffer.push({ event, props: Object.keys(clean).length ? clean : undefined });
  scheduleFlush();
}
