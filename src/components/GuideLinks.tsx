import { Link } from './LocalizedLink';
import { useBooks } from '../data/books';
import { resources } from '../data/resources';
import { THEMES } from '../data/taxonomy';
import { booksByThemeId, collectionEligibleThemeIds } from '../data/contentIndex';
import { useLanguage, useTranslation } from '../lib/language';

/**
 * S7-006: every parent guide ends with the stories it speaks to and the printables that
 * pair with it. Books are DERIVED from the guide's relatedThemeIds (first three across its
 * themes, catalog order, deduplicated); collections link only where a public theme
 * collection exists. Nothing here is a second relationship array.
 */
const TRANSLATIONS = {
  en: { stories: 'Stories to read with this guide', more: 'More books about', printables: 'Printables that pair with it' },
  es: { stories: 'Historias para leer con esta guía', more: 'Más libros sobre', printables: 'Imprimibles que la acompañan' },
  fr: { stories: 'Des histoires à lire avec ce guide', more: 'Plus de livres sur', printables: 'Fiches à imprimer qui l’accompagnent' },
};

const MAX_BOOKS = 3;

export default function GuideLinks({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const guide = resources.find((r) => r.kind === 'article' && r.slug === slug);
  if (!guide || !guide.relatedThemeIds?.length) return null;

  const picks: string[] = [];
  for (const theme of guide.relatedThemeIds) for (const id of booksByThemeId[theme]) if (!picks.includes(id)) picks.push(id);
  const stories = picks.slice(0, MAX_BOOKS).map((id) => books.find((b) => b.id === id)).filter((b) => b !== undefined);
  const collections = guide.relatedThemeIds.filter((tid) => (collectionEligibleThemeIds as string[]).includes(tid));
  const printables = (guide.relatedResourceIds ?? []).map((id) => resources.find((r) => r.id === id)).filter((r) => r !== undefined);

  return (
    <footer className="mt-10 pt-6 border-t border-purple-100" data-guide-links={slug}>
      <h3 className="text-lg font-bold text-gray-800 mb-3">{t.stories}</h3>
      <ul className="flex flex-wrap gap-2 mb-4">
        {stories.map((b) => (
          <li key={b.id}>
            <Link to={`/books/${b.id}`} className="inline-block px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-sm font-semibold text-purple-800 hover:border-purple-300">
              {b.title}
            </Link>
          </li>
        ))}
      </ul>
      {collections.length > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          {t.more}{' '}
          {collections.map((tid, i) => (
            <span key={tid}>
              {i > 0 ? ', ' : ''}
              <Link to={`/collections/${tid}`} className="underline hover:text-purple-700">{THEMES[tid].labels[language].toLowerCase()}</Link>
            </span>
          ))}
        </p>
      )}
      {printables.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{t.printables}</h3>
          <ul className="flex flex-wrap gap-2">
            {printables.map((r) => (
              <li key={r.id}>
                <Link to={r.kind === 'article' ? `/resources#${r.slug}` : `/free/${r.slug}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 text-sm text-purple-700 hover:border-purple-300">
                  <span aria-hidden>{r.emoji ?? '📄'}</span> {r.title[language]}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </footer>
  );
}
