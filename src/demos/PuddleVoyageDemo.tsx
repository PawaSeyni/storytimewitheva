// Puddle Voyage (Activity Studio). Pairs with A Little Boat's Big Wish: a small yellow
// wooden boat dreams of the ocean, then a boy carries him out to a sparkling puddle where
// he meets a frog, a turtle, a goldfish and a duckling. Put the friends in order, run a
// float-or-sink test with a grown-up, and take home a record sheet and paper boat steps.
import { useState } from 'react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions } from './studio/StudioFrame';

type Word = Record<Language, string>;
type FS = 'float' | 'sink';

const FRIENDS: { id: string; emoji: string; name: Word }[] = [
  { id: 'frog', emoji: '🐸', name: { en: 'Frog', es: 'Rana', fr: 'Grenouille' } },
  { id: 'turtle', emoji: '🐢', name: { en: 'Turtle', es: 'Tortuga', fr: 'Tortue' } },
  { id: 'goldfish', emoji: '🐠', name: { en: 'Goldfish', es: 'Pez dorado', fr: 'Poisson rouge' } },
  { id: 'duckling', emoji: '🐥', name: { en: 'Duckling', es: 'Patito', fr: 'Caneton' } },
];
const STORY_ORDER = FRIENDS.map((f) => f.id);
// Fixed shuffle so the page renders the same on the server and in the browser.
const SHUFFLED = ['goldfish', 'frog', 'duckling', 'turtle'].map((id) => FRIENDS.find((f) => f.id === id)!);

const OBJECTS: { id: string; emoji: string; name: Word }[] = [
  { id: 'cork', emoji: '🍾', name: { en: 'Cork', es: 'Corcho', fr: 'Bouchon en liège' } },
  { id: 'coin', emoji: '🪙', name: { en: 'Coin', es: 'Moneda', fr: 'Pièce' } },
  { id: 'leaf', emoji: '🍃', name: { en: 'Leaf', es: 'Hoja', fr: 'Feuille' } },
  { id: 'spoon', emoji: '🥄', name: { en: 'Metal spoon', es: 'Cuchara de metal', fr: 'Cuillère en métal' } },
  { id: 'toy', emoji: '🧩', name: { en: 'Plastic toy', es: 'Juguete de plástico', fr: 'Jouet en plastique' } },
  { id: 'pebble', emoji: '🪨', name: { en: 'Pebble', es: 'Piedrita', fr: 'Caillou' } },
];

const TRANSLATIONS = {
  en: {
    skill: 'Sequencing and early science', title: 'Puddle Voyage', subtitle: 'Remember who the little boat met, then test what floats and what sinks.', grownup: 'Run the water test',
    step1: 'Who did the little boat meet?', intro1: 'In the sparkling puddle, the little yellow boat met four new friends. Tap them in the order he met them. A grown-up can read the names aloud.',
    order: 'Your order:', none: 'Tap the first friend.', right: 'Yes! Frog, turtle, goldfish, duckling. What a voyage!', wrong: 'Hmm, not quite that order. Want to look at the book again and try once more?', tryAgain: 'Try again',
    step2: 'Float or sink?', intro2: 'First guess. Then, with a grown-up, gently drop each thing into a bowl of water and record what really happens.',
    guess: 'My guess', happened: 'What happened', float: 'Float', sink: 'Sink',
    tally: (m: number, n: number) => `You predicted ${m} of ${n}. Surprises are how scientists learn!`, tallyEmpty: 'Make a guess and try it in the water to see your score.',
    sheet: 'My float or sink record', thing: 'Object', boatTitle: 'Fold a paper boat',
    boat: ['Start with a rectangle of paper and fold it in half, top to bottom.', 'Fold the two top corners down to the middle to make a triangle.', 'Fold the bottom strips up, one on each side.', 'Open it into a square and flatten it into a diamond.', 'Gently pull the sides apart to make a boat.'],
    safety: 'Water play always with a grown-up.', cardLabel: 'Printable float or sink record sheet',
  },
  es: {
    skill: 'Secuencias y primeras ciencias', title: 'Viaje por el charco', subtitle: 'Recuerda a quién conoció el barquito y luego descubre qué flota y qué se hunde.', grownup: 'Dirigir la prueba con agua',
    step1: '¿A quién conoció el barquito?', intro1: 'En el charco brillante, el barquito amarillo conoció a cuatro nuevos amigos. Tócalos en el orden en que los conoció. Un adulto puede leer los nombres en voz alta.',
    order: 'Tu orden:', none: 'Toca al primer amigo.', right: '¡Sí! Rana, tortuga, pez dorado, patito. ¡Qué viaje!', wrong: 'Mmm, ese no es el orden. ¿Miramos el libro otra vez y lo intentas de nuevo?', tryAgain: 'Intentar otra vez',
    step2: '¿Flota o se hunde?', intro2: 'Primero adivina. Luego, con un adulto, deja caer cada cosa con cuidado en un tazón con agua y anota lo que pasa de verdad.',
    guess: 'Mi idea', happened: 'Lo que pasó', float: 'Flota', sink: 'Se hunde',
    tally: (m: number, n: number) => `Acertaste ${m} de ${n}. ¡Las sorpresas son la forma en que aprenden los científicos!`, tallyEmpty: 'Adivina y pruébalo en el agua para ver tu resultado.',
    sheet: 'Mi registro: ¿flota o se hunde?', thing: 'Objeto', boatTitle: 'Dobla un barco de papel',
    boat: ['Toma un rectángulo de papel y dóblalo por la mitad, de arriba abajo.', 'Dobla las dos esquinas de arriba hacia el centro para formar un triángulo.', 'Dobla hacia arriba las tiras de abajo, una de cada lado.', 'Ábrelo en forma de cuadrado y aplánalo como un rombo.', 'Separa los lados con cuidado para formar un barco.'],
    safety: 'Jugar con agua, siempre con un adulto.', cardLabel: 'Hoja imprimible: ¿flota o se hunde?',
  },
  fr: {
    skill: 'Ordre des événements et premières sciences', title: 'Voyage dans la flaque', subtitle: 'Souviens-toi de qui le petit bateau a rencontré, puis découvre ce qui flotte et ce qui coule.', grownup: 'Mener le test de l’eau',
    step1: 'Qui le petit bateau a-t-il rencontré ?', intro1: 'Dans la flaque scintillante, le petit bateau jaune a rencontré quatre nouveaux amis. Touche-les dans l’ordre où il les a rencontrés. Un adulte peut lire les noms à voix haute.',
    order: 'Ton ordre :', none: 'Touche le premier ami.', right: 'Oui ! Grenouille, tortue, poisson rouge, caneton. Quel voyage !', wrong: 'Hum, ce n’est pas tout à fait cet ordre. On regarde le livre encore une fois et tu réessaies ?', tryAgain: 'Réessayer',
    step2: 'Flotte ou coule ?', intro2: 'D’abord, devine. Puis, avec un adulte, pose doucement chaque objet dans un bol d’eau et note ce qui se passe vraiment.',
    guess: 'Mon idée', happened: 'Ce qui s’est passé', float: 'Flotte', sink: 'Coule',
    tally: (m: number, n: number) => `Tu as deviné juste ${m} fois sur ${n}. Les surprises, c’est comme ça que les scientifiques apprennent !`, tallyEmpty: 'Devine, puis essaie dans l’eau pour voir ton score.',
    sheet: 'Mon relevé : flotte ou coule ?', thing: 'Objet', boatTitle: 'Plie un bateau en papier',
    boat: ['Prends un rectangle de papier et plie-le en deux, de haut en bas.', 'Rabats les deux coins du haut vers le milieu pour faire un triangle.', 'Replie les bandes du bas vers le haut, une de chaque côté.', 'Ouvre-le en carré et aplatis-le en losange.', 'Écarte doucement les côtés pour faire un bateau.'],
    safety: 'Les jeux d’eau, toujours avec un adulte.', cardLabel: 'Relevé « flotte ou coule » à imprimer',
  },
};

type Record2 = Partial<Record<string, FS>>;

export default function PuddleVoyageDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [picks, setPicks] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Record2>({});
  const [results, setResults] = useState<Record2>({});

  const complete = picks.length === FRIENDS.length;
  const correct = complete && picks.every((id, i) => id === STORY_ORDER[i]);
  const tested = OBJECTS.filter((o) => guesses[o.id] && results[o.id]);
  const matches = tested.filter((o) => guesses[o.id] === results[o.id]).length;
  const word = (v: FS | undefined) => (v ? t[v] : '');

  const fsButtons = (value: FS | undefined, set: (v: FS) => void, group: string, objName: string) => (
    <div className="flex gap-1" role="group" aria-label={`${objName}: ${group}`}>
      {(['float', 'sink'] as FS[]).map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => set(v)}
          className={`rounded-lg border-2 px-2 py-1 text-xs font-semibold focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${value === v ? 'border-blue-600 bg-blue-100 text-blue-900' : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'}`}
        >
          {value === v && <span aria-hidden>✓ </span>}{v === 'float' ? '🛟' : '⬇️'} {t[v]}
        </button>
      ))}
    </div>
  );

  return (
    <StudioFrame emoji="⛵" hue="blue" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="3-7" minutes={15} bookIds={['little-boats-big-wish']} grownup={t.grownup}>
      <div className="grid gap-6">
        <Panel className="bg-blue-50">
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro1}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SHUFFLED.map((f) => {
              const pos = picks.indexOf(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={pos >= 0}
                  disabled={pos >= 0 || complete}
                  onClick={() => setPicks([...picks, f.id])}
                  className={`relative rounded-2xl border-2 p-3 min-h-24 flex flex-col items-center justify-center gap-1 font-semibold focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${pos >= 0 ? 'border-blue-500 bg-blue-100 text-blue-900' : 'border-blue-200 bg-white text-gray-800 hover:border-blue-400'}`}
                >
                  {pos >= 0 && <span className="absolute top-1 left-2 text-sm font-bold">{pos + 1}</span>}
                  <span className="text-4xl" aria-hidden>{f.emoji}</span>
                  <span>{f.name[language]}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-gray-700">
            <strong>{t.order}</strong> <span aria-hidden>⛵ </span>
            {picks.length ? picks.map((id) => FRIENDS.find((f) => f.id === id)!.name[language]).join(' → ') : t.none}
          </p>
          <p role="status" className="mt-2 min-h-6 font-semibold text-gray-800">{complete ? (correct ? `🎉 ${t.right}` : t.wrong) : ''}</p>
          {picks.length > 0 && !correct && (
            <button type="button" onClick={() => setPicks([])} className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-blue-300 text-blue-800 font-semibold hover:bg-blue-100">{t.tryAgain}</button>
          )}
        </Panel>

        <Panel className="bg-cyan-50">
          <StepLabel n="02">{t.step2}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro2}</p>
          <ul className="grid gap-2">
            {OBJECTS.map((o) => (
              <li key={o.id} className="grid sm:grid-cols-[1fr_auto_auto] items-center gap-2 rounded-xl bg-white border border-cyan-200 p-2">
                <span className="font-semibold text-gray-800"><span aria-hidden className="text-2xl mr-2">{o.emoji}</span>{o.name[language]}</span>
                <span className="text-xs text-gray-600 flex items-center gap-2">{t.guess} {fsButtons(guesses[o.id], (v) => setGuesses({ ...guesses, [o.id]: v }), t.guess, o.name[language])}</span>
                <span className="text-xs text-gray-600 flex items-center gap-2">{t.happened} {fsButtons(results[o.id], (v) => setResults({ ...results, [o.id]: v }), t.happened, o.name[language])}</span>
              </li>
            ))}
          </ul>
          <p role="status" className="mt-3 font-semibold text-gray-800">{tested.length ? t.tally(matches, tested.length) : t.tallyEmpty}</p>
        </Panel>

        <Printable label={t.cardLabel}>
          <p className="text-xl font-bold text-gray-800 flex items-center gap-2"><span aria-hidden>⛵</span> {t.sheet}</p>
          <table className="mt-3 w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-gray-700">
                <th scope="col" className="border-b-2 border-blue-200 py-1">{t.thing}</th>
                <th scope="col" className="border-b-2 border-blue-200 py-1">{t.guess}</th>
                <th scope="col" className="border-b-2 border-blue-200 py-1">{t.happened}</th>
              </tr>
            </thead>
            <tbody>
              {OBJECTS.map((o) => (
                <tr key={o.id} className="text-gray-800">
                  <td className="border-b border-gray-200 py-2"><span aria-hidden>{o.emoji} </span>{o.name[language]}</td>
                  <td className="border-b border-gray-200 py-2">{word(guesses[o.id]) || '__________'}</td>
                  <td className="border-b border-gray-200 py-2">{word(results[o.id]) || '__________'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="mt-5 font-bold text-gray-800">{t.boatTitle}</h3>
          <ol className="mt-2 list-decimal pl-5 grid gap-1 text-sm text-gray-700">
            {t.boat.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <p className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-3 text-sm font-semibold text-gray-800"><span aria-hidden>💧 </span>{t.safety}</p>
          <StudioActions onReset={() => { setPicks([]); setGuesses({}); setResults({}); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
