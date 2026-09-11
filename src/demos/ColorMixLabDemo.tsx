// Color Keeper's Mix-It Lab (Activity Studio, priority 1). Pairs with The Day the Colors
// Got Mixed Up: Hawel and Pixel the butterfly go looking for the Color Keeper and learn
// how red, yellow and blue make every other color. Predict, mix, then take home a
// trilingual color recipe card.
import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, LineInput } from './studio/StudioFrame';

type Primary = 'red' | 'yellow' | 'blue';
type Word = Record<Language, string>;

const PRIMARIES: Record<Primary, { hex: string; word: Word }> = {
  red: { hex: '#ed654f', word: { en: 'red', es: 'rojo', fr: 'rouge' } },
  yellow: { hex: '#f6bd4d', word: { en: 'yellow', es: 'amarillo', fr: 'jaune' } },
  blue: { hex: '#5b9fe8', word: { en: 'blue', es: 'azul', fr: 'bleu' } },
};
const MIXES: Record<string, { hex: string; word: Word }> = {
  'red+yellow': { hex: '#ef913b', word: { en: 'orange', es: 'naranja', fr: 'orange' } },
  'blue+red': { hex: '#7a62b7', word: { en: 'purple', es: 'morado', fr: 'violet' } },
  'blue+yellow': { hex: '#5caa68', word: { en: 'green', es: 'verde', fr: 'vert' } },
};
const KEYS: Primary[] = ['red', 'yellow', 'blue'];

function mixOf(a: Primary, b: Primary) {
  if (a === b) return PRIMARIES[a];
  return MIXES[[a, b].sort().join('+')];
}

const TRANSLATIONS = {
  en: {
    skill: 'Color vocabulary', title: 'Color Keeper’s Mix-It Lab', subtitle: 'Predict, mix, and make a color recipe card in three languages.', grownup: 'Read the prompt',
    step1: 'Make a prediction', intro: 'Pick two paint colors. What color do you think they will make together? In the story, Hawel and Pixel the butterfly had to find out the hard way.',
    first: 'First color', second: 'Second color', choose: (c: string, side: string) => `Choose ${c} as the ${side} color`,
    words: 'Color words', step2: 'Now check with real paint', check: 'Mix the two colors with a grown-up. Was your prediction right? Draw your new color on the card.',
    cardTitle: 'Color Keeper’s recipe', makes: 'makes', name: 'My name', namePh: 'Write here', footer: 'Signed by the Color Keeper of Harmonia. Try mixing real paint, then draw your new color here.', cardLabel: 'Printable color recipe card',
  },
  es: {
    skill: 'Vocabulario de colores', title: 'El laboratorio de mezclas del Guardián de los Colores', subtitle: 'Predice, mezcla y crea una tarjeta de receta de color en tres idiomas.', grownup: 'Leer la consigna',
    step1: 'Haz una predicción', intro: 'Elige dos colores de pintura. ¿Qué color crees que formarán juntos? En el cuento, Hawel y la mariposa Pixel tuvieron que descubrirlo por las malas.',
    first: 'Primer color', second: 'Segundo color', choose: (c: string, side: string) => `Elegir ${c} como ${side} color`,
    words: 'Palabras de color', step2: 'Ahora compruébalo con pintura real', check: 'Mezcla los dos colores con un adulto. ¿Acertaste? Dibuja tu nuevo color en la tarjeta.',
    cardTitle: 'Receta del Guardián de los Colores', makes: 'forman', name: 'Mi nombre', namePh: 'Escribe aquí', footer: 'Firmado por el Guardián de los Colores de Harmonia. Mezcla pintura de verdad y luego dibuja tu nuevo color aquí.', cardLabel: 'Tarjeta imprimible de receta de color',
  },
  fr: {
    skill: 'Vocabulaire des couleurs', title: 'Le labo des mélanges du Gardien des Couleurs', subtitle: 'Prédis, mélange et crée une carte-recette de couleur en trois langues.', grownup: 'Lire la consigne',
    step1: 'Fais une prédiction', intro: 'Choisis deux couleurs de peinture. Quelle couleur vont-elles donner ensemble ? Dans l’histoire, Hawel et le papillon Pixel ont dû le découvrir à leurs dépens.',
    first: 'Première couleur', second: 'Deuxième couleur', choose: (c: string, side: string) => `Choisir ${c} comme ${side} couleur`,
    words: 'Mots de couleur', step2: 'Vérifie maintenant avec de la vraie peinture', check: 'Mélange les deux couleurs avec un adulte. Avais-tu raison ? Dessine ta nouvelle couleur sur la carte.',
    cardTitle: 'Recette du Gardien des Couleurs', makes: 'donnent', name: 'Mon nom', namePh: 'Écris ici', footer: 'Signé par le Gardien des Couleurs d’Harmonia. Mélange de la vraie peinture, puis dessine ta nouvelle couleur ici.', cardLabel: 'Carte-recette de couleur à imprimer',
  },
};

export default function ColorMixLabDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [left, setLeft] = useState<Primary>('red');
  const [right, setRight] = useState<Primary>('yellow');
  const [name, setName] = useState('');
  const result = mixOf(left, right);

  const picker = (side: 'first' | 'second', value: Primary, set: (p: Primary) => void) => (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">{t[side]}</p>
      <div className="flex gap-3" role="group" aria-label={t[side]}>
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={value === k}
            aria-label={t.choose(PRIMARIES[k].word[language], t[side].toLowerCase())}
            onClick={() => set(k)}
            style={{ background: PRIMARIES[k].hex }}
            className={`w-11 h-11 rounded-full border-4 grid place-items-center text-white shadow-sm transition-transform hover:scale-105 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${value === k ? 'border-gray-800' : 'border-transparent'}`}
          >
            {value === k && <Check className="w-5 h-5" aria-hidden />}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <StudioFrame emoji="🎨" hue="coral" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-7" minutes={15} bookIds={['colors-mixed-up']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {picker('first', left, setLeft)}
            {picker('second', right, setRight)}
          </div>
          <p className="mt-4 text-xs font-mono text-gray-600">
            {t.words}: {KEYS.map((k) => <span key={k} className="ml-2 bg-white rounded px-1.5 py-0.5 border border-gray-200">{PRIMARIES[k].word[language]}</span>)}
          </p>
          <StepLabel n="02">{t.step2}</StepLabel>
          <p className="text-sm text-gray-600">{t.check}</p>
        </Panel>
        <Printable label={t.cardLabel} className="text-center">
          <p className="text-sm font-bold text-gray-700 flex items-center justify-center gap-2">🎨 {t.cardTitle}</p>
          <div className="flex items-center justify-center gap-3 my-6 text-2xl text-gray-500" aria-hidden>
            <span className="w-16 h-16 rounded-[52%_48%_44%_56%/60%_54%_46%_40%] shadow-inner" style={{ background: PRIMARIES[left].hex }} />
            <span>+</span>
            <span className="w-16 h-16 rounded-[52%_48%_44%_56%/60%_54%_46%_40%] shadow-inner" style={{ background: PRIMARIES[right].hex }} />
            <span>=</span>
            <span className="w-20 h-20 rounded-[52%_48%_44%_56%/60%_54%_46%_40%] shadow-inner" style={{ background: result.hex }} />
          </div>
          <p className="text-sm text-gray-600">{PRIMARIES[left].word[language]} + {PRIMARIES[right].word[language]} {t.makes}</p>
          <p className="text-4xl font-bold capitalize mb-2" style={{ color: result.hex }}>{result.word[language]}!</p>
          <p className="text-xs text-gray-500 mb-4">EN {result.word.en} · ES {result.word.es} · FR {result.word.fr}</p>
          <div className="max-w-xs mx-auto text-left">
            <LineInput label={t.name} value={name} onChange={setName} placeholder={t.namePh} />
          </div>
          <div className="mt-4 mx-auto h-24 max-w-xs rounded-xl border-2 border-dashed border-gray-300" aria-hidden />
          <p className="mt-3 text-xs text-gray-500 flex items-center justify-center gap-1"><Sparkles className="w-3.5 h-3.5" aria-hidden /> {t.footer}</p>
          <StudioActions onReset={() => { setLeft('red'); setRight('yellow'); setName(''); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
