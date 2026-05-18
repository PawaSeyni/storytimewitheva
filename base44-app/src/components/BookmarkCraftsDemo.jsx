import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shuffle, Save, Printer } from "lucide-react";

export default function BookmarkCraftsDemo({ language }) {
  const [selectedAnimal, setSelectedAnimal] = useState({ emoji: '🦊', name: 'Fox' });
  const [selectedCountry, setSelectedCountry] = useState({ emoji: '🇺🇸', name: 'USA' });
  const [selectedColor, setSelectedColor] = useState('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
  const [selectedPattern, setSelectedPattern] = useState('none');
  const [bookmarkText, setBookmarkText] = useState('');

  const text = {
    en: {
      title: "Bookmark Designer with Eva",
      subtitle: "Create your own beautiful bookmarks with animals and country themes!",
      templatesTitle: "Quick Start Templates",
      chooseAnimal: "Choose Your Animal",
      chooseCountry: "Choose Country Theme",
      chooseColor: "Choose Background Color",
      addText: "Add Your Text",
      textPlaceholder: "Your name or favorite quote...",
      choosePattern: "Choose Pattern",
      preview: "Your Bookmark Preview",
      print: "Print Bookmark",
      save: "Save Design",
      surprise: "Surprise Me!",
      tips: "Bookmark Making Tips:",
      tipsList: [
        "Choose contrasting colors for text to stand out",
        "Animals and countries make great conversation starters",
        "Make multiple bookmarks as gifts for friends!",
        "Try creating a collection for different book genres"
      ],
      printInstructions: "Printing Instructions:",
      printSteps: [
        "Click the print button above",
        "In the print dialog, select 'Portrait' orientation",
        "Use cardstock or thick paper for best results",
        "After printing, cut around the bookmark",
        "Optional: Laminate for durability!",
        "Add a hole at the top and thread ribbon for a tassel"
      ],
      saved: "Design saved!",
      safariName: "Safari Adventure",
      safariSubtitle: "African Wildlife",
      oceanName: "Ocean Explorer",
      oceanSubtitle: "Sea Creatures",
      japanName: "Japan Journey",
      japanSubtitle: "Asian Culture",
      arcticName: "Arctic Circle",
      arcticSubtitle: "Polar Animals"
    },
    es: {
      title: "Diseñador de Marcapáginas con Eva",
      subtitle: "¡Crea tus propios marcapáginas hermosos con animales y temas de países!",
      templatesTitle: "Plantillas de Inicio Rápido",
      chooseAnimal: "Elige Tu Animal",
      chooseCountry: "Elige Tema de País",
      chooseColor: "Elige Color de Fondo",
      addText: "Agrega Tu Texto",
      textPlaceholder: "Tu nombre o cita favorita...",
      choosePattern: "Elige Patrón",
      preview: "Vista Previa de Tu Marcapáginas",
      print: "Imprimir",
      save: "Guardar",
      surprise: "¡Sorpréndeme!",
      tips: "Consejos para Hacer Marcapáginas:",
      tipsList: [
        "Elige colores contrastantes para que el texto se destaque",
        "Los animales y países son excelentes temas de conversación",
        "¡Haz múltiples marcapáginas como regalos para amigos!",
        "Intenta crear una colección para diferentes géneros de libros"
      ],
      printInstructions: "Instrucciones de Impresión:",
      printSteps: [
        "Haz clic en el botón de imprimir arriba",
        "En el diálogo de impresión, selecciona orientación 'Vertical'",
        "Usa cartulina o papel grueso para mejores resultados",
        "Después de imprimir, recorta alrededor del marcapáginas",
        "Opcional: ¡Lamina para durabilidad!",
        "Agrega un agujero en la parte superior y pasa una cinta"
      ],
      saved: "¡Diseño guardado!",
      safariName: "Aventura Safari",
      safariSubtitle: "Vida Salvaje Africana",
      oceanName: "Explorador del Océano",
      oceanSubtitle: "Criaturas Marinas",
      japanName: "Viaje a Japón",
      japanSubtitle: "Cultura Asiática",
      arcticName: "Círculo Ártico",
      arcticSubtitle: "Animales Polares"
    },
    fr: {
      title: "Concepteur de Marque-pages avec Eva",
      subtitle: "Créez vos propres magnifiques marque-pages avec des animaux et des thèmes de pays!",
      templatesTitle: "Modèles de Démarrage Rapide",
      chooseAnimal: "Choisissez Votre Animal",
      chooseCountry: "Choisissez le Thème du Pays",
      chooseColor: "Choisissez la Couleur de Fond",
      addText: "Ajoutez Votre Texte",
      textPlaceholder: "Votre nom ou citation préférée...",
      choosePattern: "Choisissez le Motif",
      preview: "Aperçu de Votre Marque-page",
      print: "Imprimer",
      save: "Sauvegarder",
      surprise: "Surprenez-moi!",
      tips: "Conseils pour Faire des Marque-pages:",
      tipsList: [
        "Choisissez des couleurs contrastées pour que le texte se démarque",
        "Les animaux et les pays sont d'excellents sujets de conversation",
        "Faites plusieurs marque-pages comme cadeaux pour vos amis!",
        "Essayez de créer une collection pour différents genres de livres"
      ],
      printInstructions: "Instructions d'Impression:",
      printSteps: [
        "Cliquez sur le bouton d'impression ci-dessus",
        "Dans la boîte de dialogue d'impression, sélectionnez l'orientation 'Portrait'",
        "Utilisez du carton ou du papier épais pour de meilleurs résultats",
        "Après l'impression, découpez autour du marque-page",
        "Optionnel: Plastifiez pour la durabilité!",
        "Ajoutez un trou en haut et passez un ruban"
      ],
      saved: "Design sauvegardé!",
      safariName: "Aventure Safari",
      safariSubtitle: "Faune Africaine",
      oceanName: "Explorateur Océanique",
      oceanSubtitle: "Créatures Marines",
      japanName: "Voyage au Japon",
      japanSubtitle: "Culture Asiatique",
      arcticName: "Cercle Arctique",
      arcticSubtitle: "Animaux Polaires"
    }
  };

  const t = text[language] || text.en;

  const animals = [
    { emoji: '🦊', name: 'Fox' },
    { emoji: '🦁', name: 'Lion' },
    { emoji: '🐼', name: 'Panda' },
    { emoji: '🦉', name: 'Owl' },
    { emoji: '🐨', name: 'Koala' },
    { emoji: '🦋', name: 'Butterfly' },
    { emoji: '🐧', name: 'Penguin' },
    { emoji: '🦅', name: 'Eagle' },
    { emoji: '🐯', name: 'Tiger' },
    { emoji: '🐘', name: 'Elephant' },
    { emoji: '🦒', name: 'Giraffe' },
    { emoji: '🐬', name: 'Dolphin' }
  ];

  const countries = [
    { emoji: '🇺🇸', name: 'USA' },
    { emoji: '🇯🇵', name: 'Japan' },
    { emoji: '🇫🇷', name: 'France' },
    { emoji: '🇬🇧', name: 'UK' },
    { emoji: '🇦🇺', name: 'Australia' },
    { emoji: '🇨🇦', name: 'Canada' },
    { emoji: '🇧🇷', name: 'Brazil' },
    { emoji: '🇮🇹', name: 'Italy' },
    { emoji: '🇲🇽', name: 'Mexico' },
    { emoji: '🇨🇳', name: 'China' },
    { emoji: '🇮🇳', name: 'India' },
    { emoji: '🇰🇷', name: 'Korea' }
  ];

  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
  ];

  const patterns = [
    { name: 'None', value: 'none' },
    { name: 'Dots', value: 'radial-gradient(circle, white 2px, transparent 2px)', size: '20px 20px' },
    { name: 'Lines', value: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 40px)' },
    { name: 'Waves', value: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)' }
  ];

  const templates = [
    {
      id: 'safari',
      icon: '🦁🌍',
      animal: animals[1],
      country: countries[9],
      color: colors[3],
      text: 'Safari Adventure'
    },
    {
      id: 'ocean',
      icon: '🐬🌊',
      animal: animals[11],
      country: countries[5],
      color: colors[2],
      text: 'Ocean Explorer'
    },
    {
      id: 'japan',
      icon: '🐼🇯🇵',
      animal: animals[2],
      country: countries[1],
      color: colors[6],
      text: 'Japan Journey'
    },
    {
      id: 'arctic',
      icon: '🐧❄️',
      animal: animals[6],
      country: countries[5],
      color: colors[2],
      text: 'Arctic Circle'
    }
  ];

  const loadTemplate = (template) => {
    setSelectedAnimal(template.animal);
    setSelectedCountry(template.country);
    setSelectedColor(template.color);
    setBookmarkText(template.text);
    setSelectedPattern('none');
  };

  const randomizeDesign = () => {
    setSelectedAnimal(animals[Math.floor(Math.random() * animals.length)]);
    setSelectedCountry(countries[Math.floor(Math.random() * countries.length)]);
    setSelectedColor(colors[Math.floor(Math.random() * colors.length)]);
    setSelectedPattern(patterns[Math.floor(Math.random() * patterns.length)].value);
    
    const quotes = ['Adventure Awaits', 'Keep Reading', 'Book Lover', 'Story Time', 'My Library'];
    setBookmarkText(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const design = { selectedAnimal, selectedCountry, selectedColor, selectedPattern, bookmarkText };
    localStorage.setItem('bookmarkDesign', JSON.stringify(design));
    alert(t.saved);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 md:p-8 max-h-[70vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">{t.title}</h3>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">🎨📚</div>
      </div>

      {/* Quick Templates */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 mb-6">
        <h4 className="text-2xl font-bold text-white text-center mb-4">✨ {t.templatesTitle} ✨</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              onClick={() => loadTemplate(template)}
              className="bg-white p-4 text-center cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-2">{template.icon}</div>
              <div className="font-bold text-purple-700">{t[`${template.id}Name`]}</div>
              <div className="text-xs text-gray-600">{t[`${template.id}Subtitle`]}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          {/* Animals */}
          <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 border-4 border-orange-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">🐾 {t.chooseAnimal}</h4>
            <div className="grid grid-cols-4 gap-3">
              {animals.map((animal) => (
                <Card
                  key={animal.emoji}
                  onClick={() => setSelectedAnimal(animal)}
                  className={`p-3 text-center cursor-pointer transition-all hover:scale-105 ${
                    selectedAnimal.emoji === animal.emoji
                      ? 'bg-gradient-to-br from-pink-400 to-red-400 text-white ring-4 ring-pink-300'
                      : 'bg-white'
                  }`}
                >
                  <div className="text-3xl mb-1">{animal.emoji}</div>
                  <div className="text-xs font-medium">{animal.name}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl p-6 border-4 border-cyan-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">🌍 {t.chooseCountry}</h4>
            <div className="grid grid-cols-4 gap-3">
              {countries.map((country) => (
                <Card
                  key={country.emoji}
                  onClick={() => setSelectedCountry(country)}
                  className={`p-3 text-center cursor-pointer transition-all hover:scale-105 ${
                    selectedCountry.emoji === country.emoji
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white ring-4 ring-blue-300'
                      : 'bg-white'
                  }`}
                >
                  <div className="text-3xl mb-1">{country.emoji}</div>
                  <div className="text-xs font-medium">{country.name}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-gradient-to-r from-green-200 to-teal-200 rounded-2xl p-6 border-4 border-teal-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">🎨 {t.chooseColor}</h4>
            <div className="grid grid-cols-5 gap-3">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`w-full aspect-square rounded-full cursor-pointer transition-all hover:scale-110 ${
                    selectedColor === color ? 'ring-4 ring-gray-800 scale-110' : 'ring-2 ring-white'
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-6 border-4 border-rose-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">✏️ {t.addText}</h4>
            <Input
              value={bookmarkText}
              onChange={(e) => setBookmarkText(e.target.value)}
              placeholder={t.textPlaceholder}
              maxLength={30}
              className="text-lg border-2 border-rose-400"
            />
          </div>

          {/* Patterns */}
          <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-6 border-4 border-pink-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">🎭 {t.choosePattern}</h4>
            <div className="grid grid-cols-4 gap-3">
              {patterns.map((pattern) => (
                <Card
                  key={pattern.name}
                  onClick={() => setSelectedPattern(pattern.value)}
                  className={`p-4 text-center cursor-pointer transition-all hover:scale-105 ${
                    selectedPattern === pattern.value
                      ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white ring-4 ring-purple-300'
                      : 'bg-white'
                  }`}
                >
                  <div className="font-medium text-sm">{pattern.name}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-purple-700 mb-4">📖 {t.preview}</h4>
            <div 
              className="w-72 h-[32rem] mx-auto rounded-2xl shadow-2xl overflow-hidden relative"
              style={{ background: selectedColor }}
            >
              {selectedPattern !== 'none' && (
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ 
                    background: selectedPattern,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}
              <div className="relative z-10 h-full flex flex-col items-center justify-between p-8 text-white">
                <div className="text-2xl font-bold text-center text-shadow">
                  {bookmarkText || 'My Bookmark'}
                </div>
                <div className="text-8xl">{selectedAnimal.emoji}</div>
                <div className="text-xl font-semibold text-center">
                  {selectedCountry.emoji} {selectedCountry.name}
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-gray-800 to-transparent">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-800 rounded-full" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handlePrint}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-6 text-lg"
            >
              <Printer className="w-5 h-5 mr-2" />
              {t.print}
            </Button>
            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white font-bold py-6 text-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              {t.save}
            </Button>
            <Button
              onClick={randomizeDesign}
              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold py-6 text-lg"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              {t.surprise}
            </Button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-400 text-white rounded-2xl p-6 mt-6">
        <h4 className="text-xl font-bold mb-3">💡 {t.tips}</h4>
        <ul className="space-y-2">
          {t.tipsList.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-yellow-300">★</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Print Instructions */}
      <div className="bg-white rounded-2xl p-6 mt-6 border-4 border-dashed border-purple-400">
        <h4 className="text-xl font-bold text-purple-700 mb-3">📋 {t.printInstructions}</h4>
        <ol className="space-y-2 list-decimal list-inside">
          {t.printSteps.map((step, idx) => (
            <li key={idx} className="text-gray-700">{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}