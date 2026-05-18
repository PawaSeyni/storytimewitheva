import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Lightbulb, Eye, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function PuzzleAdventuresDemo({ language }) {
  const [score, setScore] = useState(0);
  const [completedPuzzles, setCompletedPuzzles] = useState(new Set());
  const [scrambleAnswers, setScrambleAnswers] = useState(['', '', '']);
  const [scrambleFeedback, setScrambleFeedback] = useState(['', '', '']);
  const [scrambleAttempts, setScrambleAttempts] = useState([0, 0, 0]);
  const [scrambleHints, setScrambleHints] = useState(['', '', '']);
  const [loadingHint, setLoadingHint] = useState(null);
  const [riddlesRevealed, setRiddlesRevealed] = useState(new Set());
  const [selectedChar, setSelectedChar] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState(new Set());
  const [matchFeedback, setMatchFeedback] = useState('');
  const [matchAttempts, setMatchAttempts] = useState(0);
  const [matchHint, setMatchHint] = useState('');
  const [logicAnswer, setLogicAnswer] = useState('');
  const [logicFeedback, setLogicFeedback] = useState('');
  const [logicAttempts, setLogicAttempts] = useState(0);
  const [logicHint, setLogicHint] = useState('');

  const text = {
    en: {
      title: "Eva's Puzzle Paradise",
      subtitle: "Challenge your mind with fun word games and riddles!",
      score: "Puzzles Completed:",
      howToPlay: {
        title: "How to Play",
        instructions: [
          "Try different puzzle types: word scrambles, riddles, matching, and logic!",
          "Use the 💡 Hint button if you get stuck",
          "After 3 tries, you can see the solution",
          "Complete puzzles to earn points and unlock badges",
          "Collect all the badges to become a Puzzle Master!"
        ]
      },
      getHint: "Get Hint",
      gettingHint: "Thinking...",
      showSolution: "Show Solution",
      attemptsLeft: "Attempts left:",
      scramble: {
        title: "Unscramble the Story Words",
        subtitle: "Can you figure out these mixed-up storybook words?",
        placeholder: "Unscramble the word...",
        check: "Check Answer",
        correct: "Correct! Great job!",
        incorrect: "Not quite. Try again!",
        solution: "The answer is:"
      },
      riddles: {
        title: "Storybook Riddles",
        subtitle: "Can you solve these clever riddles?",
        reveal: "Show Answer",
        questions: [
          "I have a crown but I'm not a king. I live in a tower and sometimes I sing. Who am I?",
          "I breathe fire and have scales so bright, I guard treasure both day and night. What am I?",
          "I'm not real but I feel true, I take you to worlds shiny and new. You find me in books, what am I to you?",
          "I wear a pointy hat and cast spells with my wand, I make magic happen with a wave and beyond. Who am I?",
          "I come out at night with wings so small, I grant wishes when you call. Sprinkle dust and you might fly. What am I, floating in the sky?"
        ],
        answers: [
          "A Princess! 👑",
          "A Dragon! 🐉",
          "A Story! 📚",
          "A Wizard! 🧙‍♂️",
          "A Fairy! 🧚"
        ]
      },
      matching: {
        title: "Match Characters to Their Stories",
        subtitle: "Click on a character, then click on their story!",
        characters: "Characters",
        stories: "Stories",
        correct: "Perfect match!",
        incorrect: "Not a match. Try again!"
      },
      logic: {
        title: "Story Logic Puzzle",
        mystery: "The Mystery:",
        description: "Three friends went on an adventure. Each found a different magical item.",
        clues: "Clues:",
        clueList: [
          "Emma didn't find the sword",
          "The person who found the crown lives in a castle",
          "Oliver found the magical sword",
          "Sophia lives in the enchanted forest"
        ],
        question: "Question: Who found the crown?",
        placeholder: "Type the name...",
        check: "Check Answer",
        correct: "Brilliant! Emma found the crown!",
        incorrect: "Not quite. Read the clues carefully!"
      },
      congrats: "Great Job, Puzzle Master!",
      keepPracticing: "Keep practicing to become even smarter!"
    },
    es: {
      title: "Paraíso de Rompecabezas de Eva",
      subtitle: "¡Desafía tu mente con juegos de palabras y acertijos!",
      score: "Rompecabezas Completados:",
      howToPlay: {
        title: "Cómo Jugar",
        instructions: [
          "Prueba diferentes tipos de rompecabezas: palabras mezcladas, acertijos, emparejar y lógica!",
          "Usa el botón 💡 Pista si te quedas atascado",
          "Después de 3 intentos, puedes ver la solución",
          "Completa rompecabezas para ganar puntos y desbloquear insignias",
          "¡Colecciona todas las insignias para convertirte en un Maestro de Rompecabezas!"
        ]
      },
      getHint: "Obtener Pista",
      gettingHint: "Pensando...",
      showSolution: "Mostrar Solución",
      attemptsLeft: "Intentos restantes:",
      scramble: {
        title: "Desordena las Palabras",
        subtitle: "¿Puedes descifrar estas palabras mezcladas?",
        placeholder: "Descifra la palabra...",
        check: "Verificar",
        correct: "¡Correcto! ¡Buen trabajo!",
        incorrect: "No es correcto. ¡Intenta de nuevo!",
        solution: "La respuesta es:"
      },
      riddles: {
        title: "Acertijos de Cuentos",
        subtitle: "¿Puedes resolver estos acertijos?",
        reveal: "Mostrar Respuesta",
        questions: [
          "Tengo una corona pero no soy rey. Vivo en una torre y a veces canto. ¿Quién soy?",
          "Respiro fuego y tengo escamas brillantes, guardo tesoros día y noche. ¿Qué soy?",
          "No soy real pero me siento verdadero, te llevo a mundos nuevos y brillantes. ¿Qué soy?",
          "Llevo un sombrero puntiagudo y hago hechizos con mi varita. ¿Quién soy?",
          "Salgo de noche con alas pequeñas, concedo deseos cuando llamas. ¿Qué soy?"
        ],
        answers: [
          "¡Una Princesa! 👑",
          "¡Un Dragón! 🐉",
          "¡Una Historia! 📚",
          "¡Un Mago! 🧙‍♂️",
          "¡Un Hada! 🧚"
        ]
      },
      matching: {
        title: "Empareja Personajes con sus Historias",
        subtitle: "¡Haz clic en un personaje y luego en su historia!",
        characters: "Personajes",
        stories: "Historias",
        correct: "¡Emparejamiento perfecto!",
        incorrect: "No coincide. ¡Intenta de nuevo!"
      },
      logic: {
        title: "Rompecabezas de Lógica",
        mystery: "El Misterio:",
        description: "Tres amigos fueron de aventura. Cada uno encontró un objeto mágico diferente.",
        clues: "Pistas:",
        clueList: [
          "Emma no encontró la espada",
          "La persona que encontró la corona vive en un castillo",
          "Oliver encontró la espada mágica",
          "Sophia vive en el bosque encantado"
        ],
        question: "Pregunta: ¿Quién encontró la corona?",
        placeholder: "Escribe el nombre...",
        check: "Verificar",
        correct: "¡Brillante! ¡Emma encontró la corona!",
        incorrect: "No es correcto. ¡Lee las pistas cuidadosamente!"
      },
      congrats: "¡Excelente Trabajo, Maestro de Rompecabezas!",
      keepPracticing: "¡Sigue practicando para ser aún más inteligente!"
    },
    fr: {
      title: "Paradis des Puzzles d'Eva",
      subtitle: "Défiez votre esprit avec des jeux de mots et des énigmes!",
      score: "Puzzles Complétés:",
      howToPlay: {
        title: "Comment Jouer",
        instructions: [
          "Essayez différents types de puzzles : mots mélangés, énigmes, associations et logique !",
          "Utilisez le bouton 💡 Indice si vous êtes bloqué",
          "Après 3 essais, vous pouvez voir la solution",
          "Terminez des puzzles pour gagner des points et débloquer des badges",
          "Collectionnez tous les badges pour devenir un Maître des Puzzles !"
        ]
      },
      getHint: "Obtenir Indice",
      gettingHint: "Réflexion...",
      showSolution: "Afficher Solution",
      attemptsLeft: "Essais restants:",
      scramble: {
        title: "Démêlez les Mots",
        subtitle: "Pouvez-vous déchiffrer ces mots mélangés?",
        placeholder: "Démêlez le mot...",
        check: "Vérifier",
        correct: "Correct! Excellent travail!",
        incorrect: "Pas tout à fait. Réessayez!",
        solution: "La réponse est:"
      },
      riddles: {
        title: "Énigmes de Contes",
        subtitle: "Pouvez-vous résoudre ces énigmes?",
        reveal: "Montrer la Réponse",
        questions: [
          "J'ai une couronne mais je ne suis pas roi. Je vis dans une tour et parfois je chante. Qui suis-je?",
          "Je respire le feu et j'ai des écailles brillantes, je garde un trésor jour et nuit. Que suis-je?",
          "Je ne suis pas réel mais je me sens vrai, je t'emmène dans des mondes brillants et nouveaux. Que suis-je?",
          "Je porte un chapeau pointu et je lance des sorts avec ma baguette. Qui suis-je?",
          "Je sors la nuit avec de petites ailes, j'exauce des vœux quand tu appelles. Que suis-je?"
        ],
        answers: [
          "Une Princesse! 👑",
          "Un Dragon! 🐉",
          "Une Histoire! 📚",
          "Un Magicien! 🧙‍♂️",
          "Une Fée! 🧚"
        ]
      },
      matching: {
        title: "Associez les Personnages à leurs Histoires",
        subtitle: "Cliquez sur un personnage puis sur son histoire!",
        characters: "Personnages",
        stories: "Histoires",
        correct: "Parfait!",
        incorrect: "Pas une correspondance. Réessayez!"
      },
      logic: {
        title: "Puzzle Logique",
        mystery: "Le Mystère:",
        description: "Trois amis sont partis à l'aventure. Chacun a trouvé un objet magique différent.",
        clues: "Indices:",
        clueList: [
          "Emma n'a pas trouvé l'épée",
          "La personne qui a trouvé la couronne vit dans un château",
          "Oliver a trouvé l'épée magique",
          "Sophia vit dans la forêt enchantée"
        ],
        question: "Question: Qui a trouvé la couronne?",
        placeholder: "Tapez le nom...",
        check: "Vérifier",
        correct: "Brillant! Emma a trouvé la couronne!",
        incorrect: "Pas tout à fait. Lisez les indices attentivement!"
      },
      congrats: "Excellent Travail, Maître des Puzzles!",
      keepPracticing: "Continuez à pratiquer pour devenir encore plus intelligent!"
    }
  };

  const t = text[language] || text.en;

  const scrambledWords = [
    { scrambled: 'KNITHG', answer: 'KNIGHT', emoji: '⚔️' },
    { scrambled: 'GICALMA', answer: 'MAGICAL', emoji: '✨' },
    { scrambled: 'REUSTAER', answer: 'TREASURE', emoji: '💰' }
  ];

  const matchingPairs = {
    en: {
      characters: [
        { id: 1, name: 'Red Riding Hood 🧺' },
        { id: 2, name: 'Cinderella 👗' },
        { id: 3, name: 'Jack 🌱' },
        { id: 4, name: 'Snow White 🍎' }
      ],
      stories: [
        { id: 3, name: 'Beanstalk 🏰' },
        { id: 1, name: 'Wolf & Grandma 🐺' },
        { id: 4, name: 'Seven Dwarfs ⛏️' },
        { id: 2, name: 'Glass Slipper 👠' }
      ]
    },
    es: {
      characters: [
        { id: 1, name: 'Caperucita Roja 🧺' },
        { id: 2, name: 'Cenicienta 👗' },
        { id: 3, name: 'Jack 🌱' },
        { id: 4, name: 'Blancanieves 🍎' }
      ],
      stories: [
        { id: 3, name: 'Habichuelas 🏰' },
        { id: 1, name: 'Lobo y Abuela 🐺' },
        { id: 4, name: 'Siete Enanitos ⛏️' },
        { id: 2, name: 'Zapatilla de Cristal 👠' }
      ]
    },
    fr: {
      characters: [
        { id: 1, name: 'Petit Chaperon Rouge 🧺' },
        { id: 2, name: 'Cendrillon 👗' },
        { id: 3, name: 'Jack 🌱' },
        { id: 4, name: 'Blanche-Neige 🍎' }
      ],
      stories: [
        { id: 3, name: 'Haricot Magique 🏰' },
        { id: 1, name: 'Loup et Grand-mère 🐺' },
        { id: 4, name: 'Sept Nains ⛏️' },
        { id: 2, name: 'Pantoufle de Verre 👠' }
      ]
    }
  };

  const pairs = matchingPairs[language] || matchingPairs.en;

  const updateScore = (puzzleType) => {
    if (!completedPuzzles.has(puzzleType)) {
      const newCompleted = new Set(completedPuzzles);
      newCompleted.add(puzzleType);
      setCompletedPuzzles(newCompleted);
      setScore(newCompleted.size);
    }
  };

  // AI Hint Generation
  const getAIHint = async (puzzleType, puzzleData) => {
    try {
      setLoadingHint(puzzleType);
      
      let prompt = '';
      if (puzzleType.startsWith('scramble')) {
        const index = parseInt(puzzleType.split('-')[1]);
        const word = scrambledWords[index];
        prompt = `Give a helpful hint for unscrambling "${word.scrambled}" (answer is ${word.answer}). The hint should be friendly and age-appropriate for children. Don't give away the answer directly, but provide a clue about the word's meaning or a letter position. Keep it under 30 words.`;
      } else if (puzzleType === 'matching') {
        prompt = `Give a helpful hint for matching fairy tale characters to their stories. The pairs are: Red Riding Hood with Wolf & Grandma, Cinderella with Glass Slipper, Jack with Beanstalk, Snow White with Seven Dwarfs. Provide a general strategy tip without revealing the answers. Keep it under 30 words and make it child-friendly.`;
      } else if (puzzleType === 'logic') {
        prompt = `Give a helpful hint for this logic puzzle: Three friends (Emma, Oliver, Sophia) each found a magical item (sword, crown, wand). Clues: Emma didn't find the sword, crown finder lives in castle, Oliver found sword, Sophia lives in forest. Question: Who found the crown? Give a strategy hint without revealing Emma is the answer. Keep it under 30 words and child-friendly.`;
      }

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      const hint = result.data || result;
      
      if (puzzleType.startsWith('scramble')) {
        const index = parseInt(puzzleType.split('-')[1]);
        const newHints = [...scrambleHints];
        newHints[index] = hint;
        setScrambleHints(newHints);
      } else if (puzzleType === 'matching') {
        setMatchHint(hint);
      } else if (puzzleType === 'logic') {
        setLogicHint(hint);
      }

      if (window.showToast) {
        window.showToast("💡 Hint received!", 'info');
      }
    } catch (error) {
      console.error('Error getting hint:', error);
      if (window.showToast) {
        window.showToast("Couldn't get hint. Try again!", 'error');
      }
    } finally {
      setLoadingHint(null);
    }
  };

  const checkScramble = (index) => {
    const answer = scrambleAnswers[index].toUpperCase();
    const newFeedback = [...scrambleFeedback];
    const newAttempts = [...scrambleAttempts];
    
    if (answer === scrambledWords[index].answer) {
      newFeedback[index] = 'correct';
      updateScore(`scramble-${index}`);
    } else {
      newFeedback[index] = 'incorrect';
      newAttempts[index] = newAttempts[index] + 1;
      setScrambleAttempts(newAttempts);
    }
    setScrambleFeedback(newFeedback);
  };

  const revealScrambleSolution = (index) => {
    const newAnswers = [...scrambleAnswers];
    newAnswers[index] = scrambledWords[index].answer;
    setScrambleAnswers(newAnswers);
    
    const newFeedback = [...scrambleFeedback];
    newFeedback[index] = 'revealed';
    setScrambleFeedback(newFeedback);
  };

  const revealRiddle = (index) => {
    const newRevealed = new Set(riddlesRevealed);
    newRevealed.add(index);
    setRiddlesRevealed(newRevealed);
    updateScore('riddles');
  };

  const selectMatch = (item, type) => {
    const pairKey = `${type}-${item.id}`;
    if (matchedPairs.has(pairKey)) return;

    if (type === 'char') {
      setSelectedChar(item);
      if (selectedStory) {
        checkMatch(item, selectedStory);
      }
    } else {
      setSelectedStory(item);
      if (selectedChar) {
        checkMatch(selectedChar, item);
      }
    }
  };

  const checkMatch = (char, story) => {
    if (char.id === story.id) {
      const newMatched = new Set(matchedPairs);
      newMatched.add(`char-${char.id}`);
      newMatched.add(`story-${story.id}`);
      setMatchedPairs(newMatched);
      setMatchFeedback('correct');
      updateScore('matching');
    } else {
      setMatchFeedback('incorrect');
      setMatchAttempts(prev => prev + 1);
    }
    
    setTimeout(() => {
      setSelectedChar(null);
      setSelectedStory(null);
      setMatchFeedback('');
    }, 1500);
  };

  const revealAllMatches = () => {
    const newMatched = new Set();
    pairs.characters.forEach(char => {
      newMatched.add(`char-${char.id}`);
    });
    pairs.stories.forEach(story => {
      newMatched.add(`story-${story.id}`);
    });
    setMatchedPairs(newMatched);
    setMatchFeedback('revealed');
  };

  const checkLogic = () => {
    const answer = logicAnswer.trim().toLowerCase();
    if (answer === 'emma') {
      setLogicFeedback('correct');
      updateScore('logic');
    } else {
      setLogicFeedback('incorrect');
      setLogicAttempts(prev => prev + 1);
    }
  };

  const revealLogicSolution = () => {
    setLogicAnswer('Emma');
    setLogicFeedback('revealed');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 md:p-8 max-h-[70vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">{t.title}</h3>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">🧩🧠</div>
      </div>

      {/* How to Play */}
      <div className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-2xl p-6 mb-6">
        <h4 className="text-2xl font-bold mb-3 text-center">✨ {t.howToPlay.title} ✨</h4>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          {t.howToPlay.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>

      {/* Score Board */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-6 text-center text-xl font-bold mb-6">
        ⭐ {t.score} {score} / 5
      </div>

      {/* Scrambled Words */}
      <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl p-6 mb-6 border-4 border-cyan-300">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">🔄 {t.scramble.title}</h4>
        <p className="text-center mb-4">{t.scramble.subtitle}</p>
        
        {scrambledWords.map((word, index) => (
          <div key={index} className="mb-6">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white p-4 rounded-xl text-center text-2xl font-bold tracking-wider mb-3">
              {word.emoji} {word.scrambled}
            </div>
            
            {scrambleAttempts[index] < 3 && scrambleFeedback[index] !== 'correct' && scrambleFeedback[index] !== 'revealed' ? (
              <>
                <Input
                  value={scrambleAnswers[index]}
                  onChange={(e) => {
                    const newAnswers = [...scrambleAnswers];
                    newAnswers[index] = e.target.value;
                    setScrambleAnswers(newAnswers);
                  }}
                  placeholder={t.scramble.placeholder}
                  className="mb-3 text-lg"
                  disabled={scrambleFeedback[index] === 'correct' || scrambleFeedback[index] === 'revealed'}
                />
                
                <div className="flex gap-2 mb-3">
                  <Button
                    onClick={() => checkScramble(index)}
                    className="flex-1 bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600"
                  >
                    {t.scramble.check}
                  </Button>
                  <Button
                    onClick={() => getAIHint(`scramble-${index}`)}
                    disabled={loadingHint === `scramble-${index}`}
                    variant="outline"
                    className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                  >
                    {loadingHint === `scramble-${index}` ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.gettingHint}</>
                    ) : (
                      <><Lightbulb className="w-4 h-4 mr-2" />{t.getHint}</>
                    )}
                  </Button>
                </div>

                {scrambleAttempts[index] > 0 && (
                  <div className="text-center text-sm text-gray-600 mb-2">
                    {t.attemptsLeft} {3 - scrambleAttempts[index]}
                  </div>
                )}
              </>
            ) : null}

            {scrambleAttempts[index] >= 3 && scrambleFeedback[index] !== 'correct' && scrambleFeedback[index] !== 'revealed' && (
              <Button
                onClick={() => revealScrambleSolution(index)}
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white mb-3"
              >
                <Eye className="w-4 h-4 mr-2" />
                {t.showSolution}
              </Button>
            )}

            {scrambleHints[index] && (
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{scrambleHints[index]}</p>
                </div>
              </div>
            )}
            
            {scrambleFeedback[index] && (
              <div className={`mt-3 p-3 rounded-lg text-center font-bold ${
                scrambleFeedback[index] === 'correct'
                  ? 'bg-green-300 text-green-900'
                  : scrambleFeedback[index] === 'revealed'
                  ? 'bg-orange-300 text-orange-900'
                  : 'bg-red-300 text-red-900'
              }`}>
                {scrambleFeedback[index] === 'correct' ? (
                  <><CheckCircle2 className="inline w-5 h-5 mr-2" />{t.scramble.correct}</>
                ) : scrambleFeedback[index] === 'revealed' ? (
                  <>{t.scramble.solution} <strong>{word.answer}</strong></>
                ) : (
                  <><XCircle className="inline w-5 h-5 mr-2" />{t.scramble.incorrect}</>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Riddles */}
      <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-6 mb-6 border-4 border-rose-300">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">🤔 {t.riddles.title}</h4>
        <p className="text-center mb-4">{t.riddles.subtitle}</p>
        
        {t.riddles.questions.map((question, index) => (
          <div key={index} className="bg-white rounded-xl p-6 mb-4">
            <p className="text-lg text-gray-800 mb-4">
              {['🏰', '🔥', '✨', '🧙', '🌙'][index]} {question}
            </p>
            <Button
              onClick={() => revealRiddle(index)}
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 mb-3"
            >
              {t.riddles.reveal}
            </Button>
            {riddlesRevealed.has(index) && (
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 rounded-lg font-bold text-lg">
                {t.riddles.answers[index]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Matching Game */}
      <div className="bg-gradient-to-r from-green-200 to-teal-200 rounded-2xl p-6 mb-6 border-4 border-teal-300">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">🎭 {t.matching.title}</h4>
        <p className="text-center mb-4">{t.matching.subtitle}</p>
        
        {matchAttempts > 0 && matchAttempts < 3 && (
          <div className="text-center text-sm text-gray-600 mb-3">
            {t.attemptsLeft} {3 - matchAttempts}
          </div>
        )}

        {matchAttempts >= 3 && matchedPairs.size < 8 && (
          <div className="mb-4 space-y-2">
            <Button
              onClick={() => revealAllMatches()}
              className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t.showSolution}
            </Button>
            <Button
              onClick={() => getAIHint('matching')}
              disabled={loadingHint === 'matching'}
              variant="outline"
              className="w-full border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
            >
              {loadingHint === 'matching' ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.gettingHint}</>
              ) : (
                <><Lightbulb className="w-4 h-4 mr-2" />{t.getHint}</>
              )}
            </Button>
          </div>
        )}

        {matchHint && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{matchHint}</p>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-center font-bold mb-3 text-lg">{t.matching.characters}</h5>
            {pairs.characters.map((char) => (
              <div
                key={char.id}
                onClick={() => selectMatch(char, 'char')}
                className={`p-4 mb-3 rounded-xl text-center font-bold cursor-pointer transition-all ${
                  matchedPairs.has(`char-${char.id}`)
                    ? 'bg-green-400 text-white cursor-default'
                    : selectedChar?.id === char.id
                    ? 'bg-pink-400 text-white ring-4 ring-pink-300'
                    : 'bg-white text-purple-700 hover:bg-purple-100'
                }`}
              >
                {char.name}
              </div>
            ))}
          </div>
          <div>
            <h5 className="text-center font-bold mb-3 text-lg">{t.matching.stories}</h5>
            {pairs.stories.map((story) => (
              <div
                key={story.id}
                onClick={() => selectMatch(story, 'story')}
                className={`p-4 mb-3 rounded-xl text-center font-bold cursor-pointer transition-all ${
                  matchedPairs.has(`story-${story.id}`)
                    ? 'bg-green-400 text-white cursor-default'
                    : selectedStory?.id === story.id
                    ? 'bg-pink-400 text-white ring-4 ring-pink-300'
                    : 'bg-white text-purple-700 hover:bg-purple-100'
                }`}
              >
                {story.name}
              </div>
            ))}
          </div>
        </div>
        
        {matchFeedback && matchFeedback !== 'revealed' && (
          <div className={`mt-4 p-4 rounded-lg text-center font-bold ${
            matchFeedback === 'correct'
              ? 'bg-green-300 text-green-900'
              : 'bg-red-300 text-red-900'
          }`}>
            {matchFeedback === 'correct' ? (
              <><CheckCircle2 className="inline w-5 h-5 mr-2" />{t.matching.correct}</>
            ) : (
              <><XCircle className="inline w-5 h-5 mr-2" />{t.matching.incorrect}</>
            )}
          </div>
        )}
      </div>

      {/* Logic Puzzle */}
      <div className="bg-gradient-to-r from-indigo-200 to-purple-200 rounded-2xl p-6 mb-6 border-4 border-purple-300">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">🧠 {t.logic.title}</h4>
        
        <div className="bg-white rounded-xl p-6">
          <p className="font-bold mb-2">{t.logic.mystery}</p>
          <p className="mb-4">{t.logic.description}</p>
          
          <p className="font-bold mb-2">{t.logic.clues}</p>
          <ul className="list-disc ml-6 mb-4 space-y-2">
            {t.logic.clueList.map((clue, index) => (
              <li key={index}>{clue}</li>
            ))}
          </ul>
          
          <p className="font-bold text-lg mb-3">{t.logic.question}</p>
          
          {logicAttempts < 3 && logicFeedback !== 'correct' && logicFeedback !== 'revealed' ? (
            <>
              <Input
                value={logicAnswer}
                onChange={(e) => setLogicAnswer(e.target.value)}
                placeholder={t.logic.placeholder}
                className="mb-3 text-lg"
                disabled={logicFeedback === 'correct' || logicFeedback === 'revealed'}
              />
              
              <div className="flex gap-2 mb-3">
                <Button
                  onClick={checkLogic}
                  className="flex-1 bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600"
                >
                  {t.logic.check}
                </Button>
                <Button
                  onClick={() => getAIHint('logic')}
                  disabled={loadingHint === 'logic'}
                  variant="outline"
                  className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                >
                  {loadingHint === 'logic' ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.gettingHint}</>
                  ) : (
                    <><Lightbulb className="w-4 h-4 mr-2" />{t.getHint}</>
                  )}
                </Button>
              </div>

              {logicAttempts > 0 && (
                <div className="text-center text-sm text-gray-600 mb-2">
                  {t.attemptsLeft} {3 - logicAttempts}
                </div>
              )}
            </>
          ) : null}

          {logicAttempts >= 3 && logicFeedback !== 'correct' && logicFeedback !== 'revealed' && (
            <Button
              onClick={revealLogicSolution}
              className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white mb-3"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t.showSolution}
            </Button>
          )}

          {logicHint && (
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{logicHint}</p>
              </div>
            </div>
          )}
          
          {logicFeedback && (
            <div className={`mt-4 p-4 rounded-lg text-center font-bold ${
              logicFeedback === 'correct'
                ? 'bg-green-300 text-green-900'
                : logicFeedback === 'revealed'
                ? 'bg-orange-300 text-orange-900'
                : 'bg-red-300 text-red-900'
            }`}>
              {logicFeedback === 'correct' ? (
                <><CheckCircle2 className="inline w-5 h-5 mr-2" />{t.logic.correct}</>
              ) : logicFeedback === 'revealed' ? (
                <>💡 {t.scramble.solution} <strong>Emma</strong></>
              ) : (
                <><XCircle className="inline w-5 h-5 mr-2" />{t.logic.incorrect}</>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Congratulations */}
      <div className="bg-gradient-to-r from-green-400 to-cyan-400 text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">🎉 {t.congrats} 🎉</h2>
        <p className="text-lg">{t.keepPracticing}</p>
      </div>
    </div>
  );
}