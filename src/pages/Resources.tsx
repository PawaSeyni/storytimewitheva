import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import { localizePath, useLanguage, useTranslation } from '../lib/language';
import { resources as RESOURCES, resourcePath, type Resource } from '../data/resources';
import SaveResourceButton from '../components/SaveResourceButton';
import { educatorCollectionIds, collectionRecordById, publishedLearningPacks, packResources } from '../data/contentIndex';
import { THEMES, AGE_BANDS, type ThemeId, type AgeBandId } from '../data/taxonomy';
import type { Language } from '../lib/language';

// Resource identity, ordering, card metadata and localized title/description all
// live in src/data/resources.ts — the single source of truth that gives every
// resource a stable, globally unique ID for Book.relatedResourceIds to point at.
// Guide bodies live in src/data/articleBodies.ts and render on their own pages
// (src/pages/Article.tsx, /resources/<slug>). This page is the index: guide cards,
// learning packs and the teachers' printables.
const ARTICLES: Resource[] = RESOURCES.filter((r) => r.kind === 'article');
const DOWNLOADS: Resource[] = RESOURCES.filter((r) => r.kind === 'download');

// Label for any public collection id (theme, age band or editorial record).
function collectionLabel(id: string, language: Language): string {
  if (id in THEMES) return THEMES[id as ThemeId].labels[language];
  if (id in AGE_BANDS) return AGE_BANDS[id as AgeBandId].labels[language];
  return collectionRecordById[id]?.title?.[language] ?? id;
}

// ---------------------------------------------------------------------------
// TRANSLATIONS
// ---------------------------------------------------------------------------
const TRANSLATIONS = {
  en: {
    seoTitle: 'Parent Resources',
    seoDesc: 'Reading tips, child-development milestones, and activity ideas for parents and teachers. Helping you make every reading session magical.',
    heading: 'Parent Resources & Guides',
    subheading: 'Expert tips, activities, and strategies to make reading time magical',
    searchPlaceholder: 'Search resources...',
    popular: 'Popular',
    readArticle: 'Read article →',
    emptyMsg: 'No resources found. Try a different search!',
    minRead: 'min read',
    categories: {
      all: 'All Resources',
      readingTips: 'Reading Tips',
      activityIdeas: 'Activity Ideas',
      childDev: 'Child Development',
      engagement: 'Building Engagement',
    },
    packs: {
      heading: 'Learning packs',
      intro: 'The printables above, bundled for a purpose. One sign-up delivers every file in the pack, in your language where an edition exists.',
      inside: 'What is inside',
      goesWith: 'Goes with:',
      getPack: 'Get the pack',
      audience: { parent: 'For families', educator: 'For teachers and educators', both: 'For families and teachers' },
    },
    teachers: {
      heading: 'For Teachers & Educators',
      intro: 'Eva’s printables are free to use at home or in the classroom. Download, print, and share – no sign-up needed.',
      downloadCta: 'Download PDF',
      tipsHeading: 'Using Eva’s books in the classroom',
      classroomHeading: 'Classroom collections',
      tips: [
        'Read aloud as a group – tap 🔊 Listen to model pronunciation in English, Spanish, or French.',
        'Pause for predictions and discussion; each story carries a gentle theme like kindness, courage, or patience.',
        'Pair a story with a matching printable above for a complete lesson.',
        'Use the bilingual flashcards for vocabulary warm-ups and language practice.',
      ],
    },
  },
  es: {
    seoTitle: 'Recursos para padres',
    seoDesc: 'Consejos de lectura, hitos del desarrollo infantil e ideas de actividades para padres y docentes. Para hacer cada sesi\xf3n de lectura m\xe1gica.',
    heading: 'Recursos y gu\xedas para padres',
    subheading: 'Consejos de expertos, actividades y estrategias para que el tiempo de lectura sea m\xe1gico',
    searchPlaceholder: 'Buscar recursos...',
    popular: 'Popular',
    readArticle: 'Leer el art\xedculo →',
    emptyMsg: 'No se encontraron recursos. \xa1Prueba otra b\xfasqueda!',
    minRead: 'min de lectura',
    categories: {
      all: 'Todos los recursos',
      readingTips: 'Consejos de lectura',
      activityIdeas: 'Ideas de actividades',
      childDev: 'Desarrollo infantil',
      engagement: 'Fomentar el inter\xe9s',
    },
    packs: {
      heading: 'Paquetes de aprendizaje',
      intro: 'Los imprimibles de arriba, agrupados con un propósito. Un solo registro entrega todos los archivos del paquete, en tu idioma cuando existe la edición.',
      inside: 'Qué incluye',
      goesWith: 'Acompaña a:',
      getPack: 'Quiero el paquete',
      audience: { parent: 'Para familias', educator: 'Para docentes y educadores', both: 'Para familias y docentes' },
    },
    teachers: {
      heading: 'Para docentes y educadores',
      intro: 'Los materiales de Eva son gratuitos para usar en casa o en el aula. Descarga, imprime y comparte – sin registro.',
      downloadCta: 'Descargar PDF',
      tipsHeading: 'Usar los libros de Eva en el aula',
      classroomHeading: 'Colecciones para el aula',
      tips: [
        'Lean en voz alta en grupo – pulsa 🔊 Escuchar para modelar la pronunciaci\xf3n en ingl\xe9s, espa\xf1ol o franc\xe9s.',
        'Hagan pausas para predecir y conversar; cada historia tiene un valor como la bondad, la valent\xeda o la paciencia.',
        'Combina una historia con un imprimible de arriba para una lecci\xf3n completa.',
        'Usa las tarjetas biling\xfces para calentamientos de vocabulario y pr\xe1ctica de idiomas.',
      ],
    },
  },
  fr: {
    seoTitle: 'Ressources pour parents',
    seoDesc: 'Conseils de lecture, \xe9tapes du d\xe9veloppement de l’enfant et id\xe9es d’activit\xe9s pour les parents et enseignants. Pour rendre chaque s\xe9ance de lecture magique.',
    heading: 'Ressources et guides pour parents',
    subheading: 'Conseils d’experts, activit\xe9s et strat\xe9gies pour rendre le temps de lecture magique',
    searchPlaceholder: 'Rechercher des ressources...',
    popular: 'Populaire',
    readArticle: 'Lire l’article →',
    emptyMsg: 'Aucune ressource trouv\xe9e. Essayez une autre recherche\xa0!',
    minRead: 'min de lecture',
    categories: {
      all: 'Toutes les ressources',
      readingTips: 'Conseils de lecture',
      activityIdeas: 'Id\xe9es d’activit\xe9s',
      childDev: 'D\xe9veloppement de l’enfant',
      engagement: 'Susciter l’int\xe9r\xeat',
    },
    packs: {
      heading: 'Packs d’apprentissage',
      intro: 'Les fiches ci-dessus, regroupées selon un objectif. Une seule inscription livre tous les fichiers du pack, dans votre langue quand l’édition existe.',
      inside: 'Ce que contient le pack',
      goesWith: 'Accompagne :',
      getPack: 'Recevoir le pack',
      audience: { parent: 'Pour les familles', educator: 'Pour les enseignants et éducateurs', both: 'Pour les familles et les enseignants' },
    },
    teachers: {
      heading: 'Pour les enseignants et \xe9ducateurs',
      intro: 'Les supports d’Eva sont gratuits \xe0 utiliser \xe0 la maison ou en classe. T\xe9l\xe9chargez, imprimez et partagez – sans inscription.',
      downloadCta: 'T\xe9l\xe9charger le PDF',
      tipsHeading: 'Utiliser les livres d’Eva en classe',
      classroomHeading: 'Collections pour la classe',
      tips: [
        'Lisez \xe0 voix haute en groupe – appuyez sur 🔊 \xc9couter pour mod\xe9liser la prononciation en anglais, espagnol ou fran\xe7ais.',
        'Faites des pauses pour les pr\xe9dictions et la discussion\xa0; chaque histoire porte une valeur comme la gentillesse, le courage ou la patience.',
        'Associez une histoire \xe0 un imprimable ci-dessus pour une le\xe7on compl\xe8te.',
        'Utilisez les cartes bilingues pour les \xe9chauffements de vocabulaire et la pratique des langues.',
      ],
    },
  },
};

type CategoryKey = 'all' | 'readingTips' | 'activityIdeas' | 'childDev' | 'engagement';

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [search, setSearch] = useState('');
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const { hash } = useLocation();
  const navigate = useNavigate();

  // The guides used to be anchors on this page (/resources#<slug>), and that form is
  // still out in the world in pins, posts and emails. Forward an old anchor to the
  // guide's own page, keeping the language prefix.
  useEffect(() => {
    const slug = decodeURIComponent(hash.slice(1));
    const guide = ARTICLES.find((r) => r.slug === slug);
    if (guide) navigate(localizePath(resourcePath(guide), language), { replace: true });
  }, [hash, language, navigate]);

  const categoryButtons: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: t.categories.all },
    { key: 'readingTips', label: t.categories.readingTips },
    { key: 'activityIdeas', label: t.categories.activityIdeas },
    { key: 'childDev', label: t.categories.childDev },
    { key: 'engagement', label: t.categories.engagement },
  ];

  // Project the shared resource model into this page's language.
  const merged = ARTICLES.map((r) => ({
    id: r.id,
    emoji: r.emoji,
    categoryKey: r.categoryKey as Exclude<CategoryKey, 'all'>,
    categoryColor: r.categoryColor,
    popular: r.popular,
    minutes: r.minutes,
    to: resourcePath(r),
    title: r.title[language],
    desc: r.description[language],
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

      <section className="bg-linear-to-b from-blue-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
        </div>
      </section>

      <section className="py-8 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="relative max-w-sm mx-auto mb-6">
            <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-purple-300 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryButtons.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                aria-pressed={activeCategory === cat.key}
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

      {/* Guide cards: each links to the guide's own page (/resources/<slug>). */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              // The save control is a sibling of the link, never nested inside it: a
              // <button> inside an <a> is invalid markup and breaks keyboard and
              // screen-reader behaviour.
              <div key={r.id} className="relative">
                <Link to={r.to} className="block h-full">
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
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        ⏱ {r.minutes} {t.minRead}
                      </span>
                      <span className="text-xs text-amber-700 font-medium group-hover:text-amber-900">
                        {t.readArticle}
                      </span>
                    </div>
                  </div>
                </Link>
                <span className="absolute top-4 right-4 z-10">
                  <SaveResourceButton resourceId={r.id} />
                </span>
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

      {/* Learning packs (S7-008): curated groups of the printables above. Each pack is a
          gated lead magnet at /free/<pack id> that delivers every file as a named link. */}
      {publishedLearningPacks.length > 0 && (
        <section id="packs" className="scroll-mt-24 py-12 px-4 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3" aria-hidden>🎒</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.packs.heading}</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">{t.packs.intro}</p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publishedLearningPacks.map((pack) => {
                const items = packResources(pack.id);
                return (
                  <li key={pack.id} className="bg-white rounded-2xl shadow-md border border-gray-50 p-6 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3 text-xs font-semibold">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">{t.packs.audience[pack.audience]}</span>
                      {pack.ageBandIds.map((b) => (
                        <span key={b} className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-100">{AGE_BANDS[b].labels[language]}</span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {pack.emoji && <span aria-hidden>{pack.emoji} </span>}
                      {pack.title[language]}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{pack.description[language]}</p>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">{t.packs.inside} ({items.length})</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-1">
                      {items.map((r) => (
                        <li key={r.id}>{r.title[language]}</li>
                      ))}
                    </ul>
                    {pack.collectionIds && pack.collectionIds.length > 0 && (
                      <p className="text-xs text-gray-500 mb-4">
                        {t.packs.goesWith}{' '}
                        {pack.collectionIds.map((c, i) => (
                          <span key={c}>
                            {i > 0 ? ', ' : ''}
                            <Link to={`/collections/${c}`} className="underline hover:text-purple-700">{collectionLabel(c, language)}</Link>
                          </span>
                        ))}
                      </p>
                    )}
                    <Link
                      to={`/free/${pack.id}`}
                      className="mt-auto inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors"
                    >
                      {t.packs.getPack} →
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* For Teachers & Educators -- free, classroom-friendly printables (PDFs in /public). */}
      <section id="teachers" className="scroll-mt-24 py-12 px-4 bg-linear-to-b from-white to-purple-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3" aria-hidden>🍎</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.teachers.heading}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t.teachers.intro}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {DOWNLOADS.map((d, i) => {
              // Route to the dedicated /free/<magnet> landing page (email capture)
              // instead of a raw PDF path. The old /<file>.pdf links 404 (PDFs are
              // gated behind hashed filenames since the P0 funnel fix) AND captured
              // no email. The landing page delivers the correct-language PDF after
              // signup; LocalizedLink adds the /es,/fr prefix to keep the language.
              const to = `/free/${d.slug}`;
              return (
                <div key={i} className="relative flex">
                <span className="absolute top-3 right-3 z-10">
                  <SaveResourceButton resourceId={d.id} />
                </span>
                <Link
                  to={to}
                  className="flex-1 bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-50 p-5 flex flex-col transition-all"
                >
                  <span className="text-3xl mb-2" aria-hidden>{d.emoji}</span>
                  <h3 className="font-bold text-gray-800 mb-1 leading-snug">{d.title[language]}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{d.description[language]}</p>
                  <span className="mt-3 text-sm font-semibold text-purple-600">⬇ {t.teachers.downloadCta}</span>
                </Link>
                </div>
              );
            })}
          </div>
          {educatorCollectionIds.length > 0 && (
            <div className="max-w-3xl mx-auto mb-8">
              <h3 className="font-bold text-gray-800 mb-3">{t.teachers.classroomHeading}</h3>
              <ul className="flex flex-wrap gap-2">
                {educatorCollectionIds.map((id) => (
                  <li key={id}>
                    <Link to={`/collections/${id}`} className="inline-block px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-sm text-emerald-900 font-semibold hover:border-emerald-300">
                      {collectionRecordById[id]?.title?.[language] ?? id} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xs border border-gray-50 p-6">
            <h3 className="font-bold text-gray-800 mb-3">{t.teachers.tipsHeading}</h3>
            <ul className="space-y-2 text-gray-600 text-sm leading-relaxed list-disc pl-5">
              {t.teachers.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <EmailSignup placement="resources" />
    </main>
  );
}
