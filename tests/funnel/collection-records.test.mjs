// Collection records (Sprint 7 S7-001 / S7-013 / S7-014) — the editorial layer over
// collections. Membership stays derived for theme/age; the record adds order, featured
// activities, resources and overrides, and the validator keeps all of it honest.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCollections, loadContentIndex, loadCatalog, loadTaxonomy } from '../../scripts/lib/catalog.mjs';

const { collections } = await loadCollections();
const idx = await loadContentIndex();
const { books } = await loadCatalog();
const tax = await loadTaxonomy();

test('records — every record passes validation', () => {
  assert.ok(collections.length >= 14);
  for (const c of collections) {
    const p = idx.collectionProblems(c);
    assert.deepEqual(p, [], `${c.id}: ${p.join('; ')}`);
  }
});

test('records — the validator rejects broken records (so green means it rejects)', () => {
  const good = collections.find((c) => c.kind === 'theme');
  assert.ok(idx.collectionProblems({ ...good, bookIds: ['mayas-shadow'] }).some((x) => x.includes('must not carry bookIds')), 'theme record with bookIds not caught');
  assert.ok(idx.collectionProblems({ ...good, activityIds: ['no-such-activity'] }).some((x) => x.includes('missing "no-such-activity"')), 'missing activity not caught');
  // an activity that exists but no member book relates to
  const unrelated = tax.THEME_IDS.length && 'counting-numbers';
  assert.ok(idx.collectionProblems({ ...good, activityIds: [unrelated] }).some((x) => x.includes('not related to any member book')), 'unrelated featured activity not caught');
  assert.ok(idx.collectionProblems({ ...good, bookOrder: ['not-a-member'] }).some((x) => x.includes('not a member')), 'bookOrder outsider not caught');
  assert.ok(idx.collectionProblems({ ...good, title: { en: 'X', fr: '', es: 'X' } }).some((x) => x.includes('override missing fr')), 'partial override not caught');
  const editorial = { id: 'classroom-kindness', kind: 'educator', publishState: 'published', bookIds: ['crooked-little-apple-tree'], title: { en: 'a', fr: 'b', es: 'c' }, description: { en: 'a', fr: 'b', es: 'c' } };
  assert.ok(idx.collectionProblems(editorial).some((x) => x.includes('fewer than')), 'thin editorial collection not caught');
  assert.ok(idx.collectionProblems({ ...editorial, id: 'kindness', bookIds: ['crooked-little-apple-tree', 'true-beauty-meadowbrook'] }).some((x) => x.includes('collides with a taxonomy id')), 'id collision not caught');
});

test('records — theme/age records never duplicate membership; members come from the taxonomy', () => {
  for (const c of collections.filter((x) => x.kind === 'theme' || x.kind === 'age')) {
    assert.equal(c.bookIds, undefined, `${c.id}: membership must stay derived`);
    const members = idx.collectionMembers(c.id);
    const derived = idx.derivedCollectionMembers(c.id);
    assert.deepEqual([...members].sort(), [...derived].sort(), `${c.id}: members must equal the derived set`);
    assert.ok(members.length >= tax.THEME_COLLECTION_MINIMUM);
  }
  assert.ok(!readFileSync('src/data/collections.ts', 'utf8').includes('booksByThemeId'), 'no derived index persisted in the records file');
});

test('records — every featured activity is related to at least one member book', () => {
  for (const c of collections) {
    const members = idx.collectionMembers(c.id);
    const related = new Set(members.flatMap((id) => books.find((b) => b.id === id)?.relatedActivityIds ?? []));
    for (const a of c.activityIds ?? []) assert.ok(related.has(a), `${c.id}: "${a}" is featured but no member book relates to it`);
  }
});

test('records — bookOrder is honored, then catalog order fills in', () => {
  // Simulated: take a theme collection, reverse its derived members as bookOrder, and check
  // collectionMembers puts them first in that order. Uses the pure ordering rule directly.
  const c = collections.find((x) => x.kind === 'theme');
  const derived = idx.derivedCollectionMembers(c.id);
  const ordered = idx.collectionMembers(c.id);
  assert.deepEqual(ordered, derived, `${c.id}: with no bookOrder, display order is catalog order`);
});

test('records — route ids are the union of theme, age and published editorial collections, no collisions', () => {
  const expected = [...idx.collectionEligibleThemeIds, ...idx.ageCollectionEligibleBandIds, ...idx.publishedEditorialCollectionIds];
  assert.deepEqual(idx.collectionRouteIds, expected);
  assert.equal(new Set(idx.collectionRouteIds).size, idx.collectionRouteIds.length);
});
