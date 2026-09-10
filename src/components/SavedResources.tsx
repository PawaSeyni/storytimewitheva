import { useEffect, useState } from 'react';
import { Link } from './LocalizedLink';
import { resources } from '../data/resources';
import { loadLibrary, savedResourceIds, onLibraryChange } from '../lib/personalLibrary';
import SaveResourceButton from './SaveResourceButton';
import { useLanguage, useTranslation } from '../lib/language';

// S6-009 shelf. Renders nothing when empty rather than an encouraging placeholder: an
// adult page should not nag, and the save control lives on the resources themselves.
const TRANSLATIONS = {
  en: { heading: 'Saved for later', empty: '' },
  es: { heading: 'Guardado para después', empty: '' },
  fr: { heading: 'Enregistré pour plus tard', empty: '' },
};

export default function SavedResources() {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const known = new Set(resources.map((r) => r.id));
    const sync = () => setIds(savedResourceIds(loadLibrary(), (id) => known.has(id)));
    sync();
    return onLibraryChange(sync);
  }, []);

  if (ids.length === 0) return null;
  const items = ids.map((id) => resources.find((r) => r.id === id)).filter((r) => r !== undefined);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-50 p-6">
      <h2 className="font-bold text-gray-800 mb-4">{t.heading}</h2>
      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id} className="flex items-start gap-3">
            <Link
              to={r.kind === 'article' ? `/resources#${r.slug}` : `/free/${r.slug}`}
              className="flex-1 min-w-0 group"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl shrink-0" aria-hidden>{r.emoji ?? '📄'}</span>
                <span className="font-semibold text-sm text-gray-800 group-hover:text-purple-700 leading-snug">
                  {r.title[language]}
                </span>
              </span>
            </Link>
            <SaveResourceButton resourceId={r.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
