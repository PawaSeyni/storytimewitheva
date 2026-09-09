// Reading journeys (Sprint 7 S7-003, S7-009, S7-013, S7-014).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadJourneys, loadContentIndex, loadCatalog } from '../../scripts/lib/catalog.mjs';

const { journeys } = await loadJourneys();
const idx = await loadContentIndex();
const { books } = await loadCatalog();

test('journeys — every journey passes validation (published ones would block the build)', () => {
  assert.ok(journeys.length >= 3);
  for (const j of journeys) {
    const problems = idx.journeyProblems(j);
    assert.deepEqual(problems, [], `${j.id}: ${problems.join('; ')}`);
  }
});

test('journeys — validation actually rejects broken records', () => {
  const good = journeys[0];
  const bad = { ...good, id: 'bad', steps: [{ id: 'bad-1', type: 'book', contentId: 'no-such-book' }, { id: 'bad-1', type: 'activity', contentId: 'nope' }] };
  const p = idx.journeyProblems(bad);
  assert.ok(p.some((x) => x.includes('missing "no-such-book"')), 'missing book not caught');
  assert.ok(p.some((x) => x.includes('duplicate step id')), 'duplicate step id not caught');
  const frLess = { ...good, title: { ...good.title, fr: '' } };
  assert.ok(idx.journeyProblems(frLess).some((x) => x.includes('missing fr title')), 'missing translation not caught');
  const noBook = { ...good, id: 'nb', steps: [{ id: 'nb-1', type: 'activity', contentId: 'coloring' }, { id: 'nb-2', type: 'activity', contentId: 'bingo' }] };
  assert.ok(idx.journeyProblems(noBook).some((x) => x.includes('no book step')), 'bookless journey not caught');
});

test('journeys — only published + valid journeys get routes; ids are unique bare tokens', () => {
  assert.deepEqual(idx.journeyRouteIds, journeys.filter((j) => j.publishState === 'published').map((j) => j.id));
  assert.equal(new Set(idx.journeyRouteIds).size, idx.journeyRouteIds.length);
  for (const id of idx.journeyRouteIds) assert.match(id, /^[a-z0-9-]+$/);
});

test('journeys — the reverse index matches the forward steps exactly (derived, never persisted)', () => {
  const forward = new Set();
  for (const j of idx.publishedJourneys) for (const s of j.steps) if (['book', 'discussion', 'next-book'].includes(s.type)) forward.add(`${s.contentId}:${j.id}`);
  const reverse = new Set();
  for (const [bookId, jids] of Object.entries(idx.journeysByBookId)) for (const jid of jids) reverse.add(`${bookId}:${jid}`);
  assert.deepEqual([...reverse].sort(), [...forward].sort());
  assert.ok(!readFileSync('src/data/journeys.ts', 'utf8').includes('journeysByBookId'), 'reverse index must not be persisted in the content file');
});

test('journeys — step order is editorial: book first, a continuation present, discussion follows its book', () => {
  for (const j of idx.publishedJourneys) {
    assert.equal(j.steps[0].type, 'book', `${j.id}: must open with a book`);
    for (let i = 0; i < j.steps.length; i++) {
      const s = j.steps[i];
      if (s.type === 'discussion') {
        const prior = j.steps.slice(0, i).some((p) => (p.type === 'book' || p.type === 'next-book') && p.contentId === s.contentId);
        assert.ok(prior, `${j.id}: discussion of ${s.contentId} before that book is read`);
        assert.ok(books.find((b) => b.id === s.contentId)?.discussionQuestions?.length, `${j.id}: ${s.contentId} has no prompts`);
      }
    }
  }
});

test('journeys — sitemap advertises the index and exactly the published journeys', () => {
  const sm = readFileSync('public/sitemap.xml', 'utf8');
  assert.ok(sm.includes('https://storytimewitheva.com/journeys/</loc>'), 'index missing from sitemap');
  // Route tokens only: `[^/<]+` also matched the `"` in an hreflang alternate's href.
  const advertised = [...new Set([...sm.matchAll(/https:\/\/storytimewitheva\.com\/journeys\/([a-z0-9-]+)\//g)].map((m) => m[1]))].sort();
  assert.deepEqual(advertised, [...idx.journeyRouteIds].sort(), 'run npm run gen:sitemap');
});
