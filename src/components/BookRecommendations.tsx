// "Recommended for You" on the catalog page.
//
// Rebuilt on src/lib/recommendations.ts (S6-007) with the personal library as its
// seeds. The previous version was a THIRD ranker that scored books by splitting the
// English `theme` phrase into word tokens — exactly the text-parsing the taxonomy
// decision record forbids ("the localized theme phrase is display copy and is NEVER
// parsed to infer an id"). It also read book status from the legacy `readingProgress`
// arrays, which nothing has written since the library moved in #159.

import { useEffect, useState } from 'react';
import { useBooks } from '../data/books';
import {
  loadLibrary,
  booksWithStatus,
  favoriteBookIds,
  onLibraryChange,
} from '../lib/personalLibrary';
import { recommend } from '../lib/recommendations';
import BookCard from './BookCard';
import { useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

const TRANSLATIONS = {
  en: {
    heading: 'Recommended for You',
    subheading: 'Based on the books saved on this device',
    allOnList: "You're on a great path! Keep exploring.",
  },
  es: {
    heading: 'Recomendado para ti',
    subheading: 'Según los libros guardados en este dispositivo',
    allOnList: '¡Vas por buen camino! Sigue explorando.',
  },
  fr: {
    heading: 'Recommandé pour vous',
    subheading: 'D’après les livres enregistrés sur cet appareil',
    allOnList: 'Vous êtes sur la bonne voie ! Continuez à explorer.',
  },
};

export default function BookRecommendations() {
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const [state, setState] = useState(() => loadLibrary());

  useEffect(() => {
    const sync = () => setState(loadLibrary());
    sync();
    return onLibraryChange(sync);
  }, []);

  const known = new Set(books.map((b) => b.id));
  const read = booksWithStatus(state, 'read').filter((id) => known.has(id));
  const reading = booksWithStatus(state, 'reading').filter((id) => known.has(id));
  const want = booksWithStatus(state, 'want-to-read').filter((id) => known.has(id));
  const favorites = favoriteBookIds(state).filter((id) => known.has(id));
  const engaged = new Set([...read, ...reading, ...want, ...favorites]);

  // Nothing to show until the reader has saved at least one book.
  if (engaged.size === 0) return null;

  const picks = recommend({
    sourceBookIds: [...reading, ...read, ...want],
    favoriteBookIds: favorites,
    excludeIds: [...engaged],
    limit: 3,
  });
  const byId = new Map(books.map((b) => [b.id, b]));
  const recommendations = picks.map((p) => byId.get(p.bookId)).filter((b) => b !== undefined);
  const totalCandidates = books.length - engaged.size;

  return (
    <section className="py-10 px-4 bg-purple-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t.heading}</h2>
          <p className="text-gray-500 text-sm mt-1">{t.subheading}</p>
        </div>

        {recommendations.length === 0 || totalCandidates === 0 ? (
          <p className="text-gray-600 text-center py-6">{t.allOnList}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((book, i) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={() =>
                  track('Recommendation Click', {
                    book: book.id,
                    placement: 'books',
                    reason: picks[i]?.reasons[0] ?? 'theme',
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
