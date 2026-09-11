// Activity Studio (2026-09-11) — the eight book-linked activities and the pairings from
// the owner's activity table. The table is the contract: each activity's "best book
// connection" lists the activity FIRST in its relatedActivityIds, so the book page shows
// it first and the activity page continues to that book.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog, loadActivities } from '../../scripts/lib/catalog.mjs';

const { books } = await loadCatalog();
const { activities } = await loadActivities();

/** slug -> [book ids] straight from the table (Priority 1 to 3). */
const TABLE = {
  'color-mix-lab': ['colors-mixed-up'],
  'feelings-weather-report': ['pawa-rainbow-cloud'],
  'first-day-brave-plan': ['diegos-brave-leap'],
  'cloud-detective-journal': ['cloud-collector'],
  'shadow-theatre': ['mayas-shadow'],
  'kindness-ripple': ['butterfly-effect', 'sparrow-saved-forest'],
  'story-quilt': ['fig-trees-secret'],
  'patient-maker-passport': ['heidis-journey-to-mastery', 'miras-thousand-cubes', 'sanding-block'],
};
const AGES = {
  'color-mix-lab': '4-7', 'feelings-weather-report': '3-7', 'first-day-brave-plan': '4-8', 'cloud-detective-journal': '4-8',
  'shadow-theatre': '3-7', 'kindness-ripple': '4-9', 'story-quilt': '5-9', 'patient-maker-passport': '5-9',
};

test('studio — all eight activities exist, trilingual, with the table ages', () => {
  for (const [slug, ages] of Object.entries(AGES)) {
    const a = activities.find((x) => x.slug === slug);
    assert.ok(a, `missing activity ${slug}`);
    assert.equal(a.ages, ages, `${slug}: ages`);
    for (const lang of ['en', 'es', 'fr']) {
      assert.ok(a.title[lang]?.length > 4, `${slug}: title.${lang}`);
      assert.ok(a.desc[lang]?.length > 30, `${slug}: desc.${lang}`);
      assert.ok(a.category[lang]?.length > 2, `${slug}: category.${lang}`);
    }
    assert.ok(!a.game, `${slug}: is an in-app page, not a static game`);
  }
});

test('studio — every "best book connection" lists the activity first, and only those books do', () => {
  for (const [slug, ids] of Object.entries(TABLE)) {
    for (const id of ids) {
      const b = books.find((x) => x.id === id);
      assert.ok(b, `${slug}: unknown book ${id}`);
      assert.equal(b.relatedActivityIds?.[0], slug, `${id}: ${slug} must be the first related activity`);
    }
    const referencing = books.filter((b) => (b.relatedActivityIds ?? []).includes(slug)).map((b) => b.id).sort();
    assert.deepEqual(referencing, [...ids].sort(), `${slug}: books referencing it must match the table`);
  }
});

test('studio — no English copy in the studio pages carries an em dash', async () => {
  // House style: no em dashes in English copy. The studio files hold all three languages,
  // and none of them uses one, so the whole file is checked.
  const { readFileSync, readdirSync } = await import('node:fs');
  const files = ['src/demos/studio/StudioFrame.tsx', ...readdirSync('src/demos').filter((f) => /^(ColorMixLab|FeelingsWeather|BravePlan|CloudDetective|ShadowTheatre|KindnessRipple|StoryQuilt|MakerPassport)Demo\.tsx$/.test(f)).map((f) => `src/demos/${f}`)];
  assert.equal(files.length, 9);
  for (const f of files) assert.ok(!readFileSync(f, 'utf8').includes('\u2014'), `${f}: em dash`);
});
