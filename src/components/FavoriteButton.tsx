import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { loadLibrary, isFavorite, toggleFavorite, onLibraryChange } from '../lib/personalLibrary';
import { useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

// S6-002. A favorite is explicit and separate from reading status: clearing "Read" must
// not silently un-favorite a book, which is why both live on one library entry rather
// than in two parallel stores.
const TRANSLATIONS = {
  en: { add: 'Add to favorites', remove: 'Remove from favorites', label: 'Favorite' },
  es: { add: 'Añadir a favoritos', remove: 'Quitar de favoritos', label: 'Favorito' },
  fr: { add: 'Ajouter aux favoris', remove: 'Retirer des favoris', label: 'Favori' },
};

export default function FavoriteButton({ bookId, compact = false }: { bookId: string; compact?: boolean }) {
  const [fav, setFav] = useState(false);
  const t = useTranslation(TRANSLATIONS);

  useEffect(() => {
    const sync = () => setFav(isFavorite(loadLibrary(), bookId));
    sync();
    return onLibraryChange(sync);
  }, [bookId]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        // No optimistic flip here. toggleFavorite() dispatches `librarychange`
        // synchronously and the listener above already sets `fav` from storage; a
        // local `setFav(v => !v)` batched after it inverted the state back — the heart
        // showed "not favorited" while storage said favorited, and the next click
        // inverted it the other way. Caught by tests/e2e/cookie-free.spec.ts.
        toggleFavorite(bookId);
        track('Favorite', { book: bookId, status: fav ? 'removed' : 'added' });
      }}
      aria-pressed={fav}
      aria-label={fav ? t.remove : t.add}
      title={fav ? t.remove : t.add}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border transition-all ${
        compact ? 'px-2 py-1.5 text-xs' : 'px-4 py-2 text-sm font-semibold'
      } ${
        fav
          ? 'bg-rose-500 border-rose-500 text-white shadow-xs'
          : 'bg-white border-rose-300 text-rose-600 hover:bg-rose-50'
      }`}
    >
      <Heart className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} fill={fav ? 'currentColor' : 'none'} />
      {!compact && t.label}
    </button>
  );
}
