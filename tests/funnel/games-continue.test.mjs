// The continuation block inside the standalone games (S4-011 / CJ-04).
//
// The games are static HTML, so the next step is baked in by scripts/patch-games.mjs.
// That creates a second place the answer could drift from the app's, so these tests
// compare each game's baked block against what src/lib/journey.ts resolves NOW.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { loadCatalog, loadJourney } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const { nextStep } = await loadJourney();
const titleOf = new Map(books.map((b) => [b.id, b.title]));
const games = readdirSync('public/games').filter((f) => f.endsWith('.html'));

function block(html) {
  const m = /<!-- STE_CONTINUE[\s\S]*?<\/script>/.exec(html);
  if (!m) return null;
  const href = /<a href="([^"]+)" data-ste-continue='([^']+)'/.exec(m[0]);
  return href ? { href: href[1], data: JSON.parse(href[2].replace(/&#39;/g, "'")), raw: m[0] } : { raw: m[0] };
}

test('games — every game carries exactly one continuation block, before the footer', () => {
  assert.ok(games.length >= 12);
  for (const f of games) {
    const html = readFileSync(`public/games/${f}`, 'utf8');
    assert.equal((html.match(/STE_CONTINUE/g) || []).length, 1, `${f}: expected one block`);
    assert.ok(html.indexOf('STE_CONTINUE') < html.indexOf('<footer'), `${f}: block must precede the footer`);
    assert.ok(block(html)?.href, `${f}: block has no link`);
  }
});

test('games — the baked step matches what journey.ts resolves today', () => {
  // Run `npm run patch:games` after changing relationships; this fails if that was missed.
  for (const f of games) {
    const slug = f.replace('.html', '');
    const b = block(readFileSync(`public/games/${f}`, 'utf8'));
    const step = nextStep('activity', slug);
    assert.ok(step, `${slug}: journey resolves nothing`);
    assert.equal(b.href, step.href, `${slug}: baked href ${b.href} != resolved ${step.href} — re-run npm run patch:games`);
    assert.equal(b.data.kind, step.type === 'book' ? 'book' : 'catalog', `${slug}: kind drifted`);
    if (step.type === 'book') {
      assert.deepEqual(b.data.titles, titleOf.get(step.id), `${slug}: baked titles drifted from the catalog`);
      for (const l of ['en', 'es', 'fr']) assert.ok(b.data.titles[l]?.trim(), `${slug}: missing ${l} title`);
    }
  }
});

test('games — hrefs stay unprefixed site paths, so i18n.js localizes them like the nav', () => {
  for (const f of games) {
    const b = block(readFileSync(`public/games/${f}`, 'utf8'));
    assert.match(b.href, /^\/books(\/[a-z0-9-]+)?$/, `${f}: unexpected href ${b.href}`);
  }
});

test('games — the three chrome strings exist in every language of i18n.js', () => {
  const src = readFileSync('public/games/i18n.js', 'utf8');
  for (const key of ['continueEyebrow', 'readNext', 'browseBooks']) {
    assert.equal((src.match(new RegExp(`\\b${key}:`, 'g')) || []).length, 3, `${key}: expected en/es/fr`);
  }
});
