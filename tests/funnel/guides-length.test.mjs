// DA-03 — the parent guides are the site's indexable resource layer. The deeper audit
// (2026-09-18) asked for roughly 800-1,500 words of genuinely useful material per guide in
// every language; this locks the floor so a future edit cannot quietly shrink a guide.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadResources, loadArticleBodies } from '../../scripts/lib/catalog.mjs';

const { resources } = await loadResources();
const { articleBody, ARTICLE_BODY_SLUGS } = await loadArticleBodies();
const guides = resources.filter((r) => r.kind === 'article');
const words = (s) => (s.match(/[\p{L}\p{N}’'-]+/gu) ?? []).length;
const bodyWords = (b) => {
  const parts = [b.title, b.intro];
  for (const sec of [...(b.sections ?? []), ...(b.choices ?? [])]) { parts.push(sec.title); for (const p of sec.body) parts.push(typeof p === 'string' ? p : p.text); }
  if (b.skip) { parts.push(b.skip.title); for (const it of b.skip.items) parts.push(it.lead, it.rest); }
  return parts.reduce((n, p) => n + words(p ?? ''), 0);
};

test('guides — every registered guide has a body in every language, and every body has a registry entry', () => {
  for (const g of guides) for (const lang of ['en', 'es', 'fr']) assert.ok(articleBody(g.slug, lang), `${g.slug}: no ${lang} body`);
  for (const slug of ARTICLE_BODY_SLUGS) assert.ok(guides.some((g) => g.slug === slug), `${slug}: body without a registry entry`);
  assert.equal(guides.length, 8);
});

test('guides — each body is at least 800 words in every language (DA-03)', () => {
  for (const g of guides) for (const lang of ['en', 'es', 'fr']) {
    const n = bodyWords(articleBody(g.slug, lang));
    assert.ok(n >= 800, `${g.slug} [${lang}]: ${n} words, below 800`);
    assert.ok(n <= 1600, `${g.slug} [${lang}]: ${n} words, above the 1,500-word ceiling with margin`);
  }
});

test('guides — the two audit topics exist and pair with their printable (DA-03)', () => {
  const bedtime = guides.find((g) => g.slug === 'bedtime-reading-routine');
  const cards = guides.find((g) => g.slug === 'bilingual-flashcards');
  assert.ok(bedtime && bedtime.relatedResourceIds.includes('download-bedtime-routine'));
  assert.ok(cards && cards.relatedResourceIds.includes('download-bilingual-flashcards'));
});
