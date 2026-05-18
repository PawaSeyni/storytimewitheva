import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, BookOpen, Palette, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function RecommendationEngine({ language = "en" }) {
  const [recommendations, setRecommendations] = useState({ books: [], activities: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setUser(currentUser);

      // Fetch all books, activities, and user progress in parallel
      const [allBooks, allActivities, progress] = await Promise.all([
        base44.entities.Book.list("-created_date"),
        base44.entities.Activity.list("-created_date"),
        base44.entities.UserProgress.filter({ user_email: currentUser.email }),
      ]);

      // IDs the user has already interacted with
      const readBookIds = new Set(
        progress.filter((p) => p.item_type === "book" && p.status === "read").map((p) => p.item_id)
      );
      const wantToReadIds = new Set(
        progress.filter((p) => p.item_type === "book" && p.status === "want_to_read").map((p) => p.item_id)
      );
      const completedActivityIds = new Set(
        progress.filter((p) => p.item_type === "activity" && p.status === "completed").map((p) => p.item_id)
      );

      const seenBookIds = new Set([...readBookIds, ...wantToReadIds]);
      const seenActivityIds = completedActivityIds;

      // Collect age ranges from read books to infer interest
      const readAgeRanges = allBooks
        .filter((b) => readBookIds.has(b.id))
        .map((b) => b.age_range)
        .filter(Boolean);

      // Score books: prefer unseen ones with matching age ranges
      const scoredBooks = allBooks
        .filter((b) => !seenBookIds.has(b.id))
        .map((b) => ({
          ...b,
          score: readAgeRanges.includes(b.age_range) ? 2 : 1,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      // Score activities: prefer unseen ones matching completed activity types
      const completedTypes = allActivities
        .filter((a) => completedActivityIds.has(a.id))
        .map((a) => a.activity_type)
        .filter(Boolean);

      const scoredActivities = allActivities
        .filter((a) => !seenActivityIds.has(a.id))
        .map((a) => ({
          ...a,
          score: completedTypes.includes(a.activity_type) ? 2 : 1,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setRecommendations({ books: scoredBooks, activities: scoredActivities });
    } catch (err) {
      console.error("Recommendation engine error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not logged in or nothing to recommend
  if (!loading && !user) return null;
  if (!loading && recommendations.books.length === 0 && recommendations.activities.length === 0) return null;

  const title = language === "es" ? "Recomendado para Ti" : language === "fr" ? "Recommandé pour Toi" : "Recommended for You";
  const subtitle = language === "es"
    ? "Basado en tu historial de lectura y actividades"
    : language === "fr"
    ? "Basé sur ton historique de lecture et d'activités"
    : "Based on your reading history and completed activities";

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-md">
            <Sparkles className="w-4 h-4" />
            {language === "es" ? "Solo para Ti" : language === "fr" ? "Juste pour Toi" : "Just for You"}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">{subtitle}</p>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-4 rounded-full" />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Recommended Books */}
            {recommendations.books.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  <h3 className="text-xl font-bold text-gray-800">
                    {language === "es" ? "Libros que te Encantarán" : language === "fr" ? "Livres que tu Adoreras" : "Books You'll Love"}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendations.books.map((book, i) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center gap-4 p-4"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl flex-shrink-0">
                        {book.cover_emoji || "📚"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-purple-500 font-semibold mb-1">{book.age_range}</p>
                        <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{book.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{book.theme}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Link to={createPageUrl("Books")}>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800 font-semibold">
                      {language === "es" ? "Ver todos los libros" : language === "fr" ? "Voir tous les livres" : "Browse all books"}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Recommended Activities */}
            {recommendations.activities.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Palette className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-bold text-gray-800">
                    {language === "es" ? "Actividades para Ti" : language === "fr" ? "Activités pour Toi" : "Activities to Try Next"}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendations.activities.map((activity, i) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center gap-4 p-4"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-3xl flex-shrink-0">
                        {activity.icon_emoji || "🎨"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-orange-500 font-semibold mb-1">{activity.activity_type}</p>
                        <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{activity.title}</p>
                        <p className="text-xs text-gray-500 mt-1">Ages {activity.age_range}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Link to={createPageUrl("Activities")}>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-800 font-semibold">
                      {language === "es" ? "Ver todas las actividades" : language === "fr" ? "Voir toutes les activités" : "Browse all activities"}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}