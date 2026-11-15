// Book companions (activities audit 2026-11, §4C): one free, email-gated "story companion"
// per published book at /free/<book-id>-companion. BROWSER-FREE, so the prerender and the
// funnel tests read the same list.
//
// A companion is a curated set of activities that ALREADY exist for every book, not a new
// file: the two-page story worksheet (Leo's hand-written one for Leo), Pixel's Story Quiz,
// and the story-word flashcards, each opened in that book's mode (?book=<id>). EmailSignup
// builds the offer from this record, so a companion is a lead magnet with no per-book code.
//
// The slug carries a "-companion" suffix because /free/leo-and-the-wolf is already the free
// Leo storybook, and must not collide with any other magnet, pack or download slug
// (tests/funnel/book-companions.test.mjs).

import { books } from './books.data';
import type { Language } from '../lib/language';
import { prefixOf } from '../lib/locales';

export const companionSlug = (bookId: string) => `${bookId}-companion`;

/** Every published book gets a companion; "coming soon" books do not. */
export const companionBooks = books.filter((b) => b.status !== 'coming-soon');
export const BOOK_COMPANION_SLUGS = companionBooks.map((b) => companionSlug(b.id));

export type CompanionItemKey = 'worksheet' | 'quiz' | 'flashcards';

/** The companion's items as site paths in the visitor's language, with the book in the
 *  query. The flashcards are a standalone game, so the language travels as ?lang= (see
 *  gameUrl) instead of a path prefix. */
export function companionItems(bookId: string, language: Language): { key: CompanionItemKey; href: string }[] {
  const lang = prefixOf(language);
  const q = `?book=${encodeURIComponent(bookId)}`;
  const worksheet = bookId === 'leo-and-the-wolf' ? `/activities/leo-and-the-wolf-worksheet/${q}` : `/activities/story-worksheet/${q}`;
  return [
    { key: 'worksheet', href: `${lang}${worksheet}` },
    { key: 'quiz', href: `${lang}/activities/pixel-quiz/${q}` },
    { key: 'flashcards', href: `/games/bilingual-flashcards.html${q}${language === 'en' ? '' : `&lang=${language}`}` },
  ];
}
