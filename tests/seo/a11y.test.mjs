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
import { loadContentIndex } from '../../scripts/lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const { collectionEligibleThemeIds } = await loadContentIndex();
const LOCALES = { en: '', fr: '/fr', es: '/es' };

/** English-only UI strings that must never appear on a localized collection page. */
const EN_ONLY = ['Browse other themes', 'in this collection', 'Books in this collection'];

const pages = [];
for (const [loc, prefix] of Object.entries(LOCALES)) {
  for (const id of collectionEligibleThemeIds) pages.push({ route: `${prefix}/collections/${id}`, loc });
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
