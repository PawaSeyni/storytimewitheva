import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shuffle, Save, Printer } from 'lucide-react';

type Item = { emoji: string; name: string };

const ANIMALS: Item[] = [
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🦉', name: 'Owl' },
  { emoji: '🐨', name: 'Koala' },
  { emoji: '🦋', name: 'Butterfly' },
  { emoji: '🐧', name: 'Penguin' },
  { emoji: '🦅', name: 'Eagle' },
  { emoji: '🐯', name: 'Tiger' },
  { emoji: '🐘', name: 'Elephant' },
  { emoji: '🦒', name: 'Giraffe' },
  { emoji: '🐬', name: 'Dolphin' },
];

const COUNTRIES: Item[] = [
  { emoji: '🇺🇸', name: 'USA' },
  { emoji: '🇯🇵', name: 'Japan' },
  { emoji: '🇫🇷', name: 'France' },
  { emoji: '🇬🇧', name: 'UK' },
  { emoji: '🇦🇺', name: 'Australia' },
  { emoji: '🇨🇦', name: 'Canada' },
  { emoji: '🇧🇷', name: 'Brazil' },
  { emoji: '🇮🇹', name: 'Italy' },
  { emoji: '🇲🇽', name: 'Mexico' },
  { emoji: '🇨🇳', name: 'China' },
  { emoji: '🇮🇳', name: 'India' },
  { emoji: '🇰🇷', name: 'Korea' },
];

const COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
];

const PATTERNS: { name: string; value: string }[] = [
  { name: 'None', value: 'none' },
  { name: 'Dots', value: 'radial-gradient(circle, white 2px, transparent 2px)' },
  {
    name: 'Lines',
    value:
      'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 40px)',
  },
  {
    name: 'Waves',
    value:
      'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)',
  },
];

type Template = {
  id: string;
  icon: string;
  animal: Item;
  country: Item;
  color: string;
  text: string;
  name: string;
  subtitle: string;
};

const TEMPLATES: Template[] = [
  { id: 'safari', icon: '🦁🌍', animal: ANIMALS[1], country: COUNTRIES[9], color: COLORS[3], text: 'Safari Adventure', name: 'Safari Adventure', subtitle: 'African Wildlife' },
  { id: 'ocean', icon: '🐬🌊', animal: ANIMALS[11], country: COUNTRIES[5], color: COLORS[2], text: 'Ocean Explorer', name: 'Ocean Explorer', subtitle: 'Sea Creatures' },
  { id: 'japan', icon: '🐼🇯🇵', animal: ANIMALS[2], country: COUNTRIES[1], color: COLORS[6], text: 'Japan Journey', name: 'Japan Journey', subtitle: 'Asian Culture' },
  { id: 'arctic', icon: '🐧❄️', animal: ANIMALS[6], country: COUNTRIES[5], color: COLORS[2], text: 'Arctic Circle', name: 'Arctic Circle', subtitle: 'Polar Animals' },
];

const QUOTES = ['Adventure Awaits', 'Keep Reading', 'Book Lover', 'Story Time', 'My Library'];

export default function BookmarkCraftsDemo() {
  const [selectedAnimal, setSelectedAnimal] = useState<Item>(ANIMALS[0]);
  const [selectedCountry, setSelectedCountry] = useState<Item>(COUNTRIES[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedPattern, setSelectedPattern] = useState('none');
  const [bookmarkText, setBookmarkText] = useState('');

  const loadTemplate = (template: Template) => {
    setSelectedAnimal(template.animal);
    setSelectedCountry(template.country);
    setSelectedColor(template.color);
    setBookmarkText(template.text);
    setSelectedPattern('none');
  };

  const randomizeDesign = () => {
    setSelectedAnimal(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
    setSelectedCountry(COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]);
    setSelectedColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setSelectedPattern(PATTERNS[Math.floor(Math.random() * PATTERNS.length)].value);
    setBookmarkText(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  };

  const handlePrint = () => window.print();

  const handleSave = () => {
    const design = { selectedAnimal, selectedCountry, selectedColor, selectedPattern, bookmarkText };
    localStorage.setItem('bookmarkDesign', JSON.stringify(design));
    alert('Design saved!');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">Bookmark Designer with Eva</h3>
        <p className="text-gray-700 mb-4">Create your own beautiful bookmarks with animals and country themes!</p>
        <div className="text-5xl mb-4">🎨📚</div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 mb-6">
        <h4 className="text-2xl font-bold text-white text-center mb-4">✨ Quick Start Templates ✨</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TEMPLATES.map((template) => (
            <Card
              key={template.id}
              onClick={() => loadTemplate(template)}
              className="bg-white p-4 text-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-2">{template.icon}</div>
              <div className="font-bold text-purple-700">{template.name}</div>
              <div className="text-xs text-gray-600">{template.subtitle}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 border-4 border-orange-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">🐾 Choose Your Animal</h4>
            <div className="grid grid-cols-4 gap-3">
              {ANIMALS.map((animal) => (
                <Card
                  key={animal.emoji}
                  onClick={() => setSelectedAnimal(animal)}
                  className={`p-3 text-center cursor-pointer transition-all hover:scale-105 ${
                    selectedAnimal.emoji === animal.emoji
                      ? 'bg-gradient-to-br from-pink-400 to-red-400 text-white ring-4 ring-pink-300'
                      : 'bg-white'
                  }`}
                >
                  <div className="text-3xl mb-1">{animal.emoji}</div>
                  <div className="text-xs font-medium">{animal.name}</div>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl p-6 border-4 border-cyan-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">🌍 Choose Country Theme</h4>
            <div className="grid grid-cols-4 gap-3">
              {COUNTRIES.map((country) => (
                <Card
                  key={country.emoji}
                  onClick={() => setSelectedCountry(country)}
                  className={`p-3 text-center cursor-pointer transition-all hover:scale-105 ${
                    selectedCountry.emoji === country.emoji
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white ring-4 ring-blue-300'
                      : 'bg-white'
                  }`}
                >
                  <div className="text-3xl mb-1">{country.emoji}</div>
                  <div className="text-xs font-medium">{country.name}</div>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-200 to-teal-200 rounded-2xl p-6 border-4 border-teal-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">🎨 Choose Background Color</h4>
            <div className="grid grid-cols-5 gap-3">
              {COLORS.map((color, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`w-full aspect-square rounded-full cursor-pointer transition-all hover:scale-110 ${
                    selectedColor === color ? 'ring-4 ring-gray-800 scale-110' : 'ring-2 ring-white'
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-6 border-4 border-rose-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">✏️ Add Your Text</h4>
            <Input
              value={bookmarkText}
              onChange={(e) => setBookmarkText(e.target.value)}
              placeholder="Your name or favorite quote..."
              maxLength={30}
              className="text-lg border-2 border-rose-400"
            />
          </div>

          <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-6 border-4 border-pink-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">🎭 Choose Pattern</h4>
            <div className="grid grid-cols-4 gap-3">
              {PATTERNS.map((pattern) => (
                <Card
                  key={pattern.name}
                  onClick={() => setSelectedPattern(pattern.value)}
                  className={`p-4 text-center cursor-pointer transition-all hover:scale-105 ${
                    selectedPattern === pattern.value
                      ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white ring-4 ring-purple-300'
                      : 'bg-white'
                  }`}
                >
                  <div className="font-medium text-sm">{pattern.name}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-purple-700 mb-4">📖 Your Bookmark Preview</h4>
            <div
              className="w-72 h-[32rem] mx-auto rounded-2xl shadow-2xl overflow-hidden relative"
              style={{ background: selectedColor }}
            >
              {selectedPattern !== 'none' && (
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: selectedPattern, backgroundSize: '20px 20px' }}
                />
              )}
              <div className="relative z-10 h-full flex flex-col items-center justify-between p-8 text-white">
                <div className="text-2xl font-bold text-center">{bookmarkText || 'My Bookmark'}</div>
                <div className="text-8xl">{selectedAnimal.emoji}</div>
                <div className="text-xl font-semibold text-center">
                  {selectedCountry.emoji} {selectedCountry.name}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handlePrint}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-6 text-lg"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Bookmark
            </Button>
            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white font-bold py-6 text-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Design
            </Button>
            <Button
              onClick={randomizeDesign}
              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold py-6 text-lg"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Surprise Me!
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-blue-400 text-white rounded-2xl p-6 mt-6">
        <h4 className="text-xl font-bold mb-3">💡 Bookmark Making Tips:</h4>
        <ul className="space-y-2">
          {[
            'Choose contrasting colors for text to stand out',
            'Animals and countries make great conversation starters',
            'Make multiple bookmarks as gifts for friends!',
            'Try creating a collection for different book genres',
          ].map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-yellow-300">★</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-6 mt-6 border-4 border-dashed border-purple-400">
        <h4 className="text-xl font-bold text-purple-700 mb-3">📋 Printing Instructions:</h4>
        <ol className="space-y-2 list-decimal list-inside">
          {[
            'Click the print button above',
            "In the print dialog, select 'Portrait' orientation",
            'Use cardstock or thick paper for best results',
            'After printing, cut around the bookmark',
            'Optional: Laminate for durability!',
            'Add a hole at the top and thread ribbon for a tassel',
          ].map((step, idx) => (
            <li key={idx} className="text-gray-700">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
