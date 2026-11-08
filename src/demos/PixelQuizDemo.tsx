// Pixel's Story Quiz (activities audit 2026-11, §5c item 4): a spoken, picture-choice quiz for
// pre-readers (3-6), played right after a read-aloud. Built only from catalog data, so it can
// never disagree with the book:
//  - "Which picture was in the story?" uses four of the book's story words (bookVocab), each
//    beside two story words from OTHER books that the book's own description never mentions;
//  - "Let's talk" reads the book's own "after reading" prompt aloud.
// No score, no wrong-answer penalty, nothing stored. Opened with ?book=<id>; without one, the
// grown-up picks a book.
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks, books as CATALOG } from '../data/books';
import { bookVocab, type VocabWord } from '../data/bookVocab.data';
import { useLanguage, useTranslation } from '../lib/language';
import { buildRounds } from '../lib/pixelQuiz';
import { isSpeechSupported, play } from '../lib/speech';
import { useSourceBook, SOURCE_BOOK_PARAM } from '../lib/sourceBook';
import ReadAloudButton from '../components/ReadAloudButton';
import { StudioFrame, Panel, Printable, StudioActions, StepLabel, Choice } from './studio/StudioFrame';

const SLUG = 'pixel-quiz';
const SPEECH_ID = 'pixel-quiz';
const FEELINGS = ['😊', '😮', '😢', '🤔'] as const;

const TRANSLATIONS = {
  en: {
    skill: 'Listening and recall', title: 'Pixel’s Story Quiz', subtitle: 'After the read-aloud, Pixel the butterfly asks about the story with pictures and a voice, so children who don’t read yet can answer.', grownup: 'Read the book first, then sit beside your child',
    pick: 'Choose the book you just read', pickPh: 'Pick a book…', noBook: 'Choose a book above and Pixel will ask about it.',
    hello: 'Hi, I’m Pixel! Did you just hear a story? Let’s play!', start: 'Start with Pixel', quiet: 'Your device can’t speak, so read Pixel’s words aloud to your child.',
    q: 'Which picture was in the story?', step: (n: number, of: number) => `Picture ${n} of ${of}`,
    yes: (w: string) => `Yes! “${w}” was in the story!`, no: 'Not that one. Try again!', next: 'Next picture', toTalk: 'Let’s talk',
    talk: 'Let’s talk about it', talkIntro: 'Pixel asks a question with no wrong answer. Listen, then talk about it together.', feel: 'How did the story make you feel? Tap a face.',
    feelings: { '😊': 'happy', '😮': 'surprised', '😢': 'sad', '🤔': 'thoughtful' },
    done: 'Finish', again: 'Play again', listenQ: 'Listen to the question', listenP: 'Listen to Pixel’s question',
    cardLabel: 'Pixel’s story badge', badge: 'Pixel’s Story Badge', found: 'I found the story pictures from', felt: 'The story made me feel', draw: 'Draw your favorite part of the story.', ask: 'Pixel asked:',
  },
  es: {
    skill: 'Escuchar y recordar', title: 'El quiz de Pixel', subtitle: 'Después de leer en voz alta, Pixel la mariposa pregunta por el cuento con dibujos y con voz, para que respondan también quienes aún no leen.', grownup: 'Primero lee el libro y luego siéntate junto a tu peque',
    pick: 'Elige el libro que acaban de leer', pickPh: 'Elige un libro…', noBook: 'Elige un libro arriba y Pixel hará preguntas sobre él.',
    hello: '¡Hola, soy Pixel! ¿Acabas de escuchar un cuento? ¡Vamos a jugar!', start: 'Empezar con Pixel', quiet: 'Tu dispositivo no puede hablar: lee en voz alta lo que dice Pixel.',
    q: '¿Qué dibujo estaba en el cuento?', step: (n: number, of: number) => `Dibujo ${n} de ${of}`,
    yes: (w: string) => `¡Sí! «${w}» estaba en el cuento.`, no: 'Ese no. ¡Prueba otra vez!', next: 'Siguiente dibujo', toTalk: 'Vamos a hablar',
    talk: 'Vamos a hablar', talkIntro: 'Pixel hace una pregunta sin respuestas equivocadas. Escuchen y hablen juntos.', feel: '¿Qué sentiste con el cuento? Toca una cara.',
    feelings: { '😊': 'alegría', '😮': 'sorpresa', '😢': 'tristeza', '🤔': 'curiosidad' },
    done: 'Terminar', again: 'Jugar otra vez', listenQ: 'Escuchar la pregunta', listenP: 'Escuchar la pregunta de Pixel',
    cardLabel: 'Insignia del cuento de Pixel', badge: 'Insignia del cuento de Pixel', found: 'Encontré los dibujos del cuento', felt: 'El cuento me hizo sentir', draw: 'Dibuja tu parte favorita del cuento.', ask: 'Pixel preguntó:',
  },
  fr: {
    skill: 'Écoute et mémoire', title: 'Le quiz de Pixel', subtitle: 'Après la lecture à voix haute, Pixel le papillon pose des questions sur l’histoire avec des images et une voix, pour que les enfants qui ne lisent pas encore puissent répondre.', grownup: 'Lisez d’abord le livre, puis asseyez-vous à côté de votre enfant',
    pick: 'Choisis le livre que vous venez de lire', pickPh: 'Choisis un livre…', noBook: 'Choisis un livre ci-dessus et Pixel posera ses questions.',
    hello: 'Bonjour, je suis Pixel ! Tu viens d’écouter une histoire ? On joue !', start: 'Commencer avec Pixel', quiet: 'Ton appareil ne peut pas parler : lis à voix haute ce que dit Pixel.',
    q: 'Quelle image était dans l’histoire ?', step: (n: number, of: number) => `Image ${n} sur ${of}`,
    yes: (w: string) => `Oui ! « ${w} » était dans l’histoire !`, no: 'Pas cette image. Essaie encore !', next: 'Image suivante', toTalk: 'On en parle',
    talk: 'On en parle', talkIntro: 'Pixel pose une question sans mauvaise réponse. Écoutez, puis parlez-en ensemble.', feel: 'Qu’as-tu ressenti avec cette histoire ? Touche un visage.',
    feelings: { '😊': 'de la joie', '😮': 'de la surprise', '😢': 'de la tristesse', '🤔': 'de la curiosité' },
    done: 'Terminer', again: 'Rejouer', listenQ: 'Écouter la question', listenP: 'Écouter la question de Pixel',
    cardLabel: 'Badge de l’histoire de Pixel', badge: 'Badge de l’histoire de Pixel', found: 'J’ai trouvé les images de l’histoire', felt: 'Avec cette histoire, j’ai ressenti', draw: 'Dessine ton passage préféré de l’histoire.', ask: 'Pixel a demandé :',
  },
};

type Stage = 'intro' | 'quiz' | 'talk' | 'done';

export default function PixelQuizDemo() {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const books = useBooks();
  const [, setParams] = useSearchParams();
  const bookId = useSourceBook(SLUG);
  const [stage, setStage] = useState<Stage>('intro');
  const [round, setRound] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [right, setRight] = useState(false);
  const [feeling, setFeeling] = useState<(typeof FEELINGS)[number] | null>(null);

  const book = bookId ? books.find((b) => b.id === bookId) : undefined;
  const raw = bookId ? CATALOG.find((b) => b.id === bookId) : undefined;
  const after = raw?.discussionQuestions?.find((q) => q.stage === 'after')?.prompt[language] ?? '';
  const rounds = bookId ? buildRounds(bookId) : [];
  const current = rounds[round];
  const say = (text: string) => play(SPEECH_ID, text, language);

  const reset = () => { setStage('intro'); setRound(0); setWrong([]); setRight(false); setFeeling(null); };
  const choose = (w: VocabWord) => {
    if (right || !current) return;
    if (w.emoji === current.answer.emoji) { setRight(true); say(t.yes(w[language])); }
    else { setWrong((x) => [...x, w.emoji]); say(t.no); }
  };
  const next = () => {
    setRight(false); setWrong([]);
    if (round + 1 < rounds.length) { setRound(round + 1); say(t.q); }
    else { setStage('talk'); say(`${t.talk}. ${after}`); }
  };

  return (
    <StudioFrame emoji="🦋" hue="sky" skill={t.skill} title={book ? `${t.title}: ${book.title}` : t.title} subtitle={t.subtitle} ages="3-6" minutes={10} bookIds={bookId ? [bookId] : []} grownup={t.grownup} printHero={false}>
      <Panel className="mb-6">
        <label className="block text-sm font-semibold text-gray-700">
          <span className="block mb-1">{t.pick}</span>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500"
            value={bookId ?? ''}
            onChange={(e) => { reset(); setParams(e.target.value ? { [SOURCE_BOOK_PARAM]: e.target.value } : {}, { replace: true }); }}
          >
            <option value="">{t.pickPh}</option>
            {books.filter((b) => (bookVocab[b.id] ?? []).length >= 8).map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
        </label>
      </Panel>

      {!book || rounds.length === 0 ? (
        <p className="text-center text-gray-500 py-10" role="status">{t.noBook}</p>
      ) : stage === 'intro' ? (
        <Panel className="text-center">
          {book.coverImage && <img src={book.coverImage} alt={book.title} width={120} height={120} loading="lazy" className="mx-auto mb-4 h-32 w-auto rounded-lg shadow-sm" />}
          <p className="text-5xl mb-3" aria-hidden>🦋</p>
          <p className="text-xl font-bold text-gray-800 mb-4">{t.hello}</p>
          {!isSpeechSupported() && <p className="text-sm text-gray-600 mb-4">{t.quiet}</p>}
          <button type="button" className="btn-primary text-lg" onClick={() => { setStage('quiz'); say(`${t.hello} ${t.q}`); }}>{t.start}</button>
        </Panel>
      ) : stage === 'quiz' && current ? (
        <Panel>
          <p className="text-sm font-semibold text-sky-800 mb-1">{t.step(round + 1, rounds.length)}</p>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StepLabel n="🦋">{t.q}</StepLabel>
            <ReadAloudButton compact text={t.q} label={t.listenQ} />
          </div>
          <ul className="grid grid-cols-3 gap-3 sm:gap-4">
            {current.choices.map((w) => {
              const isAnswer = w.emoji === current.answer.emoji;
              const off = wrong.includes(w.emoji);
              return (
                <li key={w.emoji}>
                  <button
                    type="button"
                    onClick={() => choose(w)}
                    disabled={off || (right && !isAnswer)}
                    aria-label={w[language]}
                    data-quiz-choice={isAnswer ? 'story' : 'other'}
                    className={`w-full min-h-32 rounded-2xl border-4 flex flex-col items-center justify-center gap-1 p-3 transition-colors focus:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-400 ${right && isAnswer ? 'border-emerald-500 bg-emerald-50' : off ? 'border-gray-200 bg-gray-100 opacity-40' : 'border-sky-200 bg-white hover:border-sky-400'}`}
                  >
                    <span aria-hidden className="text-6xl leading-none">{w.emoji}</span>
                    <span lang={language} className="text-sm font-semibold text-gray-700">{w[language]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p role="status" className="min-h-8 mt-4 text-center text-lg font-bold text-gray-800">
            {right ? t.yes(current.answer[language]) : wrong.length > 0 ? t.no : ''}
          </p>
          {right && (
            <div className="text-center mt-2">
              <button type="button" className="btn-primary text-lg" onClick={next}>{round + 1 < rounds.length ? t.next : t.toTalk}</button>
            </div>
          )}
        </Panel>
      ) : stage === 'talk' ? (
        <Panel>
          <StepLabel n="💬">{t.talk}</StepLabel>
          <p className="text-sm text-gray-600 mb-4">{t.talkIntro}</p>
          <blockquote className="rounded-xl bg-white border-2 border-sky-200 p-4 text-lg text-gray-800 mb-3" lang={language}>🦋 {after}</blockquote>
          <ReadAloudButton compact text={after} label={t.listenP} />
          <p className="font-semibold text-gray-800 mt-6 mb-2">{t.feel}</p>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mb-6">
            {FEELINGS.map((f) => (
              <Choice key={f} selected={feeling === f} onSelect={() => setFeeling(f)} label={t.feelings[f]} className="text-4xl sm:text-5xl text-center! py-3">{f}</Choice>
            ))}
          </div>
          <button type="button" className="btn-primary text-lg" onClick={() => setStage('done')}>{t.done}</button>
        </Panel>
      ) : (
        <>
          <Printable label={t.cardLabel}>
            <div className="text-center">
              <p className="text-5xl mb-2" aria-hidden>🦋🏅</p>
              <h3 className="text-2xl font-bold text-gray-800">{t.badge}</h3>
              <p className="text-gray-700 mt-2">{t.found} <strong>{book.title}</strong></p>
              <p aria-hidden className="text-5xl tracking-widest mt-3">{rounds.map((r) => r.answer.emoji).join(' ')}</p>
              {feeling && <p className="text-gray-700 mt-3">{t.felt} {feeling} <span lang={language}>{t.feelings[feeling]}</span></p>}
            </div>
            <p className="mt-5 text-sm text-gray-700"><strong>{t.ask}</strong> {after}</p>
            <p className="mt-4 text-sm font-semibold text-gray-800">{t.draw}</p>
            <div aria-hidden className="h-48 print:h-72 mt-2 rounded-lg border-2 border-dashed border-gray-400" />
          </Printable>
          <StudioActions onReset={reset} />
        </>
      )}
    </StudioFrame>
  );
}
