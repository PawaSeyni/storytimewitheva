import { useMemo, useState } from 'react';
import { useBooks } from '../data/books';
import BookCard from '../components/BookCard';
import BookRecommendations from '../components/BookRecommendations';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { PRICING } from '../data/pricing';
import { matchesAgeFilter } from '../lib/ages';
import { useTranslation } from '../lib/language';

const SITE_URL = 'https://storytimewitheva.com';
const FLAG_TO_LANG: Record<string, string> = { '🇺🇸': 'en', '🇪🇸': 'es', '🇫🇷': 'fr' };

const TRANSLATIONS = {
  en: {
    seoTitle: 'Our Magical Book Collection',
    seoDesc: 'Browse all {n} books in the Eva Gallo Collection: multicultural picture books for children ages 3–9 about quiet wonder, kindness, and curiosity.',
    heading: 'Our Magical Book Collection',
    subheading: 'Explore stories that inspire, educate, and delight young readers',
    searchPlaceholder: 'Search books by title or theme...',
    ageAll: 'All',
    age3to5: '3-5 years',
    age6to8: '6-8 years',
    age9plus: '9+ years',
    showingBook: 'book',
    showingBooks: 'books',
    showing: 'Showing',
    emptyMsg: 'No books found. Try a different search!',
    amazonHeading: 'Find All Books on Amazon',
    amazonBlurb: "All of Eva's books are available on Amazon with fast shipping and easy returns.",
    amazonCta: '🛒 View All Books on Amazon →',
    pricingHeading: 'Formats & Pricing',
    paperbackLabel: 'Paperback',
    ebookLabel: 'eBook',
    freeLabel: 'Always free',
    freeItems: 'Activities, read-alongs & the starter kit',
    pricingNote: 'Prices in USD. Final price and availability on Amazon.',
  },
  es: {
    seoTitle: 'Nuestra colección de libros mágicos',
    seoDesc: 'Explora los {n} libros de la Colección Eva Gallo — álbumes multiculturales para niños de 3 a 9 años sobre asombro tranquilo, bondad y curiosidad.',
    heading: 'Nuestra colección de libros mágicos',
    subheading: 'Descubre historias que inspiran, educan y deleitan a los lectores jóvenes',
    searchPlaceholder: 'Buscar libros por título o tema...',
    ageAll: 'Todos',
    age3to5: '3-5 años',
    age6to8: '6-8 años',
    age9plus: '9+ años',
    showingBook: 'libro',
    showingBooks: 'libros',
    showing: 'Mostrando',
    emptyMsg: 'No se encontraron libros. ¡Prueba otra búsqueda!',
    amazonHeading: 'Encuentra todos los libros en Amazon',
    amazonBlurb: 'Todos los libros de Eva están disponibles en Amazon con envío rápido y devoluciones fáciles.',
    amazonCta: '🛒 Ver todos los libros en Amazon →',
    pricingHeading: 'Formatos y precios',
    paperbackLabel: 'Tapa blanda',
    ebookLabel: 'eBook',
    freeLabel: 'Siempre gratis',
    freeItems: 'Actividades, lecturas en voz alta y el kit de inicio',
    pricingNote: 'Precios en USD. Precio final y disponibilidad en Amazon.',
  },
  fr: {
    seoTitle: 'Notre collection de livres magiques',
    seoDesc: 'Parcourez les {n} livres de la Collection Eva Gallo — albums multiculturels pour enfants de 3 à 9 ans sur l\'émerveillement tranquille, la bonté et la curiosité.',
    heading: 'Notre collection de livres magiques',
    subheading: 'Découvrez des histoires qui inspirent, instruisent et ravissent les jeunes lecteurs',
    searchPlaceholder: 'Rechercher un livre par titre ou thème...',
    ageAll: 'Tous',
    age3to5: '3-5 ans',
    age6to8: '6-8 ans',
    age9plus: '9+ ans',
    showingBook: 'livre',
    showingBooks: 'livres',
    showing: 'Affichage de',
    emptyMsg: 'Aucun livre trouvé. Essayez une autre recherche !',
    amazonHeading: 'Trouvez tous les livres sur Amazon',
    amazonBlurb: 'Tous les livres d\'Eva sont disponibles sur Amazon avec livraison rapide et retours faciles.',
    amazonCta: '🛒 Voir tous les livres sur Amazon →',
    pricingHeading: 'Formats et prix',
    paperbackLabel: 'Livre broché',
    ebookLabel: 'Livre numérique',
    freeLabel: 'Toujours gratuit',
    freeItems: 'Activités, lectures à voix haute et le kit de démarrage',
    pricingNote: 'Prix en USD. Prix final et disponibilité sur Amazon.',
  },
};

export default function Books() {
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState('All');
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();

  // ItemList of Book schema for the full catalog — gives search engines a
  // per-title entry even though books don't have individual pages yet.
  const booksSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'The Eva Gallo Collection',
      numberOfItems: books.length,
      itemListElement: books.map((book, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Book',
          name: book.title,
          author: { '@type': 'Person', name: 'Eva Gallo' },
          inLanguage: book.languages.map(f => FLAG_TO_LANG[f]).filter(Boolean),
          url: book.amazonUrl,
          image: book.coverImage.startsWith('http') ? book.coverImage : `${SITE_URL}${book.coverImage}`,
          ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
          abstract: book.description,
        },
      })),
    }),
    [books],
  );

  // Internal age filter keys are language-invariant; UI labels come from t.
  const ageFilters: { key: string; label: string }[] = [
    { key: 'All', label: t.ageAll },
    { key: '3-5', label: t.age3to5 },
    { key: '6-8', label: t.age6to8 },
    { key: '9+', label: t.age9plus },
  ];

  const filtered = books.filter(book => {
    const q = search.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(q) ||
      book.description.toLowerCase().includes(q) ||
      book.theme.toLowerCase().includes(q);
    const matchesAge = matchesAgeFilter(book.ageRange, ageFilter);
    return matchesSearch && matchesAge;
  });

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc.replace('{n}', String(books.length))} path="/books" />
      <JsonLd id="books" data={booksSchema} />

      <section className="bg-gradient-to-b from-purple-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-6 mb-8 rounded-full" />

          <div className="relative max-w-md mx-auto mb-6">
            <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {ageFilters.map(f => (
              <button
                key={f.key}
                onClick={() => setAgeFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  ageFilter === f.key
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <BookRecommendations />

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 text-sm mb-6">
            {t.showing} {filtered.length} {filtered.length === 1 ? t.showingBook : t.showingBooks}
          </p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((book, i) => (
                <BookCard key={book.id} book={book} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">{t.emptyMsg}</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{t.pricingHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-md border border-gray-50 p-6">
              <div className="text-3xl mb-2" aria-hidden>📖</div>
              <p className="font-semibold text-gray-800">{t.paperbackLabel}</p>
              <p className="text-2xl font-extrabold text-purple-700 mt-1">{PRICING.paperback}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-50 p-6">
              <div className="text-3xl mb-2" aria-hidden>📱</div>
              <p className="font-semibold text-gray-800">{t.ebookLabel}</p>
              <p className="text-2xl font-extrabold text-purple-700 mt-1">{PRICING.ebook}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md border border-purple-100 p-6">
              <div className="text-3xl mb-2" aria-hidden>🎁</div>
              <p className="font-semibold text-purple-700">{t.freeLabel}</p>
              <p className="text-sm text-gray-600 mt-1">{t.freeItems}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">{t.pricingNote}</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-y border-orange-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{t.amazonHeading}</h2>
          <p className="text-gray-500 mb-6">{t.amazonBlurb}</p>
          <a
            href="https://www.amazon.com/author/evagallo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-lg"
          >
            {t.amazonCta}
          </a>
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
