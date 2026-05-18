import { useState } from 'react';
import type { Book } from '../data/books';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="card group cursor-pointer" onClick={() => setShowModal(true)}>
        {/* Card Header */}
        <div className="relative bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 p-8 flex items-center justify-center min-h-[140px]">
          <span className="text-6xl">{book.emoji}</span>
          {book.featured && (
            <span className="absolute top-3 left-3 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full">
              {book.ageRange}
            </span>
            <span className="text-sm">{book.languages.join('')}</span>
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-purple-700 transition-colors">
            {book.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {book.description}
          </p>

          <div className="flex gap-2">
            <button
              onClick={e => { e.stopPropagation(); setShowModal(true); }}
              className="flex-1 py-2 text-sm font-semibold text-purple-600 border border-purple-200 rounded-full hover:bg-purple-50 transition-colors"
            >
              Discover More ✨
            </button>
            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="btn-amazon text-xs px-3 py-2"
            >
              🛒 Buy
            </a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{book.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h2>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-lg">{book.languages.join(' ')}</span>
                <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                  {book.ageRange}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
              <div className="mt-3 bg-purple-50 rounded-xl px-4 py-2 inline-block">
                <span className="text-sm text-purple-700 font-medium">Theme: {book.theme}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full text-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg"
              >
                🛒 Buy on Amazon
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 border-2 border-gray-200 text-gray-500 font-medium rounded-full hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
