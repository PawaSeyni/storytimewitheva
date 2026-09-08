// public/games/i18n.js — the standalone games' localization (C6-04).
//
// The games are vanilla HTML outside the SPA and outside Vite, so nothing else covers
// them. Rather than grepping the source, this EVALUATES the real file against a DOM
// stub, so the assertions are about behaviour.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const SRC = readFileSync(new URL('../../public/games/i18n.js', import.meta.url), 'utf8');

/** Minimal DOM: only what i18n.js touches. */
function run({ search = '', stored = null, links = [], i18nNodes = [], storageThrows = false } = {}) {
  const nodes = i18nNodes.map((key) => ({ getAttribute: (a) => (a === 'data-i18n' ? key : null), textContent: '' }));
  const anchors = links.map((href) => {
    const attrs = { href };
    return {
      getAttribute: (a) => (a in attrs ? attrs[a] : null),
      setAttribute: (a, v) => { attrs[a] = v; },
      set textContent(v) { attrs.text = v; },
      get textContent() { return attrs.text; },
      get href() { return attrs.href; },
    };
  });
  const ctx = {
    window: { location: { search } },
    document: {
      readyState: 'complete',
      documentElement: {},
      querySelectorAll: (sel) => (sel === '[data-i18n]' ? nodes : sel === 'a[href^="/"]' ? anchors : []),
      addEventListener: () => {},
    },
    localStorage: {
      getItem: () => { if (storageThrows) throw new Error('blocked'); return stored; },
    },
  };
  ctx.window.localStorage = ctx.localStorage;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(SRC, ctx);
  return { lang: ctx.window.GAME_LANG, t: ctx.window.t, anchors, nodes };
}

test('games i18n — ?lang= wins over localStorage', () => {
  // The whole point of the fix: the SPA writes preferredLanguage ONLY when someone clicks
  // the switcher, so a reader arriving from a search result has nothing stored.
  assert.equal(run({ search: '?lang=fr', stored: null }).lang, 'fr');
  assert.equal(run({ search: '?lang=es', stored: 'fr' }).lang, 'es', '?lang must win over storage');
});

test('games i18n — falls back to stored preference, then English', () => {
  assert.equal(run({ search: '', stored: 'fr' }).lang, 'fr');
  assert.equal(run({ search: '', stored: null }).lang, 'en');
  assert.equal(run({ search: '?lang=de', stored: null }).lang, 'en', 'unknown language must not be trusted');
  assert.equal(run({ search: '?lang=../x', stored: null }).lang, 'en', 'junk must not be trusted');
});

test('games i18n — survives blocked storage', () => {
  // Private mode / storage disabled must not break the page.
  assert.equal(run({ search: '?lang=fr', storageThrows: true }).lang, 'fr');
  assert.equal(run({ search: '', storageThrows: true }).lang, 'en');
});

test('games i18n — site links return the reader to their own language', () => {
  const { anchors } = run({ search: '?lang=fr', links: ['/', '/books', '/activities', '/games/matching.html', '/fr/books'] });
  assert.equal(anchors[0].href, '/fr', 'root link');
  assert.equal(anchors[1].href, '/fr/books');
  assert.equal(anchors[2].href, '/fr/activities');
  assert.equal(anchors[3].href, '/games/matching.html', 'game links stay shared and unprefixed');
  assert.equal(anchors[4].href, '/fr/books', 'an already-prefixed link must not be double-prefixed');
});

test('games i18n — nav labels localize with their hrefs', () => {
  const { anchors } = run({ search: '?lang=es', links: ['/books', '/about'] });
  assert.equal(anchors[0].textContent, 'Libros');
  assert.equal(anchors[1].textContent, 'Sobre Eva');
});

test('games i18n — English leaves every link untouched', () => {
  const { anchors } = run({ search: '', links: ['/', '/books'] });
  assert.equal(anchors[0].href, '/');
  assert.equal(anchors[1].href, '/books');
});

test('games i18n — chrome strings resolve per language', () => {
  assert.equal(run({ search: '?lang=fr' }).t('playAgain'), '🔄 Rejouer !');
  assert.equal(run({ search: '?lang=es' }).t('print'), '🖨️ Imprimir');
  assert.equal(run({ search: '?lang=fr' }).t('nope'), 'nope', 'unknown key falls back to the key');
});
