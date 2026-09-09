// Personal reading library (Sprint 6 S6-001 … S6-004).
//
// Compiled and driven against a fake localStorage, so migration, caps, dedup, pruning and
// the blocked-storage path are exercised rather than described.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({
  entryPoints: ['src/lib/personalLibrary.ts'],
  bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent',
});
const CODE = bundle.outputFiles[0].text;

async function load({ seed = {}, mode = 'ok' } = {}) {
  const store = new Map(Object.entries(seed));
  const events = [];
  globalThis.window = {
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => {
        if (mode === 'denied' && !k.includes('__probe')) throw new Error('QuotaExceededError');
        if (mode === 'denied') throw new Error('SecurityError');
        store.set(k, v);
      },
      removeItem: (k) => store.delete(k),
      key: (i) => [...store.keys()][i] ?? null,
      get length() { return store.size; },
    },
    dispatchEvent: (e) => events.push(e.type ?? 'event'),
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  globalThis.CustomEvent = class { constructor(type) { this.type = type; } };
  const mod = await import(`data:text/javascript;base64,${Buffer.from(CODE).toString('base64')}#${Math.random()}`);
  return { mod, store, events };
}

beforeEach(() => { delete globalThis.window; });

const envelope = (data) => JSON.stringify({ v: 1, updatedAt: 'x', data });

test('library — migrates the legacy two-state arrays exactly once', async () => {
  const { mod, store } = await load({
    seed: { readingProgress: JSON.stringify({ booksRead: ['a'], booksWantToRead: ['b'], activitiesCompleted: ['matching'] }) },
  });
  const s = mod.loadLibrary();
  assert.equal(mod.getStatus(s, 'a'), 'read');
  assert.equal(mod.getStatus(s, 'b'), 'want-to-read');
  assert.ok(store.has('ste:personalization'), 'migration persisted so it does not re-run');
  // the legacy key is left untouched: the games still own activitiesCompleted
  assert.deepEqual(JSON.parse(store.get('readingProgress')).activitiesCompleted, ['matching']);
});

test('library — a book in both legacy arrays becomes read, the stronger claim', async () => {
  const { mod } = await load({
    seed: { readingProgress: JSON.stringify({ booksRead: ['a'], booksWantToRead: ['a'] }) },
  });
  assert.equal(mod.getStatus(mod.loadLibrary(), 'a'), 'read');
});

test('library — migration does not resurrect a later removal', async () => {
  // The trap: legacy says 'read', the user then cleared it. Re-migrating would undo that.
  const { mod, store } = await load({
    seed: {
      readingProgress: JSON.stringify({ booksRead: ['a'] }),
      'ste:personalization': envelope({ version: 1, updatedAt: 'x', library: {}, recentlyExplored: [], savedResourceIds: [], savedJourneyIds: [] }),
    },
  });
  assert.equal(mod.getStatus(mod.loadLibrary(), 'a'), null, 'must not re-import once the envelope exists');
  assert.ok(store.has('readingProgress'));
});

test('library — three states, and toggling the same status clears it', async () => {
  const { mod } = await load();
  for (const st of ['want-to-read', 'reading', 'read']) {
    mod.setStatus('a', st);
    assert.equal(mod.getStatus(mod.loadLibrary(), 'a'), st);
  }
  mod.setStatus('a', null);
  assert.equal(mod.getStatus(mod.loadLibrary(), 'a'), null);
});

test('library — clearing a status does not un-favorite the book', async () => {
  const { mod } = await load();
  mod.setStatus('a', 'reading');
  mod.toggleFavorite('a');
  mod.setStatus('a', null);
  const s = mod.loadLibrary();
  assert.equal(mod.getStatus(s, 'a'), null);
  assert.equal(mod.isFavorite(s, 'a'), true, 'favorite survived the status clear');
});

test('library — un-favoriting a book with no status forgets it entirely', async () => {
  const { mod } = await load();
  mod.toggleFavorite('a');
  assert.equal(mod.isFavorite(mod.loadLibrary(), 'a'), true);
  mod.toggleFavorite('a');
  assert.deepEqual(Object.keys(mod.loadLibrary().library), [], 'no empty entry left behind');
});

test('library — continue reading returns the most recent "reading" book', async () => {
  const { mod } = await load();
  mod.setStatus('older', 'reading');
  await new Promise((r) => setTimeout(r, 5));
  mod.setStatus('newer', 'reading');
  mod.setStatus('done', 'read');
  assert.equal(mod.continueReadingId(mod.loadLibrary()), 'newer');
});

test('library — continue reading is null when nothing is in progress', async () => {
  const { mod } = await load();
  mod.setStatus('a', 'read');
  assert.equal(mod.continueReadingId(mod.loadLibrary()), null);
});

test('library — recently explored dedupes, orders newest first, and caps', async () => {
  const { mod } = await load();
  for (let i = 0; i < mod.RECENTLY_EXPLORED_CAP + 5; i++) mod.recordExplored(`b${i}`);
  mod.recordExplored('b0'); // revisit an old one
  const s = mod.loadLibrary();
  assert.equal(s.recentlyExplored.length, mod.RECENTLY_EXPLORED_CAP, 'capped');
  assert.equal(s.recentlyExplored[0].bookId, 'b0', 'revisit moves to the front');
  const ids = s.recentlyExplored.map((r) => r.bookId);
  assert.equal(new Set(ids).size, ids.length, 'no duplicates');
});

test('library — recently explored prunes ids the catalog no longer has, at READ time', async () => {
  const { mod } = await load();
  mod.recordExplored('kept');
  mod.recordExplored('retired');
  const ids = mod.recentlyExploredIds(mod.loadLibrary(), (id) => id === 'kept');
  assert.deepEqual(ids, ['kept']);
});

test('library — recently explored can exclude the page you are on', async () => {
  const { mod } = await load();
  mod.recordExplored('a');
  mod.recordExplored('b');
  assert.deepEqual(mod.recentlyExploredIds(mod.loadLibrary(), () => true, 'b'), ['a']);
});

test('library — corrupt envelope falls back to empty rather than throwing', async () => {
  const { mod } = await load({ seed: { 'ste:personalization': '{not json' } });
  const s = mod.loadLibrary();
  assert.deepEqual(s.library, {});
});

test('library — works with storage denied, in memory, without throwing', async () => {
  const { mod } = await load({ mode: 'denied' });
  mod.setStatus('a', 'reading');
  assert.equal(mod.getStatus(mod.loadLibrary(), 'a'), 'reading', 'session still works');
  assert.equal(mod.continueReadingId(mod.loadLibrary()), 'a');
});

test('library — stores no catalog content, only ids and minimal state', async () => {
  // Sprint 6 §5: never a second copy of catalog content, no titles, no identity.
  const { mod, store } = await load();
  mod.setStatus('mayas-shadow', 'read');
  mod.toggleFavorite('mayas-shadow');
  mod.recordExplored('mayas-shadow');
  const raw = store.get('ste:personalization');
  for (const f of ['title', 'coverImage', 'description', 'amazonUrl', 'email']) {
    assert.ok(!raw.includes(f), `envelope contains "${f}"`);
  }
});

test('library — counts summarize what the device holds, for the privacy screen', async () => {
  const { mod } = await load();
  mod.setStatus('a', 'read');
  mod.setStatus('b', 'reading');
  mod.setStatus('c', 'want-to-read');
  mod.toggleFavorite('a');
  mod.recordExplored('z');
  assert.deepEqual(mod.libraryCounts(mod.loadLibrary()), {
    read: 1, reading: 1, wantToRead: 1, favorites: 1, recentlyExplored: 1,
  });
});
