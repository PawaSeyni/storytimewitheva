// Classroom units index — /classroom (activities audit 2026-11, §5c item 5). The inbound
// link every unit page needs (orphan-route guard), and the teachers' discovery surface.
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import { publishedClassroomUnits, unitAgeRange, unitBooks } from '../data/classroomUnits';
import { sizedCover } from '../lib/covers';
import { useLanguage, useTranslation } from '../lib/language';

const SITE_URL = 'https://storytimewitheva.com';
const TRANSLATIONS = {
  en: {
    home: 'Home', resources: 'Parent Resources', heading: 'Classroom units',
    intro: 'Five themed weeks for teachers, built from the Eva Gallo Collection: two or three read-alouds, their Studio activities, the story words and discussion prompts, and a day-by-day plan. Every unit is open to read; sign up on a unit page for its printable pack.',
    seo: 'Five classroom units on kindness, patience, courage, feelings and curiosity, each with two or three picture books, a five-day plan and activities.',
    ages: 'Ages', books: 'books', days: '5 days', open: 'Open the unit',
  },
  es: {
    home: 'Inicio', resources: 'Recursos para padres', heading: 'Unidades para el aula',
    intro: 'Cinco semanas temáticas para docentes, creadas a partir de la Colección Eva Gallo: dos o tres lecturas en voz alta, sus actividades del Estudio, las palabras del cuento, las preguntas para conversar y un plan día a día. Todas las unidades se pueden leer libremente; en la página de cada unidad puedes registrarte para recibir su paquete imprimible.',
    seo: 'Cinco unidades para el aula sobre bondad, paciencia, valentía, emociones y curiosidad, con dos o tres libros, un plan de cinco días y actividades.',
    ages: 'Edades', books: 'libros', days: '5 días', open: 'Abrir la unidad',
  },
  fr: {
    home: 'Accueil', resources: 'Ressources pour parents', heading: 'Unités pour la classe',
    intro: 'Cinq semaines thématiques pour les enseignants, construites à partir de la Collection Eva Gallo : deux ou trois lectures à voix haute, leurs activités du Studio, les mots de l’histoire, les questions de discussion et un plan jour par jour. Chaque unité se lit librement ; sur la page d’une unité, inscrivez-vous pour recevoir son pack à imprimer.',
    seo: 'Cinq unités pour la classe sur la bonté, la patience, le courage, les émotions et la curiosité, avec des albums, un plan sur cinq jours et des activités.',
    ages: 'Âges', books: 'livres', days: '5 jours', open: 'Ouvrir l’unité',
  },
};

export default function Classroom() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const crumbs = [{ label: t.home, to: '/' }, { label: t.resources, to: '/resources' }, { label: t.heading, to: '/classroom' }];
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: t.heading, description: t.seo, url: `${SITE_URL}/classroom`, inLanguage: language,
      mainEntity: {
        '@type': 'ItemList', numberOfItems: publishedClassroomUnits.length,
        itemListElement: publishedClassroomUnits.map((u, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/classroom/${u.id}`, name: u.title[language] })),
      },
    },
    breadcrumbSchema(crumbs, language),
  ];
  return (
    <main>
      <Seo title={t.heading} description={t.seo} path="/classroom" />
      <JsonLd id="classroom" data={schema} />
      <section className="bg-linear-to-b from-emerald-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs crumbs={crumbs} className="mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{t.heading}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t.intro}</p>
        </div>
      </section>
      <section className="py-10 px-4">
        <ul className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {publishedClassroomUnits.map((u) => {
            const books = unitBooks(u);
            const [from, to] = unitAgeRange(u).split('-');
            return (
              <li key={u.id}>
                <Link to={`/classroom/${u.id}`} className="block h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all">
                  <p className="text-xs font-semibold text-emerald-800 mb-2">{t.ages} {from}-{to} · {books.length} {t.books} · {t.days}</p>
                  <h2 className="text-xl font-bold text-gray-800 mb-2"><span aria-hidden>{u.emoji} </span>{u.title[language]}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{u.description[language]}</p>
                  <ul className="flex gap-2 mb-4" aria-hidden>
                    {books.map((b) => {
                      const src = b.editions[language]?.cover ?? b.editions.en.cover ?? '';
                      return <li key={b.id}><img src={sizedCover(src, 160)} alt="" width={56} height={56} loading="lazy" className="w-14 h-14 rounded-lg object-cover" /></li>;
                    })}
                  </ul>
                  <span className="text-sm font-semibold text-emerald-700">{t.open} →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
