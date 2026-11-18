// Recover from a failed code-split chunk load by reloading the page once (the browser half
// of lib/compat.ts's isChunkLoadError). Reproduced: blocking the activity chunk on
// /activities/story-builder threw "TypeError: Failed to fetch dynamically imported module",
// was counted as Client Error {kind: TypeError, route: /activities/:id}, and left the page
// blank because nothing catches a rejected route chunk. After a deploy the old hashed chunks
// are gone, so a reload (fresh HTML, fresh chunk names) is the fix, not a retry.
import { isChunkLoadError, shouldReloadForChunkError } from './compat';

const KEY = 'ste:chunk-reload-at';

/** Reload once for a chunk-load error. Returns true when a reload has been started. */
export function recoverFromChunkError(reason: unknown): boolean {
  if (typeof window === 'undefined' || !isChunkLoadError(reason)) return false;
  try {
    // sessionStorage is the loop guard; without it (private mode, WebView policy) never reload.
    const store = window.sessionStorage;
    const raw = store.getItem(KEY);
    const last = raw === null ? null : Number(raw);
    const now = Date.now();
    if (!shouldReloadForChunkError(last, now)) return false;
    store.setItem(KEY, String(now));
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}
