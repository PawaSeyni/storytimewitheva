// S7-014: the committed ecosystem inventory is current and the check gate really rejects.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { ROOT } from './_manifest.mjs';
import { loadResources, loadContentIndex } from '../../scripts/lib/catalog.mjs';

test('inventory — committed docs/content-inventory.md is current (gen:content is a no-op)', () => {
  execSync('npm run --silent gen:content', { cwd: ROOT, stdio: 'pipe' });
  const diff = execSync('git status --porcelain docs/content-inventory.md', { cwd: ROOT }).toString().trim();
  assert.equal(diff, '', 'docs/content-inventory.md is stale — run `npm run gen:content` and commit');
});

test('inventory — the check gate passes on the current content', () => {
  const out = execSync('npm run --silent check:content', { cwd: ROOT, stdio: 'pipe' }).toString();
  assert.match(out, /check: 0 errors/);
});

test('guides — every parent guide names valid themes and printables, and derives at least two stories (S7-006)', async () => {
  const { resources } = await loadResources();
  const idx = await loadContentIndex();
  const guides = resources.filter((r) => r.kind === 'article');
  assert.equal(guides.length, 6);
  for (const g of guides) {
    assert.ok(g.relatedThemeIds?.length >= 1, `${g.id}: no themes`);
    const books = new Set(g.relatedThemeIds.flatMap((t) => idx.booksByThemeId[t] ?? []));
    assert.ok(books.size >= 2, `${g.id}: fewer than two stories derive from its themes`);
    for (const rid of g.relatedResourceIds ?? []) {
      const r = resources.find((x) => x.id === rid);
      assert.ok(r, `${g.id}: unknown resource ${rid}`);
      assert.ok(r.kind === 'download', `${g.id}: pairs with a non-printable ${rid}`);
    }
  }
  for (const d of resources.filter((r) => r.kind === 'download')) assert.equal(d.relatedThemeIds, undefined, `${d.id}: downloads carry no guide links`);
});
