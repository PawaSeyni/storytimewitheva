import { Link } from '../components/LocalizedLink';
import { useBooks } from '../data/books';
import { activities } from '../data/activities';
import BookCard from '../components/BookCard';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import Pixel from '../components/Pixel';
import { useTranslation } from '../lib/language';
import evaReadingWebp from '../assets/eva-reading.webp'; // optimized on-page hero (LCP)
import evaReading from '../assets/eva-reading.jpg'; // kept for the og:image (broad social compatibility)

const SITE_URL = 'https://storytimewitheva.com';

// Organization + WebSite structured data. Defined at module scope so the
// reference is stable across renders (JsonLd re-runs its effect on data change).
const ORG_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Story Time with Eva',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description:
      'The Eva Gallo Collection: multicultural picture books for children ages 3–9, with free activities in English, Spanish, and French.',
    founder: { '@type': 'Person', name: 'Eva Gallo' },
    sameAs: [
      'https://www.amazon.com/author/evagallo',
      'https://www.instagram.com/evagallo.books/',
      'https://www.facebook.com/storytimewitheva',
      'https://www.pinterest.com/storytimewitheva/',
      'https://www.threads.com/@evagallo.books',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Story Time with Eva',
    url: SITE_URL,
    inLanguage: ['en', 'es', 'fr'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
];

const TRANSLATIONS = {
  en: {
    seoTitle: 'Story Time with Eva: Multicultural Picture Books for Curious Minds',
    seoDesc: 'The Eva Gallo Collection: picture books for children ages 3–9 about quiet wonder, nighttime magic, and morning homecoming. Read with us and explore free activities.',
    heroLine1: 'Where Stories',
    heroLine2: 'Come to Life!',
    heroSubtitle: 'Discover magical bilingual books, fun activities, and reading adventures for curious minds of all ages with Eva',
    heroImageAlt: 'Eva reading a bedtime picture book with her grandchildren',
    ctaBooksPrefix: '✨ Browse',
    ctaBooksSuffix: 'Magical Books',
    ctaActivities: '🎨 Explore Free Activities',
    ctaActivityKit: 'Get Free Activity Kit 🎨',
    statBooks: 'Magical Books',
    statLanguages: 'Languages',
    statActivities: 'Fun Activities',
    featuredTitle: 'Featured Books',
    featuredSubtitle: 'Discover our carefully selected collection of magical stories',
    browseAll: 'Browse All Books →',
    hiwTitle: 'How It Works',
    hiwSubtitle: 'Three simple steps to magical reading',
    hiw: [
      { emoji: '🔍', title: 'Browse', desc: 'Explore our collection of bilingual books and activities' },
      { emoji: '✨', title: 'Choose', desc: "Pick the perfect story or activity for your child's age" },
      { emoji: '🎉', title: 'Enjoy!', desc: 'Start reading, playing, and learning together' },
    ],
    benefitsTitle: 'Why Story Time with Eva',
    benefitsSubtitle: 'Thoughtful stories and free tools families can count on',
    benefits: [
      { emoji: '🌍', title: 'Read in three languages', desc: 'Switch between English, Spanish, and French anytime, made for bilingual families and language learners.' },
      { emoji: '🔊', title: 'Hear every story', desc: 'Tap Listen on any book to hear it read aloud with natural pronunciation in each language.' },
      { emoji: '🎨', title: 'Free activities & printables', desc: 'Story dice, coloring, a reading journal, and a free bilingual starter kit, all free.' },
      { emoji: '💜', title: 'Gentle stories with heart', desc: 'Quiet, values-rich picture books about kindness, courage, and wonder for ages 3–9.' },
    ],
    activitiesTitle: 'Fun Activities with Eva',
    activitiesSubtitle: 'Learning comes alive through play!',
    liveBadge: 'Live',
    ages: 'Ages',
    tryIt: 'Try it →',
    seeAll: 'See All Activities →',
    activityPreview: [
      { emoji: '✍️', slug: 'story-builder', title: 'Story Dice Creator', desc: 'Roll the dice to mix characters, settings, and plot twists into a brand-new story.', ages: '6-9' },
      { emoji: '🎭', slug: 'character-workshop', title: 'Character Workshop', desc: 'Step-by-step character builder — type, name, look, personality, powers, and backstory.', ages: '6-9' },
      { emoji: '📓', slug: 'adventure-journal', title: 'Reading Journal', desc: "Record books you've read, favorite characters, and your thoughts. Saves to your device.", ages: '6-9' },
    ],
  },
  es: {
    seoTitle: 'Story Time with Eva — Libros ilustrados multiculturales para mentes curiosas',
    seoDesc: 'La Colección Eva Gallo — libros ilustrados para niños de 3 a 9 años sobre asombro tranquilo, magia nocturna y el regreso a casa. Lee con nosotros y descubre actividades gratuitas.',
    heroLine1: 'Donde las historias',
    heroLine2: '¡cobran vida!',
    heroSubtitle: 'Descubre libros bilingües mágicos, actividades divertidas y aventuras de lectura para mentes curiosas de todas las edades con Eva',
    heroImageAlt: 'Eva leyendo un cuento antes de dormir con sus nietos',
    ctaBooksPrefix: '✨ Explora',
    ctaBooksSuffix: 'libros mágicos',
    ctaActivities: '🎨 Descubre actividades gratis',
    ctaActivityKit: 'Recibe el kit de actividades gratis 🎨',
    statBooks: 'Libros mágicos',
    statLanguages: 'Idiomas',
    statActivities: 'Actividades divertidas',
    featuredTitle: 'Libros destacados',
    featuredSubtitle: 'Descubre nuestra colección cuidadosamente seleccionada de historias mágicas',
    browseAll: 'Ver todos los libros →',
    hiwTitle: 'Cómo funciona',
    hiwSubtitle: 'Tres pasos sencillos para una lectura mágica',
    hiw: [
      { emoji: '🔍', title: 'Explora', desc: 'Recorre nuestra colección de libros y actividades bilingües' },
      { emoji: '✨', title: 'Elige', desc: 'Selecciona la historia o actividad perfecta para la edad de tu peque' },
      { emoji: '🎉', title: '¡Disfruta!', desc: 'Empieza a leer, jugar y aprender juntos' },
    ],
    benefitsTitle: 'Por qué Story Time with Eva',
    benefitsSubtitle: 'Historias con cariño y recursos gratuitos en los que las familias pueden confiar',
    benefits: [
      { emoji: '🌍', title: 'Lee en tres idiomas', desc: 'Cambia entre inglés, español y francés cuando quieras — ideal para familias bilingües y para aprender idiomas.' },
      { emoji: '🔊', title: 'Escucha cada historia', desc: 'Pulsa Escuchar en cualquier libro para oírlo en voz alta con pronunciación natural en cada idioma.' },
      { emoji: '🎨', title: 'Actividades y descargables gratis', desc: 'Dados de historias, páginas para colorear, un diario de lectura y un kit de inicio bilingüe — todo gratis.' },
      { emoji: '💜', title: 'Historias tiernas con valores', desc: 'Libros ilustrados serenos sobre la bondad, la valentía y el asombro, para edades de 3 a 9 años.' },
    ],
    activitiesTitle: 'Actividades divertidas con Eva',
    activitiesSubtitle: '¡El aprendizaje cobra vida con el juego!',
    liveBadge: 'En vivo',
    ages: 'Edades',
    tryIt: 'Probar →',
    seeAll: 'Ver todas las actividades →',
    activityPreview: [
      { emoji: '✍️', slug: 'story-builder', title: 'Creador de dados de historia', desc: 'Lanza los dados para mezclar personajes, escenarios y giros en una nueva historia.', ages: '6-9' },
      { emoji: '🎭', slug: 'character-workshop', title: 'Taller de personajes', desc: 'Constructor paso a paso — tipo, nombre, apariencia, personalidad, poderes e historia.', ages: '6-9' },
      { emoji: '📓', slug: 'adventure-journal', title: 'Diario de lectura', desc: 'Registra los libros leídos, personajes favoritos y tus pensamientos. Se guarda en tu dispositivo.', ages: '6-9' },
    ],
  },
  fr: {
    seoTitle: 'Story Time with Eva — Albums illustrés multiculturels pour les esprits curieux',
    seoDesc: 'La Collection Eva Gallo — des albums pour enfants de 3 à 9 ans sur l\'émerveillement tranquille, la magie nocturne et le retour à la maison. Lisez avec nous et explorez des activités gratuites.',
    heroLine1: 'Là où les histoires',
    heroLine2: 'prennent vie !',
    heroSubtitle: 'Découvrez des livres bilingues magiques, des activités amusantes et des aventures de lecture pour les esprits curieux de tous âges avec Eva',
    heroImageAlt: 'Eva lisant un album du soir avec ses petits-enfants',
    ctaBooksPrefix: '✨ Parcourir',
    ctaBooksSuffix: 'livres magiques',
    ctaActivities: '🎨 Découvrir les activités gratuites',
    ctaActivityKit: 'Recevoir le kit d’activités gratuit 🎨',
    statBooks: 'Livres magiques',
    statLanguages: 'Langues',
    statActivities: 'Activités amusantes',
    featuredTitle: 'Livres en vedette',
    featuredSubtitle: 'Découvrez notre collection soigneusement choisie d\'histoires magiques',
    browseAll: 'Voir tous les livres →',
    hiwTitle: 'Comment ça marche',
    hiwSubtitle: 'Trois étapes simples pour une lecture magique',
    hiw: [
      { emoji: '🔍', title: 'Explorer', desc: 'Parcourez notre collection de livres et d\'activités bilingues' },
      { emoji: '✨', title: 'Choisir', desc: "Choisissez l'histoire ou l'activité idéale pour l'âge de votre enfant" },
      { emoji: '🎉', title: 'Profiter !', desc: 'Commencez à lire, jouer et apprendre ensemble' },
    ],
    benefitsTitle: 'Pourquoi Story Time with Eva',
    benefitsSubtitle: 'Des histoires attentionnées et des ressources gratuites sur lesquelles les familles peuvent compter',
    benefits: [
      { emoji: '🌍', title: 'Lisez en trois langues', desc: 'Passez de l\'anglais à l\'espagnol et au français à tout moment — parfait pour les familles bilingues et l\'apprentissage des langues.' },
      { emoji: '🔊', title: 'Écoutez chaque histoire', desc: 'Appuyez sur Écouter sur n\'importe quel livre pour l\'entendre lu à voix haute avec une prononciation naturelle dans chaque langue.' },
      { emoji: '🎨', title: 'Activités et imprimables gratuits', desc: 'Dés à histoires, coloriages, un journal de lecture et un kit de démarrage bilingue — tout gratuit.' },
      { emoji: '💜', title: 'Des histoires douces et porteuses de sens', desc: 'Des albums paisibles sur la gentillesse, le courage et l\'émerveillement, pour les 3 à 9 ans.' },
    ],
    activitiesTitle: 'Activités amusantes avec Eva',
    activitiesSubtitle: 'L\'apprentissage prend vie par le jeu !',
    liveBadge: 'En direct',
    ages: 'Âges',
    tryIt: 'Essayer →',
    seeAll: 'Voir toutes les activités →',
    activityPreview: [
      { emoji: '✍️', slug: 'story-builder', title: 'Créateur de dés à histoire', desc: 'Lancez les dés pour mélanger personnages, décors et rebondissements en une toute nouvelle histoire.', ages: '6-9' },
      { emoji: '🎭', slug: 'character-workshop', title: 'Atelier de personnages', desc: 'Constructeur pas à pas — type, nom, apparence, personnalité, pouvoirs et histoire.', ages: '6-9' },
      { emoji: '📓', slug: 'adventure-journal', title: 'Journal de lecture', desc: 'Enregistrez les livres lus, vos personnages préférés et vos pensées. Sauvegardé sur votre appareil.', ages: '6-9' },
    ],
  },
};

export default function Home() {
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const featuredBooks = books.filter(b => b.featured);

  // Counts derive from the catalog so the hero CTA, this stat, and the /books
  // page can never disagree (previously: "50+" CTA vs "6+" stat vs 18 books).
  const stats = [
    { number: `${books.length}`, label: t.statBooks, emoji: '📚' },
    { number: '3', label: t.statLanguages, emoji: '🌍' },
    { number: `${activities.length}`, label: t.statActivities, emoji: '🎨' },
  ];

  return (
    <main>
      <Seo title={t.seoTitle} bare description={t.seoDesc} path="/" image={`${SITE_URL}${evaReading}`} />
      <JsonLd id="org" data={ORG_SCHEMA} />

      {/* Hero Section */}
      <section className="hero-bg min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4 py-20">
        <div className="absolute top-10 left-10 text-4xl star-float opacity-70">⭐</div>
        <div className="absolute top-20 right-16 text-3xl star-float opacity-60" style={{ animationDelay: '1s' }}>🌙</div>
        <div className="absolute bottom-20 left-20 text-3xl star-float opacity-50" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute bottom-16 right-10 text-4xl star-float opacity-60" style={{ animationDelay: '0.5s' }}>🎨</div>
        <Pixel mood="hello" size={120} className="absolute top-24 right-6 lg:right-12 z-20 hidden sm:block star-float" title="Pixel the butterfly waves hello" />

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <div className="text-center lg:text-left text-white lg:flex-1">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              {t.heroLine1}<br />{t.heroLine2}
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-10 leading-relaxed drop-shadow-md">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/books" className="btn-primary text-lg px-8 py-4 shadow-2xl">
                {t.ctaBooksPrefix} {books.length} {t.ctaBooksSuffix}
              </Link>
              <Link to="/activities" className="btn-secondary text-lg px-8 py-4">
                {t.ctaActivities}
              </Link>
            </div>
            {/* High-contrast lead-magnet CTA — scrolls to email signup form below the fold. */}
            <div className="mt-5 flex justify-center lg:justify-start">
              <a
                href="#email-signup"
                className="inline-flex items-center justify-center text-lg px-8 py-4 bg-amber-300 hover:bg-amber-400 active:bg-amber-500 text-purple-900 font-extrabold rounded-full shadow-2xl ring-2 ring-amber-200/60 hover:ring-amber-100 transition-all duration-200 hover:scale-105"
              >
                {t.ctaActivityKit}
              </a>
            </div>
          </div>
          <div className="order-first mb-10 lg:order-none lg:mb-0 lg:mt-0 lg:flex-1">
            <img
              src={evaReadingWebp}
              alt={t.heroImageAlt}
              width={900}
              height={675}
              loading="eager"
              decoding="async"
              {...({ fetchpriority: 'high' } as Record<string, string>)}
              className="w-full max-w-md mx-auto rounded-3xl shadow-2xl ring-4 ring-white/30 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {stats.map((stat, i) => (
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.featuredTitle}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t.featuredSubtitle}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} priority />
            ))}
          </div>
          <div className="text-center">
            <Link to="/books" className="btn-primary text-lg px-8 py-4">
              {t.browseAll}
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.hiwTitle}</h2>
            <p className="text-gray-500 text-lg">{t.hiwSubtitle}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.hiw.map((item, i) => (
              <div key={i} className="relative text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {i + 1}
                </div>
                <div className="text-6xl mb-4 mt-4">{item.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Story Time with Eva — honest benefit cards (no fabricated quotes) */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.benefitsTitle}</h2>
            <p className="text-gray-500 text-lg">{t.benefitsSubtitle}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.benefits.map((b, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-purple-50 text-center">
                <div className="text-4xl mb-3" aria-hidden>{b.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Activities Preview */}
      <section className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.activitiesTitle}</h2>
            <p className="text-gray-500 text-lg">{t.activitiesSubtitle}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {t.activityPreview.map((act, i) => (
              <div key={i} className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <span className="absolute top-4 right-4 z-10 text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {t.liveBadge}
                </span>
                <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
                <div className="p-6">
                  <span className="text-4xl block mb-3">{act.emoji}</span>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{act.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{act.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">{t.ages}: {act.ages}</span>
                    <Link to={`/activities/${act.slug}`} className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                      {t.tryIt}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/activities" className="btn-primary text-lg px-8 py-4">
              {t.seeAll}
            </Link>
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <EmailSignup />
    </main>
  );
}
