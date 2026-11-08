import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import ActivityStatusButton from '../components/ActivityStatusButton';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import { useActivity } from '../data/activities';
import { useLanguage, useTranslation } from '../lib/language';
import ContinueJourney from '../components/ContinueJourney';
import EmailSignup from '../components/EmailSignup';
import { Link } from '../components/LocalizedLink';
import { useBooks } from '../data/books';
import { useSourceBook } from '../lib/sourceBook';

const TRANSLATIONS = {
  en: {
    homeCrumb: 'Home',
    activitiesCrumb: 'Activities',
    seoSuffix: 'Free interactive activity for ages',
    backTo: 'Back to',
  },
  es: {
    homeCrumb: 'Inicio',
    activitiesCrumb: 'Actividades',
    seoSuffix: 'Actividad interactiva gratuita para edades',
    backTo: 'Volver a',
  },
  fr: {
    homeCrumb: 'Accueil',
    activitiesCrumb: 'Activités',
    seoSuffix: 'Activité interactive gratuite pour les',
    backTo: 'Retour à',
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
  // Audit 2026-11 P0: the book page passes ?book=<id>; validated against the book's own
  // relatedActivityIds, so an unrelated or invented id is ignored.
  const fromBook = useSourceBook(slug);
  const books = useBooks();
  const fromBookTitle = fromBook ? books.find((b) => b.id === fromBook)?.title : undefined;
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
          {activity && <ActivityStatusButton slug={activity.slug} book={fromBook} />}
        </div>
        {fromBook && fromBookTitle && (
          <p className="-mt-3 mb-5">
            <Link to={`/books/${fromBook}`} className="text-sm font-semibold text-purple-700 hover:text-purple-900 underline-offset-4 hover:underline">
              <span aria-hidden>← </span>{t.backTo} {fromBookTitle}
            </Link>
          </p>
        )}
        {activity && <h1 className="sr-only">{activity.title}</h1>}
        {children}
        {/* S4-011: no activity dead-ends. The books that reference this activity are the
            derived reverse relation; the first one is the next step. */}
        {activity && <ContinueJourney sourceType="activity" sourceId={activity.slug} placement="activity" fromBook={fromBook} />}
      </div>
      {/* Activity pages were the one content type without the signup; the printable
          pack is the natural next step after playing. */}
      {activity && <EmailSignup placement="activity" />}
    </main>
  );
}
