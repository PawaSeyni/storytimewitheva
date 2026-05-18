import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Download, Clock, ChevronRight, ArrowUp } from "lucide-react";
import ActivityStatusButton from "../components/ActivityStatusButton";
import { createPageUrl } from "@/utils";

const translations = {
  en: {
    title: "Fun Activities with Eva",
    subtitle: "Learning comes alive through play! Download and enjoy these activities.",
    search: "Search activities...",
    noActivities: "No activities found. Try adjusting your filters!",
    quickView: "Try Now",
    download: "Download",
    ages: "Ages",
    duration: "min",
    backToTop: "Back to Top",
    showingResults: "Showing {count} activities",
    difficulty: {
      easy: "Easy",
      medium: "Medium",
      hard: "Advanced"
    },
    filterContext: {
      title: "Activities for ages {ageRange}",
      subtitle: "Perfect for your child's stage",
      showAll: "Show All Ages"
    },
    categories: {
      all: "All Types",
      coloring: "Coloring",
      creative: "Writing",
      games: "Games",
      puzzles: "Puzzles",
      craft: "Crafts",
      worksheet: "Worksheets"
    },
    ageGroups: {
      all: "All Ages",
      "3-5": "3-5 Years",
      "6-8": "6-8 Years",
      "9+": "9+ Years"
    }
  },
  es: {
    title: "Actividades Divertidas con Eva",
    subtitle: "¡El aprendizaje cobra vida a través del juego!",
    search: "Buscar actividades...",
    noActivities: "No se encontraron actividades.",
    quickView: "Probar Ahora",
    download: "Descargar",
    ages: "Edades",
    duration: "min",
    backToTop: "Volver Arriba",
    showingResults: "Mostrando {count} actividades",
    difficulty: {
      easy: "Fácil",
      medium: "Medio",
      hard: "Avanzado"
    },
    filterContext: {
      title: "Actividades para edades {ageRange}",
      subtitle: "Perfecto para tu hijo",
      showAll: "Todas las Edades"
    },
    categories: {
      all: "Todos",
      coloring: "Colorear",
      creative: "Escritura",
      games: "Juegos",
      puzzles: "Puzzles",
      craft: "Manualidades",
      worksheet: "Hojas"
    },
    ageGroups: {
      all: "Todas",
      "3-5": "3-5 Años",
      "6-8": "6-8 Años",
      "9+": "9+ Años"
    }
  },
  fr: {
    title: "Activités Amusantes avec Eva",
    subtitle: "L'apprentissage prend vie par le jeu!",
    search: "Rechercher...",
    noActivities: "Aucune activité trouvée.",
    quickView: "Essayer",
    download: "Télécharger",
    ages: "Âges",
    duration: "min",
    backToTop: "Retour en Haut",
    showingResults: "Affichage de {count} activités",
    difficulty: {
      easy: "Facile",
      medium: "Moyen",
      hard: "Avancé"
    },
    filterContext: {
      title: "Activités pour {ageRange} ans",
      subtitle: "Parfait pour votre enfant",
      showAll: "Tous les Âges"
    },
    categories: {
      all: "Tous",
      coloring: "Coloriage",
      creative: "Écriture",
      games: "Jeux",
      puzzles: "Puzzles",
      craft: "Bricolage",
      worksheet: "Feuilles"
    },
    ageGroups: {
      all: "Tous",
      "3-5": "3-5 Ans",
      "6-8": "6-8 Ans",
      "9+": "9+ Ans"
    }
  }
};

export default function Activities() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const topRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
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
  
  const t = translations[language] || translations.en;
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivities();
    
    const urlParams = new URLSearchParams(window.location.search);
    const ageParam = urlParams.get('age');
    if (ageParam && ['3-5', '6-8', '9+'].includes(ageParam)) {
      setAgeFilter(ageParam);
    }

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      const data = await base44.entities.Activity.list("-created_date");
      setActivities(data || []);
    } catch (error) {
      console.error("Error loading activities:", error);
      if (window.showToast) {
        window.showToast("Failed to load activities. Please refresh.", 'error');
      }
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const searchMatch = 
      activity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const ageMatch = ageFilter === "all" || activity.age_range === ageFilter;
    const typeMatch = typeFilter === "all" || activity.activity_type === typeFilter;
    
    return searchMatch && ageMatch && typeMatch;
  });

  const handleDownload = (activity, e) => {
    e.stopPropagation();
    if (activity.file_url) {
      if (window.showToast) {
        window.showToast("📥 Downloading...", 'info');
      }
      window.open(activity.file_url, '_blank');
    } else {
      if (window.showToast) {
        window.showToast("Download not available", 'error');
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDifficultyLevel = (ageRange) => {
    if (ageRange === "3-5") return { level: t.difficulty.easy, color: "bg-emerald-100 text-emerald-700", icon: "⭐" };
    if (ageRange === "6-8") return { level: t.difficulty.medium, color: "bg-amber-100 text-amber-700", icon: "⭐⭐" };
    return { level: t.difficulty.hard, color: "bg-rose-100 text-rose-700", icon: "⭐⭐⭐" };
  };

  const getEstimatedDuration = (activityType) => {
    const durations = {
      coloring: 15,
      creative: 20,
      games: 10,
      puzzles: 15,
      craft: 30,
      worksheet: 20
    };
    return durations[activityType] || 15;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" ref={topRef}>
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-2 text-xs text-purple-100">
              <li>
                <a 
                  href={createPageUrl("Home")}
                  className="hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <ChevronRight className="w-3 h-3" />
              <li className="text-white font-medium">Activities</li>
            </ol>
          </nav>

          <div className="text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
              {t.title}
            </h1>
            <p className="text-sm md:text-base text-purple-100 max-w-2xl mx-auto drop-shadow">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        <div className="bg-white rounded-xl shadow-xl p-4 mb-6 backdrop-blur-sm bg-white/95">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <Input
              type="search"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-4 text-base rounded-lg border-2 border-gray-200 focus:border-purple-400 transition-colors"
            />
          </div>
        </div>

        {ageFilter !== "all" && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-3 mb-4 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <div>
                <p className="font-bold text-sm">
                  {t.filterContext.title.replace('{ageRange}', t.ageGroups[ageFilter])}
                </p>
                <p className="text-xs text-purple-100">
                  {t.filterContext.subtitle}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setAgeFilter("all");
                navigate(createPageUrl("Activities"));
              }}
              className="bg-white text-purple-700 hover:bg-purple-50 font-semibold rounded-full text-sm px-4 py-2"
            >
              {t.filterContext.showAll}
            </Button>
          </div>
        )}

        <div className="sticky top-16 z-40 bg-white rounded-lg shadow-md p-3 mb-6 backdrop-blur-sm bg-white/95">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Age Group:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(t.ageGroups).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setAgeFilter(value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all transform hover:scale-105 ${
                      ageFilter === value
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Activity Type:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(t.categories).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setTypeFilter(value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all transform hover:scale-105 ${
                      typeFilter === value
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!isLoading && (
            <div className="mt-2 text-center text-xs text-gray-600">
              {t.showingResults.replace('{count}', filteredActivities.length)}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-36" />
                <div className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                  </div>
                  <div className="h-7 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-10 bg-gray-200 rounded-full flex-1" />
                    <div className="h-10 bg-gray-200 rounded-full w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity, index) => {
              const difficulty = getDifficultyLevel(activity.age_range);
              const duration = getEstimatedDuration(activity.activity_type);
              
              return (
                <article 
                  key={activity.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(`${createPageUrl("ActivityDemo")}?id=${activity.id}`)}
                >
                  <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    {index < 2 && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-xs font-bold shadow">
                        {index === 0 ? "✨ New" : "🔥 Popular"}
                      </div>
                    )}
                    <div className="relative z-10 text-5xl transform group-hover:scale-110 transition-transform">
                      {activity.icon_emoji || "🎨"}
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-purple-700 transition-colors">
                      {activity.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {activity.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficulty.color}`}>
                        {difficulty.icon} {difficulty.level}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {duration} {t.duration}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        {t.ages}: {activity.age_range}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`${createPageUrl("ActivityDemo")}?id=${activity.id}`);
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full text-sm py-5 shadow-md"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t.quickView}
                      </Button>
                      {activity.file_url && (
                        <Button
                          onClick={(e) => handleDownload(activity, e)}
                          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-5 shadow-md"
                          title={t.download}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <ActivityStatusButton activity={activity} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 opacity-50">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">{t.noActivities}</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setAgeFilter("all");
                setTypeFilter("all");
              }}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-3"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all z-50 group"
          aria-label={t.backToTop}
        >
          <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
        </button>
      )}
    </div>
  );
}