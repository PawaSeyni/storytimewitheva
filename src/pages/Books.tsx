import { useState } from 'react';
import { books } from '../data/books';
import BookCard from '../components/BookCard';
import EmailSignup from '../components/EmailSignup';

export default function Books() {
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState('All');

  const ageFilters = ['All', '3-5 years', '6-8 years', '9+ years'];

  const filtered = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.description.toLowerCase().includes(search.toLowerCase()) ||
      book.theme.toLowerCase().includes(search.toLowerCase());
    const matchesAge = ageFilter === 'All' || book.ageRange.includes(ageFilter.split(' ')[0]);
    return matchesSearch && matchesAge;
  });

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Magical Book Collection
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Explore stories that inspire, educate, and delight young readers
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search books by title or theme..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
            />
          </div>

          {/* Age Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {ageFilters.map(f => (
              <button
                key={f}
                onClick={() => setAgeFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  ageFilter === f
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 text-sm mb-6">Showing {filtered.length} book{filtered.length !== 1 ? 's' : ''}</p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">No books found. Try a different search!</p>
            </div>
          )}
        </div>
      </section>

      {/* Amazon CTA Banner */}
      <section className="py-12 px-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-y border-orange-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Find All Books on Amazon</h2>
          <p className="text-gray-500 mb-6">
            All of Eva's books are available on Amazon with fast shipping and easy returns.
          </p>
          <a
            href="https://www.amazon.com/author/evagallo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-lg"
          >
            🛒 View All Books on Amazon →
          </a>
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
