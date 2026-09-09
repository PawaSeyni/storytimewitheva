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
import { loadTaxonomy, loadContentIndex, loadCatalog } from '../../scripts/lib/catalog.mjs';

const tax = await loadTaxonomy();
const idx = await loadContentIndex();
const { books } = await loadCatalog();
const sitemap = readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8');
const LOCALES = ['en', 'fr', 'es'];

const advertised = [...sitemap.matchAll(/<loc>https:\/\/storytimewitheva\.com\/collections\/([^/<]+)\/<\/loc>/g)]
  .map((m) => m[1]);

test('collections — sitemap advertises exactly the eligible collections (no missing, no extra)', () => {
  // Theme AND age-band collections share the /collections/ namespace (S7-002). The
  // sitemap must advertise exactly their union, from the one list the page also reads.
  const unique = [...new Set(advertised)].sort();
  // S7-012: closed seasonal collections keep their route but leave the sitemap.
  assert.deepEqual(
    unique,
    [...idx.indexableCollectionIds(new Date())].sort(),
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

test('age collections — every band clears the minimum and partitions the catalog (S7-002)', async () => {
  // Primary-fit placement puts each book in exactly ONE band, so the three age pages
  // together cover the catalog with no overlap and no gap.
  const seen = new Map();
  for (const b of idx.ageCollectionEligibleBandIds) {
    const ids = idx.booksByPrimaryAgeBand[b];
    assert.ok(ids.length >= tax.THEME_COLLECTION_MINIMUM, `${b}: below the collection minimum`);
    for (const id of ids) {
      assert.ok(!seen.has(id), `${id} is in both ${seen.get(id)} and ${b}`);
      seen.set(id, b);
    }
  }
  assert.equal(seen.size, books.length, 'every book sits in exactly one age collection');
  assert.deepEqual([...idx.ageCollectionEligibleBandIds].sort(), [...tax.AGE_BAND_IDS].sort(), 'all three bands eligible today');
});

test('age collections — each band has a unique localized intro in EN, FR and ES', async () => {
  // The same gate as themes: a collection without its own intro is a thin page.
  const seen = { en: new Set(), fr: new Set(), es: new Set() };
  for (const b of tax.AGE_BAND_IDS) {
    for (const lang of ['en', 'fr', 'es']) {
      const d = tax.AGE_BANDS[b].descriptions?.[lang]?.trim();
      assert.ok(d && d.length > 40, `${b}: missing or too-short ${lang} intro`);
      assert.ok(!seen[lang].has(d), `${b}: ${lang} intro duplicates another band`);
      seen[lang].add(d);
    }
  }
});

test('collections — theme ids and age-band ids never collide in the route namespace', async () => {
  const themes = new Set(idx.collectionEligibleThemeIds);
  for (const b of idx.ageCollectionEligibleBandIds) assert.ok(!themes.has(b), `${b} is both a theme and a band`);
  assert.equal(new Set(idx.collectionRouteIds).size, idx.collectionRouteIds.length, 'duplicate collection route id');
  for (const id of idx.collectionRouteIds) assert.match(id, /^[a-z0-9-]+$/, `${id}: not a bare route token`);
});
