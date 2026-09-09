// Build-time-derivable reverse indexes and collection counts (taxonomy v1 §6.2).
//
// BROWSER-FREE and pure: everything here is DERIVED from the forward source of
// truth (books.data.ts + taxonomy.ts) at import time. Reverse relationships are
// never persisted in source records — persisting them guarantees drift, and this
// module is cheap to recompute (20 books).
//
// Used by runtime UI (collections, "more like this", counts) and by build scripts /
// CI validation through the projection in scripts/lib/catalog.mjs.

import { books } from './books.data';
import { activities } from './activities.data';
import { resources } from './resources';
import { journeys, type ReadingJourney } from './journeys';
import { collections, type CollectionRecord } from './collections';
import { learningPacks, type LearningPack } from './learningPacks';
import {
  THEME_IDS,
  AGE_BAND_IDS,
  THEME_COLLECTION_MINIMUM,
  derivePrimaryAgeBand,
  type ThemeId,
  type AgeBandId,
} from './taxonomy';

type BookId = string;

const emptyByTheme = () =>
  Object.fromEntries(THEME_IDS.map((t) => [t, [] as BookId[]])) as Record<ThemeId, BookId[]>;
const emptyByBand = () =>
  Object.fromEntries(AGE_BAND_IDS.map((b) => [b, [] as BookId[]])) as Record<AgeBandId, BookId[]>;

/** Books carrying each theme, in catalog (editorial) order. */
export const booksByThemeId: Record<ThemeId, BookId[]> = (() => {
  const idx = emptyByTheme();
  for (const b of books) for (const t of b.themeIds) idx[t].push(b.id);
  return idx;
})();

/** Books whose single primary-fit collection is each age band (discovery placement). */
export const booksByPrimaryAgeBand: Record<AgeBandId, BookId[]> = (() => {
  const idx = emptyByBand();
  for (const b of books) idx[derivePrimaryAgeBand(b.ageRange)].push(b.id);
  return idx;
})();

/** Which books link TO a given book (reverse of relatedBookIds). */
export const incomingRelatedBookIds: Record<BookId, BookId[]> = (() => {
  const idx: Record<BookId, BookId[]> = Object.fromEntries(books.map((b) => [b.id, [] as BookId[]]));
  for (const b of books) for (const target of b.relatedBookIds ?? []) idx[target]?.push(b.id);
  return idx;
})();

/** Which books reference a given activity (reverse of relatedActivityIds). */
export const booksByActivityId: Record<string, BookId[]> = (() => {
  const idx: Record<string, BookId[]> = {};
  for (const b of books) for (const a of b.relatedActivityIds ?? []) (idx[a] ??= []).push(b.id);
  return idx;
})();

/** Published-book count per theme — drives collection counts and eligibility. */
export const themeCounts: Record<ThemeId, number> = Object.fromEntries(
  THEME_IDS.map((t) => [t, booksByThemeId[t].length]),
) as Record<ThemeId, number>;

/**
 * Themes eligible for a PUBLIC collection route. A theme below the minimum stays a
 * valid tag and search facet but must not generate a route (avoids thin pages
 * without corrupting accurate book metadata).
 */
export const collectionEligibleThemeIds: ThemeId[] = THEME_IDS.filter(
  (t) => themeCounts[t] >= THEME_COLLECTION_MINIMUM,
);

export const isCollectionEligible = (t: ThemeId): boolean => collectionEligibleThemeIds.includes(t);

/**
 * Age-band collections (S7-002) are held to the SAME minimum as theme collections. Today
 * every band clears it (4 / 10 / 6), but the gate exists so a future catalog change that
 * empties a band retires its route instead of shipping a thin page.
 */
export const ageCollectionEligibleBandIds: AgeBandId[] = AGE_BAND_IDS.filter(
  (b) => booksByPrimaryAgeBand[b].length >= THEME_COLLECTION_MINIMUM,
);

export const isAgeCollectionEligible = (b: AgeBandId): boolean =>
  ageCollectionEligibleBandIds.includes(b);

/**
 * Every id that MAY appear under /collections/. Theme ids and age-band ids share the
 * route namespace and cannot collide: themes are words, bands are `ages-N-M`. The sitemap,
 * the prerender guard and the page all read this one list, so they cannot disagree.
 */
// ---------------------------------------------------------------------------------
// Collection RECORDS (S7-001) — the editorial layer. See src/data/collections.ts.
// ---------------------------------------------------------------------------------

/** Derived membership for a theme or age collection id, in catalog order. */
export function derivedCollectionMembers(id: string): BookId[] {
  if ((THEME_IDS as readonly string[]).includes(id)) return booksByThemeId[id as ThemeId];
  if ((AGE_BAND_IDS as readonly string[]).includes(id)) return booksByPrimaryAgeBand[id as AgeBandId];
  return [];
}

/** Every reason a collection record may not publish. Empty = valid. */
export function collectionProblems(c: CollectionRecord): string[] {
  const out: string[] = [];
  const bookIds = new Set(books.map((b) => b.id));
  const slugs = new Set(activities.map((a) => a.slug));
  const resIds = new Set(resources.map((r) => r.id));
  const langs = ['en', 'fr', 'es'] as const;
  if (!/^[a-z0-9-]+$/.test(c.id)) out.push(`id "${c.id}" is not a bare route token`);
  const derivedKind = c.kind === 'theme' || c.kind === 'age';
  if (c.kind === 'theme' && !(THEME_IDS as readonly string[]).includes(c.id)) out.push(`theme record "${c.id}" is not a theme id`);
  if (c.kind === 'age' && !(AGE_BAND_IDS as readonly string[]).includes(c.id)) out.push(`age record "${c.id}" is not an age-band id`);
  if (derivedKind && c.bookIds) out.push(`${c.id}: theme/age records must not carry bookIds (membership is derived)`);
  if (!derivedKind && (THEME_IDS as readonly string[]).concat(AGE_BAND_IDS).includes(c.id)) out.push(`${c.id}: editorial record id collides with a taxonomy id`);
  const members = derivedKind ? derivedCollectionMembers(c.id) : (c.bookIds ?? []);
  if (!derivedKind) {
    if (members.length < THEME_COLLECTION_MINIMUM) out.push(`${c.id}: fewer than ${THEME_COLLECTION_MINIMUM} books`);
    for (const id of members) if (!bookIds.has(id)) out.push(`${c.id}: bookIds references missing "${id}"`);
    if (new Set(members).size !== members.length) out.push(`${c.id}: duplicate book in bookIds`);
    if (!c.title || !c.description) out.push(`${c.id}: editorial collections need their own title and description`);
  }
  for (const id of c.bookOrder ?? []) if (!members.includes(id)) out.push(`${c.id}: bookOrder contains "${id}", not a member`);
  if (c.bookOrder && new Set(c.bookOrder).size !== c.bookOrder.length) out.push(`${c.id}: duplicate in bookOrder`);
  const memberSet = new Set(members);
  const relatedActivities = new Set(members.flatMap((id) => books.find((b) => b.id === id)?.relatedActivityIds ?? []));
  for (const a of c.activityIds ?? []) {
    if (!slugs.has(a)) out.push(`${c.id}: activityIds references missing "${a}"`);
    else if (!relatedActivities.has(a)) out.push(`${c.id}: featured activity "${a}" is not related to any member book`);
  }
  if (c.activityIds && new Set(c.activityIds).size !== c.activityIds.length) out.push(`${c.id}: duplicate in activityIds`);
  for (const r of c.resourceIds ?? []) if (!resIds.has(r)) out.push(`${c.id}: resourceIds references missing "${r}"`);
  for (const key of ['title', 'description'] as const) {
    const v = c[key];
    if (v) for (const l of langs) if (!v[l]?.trim()) out.push(`${c.id}: ${key} override missing ${l}`);
  }
  for (const t of c.themeIds ?? []) if (!THEME_IDS.includes(t)) out.push(`${c.id}: unknown theme "${t}"`);
  for (const a of c.ageBandIds ?? []) if (!AGE_BAND_IDS.includes(a)) out.push(`${c.id}: unknown age band "${a}"`);
  void memberSet;
  return out;
}

/** Records by id — only published AND valid ones are consulted at render time. */
export const collectionRecordById: Record<string, CollectionRecord> = Object.fromEntries(
  collections.filter((c) => c.publishState === 'published' && collectionProblems(c).length === 0).map((c) => [c.id, c]),
);

/** Editorial collections (educator/seasonal) that may have a public route. */
export const publishedEditorialCollectionIds: string[] = collections
  .filter((c) => (c.kind === 'educator' || c.kind === 'seasonal') && c.publishState === 'published' && collectionProblems(c).length === 0)
  .map((c) => c.id);

/**
 * Members of any collection id in DISPLAY order: the record's bookOrder first (if any),
 * then the remaining derived members in catalog order. Editorial kinds use their bookIds.
 */
export function collectionMembers(id: string): BookId[] {
  const rec = collectionRecordById[id];
  if (rec && (rec.kind === 'educator' || rec.kind === 'seasonal')) return [...(rec.bookIds ?? [])];
  const derived = derivedCollectionMembers(id);
  const head = (rec?.bookOrder ?? []).filter((b) => derived.includes(b));
  return [...head, ...derived.filter((b) => !head.includes(b))];
}

/**
 * Every id that MAY appear under /collections/. Theme ids, age-band ids and published
 * editorial records share the namespace; the validator rejects a collision. The sitemap,
 * the prerender guard and the page all read this one list.
 */
export const collectionRouteIds: string[] = [...collectionEligibleThemeIds, ...ageCollectionEligibleBandIds, ...publishedEditorialCollectionIds];

// ---------------------------------------------------------------------------------
// Reading journeys (S7-003 / S7-009 / S7-013 / S7-014)
// ---------------------------------------------------------------------------------

const LANGS = ['en', 'fr', 'es'] as const;

/**
 * Every reason a journey may NOT publish. Empty array = valid. Run at build time and in
 * CI (tests/funnel/journeys.test.mjs); a published journey with any problem fails the
 * build rather than shipping a broken step. Draft journeys are validated too, but do not
 * block — they only block if they would be published.
 */
export function journeyProblems(j: ReadingJourney): string[] {
  const out: string[] = [];
  const bookIds = new Set(books.map((b) => b.id));
  const slugs = new Set(activities.map((a) => a.slug));
  const resIds = new Set(resources.map((r) => r.id));
  if (!/^[a-z0-9-]+$/.test(j.id)) out.push(`id "${j.id}" is not a bare route token`);
  for (const l of LANGS) {
    if (!j.title[l]?.trim()) out.push(`missing ${l} title`);
    if (!j.description[l]?.trim()) out.push(`missing ${l} description`);
  }
  for (const t of j.themeIds) if (!THEME_IDS.includes(t)) out.push(`unknown theme "${t}"`);
  for (const a of j.ageBandIds) if (!AGE_BAND_IDS.includes(a)) out.push(`unknown age band "${a}"`);
  if (j.steps.length < 2) out.push('fewer than two steps');
  const ids = j.steps.map((s) => s.id);
  if (new Set(ids).size !== ids.length) out.push('duplicate step id');
  for (const s of j.steps) {
    if (!s.id.startsWith(`${j.id}-`)) out.push(`step "${s.id}" is not namespaced under the journey`);
    const ok =
      s.type === 'activity' ? slugs.has(s.contentId)
      : s.type === 'resource' ? resIds.has(s.contentId)
      : bookIds.has(s.contentId); // book, discussion, next-book all name a book
    if (!ok) out.push(`step "${s.id}" (${s.type}) references missing "${s.contentId}"`);
    if (s.type === 'discussion') {
      const b = books.find((x) => x.id === s.contentId);
      if (b && !(b.discussionQuestions?.length)) out.push(`step "${s.id}" asks to discuss "${s.contentId}", which has no prompts`);
    }
  }
  if (!j.steps.some((s) => s.type === 'book')) out.push('no book step');
  if (!j.steps.some((s) => s.type === 'next-book' || s.type === 'activity')) out.push('no meaningful continuation step');
  if (j.steps[0]?.type !== 'book') out.push('first step must be a book');
  return out;
}

/** Journeys that may have a public route: published AND valid. */
export const publishedJourneys: ReadingJourney[] = journeys.filter(
  (j) => j.publishState === 'published' && journeyProblems(j).length === 0,
);

export const journeyRouteIds: string[] = publishedJourneys.map((j) => j.id);

/** DERIVED reverse relation: which published journeys include a given book. */
export const journeysByBookId: Record<BookId, string[]> = (() => {
  const idx: Record<BookId, string[]> = Object.fromEntries(books.map((b) => [b.id, [] as string[]]));
  for (const j of publishedJourneys) {
    for (const s of j.steps) {
      if (s.type !== 'activity' && s.type !== 'resource' && idx[s.contentId] && !idx[s.contentId].includes(j.id)) {
        idx[s.contentId].push(j.id);
      }
    }
  }
  return idx;
})();

// ---------------------------------------------------------------------------
// Learning packs (S7-008): curated groups of existing downloads that are also lead magnets.
// ---------------------------------------------------------------------------

const RESERVED_PACK_SLUGS = ['bedtime-routine', 'bilingual-bundle', 'bilingual-starter-kit', 'bilingual-flashcards', 'parents-guide', 'follow-up-activities', 'leo-and-the-wolf'];

/** Every reason a pack record is invalid. Empty means publishable. */
export function learningPackProblems(p: LearningPack): string[] {
  const problems: string[] = [];
  if (!/^[a-z0-9-]+$/.test(p.id)) problems.push(`id "${p.id}" is not a bare route token`);
  if (RESERVED_PACK_SLUGS.includes(p.id)) problems.push(`id "${p.id}" collides with a registered lead magnet`);
  if (resources.some((r) => r.slug === p.id)) problems.push(`id "${p.id}" collides with a download slug`);
  if (collectionRouteIds.includes(p.id)) problems.push(`id "${p.id}" collides with a collection id`);
  if (learningPacks.filter((x) => x.id === p.id).length > 1) problems.push(`duplicate pack id "${p.id}"`);
  if (!['parent', 'educator', 'both'].includes(p.audience)) problems.push(`unknown audience "${p.audience}"`);
  if (p.ageBandIds.length === 0) problems.push('a pack needs at least one age band');
  for (const b of p.ageBandIds) if (!(AGE_BAND_IDS as string[]).includes(b)) problems.push(`unknown age band "${b}"`);
  for (const t of p.themeIds ?? []) if (!(THEME_IDS as string[]).includes(t)) problems.push(`unknown theme "${t}"`);
  if (p.resourceIds.length < 2) problems.push('a pack bundles at least two printables');
  if (new Set(p.resourceIds).size !== p.resourceIds.length) problems.push('duplicate resource in pack');
  for (const id of p.resourceIds) {
    const r = resources.find((x) => x.id === id);
    if (!r) problems.push(`resource "${id}" does not exist`);
    else if (r.kind !== 'download') problems.push(`resource "${id}" is not a download`);
  }
  for (const c of p.collectionIds ?? []) if (!collectionRouteIds.includes(c)) problems.push(`collection "${c}" is not a public collection`);
  for (const lang of LANGS) {
    if (!p.title?.[lang]?.trim()) problems.push(`missing ${lang} title`);
    if (!p.description?.[lang]?.trim() || p.description[lang].trim().length < 40) problems.push(`missing or thin ${lang} description`);
  }
  return problems;
}

export const publishedLearningPacks: LearningPack[] = learningPacks.filter(
  (p) => p.publishState === 'published' && learningPackProblems(p).length === 0,
);
export const learningPackIds: string[] = publishedLearningPacks.map((p) => p.id);
export const learningPackById: Record<string, LearningPack> = Object.fromEntries(publishedLearningPacks.map((p) => [p.id, p]));

/** The download resources of a pack, in pack order (published packs only resolve). */
export function packResources(id: string) {
  const p = learningPackById[id];
  if (!p) return [];
  return p.resourceIds.map((rid) => resources.find((r) => r.id === rid)).filter((r) => r !== undefined);
}

/** Derived reverse relation: which published packs accompany each collection. */
export const packsByCollectionId: Record<string, string[]> = (() => {
  const idx: Record<string, string[]> = {};
  for (const p of publishedLearningPacks) for (const c of p.collectionIds ?? []) (idx[c] ??= []).push(p.id);
  return idx;
})();
