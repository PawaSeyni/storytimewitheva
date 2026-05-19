import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { isActivityCompleted, loadProgress, setActivityCompleted } from '../lib/progress';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: { completed: 'Completed!', markCompleted: 'Mark Completed' },
  es: { completed: '¡Completada!', markCompleted: 'Marcar como completada' },
  fr: { completed: 'Terminée !', markCompleted: 'Marquer comme terminée' },
};

interface ActivityStatusButtonProps {
  slug: string;
}

export default function ActivityStatusButton({ slug }: ActivityStatusButtonProps) {
  const [done, setDone] = useState(false);
  const t = useTranslation(TRANSLATIONS);

  useEffect(() => {
    const sync = () => setDone(isActivityCompleted(loadProgress(), slug));
    sync();
    window.addEventListener('progresschange', sync);
    return () => window.removeEventListener('progresschange', sync);
  }, [slug]);

  const toggle = () => {
    const next = !done;
    setActivityCompleted(slug, next);
    setDone(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={done}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all border-2 ${
        done
          ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
          : 'bg-white border-orange-300 text-orange-700 hover:bg-orange-50'
      }`}
    >
      <CheckCircle2 className="w-4 h-4" />
      {done ? t.completed : t.markCompleted}
    </button>
  );
}
