// Reading journeys index — /journeys (Sprint 7 S7-003). The inbound link every journey
// page needs (orphan-route guard), and the discovery surface.
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import { publishedJourneys } from '../data/contentIndex';
import { AGE_BANDS } from '../data/taxonomy';
import { useLanguage, useTranslation } from '../lib/language';

const SITE_URL = 'https://storytimewitheva.com';
const TRANSLATIONS = {
  en: { home: 'Home', heading: 'Reading journeys', intro: 'A few stories, a conversation, something to make, and the next book. Progress is remembered on this device only.', steps: 'steps', seo: 'Guided reading journeys for families: a book, a conversation, an activity, and the next book.' },
  es: { home: 'Inicio', heading: 'Recorridos de lectura', intro: 'Unas historias, una conversación, algo que hacer y el siguiente libro. El progreso se recuerda solo en este dispositivo.', steps: 'pasos', seo: 'Recorridos de lectura guiados para familias: un libro, una conversación, una actividad y el siguiente libro.' },
  fr: { home: 'Accueil', heading: 'Parcours de lecture', intro: 'Quelques histoires, une conversation, quelque chose à fabriquer, et le livre suivant. La progression est retenue sur cet appareil uniquement.', steps: 'étapes', seo: 'Parcours de lecture guidés pour les familles : un livre, une conversation, une activité et le livre suivant.' },
};

export default function Journeys() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const crumbs = [{ label: t.home, to: '/' }, { label: t.heading, to: '/journeys' }];
  const schema = [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: t.heading, description: t.seo, url: `${SITE_URL}/journeys`, inLanguage: language },
    breadcrumbSchema(crumbs, language),
  ];
  return (
    <main>
      <Seo title={t.heading} description={t.seo} path="/journeys" />
      <JsonLd id="journeys" data={schema} />
      <section className="bg-linear-to-b from-amber-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs crumbs={crumbs} className="mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{t.heading}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t.intro}</p>
        </div>
      </section>
      <section className="py-10 px-4">
        <ul className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {publishedJourneys.map((j) => (
            <li key={j.id}>
              <Link to={`/journeys/${j.id}`} className="block h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:shadow-md hover:border-purple-200 transition-all">
                <p className="text-xs font-semibold text-amber-800 mb-2">{j.ageBandIds.map((a) => AGE_BANDS[a].labels[language]).join(' · ')} · {j.steps.length} {t.steps}</p>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{j.title[language]}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{j.description[language]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
