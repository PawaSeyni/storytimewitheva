import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy, Award } from 'lucide-react';

type Item = { emoji: string; text: string; free?: boolean };
type ThemeKey = 'fairytale' | 'adventure' | 'mystery' | 'animal';

const THEMES: Record<ThemeKey, { title: string; items: Item[] }> = {
  fairytale: {
    title: '🏰 Fairy Tale Bingo',
    items: [
      { emoji: '👑', text: 'A King or Queen' },
      { emoji: '🏰', text: 'A Castle' },
      { emoji: '🐉', text: 'A Dragon' },
      { emoji: '🧚', text: 'A Fairy' },
      { emoji: '✨', text: 'Magic Spell' },
      { emoji: '🗡️', text: 'A Sword' },
      { emoji: '👸', text: 'A Princess' },
      { emoji: '🧙', text: 'A Wizard' },
      { emoji: '🌹', text: 'Enchanted Item' },
      { emoji: '🐸', text: 'Talking Animal' },
      { emoji: '🪄', text: 'Magic Wand' },
      { emoji: '💎', text: 'A Treasure' },
      { emoji: '🌟', text: 'A Wish' },
      { emoji: '🦄', text: 'Mythical Creature' },
      { emoji: '📜', text: 'A Quest' },
      { emoji: '🔮', text: 'A Prophecy' },
      { emoji: '👹', text: 'A Villain' },
      { emoji: '🌙', text: 'Night Scene' },
      { emoji: '🎭', text: 'A Disguise' },
      { emoji: '💝', text: 'True Love' },
      { emoji: '🔑', text: 'A Secret' },
      { emoji: '🌳', text: 'Enchanted Forest' },
      { emoji: '⚡', text: 'A Curse' },
      { emoji: '🎪', text: 'Transformation' },
    ],
  },
  adventure: {
    title: '🗺️ Adventure Bingo',
    items: [
      { emoji: '🗺️', text: 'A Map' },
      { emoji: '⛰️', text: 'A Mountain' },
      { emoji: '🏝️', text: 'An Island' },
      { emoji: '🧭', text: 'A Compass' },
      { emoji: '🏕️', text: 'Camping' },
      { emoji: '🔥', text: 'A Campfire' },
      { emoji: '🚣', text: 'Boat Journey' },
      { emoji: '🌊', text: 'Ocean or Sea' },
      { emoji: '🦅', text: 'Wild Animal' },
      { emoji: '💎', text: 'Hidden Treasure' },
      { emoji: '🌲', text: 'A Forest' },
      { emoji: '⚓', text: 'A Ship' },
      { emoji: '🏜️', text: 'A Desert' },
      { emoji: '🧗', text: 'Climbing' },
      { emoji: '🎒', text: 'A Backpack' },
      { emoji: '🔦', text: 'A Flashlight' },
      { emoji: '🗻', text: 'A Cave' },
      { emoji: '🌅', text: 'Sunrise/Sunset' },
      { emoji: '⛺', text: 'A Tent' },
      { emoji: '🎣', text: 'Fishing' },
      { emoji: '🦜', text: 'Exotic Birds' },
      { emoji: '💪', text: 'A Challenge' },
      { emoji: '🏆', text: 'Victory' },
      { emoji: '🤝', text: 'Teamwork' },
    ],
  },
  mystery: {
    title: '🔍 Mystery Bingo',
    items: [
      { emoji: '🔍', text: 'A Clue' },
      { emoji: '🕵️', text: 'A Detective' },
      { emoji: '🔐', text: 'Locked Door' },
      { emoji: '🗝️', text: 'A Key' },
      { emoji: '📝', text: 'A Note' },
      { emoji: '🕰️', text: 'A Clock' },
      { emoji: '👻', text: 'Something Spooky' },
      { emoji: '🏚️', text: 'Old House' },
      { emoji: '🔦', text: 'Dark Search' },
      { emoji: '📖', text: 'Secret Message' },
      { emoji: '🎭', text: 'A Suspect' },
      { emoji: '🔒', text: 'A Safe' },
      { emoji: '📱', text: 'Phone Call' },
      { emoji: '👀', text: 'Someone Watching' },
      { emoji: '🚪', text: 'Hidden Door' },
      { emoji: '📷', text: 'Evidence' },
      { emoji: '🌙', text: 'Night Scene' },
      { emoji: '🕷️', text: 'Cobwebs' },
      { emoji: '📜', text: 'Old Map' },
      { emoji: '🔊', text: 'Strange Sound' },
      { emoji: '🧩', text: 'A Puzzle' },
      { emoji: '💡', text: 'A Discovery' },
      { emoji: '❓', text: 'A Question' },
      { emoji: '✅', text: 'Case Solved!' },
    ],
  },
  animal: {
    title: '🦁 Animal Story Bingo',
    items: [
      { emoji: '🦁', text: 'A Lion' },
      { emoji: '🐘', text: 'An Elephant' },
      { emoji: '🦊', text: 'A Fox' },
      { emoji: '🐻', text: 'A Bear' },
      { emoji: '🦉', text: 'An Owl' },
      { emoji: '🐰', text: 'A Rabbit' },
      { emoji: '🐺', text: 'A Wolf' },
      { emoji: '🦅', text: 'An Eagle' },
      { emoji: '🐢', text: 'A Turtle' },
      { emoji: '🦌', text: 'A Deer' },
      { emoji: '🐿️', text: 'A Squirrel' },
      { emoji: '🦜', text: 'A Parrot' },
      { emoji: '🐼', text: 'A Panda' },
      { emoji: '🦒', text: 'A Giraffe' },
      { emoji: '🐨', text: 'A Koala' },
      { emoji: '🦘', text: 'A Kangaroo' },
      { emoji: '🦈', text: 'A Shark' },
      { emoji: '🐬', text: 'A Dolphin' },
      { emoji: '🐧', text: 'A Penguin' },
      { emoji: '🦋', text: 'A Butterfly' },
      { emoji: '🐝', text: 'A Bee' },
      { emoji: '🐜', text: 'An Ant' },
      { emoji: '🦆', text: 'A Duck' },
      { emoji: '🐔', text: 'A Chicken' },
    ],
  },
};

type Badge = {
  id: string;
  emoji: string;
  name: string;
  condition: 'marks' | 'bingo' | 'fullcard' | 'themes';
  value: number;
};

const BADGES: Badge[] = [
  { id: 'first', emoji: '⭐', name: 'First Mark', condition: 'marks', value: 1 },
  { id: 'five', emoji: '🌟', name: 'Five Marks', condition: 'marks', value: 5 },
  { id: 'half', emoji: '💫', name: 'Half Card', condition: 'marks', value: 12 },
  { id: 'bingo', emoji: '🎯', name: 'First Bingo', condition: 'bingo', value: 1 },
  { id: 'fullcard', emoji: '🏆', name: 'Full Card', condition: 'fullcard', value: 1 },
  { id: 'explorer', emoji: '🗺️', name: 'Card Explorer', condition: 'themes', value: 2 },
];

const FREE_SPACE: Item = { emoji: '⭐', text: 'FREE SPACE', free: true };

type BingoLine = { type: 'row' | 'col' | 'diag'; index: number };

export default function BingoDemo() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('fairytale');
  const [completedSquares, setCompletedSquares] = useState<Set<number>>(new Set([12]));
  const [hasBingo, setHasBingo] = useState(false);
  const [bingoLines, setBingoLines] = useState<BingoLine[]>([]);
  const [currentCard, setCurrentCard] = useState<Item[]>([]);
  const [bingoCount, setBingoCount] = useState(0);
  const [fullCardCount, setFullCardCount] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());
  const [themesPlayed, setThemesPlayed] = useState<Set<ThemeKey>>(new Set(['fairytale']));

  const generateCard = useCallback(() => {
    const theme = THEMES[currentTheme];
    const shuffled = [...theme.items].sort(() => Math.random() - 0.5);
    const newCard = shuffled.slice(0, 24);
    newCard.splice(12, 0, FREE_SPACE);
    setCurrentCard(newCard);
    setCompletedSquares(new Set([12]));
    setHasBingo(false);
    setBingoLines([]);
  }, [currentTheme]);

  useEffect(() => {
    generateCard();
  }, [generateCard]);

  // Check for badge unlocks whenever any tracked stat changes
  useEffect(() => {
    BADGES.forEach((badge) => {
      let unlock = false;
      switch (badge.condition) {
        case 'marks':
          unlock = completedSquares.size >= badge.value;
          break;
        case 'bingo':
          unlock = bingoCount >= badge.value;
          break;
        case 'fullcard':
          unlock = fullCardCount >= badge.value;
          break;
        case 'themes':
          unlock = themesPlayed.size >= badge.value;
          break;
      }
      if (unlock && !unlockedBadges.has(badge.id)) {
        setUnlockedBadges((prev) => new Set([...prev, badge.id]));
      }
    });
  }, [completedSquares, bingoCount, fullCardCount, themesPlayed, unlockedBadges]);

  const checkForBingo = (): BingoLine[] => {
    const lines: BingoLine[] = [];
    const size = 5;

    for (let row = 0; row < size; row++) {
      const rowIndices = Array.from({ length: size }, (_, i) => row * size + i);
      if (rowIndices.every((i) => completedSquares.has(i))) {
        lines.push({ type: 'row', index: row + 1 });
      }
    }

    for (let col = 0; col < size; col++) {
      const colIndices = Array.from({ length: size }, (_, i) => col + i * size);
      if (colIndices.every((i) => completedSquares.has(i))) {
        lines.push({ type: 'col', index: col + 1 });
      }
    }

    const diag1 = [0, 6, 12, 18, 24];
    if (diag1.every((i) => completedSquares.has(i))) lines.push({ type: 'diag', index: 1 });

    const diag2 = [4, 8, 12, 16, 20];
    if (diag2.every((i) => completedSquares.has(i))) lines.push({ type: 'diag', index: 2 });

    return lines;
  };

  const handleCheckBingo = () => {
    const lines = checkForBingo();
    setBingoLines(lines);
    setHasBingo(lines.length > 0);

    if (completedSquares.size === 25) setFullCardCount((p) => p + 1);
    if (lines.length > 0) setBingoCount((p) => p + lines.length);

    if (lines.length === 0) {
      alert('No BINGO yet! Keep reading and marking squares!');
    }
  };

  const toggleSquare = (index: number) => {
    if (currentCard[index]?.free) return;
    const next = new Set(completedSquares);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setCompletedSquares(next);
  };

  const changeTheme = (theme: ThemeKey) => {
    setCurrentTheme(theme);
    setThemesPlayed((prev) => new Set([...prev, theme]));
  };

  const isInBingoLine = (index: number) =>
    bingoLines.some((line) => {
      if (line.type === 'row') return Math.floor(index / 5) === line.index - 1;
      if (line.type === 'col') return index % 5 === line.index - 1;
      if (line.type === 'diag') {
        if (line.index === 1) return [0, 6, 12, 18, 24].includes(index);
        if (line.index === 2) return [4, 8, 12, 16, 20].includes(index);
      }
      return false;
    });

  const progress = Math.round((completedSquares.size / 25) * 100);

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">Eva's Reading Bingo Adventure</h3>
        <p className="text-gray-700 mb-4">Mark off story elements as you read and collect amazing badges!</p>
        <div className="text-5xl mb-4">📚🎯</div>
      </div>

      <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 mb-6 border-4 border-orange-300">
        <h4 className="font-bold text-lg mb-3 text-orange-700">📖 How to Play:</h4>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Pick a bingo card theme below</li>
          <li>Read a story with someone</li>
          <li>Click squares when you find those elements</li>
          <li>Get 5 in a row to win!</li>
          <li>Collect badges for achievements</li>
        </ol>
        <div className="mt-4 p-3 bg-yellow-200 rounded-lg font-semibold text-sm text-orange-900">
          💡 The center square is FREE! You can also win by filling the whole card!
        </div>
      </Card>

      <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <h4 className="font-bold text-lg mb-3 text-purple-700">Choose Your Theme:</h4>
        <div className="flex flex-wrap gap-3 mb-4">
          {(Object.keys(THEMES) as ThemeKey[]).map((themeKey) => (
            <Button
              key={themeKey}
              onClick={() => changeTheme(themeKey)}
              className={`rounded-full ${
                currentTheme === themeKey
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {THEMES[themeKey].title}
            </Button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 px-6 py-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-purple-600">{completedSquares.size}</div>
            <div className="text-sm text-gray-600">Marked</div>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-orange-100 px-6 py-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-orange-600">{unlockedBadges.size}</div>
            <div className="text-sm text-gray-600">Badges</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl p-6 mb-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-center text-white mb-4">{THEMES[currentTheme].title}</h3>
        <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
          {currentCard.map((item, index) => (
            <div
              key={index}
              onClick={() => toggleSquare(index)}
              className={`aspect-square p-2 flex flex-col items-center justify-center text-center text-xs cursor-pointer rounded-xl transition-all shadow-lg ${
                item.free
                  ? 'bg-gradient-to-br from-pink-400 to-red-400 text-white font-bold'
                  : completedSquares.has(index)
                  ? isInBingoLine(index)
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-105 ring-4 ring-yellow-400'
                    : 'bg-gradient-to-br from-green-300 to-teal-300 text-white scale-105'
                  : 'bg-white hover:bg-blue-50 hover:scale-105'
              }`}
            >
              <span className="text-2xl mb-1">{item.emoji}</span>
              <span className="leading-tight">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">Progress: {completedSquares.size}/25</div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-6 transition-all duration-500 flex items-center justify-center text-white text-sm font-bold"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <Button
          onClick={handleCheckBingo}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-8 py-6 rounded-full shadow-lg"
        >
          <Trophy className="w-5 h-5 mr-2" />
          Check for Bingo!
        </Button>
        <Button
          onClick={generateCard}
          className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-bold px-8 py-6 rounded-full shadow-lg"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          New Card
        </Button>
        <Button
          onClick={() => setCompletedSquares(new Set([12]))}
          className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold px-8 py-6 rounded-full shadow-lg"
        >
          Clear All
        </Button>
      </div>

      {hasBingo && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white rounded-2xl p-8 mb-6 text-center animate-pulse shadow-2xl">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-2">BINGO! You're a Reading Champion!</h2>
          <div className="text-6xl mb-4">🎉🏆🎊</div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-center text-white mb-4">
          <Award className="inline w-6 h-6 mr-2" />
          Your Badge Collection
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`bg-white rounded-xl p-4 text-center transition-all ${
                unlockedBadges.has(badge.id) ? 'opacity-100 hover:scale-110 cursor-pointer shadow-lg' : 'opacity-30 grayscale'
              }`}
            >
              <div className="text-4xl mb-2">{badge.emoji}</div>
              <div className="text-xs font-bold text-gray-800">{badge.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
