// Site search — /search (S7-015). Runs on the browser-free index in src/lib/searchIndex.ts:
// books, activities, public collections, published journeys and resources, within the
// active locale, with content-type filters. The filters are real buttons with aria-pressed
// and the result count is announced through a polite live region. The query stays in the
// URL (?q=&type=) so a result page can be shared and the back button works; the query text
// is never sent to analytics.
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import { useBooks } from '../data/books';
import { isAmazonCover, sizedCover } from '../lib/covers';
import { useTranslation, useLanguage } from '../lib/language';
import { gameUrl } from '../lib/gameUrl';
import { buildSearchIndex, searchRecords, SEARCH_TYPES, typeLabel, type SearchType } from '../lib/searchIndex';
import { track } from '../lib/analytics';

const TRANSLATIONS = {
  en: {
    seoTitle: 'Search',
    seoDesc: 'Search the Eva Gallo Collection: books, activities, collections, reading journeys and resources.',
    heading: 'Search',
    placeholder: 'Search books, activities, collections…',
    all: 'Everything',
    filterLabel: 'Show only',
    resultsNone: 'No matches. Try another word, or a theme like kindness or courage.',
    prompt: 'Type to search across books, activities, collections, reading journeys and resources.',
    countOne: 'result',
    countMany: 'results',
    types: { book: 'Books', activity: 'Activities', collection: 'Collections', journey: 'Reading journeys', resource: 'Resources' },
  },
  es: {
    seoTitle: 'Buscar',
    seoDesc: 'Busca en la Colección Eva Gallo: libros, actividades, colecciones, recorridos de lectura y recursos.',
    heading: 'Buscar',
    placeholder: 'Busca libros, actividades, colecciones…',
    all: 'Todo',
    filterLabel: 'Mostrar solo',
    resultsNone: 'Sin resultados. Prueba otra palabra, o un tema como bondad o valentía.',
    prompt: 'Escribe para buscar en libros, actividades, colecciones, recorridos de lectura y recursos.',
    countOne: 'resultado',
    countMany: 'resultados',
    types: { book: 'Libros', activity: 'Actividades', collection: 'Colecciones', journey: 'Recorridos de lectura', resource: 'Recursos' },
  },
  fr: {
    seoTitle: 'Recherche',
    seoDesc: 'Recherchez dans la Collection Eva Gallo : livres, activités, collections, parcours de lecture et ressources.',
    heading: 'Recherche',
    placeholder: 'Rechercher livres, activités, collections…',
    all: 'Tout',
    filterLabel: 'Afficher seulement',
    resultsNone: 'Aucun résultat. Essayez un autre mot, ou un thème comme la bonté ou le courage.',
    prompt: 'Tapez pour rechercher dans les livres, activités, collections, parcours de lecture et ressources.',
    countOne: 'résultat',
    countMany: 'résultats',
    types: { book: 'Livres', activity: 'Activités', collection: 'Collections', journey: 'Parcours de lecture', resource: 'Ressources' },
  },
};

const INDEX = buildSearchIndex();
const isType = (v: string | null): v is SearchType => Boolean(v) && (SEARCH_TYPES as string[]).includes(v as string);

export default function Search() {
  const [params, setParams] = useSearchParams();
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const books = useBooks();

  const raw = params.get('q') ?? '';
  const q = raw.trim();
  const typeParam = params.get('type');
  const type: SearchType | null = isType(typeParam) ? typeParam : null;

  const hits = useMemo(
    () => searchRecords(INDEX, q, { language, types: type ? [type] : undefined, date: new Date() }),
    [q, language, type],
  );
  const total = hits.length;
  const counts = useMemo(() => {
    const all = searchRecords(INDEX, q, { language, date: new Date() });
    return Object.fromEntries(SEARCH_TYPES.map((k) => [k, all.filter((r) => r.type === k).length])) as Record<SearchType, number>;
  }, [q, language]);

  // One aggregate event per settled query: filter and count only, never the words typed.
  useEffect(() => {
    if (!q) return;
    const id = window.setTimeout(() => track('Search', { language, filter: type ?? 'all', results: total }), 800);
    return () => window.clearTimeout(id);
  }, [q, type, total, language]);

  const update = (next: { q?: string; type?: SearchType | null }) => {
    const nq = next.q ?? raw;
    const nt = next.type === undefined ? type : next.type;
    const p: Record<string, string> = {};
    if (nq) p.q = nq;
    if (nt) p.type = nt;
    setParams(p, { replace: true });
  };

  const bookOf = (id: string) => books.find((b) => b.id === id);
  const groups = SEARCH_TYPES.map((k) => ({ type: k, items: hits.filter((r) => r.type === k) })).filter((g) => g.items.length > 0);

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
              value={raw}
              onChange={(e) => update({ q: e.target.value })}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
            />
          </div>

          {q && (
            <div className="mt-5" role="group" aria-label={t.filterLabel}>
              <ul className="flex flex-wrap justify-center gap-2">
                <li>
                  <button
                    type="button"
                    aria-pressed={type === null}
                    onClick={() => update({ type: null })}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${type === null ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'}`}
                  >
                    {t.all}
                  </button>
                </li>
                {SEARCH_TYPES.map((k) => (
                  <li key={k}>
                    <button
                      type="button"
                      aria-pressed={type === k}
                      onClick={() => update({ type: type === k ? null : k })}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${type === k ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'}`}
                    >
                      {t.types[k]} ({counts[k]})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-gray-500 text-sm mt-3" role="status" aria-live="polite">
            {q ? `${total} ${total === 1 ? t.countOne : t.countMany}` : ''}
          </p>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {!q && <p className="text-center text-gray-500">{t.prompt}</p>}
          {q && total === 0 && <p className="text-center text-gray-500">{t.resultsNone}</p>}

          {groups.map((g) => (
            <div key={g.type} className="mb-10" data-search-group={g.type}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.types[g.type]}</h2>
              {g.type === 'book' ? (
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {g.items.map((r) => {
                    const b = bookOf(r.id);
                    if (!b) return null;
                    return (
                      <li key={r.id}>
                        <Link to={r.route} className="card group flex flex-col h-full">
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
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {g.items.map((r) => {
                    const inner = (
                      <>
                        {r.emoji && <span className="text-3xl shrink-0" aria-hidden>{r.emoji}</span>}
                        <span>
                          <span className="block text-xs uppercase tracking-wide text-purple-700 font-semibold">{typeLabel(r.type, language)}</span>
                          <span className="block font-semibold text-gray-800 leading-snug group-hover:text-purple-700">{r.title[language]}</span>
                          <span className="block text-xs text-gray-500 mt-0.5 line-clamp-2">{r.summary[language]}</span>
                        </span>
                      </>
                    );
                    const cls = 'bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-50 p-4 flex items-start gap-3 group transition-all h-full';
                    return (
                      <li key={`${r.type}-${r.id}`}>
                        {r.game ? (
                          <a href={gameUrl(r.id, language)} className={cls}>{inner}</a>
                        ) : (
                          <Link to={r.route} className={cls}>{inner}</Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
