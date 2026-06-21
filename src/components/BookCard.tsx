import type { LocalizedBook } from '../data/books';
import { Link } from './LocalizedLink';
import BookStatusButton from './BookStatusButton';
import ReadAloudButton from './ReadAloudButton';
import { isAmazonCover, sizedCover } from '../lib/covers';
import { useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

const TRANSLATIONS = {
  en: { featured: 'Featured', discoverMore: 'Discover More ✨', buy: '🛒 Buy', coverAlt: 'book cover' },
  es: { featured: 'Destacado', discoverMore: 'Descubrir más ✨', buy: '🛒 Comprar', coverAlt: 'portada del libro' },
  fr: { featured: 'En vedette', discoverMore: 'Découvrir plus ✨', buy: '🛒 Acheter', coverAlt: 'couverture du livre' },
};

interface BookCardProps {
  book: LocalizedBook;
  /** Above-the-fold cards (featured row, first books page row) load eagerly to
   *  improve LCP; everything else stays lazy. */
  priority?: boolean;
}

export default function BookCard({ book, priority = false }: BookCardProps) {
  const t = useTranslation(TRANSLATIONS);

  // Narration text for the read-aloud button — title, subtitle, and blurb.
  const narration = [book.title, book.subtitle, book.description].filter(Boolean).join('. ');

  const amazonCover = isAmazonCover(book.coverImage);
  const cardSrcSet = amazonCover
    ? `${sizedCover(book.coverImage, 330)} 330w, ${sizedCover(book.coverImage, 660)} 660w`
    : undefined;
  const href = `/books/${book.id}`;

  return (
    <div className="card group flex flex-col">
      <Link to={href} className="block relative bg-gray-100 aspect-square overflow-hidden">
        <img
          src={amazonCover ? sizedCover(book.coverImage, 400) : book.coverImage}
          srcSet={cardSrcSet}
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          alt={`${book.title}, ${t.coverAlt}`}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {book.featured && (
          <span className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <span className="text-sm leading-none">⭐</span>
            {t.featured}
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full">
            {book.ageRange}
          </span>
          <span className="text-sm">{book.languages.join('')}</span>
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-1">
          <Link to={href} className="hover:text-purple-700 transition-colors">
            {book.title}
          </Link>
        </h3>
        {book.subtitle && (
          <p className="text-xs text-gray-500 italic mb-2">{book.subtitle}</p>
        )}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
          {book.description}
        </p>

        <div className="mb-3 flex">
          <ReadAloudButton text={narration} compact />
        </div>

        <div className="mb-3">
          <BookStatusButton bookId={book.id} compact />
        </div>

        <div className="flex gap-2 mt-auto">
          <Link
            to={href}
            className="flex-1 py-2 text-sm font-semibold text-center text-purple-600 border border-purple-200 rounded-full hover:bg-purple-50 transition-colors"
          >
            {t.discoverMore}
          </Link>
          <a
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('Amazon Click', { book: book.id })}
            className="btn-amazon text-xs px-3 py-2"
          >
            {t.buy}
          </a>
        </div>
      </div>
    </div>
  );
}
