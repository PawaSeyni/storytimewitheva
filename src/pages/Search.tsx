import { useSearchParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import { useBooks } from '../data/books';
import { useActivities } from '../data/activities';
import { isAmazonCover, sizedCover } from '../lib/covers';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    seoTitle: 'Search',
    seoDesc: 'Search the Eva Gallo Collection: books and activities.',
    heading: 'Search',
    placeholder: 'Search books and activities…',
    booksHeading: 'Books',
    activitiesHeading: 'Activities',
    resultsNone: 'No matches. Try another word.',
    prompt: 'Type to search across all books and activities.',
    countOne: 'result',
    countMany: 'results',
  },
  es: {
    seoTitle: 'Buscar',
    seoDesc: 'Busca en la Colección Eva Gallo — libros y actividades.',
    heading: 'Buscar',
    placeholder: 'Busca libros y actividades…',
    booksHeading: 'Libros',
    activitiesHeading: 'Actividades',
    resultsNone: 'Sin resultados. Prueba otra palabra.',
    prompt: 'Escribe para buscar en todos los libros y actividades.',
    countOne: 'resultado',
    countMany: 'resultados',
  },
  fr: {
    seoTitle: 'Recherche',
    seoDesc: 'Recherchez dans la Collection Eva Gallo — livres et activités.',
    heading: 'Recherche',
    placeholder: 'Rechercher livres et activités…',
    booksHeading: 'Livres',
    activitiesHeading: 'Activités',
    resultsNone: 'Aucun résultat. Essayez un autre mot.',
    prompt: 'Tapez pour rechercher dans tous les livres et activités.',
    countOne: 'résultat',
    countMany: 'résultats',
  },
};

export default function Search() {
  const [params, setParams] = useSearchParams();
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const activities = useActivities();

  const q = (params.get('q') ?? '').toLowerCase().trim();

  const bookHits = q
    ? books.filter(b =>
        [b.title, b.subtitle, b.description, b.theme]
          .filter(Boolean)
          .some(s => s!.toLowerCase().includes(q)),
      )
    : [];
  const activityHits = q
    ? activities.filter(a =>
        [a.title, a.desc, a.category].some(s => s.toLowerCase().includes(q)),
      )
    : [];
  const total = bookHits.length + activityHits.length;

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/search" noindex />

      <section className="bg-gradient-to-b from-purple-50 to-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5">{t.heading}</h1>
          <div className="relative max-w-xl mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>🔍</span>
            <input
              type="search"
              autoFocus
              value={params.get('q') ?? ''}
              onChange={e => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
            />
          </div>
          {q && (
            <p className="text-gray-500 text-sm mt-3">
              {total} {total === 1 ? t.countOne : t.countMany}
            </p>
          )}
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {!q && <p className="text-center text-gray-500">{t.prompt}</p>}
          {q && total === 0 && <p className="text-center text-gray-500">{t.resultsNone}</p>}

          {bookHits.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.booksHeading}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {bookHits.map(b => (
                  <Link key={b.id} to={`/books/${b.id}`} className="card group flex flex-col">
                    <div className="bg-gray-100 aspect-square overflow-hidden">
                      <img
                        src={isAmazonCover(b.coverImage) ? sizedCover(b.coverImage, 300) : b.coverImage}
                        alt={b.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-purple-700">{b.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activityHits.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.activitiesHeading}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activityHits.map(a => {
                  const inner = (
                    <>
                      <span className="text-3xl" aria-hidden>{a.emoji}</span>
                      <div>
                        <p className="font-semibold text-gray-800 leading-snug group-hover:text-purple-700">{a.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{a.category} · {a.ages}</p>
                      </div>
                    </>
                  );
                  const cls = 'bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-50 p-4 flex items-center gap-3 group transition-all';
                  return a.game ? (
                    <a key={a.slug} href={`/games/${a.slug}.html`} className={cls}>{inner}</a>
                  ) : (
                    <Link key={a.slug} to={`/activities/${a.slug}`} className={cls}>{inner}</Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
