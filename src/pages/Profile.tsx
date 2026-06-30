import { useEffect, useState } from 'react';
import { Link } from '../components/LocalizedLink';
import { BookOpen, BookMarked, CheckCircle2, Star, User, Trash2, NotebookPen, BarChart3 } from 'lucide-react';
import { useBooks, books as rawBooks } from '../data/books';
import { useActivities } from '../data/activities';
import {
  loadProgress,
  clearProgress,
  loadReadingJournal,
  loadReadingTracker,
  type Progress,
  type JournalEntry,
  type ReadingTracker,
} from '../lib/progress';
import Seo from '../components/Seo';
import Pixel from '../components/Pixel';
import { useTranslation, useLanguage } from '../lib/language';

const TRANSLATIONS = {
  en: {
    seoTitle: 'My Profile',
    seoDesc: 'Your reading progress on Story Time with Eva: books read, want-to-read list, and activities completed. Saved locally on this device.',
    heading: 'My Reading Profile',
    blurb: 'Your progress is saved on this device.',
    achievement: 'achievement',
    achievements: 'achievements',
    unlocked: 'unlocked',
    booksReadLabel: 'Books Read',
    wantToReadLabel: 'Want to Read',
    activitiesDoneLabel: 'Activities Done',
    emptyBooksRead: 'No books marked as read yet.',
    emptyWantToRead: 'Nothing on your reading list yet.',
    emptyActivities: 'No activities completed yet.',
    browseCollection: 'Browse the collection',
    tryActivity: 'Try an activity',
    booksReadSection: 'Books Read',
    wantToReadSection: 'Want to Read',
    activitiesSection: 'Completed Activities',
    clearProgress: 'Clear all progress',
    clearConfirm: 'Clear all your reading progress? This cannot be undone.',
    deviceNote: 'Tip: progress is saved to this browser only. Clearing your browser data or using a different device will reset it.',
    statsHeading: 'Your Reading Stats',
    statBooksRead: 'Books Read',
    statActivitiesDone: 'Activities Done',
    statTopTheme: 'Top Theme',
    statTopThemeNone: 'None yet',
    statStreak: 'Keep it up!',
    statStreakLabel: 'Reading Streak',
    statWantToRead: 'On Your Reading List',
    journalSection: 'Reading Journal',
    journalEmpty: 'No journal entries yet. Record a book in the journal to see it here.',
    journalCta: 'Open the reading journal',
    journalFavCharacter: 'Favorite character',
    journalFavScene: 'Favorite scene',
    trackerSection: 'Reading Tracker',
    trackerEmpty: 'No reading sessions logged yet. Log a session in the tracker to see it here.',
    trackerCta: 'Open the reading tracker',
    trackerSessionsLabel: 'Sessions',
    trackerMinsLabel: 'Minutes read',
    trackerStreakLabel: 'Day streak',
    minShort: 'min',
  },
  es: {
    seoTitle: 'Mi perfil',
    seoDesc: 'Tu progreso de lectura en Story Time with Eva — libros leídos, lista por leer y actividades completadas. Se guarda en este dispositivo.',
    heading: 'Mi perfil de lectura',
    blurb: 'Tu progreso se guarda en este dispositivo.',
    achievement: 'logro',
    achievements: 'logros',
    unlocked: 'desbloqueado',
    booksReadLabel: 'Libros leídos',
    wantToReadLabel: 'Por leer',
    activitiesDoneLabel: 'Actividades hechas',
    emptyBooksRead: 'Aún no has marcado libros como leídos.',
    emptyWantToRead: 'Tu lista por leer está vacía.',
    emptyActivities: 'Aún no has completado actividades.',
    browseCollection: 'Ver la colección',
    tryActivity: 'Probar una actividad',
    booksReadSection: 'Libros leídos',
    wantToReadSection: 'Por leer',
    activitiesSection: 'Actividades completadas',
    clearProgress: 'Borrar todo el progreso',
    clearConfirm: '¿Borrar todo tu progreso de lectura? No se puede deshacer.',
    deviceNote: 'Consejo: el progreso se guarda solo en este navegador. Borrar los datos del navegador o usar otro dispositivo lo reiniciará.',
    statsHeading: 'Tus estadísticas de lectura',
    statBooksRead: 'Libros leídos',
    statActivitiesDone: 'Actividades hechas',
    statTopTheme: 'Tema favorito',
    statTopThemeNone: 'Ninguno aún',
    statStreak: 'Sigue así',
    statStreakLabel: 'Racha de lectura',
    statWantToRead: 'En tu lista de lectura',
    journalSection: 'Diario de lectura',
    journalEmpty: 'Aún no hay entradas. Registra un libro en el diario para verlo aquí.',
    journalCta: 'Abrir el diario de lectura',
    journalFavCharacter: 'Personaje favorito',
    journalFavScene: 'Escena favorita',
    trackerSection: 'Registro de lectura',
    trackerEmpty: 'Aún no hay sesiones registradas. Registra una sesión para verla aquí.',
    trackerCta: 'Abrir el registro de lectura',
    trackerSessionsLabel: 'Sesiones',
    trackerMinsLabel: 'Minutos leídos',
    trackerStreakLabel: 'Días seguidos',
    minShort: 'min',
  },
  fr: {
    seoTitle: 'Mon profil',
    seoDesc: 'Votre progression de lecture sur Story Time with Eva — livres lus, liste à lire et activités terminées. Sauvegardé localement sur cet appareil.',
    heading: 'Mon profil de lecture',
    blurb: 'Votre progression est sauvegardée sur cet appareil.',
    achievement: 'succès',
    achievements: 'succès',
    unlocked: 'débloqué',
    booksReadLabel: 'Livres lus',
    wantToReadLabel: 'À lire',
    activitiesDoneLabel: 'Activités faites',
    emptyBooksRead: 'Aucun livre marqué comme lu pour l\'instant.',
    emptyWantToRead: 'Rien sur votre liste à lire pour l\'instant.',
    emptyActivities: 'Aucune activité terminée pour l\'instant.',
    browseCollection: 'Voir la collection',
    tryActivity: 'Essayer une activité',
    booksReadSection: 'Livres lus',
    wantToReadSection: 'À lire',
    activitiesSection: 'Activités terminées',
    clearProgress: 'Tout effacer',
    clearConfirm: 'Effacer toute votre progression de lecture ? Cette action est définitive.',
    deviceNote: 'Astuce : la progression est sauvegardée uniquement dans ce navigateur. Vider les données du navigateur ou utiliser un autre appareil la réinitialise.',
    statsHeading: 'Vos statistiques de lecture',
    statBooksRead: 'Livres lus',
    statActivitiesDone: 'Activités faites',
    statTopTheme: 'Thème préféré',
    statTopThemeNone: 'Aucun pour l\'instant',
    statStreak: 'Continuez comme ça',
    statStreakLabel: 'Série de lecture',
    statWantToRead: 'Sur votre liste de lecture',
    journalSection: 'Journal de lecture',
    journalEmpty: 'Aucune entrée pour l\'instant. Enregistrez un livre dans le journal pour le voir ici.',
    journalCta: 'Ouvrir le journal de lecture',
    journalFavCharacter: 'Personnage préféré',
    journalFavScene: 'Scène préférée',
    trackerSection: 'Suivi de lecture',
    trackerEmpty: 'Aucune séance enregistrée pour l\'instant. Enregistrez une séance dans le suivi pour la voir ici.',
    trackerCta: 'Ouvrir le suivi de lecture',
    trackerSessionsLabel: 'Séances',
    trackerMinsLabel: 'Minutes lues',
    trackerStreakLabel: 'Jours d\'affilée',
    minShort: 'min',
  },
};

interface StatCardProps {
  icon: typeof BookOpen;
  count: number;
  label: string;
  color: string;
  bgColor: string;
}

function StatCard({ icon: Icon, count, label, color, bgColor }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl p-6 flex flex-col items-center text-center shadow-sm`}>
      <Icon className={`w-10 h-10 ${color} mb-3`} />
      <div className={`text-4xl font-bold ${color} mb-1`}>{count}</div>
      <div className="text-gray-600 font-medium text-sm">{label}</div>
    </div>
  );
}

type ProgressItem = {
  id: string;
  title: string;
  thumb: string;
  thumbType: 'emoji' | 'image';
};

interface ItemListProps {
  items: ProgressItem[];
  emptyMsg: string;
  emptyCta?: { label: string; to: string };
}

function ItemList({ items, emptyMsg, emptyCta }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="py-6 text-center">
        <Pixel mood="sleepy" size={88} className="block mx-auto mb-2" />
        <p className="text-gray-500 text-sm mb-3">{emptyMsg}</p>
        {emptyCta && (
          <Link to={emptyCta.to} className="text-sm font-semibold text-purple-600 hover:text-purple-800">
            {emptyCta.label} →
          </Link>
        )}
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          {item.thumbType === 'image' ? (
            <img
              src={item.thumb}
              alt=""
              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
              loading="lazy"
            />
          ) : (
            <span className="text-2xl flex-shrink-0" aria-hidden>
              {item.thumb}
            </span>
          )}
          <span className="text-gray-800 font-medium text-sm">{item.title}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Profile() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [journal, setJournal] = useState<JournalEntry[]>(() => loadReadingJournal());
  const [tracker, setTracker] = useState<ReadingTracker | null>(() => loadReadingTracker());
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const activities = useActivities();
  const books = useBooks();

  useEffect(() => {
    const sync = () => {
      setProgress(loadProgress());
      setJournal(loadReadingJournal());
      setTracker(loadReadingTracker());
    };
    window.addEventListener('progresschange', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('progresschange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const dateLocale = ({ en: 'en-US', es: 'es-ES', fr: 'fr-FR' } as const)[language] ?? 'en-US';
  const fmtDate = (value: string): string => {
    if (!value) return '';
    // Date-only strings ("YYYY-MM-DD", from the journal) parse as UTC midnight,
    // which renders as the previous day in negative-offset timezones. Parse those
    // as local. ISO timestamps (from the tracker) are left to the Date ctor.
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    const d = dateOnly
      ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
      : new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const starRating = (n: number): string => {
    const clamped = Math.max(0, Math.min(5, Math.round(n)));
    return '★'.repeat(clamped) + '☆'.repeat(5 - clamped);
  };

  const trackerSessions = tracker?.log ?? [];

  const booksRead: ProgressItem[] = progress.booksRead
    .map((id) => books.find((b) => b.id === id))
    .filter((b): b is (typeof books)[number] => Boolean(b))
    .map((b) => ({ id: b.id, thumb: b.coverImage, thumbType: 'image', title: b.title }));

  const booksWantToRead: ProgressItem[] = progress.booksWantToRead
    .map((id) => books.find((b) => b.id === id))
    .filter((b): b is (typeof books)[number] => Boolean(b))
    .map((b) => ({ id: b.id, thumb: b.coverImage, thumbType: 'image', title: b.title }));

  const activitiesDone: ProgressItem[] = progress.activitiesCompleted
    .map((slug) => activities.find((a) => a.slug === slug))
    .filter((a): a is (typeof activities)[number] => Boolean(a))
    .map((a) => ({ id: a.slug, thumb: a.emoji, thumbType: 'emoji', title: a.title }));

  const totalAchievements = booksRead.length + activitiesDone.length;

  // Compute the most-read theme across books the user has marked as read.
  const topTheme: string = (() => {
    if (progress.booksRead.length === 0) return '';
    const tally: Record<string, number> = {};
    for (const id of progress.booksRead) {
      const raw = rawBooks.find((b) => b.id === id);
      if (!raw) continue;
      const theme = raw.theme[language] ?? raw.theme.en;
      tally[theme] = (tally[theme] ?? 0) + 1;
    }
    const entries = Object.entries(tally);
    if (entries.length === 0) return '';
    return entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  })();

  const hasAnyProgress =
    progress.booksRead.length +
      progress.booksWantToRead.length +
      progress.activitiesCompleted.length +
      journal.length +
      trackerSessions.length >
    0;

  const handleClear = () => {
    if (window.confirm(t.clearConfirm)) {
      clearProgress();
      setProgress(loadProgress());
      setJournal(loadReadingJournal());
      setTracker(loadReadingTracker());
    }
  };

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/profile" noindex />
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white flex-shrink-0">
              <User className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{t.heading}</h1>
              <p className="text-gray-500 text-sm">{t.blurb}</p>
              <div className="mt-2 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-600 font-medium">
                  {totalAchievements} {totalAchievements === 1 ? t.achievement : t.achievements} {t.unlocked}
                </span>
              </div>
            </div>
          </div>

          {/* ---- Reading Stats summary ---- */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t.statsHeading}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl mb-1">📚</div>
                <div className="text-2xl font-bold text-purple-700">
                  {progress.booksRead.length} / {rawBooks.length}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{t.statBooksRead}</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl mb-1">🎯</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {progress.activitiesCompleted.length} / {activities.length}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{t.statActivitiesDone}</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl mb-1">🔖</div>
                <div className="text-2xl font-bold text-blue-700">{progress.booksWantToRead.length}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{t.statWantToRead}</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm sm:col-span-2">
                <div className="text-3xl mb-1">🌟</div>
                <div className="text-base font-bold text-pink-700 leading-snug">
                  {topTheme || t.statTopThemeNone}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{t.statTopTheme}</div>
              </div>

              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-base font-bold text-orange-600 leading-snug">{t.statStreak}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{t.statStreakLabel}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            <StatCard
              icon={CheckCircle2}
              count={booksRead.length}
              label={t.booksReadLabel}
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <StatCard
              icon={BookMarked}
              count={booksWantToRead.length}
              label={t.wantToReadLabel}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard
              icon={Star}
              count={activitiesDone.length}
              label={t.activitiesDoneLabel}
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> {t.booksReadSection}
              </h2>
              <ItemList
                items={booksRead}
                emptyMsg={t.emptyBooksRead}
                emptyCta={{ label: t.browseCollection, to: '/books' }}
              />
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-blue-500" /> {t.wantToReadSection}
              </h2>
              <ItemList
                items={booksWantToRead}
                emptyMsg={t.emptyWantToRead}
                emptyCta={{ label: t.browseCollection, to: '/books' }}
              />
            </div>

            <div className="bg-white rounded-2xl shadow p-6 md:col-span-2">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" /> {t.activitiesSection}
              </h2>
              <ItemList
                items={activitiesDone}
                emptyMsg={t.emptyActivities}
                emptyCta={{ label: t.tryActivity, to: '/activities' }}
              />
            </div>

            {/* ---- Reading Tracker sessions ---- */}
            <div className="bg-white rounded-2xl shadow p-6 md:col-span-2">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-500" /> {t.trackerSection}
              </h2>
              {trackerSessions.length === 0 ? (
                <div className="py-6 text-center">
                  <Pixel mood="sleepy" size={88} className="block mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-3">{t.trackerEmpty}</p>
                  <a
                    href="/games/reading-tracker.html"
                    className="text-sm font-semibold text-purple-600 hover:text-purple-800"
                  >
                    {t.trackerCta} →
                  </a>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-amber-50 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-amber-700">{tracker?.totalBooks ?? trackerSessions.length}</div>
                      <div className="text-xs text-gray-500 font-medium">{t.trackerSessionsLabel}</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-amber-700">{tracker?.totalMins ?? 0}</div>
                      <div className="text-xs text-gray-500 font-medium">{t.trackerMinsLabel}</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-amber-700">{tracker?.streak ?? 0}</div>
                      <div className="text-xs text-gray-500 font-medium">{t.trackerStreakLabel}</div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {trackerSessions.slice(0, 20).map((s, i) => (
                      <li
                        key={`${s.date}-${i}`}
                        className="p-3 bg-white rounded-xl shadow-sm border border-gray-100"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-gray-800 font-semibold text-sm">{s.book}</span>
                          <span className="text-yellow-500 text-sm flex-shrink-0" aria-label={`${s.stars} / 5`}>
                            {starRating(s.stars)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {fmtDate(s.date)} · {s.mins} {t.minShort}
                        </div>
                        {s.note && <p className="text-sm text-gray-600 mt-1 italic">“{s.note}”</p>}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* ---- Reading Journal entries ---- */}
            <div className="bg-white rounded-2xl shadow p-6 md:col-span-2">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <NotebookPen className="w-5 h-5 text-orange-500" /> {t.journalSection}
              </h2>
              {journal.length === 0 ? (
                <div className="py-6 text-center">
                  <Pixel mood="sleepy" size={88} className="block mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-3">{t.journalEmpty}</p>
                  <Link
                    to="/activities/adventure-journal"
                    className="text-sm font-semibold text-purple-600 hover:text-purple-800"
                  >
                    {t.journalCta} →
                  </Link>
                </div>
              ) : (
                <ul className="space-y-2">
                  {[...journal].reverse().map((entry) => (
                    <li
                      key={entry.id}
                      className="p-3 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-800 font-semibold text-sm flex items-center gap-2">
                          <span className="text-lg" aria-hidden>
                            {entry.emoji}
                          </span>
                          {entry.bookTitle}
                        </span>
                        <span className="text-yellow-500 text-sm flex-shrink-0" aria-label={`${entry.rating} / 5`}>
                          {starRating(entry.rating)}
                        </span>
                      </div>
                      {entry.date && <div className="text-xs text-gray-500 mt-0.5">{fmtDate(entry.date)}</div>}
                      {entry.favoriteCharacter && (
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-medium">{t.journalFavCharacter}:</span> {entry.favoriteCharacter}
                        </p>
                      )}
                      {entry.favoriteScene && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          <span className="font-medium">{t.journalFavScene}:</span> {entry.favoriteScene}
                        </p>
                      )}
                      {entry.thoughts && <p className="text-sm text-gray-600 mt-1 italic">“{entry.thoughts}”</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {hasAnyProgress && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t.clearProgress}
              </button>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-gray-500">{t.deviceNote}</p>
        </div>
      </section>
    </main>
  );
}
