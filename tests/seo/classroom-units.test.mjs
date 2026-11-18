// Classroom units (activities audit 2026-11, §5c item 5): the open pages (/classroom and
// /classroom/<unit-id>) are prerendered in every language, indexable, with one h1, hreflang
// and a sitemap entry; the gated packs (/free/<unit-id>-pack) are prerendered, noindex and tag
// the signup form with the pack slug. Run after `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadClassroomUnits, loadClassroomUnitPlans, loadCatalog, loadContentIndex } from '../../scripts/lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const { publishedClassroomUnits, unitPackSlug, unitStepHref, unitPackItems, unitsForCollection } = await loadClassroomUnits();
const { unitDays } = await loadClassroomUnitPlans();
const { books } = await loadCatalog();
const { collectionRecordById, educatorCollectionIds } = await loadContentIndex();
const LOCALES = { en: '', es: '/es', fr: '/fr' };
const read = (route) => {
  const f = path.join(DIST, route.replace(/^\//, ''), 'index.html');
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
};
const decode = (h) => h.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
const h1s = (h) => (h.match(/<h1\b/g) ?? []).length;
const hreflangs = (h) => [...h.matchAll(/<link[^>]*rel="alternate"[^>]*hreflang="([^"]*)"/g)].map((m) => m[1]);
const sitemap = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');

test('classroom — the index is prerendered per locale, indexable, one h1, hreflang, in the sitemap, linking every unit', () => {
  assert.equal(publishedClassroomUnits.length, 5);
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    const h = read(`${prefix}/classroom`);
    assert.ok(h, `${prefix}/classroom: not prerendered`);
    assert.equal(h1s(h), 1, `${prefix}/classroom: one h1`);
    assert.ok(!h.includes('content="noindex'), `${prefix}/classroom: indexable`);
    for (const need of ['en', 'es', 'fr', 'x-default']) assert.ok(hreflangs(h).includes(need), `${prefix}/classroom: hreflang ${need}`);
    assert.ok(sitemap.includes(`<loc>https://storytimewitheva.com${prefix}/classroom/</loc>`));
    for (const u of publishedClassroomUnits) {
      assert.ok(h.includes(`href="${prefix}/classroom/${u.id}/"`), `${prefix}/classroom: links ${u.id}`);
      assert.ok(decode(h).includes(u.title[loc]), `${prefix}/classroom: ${u.id} ${loc} title`);
    }
  }
});

test('classroom — every unit page is prerendered per locale with its books, plan links, words, prompts and pack offer', () => {
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    for (const u of publishedClassroomUnits) {
      const route = `${prefix}/classroom/${u.id}`;
      const h = read(route);
      assert.ok(h, `${route}: not prerendered`);
      const d = decode(h);
      assert.equal(h1s(h), 1, `${route}: one h1`);
      assert.ok(!h.includes('content="noindex'), `${route}: indexable`);
      for (const need of ['en', 'es', 'fr', 'x-default']) assert.ok(hreflangs(h).includes(need), `${route}: hreflang ${need}`);
      assert.ok(h.includes(`<link rel="canonical" href="https://storytimewitheva.com${route}/"`) || h.includes(`rel="canonical" href="https://storytimewitheva.com${route}/"`), `${route}: canonical`);
      assert.ok(sitemap.includes(`<loc>https://storytimewitheva.com${route}/</loc>`), `${route}: in the sitemap`);
      assert.ok(d.includes(u.title[loc]) && d.includes(u.description[loc]), `${route}: ${loc} copy`);
      for (const id of u.bookIds) {
        const b = books.find((x) => x.id === id);
        assert.ok(h.includes(`href="${prefix}/books/${id}/"`), `${route}: links ${id}`);
        assert.ok(d.includes(b.title[loc] ?? b.title.en), `${route}: ${id} title`);
        for (const q of b.discussionQuestions) assert.ok(d.includes(q.prompt[loc]), `${route}: ${id} ${q.stage} prompt`);
      }
      for (const [i, day] of unitDays(u.id).entries()) {
        assert.ok(d.includes(day.note[loc]), `${route}: day ${i + 1} note`);
        for (const step of day.steps) {
          const href = unitStepHref(step, loc).replace(/&/g, '&amp;');
          assert.ok(h.includes(`href="${href}"`), `${route}: day ${i + 1} link ${href}`);
        }
      }
      // The pack offer: the signup form tags the unit's pack, and the page lists what is inside.
      const tagInput = (h.match(/<input\b[^>]*type="hidden"[^>]*>/g) ?? []).find((t) => /name="lead_magnet"/.test(t));
      assert.ok(tagInput && tagInput.includes(`value="${unitPackSlug(u.id)}"`), `${route}: form must tag the pack`);
      assert.ok(h.includes(`data-unit-pack="${unitPackSlug(u.id)}"`), `${route}: pack contents listed`);
      assert.ok(h.includes('<script type="application/ld+json"'), `${route}: JSON-LD`);
    }
  }
});

test('classroom — each gated pack is prerendered per locale, noindex, tagging the form with its slug and naming the unit', () => {
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    for (const u of publishedClassroomUnits) {
      const slug = unitPackSlug(u.id);
      const route = `${prefix}/free/${slug}`;
      const h = read(route);
      assert.ok(h, `${route}: not prerendered`);
      assert.ok(decode(h).includes(u.title[loc]), `${route}: ${loc} unit title missing`);
      const tagInput = (h.match(/<input\b[^>]*type="hidden"[^>]*>/g) ?? []).find((t) => /name="lead_magnet"/.test(t));
      assert.ok(tagInput && tagInput.includes(`value="${slug}"`), `${route}: form must tag the pack`);
      assert.ok(h.includes('<meta name="robots" content="noindex'), `${route}: landing pages are noindex`);
      assert.ok(!sitemap.includes(`/free/${slug}/`), `${route}: stays out of the sitemap`);
      // Every link the pack will deliver is a page that exists in dist (activity pages are
      // prerendered per locale; games are static files; downloads are redirect rules).
      for (const item of unitPackItems(u, loc)) {
        const p = item.href.split('?')[0];
        if (p.startsWith('/download/')) continue;
        const f = p.endsWith('.html') ? path.join(DIST, p) : path.join(DIST, p.replace(/^\//, ''), 'index.html');
        assert.ok(existsSync(f), `${route}: pack item ${item.href} has no page in dist`);
      }
    }
  }
});

test('classroom — linked from the teachers’ area on /resources and from the matching educator collections, per locale', () => {
  for (const [, prefix] of Object.entries(LOCALES)) {
    const res = read(`${prefix}/resources`);
    assert.ok(res.includes('id="classroom-units"'), `${prefix}/resources: units block`);
    assert.ok(res.includes(`href="${prefix}/classroom/"`), `${prefix}/resources: links the index`);
    for (const u of publishedClassroomUnits) assert.ok(res.includes(`href="${prefix}/classroom/${u.id}/"`), `${prefix}/resources: links ${u.id}`);
    for (const cid of educatorCollectionIds) {
      const rec = collectionRecordById[cid];
      const h = read(`${prefix}/collections/${cid}`);
      for (const u of unitsForCollection(rec.themeIds, rec.bookIds)) assert.ok(h.includes(`href="${prefix}/classroom/${u.id}/"`), `${prefix}/collections/${cid}: links ${u.id}`);
    }
  }
});
