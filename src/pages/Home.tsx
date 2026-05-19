import { Link } from 'react-router-dom';
import { books } from '../data/books';
import BookCard from '../components/BookCard';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    seoTitle: 'Story Time with Eva — Multicultural Picture Books for Curious Minds',
    seoDesc: 'The Eva Gallo Collection — picture books for children ages 3–9 about quiet wonder, nighttime magic, and morning homecoming. Read with us and explore free activities.',
    heroLine1: 'Where Stories',
    heroLine2: 'Come to Life!',
    heroSubtitle: 'Discover magical bilingual books, fun activities, and reading adventures for curious minds of all ages with Eva',
    ctaBooks: '✨ Browse 50+ Magical Books',
    ctaActivities: '🎨 Explore Free Activities',
    statBooks: 'Magical Books',
    statLanguages: 'Languages',
    statRating: 'Amazon Rating',
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
    testimonialsTitle: 'What Parents Say',
    testimonialsSubtitle: 'Real families, real magic',
    testimonials: [
      { text: "My daughter asks for Eva's books every single night. The bilingual format has been incredible for her Spanish learning!", author: 'Maria T.', role: 'Mom of a 5-year-old' },
      { text: 'The Kindness Garden sparked a whole week of conversations about helping others. These books are more than stories.', author: 'James R.', role: 'Dad of two' },
      { text: "As a teacher, I recommend Eva's books to all my students' parents. The cultural diversity woven into each story is beautiful.", author: 'Ms. Sandra L.', role: '1st Grade Teacher' },
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
    ctaBooks: '✨ Explora más de 50 libros mágicos',
    ctaActivities: '🎨 Descubre actividades gratis',
    statBooks: 'Libros mágicos',
    statLanguages: 'Idiomas',
    statRating: 'Valoración Amazon',
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
    testimonialsTitle: 'Lo que dicen los padres',
    testimonialsSubtitle: 'Familias reales, magia real',
    testimonials: [
      { text: 'Mi hija pide los libros de Eva todas las noches. ¡El formato bilingüe ha sido increíble para su aprendizaje del español!', author: 'María T.', role: 'Mamá de un niño de 5 años' },
      { text: 'El Jardín de la Bondad inspiró una semana entera de conversaciones sobre ayudar a los demás. Estos libros son más que historias.', author: 'James R.', role: 'Papá de dos' },
      { text: 'Como maestra, recomiendo los libros de Eva a todos los padres de mis estudiantes. La diversidad cultural en cada historia es hermosa.', author: 'Sra. Sandra L.', role: 'Maestra de 1.º grado' },
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
    ctaBooks: '✨ Parcourir plus de 50 livres magiques',
    ctaActivities: '🎨 Découvrir les activités gratuites',
    statBooks: 'Livres magiques',
    statLanguages: 'Langues',
    statRating: 'Note Amazon',
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
    testimonialsTitle: 'Ce que disent les parents',
    testimonialsSubtitle: 'Vraies familles, vraie magie',
    testimonials: [
      { text: 'Ma fille demande les livres d\'Eva chaque soir. Le format bilingue a été incroyable pour son apprentissage de l\'espagnol !', author: 'Maria T.', role: 'Maman d\'un enfant de 5 ans' },
      { text: 'Le Jardin de la Bonté a déclenché toute une semaine de conversations sur l\'aide aux autres. Ces livres sont bien plus que des histoires.', author: 'James R.', role: 'Papa de deux enfants' },
      { text: 'En tant qu\'enseignante, je recommande les livres d\'Eva à tous les parents de mes élèves. La diversité culturelle tissée dans chaque histoire est magnifique.', author: 'Mme Sandra L.', role: 'Maîtresse de CP' },
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

const featuredBooks = books.filter(b => b.featured);

export default function Home() {
  const t = useTranslation(TRANSLATIONS);

  const stats = [
    { number: '6+', label: t.statBooks, emoji: '📚' },
    { number: '3', label: t.statLanguages, emoji: '🌍' },
    { number: '4.9/5', label: t.statRating, emoji: '⭐' },
  ];

  return (
    <main>
      <Seo title={t.seoTitle} bare description={t.seoDesc} path="/" />

      {/* Hero Section */}
      <section className="hero-bg min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4 py-20">
        <div className="absolute top-10 left-10 text-4xl star-float opacity-70">⭐</div>
        <div className="absolute top-20 right-16 text-3xl star-float opacity-60" style={{ animationDelay: '1s' }}>🌙</div>
        <div className="absolute bottom-20 left-20 text-3xl star-float opacity-50" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute bottom-16 right-10 text-4xl star-float opacity-60" style={{ animationDelay: '0.5s' }}>🎨</div>

        <div className="text-center text-white max-w-3xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            {t.heroLine1}<br />{t.heroLine2}
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-10 leading-relaxed drop-shadow-md">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/books" className="btn-primary text-lg px-8 py-4 shadow-2xl">
              {t.ctaBooks}
            </Link>
            <Link to="/activities" className="btn-secondary text-lg px-8 py-4">
              {t.ctaActivities}
            </Link>
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
              <BookCard key={book.id} book={book} />
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

      {/* Parent Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.testimonialsTitle}</h2>
            <p className="text-gray-500 text-lg">{t.testimonialsSubtitle}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.testimonials.map((quote, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-purple-50">
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(null).map((_, j) => (
                    <span key={j} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed mb-4">"{quote.text}"</p>
                <div>
                  <p className="font-bold text-gray-800">{quote.author}</p>
                  <p className="text-sm text-purple-600">{quote.role}</p>
                </div>
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
