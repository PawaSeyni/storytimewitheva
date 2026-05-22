import { Link } from 'react-router-dom';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    seoTitle: 'About Eva Gallo',
    seoDesc: 'Eva Gallo writes multicultural picture books for children ages 3–9. Before she was an author, she spent thirty years in public health. Her stories begin in night and end in morning.',
    heading: 'About Story Time with Eva',
    subheading: 'Making reading magical for every child',
    refrain: 'Every story begins in the dark and ends in the morning.',
    refrainAttr: 'the signature rhythm of every book in the Eva Gallo Collection',
    photoNote: '📸 Replace with your photo',
    bioHeading: 'A Note from the Author',
    bio: [
      "This children's book series is a lively collection of imaginative stories from my childhood, created for kids ages 3 to 9.",
      'After a lifelong career in public health, I am now a full-time grandmother, caring for two young granddaughters with an endless appetite for bedtime stories.',
      'My inspiration comes from childhood memories with my mother and aunt. This book — and the series it belongs to — is my way of passing down traditions and lessons from a time before digital media.',
    ],
    motivation: 'My motivation is simple: to share that magic with a new generation.',
    viewBooks: '🛒 View Books on Amazon',
    contactEva: '✉️ Contact Eva',
    missionHeading: 'Our Mission & Values',
    cards: [
      { title: 'Our Story', text: "Founded by educators and parents who understand the power of storytelling, we created Eva to make quality children's literature accessible to families everywhere." },
      { title: 'Why Books Matter', text: "Reading with Eva isn't just about words on a page — it's about opening doorways to new worlds, building vocabulary, and creating precious memories that last forever." },
      { title: 'Our Mission', text: 'We believe every child deserves access to stories that spark imagination, build empathy, and celebrate the joy of reading with Eva as their guide.' },
      { title: 'Our Values', text: 'Quality storytelling, inclusive representation, educational excellence, and making reading accessible and fun for all families around the world.' },
    ],
  },
  es: {
    seoTitle: 'Acerca de Eva Gallo',
    seoDesc: 'Eva Gallo escribe libros ilustrados multiculturales para niños de 3 a 9 años. Antes de ser autora, trabajó treinta años en salud pública. Sus historias comienzan de noche y terminan al amanecer.',
    heading: 'Acerca de Story Time with Eva',
    subheading: 'Haciendo la lectura mágica para cada peque',
    refrain: 'Cada historia comienza en la oscuridad y termina con la mañana.',
    refrainAttr: 'el ritmo distintivo de cada libro de la Colección Eva Gallo',
    photoNote: '📸 Reemplazar con tu foto',
    bioHeading: 'Una nota de la autora',
    bio: [
      'Esta serie de libros infantiles es una colección viva de historias imaginativas de mi infancia, creadas para niños de 3 a 9 años.',
      'Tras una carrera completa en salud pública, ahora soy abuela a tiempo completo y cuido a dos nietas con un apetito infinito por los cuentos antes de dormir.',
      'Mi inspiración viene de los recuerdos de la infancia con mi madre y mi tía. Este libro — y la serie a la que pertenece — es mi forma de transmitir tradiciones y lecciones de una época anterior a las pantallas.',
    ],
    motivation: 'Mi motivación es simple: compartir esa magia con una nueva generación.',
    viewBooks: '🛒 Ver libros en Amazon',
    contactEva: '✉️ Contactar a Eva',
    missionHeading: 'Nuestra misión y valores',
    cards: [
      { title: 'Nuestra historia', text: 'Fundada por educadores y padres que entienden el poder de contar historias, creamos a Eva para hacer accesible la buena literatura infantil a familias de todo el mundo.' },
      { title: 'Por qué importan los libros', text: 'Leer con Eva no es solo palabras en una página: es abrir puertas a mundos nuevos, ampliar el vocabulario y crear recuerdos preciosos que duran para siempre.' },
      { title: 'Nuestra misión', text: 'Creemos que cada niño merece acceso a historias que enciendan la imaginación, fomenten la empatía y celebren el gozo de leer con Eva como guía.' },
      { title: 'Nuestros valores', text: 'Buenas historias, representación inclusiva, excelencia educativa y hacer que la lectura sea accesible y divertida para familias de todo el mundo.' },
    ],
  },
  fr: {
    seoTitle: 'À propos d\'Eva Gallo',
    seoDesc: 'Eva Gallo écrit des albums illustrés multiculturels pour les enfants de 3 à 9 ans. Avant de devenir autrice, elle a travaillé trente ans en santé publique. Ses histoires commencent la nuit et s\'achèvent au matin.',
    heading: 'À propos de Story Time with Eva',
    subheading: 'Rendre la lecture magique pour chaque enfant',
    refrain: "Chaque histoire commence dans le noir et finit au matin.",
    refrainAttr: 'le rythme signature de chaque livre de la Collection Eva Gallo',
    photoNote: '📸 Remplacer par votre photo',
    bioHeading: "Mot de l'autrice",
    bio: [
      "Cette série de livres pour enfants est une collection vivante d'histoires imaginatives de mon enfance, créée pour les 3 à 9 ans.",
      'Après une longue carrière en santé publique, je suis aujourd\'hui grand-mère à plein temps, et je m\'occupe de deux petites-filles à l\'appétit insatiable pour les histoires du soir.',
      'Mon inspiration vient des souvenirs d\'enfance avec ma mère et ma tante. Ce livre — et la série dont il fait partie — est ma façon de transmettre des traditions et des leçons d\'une époque d\'avant les écrans.',
    ],
    motivation: 'Ma motivation est simple : partager cette magie avec une nouvelle génération.',
    viewBooks: '🛒 Voir les livres sur Amazon',
    contactEva: '✉️ Contacter Eva',
    missionHeading: 'Notre mission et nos valeurs',
    cards: [
      { title: 'Notre histoire', text: "Fondée par des éducateurs et des parents qui comprennent le pouvoir des histoires, nous avons créé Eva pour rendre la bonne littérature jeunesse accessible aux familles partout." },
      { title: 'Pourquoi les livres comptent', text: 'Lire avec Eva, ce n\'est pas seulement des mots sur une page : c\'est ouvrir des portes vers de nouveaux mondes, enrichir le vocabulaire et créer des souvenirs précieux qui durent toute une vie.' },
      { title: 'Notre mission', text: "Nous croyons que chaque enfant mérite des histoires qui éveillent l'imagination, nourrissent l'empathie et célèbrent la joie de lire, avec Eva comme guide." },
      { title: 'Nos valeurs', text: 'Des histoires de qualité, une représentation inclusive, l\'excellence éducative et une lecture accessible et joyeuse pour toutes les familles du monde.' },
    ],
  },
};

const CARD_STYLES = [
  { emoji: '📖', color: 'from-purple-400 to-purple-600' },
  { emoji: '💜', color: 'from-pink-400 to-pink-600' },
  { emoji: '🎯', color: 'from-blue-400 to-blue-600' },
  { emoji: '🌍', color: 'from-green-400 to-green-600' },
];

export default function About() {
  const t = useTranslation(TRANSLATIONS);

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/about" />

      <section className="bg-gradient-to-b from-amber-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
        </div>
      </section>

      {/* Eva Gallo Collection imprint refrain — the locked signature line */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <blockquote className="border-l-4 border-orange-400 pl-6 py-2">
            <p className="text-2xl md:text-3xl font-serif italic text-slate-700 leading-snug">
              {t.refrain}
            </p>
            <footer className="mt-3 text-sm text-gray-500 not-italic">
              — {t.refrainAttr}
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-shrink-0">
              <div className="w-52 h-52 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex flex-col items-center justify-center shadow-xl border-4 border-white ring-4 ring-purple-100">
                <span className="text-6xl">👩‍🦳</span>
                <span className="text-xs text-purple-500 mt-2 font-medium">Eva Gallo</span>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3 italic">{t.photoNote}</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{t.bioHeading}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {t.bio.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <p className="font-medium text-purple-700">{t.motivation}</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div>
                  <p className="font-bold text-gray-800 text-lg">Eva Gallo</p>
                  <p className="text-purple-600 text-sm">@StorytimeWithEvaGallo</p>
                </div>
                <span className="text-2xl">📚💜✨</span>
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://www.amazon.com/author/evagallo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                >
                  {t.viewBooks}
                </a>
                <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-purple-400 text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-all duration-200 text-sm">
                  {t.contactEva}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">{t.missionHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.cards.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-50">
                <div className={`w-12 h-12 bg-gradient-to-br ${CARD_STYLES[i].color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {CARD_STYLES[i].emoji}
                </div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
