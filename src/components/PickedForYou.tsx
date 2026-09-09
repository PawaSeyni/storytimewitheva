import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import { useBooks } from '../data/books';
import {
  loadLibrary,
  getPreferences,
  booksWithStatus,
  favoriteBookIds,
  recentlyExploredIds,
  onLibraryChange,
} from '../lib/personalLibrary';
import { recommend, hasEnoughContext, type RecommendationReason } from '../lib/recommendations';
import { THEME_IDS, AGE_BAND_IDS, type AgeBandId, type ThemeId } from '../data/taxonomy';
import { useTranslation } from '../lib/language';

// S6-006 + S6-007. Renders ONLY with enough local context (two signals, so one stray page
// view does not replace the default homepage with a thinner personalized one).
//
// Every card carries the REASON it was suggested. That is the difference between
// personalization a parent can question and personalization they have to trust.
const TRANSLATIONS = {
  en: {
    heading: 'Picked for you',
    sub: 'Based on what this device has saved. Nothing left the browser.',
    editorial: 'Because it pairs with a book you saved',
    related: 'Because it connects to a book you saved',
    theme: 'Same themes as your books',
    age: 'Same age range',
    preference: 'Matches your preferences',
  },
  es: {
    heading: 'Elegidos para ti',
    sub: 'Según lo guardado en este dispositivo. Nada salió del navegador.',
    editorial: 'Porque acompaña a un libro que guardaste',
    related: 'Porque se conecta con un libro que guardaste',
    theme: 'Mismos temas que tus libros',
    age: 'Misma franja de edad',
    preference: 'Coincide con tus preferencias',
  },
  fr: {
    heading: 'Choisis pour vous',
    sub: 'D’après ce que cet appareil a enregistré. Rien n’a quitté le navigateur.',
    editorial: 'Parce qu’il accompagne un livre que vous avez enregistré',
    related: 'Parce qu’il rejoint un livre que vous avez enregistré',
    theme: 'Mêmes thèmes que vos livres',
    age: 'Même tranche d’âge',
    preference: 'Correspond à vos préférences',
  },
};

const isTheme = (id: string): boolean => (THEME_IDS as readonly string[]).includes(id);
const isBand = (id: string): boolean => (AGE_BAND_IDS as readonly string[]).includes(id);

export default function PickedForYou() {
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const [items, setItems] = useState<{ id: string; reason: RecommendationReason }[]>([]);

  useEffect(() => {
    const compute = () => {
      const state = loadLibrary();
      const known = new Set(books.map((b) => b.id));
      const prefs = getPreferences(state, isTheme, isBand);
      const favorites = favoriteBookIds(state).filter((id) => known.has(id));
      const reading = booksWithStatus(state, 'reading').filter((id) => known.has(id));
      const recent = recentlyExploredIds(state, (id) => known.has(id));
      const read = booksWithStatus(state, 'read');

      if (
        !hasEnoughContext({
          favoriteBookIds: favorites,
          readingBookIds: reading,
          recentBookIds: recent,
          themeIds: prefs.themeIds,
          ageBandIds: prefs.ageBandIds,
        })
      ) {
        setItems([]);
        return;
      }

      setItems(
        recommend({
          sourceBookIds: [...reading, ...recent].slice(0, 5),
          favoriteBookIds: favorites,
          themeIds: prefs.themeIds as ThemeId[],
          ageBandIds: prefs.ageBandIds as AgeBandId[],
          // Already-read books are not a suggestion; favorites are shown elsewhere.
          excludeIds: [...read, ...favorites],
          limit: 3,
        }).map((r) => ({ id: r.bookId, reason: r.reasons[0] })),
      );
    };
    compute();
    return onLibraryChange(compute);
    // books is derived from a static catalog; recompute only on library changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) return null;
  const byId = new Map(books.map((b) => [b.id, b]));

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{t.heading}</h2>
      <p className="text-gray-500 text-sm mb-6">{t.sub}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(({ id, reason }) => {
          const book = byId.get(id);
          if (!book) return null;
          return (
            <div key={id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 mb-2">
                {t[reason]}
              </p>
              <BookCard book={book} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
