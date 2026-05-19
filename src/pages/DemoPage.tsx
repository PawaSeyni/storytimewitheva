import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ActivityStatusButton from '../components/ActivityStatusButton';
import { getActivityBySlug } from '../data/activities';

interface DemoPageProps {
  children: ReactNode;
}

export default function DemoPage({ children }: DemoPageProps) {
  const { pathname } = useLocation();
  // pathname like "/activities/story-builder"
  const slug = pathname.split('/').filter(Boolean).pop() ?? '';
  const activity = getActivityBySlug(slug);

  return (
    <main className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            ← Back to Activities
          </Link>
          {activity && <ActivityStatusButton slug={activity.slug} />}
        </div>
        {children}
      </div>
    </main>
  );
}
