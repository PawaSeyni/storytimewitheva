// PD-04 — the route-chunk preload helper. React 19's use() reads a promise synchronously
// only when it carries status/value, so these fields are the whole contract.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPreloadable } from '../../scripts/lib/catalog.mjs';

const { preloadable } = await loadPreloadable();

test('one promise per loader: repeated calls never start a second import', async () => {
  let calls = 0;
  const load = preloadable(async () => { calls++; return { default: 'Page' }; });
  const a = load();
  const b = load();
  assert.equal(a, b);
  await a;
  load();
  assert.equal(calls, 1);
});

test('a settled promise carries the fields use() reads synchronously', async () => {
  const load = preloadable(() => Promise.resolve({ default: 'Page' }));
  const p = load();
  assert.equal(p.status, 'pending');
  await p;
  assert.equal(p.status, 'fulfilled');
  assert.deepEqual(p.value, { default: 'Page' });
});

test('a failed chunk load is dropped so the next call retries the import', async () => {
  let attempt = 0;
  const load = preloadable(() => (++attempt === 1 ? Promise.reject(new Error('offline')) : Promise.resolve({ default: 'Page' })));
  const first = load();
  await first.catch(() => {});
  await new Promise((r) => setImmediate(r));
  assert.equal(first.status, 'rejected');
  assert.equal(String(first.reason.message), 'offline');
  const second = load();
  assert.notEqual(second, first);
  await second;
  assert.equal(second.status, 'fulfilled');
  assert.equal(attempt, 2);
});
