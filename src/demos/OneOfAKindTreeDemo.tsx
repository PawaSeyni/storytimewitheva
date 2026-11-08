// My One-of-a-Kind Tree (Activity Studio). Pairs with The Crooked Little Apple Tree:
// the orchard wants only straight, perfect trees, and the crooked little tree at the edge
// is overlooked for years, until the year someone really looks. Pick a trunk shape, then
// grow apples that each say "I am special because…".
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type Shape = 'straight' | 'crooked' | 'twisty' | 'leaning';
const SHAPES: Shape[] = ['straight', 'crooked', 'twisty', 'leaning'];
const TRUNKS: Record<Shape, { d: string; cx: number; cy: number }> = {
  straight: { d: 'M100 212 L100 112', cx: 100, cy: 82 },
  crooked: { d: 'M100 212 L100 172 L124 146 L96 116', cx: 96, cy: 86 },
  twisty: { d: 'M100 212 C70 188 130 160 100 138 S78 112 102 104', cx: 102, cy: 78 },
  leaning: { d: 'M86 212 Q100 160 136 116', cx: 136, cy: 86 },
};
const APPLE_SPOTS = [[-28, -20], [22, -28], [32, 10], [-24, 18], [0, -2]];
const EMPTY_LEAVES = ['', '', '', '', ''];

const TRANSLATIONS = {
  en: {
    skill: 'Self-worth', title: 'My One-of-a-Kind Tree', subtitle: 'Grow a tree that is shaped just like you, and fill it with what makes you special.', grownup: 'Really look, and name what you see',
    step1: 'Choose your trunk', intro: 'The orchard wanted only straight, perfect trees. The crooked little apple tree at the edge was overlooked for years, until the year someone really looked. Every shape is a good tree. Which one feels like you?',
    shapes: { straight: 'Straight', crooked: 'Crooked', twisty: 'Twisty', leaning: 'Leaning' },
    cheers: { straight: 'A straight tree, standing tall in its own way.', crooked: 'A crooked tree, like the little apple tree in the story.', twisty: 'A twisty tree, full of turns and surprises.', leaning: 'A leaning tree, reaching toward the light.' },
    step2: 'Grow your apples', intro2: 'Finish the sentence up to five times. Each answer becomes an apple on your tree.',
    leaf: (n: number) => `Apple ${n}: I am special because…`, leafPh: 'I am special because…',
    treeName: 'Name your tree (optional)', treeNamePh: 'For example: Brave Branches',
    defaultName: 'My one-of-a-kind tree', because: 'I am special because…', noLeaves: 'Your apples will grow here.',
    svgLabel: (shape: string, n: number) => `A ${shape.toLowerCase()} tree with ${n} ${n === 1 ? 'apple' : 'apples'}`,
    theme: 'Worth is seen when someone really looks.', tip: 'In class, put all the trees together to make an orchard wall: no two trees are the same.',
    adult: 'For the grown-up: really look at your child, and name one thing you see that makes them special.', cardLabel: 'Printable one-of-a-kind tree',
  },
  es: {
    skill: 'Autoestima', title: 'Mi árbol único', subtitle: 'Haz crecer un árbol con tu propia forma y llénalo con lo que te hace especial.', grownup: 'Mirar de verdad y nombrar lo que ves',
    step1: 'Elige tu tronco', intro: 'En el huerto solo querían árboles rectos y perfectos. Al pequeño manzano torcido del borde llevaban años sin verlo, hasta el año en que alguien lo miró de verdad. Todas las formas son un buen árbol. ¿Cuál se parece a ti?',
    shapes: { straight: 'Recto', crooked: 'Torcido', twisty: 'Retorcido', leaning: 'Inclinado' },
    cheers: { straight: 'Un árbol recto, bien alto a su manera.', crooked: 'Un árbol torcido, como el pequeño manzano del cuento.', twisty: 'Un árbol retorcido, lleno de vueltas y sorpresas.', leaning: 'Un árbol inclinado, que se estira hacia la luz.' },
    step2: 'Haz crecer tus manzanas', intro2: 'Completa la frase hasta cinco veces. Cada respuesta se convierte en una manzana de tu árbol.',
    leaf: (n: number) => `Manzana ${n}: soy especial porque…`, leafPh: 'Soy especial porque…',
    treeName: 'Ponle nombre a tu árbol (opcional)', treeNamePh: 'Por ejemplo: Ramas valientes',
    defaultName: 'Mi árbol único', because: 'Soy especial porque…', noLeaves: 'Aquí crecerán tus manzanas.',
    svgLabel: (shape: string, n: number) => `Un árbol ${shape.toLowerCase()} con ${n} ${n === 1 ? 'manzana' : 'manzanas'}`,
    theme: 'El valor se ve cuando alguien mira de verdad.', tip: 'En clase, juntad todos los árboles para hacer un mural del huerto: no hay dos árboles iguales.',
    adult: 'Para el adulto: mira de verdad a tu niño o niña y nombra una cosa que ves que lo hace especial.', cardLabel: 'Árbol único imprimible',
  },
  fr: {
    skill: 'Estime de soi', title: 'Mon arbre unique', subtitle: 'Fais pousser un arbre qui a ta forme à toi, et remplis-le de ce qui te rend spécial.', grownup: 'Regarder vraiment, et nommer ce qu’on voit',
    step1: 'Choisis ton tronc', intro: 'Le verger ne voulait que des arbres droits et parfaits. Le petit pommier tordu au bord est resté invisible pendant des années, jusqu’à l’année où quelqu’un l’a vraiment regardé. Toutes les formes font un bel arbre. Laquelle te ressemble ?',
    shapes: { straight: 'Droit', crooked: 'Tordu', twisty: 'Tortillé', leaning: 'Penché' },
    cheers: { straight: 'Un arbre droit, bien grand à sa façon.', crooked: 'Un arbre tordu, comme le petit pommier de l’histoire.', twisty: 'Un arbre tortillé, plein de virages et de surprises.', leaning: 'Un arbre penché, qui s’étire vers la lumière.' },
    step2: 'Fais pousser tes pommes', intro2: 'Termine la phrase jusqu’à cinq fois. Chaque réponse devient une pomme sur ton arbre.',
    leaf: (n: number) => `Pomme ${n} : je suis unique parce que…`, leafPh: 'Je suis unique parce que…',
    treeName: 'Donne un nom à ton arbre (facultatif)', treeNamePh: 'Par exemple : Branches courageuses',
    defaultName: 'Mon arbre unique', because: 'Je suis unique parce que…', noLeaves: 'Tes pommes pousseront ici.',
    svgLabel: (shape: string, n: number) => `Un arbre ${shape.toLowerCase()} avec ${n} ${n === 1 ? 'pomme' : 'pommes'}`,
    theme: 'La valeur se voit quand quelqu’un regarde vraiment.', tip: 'En classe, rassemblez tous les arbres pour faire un mur-verger : il n’y a pas deux arbres pareils.',
    adult: 'Pour l’adulte : regarde vraiment ton enfant, et nomme une chose que tu vois qui le rend spécial.', cardLabel: 'Arbre unique à imprimer',
  },
};

export default function OneOfAKindTreeDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [shape, setShape] = useState<Shape>('crooked');
  const [leaves, setLeaves] = useState<string[]>(EMPTY_LEAVES);
  const [treeName, setTreeName] = useState('');
  const filled = leaves.map((text, i) => ({ text: text.trim(), n: i + 1 })).filter((l) => l.text);
  const trunk = TRUNKS[shape];
  const reset = () => { setShape('crooked'); setLeaves(EMPTY_LEAVES); setTreeName(''); };

  return (
    <StudioFrame emoji="🍎" hue="sage" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-8" minutes={12} bookIds={['crooked-little-apple-tree']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel className="bg-emerald-50">
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro}</p>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label={t.step1}>
            {SHAPES.map((s) => (
              <Choice key={s} selected={shape === s} onSelect={() => setShape(s)} className="flex items-center gap-2 font-semibold">
                <svg viewBox="60 100 100 120" className="w-6 h-8 shrink-0" aria-hidden>
                  <path d={TRUNKS[s].d} fill="none" stroke="#7c4a24" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.shapes[s]}
              </Choice>
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold text-emerald-900" aria-live="polite">{t.cheers[shape]}</p>
          <div className="mt-6"><StepLabel n="02">{t.step2}</StepLabel></div>
          <p className="text-sm text-gray-600 mb-3">{t.intro2}</p>
          <div className="grid gap-3">
            {leaves.map((v, i) => (
              <LineInput key={i} label={t.leaf(i + 1)} value={v} placeholder={t.leafPh} onChange={(nv) => setLeaves(leaves.map((l, j) => (j === i ? nv : l)))} />
            ))}
            <LineInput label={t.treeName} value={treeName} onChange={setTreeName} placeholder={t.treeNamePh} />
          </div>
        </Panel>
        <Printable label={t.cardLabel}>
          <h4 className="text-center text-2xl font-bold text-emerald-900 break-words">{treeName.trim() || t.defaultName}</h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr] items-center">
            <svg viewBox="0 0 220 220" className="w-full max-w-xs mx-auto" role="img" aria-label={t.svgLabel(t.shapes[shape], filled.length)}>
              <ellipse cx="100" cy="212" rx="60" ry="6" fill="#d9e8c9" />
              <path d={trunk.d} fill="none" stroke="#7c4a24" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={trunk.cx} cy={trunk.cy} r="58" fill="#7fb77e" stroke="#3f7a45" strokeWidth={3} />
              {filled.map((l) => {
                const [dx, dy] = APPLE_SPOTS[l.n - 1];
                return (
                  <g key={l.n}>
                    <circle cx={trunk.cx + dx} cy={trunk.cy + dy} r="12" fill="#e2493b" stroke="#8f2219" strokeWidth={2} />
                    <text x={trunk.cx + dx} y={trunk.cy + dy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">{l.n}</text>
                  </g>
                );
              })}
            </svg>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-800">{t.because}</p>
              {filled.length === 0 ? <p className="mt-2 text-sm italic text-gray-500">{t.noLeaves}</p> : (
                <ol className="mt-2 grid gap-2">
                  {filled.map((l) => (
                    <li key={l.n} className="flex items-start gap-2">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold grid place-items-center print:border print:border-black">{l.n}</span>
                      <span className="break-words text-gray-900 font-semibold pt-0.5">{l.text}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
          <p className="mt-5 text-center text-sm italic text-gray-700">{t.theme}</p>
          <p className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-gray-700">{t.tip}</p>
          <p className="mt-3 text-sm text-gray-600 print:hidden">{t.adult}</p>
          <StudioActions onReset={reset} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
