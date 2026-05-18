/**
 * Performance-Optimized Home Page
 * Target: LCP < 2.5s, FCP < 1.8s, TBT < 200ms
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Book } from "@/entities/Book";
import { Activity } from "@/entities/Activity";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BookOpen, 
  Palette, 
  Sparkles, 
  Star, 
  Users, 
  TrendingUp 
} from "lucide-react";
import { motion } from "framer-motion";
import {
  perfTracker,
  batchEntityRequests,
  debounce
} from "./PerformanceUtils";
import {
  LazyBookCard,
  LazyNewsletterSignup,
  LazyAgeSelector,
  preloadBooks,
  preloadActivities
} from "./LazyComponents";

// Move translations outside component to avoid recreation
const translations = {
  en: {
    hero: {
      title: "Where Stories Come to Life!",
      subtitle: "Discover magical books, fun activities, and reading adventures for curious minds of all ages with Eva",
      cta: "Browse 50+ Magical Books",
      secondary: "Explore Free Activities"
    },
    trustBadge: {
      families: "10,000+",
      familiesText: "Happy Families",
      rating: "4.9/5",
      ratingText: "Parent Rating",
      activities: "100+",
      activitiesText: "Free Activities"
    },
    featured: {
      title: "Featured Books",
      subtitle: "Discover our carefully selected collection of magical stories",
      viewAll: "Browse All Books",
      badge: "Featured"
    },
    activities: {
      title: "Fun Activities with Eva",
      subtitle: "Learning comes alive through play!",
      viewAll: "See All Activities",
      explore: "Try This Activity",
      new: "New",
      popular: "Popular",
      ages: "Ages:"
    },
    howItWorks: {
      title: "How It Works",
      steps: [
        { step: "1", icon: "🔍", title: "Browse", desc: "Explore our collection of books and activities" },
        { step: "2", icon: "✨", title: "Choose", desc: "Pick the perfect story or activity" },
        { step: "3", icon: "🎉", title: "Enjoy!", desc: "Start reading, playing, and learning" }
      ]
    }
  },
  // ... other languages abbreviated for performance
};

// Memoized components to prevent unnecessary re-renders
const HeroSection = React.memo(({ t, onBooksHover, onActivitiesHover }) => (
  <section className="relative bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 text-white py-20 md:py-32 overflow-hidden">
    <div className="absolute inset-0 bg-black/20" />
    
    {/* Reduced decorative elements - only 4 instead of many */}
    <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
      <div className="absolute top-10 left-10 text-6xl">⭐</div>
      <div className="absolute top-20 right-20 text-5xl">🌙</div>
      <div className="absolute bottom-10 left-1/4 text-7xl">✨</div>
      <div className="absolute bottom-20 right-1/3 text-6xl">🎨</div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg"
      >
        {t.hero.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
      >
        {t.hero.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <Link 
          to={createPageUrl("Books")}
          onMouseEnter={onBooksHover}
          onFocus={onBooksHover}
        >
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-2xl font-bold group min-h-[56px]"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t.hero.cta}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link 
          to={createPageUrl("Activities")}
          onMouseEnter={onActivitiesHover}
          onFocus={onActivitiesHover}
        >
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full shadow-2xl font-bold min-h-[56px]"
          >
            <Palette className="w-5 h-5 mr-2" />
            {t.hero.secondary}
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
));

HeroSection.displayName = 'HeroSection';

const TrustBadges = React.memo(({ t }) => (
  <section className="py-12 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
          <Users className="w-12 h-12 mx-auto mb-4 text-purple-600" />
          <div className="text-4xl font-bold text-purple-700 mb-2">{t.trustBadge.families}</div>
          <div className="text-gray-600 font-medium">{t.trustBadge.familiesText}</div>
        </div>

        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50">
          <Star className="w-12 h-12 mx-auto mb-4 text-yellow-600 fill-yellow-600" />
          <div className="text-4xl font-bold text-orange-700 mb-2">{t.trustBadge.rating}</div>
          <div className="text-gray-600 font-medium">{t.trustBadge.ratingText}</div>
          <div className="text-yellow-500 text-xl mt-2">⭐⭐⭐⭐⭐</div>
        </div>

        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <div className="text-4xl font-bold text-blue-700 mb-2">{t.trustBadge.activities}</div>
          <div className="text-gray-600 font-medium">{t.trustBadge.activitiesText}</div>
        </div>
      </div>
    </div>
  </section>
));

TrustBadges.displayName = 'TrustBadges';

export default function OptimizedHome() {
  const [language, setLanguage] = useState('en');
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoize translations to prevent recreation
  const t = useMemo(() => translations[language] || translations.en, [language]);

  useEffect(() => {
    const checkLanguage = () => {
      if (window.currentLanguage) {
        setLanguage(window.currentLanguage);
      }
    };

    checkLanguage();
    window.addEventListener('languagechange', checkLanguage);

    return () => window.removeEventListener('languagechange', checkLanguage);
  }, []);

  // Optimized data loading with batching and caching
  const loadData = useCallback(async () => {
    try {
      perfTracker.mark('home_load_start');
      setLoading(true);

      const results = await batchEntityRequests([
        {
          entity: Book,
          method: 'filter',
          args: [{ featured: true }, "-created_date", 3],
          cacheKey: 'featured_books_homepage'
        },
        {
          entity: Activity,
          method: 'list',
          args: ["-created_date", 3],
          cacheKey: 'recent_activities_homepage'
        }
      ]);

      setFeaturedBooks(results[0].data);
      setActivities(results[1].data);

      perfTracker.measure('home_data_loaded', 'home_load_start');

    } catch (error) {
      console.error('Error loading data:', error);
      if (window.showToast) {
        window.showToast("Failed to load content. Please refresh the page.", 'error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounced prefetch handlers
  const handleBooksHover = useMemo(
    () => debounce(() => {
      preloadBooks();
      batchEntityRequests([
        {
          entity: Book,
          method: 'list',
          args: ["-created_date"],
          cacheKey: 'all_books'
        }
      ]);
    }, 200),
    []
  );

  const handleActivitiesHover = useMemo(
    () => debounce(() => {
      preloadActivities();
      batchEntityRequests([
        {
          entity: Activity,
          method: 'list',
          args: ["-created_date"],
          cacheKey: 'all_activities'
        }
      ]);
    }, 200),
    []
  );

  return (
    <div>
      {/* Hero Section - Critical */}
      <HeroSection 
        t={t} 
        onBooksHover={handleBooksHover}
        onActivitiesHover={handleActivitiesHover}
      />

      {/* Trust Badges - Critical */}
      <TrustBadges t={t} />

      {/* Age Selector - Lazy Load */}
      <React.Suspense fallback={
        <div className="h-96 bg-gray-50 animate-pulse flex items-center justify-center">
          <p className="text-gray-500">Loading age selector...</p>
        </div>
      }>
        <LazyAgeSelector language={language} />
      </React.Suspense>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.howItWorks.title}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.howItWorks.steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="relative text-center p-8 bg-white rounded-2xl shadow-lg"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {item.step}
                </div>
                <div className="text-6xl mb-4 mt-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books - Lazy Load */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.featured.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.featured.subtitle}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-6 rounded-full" />
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredBooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredBooks.map((book) => (
                <div key={book.id} className="relative">
                  <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1 font-bold text-sm">
                    <Star className="w-4 h-4 fill-white" />
                    {t.featured.badge}
                  </div>
                  <React.Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />}>
                    <LazyBookCard book={book} onClick={() => {}} />
                  </React.Suspense>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No featured books yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center">
            <Link 
              to={createPageUrl("Books")}
              onMouseEnter={handleBooksHover}
              onFocus={handleBooksHover}
            >
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-purple-400 text-purple-600 hover:bg-purple-50 font-semibold min-h-[56px]"
              >
                {t.featured.viewAll}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Activities Preview */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.activities.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
              {t.activities.subtitle}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-2 bg-gray-200" />
                  <div className="p-8 space-y-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {index < 2 && (
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-green-400 to-cyan-400 text-white px-3 py-1 rounded-full shadow-md flex items-center gap-1 font-bold text-xs">
                      <Sparkles className="w-3 h-3" />
                      {index === 0 ? t.activities.new : t.activities.popular}
                    </div>
                  )}

                  <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">{activity.icon_emoji || "🎨"}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {activity.description}
                    </p>
                    {activity.age_range && (
                      <p className="text-sm text-gray-500 font-medium mb-6">
                        {t.activities.ages} {activity.age_range}
                      </p>
                    )}
                    <Link to={createPageUrl("Activities")}>
                      <Button
                        className="w-full bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white font-semibold rounded-full shadow-md min-h-[48px]"
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        {t.activities.explore}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Activities coming soon!</p>
            </div>
          )}

          <div className="text-center">
            <Link 
              to={createPageUrl("Activities")}
              onMouseEnter={handleActivitiesHover}
              onFocus={handleActivitiesHover}
            >
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-green-400 text-green-600 hover:bg-green-50 font-semibold min-h-[56px]"
              >
                {t.activities.viewAll}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter - Lazy Load */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <React.Suspense fallback={
            <div className="h-64 bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
              <p className="text-gray-500">Loading newsletter...</p>
            </div>
          }>
            <LazyNewsletterSignup language={language} />
          </React.Suspense>
        </div>
      </section>
    </div>
  );
}