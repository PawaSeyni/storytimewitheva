// Bookmark Designer book mode (docs/activities-audit-2026-11.md §7d): every book has a short
// line of its own, drawn from its catalog description, that fits the bookmark's text field.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCatalog, loadBookQuotes } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const { bookQuotes } = await loadBookQuotes();
const MAX = 30; // the Input's maxLength in BookmarkCraftsDemo

test('bookmark lines — one per book, three languages, within the bookmark text field', () => {
  assert.deepEqual(Object.keys(bookQuotes).sort(), books.map((b) => b.id).sort(), 'a line for every book, and no stray ids');
  for (const [id, q] of Object.entries(bookQuotes)) {
    for (const l of ['en', 'es', 'fr']) {
      const line = q[l] ?? '';
      assert.ok(line.trim().length >= 10, `${id} ${l}: too short`);
      assert.ok(line.length <= MAX, `${id} ${l}: "${line}" is ${line.length} chars, max ${MAX}`);
      assert.ok(!line.includes('—'), `${id} ${l}: em dash`);
    }
  }
  const src = readFileSync('src/demos/BookmarkCraftsDemo.tsx', 'utf8');
  assert.match(src, /useSourceBook\('bookmark-designer'\)/);
  assert.match(src, /maxLength=\{30\}/, 'the test cap must match the Input');
  assert.match(src, /quotes\[Math\.floor\(Math\.random\(\) \* quotes\.length\)\]/, '"Surprise me" draws from the book line too');
});
