// Deterministic, explainable book recommendations (Sprint 6 S6-007).
//
// BROWSER-FREE and pure: no storage, no React, no clock. Callers pass a context and get
// scored candidates back, so build scripts and CI rank exactly what the UI renders.
//
// ---------------------------------------------------------------------------------
// ENGINE, NOT POLICY
//
// This module answers "how do these books relate, and why". It does NOT decide how many
// to show or which tiers are allowed on a given surface — that is policy, and it differs
// per surface. src/data/relatedBooks.ts is the book-page policy (owner-approved: editorial
// first, theme top-up, never age filler); the homepage uses a different one.
//
// Keeping the two apart is what stops a signed-off editorial decision from being quietly
// widened by a change made for another screen.
// ---------------------------------------------------------------------------------

import { books } from '../data/books.data';
import { incomingRelatedBookIds } from '../data/contentIndex';
import { derivePrimaryAgeBand, type AgeBandId, type ThemeId } from '../data/taxonomy';

/** Sprint 6 §6 ranking tiers, strongest first. */
export const REASON_ORDER = ['editorial', 'related', 'theme', 'age', 'preference'] as const;
export type RecommendationReason = (typeof REASON_ORDER)[number];

export interface RecommendationContext {
  /** Books to recommend FROM (usually the page you are on, or what you are reading). */
  sourceBookIds?: string[];
  /** Explicit favorites, treated as a stronger signal than a passive view. */
  favoriteBookIds?: string[];
  /** Adult-selected preferences (S6-005). */
  ageBandIds?: AgeBandId[];
  themeIds?: ThemeId[];
  /** Never recommend these — the current page, already-read books, anything shown above. */
  excludeIds?: string[];
  limit: number;
  /** Allow only these tiers. Omit for all. Lets a surface enforce its own policy. */
  allowReasons?: readonly RecommendationReason[];
}

export interface Recommendation {
  bookId: string;
  score: number;
  /** Every tier that matched, strongest first. The UI localizes the first one. */
  reasons: RecommendationReason[];
}

/** Weights are per-tier and spaced so a stronger tier always outranks a weaker stack. */
const WEIGHT: Record<RecommendationReason, number> = {
  editorial: 100,
  related: 50,
  theme: 10,
  age: 4,
  preference: 2,
};

const order = new Map(books.map((b, i) => [b.id, i]));
const byId = new Map(books.map((b) => [b.id, b]));

/**
 * Score and rank candidates. Pure and deterministic: ties break on catalog (editorial)
 * order, then book ID, so the same context always produces the same list.
 */
export function recommend(ctx: RecommendationContext): Recommendation[] {
  const sources = (ctx.sourceBookIds ?? []).filter((id) => byId.has(id));
  const favorites = (ctx.favoriteBookIds ?? []).filter((id) => byId.has(id));
  const seeds = [...new Set([...sources, ...favorites])];
  const allowed = new Set<RecommendationReason>(ctx.allowReasons ?? REASON_ORDER);
  const excluded = new Set([...(ctx.excludeIds ?? []), ...seeds]);

  const seedThemes = new Set<ThemeId>();
  const seedBands = new Set<AgeBandId>();
  const editorialTargets: string[] = [];
  for (const id of seeds) {
    const b = byId.get(id);
    if (!b) continue;
    for (const t of b.themeIds) seedThemes.add(t);
    seedBands.add(derivePrimaryAgeBand(b.ageRange));
    for (const target of b.relatedBookIds ?? []) editorialTargets.push(target);
  }
  const editorial = new Set(editorialTargets);
  // "related" is the REVERSE relation: books that link TO a seed. A distinct, genuinely
  // editorial signal from relatedBookIds, and the only other relation the catalog has.
  const related = new Set(seeds.flatMap((id) => incomingRelatedBookIds[id] ?? []));

  const prefThemes = new Set(ctx.themeIds ?? []);
  const prefBands = new Set(ctx.ageBandIds ?? []);

  const scored: Recommendation[] = [];
  for (const b of books) {
    if (excluded.has(b.id)) continue;
    const reasons: RecommendationReason[] = [];

    if (allowed.has('editorial') && editorial.has(b.id)) reasons.push('editorial');
    if (allowed.has('related') && related.has(b.id)) reasons.push('related');
    if (allowed.has('theme') && b.themeIds.some((t) => seedThemes.has(t) || prefThemes.has(t))) {
      reasons.push('theme');
    }
    const band = derivePrimaryAgeBand(b.ageRange);
    if (allowed.has('age') && (seedBands.has(band) || prefBands.has(band))) reasons.push('age');
    if (
      allowed.has('preference') &&
      (b.themeIds.some((t) => prefThemes.has(t)) || prefBands.has(band))
    ) {
      reasons.push('preference');
    }

    if (reasons.length === 0) continue;
    const score = reasons.reduce((sum, r) => sum + WEIGHT[r], 0);
    scored.push({ bookId: b.id, score, reasons });
  }

  scored.sort(
    (a, z) =>
      z.score - a.score ||
      order.get(a.bookId)! - order.get(z.bookId)! ||
      a.bookId.localeCompare(z.bookId),
  );
  return scored.slice(0, Math.max(0, ctx.limit));
}

/** Deterministic catalog fallback (Sprint 6 §6, final tier) when nothing else matches. */
export function catalogFallback(limit: number, excludeIds: string[] = []): string[] {
  const excluded = new Set(excludeIds);
  return books
    .filter((b) => !excluded.has(b.id))
    .slice(0, Math.max(0, limit))
    .map((b) => b.id);
}

/** True when there is enough local context to justify a personalized section (S6-006). */
export function hasEnoughContext(ctx: {
  favoriteBookIds?: string[];
  readingBookIds?: string[];
  recentBookIds?: string[];
  themeIds?: string[];
  ageBandIds?: string[];
}): boolean {
  const signals =
    (ctx.favoriteBookIds?.length ?? 0) +
    (ctx.readingBookIds?.length ?? 0) +
    (ctx.recentBookIds?.length ?? 0) +
    (ctx.themeIds?.length ?? 0) +
    (ctx.ageBandIds?.length ?? 0);
  // Two signals, so a single stray page view does not turn the homepage into a
  // personalized shell that says less than the default page it replaced.
  return signals >= 2;
}
