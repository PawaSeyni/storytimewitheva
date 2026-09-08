// Build-safe catalog projection (Sprint 3 §4, S3-004).
//
// ONE shared source of truth for build scripts: sitemap generation, prerender route
// discovery, validation, and inventory all load the REAL catalog through this module
// instead of regex-parsing TypeScript source. It compiles src/data/books.data.ts
// (a browser-free module — its only import is a type-only `Language`, which is
// erased) with esbuild and evaluates the result in-process.
//
// If this ever fails to load, that is a hard build error: silently falling back to
// source parsing is exactly the drift this replaces.
import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ENTRY = path.join(ROOT, 'src', 'data', 'books.data.ts');

let cached = null;

/** The catalog as real objects: { books, ALL_LANGUAGES }. Cached per process. */
export async function loadCatalog() {
  if (cached) return cached;
  const result = await build({
    entryPoints: [ENTRY],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    write: false,
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  if (!Array.isArray(mod.books) || mod.books.length === 0) {
    throw new Error('catalog projection loaded no books from src/data/books.data.ts');
  }
  cached = { books: mod.books, ALL_LANGUAGES: mod.ALL_LANGUAGES };
  return cached;
}

/** Canonical (unprefixed) public route for every book, e.g. /books/fig-trees-secret. */
export async function bookRoutes() {
  const { books } = await loadCatalog();
  return books.map((b) => `/books/${b.id}`);
}

/** Book ids, in editorial order. */
export async function bookIds() {
  const { books } = await loadCatalog();
  return books.map((b) => b.id);
}
