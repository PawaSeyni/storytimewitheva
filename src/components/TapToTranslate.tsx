import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from '../lib/language';
import type { Language } from '../lib/language';

/**
 * Curated mini-dictionary of common words found in these gentle picture-book
 * descriptions. Keyed by the lowercase English lemma; each entry holds the
 * en/es/fr forms. The lookup matches a displayed word against ANY language's
 * form, so tap-to-translate works no matter which site language is showing.
 *
 * Kept deliberately small and hand-picked – it is a learning aid, not a full
 * translator. Whole-sentence translations live elsewhere (bilingual view).
 */
const DICTIONARY: Record<string, Record<Language, string>> = {
  story: { en: 'story', es: 'historia', fr: 'histoire' },
  book: { en: 'book', es: 'libro', fr: 'livre' },
  friend: { en: 'friend', es: 'amigo', fr: 'ami' },
  friends: { en: 'friends', es: 'amigos', fr: 'amis' },
  family: { en: 'family', es: 'familia', fr: 'famille' },
  mother: { en: 'mother', es: 'madre', fr: 'mère' },
  father: { en: 'father', es: 'padre', fr: 'père' },
  child: { en: 'child', es: 'niño', fr: 'enfant' },
  children: { en: 'children', es: 'niños', fr: 'enfants' },
  girl: { en: 'girl', es: 'niña', fr: 'fille' },
  boy: { en: 'boy', es: 'niño', fr: 'garçon' },
  baby: { en: 'baby', es: 'bebé', fr: 'bébé' },
  home: { en: 'home', es: 'hogar', fr: 'maison' },
  house: { en: 'house', es: 'casa', fr: 'maison' },
  village: { en: 'village', es: 'aldea', fr: 'village' },
  world: { en: 'world', es: 'mundo', fr: 'monde' },
  forest: { en: 'forest', es: 'bosque', fr: 'forêt' },
  tree: { en: 'tree', es: 'árbol', fr: 'arbre' },
  trees: { en: 'trees', es: 'árboles', fr: 'arbres' },
  flower: { en: 'flower', es: 'flor', fr: 'fleur' },
  river: { en: 'river', es: 'río', fr: 'rivière' },
  sea: { en: 'sea', es: 'mar', fr: 'mer' },
  ocean: { en: 'ocean', es: 'océano', fr: 'océan' },
  mountain: { en: 'mountain', es: 'montaña', fr: 'montagne' },
  sky: { en: 'sky', es: 'cielo', fr: 'ciel' },
  sun: { en: 'sun', es: 'sol', fr: 'soleil' },
  moon: { en: 'moon', es: 'luna', fr: 'lune' },
  star: { en: 'star', es: 'estrella', fr: 'étoile' },
  stars: { en: 'stars', es: 'estrellas', fr: 'étoiles' },
  night: { en: 'night', es: 'noche', fr: 'nuit' },
  day: { en: 'day', es: 'día', fr: 'jour' },
  morning: { en: 'morning', es: 'mañana', fr: 'matin' },
  rain: { en: 'rain', es: 'lluvia', fr: 'pluie' },
  wind: { en: 'wind', es: 'viento', fr: 'vent' },
  fire: { en: 'fire', es: 'fuego', fr: 'feu' },
  water: { en: 'water', es: 'agua', fr: 'eau' },
  animal: { en: 'animal', es: 'animal', fr: 'animal' },
  bird: { en: 'bird', es: 'pájaro', fr: 'oiseau' },
  cat: { en: 'cat', es: 'gato', fr: 'chat' },
  dog: { en: 'dog', es: 'perro', fr: 'chien' },
  lion: { en: 'lion', es: 'león', fr: 'lion' },
  heart: { en: 'heart', es: 'corazón', fr: 'cœur' },
  dream: { en: 'dream', es: 'sueño', fr: 'rêve' },
  dreams: { en: 'dreams', es: 'sueños', fr: 'rêves' },
  hope: { en: 'hope', es: 'esperanza', fr: 'espoir' },
  love: { en: 'love', es: 'amor', fr: 'amour' },
  kindness: { en: 'kindness', es: 'bondad', fr: 'bonté' },
  courage: { en: 'courage', es: 'valentía', fr: 'courage' },
  brave: { en: 'brave', es: 'valiente', fr: 'courageux' },
  joy: { en: 'joy', es: 'alegría', fr: 'joie' },
  happy: { en: 'happy', es: 'feliz', fr: 'heureux' },
  magic: { en: 'magic', es: 'magia', fr: 'magie' },
  adventure: { en: 'adventure', es: 'aventura', fr: 'aventure' },
  journey: { en: 'journey', es: 'viaje', fr: 'voyage' },
  song: { en: 'song', es: 'canción', fr: 'chanson' },
  music: { en: 'music', es: 'música', fr: 'musique' },
  dance: { en: 'dance', es: 'baile', fr: 'danse' },
  color: { en: 'color', es: 'color', fr: 'couleur' },
  colors: { en: 'colors', es: 'colores', fr: 'couleurs' },
  light: { en: 'light', es: 'luz', fr: 'lumière' },
  little: { en: 'little', es: 'pequeño', fr: 'petit' },
  big: { en: 'big', es: 'grande', fr: 'grand' },
  good: { en: 'good', es: 'bueno', fr: 'bon' },
  beautiful: { en: 'beautiful', es: 'hermoso', fr: 'beau' },
  new: { en: 'new', es: 'nuevo', fr: 'nouveau' },
  old: { en: 'old', es: 'viejo', fr: 'vieux' },
  wise: { en: 'wise', es: 'sabio', fr: 'sage' },
  gift: { en: 'gift', es: 'regalo', fr: 'cadeau' },
  secret: { en: 'secret', es: 'secreto', fr: 'secret' },
  rule: { en: 'rule', es: 'regla', fr: 'règle' },
  name: { en: 'name', es: 'nombre', fr: 'nom' },
  word: { en: 'word', es: 'palabra', fr: 'mot' },
  words: { en: 'words', es: 'palabras', fr: 'mots' },
  teacher: { en: 'teacher', es: 'maestro', fr: 'maître' },
  school: { en: 'school', es: 'escuela', fr: 'école' },
  food: { en: 'food', es: 'comida', fr: 'nourriture' },
  egg: { en: 'egg', es: 'huevo', fr: 'œuf' },
  yam: { en: 'yam', es: 'ñame', fr: 'igname' },
  king: { en: 'king', es: 'rey', fr: 'roi' },
  queen: { en: 'queen', es: 'reina', fr: 'reine' },
  garden: { en: 'garden', es: 'jardín', fr: 'jardin' },
  road: { en: 'road', es: 'camino', fr: 'route' },
  path: { en: 'path', es: 'sendero', fr: 'chemin' },
  fish: { en: 'fish', es: 'pez', fr: 'poisson' },
  bee: { en: 'bee', es: 'abeja', fr: 'abeille' },
  elephant: { en: 'elephant', es: 'elefante', fr: 'éléphant' },
  rabbit: { en: 'rabbit', es: 'conejo', fr: 'lapin' },
  spider: { en: 'spider', es: 'araña', fr: 'araignée' },
};

/** Lowercase and strip leading/trailing punctuation so "Forest," matches "forest". */
function normalize(word: string): string {
  return word
    .toLowerCase()
    .replace(/^[^\p{L}]+/u, '')
    .replace(/[^\p{L}]+$/u, '');
}

/**
 * Build a reverse index from any-language lowercase form to its dictionary
 * lemma, so a displayed word in es or fr still resolves to the entry.
 */
function buildIndex(): Record<string, string> {
  const index: Record<string, string> = {};
  for (const lemma of Object.keys(DICTIONARY)) {
    const forms = DICTIONARY[lemma];
    for (const lang of SUPPORTED_LANGUAGES) {
      const key = normalize(forms[lang]);
      // First lemma wins on collisions – keeps lookups stable.
      if (!(key in index)) index[key] = lemma;
    }
  }
  return index;
}

const TRANSLATIONS = {
  en: { tapHint: 'Tap an underlined word', close: 'Close' },
  es: { tapHint: 'Toca una palabra subrayada', close: 'Cerrar' },
  fr: { tapHint: 'Touche un mot souligné', close: 'Fermer' },
};

interface TapToTranslateProps {
  /** The book description in the active site language. */
  text: string;
  language: Language;
  className?: string;
}

interface Token {
  raw: string;
  lemma: string | null;
}

/**
 * Renders `text` word-by-word. Words present in the curated dictionary get a
 * dotted underline and are tappable; tapping opens a small popover showing the
 * same word in the other two site languages with their flag. Words that are
 * not in the dictionary render as plain text.
 */
export default function TapToTranslate({ text, language, className = '' }: TapToTranslateProps) {
  const baseId = useId();
  const t = TRANSLATIONS[language];
  const index = useMemo(buildIndex, []);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Split into whitespace and non-whitespace runs so spacing is preserved
  // exactly. Each non-space run is a candidate word.
  const tokens = useMemo<Token[]>(() => {
    const parts = text.match(/\s+|\S+/g) ?? [];
    return parts.map((raw) => {
      if (/^\s+$/.test(raw)) return { raw, lemma: null };
      const lemma = index[normalize(raw)] ?? null;
      return { raw, lemma };
    });
  }, [text, index]);

  // Dismiss the popover on outside click or Escape.
  useEffect(() => {
    if (openIndex === null) return;
    const onPointer = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [openIndex]);

  const otherLangs = SUPPORTED_LANGUAGES.filter((l) => l !== language) as Language[];

  return (
    <div ref={containerRef} className={className}>
      <p className="text-xs text-purple-500 mb-2">{t.tapHint}</p>
      <p className="leading-relaxed">
        {tokens.map((tok, i) => {
          if (tok.lemma === null) {
            // Whitespace or a non-dictionary word – plain text.
            return <span key={i}>{tok.raw}</span>;
          }
          const forms = DICTIONARY[tok.lemma];
          const isOpen = openIndex === i;
          // Align the popover to the right edge when the word sits in the
          // latter half of the text, so it stays on screen on narrow viewports.
          const alignRight = i / tokens.length > 0.6;
          return (
            <span key={i} className="relative inline-block">
              <button
                type="button"
                onClick={() => setOpenIndex((cur) => (cur === i ? null : i))}
                aria-label={`${tok.raw}: ${otherLangs
                  .map((l) => `${LANGUAGE_LABELS[l].name} ${forms[l]}`)
                  .join(', ')}`}
                aria-expanded={isOpen}
                aria-controls={isOpen ? `ttt-pop-${i}` : undefined}
                className={`cursor-pointer underline decoration-dotted decoration-purple-400 underline-offset-4 rounded transition-colors ${
                  isOpen ? 'bg-purple-100 text-purple-800' : 'hover:bg-purple-50'
                }`}
              >
                {tok.raw}
              </button>
              {isOpen && (
                <span
                  id={`ttt-pop-${i}`}
                  role="dialog"
                  aria-label={tok.raw}
                  className={`absolute top-full z-20 mt-1 block min-w-[10rem] rounded-xl border border-purple-100 bg-white p-3 text-left shadow-lg ${
                    alignRight ? 'right-0' : 'left-0'
                  }`}
                >
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-purple-400">
                    {forms[language]}
                  </span>
                  {otherLangs.map((l) => (
                    <span key={l} className="flex items-center gap-2 py-0.5 text-sm text-gray-700" lang={l}>
                      <span aria-hidden>{LANGUAGE_LABELS[l].flag}</span>
                      <span>{forms[l]}</span>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setOpenIndex(null)}
                    className="mt-2 block text-xs font-semibold text-purple-500 hover:text-purple-700"
                    id={`${baseId}-close-${i}`}
                  >
                    {t.close}
                  </button>
                </span>
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
}
