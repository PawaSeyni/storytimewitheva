import { Link } from 'react-router-dom';
import EmailSignup from '../components/EmailSignup';

type Activity = {
  emoji: string;
  badge: string;
  badgeColor: string;
  title: string;
  desc: string;
  ages: string;
  category: string;
  slug?: string; // present means demo is live
};

const activities: Activity[] = [
  {
    emoji: '✍️',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700',
    title: 'Story Dice Creator',
    desc: 'Roll the dice to mix characters, settings, and plot twists into a brand-new story every time.',
    ages: '6-9',
    category: 'Creative Writing',
    slug: 'story-builder',
  },
  {
    emoji: '🎭',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700',
    title: "Character Creation Workshop",
    desc: 'Step-by-step character builder — type, name, look, personality, powers, and backstory.',
    ages: '6-9',
    category: 'Creative Writing',
    slug: 'character-workshop',
  },
  {
    emoji: '📓',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700',
    title: 'Adventure Reading Journal',
    desc: "A simple journal to record books you've read, your favorite characters and scenes. Saves to your device.",
    ages: '6-9',
    category: 'Reading',
    slug: 'adventure-journal',
  },
  {
    emoji: '🎨',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700',
    title: "Eva's Coloring Adventure",
    desc: 'In-browser coloring book — pick a scene, pick your palette, color it in. Saves what you make.',
    ages: '3-7',
    category: 'Art & Creativity',
    slug: 'coloring',
  },
  {
    emoji: '✂️',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700',
    title: "Eva's Craft Corner",
    desc: 'Step-by-step craft instructions — bookmarks, masks, story dioramas built from common materials.',
    ages: '6-9',
    category: 'Crafts',
    slug: 'craft-corner',
  },
  {
    emoji: '🔖',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700',
    title: 'Bookmark Designer',
    desc: 'Design and print your own bookmarks with themes from the books, plus a quote you choose.',
    ages: '5-9',
    category: 'Crafts',
    slug: 'bookmark-designer',
  },
  {
    emoji: '🎯',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700',
    title: 'Reading Bingo',
    desc: 'Complete reading challenges across a bingo board — five in a row earns a celebration.',
    ages: '6-9',
    category: 'Reading',
    slug: 'bingo',
  },
  {
    emoji: '🧩',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700',
    title: 'Puzzle Paradise',
    desc: 'Word puzzles and riddles based on the stories — a thinking workout that builds vocabulary.',
    ages: '7-9',
    category: 'Games',
    slug: 'puzzles',
  },
];

export default function Activities() {
  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Fun Activities with Eva</h1>
          <p className="text-gray-500 text-lg">Learning comes alive through play!</p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-50 flex flex-col"
              >
                <span className={`absolute top-4 right-4 z-10 text-xs font-bold px-2 py-1 rounded-full ${act.badgeColor}`}>
                  {act.badge}
                </span>
                <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-5xl block mb-4">{act.emoji}</span>
                  <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full mb-3 inline-block self-start">
                    {act.category}
                  </span>
                  <h3 className="font-bold text-gray-800 text-xl mb-2">{act.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{act.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-500">
                      Ages: <strong>{act.ages}</strong>
                    </span>
                    {act.slug ? (
                      <Link
                        to={`/activities/${act.slug}`}
                        className="text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-1.5 rounded-full shadow-sm transition-all"
                      >
                        Try Now →
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-gray-400 px-4 py-1.5 rounded-full border border-gray-200">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
