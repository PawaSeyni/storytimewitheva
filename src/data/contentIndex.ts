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
