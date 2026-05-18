import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Book, Palette, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Book as BookEntity } from "@/entities/Book";
import { Activity } from "@/entities/Activity";
import { createPageUrl } from "@/utils";

const translations = {
  en: {
    search: "Search books, activities, or topics...",
    searching: "Searching...",
    noResults: "No results found",
    tryDifferent: "Try different keywords",
    books: "Books",
    activities: "Activities",
    pressEnter: "Press Enter to search",
    recentSearches: "Recent Searches",
    clearRecent: "Clear"
  },
  es: {
    search: "Buscar libros, actividades o temas...",
    searching: "Buscando...",
    noResults: "No se encontraron resultados",
    tryDifferent: "Intenta con palabras diferentes",
    books: "Libros",
    activities: "Actividades",
    pressEnter: "Presiona Enter para buscar",
    recentSearches: "Búsquedas Recientes",
    clearRecent: "Borrar"
  },
  fr: {
    search: "Rechercher des livres, activités ou sujets...",
    searching: "Recherche...",
    noResults: "Aucun résultat trouvé",
    tryDifferent: "Essayez des mots-clés différents",
    books: "Livres",
    activities: "Activités",
    pressEnter: "Appuyez sur Entrée pour rechercher",
    recentSearches: "Recherches Récentes",
    clearRecent: "Effacer"
  }
};

export default function GlobalSearch({ isOpen, onClose, language = 'en' }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ books: [], activities: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent);
  }, []);

  useEffect(() => {
    // Keyboard shortcut: Cmd/Ctrl + K
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // Toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults({ books: [], activities: [] });
      return;
    }

    setIsSearching(true);
    
    try {
      const [books, activities] = await Promise.all([
        BookEntity.list(),
        Activity.list()
      ]);

      const lowerQuery = searchQuery.toLowerCase();
      
      const filteredBooks = books.filter(book =>
        book.title?.toLowerCase().includes(lowerQuery) ||
        book.description?.toLowerCase().includes(lowerQuery) ||
        book.theme?.toLowerCase().includes(lowerQuery)
      ).slice(0, 5);

      const filteredActivities = activities.filter(activity =>
        activity.title?.toLowerCase().includes(lowerQuery) ||
        activity.description?.toLowerCase().includes(lowerQuery) ||
        activity.activity_type?.toLowerCase().includes(lowerQuery)
      ).slice(0, 5);

      setResults({
        books: filteredBooks,
        activities: filteredActivities
      });

      // Save to recent searches
      if (searchQuery.length > 2) {
        const recent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(recent);
        localStorage.setItem('recentSearches', JSON.stringify(recent));
      }
    } catch (error) {
      console.error('Search error:', error);
      if (window.showToast) {
        window.showToast('Search failed. Please try again.', 'error');
      }
    } finally {
      setIsSearching(false);
    }
  }, [recentSearches]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, performSearch]);

  const handleSelect = (type, item) => {
    onClose();
    setQuery("");
    
    if (type === 'book') {
      navigate(createPageUrl("Books"));
    } else {
      navigate(`${createPageUrl("ActivityDemo")}?id=${item.id}`);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const totalResults = results.books.length + results.activities.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="pl-10 pr-10 py-6 text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setQuery("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            {isSearching && (
              <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-purple-500" />
            )}
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[50vh] px-6 pb-6">
          {!query && recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500">{t.recentSearches}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {t.clearRecent}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(search)}
                    className="rounded-full"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {query && totalResults === 0 && !isSearching && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.noResults}</h3>
              <p className="text-gray-500">{t.tryDifferent}</p>
            </div>
          )}

          {results.books.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <Book className="w-4 h-4" />
                {t.books} ({results.books.length})
              </h3>
              <div className="space-y-2">
                {results.books.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => handleSelect('book', book)}
                    className="w-full p-4 rounded-lg hover:bg-purple-50 transition-colors text-left flex items-start gap-4"
                  >
                    <div className="text-4xl flex-shrink-0">{book.cover_emoji || "📚"}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{book.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                      {book.age_range && (
                        <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          Ages {book.age_range}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.activities.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                {t.activities} ({results.activities.length})
              </h3>
              <div className="space-y-2">
                {results.activities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => handleSelect('activity', activity)}
                    className="w-full p-4 rounded-lg hover:bg-green-50 transition-colors text-left flex items-start gap-4"
                  >
                    <div className="text-4xl flex-shrink-0">{activity.icon_emoji || "🎨"}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                      {activity.age_range && (
                        <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Ages {activity.age_range}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-3 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span><kbd className="px-2 py-1 bg-white border rounded">↵</kbd> to select</span>
            <span><kbd className="px-2 py-1 bg-white border rounded">ESC</kbd> to close</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-white border rounded">⌘K</kbd> to open search
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}