// Client error beacon (S8-011 / S8-012): counts error classes per route pattern through
// the existing cookie-free analytics allowlist. Nothing else leaves the browser, and a
// failure here is swallowed; the page never depends on it (monitoring is not a dependency).
import { track } from './analytics';
import { buildReport } from './errorRedact';

const MAX_PER_PAGE = 3;
let sent = 0;

function report(err: unknown): void {
  if (sent >= MAX_PER_PAGE) return;
  sent++;
  try {
    const { kind, route } = buildReport(err, window.location.pathname);
    track('Client Error', { kind, route });
  } catch {
    /* never throw from the error handler */
  }
}

export function installErrorReporting(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (e) => report(e.error ?? e.message));
  window.addEventListener('unhandledrejection', (e) => report(e.reason));
}
