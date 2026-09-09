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
const TAXONOMY = path.join(ROOT, 'src', 'data', 'taxonomy.ts');
const CONTENT_INDEX = path.join(ROOT, 'src', 'data', 'contentIndex.ts');
const RESOURCES = path.join(ROOT, 'src', 'data', 'resources.ts');
const RELATED = path.join(ROOT, 'src', 'data', 'relatedBooks.ts');
const ACTIVITIES = path.join(ROOT, 'src', 'data', 'activities.data.ts');
const JOURNEY = path.join(ROOT, 'src', 'lib', 'journey.ts');
const JOURNEYS = path.join(ROOT, 'src', 'data', 'journeys.ts');

/** Compile a browser-free TS module with esbuild and evaluate it in-process. */
async function loadModule(entry) {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    write: false,
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}

let taxonomyCache = null;
/** The taxonomy registries (themes, age bands, derivation helpers). */
export async function loadTaxonomy() {
  if (!taxonomyCache) taxonomyCache = await loadModule(TAXONOMY);
  return taxonomyCache;
}

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

let indexCache = null;
/** Derived reverse indexes + collection counts (never persisted in source). */
export async function loadContentIndex() {
  if (!indexCache) indexCache = await loadModule(CONTENT_INDEX);
  return indexCache;
}

let resourcesCache = null;
/** The parent/educator resource registry (stable, kind-prefixed IDs). */
export async function loadResources() {
  if (!resourcesCache) resourcesCache = await loadModule(RESOURCES);
  return resourcesCache;
}

let relatedCache = null;
/** The "You might also like" ranking the UI renders (editorial tier + theme top-up). */
export async function loadRelatedBooks() {
  if (!relatedCache) relatedCache = await loadModule(RELATED);
  return relatedCache;
}

let activitiesCache = null;
/** The activities/games registry (browser-free), for relatedActivityIds validation. */
export async function loadActivities() {
  if (!activitiesCache) activitiesCache = await loadModule(ACTIVITIES);
  return activitiesCache;
}

let journeyCache = null;
/** The continue-the-journey resolver (S4-010), so build scripts use the SAME rule the app does. */
export async function loadJourney() {
  if (!journeyCache) journeyCache = await loadModule(JOURNEY);
  return journeyCache;
}

let journeysCache = null;
/** The reading-journey content records (S7-003), browser-free. */
export async function loadJourneys() {
  if (!journeysCache) journeysCache = await loadModule(JOURNEYS);
  return journeysCache;
}
