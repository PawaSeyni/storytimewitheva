// Book mode for the generic activities (docs/activities-audit-2026-11.md §7c items 2 and 3):
// the Adventure Journal pre-fills the book it was opened from, the Emotion Wheel asks how
// that book's character felt, and Puzzle Paradise is rebuilt on each book's own words and
// sentences, with no fairy-tale content left.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { loadCatalog, loadActivities, loadBookVocab, loadBookSentences, loadBookHeroes } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const { activities } = await loadActivities();
const { bookVocab } = await loadBookVocab();
const { bookSentences } = await loadBookSentences();
const { bookHeroes } = await loadBookHeroes();
const LANGS = ['en', 'es', 'fr'];
const bundle = await build({ entryPoints: ['src/lib/puzzles.ts', 'src/lib/seeded.ts'], bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent', outdir: 'x' });
const load = (i) => import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[i].text).toString('base64')}`);
const { plain, scrambleWord, scrambleSentence } = await load(0);
const { seeded } = await load(1);

test('journal — pre-fills the book it was opened from, in both modes', () => {
  const src = readFileSync('src/demos/AdventureJournalDemo.tsx', 'utf8');
  assert.match(src, /useSourceBook\('adventure-journal'\)/);
  assert.match(src, /blankEntry\(fromBook\)/, 'normal mode seeds the entry with the source book');
  assert.match(src, /sourceBook=\{fromBook \? fromBook\.id : null\}/, 'little-reader mode starts with the cover selected');
  for (const b of books) assert.ok((b.relatedActivityIds ?? []).length > 0);
});

test('emotion wheel — every book that links it has a hero, and the baked data matches', () => {
  const linking = books.filter((b) => (b.relatedActivityIds ?? []).includes('emotion-wheel')).map((b) => b.id).sort();
  assert.ok(linking.length >= 3);
  for (const id of linking) assert.ok(bookHeroes[id], `${id} links the Emotion Wheel but has no hero entry`);
  for (const [id, hero] of Object.entries(bookHeroes)) {
    assert.ok(books.some((b) => b.id === id), `${id}: unknown book`);
    for (const l of LANGS) assert.ok(hero[l]?.trim(), `${id}: hero missing ${l}`);
  }
  const html = readFileSync('public/games/emotion-wheel.html', 'utf8');
  const m = /window\.STE_WHEEL_BOOKS = (\{.*?\});<\/script>/s.exec(html);
  assert.ok(m, 'no STE_WHEEL_BOOKS baked — re-run npm run patch:games');
  const baked = JSON.parse(m[1]);
  assert.deepEqual(Object.keys(baked).sort(), linking, 'baked books drifted from the catalog');
  for (const id of linking) {
    assert.deepEqual(baked[id].title, books.find((b) => b.id === id).title);
    assert.deepEqual(baked[id].hero, bookHeroes[id]);
  }
  for (const key of ['bookBanner', 'bookReady', 'bookAsk']) assert.equal((html.match(new RegExp(`\\b${key}:`, 'g')) || []).length, 3, `${key} in every language`);
  assert.match(html, /\{hero\}/);
  assert.ok(!/\{emotion\}/.test(html), 'no adjective agreement with the hero');
});

test('puzzles — an any-book page built on the story words and sentences, with no fairy tales', () => {
  const a = activities.find((x) => x.slug === 'puzzles');
  assert.ok(a && a.anyBook, 'puzzles must accept any book');
  assert.equal(a.ages, '6-9');
  const src = readFileSync('src/demos/PuzzleAdventuresDemo.tsx', 'utf8');
  assert.match(src, /useSourceBook\(SLUG\)/);
  for (const gone of ['Riding Hood', 'Cinderella', 'Grandma', 'KNIGHT', 'Pinocchio', 'riddle', 'Riddle', 'LOGIC_PUZZLES']) assert.ok(!src.includes(gone), `puzzles still contain "${gone}"`);
  assert.match(readFileSync('src/components/StoryWords.tsx', 'utf8'), /withSourceBook\('\/activities\/puzzles', bookId\)/);
  for (const b of books) {
    assert.equal((bookVocab[b.id] ?? []).length, 8, `${b.id}: 8 words`);
    assert.equal((bookSentences[b.id] ?? []).length, 3, `${b.id}: 3 sentences`);
  }
});

test('puzzles — scrambles are real permutations, never the answer, and stable per book', () => {
  for (const b of books) {
    for (const lang of LANGS) {
      const rnd = seeded(`${b.id}:${lang}`);
      const again = seeded(`${b.id}:${lang}`);
      for (const w of bookVocab[b.id]) {
        const s = scrambleWord(w[lang], rnd);
        assert.equal(s, scrambleWord(w[lang], again), `${b.id} ${lang} ${w.en}: not deterministic`);
        assert.notEqual(s, plain(w[lang]), `${b.id} ${lang}: "${w[lang]}" was not scrambled`);
        assert.equal([...s].sort().join(''), [...plain(w[lang])].sort().join(''), `${b.id} ${lang}: letters changed`);
        assert.ok(!/[̀-ͯ]/.test(s.normalize('NFD')) || s === s.toUpperCase(), 'accent-free, uppercase');
      }
      for (const s of bookSentences[b.id]) {
        const words = s[lang].split(' ');
        const tiles = scrambleSentence(words, rnd);
        assert.notEqual(tiles.join(' '), words.join(' '), `${b.id} ${lang}: sentence not scrambled`);
        assert.deepEqual([...tiles].sort(), [...words].sort());
      }
    }
  }
  assert.equal(plain('plátano'), 'PLATANO');
  assert.equal(plain(' cœur '), 'CŒUR');
});
