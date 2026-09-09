// Continue-the-journey resolution (Sprint 4 S4-010 / S4-011).
//
// BROWSER-FREE and pure. Given where the reader is, returns the FIRST valid next action in
// the order the spec fixes: related activity -> related book -> related resource -> browse
// all books. Components render the result and its localized label; they do not own
// relationship data, and nothing here is a second copy of the catalog.
//
// Every candidate is checked against the live registries before it is returned, so this
// can never hand a component a broken link. If nothing resolves at all, it returns null
// and the component renders nothing (the spec forbids an empty or dead CTA).

import { books } from '../data/books.data';
import { activities } from '../data/activities.data';
import { resources } from '../data/resources';
import { booksByActivityId } from '../data/contentIndex';

export type JourneySource = 'book' | 'activity' | 'resource';
export type JourneyReason = 'related-activity' | 'related-book' | 'related-resource' | 'fallback';

export interface JourneyTarget {
  type: 'activity' | 'book' | 'resource' | 'catalog';
  id?: string;
  /** Unprefixed internal path, or a /games/ path for standalone games. Language is applied by the caller. */
  href: string;
  reason: JourneyReason;
  /** True when href is a standalone game (static HTML) and must not be language-prefixed. */
  game?: boolean;
}

const bookById = new Map(books.map((b) => [b.id, b]));
const activityBySlug = new Map(activities.map((a) => [a.slug, a]));
const resourceById = new Map(resources.map((r) => [r.id, r]));

function activityTarget(slug: string, reason: JourneyReason): JourneyTarget | null {
  const a = activityBySlug.get(slug);
  if (!a) return null;
  return a.game
    ? { type: 'activity', id: slug, href: `/games/${slug}.html`, reason, game: true }
    : { type: 'activity', id: slug, href: `/activities/${slug}`, reason };
}

function bookTarget(id: string, reason: JourneyReason): JourneyTarget | null {
  return bookById.has(id) ? { type: 'book', id, href: `/books/${id}`, reason } : null;
}

function resourceTarget(id: string, reason: JourneyReason): JourneyTarget | null {
  const r = resourceById.get(id);
  if (!r) return null;
  const href = r.kind === 'article' ? `/resources#${r.slug}` : `/free/${r.slug}`;
  return { type: 'resource', id, href, reason };
}

const CATALOG: JourneyTarget = { type: 'catalog', href: '/books', reason: 'fallback' };

/**
 * The first valid continuation for a piece of content, in spec priority. Deterministic:
 * relationship arrays are in editorial order and the first resolvable entry wins.
 */
export function nextStep(sourceType: JourneySource, sourceId: string): JourneyTarget | null {
  if (sourceType === 'book') {
    const b = bookById.get(sourceId);
    if (!b) return null;
    for (const s of b.relatedActivityIds ?? []) { const t = activityTarget(s, 'related-activity'); if (t) return t; }
    for (const id of b.relatedBookIds ?? []) { const t = bookTarget(id, 'related-book'); if (t) return t; }
    for (const id of b.relatedResourceIds ?? []) { const t = resourceTarget(id, 'related-resource'); if (t) return t; }
    return CATALOG;
  }

  if (sourceType === 'activity') {
    if (!activityBySlug.has(sourceId)) return null;
    // An activity has no forward relations of its own; the books that reference it are
    // the DERIVED reverse relation (S4-011), in catalog order, so no activity dead-ends
    // while any book points at it.
    for (const id of booksByActivityId[sourceId] ?? []) { const t = bookTarget(id, 'related-book'); if (t) return t; }
    return CATALOG;
  }

  // Resources carry no relationships yet (B-03 chose a shared strip over per-book
  // pairing), so the only honest continuation is the catalog.
  return resourceById.has(sourceId) ? CATALOG : null;
}
