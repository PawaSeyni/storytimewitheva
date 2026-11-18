// Privacy-safe error reporting, the pure half (S8-012). BROWSER-FREE so it is unit-tested.
//
// A client error report carries the error CLASS (TypeError, ChunkLoadError, ...) and the
// ROUTE PATTERN (/books/:id), plus three optional diagnostics: a REDACTED message, the
// script FILE NAME and the line:column it came from. The message is cut to 120 characters
// after every URL, email, double-quoted string, number longer than 4 digits and anything
// after a `?` is removed, so it keeps the shape of the bug ("Cannot read properties of
// undefined (reading 'x')") and drops anything that could quote a visitor or their data.
// Never the stack, never query strings, never anything from storage.

/** Error class name, or a coarse category when the class is missing. */
export function redactKind(err: unknown): string {
  if (err && typeof err === 'object' && 'name' in err && typeof (err as { name: unknown }).name === 'string') {
    const name = (err as { name: string }).name.trim();
    if (/^[A-Za-z]{3,40}$/.test(name)) return name;
  }
  if (typeof err === 'string') return 'StringThrown';
  return 'UnknownError';
}

/** Route pattern for a pathname: language prefix kept, every dynamic segment replaced. */
export function redactRoute(pathname: string): string {
  const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const parts = clean.split('/').filter(Boolean);
  const lang = parts[0] === 'es' || parts[0] === 'fr' ? parts.shift() : null;
  const dynamicAfter = new Set(['books', 'collections', 'journeys', 'free', 'activities']);
  const out: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const prev = parts[i - 1];
    if (prev && dynamicAfter.has(prev)) out.push(':id');
    else if (/^[a-z][a-z0-9-]{0,40}$/.test(parts[i])) out.push(parts[i]);
    else out.push(':x');
  }
  const pattern = '/' + out.join('/');
  return lang ? `/${lang}${pattern === '/' ? '' : pattern}` : pattern;
}

export const MESSAGE_MAX = 120;

/**
 * The error message with everything that could identify a person or quote their data
 * removed, at most MESSAGE_MAX characters. Empty string when there is nothing left.
 */
export function redactMessage(message: unknown): string {
  if (typeof message !== 'string') return '';
  let s = message
    .replace(/\b[a-z][a-z0-9+.-]*:\/\/\S*/gi, '<url>') // https://, chrome-extension://, ...
    .replace(/\bwww\.\S+/gi, '<url>')
    .replace(/[^\s@'"()<>]+@[^\s@'"()<>]+\.[a-z]{2,}/gi, '<email>')
    .replace(/"[^"]*"?/g, '"…"') // JSON.parse and friends quote the raw input in double quotes
    .replace(/\d{5,}/g, '<n>');
  const q = s.indexOf('?');
  if (q !== -1) s = s.slice(0, q);
  s = s.replace(/\s+/g, ' ').trim();
  if (s.length > MESSAGE_MAX) s = s.slice(0, MESSAGE_MAX - 1).trimEnd() + '…';
  return s;
}

/**
 * The script's file name only: no scheme, host, path, query or hash. A location without a
 * script file (an inline script, one injected by an in-app browser, the document itself) is
 * 'page'; no location at all is ''.
 */
export function redactSource(url: unknown): string {
  if (typeof url !== 'string' || !url.trim()) return '';
  const path = url.trim().split(/[?#]/)[0];
  const base = path.replace(/\/+$/, '').split('/').pop() ?? '';
  if (!/\.[cm]?js$/i.test(base)) return 'page';
  const clean = base.replace(/[^A-Za-z0-9._-]/g, '_');
  return clean.length > 60 ? clean.slice(-60) : clean;
}

/** The first "url:line:col" frame of a stack (V8 and JavaScriptCore formats). */
export function topFrame(stack: unknown): { url: string; line: number; col: number } | null {
  if (typeof stack !== 'string') return null;
  const m = /((?:[a-z][a-z0-9+.-]*:\/\/|\/)[^\s()@]*?):(\d+):(\d+)/i.exec(stack);
  return m ? { url: m[1], line: Number(m[2]), col: Number(m[3]) } : null;
}

/** Where the browser says the error came from (an ErrorEvent's filename, lineno, colno). */
export interface ErrorOrigin {
  filename?: string;
  lineno?: number;
  colno?: number;
}

export interface ErrorReport {
  kind: string;
  route: string;
  /** Redacted message, at most MESSAGE_MAX characters. Omitted when empty. */
  message?: string;
  /** Script file name only (index-abc123.js), or 'page'. Omitted when unknown. */
  source?: string;
  /** "line:col" in that file; the bundle is minified, so the column is what locates it. */
  line?: string;
}

const positive = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;

export function buildReport(err: unknown, pathname: string, origin: ErrorOrigin = {}): ErrorReport {
  const report: ErrorReport = { kind: redactKind(err), route: redactRoute(pathname) };
  const raw = typeof err === 'string' ? err : err && typeof err === 'object' && 'message' in err ? (err as { message: unknown }).message : '';
  const message = redactMessage(raw);
  if (message) report.message = message;
  // The stack's top frame is where the error was thrown. An ErrorEvent's filename can be the
  // script that only reported it (React hands uncaught render errors to reportError).
  const frame = err && typeof err === 'object' && 'stack' in err ? topFrame((err as { stack: unknown }).stack) : null;
  const source = redactSource(frame ? frame.url : origin.filename);
  if (source) report.source = source;
  const line = frame ? frame.line : origin.lineno;
  const col = frame ? frame.col : origin.colno;
  if (positive(line)) report.line = positive(col) ? `${line}:${col}` : String(line);
  return report;
}
