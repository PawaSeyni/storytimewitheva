// Guide next step (2026-11): Google sends almost all its search visitors to the follow-up
// activities guide and most leave from it. Every parent guide (/resources/<slug>) now carries
// a "Try it with a book" step twice: a compact block part-way through the body and a full one
// at its end, linking the classroom units, the guide's free printable through its stable
// /free/<slug> landing (never a hashed PDF) and the books the guide pairs with. Run after
// `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadClassroomUnits, loadContentIndex, loadResources } from '../../scripts/lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const { publishedClassroomUnits } = await loadClassroomUnits();
const { booksByResourceId } = await loadContentIndex();
const { resources } = await loadResources();
const LOCALES = { en: '', es: '/es', fr: '/fr' };
const HEADING = { en: 'Try it with a book', es: 'Pruébalo con un libro', fr: 'Essayez avec un livre' };
const read = (route) => {
  const f = path.join(DIST, route.replace(/^\//, ''), 'index.html');
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
};
const decode = (h) => h.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
/** The HTML of one next-step block, from its marker to the end of its element. */
function block(h, variant) {
  const start = h.indexOf(`data-guide-next-step="${variant}"`);
  if (start < 0) return '';
  const tag = variant === 'compact' ? '</aside>' : '</section>';
  // The full block holds no nested <section>, the compact one no nested <aside>.
  return h.slice(start, h.indexOf(tag, start));
}
const HASHED_PDF = /href="[^"]*-[A-Za-z0-9_-]{8,}\.pdf"/;
const guides = resources.filter((r) => r.kind === 'article');

test('guide next step — the follow-up activities guide links every classroom unit, the stable printable and its paired books, per locale', () => {
  const guide = guides.find((g) => g.slug === 'follow-up-activities');
  const printable = resources.find((r) => r.id === 'download-follow-up-activities');
  assert.ok(guide.relatedResourceIds.includes(printable.id));
  const pairedBooks = booksByResourceId[guide.id];
  assert.ok(pairedBooks.length >= 1, 'at least one book names the guide');
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    const route = `${prefix}/resources/${guide.slug}`;
    const h = read(route);
    assert.ok(h, `${route}: not prerendered`);
    const full = block(h, 'full');
    const compact = block(h, 'compact');
    assert.ok(full.length > 200, `${route}: full next-step block missing`);
    assert.ok(compact.length > 100, `${route}: compact next-step block missing`);
    assert.ok(decode(full).includes(HEADING[loc]) && decode(compact).includes(HEADING[loc]), `${route}: ${loc} heading`);
    // The compact block sits inside the body, before the end; the full block after it.
    assert.ok(h.indexOf('data-guide-next-step="compact"') < h.indexOf('data-guide-next-step="full"'), `${route}: compact before full`);
    const article = h.slice(h.indexOf(`<article id="${guide.slug}"`));
    const sectionsBefore = (article.slice(0, article.indexOf('data-guide-next-step="compact"')).match(/<section>/g) ?? []).length;
    assert.ok(sectionsBefore >= 2 && sectionsBefore <= 5, `${route}: compact block after ${sectionsBefore} sections, expected part-way`);
    for (const u of publishedClassroomUnits) {
      assert.ok(full.includes(`href="${prefix}/classroom/${u.id}/"`), `${route}: links unit ${u.id}`);
      assert.ok(decode(full).includes(u.title[loc]), `${route}: ${u.id} ${loc} title`);
    }
    assert.ok(full.includes(`href="${prefix}/classroom/"`) && compact.includes(`href="${prefix}/classroom/"`), `${route}: links /classroom`);
    for (const b of [full, compact]) assert.ok(b.includes(`href="${prefix}/free/${printable.slug}/"`), `${route}: printable's stable link`);
    assert.ok(decode(full).includes(printable.title[loc]), `${route}: printable ${loc} title`);
    for (const id of pairedBooks) assert.ok(full.includes(`href="${prefix}/books/${id}/"`), `${route}: paired book ${id}`);
    const bookLinks = (full.match(new RegExp(`href="${prefix}/books/[a-z0-9-]+/"`, 'g')) ?? []).length;
    assert.ok(bookLinks >= 3 && bookLinks <= 4, `${route}: ${bookLinks} book links, expected 3-4`);
    assert.ok(/href="[^"]*\/books\/[a-z0-9-]+\/"/.test(compact), `${route}: compact block links a book`);
    for (const b of [full, compact]) {
      assert.ok(!HASHED_PDF.test(b) && !/\.pdf"/.test(b), `${route}: no direct or hashed PDF link`);
    }
  }
});

test('guide next step — every parent guide carries both blocks with a unit, a book and its printables, per locale', () => {
  assert.equal(guides.length, 8);
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    for (const g of guides) {
      const route = `${prefix}/resources/${g.slug}`;
      const h = read(route);
      assert.ok(h, `${route}: not prerendered`);
      const full = block(h, 'full');
      const compact = block(h, 'compact');
      assert.ok(full && compact, `${route}: next-step blocks`);
      assert.equal((h.match(/data-guide-next-step="/g) ?? []).length, 2, `${route}: exactly two blocks`);
      assert.ok(publishedClassroomUnits.some((u) => full.includes(`href="${prefix}/classroom/${u.id}/"`)), `${route}: a classroom unit`);
      assert.ok(new RegExp(`href="${prefix}/books/[a-z0-9-]+/"`).test(full), `${route}: a book`);
      for (const rid of g.relatedResourceIds ?? []) {
        const r = resources.find((x) => x.id === rid);
        assert.ok(full.includes(`href="${prefix}/free/${r.slug}/"`), `${route}: printable ${rid}`);
      }
      assert.ok(!/\.pdf"/.test(full) && !/\.pdf"/.test(compact), `${route}: no PDF link`);
      // English copy carries no em dash.
      if (loc === 'en') assert.ok(!decode(full).includes('—') && !decode(compact).includes('—'), `${route}: em dash`);
    }
  }
});
