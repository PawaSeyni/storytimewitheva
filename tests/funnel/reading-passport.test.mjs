// Reading Passport (activities audit 2026-11). A stamp IS the book's "read" status in the
// personal library, so the passport must not introduce storage of its own, and the places
// that set that status must lead to it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadActivities } from '../../scripts/lib/catalog.mjs';

const { activities } = await loadActivities();
const src = readFileSync('src/demos/ReadingPassportDemo.tsx', 'utf8');

test('passport — registered as an activity with a route and a sitemap entry', () => {
  const a = activities.find((x) => x.slug === 'reading-passport');
  assert.ok(a, 'missing activity');
  for (const l of ['en', 'es', 'fr']) assert.ok(a.title[l] && a.desc[l], `missing ${l} copy`);
  assert.match(readFileSync('src/App.tsx', 'utf8'), /'\/activities\/reading-passport'/);
  assert.match(readFileSync('scripts/gen-sitemap.mjs', 'utf8'), /'\/activities\/reading-passport'/);
});

test('passport — stamps are the personal library "read" status, with no storage of its own', () => {
  assert.match(src, /setStatus\(id, on \? 'read' : null\)/, 'stamping must set the library status');
  assert.match(src, /booksWithStatus\(loadLibrary\(\), 'read'\)/, 'stamps must be read from the library');
  assert.match(src, /onLibraryChange\(/, 'must re-sync when another page changes the status');
  assert.doesNotMatch(src, /localStorage|sessionStorage|setLegacy|getLegacy/, 'no separate storage');
});

test('passport — the book page "Read" button and the profile lead to it', () => {
  assert.match(readFileSync('src/components/BookStatusButton.tsx', 'utf8'), /to="\/activities\/reading-passport"/);
  assert.match(readFileSync('src/pages/Profile.tsx', 'utf8'), /to="\/activities\/reading-passport"/);
});

test('passport — no em dashes in the page copy', () => {
  assert.ok(!src.includes('—'));
});
