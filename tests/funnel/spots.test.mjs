// Spot illustrations on the Studio printables (docs/content/ARTWORK_AND_SONGS_BRIEF_2026-11.md §4):
// every listed spot is a real book with a real, small file, and every Studio printable can show one.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { build } from 'esbuild';
import { loadCatalog } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const b = await build({ entryPoints: ['src/data/spots.ts'], bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent' });
const { SPOT_BOOK_IDS, spotFor } = await import(`data:text/javascript;base64,${Buffer.from(b.outputFiles[0].text).toString('base64')}`);

test('spots — one small file per listed book, and no stray files', () => {
  for (const id of SPOT_BOOK_IDS) {
    assert.ok(books.some((x) => x.id === id), `${id}: not a book`);
    const size = statSync(`public/spots/${id}.webp`).size;
    assert.ok(size > 2000 && size < 60000, `${id}: ${size} bytes`);
    assert.equal(spotFor(id), `/spots/${id}.webp`);
  }
  assert.deepEqual(readdirSync('public/spots').map((f) => f.replace('.webp', '')).sort(), [...SPOT_BOOK_IDS].sort());
  assert.ok(SPOT_BOOK_IDS.length >= 19);
  assert.equal(spotFor('no-such-book'), null);
});

test('spots — the Studio printable card renders the paired book\'s spot', () => {
  const src = readFileSync('src/demos/studio/StudioFrame.tsx', 'utf8');
  assert.match(src, /data-studio-spot/);
  assert.match(src, /bookIds\.map\(\(id\) => spotFor\(id\)\)/);
});
