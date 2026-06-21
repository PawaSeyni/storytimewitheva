import { useEffect, useState } from 'react';
import { Link } from '../components/LocalizedLink';
import { CheckCircle2 } from 'lucide-react';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import { useActivities } from '../data/activities';
import { isActivityCompleted, loadProgress, type Progress } from '../lib/progress';
import { matchesAgeFilter } from '../lib/ages';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    seoTitle: 'Fun Activities with Eva',
    seoDesc: 'Free interactive games and activities for kids ages 3–9: bilingual flashcards, matching, spelling bee, story dice, coloring, reading bingo, and more.',
    heading: 'Fun Activities with Eva',
    subheading: 'Learning comes alive through play!',
    liveBadge: 'Live',
    completedBadge: 'Completed',
    ages: 'Ages',
    tryNow: 'Try Now →',
    openAgain: 'Open Again →',
    ageAll: 'All ages',
    age3to5: 'Ages 3-5',
    age6to8: 'Ages 6-8',
    age9plus: 'Ages 9+',
    emptyAge: 'No activities in this age range yet. Try another.',
  },
  es: {
    seoTitle: 'Actividades divertidas con Eva',
    seoDesc: 'Juegos y actividades interactivas gratuitas para peques de 3 a 9 años: tarjetas bilingües, parejas, ortografía, dados de historia, colorear, bingo y más.',
    heading: 'Actividades divertidas con Eva',
    subheading: '¡El aprendizaje cobra vida con el juego!',
    liveBadge: 'En vivo',
    completedBadge: 'Completada',
    ages: 'Edades',
    tryNow: 'Probar ahora →',
    openAgain: 'Abrir otra vez →',
    ageAll: 'Todas las edades',
    age3to5: '3-5 años',
    age6to8: '6-8 años',
    age9plus: '9+ años',
    emptyAge: 'Aún no hay actividades en este rango de edad — prueba otro.',
  },
  fr: {
    seoTitle: 'Activités amusantes avec Eva',
    seoDesc: 'Jeux et activités interactives gratuits pour les enfants de 3 à 9 ans : cartes bilingues, paires, orthographe, dés à histoire, coloriage, bingo et plus.',
    heading: 'Activités amusantes avec Eva',
    subheading: 'L\'apprentissage prend vie par le jeu !',
    liveBadge: 'En direct',
    completedBadge: 'Terminée',
    ages: 'Âges',
    tryNow: 'Essayer →',
    openAgain: 'Rouvrir →',
    ageAll: 'Tous les âges',
    age3to5: '3-5 ans',
    age6to8: '6-8 ans',
    age9plus: '9+ ans',
    emptyAge: 'Pas encore d\'activités dans cette tranche d\'âge — essayez-en une autre.',
  },
};

export default function Activities() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [ageFilter, setAgeFilter] = useState('All');
  const t = useTranslation(TRANSLATIONS);
  const activities = useActivities();

  const ageFilters = [
    { key: 'All', label: t.ageAll },
    { key: '3-5', label: t.age3to5 },
    { key: '6-8', label: t.age6to8 },
    { key: '9+', label: t.age9plus },
  ];
  const filtered = activities.filter((a) => matchesAgeFilter(a.ages, ageFilter));

  useEffect(() => {
    const sync = () => setProgress(loadProgress());
    window.addEventListener('progresschange', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('progresschange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/activities" />

      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mx-auto mt-6 mb-8 rounded-full" />
          <div className="flex flex-wrap gap-2 justify-center">
            {ageFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setAgeFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  ageFilter === f.key
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((act) => {
              const done = isActivityCompleted(progress, act.slug);
              return (
                <div
                  key={act.slug}
                  className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-50 flex flex-col"
                >
                  <span
                    className={`absolute top-4 right-4 z-10 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                      done ? 'bg-orange-700 text-white' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {done ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        {t.completedBadge}
                      </>
                    ) : (
                      t.liveBadge
                    )}
                  </span>
                  <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-5xl block mb-4">{act.emoji}</span>
                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full mb-3 inline-block self-start">
                      {act.category}
                    </span>
                    <h2 className="font-bold text-gray-800 text-xl mb-2">{act.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{act.desc}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-500">
                        {t.ages}: <strong>{act.ages}</strong>
                      </span>
                      {act.game ? (
                        // Standalone HTML game — full-page static file in /public/games.
                        <a
                          href={`/games/${act.slug}.html`}
                          className="text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-1.5 rounded-full shadow-sm transition-all"
                        >
                          {done ? t.openAgain : t.tryNow}
                        </a>
                      ) : (
                        <Link
                          to={`/activities/${act.slug}`}
                          className="text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-1.5 rounded-full shadow-sm transition-all"
                        >
                          {done ? t.openAgain : t.tryNow}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3" aria-hidden>🔍</div>
              <p className="text-gray-500 text-lg">{t.emptyAge}</p>
            </div>
          )}
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
