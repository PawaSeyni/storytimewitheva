import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Pencil } from 'lucide-react';

const TYPES = [
  { icon: '🦸', name: 'Hero' },
  { icon: '🐉', name: 'Creature' },
  { icon: '👑', name: 'Royalty' },
  { icon: '🧙', name: 'Wizard' },
  { icon: '🤖', name: 'Robot' },
  { icon: '🧚', name: 'Fairy' },
] as const;

const TRAITS = [
  { icon: '😊', name: 'Friendly' },
  { icon: '💪', name: 'Brave' },
  { icon: '🤓', name: 'Smart' },
  { icon: '😂', name: 'Funny' },
  { icon: '🤗', name: 'Kind' },
  { icon: '🎭', name: 'Mysterious' },
  { icon: '⚡', name: 'Energetic' },
  { icon: '🌸', name: 'Gentle' },
] as const;

export default function CharacterWorkshopDemo() {
  const [selectedType, setSelectedType] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [charName, setCharName] = useState('');
  const [colors, setColors] = useState('');
  const [eyes, setEyes] = useState('');
  const [features, setFeatures] = useState('');
  const [outfit, setOutfit] = useState('');
  const [powers, setPowers] = useState('');
  const [home, setHome] = useState('');
  const [loves, setLoves] = useState('');
  const [fears, setFears] = useState('');
  const [goal, setGoal] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(t => t !== trait));
    } else if (selectedTraits.length < 3) {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const handleShowSummary = () => {
    setShowSummary(true);
    setTimeout(() => {
      document.getElementById('summary-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const StepHeader = ({ n, title }: { n: number; title: string }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">{n}</div>
      <h4 className="text-2xl font-bold text-gray-800">{title}</h4>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">Eva's Character Creation Workshop</h3>
        <p className="text-gray-700 mb-4">Follow these fun steps to bring your character to life!</p>
        <div className="text-5xl mb-4">🎨✨</div>
      </div>

      <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl p-6 mb-6 text-center">
        <h4 className="text-2xl font-bold mb-3">✨ How to Play ✨</h4>
        <ol className="list-decimal list-inside space-y-2 text-lg text-left max-w-2xl mx-auto">
          <li>Follow each step to design your unique character</li>
          <li>Choose their type, give them a name, and design their look</li>
          <li>Pick personality traits and special powers</li>
          <li>Create their backstory and goals</li>
          <li>See your complete character summary at the end!</li>
        </ol>
      </div>

      {/* Step 1: Character Type */}
      <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 mb-6 border-4 border-orange-300">
        <StepHeader n={1} title="Choose Your Character Type" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {TYPES.map((type) => (
            <Card
              key={type.icon}
              onClick={() => setSelectedType(type.name)}
              className={`p-4 text-center cursor-pointer transition-all hover:scale-105 ${
                selectedType === type.name
                  ? 'bg-gradient-to-br from-pink-400 to-red-400 text-white ring-4 ring-pink-300'
                  : 'bg-white hover:bg-pink-50'
              }`}
            >
              <div className="text-3xl mb-1">{type.icon}</div>
              <div className="font-medium text-xs">{type.name}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Step 2: Name */}
      <div className="bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl p-6 mb-6 border-4 border-purple-300">
        <StepHeader n={2} title="Give Them a Name" />
        <Input
          value={charName}
          onChange={(e) => setCharName(e.target.value)}
          placeholder="Type your character's name here..."
          className="text-lg border-2 border-purple-400 focus:border-purple-600"
        />
      </div>

      {/* Step 3: Appearance */}
      <div className="bg-gradient-to-r from-green-200 to-cyan-200 rounded-2xl p-6 mb-6 border-4 border-cyan-300">
        <StepHeader n={3} title="Design Their Look" />
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Colors:</label>
            <Input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="What colors will they wear?" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Eyes:</label>
            <Input value={eyes} onChange={(e) => setEyes(e.target.value)} placeholder="Big? Small? Sparkly?" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Hair/Features:</label>
            <Input value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Curly hair? Wings? Horns?" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Outfit:</label>
            <Input value={outfit} onChange={(e) => setOutfit(e.target.value)} placeholder="What do they wear?" />
          </div>
        </div>
        <div className="mt-4 bg-green-300 text-green-900 p-3 rounded-lg font-semibold text-sm">
          🌟 Characters with unique features are easier to remember!
        </div>
      </div>

      {/* Step 4: Personality */}
      <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-6 mb-6 border-4 border-rose-300">
        <StepHeader n={4} title="Create Their Personality" />
        <p className="text-gray-700 mb-3">Pick 3 personality traits!</p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-3">
          {TRAITS.map((trait) => (
            <Card
              key={trait.icon}
              onClick={() => toggleTrait(trait.name)}
              className={`p-3 text-center cursor-pointer transition-all hover:scale-105 ${
                selectedTraits.includes(trait.name)
                  ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white ring-4 ring-purple-300'
                  : 'bg-white hover:bg-purple-50'
              }`}
            >
              <div className="text-2xl mb-1">{trait.icon}</div>
              <div className="font-medium text-xs">{trait.name}</div>
            </Card>
          ))}
        </div>
        <div className="text-sm text-gray-600 text-center">{selectedTraits.length}/3 selected</div>
      </div>

      {/* Step 5: Powers */}
      <div className="bg-gradient-to-r from-indigo-200 to-blue-200 rounded-2xl p-6 mb-6 border-4 border-blue-300">
        <StepHeader n={5} title="Give Them Special Powers" />
        <Textarea
          value={powers}
          onChange={(e) => setPowers(e.target.value)}
          placeholder="What makes your character special?"
          rows={3}
          className="border-2 border-blue-400"
        />
      </div>

      {/* Step 6: Story */}
      <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-6 mb-6 border-4 border-pink-300">
        <StepHeader n={6} title="Create Their Story" />
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">🏠 Where do they live?</label>
            <Input value={home} onChange={(e) => setHome(e.target.value)} placeholder="A castle? The forest? Space?" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">❤️ What do they love?</label>
            <Input value={loves} onChange={(e) => setLoves(e.target.value)} placeholder="Adventure? Reading? Helping others?" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">😰 What are they afraid of?</label>
            <Input value={fears} onChange={(e) => setFears(e.target.value)} placeholder="Even heroes have fears!" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">🎯 What's their goal?</label>
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="What do they want to achieve?" />
          </div>
        </div>
      </div>

      {/* Step 7: Draw */}
      <div className="bg-gradient-to-r from-yellow-200 to-lime-200 rounded-2xl p-6 mb-6 border-4 border-lime-300">
        <StepHeader n={7} title="Draw Your Character!" />
        <div className="bg-white rounded-xl p-8 text-center border-4 border-dashed border-purple-400">
          <Pencil className="w-16 h-16 mx-auto mb-4 text-purple-500" />
          <p className="text-gray-700 text-lg">Grab some paper and colored pencils to draw your character!</p>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleShowSummary}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          See My Character Summary!
        </Button>
      </div>

      {showSummary && (
        <div id="summary-section" className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-center mb-6">🎉 Your Amazing Character! 🎉</h3>
          <div className="space-y-3 text-lg">
            <p><strong>📛 Name:</strong> {charName || 'My Character'}</p>
            {selectedType && <p><strong>✨ Type:</strong> {selectedType}</p>}
            {(colors || eyes || features || outfit) && (
              <p>
                <strong>🎨 Appearance:</strong>{' '}
                {colors && `${colors} colors`}
                {eyes && `, ${eyes} eyes`}
                {features && `, ${features}`}
                {outfit && `, wearing ${outfit}`}
              </p>
            )}
            {selectedTraits.length > 0 && <p><strong>💫 Personality:</strong> {selectedTraits.join(', ')}</p>}
            {powers && <p><strong>⚡ Powers:</strong> {powers}</p>}
            {home && <p><strong>🏠 Home:</strong> {home}</p>}
            {loves && <p><strong>❤️ Loves:</strong> {loves}</p>}
            {fears && <p><strong>😰 Fears:</strong> {fears}</p>}
            {goal && <p><strong>🎯 Goal:</strong> {goal}</p>}
            <p className="text-center mt-6 text-xl">✨ Now you're ready to write stories about {charName || 'your character'}! ✨</p>
          </div>
        </div>
      )}
    </div>
  );
}
