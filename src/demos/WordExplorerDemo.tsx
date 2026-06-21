import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';

// ---------------------------------------------------------------------------
// Word bank
// ---------------------------------------------------------------------------

type WordEntry = {
  emoji: string;
  en: string;
  es: string;
  fr: string;
  category: CategoryKey;
};

type CategoryKey = 'animals' | 'nature' | 'feelings' | 'virtues' | 'adventure';

const WORDS: WordEntry[] = [
  // Animals
  { emoji: '🦋', en: 'butterfly',   es: 'mariposa',       fr: 'papillon',     category: 'animals' },
  { emoji: '🐘', en: 'elephant',    es: 'elefante',        fr: 'éléphant',     category: 'animals' },
  { emoji: '🦁', en: 'lion',        es: 'león',            fr: 'lion',         category: 'animals' },
  { emoji: '🐳', en: 'whale',       es: 'ballena',         fr: 'baleine',      category: 'animals' },
  { emoji: '🦊', en: 'fox',         es: 'zorro',           fr: 'renard',       category: 'animals' },
  { emoji: '🐢', en: 'turtle',      es: 'tortuga',         fr: 'tortue',       category: 'animals' },
  { emoji: '🦜', en: 'parrot',      es: 'loro',            fr: 'perroquet',    category: 'animals' },
  { emoji: '🐬', en: 'dolphin',     es: 'delfín',          fr: 'dauphin',      category: 'animals' },
  // Nature
  { emoji: '🌳', en: 'forest',      es: 'bosque',          fr: 'forêt',        category: 'nature' },
  { emoji: '🌈', en: 'rainbow',     es: 'arcoíris',        fr: 'arc-en-ciel',  category: 'nature' },
  { emoji: '⛰️',  en: 'mountain',   es: 'montaña',         fr: 'montagne',     category: 'nature' },
  { emoji: '🌊', en: 'ocean',       es: 'océano',          fr: 'océan',        category: 'nature' },
  { emoji: '🌸', en: 'blossom',     es: 'flor',            fr: 'fleur',        category: 'nature' },
  { emoji: '🌙', en: 'moon',        es: 'luna',            fr: 'lune',         category: 'nature' },
  { emoji: '⭐',  en: 'star',       es: 'estrella',        fr: 'étoile',       category: 'nature' },
  { emoji: '💧', en: 'river',       es: 'río',             fr: 'rivière',      category: 'nature' },
  // Feelings
  { emoji: '😊', en: 'happy',       es: 'feliz',           fr: 'heureux',      category: 'feelings' },
  { emoji: '😢', en: 'sad',         es: 'triste',          fr: 'triste',       category: 'feelings' },
  { emoji: '😲', en: 'surprised',   es: 'sorprendido',     fr: 'surpris',      category: 'feelings' },
  { emoji: '😠', en: 'angry',       es: 'enojado',         fr: 'en colère',    category: 'feelings' },
  { emoji: '😨', en: 'scared',      es: 'asustado',        fr: 'effrayé',      category: 'feelings' },
  { emoji: '🤩', en: 'excited',     es: 'emocionado',      fr: 'enthousiaste', category: 'feelings' },
  { emoji: '😌', en: 'calm',        es: 'tranquilo',       fr: 'calme',        category: 'feelings' },
  { emoji: '🥰', en: 'loved',       es: 'amado',           fr: 'aimé',         category: 'feelings' },
  // Virtues
  { emoji: '💛', en: 'kindness',    es: 'bondad',          fr: 'gentillesse',  category: 'virtues' },
  { emoji: '🤝', en: 'respect',     es: 'respeto',         fr: 'respect',      category: 'virtues' },
  { emoji: '🌱', en: 'patience',    es: 'paciencia',       fr: 'patience',     category: 'virtues' },
  { emoji: '🕊️',  en: 'honesty',   es: 'honestidad',      fr: 'honnêteté',    category: 'virtues' },
  { emoji: '🤲', en: 'generosity',  es: 'generosidad',     fr: 'générosité',   category: 'virtues' },
  { emoji: '😄', en: 'joy',         es: 'alegría',         fr: 'joie',         category: 'virtues' },
  { emoji: '🌟', en: 'wisdom',      es: 'sabiduría',       fr: 'sagesse',      category: 'virtues' },
  { emoji: '🫂', en: 'empathy',     es: 'empatía',         fr: 'empathie',     category: 'virtues' },
  // Adventure
  { emoji: '⚔️',  en: 'courage',   es: 'valentía',        fr: 'courage',      category: 'adventure' },
  { emoji: '💎', en: 'treasure',    es: 'tesoro',          fr: 'trésor',       category: 'adventure' },
  { emoji: '🗺️',  en: 'journey',   es: 'viaje',           fr: 'voyage',       category: 'adventure' },
  { emoji: '🏰', en: 'castle',      es: 'castillo',        fr: 'château',      category: 'adventure' },
  { emoji: '🔮', en: 'magic',       es: 'magia',           fr: 'magie',        category: 'adventure' },
  { emoji: '⚓', en: 'voyage',       es: 'travesía',        fr: 'traversée',    category: 'adventure' },
  { emoji: '🧭', en: 'discovery',   es: 'descubrimiento',  fr: 'découverte',   category: 'adventure' },
  { emoji: '🌠', en: 'dream',       es: 'sueño',           fr: 'rêve',         category: 'adventure' },
];

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<Language, Record<CategoryKey, string>> = {
  en: { animals: 'Animals', nature: 'Nature', feelings: 'Feelings', virtues: 'Virtues', adventure: 'Adventure' },
  es: { animals: 'Animales', nature: 'Naturaleza', feelings: 'Emociones', virtues: 'Virtudes', adventure: 'Aventura' },
  fr: { animals: 'Animaux', nature: 'Nature', feelings: 'Émotions', virtues: 'Vertus', adventure: 'Aventure' },
};

const TRANSLATIONS = {
  en: {
    heading: 'Word Explorer',
    subheading: 'Learn new words in English, Spanish, and French!',
    category: 'Category',
    all: 'All',
    flashcardMode: 'Flashcard Mode',
    quizMode: 'Quiz Mode',
    flip: 'Flip',
    cardFront: 'Card front, click to flip',
    cardBack: 'Card back, click to flip',
    next: 'Next',
    previous: 'Previous',
    correct: 'Correct!',
    tryAgain: 'Try again',
    score: 'Score',
    restartQuiz: 'Restart quiz',
    pickTranslation: 'Pick the correct translation:',
    cardOf: 'Card',
    of: 'of',
    questionOf: 'Question',
    langEn: 'English',
    langEs: 'Spanish',
    langFr: 'French',
  },
  es: {
    heading: 'Explorador de palabras',
    subheading: '¡Aprende palabras nuevas en inglés, español y francés!',
    category: 'Categoría',
    all: 'Todas',
    flashcardMode: 'Modo tarjetas',
    quizMode: 'Modo quiz',
    flip: 'Voltear',
    cardFront: 'Frente de la tarjeta, toca para voltear',
    cardBack: 'Reverso de la tarjeta, toca para voltear',
    next: 'Siguiente',
    previous: 'Anterior',
    correct: '¡Correcto!',
    tryAgain: 'Inténtalo de nuevo',
    score: 'Puntuación',
    restartQuiz: 'Reiniciar quiz',
    pickTranslation: 'Elige la traducción correcta:',
    cardOf: 'Tarjeta',
    of: 'de',
    questionOf: 'Pregunta',
    langEn: 'Inglés',
    langEs: 'Español',
    langFr: 'Francés',
  },
  fr: {
    heading: 'Explorateur de mots',
    subheading: 'Apprends de nouveaux mots en anglais, espagnol et français !',
    category: 'Catégorie',
    all: 'Toutes',
    flashcardMode: 'Mode cartes',
    quizMode: 'Mode quiz',
    flip: 'Retourner',
    cardFront: 'Recto de la carte, touchez pour retourner',
    cardBack: 'Verso de la carte, touchez pour retourner',
    next: 'Suivant',
    previous: 'Précédent',
    correct: 'Correct !',
    tryAgain: 'Réessaie',
    score: 'Score',
    restartQuiz: 'Recommencer le quiz',
    pickTranslation: 'Choisis la bonne traduction :',
    cardOf: 'Carte',
    of: 'sur',
    questionOf: 'Question',
    langEn: 'Anglais',
    langEs: 'Espagnol',
    langFr: 'Français',
  },
} satisfies Record<Language, unknown>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(
  pool: WordEntry[],
  correct: WordEntry,
  lang: Language,
  count: number,
): string[] {
  const candidates = pool
    .filter((w) => w !== correct)
    .map((w) => w[lang]);
  const unique = [...new Set(candidates)];
  return shuffle(unique).slice(0, count);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Mode = 'flashcard' | 'quiz';

const LANG_NAMES: Record<Language, Language> = { en: 'en', es: 'es', fr: 'fr' };

export default function WordExplorerDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const catLabels = CATEGORY_LABELS[language] ?? CATEGORY_LABELS.en;

  // Helper: localized language name
  const langLabel = (l: Language): string => {
    const key = LANG_NAMES[l];
    if (key === 'en') return t.langEn;
    if (key === 'es') return t.langEs;
    return t.langFr;
  };

  // --- category filter ---
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>('all');

  const filteredWords = useMemo(
    () => (selectedCategory === 'all' ? WORDS : WORDS.filter((w) => w.category === selectedCategory)),
    [selectedCategory],
  );

  // --- mode ---
  const [mode, setMode] = useState<Mode>('flashcard');

  // --- flashcard state ---
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const safeIndex = Math.min(cardIndex, Math.max(filteredWords.length - 1, 0));
  const currentCard = filteredWords[safeIndex];

  const goNext = () => {
    setCardIndex((i) => (i + 1) % filteredWords.length);
    setFlipped(false);
  };
  const goPrev = () => {
    setCardIndex((i) => (i - 1 + filteredWords.length) % filteredWords.length);
    setFlipped(false);
  };

  // --- quiz state ---
  const [quizWords, setQuizWords] = useState<WordEntry[]>(() => shuffle(WORDS));
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState<string | null>(null);

  const resetQuiz = (pool: WordEntry[] = filteredWords) => {
    setQuizWords(shuffle(pool));
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(null);
    setQuizCorrectAnswer(null);
  };

  const handleCategoryChange = (cat: CategoryKey | 'all') => {
    setSelectedCategory(cat);
    setCardIndex(0);
    setFlipped(false);
    const pool = cat === 'all' ? WORDS : WORDS.filter((w) => w.category === cat);
    resetQuiz(pool);
  };

  const handleModeSwitch = (next: Mode) => {
    setMode(next);
    if (next === 'quiz') resetQuiz();
    else {
      setCardIndex(0);
      setFlipped(false);
    }
  };

  // Quiz derived values
  const qWords = quizWords.filter((w) =>
    selectedCategory === 'all' ? true : w.category === selectedCategory,
  );
  const quizWord = qWords.length > 0 ? qWords[quizIndex % qWords.length] : null;
  const targetLang: Language = language === 'en' ? 'es' : language === 'es' ? 'fr' : 'en';
  const correctOption = quizWord ? quizWord[targetLang] : '';
  const distractors = useMemo(
    () =>
      quizWord
        ? pickDistractors(
            selectedCategory === 'all' ? WORDS : WORDS.filter((w) => w.category === selectedCategory),
            quizWord,
            targetLang,
            2,
          )
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quizIndex, quizWords, language, selectedCategory],
  );
  const options = useMemo(
    () => (quizWord ? shuffle([correctOption, ...distractors]) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quizIndex, quizWords, language, selectedCategory],
  );

  const handleQuizAnswer = (option: string) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(option);
    setQuizCorrectAnswer(correctOption);
    if (option === correctOption) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex + 1 >= qWords.length) {
      setQuizWords(shuffle(qWords));
      setQuizIndex(0);
    } else {
      setQuizIndex((i) => i + 1);
    }
    setQuizAnswered(null);
    setQuizCorrectAnswer(null);
  };

  const categories: (CategoryKey | 'all')[] = [
    'all', 'animals', 'nature', 'feelings', 'virtues', 'adventure',
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-6 md:p-8 min-h-[500px]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🔤</div>
        <h2 className="text-3xl font-bold text-teal-700 mb-1">{t.heading}</h2>
        <p className="text-gray-600">{t.subheading}</p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center gap-3 mb-6">
        <Button
          onClick={() => handleModeSwitch('flashcard')}
          className={`rounded-full px-5 py-2 font-semibold transition-all ${
            mode === 'flashcard'
              ? 'bg-teal-500 text-white shadow-md'
              : 'bg-white text-teal-700 border border-teal-300 hover:bg-teal-50'
          }`}
        >
          {t.flashcardMode}
        </Button>
        <Button
          onClick={() => handleModeSwitch('quiz')}
          className={`rounded-full px-5 py-2 font-semibold transition-all ${
            mode === 'quiz'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-white text-purple-700 border border-purple-300 hover:bg-purple-50'
          }`}
        >
          {t.quizMode}
        </Button>
      </div>

      {/* Category filter chips */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-600 mb-2 text-center">{t.category}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-4 py-1 text-sm font-medium border transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-white border-teal-500 shadow'
                  : 'bg-white text-teal-700 border-teal-300 hover:bg-teal-50'
              }`}
            >
              {cat === 'all' ? t.all : catLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FLASHCARD MODE                                                       */}
      {/* ------------------------------------------------------------------ */}
      {mode === 'flashcard' && currentCard && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500">
            {t.cardOf} {safeIndex + 1} {t.of} {filteredWords.length}
          </p>

          {/* Card */}
          <div
            className="w-full max-w-sm min-h-[220px] rounded-2xl border-4 border-teal-300 bg-white shadow-lg flex flex-col items-center justify-center gap-3 p-6 cursor-pointer select-none"
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f);
            }}
            aria-label={flipped ? t.cardBack : t.cardFront}
          >
            {!flipped ? (
              <>
                <span className="text-6xl">{currentCard.emoji}</span>
                <span className="text-3xl font-bold text-gray-800">{currentCard[language]}</span>
                <span className="text-xs text-gray-400 mt-2 uppercase tracking-widest">
                  {langLabel(language)}
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="text-5xl">{currentCard.emoji}</span>
                {(['en', 'es', 'fr'] as Language[])
                  .filter((l) => l !== language)
                  .map((l) => (
                    <div key={l} className="flex flex-col items-center">
                      <span className="text-xs text-gray-400 uppercase tracking-widest">
                        {langLabel(l)}
                      </span>
                      <span className="text-2xl font-bold text-teal-700">{currentCard[l]}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Flip button */}
          <Button
            onClick={() => setFlipped((f) => !f)}
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-6"
          >
            {t.flip}
          </Button>

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              onClick={goPrev}
              variant="outline"
              className="rounded-full border-teal-300 text-teal-700 hover:bg-teal-50"
            >
              {t.previous}
            </Button>
            <Button
              onClick={goNext}
              variant="outline"
              className="rounded-full border-teal-300 text-teal-700 hover:bg-teal-50"
            >
              {t.next}
            </Button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* QUIZ MODE                                                            */}
      {/* ------------------------------------------------------------------ */}
      {mode === 'quiz' && quizWord && (
        <div className="flex flex-col items-center gap-4">
          {/* Score + restart */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600">
              {t.score}: {quizScore} / {quizIndex + 1}
            </span>
            <Button
              onClick={() => resetQuiz()}
              variant="outline"
              size="sm"
              className="rounded-full border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {t.restartQuiz}
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            {t.questionOf} {quizIndex + 1} {t.of} {qWords.length}
          </p>

          {/* Word to translate */}
          <div className="w-full max-w-sm min-h-[120px] rounded-2xl border-4 border-purple-300 bg-white shadow-lg flex flex-col items-center justify-center gap-2 p-6">
            <span className="text-5xl">{quizWord.emoji}</span>
            <span className="text-3xl font-bold text-gray-800">{quizWord[language]}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">
              {langLabel(language)}
            </span>
          </div>

          {/* Question label */}
          <p className="text-sm font-semibold text-gray-600 text-center">
            {t.pickTranslation} ({langLabel(targetLang)})
          </p>

          {/* Options */}
          <div className="w-full max-w-sm flex flex-col gap-3">
            {options.map((opt) => {
              const isChosen = quizAnswered === opt;
              const isCorrect = opt === quizCorrectAnswer;
              let btnClass =
                'w-full rounded-xl text-base font-semibold py-3 border-2 transition-all ';
              if (quizAnswered === null) {
                btnClass +=
                  'bg-white text-gray-800 border-gray-200 hover:border-purple-400 hover:bg-purple-50';
              } else if (isCorrect) {
                btnClass += 'bg-green-100 border-green-500 text-green-800';
              } else if (isChosen) {
                btnClass += 'bg-red-100 border-red-400 text-red-800';
              } else {
                btnClass += 'bg-white text-gray-400 border-gray-200 opacity-60';
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleQuizAnswer(opt)}
                  disabled={quizAnswered !== null}
                  className={btnClass}
                >
                  {isChosen && quizAnswered !== null && (
                    <>
                      {isCorrect ? (
                        <CheckCircle2 className="inline w-4 h-4 mr-2 text-green-600" />
                      ) : (
                        <XCircle className="inline w-4 h-4 mr-2 text-red-500" />
                      )}
                    </>
                  )}
                  {!isChosen && isCorrect && quizAnswered !== null && (
                    <CheckCircle2 className="inline w-4 h-4 mr-2 text-green-600" />
                  )}
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback + Next */}
          {quizAnswered !== null && (
            <div className="flex flex-col items-center gap-3">
              <p
                className={`font-bold text-lg ${
                  quizAnswered === quizCorrectAnswer ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {quizAnswered === quizCorrectAnswer ? t.correct : t.tryAgain}
              </p>
              <Button
                onClick={handleNextQuestion}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6"
              >
                {t.next}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
