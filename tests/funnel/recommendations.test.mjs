// Deterministic recommendation engine (Sprint 6 S6-007).
//
// The engine answers "how do these books relate, and why". Policy (how many, which tiers
// a surface allows) lives elsewhere, so these tests are about ranking and explanations.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog, loadRelatedBooks } from '../../scripts/lib/catalog.mjs';
import { build } from 'esbuild';

const bundle = await build({
  entryPoints: ['src/lib/recommendations.ts'],
  bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent',
});
const { recommend, catalogFallback, hasEnoughContext, REASON_ORDER } =
  await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);

const { books } = await loadCatalog();
const { relatedBooksFor } = await loadRelatedBooks();
const byId = new Map(books.map((b) => [b.id, b]));

test('recommendations — deterministic for the same context', () => {
  const ctx = { sourceBookIds: ['cloud-collector'], limit: 5 };
  assert.deepEqual(recommend(ctx), recommend(ctx));
});

test('recommendations — never returns the seed, an exclusion, or an unknown book', () => {
  for (const b of books) {
    const out = recommend({ sourceBookIds: [b.id], limit: 20 });
    for (const r of out) {
      assert.notEqual(r.bookId, b.id, `${b.id}: recommended itself`);
      assert.ok(byId.has(r.bookId), `unknown book "${r.bookId}"`);
    }
  }
  const excluded = recommend({ sourceBookIds: ['cloud-collector'], excludeIds: ['little-mapmaker'], limit: 20 });
  assert.ok(!excluded.some((r) => r.bookId === 'little-mapmaker'), 'exclusion honored');
});

test('recommendations — an editorial match always outranks a theme-only match', () => {
  // Sprint 6 §6 ranks the tiers. If weights ever collapse, curation silently loses.
  for (const b of books) {
    const out = recommend({ sourceBookIds: [b.id], limit: 20 });
    const lastEditorial = out.map((r) => r.reasons.includes('editorial')).lastIndexOf(true);
    const firstThemeOnly = out.findIndex(
      (r) => r.reasons.includes('theme') && !r.reasons.includes('editorial') && !r.reasons.includes('related'),
    );
    if (lastEditorial !== -1 && firstThemeOnly !== -1) {
      assert.ok(lastEditorial < firstThemeOnly, `${b.id}: a theme-only match outranked an editorial one`);
    }
  }
});

test('recommendations — reasons are ordered strongest first and are all valid', () => {
  const out = recommend({ sourceBookIds: ['crooked-little-apple-tree'], themeIds: ['kindness'], limit: 20 });
  assert.ok(out.length > 0);
  for (const r of out) {
    assert.ok(r.reasons.length > 0, `${r.bookId}: no reason given`);
    for (const reason of r.reasons) assert.ok(REASON_ORDER.includes(reason), `bad reason ${reason}`);
    const idx = r.reasons.map((x) => REASON_ORDER.indexOf(x));
    assert.deepEqual(idx, [...idx].sort((a, b) => a - b), `${r.bookId}: reasons out of order`);
  }
});

test('recommendations — the reverse relation is a distinct signal from relatedBookIds', () => {
  // "related" means books that link TO the seed. butterfly-effect links to
  // sparrow-saved-forest, so sparrow's recommendations should cite it.
  const out = recommend({ sourceBookIds: ['sparrow-saved-forest'], limit: 20 });
  const incoming = out.filter((r) => r.reasons.includes('related')).map((r) => r.bookId);
  assert.ok(incoming.includes('butterfly-effect'), `expected butterfly-effect via the reverse relation, got ${incoming}`);
});

test('recommendations — allowReasons lets a surface enforce its own policy', () => {
  const themeOnly = recommend({ sourceBookIds: ['cloud-collector'], allowReasons: ['theme'], limit: 20 });
  for (const r of themeOnly) assert.deepEqual(r.reasons, ['theme'], 'no other tier may leak in');
  assert.deepEqual(recommend({ sourceBookIds: ['cloud-collector'], allowReasons: [], limit: 5 }), []);
});

test('recommendations — preferences alone can drive a list with no seed book', () => {
  const out = recommend({ themeIds: ['kindness'], limit: 5 });
  assert.ok(out.length > 0, 'preferences must be usable on their own');
  for (const r of out) {
    assert.ok(byId.get(r.bookId).themeIds.includes('kindness'), `${r.bookId} does not carry the preferred theme`);
  }
});

test('recommendations — favorites count as seeds', () => {
  const out = recommend({ favoriteBookIds: ['crooked-little-apple-tree'], limit: 5 });
  assert.ok(out.length > 0);
  assert.ok(!out.some((r) => r.bookId === 'crooked-little-apple-tree'), 'a favorite is not recommended back');
});

test('recommendations — the book-page policy still matches the approved output exactly', () => {
  // relatedBooksFor is now a POLICY over this engine. The owner-approved behaviour is
  // editorial first, theme top-up, and NEVER age filler; this proves the refactor did
  // not widen it.
  let editorial = 0;
  let theme = 0;
  for (const b of books) {
    const out = relatedBooksFor(b.id);
    assert.ok(out.length <= 3, `${b.id}: more than 3`);
    const expectedEditorial = (b.relatedBookIds ?? []).slice(0, 3);
    assert.deepEqual(
      out.filter((r) => r.tier === 'editorial').map((r) => r.id),
      expectedEditorial,
      `${b.id}: editorial picks changed`,
    );
    for (const r of out) {
      assert.ok(['editorial', 'theme'].includes(r.tier), `${b.id}: tier "${r.tier}" is not allowed here`);
      if (r.tier === 'theme') {
        const shared = byId.get(r.id).themeIds.filter((t) => b.themeIds.includes(t));
        assert.ok(shared.length > 0, `${b.id}: theme top-up "${r.id}" shares no theme`);
      }
    }
    editorial += out.filter((r) => r.tier === 'editorial').length;
    theme += out.filter((r) => r.tier === 'theme').length;
  }
  assert.equal(editorial, 58, 'editorial slot count changed');
  assert.equal(theme, 0, 'theme top-ups appeared where there were none');
});

test('recommendations — catalog fallback is deterministic and respects exclusions', () => {
  assert.deepEqual(catalogFallback(3), books.slice(0, 3).map((b) => b.id));
  const excl = catalogFallback(3, [books[0].id]);
  assert.ok(!excl.includes(books[0].id));
});

test('recommendations — hasEnoughContext needs two signals, not one stray view', () => {
  assert.equal(hasEnoughContext({}), false);
  assert.equal(hasEnoughContext({ recentBookIds: ['a'] }), false, 'one view is not personalization');
  assert.equal(hasEnoughContext({ recentBookIds: ['a', 'b'] }), true);
  assert.equal(hasEnoughContext({ favoriteBookIds: ['a'], themeIds: ['kindness'] }), true);
});
