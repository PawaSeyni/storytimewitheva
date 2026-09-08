// Catalog completeness guard. The catalog (src/data/books.data.ts) is the single
// source of truth for per-language content: each book has an `editions` map with the
// per-language Amazon ASIN + cover, and localize() resolves them. These tests turn
// "content/catalog inconsistency across languages" from a silent bug into a failing
// build: every book must have an English edition, every cover a book declares must
// exist on disk, and no generated cover may be left unreferenced.
//
// Sprint 3 S3-004: this asserts against the REAL catalog objects loaded through the
// build-safe projection (scripts/lib/catalog.mjs) — no regex parsing of source.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './_manifest.mjs';
import { loadCatalog } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const pub = (p) => path.join(ROOT, 'public', p.replace(/^\//, ''));
const localCovers = books.flatMap((b) =>
  Object.values(b.editions)
    .map((e) => e?.cover)
    .filter((c) => typeof c === 'string' && c.startsWith('/covers/')),
);

test('catalog — every book has an English edition with an ASIN', () => {
  assert.ok(books.length > 0, 'catalog projection returned no books');
  for (const b of books) {
    assert.ok(b.editions?.en, `${b.id}: missing editions.en`);
    assert.ok(b.editions.en.asin, `${b.id}: editions.en has no asin`);
  }
});

test('catalog — every cover a book declares exists on disk and is non-empty', () => {
  assert.ok(localCovers.length >= 57, `expected the full per-language cover set, found ${localCovers.length}`);
  for (const c of localCovers) {
    assert.ok(existsSync(pub(c)) && statSync(pub(c)).size > 0, `book declares a missing/empty cover: ${c}`);
  }
});

test('catalog — no orphan covers (every public/covers file is referenced by a book)', () => {
  const referenced = new Set(localCovers);
  for (const f of readdirSync(path.join(ROOT, 'public', 'covers')).filter((x) => x.endsWith('.webp'))) {
    assert.ok(referenced.has(`/covers/${f}`), `orphan cover not referenced by any book: /covers/${f}`);
  }
});
