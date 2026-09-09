// "You might also like" ranking (Sprint 6, backlog B-04 — owner decision 2026-09-08).
//
// BROWSER-FREE and pure so build scripts and CI validate the same ranking the UI renders.
//
// TWO TIERS, in this order:
//   1. EDITORIAL — the book's own `relatedBookIds`, in the order they were signed off.
//   2. THEME     — books sharing at least one themeId, used only to TOP UP a short list.
//
// The tiers stay separate on purpose. Sprint 6 ranks "editorial relation" above
// "matched theme", so the theme tier can never displace or reorder an editorial pick;
// it only fills seats the editorial tier left empty.
//
// There is deliberately NO third tier. Age-band-only matches were rejected catalog-wide
// as filler, so a book with too few thematic neighbours returns a SHORT list rather than
// a padded one. See docs/PUNCH_LIST.md §E.

import { books } from './books.data';
import { recommend } from '../lib/recommendations';

export const RELATED_BOOKS_LIMIT = 3;

export type RelatedTier = 'editorial' | 'theme';

export interface RelatedBook {
  id: string;
  tier: RelatedTier;
}

/**
 * Ordered recommendations for one book: editorial picks first, then theme matches to
 * top up to `limit`. Returns fewer than `limit` when there are not enough real matches.
 *
 * Ranking is delegated to src/lib/recommendations.ts so there is ONE scoring engine; this
 * function is the book-page POLICY over it. The policy is the owner-approved decision and
 * is deliberately narrower than the engine: only the editorial and theme tiers are
 * allowed, so age-band-only filler can never appear here even though the engine can
 * produce it for other surfaces.
 */
export function relatedBooksFor(bookId: string, limit: number = RELATED_BOOKS_LIMIT): RelatedBook[] {
  const source = books.find((b) => b.id === bookId);
  if (!source) return [];

  const editorialIds = (source.relatedBookIds ?? [])
    .filter((id) => id !== bookId && books.some((b) => b.id === id))
    .slice(0, limit);

  const out: RelatedBook[] = editorialIds.map((id) => ({ id, tier: 'editorial' }));
  if (out.length >= limit) return out;

  // Top up from the theme tier only. `allowReasons` is what enforces "no age filler".
  const topUp = recommend({
    sourceBookIds: [bookId],
    excludeIds: [bookId, ...editorialIds],
    allowReasons: ['theme'],
    limit: limit - out.length,
  });
  for (const r of topUp) out.push({ id: r.bookId, tier: 'theme' });
  return out;
}
