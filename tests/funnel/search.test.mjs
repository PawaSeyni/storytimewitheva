// Site search (S7-015): index coverage, route existence, locale scoping, filters, ranking,
// empty query, and seasonal windows — all on the browser-free index.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './_manifest.mjs';
import { loadSearchIndex, loadCatalog, loadActivities, loadResources, loadContentIndex } from '../../scripts/lib/catalog.mjs';

const { buildSearchIndex, searchRecords, SEARCH_TYPES } = await loadSearchIndex();
const index = buildSearchIndex();
const { books } = await loadCatalog();
const { activities } = await loadActivities();
const { resources } = await loadResources();
const idx = await loadContentIndex();
const sitemap = readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8');
const D = (s) => new Date(`${s}T12:00:00`);

test('index — every book, activity, public collection, published journey and resource is present exactly once', () => {
  const key = (r) => `${r.type}:${r.id}`;
  assert.equal(new Set(index.map(key)).size, index.length, 'duplicate record');
  const of = (t) => index.filter((r) => r.type === t).map((r) => r.id).sort();
  assert.deepEqual(of('book'), books.map((b) => b.id).sort());
  assert.deepEqual(of('activity'), activities.map((a) => a.slug).sort());
  assert.deepEqual(of('collection'), [...idx.collectionRouteIds].sort());
  assert.deepEqual(of('journey'), [...idx.journeyRouteIds].sort());
  assert.deepEqual(of('resource'), resources.map((r) => r.id).sort());
});

test('index — every route exists: sitemap for books/collections/journeys, registries for the rest', () => {
  for (const r of index) {
    if (r.type === 'book' || r.type === 'journey') assert.ok(sitemap.includes(`<loc>https://storytimewitheva.com${r.route}/</loc>`), `${r.type} ${r.id}: route ${r.route} not in sitemap`);
    if (r.type === 'collection') assert.ok(idx.collectionRouteIds.includes(r.id));
    if (r.type === 'activity') assert.match(r.route, /^\/activities\/[a-z0-9-]+$/);
    if (r.type === 'resource') assert.ok(/^\/resources#[a-z-]+$/.test(r.route) || /^\/free\/[a-z-]+$/.test(r.route), `${r.id}: ${r.route}`);
  }
});

test('index — every record has a title and summary in EN, FR and ES, and localized terms', () => {
  for (const r of index) for (const l of ['en', 'fr', 'es']) {
    assert.ok(r.title[l]?.trim(), `${r.type} ${r.id}: ${l} title`);
    assert.ok(r.summary[l]?.trim(), `${r.type} ${r.id}: ${l} summary`);
    assert.ok(r.terms[l]?.trim(), `${r.type} ${r.id}: ${l} terms`);
  }
});

test('search — runs within the active locale (French label finds the collection; English label does not in French)', () => {
  const fr = searchRecords(index, 'bonté', { language: 'fr' });
  assert.ok(fr.some((r) => r.type === 'collection' && r.id === 'kindness'), 'French theme label must find the kindness collection');
  const frEn = searchRecords(index, 'kindness', { language: 'fr' }).filter((r) => r.type === 'collection' && r.id === 'kindness');
  assert.equal(frEn.length, 0, 'the English label must not match in the French index');
  const es = searchRecords(index, 'valentía', { language: 'es' });
  assert.ok(es.some((r) => r.id === 'courage'), 'Spanish theme label finds the courage collection');
});

test('search — diacritics fold and case is ignored', () => {
  const a = searchRecords(index, 'valentia', { language: 'es' }).map((r) => r.id);
  const b = searchRecords(index, 'VALENTÍA', { language: 'es' }).map((r) => r.id);
  assert.deepEqual(a, b);
  assert.ok(a.length > 0);
});

test('search — empty and whitespace queries return nothing', () => {
  assert.deepEqual(searchRecords(index, '', { language: 'en' }), []);
  assert.deepEqual(searchRecords(index, '   ', { language: 'en' }), []);
});

test('search — content-type filters restrict results and every type is reachable', () => {
  for (const t of SEARCH_TYPES) {
    const hits = searchRecords(index, 'a', { language: 'en', types: [t] });
    assert.ok(hits.length > 0, `${t}: no hits for a broad query`);
    assert.ok(hits.every((r) => r.type === t), `${t}: filter leaked other types`);
  }
});

test('search — title matches rank above term and summary matches; every word must match', () => {
  const hits = searchRecords(index, 'kindness', { language: 'en' });
  assert.equal(hits[0].type, 'collection');
  assert.equal(hits[0].id, 'kindness', 'the collection titled Kindness ranks first');
  assert.ok(hits.some((r) => r.type === 'activity' && r.id === 'kindness-ripple'), 'the Kindness Ripple Challenge activity is found too, below the exact title');
  assert.deepEqual(searchRecords(index, 'kindness zzzz', { language: 'en' }), [], 'an unmatched word yields nothing');
});

test('search — seasonal collections are found only while their window is open', () => {
  const open = searchRecords(index, 'gratitude', { language: 'en', date: D('2026-12-05'), types: ['collection'] }).map((r) => r.id);
  assert.ok(open.includes('season-of-gratitude') && open.includes('gratitude'));
  const closed = searchRecords(index, 'gratitude', { language: 'en', date: D('2026-03-05'), types: ['collection'] }).map((r) => r.id);
  assert.ok(!closed.includes('season-of-gratitude') && closed.includes('gratitude'));
});
