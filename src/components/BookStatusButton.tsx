import { useEffect, useState } from 'react';
import { BookMarked, BookOpen, CheckCircle2 } from 'lucide-react';
import {
  loadLibrary,
  getStatus,
  setStatus as persistStatus,
  onLibraryChange,
  type LibraryStatus,
} from '../lib/personalLibrary';
import { useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

// Three states (Sprint 6 S6-001), up from the previous two. Reading status now lives in
// the versioned personalization envelope rather than the legacy `readingProgress` key;
// existing want-to-read / read values are migrated on first read. Activity completion
// stays in the legacy key, because the standalone games own those writes.
const TRANSLATIONS = {
  en: {
    read: 'Read', markRead: 'Mark Read',
    reading: 'Reading', markReading: 'Reading now',
    onList: 'On List', wantToRead: 'Want to Read',
    ariaMarkAsRead: 'Mark as read', ariaMarkAsNotRead: 'Mark as not read',
    ariaMarkAsReading: 'Mark as reading now', ariaMarkAsNotReading: 'Stop marking as reading now',
    ariaAddToWant: 'Add to want-to-read', ariaRemoveFromWant: 'Remove from want-to-read',
  },
  es: {
    read: 'Leído', markRead: 'Marcar leído',
    reading: 'Leyendo', markReading: 'Leyendo ahora',
    onList: 'En lista', wantToRead: 'Quiero leer',
    ariaMarkAsRead: 'Marcar como leído', ariaMarkAsNotRead: 'Marcar como no leído',
    ariaMarkAsReading: 'Marcar como leyendo ahora', ariaMarkAsNotReading: 'Dejar de marcar como leyendo ahora',
    ariaAddToWant: 'Añadir a por leer', ariaRemoveFromWant: 'Quitar de por leer',
  },
  fr: {
    read: 'Lu', markRead: 'Marquer lu',
    reading: 'En cours', markReading: 'Je lis maintenant',
    onList: 'Sur la liste', wantToRead: 'À lire',
    ariaMarkAsRead: 'Marquer comme lu', ariaMarkAsNotRead: 'Marquer comme non lu',
    ariaMarkAsReading: 'Marquer comme en cours de lecture', ariaMarkAsNotReading: 'Ne plus marquer comme en cours',
    ariaAddToWant: 'Ajouter à la liste à lire', ariaRemoveFromWant: 'Retirer de la liste à lire',
  },
};

interface BookStatusButtonProps {
  bookId: string;
  /** Compact variant for use inside a BookCard. Stretches to full width and uses small text. */
  compact?: boolean;
}

export default function BookStatusButton({ bookId, compact = false }: BookStatusButtonProps) {
  const [status, setLocal] = useState<LibraryStatus | null>(null);
  const t = useTranslation(TRANSLATIONS);

  useEffect(() => {
    const sync = () => setLocal(getStatus(loadLibrary(), bookId));
    sync();
    return onLibraryChange(sync);
  }, [bookId]);

  const toggle = (next: LibraryStatus) => {
    const resolved = status === next ? null : next;
    persistStatus(bookId, resolved);
    setLocal(resolved);
    track('Library Status', { book: bookId, status: resolved ?? 'cleared' });
  };

  const base = compact
    ? 'flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-full transition-all border'
    : 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all border';
  const icon = compact ? 'w-3.5 h-3.5' : 'w-4 h-4';

  const buttons: {
    value: LibraryStatus;
    Icon: typeof CheckCircle2;
    on: string;
    off: string;
    ariaOn: string;
    ariaOff: string;
    active: string;
    idle: string;
  }[] = [
    {
      value: 'read', Icon: CheckCircle2, on: t.read, off: t.markRead,
      ariaOn: t.ariaMarkAsNotRead, ariaOff: t.ariaMarkAsRead,
      active: 'bg-green-500 border-green-500 text-white shadow-sm',
      idle: 'bg-white border-green-300 text-green-700 hover:bg-green-50',
    },
    {
      value: 'reading', Icon: BookOpen, on: t.reading, off: t.markReading,
      ariaOn: t.ariaMarkAsNotReading, ariaOff: t.ariaMarkAsReading,
      active: 'bg-amber-500 border-amber-500 text-white shadow-sm',
      idle: 'bg-white border-amber-300 text-amber-700 hover:bg-amber-50',
    },
    {
      value: 'want-to-read', Icon: BookMarked, on: t.onList, off: t.wantToRead,
      ariaOn: t.ariaRemoveFromWant, ariaOff: t.ariaAddToWant,
      active: 'bg-blue-500 border-blue-500 text-white shadow-sm',
      idle: 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50',
    },
  ];

  return (
    <div className={compact ? 'flex gap-1.5 w-full' : 'flex flex-wrap gap-2'}>
      {buttons.map((b) => {
        const active = status === b.value;
        return (
          <button
            key={b.value}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggle(b.value);
            }}
            aria-pressed={active}
            aria-label={active ? b.ariaOn : b.ariaOff}
            className={`${base} ${active ? b.active : b.idle}`}
          >
            <b.Icon className={icon} />
            {active ? b.on : b.off}
          </button>
        );
      })}
    </div>
  );
}
