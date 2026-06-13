import { useEffect, useId, useSyncExternalStore } from 'react';
import { useLanguage, useTranslation } from '../lib/language';
import { getActiveId, isSpeechSupported, play, stop, subscribe } from '../lib/speech';

const TRANSLATIONS = {
  en: { listen: 'Listen', stop: 'Stop', listenAria: 'Listen to this book', stopAria: 'Stop reading' },
  es: { listen: 'Escuchar', stop: 'Detener', listenAria: 'Escuchar este libro', stopAria: 'Detener la lectura' },
  fr: { listen: 'Écouter', stop: 'Arrêter', listenAria: 'Écouter ce livre', stopAria: 'Arrêter la lecture' },
};

interface ReadAloudButtonProps {
  /** Text to narrate in the current language. */
  text: string;
  /** Compact style for cards; otherwise a larger pill for the detail modal. */
  compact?: boolean;
}

export default function ReadAloudButton({ text, compact = false }: ReadAloudButtonProps) {
  const id = useId();
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const activeId = useSyncExternalStore(subscribe, getActiveId, () => null);
  const speaking = activeId === id;

  // Stop narration if this button unmounts while it's the one speaking
  // (e.g. the modal closes or the user navigates away).
  useEffect(() => () => {
    if (getActiveId() === id) stop();
  }, [id]);

  if (!isSpeechSupported()) return null; // graceful: hide where unsupported

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (speaking) stop();
    else play(id, text, language);
  };

  const base = compact
    ? 'inline-flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-semibold rounded-full transition-colors'
    : 'inline-flex items-center justify-center gap-2 py-3 px-6 text-base font-semibold rounded-full transition-colors';
  const tone = speaking
    ? 'bg-purple-600 text-white hover:bg-purple-700'
    : 'text-purple-600 border border-purple-200 hover:bg-purple-50';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={speaking}
      aria-label={speaking ? t.stopAria : t.listenAria}
      className={`${base} ${tone}`}
    >
      <span aria-hidden className="leading-none">{speaking ? '⏹️' : '🔊'}</span>
      {speaking ? t.stop : t.listen}
    </button>
  );
}
