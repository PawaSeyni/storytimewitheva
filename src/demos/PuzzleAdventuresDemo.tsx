import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, Lightbulb, Eye } from 'lucide-react';

type Scramble = { scrambled: string; answer: string; emoji: string; hint: string };
type Pair = { id: number; name: string };

const SCRAMBLED_WORDS: Scramble[] = [
  { scrambled: 'KNITHG', answer: 'KNIGHT', emoji: '⚔️', hint: 'A warrior in shining armor who serves a king or queen.' },
  { scrambled: 'GICALMA', answer: 'MAGICAL', emoji: '✨', hint: 'Describes something with mysterious enchanted powers.' },
  { scrambled: 'REUSTAER', answer: 'TREASURE', emoji: '💰', hint: "What pirates bury and adventurers seek — gold, gems, and other riches." },
];

const RIDDLES: { q: string; a: string; hint: string }[] = [
  { q: "I have a crown but I'm not a king. I live in a tower and sometimes I sing. Who am I?", a: 'A Princess! 👑', hint: 'Royal, lives in a castle tower, often the hero of fairy tales.' },
  { q: 'I breathe fire and have scales so bright, I guard treasure both day and night. What am I?', a: 'A Dragon! 🐉', hint: 'A scaly, fire-breathing creature from fantasy stories.' },
  { q: "I'm not real but I feel true, I take you to worlds shiny and new. You find me in books, what am I to you?", a: 'A Story! 📚', hint: "Made of words on pages — you're inside one right now!" },
  { q: 'I wear a pointy hat and cast spells with my wand, I make magic happen with a wave and beyond. Who am I?', a: 'A Wizard! 🧙‍♂️', hint: 'Thinks of Merlin or Gandalf — uses wands and spells.' },
  { q: 'I come out at night with wings so small, I grant wishes when you call. Sprinkle dust and you might fly. What am I, floating in the sky?', a: 'A Fairy! 🧚', hint: 'Tiny, winged, sprinkles pixie dust.' },
];

const CHARACTERS: Pair[] = [
  { id: 1, name: 'Red Riding Hood 🧺' },
  { id: 2, name: 'Cinderella 👗' },
  { id: 3, name: 'Jack 🌱' },
  { id: 4, name: 'Snow White 🍎' },
];

const STORIES: Pair[] = [
  { id: 3, name: 'Beanstalk 🏰' },
  { id: 1, name: 'Wolf & Grandma 🐺' },
  { id: 4, name: 'Seven Dwarfs ⛏️' },
  { id: 2, name: 'Glass Slipper 👠' },
];

const MATCHING_HINT = 'Match each fairy-tale character to the thing they are most famous for.';

const LOGIC = {
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
};

type Feedback = '' | 'correct' | 'incorrect' | 'revealed';

export default function PuzzleAdventuresDemo() {
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
    if (answer === SCRAMBLED_WORDS[index].answer) {
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
    h[index] = SCRAMBLED_WORDS[index].hint;
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
      if (pairs.size === CHARACTERS.length) {
        updateScore('match-all');
      }
    } else {
      setMatchFeedback('incorrect');
    }
    setSelectedChar(null);
  };

  // Logic
  const checkLogic = () => {
    if (logicAnswer.toUpperCase().trim() === LOGIC.answer) {
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
        <h3 className="text-3xl font-bold mb-2 text-purple-700">Eva's Puzzle Paradise</h3>
        <p className="text-gray-700 mb-4">Challenge your mind with fun word games and riddles!</p>
        <div className="text-5xl mb-4">🧩🧠</div>
      </div>

      <div className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-2xl p-6 mb-6">
        <h4 className="text-2xl font-bold mb-3 text-center">✨ How to Play ✨</h4>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          <li>Try different puzzle types: word scrambles, riddles, matching, and logic!</li>
          <li>Use the 💡 Hint button if you get stuck</li>
          <li>After 3 tries, you can see the solution</li>
          <li>Complete puzzles to earn points</li>
          <li>Solve all four sections to become a Puzzle Master!</li>
        </ol>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-6 text-center text-xl font-bold mb-6">
        ⭐ Puzzles Completed: {score} / 8
      </div>

      {/* Scrambled Words */}
      <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl p-6 mb-6 border-4 border-cyan-300">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">🔄 Unscramble the Story Words</h4>
        <p className="text-center mb-4">Can you figure out these mixed-up storybook words?</p>

        {SCRAMBLED_WORDS.map((word, i) => (
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
                  placeholder="Unscramble the word..."
                  className="mb-3 text-lg"
                />
                <div className="flex gap-2 mb-3">
                  <Button
                    onClick={() => checkScramble(i)}
                    className="flex-1 bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white"
                  >
                    Check Answer
                  </Button>
                  <Button
                    onClick={() => showScrambleHint(i)}
                    variant="outline"
                    className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get Hint
                  </Button>
                </div>
                {scrambleAttempts[i] > 0 && (
                  <div className="text-center text-sm text-gray-600 mb-2">
                    Attempts left: {3 - scrambleAttempts[i]}
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
                Show Solution
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
                    Correct! Great job!
                  </>
                ) : scrambleFeedback[i] === 'revealed' ? (
                  <>
                    The answer is: <strong>{word.answer}</strong>
                  </>
                ) : (
                  <>
                    <XCircle className="inline w-5 h-5 mr-2" />
                    Not quite. Try again!
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Riddles */}
      <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-6 mb-6 border-4 border-rose-300">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">🤔 Storybook Riddles</h4>
        <p className="text-center mb-4">Can you solve these clever riddles?</p>

        {RIDDLES.map((r, idx) => (
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
                  Show Answer
                </Button>
                {!riddleHints.has(idx) && (
                  <Button onClick={() => showRiddleHint(idx)} variant="outline" className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Hint
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
        <h4 className="text-2xl font-bold text-gray-800 mb-4">🔗 Match Characters to Their Stories</h4>
        <p className="text-center mb-4">Click on a character, then click on their story!</p>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h5 className="font-bold text-emerald-800 mb-3 text-center">Characters</h5>
            {CHARACTERS.map((c) => (
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
            <h5 className="font-bold text-emerald-800 mb-3 text-center">Stories</h5>
            {STORIES.map((s) => (
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

        {!matchHint && matchedPairs.size < CHARACTERS.length && (
          <div className="mt-4 text-center">
            <Button onClick={() => setMatchHint(MATCHING_HINT)} variant="outline" className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50">
              <Lightbulb className="w-4 h-4 mr-2" />
              Get Hint
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
                Perfect match!
              </>
            ) : (
              <>
                <XCircle className="inline w-5 h-5 mr-2" />
                Not a match. Try again!
              </>
            )}
          </div>
        )}

        {matchedPairs.size === CHARACTERS.length && (
          <div className="mt-4 p-4 rounded-lg text-center font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg">
            🎉 All matched! Nice work!
          </div>
        )}
      </div>

      {/* Logic */}
      <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 mb-6 border-4 border-orange-300">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">🧠 Story Logic Puzzle</h4>

        <div className="bg-white rounded-xl p-5 mb-4">
          <p className="font-bold text-gray-800 mb-2">The Mystery:</p>
          <p className="text-gray-700 mb-3">{LOGIC.description}</p>
          <p className="font-bold text-gray-800 mb-2">Clues:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
            {LOGIC.clues.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
          <p className="font-bold text-orange-700">{LOGIC.question}</p>
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
              placeholder="Type the name..."
              className="mb-3 text-lg"
            />
            <div className="flex gap-2">
              <Button
                onClick={checkLogic}
                className="flex-1 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
              >
                Check Answer
              </Button>
              {!logicHint && (
                <Button onClick={() => setLogicHint(LOGIC.hint)} variant="outline" className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get Hint
                </Button>
              )}
            </div>
            {logicAttempts > 0 && (
              <div className="text-center text-sm text-gray-600 mt-2">Attempts left: {Math.max(0, 3 - logicAttempts)}</div>
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
                Brilliant! Emma found the crown!
              </>
            ) : (
              <>
                <XCircle className="inline w-5 h-5 mr-2" />
                Not quite. Read the clues carefully!
              </>
            )}
          </div>
        )}
      </div>

      {score >= 8 && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white rounded-2xl p-8 mb-6 text-center shadow-2xl">
          <div className="text-6xl mb-4">🏆🎉🏆</div>
          <h2 className="text-3xl font-bold mb-2">Great Job, Puzzle Master!</h2>
          <p>Keep practicing to become even smarter!</p>
        </div>
      )}
    </div>
  );
}
