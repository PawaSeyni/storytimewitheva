// Book -> resource pairs (relatedResourceIds), 2026-11. Supersedes B-03's "shared strip".
//
// The pairs are hand-written data in books.data.ts, but they follow ONE stated rule (the
// field's doc comment). This file re-derives the rule from the registry and the taxonomy
// and fails when a record drifts from it, so a new book, a renamed theme or a new guide
// cannot leave a page claiming a pairing the rule would not make.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCatalog, loadResources, loadTaxonomy, loadContentIndex } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const { resources } = await loadResources();
const { derivePrimaryAgeBand } = await loadTaxonomy();
const idx = await loadContentIndex();
const byId = new Map(resources.map((r) => [r.id, r]));
const guides = resources.filter((r) => r.kind === 'article');
const published = books.filter((b) => b.status !== 'coming-soon');

/** The rule, as the data comment states it. Deterministic; registry order breaks ties. */
function expectedFor(b) {
  const out = ['download-parents-guide'];
  out.push(derivePrimaryAgeBand(b.ageRange) === 'ages-8-9' ? 'download-follow-up-activities' : 'download-bedtime-routine');
  const scored = guides
    .map((g) => ({
      id: g.id,
      shared: (g.relatedThemeIds ?? []).filter((t) => b.themeIds.includes(t)).length,
      primary: (g.relatedThemeIds ?? []).includes(b.themeIds[0]) ? 1 : 0,
    }))
    .filter((x) => x.shared > 0)
    .sort((x, y) => y.shared - x.shared || y.primary - x.primary);
  if (scored[0]) out.push(scored[0].id);
  return out;
}

test('book resources — every published book has 2 or 3 distinct ids that resolve to the registry', () => {
  for (const b of published) {
    const rel = b.relatedResourceIds ?? [];
    assert.ok(rel.length >= 2 && rel.length <= 3, `${b.id}: ${rel.length} resources, expected 2-3`);
    assert.equal(new Set(rel).size, rel.length, `${b.id}: duplicate resource id`);
    for (const id of rel) assert.ok(byId.has(id), `${b.id}: unknown resource "${id}"`);
  }
});

test('book resources — every record follows the stated rule (guide per story, printable by age band, guide by theme)', () => {
  for (const b of published) {
    assert.deepEqual(b.relatedResourceIds ?? [], expectedFor(b), `${b.id} (${b.ageRange}, ${b.themeIds.join('+')}) drifted from the rule`);
  }
});

test('book resources — each pairing has a real hook: the guide shares a theme, the printable fits the age band', () => {
  for (const b of published) {
    for (const id of b.relatedResourceIds ?? []) {
      const r = byId.get(id);
      if (r.kind === 'article') {
        assert.ok(r.relatedThemeIds.some((t) => b.themeIds.includes(t)), `${b.id}: guide ${id} shares no theme with the book`);
      }
    }
    const band = derivePrimaryAgeBand(b.ageRange);
    const printables = (b.relatedResourceIds ?? []).filter((id) => byId.get(id).kind === 'download');
    assert.ok(printables.includes('download-parents-guide'), `${b.id}: missing the per-story parent guide`);
    if (band === 'ages-8-9') assert.ok(printables.includes('download-follow-up-activities'), `${b.id}: 5-9 book without the classroom sheets`);
    else assert.ok(printables.includes('download-bedtime-routine'), `${b.id}: younger book without the routine chart`);
    assert.ok(!printables.includes('download-bilingual-flashcards'), `${b.id}: flashcards are reached through the bilingual guides, not paired directly`);
  }
});

test('book resources — a book with only unguided themes carries two ids, never a guide that does not fit', () => {
  const guided = new Set(guides.flatMap((g) => g.relatedThemeIds ?? []));
  const unguided = published.filter((b) => !b.themeIds.some((t) => guided.has(t)));
  assert.ok(unguided.length >= 1, 'expected at least one book whose themes no guide names (honesty, kindness, gratitude, humility-listening)');
  for (const b of unguided) {
    assert.equal((b.relatedResourceIds ?? []).length, 2, `${b.id}: should carry exactly the two printables`);
  }
});

test('book resources — booksByResourceId is the exact inverse of the forward field', () => {
  const expected = Object.fromEntries(resources.map((r) => [r.id, []]));
  for (const b of books) for (const id of b.relatedResourceIds ?? []) expected[id].push(b.id);
  assert.deepEqual(idx.booksByResourceId, expected, 'reverse resource index diverged from relatedResourceIds');
  // The per-story guide is the one resource that pairs with the whole catalog.
  assert.equal(idx.booksByResourceId['download-parents-guide'].length, books.length);
});

test('book resources — the book page renders the record and the /resources index renders the inverse', () => {
  const strip = readFileSync(new URL('../../src/components/ResourceStrip.tsx', import.meta.url), 'utf8');
  const detail = readFileSync(new URL('../../src/pages/BookDetail.tsx', import.meta.url), 'utf8');
  const index = readFileSync(new URL('../../src/pages/Resources.tsx', import.meta.url), 'utf8');
  assert.ok(strip.includes('relatedResourceIds'), 'ResourceStrip reads the book record');
  assert.ok(strip.includes('resourcePath(r)'), 'ResourceStrip links through resourcePath (/free/<slug>), never a hashed PDF');
  assert.ok(!/\.pdf/.test(strip), 'ResourceStrip must not link a PDF filename');
  for (const s of ['Guides and printables for this book', 'Guías e imprimibles para este libro', 'Guides et fiches pour ce livre']) {
    assert.ok(strip.includes(s), `ResourceStrip: missing heading "${s}"`);
  }
  assert.ok(/data-book-resources=/.test(strip), 'ResourceStrip marks the section for the SEO suite');
  assert.ok(detail.includes('<ResourceStrip bookId={book.id} />'), 'BookDetail passes the book id');
  assert.ok(index.includes('booksByResourceId'), 'Resources.tsx renders the reverse index');
  assert.ok(index.includes('data-pairs-with='), 'Resources.tsx marks the pairs line');
  for (const s of ['Pairs with:', 'Acompaña a:', 'Accompagne :']) assert.ok(index.includes(s), `Resources.tsx: missing "${s}"`);
});

test('book resources — English copy has no em dashes', () => {
  const strip = readFileSync(new URL('../../src/components/ResourceStrip.tsx', import.meta.url), 'utf8');
  const en = strip.slice(strip.indexOf('en: {'), strip.indexOf('es: {'));
  assert.ok(!en.includes('—'), 'ResourceStrip English copy contains an em dash');
});
