// Catalog completeness guard. The book catalog (src/data/books.ts) is the single
// source of truth for per-language content: each book has an `editions` map with
// the per-language Amazon ASIN + cover, and localize() resolves them. These tests
// turn "content/catalog inconsistency across languages" from a silent bug into a
// failing build: every book must have an English edition, every cover a book
// declares must exist on disk, and no generated cover may be left unreferenced.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './_manifest.mjs';

const src = readFileSync(path.join(ROOT, 'src', 'data', 'books.ts'), 'utf8');
const pub = (p) => path.join(ROOT, 'public', p.replace(/^\//, ''));
const bookIds = [...src.matchAll(/^ {4}id: '([^']+)',/gm)].map((m) => m[1]);
const coverRefs = [...src.matchAll(/cover: '(\/covers\/[^']+)'/g)].map((m) => m[1]);

test('catalog — every book has an English edition with an ASIN', () => {
  assert.ok(bookIds.length > 0, 'no books parsed from books.ts');
  // Each book object contains exactly one `en: { asin: '...' , ... }` line.
  const enWithAsin = [...src.matchAll(/^ {6}en: \{ asin: '[^']+'/gm)].length;
  assert.equal(
    enWithAsin,
    bookIds.length,
    `every book needs editions.en with an asin — found ${enWithAsin} for ${bookIds.length} books`,
  );
});

test('catalog — every cover a book declares exists on disk and is non-empty', () => {
  // 19 self-hosted books × 3 languages = 57 (little-boats uses a remote URL cover).
  assert.ok(coverRefs.length >= 57, `expected the full per-language cover set, found ${coverRefs.length}`);
  for (const c of coverRefs) {
    assert.ok(existsSync(pub(c)) && statSync(pub(c)).size > 0, `book declares a missing/empty cover: ${c}`);
  }
});

test('catalog — no orphan covers (every public/covers file is referenced by a book)', () => {
  const referenced = new Set(coverRefs);
  for (const f of readdirSync(path.join(ROOT, 'public', 'covers')).filter((x) => x.endsWith('.webp'))) {
    assert.ok(referenced.has(`/covers/${f}`), `orphan cover not referenced by any book: /covers/${f}`);
  }
});
