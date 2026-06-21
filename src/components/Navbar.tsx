import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Link } from './LocalizedLink';
import { useTranslation, splitLangFromPath } from '../lib/language';
import LanguageSwitcher from './LanguageSwitcher';

const TRANSLATIONS = {
  en: {
    home: 'Home',
    books: 'Books',
    activities: 'Activities',
    resources: 'Resources',
    about: 'About',
    contact: 'Contact',
    profile: 'Profile',
    search: 'Search',
    toggleMenu: 'Toggle menu',
  },
  es: {
    home: 'Inicio',
    books: 'Libros',
    activities: 'Actividades',
    resources: 'Recursos',
    about: 'Acerca',
    contact: 'Contacto',
    profile: 'Perfil',
    search: 'Buscar',
    toggleMenu: 'Abrir menú',
  },
  fr: {
    home: 'Accueil',
    books: 'Livres',
    activities: 'Activités',
    resources: 'Ressources',
    about: 'À propos',
    contact: 'Contact',
    profile: 'Profil',
    search: 'Recherche',
    toggleMenu: 'Ouvrir le menu',
  },
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const t = useTranslation(TRANSLATIONS);
  // Active state must ignore the /es | /fr language prefix, otherwise no nav
  // item ever highlights for Spanish/French visitors.
  const currentPath = splitLangFromPath(location.pathname).rest;

  const navLinks = [
    { to: '/', label: t.home },
    { to: '/books', label: t.books },
    { to: '/activities', label: t.activities },
    { to: '/resources', label: t.resources },
    { to: '/about', label: t.about },
    { to: '/contact', label: t.contact },
    { to: '/profile', label: t.profile },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-purple-700 hover:text-purple-900 transition-colors shrink-0 whitespace-nowrap">
            <span className="text-2xl">🐾</span>
            <span>Story Time with Eva</span>
          </Link>

          {/* Desktop Nav — full nav appears at lg; tablets/phones use the menu
              button so the logo + 7 links + 3 language pills never crowd. */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentPath === link.to
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/search"
              aria-label={t.search}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                currentPath === '/search'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Search className="w-5 h-5" />
            </Link>
            <div className="ml-2">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t.toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="lg:hidden py-3 border-t border-gray-100">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all ${
                  currentPath === link.to
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/search"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all ${
                currentPath === '/search'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <Search className="w-4 h-4" />
              {t.search}
            </Link>
            <div className="px-2 pt-3 mt-1 border-t border-gray-100">
              <LanguageSwitcher vertical />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
