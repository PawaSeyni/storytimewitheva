// Partially-shipped browser APIs (in-app WebViews, Android System WebView, private modes).
// Each case here was reproduced in Chromium with the API stubbed the way such a browser
// ships it, and threw a TypeError before the guard.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCompat, loadPreloadable } from '../../scripts/lib/catalog.mjs';

const { listen, isChunkLoadError, shouldReloadForChunkError, CHUNK_RELOAD_GAP_MS } = await loadCompat();
const { preloadable } = await loadPreloadable();

test('listen — a speechSynthesis without addEventListener does not throw at module load', () => {
  // The shape that threw "window.speechSynthesis.addEventListener is not a function".
  const partial = { getVoices: () => [], speak() {}, cancel() {} };
  assert.doesNotThrow(() => listen(partial, 'voiceschanged', () => {}));
  assert.equal(listen(partial, 'voiceschanged', () => {}), false);

  const withHandlerProp = { onvoiceschanged: null };
  const fn = () => {};
  assert.equal(listen(withHandlerProp, 'voiceschanged', fn), true);
  assert.equal(withHandlerProp.onvoiceschanged, fn);

  const calls = [];
  const target = { addEventListener: (type, f) => calls.push([type, f]) };
  assert.equal(listen(target, 'voiceschanged', fn), true);
  assert.deepEqual(calls, [['voiceschanged', fn]]);

  const hostile = { addEventListener() { throw new TypeError('Illegal invocation'); } };
  assert.equal(listen(hostile, 'voiceschanged', fn), false);
  for (const nothing of [undefined, null, 0, 'x']) assert.equal(listen(nothing, 'voiceschanged', fn), false);
});

test('speech.ts subscribes through the guard, never a bare addEventListener on speechSynthesis', () => {
  const src = readFileSync('src/lib/speech.ts', 'utf8');
  assert.ok(!/speechSynthesis\.addEventListener/.test(src), 'speech.ts calls speechSynthesis.addEventListener directly');
  assert.match(src, /listen\(window\.speechSynthesis, 'voiceschanged'/);
});

test('chunk-load errors are recognised in every engine wording', () => {
  for (const message of [
    'Failed to fetch dynamically imported module: https://storytimewitheva.com/assets/DemoPage-Ddl9ZUGB.js',
    'Importing a module script failed.',
    'error loading dynamically imported module: https://storytimewitheva.com/assets/x.js',
    'Unable to preload CSS for /assets/x.css',
  ]) assert.equal(isChunkLoadError(new TypeError(message)), true, message);
  assert.equal(isChunkLoadError(Object.assign(new Error('x'), { name: 'ChunkLoadError' })), true);
  assert.equal(isChunkLoadError(new TypeError("Cannot read properties of undefined (reading 'x')")), false);
  assert.equal(isChunkLoadError('Failed to fetch dynamically imported module'), false);
  assert.equal(isChunkLoadError(null), false);
});

test('chunk recovery reloads at most once per gap, so a chunk that is really gone cannot loop', () => {
  const now = 1_800_000_000_000;
  assert.equal(shouldReloadForChunkError(null, now), true);
  assert.equal(shouldReloadForChunkError(Number.NaN, now), true);
  assert.equal(shouldReloadForChunkError(now - 1000, now), false);
  assert.equal(shouldReloadForChunkError(now - CHUNK_RELOAD_GAP_MS - 1, now), true);
  assert.equal(shouldReloadForChunkError(now + 60_000, now), true); // clock moved back
});

test('a route chunk that fails to load is handed to recovery instead of rejecting into a blank page', async () => {
  const failure = new TypeError('Failed to fetch dynamically imported module: https://s.com/assets/DemoPage-x.js');
  const seen = [];
  const recovering = preloadable(() => Promise.reject(failure), (reason) => (seen.push(reason), true));
  const p = recovering();
  const outcome = await Promise.race([p.then(() => 'resolved', () => 'rejected'), new Promise((r) => setTimeout(() => r('pending'), 30))]);
  assert.equal(outcome, 'pending');
  assert.deepEqual(seen, [failure]);

  // When recovery declines (not a chunk error, or it already reloaded), the error surfaces as before.
  const declining = preloadable(() => Promise.reject(failure), () => false);
  const q = declining();
  await assert.rejects(q, failure);
  await new Promise((r) => setImmediate(r));
  assert.equal(q.status, 'rejected');
});

test('routeLoaders wires every route chunk through chunk recovery', () => {
  const src = readFileSync('src/routeLoaders.ts', 'utf8');
  assert.match(src, /settledLoader\(loader, recoverFromChunkError\)/);
  assert.ok(!/import \{ preloadable \} from/.test(src), 'routeLoaders imports the bare preloadable');
});
