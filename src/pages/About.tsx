import { Link } from 'react-router-dom';
import EmailSignup from '../components/EmailSignup';

export default function About() {
  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About Story Time with Eva</h1>
          <p className="text-gray-500 text-lg">Making reading magical for every child</p>
        </div>
      </section>

      {/* Author Bio — Week 1 Improvement: Author Photo + Bio */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Author Photo Placeholder */}
            <div className="flex-shrink-0">
              <div className="w-52 h-52 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex flex-col items-center justify-center shadow-xl border-4 border-white ring-4 ring-purple-100">
                <span className="text-6xl">👩‍🦳</span>
                <span className="text-xs text-purple-500 mt-2 font-medium">Eva Gallo</span>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3 italic">
                📸 Replace with your photo
              </p>
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">A Note from the Author</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  This children's book series is a lively collection of imaginative stories from my childhood,
                  created for kids ages 3 to 9.
                </p>
                <p>
                  After a lifelong career in public health, I am now a full-time grandmother, caring for two
                  young granddaughters with an endless appetite for bedtime stories.
                </p>
                <p>
                  My inspiration comes from childhood memories with my mother and aunt. This book — and the
                  series it belongs to — is my way of passing down traditions and lessons from a time before
                  digital media.
                </p>
                <p className="font-medium text-purple-700">
                  My motivation is simple: to share that magic with a new generation.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div>
                  <p className="font-bold text-gray-800 text-lg">Eva Gallo</p>
                  <p className="text-purple-600 text-sm">@StorytimeWithEvaGallo</p>
                </div>
                <span className="text-2xl">📚💜✨</span>
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://www.amazon.com/author/evagallo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                >
                  🛒 View Books on Amazon
                </a>
                <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-purple-400 text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-all duration-200 text-sm">
                  ✉️ Contact Eva
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="py-14 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Our Mission & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { emoji: '📖', color: 'from-purple-400 to-purple-600', title: 'Our Story', text: 'Founded by educators and parents who understand the power of storytelling, we created Eva to make quality children\'s literature accessible to families everywhere.' },
              { emoji: '💜', color: 'from-pink-400 to-pink-600', title: 'Why Books Matter', text: 'Reading with Eva isn\'t just about words on a page — it\'s about opening doorways to new worlds, building vocabulary, and creating precious memories that last forever.' },
              { emoji: '🎯', color: 'from-blue-400 to-blue-600', title: 'Our Mission', text: 'We believe every child deserves access to stories that spark imagination, build empathy, and celebrate the joy of reading with Eva as their guide.' },
              { emoji: '🌍', color: 'from-green-400 to-green-600', title: 'Our Values', text: 'Quality storytelling, inclusive representation, educational excellence, and making reading accessible and fun for all families around the world.' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-50">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {card.emoji}
                </div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
