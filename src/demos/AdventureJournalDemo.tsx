import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Calendar, Star, Trash2, Download } from 'lucide-react';
import { useTranslation } from '../lib/language';
import { getLegacy, setLegacy, type LegacyKey } from '../lib/storage';
import { useBooks, isComingSoon, type LocalizedBook } from '../data/books';
import LittleReaderToggle from '../components/LittleReaderToggle';
import ReadAloudButton from '../components/ReadAloudButton';

type Entry = {
  id: number;
  bookTitle: string;
  date: string;
  rating: number;
  favoriteCharacter: string;
  favoriteScene: string;
  thoughts: string;
  emoji: string;
  // Optional fields added by little-reader mode (ages 4-5). Older entries simply lack them;
  // the text fields above are always filled too, so any reader of the old shape still works.
  /** Catalog id of the book picked from the covers, so the title follows the site language. */
  bookId?: string;
  /** Picture choice for the favourite character (see CHARACTER_CHOICES). */
  character?: string;
  /** Picture choice for "how did the story make me feel" (see FEELING_CHOICES). */
  feeling?: string;
  /** True when the entry was made in little-reader mode. */
  littleReader?: boolean;
};

const JOURNAL_KEY: LegacyKey = 'adventureJournal';

const isArray = (v: unknown): v is unknown[] => Array.isArray(v);

const BOOK_EMOJIS = ['📖', '📚', '📕', '📗', '📘', '📙', '📔', '📓', '🎭', '🧙', '🐉', '🏰', '🌟', '✨', '🦄', '🧚'];

const TRANSLATIONS = {
  en: {
    title: 'Journaling with Eva',
    subtitle: 'Record your reading adventures and favorite book memories!',
    howToPlay: '✨ How to Play ✨',
    howToList: [
      'After reading a book, click "New Entry" to start recording',
      'Fill in the book title and your rating (⭐)',
      'Share your favorite character and scene',
      'Write what you thought about the book',
      'Save your entry and watch your reading journal grow!',
    ],
    newEntry: 'New Entry',
    bookTitleLabel: 'Book Title:',
    bookTitlePlaceholder: 'What book did you read?',
    dateLabel: 'Date:',
    ratingLabel: 'My Rating:',
    favCharLabel: 'Favorite Character:',
    favCharPlaceholder: 'Who was your favorite character?',
    favSceneLabel: 'Favorite Scene:',
    favScenePlaceholder: 'What was the best part?',
    thoughtsLabel: 'My Thoughts:',
    thoughtsPlaceholder: 'What did you think about the book? What did you learn?',
    chooseEmoji: 'Choose a Book Emoji:',
    saveEntry: 'Save Entry',
    deleteEntryLabel: 'Delete entry',
    journalHeading: '📚 My Reading Journal',
    downloadJournal: 'Download Journal',
    emptyJournal: 'No entries yet! Start recording your reading adventures!',
    entryFavChar: 'Favorite Character:',
    entryFavScene: 'Favorite Scene:',
    entryThoughts: 'My Thoughts:',
    downloadFilename: 'my-reading-journal.txt',
    downloadDateLabel: 'Date',
    downloadRatingLabel: 'Rating',
    downloadFavChar: 'Favorite Character',
    downloadFavScene: 'Favorite Scene',
    downloadThoughts: 'My Thoughts',
  },
  es: {
    title: 'Diario con Eva',
    subtitle: '¡Registra tus aventuras lectoras y tus recuerdos favoritos!',
    howToPlay: '✨ Cómo jugar ✨',
    howToList: [
      'Después de leer un libro, pulsa "Nueva entrada" para empezar',
      'Escribe el título del libro y tu valoración (⭐)',
      'Comparte tu personaje y escena favoritos',
      'Escribe qué te pareció el libro',
      '¡Guarda tu entrada y ve crecer tu diario de lectura!',
    ],
    newEntry: 'Nueva entrada',
    bookTitleLabel: 'Título del libro:',
    bookTitlePlaceholder: '¿Qué libro leíste?',
    dateLabel: 'Fecha:',
    ratingLabel: 'Mi valoración:',
    favCharLabel: 'Personaje favorito:',
    favCharPlaceholder: '¿Quién fue tu personaje favorito?',
    favSceneLabel: 'Escena favorita:',
    favScenePlaceholder: '¿Cuál fue la mejor parte?',
    thoughtsLabel: 'Mis pensamientos:',
    thoughtsPlaceholder: '¿Qué te pareció el libro? ¿Qué aprendiste?',
    chooseEmoji: 'Elige un emoji de libro:',
    saveEntry: 'Guardar entrada',
    deleteEntryLabel: 'Eliminar entrada',
    journalHeading: '📚 Mi diario de lectura',
    downloadJournal: 'Descargar diario',
    emptyJournal: '¡Aún no hay entradas! Empieza a registrar tus aventuras lectoras.',
    entryFavChar: 'Personaje favorito:',
    entryFavScene: 'Escena favorita:',
    entryThoughts: 'Mis pensamientos:',
    downloadFilename: 'mi-diario-de-lectura.txt',
    downloadDateLabel: 'Fecha',
    downloadRatingLabel: 'Valoración',
    downloadFavChar: 'Personaje favorito',
    downloadFavScene: 'Escena favorita',
    downloadThoughts: 'Mis pensamientos',
  },
  fr: {
    title: "Journal avec Eva",
    subtitle: 'Note tes aventures de lecture et tes souvenirs préférés !',
    howToPlay: '✨ Comment jouer ✨',
    howToList: [
      'Après avoir lu un livre, clique sur « Nouvelle entrée » pour commencer',
      'Indique le titre du livre et ta note (⭐)',
      'Partage ton personnage et ta scène préférés',
      "Écris ce que tu as pensé du livre",
      'Sauvegarde ton entrée et regarde ton journal de lecture grandir !',
    ],
    newEntry: 'Nouvelle entrée',
    bookTitleLabel: 'Titre du livre :',
    bookTitlePlaceholder: 'Quel livre as-tu lu ?',
    dateLabel: 'Date :',
    ratingLabel: 'Ma note :',
    favCharLabel: 'Personnage préféré :',
    favCharPlaceholder: 'Quel était ton personnage préféré ?',
    favSceneLabel: 'Scène préférée :',
    favScenePlaceholder: 'Quel était le meilleur moment ?',
    thoughtsLabel: 'Mes pensées :',
    thoughtsPlaceholder: 'Qu\'as-tu pensé du livre ? Qu\'as-tu appris ?',
    chooseEmoji: 'Choisis un emoji de livre :',
    saveEntry: 'Sauvegarder',
    deleteEntryLabel: 'Supprimer l\'entrée',
    journalHeading: '📚 Mon journal de lecture',
    downloadJournal: 'Télécharger le journal',
    emptyJournal: "Pas encore d'entrées ! Commence à noter tes aventures de lecture.",
    entryFavChar: 'Personnage préféré :',
    entryFavScene: 'Scène préférée :',
    entryThoughts: 'Mes pensées :',
    downloadFilename: 'mon-journal-de-lecture.txt',
    downloadDateLabel: 'Date',
    downloadRatingLabel: 'Note',
    downloadFavChar: 'Personnage préféré',
    downloadFavScene: 'Scène préférée',
    downloadThoughts: 'Mes pensées',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Little-reader mode (ages 4-5, pre-readers): taps instead of typing, one question at a
// time, a read-aloud button next to every prompt, and "draw it" boxes on the printout.
// ─────────────────────────────────────────────────────────────────────────────

const CHARACTER_CHOICES = [
  { id: 'girl', emoji: '👧' },
  { id: 'boy', emoji: '👦' },
  { id: 'grownup', emoji: '🧑' },
  { id: 'animal', emoji: '🐾' },
  { id: 'magic', emoji: '🐉' },
  { id: 'toy', emoji: '🧸' },
] as const;
type CharacterId = (typeof CHARACTER_CHOICES)[number]['id'];

const FEELING_CHOICES = [
  { id: 'happy', emoji: '😊' },
  { id: 'silly', emoji: '😂' },
  { id: 'surprised', emoji: '😮' },
  { id: 'sad', emoji: '😢' },
  { id: 'scared', emoji: '😨' },
  { id: 'calm', emoji: '😌' },
] as const;
type FeelingId = (typeof FEELING_CHOICES)[number]['id'];

const OTHER_BOOK = 'other';
const LITTLE_STEPS = 4;

const LITTLE_TRANSLATIONS = {
  en: {
    intro: 'Tap the pictures to fill in your reading page. A grown-up can help!',
    stepOf: (n: number, total: number) => `Question ${n} of ${total}`,
    qBook: 'Which book did you read? Tap its cover.',
    otherBook: 'A different book',
    qCharacter: 'Who did you like best in the story?',
    qFeeling: 'How did the story make you feel?',
    qStars: 'How many stars do you give this book?',
    qReview: 'Here is your reading page! Tap the big button to save it.',
    starsAria: (n: number) => `${n} ${n === 1 ? 'star' : 'stars'}`,
    starsOf: (n: number) => `${n} of 5 stars`,
    back: 'Back',
    next: 'Next',
    save: 'Save my page',
    saved: 'Hooray! Your page is in your journal.',
    drawPrompt: 'Now get your crayons! Print your page and draw your favorite character and your favorite part.',
    print: 'Print my drawing page',
    again: 'I read another book',
    sheetTitle: 'My Reading Page',
    drawCharacter: 'Draw your favorite character',
    drawScene: 'Draw your favorite part of the story',
    nameLine: 'My name:',
    characters: { girl: 'A girl', boy: 'A boy', grownup: 'A grown-up', animal: 'An animal', magic: 'A magical creature', toy: 'A toy' } as Record<CharacterId, string>,
    feelings: { happy: 'Happy', silly: 'Silly', surprised: 'Surprised', sad: 'A little sad', scared: 'A little scared', calm: 'Calm and cozy' } as Record<FeelingId, string>,
    feelingLabel: 'How I felt:',
    listen: (text: string) => `Listen: ${text}`,
  },
  es: {
    intro: 'Toca los dibujos para completar tu página de lectura. ¡Una persona mayor puede ayudarte!',
    stepOf: (n: number, total: number) => `Pregunta ${n} de ${total}`,
    qBook: '¿Qué libro leíste? Toca su portada.',
    otherBook: 'Otro libro',
    qCharacter: '¿Quién te gustó más del cuento?',
    qFeeling: '¿Qué sentiste con el cuento?',
    qStars: '¿Cuántas estrellas le das a este libro?',
    qReview: '¡Aquí está tu página de lectura! Toca el botón grande para guardarla.',
    starsAria: (n: number) => `${n} ${n === 1 ? 'estrella' : 'estrellas'}`,
    starsOf: (n: number) => `${n} de 5 estrellas`,
    back: 'Atrás',
    next: 'Siguiente',
    save: 'Guardar mi página',
    saved: '¡Bravo! Tu página ya está en tu diario.',
    drawPrompt: '¡Ahora saca tus colores! Imprime tu página y dibuja tu personaje favorito y tu parte favorita.',
    print: 'Imprimir mi página para dibujar',
    again: 'Leí otro libro',
    sheetTitle: 'Mi página de lectura',
    drawCharacter: 'Dibuja tu personaje favorito',
    drawScene: 'Dibuja tu parte favorita del cuento',
    nameLine: 'Me llamo:',
    characters: { girl: 'Una niña', boy: 'Un niño', grownup: 'Una persona mayor', animal: 'Un animal', magic: 'Una criatura mágica', toy: 'Un juguete' } as Record<CharacterId, string>,
    feelings: { happy: 'Alegría', silly: 'Mucha risa', surprised: 'Sorpresa', sad: 'Un poco de tristeza', scared: 'Un poco de miedo', calm: 'Calma y tranquilidad' } as Record<FeelingId, string>,
    feelingLabel: 'Lo que sentí:',
    listen: (text: string) => `Escuchar: ${text}`,
  },
  fr: {
    intro: 'Touche les images pour remplir ta page de lecture. Un grand peut t’aider !',
    stepOf: (n: number, total: number) => `Question ${n} sur ${total}`,
    qBook: 'Quel livre as-tu lu ? Touche sa couverture.',
    otherBook: 'Un autre livre',
    qCharacter: 'Qui as-tu préféré dans l’histoire ?',
    qFeeling: 'Qu’as-tu ressenti avec cette histoire ?',
    qStars: 'Combien d’étoiles donnes-tu à ce livre ?',
    qReview: 'Voici ta page de lecture ! Touche le gros bouton pour la garder.',
    starsAria: (n: number) => `${n} ${n === 1 ? 'étoile' : 'étoiles'}`,
    starsOf: (n: number) => `${n} étoile${n > 1 ? 's' : ''} sur 5`,
    back: 'Retour',
    next: 'Suivant',
    save: 'Garder ma page',
    saved: 'Bravo ! Ta page est dans ton journal.',
    drawPrompt: 'Sors tes crayons ! Imprime ta page et dessine ton personnage préféré et ton moment préféré.',
    print: 'Imprimer ma page à dessiner',
    again: 'J’ai lu un autre livre',
    sheetTitle: 'Ma page de lecture',
    drawCharacter: 'Dessine ton personnage préféré',
    drawScene: 'Dessine ton moment préféré de l’histoire',
    nameLine: 'Je m’appelle :',
    characters: { girl: 'Une fille', boy: 'Un garçon', grownup: 'Un adulte', animal: 'Un animal', magic: 'Une créature magique', toy: 'Un jouet' } as Record<CharacterId, string>,
    feelings: { happy: 'De la joie', silly: 'Des rires', surprised: 'De la surprise', sad: 'Un peu de tristesse', scared: 'Un peu de peur', calm: 'Du calme' } as Record<FeelingId, string>,
    feelingLabel: 'Ce que j’ai ressenti :',
    listen: (text: string) => `Écouter : ${text}`,
  },
};
type LittleText = (typeof LITTLE_TRANSLATIONS)['en'];

const findCharacter = (id: unknown) => CHARACTER_CHOICES.find((c) => c.id === id);
const findFeeling = (id: unknown) => FEELING_CHOICES.find((f) => f.id === id);

/** Title to show for an entry: the catalog title in the current language when the entry
 *  was picked from the covers, otherwise the saved (typed) title. */
const entryTitle = (entry: Entry, books: LocalizedBook[]) =>
  (entry.bookId && books.find((b) => b.id === entry.bookId)?.title) || entry.bookTitle;

/** Favourite character text: the picture choice in the current language when there is one. */
const entryCharacter = (entry: Entry, lt: LittleText) => {
  const c = findCharacter(entry.character);
  return c ? `${c.emoji} ${lt.characters[c.id]}` : entry.favoriteCharacter;
};

const entryFeeling = (entry: Entry, lt: LittleText) => {
  const f = findFeeling(entry.feeling);
  return f ? `${f.emoji} ${lt.feelings[f.id]}` : '';
};

const BIG_FOCUS = 'focus:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-500';

function Prompt({ text, id, lt }: { text: string; id?: string; lt: LittleText }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <h3 id={id} className="text-2xl font-bold text-orange-700">{text}</h3>
      <ReadAloudButton text={text} label={lt.listen(text)} compact />
    </div>
  );
}

/** A big picture choice (emoji or cover) with visible text, a check mark and aria-pressed,
 *  so the selection never depends on color alone. */
function ChoiceButton({ selected, onClick, children, label }: { selected: boolean; onClick: () => void; children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-2xl border-4 bg-white p-3 text-center font-bold text-gray-800 motion-safe:transition-transform motion-safe:hover:scale-105 ${BIG_FOCUS} ${
        selected ? 'border-orange-500 bg-orange-100 border-solid' : 'border-orange-200 border-dashed'
      }`}
    >
      {selected && (
        <span aria-hidden className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-lg text-white">✓</span>
      )}
      {children}
      <span className="text-base leading-tight">{label}</span>
    </button>
  );
}

type LittleDraft = { bookId: string; character: CharacterId | ''; feeling: FeelingId | ''; rating: number };
const blankDraft = (): LittleDraft => ({ bookId: '', character: '', feeling: '', rating: 0 });

function LittleJournal({ books, lt, onSave, printEntry }: {
  books: LocalizedBook[];
  lt: LittleText;
  onSave: (draft: LittleDraft) => void;
  printEntry: Entry | null;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<LittleDraft>(blankDraft);
  const [done, setDone] = useState(false);
  const chosenBook = books.find((b) => b.id === draft.bookId);
  const bookLabel = chosenBook?.title ?? (draft.bookId === OTHER_BOOK ? lt.otherBook : '');

  const restart = () => {
    setDraft(blankDraft());
    setStep(0);
    setDone(false);
  };

  const save = () => {
    onSave(draft);
    setDone(true);
  };

  const navButton = `inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-6 text-lg font-bold ${BIG_FOCUS}`;

  if (done) {
    return (
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-4 border-orange-300 text-center">
        <div className="text-6xl mb-3" aria-hidden>🎉</div>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
          <p className="text-2xl font-bold text-orange-700" role="status">{lt.saved}</p>
          <ReadAloudButton text={lt.saved} label={lt.listen(lt.saved)} compact />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <p className="text-lg text-gray-700">{lt.drawPrompt}</p>
          <ReadAloudButton text={lt.drawPrompt} label={lt.listen(lt.drawPrompt)} compact />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {printEntry && (
            <button type="button" onClick={() => window.print()} className={`${navButton} bg-linear-to-r from-orange-400 to-pink-500 text-white`}>
              <span aria-hidden>🖍️</span>{lt.print}
            </button>
          )}
          <button type="button" onClick={restart} className={`${navButton} border-4 border-orange-300 bg-white text-orange-700`}>
            <span aria-hidden>📚</span>{lt.again}
          </button>
        </div>
      </div>
    );
  }

  const questions = [lt.qBook, lt.qCharacter, lt.qFeeling, lt.qStars];
  const prompt = step < LITTLE_STEPS ? questions[step] : lt.qReview;
  const headingId = 'aj-little-q';
  const canGoNext = step !== 0 || draft.bookId !== '';

  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-4 border-orange-300">
      <p className="mb-4 flex flex-wrap items-center gap-3 text-lg text-gray-700">
        <span>{lt.intro}</span>
        <ReadAloudButton text={lt.intro} label={lt.listen(lt.intro)} compact />
      </p>
      {step < LITTLE_STEPS && (
        <div className="mb-3 flex items-center gap-3">
          <span className="text-sm font-bold text-gray-700">{lt.stepOf(step + 1, LITTLE_STEPS)}</span>
          <span aria-hidden className="flex gap-1.5">
            {Array.from({ length: LITTLE_STEPS }, (_, i) => (
              <span key={i} className={`h-3 w-3 rounded-full ${i <= step ? 'bg-orange-500' : 'border-2 border-orange-300 bg-white'}`} />
            ))}
          </span>
        </div>
      )}

      <Prompt text={prompt} id={headingId} lt={lt} />

      {step === 0 && (
        <div role="group" aria-labelledby={headingId} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((b) => (
            <ChoiceButton key={b.id} label={b.title} selected={draft.bookId === b.id} onClick={() => setDraft({ ...draft, bookId: b.id })}>
              {b.coverImage ? (
                <img src={b.coverImage} alt="" loading="lazy" className="h-32 w-auto rounded-md object-contain" />
              ) : (
                <span aria-hidden className="text-5xl">📖</span>
              )}
            </ChoiceButton>
          ))}
          <ChoiceButton label={lt.otherBook} selected={draft.bookId === OTHER_BOOK} onClick={() => setDraft({ ...draft, bookId: OTHER_BOOK })}>
            <span aria-hidden className="text-6xl">📚</span>
          </ChoiceButton>
        </div>
      )}

      {step === 1 && (
        <div role="group" aria-labelledby={headingId} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CHARACTER_CHOICES.map((c) => (
            <ChoiceButton key={c.id} label={lt.characters[c.id]} selected={draft.character === c.id} onClick={() => setDraft({ ...draft, character: c.id })}>
              <span aria-hidden className="text-6xl">{c.emoji}</span>
            </ChoiceButton>
          ))}
        </div>
      )}

      {step === 2 && (
        <div role="group" aria-labelledby={headingId} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FEELING_CHOICES.map((f) => (
            <ChoiceButton key={f.id} label={lt.feelings[f.id]} selected={draft.feeling === f.id} onClick={() => setDraft({ ...draft, feeling: f.id })}>
              <span aria-hidden className="text-6xl">{f.emoji}</span>
            </ChoiceButton>
          ))}
        </div>
      )}

      {step === 3 && (
        <div>
          <div role="group" aria-labelledby={headingId} className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setDraft({ ...draft, rating: star })}
                aria-label={lt.starsAria(star)}
                aria-pressed={star <= draft.rating}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-5xl motion-safe:transition-transform motion-safe:hover:scale-110 ${BIG_FOCUS}`}
              >
                <span aria-hidden className={star <= draft.rating ? '' : 'text-gray-400'}>{star <= draft.rating ? '⭐' : '☆'}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-lg font-bold text-gray-700" aria-live="polite">{lt.starsOf(draft.rating)}</p>
        </div>
      )}

      {step === LITTLE_STEPS && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-orange-50 p-4 text-xl">
          {chosenBook?.coverImage ? (
            <img src={chosenBook.coverImage} alt="" className="h-28 w-auto rounded-md" />
          ) : (
            <span aria-hidden className="text-6xl">📚</span>
          )}
          <div className="space-y-1">
            <p className="font-bold text-orange-700">{bookLabel}</p>
            {draft.character && <p>{findCharacter(draft.character)?.emoji} {lt.characters[draft.character]}</p>}
            {draft.feeling && <p>{findFeeling(draft.feeling)?.emoji} {lt.feelings[draft.feeling]}</p>}
            <p><span aria-hidden>{'⭐'.repeat(draft.rating)} </span>{lt.starsOf(draft.rating)}</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className={`${navButton} border-4 border-orange-300 bg-white text-orange-700`}>
            <span aria-hidden>⬅️</span>{lt.back}
          </button>
        ) : <span />}
        {step < LITTLE_STEPS ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canGoNext}
            className={`${navButton} bg-linear-to-r from-orange-400 to-pink-500 text-white disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {lt.next}<span aria-hidden>➡️</span>
          </button>
        ) : (
          <button type="button" onClick={save} className={`${navButton} bg-linear-to-r from-orange-400 to-pink-500 text-white`}>
            <Star className="w-6 h-6" aria-hidden />{lt.save}
          </button>
        )}
      </div>
    </div>
  );
}

/** Print-only page for little readers: the saved answers plus two big "draw it" boxes. */
function LittlePrintSheet({ entry, books, lt }: { entry: Entry; books: LocalizedBook[]; lt: LittleText }) {
  const cover = entry.bookId ? books.find((b) => b.id === entry.bookId)?.coverImage : undefined;
  const character = entryCharacter(entry, lt);
  const feeling = entryFeeling(entry, lt);
  return (
    <div className="hidden print:block text-black">
      <h2 className="text-3xl font-bold mb-2">{lt.sheetTitle}</h2>
      <p className="text-lg mb-4">{lt.nameLine} ____________________________</p>
      <div className="flex items-center gap-4 mb-4">
        {cover && <img src={cover} alt="" className="h-32 w-auto" />}
        <div className="text-xl space-y-1">
          <p className="font-bold">{entryTitle(entry, books)}</p>
          {character && <p>{character}</p>}
          {feeling && <p>{feeling}</p>}
          <p>{'⭐'.repeat(entry.rating)}{'☆'.repeat(Math.max(0, 5 - entry.rating))} ({lt.starsOf(entry.rating)})</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-lg font-bold mb-2">✏️ {lt.drawCharacter}</p>
          <div className="h-80 rounded-xl border-4 border-dashed border-black" />
        </div>
        <div>
          <p className="text-lg font-bold mb-2">✏️ {lt.drawScene}</p>
          <div className="h-80 rounded-xl border-4 border-dashed border-black" />
        </div>
      </div>
    </div>
  );
}

const blankEntry = (): Omit<Entry, 'id'> => ({
  bookTitle: '',
  date: new Date().toISOString().split('T')[0],
  rating: 0,
  favoriteCharacter: '',
  favoriteScene: '',
  thoughts: '',
  emoji: '📖',
});

export default function AdventureJournalDemo() {
  // Storage goes through src/lib/storage.ts, which validates and never throws, so the
  // saved journal can seed the state directly.
  const [entries, setEntries] = useState<Entry[]>(() => (getLegacy(JOURNAL_KEY, isArray) as Entry[] | null) ?? []);
  const [currentEntry, setCurrentEntry] = useState(blankEntry());
  const [showForm, setShowForm] = useState(true);
  const [littleReader, setLittleReader] = useState(false);
  const [lastLittleId, setLastLittleId] = useState<number | null>(null);
  const t = useTranslation(TRANSLATIONS);
  const lt = useTranslation(LITTLE_TRANSLATIONS);
  const books = useBooks();
  const pickableBooks = books.filter((b) => !isComingSoon(b));

  const persist = (next: Entry[]) => {
    // In-memory state stays authoritative: a storage failure (private mode, quota) must
    // not lose the entry the child just wrote in this session.
    setEntries(next);
    setLegacy(JOURNAL_KEY, next);
  };

  const saveEntry = () => {
    if (!currentEntry.bookTitle) return;
    persist([...entries, { ...currentEntry, id: Date.now() }]);
    setCurrentEntry(blankEntry());
    setShowForm(false);
  };

  // Little-reader entries keep the same shape: the text fields are filled from the picture
  // choices (so normal mode, the download and the Profile page read them as before), and the
  // optional ids let the titles and labels follow the site language later.
  const saveLittleEntry = (draft: LittleDraft) => {
    const book = books.find((b) => b.id === draft.bookId);
    const id = Date.now();
    const entry: Entry = {
      id,
      bookTitle: book?.title ?? lt.otherBook,
      date: new Date().toISOString().split('T')[0],
      rating: draft.rating,
      favoriteCharacter: draft.character ? lt.characters[draft.character] : '',
      favoriteScene: '',
      thoughts: '',
      emoji: '📖',
      littleReader: true,
      ...(book ? { bookId: book.id } : {}),
      ...(draft.character ? { character: draft.character } : {}),
      ...(draft.feeling ? { feeling: draft.feeling } : {}),
    };
    persist([...entries, entry]);
    setLastLittleId(id);
  };

  const deleteEntry = (id: number) => {
    persist(entries.filter(e => e.id !== id));
  };

  const downloadJournal = () => {
    const content = entries
      .map(entry => `
${entry.emoji} ${entryTitle(entry, books)}
${t.downloadDateLabel}: ${entry.date}
${t.downloadRatingLabel}: ${'⭐'.repeat(entry.rating)}
${t.downloadFavChar}: ${entryCharacter(entry, lt)}
${t.downloadFavScene}: ${entry.favoriteScene}
${t.downloadThoughts}: ${entry.thoughts}${entryFeeling(entry, lt) ? `\n${lt.feelingLabel} ${entryFeeling(entry, lt)}` : ''}
${'='.repeat(50)}
      `)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = t.downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printEntry = entries.find((e) => e.id === lastLittleId) ?? null;
  const entryCover = (entry: Entry) => (entry.bookId ? books.find((b) => b.id === entry.bookId)?.coverImage : undefined) || undefined;

  return (
    <div className="bg-linear-to-br from-amber-100 via-orange-100 to-pink-100 rounded-2xl p-6 md:p-8">
      <div className="print:hidden">
        <LittleReaderToggle on={littleReader} onChange={setLittleReader} />
      </div>

      {littleReader && printEntry && <LittlePrintSheet entry={printEntry} books={books} lt={lt} />}

      <div className={littleReader ? 'text-center mb-6 print:hidden' : 'text-center mb-6'}>
        <h2 className="text-3xl font-bold mb-2 text-orange-700">{t.title}</h2>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">📝✨</div>
      </div>

      {littleReader ? (
        <div className="print:hidden">
          <LittleJournal books={pickableBooks} lt={lt} onSave={saveLittleEntry} printEntry={printEntry} />
        </div>
      ) : (<>
      <div className="bg-linear-to-r from-orange-400 to-pink-400 text-white rounded-2xl p-6 mb-6">
        <h3 className="text-2xl font-bold mb-3 text-center">{t.howToPlay}</h3>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          {t.howToList.map((line, i) => <li key={i}>{line}</li>)}
        </ol>
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-4 border-orange-300">
          <h3 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            {t.newEntry}
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="aj-book-title" className="block text-sm font-bold text-gray-700 mb-2">{t.bookTitleLabel}</label>
              <Input
                id="aj-book-title"
                value={currentEntry.bookTitle}
                onChange={(e) => setCurrentEntry({ ...currentEntry, bookTitle: e.target.value })}
                placeholder={t.bookTitlePlaceholder}
                className="text-lg border-2 border-orange-300"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="aj-date" className="block text-sm font-bold text-gray-700 mb-2">{t.dateLabel}</label>
                <Input
                  id="aj-date"
                  type="date"
                  value={currentEntry.date}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
                  className="border-2 border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.ratingLabel}</label>
                <div className="flex gap-2" role="group" aria-label={t.ratingLabel}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCurrentEntry({ ...currentEntry, rating: star })}
                      aria-label={`${star} / 5`}
                      aria-pressed={star <= currentEntry.rating}
                      className="text-3xl transition-transform hover:scale-110 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
                    >
                      <span aria-hidden="true">{star <= currentEntry.rating ? '⭐' : '☆'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="aj-fav-char" className="block text-sm font-bold text-gray-700 mb-2">{t.favCharLabel}</label>
              <Input
                id="aj-fav-char"
                value={currentEntry.favoriteCharacter}
                onChange={(e) => setCurrentEntry({ ...currentEntry, favoriteCharacter: e.target.value })}
                placeholder={t.favCharPlaceholder}
                className="border-2 border-orange-300"
              />
            </div>

            <div>
              <label htmlFor="aj-fav-scene" className="block text-sm font-bold text-gray-700 mb-2">{t.favSceneLabel}</label>
              <Input
                id="aj-fav-scene"
                value={currentEntry.favoriteScene}
                onChange={(e) => setCurrentEntry({ ...currentEntry, favoriteScene: e.target.value })}
                placeholder={t.favScenePlaceholder}
                className="border-2 border-orange-300"
              />
            </div>

            <div>
              <label htmlFor="aj-thoughts" className="block text-sm font-bold text-gray-700 mb-2">{t.thoughtsLabel}</label>
              <Textarea
                id="aj-thoughts"
                value={currentEntry.thoughts}
                onChange={(e) => setCurrentEntry({ ...currentEntry, thoughts: e.target.value })}
                placeholder={t.thoughtsPlaceholder}
                rows={4}
                className="border-2 border-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.chooseEmoji}</label>
              <div className="flex flex-wrap gap-2" role="group" aria-label={t.chooseEmoji}>
                {BOOK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setCurrentEntry({ ...currentEntry, emoji })}
                    aria-label={emoji}
                    aria-pressed={currentEntry.emoji === emoji}
                    className={`text-3xl p-2 rounded-lg transition-all hover:scale-110 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500 ${
                      currentEntry.emoji === emoji ? 'bg-orange-300 ring-4 ring-orange-500' : 'bg-gray-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={saveEntry}
              disabled={!currentEntry.bookTitle}
              className="w-full bg-linear-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold py-6 text-lg"
            >
              <Star className="w-5 h-5 mr-2" />
              {t.saveEntry}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center mb-6">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-linear-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            {t.newEntry}
          </Button>
        </div>
      )}
      </>)}

      <div className={littleReader ? 'space-y-4 print:hidden' : 'space-y-4'}>
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-orange-700">{t.journalHeading}</h3>
          {entries.length > 0 && (
            <Button
              onClick={downloadJournal}
              variant="outline"
              className="border-2 border-orange-400 text-orange-700 hover:bg-orange-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {t.downloadJournal}
            </Button>
          )}
        </div>

        {entries.length === 0 ? (
          <Card className="bg-linear-to-br from-yellow-100 to-orange-100 p-12 text-center border-4 border-dashed border-orange-300">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-lg text-gray-600">{t.emptyJournal}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {[...entries].reverse().map((entry) => (
              <Card key={entry.id} className="bg-white p-6 shadow-lg border-l-8 border-orange-400 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {entryCover(entry) ? (
                      <img src={entryCover(entry)} alt="" loading="lazy" className="h-16 w-auto rounded-md" />
                    ) : (
                      <span className="text-5xl">{entry.emoji}</span>
                    )}
                    <div>
                      <h4 className="text-2xl font-bold text-orange-700">{entryTitle(entry, books)}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {entry.date}
                        </span>
                        <span>{'⭐'.repeat(entry.rating)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEntry(entry.id)}
                    aria-label={t.deleteEntryLabel}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                {entryCharacter(entry, lt) && (
                  <div className="mb-3">
                    <span className="font-bold text-purple-700">{t.entryFavChar}</span>
                    <span className="ml-2 text-gray-700">{entryCharacter(entry, lt)}</span>
                  </div>
                )}

                {entryFeeling(entry, lt) && (
                  <div className="mb-3">
                    <span className="font-bold text-pink-700">{lt.feelingLabel}</span>
                    <span className="ml-2 text-gray-700">{entryFeeling(entry, lt)}</span>
                  </div>
                )}

                {entry.favoriteScene && (
                  <div className="mb-3">
                    <span className="font-bold text-blue-700">{t.entryFavScene}</span>
                    <span className="ml-2 text-gray-700">{entry.favoriteScene}</span>
                  </div>
                )}

                {entry.thoughts && (
                  <div className="bg-linear-to-r from-orange-50 to-pink-50 p-4 rounded-lg">
                    <span className="font-bold text-orange-700 block mb-2">{t.entryThoughts}</span>
                    <p className="text-gray-700 leading-relaxed">{entry.thoughts}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
