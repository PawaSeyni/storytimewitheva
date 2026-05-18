import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, Palette, Home as HomeIcon, Info, Mail, Search, X, Lightbulb, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return { language: 'en', setLanguage: () => {} };
  }
  return context;
};

// GlobalSearch Component (moved inside Layout file)
const GlobalSearch = ({ isOpen, onClose, language, translations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mockResults = [
    { id: 1, title: "The Magical Forest Book", url: createPageUrl("Books") },
    { id: 2, title: "Painting with Watercolors Activity", url: createPageUrl("Activities") },
    { id: 3, title: "Welcome Home", url: createPageUrl("Home") },
    { id: 4, title: "Our Mission & Vision", url: createPageUrl("About") },
    { id: 5, title: "Contact Us Today", url: createPageUrl("Contact") },
    { id: 6, title: "Adventures of a Brave Knight Book", url: createPageUrl("Books") },
    { id: 7, title: "Storytelling Workshop Activity", url: createPageUrl("Activities") },
    { id: 8, title: "About Eva and Her Team", url: createPageUrl("About") },
    { id: 9, title: "How to Choose a Book", url: createPageUrl("Books") },
    { id: 10, title: "Creative Play Ideas Activity", url: createPageUrl("Activities") },
    { id: 11, title: "Parenting Resources Guide", url: createPageUrl("Resources") },
    { id: 12, title: "Understanding Child Development", url: createPageUrl("Resources") },
  ];

  const filteredResults = searchTerm.length > 0
    ? mockResults.filter(result =>
        result.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div
      className="fixed inset-0 z-[100] bg-gray-900 bg-opacity-75 flex items-start justify-center p-4 md:p-8 overflow-y-auto backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-title"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mt-16 md:mt-24 p-6 animate-in fade-in-5 slide-in-from-top-10 duration-300"
        tabIndex="-1"
      >
        <h2 id="global-search-title" className="sr-only">{t.searchTitle}</h2>

        <div className="flex items-center gap-2 mb-6">
          <Search className="w-6 h-6 text-gray-500" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t.searchPlaceholder}
            className="flex-grow p-3 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all min-h-[48px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label={t.searchPlaceholder}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="min-w-[48px] min-h-[48px] rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            aria-label={t.closeSearch}
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </Button>
        </div>

        {searchTerm.length > 0 && (
          <div className="max-h-96 overflow-y-auto pr-2 -mr-2">
            {filteredResults.length > 0 ? (
              <ul className="space-y-2">
                {filteredResults.map(result => (
                  <li key={result.id}>
                    <Link
                      to={result.url}
                      onClick={onClose}
                      className="block p-3 rounded-md hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-colors min-h-[48px] flex items-center"
                    >
                      <span className="font-medium text-gray-800">{result.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center py-8">{t.noResults}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const translations = {
  en: {
    skipToContent: "Skip to main content",
    home: "Home",
    books: "Books",
    activities: "Activities",
    resources: "Resources",
    about: "About",
    contact: "Contact",
    languageChanged: "Language changed to English",
    openSearch: "Open search",
    search: "Search",
    searchPlaceholder: "Search for books, activities, or topics...",
    noResults: "No results found. Try a different search term.",
    searchTitle: "Global Search",
    closeSearch: "Close search"
  },
  es: {
    skipToContent: "Saltar al contenido principal",
    home: "Inicio",
    books: "Libros",
    activities: "Actividades",
    resources: "Recursos",
    about: "Acerca de",
    contact: "Contacto",
    languageChanged: "Idioma cambiado a Español",
    openSearch: "Abrir búsqueda",
    search: "Buscar",
    searchPlaceholder: "Buscar libros, actividades o temas...",
    noResults: "No se encontraron resultados. Intente un término de búsqueda diferente.",
    searchTitle: "Búsqueda Global",
    closeSearch: "Cerrar búsqueda"
  },
  fr: {
    skipToContent: "Passer au contenu principal",
    home: "Accueil",
    books: "Livres",
    activities: "Activités",
    resources: "Ressources",
    about: "À Propos",
    contact: "Contact",
    languageChanged: "Langue changée en Français",
    openSearch: "Ouvrir la recherche",
    search: "Rechercher",
    searchPlaceholder: "Rechercher des livres, des activités ou des sujets...",
    noResults: "Aucun résultat trouvé. Essayez un autre terme de recherche.",
    searchTitle: "Recherche Globale",
    closeSearch: "Fermer la recherche"
  }
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [searchOpen, setSearchOpen] = useState(false);
  
  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    window.currentLanguage = lang;
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
    
    const messages = {
      en: translations.en.languageChanged,
      es: translations.es.languageChanged,
      fr: translations.fr.languageChanged
    };
    showToastMessage(messages[lang], 'success');
  };
  
  useEffect(() => {
    window.showToast = (message, type = 'success') => {
      showToastMessage(message, type);
    };

    window.currentLanguage = language;

    return () => {
      delete window.showToast;
      delete window.currentLanguage;
    };
  }, [language]);

  const t = translations[language];

  const navigationItems = [
    { title: t.home, url: createPageUrl("Home"), icon: HomeIcon, ariaLabel: "Go to homepage" },
    { title: t.books, url: createPageUrl("Books"), icon: BookOpen, ariaLabel: "Browse books" },
    { title: t.activities, url: createPageUrl("Activities"), icon: Palette, ariaLabel: "Explore activities" },
    { title: t.resources, url: createPageUrl("Resources"), icon: Lightbulb, ariaLabel: "Parent resources" },
    { title: t.about, url: createPageUrl("About"), icon: Info, ariaLabel: "Learn about us" },
    { title: t.contact, url: createPageUrl("Contact"), icon: Mail, ariaLabel: "Contact us" },
    { title: "My Profile", url: createPageUrl("Profile"), icon: User, ariaLabel: "View my profile" },
  ];

  const languageOptions = [
    { code: 'en', flag: '🇺🇸', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' }
  ];

  const toastStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const toastIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          {t.skipToContent}
        </a>

        {showToast && (
          <div 
            role="status"
            aria-live="polite"
            className={`fixed top-20 right-4 z-50 ${toastStyles[toastType]} text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-5 duration-300`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{toastIcons[toastType]}</span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <GlobalSearch
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          language={language}
          translations={translations}
        />

        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link 
                to={createPageUrl("Home")} 
                className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-lg"
                aria-label="Story Time with Eva - Home"
              >
                <span className="text-3xl" aria-hidden="true">🐾</span>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                  Story Time with Eva
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
                {navigationItems.map((item) => (
                  <Link
                    key={item.url}
                    to={item.url}
                    aria-label={item.ariaLabel}
                    aria-current={location.pathname === item.url ? 'page' : undefined}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 min-h-[44px] ${
                      location.pathname === item.url
                        ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg"
                        : "text-gray-700 hover:bg-orange-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    {item.title}
                  </Link>
                ))}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="min-w-[44px] min-h-[44px] text-gray-700 hover:bg-orange-100"
                  aria-label={t.openSearch}
                >
                  <Search className="w-5 h-5" aria-hidden="true" />
                </Button>
              </nav>

              <div className="flex items-center gap-2" role="group" aria-label="Language selector">
                {languageOptions.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={language === lang.code ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setLanguage(lang.code)}
                    aria-label={`Switch to ${lang.name}`}
                    aria-pressed={language === lang.code}
                    className={`min-w-[48px] min-h-[48px] rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                      language === lang.code 
                        ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white" 
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <span aria-hidden="true" className="text-xl">{lang.flag}</span>
                    <span className="sr-only">{lang.name}</span>
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden min-w-[48px] min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="text-2xl" aria-hidden="true">{mobileMenuOpen ? "✕" : "☰"}</span>
              </Button>
            </div>

            {mobileMenuOpen && (
              <nav id="mobile-menu" className="md:hidden pb-4 space-y-2" aria-label="Mobile navigation">
                {navigationItems.map((item) => (
                  <Link
                    key={item.url}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label={item.ariaLabel}
                    aria-current={location.pathname === item.url ? 'page' : undefined}
                    className={`block px-4 py-4 rounded-lg font-medium transition-all flex items-center gap-2 min-h-[56px] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset ${
                      location.pathname === item.url
                        ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white"
                        : "text-gray-700 hover:bg-orange-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    {item.title}
                  </Link>
                ))}
                <Link
                  key="mobile-search-button"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  aria-label={t.openSearch}
                  className="block px-4 py-4 rounded-lg font-medium transition-all flex items-center gap-2 min-h-[56px] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset text-gray-700 hover:bg-orange-50"
                >
                  <Search className="w-5 h-5" aria-hidden="true" />
                  {t.search}
                </Link>
              </nav>
            )}
          </div>
        </header>

        <main id="main-content" className="pt-20" role="main">
          {children}
        </main>

        <footer className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white mt-20 relative overflow-hidden" role="contentinfo">
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl" aria-hidden="true">🐾</span>
                  <h3 className="text-xl font-bold">Story Time with Eva</h3>
                </div>
                <p className="text-purple-200 text-base leading-relaxed">
                  Where stories come to life! Magical books and activities for curious young minds.
                </p>
                <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <p className="text-sm font-semibold text-yellow-300">⭐⭐⭐⭐⭐ 4.9/5</p>
                  <p className="text-xs text-purple-200">Trusted by 10,000+ families</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-yellow-300 text-lg">Quick Links</h4>
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.url}>
                      <Link 
                        to={item.url}
                        className="text-purple-200 hover:text-yellow-300 transition-colors flex items-center gap-2 py-1 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900 rounded"
                      >
                        <item.icon className="w-4 h-4" aria-hidden="true" />
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-yellow-300 text-lg">Resources</h4>
                <ul className="space-y-2 text-purple-200">
                  <li><a href="#" className="hover:text-yellow-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 rounded inline-block min-h-[44px] flex items-center">Parent Tips</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 rounded inline-block min-h-[44px] flex items-center">FAQ</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 rounded inline-block min-h-[44px] flex items-center">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 rounded inline-block min-h-[44px] flex items-center">Terms of Use</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-yellow-300 text-lg">Connect With Eva</h4>
                <div className="flex gap-4 mb-4" role="list" aria-label="Social media links">
                  <a href="#" aria-label="Facebook" className="text-3xl hover:scale-110 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900 rounded">📘</a>
                  <a href="#" aria-label="Instagram" className="text-3xl hover:scale-110 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900 rounded">📷</a>
                  <a href="#" aria-label="Twitter" className="text-3xl hover:scale-110 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900 rounded">🐦</a>
                </div>
                <p className="text-sm text-purple-200 mt-2">
                  Join our community for weekly tips, new stories, and exclusive activities!
                </p>
              </div>
            </div>

            <div className="border-t border-purple-700 pt-6 text-center text-purple-300">
              <p className="text-base">© 2025 Story Time with Eva. All rights reserved.</p>
              <p className="text-sm mt-2">Made with 💜 for curious young minds</p>
            </div>
          </div>
        </footer>

        <style dangerouslySetInnerHTML={{ __html: `
          *:focus-visible {
            outline: 3px solid #A855F7;
            outline-offset: 2px;
            border-radius: 4px;
          }
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
          button, a:not([href^="#main-content"]), input, select, textarea {
            min-height: 44px;
            min-width: 44px;
          }
        `}} />
      </div>
    </LanguageContext.Provider>
  );
}