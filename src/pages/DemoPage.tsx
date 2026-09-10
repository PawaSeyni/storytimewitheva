import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import ActivityStatusButton from '../components/ActivityStatusButton';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import { useActivity } from '../data/activities';
import { useLanguage, useTranslation } from '../lib/language';
import ContinueJourney from '../components/ContinueJourney';

const TRANSLATIONS = {
  en: {
    homeCrumb: 'Home',
    activitiesCrumb: 'Activities',
    seoSuffix: 'Free interactive activity for ages',
  },
  es: {
    homeCrumb: 'Inicio',
    activitiesCrumb: 'Actividades',
    seoSuffix: 'Actividad interactiva gratuita para edades',
  },
  fr: {
    homeCrumb: 'Accueil',
    activitiesCrumb: 'Activités',
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
  const { language } = useLanguage();
  // Same breadcrumb component and BreadcrumbList schema as book and collection pages
  // (S3-007); activity pages were the one detail type without them.
  const crumbs = activity
    ? [
        { label: t.homeCrumb, to: '/' },
        { label: t.activitiesCrumb, to: '/activities' },
        { label: activity.title, to: `/activities/${activity.slug}` },
      ]
    : null;

  return (
    <main className="py-8 px-4">
      {activity && (
        <Seo
          title={activity.title}
          description={`${activity.desc} ${t.seoSuffix} ${activity.ages}.`}
          path={`/activities/${activity.slug}`}
        />
      )}
      {crumbs && <JsonLd id="breadcrumb" data={breadcrumbSchema(crumbs, language)} />}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {crumbs && <Breadcrumbs crumbs={crumbs} />}
          {activity && <ActivityStatusButton slug={activity.slug} />}
        </div>
        {activity && <h1 className="sr-only">{activity.title}</h1>}
        {children}
        {/* S4-011: no activity dead-ends. The books that reference this activity are the
            derived reverse relation; the first one is the next step. */}
        {activity && <ContinueJourney sourceType="activity" sourceId={activity.slug} placement="activity" />}
      </div>
    </main>
  );
}
