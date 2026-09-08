// Relationship + reverse-index validation (taxonomy v1 §6.2/§6.3).
//
// CI must fail when a referenced ID does not exist, a book recommends itself, or the
// same relationship ID appears twice. Reverse indexes are DERIVED, so these tests
// also assert the derivation matches the forward source of truth.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog, loadContentIndex, loadResources } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const idx = await loadContentIndex();
const { resources } = await loadResources();
const resourceIds = new Set(resources.map((r) => r.id));
// Language CODES. Note books.data's ALL_LANGUAGES holds display FLAGS, not codes.
const LANGS = ['en', 'es', 'fr'];
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

test('relationships — every relatedResourceId resolves to a real resource', () => {
  // Resources are modeled now (src/data/resources.ts), so references are checked
  // against the registry instead of being forbidden. A typo fails the build.
  for (const b of books) {
    for (const rid of b.relatedResourceIds ?? []) {
      assert.ok(
        resourceIds.has(rid),
        `${b.id}: relatedResourceIds -> "${rid}" is not a known resource id`,
      );
    }
  }
});

test('resources — ids are globally unique and kind-prefixed', () => {
  // IDs must be unique ACROSS kinds: the download slug "follow-up-activities" and
  // the article anchor "follow-up-activities" collide, and relatedResourceIds is a
  // flat string array, so an unprefixed scheme would resolve to the wrong resource.
  assert.equal(resourceIds.size, resources.length, 'duplicate resource id');
  for (const r of resources) {
    assert.ok(['article', 'download'].includes(r.kind), `${r.id}: unknown kind`);
    assert.ok(r.id.startsWith(`${r.kind}-`), `${r.id}: id must be prefixed with its kind`);
    assert.ok(r.slug && !r.slug.includes('/'), `${r.id}: slug must be a bare token`);
  }
  // The collision the prefix scheme exists to prevent, asserted directly.
  const slugs = resources.map((r) => r.slug);
  assert.ok(
    slugs.filter((s) => s === 'follow-up-activities').length === 2,
    'expected the article/download slug collision to still exist (that is why ids are prefixed)',
  );
});

test('resources — every resource is complete in EN, FR and ES', () => {
  for (const r of resources) {
    for (const lang of LANGS) {
      assert.ok(r.title?.[lang]?.trim(), `${r.id}: missing ${lang} title`);
      assert.ok(r.description?.[lang]?.trim(), `${r.id}: missing ${lang} description`);
    }
  }
});

test('resources — articles carry reading time and card metadata, downloads do not', () => {
  for (const r of resources.filter((x) => x.kind === 'article')) {
    assert.ok(Number.isInteger(r.minutes) && r.minutes > 0, `${r.id}: missing minutes`);
    assert.ok(r.categoryKey, `${r.id}: missing categoryKey`);
  }
  for (const r of resources.filter((x) => x.kind === 'download')) {
    assert.equal(r.minutes, undefined, `${r.id}: downloads have no reading time`);
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

test('discussionQuestions — well-formed and complete in EN, FR and ES where present', () => {
  // Prompts are editorial: an absent or empty array is valid. What is NOT valid is a
  // half-populated one — a prompt that exists in English but not French would ship a
  // blank line on the FR book page.
  const STAGES = ['before', 'during', 'after'];
  for (const b of books) {
    const qs = b.discussionQuestions;
    if (qs === undefined) continue;
    assert.ok(Array.isArray(qs), `${b.id}: discussionQuestions must be an array`);
    qs.forEach((q, i) => {
      assert.ok(STAGES.includes(q.stage), `${b.id}[${i}]: unknown stage "${q.stage}"`);
      for (const lang of LANGS) {
        assert.ok(q.prompt?.[lang]?.trim(), `${b.id}[${i}]: missing ${lang} prompt`);
      }
    });
    const seen = qs.map((q) => q.prompt.en.trim().toLowerCase());
    assert.equal(new Set(seen).size, seen.length, `${b.id}: duplicate discussion prompt`);
  }
});

test('relationships — no book is left without an INCOMING link (B-01)', () => {
  // A book nothing links TO is reachable only from search, /books and its collections.
  // That gap was invisible until someone looked for it, so it is a guard now: adding a
  // book, or re-cutting the pairs, fails loudly instead of silently orphaning a title.
  for (const b of books) {
    assert.ok(
      (idx.incomingRelatedBookIds[b.id] ?? []).length > 0,
      `${b.id}: no other book links to it — add it to one book's relatedBookIds`,
    );
  }
});
