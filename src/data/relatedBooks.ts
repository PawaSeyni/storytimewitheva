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

export const RELATED_BOOKS_LIMIT = 3;

export type RelatedTier = 'editorial' | 'theme';

export interface RelatedBook {
  id: string;
  tier: RelatedTier;
}

const catalogOrder = new Map(books.map((b, i) => [b.id, i]));

/**
 * Ordered recommendations for one book: editorial picks first, then theme matches to
 * top up to `limit`. Returns fewer than `limit` when there are not enough real matches.
 * Pure and deterministic — theme ties break on catalog (editorial) order, never on
 * iteration order.
 */
export function relatedBooksFor(bookId: string, limit: number = RELATED_BOOKS_LIMIT): RelatedBook[] {
  const source = books.find((b) => b.id === bookId);
  if (!source) return [];

  const taken = new Set<string>([bookId]);
  const out: RelatedBook[] = [];

  // Tier 1 — editorial, in signed-off order. Unknown ids are skipped rather than
  // rendered as dead cards; tests/funnel/relationships.test.mjs fails the build on them.
  for (const id of source.relatedBookIds ?? []) {
    if (out.length >= limit) break;
    if (taken.has(id) || !catalogOrder.has(id)) continue;
    taken.add(id);
    out.push({ id, tier: 'editorial' });
  }

  // Tier 2 — top up from shared themes only.
  if (out.length < limit) {
    const candidates = books
      .filter((b) => !taken.has(b.id))
      .map((b) => ({ id: b.id, shared: b.themeIds.filter((t) => source.themeIds.includes(t)).length }))
      .filter((c) => c.shared > 0)
      .sort((a, z) => z.shared - a.shared || catalogOrder.get(a.id)! - catalogOrder.get(z.id)!);

    for (const c of candidates) {
      if (out.length >= limit) break;
      taken.add(c.id);
      out.push({ id: c.id, tier: 'theme' });
    }
  }

  return out;
}
