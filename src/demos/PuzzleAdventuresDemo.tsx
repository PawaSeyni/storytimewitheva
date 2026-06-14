import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, Lightbulb, Eye } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';

type Scramble = { scrambled: string; answer: string; emoji: string; hint: string };
type Pair = { id: number; name: string };
type Riddle = { q: string; a: string; hint: string };
type LogicPuzzle = {
  description: string;
  clues: string[];
  question: string;
  answer: string;
  hint: string;
};

// Per-language scramble pools - the scramble + answer pair must be in the same language.
const SCRAMBLED_BY_LANG: Record<Language, Scramble[]> = {
  en: [
    { scrambled: 'KNITHG', answer: 'KNIGHT', emoji: '⚔️', hint: 'A warrior in shining armor who serves a king or queen.' },
    { scrambled: 'GICALMA', answer: 'MAGICAL', emoji: '✨', hint: 'Describes something with mysterious enchanted powers.' },
    { scrambled: 'REUSTAER', answer: 'TREASURE', emoji: '💰', hint: 'What pirates bury and adventurers seek — gold, gems, and other riches.' },
  ],
  es: [
    { scrambled: 'BLEACALOR', answer: 'CABALLERO', emoji: '⚔️', hint: 'Un guerrero con armadura brillante que sirve a un rey o una reina.' },
    { scrambled: 'GMICAO', answer: 'MAGICO', emoji: '✨', hint: 'Algo con misteriosos poderes encantados (sin tilde).' },
    { scrambled: 'OTSREO', answer: 'TESORO', emoji: '💰', hint: 'Lo que los piratas entierran y los aventureros buscan: oro, gemas y otras riquezas.' },
  ],
  fr: [
    { scrambled: 'VHEACILER', answer: 'CHEVALIER', emoji: '⚔️', hint: 'Un guerrier en armure brillante qui sert un roi ou une reine.' },
    { scrambled: 'IQEUGAM', answer: 'MAGIQUE', emoji: '✨', hint: 'Décrit quelque chose qui a de mystérieux pouvoirs enchantés.' },
    { scrambled: 'ROSTER', answer: 'TRESOR', emoji: '💰', hint: 'Ce que les pirates enterrent et que les aventuriers cherchent : or, gemmes et autres richesses (sans accent).' },
  ],
};

const RIDDLES_BY_LANG: Record<Language, Riddle[]> = {
  en: [
    { q: "I have a crown but I'm not a king. I live in a tower and sometimes I sing. Who am I?", a: 'A Princess! 👑', hint: 'Royal, lives in a castle tower, often the hero of fairy tales.' },
    { q: 'I breathe fire and have scales so bright, I guard treasure both day and night. What am I?', a: 'A Dragon! 🐉', hint: 'A scaly, fire-breathing creature from fantasy stories.' },
    { q: "I'm not real but I feel true, I take you to worlds shiny and new. You find me in books, what am I to you?", a: 'A Story! 📚', hint: "Made of words on pages — you're inside one right now!" },
    { q: 'I wear a pointy hat and cast spells with my wand, I make magic happen with a wave and beyond. Who am I?', a: 'A Wizard! 🧙‍♂️', hint: 'Think of Merlin or Gandalf — uses wands and spells.' },
    { q: 'I come out at night with wings so small, I grant wishes when you call. Sprinkle dust and you might fly. What am I, floating in the sky?', a: 'A Fairy! 🧚', hint: 'Tiny, winged, sprinkles pixie dust.' },
  ],
  es: [
    { q: 'Tengo una corona pero no soy un rey. Vivo en una torre y a veces canto. ¿Quién soy?', a: '¡Una princesa! 👑', hint: 'De la realeza, vive en una torre, suele ser la heroína de los cuentos de hadas.' },
    { q: 'Echo fuego y tengo escamas brillantes, guardo tesoros día y noche. ¿Qué soy?', a: '¡Un dragón! 🐉', hint: 'Una criatura con escamas que escupe fuego, de los cuentos de fantasía.' },
    { q: 'No soy real, pero parezco verdad; te llevo a mundos por descubrir. Me encuentras en libros, ¿qué soy para ti?', a: '¡Un cuento! 📚', hint: '¡Hecho de palabras en páginas: ahora mismo estás dentro de uno!' },
    { q: 'Llevo un sombrero puntiagudo y lanzo hechizos con mi varita, hago magia con un gesto y más allá. ¿Quién soy?', a: '¡Un mago! 🧙‍♂️', hint: 'Piensa en Merlín o Gandalf: usan varita y hechizos.' },
    { q: 'Salgo de noche con alitas pequeñas, cumplo deseos cuando me llaman. Esparzo polvillo y a volar. ¿Qué soy, allí en el cielo?', a: '¡Un hada! 🧚', hint: 'Diminuta, con alas, esparce polvo mágico.' },
  ],
  fr: [
    { q: 'J\'ai une couronne mais je ne suis pas roi. Je vis dans une tour et parfois je chante. Qui suis-je ?', a: 'Une princesse ! 👑', hint: 'De sang royal, vit dans une tour, souvent l\'héroïne des contes de fées.' },
    { q: 'Je crache du feu et j\'ai des écailles brillantes, je garde un trésor jour et nuit. Qui suis-je ?', a: 'Un dragon ! 🐉', hint: 'Une créature à écailles qui crache du feu, venue des contes fantastiques.' },
    { q: 'Je ne suis pas réelle mais je semble vraie, je t\'emmène dans des mondes nouveaux. Tu me trouves dans les livres, qui suis-je pour toi ?', a: 'Une histoire ! 📚', hint: 'Faite de mots sur des pages — tu es en train d\'en lire une !' },
    { q: 'Je porte un chapeau pointu et je jette des sorts avec ma baguette, je fais de la magie d\'un geste et plus encore. Qui suis-je ?', a: 'Un magicien ! 🧙‍♂️', hint: 'Pense à Merlin ou Gandalf — baguette et sortilèges.' },
    { q: 'Je sors la nuit avec de minuscules ailes, j\'exauce les vœux quand on m\'appelle. Saupoudre de la poussière et tu pourrais voler. Qui suis-je, là-haut dans le ciel ?', a: 'Une fée ! 🧚', hint: 'Toute petite, ailée, saupoudre de la poudre magique.' },
  ],
};

const CHARACTERS_BY_LANG: Record<Language, Pair[]> = {
  en: [
    { id: 1, name: 'Red Riding Hood 🧺' },
    { id: 2, name: 'Cinderella 👗' },
    { id: 3, name: 'Jack 🌱' },
    { id: 4, name: 'Snow White 🍎' },
  ],
  es: [
    { id: 1, name: 'Caperucita Roja 🧺' },
    { id: 2, name: 'Cenicienta 👗' },
    { id: 3, name: 'Juan 🌱' },
    { id: 4, name: 'Blancanieves 🍎' },
  ],
  fr: [
    { id: 1, name: 'Le Petit Chaperon Rouge 🧺' },
    { id: 2, name: 'Cendrillon 👗' },
    { id: 3, name: 'Jack 🌱' },
    { id: 4, name: 'Blanche-Neige 🍎' },
  ],
};

const STORIES_BY_LANG: Record<Language, Pair[]> = {
  en: [
    { id: 3, name: 'Beanstalk 🏰' },
    { id: 1, name: 'Wolf & Grandma 🐺' },
    { id: 4, name: 'Seven Dwarfs ⛏️' },
    { id: 2, name: 'Glass Slipper 👠' },
  ],
  es: [
    { id: 3, name: 'Habichuelas mágicas 🏰' },
    { id: 1, name: 'Lobo y abuelita 🐺' },
    { id: 4, name: 'Siete enanitos ⛏️' },
    { id: 2, name: 'Zapatilla de cristal 👠' },
  ],
  fr: [
    { id: 3, name: 'Haricot magique 🏰' },
    { id: 1, name: 'Loup & Grand-mère 🐺' },
    { id: 4, name: 'Sept Nains ⛏️' },
    { id: 2, name: 'Pantoufle de verre 👠' },
  ],
};

const LOGIC_BY_LANG: Record<Language, LogicPuzzle> = {
  en: {
    description: 'Three friends went on an adventure. Each found a different magical item.',
    clues: [
      "Emma didn't find the sword",
      'The person who found the crown lives in a castle',
      'Oliver found the magical sword',
      'Sophia lives in the enchanted forest',
    ],
    question: 'Question: Who found the crown?',
    answer: 'EMMA',
    hint: "If Oliver has the sword, Sophia lives in the forest (not a castle), and the crown's owner lives in a castle — who's left?",
  },
  es: {
    description: 'Tres amigos salieron de aventura. Cada uno encontró un objeto mágico diferente.',
    clues: [
      'Emma no encontró la espada',
      'La persona que encontró la corona vive en un castillo',
      'Oliver encontró la espada mágica',
      'Sophia vive en el bosque encantado',
    ],
    question: 'Pregunta: ¿Quién encontró la corona?',
    answer: 'EMMA',
    hint: 'Si Oliver tiene la espada y Sophia vive en el bosque (no en un castillo), y quien tiene la corona vive en un castillo, ¿quién queda?',
  },
  fr: {
    description: 'Trois amis partent à l\'aventure. Chacun trouve un objet magique différent.',
    clues: [
      'Emma n\'a pas trouvé l\'épée',
      'La personne qui a trouvé la couronne vit dans un château',
      'Oliver a trouvé l\'épée magique',
      'Sophia vit dans la forêt enchantée',
    ],
    question: 'Question : qui a trouvé la couronne ?',
    answer: 'EMMA',
    hint: 'Si Oliver a l\'épée et que Sophia vit dans la forêt (pas dans un château), et que le propriétaire de la couronne vit dans un château, qui reste-t-il ?',
  },
};

const TRANSLATIONS = {
  en: {
    heading: "Eva's Puzzle Paradise",
    subheading: 'Challenge your mind with fun word games and riddles!',
    howToPlay: '✨ How to Play ✨',
    howToPlaySteps: [
      'Try different puzzle types: word scrambles, riddles, matching, and logic!',
      'Use the 💡 Hint button if you get stuck',
      'After 3 tries, you can see the solution',
      'Complete puzzles to earn points',
      'Solve all four sections to become a Puzzle Master!',
    ],
    completed: 'Puzzles Completed:',
    scrambleHeading: '🔄 Unscramble the Story Words',
    scrambleBlurb: 'Can you figure out these mixed-up storybook words?',
    unscramble: 'Unscramble the word...',
    checkAnswer: 'Check Answer',
    getHint: 'Get Hint',
    attemptsLeft: 'Attempts left:',
    showSolution: 'Show Solution',
    answerIs: 'The answer is:',
    correct: 'Correct! Great job!',
    notQuite: 'Not quite. Try again!',
    riddleHeading: '🤔 Storybook Riddles',
    riddleBlurb: 'Can you solve these clever riddles?',
    showAnswer: 'Show Answer',
    hint: 'Hint',
    matchingHeading: '🔗 Match Characters to Their Stories',
    matchingBlurb: 'Click on a character, then click on their story!',
    characters: 'Characters',
    stories: 'Stories',
    matchingHint: 'Match each fairy-tale character to the thing they are most famous for.',
    perfectMatch: 'Perfect match!',
    notMatch: 'Not a match. Try again!',
    allMatched: '🎉 All matched! Nice work!',
    logicHeading: '🧠 Story Logic Puzzle',
    mystery: 'The Mystery:',
    clues: 'Clues:',
    typeName: 'Type the name...',
    brilliantLogic: 'Brilliant! Emma found the crown!',
    notQuiteLogic: 'Not quite. Read the clues carefully!',
    masterHeading: 'Great Job, Puzzle Master!',
    masterBlurb: 'Keep practicing to become even smarter!',
  },
  es: {
    heading: 'Paraíso de acertijos de Eva',
    subheading: '¡Pon a prueba tu mente con juegos de palabras y acertijos divertidos!',
    howToPlay: '✨ Cómo se juega ✨',
    howToPlaySteps: [
      '¡Prueba distintos tipos de puzzle: anagramas, acertijos, parejas y lógica!',
      'Usa el botón 💡 Pista si te atascas',
      'Tras 3 intentos puedes ver la solución',
      'Completa puzzles para ganar puntos',
      '¡Resuelve las cuatro secciones para ser maestro del puzzle!',
    ],
    completed: 'Acertijos completados:',
    scrambleHeading: '🔄 Descifra las palabras del cuento',
    scrambleBlurb: '¿Puedes descubrir estas palabras mezcladas?',
    unscramble: 'Descifra la palabra...',
    checkAnswer: 'Comprobar respuesta',
    getHint: 'Pedir pista',
    attemptsLeft: 'Intentos restantes:',
    showSolution: 'Ver solución',
    answerIs: 'La respuesta es:',
    correct: '¡Correcto! ¡Muy bien!',
    notQuite: 'No del todo. ¡Inténtalo de nuevo!',
    riddleHeading: '🤔 Acertijos del cuento',
    riddleBlurb: '¿Puedes resolver estos acertijos ingeniosos?',
    showAnswer: 'Ver respuesta',
    hint: 'Pista',
    matchingHeading: '🔗 Une cada personaje con su cuento',
    matchingBlurb: '¡Pulsa un personaje y luego su cuento!',
    characters: 'Personajes',
    stories: 'Cuentos',
    matchingHint: 'Une cada personaje de cuento con aquello por lo que es más famoso.',
    perfectMatch: '¡Pareja perfecta!',
    notMatch: 'No coincide. ¡Inténtalo de nuevo!',
    allMatched: '🎉 ¡Todo emparejado! ¡Buen trabajo!',
    logicHeading: '🧠 Puzzle de lógica del cuento',
    mystery: 'El misterio:',
    clues: 'Pistas:',
    typeName: 'Escribe el nombre...',
    brilliantLogic: '¡Genial! ¡Emma encontró la corona!',
    notQuiteLogic: 'No del todo. ¡Lee las pistas con atención!',
    masterHeading: '¡Buen trabajo, maestro del puzzle!',
    masterBlurb: '¡Sigue practicando para ser aún más listo!',
  },
  fr: {
    heading: 'Le paradis des énigmes d\'Eva',
    subheading: 'Mets ton cerveau à l\'épreuve avec des jeux de mots et des énigmes !',
    howToPlay: '✨ Comment ça marche ✨',
    howToPlaySteps: [
      'Essaie différents types de puzzles : anagrammes, énigmes, paires et logique !',
      'Utilise le bouton 💡 Indice si tu es bloqué',
      'Après 3 essais, tu peux voir la solution',
      'Complète les puzzles pour gagner des points',
      'Résous les quatre sections pour devenir maître des énigmes !',
    ],
    completed: 'Énigmes complétées :',
    scrambleHeading: '🔄 Déchiffre les mots du conte',
    scrambleBlurb: 'Peux-tu déchiffrer ces mots mélangés ?',
    unscramble: 'Déchiffre le mot...',
    checkAnswer: 'Vérifier',
    getHint: 'Demander un indice',
    attemptsLeft: 'Essais restants :',
    showSolution: 'Voir la solution',
    answerIs: 'La réponse est :',
    correct: 'Bravo ! Bien joué !',
    notQuite: 'Pas tout à fait. Réessaie !',
    riddleHeading: '🤔 Devinettes du conte',
    riddleBlurb: 'Peux-tu résoudre ces devinettes malines ?',
    showAnswer: 'Voir la réponse',
    hint: 'Indice',
    matchingHeading: '🔗 Associe chaque personnage à son histoire',
    matchingBlurb: 'Clique sur un personnage, puis sur son histoire !',
    characters: 'Personnages',
    stories: 'Histoires',
    matchingHint: 'Associe chaque personnage de conte de fées à ce qui le rend le plus célèbre.',
    perfectMatch: 'Bien associé !',
    notMatch: 'Ce n\'est pas le bon. Réessaie !',
    allMatched: '🎉 Tout est associé ! Bien joué !',
    logicHeading: '🧠 Puzzle de logique du conte',
    mystery: 'Le mystère :',
    clues: 'Indices :',
    typeName: 'Tape le prénom...',
    brilliantLogic: 'Génial ! Emma a trouvé la couronne !',
    notQuiteLogic: 'Pas tout à fait. Relis bien les indices !',
    masterHeading: 'Bravo, maître des énigmes !',
    masterBlurb: 'Continue à t\'entraîner pour devenir encore plus malin !',
  },
} satisfies Record<Language, unknown>;

type Feedback = '' | 'correct' | 'incorrect' | 'revealed';

export default function PuzzleAdventuresDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);

  const scrambledWords = SCRAMBLED_BY_LANG[language] ?? SCRAMBLED_BY_LANG.en;
  const riddles = RIDDLES_BY_LANG[language] ?? RIDDLES_BY_LANG.en;
  const characters = CHARACTERS_BY_LANG[language] ?? CHARACTERS_BY_LANG.en;
  const stories = STORIES_BY_LANG[language] ?? STORIES_BY_LANG.en;
  const logic = LOGIC_BY_LANG[language] ?? LOGIC_BY_LANG.en;

  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Scramble state
  const [scrambleAnswers, setScrambleAnswers] = useState<string[]>(['', '', '']);
  const [scrambleFeedback, setScrambleFeedback] = useState<Feedback[]>(['', '', '']);
  const [scrambleAttempts, setScrambleAttempts] = useState<number[]>([0, 0, 0]);
  const [scrambleHints, setScrambleHints] = useState<string[]>(['', '', '']);

  // Riddles state
  const [riddlesRevealed, setRiddlesRevealed] = useState<Set<number>>(new Set());
  const [riddleHints, setRiddleHints] = useState<Set<number>>(new Set());

  // Matching state
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [matchFeedback, setMatchFeedback] = useState('');
  const [matchHint, setMatchHint] = useState('');

  // Logic state
  const [logicAnswer, setLogicAnswer] = useState('');
  const [logicFeedback, setLogicFeedback] = useState<Feedback>('');
  const [logicHint, setLogicHint] = useState('');
  const [logicAttempts, setLogicAttempts] = useState(0);

  const updateScore = (key: string) => {
    if (!completed.has(key)) {
      setCompleted((prev) => new Set([...prev, key]));
      setScore((prev) => prev + 1);
    }
  };

  // Scramble
  const checkScramble = (index: number) => {
    const answer = scrambleAnswers[index].toUpperCase().trim();
    const fb = [...scrambleFeedback];
    if (answer === scrambledWords[index].answer) {
      fb[index] = 'correct';
      updateScore(`scramble-${index}`);
    } else {
      fb[index] = 'incorrect';
      const att = [...scrambleAttempts];
      att[index] += 1;
      setScrambleAttempts(att);
    }
    setScrambleFeedback(fb);
  };

  const revealScramble = (index: number) => {
    const fb = [...scrambleFeedback];
    fb[index] = 'revealed';
    setScrambleFeedback(fb);
  };

  const showScrambleHint = (index: number) => {
    const h = [...scrambleHints];
    h[index] = scrambledWords[index].hint;
    setScrambleHints(h);
  };

  // Riddles
  const revealRiddle = (idx: number) => {
    setRiddlesRevealed((prev) => new Set([...prev, idx]));
    updateScore(`riddle-${idx}`);
  };

  const showRiddleHint = (idx: number) => {
    setRiddleHints((prev) => new Set([...prev, idx]));
  };

  // Matching
  const handleStoryClick = (storyId: number) => {
    if (selectedChar === null) return;
    if (selectedChar === storyId) {
      const pairs = new Set([...matchedPairs, selectedChar]);
      setMatchedPairs(pairs);
      setMatchFeedback('correct');
      if (pairs.size === characters.length) {
        updateScore('match-all');
      }
    } else {
      setMatchFeedback('incorrect');
    }
    setSelectedChar(null);
  };

  // Logic
  const checkLogic = () => {
    if (logicAnswer.toUpperCase().trim() === logic.answer) {
      setLogicFeedback('correct');
      updateScore('logic');
    } else {
      setLogicFeedback('incorrect');
      setLogicAttempts((p) => p + 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-purple-700">{t.heading}</h2>
        <p className="text-gray-700 mb-4">{t.subheading}</p>
        <div className="text-5xl mb-4">🧩🧠</div>
      </div>

      <div className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-2xl p-6 mb-6">
        <h3 className="text-2xl font-bold mb-3 text-center">{t.howToPlay}</h3>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          {t.howToPlaySteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-6 text-center text-xl font-bold mb-6">
        ⭐ {t.completed} {score} / 8
      </div>

      {/* Scrambled Words */}
      <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl p-6 mb-6 border-4 border-cyan-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.scrambleHeading}</h3>
        <p className="text-center mb-4">{t.scrambleBlurb}</p>

        {scrambledWords.map((word, i) => (
          <div key={i} className="mb-6">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white p-4 rounded-xl text-center text-2xl font-bold tracking-wider mb-3">
              {word.emoji} {word.scrambled}
            </div>

            {scrambleAttempts[i] < 3 && scrambleFeedback[i] !== 'correct' && scrambleFeedback[i] !== 'revealed' && (
              <>
                <Input
                  value={scrambleAnswers[i]}
                  onChange={(e) => {
                    const a = [...scrambleAnswers];
                    a[i] = e.target.value;
                    setScrambleAnswers(a);
                  }}
                  placeholder={t.unscramble}
                  className="mb-3 text-lg"
                />
                <div className="flex gap-2 mb-3">
                  <Button
                    onClick={() => checkScramble(i)}
                    className="flex-1 bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white"
                  >
                    {t.checkAnswer}
                  </Button>
                  <Button
                    onClick={() => showScrambleHint(i)}
                    variant="outline"
                    className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {t.getHint}
                  </Button>
                </div>
                {scrambleAttempts[i] > 0 && (
                  <div className="text-center text-sm text-gray-600 mb-2">
                    {t.attemptsLeft} {3 - scrambleAttempts[i]}
                  </div>
                )}
              </>
            )}

            {scrambleAttempts[i] >= 3 && scrambleFeedback[i] !== 'correct' && scrambleFeedback[i] !== 'revealed' && (
              <Button
                onClick={() => revealScramble(i)}
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white mb-3"
              >
                <Eye className="w-4 h-4 mr-2" />
                {t.showSolution}
              </Button>
            )}

            {scrambleHints[i] && (
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{scrambleHints[i]}</p>
                </div>
              </div>
            )}

            {scrambleFeedback[i] && (
              <div
                className={`mt-3 p-3 rounded-lg text-center font-bold ${
                  scrambleFeedback[i] === 'correct'
                    ? 'bg-green-300 text-green-900'
                    : scrambleFeedback[i] === 'revealed'
                    ? 'bg-orange-300 text-orange-900'
                    : 'bg-red-300 text-red-900'
                }`}
              >
                {scrambleFeedback[i] === 'correct' ? (
                  <>
                    <CheckCircle2 className="inline w-5 h-5 mr-2" />
                    {t.correct}
                  </>
                ) : scrambleFeedback[i] === 'revealed' ? (
                  <>
                    {t.answerIs} <strong>{word.answer}</strong>
                  </>
                ) : (
                  <>
                    <XCircle className="inline w-5 h-5 mr-2" />
                    {t.notQuite}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Riddles */}
      <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-6 mb-6 border-4 border-rose-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.riddleHeading}</h3>
        <p className="text-center mb-4">{t.riddleBlurb}</p>

        {riddles.map((r, idx) => (
          <div key={idx} className="mb-6 bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-800 mb-4 italic">"{r.q}"</p>

            {riddleHints.has(idx) && (
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{r.hint}</p>
                </div>
              </div>
            )}

            {!riddlesRevealed.has(idx) ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => revealRiddle(idx)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t.showAnswer}
                </Button>
                {!riddleHints.has(idx) && (
                  <Button onClick={() => showRiddleHint(idx)} variant="outline" className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {t.hint}
                  </Button>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg text-center font-bold text-lg">
                {r.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Matching */}
      <div className="bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl p-6 mb-6 border-4 border-emerald-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.matchingHeading}</h3>
        <p className="text-center mb-4">{t.matchingBlurb}</p>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-emerald-800 mb-3 text-center">{t.characters}</h4>
            {characters.map((c) => (
              <Button
                key={c.id}
                onClick={() => setSelectedChar(c.id)}
                disabled={matchedPairs.has(c.id)}
                className={`w-full mb-2 ${
                  matchedPairs.has(c.id)
                    ? 'bg-green-500 text-white'
                    : selectedChar === c.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {c.name}
              </Button>
            ))}
          </div>
          <div>
            <h4 className="font-bold text-emerald-800 mb-3 text-center">{t.stories}</h4>
            {stories.map((s) => (
              <Button
                key={s.id}
                onClick={() => handleStoryClick(s.id)}
                disabled={matchedPairs.has(s.id)}
                className={`w-full mb-2 ${
                  matchedPairs.has(s.id) ? 'bg-green-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {s.name}
              </Button>
            ))}
          </div>
        </div>

        {matchHint && (
          <div className="mt-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{matchHint}</p>
            </div>
          </div>
        )}

        {!matchHint && matchedPairs.size < characters.length && (
          <div className="mt-4 text-center">
            <Button onClick={() => setMatchHint(t.matchingHint)} variant="outline" className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50">
              <Lightbulb className="w-4 h-4 mr-2" />
              {t.getHint}
            </Button>
          </div>
        )}

        {matchFeedback && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-bold ${
              matchFeedback === 'correct' ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'
            }`}
          >
            {matchFeedback === 'correct' ? (
              <>
                <CheckCircle2 className="inline w-5 h-5 mr-2" />
                {t.perfectMatch}
              </>
            ) : (
              <>
                <XCircle className="inline w-5 h-5 mr-2" />
                {t.notMatch}
              </>
            )}
          </div>
        )}

        {matchedPairs.size === characters.length && (
          <div className="mt-4 p-4 rounded-lg text-center font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg">
            {t.allMatched}
          </div>
        )}
      </div>

      {/* Logic */}
      <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 mb-6 border-4 border-orange-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.logicHeading}</h3>

        <div className="bg-white rounded-xl p-5 mb-4">
          <p className="font-bold text-gray-800 mb-2">{t.mystery}</p>
          <p className="text-gray-700 mb-3">{logic.description}</p>
          <p className="font-bold text-gray-800 mb-2">{t.clues}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
            {logic.clues.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
          <p className="font-bold text-orange-700">{logic.question}</p>
        </div>

        {logicHint && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{logicHint}</p>
            </div>
          </div>
        )}

        {logicFeedback !== 'correct' && (
          <>
            <Input
              value={logicAnswer}
              onChange={(e) => setLogicAnswer(e.target.value)}
              placeholder={t.typeName}
              className="mb-3 text-lg"
            />
            <div className="flex gap-2">
              <Button
                onClick={checkLogic}
                className="flex-1 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
              >
                {t.checkAnswer}
              </Button>
              {!logicHint && (
                <Button onClick={() => setLogicHint(logic.hint)} variant="outline" className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {t.getHint}
                </Button>
              )}
            </div>
            {logicAttempts > 0 && (
              <div className="text-center text-sm text-gray-600 mt-2">{t.attemptsLeft} {Math.max(0, 3 - logicAttempts)}</div>
            )}
          </>
        )}

        {logicFeedback && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-bold ${
              logicFeedback === 'correct' ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'
            }`}
          >
            {logicFeedback === 'correct' ? (
              <>
                <CheckCircle2 className="inline w-5 h-5 mr-2" />
                {t.brilliantLogic}
              </>
            ) : (
              <>
                <XCircle className="inline w-5 h-5 mr-2" />
                {t.notQuiteLogic}
              </>
            )}
          </div>
        )}
      </div>

      {score >= 8 && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white rounded-2xl p-8 mb-6 text-center shadow-2xl">
          <div className="text-6xl mb-4">🏆🎉🏆</div>
          <h2 className="text-3xl font-bold mb-2">{t.masterHeading}</h2>
          <p>{t.masterBlurb}</p>
        </div>
      )}
    </div>
  );
}
