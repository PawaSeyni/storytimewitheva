// Original songs in Rhyme & Sing-Along (docs/content/ARTWORK_AND_SONGS_BRIEF_2026-11.md):
// every book that links the sing-along has its own song, in three languages, and the game
// opens on it in book mode.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCatalog } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const html = readFileSync('public/games/rhyme-singalong.html', 'utf8');
const block = html.slice(html.indexOf('const songs = ['), html.indexOf('];', html.indexOf('const songs = [')) + 2);
const songs = new Function(`${block}; return songs;`)();

test('book songs — every book that links the sing-along has its own song', () => {
  const linking = books.filter((b) => (b.relatedActivityIds ?? []).includes('rhyme-singalong')).map((b) => b.id).sort();
  assert.ok(linking.length >= 4, 'cloud, rain, boat and Rainbow Symphony books');
  const withSong = songs.filter((s) => s.book).map((s) => s.book).sort();
  assert.deepEqual(withSong, linking, 'one song per linking book, and no song for a book that does not link it');
});

test('book songs — three languages, same shape, a localized title and the tune named', () => {
  for (const s of songs.filter((x) => x.book)) {
    for (const l of ['en', 'es', 'fr']) {
      assert.ok(Array.isArray(s[l]) && s[l].length >= 6, `${s.id}: ${l} lines`);
      assert.equal(s[l].length, s.en.length, `${s.id}: ${l} has a different number of lines`);
      assert.ok(s.titles[l]?.trim(), `${s.id}: title ${l}`);
      assert.match(s.subtitle[l], /·.*·/, `${s.id}: subtitle ${l} names the book and the tune`);
    }
    assert.ok(!s.en.join(' ').includes('—'), `${s.id}: em dash`);
  }
  assert.match(html, /songs\.findIndex\(function \(s\) \{ return s\.book === src; \}\)/, 'book mode opens on the book song');
});

test('sing-along lyrics follow ?lang= before the saved preference', () => {
  const html = readFileSync(new URL('../../public/games/rhyme-singalong.html', import.meta.url), 'utf8');
  assert.match(html, /\[\?&\]lang=\(\[a-z\]\{2\}\)/);
  assert.ok(html.indexOf('_qLang') < html.indexOf("localStorage.getItem('preferredLanguage')"));
});
