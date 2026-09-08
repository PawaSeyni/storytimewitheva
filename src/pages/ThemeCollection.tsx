// Public theme collection page — /collections/:themeId (taxonomy v1 §9).
//
// ELIGIBILITY GATE (approved doc §3.3): a collection route exists only when the
// theme has at least THEME_COLLECTION_MINIMUM published books AND a unique localized
// introduction in EN/FR/ES. Ineligible or unknown themes render a real 404 rather
// than a thin page — `honesty` and `heritage` are valid tags today but must NOT
// generate a route until each gains a second book.
//
// The route vocabulary stays English at every locale (/collections/..., /fr/collections/...)
// per the Sprint 3 constraint; only the CONTENT is localized.
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import { useBooks } from '../data/books';
import { THEMES, type ThemeId } from '../data/taxonomy';
import { collectionEligibleThemeIds } from '../data/contentIndex';
import BookCard from '../components/BookCard';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import NotFound from './NotFound';
import { useTranslation, useLanguage } from '../lib/language';

const SITE_URL = 'https://storytimewitheva.com';

const TRANSLATIONS = {
  en: {
    home: 'Home', books: 'Books', browseOther: 'Browse other themes',
    book: 'book', booksPlural: 'books', inThisCollection: 'in this collection',
    seoSuffix: 'Picture books about',
  },
  es: {
    home: 'Inicio', books: 'Libros', browseOther: 'Explora otros temas',
    book: 'libro', booksPlural: 'libros', inThisCollection: 'en esta colección',
    seoSuffix: 'Libros ilustrados sobre',
  },
  fr: {
    home: 'Accueil', books: 'Livres', browseOther: 'Explorer d\'autres thèmes',
    book: 'livre', booksPlural: 'livres', inThisCollection: 'dans cette collection',
    seoSuffix: 'Albums illustrés sur',
  },
};

export default function ThemeCollection() {
  const { themeId } = useParams();
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();

  const eligible = !!themeId && (collectionEligibleThemeIds as string[]).includes(themeId);
  const id = themeId as ThemeId;

  const inCollection = useMemo(
    () => (eligible ? books.filter((b) => b.themeIds.includes(id)) : []),
    [books, eligible, id],
  );

  // Unknown, or a valid tag that has not met the two-book minimum -> real 404.
  if (!eligible) return <NotFound />;

  const theme = THEMES[id];
  const title = theme.labels[language];
  const intro = theme.descriptions[language];
  const path = `/collections/${id}`;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description: intro,
      url: `${SITE_URL}${path}`,
      inLanguage: language,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: inCollection.length,
        itemListElement: inCollection.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/books/${b.id}`,
          name: b.title,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.home, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: t.books, item: `${SITE_URL}/books` },
        { '@type': 'ListItem', position: 3, name: title, item: `${SITE_URL}${path}` },
      ],
    },
  ];

  const others = (collectionEligibleThemeIds as ThemeId[]).filter((x) => x !== id);

  return (
    <main>
      <Seo title={`${title} — ${t.seoSuffix} ${title.toLowerCase()}`} description={intro} path={path} />
      <JsonLd id={`collection-${id}`} data={schema} />

      <section className="bg-gradient-to-b from-purple-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link to="/" className="hover:text-purple-600">{t.home}</Link></li>
              <li aria-hidden>/</li>
              <li><Link to="/books" className="hover:text-purple-600">{t.books}</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-gray-700 font-medium">{title}</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">{intro}</p>
          <p className="mt-4 text-sm text-gray-500">
            {inCollection.length} {inCollection.length === 1 ? t.book : t.booksPlural} {t.inThisCollection}
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inCollection.map((book, i) => (
            <BookCard key={book.id} book={book} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* Internal linking: keeps every collection reachable (orphan-route guard). */}
      <section className="py-12 px-4 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.browseOther}</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o}>
                <Link
                  to={`/collections/${o}`}
                  className="inline-block px-4 py-2 rounded-full bg-white border border-purple-100 text-sm text-purple-700 hover:border-purple-300"
                >
                  {THEMES[o].labels[language]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
