// Per-route SEO assertions (audit #12). Runs against the PRERENDERED dist/ —
// what crawlers actually receive — so it must run AFTER `npm run build`
// (npm run test:seo, wired into CI after the build step).
//
// Every indexable route (from sitemap.xml) is checked for: a non-empty, UNIQUE
// <title>; meta description; self-referential canonical; the full reciprocal
// hreflang set (en/es/fr/x-default); og:title/description/image; og:locale and
// <html lang> matching the route's language; and that it is NOT noindex.
// JSON-LD is required only where the app emits it (home, books, book detail,
// faq, about) and, wherever present, must be valid JSON.
// Standalone /games/*.html are raw HTML (not React/Seo-managed): title only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://storytimewitheva.com';

function routesFromSitemap() {
  const xml = readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
function distFileFor(loc) {
  const p = loc.slice(SITE.length); // e.g. "/es/books/" or "/games/x.html"
  if (p.endsWith('.html')) return path.join(ROOT, 'dist', p.replace(/^\//, ''));
  return path.join(ROOT, 'dist', p.replace(/^\//, ''), 'index.html');
}
const langOf = (loc) => {
  const p = loc.slice(SITE.length);
  if (p.startsWith('/es/') || p === '/es/') return 'es';
  if (p.startsWith('/fr/') || p === '/fr/') return 'fr';
  return 'en';
};
const enPathOf = (loc) => {
  let p = loc.slice(SITE.length).replace(/\/$/, '') || '/';
  p = p.replace(/^\/(es|fr)(?=\/|$)/, '') || '/';
  return p;
};
const OG_LOCALE = { en: 'en_US', es: 'es_ES', fr: 'fr_FR' };
const JSONLD_PATHS = (p) => p === '/' || p === '/books' || p.startsWith('/books/') || p === '/faq' || p === '/about';

// --- tiny HTML head extractors (dist is machine-generated, but stay tolerant) ---
const titleOf = (h) => (h.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '').trim();
const htmlLang = (h) => h.match(/<html[^>]*\blang="([^"]*)"/)?.[1] ?? '';
function metaContent(h, attr, val) {
  const re = new RegExp(`<meta[^>]*\\b${attr}="${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'i');
  const tag = h.match(re)?.[0];
  return tag ? (tag.match(/\bcontent="([^"]*)"/)?.[1] ?? '') : null;
}
const canonicalOf = (h) => h.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1] ?? null;
const hreflangs = (h) => [...h.matchAll(/<link[^>]*rel="alternate"[^>]*hreflang="([^"]*)"/g)].map((m) => m[1]);
const jsonLdBlocks = (h) => [...h.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

const locs = routesFromSitemap();
const react = locs.filter((l) => !l.endsWith('.html'));
const games = locs.filter((l) => l.endsWith('.html'));

test('dist/ is built (run `npm run build` first)', () => {
  assert.ok(existsSync(path.join(ROOT, 'dist', 'index.html')), 'dist/index.html missing — build before running SEO tests');
  assert.ok(react.length > 20, `expected many indexable routes, got ${react.length}`);
});

const titles = new Map();
for (const loc of react) {
  const enPath = enPathOf(loc);
  const lang = langOf(loc);
  test(`SEO ${loc}`, () => {
    const file = distFileFor(loc);
    assert.ok(existsSync(file), `prerendered file missing: ${file}`);
    const h = readFileSync(file, 'utf8');

    const title = titleOf(h);
    assert.ok(title.length > 0, 'empty <title>');
    titles.set(loc, title);

    assert.ok((metaContent(h, 'name', 'description') || '').length > 0, 'missing meta description');

    const canon = canonicalOf(h);
    assert.equal(canon, loc, `canonical should be self (${loc}), got ${canon}`);

    const hl = new Set(hreflangs(h));
    for (const need of ['en', 'es', 'fr', 'x-default']) assert.ok(hl.has(need), `missing hreflang ${need}`);

    assert.ok((metaContent(h, 'property', 'og:title') || '').length > 0, 'missing og:title');
    assert.ok((metaContent(h, 'property', 'og:description') || '').length > 0, 'missing og:description');
    assert.ok((metaContent(h, 'property', 'og:image') || '').length > 0, 'missing og:image');
    assert.equal(metaContent(h, 'property', 'og:locale'), OG_LOCALE[lang], 'wrong og:locale');

    assert.equal(htmlLang(h), lang, `<html lang> should be ${lang}`);

    const robots = metaContent(h, 'name', 'robots') || '';
    assert.ok(!/noindex/.test(robots), 'indexable route must not be noindex');

    const blocks = jsonLdBlocks(h);
    if (JSONLD_PATHS(enPath)) assert.ok(blocks.length > 0, 'expected JSON-LD on this route');
    for (const b of blocks) assert.doesNotThrow(() => JSON.parse(b), 'invalid JSON-LD');
  });
}

test('indexable React routes have a UNIQUE <title> within each language', () => {
  // Uniqueness is per-language: two different EN pages sharing a title dilutes
  // ranking (a real problem). A title identical across languages (e.g. "Contact"
  // in both EN and FR, where it's the same word) is fine — hreflang disambiguates.
  const byLang = { en: new Map(), es: new Map(), fr: new Map() };
  const dupes = [];
  for (const [loc, t] of titles) {
    const lang = langOf(loc);
    const seen = byLang[lang];
    if (seen.has(t)) dupes.push(`[${lang}] "${t}"  <=  ${seen.get(t)} & ${loc}`);
    else seen.set(t, loc);
  }
  assert.equal(dupes.length, 0, `duplicate titles within a language:\n${dupes.join('\n')}`);
});

for (const loc of games) {
  test(`SEO (game) ${loc} has a title`, () => {
    const file = distFileFor(loc);
    assert.ok(existsSync(file), `game file missing: ${file}`);
    assert.ok(titleOf(readFileSync(file, 'utf8')).length > 0, 'empty <title>');
  });
}
