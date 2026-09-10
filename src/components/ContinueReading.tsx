import { useEffect, useState } from 'react';
import { Link } from './LocalizedLink';
import { useBooks } from '../data/books';
import { loadLibrary, continueReadingId, recentlyExploredIds, onLibraryChange } from '../lib/personalLibrary';
import { useTranslation } from '../lib/language';
import { isAmazonCover, sizedCover } from '../lib/covers';

// S6-003 + S6-006. Renders ONLY when reliable local state exists, so a first-time
// visitor's page is complete without it rather than showing an empty personalized shell.
// Nothing here is stored: it reads ids from the library and resolves them against the
// live catalog, so a retired book disappears instead of leaving a dead card.
const TRANSLATIONS = {
  en: { continueHeading: 'Pick up where you left off', recentHeading: 'Recently explored', resume: 'Keep reading' },
  es: { continueHeading: 'Continúa donde lo dejaste', recentHeading: 'Explorado hace poco', resume: 'Seguir leyendo' },
  fr: { continueHeading: 'Reprenez où vous en étiez', recentHeading: 'Explorés récemment', resume: 'Continuer la lecture' },
};

export default function ContinueReading({ excludeBookId }: { excludeBookId?: string }) {
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const [state, setState] = useState(() => loadLibrary());

  useEffect(() => {
    const sync = () => setState(loadLibrary());
    sync();
    return onLibraryChange(sync);
  }, []);

  const byId = new Map(books.map((b) => [b.id, b]));
  const currentId = continueReadingId(state);
  const current = currentId && currentId !== excludeBookId ? byId.get(currentId) : undefined;
  const recent = recentlyExploredIds(state, (id) => byId.has(id), excludeBookId ?? currentId ?? undefined)
    .slice(0, 4)
    .map((id) => byId.get(id))
    .filter((b) => b !== undefined);

  if (!current && recent.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {current && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.continueHeading}</h2>
          <Link
            to={`/books/${current.id}`}
            className="flex items-center gap-4 bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-50 p-4 transition-all"
          >
            <img
              src={isAmazonCover(current.coverImage) ? sizedCover(current.coverImage, 160) : current.coverImage}
              alt=""
              width={80}
              height={80}
              loading="lazy"
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <span className="min-w-0">
              <span className="block font-bold text-gray-800 leading-snug truncate">{current.title}</span>
              <span className="block text-sm text-purple-600 font-semibold mt-1">{t.resume} →</span>
            </span>
          </Link>
        </div>
      )}

      {recent.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.recentHeading}</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recent.map((b) => (
              <li key={b.id}>
                <Link to={`/books/${b.id}`} className="block group">
                  <img
                    src={isAmazonCover(b.coverImage) ? sizedCover(b.coverImage, 320) : b.coverImage}
                    alt=""
                    width={300}
                    height={300}
                    loading="lazy"
                    className="w-full aspect-square rounded-xl object-cover shadow-xs group-hover:shadow-md transition-shadow"
                  />
                  <span className="block text-xs font-semibold text-gray-700 mt-2 leading-snug line-clamp-2">
                    {b.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
