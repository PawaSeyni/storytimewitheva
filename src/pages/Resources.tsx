import { useState } from 'react';
import EmailSignup from '../components/EmailSignup';

const resources = [
  {
    emoji: '✨',
    category: 'Reading Tips',
    categoryColor: 'bg-blue-100 text-blue-700',
    title: '10 Ways to Make Reading Time Magical',
    desc: 'Transform ordinary reading sessions into memorable adventures your child will love.',
    readTime: '5 min read',
    popular: true,
  },
  {
    emoji: '📊',
    category: 'Child Development',
    categoryColor: 'bg-green-100 text-green-700',
    title: 'Age-Appropriate Reading Milestones',
    desc: 'What to expect at each stage and how to support your child\'s literacy journey.',
    readTime: '8 min read',
    popular: true,
  },
  {
    emoji: '🎨',
    category: 'Activity Ideas',
    categoryColor: 'bg-orange-100 text-orange-700',
    title: '5 Creative Follow-Up Activities After Reading',
    desc: 'Extend the learning and fun beyond the last page with these engaging activities.',
    readTime: '6 min read',
    popular: false,
  },
  {
    emoji: '💪',
    category: 'Building Engagement',
    categoryColor: 'bg-pink-100 text-pink-700',
    title: 'Building a Love for Reading in Reluctant Readers',
    desc: 'Practical strategies to help children who resist reading discover the joy of books.',
    readTime: '7 min read',
    popular: false,
  },
  {
    emoji: '🏠',
    category: 'Reading Tips',
    categoryColor: 'bg-blue-100 text-blue-700',
    title: 'Creating the Perfect Reading Environment',
    desc: 'Design a space that makes your child excited to pick up a book.',
    readTime: '4 min read',
    popular: false,
  },
  {
    emoji: '🧠',
    category: 'Child Development',
    categoryColor: 'bg-green-100 text-green-700',
    title: 'The Science of Reading: What Parents Need to Know',
    desc: 'Understanding how children learn to read can help you support them better.',
    readTime: '10 min read',
    popular: false,
  },
];

const categories = ['All Resources', 'Reading Tips', 'Activity Ideas', 'Child Development', 'Building Engagement'];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('All Resources');
  const [search, setSearch] = useState('');

  const filtered = resources.filter(r => {
    const matchesCat = activeCategory === 'All Resources' || r.category === activeCategory;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Parent Resources & Guides</h1>
          <p className="text-gray-500 text-lg">Expert tips, activities, and strategies to make reading time magical</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="relative max-w-sm mx-auto mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-50 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{r.emoji}</span>
                  {r.popular && (
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Popular</span>
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full mb-3 inline-block ${r.categoryColor}`}>
                  {r.category}
                </span>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-purple-700 transition-colors leading-snug">
                  {r.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{r.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    ⏱ {r.readTime}
                  </span>
                  <button className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📖</div>
              <p className="text-gray-500 text-lg">No resources found. Try a different search!</p>
            </div>
          )}
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
