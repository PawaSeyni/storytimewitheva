import { Link } from './LocalizedLink';
import { nextStep, type JourneySource } from '../lib/journey';
import { useBooks } from '../data/books';
import { useActivities } from '../data/activities';
import { resources } from '../data/resources';
import { gameUrl } from '../lib/gameUrl';
import { useLanguage, useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

// S4-010. One deterministic "next step" from wherever the reader is, resolved by
// src/lib/journey.ts. Renders NOTHING when nothing resolves: the spec forbids an empty
// or broken CTA, and a fallback to the catalog is only offered when it is the genuine
// answer, never as filler on a page that already has richer continuations.
const TRANSLATIONS = {
  en: { activity: 'Try the activity', book: 'Read next', resource: 'Keep going with', catalog: 'Browse all books', eyebrow: 'Continue the journey' },
  es: { activity: 'Prueba la actividad', book: 'Sigue leyendo', resource: 'Continúa con', catalog: 'Explora todos los libros', eyebrow: 'Continúa la aventura' },
  fr: { activity: 'Essayez l’activité', book: 'À lire ensuite', resource: 'Continuez avec', catalog: 'Voir tous les livres', eyebrow: 'Continuez l’aventure' },
};

export default function ContinueJourney({
  sourceType,
  sourceId,
  placement,
}: {
  sourceType: JourneySource;
  sourceId: string;
  placement: string;
}) {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const books = useBooks();
  const activities = useActivities();

  const step = nextStep(sourceType, sourceId);
  if (!step) return null;

  let title = '';
  if (step.type === 'book') title = books.find((b) => b.id === step.id)?.title ?? '';
  if (step.type === 'activity') title = activities.find((a) => a.slug === step.id)?.title ?? '';
  if (step.type === 'resource') title = resources.find((r) => r.id === step.id)?.title[language] ?? '';
  if (step.type !== 'catalog' && !title) return null; // never a nameless link

  const label = step.type === 'catalog' ? t.catalog : `${t[step.type]}: ${title}`;
  const onClick = () =>
    track('Continue Journey', {
      placement,
      destination: step.type,
      reason: step.reason,
      ...(step.type === 'book' ? { book: step.id } : {}),
      ...(step.type === 'activity' ? { activity: step.id } : {}),
      ...(step.type === 'resource' ? { resource: step.id } : {}),
    });

  const cls =
    'inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-purple-600 to-pink-500 text-white font-semibold px-5 py-3 shadow-md hover:shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all';

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 mb-2">{t.eyebrow}</p>
      {step.game ? (
        <a href={gameUrl(step.id!, language)} onClick={onClick} className={cls}>
          {label} <span aria-hidden>→</span>
        </a>
      ) : (
        <Link to={step.href} onClick={onClick} className={cls}>
          {label} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
