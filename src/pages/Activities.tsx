import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import EmailSignup from '../components/EmailSignup';
import { activities } from '../data/activities';
import { isActivityCompleted, loadProgress, type Progress } from '../lib/progress';

export default function Activities() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

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
      {/* Header */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Fun Activities with Eva</h1>
          <p className="text-gray-500 text-lg">Learning comes alive through play!</p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => {
              const done = isActivityCompleted(progress, act.slug);
              return (
                <div
                  key={act.slug}
                  className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-50 flex flex-col"
                >
                  <span
                    className={`absolute top-4 right-4 z-10 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                      done ? 'bg-orange-500 text-white' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {done ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </>
                    ) : (
                      'Live'
                    )}
                  </span>
                  <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-5xl block mb-4">{act.emoji}</span>
                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full mb-3 inline-block self-start">
                      {act.category}
                    </span>
                    <h3 className="font-bold text-gray-800 text-xl mb-2">{act.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{act.desc}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-500">
                        Ages: <strong>{act.ages}</strong>
                      </span>
                      <Link
                        to={`/activities/${act.slug}`}
                        className="text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-1.5 rounded-full shadow-sm transition-all"
                      >
                        {done ? 'Open Again →' : 'Try Now →'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
