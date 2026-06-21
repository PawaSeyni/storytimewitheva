import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import NotFound from './NotFound';
import ReadAlong from '../components/ReadAlong';
import TapToTranslate from '../components/TapToTranslate';
import BookStatusButton from '../components/BookStatusButton';
import { books, useBook } from '../data/books';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, localizePath, useLanguage, useTranslation } from '../lib/language';
import type { Language } from '../lib/language';
import { isAmazonCover, sizedCover } from '../lib/covers';
import { track } from '../lib/analytics';
import { PRICING } from '../data/pricing';

const SITE_URL = 'https://storytimewitheva.com';
const FLAG_TO_LANG: Record<string, string> = { '🇺🇸': 'en', '🇪🇸': 'es', '🇫🇷': 'fr' };

const TRANSLATIONS = {
  en: { back: '← Back to all books', theme: 'Theme', paperback: 'Paperback', ebook: 'eBook', buy: '🛒 Buy on Amazon', coverAlt: 'book cover', ages: 'Ages', bilingualShow: '🌐 Read in two languages', bilingualHide: '🌐 Hide other languages', tapShow: '🔤 Tap words to translate', tapHide: '🔤 Stop translating' },
  es: { back: '← Volver a todos los libros', theme: 'Tema', paperback: 'Tapa blanda', ebook: 'eBook', buy: '🛒 Comprar en Amazon', coverAlt: 'portada del libro', ages: 'Edades', bilingualShow: '🌐 Leer en dos idiomas', bilingualHide: '🌐 Ocultar otros idiomas', tapShow: '🔤 Toca para traducir', tapHide: '🔤 Dejar de traducir' },
  fr: { back: '← Retour à tous les livres', theme: 'Thème', paperback: 'Livre broché', ebook: 'Livre numérique', buy: '🛒 Acheter sur Amazon', coverAlt: 'couverture du livre', ages: 'Âges', bilingualShow: '🌐 Lire en deux langues', bilingualHide: '🌐 Masquer les autres langues', tapShow: '🔤 Touche pour traduire', tapHide: '🔤 Arrêter la traduction' },
};

export default function BookDetail() {
  const { slug = '' } = useParams();
  const book = useBook(slug);
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [bilingual, setBilingual] = useState(false);
  const [tapMode, setTapMode] = useState(false);

  const cover = book?.coverImage ?? '';
  const amazon = isAmazonCover(cover);
  const ogImage = amazon ? sizedCover(cover, 600) : `${SITE_URL}${cover}`;

  // Memoized so toggling bilingual / tap mode doesn't tear down and re-inject
  // the JSON-LD <script>. book is derived from slug+language, so those (plus
  // the derived ogImage) are the real inputs. url tracks the localized canonical.
  const bookSchema = useMemo(() => {
    if (!book) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: { '@type': 'Person', name: 'Eva Gallo' },
      inLanguage: book.languages.map(f => FLAG_TO_LANG[f]).filter(Boolean),
      bookFormat: 'https://schema.org/Paperback',
      image: ogImage,
      url: `${SITE_URL}${localizePath(`/books/${book.id}`, language)}/`,
      ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
      abstract: book.description,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, language, ogImage]);

  // Unknown id → real (noindex) 404 rather than a blank page.
  if (!book) return <NotFound />;

  // Raw record (all-language strings) for the side-by-side bilingual view.
  const raw = books.find((b) => b.id === slug);
  const otherLangs = SUPPORTED_LANGUAGES.filter((l) => l !== language) as Language[];

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
              alt={`${book.title} – ${t.coverAlt}`}
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

            {tapMode ? (
              <TapToTranslate text={book.description} language={language} className="text-gray-600 leading-relaxed mb-4" />
            ) : (
              <ReadAlong text={book.description} className="text-gray-600 leading-relaxed mb-4" />
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => setTapMode((v) => !v)}
                aria-pressed={tapMode}
                className={`inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-full transition-colors ${
                  tapMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'text-purple-600 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                {tapMode ? t.tapHide : t.tapShow}
              </button>
            </div>

            {raw && (
              <div className="mb-5">
                <button
                  type="button"
                  onClick={() => setBilingual((v) => !v)}
                  aria-expanded={bilingual}
                  aria-controls="bilingual-panel"
                  className="inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-full text-purple-600 border border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  {bilingual ? t.bilingualHide : t.bilingualShow}
                </button>
                {bilingual && (
                  <div id="bilingual-panel" className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {otherLangs.map((l) => (
                      <div key={l} className="bg-purple-50/60 rounded-xl p-4">
                        <p className="text-xs font-semibold text-purple-700 mb-1">
                          {LANGUAGE_LABELS[l].flag} {LANGUAGE_LABELS[l].name}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed" lang={l}>
                          {raw.description[l]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
              onClick={() => track('Amazon Click', { book: book.id })}
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
