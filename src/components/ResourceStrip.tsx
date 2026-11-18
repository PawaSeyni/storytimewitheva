import { Link } from './LocalizedLink';
import { useLanguage, useTranslation } from '../lib/language';
import { books } from '../data/books.data';
import { resources, resourcePath } from '../data/resources';
import SaveResourceButton from './SaveResourceButton';

/**
 * "Guides and printables for this book": renders a book's `relatedResourceIds`.
 *
 * The pairs are data (books.data.ts, rule in the field's doc comment: the per-story
 * parent guide, one printable by primary age band, one guide by shared theme) and are
 * validated in tests/funnel/book-resources.test.mjs, so an unknown id fails the build
 * rather than rendering a dead card. Unknown ids are still skipped defensively here.
 *
 * SHARED_RESOURCE_IDS is the fallback for a page with no book context, or a book whose
 * record carries no pairs yet: general reading guidance, identical everywhere, which was
 * the whole strip until 2026-11 (B-03). Ids validated in tests/funnel/resource-strip.test.mjs.
 *
 * Download links go through resourcePath -> /free/<slug>, the same gated landing page the
 * Resources index uses: never a hashed PDF filename, so a rebuilt file cannot rot a link.
 */
export const SHARED_RESOURCE_IDS = [
  'download-parents-guide',        // discussion prompts — the most book-adjacent printable
  'article-follow-up-activities',  // what to do after the last page
  'article-making-reading-magical',
  'article-bilingual-reading',     // on-brand: every title is read in three languages
] as const;

const TRANSLATIONS = {
  en: {
    heading: 'Guides and printables for this book',
    sub: 'Free, chosen for this story’s themes and reading age.',
    sharedHeading: 'Reading with your child',
    sharedSub: 'Free guides and printables for every story.',
    all: 'All resources →',
    printable: 'Printable',
    guide: 'Guide',
  },
  es: {
    heading: 'Guías e imprimibles para este libro',
    sub: 'Gratis y elegidos según los temas y la edad de lectura de esta historia.',
    sharedHeading: 'Leer con tu peque',
    sharedSub: 'Guías y fichas imprimibles gratis para cada historia.',
    all: 'Todos los recursos →',
    printable: 'Imprimible',
    guide: 'Guía',
  },
  fr: {
    heading: 'Guides et fiches pour ce livre',
    sub: 'Gratuits et choisis selon les thèmes et l’âge de lecture de cette histoire.',
    sharedHeading: 'Lire avec votre enfant',
    sharedSub: 'Guides et fiches gratuits pour chaque histoire.',
    all: 'Toutes les ressources →',
    printable: 'Fiche à imprimer',
    guide: 'Guide',
  },
};

export default function ResourceStrip({ bookId }: { bookId?: string }) {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const own = bookId ? books.find((b) => b.id === bookId)?.relatedResourceIds ?? [] : [];
  const perBook = own.length > 0;
  const ids: readonly string[] = perBook ? own : SHARED_RESOURCE_IDS;
  const items = ids
    .map((id) => resources.find((r) => r.id === id))
    .filter((r) => r !== undefined);
  if (items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 pb-14" data-book-resources={perBook ? bookId : 'shared'}>
      <div className="bg-purple-50/60 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
          {/* h2: sits alongside the related-books h2 under the page h1. */}
          <h2 className="text-2xl font-bold text-gray-800">{perBook ? t.heading : t.sharedHeading}</h2>
          <Link to="/resources" className="text-sm font-semibold text-purple-600 hover:text-purple-800">
            {t.all}
          </Link>
        </div>
        <p className="text-gray-500 text-sm mb-5">{perBook ? t.sub : t.sharedSub}</p>
        <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${items.length === 3 ? 'lg:grid-cols-3' : ''}`}>
          {items.map((r) => (
            <li key={r.id} className="flex items-start gap-2">
              <Link
                to={resourcePath(r)}
                className="flex-1 flex gap-3 items-start bg-white rounded-xl p-4 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all h-full"
              >
                <span className="text-2xl leading-none shrink-0" aria-hidden>{r.emoji ?? '📄'}</span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-purple-600 mb-0.5">
                    {r.kind === 'download' ? t.printable : t.guide}
                  </span>
                  <span className="block font-semibold text-gray-800 text-sm leading-snug">{r.title[language]}</span>
                  <span className="block text-gray-500 text-xs leading-relaxed mt-0.5">{r.description[language]}</span>
                </span>
              </Link>
              <SaveResourceButton resourceId={r.id} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
