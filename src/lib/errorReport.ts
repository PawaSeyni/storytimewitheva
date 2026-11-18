// Client error beacon (S8-011 / S8-012): counts error classes per route pattern through
// the existing cookie-free analytics allowlist, with a redacted message, the script file
// name and line:col so a count can be traced to a cause (see errorRedact.ts for what is
// removed). A failure here is swallowed; the page never depends on it.
import { track } from './analytics';
import { buildReport, type ErrorOrigin } from './errorRedact';

const MAX_PER_PAGE = 3;
let sent = 0;

function report(err: unknown, origin?: ErrorOrigin): void {
  if (sent >= MAX_PER_PAGE) return;
  sent++;
  try {
    const { kind, route, message, source, line } = buildReport(err, window.location.pathname, origin);
    // Absent diagnostics are undefined, and sanitizeProps drops non-primitive values.
    track('Client Error', { kind, route, message, source, line });
  } catch {
    /* never throw from the error handler */
  }
}

export function installErrorReporting(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (e) => report(e.error ?? e.message, { filename: e.filename, lineno: e.lineno, colno: e.colno }));
  window.addEventListener('unhandledrejection', (e) => report(e.reason));
}
