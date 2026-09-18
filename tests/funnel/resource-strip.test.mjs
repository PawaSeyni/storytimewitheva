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

test('resource save controls — the save id is the registry id, never a hand-built literal', () => {
  // Every save control (guide cards on /resources, the guide page header, the printables)
  // passes the registry record's own id. The kind-prefixed id scheme is what keeps the
  // article `follow-up-activities` and the download `follow-up-activities` apart, so lock
  // both halves: the scheme itself, and that the pages read it rather than rebuilding it.
  for (const r of resources) {
    assert.equal(r.id, `${r.kind}-${r.slug}`, `${r.id} is not "${r.kind}-${r.slug}"`);
    assert.ok(ids.has(`${r.kind}-${r.slug}`));
  }
  const index = readFileSync('src/pages/Resources.tsx', 'utf8');
  const article = readFileSync('src/pages/Article.tsx', 'utf8');
  assert.ok(index.includes('resourceId={r.id}'), 'Resources.tsx must pass the registry id to the save control');
  assert.ok(article.includes('resourceId={resource.id}'), 'Article.tsx must pass the registry id to the save control');
  for (const [name, src] of [['Resources.tsx', index], ['Article.tsx', article]]) {
    assert.ok(!/resourceId="(article|download)-[a-z-]+"/.test(src), `${name}: a hardcoded resource id appeared; use the registry record`);
    assert.ok(!src.includes('`article-${'), `${name}: rebuilds the id from a slug instead of reading the registry`);
  }
});
