// Guards for browser APIs that embedded and older browsers ship partially (the Pinterest and
// other in-app WebViews, Android System WebView, private modes). BROWSER-FREE: every helper
// takes the object it inspects, so tests/funnel/compat.test.mjs runs them under node.

type Listener = (event?: unknown) => void;

/**
 * Subscribe to an event on an object that may not be a full EventTarget. Some WebViews
 * expose `speechSynthesis` without addEventListener, and calling it at module load threw
 * "TypeError: window.speechSynthesis.addEventListener is not a function" before React could
 * render. Falls back to the `on<type>` property, then to nothing. Never throws; returns
 * whether a listener was attached.
 */
export function listen(target: unknown, type: string, fn: Listener): boolean {
  if (!target || (typeof target !== 'object' && typeof target !== 'function')) return false;
  const t = target as { addEventListener?: unknown } & Record<string, unknown>;
  try {
    if (typeof t.addEventListener === 'function') {
      (t.addEventListener as (type: string, fn: Listener) => void)(type, fn);
      return true;
    }
    if (`on${type}` in t) {
      t[`on${type}`] = fn;
      return true;
    }
  } catch {
    /* a host object that refuses the listener: degrade to "not notified" */
  }
  return false;
}

/**
 * A failed code-split chunk import. Every engine words it differently and all of them
 * (except Firefox) throw a TypeError:
 *   Chrome / Android WebView  TypeError: Failed to fetch dynamically imported module: <url>
 *   Safari / iOS WebViews     TypeError: Importing a module script failed.
 *   Firefox                   TypeError: error loading dynamically imported module: <url>
 *   Vite preload helper       Error: Unable to preload CSS for <url>
 * It happens after a deploy (the page's old hashed chunks are gone) or on a dropped
 * connection, and with no error boundary it blanks the page.
 */
export function isChunkLoadError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { name?: unknown; message?: unknown };
  if (e.name === 'ChunkLoadError') return true;
  const msg = typeof e.message === 'string' ? e.message : '';
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(msg);
}

/** Minimum gap between two chunk-recovery reloads, so a chunk that is really gone cannot loop. */
export const CHUNK_RELOAD_GAP_MS = 5 * 60 * 1000;

/** Whether to reload for a chunk error, given when the last such reload happened (ms epoch). */
export function shouldReloadForChunkError(lastReloadAt: number | null, now: number): boolean {
  if (lastReloadAt === null || !Number.isFinite(lastReloadAt)) return true;
  return now - lastReloadAt > CHUNK_RELOAD_GAP_MS || now < lastReloadAt;
}
