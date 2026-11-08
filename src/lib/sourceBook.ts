import { useSearchParams } from 'react-router-dom';
import { sourceBookFor } from './journey';

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
  return sourceBookFor(activitySlug, params.get(SOURCE_BOOK_PARAM));
}
