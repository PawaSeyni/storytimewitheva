import { useEffect, useState } from 'react';
import { BookMarked, CheckCircle2 } from 'lucide-react';
import { getBookStatus, loadProgress, setBookStatus, type BookStatus } from '../lib/progress';

interface BookStatusButtonProps {
  bookId: string;
  /** Compact variant for use inside a BookCard. Stretches to full width and uses small text. */
  compact?: boolean;
}

export default function BookStatusButton({ bookId, compact = false }: BookStatusButtonProps) {
  const [status, setStatus] = useState<BookStatus>(null);

  useEffect(() => {
    const sync = () => setStatus(getBookStatus(loadProgress(), bookId));
    sync();
    window.addEventListener('progresschange', sync);
    return () => window.removeEventListener('progresschange', sync);
  }, [bookId]);

  const toggle = (next: BookStatus) => {
    const newStatus: BookStatus = status === next ? null : next;
    setBookStatus(bookId, newStatus);
    setStatus(newStatus);
  };

  const readActive = status === 'read';
  const wantActive = status === 'want_to_read';

  const base = compact
    ? 'flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-full transition-all border'
    : 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all border';

  return (
    <div className={compact ? 'flex gap-2 w-full' : 'flex gap-2'}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggle('read');
        }}
        aria-pressed={readActive}
        aria-label={readActive ? 'Mark as not read' : 'Mark as read'}
        className={`${base} ${
          readActive
            ? 'bg-green-500 border-green-500 text-white shadow-sm'
            : 'bg-white border-green-300 text-green-700 hover:bg-green-50'
        }`}
      >
        <CheckCircle2 className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {readActive ? 'Read' : 'Mark Read'}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggle('want_to_read');
        }}
        aria-pressed={wantActive}
        aria-label={wantActive ? 'Remove from want-to-read' : 'Add to want-to-read'}
        className={`${base} ${
          wantActive
            ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
            : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'
        }`}
      >
        <BookMarked className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {wantActive ? 'On List' : 'Want to Read'}
      </button>
    </div>
  );
}
