
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy, Save } from "lucide-react";

export default function StoryBuilderDemo({ language }) {
  const [currentStory, setCurrentStory] = useState({});
  const [rollingElement, setRollingElement] = useState(null);
  const [showStory, setShowStory] = useState(false);
  const [savedStories, setSavedStories] = useState([]);

  const text = {
    en: {
      title: "Story Dice Creator with Eva",
      subtitle: "Roll the dice to create your own amazing adventure!",
      howToPlay: "How to Play",
      instructions: "Click on each dice to roll for different story elements, or click the big button to roll them all at once! Once you have all your elements, your unique story will appear below. Every roll creates a brand new adventure!",
      character: "Character",
      setting: "Setting",
      goal: "Goal",
      problem: "Problem",
      solution: "Solution",
      twist: "Plot Twist",
      rollPrompt: {
        character: "Roll to discover your hero!",
        setting: "Roll to find where the story happens!",
        goal: "Roll to see what they want!",
        problem: "Roll to discover the challenge!",
        solution: "Roll to find how they succeed!",
        twist: "Roll for a surprise ending!"
      },
      rollAll: "ROLL ALL DICE!",
      storyTitle: "Your Amazing Story",
      saveStory: "Save Story",
      copyStory: "Copy Story",
      newStory: "Create New Story",
      tips: "Story Writing Tips:",
      tipsText: "Once you have your story elements, try expanding your tale! Add more details about your character, describe the setting with colorful words, or create dialogue between characters. Every great author starts with a simple idea!",
      savedTitle: "Your Saved Stories",
      copiedAlert: "Story copied to clipboard!",
      savedAlert: "Story saved! Check your saved stories below!",
      storyNumber: "Story"
    },
    es: {
      title: "Creador de Dados de Historia con Eva",
      subtitle: "¡Tira los dados para crear tu propia aventura increíble!",
      howToPlay: "Cómo Jugar",
      instructions: "¡Haz clic en cada dado para obtener diferentes elementos de la historia, o haz clic en el botón grande para tirarlos todos a la vez! Una vez que tengas todos los elementos, tu historia única aparecerá abajo. ¡Cada tirada crea una nueva aventura!",
      character: "Personaje",
      setting: "Escenario",
      goal: "Objetivo",
      problem: "Problema",
      solution: "Solución",
      twist: "Giro de Trama",
      rollPrompt: {
        character: "¡Tira para descubrir tu héroe!",
        setting: "¡Tira para encontrar dónde sucede la historia!",
        goal: "¡Tira para ver qué quieren!",
        problem: "¡Tira para descubrir el desafío!",
        solution: "¡Tira para encontrar cómo tienen éxito!",
        twist: "¡Tira para un final sorpresa!"
      },
      rollAll: "¡TIRAR TODOS LOS DADOS!",
      storyTitle: "Tu Historia Increíble",
      saveStory: "Guardar Historia",
      copyStory: "Copiar Historia",
      newStory: "Crear Nueva Historia",
      tips: "Consejos de Escritura:",
      tipsText: "Una vez que tengas tus elementos de historia, ¡intenta expandir tu cuento! Agrega más detalles sobre tu personaje, describe el escenario con palabras coloridas o crea diálogos entre personajes. ¡Cada gran autor comienza con una idea simple!",
      savedTitle: "Tus Historias Guardadas",
      copiedAlert: "¡Historia copiada al portapapeles!",
      savedAlert: "¡Historia guardada! ¡Mira tus historias guardadas abajo!",
      storyNumber: "Historia"
    },
    fr: {
      title: "Créateur de Dés d'Histoire avec Eva",
      subtitle: "Lancez les dés pour créer votre propre aventure incroyable!",
      howToPlay: "Comment Jouer",
      instructions: "Cliquez sur chaque dé pour obtenir différents éléments d'histoire, ou cliquez sur le gros bouton pour tous les lancer à la fois! Une fois que vous avez tous les éléments, votre histoire unique apparaîtra ci-dessous. Chaque lancer crée une nouvelle aventure!",
      character: "Personnage",
      setting: "Décor",
      goal: "Objectif",
      problem: "Problème",
      solution: "Solution",
      twist: "Rebondissement",
      rollPrompt: {
        character: "Lancez pour découvrir votre héros!",
        setting: "Lancez pour trouver où se passe l'histoire!",
        goal: "Lancez pour voir ce qu'ils veulent!",
        problem: "Lancez pour découvrir le défi!",
        solution: "Lancez pour trouver comment ils réussissent!",
        twist: "Lancez pour une fin surprise!"
      },
      rollAll: "LANCER TOUS LES DÉS!",
      storyTitle: "Votre Histoire Incroyable",
      saveStory: "Sauvegarder l'Histoire",
      copyStory: "Copier l'Histoire",
      newStory: "Créer Nouvelle Histoire",
      tips: "Conseils d'Écriture:",
      tipsText: "Une fois que vous avez vos éléments d'histoire, essayez d'étendre votre conte! Ajoutez plus de détails sur votre personnage, décrivez le décor avec des mots colorés ou créez des dialogues entre personnages. Chaque grand auteur commence par une idée simple!",
      savedTitle: "Vos Histoires Sauvegardées",
      copiedAlert: "Histoire copiée dans le presse-papiers!",
      savedAlert: "Histoire sauvegardée! Consultez vos histoires sauvegardées ci-dessous!",
      storyNumber: "Histoire"
    }
  };

  const t = text[language] || text.en;

  const storyElements = {
    character: {
      en: [
        { name: "a brave knight named Sir Courage", emoji: "⚔️" },
        { name: "a clever fox named Whiskers", emoji: "🦊" },
        { name: "a friendly dragon named Spark", emoji: "🐉" },
        { name: "a curious robot named Bolt", emoji: "🤖" },
        { name: "a magical fairy named Luna", emoji: "🧚" },
        { name: "a wise wizard named Merlin", emoji: "🧙" }
      ],
      es: [
        { name: "un caballero valiente llamado Sir Coraje", emoji: "⚔️" },
        { name: "un zorro astuto llamado Bigotes", emoji: "🦊" },
        { name: "un dragón amigable llamado Chispa", emoji: "🐉" },
        { name: "un robot curioso llamado Rayo", emoji: "🤖" },
        { name: "un hada mágica llamada Luna", emoji: "🧚" },
        { name: "un mago sabio llamado Merlín", emoji: "🧙" }
      ],
      fr: [
        { name: "un chevalier brave nommé Sir Courage", emoji: "⚔️" },
        { name: "un renard malin nommé Moustaches", emoji: "🦊" },
        { name: "un dragon amical nommé Étincelle", emoji: "🐉" },
        { name: "un robot curieux nommé Éclair", emoji: "🤖" },
        { name: "une fée magique nommée Luna", emoji: "🧚" },
        { name: "un sorcier sage nommé Merlin", emoji: "🧙" }
      ]
    },
    setting: {
      en: [
        { name: "an enchanted forest full of glowing mushrooms", emoji: "🌳" },
        { name: "a floating castle in the clouds", emoji: "🏰" },
        { name: "a mysterious underwater city", emoji: "🌊" },
        { name: "a candy-filled kingdom", emoji: "🍭" },
        { name: "a futuristic space station", emoji: "🚀" },
        { name: "a magical library with endless books", emoji: "📚" }
      ],
      es: [
        { name: "un bosque encantado lleno de hongos brillantes", emoji: "🌳" },
        { name: "un castillo flotante en las nubes", emoji: "🏰" },
        { name: "una ciudad submarina misteriosa", emoji: "🌊" },
        { name: "un reino lleno de dulces", emoji: "🍭" },
        { name: "una estación espacial futurista", emoji: "🚀" },
        { name: "una biblioteca mágica con libros infinitos", emoji: "📚" }
      ],
      fr: [
        { name: "une forêt enchantée pleine de champignons lumineux", emoji: "🌳" },
        { name: "un château flottant dans les nuages", emoji: "🏰" },
        { name: "une ville sous-marine mystérieuse", emoji: "🌊" },
        { name: "un royaume rempli de bonbons", emoji: "🍭" },
        { name: "une station spatiale futuriste", emoji: "🚀" },
        { name: "une bibliothèque magique avec des livres sans fin", emoji: "📚" }
      ]
    },
    goal: {
      en: [
        { name: "find the legendary treasure", emoji: "💎" },
        { name: "save the kingdom from danger", emoji: "🛡️" },
        { name: "discover a secret recipe", emoji: "📜" },
        { name: "make a new best friend", emoji: "🤝" },
        { name: "win the grand tournament", emoji: "🏆" },
        { name: "unlock ancient magic", emoji: "✨" }
      ],
      es: [
        { name: "encontrar el tesoro legendario", emoji: "💎" },
        { name: "salvar el reino del peligro", emoji: "🛡️" },
        { name: "descubrir una receta secreta", emoji: "📜" },
        { name: "hacer un nuevo mejor amigo", emoji: "🤝" },
        { name: "ganar el gran torneo", emoji: "🏆" },
        { name: "desbloquear magia antigua", emoji: "✨" }
      ],
      fr: [
        { name: "trouver le trésor légendaire", emoji: "💎" },
        { name: "sauver le royaume du danger", emoji: "🛡️" },
        { name: "découvrir une recette secrète", emoji: "📜" },
        { name: "se faire un nouveau meilleur ami", emoji: "🤝" },
        { name: "gagner le grand tournoi", emoji: "🏆" },
        { name: "débloquer la magie ancienne", emoji: "✨" }
      ]
    },
    problem: {
      en: [
        { name: "a mischievous goblin steals the map", emoji: "😈" },
        { name: "a giant maze blocks the way", emoji: "🌀" },
        { name: "everything is frozen by an ice spell", emoji: "❄️" },
        { name: "a riddle must be solved first", emoji: "❓" },
        { name: "time is running out quickly", emoji: "⏰" },
        { name: "they must work with an old rival", emoji: "😤" }
      ],
      es: [
        { name: "un duende travieso roba el mapa", emoji: "😈" },
        { name: "un laberinto gigante bloquea el camino", emoji: "🌀" },
        { name: "todo está congelado por un hechizo de hielo", emoji: "❄️" },
        { name: "primero debe resolverse un acertijo", emoji: "❓" },
        { name: "el tiempo se está agotando rápidamente", emoji: "⏰" },
        { name: "deben trabajar con un viejo rival", emoji: "😤" }
      ],
      fr: [
        { name: "un gobelin malicieux vole la carte", emoji: "😈" },
        { name: "un labyrinthe géant bloque le chemin", emoji: "🌀" },
        { name: "tout est gelé par un sort de glace", emoji: "❄️" },
        { name: "une énigme doit d'abord être résolue", emoji: "❓" },
        { name: "le temps s'écoule rapidement", emoji: "⏰" },
        { name: "ils doivent travailler avec un ancien rival", emoji: "😤" }
      ]
    },
    solution: {
      en: [
        { name: "uses kindness to win over enemies", emoji: "💝" },
        { name: "discovers a hidden talent", emoji: "⭐" },
        { name: "finds a magical item that helps", emoji: "🔮" },
        { name: "teams up with unlikely friends", emoji: "👥" },
        { name: "remembers wise advice from a mentor", emoji: "💭" },
        { name: "creates a clever invention", emoji: "💡" }
      ],
      es: [
        { name: "usa la bondad para ganarse a los enemigos", emoji: "💝" },
        { name: "descubre un talento oculto", emoji: "⭐" },
        { name: "encuentra un objeto mágico que ayuda", emoji: "🔮" },
        { name: "se une con amigos improbables", emoji: "👥" },
        { name: "recuerda sabios consejos de un mentor", emoji: "💭" },
        { name: "crea un invento inteligente", emoji: "💡" }
      ],
      fr: [
        { name: "utilise la gentillesse pour gagner les ennemis", emoji: "💝" },
        { name: "découvre un talent caché", emoji: "⭐" },
        { name: "trouve un objet magique qui aide", emoji: "🔮" },
        { name: "fait équipe avec des amis improbables", emoji: "👥" },
        { name: "se souvient de sages conseils d'un mentor", emoji: "💭" },
        { name: "crée une invention intelligente", emoji: "💡" }
      ]
    },
    twist: {
      en: [
        { name: "The villain becomes a good friend!", emoji: "😊" },
        { name: "The treasure was friendship all along!", emoji: "💖" },
        { name: "They discover they have royal blood!", emoji: "👑" },
        { name: "The adventure was all a magical test!", emoji: "📝" },
        { name: "They become the new guardian!", emoji: "🦸" },
        { name: "They find a portal to new adventures!", emoji: "🌈" }
      ],
      es: [
        { name: "¡El villano se convierte en un buen amigo!", emoji: "😊" },
        { name: "¡El tesoro era la amistad todo el tiempo!", emoji: "💖" },
        { name: "¡Descubren que tienen sangre real!", emoji: "👑" },
        { name: "¡La aventura era toda una prueba mágica!", emoji: "📝" },
        { name: "¡Se convierten en el nuevo guardián!", emoji: "🦸" },
        { name: "¡Encuentran un portal a nuevas aventuras!", emoji: "🌈" }
      ],
      fr: [
        { name: "Le méchant devient un bon ami!", emoji: "😊" },
        { name: "Le trésor était l'amitié depuis le début!", emoji: "💖" },
        { name: "Ils découvrent qu'ils ont du sang royal!", emoji: "👑" },
        { name: "L'aventure était tout un test magique!", emoji: "📝" },
        { name: "Ils deviennent le nouveau gardien!", emoji: "🦸" },
        { name: "Ils trouvent un portail vers de nouvelles aventures!", emoji: "🌈" }
      ]
    }
  };

  const elementsList = ['character', 'setting', 'goal', 'problem', 'solution', 'twist'];
  const elementIcons = {
    character: '👤',
    setting: '🗺️',
    goal: '🎯',
    problem: '⚠️',
    solution: '💡',
    twist: '🌟'
  };

  const rollDice = (element) => {
    setRollingElement(element);
    
    setTimeout(() => {
      const options = storyElements[element][language] || storyElements[element].en;
      const selected = options[Math.floor(Math.random() * options.length)];
      
      setCurrentStory(prev => ({ ...prev, [element]: selected }));
      setRollingElement(null);
      
      // Check if story is complete
      const newStory = { ...currentStory, [element]: selected };
      if (Object.keys(newStory).length === 6) {
        setTimeout(() => setShowStory(true), 500);
      }
    }, 500);
  };

  const rollAllDice = () => {
    setShowStory(false);
    const newStory = {};
    
    elementsList.forEach((element, index) => {
      setTimeout(() => {
        setRollingElement(element);
        
        setTimeout(() => {
          const options = storyElements[element][language] || storyElements[element].en;
          const selected = options[Math.floor(Math.random() * options.length)];
          
          newStory[element] = selected;
          setCurrentStory(prev => ({ ...prev, [element]: selected }));
          setRollingElement(null);
          
          if (index === elementsList.length - 1) {
            setTimeout(() => setShowStory(true), 500);
          }
        }, 500);
      }, index * 800);
    });
  };

  const generateStoryText = () => {
    const templates = {
      en: `Once upon a time, there lived ${currentStory.character?.name}. They lived in ${currentStory.setting?.name}. One day, they decided to ${currentStory.goal?.name}! But there was a problem: ${currentStory.problem?.name}. Thinking quickly, our hero ${currentStory.solution?.name}! And here's the amazing part: ${currentStory.twist?.name} The End! 🌟`,
      es: `Érase una vez, vivía ${currentStory.character?.name}. Vivían en ${currentStory.setting?.name}. Un día, decidieron ${currentStory.goal?.name}! Pero había un problema: ${currentStory.problem?.name}. Pensando rápidamente, nuestro héroe ${currentStory.solution?.name}! Y aquí está la parte increíble: ${currentStory.twist?.name} ¡Fin! 🌟`,
      fr: `Il était une fois, vivait ${currentStory.character?.name}. Ils vivaient dans ${currentStory.setting?.name}. Un jour, ils ont décidé de ${currentStory.goal?.name}! Mais il y avait un problème: ${currentStory.problem?.name}. Pensant rapidement, notre héros ${currentStory.solution?.name}! Et voici la partie incroyable: ${currentStory.twist?.name} Fin! 🌟`
    };
    
    return templates[language] || templates.en;
  };

  const copyStory = () => {
    const storyText = generateStoryText();
    navigator.clipboard.writeText(storyText);
    alert(t.copiedAlert);
  };

  const saveStory = () => {
    const storyText = generateStoryText();
    const timestamp = new Date().toLocaleString();
    
    setSavedStories(prev => [...prev, { text: storyText, date: timestamp }]);
    alert(t.savedAlert);
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-6 md:p-8 max-h-[70vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">{t.title}</h3>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">🎲📖</div>
      </div>

      {/* How to Play */}
      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-2xl p-6 mb-6 text-center">
        <h4 className="text-2xl font-bold mb-3">✨ {t.howToPlay} ✨</h4>
        <p className="text-lg leading-relaxed">{t.instructions}</p>
      </div>

      {/* Story Elements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {elementsList.map((element) => (
          <Card key={element} className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-orange-300 p-6 hover:transform hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">{elementIcons[element]}</span>
                {t[element]}
              </div>
              <Button
                onClick={() => rollDice(element)}
                disabled={rollingElement === element}
                className={`w-14 h-14 rounded-xl bg-white border-3 border-gray-800 text-3xl hover:bg-yellow-200 hover:rotate-12 transition-all ${
                  rollingElement === element ? 'animate-spin' : ''
                }`}
              >
                🎲
              </Button>
            </div>
            <div className={`bg-white rounded-xl p-4 min-h-[80px] flex items-center justify-center text-center ${
              currentStory[element] ? 'text-gray-800' : 'text-gray-400 italic'
            }`}>
              {currentStory[element] ? (
                <span>
                  <span className="text-3xl mr-2">{currentStory[element].emoji}</span>
                  {currentStory[element].name}
                </span>
              ) : (
                t.rollPrompt[element]
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Roll All Button */}
      <div className="text-center mb-6">
        <Button
          onClick={rollAllDice}
          disabled={rollingElement !== null}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xl px-12 py-8 rounded-full shadow-2xl"
        >
          🎲 {t.rollAll} 🎲
        </Button>
      </div>

      {/* Generated Story */}
      {showStory && Object.keys(currentStory).length === 6 && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-8 mb-6 animate-fadeIn">
          <div className="text-3xl font-bold text-center mb-6">
            📚 {t.storyTitle} 📚
          </div>
          <div className="text-lg leading-relaxed text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
            {generateStoryText()}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={saveStory}
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {t.saveStory}
            </Button>
            <Button
              onClick={copyStory}
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              {t.copyStory}
            </Button>
            <Button
              onClick={rollAllDice}
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t.newStory}
            </Button>
          </div>
        </div>
      )}

      {/* Writing Tips */}
      <div className="bg-green-300 text-green-900 rounded-2xl p-6 border-l-8 border-green-600 mb-6">
        <h4 className="font-bold text-lg mb-2">✏️ {t.tips}</h4>
        <p className="leading-relaxed">{t.tipsText}</p>
      </div>

      {/* Saved Stories */}
      {savedStories.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-purple-700 mb-4">📚 {t.savedTitle} 📚</h3>
          <div className="space-y-4">
            {[...savedStories].reverse().map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border-l-6 border-purple-500 shadow-lg">
                <div className="text-purple-700 font-bold text-lg mb-2">
                  {t.storyNumber} #{savedStories.length - index} - {story.date}
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {story.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
