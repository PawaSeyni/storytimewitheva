// S5-016 / S5-018 / S5-023 on the prerendered dist: retailer links, disclosures, edition mapping,
// CTA states, related-book links, merchandising flags.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog, loadRelatedBooks } from '../../scripts/lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const { books } = await loadCatalog();
const { relatedBooksFor } = await loadRelatedBooks();
const TAG = 'tag=storytimewi20-20';
const LOCALES = { en: '', fr: '/fr', es: '/es' };
const read = (route) => readFileSync(path.join(DIST, route.replace(/^\//, ''), 'index.html'), 'utf8');

test('retailer links — every Amazon link on every book page carries the affiliate tag, opens in a new tab with noopener', () => {
  for (const [, prefix] of Object.entries(LOCALES)) for (const b of books) {
    const h = read(`${prefix}/books/${b.id}`);
    const links = h.match(/<a\b[^>]*href="https:\/\/www\.amazon\.com[^"]*"[^>]*>/g) ?? [];
    assert.ok(links.length >= 1, `${prefix}/books/${b.id}: no Amazon link`);
    for (const a of links) {
      assert.ok(a.includes(TAG), `${prefix}/books/${b.id}: Amazon link without the affiliate tag`);
      assert.ok(/target="_blank"/.test(a) && /rel="[^"]*noopener/.test(a), `${prefix}/books/${b.id}: Amazon link must open in a new tab with noopener`);
    }
  }
});

test('disclosure — the affiliate note sits with the Buy group on every book page, in the page language', () => {
  const note = { en: 'As an Amazon Associate', fr: 'Partenaire Amazon', es: 'Asociado de Amazon' };
  for (const [loc, prefix] of Object.entries(LOCALES)) for (const b of books) {
    const h = read(`${prefix}/books/${b.id}`);
    assert.ok(h.includes('data-affiliate-disclosure') && h.includes(note[loc]), `${prefix}/books/${b.id}: disclosure missing in ${loc}`);
  }
});

test('disclosure — the footer carries the affiliate note with TEXT in every language (an empty element is a defect)', () => {
  const note = { en: 'As an Amazon Associate', fr: 'Partenaire Amazon', es: 'Asociado de Amazon' };
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    const h = read(prefix || '/');
    const m = /data-affiliate-disclosure="footer">([^<]*)</.exec(h);
    assert.ok(m && m[1].trim().length > 20, `${prefix || '/'}: footer disclosure element empty or missing`);
    assert.ok(m[1].includes(note[loc]), `${prefix || '/'}: footer disclosure not in ${loc}`);
  }
});

test('edition mapping — the Buy link points at the language edition when one exists, else the English one', () => {
  for (const [loc, prefix] of Object.entries(LOCALES)) for (const b of books) {
    const h = read(`${prefix}/books/${b.id}`);
    const expected = b.editions[loc]?.asin ?? b.editions.en.asin;
    if (!expected) continue;
    assert.ok(h.includes(`amazon.com/dp/${expected}?`), `${prefix}/books/${b.id}: Buy link should use ASIN ${expected}`);
  }
});

test('CTA states — a coming-soon book shows no Buy link; a published book shows exactly one Buy group', () => {
  for (const b of books) {
    const h = read(`/books/${b.id}`);
    const buyGroups = (h.match(/data-cta="buy"/g) ?? []).length;
    if (b.status === 'coming-soon') assert.equal(buyGroups, 0, `${b.id}: coming soon must not sell`);
    else assert.equal(buyGroups, 1, `${b.id}: one Buy group`);
  }
});

test('related books — links are localized, resolve to prerendered pages, never self, never duplicated (S5-016)', () => {
  for (const [, prefix] of Object.entries(LOCALES)) for (const b of books) {
    const h = read(`${prefix}/books/${b.id}`);
    const start = ['You might also like', 'Vous aimerez aussi', 'También te puede gustar'].map((k) => h.indexOf(k)).find((i) => i >= 0) ?? -1;
    const end = h.indexOf('<footer');
    const section = start >= 0 ? h.slice(start, end > start ? end : undefined) : '';
    // A card links its cover and its title to the same page, so compare SETS with the policy output.
    const ids = [...new Set([...section.matchAll(new RegExp(`href="${prefix}/books/([a-z0-9-]+)"`, 'g'))].map((m) => m[1]))];
    assert.ok(!ids.includes(b.id), `${prefix}/books/${b.id}: recommends itself`);
    assert.deepEqual(ids.sort(), relatedBooksFor(b.id).map((r) => r.id).sort(), `${prefix}/books/${b.id}: rendered set differs from the policy`);
    for (const id of ids) assert.ok(existsSync(path.join(DIST, prefix.replace(/^\//, ''), 'books', id, 'index.html')), `${prefix}/books/${b.id}: related link to missing ${id}`);
  }
});

test('merchandising — at most four featured titles, all published, deterministic order (S5-018)', () => {
  const featured = books.filter((b) => b.featured);
  assert.ok(featured.length >= 1 && featured.length <= 4, `${featured.length} featured`);
  for (const b of featured) assert.notEqual(b.status, 'coming-soon', `${b.id}: featured but not for sale`);
  const home = read('/');
  const order = featured.map((b) => home.indexOf(`href="/books/${b.id}"`));
  assert.deepEqual(order, [...order].sort((a, c) => a - c), 'featured titles render in catalog order');
});
