// src/lib/storage.ts — the centralized storage adapter (Sprint 6 S6-012, S6-016).
//
// Compiled with esbuild and driven against a fake localStorage, so the failure modes the
// spec names (denied access, quota, malformed JSON, unavailable API, write failure) are
// exercised for real instead of being asserted about in prose.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({
  entryPoints: ['src/lib/storage.ts'],
  bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent',
});
const CODE = bundle.outputFiles[0].text;

/** Fresh module instance per scenario — availability is cached deliberately. */
async function load({ mode = 'ok', seed = {} } = {}) {
  const store = new Map(Object.entries(seed));
  const ls = {
    getItem: (k) => {
      if (mode === 'denied') throw new Error('SecurityError');
      return store.has(k) ? store.get(k) : null;
    },
    setItem: (k, v) => {
      if (mode === 'denied' || mode === 'readonly') throw new Error('QuotaExceededError');
      if (mode === 'quota' && !k.includes('__probe')) throw new Error('QuotaExceededError');
      store.set(k, v);
    },
    removeItem: (k) => {
      if (mode === 'denied') throw new Error('SecurityError');
      store.delete(k);
    },
    key: (i) => [...store.keys()][i] ?? null,
    get length() { return store.size; },
  };
  globalThis.window = { localStorage: ls };
  const mod = await import(`data:text/javascript;base64,${Buffer.from(CODE).toString('base64')}#${Math.random()}`);
  mod.resetAvailabilityCache();
  return { mod, store };
}

const isNums = (v) => Array.isArray(v) && v.every((n) => typeof n === 'number');
const isObj = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

beforeEach(() => { delete globalThis.window; });

test('storage — round-trips namespaced, versioned state', async () => {
  const { mod, store } = await load();
  assert.equal(mod.available(), true);
  assert.equal(mod.set('lib', [1, 2, 3]), true);
  assert.deepEqual(mod.get('lib', isNums), [1, 2, 3]);
  const [key, raw] = [...store.entries()].find(([k]) => k.includes('lib'));
  assert.equal(key, 'ste:lib', 'must be namespaced');
  const env = JSON.parse(raw);
  assert.equal(env.v, 1, 'must be versioned');
  assert.ok(env.updatedAt, 'must be timestamped');
});

test('storage — a wrong version is discarded, never coerced', async () => {
  // Reinterpreting someone else's data under a new schema is worse than forgetting it.
  const { mod } = await load({ seed: { 'ste:lib': JSON.stringify({ v: 99, data: [1] }) } });
  assert.equal(mod.get('lib', isNums), null);
});

test('storage — malformed JSON and wrong shapes return null, not a throw', async () => {
  const { mod } = await load({
    seed: { 'ste:a': '{not json', 'ste:b': JSON.stringify({ v: 1, data: 'nope' }), 'ste:c': 'null' },
  });
  assert.equal(mod.get('a', isNums), null);
  assert.equal(mod.get('b', isNums), null, 'validator must reject the payload');
  assert.equal(mod.get('c', isNums), null);
});

test('storage — denied access degrades to in-memory and never throws', async () => {
  // Enterprise policy / Safari Private Mode: every call raises.
  const { mod } = await load({ mode: 'denied' });
  assert.equal(mod.available(), false);
  assert.equal(mod.set('lib', [7]), false, 'reports that it did not persist');
  assert.deepEqual(mod.get('lib', isNums), [7], 'but the session still works');
  assert.equal(mod.remove('lib'), false);
  assert.equal(mod.get('lib', isNums), null, 'and removal still takes effect in memory');
});

test('storage — quota exhaustion reports failure and keeps the session consistent', async () => {
  const { mod } = await load({ mode: 'quota' });
  assert.equal(mod.set('lib', [1]), false);
  assert.deepEqual(mod.get('lib', isNums), [1]);
});

test('storage — a missing window (SSR/prerender) is not an error', async () => {
  delete globalThis.window;
  const mod = await import(`data:text/javascript;base64,${Buffer.from(CODE).toString('base64')}#${Math.random()}`);
  mod.resetAvailabilityCache();
  assert.equal(mod.available(), false);
  assert.equal(mod.get('x', isNums), null);
  assert.equal(mod.set('x', [1]), false);
});

test('storage — clearNamespace removes only namespaced keys', async () => {
  // A clear-my-data control must not delete the games' storage as a side effect.
  const { mod, store } = await load({
    seed: { 'ste:lib': JSON.stringify({ v: 1, data: [1] }), readingProgress: '{}', unrelated: 'x' },
  });
  assert.equal(mod.clearNamespace(), true);
  assert.equal(store.has('ste:lib'), false);
  assert.equal(store.has('readingProgress'), true, 'shared key survived');
  assert.equal(store.has('unrelated'), true, 'unrelated origin data survived');
});

test('storage — namespacedKeys lists what is held, for a privacy screen', async () => {
  const { mod } = await load({
    seed: { 'ste:a': JSON.stringify({ v: 1, data: [] }), 'ste:b': JSON.stringify({ v: 1, data: [] }), other: '1' },
  });
  assert.deepEqual(mod.namespacedKeys(), ['a', 'b']);
});

test('storage — shared keys stay raw and unversioned (the games read them)', async () => {
  // All 12 standalone games write `readingProgress` directly. Wrapping or namespacing it
  // would not fail loudly, it would silently orphan every "Mark Completed" tap.
  const { mod, store } = await load();
  mod.setShared(mod.SHARED_KEYS.progress, { activitiesCompleted: ['matching'] });
  assert.ok(store.has('readingProgress'), 'must use the exact legacy key');
  assert.equal(JSON.parse(store.get('readingProgress')).v, undefined, 'no envelope');
  assert.deepEqual(mod.getShared(mod.SHARED_KEYS.progress, isObj), { activitiesCompleted: ['matching'] });
});

test('storage — a game writing the legacy key is read back unchanged', async () => {
  const written = JSON.stringify({ booksRead: [], booksWantToRead: [], activitiesCompleted: ['spelling-bee'] });
  const { mod } = await load({ seed: { readingProgress: written } });
  assert.deepEqual(mod.getShared('readingProgress', isObj).activitiesCompleted, ['spelling-bee']);
});

test('storage — bare-string shared keys work (preferredLanguage is not JSON)', async () => {
  const { mod, store } = await load();
  mod.setSharedString(mod.SHARED_KEYS.language, 'fr');
  assert.equal(store.get('preferredLanguage'), 'fr', 'games i18n.js reads a bare string');
  assert.equal(mod.getSharedString(mod.SHARED_KEYS.language), 'fr');
});

test('storage — list hygiene helpers', async () => {
  const { mod } = await load();
  assert.deepEqual(mod.dedupe(['a', 'b', 'a']), ['a', 'b']);
  assert.deepEqual(mod.capList(['a', 'b', 'c'], 2), ['a', 'b']);
  assert.deepEqual(mod.capList(['a'], 5), ['a']);
  assert.deepEqual(mod.pruneMissing(['a', 'gone'], (id) => id === 'a'), ['a']);
});

test('storage — non-serializable values fail cleanly', async () => {
  const { mod } = await load();
  const cyclic = {};
  cyclic.self = cyclic;
  assert.equal(mod.set('bad', cyclic), false);
});

test('storage — the SPA and the standalone games agree on the shared key name', async () => {
  // THE cross-boundary contract. scripts/patch-games.mjs injects a progress-sync block
  // into all 12 games that writes this key directly. If the SPA ever renames it, every
  // "Mark Completed" tap would be silently orphaned rather than failing loudly, so the
  // two sides are compared here instead of trusted to stay in step.
  const { readFileSync, readdirSync } = await import('node:fs');
  const { mod } = await load();
  const expected = mod.SHARED_KEYS.progress;

  const games = readdirSync('public/games').filter((f) => f.endsWith('.html'));
  const writers = games.filter((f) => readFileSync(`public/games/${f}`, 'utf8').includes('STE_PROGRESS_SYNC'));
  assert.ok(writers.length >= 10, `expected the sync block in most games, found ${writers.length}`);
  for (const f of writers) {
    const html = readFileSync(`public/games/${f}`, 'utf8');
    const m = /var KEY = '([^']+)'/.exec(html);
    assert.ok(m, `${f}: progress-sync block has no KEY`);
    assert.equal(m[1], expected, `${f} writes "${m[1]}" but the SPA reads "${expected}"`);
  }

  // and the injector itself
  const patcher = readFileSync('scripts/patch-games.mjs', 'utf8');
  assert.ok(patcher.includes(`'${expected}'`), `scripts/patch-games.mjs no longer injects ${expected}`);
});

test('storage — the games and the SPA agree on the language key too', async () => {
  const { readFileSync } = await import('node:fs');
  const { mod } = await load();
  const i18n = readFileSync('public/games/i18n.js', 'utf8');
  assert.ok(
    i18n.includes(`'${mod.SHARED_KEYS.language}'`),
    `public/games/i18n.js does not read ${mod.SHARED_KEYS.language}`,
  );
});
