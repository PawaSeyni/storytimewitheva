// Accessibility + localization regression suite for the prerendered output
// (taxonomy v1 step 10). Runs against dist/ after the production build, alongside
// the SEO suite, so a regression fails CI rather than reaching production.
//
// It caught a real defect when the collection pages shipped: the book grid had no
// heading, so the outline skipped h1 -> h3 (BookCard titles are h3) on all 33 pages,
// a WCAG 1.3.1 failure.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog, loadContentIndex, loadRelatedBooks, loadActivities } from '../../scripts/lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const { collectionEligibleThemeIds } = await loadContentIndex();
const { books } = await loadCatalog();
const { relatedBooksFor } = await loadRelatedBooks();
const { activities } = await loadActivities();
const LOCALES = { en: '', fr: '/fr', es: '/es' };

/** English-only UI strings that must never appear on a localized collection page. */
const EN_ONLY = ['Browse other themes', 'in this collection', 'Books in this collection'];

const pages = [];
for (const [loc, prefix] of Object.entries(LOCALES)) {
  for (const id of collectionEligibleThemeIds) pages.push({ route: `${prefix}/collections/${id}`, loc });
  for (const b of books) pages.push({ route: `${prefix}/books/${b.id}`, loc });
  pages.push({ route: `${prefix}/books`, loc });
  pages.push({ route: prefix || '/', loc });
}

const read = (route) => {
  const f = path.join(DIST, route.replace(/^\//, ''), 'index.html');
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
};

test('a11y — every prerendered page has exactly one non-empty <h1>', () => {
  for (const { route } of pages) {
    const h = read(route);
    assert.ok(h, `${route}: not prerendered`);
    const h1s = [...h.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)];
    assert.equal(h1s.length, 1, `${route}: expected exactly one <h1>, found ${h1s.length}`);
    assert.ok(h1s[0][1].replace(/<[^>]*>/g, '').trim(), `${route}: <h1> is empty`);
  }
});

test('a11y — heading levels never skip (WCAG 1.3.1)', () => {
  for (const { route } of pages) {
    const h = read(route);
    const levels = [...h.matchAll(/<h([1-6])[^>]*>/g)].map((m) => +m[1]);
    let prev = 0;
    for (const l of levels) {
      assert.ok(!(prev && l > prev + 1), `${route}: heading level skip h${prev} -> h${l}`);
      prev = l;
    }
  }
});

test('a11y — every image has an alt attribute', () => {
  for (const { route } of pages) {
    const missing = [...read(route).matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)];
    assert.equal(missing.length, 0, `${route}: ${missing.length} <img> without alt`);
  }
});

test('a11y — collection pages expose semantic breadcrumbs', () => {
  for (const { route } of pages.filter((p) => p.route.includes('/collections/'))) {
    const h = read(route);
    assert.match(h, /<nav[^>]*aria-label="Breadcrumb"/, `${route}: breadcrumb nav missing aria-label`);
    assert.match(h, /aria-current="page"/, `${route}: breadcrumb missing aria-current="page"`);
  }
});

test('i18n — html lang matches the locale on every prerendered page', () => {
  for (const { route, loc } of pages) {
    const lang = read(route).match(/<html[^>]*\blang="([^"]+)"/)?.[1];
    assert.equal(lang, loc, `${route}: html lang="${lang}", expected "${loc}"`);
  }
});

test('i18n — no English UI copy leaks onto FR/ES collection pages', () => {
  for (const { route, loc } of pages.filter((p) => p.loc !== 'en' && p.route.includes('/collections/'))) {
    const h = read(route);
    for (const s of EN_ONLY) {
      assert.ok(!h.includes(s), `${route} (${loc}): untranslated English string "${s}"`);
    }
  }
});

test('a11y — the related-books section carries an h2 above the h3 card titles', () => {
  // Same defect class the collection grid shipped with: BookCard titles are h3, so a
  // section that renders cards under the page h1 with no h2 skips a heading rank.
  for (const b of books) {
    const expected = relatedBooksFor(b.id).length;
    for (const prefix of Object.values(LOCALES)) {
      const route = `${prefix}/books/${b.id}`;
      const h = read(route);
      assert.ok(h, `${route}: not prerendered`);
      const h2s = [...h.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)];
      assert.ok(h2s.length >= 1, `${route}: related-books section has no <h2>`);
      // Every card the ranking promised is actually on the page.
      const links = new Set([...h.matchAll(/href="[^"]*\/books\/([a-z0-9-]+)\/?"/g)].map((m) => m[1]));
      links.delete(b.id);
      assert.ok(links.size >= expected, `${route}: expected >= ${expected} related links, found ${links.size}`);
    }
  }
});

test('a11y — no book page recommends itself in the rendered output', () => {
  for (const b of books) {
    const ids = relatedBooksFor(b.id).map((r) => r.id);
    assert.ok(!ids.includes(b.id), `${b.id}: self-recommendation reached the ranking`);
  }
});

test('a11y — every book page renders its paired activities (B-02)', () => {
  // The pairs were data-only until this section shipped. If the section silently stops
  // rendering, the pairing work becomes invisible again — so assert the real HTML.
  for (const b of books) {
    const slugs = b.relatedActivityIds ?? [];
    if (slugs.length === 0) continue;
    for (const prefix of Object.values(LOCALES)) {
      const h = read(`${prefix}/books/${b.id}`);
      assert.ok(h, `${prefix}/books/${b.id}: not prerendered`);
      for (const slug of slugs) {
        const game = activities.find((a) => a.slug === slug)?.game;
        // Games are standalone static HTML and are deliberately NOT language-prefixed:
        // one shared file serves all three languages, and the language travels in the
        // query string (C6-04) so it survives an arrival with no stored preference.
        const lang = prefix.replace('/', '');
        const href = game
          ? `/games/${slug}.html${lang ? `?lang=${lang}` : ''}`
          : `${prefix}/activities/${slug}`;
        assert.ok(
          h.includes(`href="${href}"`),
          `${prefix}/books/${b.id}: missing activity link ${href}`,
        );
      }
    }
  }
});

test('a11y — activity card titles are h3 under the section h2, not another h2', () => {
  // Activities.tsx uses h2 for its card titles; reusing that level here would put a card
  // title at the same rank as the section heading it belongs to.
  const sample = read('/books/cloud-collector');
  assert.ok(sample, 'book page not prerendered');
  assert.ok(/<h2[^>]*>Try an activity<\/h2>/.test(sample), 'missing the "Try an activity" h2');
  assert.ok(/<h3[^>]*>[^<]*<\/h3>/.test(sample), 'expected h3 card titles on the book page');
});

test('age filters — /books and /activities use the same exact-age model (D-01)', () => {
  // Taxonomy v1 replaced overlap bands with exact-age containment. /books moved first,
  // leaving /activities contradicting it: its "3-5" band surfaced 5-9 activities, so a
  // parent filtering for a 3-year-old was shown a spelling bee. Both pages now agree,
  // and the retired vocabulary must not creep back into either.
  const RETIRED = ['Ages 3-5', 'Ages 6-8', 'Ages 9+', '3-5 años', '6-8 años', '9+ años', '3-5 ans', '6-8 ans', '9+ ans'];
  for (const prefix of Object.values(LOCALES)) {
    for (const page of ['/books', '/activities']) {
      const h = read(`${prefix}${page}`);
      assert.ok(h, `${prefix}${page}: not prerendered`);
      for (const label of RETIRED) {
        assert.ok(!h.includes(`>${label}<`), `${prefix}${page}: retired age band "${label}" is back`);
      }
      for (const age of ['3', '5', '9']) {
        assert.ok(
          new RegExp(`aria-pressed="[a-z]+"[^>]*>${age}<`).test(h) || h.includes(`>${age}</button>`),
          `${prefix}${page}: missing the exact-age chip "${age}"`,
        );
      }
    }
  }
});
