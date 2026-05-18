import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BookOpen, CheckCircle2, BookMarked, Star, User } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u);
      if (u) {
        const records = await base44.entities.UserProgress.filter({ user_email: u.email });
        setProgress(records);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const booksRead = progress.filter(p => p.item_type === "book" && p.status === "read");
  const booksWantToRead = progress.filter(p => p.item_type === "book" && p.status === "want_to_read");
  const activitiesCompleted = progress.filter(p => p.item_type === "activity" && p.status === "completed");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-bold text-gray-700">Sign in to see your profile</h2>
        <p className="text-gray-500">Track your reading progress and completed activities.</p>
        <button
          onClick={() => base44.auth.redirectToLogin()}
          className="mt-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, count, label, color, bgColor }) => (
    <div className={`${bgColor} rounded-2xl p-6 flex flex-col items-center text-center shadow`}>
      <Icon className={`w-10 h-10 ${color} mb-3`} />
      <div className={`text-4xl font-bold ${color} mb-1`}>{count}</div>
      <div className="text-gray-600 font-medium text-sm">{label}</div>
    </div>
  );

  const ItemList = ({ items, emptyMsg }) => (
    items.length === 0 ? (
      <p className="text-gray-400 text-sm py-4 text-center">{emptyMsg}</p>
    ) : (
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <span className="text-2xl">{item.item_emoji || (item.item_type === "book" ? "📖" : "🎨")}</span>
            <span className="text-gray-800 font-medium text-sm">{item.item_title || "Untitled"}</span>
          </li>
        ))}
      </ul>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.full_name || "Reader"}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <div className="mt-2 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-gray-600 font-medium">
                {booksRead.length + activitiesCompleted.length} achievements unlocked
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={CheckCircle2} count={booksRead.length} label="Books Read" color="text-green-600" bgColor="bg-green-50" />
          <StatCard icon={BookMarked} count={booksWantToRead.length} label="Want to Read" color="text-blue-600" bgColor="bg-blue-50" />
          <StatCard icon={Star} count={activitiesCompleted.length} label="Activities Done" color="text-orange-600" bgColor="bg-orange-50" />
        </div>

        {/* Progress Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> Books Read
            </h2>
            <ItemList items={booksRead} emptyMsg="No books marked as read yet." />
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-blue-500" /> Want to Read
            </h2>
            <ItemList items={booksWantToRead} emptyMsg="No books on your reading list yet." />
          </div>

          <div className="bg-white rounded-2xl shadow p-6 md:col-span-2">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-500" /> Completed Activities
            </h2>
            <ItemList items={activitiesCompleted} emptyMsg="No activities completed yet." />
          </div>
        </div>
      </div>
    </div>
  );
}