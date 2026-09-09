// Eva Gallo Collection — published books in the imprint.
//
// Single source of truth for the catalog. Each book carries localized
// title/subtitle/description/theme plus an `editions` map holding the per-language
// Amazon ASIN + cover. localize(book, lang) resolves everything for one language
// (falling back to English), so pages never store per-language content separately.
// tests/funnel/catalog.test.mjs guards completeness (every book has an en edition;
// every referenced cover exists; no orphan covers).

//
// Catalog DATA + types now live in ./books.data.ts (browser-free) so build scripts
// can load the same source of truth. This module keeps the runtime surface and
// re-exports that data, so every existing import of './books' is unchanged.

import { useLanguage, type Language } from '../lib/language';
import { amazonDp, AMAZON_AUTHOR_URL } from '../lib/amazon';
import { books, ALL_LANGUAGES, type Book } from './books.data';
import type { ThemeId } from './taxonomy';

export { books, ALL_LANGUAGES };
export type { Book, Edition, LocalizedString } from './books.data';

export interface LocalizedBook {
  id: string;
  coverImage: string;
  ageRange: string;
  /** Stable theme IDs — filtering/collections resolve by ID, never by parsing the
   *  localized `theme` phrase below (taxonomy v1). */
  themeIds: ThemeId[];
  languages: string[];
  amazonUrl: string;
  /** Language of the Amazon edition the Buy link points at ('en' when the site language has no own edition). S5-003. */
  editionLang: Language;
  featured?: boolean;
  status?: 'published' | 'coming-soon';
  title: string;
  subtitle?: string;
  description: string;
  theme: string;
}

const dp = amazonDp;

/** A book not yet for sale — show a "coming soon" placeholder instead of a Buy CTA. */
export const isComingSoon = (b: { status?: string }): boolean => b.status === 'coming-soon';

function localize(book: Book, lang: Language): LocalizedBook {
  const en = book.editions.en;
  const ed = book.editions[lang] ?? en;
  const asin = ed.asin ?? en.asin;
  return {
    id: book.id,
    coverImage: ed.cover ?? en.cover ?? '',
    ageRange: book.ageRange,
    themeIds: book.themeIds,
    languages: ALL_LANGUAGES,
    amazonUrl: asin ? dp(asin) : AMAZON_AUTHOR_URL,
    editionLang: book.editions[lang]?.asin ? lang : 'en',
    featured: book.featured,
    status: book.status,
    title: book.title[lang] ?? book.title.en,
    subtitle: book.subtitle ? (book.subtitle[lang] ?? book.subtitle.en) : undefined,
    description: book.description[lang] ?? book.description.en,
    theme: book.theme[lang] ?? book.theme.en,
  };
}

/** Returns all books localized for the current language. */
export function useBooks(): LocalizedBook[] {
  const { language } = useLanguage();
  return books.map((b) => localize(b, language));
}

/** Returns a single book localized for the current language, by id. */
export function useBook(id: string): LocalizedBook | undefined {
  const { language } = useLanguage();
  const found = books.find((b) => b.id === id);
  return found ? localize(found, language) : undefined;
}
