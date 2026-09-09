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
export const collectionRouteIds: string[] = [...collectionEligibleThemeIds, ...ageCollectionEligibleBandIds];

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
