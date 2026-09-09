// Journey progress (Sprint 7 S7-010) — local, advisory, pruned on read.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({ entryPoints: ['src/lib/journeyProgress.ts'], bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent' });
const CODE = bundle.outputFiles[0].text;
async function load({ seed = {}, denied = false } = {}) {
  const store = new Map(Object.entries(seed)); const events = [];
  globalThis.window = { localStorage: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => { if (denied) throw new Error('SecurityError'); store.set(k, v); }, removeItem: (k) => store.delete(k), key: (i) => [...store.keys()][i] ?? null, get length() { return store.size; } }, dispatchEvent: (e) => events.push(e.type), addEventListener: () => {}, removeEventListener: () => {} };
  globalThis.CustomEvent = class { constructor(t) { this.type = t; } };
  const mod = await import(`data:text/javascript;base64,${Buffer.from(CODE).toString('base64')}#${Math.random()}`);
  return { mod, store, events };
}
beforeEach(() => { delete globalThis.window; });
const STEPS = ['j-1', 'j-2', 'j-3'];

test('progress — toggle, persist, and resume at the first incomplete step', async () => {
  const { mod, store } = await load();
  mod.toggleStep('j', 'j-1', STEPS);
  let p = mod.loadProgress('j', STEPS);
  assert.deepEqual(p.completedStepIds, ['j-1']); assert.equal(p.lastStepId, 'j-1');
  assert.equal(mod.nextIncompleteStepId(p, STEPS), 'j-2');
  assert.ok(store.has('ste:journey:j'), 'namespaced, versioned key');
  mod.toggleStep('j', 'j-1', STEPS);
  assert.deepEqual(mod.loadProgress('j', STEPS).completedStepIds, [], 'toggles off');
});

test('progress — step ids no longer in the journey are dropped on READ', async () => {
  const { mod } = await load({ seed: { 'ste:journey:j': JSON.stringify({ v: 1, updatedAt: 'x', data: { version: 1, journeyId: 'j', completedStepIds: ['j-1', 'j-old'], lastStepId: 'j-old', updatedAt: 'x' } }) } });
  const p = mod.loadProgress('j', STEPS);
  assert.deepEqual(p.completedStepIds, ['j-1']); assert.equal(p.lastStepId, undefined);
});

test('progress — an unknown step id is ignored, not stored', async () => {
  const { mod } = await load();
  mod.toggleStep('j', 'j-nope', STEPS);
  assert.deepEqual(mod.loadProgress('j', STEPS).completedStepIds, []);
});

test('progress — works in memory when storage is denied', async () => {
  const { mod } = await load({ denied: true });
  mod.toggleStep('j', 'j-2', STEPS);
  assert.deepEqual(mod.loadProgress('j', STEPS).completedStepIds, ['j-2']);
});

test('progress — reset removes everything and notifies', async () => {
  const { mod, store, events } = await load();
  mod.toggleStep('j', 'j-1', STEPS); mod.resetProgress('j');
  assert.equal(store.has('ste:journey:j'), false); assert.ok(events.includes('journeychange'));
});
