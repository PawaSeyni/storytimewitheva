// Book companions (activities audit 2026-11, §4C): every /free/<book-id>-companion landing page
// is prerendered in every language, noindex, tags the signup with its slug and names the book.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBookCompanions } from '../../scripts/lib/catalog.mjs';

const DIST = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..'), 'dist');
const { companionBooks, companionSlug } = await loadBookCompanions();
const LOCALES = { en: '', fr: '/fr', es: '/es' };
const read = (route) => {
  const f = path.join(DIST, route.replace(/^\//, ''), 'index.html');
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
};
const decode = (h) => h.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');

test('book companions — a gated landing page per book and language, with the book title and tag', () => {
  assert.ok(companionBooks.length >= 20);
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    for (const b of companionBooks) {
      const slug = companionSlug(b.id);
      const route = `${prefix}/free/${slug}`;
      const h = read(route);
      assert.ok(h, `${route}: not prerendered`);
      assert.ok(decode(h).includes(b.title[loc] ?? b.title.en), `${route}: ${loc} book title missing`);
      const tagInput = (h.match(/<input\b[^>]*type="hidden"[^>]*>/g) ?? []).find((t) => /name="lead_magnet"/.test(t));
      assert.ok(tagInput && tagInput.includes(`value="${slug}"`), `${route}: form must tag the companion`);
      assert.ok(h.includes('<meta name="robots" content="noindex'), `${route}: landing pages are noindex`);
    }
  }
  const sitemap = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('-companion'), 'landing pages stay out of the sitemap');
});
