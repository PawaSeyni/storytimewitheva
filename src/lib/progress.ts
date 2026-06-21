// localStorage-backed reading and activity progress.
// No backend, no auth — progress lives on the current device only.

export type BookStatus = 'read' | 'want_to_read' | null;

export interface Progress {
  booksRead: string[]; // Book.id values
  booksWantToRead: string[]; // Book.id values
  activitiesCompleted: string[]; // activity slugs (e.g. "story-builder")
}

const STORAGE_KEY = 'readingProgress';

const empty = (): Progress => ({
  booksRead: [],
  booksWantToRead: [],
  activitiesCompleted: [],
});

export function loadProgress(): Progress {
  if (typeof window === 'undefined') return empty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      booksRead: Array.isArray(parsed.booksRead) ? parsed.booksRead : [],
      booksWantToRead: Array.isArray(parsed.booksWantToRead) ? parsed.booksWantToRead : [],
      activitiesCompleted: Array.isArray(parsed.activitiesCompleted) ? parsed.activitiesCompleted : [],
    };
  } catch {
    return empty();
  }
}

export function saveProgress(next: Progress): void {
  if (typeof window === 'undefined') return;
  // Persisting can throw (Safari Private Mode rejects any setItem; quota). Don't
  // let that escape the click handlers that call this (book/activity status
  // toggles, Profile clear). Still fire the event so in-memory listeners refresh.
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — progress just won't persist this session */
  }
  // Custom event so any component listening can refresh without polling.
  window.dispatchEvent(new CustomEvent('progresschange'));
}

export function getBookStatus(progress: Progress, bookId: string): BookStatus {
  if (progress.booksRead.includes(bookId)) return 'read';
  if (progress.booksWantToRead.includes(bookId)) return 'want_to_read';
  return null;
}

export function setBookStatus(bookId: string, status: BookStatus): Progress {
  const current = loadProgress();
  const next: Progress = {
    booksRead: current.booksRead.filter((id) => id !== bookId),
    booksWantToRead: current.booksWantToRead.filter((id) => id !== bookId),
    activitiesCompleted: current.activitiesCompleted,
  };
  if (status === 'read') next.booksRead.push(bookId);
  if (status === 'want_to_read') next.booksWantToRead.push(bookId);
  saveProgress(next);
  return next;
}

export function isActivityCompleted(progress: Progress, slug: string): boolean {
  return progress.activitiesCompleted.includes(slug);
}

export function setActivityCompleted(slug: string, completed: boolean): Progress {
  const current = loadProgress();
  const next: Progress = {
    ...current,
    activitiesCompleted: completed
      ? Array.from(new Set([...current.activitiesCompleted, slug]))
      : current.activitiesCompleted.filter((s) => s !== slug),
  };
  saveProgress(next);
  return next;
}

export function clearProgress(): Progress {
  const next = empty();
  saveProgress(next);
  return next;
}
