// "You might also like" ranking (Sprint 6 / backlog B-04).
//
// The UI imports the same module these tests load through the projection, so a rule
// asserted here is a rule the rendered page obeys.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog, loadRelatedBooks } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const { relatedBooksFor, RELATED_BOOKS_LIMIT } = await loadRelatedBooks();
const byId = new Map(books.map((b) => [b.id, b]));

test('related books — never self-reference, never duplicate, never exceed the limit', () => {
  for (const b of books) {
    const rel = relatedBooksFor(b.id);
    assert.ok(rel.length <= RELATED_BOOKS_LIMIT, `${b.id}: ${rel.length} > limit`);
    const ids = rel.map((r) => r.id);
    assert.equal(new Set(ids).size, ids.length, `${b.id}: duplicate recommendation`);
    assert.ok(!ids.includes(b.id), `${b.id}: recommends itself`);
    for (const id of ids) assert.ok(byId.has(id), `${b.id}: recommends unknown book "${id}"`);
  }
});

test('related books — the editorial tier always comes first and is never reordered', () => {
  // Sprint 6 ranks "editorial relation" above "matched theme". A theme match must never
  // displace or reorder a signed-off pair, only fill seats it left empty.
  for (const b of books) {
    const rel = relatedBooksFor(b.id);
    const tiers = rel.map((r) => r.tier);
    const firstTheme = tiers.indexOf('theme');
    if (firstTheme !== -1) {
      assert.ok(!tiers.slice(firstTheme).includes('editorial'), `${b.id}: editorial pick after a theme pick`);
    }
    const editorial = rel.filter((r) => r.tier === 'editorial').map((r) => r.id);
    const expected = (b.relatedBookIds ?? []).filter((id) => byId.has(id)).slice(0, RELATED_BOOKS_LIMIT);
    assert.deepEqual(editorial, expected, `${b.id}: editorial order changed`);
  }
});

test('related books — the theme tier only ever adds books that share a theme', () => {
  // The owner rejected age-band-only matches as filler catalog-wide. A book with too
  // few thematic neighbours must return a SHORT list, not a padded one.
  for (const b of books) {
    for (const r of relatedBooksFor(b.id)) {
      if (r.tier !== 'theme') continue;
      const shared = byId.get(r.id).themeIds.filter((t) => b.themeIds.includes(t));
      assert.ok(shared.length > 0, `${b.id}: theme top-up "${r.id}" shares no theme`);
    }
  }
});

test('related books — every book has at least one recommendation to render', () => {
  // Guards the empty-section failure mode: a heading with nothing under it.
  for (const b of books) {
    assert.ok(relatedBooksFor(b.id).length > 0, `${b.id}: no recommendations at all`);
  }
});

test('related books — ranking is deterministic', () => {
  for (const b of books) {
    assert.deepEqual(relatedBooksFor(b.id), relatedBooksFor(b.id), `${b.id}: unstable ranking`);
  }
});
