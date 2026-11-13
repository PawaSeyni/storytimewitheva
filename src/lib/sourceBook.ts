import { useSearchParams } from 'react-router-dom';
import { sourceBookFor } from './journey';
import { useHydrated } from './hydrated';

/** Query parameter a book page adds to its activity links: /activities/<slug>?book=<id>. */
export const SOURCE_BOOK_PARAM = 'book';

/** Append the source-book parameter to an activity or game href. */
export function withSourceBook(href: string, bookId: string | undefined): string {
  if (!bookId) return href;
  return `${href}${href.includes('?') ? '&' : '?'}${SOURCE_BOOK_PARAM}=${encodeURIComponent(bookId)}`;
}

/** The validated book the reader came from on this activity page, or null. */
export function useSourceBook(activitySlug: string): string | null {
  const [params] = useSearchParams();
  // ?book= is not in the prerendered snapshot: apply it once hydration is done.
  const hydrated = useHydrated();
  return hydrated ? sourceBookFor(activitySlug, params.get(SOURCE_BOOK_PARAM)) : null;
}
