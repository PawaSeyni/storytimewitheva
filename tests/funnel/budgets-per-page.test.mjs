// Per-page JavaScript budget (2026-11-18, docs/platform/PERFORMANCE_BUDGET_POLICY.md):
// what a visitor downloads is guarded per page; the site-wide total is only a loose ceiling.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const budgets = JSON.parse(readFileSync(new URL('../../budgets.json', import.meta.url), 'utf8'));
const checker = readFileSync(new URL('../../scripts/check-budgets.mjs', import.meta.url), 'utf8');

test('budgets.json has a per-page JavaScript budget below the site total', () => {
  const { perPageGzipKB: page, totalGzipKB: total, entryGzipKB: entry } = budgets.js;
  assert.ok(page && page.warn < page.fail, 'perPageGzipKB warn < fail');
  assert.ok(entry.fail < page.warn, 'a page always includes the entry chunk');
  assert.ok(page.fail < total.warn, 'one page is less than the whole site');
});

test('check-budgets enforces the per-page budget and follows static imports', () => {
  assert.match(checker, /B\.js\.perPageGzipKB/);
  assert.match(checker, /modulepreload|src\|href/);
  assert.match(checker, /depsOf/);
});
