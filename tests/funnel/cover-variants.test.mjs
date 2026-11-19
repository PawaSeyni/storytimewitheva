// Small cover copies (site audit 2026-11-18, finding 1 / SW-023): every local cover has a 400 px
// copy, sizedCover() serves it for small displays, and BookCard offers both through srcset.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { build } from 'esbuild';
import { loadCatalog } from '../../scripts/lib/catalog.mjs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const out = await build({ entryPoints: [new URL('../../src/lib/covers.ts', import.meta.url).pathname], bundle: true, write: false, format: 'esm', platform: 'neutral' });
const { books } = await loadCatalog();
const covers = await import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);

test('every local cover file has a fresh 400 px copy (scripts/make-cover-variants.py --check)', () => {
  const files = readdirSync(new URL('../../public/covers', import.meta.url)).filter((f) => f.endsWith('.webp'));
  for (const f of files) assert.ok(existsSync(new URL(`../../public/covers/400/${f}`, import.meta.url)), `missing covers/400/${f}`);
  for (const b of books) for (const e of Object.values(b.editions || {})) {
    if (e.cover?.startsWith('/covers/')) assert.ok(existsSync(new URL(`../../public/covers/400${e.cover.slice('/covers'.length)}`, import.meta.url)), `no 400 px copy for ${e.cover}`);
  }
});
// Pure Node (CI has no Python imaging library): read each WebP's size from its header.
function webpSize(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (chunk === 'VP8L') { const b = buf.readUInt32LE(21); return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1]; }
  if (chunk === 'VP8X') return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
  return null;
}

test('each 400 px copy is a 400 x 400 WebP smaller than its original, with no orphans', () => {
  const dir = new URL('../../public/covers/', import.meta.url);
  const originals = new Set(readdirSync(dir).filter((f) => f.endsWith('.webp')));
  const copies = readdirSync(new URL('400/', dir)).filter((f) => f.endsWith('.webp'));
  assert.deepEqual(copies.filter((f) => !originals.has(f)), [], 'orphaned 400 px copies');
  for (const f of copies) {
    const small = readFileSync(new URL(`400/${f}`, dir));
    assert.deepEqual(webpSize(small), [400, 400], `${f} is not 400 x 400`);
    assert.ok(small.length < readFileSync(new URL(f, dir)).length, `${f}: copy is not smaller than the original`);
  }
});

test('sizedCover serves the 400 px copy for small local displays, the original above 400', () => {
  assert.equal(covers.sizedCover('/covers/mayas-shadow-es.webp', 240), '/covers/400/mayas-shadow-es.webp');
  assert.equal(covers.sizedCover('/covers/mayas-shadow-es.webp', 400), '/covers/400/mayas-shadow-es.webp');
  assert.equal(covers.sizedCover('/covers/mayas-shadow-es.webp', 466), '/covers/mayas-shadow-es.webp');
  assert.equal(covers.sizedCover('/images/other.png', 200), '/images/other.png');
  assert.equal(covers.sizedCover('https://m.media-amazon.com/images/I/71Zjj22p5sL.jpg', 330), 'https://m.media-amazon.com/images/I/71Zjj22p5sL._SX330_.jpg');
  assert.equal(covers.coverSrcSet('/covers/sanding-block-en.webp'), '/covers/400/sanding-block-en.webp 400w, /covers/sanding-block-en.webp 700w');
  assert.equal(covers.coverSrcSet('/images/other.png'), undefined);
});

test('callers go through sizedCover / coverSrcSet, not their own Amazon-only branch', () => {
  assert.match(read('src/components/BookCard.tsx'), /srcSet=\{cardSrcSet\}/);
  assert.match(read('src/components/BookCard.tsx'), /coverSrcSet\(book\.coverImage\)/);
  for (const f of ['src/components/ContinueReading.tsx', 'src/components/GuideNextStep.tsx', 'src/pages/ClassroomUnit.tsx', 'src/pages/Journey.tsx', 'src/pages/Search.tsx', 'src/pages/Classroom.tsx', 'src/demos/ReadingPassportDemo.tsx']) {
    assert.doesNotMatch(read(f), /isAmazonCover\([^)]*\)\s*\?\s*sizedCover/, f);
  }
});

test('post-deploy: only the commit title can opt out of the production check (SW-024)', () => {
  const wf = read('.github/workflows/post-deploy.yml');
  assert.doesNotMatch(wf, /contains\(github\.event\.head_commit\.message, '\[skip netlify\]'\)/);
  assert.match(wf, /head -n 1/);
  assert.equal((wf.match(/steps\.optout\.outputs\.skip != 'true'/g) || []).length, 2);
});
