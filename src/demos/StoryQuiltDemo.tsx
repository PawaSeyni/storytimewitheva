// Grandparent Story Quilt (Activity Studio, priority 3). Pairs with The Fig Tree's
// Secret: Sofia nearly cuts down her grandmother's fig tree until old Mr. Costas tells
// her what it has watched for three hundred years. Interview a grandparent or family
// member, keep a phrase, a food, a place and a memory, and make a quilt square.
import { useState } from 'react';
import { MapPin, BookOpen, Check } from 'lucide-react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, LineInput } from './studio/StudioFrame';

type Field = 'phrase' | 'food' | 'place' | 'memory';
const FIELDS: Field[] = ['phrase', 'food', 'place', 'memory'];
const COLORS = ['#f39a73', '#f1c45e', '#73abc9', '#8b82bd', '#78a481'];
const EMPTY: Record<Field, string> = { phrase: '', food: '', place: '', memory: '' };

const TRANSLATIONS = {
  en: {
    skill: 'Heritage and listening', title: 'Grandparent Story Quilt', subtitle: 'Gather a family memory and turn it into a quilt square.', grownup: 'Share a memory',
    step1: 'Listen for a story', intro: 'Sofia almost cut down the fig tree before she knew its story. Invite a grandparent, a family member, or a caring grown-up to share a memory. Keep the words that feel special.',
    questions: 'Questions to ask', qs: ['What did people say in our family when you were small?', 'What food do you remember best?', 'Where did you love to be?', 'What is one small story worth keeping?'],
    labels: { phrase: 'A family phrase', food: 'A food to remember', place: 'A place', memory: 'A small memory' },
    placeholders: { phrase: 'Something someone says', food: 'A taste or a recipe', place: 'A room, a town, a garden…', memory: 'A story worth keeping' },
    color: 'Quilt color', chooseColor: (c: string) => `Choose quilt color ${c}`,
    empties: { phrase: 'our words', food: 'a favorite food', place: 'a special place', memory: 'a small memory' }, center: 'Our story', caption: 'A memory quilt square, made with love', cardLabel: 'Printable quilt square',
  },
  es: {
    skill: 'Herencia y escucha', title: 'La colcha de historias de los abuelos', subtitle: 'Recoge un recuerdo familiar y conviértelo en un cuadro de colcha.', grownup: 'Compartir un recuerdo',
    step1: 'Escucha una historia', intro: 'Sofía casi corta la higuera antes de conocer su historia. Invita a un abuelo, a alguien de la familia o a un adulto de confianza a compartir un recuerdo. Guarda las palabras que te parezcan especiales.',
    questions: 'Preguntas para hacer', qs: ['¿Qué decía la gente de nuestra familia cuando eras pequeño?', '¿Qué comida recuerdas mejor?', '¿Dónde te gustaba estar?', '¿Qué pequeña historia vale la pena guardar?'],
    labels: { phrase: 'Una frase de la familia', food: 'Una comida para recordar', place: 'Un lugar', memory: 'Un pequeño recuerdo' },
    placeholders: { phrase: 'Algo que alguien dice', food: 'Un sabor o una receta', place: 'Una habitación, un pueblo, un jardín…', memory: 'Una historia que vale la pena guardar' },
    color: 'Color de la colcha', chooseColor: (c: string) => `Elegir el color de colcha ${c}`,
    empties: { phrase: 'nuestras palabras', food: 'una comida favorita', place: 'un lugar especial', memory: 'un pequeño recuerdo' }, center: 'Nuestra historia', caption: 'Un cuadro de colcha de recuerdos, hecho con cariño', cardLabel: 'Cuadro de colcha imprimible',
  },
  fr: {
    skill: 'Héritage et écoute', title: 'La courtepointe des histoires de grands-parents', subtitle: 'Recueille un souvenir de famille et transforme-le en carré de courtepointe.', grownup: 'Partager un souvenir',
    step1: 'Écoute une histoire', intro: 'Sofia a failli couper le figuier avant de connaître son histoire. Invite un grand-parent, quelqu’un de la famille ou un adulte bienveillant à partager un souvenir. Garde les mots qui te semblent précieux.',
    questions: 'Questions à poser', qs: ['Que disait-on dans notre famille quand tu étais petit ?', 'Quel plat te rappelles-tu le mieux ?', 'Où aimais-tu être ?', 'Quelle petite histoire mérite d’être gardée ?'],
    labels: { phrase: 'Une phrase de famille', food: 'Un plat à retenir', place: 'Un lieu', memory: 'Un petit souvenir' },
    placeholders: { phrase: 'Quelque chose que quelqu’un dit', food: 'Un goût ou une recette', place: 'Une pièce, une ville, un jardin…', memory: 'Une histoire à garder' },
    color: 'Couleur de la courtepointe', chooseColor: (c: string) => `Choisir la couleur ${c}`,
    empties: { phrase: 'nos mots', food: 'un plat préféré', place: 'un lieu spécial', memory: 'un petit souvenir' }, center: 'Notre histoire', caption: 'Un carré de courtepointe de souvenirs, fait avec amour', cardLabel: 'Carré de courtepointe à imprimer',
  },
};

export default function StoryQuiltDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [story, setStory] = useState<Record<Field, string>>(EMPTY);
  const [color, setColor] = useState(COLORS[0]);
  const mix = (pct: number, base: string) => `color-mix(in srgb, ${color} ${pct}%, ${base})`;

  return (
    <StudioFrame emoji="🧵" hue="sage" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={20} bookIds={['fig-trees-secret']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Panel className="bg-amber-50">
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">{t.questions}</p>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mb-4">{t.qs.map((q) => <li key={q}>{q}</li>)}</ul>
          <div className="grid gap-3">
            {FIELDS.map((f) => <LineInput key={f} label={t.labels[f]} value={story[f]} onChange={(v) => setStory({ ...story, [f]: v })} placeholder={t.placeholders[f]} />)}
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-4 mb-2">{t.color}</p>
          <div className="flex gap-2" role="group" aria-label={t.color}>
            {COLORS.map((c) => (
              <button key={c} type="button" aria-pressed={color === c} aria-label={t.chooseColor(c)} onClick={() => setColor(c)} style={{ background: c }} className={`w-10 h-10 rounded-full border-4 grid place-items-center text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${color === c ? 'border-gray-800' : 'border-transparent'}`}>
                {color === c && <Check className="w-4 h-4" aria-hidden />}
              </button>
            ))}
          </div>
        </Panel>
        <Printable label={t.cardLabel} className="flex flex-col items-center">
          <div className="relative grid grid-cols-2 w-full max-w-sm aspect-square overflow-hidden rounded-md border-8 border-emerald-900 outline-4 outline-dashed outline-amber-300 outline-offset-4 shadow-md text-emerald-950 text-center font-bold">
            <div className="grid place-items-center p-4 min-w-0" style={{ background: mix(60, '#f7d06c') }}><span className="break-words">“{story.phrase || t.empties.phrase}”</span></div>
            <div className="grid place-items-center p-4 min-w-0" style={{ background: mix(41, '#edf1d5') }}><span className="break-words">{story.food || t.empties.food}</span></div>
            <div className="grid place-items-center p-4 min-w-0" style={{ background: mix(68, '#d6edf2') }}><span className="break-words"><MapPin className="w-5 h-5 mx-auto mb-1" aria-hidden />{story.place || t.empties.place}</span></div>
            <div className="grid place-items-center p-4 min-w-0" style={{ background: mix(53, '#f4c7a4') }}><span className="break-words"><BookOpen className="w-5 h-5 mx-auto mb-1" aria-hidden />{story.memory || t.empties.memory}</span></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-amber-200 bg-emerald-800 text-amber-50 grid place-items-center text-sm leading-tight">{t.center}</div>
          </div>
          <p className="mt-4 text-xs font-mono uppercase tracking-wider text-gray-500">{t.caption}</p>
          <StudioActions onReset={() => { setStory(EMPTY); setColor(COLORS[0]); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
