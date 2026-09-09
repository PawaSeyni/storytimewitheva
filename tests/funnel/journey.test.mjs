// Continue-the-journey resolution (Sprint 4 S4-010 / S4-011).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { loadCatalog, loadActivities, loadResources, loadContentIndex } from '../../scripts/lib/catalog.mjs';

const bundle = await build({ entryPoints: ['src/lib/journey.ts'], bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent' });
const { nextStep } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const { books } = await loadCatalog();
const { activities } = await loadActivities();
const { resources } = await loadResources();
const idx = await loadContentIndex();
const bookIds = new Set(books.map((b) => b.id));
const slugs = new Set(activities.map((a) => a.slug));
const resIds = new Set(resources.map((r) => r.id));

test('journey — every book resolves to a valid, non-broken next step', () => {
  for (const b of books) {
    const s = nextStep('book', b.id);
    assert.ok(s, `${b.id}: no step`);
    if (s.type === 'book') assert.ok(bookIds.has(s.id));
    if (s.type === 'activity') assert.ok(slugs.has(s.id));
    if (s.type === 'resource') assert.ok(resIds.has(s.id));
    assert.match(s.href, /^\/(books|activities|resources|free|games)/, `${b.id}: odd href ${s.href}`);
  }
});

test('journey — priority order is activity, then book, then resource, then catalog', () => {
  for (const b of books) {
    const s = nextStep('book', b.id);
    const hasAct = (b.relatedActivityIds ?? []).some((x) => slugs.has(x));
    const hasBook = (b.relatedBookIds ?? []).some((x) => bookIds.has(x));
    const hasRes = (b.relatedResourceIds ?? []).some((x) => resIds.has(x));
    const expected = hasAct ? 'related-activity' : hasBook ? 'related-book' : hasRes ? 'related-resource' : 'fallback';
    assert.equal(s.reason, expected, `${b.id}: expected ${expected}, got ${s.reason}`);
  }
});

test('journey — an activity continues to the first book that references it (S4-011)', () => {
  let covered = 0;
  for (const a of activities) {
    const s = nextStep('activity', a.slug);
    assert.ok(s, `${a.slug}: no step`);
    const referrers = idx.booksByActivityId[a.slug] ?? [];
    if (referrers.length) {
      covered++;
      assert.equal(s.type, 'book');
      assert.equal(s.id, referrers[0], `${a.slug}: should continue to its first referrer`);
    } else {
      assert.equal(s.type, 'catalog', `${a.slug}: unreferenced activity should fall back to the catalog`);
    }
  }
  assert.ok(covered >= 10, `expected most activities to be referenced by a book, got ${covered}`);
});

test('journey — games resolve to /games/ paths and are flagged, demos to /activities/', () => {
  for (const b of books) {
    const s = nextStep('book', b.id);
    if (s.type !== 'activity') continue;
    const a = activities.find((x) => x.slug === s.id);
    if (a.game) { assert.equal(s.href, `/games/${s.id}.html`); assert.equal(s.game, true); }
    else { assert.equal(s.href, `/activities/${s.id}`); assert.ok(!s.game); }
  }
});

test('journey — unknown sources return null, never a fabricated link', () => {
  assert.equal(nextStep('book', 'no-such-book'), null);
  assert.equal(nextStep('activity', 'no-such-activity'), null);
  assert.equal(nextStep('resource', 'no-such-resource'), null);
});

test('journey — resources fall back to the catalog honestly (no relationships yet)', () => {
  const s = nextStep('resource', resources[0].id);
  assert.deepEqual(s, { type: 'catalog', href: '/books', reason: 'fallback' });
});

test('journey — deterministic', () => {
  for (const b of books) assert.deepEqual(nextStep('book', b.id), nextStep('book', b.id));
});
