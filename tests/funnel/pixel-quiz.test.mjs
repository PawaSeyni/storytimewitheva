// Pixel's Story Quiz (docs/activities-audit-2026-11.md, §5c item 4).
// Every book gets four picture rounds: exactly one picture is the book's own story word, and the
// two others are words the catalog never uses for that book (description, subtitle, prompts),
// so "not in the story" is true by the catalog's own text. The talk step reads the book's
// "after reading" prompt, which must exist in every language.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { loadActivities } from '../../scripts/lib/catalog.mjs';

const bundle = await build({ entryPoints: ['src/lib/pixelQuiz.ts'], bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent' });
const { buildRounds } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const vb = await build({ entryPoints: ['src/data/bookVocab.data.ts', 'src/data/books.data.ts'], bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent', outdir: 'x' });
const load = (i) => import(`data:text/javascript;base64,${Buffer.from(vb.outputFiles[i].text).toString('base64')}`);
const { bookVocab } = await load(0);
const { books } = await load(1);
const LANGS = ['en', 'es', 'fr'];
const norm = (s) => ` ${String(s ?? '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ')} `;

test('pixel quiz — registered as an any-book activity for pre-readers, linked from every book page', async () => {
  const { activities } = await loadActivities();
  const a = activities.find((x) => x.slug === 'pixel-quiz');
  assert.ok(a && a.anyBook, 'pixel-quiz must exist and accept any book');
  assert.equal(Number(a.ages.split('-')[0]), 3);
  assert.match(readFileSync('src/components/StoryWords.tsx', 'utf8'), /withSourceBook\('\/activities\/pixel-quiz', bookId\)/);
});

test('pixel quiz — four fair rounds for every book, stable between runs', () => {
  for (const b of books) {
    const own = bookVocab[b.id] ?? [];
    if (own.length < 8) continue;
    const rounds = buildRounds(b.id);
    assert.equal(rounds.length, 4, `${b.id}: rounds`);
    assert.deepEqual(buildRounds(b.id), rounds, `${b.id}: rounds must be deterministic`);
    const ownEmoji = new Set(own.map((w) => w.emoji));
    const text = Object.fromEntries(LANGS.map((l) => [l, norm([b.description?.[l], b.subtitle?.[l], ...(b.discussionQuestions ?? []).map((q) => q.prompt[l])].join(' '))]));
    const used = new Set();
    const places = new Set();
    for (const r of rounds) {
      assert.equal(r.choices.length, 3, `${b.id}: three choices`);
      assert.equal(r.choices.filter((w) => ownEmoji.has(w.emoji)).length, 1, `${b.id}: exactly one story picture`);
      assert.ok(r.choices.includes(r.answer) && ownEmoji.has(r.answer.emoji));
      places.add(r.choices.indexOf(r.answer));
      for (const w of r.choices) {
        assert.ok(!used.has(w.emoji), `${b.id}: ${w.emoji} repeated`);
        used.add(w.emoji);
        if (w === r.answer) continue;
        for (const l of LANGS) assert.ok(!text[l].includes(` ${w[l].toLowerCase()} `), `${b.id}: distractor "${w[l]}" appears in the book's ${l} catalog text`);
      }
    }
    assert.ok(places.size > 1, `${b.id}: the story picture is always in the same place`);
  }
});

test('pixel quiz — every book has an "after reading" prompt in every language', () => {
  for (const b of books.filter((x) => (bookVocab[x.id] ?? []).length >= 8)) {
    const q = (b.discussionQuestions ?? []).find((x) => x.stage === 'after');
    for (const l of LANGS) assert.ok(q?.prompt[l]?.trim(), `${b.id}: "after" prompt missing ${l}`);
  }
});
