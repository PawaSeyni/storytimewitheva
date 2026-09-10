import { useMemo, useState } from 'react';
import { useBooks } from '../data/books';
import BookCard from '../components/BookCard';
import BookRecommendations from '../components/BookRecommendations';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { Link } from '../components/LocalizedLink';
import { THEMES, THEME_IDS, AGE_BANDS, supportsAge, type ThemeId } from '../data/taxonomy';
import { collectionEligibleThemeIds, ageCollectionEligibleBandIds, openSeasonalIds, collectionRecordById } from '../data/contentIndex';
import { AMAZON_AUTHOR_URL } from '../lib/amazon';
import { useTranslation, useLanguage, localizePath } from '../lib/language';

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
      themeAll: 'All themes',
      browseByTheme: 'Browse by theme',
      browseByAge: 'Browse by age',
      browseJourneys: 'Reading journeys →',
      inSeason: 'In season now',
      ageLabel: 'Age',
      themeLabel: 'Theme',
    showingBook: 'book',
    showingBooks: 'books',
    showing: 'Showing',
    emptyMsg: 'No books found. Try a different search!',
    amazonHeading: 'Find All Books on Amazon',
    amazonBlurb: "Find Eva's books on Amazon. Availability, formats, pricing, shipping, and returns are handled by Amazon.",
    amazonCta: '🛒 View All Books on Amazon →',
    pricingHeading: 'Formats & Pricing',
    paperbackLabel: 'Paperback',
    ebookLabel: 'eBook',
    seePrice: 'See price on Amazon',
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
      themeAll: 'Todos los temas',
      browseByTheme: 'Explora por tema',
      browseByAge: 'Explora por edad',
      browseJourneys: 'Recorridos de lectura →',
      inSeason: 'De temporada',
      ageLabel: 'Edad',
      themeLabel: 'Tema',
    showingBook: 'libro',
    showingBooks: 'libros',
    showing: 'Mostrando',
    emptyMsg: 'No se encontraron libros. ¡Prueba otra búsqueda!',
    amazonHeading: 'Encuentra todos los libros en Amazon',
    amazonBlurb: 'Encuentra los libros de Eva en Amazon. La disponibilidad, los formatos, los precios, el envío y las devoluciones los gestiona Amazon.',
    amazonCta: '🛒 Ver todos los libros en Amazon →',
    pricingHeading: 'Formatos y precios',
    paperbackLabel: 'Tapa blanda',
    ebookLabel: 'eBook',
    seePrice: 'Consulta el precio en Amazon',
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
      themeAll: 'Tous les thèmes',
      browseByTheme: 'Explorer par thème',
      browseByAge: 'Explorer par âge',
      browseJourneys: 'Parcours de lecture →',
      inSeason: 'En ce moment',
      ageLabel: 'Âge',
      themeLabel: 'Thème',
    showingBook: 'livre',
    showingBooks: 'livres',
    showing: 'Affichage de',
    emptyMsg: 'Aucun livre trouvé. Essayez une autre recherche !',
    amazonHeading: 'Trouvez tous les livres sur Amazon',
    amazonBlurb: 'Trouvez les livres d\'Eva sur Amazon. La disponibilité, les formats, les prix, la livraison et les retours sont gérés par Amazon.',
    amazonCta: '🛒 Voir tous les livres sur Amazon →',
    pricingHeading: 'Formats et prix',
    paperbackLabel: 'Livre broché',
    ebookLabel: 'Livre numérique',
    seePrice: 'Voir le prix sur Amazon',
    freeLabel: 'Toujours gratuit',
    freeItems: 'Activités, lectures à voix haute et le kit de démarrage',
    pricingNote: 'Prix en USD. Prix final et disponibilité sur Amazon.',
  },
};

export default function Books() {
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState('All');
  const [themeFilter, setThemeFilter] = useState<'All' | ThemeId>('All');
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const openSeasonal = useMemo(() => openSeasonalIds(new Date()), []);
  const books = useBooks();

  // ItemList of Book schema for the full catalog — each entry links to its
  // on-site book page (localized), with Amazon kept under sameAs.
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
          url: `${SITE_URL}${localizePath(`/books/${book.id}`, language)}/`,
          sameAs: book.amazonUrl.split('?')[0], // clean product URL (no tracking param) for structured-data identity
          image: book.coverImage.startsWith('http') ? book.coverImage : `${SITE_URL}${book.coverImage}`,
          ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
          abstract: book.description,
        },
      })),
    }),
    [books, language],
  );

  // Taxonomy v1 §5.2 — suitability filtering resolves by EXACT age containment, so a
  // 5-9 book never disappears when a parent picks age 5. Values are the single ages
  // 3-9 (language-invariant); the old 3-5 / 6-8 / "9+" bands used overlap matching and
  // "9+" wrongly implied content beyond age 9.
  const ageFilters: { key: string; label: string }[] = [
    { key: 'All', label: t.ageAll },
    ...['3', '4', '5', '6', '7', '8', '9'].map((a) => ({ key: a, label: a })),
  ];

  const filtered = books.filter(book => {
    const q = search.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(q) ||
      book.description.toLowerCase().includes(q) ||
      book.theme.toLowerCase().includes(q);
    const matchesAge = ageFilter === 'All' || supportsAge(book.ageRange, Number(ageFilter));
    // Theme filtering resolves by stable ID — never by parsing the localized phrase.
    const matchesTheme = themeFilter === 'All' || book.themeIds.includes(themeFilter);
    return matchesSearch && matchesAge && matchesTheme;
  });

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc.replace('{n}', String(books.length))} path="/books" />
      <JsonLd id="books" data={booksSchema} />

      <section className="bg-linear-to-b from-purple-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
          <div className="w-20 h-1 bg-linear-to-r from-orange-400 to-pink-400 mx-auto mt-6 mb-8 rounded-full" />

          <div className="relative max-w-md mx-auto mb-6">
            <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-purple-300 shadow-xs"
            />
          </div>

          <div className="flex justify-center">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{t.themeLabel}</span>
              <select
                value={themeFilter}
                onChange={(e) => setThemeFilter(e.target.value as 'All' | ThemeId)}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-300"
              >
                <option value="All">{t.themeAll}</option>
                {THEME_IDS.map((id) => (
                  <option key={id} value={id}>{THEMES[id].labels[language]}</option>
                ))}
              </select>
            </label>
          </div>

          <div role="group" aria-label={t.ageLabel} className="flex flex-wrap gap-2 justify-center">
            {ageFilters.map(f => (
              <button
                key={f.key}
                onClick={() => setAgeFilter(f.key)}
                aria-pressed={ageFilter === f.key}
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

      {/* Internal inbound links to the public theme collections. Without these the
          collection routes would be orphans (indexable but unreachable by crawl). */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">{t.browseByTheme}</h2>
          <ul className="flex flex-wrap gap-2">
            {collectionEligibleThemeIds.map((id) => (
              <li key={id}>
                <Link
                  to={`/collections/${id}`}
                  className="inline-block px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-sm text-purple-700 hover:border-purple-300"
                >
                  {THEMES[id].labels[language]}
                </Link>
              </li>
            ))}
          </ul>
          {/* Seasonal collections (S7-012): only the ones whose window is open right now. */}
          {openSeasonal.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-6" aria-label={t.inSeason}>
              {openSeasonal.map((id) => (
                <li key={id}>
                  <Link
                    to={`/collections/${id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-900 hover:border-amber-400"
                  >
                    <span aria-hidden>🍂</span> {t.inSeason}: {collectionRecordById[id]?.title?.[language] ?? id} →
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {/* Age-band collections (S7-002): primary-fit placement, one page per band. */}
          <h2 className="text-sm font-semibold text-gray-500 mt-6 mb-3">{t.browseByAge}</h2>
          <ul className="flex flex-wrap gap-2">
            {ageCollectionEligibleBandIds.map((id) => (
              <li key={id}>
                <Link
                  to={`/collections/${id}`}
                  className="inline-block px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-sm text-amber-800 hover:border-amber-300"
                >
                  {AGE_BANDS[id].labels[language]}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link to="/journeys" className="inline-block text-sm font-semibold text-purple-700 hover:text-purple-900">{t.browseJourneys}</Link>
          </p>
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
              <p className="text-sm font-semibold text-purple-600 mt-1">{t.seePrice}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-50 p-6">
              <div className="text-3xl mb-2" aria-hidden>📱</div>
              <p className="font-semibold text-gray-800">{t.ebookLabel}</p>
              <p className="text-sm font-semibold text-purple-600 mt-1">{t.seePrice}</p>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md border border-purple-100 p-6">
              <div className="text-3xl mb-2" aria-hidden>🎁</div>
              <p className="font-semibold text-purple-700">{t.freeLabel}</p>
              <p className="text-sm text-gray-600 mt-1">{t.freeItems}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">{t.pricingNote}</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-linear-to-r from-orange-50 to-yellow-50 border-y border-orange-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{t.amazonHeading}</h2>
          <p className="text-gray-500 mb-6">{t.amazonBlurb}</p>
          <a
            href={AMAZON_AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-lg"
          >
            {t.amazonCta}
          </a>
        </div>
      </section>

      <EmailSignup placement="books" />
    </main>
  );
}
