import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Pencil } from "lucide-react";

export default function CharacterWorkshopDemo({ language }) {
  const [selectedType, setSelectedType] = useState("");
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [charName, setCharName] = useState("");
  const [colors, setColors] = useState("");
  const [eyes, setEyes] = useState("");
  const [features, setFeatures] = useState("");
  const [outfit, setOutfit] = useState("");
  const [powers, setPowers] = useState("");
  const [home, setHome] = useState("");
  const [loves, setLoves] = useState("");
  const [fears, setFears] = useState("");
  const [goal, setGoal] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const text = {
    en: {
      title: "Eva's Character Creation Workshop",
      subtitle: "Follow these fun steps to bring your character to life!",
      step1: "Choose Your Character Type",
      step2: "Give Them a Name",
      step3: "Design Their Look",
      step4: "Create Their Personality",
      step5: "Give Them Special Powers",
      step6: "Create Their Story",
      step7: "Draw Your Character!",
      namePlaceholder: "Type your character's name here...",
      colorsLabel: "Colors:",
      colorsPlaceholder: "What colors will they wear?",
      eyesLabel: "Eyes:",
      eyesPlaceholder: "Big? Small? Sparkly?",
      featuresLabel: "Hair/Features:",
      featuresPlaceholder: "Curly hair? Wings? Horns?",
      outfitLabel: "Outfit:",
      outfitPlaceholder: "What do they wear?",
      powersPlaceholder: "What makes your character special?",
      homePlaceholder: "A castle? The forest? Space?",
      lovesPlaceholder: "Adventure? Reading? Helping others?",
      fearsPlaceholder: "Even heroes have fears!",
      goalPlaceholder: "What do they want to achieve?",
      selectTraits: "Pick 3 personality traits!",
      viewSummary: "See My Character Summary!",
      summaryTitle: "Your Amazing Character!",
      drawTip: "Grab some paper and colored pencils to draw your character!",
      tip: "Characters with unique features are easier to remember!"
    },
    es: {
      title: "Taller de Creación de Personajes con Eva",
      subtitle: "¡Sigue estos pasos para dar vida a tu personaje!",
      step1: "Elige Tu Tipo de Personaje",
      step2: "Dale un Nombre",
      step3: "Diseña su Apariencia",
      step4: "Crea su Personalidad",
      step5: "Dale Poderes Especiales",
      step6: "Crea su Historia",
      step7: "¡Dibuja Tu Personaje!",
      namePlaceholder: "Escribe el nombre de tu personaje aquí...",
      colorsLabel: "Colores:",
      colorsPlaceholder: "¿Qué colores usará?",
      eyesLabel: "Ojos:",
      eyesPlaceholder: "¿Grandes? ¿Pequeños? ¿Brillantes?",
      featuresLabel: "Cabello/Características:",
      featuresPlaceholder: "¿Pelo rizado? ¿Alas? ¿Cuernos?",
      outfitLabel: "Vestimenta:",
      outfitPlaceholder: "¿Qué viste?",
      powersPlaceholder: "¿Qué hace especial a tu personaje?",
      homePlaceholder: "¿Un castillo? ¿El bosque? ¿El espacio?",
      lovesPlaceholder: "¿Aventura? ¿Lectura? ¿Ayudar a otros?",
      fearsPlaceholder: "¡Incluso los héroes tienen miedos!",
      goalPlaceholder: "¿Qué quiere lograr?",
      selectTraits: "¡Elige 3 rasgos de personalidad!",
      viewSummary: "¡Ver Resumen de Mi Personaje!",
      summaryTitle: "¡Tu Personaje Increíble!",
      drawTip: "¡Toma papel y lápices de colores para dibujar tu personaje!",
      tip: "¡Los personajes con características únicas son más fáciles de recordar!"
    },
    fr: {
      title: "Atelier de Création de Personnages avec Eva",
      subtitle: "Suivez ces étapes pour donner vie à votre personnage!",
      step1: "Choisissez Votre Type de Personnage",
      step2: "Donnez-leur un Nom",
      step3: "Concevez Leur Apparence",
      step4: "Créez Leur Personnalité",
      step5: "Donnez-leur des Pouvoirs Spéciaux",
      step6: "Créez Leur Histoire",
      step7: "Dessinez Votre Personnage!",
      namePlaceholder: "Tapez le nom de votre personnage ici...",
      colorsLabel: "Couleurs:",
      colorsPlaceholder: "Quelles couleurs porteront-ils?",
      eyesLabel: "Yeux:",
      eyesPlaceholder: "Grands? Petits? Brillants?",
      featuresLabel: "Cheveux/Caractéristiques:",
      featuresPlaceholder: "Cheveux bouclés? Ailes? Cornes?",
      outfitLabel: "Tenue:",
      outfitPlaceholder: "Que portent-ils?",
      powersPlaceholder: "Qu'est-ce qui rend votre personnage spécial?",
      homePlaceholder: "Un château? La forêt? L'espace?",
      lovesPlaceholder: "L'aventure? La lecture? Aider les autres?",
      fearsPlaceholder: "Même les héros ont des peurs!",
      goalPlaceholder: "Que veulent-ils accomplir?",
      selectTraits: "Choisissez 3 traits de personnalité!",
      viewSummary: "Voir le Résumé de Mon Personnage!",
      summaryTitle: "Votre Personnage Incroyable!",
      drawTip: "Prenez du papier et des crayons de couleur pour dessiner votre personnage!",
      tip: "Les personnages avec des caractéristiques uniques sont plus faciles à retenir!"
    }
  };

  const t = text[language] || text.en;

  const types = [
    { icon: "🦸", name: { en: "Hero", es: "Héroe", fr: "Héros" } },
    { icon: "🐉", name: { en: "Creature", es: "Criatura", fr: "Créature" } },
    { icon: "👑", name: { en: "Royalty", es: "Realeza", fr: "Royauté" } },
    { icon: "🧙", name: { en: "Wizard", es: "Mago", fr: "Sorcier" } },
    { icon: "🤖", name: { en: "Robot", es: "Robot", fr: "Robot" } },
    { icon: "🧚", name: { en: "Fairy", es: "Hada", fr: "Fée" } }
  ];

  const traits = [
    { icon: "😊", name: { en: "Friendly", es: "Amigable", fr: "Amical" } },
    { icon: "💪", name: { en: "Brave", es: "Valiente", fr: "Brave" } },
    { icon: "🤓", name: { en: "Smart", es: "Inteligente", fr: "Intelligent" } },
    { icon: "😂", name: { en: "Funny", es: "Gracioso", fr: "Drôle" } },
    { icon: "🤗", name: { en: "Kind", es: "Amable", fr: "Gentil" } },
    { icon: "🎭", name: { en: "Mysterious", es: "Misterioso", fr: "Mystérieux" } },
    { icon: "⚡", name: { en: "Energetic", es: "Enérgico", fr: "Énergique" } },
    { icon: "🌸", name: { en: "Gentle", es: "Gentil", fr: "Doux" } }
  ];

  const toggleTrait = (trait) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(t => t !== trait));
    } else if (selectedTraits.length < 3) {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const handleShowSummary = () => {
    setShowSummary(true);
    setTimeout(() => {
      document.getElementById('summary-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-2xl p-6 md:p-8 max-h-[70vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">{t.title}</h3>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">🎨✨</div>
      </div>

      {/* How to Play */}
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl p-6 mb-6 text-center">
        <h4 className="text-2xl font-bold mb-3">✨ How to Play ✨</h4>
        <ol className="list-decimal list-inside space-y-2 text-lg text-left max-w-2xl mx-auto">
          <li>Follow each step to design your unique character</li>
          <li>Choose their type, give them a name, and design their look</li>
          <li>Pick personality traits and special powers</li>
          <li>Create their backstory and goals</li>
          <li>See your complete character summary at the end!</li>
        </ol>
      </div>

      {/* Step 1: Character Type */}
      <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 mb-6 border-4 border-orange-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">1</div>
          <h4 className="text-2xl font-bold text-gray-800">{t.step1}</h4>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {types.map((type) => (
            <Card
              key={type.icon}
              onClick={() => setSelectedType(type.name[language])}
              className={`p-4 text-center cursor-pointer transition-all hover:scale-105 ${
                selectedType === type.name[language]
                  ? "bg-gradient-to-br from-pink-400 to-red-400 text-white ring-4 ring-pink-300"
                  : "bg-white hover:bg-pink-50"
              }`}
            >
              <div className="text-3xl mb-1">{type.icon}</div>
              <div className="font-medium text-xs">{type.name[language]}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Step 2: Name */}
      <div className="bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl p-6 mb-6 border-4 border-purple-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">2</div>
          <h4 className="text-2xl font-bold text-gray-800">{t.step2}</h4>
        </div>
        <Input
          value={charName}
          onChange={(e) => setCharName(e.target.value)}
          placeholder={t.namePlaceholder}
          className="text-lg border-2 border-purple-400 focus:border-purple-600"
        />
      </div>

      {/* Step 3: Appearance */}
      <div className="bg-gradient-to-r from-green-200 to-cyan-200 rounded-2xl p-6 mb-6 border-4 border-cyan-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">3</div>
          <h4 className="text-2xl font-bold text-gray-800">{t.step3}</h4>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t.colorsLabel}</label>
            <Input value={colors} onChange={(e) => setColors(e.target.value)} placeholder={t.colorsPlaceholder} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t.eyesLabel}</label>
            <Input value={eyes} onChange={(e) => setEyes(e.target.value)} placeholder={t.eyesPlaceholder} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t.featuresLabel}</label>
            <Input value={features} onChange={(e) => setFeatures(e.target.value)} placeholder={t.featuresPlaceholder} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t.outfitLabel}</label>
            <Input value={outfit} onChange={(e) => setOutfit(e.target.value)} placeholder={t.outfitPlaceholder} />
          </div>
        </div>
        <div className="mt-4 bg-green-300 text-green-900 p-3 rounded-lg font-semibold text-sm">
          🌟 {t.tip}
        </div>
      </div>

      {/* Step 4: Personality */}
      <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-6 mb-6 border-4 border-rose-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">4</div>
          <h4 className="text-2xl font-bold text-gray-800">{t.step4}</h4>
        </div>
        <p className="text-gray-700 mb-3">{t.selectTraits}</p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-3">
          {traits.map((trait) => (
            <Card
              key={trait.icon}
              onClick={() => toggleTrait(trait.name[language])}
              className={`p-3 text-center cursor-pointer transition-all hover:scale-105 ${
                selectedTraits.includes(trait.name[language])
                  ? "bg-gradient-to-br from-purple-400 to-pink-400 text-white ring-4 ring-purple-300"
                  : "bg-white hover:bg-purple-50"
              }`}
            >
              <div className="text-2xl mb-1">{trait.icon}</div>
              <div className="font-medium text-xs">{trait.name[language]}</div>
            </Card>
          ))}
        </div>
        <div className="text-sm text-gray-600 text-center">
          {selectedTraits.length}/3 selected
        </div>
      </div>

      {/* Step 5: Powers */}
      <div className="bg-gradient-to-r from-indigo-200 to-blue-200 rounded-2xl p-6 mb-6 border-4 border-blue-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">5</div>
          <h4 className="text-2xl font-bold text-gray-800">{t.step5}</h4>
        </div>
        <Textarea
          value={powers}
          onChange={(e) => setPowers(e.target.value)}
          placeholder={t.powersPlaceholder}
          rows={3}
          className="border-2 border-blue-400"
        />
      </div>

      {/* Step 6: Story */}
      <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-6 mb-6 border-4 border-pink-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">6</div>
          <h4 className="text-2xl font-bold text-gray-800">{t.step6}</h4>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">🏠 Where do they live?</label>
            <Input value={home} onChange={(e) => setHome(e.target.value)} placeholder={t.homePlaceholder} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">❤️ What do they love?</label>
            <Input value={loves} onChange={(e) => setLoves(e.target.value)} placeholder={t.lovesPlaceholder} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">😰 What are they afraid of?</label>
            <Input value={fears} onChange={(e) => setFears(e.target.value)} placeholder={t.fearsPlaceholder} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">🎯 What's their goal?</label>
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder={t.goalPlaceholder} />
          </div>
        </div>
      </div>

      {/* Step 7: Draw */}
      <div className="bg-gradient-to-r from-yellow-200 to-lime-200 rounded-2xl p-6 mb-6 border-4 border-lime-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">7</div>
          <h4 className="text-2xl font-bold text-gray-800">{t.step7}</h4>
        </div>
        <div className="bg-white rounded-xl p-8 text-center border-4 border-dashed border-purple-400">
          <Pencil className="w-16 h-16 mx-auto mb-4 text-purple-500" />
          <p className="text-gray-700 text-lg">{t.drawTip}</p>
        </div>
      </div>

      {/* View Summary Button */}
      <div className="text-center">
        <Button
          onClick={handleShowSummary}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {t.viewSummary}
        </Button>
      </div>

      {/* Summary */}
      {showSummary && (
        <div id="summary-section" className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-center mb-6">🎉 {t.summaryTitle} 🎉</h3>
          <div className="space-y-3 text-lg">
            <p><strong>📛 Name:</strong> {charName || "My Character"}</p>
            {selectedType && <p><strong>✨ Type:</strong> {selectedType}</p>}
            {(colors || eyes || features || outfit) && (
              <p><strong>🎨 Appearance:</strong> {colors && `${colors} colors`}{eyes && `, ${eyes} eyes`}{features && `, ${features}`}{outfit && `, wearing ${outfit}`}</p>
            )}
            {selectedTraits.length > 0 && (
              <p><strong>💫 Personality:</strong> {selectedTraits.join(", ")}</p>
            )}
            {powers && <p><strong>⚡ Powers:</strong> {powers}</p>}
            {home && <p><strong>🏠 Home:</strong> {home}</p>}
            {loves && <p><strong>❤️ Loves:</strong> {loves}</p>}
            {fears && <p><strong>😰 Fears:</strong> {fears}</p>}
            {goal && <p><strong>🎯 Goal:</strong> {goal}</p>}
            <p className="text-center mt-6 text-xl">✨ Now you're ready to write stories about {charName || "your character"}! ✨</p>
          </div>
        </div>
      )}
    </div>
  );
}