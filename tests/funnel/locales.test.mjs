// S8-019: one locale registry; adding a language needs an entry, translations and content,
// never a copied route or component. Proved with a TEMPORARY test locale passed to the
// parametric helpers, and with a scan of the source for language literals.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './_manifest.mjs';
import { loadLocales } from '../../scripts/lib/catalog.mjs';

const L = await loadLocales();
const TEST_LOCALES = [...L.LOCALES, { code: 'pt', prefix: '/pt', name: 'Português', flag: '🇵🇹', intl: 'pt-PT', ogLocale: 'pt_PT' }];

test('registry — three locales, English at the root, unique codes and prefixes, complete metadata', () => {
  assert.deepEqual(L.LANGUAGES, ['en', 'es', 'fr']);
  assert.deepEqual(L.LANG_PREFIXES, ['', '/es', '/fr']);
  assert.equal(L.DEFAULT_LANGUAGE, 'en');
  assert.equal(new Set(L.LOCALES.map((l) => l.code)).size, L.LOCALES.length);
  assert.equal(new Set(L.LOCALES.map((l) => l.prefix)).size, L.LOCALES.length);
  for (const l of L.LOCALES) for (const k of ['name', 'flag', 'intl', 'ogLocale']) assert.ok(l[k], `${l.code}: ${k}`);
  assert.equal(L.intlLocale('fr'), 'fr-FR');
  assert.equal(L.ogLocale('es'), 'es_ES');
  assert.ok(L.isLanguage('fr') && !L.isLanguage('pt') && !L.isLanguage(null));
});

test('temporary test locale — routes, path split, localization and hreflang derive from the entry alone', () => {
  assert.deepEqual(L.splitLangFromPathWith('/pt/books/mayas-shadow', TEST_LOCALES), { lang: 'pt', rest: '/books/mayas-shadow' });
  assert.deepEqual(L.splitLangFromPathWith('/pt', TEST_LOCALES), { lang: 'pt', rest: '/' });
  assert.deepEqual(L.splitLangFromPathWith('/pt/', TEST_LOCALES), { lang: 'pt', rest: '/' });
  assert.deepEqual(L.splitLangFromPathWith('/books', TEST_LOCALES), { lang: 'en', rest: '/books' });
  assert.equal(L.localizePathWith('/', 'pt', TEST_LOCALES), '/pt');
  assert.equal(L.localizePathWith('/books/x', 'pt', TEST_LOCALES), '/pt/books/x');
  assert.equal(L.localizePathWith('/books/x', 'en', TEST_LOCALES), '/books/x');
  const routes = L.routesForLocales(['/', '/books', '/collections/kindness'], TEST_LOCALES);
  assert.deepEqual(routes, ['/', '/books', '/collections/kindness', '/es', '/es/books', '/es/collections/kindness', '/fr', '/fr/books', '/fr/collections/kindness', '/pt', '/pt/books', '/pt/collections/kindness']);
  const canonical = (p) => `https://storytimewitheva.com${p === '/' ? '/' : p + '/'}`;
  const alts = L.hreflangFor('/books', canonical, TEST_LOCALES);
  assert.deepEqual(alts.map((a) => a.hreflang), ['en', 'es', 'fr', 'pt', 'x-default']);
  assert.equal(alts.find((a) => a.hreflang === 'pt').href, 'https://storytimewitheva.com/pt/books/');
  assert.equal(alts.find((a) => a.hreflang === 'x-default').href, 'https://storytimewitheva.com/books/');
  // and the production registry is unaffected by the test one
  assert.deepEqual(L.splitLangFromPath('/pt/books'), { lang: 'en', rest: '/pt/books' });
});

test('no component or page carries a language literal; App mounts one route table per registry prefix', () => {
  const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
  const files = [...walk(path.join(ROOT, 'src', 'pages')), ...walk(path.join(ROOT, 'src', 'components')), ...walk(path.join(ROOT, 'src', 'demos')), path.join(ROOT, 'src', 'App.tsx')];
  const offenders = [];
  for (const f of files) {
    const s = readFileSync(f, 'utf8').replace(/\/\/[^\n]*/g, '');
    if (/'\/es'|'\/fr'|"\/es"|"\/fr"|\['en', 'es', 'fr'\]|\['en', 'fr', 'es'\]|'es-ES'|'fr-FR'|'en_US'|'es_ES'|'fr_FR'|\(\?:es\\\/\|fr\\\/\)/.test(s)) offenders.push(path.relative(ROOT, f));
  }
  assert.deepEqual(offenders, [], 'language literals belong in src/lib/locales.ts');
  const app = readFileSync(path.join(ROOT, 'src', 'App.tsx'), 'utf8');
  assert.ok(app.includes("from './lib/locales'") && app.includes('LANG_PREFIXES.flatMap'), 'App must mount routeDefs once per registry prefix');
  for (const script of ['gen-sitemap.mjs', 'prerender.mjs', 'gen-download-redirects.mjs', 'gen-content-inventory.mjs']) {
    assert.ok(readFileSync(path.join(ROOT, 'scripts', script), 'utf8').includes('loadLocales'), `${script} must read the registry`);
  }
});

test('translation tables fall back to English for a locale that has no strings yet (graceful new-locale rendering)', () => {
  // useTranslation returns translations[language] ?? translations.en — asserted on the source
  // because the hook needs React; the fallback is what lets a new locale ship page by page.
  const src = readFileSync(path.join(ROOT, 'src', 'lib', 'language.tsx'), 'utf8');
  assert.match(src, /translations\[language\] \?\? translations\.en/);
});
