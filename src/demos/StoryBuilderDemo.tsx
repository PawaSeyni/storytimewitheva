import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Copy, Save } from 'lucide-react';

type StoryItem = { name: string; emoji: string };
type ElementKey = 'character' | 'setting' | 'goal' | 'problem' | 'solution' | 'twist';
type Story = Partial<Record<ElementKey, StoryItem>>;

const STORY_ELEMENTS: Record<ElementKey, StoryItem[]> = {
  character: [
    { name: 'a brave knight named Sir Courage', emoji: '⚔️' },
    { name: 'a clever fox named Whiskers', emoji: '🦊' },
    { name: 'a friendly dragon named Spark', emoji: '🐉' },
    { name: 'a curious robot named Bolt', emoji: '🤖' },
    { name: 'a magical fairy named Luna', emoji: '🧚' },
    { name: 'a wise wizard named Merlin', emoji: '🧙' },
  ],
  setting: [
    { name: 'an enchanted forest full of glowing mushrooms', emoji: '🌳' },
    { name: 'a floating castle in the clouds', emoji: '🏰' },
    { name: 'a mysterious underwater city', emoji: '🌊' },
    { name: 'a candy-filled kingdom', emoji: '🍭' },
    { name: 'a futuristic space station', emoji: '🚀' },
    { name: 'a magical library with endless books', emoji: '📚' },
  ],
  goal: [
    { name: 'find the legendary treasure', emoji: '💎' },
    { name: 'save the kingdom from danger', emoji: '🛡️' },
    { name: 'discover a secret recipe', emoji: '📜' },
    { name: 'make a new best friend', emoji: '🤝' },
    { name: 'win the grand tournament', emoji: '🏆' },
    { name: 'unlock ancient magic', emoji: '✨' },
  ],
  problem: [
    { name: 'a mischievous goblin steals the map', emoji: '😈' },
    { name: 'a giant maze blocks the way', emoji: '🌀' },
    { name: 'everything is frozen by an ice spell', emoji: '❄️' },
    { name: 'a riddle must be solved first', emoji: '❓' },
    { name: 'time is running out quickly', emoji: '⏰' },
    { name: 'they must work with an old rival', emoji: '😤' },
  ],
  solution: [
    { name: 'uses kindness to win over enemies', emoji: '💝' },
    { name: 'discovers a hidden talent', emoji: '⭐' },
    { name: 'finds a magical item that helps', emoji: '🔮' },
    { name: 'teams up with unlikely friends', emoji: '👥' },
    { name: 'remembers wise advice from a mentor', emoji: '💭' },
    { name: 'creates a clever invention', emoji: '💡' },
  ],
  twist: [
    { name: 'The villain becomes a good friend!', emoji: '😊' },
    { name: 'The treasure was friendship all along!', emoji: '💖' },
    { name: 'They discover they have royal blood!', emoji: '👑' },
    { name: 'The adventure was all a magical test!', emoji: '📝' },
    { name: 'They become the new guardian!', emoji: '🦸' },
    { name: 'They find a portal to new adventures!', emoji: '🌈' },
  ],
};

const ELEMENTS_LIST: ElementKey[] = ['character', 'setting', 'goal', 'problem', 'solution', 'twist'];

const LABELS: Record<ElementKey, string> = {
  character: 'Character',
  setting: 'Setting',
  goal: 'Goal',
  problem: 'Problem',
  solution: 'Solution',
  twist: 'Plot Twist',
};

const ICONS: Record<ElementKey, string> = {
  character: '👤',
  setting: '🗺️',
  goal: '🎯',
  problem: '⚠️',
  solution: '💡',
  twist: '🌟',
};

const ROLL_PROMPTS: Record<ElementKey, string> = {
  character: 'Roll to discover your hero!',
  setting: 'Roll to find where the story happens!',
  goal: 'Roll to see what they want!',
  problem: 'Roll to discover the challenge!',
  solution: 'Roll to find how they succeed!',
  twist: 'Roll for a surprise ending!',
};

type SavedStory = { text: string; date: string };

export default function StoryBuilderDemo() {
  const [currentStory, setCurrentStory] = useState<Story>({});
  const [rollingElement, setRollingElement] = useState<ElementKey | null>(null);
  const [showStory, setShowStory] = useState(false);
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);

  const rollDice = (element: ElementKey) => {
    setRollingElement(element);
    setTimeout(() => {
      const options = STORY_ELEMENTS[element];
      const selected = options[Math.floor(Math.random() * options.length)];
      setCurrentStory(prev => {
        const updated = { ...prev, [element]: selected };
        if (Object.keys(updated).length === 6) {
          setTimeout(() => setShowStory(true), 500);
        }
        return updated;
      });
      setRollingElement(null);
    }, 500);
  };

  const rollAllDice = () => {
    setShowStory(false);
    ELEMENTS_LIST.forEach((element, index) => {
      setTimeout(() => {
        setRollingElement(element);
        setTimeout(() => {
          const options = STORY_ELEMENTS[element];
          const selected = options[Math.floor(Math.random() * options.length)];
          setCurrentStory(prev => ({ ...prev, [element]: selected }));
          setRollingElement(null);
          if (index === ELEMENTS_LIST.length - 1) {
            setTimeout(() => setShowStory(true), 500);
          }
        }, 500);
      }, index * 800);
    });
  };

  const generateStoryText = () => {
    return `Once upon a time, there lived ${currentStory.character?.name}. They lived in ${currentStory.setting?.name}. One day, they decided to ${currentStory.goal?.name}! But there was a problem: ${currentStory.problem?.name}. Thinking quickly, our hero ${currentStory.solution?.name}! And here's the amazing part: ${currentStory.twist?.name} The End! 🌟`;
  };

  const copyStory = () => {
    navigator.clipboard.writeText(generateStoryText());
    alert('Story copied to clipboard!');
  };

  const saveStory = () => {
    const date = new Date().toLocaleString();
    setSavedStories(prev => [...prev, { text: generateStoryText(), date }]);
    alert('Story saved! Check your saved stories below!');
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">Story Dice Creator with Eva</h3>
        <p className="text-gray-700 mb-4">Roll the dice to create your own amazing adventure!</p>
        <div className="text-5xl mb-4">🎲📖</div>
      </div>

      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-2xl p-6 mb-6 text-center">
        <h4 className="text-2xl font-bold mb-3">✨ How to Play ✨</h4>
        <p className="text-lg leading-relaxed">
          Click on each dice to roll for different story elements, or click the big button to roll them all at once! Once you have all your elements, your unique story will appear below. Every roll creates a brand new adventure!
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {ELEMENTS_LIST.map((element) => (
          <Card
            key={element}
            className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-orange-300 p-6 hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">{ICONS[element]}</span>
                {LABELS[element]}
              </div>
              <Button
                onClick={() => rollDice(element)}
                disabled={rollingElement === element}
                variant="outline"
                className={`w-14 h-14 p-0 rounded-xl border-2 border-gray-800 text-3xl hover:bg-yellow-200 hover:rotate-12 transition-all ${
                  rollingElement === element ? 'animate-spin' : ''
                }`}
              >
                🎲
              </Button>
            </div>
            <div
              className={`bg-white rounded-xl p-4 min-h-[80px] flex items-center justify-center text-center ${
                currentStory[element] ? 'text-gray-800' : 'text-gray-400 italic'
              }`}
            >
              {currentStory[element] ? (
                <span>
                  <span className="text-3xl mr-2">{currentStory[element]!.emoji}</span>
                  {currentStory[element]!.name}
                </span>
              ) : (
                ROLL_PROMPTS[element]
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mb-6">
        <Button
          onClick={rollAllDice}
          disabled={rollingElement !== null}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xl px-12 py-8 rounded-full shadow-2xl"
        >
          🎲 ROLL ALL DICE! 🎲
        </Button>
      </div>

      {showStory && Object.keys(currentStory).length === 6 && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-8 mb-6">
          <div className="text-3xl font-bold text-center mb-6">📚 Your Amazing Story 📚</div>
          <div className="text-lg leading-relaxed text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
            {generateStoryText()}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={saveStory} className="bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full">
              <Save className="w-4 h-4 mr-2" />
              Save Story
            </Button>
            <Button onClick={copyStory} className="bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full">
              <Copy className="w-4 h-4 mr-2" />
              Copy Story
            </Button>
            <Button onClick={rollAllDice} className="bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Create New Story
            </Button>
          </div>
        </div>
      )}

      <div className="bg-green-300 text-green-900 rounded-2xl p-6 border-l-8 border-green-600 mb-6">
        <h4 className="font-bold text-lg mb-2">✏️ Story Writing Tips:</h4>
        <p className="leading-relaxed">
          Once you have your story elements, try expanding your tale! Add more details about your character, describe the setting with colorful words, or create dialogue between characters. Every great author starts with a simple idea!
        </p>
      </div>

      {savedStories.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-purple-700 mb-4">📚 Your Saved Stories 📚</h3>
          <div className="space-y-4">
            {[...savedStories].reverse().map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border-l-4 border-purple-500 shadow-lg">
                <div className="text-purple-700 font-bold text-lg mb-2">
                  Story #{savedStories.length - index} - {story.date}
                </div>
                <div className="text-gray-700 leading-relaxed">{story.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
