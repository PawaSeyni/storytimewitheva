import { Link } from './LocalizedLink';
import { useLanguage, useTranslation } from '../lib/language';
import { resources } from '../data/resources';
import SaveResourceButton from './SaveResourceButton';

/**
 * A SHARED set of reading resources, identical on every book page.
 *
 * Deliberately not per-book (`relatedResourceIds` stays empty). All ten resources are
 * general reading-practice guidance: none references a theme, an age band or a title,
 * so pairing them per book would manufacture a curation signal that does not exist.
 * A shared strip delivers the same value and claims nothing untrue. See docs/PUNCH_LIST.md
 * B-03. If book-specific resources are ever written, revisit this.
 *
 * Ids are validated against the registry in tests/funnel/resource-strip.test.mjs, so a
 * typo here fails the build instead of rendering a dead card.
 */
export const SHARED_RESOURCE_IDS = [
  'download-parents-guide',        // discussion prompts — the most book-adjacent printable
  'article-follow-up-activities',  // what to do after the last page
  'article-making-reading-magical',
  'article-bilingual-reading',     // on-brand: every title is read in three languages
] as const;

const TRANSLATIONS = {
  en: { heading: 'Reading with your child', sub: 'Free guides and printables for every story.', all: 'All resources →' },
  es: { heading: 'Leer con tu peque', sub: 'Guías y fichas imprimibles gratis para cada historia.', all: 'Todos los recursos →' },
  fr: { heading: 'Lire avec votre enfant', sub: 'Guides et fiches gratuits pour chaque histoire.', all: 'Toutes les ressources →' },
};

export default function ResourceStrip() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const items = SHARED_RESOURCE_IDS
    .map((id) => resources.find((r) => r.id === id))
    .filter((r) => r !== undefined);

  return (
    <section className="max-w-6xl mx-auto px-4 pb-14">
      <div className="bg-purple-50/60 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
          {/* h2: sits alongside the related-books h2 under the page h1. */}
          <h2 className="text-2xl font-bold text-gray-800">{t.heading}</h2>
          <Link to="/resources" className="text-sm font-semibold text-purple-600 hover:text-purple-800">
            {t.all}
          </Link>
        </div>
        <p className="text-gray-500 text-sm mb-5">{t.sub}</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((r) => (
            <li key={r.id} className="flex items-start gap-2">
              <Link
                to={r.kind === 'article' ? `/resources#${r.slug}` : `/free/${r.slug}`}
                className="flex-1 flex gap-3 items-start bg-white rounded-xl p-4 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all h-full"
              >
                <span className="text-2xl leading-none shrink-0" aria-hidden>{r.emoji ?? '📄'}</span>
                <span>
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
