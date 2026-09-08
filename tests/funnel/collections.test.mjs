// Public theme collection routes (taxonomy v1 §9 + Sprint 3 S3-016 thin-page gate).
//
// A collection route may exist ONLY for a theme that meets the eligibility rule:
// at least two published books AND a unique localized introduction in EN/FR/ES.
// These tests make a thin or unreachable collection a build failure.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './_manifest.mjs';
import { loadTaxonomy, loadContentIndex } from '../../scripts/lib/catalog.mjs';

const tax = await loadTaxonomy();
const idx = await loadContentIndex();
const sitemap = readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8');
const LOCALES = ['en', 'fr', 'es'];

const advertised = [...sitemap.matchAll(/<loc>https:\/\/storytimewitheva\.com\/collections\/([^/<]+)\/<\/loc>/g)]
  .map((m) => m[1]);

test('collections — sitemap advertises exactly the eligible themes (no missing, no extra)', () => {
  const unique = [...new Set(advertised)].sort();
  assert.deepEqual(
    unique,
    [...idx.collectionEligibleThemeIds].sort(),
    'sitemap collections diverged from eligibility — run `npm run gen:sitemap`',
  );
});

test('collections — an ineligible theme NEVER gets a public route (thin-page gate)', () => {
  const ineligible = tax.THEME_IDS.filter((t) => !idx.collectionEligibleThemeIds.includes(t));
  assert.deepEqual(ineligible.sort(), ['heritage', 'honesty'], 'ineligible set changed — re-check the sign-off');
  for (const t of ineligible) {
    assert.ok(
      !advertised.includes(t),
      `theme "${t}" has only ${idx.themeCounts[t]} book(s) but a /collections/${t} route is advertised`,
    );
  }
});

test('collections — every eligible collection has a localized intro in EN/FR/ES', () => {
  // Eligibility rule: "a unique localized introduction" — a route without one would
  // be a thin page in that language.
  for (const id of idx.collectionEligibleThemeIds) {
    for (const l of LOCALES) {
      const intro = tax.THEMES[id]?.descriptions?.[l];
      assert.ok(intro && intro.trim().length >= 40, `collection ${id}: missing/too-short ${l} introduction`);
    }
  }
});

test('collections — every eligible collection has at least two books', () => {
  for (const id of idx.collectionEligibleThemeIds) {
    assert.ok(
      idx.booksByThemeId[id].length >= tax.THEME_COLLECTION_MINIMUM,
      `collection ${id}: only ${idx.booksByThemeId[id].length} book(s)`,
    );
  }
});
