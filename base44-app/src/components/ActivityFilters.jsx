import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const translations = {
  en: {
    filterAge: "Filter by Age:",
    filterType: "Activity Type:",
    allAges: "All Ages",
    allTypes: "All Types",
    coloring: "Coloring",
    creative: "Creative Writing",
    games: "Games",
    puzzles: "Puzzles",
    craft: "Crafts",
    worksheet: "Worksheets"
  },
  es: {
    filterAge: "Filtrar por Edad:",
    filterType: "Tipo de Actividad:",
    allAges: "Todas las Edades",
    allTypes: "Todos los Tipos",
    coloring: "Colorear",
    creative: "Escritura Creativa",
    games: "Juegos",
    puzzles: "Rompecabezas",
    craft: "Manualidades",
    worksheet: "Hojas de Trabajo"
  },
  fr: {
    filterAge: "Filtrer par Âge:",
    filterType: "Type d'Activité:",
    allAges: "Tous les Âges",
    allTypes: "Tous les Types",
    coloring: "Coloriage",
    creative: "Écriture Créative",
    games: "Jeux",
    puzzles: "Puzzles",
    craft: "Bricolage",
    worksheet: "Feuilles de Travail"
  }
};

export default function ActivityFilters({ language, ageFilter, typeFilter, onAgeChange, onTypeChange }) {
  const t = translations[language] || translations.en;

  const ageOptions = [
    { value: "all", label: t.allAges },
    { value: "3-5", label: "3-5 years" },
    { value: "6-8", label: "6-8 years" },
    { value: "9+", label: "9+ years" }
  ];

  const typeOptions = [
    { value: "all", label: t.allTypes },
    { value: "coloring", label: t.coloring },
    { value: "creative", label: t.creative },
    { value: "games", label: t.games },
    { value: "puzzles", label: t.puzzles },
    { value: "craft", label: t.craft },
    { value: "worksheet", label: t.worksheet }
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg p-6 mb-8">
      <div className="space-y-6">
        <div>
          <label className="text-lg font-bold text-purple-700 mb-3 block">
            {t.filterAge}
          </label>
          <div className="flex flex-wrap gap-3">
            {ageOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => onAgeChange(option.value)}
                className={`rounded-full transition-all ${
                  ageFilter === option.value
                    ? "bg-gradient-to-r from-orange-400 to-red-400 text-white"
                    : "bg-gradient-to-r from-purple-400 to-blue-400 text-white hover:from-purple-500 hover:to-blue-500"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-lg font-bold text-purple-700 mb-3 block">
            {t.filterType}
          </label>
          <div className="flex flex-wrap gap-3">
            {typeOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => onTypeChange(option.value)}
                className={`rounded-full transition-all ${
                  typeFilter === option.value
                    ? "bg-gradient-to-r from-orange-400 to-red-400 text-white"
                    : "bg-gradient-to-r from-purple-400 to-blue-400 text-white hover:from-purple-500 hover:to-blue-500"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}