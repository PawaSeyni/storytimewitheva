// Classroom units (docs/activities-audit-2026-11.md, §5c item 5): five themed teacher units at
// /classroom/<unit-id>, each with a gated printable pack at /free/<unit-id>-pack. These tests
// make a broken unit a build failure: a book that does not carry the unit's theme, a plan day
// that points at a missing activity or one that would not open in book mode, a pack slug that
// collides with another offer, or copy missing in a language.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { loadCatalog, loadActivities, loadClassroomUnits, loadClassroomUnitPlans, loadBookCompanions, loadContentIndex, loadResources, loadBookVocab, loadTaxonomy } from '../../scripts/lib/catalog.mjs';
import { parseMagnets, parseLandingSlugs } from './_manifest.mjs';

const { books } = await loadCatalog();
const { activities } = await loadActivities();
const units = await loadClassroomUnits();
const { classroomUnits, publishedClassroomUnits, CLASSROOM_UNIT_IDS, UNIT_PACK_SLUGS, classroomUnitProblems, unitPackSlug, unitStepHref, unitPackItems, unitAgeRange, unitsForCollection } = units;
const { unitPlans, unitDays, unitVocab, unitPlanProblems } = await loadClassroomUnitPlans();
const { BOOK_COMPANION_SLUGS } = await loadBookCompanions();
const { learningPackIds, collectionRouteIds, collectionRecordById } = await loadContentIndex();
const { resources } = await loadResources();
const { bookVocab } = await loadBookVocab();
const { THEME_IDS } = await loadTaxonomy();
const j = await build({ entryPoints: ['src/lib/journey.ts'], bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent' });
const { sourceBookFor } = await import(`data:text/javascript;base64,${Buffer.from(j.outputFiles[0].text).toString('base64')}`);
const LANGS = ['en', 'es', 'fr'];
const PREFIX = { en: '', es: '/es', fr: '/fr' };
const bookById = new Map(books.map((b) => [b.id, b]));

test('units — the five themes, every record valid and published', () => {
  assert.deepEqual(classroomUnits.map((u) => u.id), ['unit-kindness', 'unit-patience', 'unit-courage', 'unit-feelings', 'unit-curiosity']);
  for (const u of classroomUnits) {
    const problems = [...classroomUnitProblems(u), ...unitPlanProblems(u)];
    assert.deepEqual(problems, [], `${u.id}: ${problems.join('; ')}`);
    assert.equal(u.publishState, 'published');
  }
  assert.deepEqual(CLASSROOM_UNIT_IDS, classroomUnits.map((u) => u.id));
  assert.deepEqual(UNIT_PACK_SLUGS, CLASSROOM_UNIT_IDS.map((id) => `${id}-pack`));
});

test('units — valid theme ids, and two or three published books that really carry one of them', () => {
  for (const u of publishedClassroomUnits) {
    assert.ok(u.themeIds.length >= 1 && u.themeIds.every((t) => THEME_IDS.includes(t)), `${u.id}: themes`);
    assert.ok(u.bookIds.length >= 2 && u.bookIds.length <= 3, `${u.id}: ${u.bookIds.length} books`);
    for (const id of u.bookIds) {
      const b = bookById.get(id);
      assert.ok(b && b.status !== 'coming-soon', `${u.id}: ${id} is not a published book`);
      assert.ok(b.themeIds.some((t) => u.themeIds.includes(t)), `${u.id}: ${id} carries ${b.themeIds.join(',')}, none of ${u.themeIds.join(',')}`);
    }
    // Ages come from the books, not from copy.
    const lows = u.bookIds.map((id) => Number(bookById.get(id).ageRange.split('-')[0]));
    const highs = u.bookIds.map((id) => Number(bookById.get(id).ageRange.split('-')[1]));
    assert.equal(unitAgeRange(u), `${Math.min(...lows)}-${Math.max(...highs)}`);
  }
});

test('units — a five-day plan whose every step opens an existing book or activity, in book mode, in the visitor’s language', () => {
  assert.deepEqual(Object.keys(unitPlans), CLASSROOM_UNIT_IDS, 'one plan per unit, no stray plan');
  for (const u of publishedClassroomUnits) {
    const days = unitDays(u.id);
    assert.equal(days.length, 5, `${u.id}: five days`);
    for (const [i, day] of days.entries()) {
      assert.ok(day.steps.length >= 1 && day.steps.length <= 3, `${u.id} day ${i + 1}: steps`);
      for (const step of day.steps) {
        assert.ok(u.bookIds.includes(step.bookId), `${u.id} day ${i + 1}: ${step.bookId} is not a unit book`);
        for (const lang of LANGS) {
          const url = new URL(unitStepHref(step, lang), 'https://storytimewitheva.com');
          if (!step.activityId) {
            assert.equal(url.pathname, `${PREFIX[lang]}/books/${step.bookId}/`);
            continue;
          }
          const a = activities.find((x) => x.slug === step.activityId);
          assert.ok(a, `${u.id} day ${i + 1}: unknown activity ${step.activityId}`);
          assert.equal(url.searchParams.get('book'), step.bookId, `${u.id} day ${i + 1}: ?book= missing`);
          assert.equal(sourceBookFor(step.activityId, step.bookId), step.bookId, `${u.id} day ${i + 1}: ${step.activityId} would not open in ${step.bookId} mode`);
          if (a.game) {
            assert.equal(url.pathname, `/games/${a.slug}.html`);
            assert.equal(url.searchParams.get('lang'), lang === 'en' ? null : lang);
          } else {
            assert.equal(url.pathname, `${PREFIX[lang]}/activities/${a.slug}/`);
          }
        }
      }
      for (const lang of LANGS) assert.ok(day.note[lang].trim().length >= 40, `${u.id} day ${i + 1}: ${lang} teacher note`);
      assert.ok(!day.note.en.includes('—'), `${u.id} day ${i + 1}: em dash in English note`);
    }
    // Every book is read at least once, and every listed Studio activity is used by the plan.
    for (const id of u.bookIds) assert.ok(days.some((d) => d.steps.some((s) => s.bookId === id && !s.activityId)), `${u.id}: ${id} never read`);
    for (const slug of u.activityIds) {
      assert.ok(days.some((d) => d.steps.some((s) => s.activityId === slug)), `${u.id}: ${slug} listed but not in the plan`);
      assert.ok(u.bookIds.some((id) => (bookById.get(id).relatedActivityIds ?? []).includes(slug)), `${u.id}: ${slug} is not one of the unit books' own activities`);
    }
  }
});

test('units — trilingual copy, and the story words and discussion prompts of every book present', () => {
  for (const u of publishedClassroomUnits) {
    for (const lang of LANGS) {
      assert.ok(u.title[lang].trim(), `${u.id}: ${lang} title`);
      assert.ok(u.description[lang].trim().length >= 40, `${u.id}: ${lang} description`);
    }
    assert.ok(!u.title.en.includes('—') && !u.description.en.includes('—'), `${u.id}: em dash in English copy`);
    const vocab = unitVocab(u);
    assert.deepEqual(vocab.map((v) => v.bookId), u.bookIds);
    for (const { bookId, words } of vocab) {
      assert.equal(words.length, 8, `${u.id}: ${bookId} story words`);
      assert.deepEqual(words, bookVocab[bookId]);
    }
    for (const id of u.bookIds) assert.equal(bookById.get(id).discussionQuestions?.length, 3, `${u.id}: ${id} prompts`);
  }
});

test('units — pack slugs collide with no magnet, learning pack, companion, download or collection', () => {
  const magnets = Object.keys(parseMagnets());
  const downloads = resources.filter((r) => r.kind === 'download').map((r) => r.slug);
  const taken = new Set([...magnets, ...parseLandingSlugs(), ...learningPackIds, ...BOOK_COMPANION_SLUGS, ...downloads, ...collectionRouteIds]);
  for (const slug of UNIT_PACK_SLUGS) assert.ok(!taken.has(slug), `${slug} is already taken`);
  for (const id of CLASSROOM_UNIT_IDS) assert.ok(!collectionRouteIds.includes(id) && !taken.has(id), `${id} collides with another route token`);
  assert.equal(unitPackSlug('unit-kindness'), 'unit-kindness-pack');
});

test('units — the pack delivers every unit book’s worksheet and quiz, the Studio activities and the classroom printables, each opening in the visitor’s language', () => {
  for (const u of publishedClassroomUnits) {
    for (const lang of LANGS) {
      const items = unitPackItems(u, lang);
      const kinds = items.map((i) => i.kind);
      for (const id of u.bookIds) {
        assert.ok(items.some((i) => i.kind === 'worksheet' && i.bookId === id), `${u.id} ${lang}: worksheet for ${id}`);
        assert.ok(items.some((i) => i.kind === 'quiz' && i.bookId === id), `${u.id} ${lang}: quiz for ${id}`);
      }
      assert.deepEqual(items.filter((i) => i.kind === 'activity').map((i) => i.activityId), u.activityIds);
      assert.deepEqual(items.filter((i) => i.kind === 'resource').map((i) => i.resourceId), u.resourceIds);
      assert.ok(kinds.indexOf('resource') > kinds.lastIndexOf('activity'), `${u.id}: files come last`);
      for (const item of items) {
        const url = new URL(item.href, 'https://storytimewitheva.com');
        if (item.kind === 'resource') {
          const r = resources.find((x) => x.id === item.resourceId);
          assert.equal(item.page, false);
          assert.equal(url.pathname, `/download/${r.slug}`);
          assert.equal(url.searchParams.get('lang'), r.localizedFile && lang !== 'en' ? lang : null, `${u.id} ${lang}: ${r.slug} language variant`);
          continue;
        }
        assert.equal(item.page, true, `${u.id}: ${item.kind} opens, never downloads`);
        assert.equal(url.searchParams.get('book'), item.bookId, `${u.id} ${lang} ${item.activityId}: ?book=`);
        assert.equal(sourceBookFor(item.activityId, item.bookId), item.bookId, `${u.id}: ${item.activityId} would not open in ${item.bookId} mode`);
        const a = activities.find((x) => x.slug === item.activityId);
        assert.ok(a, `${u.id}: unknown activity ${item.activityId}`);
        if (a.game) assert.equal(url.pathname, `/games/${a.slug}.html`);
        else assert.equal(url.pathname, `${PREFIX[lang]}/activities/${a.slug}/`);
      }
    }
  }
  assert.ok(unitPackItems(publishedClassroomUnits.find((u) => u.id === 'unit-courage'), 'en').some((i) => i.activityId === 'leo-and-the-wolf-worksheet'), 'Leo uses its hand-written worksheet');
});

test('units — the validator rejects broken records (so green means it rejects)', () => {
  const good = classroomUnits[0];
  const has = (rec, needle) => classroomUnitProblems(rec).some((x) => x.includes(needle));
  const planHas = (rec, needle) => unitPlanProblems(rec).some((x) => x.includes(needle));
  assert.ok(has({ ...good, themeIds: ['courage'] }, "carries none of the unit's themes"), 'off-theme book not caught');
  assert.ok(has({ ...good, bookIds: good.bookIds.slice(0, 1) }, 'two or three books'), 'single-book unit not caught');
  assert.ok(has({ ...good, bookIds: [...good.bookIds, 'nope'] }, 'does not exist'), 'unknown book not caught');
  assert.ok(planHas({ ...good, id: 'unit-nope' }, 'no five-day plan'), 'missing plan not caught');
  assert.ok(planHas({ ...good, bookIds: good.bookIds.slice(1) }, 'not a unit book'), 'step on a non-unit book not caught');
  assert.ok(planHas({ ...good, activityIds: [...good.activityIds, 'trust-meter'] }, 'never used in the plan'), 'unused Studio activity not caught');
  assert.ok(planHas({ ...good, activityIds: good.activityIds.slice(1) }, 'is not listed in activityIds'), 'unlisted Studio activity not caught');
  assert.ok(has({ ...good, activityIds: [...good.activityIds, 'story-worksheet'] }, 'shared tool'), 'shared tool listed as a Studio activity not caught');
  assert.ok(has({ ...good, resourceIds: ['article-bilingual-reading'] }, 'not a download'), 'article as printable not caught');
  assert.ok(has({ ...good, title: { ...good.title, fr: '' } }, 'missing fr title'), 'missing locale not caught');
  assert.ok(has({ ...good, description: { ...good.description, en: 'A week — with a dash and enough words to pass the length check easily.' } }, 'em dash'), 'em dash not caught');
});

test('units — educator collections show the units that share a theme and a book with them', () => {
  const feelings = collectionRecordById['classroom-feelings'];
  const ids = unitsForCollection(feelings.themeIds, feelings.bookIds).map((u) => u.id);
  assert.ok(ids.includes('unit-feelings') && ids.includes('unit-kindness'), ids.join(','));
  assert.ok(!ids.includes('unit-curiosity'));
  const stem = collectionRecordById['classroom-stem-curiosity'];
  assert.ok(unitsForCollection(stem.themeIds, stem.bookIds).map((u) => u.id).includes('unit-curiosity'));
  assert.deepEqual(unitsForCollection(['heritage'], ['fig-trees-secret']), []);
});

test('units — wired into the signup offers, the prerender, the sitemap and the inventory', () => {
  const signup = readFileSync('src/components/EmailSignup.tsx', 'utf8');
  assert.match(signup, /\.\.\.UNIT_MAGNETS,/);
  const unitCopy = signup.slice(signup.indexOf('const UNIT_UI'), signup.indexOf('const UNIT_MAGNETS'));
  for (const word of ['successHeading', 'successDetail']) assert.equal((unitCopy.match(new RegExp(`^ {4}${word}: `, 'gm')) || []).length, 3, `${word} in every language`);
  assert.ok(!/download your|descarga tu|téléchargez votre/i.test(unitCopy.slice(unitCopy.indexOf('successHeading'))), 'pack success copy must not promise one download');
  assert.match(signup, /'classroom'/, 'a classroom placement for the unit page');
  const prerender = readFileSync('scripts/prerender.mjs', 'utf8');
  assert.match(prerender, /\.\.\.UNIT_LANDING_SLUGS, \.\.\.COMPANION_LANDING_SLUGS\]\.map\(s => `\/free\/\$\{s\}`\)/);
  assert.match(prerender, /const unitClash = UNIT_LANDING_SLUGS\.filter/);
  assert.match(prerender, /Classroom-unit guard OK/);
  const sitemap = readFileSync('public/sitemap.xml', 'utf8');
  assert.ok(sitemap.includes('<loc>https://storytimewitheva.com/classroom/</loc>'));
  for (const id of CLASSROOM_UNIT_IDS) for (const p of ['', '/es', '/fr']) assert.ok(sitemap.includes(`<loc>https://storytimewitheva.com${p}/classroom/${id}/</loc>`), `${p}/classroom/${id} in the sitemap`);
  assert.ok(!sitemap.includes('-pack/'), 'gated packs stay out of the sitemap');
  const inventory = readFileSync('scripts/gen-content-inventory.mjs', 'utf8');
  assert.match(inventory, /classroomUnitProblems\(u\), \.\.\.unitPlanProblems\(u\)/);
  // The signup form (entry bundle) must not pull the plans: only the unit page reads them.
  assert.ok(!signup.includes('classroomUnitPlans'), 'EmailSignup must import the light unit records only');
});
