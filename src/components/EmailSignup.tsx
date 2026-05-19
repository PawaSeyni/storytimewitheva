import { useState } from 'react';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    title: 'Download the FREE 20-Page Bilingual Starter Kit!',
    blurb: 'Join our growing community of parents making reading fun. Get coloring pages, reading guides, and bilingual activities delivered straight to your inbox.',
    bullets: [
      '✓ 20-page bilingual activity pack (English & Spanish)',
      '✓ Age-appropriate book recommendations',
      '✓ Fun story prompts & creative activities',
      '✓ No spam, unsubscribe anytime',
    ],
    emailPlaceholder: 'Enter your email address',
    submit: 'Get My Free Kit 🎨',
    successHeading: "You're in! Check your inbox.",
    successDetail: 'Your Bilingual Starter Kit is on its way!',
    privacy: '🔒 We respect your privacy. No spam, ever.',
  },
  es: {
    title: '¡Descarga GRATIS el kit bilingüe de 20 páginas!',
    blurb: 'Únete a nuestra comunidad de padres que hacen divertida la lectura. Recibe páginas para colorear, guías de lectura y actividades bilingües directamente en tu correo.',
    bullets: [
      '✓ Pack de 20 páginas de actividades bilingües (inglés y español)',
      '✓ Recomendaciones de libros por edad',
      '✓ Divertidas ideas de historias y actividades creativas',
      '✓ Sin spam, cancela cuando quieras',
    ],
    emailPlaceholder: 'Escribe tu correo electrónico',
    submit: 'Quiero mi kit gratis 🎨',
    successHeading: '¡Ya estás dentro! Revisa tu correo.',
    successDetail: '¡Tu kit bilingüe está en camino!',
    privacy: '🔒 Respetamos tu privacidad. Nunca spam.',
  },
  fr: {
    title: 'Téléchargez gratuitement le kit bilingue de 20 pages !',
    blurb: 'Rejoignez notre communauté de parents qui rendent la lecture amusante. Recevez des pages à colorier, des guides de lecture et des activités bilingues directement dans votre boîte mail.',
    bullets: [
      '✓ Pack d\'activités bilingues de 20 pages (anglais & espagnol)',
      '✓ Recommandations de livres par tranche d\'âge',
      '✓ Idées d\'histoires et activités créatives',
      '✓ Pas de spam, désinscription à tout moment',
    ],
    emailPlaceholder: 'Entrez votre adresse e-mail',
    submit: 'Recevoir mon kit gratuit 🎨',
    successHeading: 'C\'est fait ! Vérifiez votre boîte mail.',
    successDetail: 'Votre kit bilingue arrive !',
    privacy: '🔒 Nous respectons votre vie privée. Jamais de spam.',
  },
};

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslation(TRANSLATIONS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{t.title}</h2>
        <p className="text-purple-100 text-lg mb-6">{t.blurb}</p>

        <ul className="text-left inline-block text-purple-100 text-sm mb-8 space-y-2">
          {t.bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-2">{item}</li>
          ))}
        </ul>

        {submitted ? (
          <div className="bg-white/20 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-bold text-xl">{t.successHeading}</p>
            <p className="text-purple-100 text-sm mt-1">{t.successDetail}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              className="flex-1 px-5 py-3 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
            >
              {t.submit}
            </button>
          </form>
        )}

        <p className="text-purple-200 text-xs mt-4">{t.privacy}</p>
      </div>
    </section>
  );
}
