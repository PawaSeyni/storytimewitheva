// R-06 — the seasonal rebuild workflow's cron lines must match the collection windows:
// a build on the day a window opens and on the day after it closes, 00:30 UTC. Change a
// window in src/data/collections.ts and this test names the cron line to change.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCollections } from '../../scripts/lib/catalog.mjs';

const { collections } = await loadCollections();
const seasonal = collections.filter((c) => c.window);
const yml = readFileSync('.github/workflows/seasonal-rebuild.yml', 'utf8');
const crons = [...yml.matchAll(/cron: '([^']+)'/g)].map((m) => m[1]);

const cronFor = (month, day) => `30 0 ${day} ${month} *`;
const dayAfter = (mmdd) => {
  const [m, d] = mmdd.split('-').map(Number);
  const next = new Date(Date.UTC(2026, m - 1, d + 1)); // 2026 is not a leap year; windows never end on 02-28
  return [next.getUTCMonth() + 1, next.getUTCDate()];
};

test('seasonal rebuild — one cron line per window boundary, nothing else', () => {
  assert.ok(seasonal.length >= 3, 'expected the seasonal collections');
  const expected = new Set();
  for (const c of seasonal) {
    const [fm, fd] = c.window.from.split('-').map(Number);
    expected.add(cronFor(fm, fd));
    const [tm, td] = dayAfter(c.window.to);
    expected.add(cronFor(tm, td));
  }
  assert.deepEqual([...crons].sort(), [...expected].sort(), 'cron lines must equal the window boundaries');
});

test('seasonal rebuild — the workflow triggers the build hook and checks the live sitemap', () => {
  assert.ok(yml.includes('secrets.NETLIFY_BUILD_HOOK'), 'build hook secret');
  assert.ok(yml.includes('indexableCollectionIds'), 'sitemap check against the calendar');
  assert.ok(yml.includes('workflow_dispatch'), 'manual trigger for the drill');
});
