// Learning packs (Sprint 7 S7-008): curated groups of EXISTING downloads that double as
// lead magnets. These tests make a broken pack a build failure: unknown or non-download
// resources, colliding ids, missing locales, and a pack with no stable /download rule.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './_manifest.mjs';
import { loadLearningPacks, loadContentIndex, loadResources, loadTaxonomy } from '../../scripts/lib/catalog.mjs';

const { learningPacks, packItemHref } = await loadLearningPacks();
const idx = await loadContentIndex();
const { resources } = await loadResources();
const tax = await loadTaxonomy();
const redirects = readFileSync(path.join(ROOT, 'public', '_redirects'), 'utf8');
const LANGS = ['en', 'fr', 'es'];

test('packs — every record validates and is published', () => {
  assert.ok(learningPacks.length >= 2);
  for (const p of learningPacks) {
    const problems = idx.learningPackProblems(p);
    assert.deepEqual(problems, [], `${p.id}: ${problems.join('; ')}`);
    assert.equal(p.publishState, 'published');
    assert.ok(idx.learningPackIds.includes(p.id));
  }
});

test('packs — the validator rejects broken records (so green means it rejects)', () => {
  const good = learningPacks[0];
  const has = (rec, needle) => idx.learningPackProblems(rec).some((x) => x.includes(needle));
  assert.ok(has({ ...good, resourceIds: ['download-parents-guide'] }, 'at least two'), 'single-item pack not caught');
  assert.ok(has({ ...good, resourceIds: ['download-parents-guide', 'article-bilingual-reading'] }, 'not a download'), 'article in a pack not caught');
  assert.ok(has({ ...good, resourceIds: ['download-parents-guide', 'download-nope'] }, 'does not exist'), 'unknown resource not caught');
  assert.ok(has({ ...good, resourceIds: ['download-parents-guide', 'download-parents-guide'] }, 'duplicate resource'), 'duplicate not caught');
  assert.ok(has({ ...good, id: 'bilingual-bundle' }, 'collides with a registered lead magnet'), 'magnet collision not caught');
  assert.ok(has({ ...good, id: 'parents-guide' }, 'collides with a download slug'), 'slug collision not caught');
  assert.ok(has({ ...good, id: 'kindness' }, 'collides with a collection id'), 'collection collision not caught');
  assert.ok(has({ ...good, collectionIds: ['honesty'] }, 'not a public collection'), 'ineligible collection not caught');
  assert.ok(has({ ...good, ageBandIds: ['ages-99'] }, 'unknown age band'), 'bad band not caught');
  assert.ok(has({ ...good, title: { ...good.title, fr: '' } }, 'missing fr title'), 'missing locale not caught');
});

test('packs — clear metadata: audience, ages, distinct download items, EN/FR/ES copy', () => {
  for (const p of learningPacks) {
    assert.ok(['parent', 'educator', 'both'].includes(p.audience));
    assert.ok(p.ageBandIds.length >= 1 && p.ageBandIds.every((b) => tax.AGE_BAND_IDS.includes(b)));
    const items = idx.packResources(p.id);
    assert.equal(items.length, p.resourceIds.length, `${p.id}: every item resolves`);
    assert.ok(items.every((r) => r.kind === 'download'));
    for (const lang of LANGS) {
      assert.ok(p.title[lang].trim() && p.description[lang].trim().length >= 40, `${p.id}: ${lang} copy`);
      assert.ok(!p.title[lang].includes('—') || lang !== 'en', `${p.id}: em dash in English title`);
      assert.ok(!p.description.en.includes('—'), `${p.id}: em dash in English description`);
    }
  }
});

test('packs — every item link is a stable /download rule with the right language variant', () => {
  for (const p of learningPacks) {
    for (const r of idx.packResources(p.id)) {
      for (const lang of LANGS) {
        const href = packItemHref(r, lang);
        const [pathname, query] = href.split('?');
        assert.equal(pathname, `/download/${r.slug}`);
        if (r.localizedFile && lang !== 'en') {
          assert.equal(query, `lang=${lang}`);
          assert.match(redirects, new RegExp(`^/download/${r.slug}\\s+lang=${lang}\\s+\\S+\\.pdf\\s+302`, 'm'), `${href}: no language rule`);
        } else {
          assert.equal(query, undefined, `${href}: shared file must not carry ?lang`);
          assert.match(redirects, new RegExp(`^/download/${r.slug}\\s+\\S+\\.pdf\\s+302`, 'm'), `${href}: no fallback rule`);
        }
      }
    }
  }
});

test('packs — a pack is a lead magnet: /download/<pack> 301s to its gated /free page', () => {
  for (const p of learningPacks) {
    assert.match(redirects, new RegExp(`^/download/${p.id}\\s+/free/${p.id}\\s+301`, 'm'), `${p.id}: no bundle alias`);
  }
});

test('packs — reverse relation packsByCollectionId matches the forward collectionIds exactly', () => {
  const forward = {};
  for (const p of learningPacks) for (const c of p.collectionIds ?? []) (forward[c] ??= []).push(p.id);
  assert.deepEqual(idx.packsByCollectionId, forward);
  for (const c of Object.keys(forward)) assert.ok(idx.collectionRouteIds.includes(c));
});

test('packs — bundle EXISTING printables only: no pack references a file outside the registry', () => {
  const known = new Set(resources.filter((r) => r.kind === 'download').map((r) => r.id));
  for (const p of learningPacks) for (const id of p.resourceIds) assert.ok(known.has(id), `${p.id}: ${id}`);
});
