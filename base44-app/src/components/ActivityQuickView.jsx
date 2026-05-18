import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Download, 
  Share2,
  Heart,
  X,
  Check
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

const translations = {
  en: {
    preview: "Quick Preview",
    ageRange: "Age Range",
    duration: "Duration",
    difficulty: "Difficulty",
    type: "Activity Type",
    startActivity: "Start Activity",
    download: "Download PDF",
    share: "Share",
    addFavorite: "Add to Favorites",
    removeFavorite: "Remove from Favorites",
    easy: "Easy",
    medium: "Medium",
    hard: "Advanced",
    minutes: "minutes",
    shared: "Link copied to clipboard!",
    types: {
      coloring: "Coloring",
      creative: "Creative Writing",
      games: "Games",
      puzzles: "Puzzles",
      craft: "Crafts",
      worksheet: "Worksheets"
    }
  },
  es: {
    preview: "Vista Rápida",
    ageRange: "Rango de Edad",
    duration: "Duración",
    difficulty: "Dificultad",
    type: "Tipo de Actividad",
    startActivity: "Iniciar Actividad",
    download: "Descargar PDF",
    share: "Compartir",
    addFavorite: "Agregar a Favoritos",
    removeFavorite: "Eliminar de Favoritos",
    easy: "Fácil",
    medium: "Medio",
    hard: "Avanzado",
    minutes: "minutos",
    shared: "¡Enlace copiado al portapapeles!",
    types: {
      coloring: "Colorear",
      creative: "Escritura Creativa",
      games: "Juegos",
      puzzles: "Rompecabezas",
      craft: "Manualidades",
      worksheet: "Hojas de Trabajo"
    }
  },
  fr: {
    preview: "Aperçu Rapide",
    ageRange: "Tranche d'Âge",
    duration: "Durée",
    difficulty: "Difficulté",
    type: "Type d'Activité",
    startActivity: "Démarrer l'Activité",
    download: "Télécharger PDF",
    share: "Partager",
    addFavorite: "Ajouter aux Favoris",
    removeFavorite: "Retirer des Favoris",
    easy: "Facile",
    medium: "Moyen",
    hard: "Avancé",
    minutes: "minutes",
    shared: "Lien copié dans le presse-papiers!",
    types: {
      coloring: "Coloriage",
      creative: "Écriture Créative",
      games: "Jeux",
      puzzles: "Puzzles",
      craft: "Bricolage",
      worksheet: "Feuilles de Travail"
    }
  }
};

export default function ActivityQuickView({ 
  activity, 
  isOpen, 
  onClose, 
  language = 'en',
  isFavorite = false,
  onToggleFavorite
}) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  if (!activity) return null;

  const getDifficulty = (ageRange) => {
    if (ageRange === "3-5") return { level: t.easy, color: "bg-green-100 text-green-800" };
    if (ageRange === "6-8") return { level: t.medium, color: "bg-yellow-100 text-yellow-800" };
    return { level: t.hard, color: "bg-orange-100 text-orange-800" };
  };

  const getDuration = (type) => {
    const durations = {
      coloring: 15,
      creative: 20,
      games: 10,
      puzzles: 15,
      craft: 30,
      worksheet: 20
    };
    return durations[type] || 15;
  };

  const difficulty = getDifficulty(activity.age_range);
  const duration = getDuration(activity.activity_type);

  const handleStartActivity = () => {
    onClose();
    navigate(`${createPageUrl("ActivityDemo")}?id=${activity.id}`);
  };

  const handleDownload = () => {
    if (activity.file_url) {
      window.open(activity.file_url, '_blank');
      if (window.showToast) {
        window.showToast("Download started! ✓", 'success');
      }
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${createPageUrl("ActivityDemo")}?id=${activity.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: activity.title,
          text: activity.description,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 2000);
        if (window.showToast) {
          window.showToast(t.shared, 'success');
        }
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header Image Section */}
        <div className="relative bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-12 text-center">
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={onToggleFavorite}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors group"
          >
            <Heart 
              className={`w-5 h-5 transition-all ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-white group-hover:scale-110'
              }`}
            />
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 text-8xl mb-4"
          >
            {activity.icon_emoji || "🎨"}
          </motion.div>

          <DialogTitle className="relative z-10 text-3xl md:text-4xl font-bold text-white mb-2">
            {activity.title}
          </DialogTitle>

          <Badge className="relative z-10 bg-white/20 text-white border-0 text-sm backdrop-blur-sm">
            {t.types[activity.activity_type] || activity.activity_type}
          </Badge>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Description */}
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {activity.description}
          </p>

          {/* Activity Details Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">👶</div>
              <div className="text-sm font-semibold text-gray-600 mb-1">{t.ageRange}</div>
              <div className="text-lg font-bold text-purple-700">{activity.age_range}</div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-sm font-semibold text-gray-600 mb-1">{t.duration}</div>
              <div className="text-lg font-bold text-blue-700">{duration} {t.minutes}</div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-sm font-semibold text-gray-600 mb-1">{t.difficulty}</div>
              <div className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${difficulty.color}`}>
                {difficulty.level}
              </div>
            </div>
          </div>

          {/* What You'll Need Section (if applicable) */}
          {activity.activity_type === 'craft' && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">📝</span>
                What You'll Need
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Paper and coloring materials
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Scissors and glue (with adult supervision)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Creativity and imagination!
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleStartActivity}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg rounded-xl shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {t.startActivity}
            </Button>

            {activity.file_url && (
              <Button
                onClick={handleDownload}
                variant="outline"
                className="sm:w-auto border-2 border-purple-400 text-purple-600 hover:bg-purple-50 font-semibold py-6 rounded-xl"
              >
                <Download className="w-5 h-5 sm:mr-0 md:mr-2" />
                <span className="hidden md:inline">{t.download}</span>
              </Button>
            )}

            <Button
              onClick={handleShare}
              variant="outline"
              className="sm:w-auto border-2 border-blue-400 text-blue-600 hover:bg-blue-50 font-semibold py-6 rounded-xl relative"
            >
              <Share2 className="w-5 h-5 sm:mr-0 md:mr-2" />
              <span className="hidden md:inline">{t.share}</span>
              
              <AnimatePresence>
                {showShareSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
                  >
                    ✓ Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Parent Tip
            </h4>
            <p className="text-blue-800 leading-relaxed">
              Encourage your child to explore and express themselves freely. There's no "wrong" way to be creative! 
              Ask open-ended questions about their work to boost critical thinking.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}