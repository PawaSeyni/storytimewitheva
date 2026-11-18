// Story Builder's book mode (2026-11-18). The page most visitors find from search now opens
// on any book (?book=<id>, or the picker): the book's character, setting and problem come
// from the Collection Story Dice data and start preselected, and the book's story words are
// a word bank. Every book page links it from the Story words strip.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { loadCatalog, loadActivities, loadStoryDice, loadBookVocab } from '../../scripts/lib/catalog.mjs';

const SLUG = 'story-builder';
const { books } = await loadCatalog();
const { activities } = await loadActivities();
const { storyDice } = await loadStoryDice();
const { bookVocab } = await loadBookVocab();
const published = books.filter((b) => b.status !== 'coming-soon');
const LANGS = ['en', 'es', 'fr'];
const src = readFileSync('src/demos/StoryBuilderDemo.tsx', 'utf8');

const bundle = await build({ entryPoints: ['src/lib/journey.ts'], bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent' });
const { sourceBookFor } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);

test('story builder — an anyBook activity, so every book is accepted as its source book', () => {
  const a = activities.find((x) => x.slug === SLUG);
  assert.ok(a && a.anyBook, `${SLUG} must accept any book`);
  assert.equal(a.ages, '6-9');
  for (const b of books) assert.equal(sourceBookFor(SLUG, b.id), b.id, `${b.id} -> ${SLUG}`);
  assert.equal(sourceBookFor(SLUG, 'no-such-book'), null);
});

test('story builder — book mode reads the source book and uses the story dice and story words', () => {
  assert.match(src, /const SLUG = 'story-builder'/);
  assert.match(src, /useSourceBook\(SLUG\)/);
  assert.match(src, /from '\.\.\/data\/storyDice\.data'/);
  assert.match(src, /storyDice\[bookId\]\[k\]\[language\]/, 'book faces come from storyDice in the page language');
  assert.match(src, /from '\.\.\/data\/bookVocab\.data'/);
  assert.match(src, /data-story-builder-book=/, 'banner');
  assert.match(src, /data-story-builder-words=/, 'word bank');
  assert.match(src, /SOURCE_BOOK_PARAM/, 'picker writes ?book=');
  for (const key of ['bookBanner', 'bookTemplate', 'wordBank', 'pick']) assert.equal((src.match(new RegExp(`\\b${key}:`, 'g')) || []).length, 3, `${key} in every language`);
});

test('story builder — every published book has dice faces and story words (the dependency)', () => {
  for (const b of published) {
    const d = storyDice[b.id];
    assert.ok(d, `${b.id}: no story-dice faces`);
    for (const k of ['character', 'setting', 'problem']) for (const l of LANGS) assert.ok(d[k]?.[l]?.trim(), `${b.id}: ${k} ${l}`);
    assert.equal((bookVocab[b.id] ?? []).length, 8, `${b.id}: 8 story words`);
  }
});

test('story builder — the generic dice hold no catalog names', () => {
  for (const gone of ['named Luna', 'llamada Luna', 'nommée Luna', 'clever fox', 'zorro astuto', 'renard malin', 'Grandma', 'grandmother', 'wolf', 'Wolf', 'Riding Hood']) {
    assert.ok(!src.includes(gone), `story builder still contains "${gone}"`);
  }
});

test('story builder — the Story words strip on every book page links it in book mode', () => {
  const strip = readFileSync('src/components/StoryWords.tsx', 'utf8');
  assert.match(strip, /withSourceBook\('\/activities\/story-builder', bookId\)/);
  assert.match(strip, /activity: 'story-builder', reason: 'story-words'/);
  assert.match(strip, /data-story-builder\b/);
  assert.equal((strip.match(/\bstoryBuilder:/g) || []).length, 3, 'label in every language');
});
