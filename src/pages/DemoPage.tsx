import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ActivityStatusButton from '../components/ActivityStatusButton';
import Seo from '../components/Seo';
import { useActivity } from '../data/activities';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    back: '← Back to Activities',
    seoSuffix: 'Free interactive activity for ages',
  },
  es: {
    back: '← Volver a actividades',
    seoSuffix: 'Actividad interactiva gratuita para edades',
  },
  fr: {
    back: '← Retour aux activités',
    seoSuffix: 'Activité interactive gratuite pour les',
  },
};

interface DemoPageProps {
  children: ReactNode;
}

export default function DemoPage({ children }: DemoPageProps) {
  const { pathname } = useLocation();
  // pathname like "/activities/story-builder"
  const slug = pathname.split('/').filter(Boolean).pop() ?? '';
  const activity = useActivity(slug);
  const t = useTranslation(TRANSLATIONS);

  return (
    <main className="py-8 px-4">
      {activity && (
        <Seo
          title={activity.title}
          description={`${activity.desc} ${t.seoSuffix} ${activity.ages}.`}
          path={`/activities/${activity.slug}`}
        />
      )}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            {t.back}
          </Link>
          {activity && <ActivityStatusButton slug={activity.slug} />}
        </div>
        {children}
      </div>
    </main>
  );
}
