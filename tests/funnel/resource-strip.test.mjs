// The shared resource strip on book pages (B-03).
//
// relatedResourceIds stays EMPTY on purpose: all ten resources are general reading
// guidance with no theme, age or title reference, so per-book pairing would invent a
// signal that does not exist. These tests keep the shared set honest instead.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCatalog, loadResources } from '../../scripts/lib/catalog.mjs';

const { resources } = await loadResources();
const { books } = await loadCatalog();
const ids = new Set(resources.map((r) => r.id));

const strip = readFileSync(new URL('../../src/components/ResourceStrip.tsx', import.meta.url), 'utf8');
const shared = [...strip.matchAll(/^\s*'([a-z-]+-[a-z-]+)',/gm)].map((m) => m[1]);

test('resource strip — every shared id resolves to a real resource', () => {
  assert.ok(shared.length >= 3, `expected at least 3 shared resources, parsed ${shared.length}`);
  for (const id of shared) assert.ok(ids.has(id), `ResourceStrip references unknown resource "${id}"`);
  assert.equal(new Set(shared).size, shared.length, 'duplicate id in the shared set');
});

test('resource strip — shared resources are complete in EN, FR and ES', () => {
  for (const id of shared) {
    const r = resources.find((x) => x.id === id);
    for (const lang of ['en', 'es', 'fr']) {
      assert.ok(r.title?.[lang]?.trim(), `${id}: missing ${lang} title`);
      assert.ok(r.description?.[lang]?.trim(), `${id}: missing ${lang} description`);
    }
  }
});

test('resource strip — relatedResourceIds stays empty while the strip is shared', () => {
  // If someone populates relatedResourceIds, the strip is the wrong model and this
  // test should be replaced deliberately, not deleted quietly.
  for (const b of books) {
    assert.equal(
      (b.relatedResourceIds ?? []).length, 0,
      `${b.id}: relatedResourceIds populated — B-03 decided on a SHARED strip instead; revisit docs/PUNCH_LIST.md B-03 before changing this`,
    );
  }
});
