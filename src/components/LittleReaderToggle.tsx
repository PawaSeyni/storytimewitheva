import { useTranslation } from '../lib/language';

/**
 * "Little reader" switch (activities audit 2026-11): the same control on every activity that
 * offers a simpler mode for children who are not reading yet (ages 4-5). In that mode the
 * activity uses pictures and taps instead of writing, fewer steps, and read-aloud prompts.
 * Pure UI: the activity owns the state.
 */
const TRANSLATIONS = {
  en: { label: 'Little reader mode', hint: 'For ages 4 to 5: pictures and taps instead of writing, and every prompt read aloud.', on: 'On', off: 'Off', sep: ':' },
  es: { label: 'Modo para peques', hint: 'Para 4 y 5 años: dibujos y toques en lugar de escribir, y cada consigna leída en voz alta.', on: 'Sí', off: 'No', sep: ':' },
  fr: { label: 'Mode petits lecteurs', hint: 'Pour les 4 à 5 ans : des images et des touches au lieu d’écrire, et chaque consigne lue à voix haute.', on: 'Oui', off: 'Non', sep: '\u00a0:' },
};

export default function LittleReaderToggle({ on, onChange }: { on: boolean; onChange: (next: boolean) => void }) {
  const t = useTranslation(TRANSLATIONS);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 mb-6" data-little-reader={on ? 'on' : 'off'}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${on ? 'bg-amber-500' : 'bg-gray-300'}`}
      >
        <span className="sr-only">{t.label}</span>
        <span aria-hidden className={`inline-block h-5 w-5 rounded-full bg-white shadow motion-safe:transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
      <div className="min-w-0">
        <p className="font-bold text-amber-900"><span aria-hidden>🧸 </span>{t.label}{t.sep} {on ? t.on : t.off}</p>
        <p className="text-xs text-amber-900/80">{t.hint}</p>
      </div>
    </div>
  );
}
