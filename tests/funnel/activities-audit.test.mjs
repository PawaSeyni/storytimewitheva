// Activities audit remediation (docs/activities-audit-2026-11.md, P0 items).
//
//  1. Book context: an activity opened from a book page (?book=<id>) continues from THAT
//     book, and an unrelated or invented id is ignored.
//  2. The games bake one continuation per referring book; it must match journey.ts.
//  3. Story Map shows the Eva Gallo Collection and nothing else.
//  4. Finish-the-Story starts every story from a real catalog book, in three languages.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { loadCatalog, loadActivities } from '../../scripts/lib/catalog.mjs';

const bundle = await build({ entryPoints: ['src/lib/journey.ts'], bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent' });
const { nextStep, sourceBookFor } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const { books } = await loadCatalog();
const { activities } = await loadActivities();
const published = books.filter((b) => b.status !== 'coming-soon');

test('book context — accepted only for a book that links the activity', () => {
  for (const b of books) {
    for (const slug of b.relatedActivityIds ?? []) assert.equal(sourceBookFor(slug, b.id), b.id, `${b.id} -> ${slug}`);
    const unrelated = activities.find((a) => !a.anyBook && !(b.relatedActivityIds ?? []).includes(a.slug));
    if (unrelated) assert.equal(sourceBookFor(unrelated.slug, b.id), null, `${b.id} must not label ${unrelated.slug}`);
  }
  assert.equal(sourceBookFor('emotion-wheel', 'no-such-book'), null);
  assert.equal(sourceBookFor('emotion-wheel', ''), null);
  assert.equal(sourceBookFor('emotion-wheel', null), null);
  assert.equal(sourceBookFor('no-such-activity', books[0].id), null);
});

test('book context — the continuation follows the source book, not catalog order', () => {
  let differs = 0;
  for (const b of books) {
    for (const slug of b.relatedActivityIds ?? []) {
      const step = nextStep('activity', slug, b.id);
      assert.equal(step.type, 'book', `${slug} from ${b.id}`);
      const expected = (b.relatedBookIds ?? []).find((id) => books.some((x) => x.id === id)) ?? b.id;
      assert.equal(step.id, expected, `${slug} from ${b.id}: should continue to ${expected}`);
      if (step.id !== nextStep('activity', slug).id) differs++;
    }
  }
  assert.ok(differs > 0, 'book context never changed a continuation');
  // An invalid source book behaves exactly like no source book.
  for (const a of activities) assert.deepEqual(nextStep('activity', a.slug, 'no-such-book'), nextStep('activity', a.slug));
});

function fromMap(html) {
  const m = /data-ste-from='([^']*)'/.exec(html);
  return m ? JSON.parse(m[1].replace(/&#39;/g, "'")) : null;
}

test('games — the baked per-book continuation matches journey.ts for every referring book', () => {
  // Word games accept every book with story words; tests/funnel/book-vocab.test.mjs covers them.
  for (const a of activities.filter((x) => x.game && !x.anyBook)) {
    const map = fromMap(readFileSync(`public/games/${a.slug}.html`, 'utf8'));
    assert.ok(map, `${a.slug}: no data-ste-from map — re-run npm run patch:games`);
    const referrers = books.filter((b) => (b.relatedActivityIds ?? []).includes(a.slug));
    assert.deepEqual(Object.keys(map).sort(), referrers.map((b) => b.id).sort(), `${a.slug}: map keys drifted`);
    for (const b of referrers) {
      const step = nextStep('activity', a.slug, b.id);
      assert.equal(map[b.id].next, step.href, `${a.slug} from ${b.id}`);
      assert.deepEqual(map[b.id].nextTitles, books.find((x) => x.id === step.id).title);
      assert.deepEqual(map[b.id].backTitles, b.title);
    }
  }
});

test('games — "Back to" exists in every language of i18n.js', () => {
  const src = readFileSync('public/games/i18n.js', 'utf8');
  assert.equal((src.match(/\bbackTo:/g) || []).length, 3);
});

test('story map — places exactly the published catalog, with baked catalog data', () => {
  const html = readFileSync('public/games/story-map.html', 'utf8');
  const placed = [...html.matchAll(/^\s+'([a-z0-9-]+)':\s*\{ region: '([a-z]+)'/gm)];
  assert.deepEqual(placed.map((m) => m[1]).sort(), published.map((b) => b.id).sort(), 'placements must cover the catalog exactly');
  const regions = new Set(['sky', 'mountains', 'forest', 'town', 'home', 'seaside']);
  for (const [, id, region] of placed) assert.ok(regions.has(region), `${id}: unknown region ${region}`);

  const data = JSON.parse(/window\.STE_STORY_BOOKS = (\{.*?\});<\/script>/s.exec(html)[1]);
  assert.deepEqual(Object.keys(data).sort(), published.map((b) => b.id).sort());
  for (const b of published) {
    assert.deepEqual(data[b.id].title, b.title, `${b.id}: title drifted — re-run npm run patch:games`);
    assert.deepEqual(data[b.id].description, b.description, `${b.id}: description drifted`);
  }
});

test('story map — no off-catalog books and no external purchase links', () => {
  const html = readFileSync('public/games/story-map.html', 'utf8');
  for (const gone of ['Chief Mael', 'The Clever Pots', 'Our Child', 'The Snow Fox', 'The Little Lantern', 'Mango Tree', 'Mountain Weaver', 'Dreamtime', 'amazon.com', 'amazonUrl']) {
    assert.ok(!html.includes(gone), `story-map.html still contains "${gone}"`);
  }
});

test('finish the story — every story is a catalog book, titled as in the catalog, in three languages', () => {
  const html = readFileSync('public/games/finish-the-story.html', 'utf8');
  const stories = [...html.matchAll(/id: '([a-z]+)', book: '([a-z0-9-]+)'/g)].map((m) => m[2]);
  assert.ok(stories.length >= 4, 'expected at least four stories');
  for (const id of stories) {
    const b = books.find((x) => x.id === id);
    assert.ok(b, `unknown book ${id}`);
    for (const l of ['en', 'es', 'fr']) {
      const t = b.title[l];
      assert.ok(html.includes(`'${t.replace(/'/g, "\\'")}'`) || html.includes(`"${t}"`), `${id}: catalog ${l} title "${t}" missing`);
    }
  }
  // Every book that links the game has its own story.
  for (const b of books.filter((x) => (x.relatedActivityIds ?? []).includes('finish-the-story'))) {
    assert.ok(stories.includes(b.id), `${b.id} links finish-the-story but has no story`);
  }
  // Eva is the host who starts the story, never the hero of a catalog book.
  assert.ok(!/Eva woke up|Eva and the Talking Fish|Whispering Forest/.test(html), 'old non-catalog stories remain');
});

test('coverage — every published book leads with an activity built for it (audit goal: 20/20)', () => {
  // Studio activities are the book-specific ones; the generic activities stay available
  // as second-to-fourth picks but never as a book's headline activity.
  const STUDIO = new Set(activities.filter((a) => a.bookSpecific).map((a) => a.slug));
  assert.ok(STUDIO.size >= 18, `expected the book-specific activities to be flagged, got ${STUDIO.size}`);
  for (const b of published) assert.ok(STUDIO.has(b.relatedActivityIds?.[0]), `${b.id}: first activity "${b.relatedActivityIds?.[0]}" is not book-specific`);
});

test('little readers — every activity flagged littleReader really offers the mode, and fits 4-5', async () => {
  const { readFileSync } = await import('node:fs');
  const FILES = { 'adventure-journal': 'AdventureJournalDemo', bingo: 'BingoDemo', 'character-workshop': 'CharacterWorkshopDemo' };
  const flagged = activities.filter((a) => a.littleReader).map((a) => a.slug).sort();
  assert.deepEqual(flagged, Object.keys(FILES).sort(), 'flagged activities and their files drifted');
  for (const [slug, file] of Object.entries(FILES)) {
    const src = readFileSync(`src/demos/${file}.tsx`, 'utf8');
    assert.match(src, /<LittleReaderToggle\b/, `${slug}: no little-reader toggle`);
    assert.match(src, /<ReadAloudButton\b/, `${slug}: little-reader mode must read prompts aloud`);
    assert.ok(!src.includes('—'), `${slug}: em dash`);
    assert.equal(Number(activities.find((a) => a.slug === slug).ages.split('-')[0]), 4, `${slug}: should be rated from age 4`);
  }
});
