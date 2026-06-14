import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useLanguage, useTranslation } from '../lib/language';
import { getActiveId, isSpeechSupported, play, stop, subscribe } from '../lib/speech';

const TRANSLATIONS = {
  en: { listen: 'Read along', stop: 'Stop', listenAria: 'Read this aloud and follow along', stopAria: 'Stop reading' },
  es: { listen: 'Leer juntos', stop: 'Detener', listenAria: 'Leer en voz alta y seguir el texto', stopAria: 'Detener la lectura' },
  fr: { listen: 'Lire ensemble', stop: 'Arrêter', listenAria: 'Lire à voix haute et suivre le texte', stopAria: 'Arrêter la lecture' },
};

interface ReadAlongProps {
  /** Text to narrate and display, with the current word highlighted as it's spoken. */
  text: string;
  className?: string;
}

/**
 * Read-along block: a "Read along" button plus the text rendered word-by-word,
 * highlighting each word as the Web Speech API speaks it (via `boundary`
 * events). Word highlighting is best-effort — if the browser/voice doesn't
 * fire boundary events the audio still plays and the text still shows, just
 * without the moving highlight. Where speech is unsupported, renders plain text.
 */
export default function ReadAlong({ text, className = '' }: ReadAlongProps) {
  const id = useId();
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const activeId = useSyncExternalStore(subscribe, getActiveId, () => null);
  const speaking = activeId === id;
  const [activeWord, setActiveWord] = useState(-1);

  // Tokenize into words with their char offsets into `text` (the exact string
  // spoken), so a boundary charIndex maps back to a word.
  const tokens = useMemo(() => {
    const out: { word: string; start: number }[] = [];
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) out.push({ word: m[0], start: m.index });
    return out;
  }, [text]);
  const tokensRef = useRef(tokens);
  tokensRef.current = tokens;

  // Reset the highlight whenever this block isn't the active speaker.
  useEffect(() => {
    if (!speaking) setActiveWord(-1);
  }, [speaking]);

  // Stop narration if this block unmounts while it's the one speaking.
  useEffect(() => () => {
    if (getActiveId() === id) stop();
  }, [id]);

  const supported = isSpeechSupported();

  const handleClick = () => {
    if (speaking) {
      stop();
      return;
    }
    setActiveWord(-1);
    play(id, text, language, {
      onBoundary: (charIndex) => {
        const toks = tokensRef.current;
        // Last token whose start is at or before the boundary index.
        let idx = -1;
        for (let i = 0; i < toks.length; i++) {
          if (toks[i].start <= charIndex) idx = i;
          else break;
        }
        setActiveWord(idx);
      },
    });
  };

  if (!supported) {
    return <p className={className}>{text}</p>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={speaking}
        aria-label={speaking ? t.stopAria : t.listenAria}
        className={`inline-flex items-center gap-2 py-2 px-4 mb-3 text-sm font-semibold rounded-full transition-colors ${
          speaking ? 'bg-purple-600 text-white hover:bg-purple-700' : 'text-purple-600 border border-purple-200 hover:bg-purple-50'
        }`}
      >
        <span aria-hidden className="leading-none">{speaking ? '⏹️' : '🔊'}</span>
        {speaking ? t.stop : t.listen}
      </button>
      <p className={className}>
        {tokens.map((tok, i) => (
          <span key={i}>
            <span
              className={
                i === activeWord
                  ? 'bg-yellow-200 rounded px-0.5 -mx-0.5 transition-colors'
                  : undefined
              }
            >
              {tok.word}
            </span>{' '}
          </span>
        ))}
      </p>
    </div>
  );
}
