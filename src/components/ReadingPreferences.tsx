import { useEffect, useState } from 'react';
import {
  loadLibrary,
  getPreferences,
  setPreferences,
  onLibraryChange,
} from '../lib/personalLibrary';
import { THEMES, THEME_IDS, AGE_BANDS, AGE_BAND_IDS, type ThemeId, type AgeBandId } from '../data/taxonomy';
import { useLanguage, useTranslation } from '../lib/language';

// S6-005. Optional, explicit, adult-facing. Nothing is inferred from browsing, nothing
// is required, and skipping is a first-class outcome rather than an unfinished state.
// Reuses the existing theme and age-band IDs: no new taxonomy.
const TRANSLATIONS = {
  en: {
    heading: 'What should we suggest?',
    sub: 'Optional. Pick a few and suggestions across the site will lean that way. Stored on this device only, and you can clear it any time.',
    themes: 'Themes',
    ages: 'Ages',
    clear: 'Clear preferences',
    saved: 'Preferences apply right away.',
    none: 'Nothing selected, so suggestions use the whole catalog.',
  },
  es: {
    heading: '¿Qué te sugerimos?',
    sub: 'Opcional. Elige algunos y las sugerencias del sitio irán por ahí. Se guarda solo en este dispositivo y puedes borrarlo cuando quieras.',
    themes: 'Temas',
    ages: 'Edades',
    clear: 'Borrar preferencias',
    saved: 'Las preferencias se aplican al instante.',
    none: 'Nada seleccionado, así que las sugerencias usan todo el catálogo.',
  },
  fr: {
    heading: 'Que devons-nous suggérer ?',
    sub: 'Facultatif. Choisissez-en quelques-uns et les suggestions du site suivront. Conservé uniquement sur cet appareil, effaçable à tout moment.',
    themes: 'Thèmes',
    ages: 'Âges',
    clear: 'Effacer les préférences',
    saved: 'Les préférences s’appliquent immédiatement.',
    none: 'Rien de sélectionné : les suggestions utilisent tout le catalogue.',
  },
};

const isTheme = (id: string): boolean => (THEME_IDS as readonly string[]).includes(id);
const isBand = (id: string): boolean => (AGE_BAND_IDS as readonly string[]).includes(id);

export default function ReadingPreferences() {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const [prefs, setPrefs] = useState<{ themeIds: string[]; ageBandIds: string[] }>({
    themeIds: [],
    ageBandIds: [],
  });

  useEffect(() => {
    const sync = () => setPrefs(getPreferences(loadLibrary(), isTheme, isBand));
    sync();
    return onLibraryChange(sync);
  }, []);

  const toggle = (kind: 'themeIds' | 'ageBandIds', id: string) => {
    const current = prefs[kind];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setPreferences({ ...prefs, [kind]: next });
    setPrefs({ ...prefs, [kind]: next });
  };

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
      active
        ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
        : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
    }`;

  const empty = prefs.themeIds.length === 0 && prefs.ageBandIds.length === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6">
      <h2 className="font-bold text-gray-800 mb-1">{t.heading}</h2>
      <p className="text-gray-500 text-sm mb-5">{t.sub}</p>

      <fieldset className="mb-4">
        <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{t.ages}</legend>
        <div className="flex flex-wrap gap-2">
          {AGE_BAND_IDS.map((id: AgeBandId) => (
            <button
              key={id}
              type="button"
              onClick={() => toggle('ageBandIds', id)}
              aria-pressed={prefs.ageBandIds.includes(id)}
              className={chip(prefs.ageBandIds.includes(id))}
            >
              {AGE_BANDS[id].labels[language]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{t.themes}</legend>
        <div className="flex flex-wrap gap-2">
          {THEME_IDS.map((id: ThemeId) => (
            <button
              key={id}
              type="button"
              onClick={() => toggle('themeIds', id)}
              aria-pressed={prefs.themeIds.includes(id)}
              className={chip(prefs.themeIds.includes(id))}
            >
              {THEMES[id].labels[language]}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="text-xs text-gray-500" role="status">{empty ? t.none : t.saved}</p>

      {!empty && (
        <button
          type="button"
          onClick={() => {
            setPreferences({ themeIds: [], ageBandIds: [] });
            setPrefs({ themeIds: [], ageBandIds: [] });
          }}
          className="mt-3 text-sm font-semibold text-purple-600 hover:text-purple-800 underline"
        >
          {t.clear}
        </button>
      )}
    </div>
  );
}
