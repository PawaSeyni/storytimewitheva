import { useState } from 'react';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';

// ---------------------------------------------------------------------------
// Affiliate URLs — single source of truth. Keep in sync with
// outputs/social_media_infra/trackers/00_master_tracker.xlsx → Affiliate_Links.
// All Amazon links carry the storytimewi20-20 tracking ID.
// ---------------------------------------------------------------------------
const AFFILIATE = {
  // AF-001 — SMARTERIOR Bedside Table Lamp for Kids
  readingLamp: 'https://www.amazon.com/dp/B0FMJRR92L?tag=storytimewi20-20',
  // AF-002 — MAXYOYO 3-in-1 Kids Bean Bag Chair Couch
  floorCushion: 'https://www.amazon.com/dp/B0DNZJ2W9C?tag=storytimewi20-20',
  // AF-003 — Chuiendi 4-Tier Montessori Front-Facing Bookshelf
  bookshelf: 'https://www.amazon.com/dp/B0GJLKWVKJ?tag=storytimewi20-20',
} as const;

// ---------------------------------------------------------------------------
// Reusable affiliate link component — enforces rel="sponsored noopener" +
// target="_blank" + small "(affiliate)" badge for FTC clarity.
// ---------------------------------------------------------------------------
function AffiliateLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="text-amber-700 hover:text-amber-900 underline decoration-amber-300 hover:decoration-amber-700 underline-offset-2 font-medium"
    >
      {children}
      <span className="ml-1 text-xs text-amber-600/70">(affiliate)</span>
    </a>
  );
}

const TRANSLATIONS = {
  en: {
    seoTitle: 'Parent Resources',
    seoDesc: 'Reading tips, child-development milestones, and activity ideas for parents and teachers. Helping you make every reading session magical.',
    heading: 'Parent Resources & Guides',
    subheading: 'Expert tips, activities, and strategies to make reading time magical',
    searchPlaceholder: 'Search resources...',
    popular: 'Popular',
    readArticle: 'Read article ↓',
    emptyMsg: 'No resources found. Try a different search!',
    minRead: 'min read',
    categories: {
      all: 'All Resources',
      readingTips: 'Reading Tips',
      activityIdeas: 'Activity Ideas',
      childDev: 'Child Development',
      engagement: 'Building Engagement',
    },
    disclosure: {
      heading: 'A note on affiliate links',
      body: 'This page contains affiliate links. If you purchase through these links I may earn a small commission at no extra cost to you. I only recommend products I genuinely use and trust.',
      amazon: 'As an Amazon Associate I earn from qualifying purchases.',
    },
    articleSoon: 'Full article available in English. ES / FR coming soon.',
    resources: [
      { title: '10 Ways to Make Reading Time Magical', desc: 'Transform ordinary reading sessions into memorable adventures your child will love.', minutes: 5, anchor: 'making-reading-magical' },
      { title: 'Age-Appropriate Reading Milestones', desc: "What to expect at each stage and how to support your child's literacy journey.", minutes: 8 },
      { title: '5 Creative Follow-Up Activities After Reading', desc: 'Extend the learning and fun beyond the last page with these engaging activities.', minutes: 6 },
      { title: 'Building a Love for Reading in Reluctant Readers', desc: 'Practical strategies to help children who resist reading discover the joy of books.', minutes: 7 },
      { title: 'Creating the Perfect Reading Environment', desc: 'Design a space that makes your child excited to pick up a book.', minutes: 4, anchor: 'perfect-reading-environment' },
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
    readArticle: 'Leer el artículo ↓',
    emptyMsg: 'No se encontraron recursos. ¡Prueba otra búsqueda!',
    minRead: 'min de lectura',
    categories: {
      all: 'Todos los recursos',
      readingTips: 'Consejos de lectura',
      activityIdeas: 'Ideas de actividades',
      childDev: 'Desarrollo infantil',
      engagement: 'Fomentar el interés',
    },
    disclosure: {
      heading: 'Sobre los enlaces de afiliados',
      body: 'Esta página contiene enlaces de afiliados. Si compras a través de ellos, podemos ganar una pequeña comisión sin coste adicional para ti. Solo recomendamos productos que de verdad usamos y nos gustan.',
      amazon: 'Como afiliados de Amazon, ganamos con compras que cumplen los requisitos.',
    },
    articleSoon: 'Artículo completo disponible en inglés. Traducción al ES / FR próximamente.',
    resources: [
      { title: '10 formas de hacer mágico el tiempo de lectura', desc: 'Transforma las sesiones de lectura cotidianas en aventuras memorables que tu peque adorará.', minutes: 5, anchor: 'making-reading-magical' },
      { title: 'Hitos de lectura por edades', desc: 'Qué esperar en cada etapa y cómo apoyar el camino lector de tu peque.', minutes: 8 },
      { title: '5 actividades creativas para después de leer', desc: 'Alarga la diversión y el aprendizaje más allá de la última página con estas actividades.', minutes: 6 },
      { title: 'Cultivar el amor por la lectura en lectores reticentes', desc: 'Estrategias prácticas para que los niños que se resisten descubran el placer de los libros.', minutes: 7 },
      { title: 'Crear el ambiente perfecto para leer', desc: 'Diseña un espacio que invite a tu peque a coger un libro con ganas.', minutes: 4, anchor: 'perfect-reading-environment' },
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
    readArticle: 'Lire l\'article ↓',
    emptyMsg: 'Aucune ressource trouvée. Essayez une autre recherche !',
    minRead: 'min de lecture',
    categories: {
      all: 'Toutes les ressources',
      readingTips: 'Conseils de lecture',
      activityIdeas: "Idées d'activités",
      childDev: "Développement de l'enfant",
      engagement: "Susciter l'intérêt",
    },
    disclosure: {
      heading: 'À propos des liens affiliés',
      body: 'Cette page contient des liens affiliés. Si vous achetez via ces liens, nous pouvons gagner une petite commission sans coût supplémentaire pour vous. Nous ne recommandons que des produits que nous utilisons réellement.',
      amazon: 'En tant qu\'affilié Amazon, nous percevons une commission sur les achats éligibles.',
    },
    articleSoon: 'Article complet disponible en anglais. Traduction ES / FR à venir.',
    resources: [
      { title: '10 façons de rendre le temps de lecture magique', desc: 'Transformez les séances de lecture ordinaires en aventures inoubliables que votre enfant adorera.', minutes: 5, anchor: 'making-reading-magical' },
      { title: 'Les étapes de lecture selon l\'âge', desc: 'À quoi s\'attendre à chaque étape et comment soutenir le parcours de lecture de votre enfant.', minutes: 8 },
      { title: '5 activités créatives à faire après la lecture', desc: 'Prolongez l\'apprentissage et le plaisir au-delà de la dernière page avec ces activités.', minutes: 6 },
      { title: 'Faire aimer la lecture aux lecteurs réticents', desc: 'Stratégies concrètes pour aider les enfants qui résistent à découvrir le plaisir des livres.', minutes: 7 },
      { title: "Créer l'environnement de lecture idéal", desc: 'Aménagez un espace qui donne envie à votre enfant de prendre un livre.', minutes: 4, anchor: 'perfect-reading-environment' },
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

// ---------------------------------------------------------------------------
// Article 1 — 10 Ways to Make Reading Time Magical
// English-only for v1. ES / FR translations will come in a follow-up.
// ---------------------------------------------------------------------------
function ArticleMakingReadingMagical({ articleSoonNote }: { articleSoonNote: string | null }) {
  return (
    <article id="making-reading-magical" className="scroll-mt-24 max-w-3xl mx-auto px-4 py-12 border-t border-gray-100">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2">Reading Tips · 5 min read</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
          10 Ways to Make Reading Time Magical
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Transform ordinary reading sessions into memorable adventures your child will look forward to every single day.
        </p>
        {articleSoonNote && (
          <p className="mt-3 text-sm text-gray-500 italic">{articleSoonNote}</p>
        )}
      </header>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">1. Set the mood — light matters more than you think</h3>
          <p>
            Bedtime reading hits different when the overhead light is off and a soft, warm glow surrounds the book. We use a clip-on
            kids' reading lamp that gives off just enough light for the words without the overstimulation of a ceiling fixture.
            Our pick: <AffiliateLink href={AFFILIATE.readingLamp}>this dimmable bedside lamp</AffiliateLink>.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">2. Build a reading rhythm, not a reading rule</h3>
          <p>
            Kids resist rules; they lean into rhythms. Pair reading time with something sensory — a particular blanket, a specific
            tea for you, the same playlist on low. After two weeks the cue alone makes them reach for a book.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">3. Pair the story with hands-on play</h3>
          <p>
            Reading about animals? Pull out finger puppets. About space? Cardboard rockets. The point isn't a Pinterest-perfect
            craft — it's the bridge from page to body.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">4. Let them turn the pages — even when they get it wrong</h3>
          <p>
            Control is the gateway to engagement. A three-year-old turning two pages at once still chose to be there. Don't correct
            it. Just keep reading.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">5. Voice acting is allowed</h3>
          <p>
            If you've never been a grandmother witch with a stuffy nose, this is your moment. Kids will quote you back to themselves
            for weeks.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">6. Read the same book until you can't stand it</h3>
          <p>
            Repetition is how fluency develops. The book you've read 47 times is the one teaching them most. Keep going.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">7. Bring in a second language casually</h3>
          <p>
            Even if you're not fluent, swap a single word per page. <em>"Look at the perro."</em> Then{' '}
            <em>"The perro is sleeping."</em> Children absorb the second language as part of the story, not as a lesson.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">8. Pause for predictions</h3>
          <p>
            Halfway through, ask: "What do you think will happen?" Then go back to reading. Comprehension goes up by roughly 30%
            on the next read-through when kids have already guessed once.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">9. Build the nook</h3>
          <p>
            A reading nook is a vote of confidence — a small space that says "this matters here." Start with a{' '}
            <AffiliateLink href={AFFILIATE.floorCushion}>convertible floor cushion</AffiliateLink> and a{' '}
            <AffiliateLink href={AFFILIATE.bookshelf}>front-facing Montessori bookshelf</AffiliateLink> so they can see the covers.
            That's the whole setup.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">10. Be the reader your child sees most</h3>
          <p>
            Children read more if they live with someone who reads. Twenty minutes of you on the couch with your own book does
            more for their literacy than any printable.
          </p>
        </section>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Article 2 — Creating the Perfect Reading Environment
// ---------------------------------------------------------------------------
function ArticlePerfectReadingEnvironment({ articleSoonNote }: { articleSoonNote: string | null }) {
  return (
    <article id="perfect-reading-environment" className="scroll-mt-24 max-w-3xl mx-auto px-4 py-12 border-t border-gray-100">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2">Reading Tips · 4 min read</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
          Creating the Perfect Reading Environment
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Design a space that makes your child reach for a book without being asked. This isn't about Pinterest-perfect rooms.
          It's about three deliberate choices.
        </p>
        {articleSoonNote && (
          <p className="mt-3 text-sm text-gray-500 italic">{articleSoonNote}</p>
        )}
      </header>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Choice 1 — Comfort that says "stay a while"</h3>
          <p>
            Forget structured chairs. Kids read longer when they're slouching, side-lying, or upside-down on something soft. A
            washable floor cushion is the workhorse here. Our pick:{' '}
            <AffiliateLink href={AFFILIATE.floorCushion}>this 3-in-1 convertible kids' bean bag couch</AffiliateLink>. Machine-washable,
            big enough that two kids can pile on without an elbow war.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Choice 2 — Book covers, not book spines</h3>
          <p>
            Traditional bookshelves hide picture-book covers and turn reading into a search problem. A forward-facing
            Montessori-style bookshelf shows four to six books at a time. Rotate them weekly. Kids pick up books they see, not
            books they have to dig for. Our pick:{' '}
            <AffiliateLink href={AFFILIATE.bookshelf}>this 4-tier wooden front-facing bookshelf</AffiliateLink>.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Choice 3 — Light that signals "reading"</h3>
          <p>
            Lighting is the most underrated piece. We use{' '}
            <AffiliateLink href={AFFILIATE.readingLamp}>a warm dimmable lamp</AffiliateLink> that we only turn on for reading.
            After a few weeks, the click of the lamp is itself the bedtime cue. The lamp goes on, the body settles.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Three things to skip</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>A theme.</strong> Nautical, jungle, princess — kids outgrow themes faster than the paint dries.</li>
            <li><strong>A screen anywhere in sight.</strong> Even an off iPad on a side table is a competitor. Move it.</li>
            <li><strong>Background music with lyrics.</strong> Instrumental only. Lyrics fight with the story for the same processing channel.</li>
          </ul>
        </section>
      </div>
    </article>
  );
}

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

  // Detect if current language has full article bodies.
  const articleSoonNote = (t as unknown as { articleSoon: string }).articleSoon;
  // Articles are EN-only for v1; show note in ES/FR.
  const showSoonNote =
    (typeof document !== 'undefined' && document.documentElement.lang !== 'en') ||
    null;
  const noteForArticles = showSoonNote ? articleSoonNote : null;

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

      {/* FTC affiliate disclosure — placed prominently above all content. */}
      <section className="bg-amber-50 border-y border-amber-200 px-4 py-4">
        <div className="max-w-3xl mx-auto text-sm text-amber-900">
          <p className="font-semibold mb-1">{t.disclosure.heading}</p>
          <p className="leading-relaxed">{t.disclosure.body}</p>
          <p className="leading-relaxed mt-1 italic">{t.disclosure.amazon}</p>
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
            {filtered.map((r, i) => {
              const card = (
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-50 group h-full">
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
                    {('anchor' in r && r.anchor) && (
                      <span className="text-xs text-amber-700 font-medium group-hover:text-amber-900">
                        {t.readArticle}
                      </span>
                    )}
                  </div>
                </div>
              );

              return 'anchor' in r && r.anchor ? (
                <a key={i} href={`#${r.anchor}`} className="block">
                  {card}
                </a>
              ) : (
                <div key={i}>{card}</div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📖</div>
              <p className="text-gray-500 text-lg">{t.emptyMsg}</p>
            </div>
          )}
        </div>
      </section>

      {/* Full articles with affiliate links — currently EN-only for v1. */}
      <ArticleMakingReadingMagical articleSoonNote={noteForArticles} />
      <ArticlePerfectReadingEnvironment articleSoonNote={noteForArticles} />

      <EmailSignup />
    </main>
  );
}
