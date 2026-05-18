import EmailSignup from '../components/EmailSignup';

const activities = [
  {
    emoji: '✍️',
    badge: 'New',
    badgeColor: 'bg-green-100 text-green-700',
    title: 'Story Builder Challenge',
    desc: 'Create your own magical stories by choosing characters and settings. Watch your story come to life!',
    ages: '6-8',
    category: 'Creative Writing',
  },
  {
    emoji: '🎨',
    badge: 'Popular',
    badgeColor: 'bg-orange-100 text-orange-700',
    title: "Eva's Coloring Adventure",
    desc: 'Choose a theme and color it with your favorite colors. Perfect for creative fun!',
    ages: '3-5',
    category: 'Art & Creativity',
  },
  {
    emoji: '✂️',
    badge: '',
    badgeColor: '',
    title: "Eva's Craft Corner",
    desc: 'Create bookmarks, character masks, and other fun crafts to enhance your reading experience with step-by-step instructions.',
    ages: '6-8',
    category: 'Crafts',
  },
  {
    emoji: '🧩',
    badge: '',
    badgeColor: '',
    title: 'Character Matching Game',
    desc: 'Match characters from Eva\'s stories with their key traits and adventures in this fun memory game.',
    ages: '5-8',
    category: 'Games',
  },
  {
    emoji: '📖',
    badge: '',
    badgeColor: '',
    title: 'Reading Bingo',
    desc: 'Complete reading challenges and mark off your bingo card. A fun way to build reading habits!',
    ages: '6-9',
    category: 'Reading',
  },
  {
    emoji: '🎭',
    badge: '',
    badgeColor: '',
    title: 'Story Retelling Theater',
    desc: 'Act out your favorite scenes from Eva\'s books. Builds comprehension, confidence, and creativity!',
    ages: '4-8',
    category: 'Drama',
  },
];

export default function Activities() {
  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-green-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Fun Activities with Eva</h1>
          <p className="text-gray-500 text-lg">Learning comes alive through play!</p>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl">{act.emoji}</span>
                  {act.badge && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full mb-3 inline-block">
                  {act.category}
                </span>
                <h3 className="font-bold text-gray-800 text-xl mb-2">{act.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{act.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Ages: <strong>{act.ages}</strong></span>
                  <button className="text-sm font-semibold text-purple-600 border border-purple-200 px-4 py-1.5 rounded-full hover:bg-purple-50 transition-colors">
                    Try This Activity →
                  </button>
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
