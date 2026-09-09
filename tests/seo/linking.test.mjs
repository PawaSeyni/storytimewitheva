// Sprint 7 S7-019: internal linking and no thin pages, checked on the prerendered dist.
//
//   1. ORPHANS: every indexable route (sitemap) has at least one inbound link from a
//      DIFFERENT prerendered page in the same language. A page nobody links to is a page
//      crawlers reach only through the sitemap and visitors never reach at all.
//   2. THIN PAGES: every indexable route carries real content: at least MIN_WORDS words of
//      visible text inside <main>, or at least two book links (a collection is its books).
//   3. STRUCTURED DATA: collection and journey pages carry valid JSON-LD (ItemList +
//      BreadcrumbList), and every ItemList item URL is a real prerendered route.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://storytimewitheva.com';
// Below MIN_WORDS a page must earn its place another way: two book links (a collection is
// its books) or an interactive tool (a form, an input, a canvas: the content IS the tool).
const MIN_WORDS = 60;

const sitemap = readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].slice(SITE.length)).filter((p) => !p.endsWith('.html'));
const norm = (p) => (p.replace(/\/+$/, '') || '/');
const fileFor = (p) => path.join(DIST, norm(p) === '/' ? 'index.html' : `${norm(p).replace(/^\//, '')}/index.html`);
const langOf = (p) => (/^\/(fr|es)(\/|$)/.exec(p)?.[1] ?? 'en');
const html = new Map(routes.map((p) => [norm(p), existsSync(fileFor(p)) ? readFileSync(fileFor(p), 'utf8') : null]));

const mainText = (h) => {
  const m = /<main[\s\S]*?<\/main>/.exec(h)?.[0] ?? '';
  return m.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
};
const linksOf = (h) => [...h.matchAll(/href="(\/[^"#?]*)/g)].map((m) => norm(m[1]));

test('linking — every indexable route is prerendered', () => {
  for (const [p, h] of html) assert.ok(h, `${p}: not prerendered`);
});

test('linking — no orphan: every indexable route has an inbound link from another page in its language', () => {
  const inbound = new Map([...html.keys()].map((p) => [p, 0]));
  for (const [from, h] of html) {
    if (!h) continue;
    for (const to of new Set(linksOf(h))) if (to !== from && inbound.has(to) && langOf(to) === langOf(from)) inbound.set(to, inbound.get(to) + 1);
  }
  const orphans = [...inbound].filter(([, n]) => n === 0).map(([p]) => p);
  assert.deepEqual(orphans, [], `orphan routes (in the sitemap, linked from nowhere):\n  ${orphans.join('\n  ')}`);
});

test('linking — no thin page: every indexable route has real content in <main>', () => {
  const thin = [];
  for (const [p, h] of html) {
    if (!h) continue;
    const words = mainText(h).split(' ').filter((w) => w.length > 1).length;
    const bookLinks = new Set(linksOf(h).filter((l) => /\/books\/[a-z0-9-]+$/.test(l))).size;
    const main = /<main[\s\S]*?<\/main>/.exec(h)?.[0] ?? '';
    // Word Explorer is 44 words and twelve controls: a flashcard tool, not a thin page.
    const interactive = /<(form|input|textarea|canvas|select)\b/.test(main) || (main.match(/<button\b/g) ?? []).length >= 6;
    if (words < MIN_WORDS && bookLinks < 2 && !interactive) thin.push(`${p} (${words} words, ${bookLinks} book links)`);
  }
  assert.deepEqual(thin, [], `thin pages:\n  ${thin.join('\n  ')}`);
});

test('structured data — collections and journeys carry ItemList + BreadcrumbList whose URLs are real routes', () => {
  const pages = [...html].filter(([p]) => /\/(collections|journeys)\/[a-z0-9-]+$/.test(p));
  assert.ok(pages.length >= 20);
  for (const [p, h] of pages) {
    const blocks = [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const flat = blocks.flat();
    const types = flat.map((b) => b['@type']);
    assert.ok(types.includes('BreadcrumbList'), `${p}: no BreadcrumbList`);
    // Collections are a CollectionPage whose mainEntity is the ItemList; journeys are an ItemList.
    const lists = flat.flatMap((b) => (b['@type'] === 'ItemList' ? [b] : b.mainEntity?.['@type'] === 'ItemList' ? [b.mainEntity] : []));
    if (p.includes('/collections/')) {
      // A closed seasonal collection omits its (empty) ItemList by design.
      const isEmpty = h.includes('data-testid="seasonal-empty"');
      if (!isEmpty) assert.ok(lists.length > 0, `${p}: no ItemList`);
    } else assert.ok(lists.length > 0, `${p}: no ItemList`);
    for (const b of [...flat, ...lists]) {
      for (const item of b.itemListElement ?? []) {
        const url = item.url ?? item.item;
        if (typeof url === 'string' && url.startsWith(SITE)) {
          const route = norm(url.slice(SITE.length));
          assert.ok(html.has(route) || existsSync(fileFor(route)), `${p}: ItemList URL ${url} is not a prerendered route`);
        }
      }
    }
  }
});
