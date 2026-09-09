import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { loadLibrary, isResourceSaved, toggleSavedResource, onLibraryChange } from '../lib/personalLibrary';
import { useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

// S6-009. Stores the resource ID only; the shelf resolves it against the registry at
// read time, so a retired resource disappears instead of leaving a dead card.
const TRANSLATIONS = {
  en: { save: 'Save for later', remove: 'Remove from saved' },
  es: { save: 'Guardar para después', remove: 'Quitar de guardados' },
  fr: { save: 'Enregistrer pour plus tard', remove: 'Retirer des enregistrés' },
};

export default function SaveResourceButton({ resourceId }: { resourceId: string }) {
  const [saved, setSaved] = useState(false);
  const t = useTranslation(TRANSLATIONS);

  useEffect(() => {
    const sync = () => setSaved(isResourceSaved(loadLibrary(), resourceId));
    sync();
    return onLibraryChange(sync);
  }, [resourceId]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // Same rule as FavoriteButton: the `librarychange` listener is the single
        // source of the displayed state. A local flip on top of it inverts the result.
        toggleSavedResource(resourceId);
        track('Resource Saved', { resource: resourceId, status: saved ? 'removed' : 'added' });
      }}
      aria-pressed={saved}
      aria-label={saved ? t.remove : t.save}
      title={saved ? t.remove : t.save}
      className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
        saved
          ? 'bg-purple-600 border-purple-600 text-white'
          : 'bg-white border-gray-200 text-gray-400 hover:border-purple-300 hover:text-purple-600'
      }`}
    >
      <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
