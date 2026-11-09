// Book companions (docs/activities-audit-2026-11.md, §4C): one free, email-gated activity kit
// per published book at /free/<book-id>-companion. These tests make a broken companion a
// build failure: a missing book, a colliding slug, or a link to an activity that would not
// open in that book's mode.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { loadCatalog, loadActivities, loadBookCompanions, loadContentIndex, loadResources, loadBookVocab } from '../../scripts/lib/catalog.mjs';
import { parseMagnets, parseLandingSlugs } from './_manifest.mjs';

const { books } = await loadCatalog();
const { activities } = await loadActivities();
const { BOOK_COMPANION_SLUGS, companionBooks, companionSlug, companionItems } = await loadBookCompanions();
const { learningPackIds, collectionRouteIds } = await loadContentIndex();
const { resources } = await loadResources();
const { bookVocab } = await loadBookVocab();
const j = await build({ entryPoints: ['src/lib/journey.ts'], bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent' });
const { sourceBookFor } = await import(`data:text/javascript;base64,${Buffer.from(j.outputFiles[0].text).toString('base64')}`);
const published = books.filter((b) => b.status !== 'coming-soon');
const LANGS = ['en', 'es', 'fr'];

test('companions — one per published book, none for coming-soon books', () => {
  assert.deepEqual(companionBooks.map((b) => b.id), published.map((b) => b.id));
  assert.deepEqual(BOOK_COMPANION_SLUGS, published.map((b) => `${b.id}-companion`));
  assert.equal(new Set(BOOK_COMPANION_SLUGS).size, BOOK_COMPANION_SLUGS.length);
});

test('companions — slugs collide with no magnet, pack, download or collection', () => {
  const magnets = Object.keys(parseMagnets());
  const downloads = resources.filter((r) => r.kind === 'download').map((r) => r.slug);
  const taken = new Set([...magnets, ...parseLandingSlugs(), ...learningPackIds, ...downloads, ...collectionRouteIds]);
  for (const slug of BOOK_COMPANION_SLUGS) assert.ok(!taken.has(slug), `${slug} is already taken`);
  // The free Leo storybook keeps its own slug and offer.
  assert.ok(magnets.includes('leo-and-the-wolf'));
  assert.equal(companionSlug('leo-and-the-wolf'), 'leo-and-the-wolf-companion');
});

test('companions — every item opens an existing activity in that book’s mode, in the visitor’s language', () => {
  const prefix = { en: '', es: '/es', fr: '/fr' };
  for (const b of companionBooks) {
    assert.ok((bookVocab[b.id] ?? []).length >= 8, `${b.id}: the quiz and flashcards need its story words`);
    for (const lang of LANGS) {
      const items = companionItems(b.id, lang);
      assert.deepEqual(items.map((i) => i.key), ['worksheet', 'quiz', 'flashcards']);
      for (const { key, href } of items) {
        const url = new URL(href, 'https://storytimewitheva.com');
        assert.equal(url.searchParams.get('book'), b.id, `${b.id} ${lang} ${key}: ?book= missing`);
        let slug;
        if (key === 'flashcards') {
          assert.match(url.pathname, /^\/games\/bilingual-flashcards\.html$/);
          assert.equal(url.searchParams.get('lang'), lang === 'en' ? null : lang, `${b.id} ${lang}: game language`);
          slug = 'bilingual-flashcards';
        } else {
          const m = new RegExp(`^${prefix[lang]}/activities/([a-z0-9-]+)/$`).exec(url.pathname);
          assert.ok(m, `${b.id} ${lang} ${key}: ${url.pathname} is not a localized activity page`);
          slug = m[1];
        }
        assert.ok(activities.some((a) => a.slug === slug), `${b.id}: unknown activity ${slug}`);
        assert.equal(sourceBookFor(slug, b.id), b.id, `${b.id}: ${slug} would not open in book mode`);
      }
    }
  }
  assert.match(companionItems('leo-and-the-wolf', 'en')[0].href, /leo-and-the-wolf-worksheet/, 'Leo uses its hand-written worksheet');
});

test('companions — wired into the signup offers and the prerender', () => {
  const signup = readFileSync('src/components/EmailSignup.tsx', 'utf8');
  assert.match(signup, /\.\.\.COMPANION_MAGNETS,/);
  // Activity pages open; only files download.
  assert.match(signup, /download=\{item\.page \? undefined : true\}/);
  const prerender = readFileSync('scripts/prerender.mjs', 'utf8');
  assert.match(prerender, /\.\.\.COMPANION_LANDING_SLUGS\]\.map\(s => `\/free\/\$\{s\}`\)/);
});
