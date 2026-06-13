import { useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import NotFound from './NotFound';
import ReadAlong from '../components/ReadAlong';
import BookStatusButton from '../components/BookStatusButton';
import { useBook } from '../data/books';
import { useTranslation } from '../lib/language';
import { isAmazonCover, sizedCover } from '../lib/covers';
import { PRICING } from '../data/pricing';

const SITE_URL = 'https://storytimewitheva.com';
const FLAG_TO_LANG: Record<string, string> = { '🇺🇸': 'en', '🇪🇸': 'es', '🇫🇷': 'fr' };

const TRANSLATIONS = {
  en: { back: '← Back to all books', theme: 'Theme', paperback: 'Paperback', ebook: 'eBook', buy: '🛒 Buy on Amazon', coverAlt: 'book cover', ages: 'Ages' },
  es: { back: '← Volver a todos los libros', theme: 'Tema', paperback: 'Tapa blanda', ebook: 'eBook', buy: '🛒 Comprar en Amazon', coverAlt: 'portada del libro', ages: 'Edades' },
  fr: { back: '← Retour à tous les livres', theme: 'Thème', paperback: 'Livre broché', ebook: 'Livre numérique', buy: '🛒 Acheter sur Amazon', coverAlt: 'couverture du livre', ages: 'Âges' },
};

export default function BookDetail() {
  const { slug = '' } = useParams();
  const book = useBook(slug);
  const t = useTranslation(TRANSLATIONS);

  // Unknown id → real (noindex) 404 rather than a blank page.
  if (!book) return <NotFound />;

  const cover = book.coverImage;
  const amazon = isAmazonCover(cover);
  const ogImage = amazon ? sizedCover(cover, 600) : `${SITE_URL}${cover}`;

  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: { '@type': 'Person', name: 'Eva Gallo' },
    inLanguage: book.languages.map(f => FLAG_TO_LANG[f]).filter(Boolean),
    bookFormat: 'https://schema.org/Paperback',
    image: ogImage,
    url: `${SITE_URL}/books/${book.id}`,
    ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
    abstract: book.description,
  };

  return (
    <main className="py-8 px-4">
      <Seo title={book.title} description={book.subtitle || book.description} path={`/books/${book.id}`} image={ogImage} />
      <JsonLd id="book" data={bookSchema} />

      <div className="max-w-4xl mx-auto">
        <Link to="/books" className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
          {t.back}
        </Link>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-100 aspect-square">
            <img
              src={amazon ? sizedCover(cover, 600) : cover}
              srcSet={amazon ? `${sizedCover(cover, 500)} 500w, ${sizedCover(cover, 900)} 900w` : undefined}
              sizes="(min-width: 768px) 448px, 90vw"
              alt={`${book.title} — ${t.coverAlt}`}
              className="w-full h-full object-cover"
              width={600}
              height={600}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                {t.ages} {book.ageRange}
              </span>
              <span className="text-lg" aria-hidden>{book.languages.join(' ')}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">{book.title}</h1>
            {book.subtitle && <p className="text-gray-500 italic mb-4">{book.subtitle}</p>}

            <ReadAlong text={book.description} className="text-gray-600 leading-relaxed mb-4" />

            <div className="bg-purple-50 rounded-xl px-4 py-2 inline-block mb-5">
              <span className="text-sm text-purple-700 font-medium">{t.theme}: {book.theme}</span>
            </div>

            <div className="mb-4">
              <BookStatusButton bookId={book.id} />
            </div>

            <p className="text-sm text-gray-500 mb-3">
              📖 {t.paperback} {PRICING.paperback} · 📱 {t.ebook} {PRICING.ebook}
            </p>

            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto text-center py-3 px-8 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg"
            >
              {t.buy}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
