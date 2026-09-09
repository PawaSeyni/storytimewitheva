// Privacy-safe error reporting, the pure half (S8-012). BROWSER-FREE so it is unit-tested.
//
// A client error report carries exactly two dimensions: the error CLASS (TypeError,
// ChunkLoadError, ...) and the ROUTE PATTERN (/books/:id). Never the message (it can quote
// user input or a URL), never the stack, never query strings, never anything from storage.

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

export interface ErrorReport { kind: string; route: string }

export function buildReport(err: unknown, pathname: string): ErrorReport {
  return { kind: redactKind(err), route: redactRoute(pathname) };
}
