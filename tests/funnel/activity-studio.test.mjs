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
  // Wave 2 (activities audit 2026-11): one activity for each book that had none.
  'trust-meter': ['leo-and-the-wolf'],
  'harmonia-orchestra': ['rainbow-symphony'],
  'ask-first-architect': ['tower-touched-sky'],
  'true-treasure-chest': ['emperors-true-treasure'],
  'one-of-a-kind-tree': ['crooked-little-apple-tree'],
  'kindness-mirror': ['true-beauty-meadowbrook'],
  'listen-like-a-fox': ['russet-the-fox'],
  'puddle-voyage': ['little-boats-big-wish'],
  'map-my-world': ['little-mapmaker'],
  'leo-and-the-wolf-worksheet': ['leo-and-the-wolf'],
  // Wave 3 (§5b): a second activity for the five strongest books.
  'shadow-science': ['mayas-shadow'],
  'brave-breathing': ['diegos-brave-leap'],
  'inventor-blueprint': ['heidis-journey-to-mastery'],
  'thousand-cubes-challenge': ['miras-thousand-cubes'],
  'tree-timeline': ['fig-trees-secret'],
  // Wave 4 (re-audit 2026-11-18): an activity of their own for Sparrow, Butterfly Effect and Sanding Block.
  'small-noticer': ['sparrow-saved-forest'],
  'kindness-chain': ['butterfly-effect'],
  'rough-to-smooth': ['sanding-block'],
  // Wave 5 (re-audit §7d): a second activity for the two B+ books.
  'everyone-gets-heard': ['tower-touched-sky'],
  'coins-you-cant-spend': ['emperors-true-treasure'],
};
const AGES = {
  'color-mix-lab': '4-7', 'feelings-weather-report': '3-7', 'first-day-brave-plan': '4-8', 'cloud-detective-journal': '4-8',
  'shadow-theatre': '3-7', 'kindness-ripple': '4-9', 'story-quilt': '5-9', 'patient-maker-passport': '5-9',
  'trust-meter': '4-8', 'harmonia-orchestra': '3-6', 'ask-first-architect': '5-9', 'true-treasure-chest': '5-9', 'one-of-a-kind-tree': '4-8', 'kindness-mirror': '4-8', 'listen-like-a-fox': '4-8', 'puddle-voyage': '3-7', 'map-my-world': '4-8', 'leo-and-the-wolf-worksheet': '4-8', 'shadow-science': '3-7', 'brave-breathing': '4-8', 'inventor-blueprint': '5-9', 'thousand-cubes-challenge': '5-9', 'tree-timeline': '5-9',
  'small-noticer': '4-8', 'kindness-chain': '5-9', 'rough-to-smooth': '5-9',
  'everyone-gets-heard': '5-9', 'coins-you-cant-spend': '5-9',
};

test('studio — all studio activities exist, trilingual, with the table ages', () => {
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

/** Position on the book page when not first: the Leo worksheet follows Trust Meter. A number
 *  applies to every book in the table; an object gives the slot per book. Wave 4 put each
 *  book's own activity first, so the shared ones moved to slot 2 on those books. */
const SLOT = {
  'leo-and-the-wolf-worksheet': 1, 'shadow-science': 1, 'brave-breathing': 1, 'inventor-blueprint': 1, 'thousand-cubes-challenge': 1, 'tree-timeline': 1,
  'kindness-ripple': 1,
  'everyone-gets-heard': 1, 'coins-you-cant-spend': 1,
  'patient-maker-passport': { 'sanding-block': 1 },
};
const slotFor = (slug, id) => (typeof SLOT[slug] === 'object' ? SLOT[slug][id] ?? 0 : SLOT[slug] ?? 0);

test('studio — every "best book connection" lists the activity first, and only those books do', () => {
  for (const [slug, ids] of Object.entries(TABLE)) {
    for (const id of ids) {
      const b = books.find((x) => x.id === id);
      assert.ok(b, `${slug}: unknown book ${id}`);
      const slot = slotFor(slug, id);
      assert.equal(b.relatedActivityIds?.[slot], slug, `${id}: ${slug} must be related activity #${slot + 1}`);
    }
    const referencing = books.filter((b) => (b.relatedActivityIds ?? []).includes(slug)).map((b) => b.id).sort();
    assert.deepEqual(referencing, [...ids].sort(), `${slug}: books referencing it must match the table`);
  }
});

test('studio — no English copy in the studio pages carries an em dash', async () => {
  // House style: no em dashes in English copy. The studio files hold all three languages,
  // and none of them uses one, so the whole file is checked.
  const { readFileSync, readdirSync } = await import('node:fs');
  const files = ['src/demos/studio/StudioFrame.tsx', ...readdirSync('src/demos').filter((f) => /^(ColorMixLab|FeelingsWeather|BravePlan|CloudDetective|ShadowTheatre|KindnessRipple|StoryQuilt|MakerPassport|TrustMeter|ColorOrchestra|AskFirstArchitect|TreasureChest|OneOfAKindTree|KindnessMirror|ListenLikeAFox|PuddleVoyage|MapMyWorld|LeoWorksheet|ShadowScience|BraveBreathing|InventorBlueprint|ThousandCubes|TreeTimeline|SmallNoticer|KindnessChain|RoughToSmooth|EveryoneGetsHeard|TrueRichesCoins)Demo\.tsx$/.test(f)).map((f) => `src/demos/${f}`)];
  assert.equal(files.length, 29);
  for (const f of files) assert.ok(!readFileSync(f, 'utf8').includes('\u2014'), `${f}: em dash`);
});
