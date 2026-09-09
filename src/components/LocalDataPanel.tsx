import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { loadLibrary, libraryCounts, clearLibrary, onLibraryChange } from '../lib/personalLibrary';
import { loadProgress, clearProgress, loadReadingJournal, loadReadingTracker } from '../lib/progress';
import { available } from '../lib/storage';
import { useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

// S6-013. Shows WHAT this device remembers, WHERE it lives, and WHAT clearing does —
// then clears all of it for real. Two stores are involved and both are cleared: the
// Sprint 6 envelope (statuses, favorites, recent, saved resources, preferences) and the
// legacy stores the games and activity demos own (completions, journal, tracker, saved
// artwork). One control, so a parent never has to know there are two.
//
// Wording is addressed to the grown-up and deliberately never implies a child is being
// tracked: this is a device's memory, not a profile.
const TRANSLATIONS = {
  en: {
    heading: 'What this device remembers',
    where: 'All of it is stored in this browser only. Nothing here is sent to us or to anyone else, and switching devices or clearing browser data resets it.',
    notPersisting: 'Storage is unavailable in this browser, so nothing will be remembered after you leave the page.',
    items: {
      read: 'Books marked read', reading: 'Books being read now', wantToRead: 'Books on the reading list',
      favorites: 'Favorites', recentlyExplored: 'Recently viewed books', savedResources: 'Saved resources',
      preferences: 'Suggestion preferences', activities: 'Completed activities',
      journal: 'Journal entries', tracker: 'Reading tracker sessions',
    },
    nothing: 'Nothing is stored yet.',
    clear: 'Clear everything on this device',
    clearWhat: 'Clearing removes every item listed above from this browser. It cannot be undone.',
    clearConfirm: 'Clear everything this device remembers? This cannot be undone.',
    cleared: 'Everything on this device has been cleared.',
  },
  es: {
    heading: 'Lo que recuerda este dispositivo',
    where: 'Todo se guarda solo en este navegador. Nada de esto se nos envía a nosotros ni a nadie, y cambiar de dispositivo o borrar los datos del navegador lo reinicia.',
    notPersisting: 'El almacenamiento no está disponible en este navegador, así que nada se recordará al salir de la página.',
    items: {
      read: 'Libros marcados como leídos', reading: 'Libros que se están leyendo', wantToRead: 'Libros en la lista',
      favorites: 'Favoritos', recentlyExplored: 'Libros vistos hace poco', savedResources: 'Recursos guardados',
      preferences: 'Preferencias de sugerencias', activities: 'Actividades completadas',
      journal: 'Entradas del diario', tracker: 'Sesiones del registro de lectura',
    },
    nothing: 'Todavía no hay nada guardado.',
    clear: 'Borrar todo en este dispositivo',
    clearWhat: 'Borrar elimina de este navegador todos los elementos de la lista. No se puede deshacer.',
    clearConfirm: '¿Borrar todo lo que recuerda este dispositivo? No se puede deshacer.',
    cleared: 'Se ha borrado todo en este dispositivo.',
  },
  fr: {
    heading: 'Ce que cet appareil retient',
    where: 'Tout est conservé uniquement dans ce navigateur. Rien n’est envoyé ni à nous ni à qui que ce soit, et changer d’appareil ou effacer les données du navigateur remet tout à zéro.',
    notPersisting: 'Le stockage n’est pas disponible dans ce navigateur : rien ne sera retenu après avoir quitté la page.',
    items: {
      read: 'Livres marqués lus', reading: 'Livres en cours de lecture', wantToRead: 'Livres sur la liste',
      favorites: 'Favoris', recentlyExplored: 'Livres consultés récemment', savedResources: 'Ressources enregistrées',
      preferences: 'Préférences de suggestions', activities: 'Activités terminées',
      journal: 'Entrées du journal', tracker: 'Séances du suivi de lecture',
    },
    nothing: 'Rien n’est encore enregistré.',
    clear: 'Tout effacer sur cet appareil',
    clearWhat: 'Effacer supprime de ce navigateur chaque élément listé ci-dessus. C’est irréversible.',
    clearConfirm: 'Effacer tout ce que cet appareil retient ? C’est irréversible.',
    cleared: 'Tout a été effacé sur cet appareil.',
  },
};

type Counts = Record<keyof (typeof TRANSLATIONS)['en']['items'], number>;

function readCounts(): Counts {
  const lib = libraryCounts(loadLibrary());
  const progress = loadProgress();
  return {
    ...lib,
    activities: progress.activitiesCompleted.length,
    journal: loadReadingJournal().length,
    tracker: loadReadingTracker()?.log.length ?? 0,
  };
}

export default function LocalDataPanel({ onCleared }: { onCleared?: () => void }) {
  const t = useTranslation(TRANSLATIONS);
  const [counts, setCounts] = useState<Counts>(() => readCounts());
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const sync = () => setCounts(readCounts());
    sync();
    const off = onLibraryChange(sync);
    window.addEventListener('progresschange', sync);
    return () => {
      off();
      window.removeEventListener('progresschange', sync);
    };
  }, []);

  const total = Object.values(counts).reduce((a, n) => a + n, 0);

  const handleClear = () => {
    if (!window.confirm(t.clearConfirm)) return;
    clearLibrary();
    clearProgress();
    setCounts(readCounts());
    // Polite live region: announces without stealing focus (Sprint 6 §9).
    setAnnouncement(t.cleared);
    track('Local Data Cleared', { placement: 'profile' });
    onCleared?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6">
      <h2 className="font-bold text-gray-800 mb-1">{t.heading}</h2>
      <p className="text-gray-500 text-sm mb-4">{t.where}</p>
      {!available() && (
        <p className="text-amber-800 bg-amber-50 border border-amber-100 rounded-lg text-sm px-3 py-2 mb-4">
          {t.notPersisting}
        </p>
      )}

      {total === 0 ? (
        <p className="text-gray-500 text-sm">{t.nothing}</p>
      ) : (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-5">
          {(Object.keys(t.items) as (keyof Counts)[])
            .filter((k) => counts[k] > 0)
            .map((k) => (
              <div key={k} className="flex justify-between gap-3 border-b border-gray-50 py-1">
                <dt className="text-gray-600">{t.items[k]}</dt>
                <dd className="font-semibold text-gray-800 tabular-nums">{counts[k]}</dd>
              </div>
            ))}
        </dl>
      )}

      {total > 0 && (
        <>
          <p className="text-xs text-gray-500 mb-3">{t.clearWhat}</p>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 border border-red-200 hover:bg-red-50 rounded-full px-4 py-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" aria-hidden />
            {t.clear}
          </button>
        </>
      )}

      <p role="status" aria-live="polite" className="sr-only">{announcement}</p>
    </div>
  );
}
