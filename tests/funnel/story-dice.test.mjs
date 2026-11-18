// Collection Story Dice (docs/activities-audit-2026-11.md, §5c item 3).
// Every published book contributes one face to each of the three dice (character, setting,
// problem) in all three languages, short enough to print three to a card and with no em dash.
// Every id in the data is a real published book, and the activity is registered and routed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCatalog, loadActivities, loadStoryDice } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const { activities } = await loadActivities();
const { storyDice, storyDiceEmoji } = await loadStoryDice();
const published = books.filter((b) => b.status !== 'coming-soon');
const LANGS = ['en', 'es', 'fr'];
const DICE = ['character', 'setting', 'problem'];
const SLUG = 'collection-story-dice';

test('story dice — every published book has all three faces in all three languages', () => {
  for (const b of published) {
    const faces = storyDice[b.id];
    assert.ok(faces, `${b.id}: no dice faces`);
    for (const die of DICE) {
      for (const l of LANGS) {
        const s = faces[die]?.[l];
        assert.equal(typeof s, 'string', `${b.id}.${die}.${l}: missing`);
        assert.ok(s.trim().length >= 2 && s.length <= 60, `${b.id}.${die}.${l}: "${s}" must be 2-60 characters`);
        assert.ok(!s.includes('—'), `${b.id}.${die}.${l}: em dash`);
      }
    }
    assert.ok(storyDiceEmoji[b.id], `${b.id}: no character emoji`);
  }
});

test('story dice — every id in the data is a real published book', () => {
  const ids = new Set(published.map((b) => b.id));
  for (const id of Object.keys(storyDice)) assert.ok(ids.has(id), `${id}: not a published book`);
  for (const id of Object.keys(storyDiceEmoji)) assert.ok(ids.has(id), `${id}: emoji for an unknown book`);
  assert.equal(Object.keys(storyDice).length, published.length);
});

test('story dice — registered (slug, ages, trilingual copy) and neither book-specific nor any-book', () => {
  const a = activities.find((x) => x.slug === SLUG);
  assert.ok(a, `missing activity ${SLUG}`);
  assert.equal(a.ages, '5-9');
  assert.equal(a.emoji, '🎲');
  assert.ok(!a.bookSpecific && !a.anyBook && !a.game, `${SLUG}: a collection-wide in-app page`);
  for (const l of LANGS) {
    assert.ok(a.title[l]?.length > 4, `${SLUG}: title.${l}`);
    assert.ok(a.desc[l]?.length > 30, `${SLUG}: desc.${l}`);
    assert.ok(a.category[l]?.length > 2, `${SLUG}: category.${l}`);
  }
  assert.ok(!a.title.en.includes('—') && !a.desc.en.includes('—'), 'em dash in English copy');
});

test('story dice — routed, preloadable, in the sitemap, and the page carries no em dash', () => {
  assert.match(readFileSync('src/App.tsx', 'utf8'), new RegExp(`path: '/activities/${SLUG}'`));
  assert.match(readFileSync('src/routeLoaders.ts', 'utf8'), new RegExp(`path: '/activities/${SLUG}', loaders: \\[loadDemoPage, loadStoryDiceDemo\\]`));
  assert.match(readFileSync('scripts/gen-sitemap.mjs', 'utf8'), new RegExp(`\\['/activities/${SLUG}'`));
  const page = readFileSync('src/demos/StoryDiceDemo.tsx', 'utf8');
  assert.ok(!page.includes('—'), 'StoryDiceDemo.tsx: em dash');
  assert.match(page, /<ReadAloudButton\b/, 'little readers must be able to hear the three faces');
  assert.match(page, /seeded\(/, 'rolls must be seeded so the prerender is stable');
});
