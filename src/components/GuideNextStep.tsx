import { Link } from './LocalizedLink';
import { useBooks, type LocalizedBook } from '../data/books';
import { resources, resourcePath, type Resource } from '../data/resources';
import { booksByResourceId, booksByThemeId } from '../data/contentIndex';
import { publishedClassroomUnits, unitAgeRange, unitBooks, type ClassroomUnit } from '../data/classroomUnits';
import { sizedCover } from '../lib/covers';
import { track } from '../lib/analytics';
import { useLanguage, useTranslation } from '../lib/language';

/**
 * "Try it with a book": the next step on every parent guide (/resources/<slug>). Search
 * visitors land on the guides and most leave from them having scrolled about halfway, so
 * the step appears twice: a compact block about 40% of the way down the body, and a full
 * block at the end of it. Everything here already exists and is DERIVED:
 *   - books: those whose relatedResourceIds name this guide (contentIndex.booksByResourceId),
 *     then those paired with the guide's printables, then the guide's themes; 3-4 covers.
 *   - the printable: the guide's own relatedResourceIds downloads, through the same stable
 *     /free/<slug> landing the Resources page uses (resourcePath), never a hashed PDF.
 *   - classroom units: every published unit, the ones sharing a theme or a printable with
 *     the guide first.
 * Clicks are 'Continue Journey' with placement 'guide'; reason says which block, and the
 * target id travels as book (books) or resource (printables and units).
 */
const TRANSLATIONS = {
  en: {
    heading: 'Try it with a book',
    compact: 'The easiest way to start is one story and one idea, tonight. Here is where to begin.',
    intro: 'You have the ideas. Now pick a story to try them with, at home or in class.',
    books: 'Books this guide pairs with',
    printable: 'Free printable',
    getPrintable: 'Get the free printable',
    units: 'Five-day classroom units',
    unitsChip: 'Classroom units',
    allUnits: 'See all classroom units',
    ages: 'Ages',
    bookCount: 'books',
  },
  es: {
    heading: 'Pruébalo con un libro',
    compact: 'La forma más sencilla de empezar: un cuento y una idea, esta misma noche. Aquí tienes por dónde empezar.',
    intro: 'Ya tienes las ideas. Ahora elige un cuento para probarlas, en casa o en clase.',
    books: 'Libros que acompañan esta guía',
    printable: 'Imprimible gratuito',
    getPrintable: 'Consigue el imprimible gratuito',
    units: 'Unidades de cinco días para el aula',
    unitsChip: 'Unidades para el aula',
    allUnits: 'Ver todas las unidades para el aula',
    ages: 'Edades',
    bookCount: 'libros',
  },
  fr: {
    heading: 'Essayez avec un livre',
    compact: 'Le plus simple pour commencer : une histoire et une idée, dès ce soir. Voici de quoi démarrer.',
    intro: 'Vous avez les idées. Choisissez maintenant une histoire pour les essayer, à la maison ou en classe.',
    books: 'Des livres qui vont avec ce guide',
    printable: 'Fiche gratuite à imprimer',
    getPrintable: 'Obtenir la fiche gratuite',
    units: 'Unités de cinq jours pour la classe',
    unitsChip: 'Unités pour la classe',
    allUnits: 'Voir toutes les unités pour la classe',
    ages: 'Âges',
    bookCount: 'livres',
  },
};

const MAX_BOOKS = 4;

/** Book ids for a guide: paired with the guide itself, then with its printables, then its themes. */
function guideBookIds(guide: Resource): string[] {
  const ordered = [
    ...(booksByResourceId[guide.id] ?? []),
    ...(guide.relatedResourceIds ?? []).flatMap((rid) => booksByResourceId[rid] ?? []),
    ...(guide.relatedThemeIds ?? []).flatMap((tid) => booksByThemeId[tid] ?? []),
  ];
  return [...new Set(ordered)].slice(0, MAX_BOOKS);
}

/** Every published unit, the ones sharing a theme or a printable with the guide first (stable). */
function guideUnits(guide: Resource): ClassroomUnit[] {
  const score = (u: ClassroomUnit) =>
    (u.themeIds.some((t) => guide.relatedThemeIds?.includes(t)) ? 2 : 0) +
    (u.resourceIds.some((r) => guide.relatedResourceIds?.includes(r)) ? 1 : 0);
  return publishedClassroomUnits.map((u, i) => ({ u, i, s: score(u) })).sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.u);
}

function cover(src: string, width: number) {
  return sizedCover(src, width);
}

export default function GuideNextStep({ slug, variant }: { slug: string; variant: 'compact' | 'full' }) {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const allBooks = useBooks();
  const guide = resources.find((r) => r.kind === 'article' && r.slug === slug);
  if (!guide) return null;

  const books = guideBookIds(guide)
    .map((id) => allBooks.find((b) => b.id === id))
    .filter((b): b is LocalizedBook => b !== undefined);
  const printables = (guide.relatedResourceIds ?? [])
    .map((id) => resources.find((r) => r.id === id))
    .filter((r): r is Resource => r !== undefined && r.kind === 'download');
  const units = guideUnits(guide);
  const reason = variant === 'compact' ? 'guide-mid' : 'guide-end';

  if (variant === 'compact') {
    return (
      <aside
        data-guide-next-step="compact"
        aria-label={t.heading}
        className="not-prose my-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-4 sm:px-5"
      >
        <p className="font-bold text-gray-800">{t.heading}</p>
        <p className="text-sm text-gray-600 mt-1 mb-3">{t.compact}</p>
        <div className="flex flex-wrap items-center gap-2">
          {books.slice(0, 3).map((b) => (
            <Link
              key={b.id}
              to={`/books/${b.id}`}
              onClick={() => track('Continue Journey', { placement: 'guide', destination: 'book', book: b.id, reason })}
              className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <img src={cover(b.coverImage, 120)} alt={b.title} width={44} height={44} loading="lazy" className="w-11 h-11 rounded-lg object-cover border border-white shadow-xs" />
            </Link>
          ))}
          {printables.slice(0, 1).map((r) => (
            <Link
              key={r.id}
              to={resourcePath(r)}
              onClick={() => track('Continue Journey', { placement: 'guide', destination: 'printable', resource: r.id, reason })}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-emerald-200 text-sm font-semibold text-emerald-800 hover:border-emerald-400"
            >
              <span aria-hidden>{r.emoji ?? '📄'}</span> {t.printable}: {r.title[language]}
            </Link>
          ))}
          <Link
            to="/classroom"
            onClick={() => track('Continue Journey', { placement: 'guide', destination: 'classroom', reason })}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-emerald-200 text-sm font-semibold text-emerald-800 hover:border-emerald-400"
          >
            <span aria-hidden>🍎</span> {t.unitsChip} ({units.length})
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <section data-guide-next-step="full" aria-labelledby="guide-next-step" className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-5 sm:p-7">
      <h2 id="guide-next-step" className="text-2xl font-bold text-gray-800 mb-1">{t.heading}</h2>
      <p className="text-gray-600 mb-6">{t.intro}</p>

      {books.length > 0 && (
        <>
          <h3 className="text-base font-bold text-gray-800 mb-3">{t.books}</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {books.map((b) => (
              <li key={b.id}>
                <Link
                  to={`/books/${b.id}`}
                  onClick={() => track('Continue Journey', { placement: 'guide', destination: 'book', book: b.id, reason })}
                  className="block group"
                >
                  <img src={cover(b.coverImage, 240)} alt="" width={160} height={160} loading="lazy" className="w-full aspect-square rounded-xl object-cover shadow-xs group-hover:shadow-md transition-shadow" />
                  <span className="block mt-1.5 text-sm font-semibold text-gray-800 leading-snug group-hover:text-emerald-800">{b.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {printables.length > 0 && (
        <>
          <h3 className="text-base font-bold text-gray-800 mb-3">{t.printable}</h3>
          <ul className="flex flex-col gap-2 mb-6">
            {printables.map((r) => (
              <li key={r.id}>
                <Link
                  to={resourcePath(r)}
                  onClick={() => track('Continue Journey', { placement: 'guide', destination: 'printable', resource: r.id, reason })}
                  className="flex items-start gap-3 rounded-2xl bg-white border border-emerald-100 p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
                >
                  <span className="text-2xl" aria-hidden>{r.emoji ?? '📄'}</span>
                  <span>
                    <span className="block font-bold text-gray-800">{r.title[language]}</span>
                    <span className="block text-sm text-gray-600">{r.description[language]}</span>
                    <span className="block text-sm font-semibold text-emerald-700 mt-1">{t.getPrintable} →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="text-base font-bold text-gray-800 mb-3">{t.units}</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {units.map((u) => {
          const ub = unitBooks(u);
          const [from, to] = unitAgeRange(u).split('-');
          return (
            <li key={u.id}>
              <Link
                to={`/classroom/${u.id}`}
                onClick={() => track('Continue Journey', { placement: 'guide', destination: 'classroom-unit', resource: u.id, reason })}
                className="flex h-full items-center gap-3 rounded-2xl bg-white border border-emerald-100 p-3 hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <span className="flex -space-x-3 shrink-0" aria-hidden>
                  {ub.map((b) => (
                    <img
                      key={b.id}
                      src={cover(b.editions[language]?.cover ?? b.editions.en.cover ?? '', 120)}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="w-10 h-10 rounded-lg object-cover border-2 border-white"
                    />
                  ))}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-gray-800 leading-snug"><span aria-hidden>{u.emoji} </span>{u.title[language]}</span>
                  <span className="block text-xs text-gray-500 mt-0.5">{t.ages} {from}-{to} · {ub.length} {t.bookCount}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-4">
        <Link
          to="/classroom"
          onClick={() => track('Continue Journey', { placement: 'guide', destination: 'classroom', reason })}
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
        >
          {t.allUnits} →
        </Link>
      </p>
    </section>
  );
}
