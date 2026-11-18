// Collection Story Dice (Activity Studio; activities audit 2026-11, §5c item 3). Three dice,
// a character, a setting and a problem, whose faces all come from the twenty books of the
// collection (src/data/storyDice.data.ts, each face taken from the book's own description).
// Roll, lock a face you like and roll the rest, then tell, write or draw a story that mixes
// the three books, and print a story-starter card. Rolls are seeded by the roll count, so the
// first render is the same on the server and in the browser and a reload shows the same dice.
// Little readers can skip the writing: the read-aloud button says the three faces as one
// sentence. Nothing is stored.
import { useState } from 'react';
import { Dices, Lock, LockOpen } from 'lucide-react';
import { Link } from '../components/LocalizedLink';
import ReadAloudButton from '../components/ReadAloudButton';
import { useBooks, isComingSoon } from '../data/books';
import { storyDice, storyDiceEmoji, type DiceFaces } from '../data/storyDice.data';
import { useLanguage, useTranslation } from '../lib/language';
import { seeded } from '../lib/seeded';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type Die = keyof DiceFaces;
type Mode = 'tell' | 'write' | 'draw';
const DICE: Die[] = ['character', 'setting', 'problem'];
const MODES: { id: Mode; icon: string }[] = [{ id: 'tell', icon: '🗣️' }, { id: 'write', icon: '✍️' }, { id: 'draw', icon: '🖍️' }];
const PARTS = ['beginning', 'middle', 'end'] as const;
const DIE_ICON: Record<Die, string> = { character: '🎭', setting: '🗺️', problem: '⚡' };

const TRANSLATIONS = {
  en: {
    skill: 'Imagination and storytelling', title: 'Collection Story Dice', subtitle: 'Roll a character, a setting and a problem from three different books, then mix them into a story of your own.', grownup: 'Listen, or write down what your child tells',
    step1: 'Roll the dice', intro: 'Every face comes from a book in the collection. Roll all three, or lock a face you like and roll the others again.',
    roll: 'Roll the dice', rolled: (n: number) => (n === 0 ? 'Your first three faces are ready.' : n === 1 ? 'Rolled once.' : `Rolled ${n} times.`),
    dice: { character: 'Character', setting: 'Setting', problem: 'Problem' }, from: 'from', lock: (d: string) => `Keep this ${d.toLowerCase()}`, unlock: (d: string) => `Let this ${d.toLowerCase()} roll again`, locked: 'kept',
    sentence: (c: string, s: string, p: string) => `A story about ${c}, in ${s}, when ${p}.`, listen: 'Listen to the story starter',
    step2: 'Tell it, write it or draw it', intro2: 'How will you make your story? Little readers can tell it aloud. Writers can fill in three lines. Artists can draw it on the card.',
    modes: { tell: 'Tell it', write: 'Write it', draw: 'Draw it' },
    parts: { beginning: 'Beginning', middle: 'Middle', end: 'End' }, partPh: { beginning: 'One day…', middle: 'But then…', end: 'In the end…' },
    tellTip: 'Say your story to a grown-up. Start with “Once upon a time”, and use all three faces.', drawTip: 'Print the card and draw your story in the big box.',
    cardLabel: 'Printable story-starter card', card: 'My Story Starter', name: 'Name:', books: 'Books in my story:', draw: 'Draw your story here', blank: '______________________________',
  },
  es: {
    skill: 'Imaginación y cuentos', title: 'Dados de cuentos de la colección', subtitle: 'Lanza un personaje, un lugar y un problema de tres libros distintos y mézclalos en un cuento tuyo.', grownup: 'Escuchar, o anotar lo que cuenta tu peque',
    step1: 'Lanza los dados', intro: 'Cada cara viene de un libro de la colección. Lanza los tres, o guarda una cara que te guste y vuelve a lanzar las otras.',
    roll: 'Lanzar los dados', rolled: (n: number) => (n === 0 ? 'Tus tres primeras caras están listas.' : n === 1 ? 'Una tirada.' : `${n} tiradas.`),
    dice: { character: 'Personaje', setting: 'Lugar', problem: 'Problema' }, from: 'de', lock: (d: string) => `Guardar este ${d.toLowerCase()}`, unlock: (d: string) => `Volver a lanzar este ${d.toLowerCase()}`, locked: 'guardado',
    sentence: (c: string, s: string, p: string) => `Un cuento sobre ${c}, en ${s}, cuando ${p}.`, listen: 'Escuchar el comienzo del cuento',
    step2: 'Cuéntalo, escríbelo o dibújalo', intro2: '¿Cómo harás tu cuento? Quien aún no escribe puede contarlo en voz alta. Quien escribe puede llenar tres líneas. Quien dibuja puede dibujarlo en la tarjeta.',
    modes: { tell: 'Contarlo', write: 'Escribirlo', draw: 'Dibujarlo' },
    parts: { beginning: 'Principio', middle: 'Medio', end: 'Final' }, partPh: { beginning: 'Un día…', middle: 'Pero entonces…', end: 'Al final…' },
    tellTip: 'Cuenta tu cuento a un adulto. Empieza con «Había una vez» y usa las tres caras.', drawTip: 'Imprime la tarjeta y dibuja tu cuento en el recuadro grande.',
    cardLabel: 'Tarjeta para empezar un cuento, imprimible', card: 'Mi comienzo de cuento', name: 'Nombre:', books: 'Libros de mi cuento:', draw: 'Dibuja tu cuento aquí', blank: '______________________________',
  },
  fr: {
    skill: 'Imagination et récit', title: 'Dés à histoires de la collection', subtitle: 'Lance un personnage, un lieu et un problème venus de trois livres différents, puis mélange-les dans une histoire à toi.', grownup: 'Écouter, ou noter ce que raconte votre enfant',
    step1: 'Lance les dés', intro: 'Chaque face vient d’un livre de la collection. Lance les trois, ou garde une face qui te plaît et relance les autres.',
    roll: 'Lancer les dés', rolled: (n: number) => (n === 0 ? 'Tes trois premières faces sont prêtes.' : n === 1 ? 'Un lancer.' : `${n} lancers.`),
    dice: { character: 'Personnage', setting: 'Lieu', problem: 'Problème' }, from: 'tiré de', lock: (d: string) => `Garder ce ${d.toLowerCase()}`, unlock: (d: string) => `Relancer ce ${d.toLowerCase()}`, locked: 'gardé',
    sentence: (c: string, s: string, p: string) => `Une histoire sur ${c}, dans ${s}, quand ${p}.`, listen: 'Écouter le début de l’histoire',
    step2: 'Raconte-la, écris-la ou dessine-la', intro2: 'Comment vas-tu faire ton histoire ? Les petits peuvent la raconter à voix haute. Ceux qui écrivent peuvent remplir trois lignes. Ceux qui dessinent peuvent la dessiner sur la carte.',
    modes: { tell: 'La raconter', write: 'L’écrire', draw: 'La dessiner' },
    parts: { beginning: 'Début', middle: 'Milieu', end: 'Fin' }, partPh: { beginning: 'Un jour…', middle: 'Mais alors…', end: 'À la fin…' },
    tellTip: 'Raconte ton histoire à un adulte. Commence par « Il était une fois » et utilise les trois faces.', drawTip: 'Imprime la carte et dessine ton histoire dans le grand cadre.',
    cardLabel: 'Carte de départ d’histoire à imprimer', card: 'Mon début d’histoire', name: 'Prénom :', books: 'Les livres de mon histoire :', draw: 'Dessine ton histoire ici', blank: '______________________________',
  },
};

/**
 * Pick the three faces for roll number `n`: one book index per die, all three from different
 * books, and a die that is not locked never lands on the book it already shows. Seeded by the
 * roll count, so roll 0 (the first render) is identical on the server and in the browser.
 */
function rollFaces(n: number, count: number, current: number[], locked: boolean[]): number[] {
  const rnd = seeded(`story-dice:${n}`);
  const next = [...current];
  for (let d = 0; d < DICE.length; d++) {
    if (locked[d] && n > 0) continue;
    const taken = new Set(next.filter((_, i) => i !== d && (locked[i] || i < d)));
    const options = Array.from({ length: count }, (_, i) => i).filter((i) => !taken.has(i) && (n === 0 || i !== current[d]));
    next[d] = options[Math.floor(rnd() * options.length)] ?? 0;
  }
  return next;
}

export default function StoryDiceDemo() {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const books = useBooks().filter((b) => !isComingSoon(b) && storyDice[b.id]);
  const [rolls, setRolls] = useState(0);
  const [faces, setFaces] = useState(() => rollFaces(0, books.length, [0, 0, 0], [false, false, false]));
  const [locked, setLocked] = useState([false, false, false]);
  const [mode, setMode] = useState<Mode>('tell');
  const [lines, setLines] = useState<Record<(typeof PARTS)[number], string>>({ beginning: '', middle: '', end: '' });

  const roll = () => {
    const n = rolls + 1;
    setRolls(n);
    setFaces(rollFaces(n, books.length, faces, locked));
  };
  const reset = () => {
    setRolls(0); setLocked([false, false, false]); setMode('tell'); setLines({ beginning: '', middle: '', end: '' });
    setFaces(rollFaces(0, books.length, [0, 0, 0], [false, false, false]));
  };
  const shown = DICE.map((die, i) => {
    const book = books[faces[i]] ?? books[0];
    return { die, book, text: storyDice[book.id][die][language], emoji: die === 'character' ? storyDiceEmoji[book.id] : DIE_ICON[die] };
  });
  const sentence = t.sentence(shown[0].text, shown[1].text, shown[2].text);
  const bookList = Array.from(new Map(shown.map((s) => [s.book.id, s.book])).values());

  return (
    <StudioFrame emoji="🎲" hue="gold" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={15} bookIds={[]} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 content-start">
          <Panel>
            <StepLabel n="01">{t.step1}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
            <ul className="grid gap-3 sm:grid-cols-3">
              {shown.map((s, i) => (
                <li key={s.die} data-die={s.die} data-die-book={s.book.id} className={`rounded-2xl border-2 bg-white p-3 flex flex-col gap-2 ${locked[i] ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{t.dice[s.die]}</p>
                  <p className="text-4xl text-center" aria-hidden>{s.emoji}</p>
                  <p className="text-center font-semibold text-gray-900 min-h-12" lang={language} data-die-face>{s.text}</p>
                  <p className="text-xs text-gray-600 text-center">
                    {t.from} <Link to={`/books/${s.book.id}`} className="underline decoration-dotted underline-offset-2 hover:text-purple-700">{s.book.title}</Link>
                  </p>
                  <button
                    type="button"
                    aria-pressed={locked[i]}
                    aria-label={locked[i] ? t.unlock(t.dice[s.die]) : t.lock(t.dice[s.die])}
                    data-die-lock
                    onClick={() => setLocked(locked.map((l, j) => (j === i ? !l : l)))}
                    className={`mt-auto inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${locked[i] ? 'border-amber-500 bg-amber-100 text-amber-900' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {locked[i] ? <Lock className="w-3.5 h-3.5" aria-hidden /> : <LockOpen className="w-3.5 h-3.5" aria-hidden />}
                    {locked[i] ? t.locked : t.lock(t.dice[s.die])}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button type="button" onClick={roll} className="btn-primary" data-roll>
                <Dices className="w-4 h-4" aria-hidden /> {t.roll}
              </button>
              <ReadAloudButton compact text={sentence} label={t.listen} />
              <p role="status" className="text-xs text-gray-600">{t.rolled(rolls)}</p>
            </div>
            <p className="mt-3 rounded-xl bg-white border-2 border-amber-200 p-3 text-gray-800" lang={language} data-die-sentence>{sentence}</p>
          </Panel>
          <Panel>
            <StepLabel n="02">{t.step2}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro2}</p>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map((m) => (
                <Choice key={m.id} selected={mode === m.id} onSelect={() => setMode(m.id)} className="flex flex-col items-center gap-1 text-center">
                  <span className="text-2xl" aria-hidden>{m.icon}</span><span className="text-sm font-semibold">{t.modes[m.id]}</span>
                </Choice>
              ))}
            </div>
            {mode === 'tell' && <p className="mt-4 text-sm text-gray-700">{t.tellTip}</p>}
            {mode === 'draw' && <p className="mt-4 text-sm text-gray-700">{t.drawTip}</p>}
            {mode === 'write' && (
              <div className="grid gap-3 mt-4">
                {PARTS.map((p) => (
                  <LineInput key={p} label={t.parts[p]} value={lines[p]} placeholder={t.partPh[p]} onChange={(v) => setLines({ ...lines, [p]: v })} />
                ))}
              </div>
            )}
          </Panel>
        </div>
        <Printable label={t.cardLabel} className="self-start">
          <div className="rounded-xl border-4 border-amber-300 bg-amber-50 p-5 print:p-4 print:bg-white">
            <p className="text-center text-4xl print:text-3xl" aria-hidden>🎲</p>
            <h3 className="text-center text-2xl font-bold text-amber-900">{t.card}</h3>
            <p className="mt-2 text-sm text-gray-700">{t.name} <span className="inline-block w-40 border-b border-gray-500" /></p>
            <ul className="mt-3 grid grid-cols-3 gap-2">
              {shown.map((s) => (
                <li key={s.die} className="rounded-lg border border-amber-200 bg-white p-2 print:p-1.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">{t.dice[s.die]}</p>
                  <p className="text-3xl print:text-2xl" aria-hidden>{s.emoji}</p>
                  <p className="text-sm font-semibold text-gray-900" lang={language}>{s.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-gray-800" lang={language}>{sentence}</p>
            <p className="mt-2 text-xs text-gray-700">
              <span className="font-bold">{t.books}</span> {bookList.map((b) => b.title).join(' · ')}
            </p>
            <ol className="mt-3 grid gap-1.5 text-sm text-gray-800">
              {PARTS.map((p) => (
                <li key={p}>
                  <span className="font-bold">{t.parts[p]}:</span> {lines[p].trim() ? lines[p] : <span aria-hidden>{t.blank}</span>}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm font-semibold text-gray-800">{t.draw}</p>
            <div aria-hidden className="h-40 print:h-36 mt-2 rounded-lg border-2 border-dashed border-gray-400 bg-white" />
          </div>
          <StudioActions onReset={reset} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
