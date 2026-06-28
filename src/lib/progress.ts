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
  // The Reading Tracker and Reading Journal games persist under their own keys
  // (see below). "Clear all progress" should wipe those too.
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(READING_TRACKER_KEY);
      localStorage.removeItem(READING_JOURNAL_KEY);
    } catch {
      /* storage unavailable */
    }
  }
  return next;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reading Tracker entries
//
// Owned by the standalone vanilla-JS game at public/games/reading-tracker.html,
// which persists under its own key. We read that key here (read-only) so the
// Profile page can surface logged sessions. The schema below mirrors the shape
// the game writes; keep them in sync.
// ─────────────────────────────────────────────────────────────────────────────

const READING_TRACKER_KEY = 'eva_reading_tracker_v1';

export interface ReadingTrackerSession {
  date: string; // ISO timestamp
  book: string;
  mins: number;
  stars: number;
  note: string;
}

export interface ReadingTracker {
  childName: string;
  totalBooks: number;
  totalMins: number;
  streak: number;
  log: ReadingTrackerSession[];
}

export function loadReadingTracker(): ReadingTracker | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(READING_TRACKER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ReadingTracker>;
    const log = Array.isArray(parsed.log)
      ? parsed.log
          .filter((e): e is ReadingTrackerSession => Boolean(e) && typeof e === 'object')
          .map((e) => ({
            date: typeof e.date === 'string' ? e.date : '',
            book: typeof e.book === 'string' ? e.book : '',
            mins: typeof e.mins === 'number' ? e.mins : 0,
            stars: typeof e.stars === 'number' ? e.stars : 0,
            note: typeof e.note === 'string' ? e.note : '',
          }))
      : [];
    return {
      childName: typeof parsed.childName === 'string' ? parsed.childName : '',
      totalBooks: typeof parsed.totalBooks === 'number' ? parsed.totalBooks : log.length,
      totalMins: typeof parsed.totalMins === 'number' ? parsed.totalMins : 0,
      streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
      log,
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reading Journal entries
//
// Owned by the Adventure Journal demo (src/demos/AdventureJournalDemo.tsx),
// which persists an array under its own key. We read it here (read-only) so the
// Profile page can surface saved entries. Keep this schema in sync with that
// component's Entry type.
// ─────────────────────────────────────────────────────────────────────────────

const READING_JOURNAL_KEY = 'adventureJournal';

export interface JournalEntry {
  id: number;
  bookTitle: string;
  date: string; // YYYY-MM-DD
  rating: number;
  favoriteCharacter: string;
  favoriteScene: string;
  thoughts: string;
  emoji: string;
}

export function loadReadingJournal(): JournalEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(READING_JOURNAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === 'object')
      .map((e) => ({
        id: typeof e.id === 'number' ? e.id : 0,
        bookTitle: typeof e.bookTitle === 'string' ? e.bookTitle : '',
        date: typeof e.date === 'string' ? e.date : '',
        rating: typeof e.rating === 'number' ? e.rating : 0,
        favoriteCharacter: typeof e.favoriteCharacter === 'string' ? e.favoriteCharacter : '',
        favoriteScene: typeof e.favoriteScene === 'string' ? e.favoriteScene : '',
        thoughts: typeof e.thoughts === 'string' ? e.thoughts : '',
        emoji: typeof e.emoji === 'string' ? e.emoji : '📖',
      }));
  } catch {
    return [];
  }
}
