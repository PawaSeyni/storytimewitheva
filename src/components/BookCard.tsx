import { useState } from 'react';
import type { LocalizedBook } from '../data/books';
import BookStatusButton from './BookStatusButton';
import ReadAloudButton from './ReadAloudButton';
import { PRICING } from '../data/pricing';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    featured: 'Featured',
    discoverMore: 'Discover More ✨',
    buy: '🛒 Buy',
    buyOnAmazon: '🛒 Buy on Amazon',
    close: 'Close',
    theme: 'Theme',
    coverAlt: 'book cover',
    paperback: 'Paperback',
    ebook: 'eBook',
  },
  es: {
    featured: 'Destacado',
    discoverMore: 'Descubrir más ✨',
    buy: '🛒 Comprar',
    buyOnAmazon: '🛒 Comprar en Amazon',
    close: 'Cerrar',
    theme: 'Tema',
    coverAlt: 'portada del libro',
    paperback: 'Tapa blanda',
    ebook: 'eBook',
  },
  fr: {
    featured: 'En vedette',
    discoverMore: 'Découvrir plus ✨',
    buy: '🛒 Acheter',
    buyOnAmazon: '🛒 Acheter sur Amazon',
    close: 'Fermer',
    theme: 'Thème',
    coverAlt: 'couverture du livre',
    paperback: 'Livre broché',
    ebook: 'Livre numérique',
  },
};

// Amazon's image CDN resizes on the fly via an "._SX<width>_" modifier before
// the extension (e.g. 619qWXXkRwL.jpg -> 619qWXXkRwL._SX466_.jpg, ~65% smaller).
// We use it to serve card/modal-appropriate widths instead of full-res covers.
// Local imported covers (the 3 featured titles) are returned unchanged.
function isAmazonCover(url: string): boolean {
  return url.includes('m.media-amazon.com/images/');
}
function sizedCover(url: string, width: number): string {
  return isAmazonCover(url) ? url.replace(/\.(jpe?g|png)(\?.*)?$/i, `._SX${width}_.$1$2`) : url;
}

interface BookCardProps {
  book: LocalizedBook;
  /** Above-the-fold cards (featured row, first books page row) load eagerly to
   *  improve LCP; everything else stays lazy. */
  priority?: boolean;
}

export default function BookCard({ book, priority = false }: BookCardProps) {
  const [showModal, setShowModal] = useState(false);
  const t = useTranslation(TRANSLATIONS);

  // Narration text for the read-aloud button — title, subtitle, and blurb in
  // the active language.
  const narration = [book.title, book.subtitle, book.description].filter(Boolean).join('. ');

  const amazonCover = isAmazonCover(book.coverImage);
  const cardSrcSet = amazonCover
    ? `${sizedCover(book.coverImage, 330)} 330w, ${sizedCover(book.coverImage, 660)} 660w`
    : undefined;
  const modalSrcSet = amazonCover
    ? `${sizedCover(book.coverImage, 500)} 500w, ${sizedCover(book.coverImage, 900)} 900w`
    : undefined;

  return (
    <>
      <div className="card group cursor-pointer flex flex-col" onClick={() => setShowModal(true)}>
        <div className="relative bg-gray-100 aspect-square overflow-hidden">
          <img
            src={amazonCover ? sizedCover(book.coverImage, 400) : book.coverImage}
            srcSet={cardSrcSet}
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
            alt={`${book.title} — ${t.coverAlt}`}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {book.featured && (
            <span className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <span className="text-sm leading-none">⭐</span>
              {t.featured}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full">
              {book.ageRange}
            </span>
            <span className="text-sm">{book.languages.join('')}</span>
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-purple-700 transition-colors">
            {book.title}
          </h3>
          {book.subtitle && (
            <p className="text-xs text-gray-500 italic mb-2">{book.subtitle}</p>
          )}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
            {book.description}
          </p>

          <div className="mb-3 flex" onClick={(e) => e.stopPropagation()}>
            <ReadAloudButton text={narration} compact />
          </div>

          <div className="mb-3" onClick={(e) => e.stopPropagation()}>
            <BookStatusButton bookId={book.id} compact />
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={e => { e.stopPropagation(); setShowModal(true); }}
              className="flex-1 py-2 text-sm font-semibold text-purple-600 border border-purple-200 rounded-full hover:bg-purple-50 transition-colors"
            >
              {t.discoverMore}
            </button>
            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="btn-amazon text-xs px-3 py-2"
            >
              {t.buy}
            </a>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl my-8"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={amazonCover ? sizedCover(book.coverImage, 600) : book.coverImage}
              srcSet={modalSrcSet}
              sizes="(min-width: 768px) 448px, 90vw"
              alt={`${book.title} — ${t.coverAlt}`}
              className="w-full aspect-square object-cover"
            />
            <div className="p-6 md:p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{book.title}</h2>
              {book.subtitle && (
                <p className="text-sm text-gray-500 italic mb-3">{book.subtitle}</p>
              )}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-lg">{book.languages.join(' ')}</span>
                <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                  {book.ageRange}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-3">{book.description}</p>
              <div className="bg-purple-50 rounded-xl px-4 py-2 inline-block">
                <span className="text-sm text-purple-700 font-medium">{t.theme}: {book.theme}</span>
              </div>

              <div className="flex justify-center mt-5">
                <ReadAloudButton text={narration} />
              </div>

              <p className="text-sm text-gray-500 mt-4">
                📖 {t.paperback} {PRICING.paperback} · 📱 {t.ebook} {PRICING.ebook}
              </p>

              <div className="flex flex-col gap-3 mt-3">
                <a
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full text-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg"
                >
                  {t.buyOnAmazon}
                </a>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 border-2 border-gray-200 text-gray-500 font-medium rounded-full hover:bg-gray-50 transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
