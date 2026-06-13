import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';

// Real 404 page. Previously unknown routes silently redirected to "/", which
// produces soft-404s (search engines see a 200 + homepage instead of a clear
// "not found"). This page is noindexed and points visitors back to real content.

const TRANSLATIONS = {
  en: {
    seoTitle: 'Page Not Found',
    seoDesc: 'Sorry, we could not find that page.',
    heading: "Oops! This page wandered off",
    blurb: "We couldn't find the page you were looking for. Let's get you back to a story.",
    home: 'Back to Home',
    books: 'Browse Books',
  },
  es: {
    seoTitle: 'Página no encontrada',
    seoDesc: 'Lo sentimos, no encontramos esa página.',
    heading: '¡Vaya! Esta página se perdió',
    blurb: 'No encontramos la página que buscabas. Volvamos a una historia.',
    home: 'Volver al inicio',
    books: 'Ver libros',
  },
  fr: {
    seoTitle: 'Page introuvable',
    seoDesc: "Désolé, nous n'avons pas trouvé cette page.",
    heading: 'Oups ! Cette page s\'est égarée',
    blurb: "Nous n'avons pas trouvé la page que vous cherchiez. Retournons à une histoire.",
    home: "Retour à l'accueil",
    books: 'Voir les livres',
  },
};

export default function NotFound() {
  const t = useTranslation(TRANSLATIONS);

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} noindex />
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-lg mx-auto">
          <div className="text-7xl mb-4">🧭</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{t.heading}</h1>
          <p className="text-gray-500 text-lg mb-8">{t.blurb}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary text-lg px-8 py-4">{t.home}</Link>
            <Link
              to="/books"
              className="inline-flex items-center justify-center gap-2 text-lg px-8 py-4 border-2 border-purple-300 text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all duration-200"
            >
              {t.books}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
