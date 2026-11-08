// Story words per book (activities audit 2026-11, "bookVocab"): the data rules, and the
// word games' book mode (baked data, helper load order, per-book continuation).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCatalog, loadBookVocab } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const { bookVocab } = await loadBookVocab();
const WORD_GAMES = ['bilingual-flashcards', 'matching', 'spelling-bee', 'sentence-builder'];

test('vocab — every book, in catalog order, has eight words', () => {
  assert.deepEqual(Object.keys(bookVocab), books.map((b) => b.id));
  for (const [id, ws] of Object.entries(bookVocab)) assert.equal(ws.length, 8, `${id}: ${ws.length} words`);
});

test('vocab — one spellable token (3-9 letters) per language, a unique emoji per word', () => {
  for (const [id, ws] of Object.entries(bookVocab)) {
    assert.equal(new Set(ws.map((w) => w.emoji)).size, ws.length, `${id}: duplicate emoji`);
    for (const w of ws) {
      assert.ok(w.emoji && w.emoji.trim(), `${id}: missing emoji`);
      for (const l of ['en', 'es', 'fr']) assert.match(w[l], /^\p{L}{3,9}$/u, `${id}: ${l} "${w[l]}"`);
    }
  }
});

test('word games — baked story words match the data, and the helper loads before the game', () => {
  for (const slug of WORD_GAMES) {
    const html = readFileSync(`public/games/${slug}.html`, 'utf8');
    assert.equal((html.match(/<!-- STE_BOOK_VOCAB/g) || []).length, 1, `${slug}: expected one vocab block — run npm run patch:games`);
    const data = JSON.parse(/window\.STE_BOOK_VOCAB = (\{.*?\});<\/script>/s.exec(html)[1]);
    for (const b of books) {
      assert.deepEqual(data[b.id].words, bookVocab[b.id], `${slug}/${b.id}: words drifted`);
      assert.deepEqual(data[b.id].title, b.title, `${slug}/${b.id}: title drifted`);
    }
    const i18n = html.indexOf('/games/i18n.js'), vocab = html.indexOf('STE_BOOK_VOCAB ='), helper = html.indexOf('/games/book-words.js');
    const game = html.indexOf('STE_BOOK', helper + 1);
    assert.ok(i18n < vocab && vocab < helper && helper < game, `${slug}: load order must be i18n.js, data, book-words.js, game`);
    assert.match(html, /steAddBookButton\(/, `${slug}: game has no book mode`);
  }
});

test('word games — "Back to <book>" works from every book with story words', () => {
  for (const slug of WORD_GAMES) {
    const html = readFileSync(`public/games/${slug}.html`, 'utf8');
    const map = JSON.parse(/data-ste-from='([^']*)'/.exec(html)[1].replace(/&#39;/g, "'"));
    assert.deepEqual(Object.keys(map).sort(), books.map((b) => b.id).sort(), `${slug}: every book should be a source`);
    for (const b of books) assert.deepEqual(map[b.id].backTitles, b.title);
  }
});

test('word games — the helper and its label exist in every language', () => {
  assert.match(readFileSync('public/games/book-words.js', 'utf8'), /window\.STE_BOOK =/);
  assert.equal((readFileSync('public/games/i18n.js', 'utf8').match(/\bstoryWordsFrom:/g) || []).length, 3);
});

test('story worksheet — every book has the before/during/after prompts the worksheet prints', async () => {
  const { loadActivities } = await import('../../scripts/lib/catalog.mjs');
  const { activities } = await loadActivities();
  const ws = activities.find((a) => a.slug === 'story-worksheet');
  assert.ok(ws && ws.anyBook, 'story-worksheet must exist and accept any book');
  for (const b of books) {
    for (const stage of ['before', 'during', 'after']) {
      const q = (b.discussionQuestions ?? []).find((x) => x.stage === stage);
      assert.ok(q, `${b.id}: no "${stage}" prompt for the worksheet`);
      for (const l of ['en', 'es', 'fr']) assert.ok(q.prompt[l]?.trim(), `${b.id}: "${stage}" prompt missing ${l}`);
    }
  }
});
