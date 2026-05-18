import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import BookCard from "../components/BookCard";
import Breadcrumb from "../components/Breadcrumb";
import { useFavorites, FavoriteButton } from "../components/FavoritesManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const translations = {
  en: {
    title: "Our Magical Book Collection",
    subtitle: "Explore stories that inspire, educate, and delight young readers",
    search: "Search books by title or theme...",
    clearSearch: "Clear search",
    noBooks: "No books found. Try adjusting your search!",
    results: "Showing {count} {count, plural, one {book} other {books}}"
  },
  es: {
    title: "Nuestra Colección Mágica de Libros",
    subtitle: "Explora historias que inspiran, educan y deleitan",
    search: "Buscar libros por título o tema...",
    clearSearch: "Limpiar búsqueda",
    noBooks: "No se encontraron libros. ¡Intenta ajustar tu búsqueda!",
    results: "Mostrando {count} {count, plural, one {libro} other {libros}}"
  },
  fr: {
    title: "Notre Collection Magique de Livres",
    subtitle: "Explorez des histoires qui inspirent, éduquent et ravissent",
    search: "Rechercher des livres par titre ou thème...",
    clearSearch: "Effacer la recherche",
    noBooks: "Aucun livre trouvé. Essayez d'ajuster votre recherche!",
    results: "Affichage de {count} {count, plural, one {livre} other {livres}}"
  }
};

export default function Books() {
  const [language, setLanguage] = useState('en');
  const { isFavorite, toggleFavorite } = useFavorites('book');

  useEffect(() => {
    const checkLanguage = () => {
      if (typeof window !== 'undefined' && window.currentLanguage) {
        setLanguage(window.currentLanguage);
      }
    };
    
    checkLanguage();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('languagechange', checkLanguage);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('languagechange', checkLanguage);
      }
    };
  }, []);
  
  const t = translations[language] || translations.en;
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.Book.list("-created_date");
      setBooks(data || []);
    } catch (error) {
      console.error("Error loading books:", error);
      setBooks([]);
    }
    setIsLoading(false);
  };

  const filteredBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.theme?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Books", href: "#" }]} />

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {t.title}
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <label htmlFor="book-search" className="sr-only">
              {t.search}
            </label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
            <Input
              id="book-search"
              type="search"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-4 text-base rounded-full border-2 border-gray-200 focus:border-purple-400 min-h-[48px]"
              aria-label={t.search}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 min-w-[40px] min-h-[40px]"
                aria-label={t.clearSearch}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>

        {!isLoading && (
          <div className="text-center mb-4 text-gray-600" role="status" aria-live="polite">
            <p className="text-sm">
              {t.results.replace('{count}', filteredBooks.length).replace('{count, plural, one {book} other {books}}', filteredBooks.length === 1 ? 'book' : 'books')}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" role="list">
            {filteredBooks.map((book) => (
              <div key={book.id} role="listitem" className="relative">
                <div className="absolute top-4 right-4 z-10">
                  <FavoriteButton
                    itemId={book.id}
                    isFavorite={isFavorite(book.id)}
                    onToggle={toggleFavorite}
                    size="md"
                    className="bg-white/90 backdrop-blur-sm shadow-lg"
                  />
                </div>
                <BookCard 
                  book={book} 
                  onClick={() => setSelectedBook(book)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20" role="status">
            <div className="text-7xl mb-4" aria-hidden="true">📚</div>
            <p className="text-xl text-gray-500">{t.noBooks}</p>
          </div>
        )}

        <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="text-6xl mb-4 text-center" aria-hidden="true">
                {selectedBook?.cover_emoji || "📚"}
              </div>
              <DialogTitle className="text-3xl font-bold text-center">
                {selectedBook?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {selectedBook?.languages?.map((lang) => (
                  <span key={lang} className="text-2xl" aria-label={lang}>
                    {lang === 'english' ? '🇺🇸' : lang === 'spanish' ? '🇪🇸' : '🇫🇷'}
                  </span>
                ))}
              </div>
              <p className="text-center text-sm text-purple-600 font-semibold">
                {selectedBook?.age_range}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                {selectedBook?.description}
              </p>
              {selectedBook?.theme && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900">
                    Theme: {selectedBook.theme}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}