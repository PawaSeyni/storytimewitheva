// Relationship + reverse-index validation (taxonomy v1 §6.2/§6.3).
//
// CI must fail when a referenced ID does not exist, a book recommends itself, or the
// same relationship ID appears twice. Reverse indexes are DERIVED, so these tests
// also assert the derivation matches the forward source of truth.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog, loadContentIndex } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const idx = await loadContentIndex();
const bookIdSet = new Set(books.map((b) => b.id));

test('relationships — relatedBookIds resolve, are unique, and never self-reference', () => {
  for (const b of books) {
    const rel = b.relatedBookIds ?? [];
    assert.equal(new Set(rel).size, rel.length, `${b.id}: duplicate id in relatedBookIds`);
    for (const target of rel) {
      assert.ok(bookIdSet.has(target), `${b.id}: relatedBookIds -> unknown book "${target}"`);
      assert.notEqual(target, b.id, `${b.id}: recommends itself`);
    }
  }
});

test('relationships — relatedActivityIds are unique (ids, not route slugs)', () => {
  for (const b of books) {
    const rel = b.relatedActivityIds ?? [];
    assert.equal(new Set(rel).size, rel.length, `${b.id}: duplicate id in relatedActivityIds`);
    for (const a of rel) {
      assert.ok(typeof a === 'string' && a.length > 0, `${b.id}: empty relatedActivityId`);
    }
  }
});

test('relationships — relatedResourceIds stays empty until resources are modeled', () => {
  // The field exists so the contract is complete, but there is no resource data model
  // with stable IDs yet. Populating it before that model lands would create references
  // that cannot be validated — fail loudly instead of silently shipping dead links.
  for (const b of books) {
    assert.equal(
      (b.relatedResourceIds ?? []).length,
      0,
      `${b.id}: relatedResourceIds is populated, but resources are not modeled yet — land the resource model (with stable IDs) first`,
    );
  }
});

test('reverse index — booksByThemeId matches the forward themeIds exactly', () => {
  for (const b of books) {
    for (const t of b.themeIds) {
      assert.ok(idx.booksByThemeId[t].includes(b.id), `booksByThemeId[${t}] missing ${b.id}`);
    }
  }
  const forwardPairs = books.flatMap((b) => b.themeIds.map((t) => `${t}:${b.id}`)).sort();
  const reversePairs = Object.entries(idx.booksByThemeId)
    .flatMap(([t, ids]) => ids.map((id) => `${t}:${id}`))
    .sort();
  assert.deepEqual(reversePairs, forwardPairs, 'reverse theme index diverged from forward source');
});

test('reverse index — every book appears in exactly one primary age band', () => {
  const seen = Object.values(idx.booksByPrimaryAgeBand).flat();
  assert.equal(seen.length, books.length, 'a book is missing from or duplicated across age bands');
  assert.equal(new Set(seen).size, books.length, 'a book appears in more than one primary band');
});

test('reverse index — incomingRelatedBookIds is the exact inverse of relatedBookIds', () => {
  const expected = {};
  for (const b of books) for (const target of b.relatedBookIds ?? []) (expected[target] ??= []).push(b.id);
  for (const [target, sources] of Object.entries(expected)) {
    assert.deepEqual(
      [...idx.incomingRelatedBookIds[target]].sort(),
      [...sources].sort(),
      `incomingRelatedBookIds[${target}] diverged from the forward source`,
    );
  }
});

test('collections — eligibility is derived, never below the two-book minimum', () => {
  for (const t of idx.collectionEligibleThemeIds) {
    assert.ok(idx.themeCounts[t] >= 2, `theme "${t}" is collection-eligible with only ${idx.themeCounts[t]} book(s)`);
  }
});
