import { useMemo } from 'react';
import ContinueReading from '../components/ContinueReading';
import PickedForYou from '../components/PickedForYou';
import { Link } from '../components/LocalizedLink';
import { useBooks } from '../data/books';
import BookCard from '../components/BookCard';
import EmailSignup, { hasLeadMagnetRequest } from '../components/EmailSignup';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import Pixel from '../components/Pixel';
import TestimonialSection from '../components/TestimonialSection';
import { useTranslation } from '../lib/language';
import { track } from '../lib/analytics';
import evaReadingWebp from '../assets/eva-reading.webp'; // optimized on-page hero (LCP)
import evaReading from '../assets/eva-reading.jpg'; // kept for the og:image (broad social compatibility)
import evaHeadshot from '../assets/eva-headshot.jpg'; // Meet Eva section (author portrait)

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

// The three site languages, shown in Section 2 to communicate the multilingual
// offering. Language names stay in their own language regardless of site locale.
const LANGUAGE_CARDS = [
  { flag: '🇺🇸', name: 'English' },
  { flag: '🇫🇷', name: 'Français' },
  { flag: '🇪🇸', name: 'Español' },
];

const TRANSLATIONS = {
  en: {
    seoTitle: 'Story Time with Eva: Multicultural Picture Books for Curious Minds',
    seoDesc: 'The Eva Gallo Collection: picture books for children ages 3–9 about quiet wonder, nighttime magic, and morning homecoming. Read with us and explore free activities.',
    // Hero
    heroHeadline: 'Magical Stories for Curious Young Minds',
    heroSupport: 'Discover multilingual picture books, read-aloud adventures, creative activities, and learning resources designed for children ages 3–9.',
    heroImageAlt: 'Eva reading a bedtime picture book with her grandchildren',
    ctaExploreBooks: 'Explore the Books',
    ctaExploreActivities: 'Explore Activities',
    heroAges: 'For ages 3–9 · English · Français · Español',
    ctaFreeBundle: 'Get the Free Bundle',
    // Section 2 — multilingual
    mlTitle: 'One Magical World. Three Languages.',
    mlSupport: 'Stories and activities designed to help children read, imagine, and explore across languages.',
    mlNote: 'Read & listen',
    // Section 3 — featured books
    featTitle: 'Find Your Next Favorite Story',
    featSupport: 'Handpicked picture books to read together, in the language your family loves.',
    viewAllBooks: 'View All Books →',
    // Section 4 — benefits
    benTitle: 'Why Families Choose Story Time with Eva',
    benefits: [
      { emoji: '📖', title: 'Beautiful Stories', desc: 'Thoughtful stories created to inspire imagination and curiosity.' },
      { emoji: '🌍', title: 'Three Languages', desc: 'Stories and experiences across English, French, and Spanish.' },
      { emoji: '🎨', title: 'Creative Activities', desc: 'Interactive and printable activities that extend the adventure.' },
      { emoji: '💜', title: 'Gentle Values', desc: 'Stories that encourage curiosity, kindness, courage, and growth.' },
      { emoji: '👨‍👩‍👧', title: 'Designed with Families in Mind', desc: 'A privacy-conscious experience created for families.' },
    ],
    // Section 5 — activities
    actTitle: "The Story Doesn't End on the Last Page",
    actSupport: 'Creative activities that turn every story into an adventure to keep playing.',
    exploreAllActivities: 'Explore All Activities →',
    liveBadge: 'Live',
    ages: 'Ages',
    tryIt: 'Try it →',
    activityPreview: [
      { emoji: '✍️', slug: 'story-builder', title: 'Story Dice Creator', desc: 'Roll the dice to mix characters, settings, and plot twists into a brand-new story.', ages: '6-9' },
      { emoji: '🎭', slug: 'character-workshop', title: 'Character Workshop', desc: 'Step-by-step character builder, type, name, look, personality, powers, and backstory.', ages: '6-9' },
      { emoji: '📓', slug: 'adventure-journal', title: 'Reading Journal', desc: "Record books you've read, favorite characters, and your thoughts. Saves to your device.", ages: '6-9' },
    ],
    // Section 6 — Meet Eva
    evaTitle: 'Meet Eva',
    evaIntro: 'Eva Gallo is a grandmother and retired public-health worker who writes gentle, multicultural picture books for children. Every story is made to be read together, out loud, in the language your family loves.',
    evaImageAlt: 'Portrait of author Eva Gallo',
    evaCta: 'Meet Eva',
  },
  es: {
    seoTitle: 'Story Time with Eva — Libros ilustrados multiculturales para mentes curiosas',
    seoDesc: 'La Colección Eva Gallo — libros ilustrados para niños de 3 a 9 años sobre asombro tranquilo, magia nocturna y el regreso a casa. Lee con nosotros y descubre actividades gratuitas.',
    heroHeadline: 'Historias mágicas para mentes jóvenes y curiosas',
    heroSupport: 'Descubre libros ilustrados multilingües, aventuras de lectura en voz alta, actividades creativas y recursos de aprendizaje para niños de 3 a 9 años.',
    heroImageAlt: 'Eva leyendo un cuento antes de dormir con sus nietos',
    ctaExploreBooks: 'Explora los libros',
    ctaExploreActivities: 'Explora las actividades',
    heroAges: 'Para edades de 3 a 9 · English · Français · Español',
    ctaFreeBundle: 'Recibe el paquete gratis',
    mlTitle: 'Un mundo mágico. Tres idiomas.',
    mlSupport: 'Historias y actividades diseñadas para ayudar a los niños a leer, imaginar y explorar entre idiomas.',
    mlNote: 'Leer y escuchar',
    featTitle: 'Encuentra tu próxima historia favorita',
    featSupport: 'Libros ilustrados escogidos para leer juntos, en el idioma que tu familia prefiera.',
    viewAllBooks: 'Ver todos los libros →',
    benTitle: 'Por qué las familias eligen Story Time with Eva',
    benefits: [
      { emoji: '📖', title: 'Historias hermosas', desc: 'Historias cuidadas, creadas para inspirar la imaginación y la curiosidad.' },
      { emoji: '🌍', title: 'Tres idiomas', desc: 'Historias y experiencias en inglés, francés y español.' },
      { emoji: '🎨', title: 'Actividades creativas', desc: 'Actividades interactivas e imprimibles que prolongan la aventura.' },
      { emoji: '💜', title: 'Valores con cariño', desc: 'Historias que fomentan la curiosidad, la bondad, la valentía y el crecimiento.' },
      { emoji: '👨‍👩‍👧', title: 'Pensado para las familias', desc: 'Una experiencia respetuosa con la privacidad, creada para las familias.' },
    ],
    actTitle: 'La historia no termina en la última página',
    actSupport: 'Actividades creativas que convierten cada cuento en una aventura para seguir jugando.',
    exploreAllActivities: 'Explora todas las actividades →',
    liveBadge: 'En vivo',
    ages: 'Edades',
    tryIt: 'Probar →',
    activityPreview: [
      { emoji: '✍️', slug: 'story-builder', title: 'Creador de dados de historia', desc: 'Lanza los dados para mezclar personajes, escenarios y giros en una nueva historia.', ages: '6-9' },
      { emoji: '🎭', slug: 'character-workshop', title: 'Taller de personajes', desc: 'Constructor paso a paso — tipo, nombre, apariencia, personalidad, poderes e historia.', ages: '6-9' },
      { emoji: '📓', slug: 'adventure-journal', title: 'Diario de lectura', desc: 'Registra los libros leídos, personajes favoritos y tus pensamientos. Se guarda en tu dispositivo.', ages: '6-9' },
    ],
    evaTitle: 'Conoce a Eva',
    evaIntro: 'Eva Gallo es abuela y trabajadora de salud pública jubilada, y escribe tiernos libros ilustrados multiculturales para niños. Cada historia está pensada para leerse juntos, en voz alta, en el idioma que tu familia prefiera.',
    evaImageAlt: 'Retrato de la autora Eva Gallo',
    evaCta: 'Conoce a Eva',
  },
  fr: {
    seoTitle: 'Story Time with Eva — Albums illustrés multiculturels pour les esprits curieux',
    seoDesc: 'La Collection Eva Gallo — des albums pour enfants de 3 à 9 ans sur l\'émerveillement tranquille, la magie nocturne et le retour à la maison. Lisez avec nous et explorez des activités gratuites.',
    heroHeadline: 'Des histoires magiques pour les jeunes esprits curieux',
    heroSupport: 'Découvrez des albums illustrés multilingues, des aventures à lire à voix haute, des activités créatives et des ressources d\'apprentissage pour les enfants de 3 à 9 ans.',
    heroImageAlt: 'Eva lisant un album du soir avec ses petits-enfants',
    ctaExploreBooks: 'Explorer les livres',
    ctaExploreActivities: 'Explorer les activités',
    heroAges: 'Pour les 3 à 9 ans · English · Français · Español',
    ctaFreeBundle: 'Recevoir le pack gratuit',
    mlTitle: 'Un monde magique. Trois langues.',
    mlSupport: 'Des histoires et des activités conçues pour aider les enfants à lire, imaginer et explorer d\'une langue à l\'autre.',
    mlNote: 'Lire et écouter',
    featTitle: 'Trouvez votre prochaine histoire préférée',
    featSupport: 'Des albums choisis avec soin, à lire ensemble, dans la langue que votre famille préfère.',
    viewAllBooks: 'Voir tous les livres →',
    benTitle: 'Pourquoi les familles choisissent Story Time with Eva',
    benefits: [
      { emoji: '📖', title: 'De belles histoires', desc: 'Des histoires réfléchies, créées pour éveiller l\'imagination et la curiosité.' },
      { emoji: '🌍', title: 'Trois langues', desc: 'Des histoires et des expériences en anglais, français et espagnol.' },
      { emoji: '🎨', title: 'Activités créatives', desc: 'Des activités interactives et imprimables qui prolongent l\'aventure.' },
      { emoji: '💜', title: 'Des valeurs douces', desc: 'Des histoires qui encouragent la curiosité, la gentillesse, le courage et l\'épanouissement.' },
      { emoji: '👨‍👩‍👧', title: 'Pensé pour les familles', desc: 'Une expérience respectueuse de la vie privée, créée pour les familles.' },
    ],
    actTitle: 'L\'histoire ne s\'arrête pas à la dernière page',
    actSupport: 'Des activités créatives qui transforment chaque histoire en une aventure à prolonger.',
    exploreAllActivities: 'Explorer toutes les activités →',
    liveBadge: 'En direct',
    ages: 'Âges',
    tryIt: 'Essayer →',
    activityPreview: [
      { emoji: '✍️', slug: 'story-builder', title: 'Créateur de dés à histoire', desc: 'Lancez les dés pour mélanger personnages, décors et rebondissements en une toute nouvelle histoire.', ages: '6-9' },
      { emoji: '🎭', slug: 'character-workshop', title: 'Atelier de personnages', desc: 'Constructeur pas à pas — type, nom, apparence, personnalité, pouvoirs et histoire.', ages: '6-9' },
      { emoji: '📓', slug: 'adventure-journal', title: 'Journal de lecture', desc: 'Enregistrez les livres lus, vos personnages préférés et vos pensées. Sauvegardé sur votre appareil.', ages: '6-9' },
    ],
    evaTitle: 'Rencontrez Eva',
    evaIntro: 'Eva Gallo est grand-mère et ancienne professionnelle de la santé publique. Elle écrit de tendres albums illustrés multiculturels pour les enfants. Chaque histoire est faite pour être lue ensemble, à voix haute, dans la langue que votre famille préfère.',
    evaImageAlt: 'Portrait de l\'autrice Eva Gallo',
    evaCta: 'Rencontrez Eva',
  },
};

export default function Home() {
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const featuredBooks = books.filter(b => b.featured);

  // Visitors arriving on a `?lm=` deep link clicked an ad or pin for ONE specific
  // freebie. For that traffic the offer goes first and the rest of the homepage
  // becomes supporting content below it. Organic visitors see the full IA.
  const offerFirst = useMemo(() => hasLeadMagnetRequest(), []);

  return (
    <main>
      <Seo title={t.seoTitle} bare description={t.seoDesc} path="/" image={`${SITE_URL}${evaReading}`} imageWidth={1200} imageHeight={900} />
      <JsonLd id="org" data={ORG_SCHEMA} />

      {/* Deep-link traffic: the offer they clicked for, before anything else. */}
      {offerFirst && <EmailSignup />}

      {/* SECTION 1 — Hero. One dominant CTA (Explore the Books); Explore Activities
          is the subordinate secondary; the free bundle lives in its own section
          below so it does not compete here. */}
      <section className="hero-bg min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4 py-20">
        <div className="absolute top-10 left-10 text-4xl star-float opacity-70">⭐</div>
        <div className="absolute top-20 right-16 text-3xl star-float opacity-60" style={{ animationDelay: '1s' }}>🌙</div>
        <div className="absolute bottom-20 left-20 text-3xl star-float opacity-50" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute bottom-16 right-10 text-4xl star-float opacity-60" style={{ animationDelay: '0.5s' }}>🎨</div>
        <Pixel mood="hello" size={120} className="absolute top-24 right-6 lg:right-12 z-20 hidden sm:block star-float" />

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <div className="text-center lg:text-left text-white lg:flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              {t.heroHeadline}
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed drop-shadow-md">
              {t.heroSupport}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/books"
                onClick={() => track('Homepage CTA', { destination: 'books' })}
                className="btn-primary text-lg px-8 py-4 shadow-2xl"
              >
                📚 {t.ctaExploreBooks}
              </Link>
              <Link
                to="/activities"
                onClick={() => track('Homepage CTA', { destination: 'activities' })}
                className="btn-secondary text-lg px-8 py-4"
              >
                🎨 {t.ctaExploreActivities}
              </Link>
            </div>
            {/* Level-3 supporting CTA — subordinate to the two buttons above. */}
            <div className="mt-4 flex justify-center lg:justify-start">
              <a
                href="#email-signup"
                onClick={() => track('Homepage CTA', { destination: 'free-bundle' })}
                className="text-sm font-semibold text-amber-200 hover:text-amber-100 underline underline-offset-4 decoration-amber-300/50"
              >
                🎁 {t.ctaFreeBundle} →
              </a>
            </div>
            <p className="mt-6 text-sm font-medium text-purple-100/90">{t.heroAges}</p>
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

      {/* Returning-visitor section (S6-003/S6-004/S6-006). Renders NOTHING for a new
          visitor, so the page below is complete on its own rather than showing an empty
          personalized shell. Placed after the hero so the value proposition still leads. */}
      <ContinueReading />
      <PickedForYou />

      {/* SECTION 2 — One Magical World. Three Languages. (multilingual differentiation) */}
      <section className="py-16 px-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{t.mlTitle}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">{t.mlSupport}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {LANGUAGE_CARDS.map((l) => (
              <div key={l.name} className="bg-purple-50 rounded-2xl px-6 py-4 min-w-[140px] border border-purple-100">
                <div className="text-3xl mb-1" aria-hidden>{l.flag}</div>
                <div className="font-bold text-gray-800">{l.name}</div>
                <div className="text-xs text-purple-600 mt-1">{t.mlNote}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Find Your Next Favorite Story (featured books) */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.featTitle}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t.featSupport}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                priority
                onSelect={() => track('Homepage CTA', { destination: 'featured-book', book: book.id })}
              />
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/books"
              onClick={() => track('Homepage CTA', { destination: 'view-all-books' })}
              className="btn-primary text-lg px-8 py-4"
            >
              {t.viewAllBooks}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Why Families Choose Story Time with Eva (benefits) */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.benTitle}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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

      {/* SECTION 5 — The Story Doesn't End on the Last Page (activities) */}
      <section className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.actTitle}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t.actSupport}</p>
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
            <Link
              to="/activities"
              onClick={() => track('Homepage CTA', { destination: 'activities-all' })}
              className="btn-primary text-lg px-8 py-4"
            >
              {t.exploreAllActivities}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Meet Eva (author trust) */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <img
            src={evaHeadshot}
            alt={t.evaImageAlt}
            width={320}
            height={320}
            loading="lazy"
            decoding="async"
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-xl ring-4 ring-purple-100 flex-shrink-0"
          />
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t.evaTitle}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">{t.evaIntro}</p>
            <Link
              to="/about"
              onClick={() => track('Homepage CTA', { destination: 'meet-eva' })}
              className="btn-primary text-lg px-8 py-4"
            >
              {t.evaCta} →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7 — Make Reading Time More Magical, Free (lead magnet / email).
          Omitted here when it already ran above (offerFirst) so the page never
          carries two #email-signup anchors.
          SECTION 8 (Loved by Families / testimonials) is intentionally not
          rendered yet: no approved testimonials exist and we never fabricate
          them. It ships as its own component in a later task (S1-010). */}
      {!offerFirst && <EmailSignup />}

      {/* SECTION 8 — Loved by Families. Renders only when approved testimonials
          exist (src/data/testimonials.ts); never a fabricated placeholder. */}
      <TestimonialSection />
    </main>
  );
}
