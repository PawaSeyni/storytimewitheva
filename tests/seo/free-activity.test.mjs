// Every book card carries a "Free activity" badge that links to the book's paired
// activity, and every in-app activity page offers the email signup. Checked on the
// prerendered dist so the raw HTML (what crawlers and no-JS visitors get) is what is locked.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog, loadActivities } from '../../scripts/lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const read = (route) => {
  const f = path.join(DIST, route.replace(/^\//, ''), 'index.html');
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
};

const { books } = await loadCatalog();
const { activities } = await loadActivities();
const LOCALES = { en: '', es: '/es', fr: '/fr' };
const BADGE = { en: 'Free activity', es: 'Actividad gratis', fr: 'Activité gratuite' };

test('every book card on the catalog links its paired free activity', () => {
  for (const [lang, prefix] of Object.entries(LOCALES)) {
    const h = read(`${prefix}/books`);
    assert.ok(h, `${prefix}/books not prerendered`);
    for (const b of books) {
      const slug = b.relatedActivityIds?.[0];
      assert.ok(slug, `${b.id}: no paired activity`);
      const game = activities.find((a) => a.slug === slug)?.game;
      const href = game
        ? `/games/${slug}.html${lang === 'en' ? '' : `?lang=${lang}`}`
        : `${prefix}/activities/${slug}/`;
      // Attribute order differs between router links and plain anchors; match either.
      const anchors = h.match(/<a [^>]*>/g) ?? [];
      const hit = anchors.some((a) => a.includes(`href="${href}"`) && a.includes(`aria-label="${BADGE[lang]}: `));
      assert.ok(hit, `${prefix}/books: ${b.id} is missing the badge link to ${href}`);
    }
  }
});

test('every in-app activity page renders the email signup', () => {
  for (const prefix of Object.values(LOCALES)) {
    for (const a of activities.filter((x) => !x.game)) {
      const h = read(`${prefix}/activities/${a.slug}`);
      assert.ok(h, `${prefix}/activities/${a.slug} not prerendered`);
      assert.equal((h.match(/id="email-signup"/g) ?? []).length, 1, `${prefix}/activities/${a.slug}: expected exactly one signup`);
    }
  }
});
