import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const translations = {
  en: {
    title: "Find Perfect Content for Your Child",
    subtitle: "Select age to see books and activities designed for their developmental stage",
    selectAge: "Select Age Range:",
    allAges: "All Ages",
    searchBooks: "Find Books",
    searchActivities: "Find Activities",
    ageGroups: {
      "3-5": {
        label: "3-5 Years",
        emoji: "🧸",
        description: "Early learners - Simple stories, basic concepts, colorful illustrations"
      },
      "6-8": {
        label: "6-8 Years",
        emoji: "📚",
        description: "Growing readers - Chapter books, creative activities, problem-solving"
      },
      "9+": {
        label: "9+ Years",
        emoji: "🎓",
        description: "Independent readers - Complex narratives, advanced activities, critical thinking"
      }
    }
  },
  es: {
    title: "Encuentra Contenido Perfecto para tu Hijo",
    subtitle: "Selecciona la edad para ver libros y actividades diseñadas para su etapa de desarrollo",
    selectAge: "Seleccionar Rango de Edad:",
    allAges: "Todas las Edades",
    searchBooks: "Buscar Libros",
    searchActivities: "Buscar Actividades",
    ageGroups: {
      "3-5": {
        label: "3-5 Años",
        emoji: "🧸",
        description: "Primeros aprendices - Historias simples, conceptos básicos, ilustraciones coloridas"
      },
      "6-8": {
        label: "6-8 Años",
        emoji: "📚",
        description: "Lectores en crecimiento - Libros por capítulos, actividades creativas, resolución de problemas"
      },
      "9+": {
        label: "9+ Años",
        emoji: "🎓",
        description: "Lectores independientes - Narrativas complejas, actividades avanzadas, pensamiento crítico"
      }
    }
  },
  fr: {
    title: "Trouvez le Contenu Parfait pour Votre Enfant",
    subtitle: "Sélectionnez l'âge pour voir des livres et activités conçus pour leur stade de développement",
    selectAge: "Sélectionner la Tranche d'Âge:",
    allAges: "Tous les Âges",
    searchBooks: "Trouver des Livres",
    searchActivities: "Trouver des Activités",
    ageGroups: {
      "3-5": {
        label: "3-5 Ans",
        emoji: "🧸",
        description: "Premiers apprenants - Histoires simples, concepts de base, illustrations colorées"
      },
      "6-8": {
        label: "6-8 Ans",
        emoji: "📚",
        description: "Lecteurs en croissance - Livres à chapitres, activités créatives, résolution de problèmes"
      },
      "9+": {
        label: "9+ Ans",
        emoji: "🎓",
        description: "Lecteurs indépendants - Récits complexes, activités avancées, pensée critique"
      }
    }
  }
};

export default function AgeSelector({ language = 'en' }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;
  const [selectedAge, setSelectedAge] = useState('');

  const ageOptions = ['3-5', '6-8', '9+'];

  const handleSearch = (type) => {
    if (!selectedAge) {
      if (window.showToast) {
        window.showToast("Please select an age range first", 'info');
      }
      return;
    }

    const url = type === 'books' 
      ? `${createPageUrl("Books")}?age=${selectedAge}`
      : `${createPageUrl("Activities")}?age=${selectedAge}`;
    
    navigate(url);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </motion.div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <label className="block text-lg font-bold text-purple-700 mb-6 text-center">
            {t.selectAge}
          </label>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {ageOptions.map((age, index) => {
              const ageInfo = t.ageGroups[age];
              return (
                <motion.button
                  key={age}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedAge(age)}
                  className={`p-6 rounded-xl border-3 transition-all duration-300 text-left ${
                    selectedAge === age
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-5xl mb-3">{ageInfo.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {ageInfo.label}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {ageInfo.description}
                  </p>
                  {selectedAge === age && (
                    <div className="mt-3 flex items-center gap-2 text-purple-600 font-semibold">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">Selected</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleSearch('books')}
              disabled={!selectedAge}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-6 px-8 rounded-full text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
            >
              📚 {t.searchBooks}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => handleSearch('activities')}
              disabled={!selectedAge}
              className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-6 px-8 rounded-full text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
            >
              🎨 {t.searchActivities}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}