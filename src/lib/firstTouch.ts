// First-touch campaign tags (2026-11-18). BROWSER-FREE: storage and the query string are
// passed in, so tests can run it in Node.
//
// The bug this fixes: EmailSignup only read utm_* from the URL of the page the form is on.
// A visitor who lands from a pin on /fr/free/bilingual-flashcards/?utm_content=P-111, clicks
// through to another page and signs up there was recorded with no source at all.
//
// The fix: when the site first loads, the visit's utm_* tags are saved in sessionStorage
// (browser storage that is cleared when the tab closes; no cookie, nothing sent anywhere).
// The signup form uses its own page's tags when it has any, and otherwise falls back to
// these. The first set of tags in a tab wins: a later page with different tags does not
// overwrite them, so a signup is credited to the post that brought the visitor in.

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;
export const FIRST_TOUCH_KEY = 'ste:first-touch-utm:v1';
const MAX_LEN = 120;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;
type SessionLike = Pick<Storage, 'getItem' | 'setItem'>;

/** The utm_* tags in a query string ("?a=b&..."), trimmed to 120 characters each. */
export function utmFromSearch(search: string): Utm {
  const out: Utm = {};
  let params: URLSearchParams;
  try { params = new URLSearchParams(search); } catch { return out; }
  for (const k of UTM_KEYS) {
    const v = params.get(k)?.trim();
    if (v) out[k] = v.slice(0, MAX_LEN);
  }
  return out;
}

/** Only the four known keys, only non-empty strings, trimmed: what comes back out of storage. */
function clean(value: unknown): Utm {
  const out: Utm = {};
  if (!value || typeof value !== 'object') return out;
  for (const k of UTM_KEYS) {
    const v = (value as Record<string, unknown>)[k];
    if (typeof v === 'string' && v.trim()) out[k] = v.trim().slice(0, MAX_LEN);
  }
  return out;
}

const isEmpty = (u: Utm) => Object.keys(u).length === 0;

/** Read the saved first-touch tags. Never throws (blocked storage, bad JSON: empty). */
export function readFirstTouch(storage: SessionLike | null | undefined): Utm {
  if (!storage) return {};
  try {
    const raw = storage.getItem(FIRST_TOUCH_KEY);
    return raw ? clean(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}

/**
 * Called once when the site loads. Saves this page's tags if it has any and nothing is
 * saved yet in this tab. Returns what is saved afterwards. Never throws.
 */
export function captureFirstTouch(storage: SessionLike | null | undefined, search: string): Utm {
  const current = utmFromSearch(search);
  if (!storage) return current;
  const saved = readFirstTouch(storage);
  if (!isEmpty(saved) || isEmpty(current)) return isEmpty(saved) ? current : saved;
  try { storage.setItem(FIRST_TOUCH_KEY, JSON.stringify(current)); } catch { /* storage full or blocked */ }
  return current;
}

/** The tags a signup should carry: this page's own if it has any, else the first touch. */
export function resolveSignupUtm(search: string, storage: SessionLike | null | undefined): Utm {
  const current = utmFromSearch(search);
  return isEmpty(current) ? readFirstTouch(storage) : current;
}

/** window.sessionStorage, or null where reading it throws (some privacy modes, sandboxed frames). */
export function sessionStore(): SessionLike | null {
  try {
    return typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : null;
  } catch {
    return null;
  }
}
