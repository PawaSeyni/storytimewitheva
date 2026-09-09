import { Link } from './LocalizedLink';
import type { LocalizedBook } from '../data/books';
import BookCard from './BookCard';
import Seo from './Seo';
import JsonLd from './JsonLd';
import Breadcrumbs, { breadcrumbSchema } from './Breadcrumbs';
import { useTranslation, useLanguage } from '../lib/language';
import { useActivities } from '../data/activities';
import { resources as RESOURCES } from '../data/resources';
import { learningPackById, packResources } from '../data/contentIndex';
import { gameUrl } from '../lib/gameUrl';

// Presentation for ANY collection — theme or age band (S7-001 / S7-002). The route
// component resolves the id and hands over localized title, intro, the books, and the
// sibling collections to link to; nothing here knows which kind it is rendering.

const SITE_URL = 'https://storytimewitheva.com';

const TRANSLATIONS = {
  en: {
    home: 'Home', books: 'Books',
    book: 'book', booksPlural: 'books', inThisCollection: 'in this collection',
    booksHeading: 'Books in this collection',
    activitiesHeading: 'Activities that go with these books',
    resourcesHeading: 'For the grown-up',
    forEducators: 'For teachers and educators',
    packHeading: 'Printables for this collection',
    seasonal: 'Seasonal collection',
    seasonalUntil: 'Available until',
    packInside: 'Inside the pack:',
    getPack: 'Get the pack',
  },
  es: {
    home: 'Inicio', books: 'Libros',
    book: 'libro', booksPlural: 'libros', inThisCollection: 'en esta colección',
    booksHeading: 'Libros de esta colección',
    activitiesHeading: 'Actividades que acompañan a estos libros',
    resourcesHeading: 'Para el adulto',
    forEducators: 'Para docentes y educadores',
    packHeading: 'Imprimibles para esta colección',
    seasonal: 'Colección de temporada',
    seasonalUntil: 'Disponible hasta el',
    packInside: 'El paquete incluye:',
    getPack: 'Quiero el paquete',
  },
  fr: {
    home: 'Accueil', books: 'Livres',
    book: 'livre', booksPlural: 'livres', inThisCollection: 'dans cette collection',
    booksHeading: 'Livres de cette collection',
    activitiesHeading: 'Des activités qui accompagnent ces livres',
    resourcesHeading: 'Pour l’adulte',
    forEducators: 'Pour les enseignants et éducateurs',
    packHeading: 'Fiches à imprimer pour cette collection',
    seasonal: 'Collection de saison',
    seasonalUntil: 'Disponible jusqu’au',
    packInside: 'Le pack contient :',
    getPack: 'Recevoir le pack',
  },
};

export interface CollectionPageProps {
  id: string;
  title: string;
  intro: string;
  seoTitle: string;
  books: LocalizedBook[];
  /** Heading for the sibling-collections block, localized by the caller. */
  browseOthersHeading: string;
  others: { id: string; label: string }[];
  /** From the collection record (S7-001): featured activity slugs and resource ids. */
  activityIds?: string[];
  resourceIds?: string[];
  /** Audience label (S7-007). Educator collections say so above the title. */
  audience?: 'educator';
  /** Published learning packs that accompany this collection (S7-008). */
  packIds?: string[];
  /** Seasonal (S7-012): window state text. `emptyState` replaces the book grid when closed. */
  season?: { closesLabel: string };
  emptyState?: string;
  noindex?: boolean;
}

export default function CollectionPage({ id, title, intro, seoTitle, books, browseOthersHeading, others, activityIds = [], resourceIds = [], audience, packIds = [], season, emptyState, noindex = false }: CollectionPageProps) {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const allActivities = useActivities();
  const featured = activityIds.map((slug) => allActivities.find((a) => a.slug === slug)).filter((a) => a !== undefined);
  const featuredResources = resourceIds.map((rid) => RESOURCES.find((r) => r.id === rid)).filter((r) => r !== undefined);
  const packs = packIds.map((pid) => learningPackById[pid]).filter((p) => p !== undefined);
  const path = `/collections/${id}`;

  const crumbs = [
    { label: t.home, to: '/' },
    { label: t.books, to: '/books' },
    { label: title, to: path },
  ];

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
        numberOfItems: books.length,
        itemListElement: books.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/books/${b.id}`,
          name: b.title,
        })),
      },
    },
    breadcrumbSchema(crumbs, language),
  ];

  return (
    <main>
      <Seo title={seoTitle} description={intro} path={path} noindex={noindex} />
      {/* A closed seasonal collection keeps its BreadcrumbList but not an empty ItemList. */}
      <JsonLd id={`collection-${id}`} data={books.length > 0 ? schema : [breadcrumbSchema(crumbs, language)]} />

      <section className="bg-gradient-to-b from-purple-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs crumbs={crumbs} className="mb-6" />
          {audience === 'educator' && (
            <p className="inline-block text-xs font-semibold uppercase tracking-wide text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 mb-3">
              {t.forEducators}
            </p>
          )}
          {season && (
            <p className="inline-block text-xs font-semibold uppercase tracking-wide text-amber-900 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 mb-3">
              {t.seasonal}{books.length > 0 ? ` · ${t.seasonalUntil} ${season.closesLabel}` : ''}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">{intro}</p>
          {books.length === 0 && emptyState ? (
            <p className="mt-6 max-w-3xl rounded-2xl bg-white border border-amber-100 p-5 text-gray-700" role="status" data-testid="seasonal-empty">
              {emptyState}
            </p>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              {books.length} {books.length === 1 ? t.book : t.booksPlural} {t.inThisCollection}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Named heading keeps the outline h1 -> h2 -> h3 (BookCard titles are h3). */}
          <h2 className="sr-only">{t.booksHeading}</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, i) => (
            <BookCard key={book.id} book={book} priority={i < 3} />
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.activitiesHeading}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featured.map((a) => {
                const inner = (
                  <>
                    <span className="text-3xl block mb-2" aria-hidden>{a.emoji}</span>
                    <span className="block font-bold text-gray-800 leading-snug">{a.title}</span>
                    <span className="block text-xs text-gray-500 mt-1 line-clamp-2">{a.desc}</span>
                  </>
                );
                const cls = 'block h-full bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-50 p-5 transition-all';
                return (
                  <li key={a.slug}>
                    {a.game ? <a href={gameUrl(a.slug, language)} className={cls}>{inner}</a> : <Link to={`/activities/${a.slug}`} className={cls}>{inner}</Link>}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {featuredResources.length > 0 && (
        <section className="pb-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.resourcesHeading}</h2>
            <ul className="flex flex-wrap gap-2">
              {featuredResources.map((r) => (
                <li key={r.id}>
                  <Link to={r.kind === 'article' ? `/resources#${r.slug}` : `/free/${r.slug}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 text-sm text-purple-700 hover:border-purple-300">
                    <span aria-hidden>{r.emoji ?? '📄'}</span> {r.title[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {packs.length > 0 && (
        <section className="pb-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.packHeading}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packs.map((p) => (
                <li key={p.id} className="bg-white rounded-2xl border border-purple-100 p-5 flex flex-col">
                  <h3 className="font-bold text-gray-800 mb-1">
                    {p.emoji && <span aria-hidden>{p.emoji} </span>}
                    {p.title[language]}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{p.description[language]}</p>
                  <p className="text-xs font-semibold text-gray-700 mb-1">{t.packInside}</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-0.5">
                    {packResources(p.id).map((r) => <li key={r.id}>{r.title[language]}</li>)}
                  </ul>
                  <Link to={`/free/${p.id}`} className="mt-auto inline-flex justify-center px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors">
                    {t.getPack} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Internal linking keeps every collection reachable (orphan-route guard). */}
      <section className="py-12 px-4 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{browseOthersHeading}</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.id}>
                <Link
                  to={`/collections/${o.id}`}
                  className="inline-block px-4 py-2 rounded-full bg-white border border-purple-100 text-sm text-purple-700 hover:border-purple-300"
                >
                  {o.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
