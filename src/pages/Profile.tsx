import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BookMarked, CheckCircle2, Star, User, Trash2 } from 'lucide-react';
import { books } from '../data/books';
import { activities } from '../data/activities';
import { loadProgress, clearProgress, type Progress } from '../lib/progress';
import Seo from '../components/Seo';

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
  /** Either an emoji string (for activities) or an image URL (for books). */
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
        <p className="text-gray-400 text-sm mb-3">{emptyMsg}</p>
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

  useEffect(() => {
    const sync = () => setProgress(loadProgress());
    window.addEventListener('progresschange', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('progresschange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

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
  const hasAnyProgress =
    progress.booksRead.length + progress.booksWantToRead.length + progress.activitiesCompleted.length > 0;

  const handleClear = () => {
    if (window.confirm('Clear all your reading progress? This cannot be undone.')) {
      clearProgress();
      setProgress(loadProgress());
    }
  };

  return (
    <main>
      <Seo
        title="My Profile"
        description="Your reading progress on Story Time with Eva — books read, want-to-read list, and activities completed. Saved locally on this device."
        path="/profile"
        noindex
      />
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white flex-shrink-0">
              <User className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">My Reading Profile</h1>
              <p className="text-gray-500 text-sm">Your progress is saved on this device.</p>
              <div className="mt-2 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-600 font-medium">
                  {totalAchievements} achievement{totalAchievements === 1 ? '' : 's'} unlocked
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            <StatCard
              icon={CheckCircle2}
              count={booksRead.length}
              label="Books Read"
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <StatCard
              icon={BookMarked}
              count={booksWantToRead.length}
              label="Want to Read"
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard
              icon={Star}
              count={activitiesDone.length}
              label="Activities Done"
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Books Read
              </h2>
              <ItemList
                items={booksRead}
                emptyMsg="No books marked as read yet."
                emptyCta={{ label: 'Browse the collection', to: '/books' }}
              />
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-blue-500" /> Want to Read
              </h2>
              <ItemList
                items={booksWantToRead}
                emptyMsg="Nothing on your reading list yet."
                emptyCta={{ label: 'Browse the collection', to: '/books' }}
              />
            </div>

            <div className="bg-white rounded-2xl shadow p-6 md:col-span-2">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" /> Completed Activities
              </h2>
              <ItemList
                items={activitiesDone}
                emptyMsg="No activities completed yet."
                emptyCta={{ label: 'Try an activity', to: '/activities' }}
              />
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
                Clear all progress
              </button>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-gray-400">
            Tip: progress is saved to this browser only. Clearing your browser data or using a different device
            will reset it.
          </p>
        </div>
      </section>
    </main>
  );
}
