// Taxonomy validation (approved taxonomy v1, 2026-09-08).
//
// Turns taxonomy drift into a failing build: every book's themeIds must exist in
// the registry, every book must resolve to exactly ONE primary age collection, and
// public collection eligibility must respect the two-book minimum. Assertions run
// against the REAL modules through the build-safe projection — no source parsing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog, loadTaxonomy } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const tax = await loadTaxonomy();
const LOCALES = ['en', 'fr', 'es'];

test('taxonomy — every book themeId exists in the registry, 1-3 per book', () => {
  for (const b of books) {
    assert.ok(Array.isArray(b.themeIds), `${b.id}: missing themeIds`);
    assert.ok(
      b.themeIds.length >= 1 && b.themeIds.length <= 3,
      `${b.id}: has ${b.themeIds.length} themes (rule: 1-3)`,
    );
    assert.equal(new Set(b.themeIds).size, b.themeIds.length, `${b.id}: duplicate themeId`);
    for (const t of b.themeIds) {
      assert.ok(tax.isThemeId(t), `${b.id}: unknown themeId "${t}"`);
    }
  }
});

test('taxonomy — every theme + age band has EN/FR/ES labels and descriptions', () => {
  for (const id of tax.THEME_IDS) {
    const d = tax.THEMES[id];
    assert.ok(d, `theme ${id} missing from THEMES registry`);
    for (const l of LOCALES) {
      assert.ok(d.labels?.[l]?.trim(), `theme ${id}: missing ${l} label`);
      assert.ok(d.descriptions?.[l]?.trim(), `theme ${id}: missing ${l} description`);
    }
  }
  for (const id of tax.AGE_BAND_IDS) {
    for (const l of LOCALES) {
      assert.ok(tax.AGE_BANDS[id]?.labels?.[l]?.trim(), `age band ${id}: missing ${l} label`);
    }
  }
});

test('taxonomy — every book resolves to exactly one primary age collection', () => {
  for (const b of books) {
    const band = tax.derivePrimaryAgeBand(b.ageRange);
    assert.ok(
      tax.AGE_BAND_IDS.includes(band),
      `${b.id} (${b.ageRange}): resolved to unknown band "${band}"`,
    );
  }
});

test('taxonomy — exact-age suitability keeps wide-range books discoverable', () => {
  // The rejected any-overlap approach would have hidden a 5-9 book from a parent
  // filtering for age 5. Exact containment must not.
  assert.equal(tax.supportsAge('5-9', 5), true);
  assert.equal(tax.supportsAge('5-9', 9), true);
  assert.equal(tax.supportsAge('5-9', 4), false);
  assert.equal(tax.supportsAge('3-6', 7), false);
});

test('taxonomy — public collection eligibility respects the two-book minimum', () => {
  const counts = {};
  for (const b of books) for (const t of b.themeIds) counts[t] = (counts[t] || 0) + 1;
  const eligible = tax.THEME_IDS.filter((t) => (counts[t] || 0) >= tax.THEME_COLLECTION_MINIMUM);
  const ineligible = tax.THEME_IDS.filter((t) => (counts[t] || 0) < tax.THEME_COLLECTION_MINIMUM);

  // Signed-off decision: honesty + heritage stay valid tags but must NOT generate
  // a public collection route until each has a second book.
  assert.deepEqual(
    ineligible.sort(),
    ['heritage', 'honesty'],
    `collection-ineligible themes changed: ${ineligible.join(', ')} — if a book was added, update the sign-off record`,
  );
  assert.equal(eligible.length, 11, 'expected 11 collection-eligible themes');
});
