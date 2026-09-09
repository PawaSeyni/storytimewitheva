// Seasonal collections (Sprint 7 S7-012): time-bounded, recurring yearly, existing content.
// Publish-window math is pure with an injectable date, so every boundary is tested here;
// the empty state and the sitemap/noindex behaviour are covered in tests/seo/a11y.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './_manifest.mjs';
import { loadCollections, loadContentIndex } from '../../scripts/lib/catalog.mjs';

const { collections } = await loadCollections();
const idx = await loadContentIndex();
const seasonal = collections.filter((c) => c.kind === 'seasonal');
const D = (s) => new Date(`${s}T12:00:00`);

test('seasonal — three published records, each validated, windowed, with existing books and facets', () => {
  assert.equal(seasonal.length, 3);
  for (const c of seasonal) {
    assert.deepEqual(idx.collectionProblems(c), []);
    assert.ok(c.window && /^\d{2}-\d{2}$/.test(c.window.from) && /^\d{2}-\d{2}$/.test(c.window.to));
    assert.ok(c.bookIds.length >= 2 && c.themeIds.length && c.ageBandIds.length);
    assert.ok(idx.seasonalCollectionIds.includes(c.id) && idx.collectionRouteIds.includes(c.id));
    assert.ok(!idx.educatorCollectionIds.includes(c.id));
    assert.ok(!c.description.en.includes('—') && !c.title.en.includes('—'), `${c.id}: em dash in English copy`);
  }
});

test('seasonal — the validator requires a well-formed window on seasonal records and forbids it elsewhere', () => {
  const good = seasonal[0];
  const has = (rec, needle) => idx.collectionProblems(rec).some((x) => x.includes(needle));
  assert.ok(has({ ...good, window: undefined }, 'need a publish window'));
  assert.ok(has({ ...good, window: { from: '13-01', to: '12-31' } }, 'is not MM-DD'));
  assert.ok(has({ ...good, window: { from: '1-1', to: '12-31' } }, 'is not MM-DD'));
  assert.ok(has({ ...good, window: { from: '06-01', to: '06-01' } }, 'equals'));
  const educator = collections.find((c) => c.kind === 'educator');
  assert.ok(has({ ...educator, window: { from: '01-01', to: '02-01' } }, 'only seasonal'));
});

test('publish window — inclusive bounds, closed outside, and year-end wrap', () => {
  const w = { from: '11-15', to: '01-06' };
  assert.equal(idx.isWindowOpen(w, D('2026-11-14')), false);
  assert.equal(idx.isWindowOpen(w, D('2026-11-15')), true);
  assert.equal(idx.isWindowOpen(w, D('2026-12-25')), true);
  assert.equal(idx.isWindowOpen(w, D('2027-01-06')), true);
  assert.equal(idx.isWindowOpen(w, D('2027-01-07')), false);
  assert.equal(idx.isWindowOpen(w, D('2027-06-01')), false);
  const plain = { from: '08-15', to: '09-30' };
  assert.equal(idx.isWindowOpen(plain, D('2026-08-14')), false);
  assert.equal(idx.isWindowOpen(plain, D('2026-08-15')), true);
  assert.equal(idx.isWindowOpen(plain, D('2026-09-30')), true);
  assert.equal(idx.isWindowOpen(plain, D('2026-10-01')), false);
  assert.equal(idx.isWindowOpen({ from: 'xx', to: '01-01' }, D('2026-01-01')), false, 'malformed window is never open');
});

test('publish window — opens/closes point at the right occurrence, including across the wrap', () => {
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const w = { from: '11-15', to: '01-06' };
  let st = idx.windowState(w, D('2026-12-25'));
  assert.deepEqual([st.open, ymd(st.opens), ymd(st.closes)], [true, '2026-11-15', '2027-01-06']);
  st = idx.windowState(w, D('2027-01-03'));
  assert.deepEqual([st.open, ymd(st.opens), ymd(st.closes)], [true, '2026-11-15', '2027-01-06'], 'open in January belongs to the window that started last year');
  st = idx.windowState(w, D('2027-03-01'));
  assert.deepEqual([st.open, ymd(st.opens), ymd(st.closes)], [false, '2027-11-15', '2028-01-06']);
  const plain = { from: '08-15', to: '09-30' };
  st = idx.windowState(plain, D('2026-10-01'));
  assert.deepEqual([st.open, ymd(st.opens), ymd(st.closes)], [false, '2027-08-15', '2027-09-30'], 'after closing, the next opening is next year');
  st = idx.windowState(plain, D('2026-03-01'));
  assert.deepEqual([st.open, ymd(st.opens), ymd(st.closes)], [false, '2026-08-15', '2026-09-30']);
});

test('seasonal — indexable set is every route minus the closed seasonal ones, per date', () => {
  const all = idx.collectionRouteIds;
  const dec = idx.indexableCollectionIds(D('2026-12-05'));
  assert.ok(dec.includes('season-of-gratitude') && !dec.includes('summer-of-wonder') && !dec.includes('back-to-school'));
  const jul = idx.indexableCollectionIds(D('2026-07-10'));
  assert.ok(jul.includes('summer-of-wonder') && !jul.includes('season-of-gratitude'));
  for (const d of [dec, jul]) {
    assert.ok(d.every((id) => all.includes(id)));
    for (const id of all) if (!idx.seasonalCollectionIds.includes(id)) assert.ok(d.includes(id), `${id} must always be indexable`);
  }
  assert.deepEqual(idx.openSeasonalIds(D('2026-09-09')), ['back-to-school']);
  assert.deepEqual(idx.openSeasonalIds(D('2026-04-01')), []);
  assert.equal(idx.seasonalState('kindness'), null, 'non-seasonal collections have no window state');
});

test('seasonal — the committed sitemap advertises exactly the indexable set for today', () => {
  const sitemap = readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8');
  const advertised = [...new Set([...sitemap.matchAll(/<loc>https:\/\/storytimewitheva\.com\/collections\/([a-z0-9-]+)\/<\/loc>/g)].map((m) => m[1]))].sort();
  assert.deepEqual(advertised, [...idx.indexableCollectionIds(new Date())].sort(), 'sitemap out of step with the publish windows — run `npm run gen:sitemap` (a deploy is due at every window boundary)');
});
