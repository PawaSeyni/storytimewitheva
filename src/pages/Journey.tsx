// Reading journey page — /journeys/:journeyId (Sprint 7 S7-003, S7-010, S7-011).
//
// Steps are references resolved here against the live registries; a published journey
// has already passed contentIndex.journeyProblems() at build time, so every step
// resolves. Progress (S7-010) is local and advisory: completion controls are real
// buttons with aria-pressed, progress is stated in text ("Step 2 of 5") as well as
// programmatically, and changes are announced through a polite live region (§10).
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import DiscussionPrompts from '../components/DiscussionPrompts';
import NotFound from './NotFound';
import { books as rawBooks, useBooks } from '../data/books';
import { useActivities } from '../data/activities';
import { resources } from '../data/resources';
import { publishedJourneys, journeyRouteIds } from '../data/contentIndex';
import { THEMES, AGE_BANDS } from '../data/taxonomy';
import { loadProgress, toggleStep, onJourneyChange, nextIncompleteStepId } from '../lib/journeyProgress';
import { loadLibrary, isJourneySaved, toggleSavedJourney, onLibraryChange } from '../lib/personalLibrary';
import { gameUrl } from '../lib/gameUrl';
import { isAmazonCover, sizedCover } from '../lib/covers';
import { useLanguage, useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

const SITE_URL = 'https://storytimewitheva.com';

const TRANSLATIONS = {
  en: {
    home: 'Home', journeys: 'Reading journeys', stepOf: 'Step', of: 'of', optional: 'optional',
    types: { book: 'Read', discussion: 'Talk about it', activity: 'Try an activity', resource: 'For the grown-up', 'next-book': 'Read next' },
    markDone: 'Mark step done', markUndone: 'Mark step not done', done: 'Done', resume: 'Resume at step',
    complete: 'Journey complete. Well done!', progressAnnounce: (n: number, t: number) => `${n} of ${t} steps done.`,
    save: 'Save this journey', unsave: 'Remove from saved', saved: 'Saved on this device',
    open: 'Open', seoPrefix: 'A reading journey',
  },
  es: {
    home: 'Inicio', journeys: 'Recorridos de lectura', stepOf: 'Paso', of: 'de', optional: 'opcional',
    types: { book: 'Leer', discussion: 'Hablen juntos', activity: 'Prueba una actividad', resource: 'Para el adulto', 'next-book': 'Sigue leyendo' },
    markDone: 'Marcar paso hecho', markUndone: 'Marcar paso no hecho', done: 'Hecho', resume: 'Continuar en el paso',
    complete: '¡Recorrido completado! Muy bien.', progressAnnounce: (n: number, t: number) => `${n} de ${t} pasos hechos.`,
    save: 'Guardar este recorrido', unsave: 'Quitar de guardados', saved: 'Guardado en este dispositivo',
    open: 'Abrir', seoPrefix: 'Un recorrido de lectura',
  },
  fr: {
    home: 'Accueil', journeys: 'Parcours de lecture', stepOf: 'Étape', of: 'sur', optional: 'facultatif',
    types: { book: 'Lire', discussion: 'Parlez-en ensemble', activity: 'Essayez une activité', resource: 'Pour l’adulte', 'next-book': 'À lire ensuite' },
    markDone: 'Marquer l’étape comme faite', markUndone: 'Marquer l’étape comme non faite', done: 'Fait', resume: 'Reprendre à l’étape',
    complete: 'Parcours terminé. Bravo !', progressAnnounce: (n: number, t: number) => `${n} étapes sur ${t} faites.`,
    save: 'Enregistrer ce parcours', unsave: 'Retirer des enregistrés', saved: 'Enregistré sur cet appareil',
    open: 'Ouvrir', seoPrefix: 'Un parcours de lecture',
  },
};

export default function Journey() {
  const { journeyId = '' } = useParams();
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const activities = useActivities();

  const journey = publishedJourneys.find((j) => j.id === journeyId);
  const stepIds = useMemo(() => (journey ? journey.steps.map((s) => s.id) : []), [journey]);

  const [progress, setProgress] = useState(() => loadProgress(journeyId, stepIds));
  const [saved, setSaved] = useState(false);
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    const syncP = () => setProgress(loadProgress(journeyId, stepIds));
    const syncS = () => setSaved(isJourneySaved(loadLibrary(), journeyId));
    syncP(); syncS();
    const a = onJourneyChange(syncP);
    const b = onLibraryChange(syncS);
    return () => { a(); b(); };
  }, [journeyId, stepIds]);

  if (!journey || !journeyRouteIds.includes(journeyId)) return <NotFound />;

  const title = journey.title[language];
  const intro = journey.description[language];
  const path = `/journeys/${journey.id}`;
  const doneCount = progress.completedStepIds.length;
  const total = journey.steps.length;
  const resumeId = nextIncompleteStepId(progress, stepIds);

  const onToggle = (stepId: string, index: number) => {
    const next = toggleStep(journey.id, stepId, stepIds);
    const nowDone = next.completedStepIds.includes(stepId);
    setProgress(next);
    setAnnounce(next.completedStepIds.length === total ? t.complete : t.progressAnnounce(next.completedStepIds.length, total));
    track('Journey Step', { journey: journey.id, activity: String(index + 1), status: nowDone ? 'done' : 'undone' });
    // S7-016: starts and completions are derived from the transition, not stored.
    if (nowDone && progress.completedStepIds.length === 0) track('Journey Start', { journey: journey.id });
    if (nowDone && next.completedStepIds.length === total) track('Journey Complete', { journey: journey.id });
  };
  const onSave = () => {
    toggleSavedJourney(journey.id);
    track('Journey Saved', { journey: journey.id, status: saved ? 'removed' : 'added' });
  };

  const crumbs = [{ label: t.home, to: '/' }, { label: t.journeys, to: '/journeys' }, { label: title, to: path }];
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'ItemList', name: title, description: intro,
      url: `${SITE_URL}${path}`, inLanguage: language, numberOfItems: total,
      itemListElement: journey.steps.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: `${t.types[s.type]}` })),
    },
    breadcrumbSchema(crumbs, language),
  ];

  const bookOf = (id: string) => books.find((b) => b.id === id);
  const rawBookOf = (id: string) => rawBooks.find((b) => b.id === id);

  return (
    <main>
      <Seo title={`${title} — ${t.seoPrefix}`} description={intro} path={path} />
      <JsonLd id={`journey-${journey.id}`} data={schema} />

      <section className="bg-gradient-to-b from-amber-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs crumbs={crumbs} className="mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">{intro}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {journey.ageBandIds.map((a) => (
              <Link key={a} to={`/collections/${a}`} className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200">{AGE_BANDS[a].labels[language]}</Link>
            ))}
            {journey.themeIds.map((th) => (
              <Link key={th} to={`/collections/${th}`} className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold hover:bg-purple-200">{THEMES[th].labels[language]}</Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="text-sm font-semibold text-gray-700" aria-live="off">
              {t.progressAnnounce(doneCount, total)}{resumeId ? ` ${t.resume} ${stepIds.indexOf(resumeId) + 1}.` : ''}
            </p>
            <button
              type="button"
              onClick={onSave}
              aria-pressed={saved}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${saved ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-purple-300 text-purple-700 hover:bg-purple-50'}`}
            >
              {saved ? t.saved : t.save}
            </button>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <ol className="max-w-4xl mx-auto space-y-6">
          {journey.steps.map((step, i) => {
            const done = progress.completedStepIds.includes(step.id);
            const isResume = step.id === resumeId;
            const book = step.type !== 'activity' && step.type !== 'resource' ? bookOf(step.contentId) : undefined;
            const activity = step.type === 'activity' ? activities.find((a) => a.slug === step.contentId) : undefined;
            const resource = step.type === 'resource' ? resources.find((r) => r.id === step.contentId) : undefined;
            const raw = step.type === 'discussion' ? rawBookOf(step.contentId) : undefined;
            return (
              <li key={step.id} id={step.id} className={`rounded-2xl border p-5 sm:p-6 bg-white shadow-sm ${isResume ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-100'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                      {t.stepOf} {i + 1} {t.of} {total}{step.optional ? ` · ${t.optional}` : ''}
                    </p>
                    <h2 className="text-xl font-bold text-gray-800 mt-1">{t.types[step.type]}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggle(step.id, i)}
                    aria-pressed={done}
                    aria-label={`${done ? t.markUndone : t.markDone}: ${t.types[step.type]} ${i + 1}`}
                    className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-green-300 text-green-700 hover:bg-green-50'}`}
                  >
                    <span aria-hidden>{done ? '✓' : '○'}</span> {t.done}
                  </button>
                </div>

                {book && (
                  <Link to={`/books/${book.id}`} className="flex items-center gap-4 group">
                    <img src={isAmazonCover(book.coverImage) ? sizedCover(book.coverImage, 160) : book.coverImage} alt="" width={72} height={72} loading="lazy" className="w-18 h-18 rounded-xl object-cover shrink-0" />
                    <span>
                      <span className="block font-bold text-gray-800 group-hover:text-purple-700">{book.title}</span>
                      <span className="block text-sm text-gray-500 line-clamp-2">{book.description}</span>
                    </span>
                  </Link>
                )}
                {step.type === 'discussion' && raw && (
                  <div className="-mx-5 sm:-mx-6 -mb-5 sm:-mb-6 mt-2">
                    <DiscussionPrompts questions={raw.discussionQuestions} headingLevel="h3" />
                  </div>
                )}
                {activity && (
                  activity.game ? (
                    <a href={gameUrl(activity.slug, language)} className="inline-flex items-center gap-3 text-purple-700 font-semibold hover:text-purple-900">
                      <span className="text-2xl" aria-hidden>{activity.emoji}</span> {activity.title} <span aria-hidden>→</span>
                    </a>
                  ) : (
                    <Link to={`/activities/${activity.slug}`} className="inline-flex items-center gap-3 text-purple-700 font-semibold hover:text-purple-900">
                      <span className="text-2xl" aria-hidden>{activity.emoji}</span> {activity.title} <span aria-hidden>→</span>
                    </Link>
                  )
                )}
                {resource && (
                  <Link to={resource.kind === 'article' ? `/resources#${resource.slug}` : `/free/${resource.slug}`} className="inline-flex items-center gap-3 text-purple-700 font-semibold hover:text-purple-900">
                    <span className="text-2xl" aria-hidden>{resource.emoji ?? '📄'}</span> {resource.title[language]} <span aria-hidden>→</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
        <p role="status" aria-live="polite" className="sr-only">{announce}</p>
      </section>
    </main>
  );
}
