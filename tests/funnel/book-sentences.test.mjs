// Story sentences per book (activities audit 2026-11): the data rules, and Sentence Builder's
// book mode (baked from the data, built in the game's language).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCatalog, loadBookSentences } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const { bookSentences } = await loadBookSentences();

test('sentences — every book, in catalog order, has three', () => {
  assert.deepEqual(Object.keys(bookSentences), books.map((b) => b.id));
  for (const [id, ss] of Object.entries(bookSentences)) assert.equal(ss.length, 3, `${id}: ${ss.length} sentences`);
});

test('sentences — 3 to 7 tiles, no punctuation, capitalized, no repeated word (one right order)', () => {
  for (const [id, ss] of Object.entries(bookSentences)) {
    assert.equal(new Set(ss.map((s) => s.emoji)).size, ss.length, `${id}: duplicate emoji`);
    for (const s of ss) {
      for (const l of ['en', 'es', 'fr']) {
        const v = s[l];
        const w = v.split(' ');
        assert.ok(w.length >= 3 && w.length <= 7, `${id}/${l}: ${w.length} words "${v}"`);
        assert.match(v, /^[\p{L}']+( [\p{L}']+)*$/u, `${id}/${l}: punctuation or double space in "${v}"`);
        assert.equal(v[0], v[0].toUpperCase(), `${id}/${l}: not capitalized "${v}"`);
        assert.equal(new Set(w.map((x) => x.toLowerCase())).size, w.length, `${id}/${l}: repeated word in "${v}"`);
      }
    }
  }
});

test('sentence builder — book sentences are baked from the data and the game has a book mode', () => {
  const html = readFileSync('public/games/sentence-builder.html', 'utf8');
  const data = JSON.parse(/window\.STE_BOOK_VOCAB = (\{.*?\});<\/script>/s.exec(html)[1]);
  for (const b of books) assert.deepEqual(data[b.id].sentences, bookSentences[b.id], `${b.id}: sentences drifted — run npm run patch:games`);
  assert.match(html, /steAddBookButton\('\.level-tab', 'level'\)/);
  assert.match(html, /x\[BOOK_LANG\]\.split\(' '\)/, 'tiles must come from the game language');
});

test('sentence builder — offered from every book page', () => {
  assert.match(readFileSync('src/components/StoryWords.tsx', 'utf8'), /slug: 'sentence-builder'/);
});
