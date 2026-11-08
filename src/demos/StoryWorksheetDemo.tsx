// Story worksheet for ANY book (activities audit 2026-11, "a companion printable per book").
// Paper first, two printed pages, built entirely from catalog data so it can never disagree
// with the book: the book's own before/during/after discussion prompts and its eight story
// words (src/data/bookVocab.data.ts). Opened from a book page with ?book=<id>; without one, the
// grown-up picks a book. Leo and the Wolf also has a hand-written worksheet of its own.
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks, books as CATALOG } from '../data/books';
import { bookVocab } from '../data/bookVocab.data';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { useSourceBook, SOURCE_BOOK_PARAM } from '../lib/sourceBook';
import { StudioFrame, Panel, Printable, StudioActions, LineInput } from './studio/StudioFrame';
import { Lines, Section, SheetHeader, MatchColumns } from './studio/Worksheet';
import { nb, DERANGE } from './studio/worksheetText';

const SLUG = 'story-worksheet';
/** The language the "write it in another language" section asks for. */
const OTHER: Record<Language, Language> = { en: 'es', es: 'en', fr: 'en' };

const TRANSLATIONS = {
  en: {
    skill: 'Reading comprehension', title: 'Story Worksheet', subtitle: 'A two-page printable for any book in the collection: questions, story words, drawing and a review.', grownup: 'Read the questions aloud',
    setupHeading: 'Get the worksheet ready', setupIntro: 'Choose the book, then type a name and date to print them, or leave them blank to write by hand. Read each question aloud for children who are not reading yet.',
    pick: 'Choose a book', pickPh: 'Pick a book…', name: 'Name', date: 'Date', showKey: 'Add the answer key (for grown-ups)', hideKey: 'Remove the answer key',
    noBook: 'Choose a book above and its worksheet appears here.',
    cardLabel: 'Story worksheet', eyebrow: 'My story worksheet', nameLine: 'Name:', dateLine: 'Date:',
    s1: 'Before you read', s2: 'Story words', s2q: 'Draw a line from each word to its picture.', s3: 'While you read',
    s4: 'Words in another language', s4q: (lang: string) => `Write each word in ${lang}.`, s5: 'After you read',
    s6: 'Draw it', s6q: 'Draw your favorite part of the story.', s7: 'My review', s7a: 'My favorite character is', s7b: 'I give this book:', s7c: 'Color in the stars.',
    langs: { en: 'English', es: 'Spanish', fr: 'French' },
    keyTitle: 'Answer key for grown-ups', keyMatch: 'Story words:', keyWords: 'Words in another language:', keyOpen: 'The questions, the drawing and the review have no single right answer: talk about them together.',
  },
  es: {
    skill: 'Comprensión lectora', title: 'Ficha del cuento', subtitle: 'Una ficha de dos páginas para cualquier libro de la colección: preguntas, palabras del cuento, dibujo y opinión.', grownup: 'Leer las preguntas en voz alta',
    setupHeading: 'Prepara la ficha', setupIntro: 'Elige el libro y escribe un nombre y una fecha para imprimirlos, o déjalos en blanco para escribirlos a mano. Lee cada pregunta en voz alta a quien todavía no lee.',
    pick: 'Elige un libro', pickPh: 'Elige un libro…', name: 'Nombre', date: 'Fecha', showKey: 'Añadir las respuestas (para adultos)', hideKey: 'Quitar las respuestas',
    noBook: 'Elige un libro arriba y aquí aparecerá su ficha.',
    cardLabel: 'Ficha del cuento', eyebrow: 'Mi ficha del cuento', nameLine: 'Nombre:', dateLine: 'Fecha:',
    s1: 'Antes de leer', s2: 'Palabras del cuento', s2q: 'Une cada palabra con su dibujo.', s3: 'Mientras lees',
    s4: 'Palabras en otro idioma', s4q: (lang: string) => `Escribe cada palabra en ${lang}.`, s5: 'Después de leer',
    s6: 'Dibújalo', s6q: 'Dibuja tu parte favorita del cuento.', s7: 'Mi opinión', s7a: 'Mi personaje favorito es', s7b: 'Le doy a este libro:', s7c: 'Colorea las estrellas.',
    langs: { en: 'inglés', es: 'español', fr: 'francés' },
    keyTitle: 'Respuestas para adultos', keyMatch: 'Palabras del cuento:', keyWords: 'Palabras en otro idioma:', keyOpen: 'Las preguntas, el dibujo y la opinión no tienen una única respuesta correcta: hablen de ellos juntos.',
  },
  fr: {
    skill: 'Compréhension', title: 'Fiche de lecture', subtitle: 'Une fiche de deux pages pour n’importe quel livre de la collection : questions, mots de l’histoire, dessin et avis.', grownup: 'Lire les questions à voix haute',
    setupHeading: 'Préparer la fiche', setupIntro: 'Choisis le livre, puis tape un prénom et une date pour les imprimer, ou laisse vide pour écrire à la main. Lis chaque question à voix haute aux enfants qui ne lisent pas encore.',
    pick: 'Choisir un livre', pickPh: 'Choisis un livre…', name: 'Prénom', date: 'Date', showKey: 'Ajouter le corrigé (pour les adultes)', hideKey: 'Retirer le corrigé',
    noBook: 'Choisis un livre ci-dessus et sa fiche apparaîtra ici.',
    cardLabel: 'Fiche de lecture', eyebrow: 'Ma fiche de lecture', nameLine: 'Prénom :', dateLine: 'Date :',
    s1: 'Avant de lire', s2: 'Les mots de l’histoire', s2q: 'Relie chaque mot à son dessin.', s3: 'Pendant la lecture',
    s4: 'Les mots dans une autre langue', s4q: (lang: string) => `Écris chaque mot en ${lang}.`, s5: 'Après la lecture',
    s6: 'Dessine', s6q: 'Dessine ton passage préféré de l’histoire.', s7: 'Mon avis', s7a: 'Mon personnage préféré, c’est', s7b: 'Je donne à ce livre :', s7c: 'Colorie les étoiles.',
    langs: { en: 'anglais', es: 'espagnol', fr: 'français' },
    keyTitle: 'Corrigé pour les adultes', keyMatch: 'Les mots de l’histoire :', keyWords: 'Les mots dans une autre langue :', keyOpen: 'Les questions, le dessin et l’avis n’ont pas une seule bonne réponse : parlez-en ensemble.',
  },
};

export default function StoryWorksheetDemo() {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const books = useBooks();
  const [, setParams] = useSearchParams();
  const bookId = useSourceBook(SLUG);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [key, setKey] = useState(false);

  const book = bookId ? books.find((b) => b.id === bookId) : undefined;
  const raw = bookId ? CATALOG.find((b) => b.id === bookId) : undefined;
  const prompt = (stage: 'before' | 'during' | 'after') => raw?.discussionQuestions?.find((q) => q.stage === stage)?.prompt[language] ?? '';
  const words = bookId ? bookVocab[bookId] ?? [] : [];
  // Eight words, no repeats: five to match with pictures, three to write in another language.
  const match = words.slice(0, 5);
  const order = DERANGE[match.length] ?? match.map((_, i) => i);
  const other = OTHER[language];
  const translate = words.slice(5, 8);

  return (
    <StudioFrame emoji="📚" hue="plum" skill={t.skill} title={book ? `${t.title}: ${book.title}` : t.title} subtitle={t.subtitle} ages="4-9" minutes={25} bookIds={bookId ? [bookId] : []} grownup={t.grownup} printHero={false}>
      <Panel className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{t.setupHeading}</h3>
        <p className="text-sm text-gray-600 mb-4">{t.setupIntro}</p>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <span className="block mb-1">{t.pick}</span>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500"
            value={bookId ?? ''}
            onChange={(e) => setParams(e.target.value ? { [SOURCE_BOOK_PARAM]: e.target.value } : {}, { replace: true })}
          >
            <option value="">{t.pickPh}</option>
            {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <LineInput label={t.name} value={name} onChange={setName} />
          <LineInput label={t.date} value={date} onChange={setDate} />
        </div>
        {book && (
          <button type="button" aria-pressed={key} onClick={() => setKey(!key)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-purple-300 text-purple-800 text-sm font-semibold hover:bg-purple-50">
            {key ? t.hideKey : t.showKey}
          </button>
        )}
        {book && <StudioActions />}
      </Panel>

      {!book ? (
        <p className="text-center text-gray-500 py-10" role="status">{t.noBook}</p>
      ) : (
        <Printable label={t.cardLabel}>
          <SheetHeader eyebrow={t.eyebrow} title={book.title} nameLabel={t.nameLine} dateLabel={t.dateLine} name={name} date={date} />
          <div className="grid gap-4 print:gap-3 md:grid-cols-2 print:grid-cols-2">
            <Section n={1} title={t.s1} prompt={prompt('before')} className="md:col-span-2 print:col-span-2"><Lines n={2} /></Section>
            <Section n={2} title={t.s2} prompt={t.s2q}>
              <MatchColumns words={match.map((w) => w[language])} pictures={order.map((i) => match[i].emoji)} />
            </Section>
            <Section n={3} title={t.s3} prompt={prompt('during')}><Lines n={4} /></Section>
            <Section n={4} title={t.s4} prompt={t.s4q(t.langs[other])} className="md:col-span-2 print:col-span-2">
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-3 print:grid-cols-3">
                {translate.map((w) => (
                  <li key={w.emoji} className="flex items-end gap-2 text-sm text-gray-800">
                    <span aria-hidden className="text-2xl">{w.emoji}</span>
                    <span className="font-semibold" lang={language}>{w[language]}</span>
                    <span aria-hidden className="flex-1 border-b border-gray-500 h-6" />
                  </li>
                ))}
              </ul>
            </Section>
            <Section n={5} title={t.s5} prompt={prompt('after')} className="md:col-span-2 print:col-span-2"><Lines n={4} /></Section>
            <Section n={6} title={t.s6} prompt={t.s6q}><div aria-hidden className="h-40 print:h-56 rounded-lg border-2 border-dashed border-gray-400" /></Section>
            <Section n={7} title={t.s7} prompt={t.s7c}>
              <p className="text-sm text-gray-800">{nb(t.s7a)}</p>
              <Lines n={1} />
              <p className="text-sm text-gray-800 mt-4">{nb(t.s7b)}</p>
              <p aria-hidden className="text-4xl tracking-widest text-gray-400 mt-1">☆☆☆☆☆</p>
            </Section>
          </div>
          {key && (
            <aside className="mt-6 rounded-xl border-2 border-purple-300 bg-purple-50 p-4 text-sm text-gray-800 break-inside-avoid print:break-before-page print:bg-white print:border-gray-500">
              <h4 className="font-bold mb-2">{t.keyTitle}</h4>
              <p>{nb(t.keyMatch)} {match.map((w) => `${w[language]} = ${w.emoji}`).join(', ')}</p>
              <p className="mt-1">{nb(t.keyWords)} {translate.map((w) => `${w[language]} = ${w[other]}`).join(', ')}</p>
              <p className="mt-1 text-gray-600">{nb(t.keyOpen)}</p>
            </aside>
          )}
        </Printable>
      )}
    </StudioFrame>
  );
}
