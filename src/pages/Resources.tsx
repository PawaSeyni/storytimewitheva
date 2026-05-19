import { useState } from 'react';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    seoTitle: 'Parent Resources',
    seoDesc: 'Reading tips, child-development milestones, and activity ideas for parents and teachers. Helping you make every reading session magical.',
    heading: 'Parent Resources & Guides',
    subheading: 'Expert tips, activities, and strategies to make reading time magical',
    searchPlaceholder: 'Search resources...',
    popular: 'Popular',
    readMore: 'Read More →',
    emptyMsg: 'No resources found. Try a different search!',
    minRead: 'min read',
    categories: {
      all: 'All Resources',
      readingTips: 'Reading Tips',
      activityIdeas: 'Activity Ideas',
      childDev: 'Child Development',
      engagement: 'Building Engagement',
    },
    resources: [
      { title: '10 Ways to Make Reading Time Magical', desc: 'Transform ordinary reading sessions into memorable adventures your child will love.', minutes: 5 },
      { title: 'Age-Appropriate Reading Milestones', desc: "What to expect at each stage and how to support your child's literacy journey.", minutes: 8 },
      { title: '5 Creative Follow-Up Activities After Reading', desc: 'Extend the learning and fun beyond the last page with these engaging activities.', minutes: 6 },
      { title: 'Building a Love for Reading in Reluctant Readers', desc: 'Practical strategies to help children who resist reading discover the joy of books.', minutes: 7 },
      { title: 'Creating the Perfect Reading Environment', desc: 'Design a space that makes your child excited to pick up a book.', minutes: 4 },
      { title: 'The Science of Reading: What Parents Need to Know', desc: 'Understanding how children learn to read can help you support them better.', minutes: 10 },
    ],
  },
  es: {
    seoTitle: 'Recursos para padres',
    seoDesc: 'Consejos de lectura, hitos del desarrollo infantil e ideas de actividades para padres y docentes. Para hacer cada sesión de lectura mágica.',
    heading: 'Recursos y guías para padres',
    subheading: 'Consejos de expertos, actividades y estrategias para que el tiempo de lectura sea mágico',
    searchPlaceholder: 'Buscar recursos...',
    popular: 'Popular',
    readMore: 'Leer más →',
    emptyMsg: 'No se encontraron recursos. ¡Prueba otra búsqueda!',
    minRead: 'min de lectura',
    categories: {
      all: 'Todos los recursos',
      readingTips: 'Consejos de lectura',
      activityIdeas: 'Ideas de actividades',
      childDev: 'Desarrollo infantil',
      engagement: 'Fomentar el interés',
    },
    resources: [
      { title: '10 formas de hacer mágico el tiempo de lectura', desc: 'Transforma las sesiones de lectura cotidianas en aventuras memorables que tu peque adorará.', minutes: 5 },
      { title: 'Hitos de lectura por edades', desc: 'Qué esperar en cada etapa y cómo apoyar el camino lector de tu peque.', minutes: 8 },
      { title: '5 actividades creativas para después de leer', desc: 'Alarga la diversión y el aprendizaje más allá de la última página con estas actividades.', minutes: 6 },
      { title: 'Cultivar el amor por la lectura en lectores reticentes', desc: 'Estrategias prácticas para que los niños que se resisten descubran el placer de los libros.', minutes: 7 },
      { title: 'Crear el ambiente perfecto para leer', desc: 'Diseña un espacio que invite a tu peque a coger un libro con ganas.', minutes: 4 },
      { title: 'La ciencia de la lectura: lo que los padres deben saber', desc: 'Entender cómo aprenden a leer los niños te ayudará a apoyarles mejor.', minutes: 10 },
    ],
  },
  fr: {
    seoTitle: 'Ressources pour parents',
    seoDesc: 'Conseils de lecture, étapes du développement de l\'enfant et idées d\'activités pour les parents et enseignants. Pour rendre chaque séance de lecture magique.',
    heading: 'Ressources et guides pour parents',
    subheading: 'Conseils d\'experts, activités et stratégies pour rendre le temps de lecture magique',
    searchPlaceholder: 'Rechercher des ressources...',
    popular: 'Populaire',
    readMore: 'Lire la suite →',
    emptyMsg: 'Aucune ressource trouvée. Essayez une autre recherche !',
    minRead: 'min de lecture',
    categories: {
      all: 'Toutes les ressources',
      readingTips: 'Conseils de lecture',
      activityIdeas: "Idées d'activités",
      childDev: "Développement de l'enfant",
      engagement: "Susciter l'intérêt",
    },
    resources: [
      { title: '10 façons de rendre le temps de lecture magique', desc: 'Transformez les séances de lecture ordinaires en aventures inoubliables que votre enfant adorera.', minutes: 5 },
      { title: 'Les étapes de lecture selon l\'âge', desc: 'À quoi s\'attendre à chaque étape et comment soutenir le parcours de lecture de votre enfant.', minutes: 8 },
      { title: '5 activités créatives à faire après la lecture', desc: 'Prolongez l\'apprentissage et le plaisir au-delà de la dernière page avec ces activités.', minutes: 6 },
      { title: 'Faire aimer la lecture aux lecteurs réticents', desc: 'Stratégies concrètes pour aider les enfants qui résistent à découvrir le plaisir des livres.', minutes: 7 },
      { title: "Créer l'environnement de lecture idéal", desc: 'Aménagez un espace qui donne envie à votre enfant de prendre un livre.', minutes: 4 },
      { title: 'La science de la lecture : ce que les parents doivent savoir', desc: 'Comprendre comment les enfants apprennent à lire vous aidera à mieux les accompagner.', minutes: 10 },
    ],
  },
};

const RESOURCE_META = [
  { emoji: '✨', categoryKey: 'readingTips', categoryColor: 'bg-blue-100 text-blue-700', popular: true },
  { emoji: '📊', categoryKey: 'childDev', categoryColor: 'bg-green-100 text-green-700', popular: true },
  { emoji: '🎨', categoryKey: 'activityIdeas', categoryColor: 'bg-orange-100 text-orange-700', popular: false },
  { emoji: '💪', categoryKey: 'engagement', categoryColor: 'bg-pink-100 text-pink-700', popular: false },
  { emoji: '🏠', categoryKey: 'readingTips', categoryColor: 'bg-blue-100 text-blue-700', popular: false },
  { emoji: '🧠', categoryKey: 'childDev', categoryColor: 'bg-green-100 text-green-700', popular: false },
] as const;

type CategoryKey = 'all' | 'readingTips' | 'activityIdeas' | 'childDev' | 'engagement';

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [search, setSearch] = useState('');
  const t = useTranslation(TRANSLATIONS);

  const categoryButtons: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: t.categories.all },
    { key: 'readingTips', label: t.categories.readingTips },
    { key: 'activityIdeas', label: t.categories.activityIdeas },
    { key: 'childDev', label: t.categories.childDev },
    { key: 'engagement', label: t.categories.engagement },
  ];

  // Combine static meta with localized content.
  const merged = t.resources.map((r, i) => ({
    ...RESOURCE_META[i],
    ...r,
  }));

  const filtered = merged.filter(r => {
    const matchesCat = activeCategory === 'all' || r.categoryKey === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/resources" />

      <section className="bg-gradient-to-b from-blue-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
        </div>
      </section>

      <section className="py-8 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="relative max-w-sm mx-auto mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryButtons.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-50 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{r.emoji}</span>
                  {r.popular && (
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{t.popular}</span>
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full mb-3 inline-block ${r.categoryColor}`}>
                  {t.categories[r.categoryKey]}
                </span>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-purple-700 transition-colors leading-snug">
                  {r.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{r.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    ⏱ {r.minutes} {t.minRead}
                  </span>
                  <button className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                    {t.readMore}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📖</div>
              <p className="text-gray-500 text-lg">{t.emptyMsg}</p>
            </div>
          )}
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
