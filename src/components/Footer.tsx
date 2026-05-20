import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    tagline: 'Where stories come to life! Magical bilingual books and activities for curious young minds.',
    quickLinks: 'Quick Links',
    home: 'Home',
    books: 'Books',
    activities: 'Activities',
    resources: 'Parent Resources',
    about: 'About Eva',
    contact: 'Contact',
    connect: 'Connect with Eva',
    connectBlurb: 'Join our community for weekly tips, new stories, and exclusive activities!',
    rights: '© 2025 Story Time with Eva. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
  },
  es: {
    tagline: '¡Donde las historias cobran vida! Libros y actividades bilingües mágicos para mentes curiosas.',
    quickLinks: 'Enlaces rápidos',
    home: 'Inicio',
    books: 'Libros',
    activities: 'Actividades',
    resources: 'Recursos para padres',
    about: 'Sobre Eva',
    contact: 'Contacto',
    connect: 'Conecta con Eva',
    connectBlurb: '¡Únete a nuestra comunidad para consejos semanales, historias nuevas y actividades exclusivas!',
    rights: '© 2025 Story Time with Eva. Todos los derechos reservados.',
    privacy: 'Política de privacidad',
    terms: 'Términos de uso',
  },
  fr: {
    tagline: 'Où les histoires prennent vie ! Des livres et activités bilingues magiques pour les jeunes esprits curieux.',
    quickLinks: 'Liens rapides',
    home: 'Accueil',
    books: 'Livres',
    activities: 'Activités',
    resources: 'Ressources pour parents',
    about: 'À propos d\'Eva',
    contact: 'Contact',
    connect: 'Connectez-vous avec Eva',
    connectBlurb: 'Rejoignez notre communauté pour des conseils hebdomadaires, de nouvelles histoires et des activités exclusives !',
    rights: '© 2025 Story Time with Eva. Tous droits réservés.',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d\'utilisation',
  },
};

export default function Footer() {
  const t = useTranslation(TRANSLATIONS);

  const links = [
    { to: '/', label: t.home },
    { to: '/books', label: t.books },
    { to: '/activities', label: t.activities },
    { to: '/resources', label: t.resources },
    { to: '/about', label: t.about },
    { to: '/contact', label: t.contact },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐾</span>
              <span className="text-white font-bold text-lg">Story Time with Eva</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{t.tagline}</p>
            <div className="flex items-center gap-1 mt-3">
              {'⭐⭐⭐⭐⭐'.split('').map((s, i) => (
                <span key={i} className="text-yellow-400 text-sm">{s}</span>
              ))}
              <span className="text-gray-400 text-sm ml-1">4.9/5</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              {links.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-purple-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.connect}</h3>
            <p className="text-sm text-gray-400 mb-4">{t.connectBlurb}</p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-lg">
                📘
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-lg">
                📷
              </a>
              <a href="https://www.amazon.com/author/evagallo" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors text-lg">
                📚
              </a>
            </div>
            <div className="mt-4">
              <a
                href="mailto:galloeva2612@gmail.com"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                galloeva2612@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <p>{t.rights}</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">{t.privacy}</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">{t.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
