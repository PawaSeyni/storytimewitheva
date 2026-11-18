// Puzzle Paradise, rebuilt on the books (activities re-audit 2026-11-18, §7c item 3). It used
// to be generic fairy-tale puzzles (a wolf-and-grandmother match that could be confused with Leo
// and the Wolf). Now every puzzle comes from the chosen book's own data, so it can never
// disagree with the book:
//  - unscramble the book's eight story words (src/data/bookVocab.data.ts), in the page language;
//  - put the book's three story sentences back in order (src/data/bookSentences.data.ts).
// Opened from a book page with ?book=<id>; without one, the grown-up picks a book. Shuffles are
// seeded by the book, so the server-rendered page, the browser and a reload all agree. Prints as
// a one-page worksheet.
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../data/books';
import { bookVocab } from '../data/bookVocab.data';
import { bookSentences } from '../data/bookSentences.data';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { seeded } from '../lib/seeded';
import { plain, scrambleWord, scrambleSentence } from '../lib/puzzles';
import { useSourceBook, SOURCE_BOOK_PARAM } from '../lib/sourceBook';
import { StudioFrame, Panel, Printable, StudioActions, StepLabel } from './studio/StudioFrame';

const SLUG = 'puzzles';
const TRIES = 3;
const TRANSLATIONS = {
  en: {
    skill: 'Spelling and sentence sense', title: 'Puzzle Paradise', subtitle: 'Unscramble the story words and put the story sentences back in order, for any book in the collection.', grownup: 'Read the clues aloud',
    pick: 'Choose a book', pickPh: 'Pick a book…', noBook: 'Choose a book above and its puzzles appear here.',
    score: (n: number, of: number) => `Solved: ${n} of ${of}`, master: '🏆 Puzzle Master! You solved every puzzle.',
    s1: 'Unscramble the story words', s1q: 'Each word is from the book. Type it the right way round. Accents are optional.',
    typeHere: 'Type the word', check: 'Check', hint: 'Hint', hintText: (others: string) => `In other languages: ${others}`, tries: (n: number) => `${n} ${n === 1 ? 'try' : 'tries'} left`, reveal: 'Show the word', isWord: (w: string) => `The word is ${w}.`,
    right: 'Yes! That’s it.', wrong: 'Not yet. Look at the letters again.',
    s2: 'Put the sentence back together', s2q: 'Tap the words in the right order. Every word is from the book.', clear: 'Start over', showSentence: 'Show the sentence', sentenceRight: 'That’s the sentence!', sentenceWrong: 'Not quite. Try another order.', sentenceIs: 'The sentence is:', tile: (w: string) => `Add “${w}”`,
    cardLabel: 'Printable puzzle worksheet', sheet: 'Story word puzzles', sheetWords: 'Unscramble each word. The picture is a clue.', sheetSentences: 'Write each sentence in the right order.', name: 'Name:',
  },
  es: {
    skill: 'Ortografía y sentido de la frase', title: 'Paraíso de rompecabezas', subtitle: 'Ordena las letras de las palabras del cuento y vuelve a armar sus frases, para cualquier libro de la colección.', grownup: 'Leer las pistas en voz alta',
    pick: 'Elige un libro', pickPh: 'Elige un libro…', noBook: 'Elige un libro arriba y aquí aparecerán sus rompecabezas.',
    score: (n: number, of: number) => `Resueltos: ${n} de ${of}`, master: '🏆 ¡Gran cerebro! Resolviste todos los rompecabezas.',
    s1: 'Ordena las palabras del cuento', s1q: 'Cada palabra es del libro. Escríbela bien ordenada. Las tildes son opcionales.',
    typeHere: 'Escribe la palabra', check: 'Comprobar', hint: 'Pista', hintText: (others: string) => `En otros idiomas: ${others}`, tries: (n: number) => `${n} ${n === 1 ? 'intento' : 'intentos'} más`, reveal: 'Ver la palabra', isWord: (w: string) => `La palabra es ${w}.`,
    right: '¡Sí! Esa es.', wrong: 'Todavía no. Mira las letras otra vez.',
    s2: 'Vuelve a armar la frase', s2q: 'Toca las palabras en el orden correcto. Todas son del libro.', clear: 'Empezar de nuevo', showSentence: 'Ver la frase', sentenceRight: '¡Esa es la frase!', sentenceWrong: 'Casi. Prueba otro orden.', sentenceIs: 'La frase es:', tile: (w: string) => `Añadir «${w}»`,
    cardLabel: 'Ficha de rompecabezas para imprimir', sheet: 'Rompecabezas de palabras del cuento', sheetWords: 'Ordena cada palabra. El dibujo es una pista.', sheetSentences: 'Escribe cada frase en el orden correcto.', name: 'Nombre:',
  },
  fr: {
    skill: 'Orthographe et sens de la phrase', title: 'Paradis des énigmes', subtitle: 'Remets les lettres des mots de l’histoire dans l’ordre et reconstitue ses phrases, pour n’importe quel livre de la collection.', grownup: 'Lire les indices à voix haute',
    pick: 'Choisir un livre', pickPh: 'Choisis un livre…', noBook: 'Choisis un livre ci-dessus et ses énigmes apparaîtront ici.',
    score: (n: number, of: number) => `Résolues : ${n} sur ${of}`, master: '🏆 Champion des énigmes ! Tu as tout résolu.',
    s1: 'Remets les lettres dans l’ordre', s1q: 'Chaque mot vient du livre. Écris-le à l’endroit. Les accents sont facultatifs.',
    typeHere: 'Écris le mot', check: 'Vérifier', hint: 'Indice', hintText: (others: string) => `Dans d’autres langues : ${others}`, tries: (n: number) => `${n} essai${n > 1 ? 's' : ''} restant${n > 1 ? 's' : ''}`, reveal: 'Voir le mot', isWord: (w: string) => `Le mot est ${w}.`,
    right: 'Oui ! C’est ça.', wrong: 'Pas encore. Regarde bien les lettres.',
    s2: 'Reconstitue la phrase', s2q: 'Touche les mots dans le bon ordre. Ils viennent tous du livre.', clear: 'Recommencer', showSentence: 'Voir la phrase', sentenceRight: 'C’est la phrase !', sentenceWrong: 'Presque. Essaie un autre ordre.', sentenceIs: 'La phrase est :', tile: (w: string) => `Ajouter « ${w} »`,
    cardLabel: 'Fiche d’énigmes à imprimer', sheet: 'Énigmes des mots de l’histoire', sheetWords: 'Remets chaque mot dans l’ordre. L’image est un indice.', sheetSentences: 'Écris chaque phrase dans le bon ordre.', name: 'Prénom :',
  },
};

type WordState = { typed: string; tries: number; done: 'no' | 'solved' | 'revealed'; hint: boolean; flash: '' | 'right' | 'wrong' };
type SentenceState = { picked: number[]; tries: number; done: 'no' | 'solved' | 'revealed'; flash: '' | 'right' | 'wrong' };
const freshWord = (): WordState => ({ typed: '', tries: 0, done: 'no', hint: false, flash: '' });
const freshSentence = (): SentenceState => ({ picked: [], tries: 0, done: 'no', flash: '' });
const OTHERS: Record<Language, Language[]> = { en: ['es', 'fr'], es: ['en', 'fr'], fr: ['en', 'es'] };

export default function PuzzleAdventuresDemo() {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const books = useBooks();
  const [, setParams] = useSearchParams();
  const bookId = useSourceBook(SLUG);
  const book = bookId ? books.find((b) => b.id === bookId) : undefined;
  const words = bookId ? bookVocab[bookId] ?? [] : [];
  const sentences = bookId ? bookSentences[bookId] ?? [] : [];

  // Seeded by book and language, so the puzzles are the same on the server, in the browser
  // and after a reload. Recomputed only when the book or language changes.
  const rnd = seeded(`${bookId ?? ''}:${language}`);
  const scrambles = words.map((w) => scrambleWord(w[language], rnd));
  const sentenceWords = sentences.map((s) => s[language].split(' '));
  const sentenceTiles = sentenceWords.map((ws) => scrambleSentence(ws, rnd));

  const [wordState, setWordState] = useState<WordState[]>(() => words.map(freshWord));
  const [sentState, setSentState] = useState<SentenceState[]>(() => sentences.map(freshSentence));
  // State follows the book and language: reset during render, React's pattern for state
  // that tracks a prop, so nothing stale survives a switch.
  const [key, setKey] = useState(`${bookId}:${language}`);
  if (key !== `${bookId}:${language}`) {
    setKey(`${bookId}:${language}`);
    setWordState(words.map(freshWord));
    setSentState(sentences.map(freshSentence));
  }

  const solvedCount = wordState.filter((w) => w.done === 'solved').length + sentState.filter((s) => s.done === 'solved').length;
  const total = words.length + sentences.length;
  const reset = () => { setWordState(words.map(freshWord)); setSentState(sentences.map(freshSentence)); };

  const setWord = (i: number, patch: Partial<WordState>) => setWordState((st) => st.map((w, j) => (j === i ? { ...w, ...patch } : w)));
  const checkWord = (i: number) => {
    const w = wordState[i];
    if (w.done !== 'no') return;
    if (plain(w.typed) === plain(words[i][language])) { setWord(i, { done: 'solved', flash: 'right' }); return; }
    setWord(i, { tries: w.tries + 1, flash: 'wrong' });
  };
  const setSent = (i: number, patch: Partial<SentenceState>) => setSentState((st) => st.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const tapTile = (i: number, tileIndex: number) => {
    const s = sentState[i];
    if (s.done !== 'no' || s.picked.includes(tileIndex)) return;
    const picked = [...s.picked, tileIndex];
    if (picked.length < sentenceTiles[i].length) { setSent(i, { picked, flash: '' }); return; }
    const built = picked.map((p) => sentenceTiles[i][p]).join(' ');
    if (built === sentenceWords[i].join(' ')) setSent(i, { picked, done: 'solved', flash: 'right' });
    else setSent(i, { picked: [], tries: s.tries + 1, flash: 'wrong' });
  };

  return (
    <StudioFrame emoji="🧩" hue="teal" skill={t.skill} title={book ? `${t.title}: ${book.title}` : t.title} subtitle={t.subtitle} ages="6-9" minutes={15} bookIds={bookId ? [bookId] : []} grownup={t.grownup} printHero={false}>
      <Panel className="mb-6">
        <label className="block text-sm font-semibold text-gray-700">
          <span className="block mb-1">{t.pick}</span>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500"
            value={bookId ?? ''}
            onChange={(e) => setParams(e.target.value ? { [SOURCE_BOOK_PARAM]: e.target.value } : {}, { replace: true })}
          >
            <option value="">{t.pickPh}</option>
            {books.filter((b) => (bookVocab[b.id] ?? []).length > 0).map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
        </label>
        {book && (
          <p role="status" className="mt-3 font-bold text-teal-900" data-puzzle-score={solvedCount}>
            {solvedCount === total && total > 0 ? t.master : t.score(solvedCount, total)}
          </p>
        )}
      </Panel>

      {!book ? (
        <p className="text-center text-gray-500 py-10" role="status">{t.noBook}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4 content-start">
            <Panel>
              <StepLabel n="01">{t.s1}</StepLabel>
              <p className="text-sm text-gray-600 mb-4">{t.s1q}</p>
              <ul className="grid gap-3">
                {words.map((w, i) => {
                  const st = wordState[i] ?? freshWord();
                  const left = TRIES - st.tries;
                  return (
                    <li key={w.emoji} className={`rounded-xl border-2 p-3 ${st.done === 'solved' ? 'border-emerald-400 bg-emerald-50' : st.done === 'revealed' ? 'border-gray-300 bg-gray-50' : 'border-teal-200 bg-white'}`} data-puzzle-word={st.done}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span aria-hidden className="text-3xl">{w.emoji}</span>
                        <span className="font-mono text-xl font-bold tracking-[0.3em] text-gray-800" aria-label={scrambles[i].split('').join(' ')}>{scrambles[i]}</span>
                      </div>
                      {st.done === 'no' ? (
                        <form className="mt-2 flex flex-wrap items-center gap-2" onSubmit={(e) => { e.preventDefault(); checkWord(i); }}>
                          <input
                            aria-label={t.typeHere}
                            placeholder={t.typeHere}
                            value={st.typed}
                            onChange={(e) => setWord(i, { typed: e.target.value, flash: '' })}
                            autoCapitalize="none"
                            autoComplete="off"
                            className="flex-1 min-w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 uppercase focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500"
                          />
                          <button type="submit" className="btn-primary py-2">{t.check}</button>
                          <button type="button" onClick={() => setWord(i, { hint: true })} className="rounded-full border-2 border-purple-300 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50">💡 {t.hint}</button>
                          {left <= 0 && <button type="button" onClick={() => setWord(i, { done: 'revealed' })} className="rounded-full border-2 border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">👀 {t.reveal}</button>}
                        </form>
                      ) : (
                        <p className="mt-2 font-bold text-gray-800">{st.done === 'solved' ? `✅ ${t.right}` : `👀 ${t.isWord(w[language])}`}</p>
                      )}
                      <p role="status" className="mt-1 min-h-5 text-sm text-gray-700">
                        {st.done === 'no' && st.flash === 'wrong' ? `${t.wrong} ${t.tries(Math.max(0, left))}` : ''}
                        {st.done === 'no' && st.hint ? ` ${t.hintText(OTHERS[language].map((l) => w[l]).join(' · '))}` : ''}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </div>
          <div className="grid gap-4 content-start">
            <Panel>
              <StepLabel n="02">{t.s2}</StepLabel>
              <p className="text-sm text-gray-600 mb-4">{t.s2q}</p>
              <ul className="grid gap-4">
                {sentences.map((s, i) => {
                  const st = sentState[i] ?? freshSentence();
                  const tiles = sentenceTiles[i];
                  const built = st.done === 'revealed' ? sentenceWords[i] : st.picked.map((p) => tiles[p]);
                  return (
                    <li key={s.emoji} className={`rounded-xl border-2 p-3 ${st.done === 'solved' ? 'border-emerald-400 bg-emerald-50' : st.done === 'revealed' ? 'border-gray-300 bg-gray-50' : 'border-teal-200 bg-white'}`} data-puzzle-sentence={st.done}>
                      <p className="flex items-center gap-2 text-sm font-semibold text-gray-700"><span aria-hidden className="text-2xl">{s.emoji}</span></p>
                      <p className="mt-2 min-h-10 rounded-lg border-2 border-dashed border-gray-300 bg-white px-3 py-2 text-lg text-gray-900" aria-live="polite">{built.join(' ') || '…'}</p>
                      {st.done === 'no' && (
                        <>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {tiles.map((word, k) => (
                              <button key={k} type="button" disabled={st.picked.includes(k)} onClick={() => tapTile(i, k)} aria-label={t.tile(word)} className="rounded-lg border-2 border-teal-300 bg-teal-50 px-3 py-2 font-semibold text-gray-800 hover:bg-teal-100 disabled:opacity-30 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500">
                                {word}
                              </button>
                            ))}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {st.picked.length > 0 && <button type="button" onClick={() => setSent(i, { picked: [], flash: '' })} className="rounded-full border-2 border-purple-300 px-3 py-1.5 text-sm font-semibold text-purple-700 hover:bg-purple-50">↺ {t.clear}</button>}
                            {st.tries >= TRIES && <button type="button" onClick={() => setSent(i, { done: 'revealed' })} className="rounded-full border-2 border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">👀 {t.showSentence}</button>}
                          </div>
                        </>
                      )}
                      <p role="status" className="mt-1 min-h-5 text-sm font-semibold text-gray-800">
                        {st.done === 'solved' ? `✅ ${t.sentenceRight}` : st.done === 'revealed' ? `👀 ${t.sentenceIs}` : st.flash === 'wrong' ? `${t.sentenceWrong} ${t.tries(Math.max(0, TRIES - st.tries))}` : ''}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Panel>
            <Printable label={t.cardLabel} className="hidden print:block">
              <h3 className="text-xl font-bold text-gray-800">{t.sheet}: {book.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{t.name} <span className="inline-block w-48 border-b border-gray-500" /></p>
              <p className="mt-4 text-sm font-semibold text-gray-800">{t.sheetWords}</p>
              <ol className="mt-2 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-800">
                {words.map((w, i) => (
                  <li key={w.emoji} className="flex items-center gap-2"><span aria-hidden className="text-xl">{w.emoji}</span><span className="font-mono tracking-[0.25em]">{scrambles[i]}</span><span aria-hidden className="flex-1 border-b border-gray-500 h-5" /></li>
                ))}
              </ol>
              <p className="mt-5 text-sm font-semibold text-gray-800">{t.sheetSentences}</p>
              <ol className="mt-2 grid gap-4 text-sm text-gray-800">
                {sentences.map((s, i) => (
                  <li key={s.emoji}><span aria-hidden>{s.emoji}</span> <span className="italic">{sentenceTiles[i].join(' / ')}</span><span aria-hidden className="block border-b border-gray-500 h-7" /></li>
                ))}
              </ol>
            </Printable>
            <StudioActions onReset={reset} />
          </div>
        </div>
      )}
    </StudioFrame>
  );
}
