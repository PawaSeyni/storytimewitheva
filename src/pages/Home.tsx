import { Link } from 'react-router-dom';
import { books } from '../data/books';
import BookCard from '../components/BookCard';
import EmailSignup from '../components/EmailSignup';

const testimonials = [
  {
    text: "My daughter asks for Eva's books every single night. The bilingual format has been incredible for her Spanish learning!",
    author: "Maria T.",
    role: "Mom of a 5-year-old",
    stars: 5,
  },
  {
    text: "The Kindness Garden sparked a whole week of conversations about helping others. These books are more than stories.",
    author: "James R.",
    role: "Dad of two",
    stars: 5,
  },
  {
    text: "As a teacher, I recommend Eva's books to all my students' parents. The cultural diversity woven into each story is beautiful.",
    author: "Ms. Sandra L.",
    role: "1st Grade Teacher",
    stars: 5,
  },
];

const featuredBooks = books.filter(b => b.featured);

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-bg min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4 py-20">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 text-4xl star-float opacity-70">⭐</div>
        <div className="absolute top-20 right-16 text-3xl star-float opacity-60" style={{ animationDelay: '1s' }}>🌙</div>
        <div className="absolute bottom-20 left-20 text-3xl star-float opacity-50" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute bottom-16 right-10 text-4xl star-float opacity-60" style={{ animationDelay: '0.5s' }}>🎨</div>

        <div className="text-center text-white max-w-3xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Where Stories<br />Come to Life!
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-10 leading-relaxed drop-shadow-md">
            Discover magical bilingual books, fun activities, and reading adventures
            for curious minds of all ages with Eva
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/books" className="btn-primary text-lg px-8 py-4 shadow-2xl">
              ✨ Browse 50+ Magical Books
            </Link>
            <Link to="/activities" className="btn-secondary text-lg px-8 py-4">
              🎨 Explore Free Activities
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {[
            { number: '6+', label: 'Magical Books', emoji: '📚' },
            { number: '3', label: 'Languages', emoji: '🌍' },
            { number: '4.9/5', label: 'Amazon Rating', emoji: '⭐' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl mb-1">{stat.emoji}</div>
              <div className="text-3xl font-extrabold text-purple-700">{stat.number}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Featured Books</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Discover our carefully selected collection of magical stories
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/books" className="btn-primary text-lg px-8 py-4">
              Browse All Books →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">Three simple steps to magical reading</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', emoji: '🔍', title: 'Browse', desc: 'Explore our collection of bilingual books and activities' },
              { step: '2', emoji: '✨', title: 'Choose', desc: 'Pick the perfect story or activity for your child\'s age' },
              { step: '3', emoji: '🎉', title: 'Enjoy!', desc: 'Start reading, playing, and learning together' },
            ].map(item => (
              <div key={item.step} className="relative text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {item.step}
                </div>
                <div className="text-6xl mb-4 mt-4">{item.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Testimonials — Week 1 Improvement */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">What Parents Say</h2>
            <p className="text-gray-500 text-lg">Real families, real magic</p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-purple-50">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.stars).fill(null).map((_, j) => (
                    <span key={j} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-bold text-gray-800">{t.author}</p>
                  <p className="text-sm text-purple-600">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Activities Preview */}
      <section className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Fun Activities with Eva</h2>
            <p className="text-gray-500 text-lg">Learning comes alive through play!</p>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { emoji: '✍️', badge: 'New', title: 'Story Builder Challenge', desc: 'Create your own magical stories by choosing characters and settings.', ages: '6-8' },
              { emoji: '🎨', badge: 'Popular', title: "Eva's Coloring Adventure", desc: 'Choose a theme and color it with your favorite colors. Perfect for creative fun!', ages: '3-5' },
              { emoji: '✂️', badge: '', title: "Eva's Craft Corner", desc: 'Create bookmarks, character masks, and other fun crafts to enhance your reading experience.', ages: '6-8' },
            ].map((act, i) => (
              <div key={i} className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {act.badge && (
                  <span
                    className={`absolute top-4 right-4 z-10 text-xs font-bold px-2 py-1 rounded-full ${
                      act.badge === 'New' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {act.badge}
                  </span>
                )}
                <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
                <div className="p-6">
                  <span className="text-4xl block mb-3">{act.emoji}</span>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{act.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{act.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">Ages: {act.ages}</span>
                    <Link to="/activities" className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                      Try it →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/activities" className="btn-primary text-lg px-8 py-4">
              See All Activities →
            </Link>
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <EmailSignup />
    </main>
  );
}
