import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface DemoPageProps {
  children: ReactNode;
}

export default function DemoPage({ children }: DemoPageProps) {
  return (
    <main className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/activities"
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 mb-6 transition-colors"
        >
          ← Back to Activities
        </Link>
        {children}
      </div>
    </main>
  );
}
