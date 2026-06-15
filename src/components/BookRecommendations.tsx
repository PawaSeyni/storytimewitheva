// Client-side "Recommended for You" widget.
// Scores unread books by theme overlap with books the user has read or
// wants to read, then surfaces the top 3. Re-renders on the
// 'progresschange' custom event so it stays in sync with BookStatusButton.

import { useEffect, useState } from 'react';
import { books as rawBooks, useBooks } from '../data/books';
import type { LocalizedBook } from '../data/books';
import { loadProgress, type Progress } from '../lib/progress';
import BookCard from './BookCard';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    heading: 'Recommended for You',
    subheading: "Based on what you've been reading",
    allOnList: "You're on a great path! Keep exploring.",
  },
  es: {
    heading: 'Recomendado para ti',
    subheading: 'Según lo que has leído',
    allOnList: '¡Vas por buen camino! Sigue explorando.',
  },
  fr: {
    heading: 'Recommandé pour vous',
    subheading: "D'après vos lectures",
    allOnList: 'Vous êtes sur la bonne voie ! Continuez à explorer.',
  },
};

/** Extract a set of normalised theme tokens from a raw English theme string. */
function themeTokens(themeEn: string): Set<string> {
  return new Set(
    themeEn
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean),
  );
}

function computeRecommendations(
  localizedBooks: LocalizedBook[],
  progress: Progress,
): LocalizedBook[] {
  const { booksRead, booksWantToRead } = progress;
  const engaged = new Set([...booksRead, ...booksWantToRead]);

  if (engaged.size === 0) return [];

  // Build a union of theme tokens from all engaged books (using raw English themes).
  const engagedThemes = new Set<string>();
  for (const raw of rawBooks) {
    if (engaged.has(raw.id)) {
      for (const tok of themeTokens(raw.theme.en)) {
        engagedThemes.add(tok);
      }
    }
  }

  // Score candidate books (not yet engaged).
  const scored: Array<{ book: LocalizedBook; score: number }> = [];
  for (const raw of rawBooks) {
    if (engaged.has(raw.id)) continue;
    const localized = localizedBooks.find(b => b.id === raw.id);
    if (!localized) continue;
    let score = 0;
    for (const tok of themeTokens(raw.theme.en)) {
      if (engagedThemes.has(tok)) score++;
    }
    scored.push({ book: localized, score });
  }

  if (scored.length === 0) return [];

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(s => s.book);
}

export default function BookRecommendations() {
  const t = useTranslation(TRANSLATIONS);
  const localizedBooks = useBooks();
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  useEffect(() => {
    const sync = () => setProgress(loadProgress());
    window.addEventListener('progresschange', sync);
    return () => window.removeEventListener('progresschange', sync);
  }, []);

  const { booksRead, booksWantToRead } = progress;
  const hasEngaged = booksRead.length > 0 || booksWantToRead.length > 0;

  // Nothing to show if the user has not interacted with any book yet.
  if (!hasEngaged) return null;

  const recommendations = computeRecommendations(localizedBooks, progress);

  // Number of books the user has not yet engaged with.
  const totalCandidates =
    localizedBooks.length - new Set([...booksRead, ...booksWantToRead]).size;

  return (
    <section className="py-10 px-4 bg-purple-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t.heading}</h2>
          <p className="text-gray-500 text-sm mt-1">{t.subheading}</p>
        </div>

        {recommendations.length === 0 || totalCandidates === 0 ? (
          <p className="text-purple-700 font-medium">{t.allOnList}</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {recommendations.map(book => (
              <div key={book.id} className="min-w-[260px] md:min-w-0">
                <BookCard book={book} priority={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
