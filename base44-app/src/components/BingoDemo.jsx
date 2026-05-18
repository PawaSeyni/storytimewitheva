
import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, Award } from "lucide-react";

// Themes and badges are defined outside the component to ensure they are stable references
// and do not cause unnecessary re-renders or trigger useCallback dependencies when they haven't changed.
const themes = {
  fairytale: {
    title: { en: '🏰 Fairy Tale Bingo', es: '🏰 Bingo de Cuentos', fr: '🏰 Bingo de Contes' },
    items: [
      { emoji: '👑', text: { en: 'A King or Queen', es: 'Un Rey o Reina', fr: 'Un Roi ou Reine' } },
      { emoji: '🏰', text: { en: 'A Castle', es: 'Un Castillo', fr: 'Un Château' } },
      { emoji: '🐉', text: { en: 'A Dragon', es: 'Un Dragón', fr: 'Un Dragon' } },
      { emoji: '🧚', text: { en: 'A Fairy', es: 'Un Hada', fr: 'Une Fée' } },
      { emoji: '✨', text: { en: 'Magic Spell', es: 'Hechizo Mágico', fr: 'Sort Magique' } },
      { emoji: '🗡️', text: { en: 'A Sword', es: 'Una Espada', fr: 'Une Épée' } },
      { emoji: '👸', text: { en: 'A Princess', es: 'Una Princesa', fr: 'Une Princesse' } },
      { emoji: '🧙', text: { en: 'A Wizard', es: 'Un Mago', fr: 'Un Sorcier' } },
      { emoji: '🌹', text: { en: 'Enchanted Item', es: 'Objeto Encantado', fr: 'Objet Enchanté' } },
      { emoji: '🐸', text: { en: 'Talking Animal', es: 'Animal Parlante', fr: 'Animal Parlant' } },
      { emoji: '🪄', text: { en: 'Magic Wand', es: 'Varita Mágica', fr: 'Baguette Magique' } },
      { emoji: '💎', text: { en: 'A Treasure', es: 'Un Tesoro', fr: 'Un Trésor' } },
      { emoji: '🌟', text: { en: 'A Wish', es: 'Un Deseo', fr: 'Un Souhait' } },
      { emoji: '🦄', text: { en: 'Mythical Creature', es: 'Criatura Mítica', fr: 'Créature Mythique' } },
      { emoji: '📜', text: { en: 'A Quest', es: 'Una Misión', fr: 'Une Quête' } },
      { emoji: '🔮', text: { en: 'A Prophecy', es: 'Una Profecía', fr: 'Une Prophétie' } },
      { emoji: '👹', text: { en: 'A Villain', es: 'Un Villano', fr: 'Un Méchant' } },
      { emoji: '🌙', text: { en: 'Night Scene', es: 'Escena Nocturna', fr: 'Scène Nocturne' } },
      { emoji: '🎭', text: { en: 'A Disguise', es: 'Un Disfraz', fr: 'Un Déguisement' } },
      { emoji: '💝', text: { en: 'True Love', es: 'Amor Verdadero', fr: 'Vrai Amour' } },
      { emoji: '🔑', text: { en: 'A Secret', es: 'Un Secreto', fr: 'Un Secret' } },
      { emoji: '🌳', text: { en: 'Enchanted Forest', es: 'Bosque Encantado', fr: 'Forêt Enchantée' } },
      { emoji: '⚡', text: { en: 'A Curse', es: 'Una Maldición', fr: 'Une Malédiction' } },
      { emoji: '🎪', text: { en: 'Transformation', es: 'Transformación', fr: 'Transformation' } }
    ]
  },
  adventure: {
    title: { en: '🗺️ Adventure Bingo', es: '🗺️ Bingo de Aventuras', fr: '🗺️ Bingo d\'Aventure' },
    items: [
      { emoji: '🗺️', text: { en: 'A Map', es: 'Un Mapa', fr: 'Une Carte' } },
      { emoji: '⛰️', text: { en: 'A Mountain', es: 'Una Montaña', fr: 'Une Montagne' } },
      { emoji: '🏝️', text: { en: 'An Island', es: 'Una Isla', fr: 'Une Île' } },
      { emoji: '🧭', text: { en: 'A Compass', es: 'Una Brújula', fr: 'Une Boussole' } },
      { emoji: '🏕️', text: { en: 'Camping', es: 'Acampar', fr: 'Camping' } },
      { emoji: '🔥', text: { en: 'A Campfire', es: 'Fogata', fr: 'Feu de Camp' } },
      { emoji: '🚣', text: { en: 'Boat Journey', es: 'Viaje en Bote', fr: 'Voyage en Bateau' } },
      { emoji: '🌊', text: { en: 'Ocean or Sea', es: 'Océano o Mar', fr: 'Océan ou Mer' } },
      { emoji: '🦅', text: { en: 'Wild Animal', es: 'Animal Salvaje', fr: 'Animal Sauvage' } },
      { emoji: '💎', text: { en: 'Hidden Treasure', es: 'Tesoro Escondido', fr: 'Trésor Caché' } },
      { emoji: '🌲', text: { en: 'A Forest', es: 'Un Bosque', fr: 'Une Forêt' } },
      { emoji: '⚓', text: { en: 'A Ship', es: 'Un Barco', fr: 'Un Navire' } },
      { emoji: '🏜️', text: { en: 'A Desert', es: 'Un Desierto', fr: 'Un Désert' } },
      { emoji: '🧗', text: { en: 'Climbing', es: 'Escalar', fr: 'Escalade' } },
      { emoji: '🎒', text: { en: 'A Backpack', es: 'Una Mochila', fr: 'Un Sac à Dos' } },
      { emoji: '🔦', text: { en: 'A Flashlight', es: 'Una Linterna', fr: 'Une Lampe' } },
      { emoji: '🗻', text: { en: 'A Cave', es: 'Una Cueva', fr: 'Une Grotte' } },
      { emoji: '🌅', text: { en: 'Sunrise/Sunset', es: 'Amanecer/Atardecer', fr: 'Lever/Coucher' } },
      { emoji: '⛺', text: { en: 'A Tent', es: 'Una Tienda', fr: 'Une Tente' } },
      { emoji: '🎣', text: { en: 'Fishing', es: 'Pesca', fr: 'Pêche' } },
      { emoji: '🦜', text: { en: 'Exotic Birds', es: 'Aves Exóticas', fr: 'Oiseaux Exotiques' } },
      { emoji: '💪', text: { en: 'A Challenge', es: 'Un Desafío', fr: 'Un Défi' } },
      { emoji: '🏆', text: { en: 'Victory', es: 'Victoria', fr: 'Victoire' } },
      { emoji: '🤝', text: { en: 'Teamwork', es: 'Trabajo en Equipo', fr: 'Travail d\'Équipe' } }
    ]
  },
  mystery: {
    title: { en: '🔍 Mystery Bingo', es: '🔍 Bingo de Misterio', fr: '🔍 Bingo Mystère' },
    items: [
      { emoji: '🔍', text: { en: 'A Clue', es: 'Una Pista', fr: 'Un Indice' } },
      { emoji: '🕵️', text: { en: 'A Detective', es: 'Un Detective', fr: 'Un Détective' } },
      { emoji: '🔐', text: { en: 'Locked Door', es: 'Puerta Cerrada', fr: 'Porte Verrouillée' } },
      { emoji: '🗝️', text: { en: 'A Key', es: 'Una Llave', fr: 'Une Clé' } },
      { emoji: '📝', text: { en: 'A Note', es: 'Una Nota', fr: 'Une Note' } },
      { emoji: '🕰️', text: { en: 'A Clock', es: 'Un Reloj', fr: 'Une Horloge' } },
      { emoji: '👻', text: { en: 'Something Spooky', es: 'Algo Espeluznante', fr: 'Quelque Chose d\'Effrayant' } },
      { emoji: '🏚️', text: { en: 'Old House', es: 'Casa Vieja', fr: 'Vieille Maison' } },
      { emoji: '🔦', text: { en: 'Dark Search', es: 'Búsqueda Oscura', fr: 'Recherche Sombre' } },
      { emoji: '📖', text: { en: 'Secret Message', es: 'Mensaje Secreto', fr: 'Message Secret' } },
      { emoji: '🎭', text: { en: 'A Suspect', es: 'Un Sospechoso', fr: 'Un Suspect' } },
      { emoji: '🔒', text: { en: 'A Safe', es: 'Una Caja Fuerte', fr: 'Un Coffre' } },
      { emoji: '📱', text: { en: 'Phone Call', es: 'Llamada', fr: 'Appel' } },
      { emoji: '👀', text: { en: 'Someone Watching', es: 'Alguien Observando', fr: 'Quelqu\'un Regarde' } },
      { emoji: '🚪', text: { en: 'Hidden Door', es: 'Puerta Oculta', fr: 'Porte Cachée' } },
      { emoji: '📷', text: { en: 'Evidence', es: 'Evidencia', fr: 'Preuve' } },
      { emoji: '🌙', text: { en: 'Night Scene', es: 'Escena Nocturna', fr: 'Scène Nocturne' } },
      { emoji: '🕷️', text: { en: 'Cobwebs', es: 'Telarañas', fr: 'Toiles d\'Araignée' } },
      { emoji: '📜', text: { en: 'Old Map', es: 'Mapa Antiguo', fr: 'Vieille Carte' } },
      { emoji: '🔊', text: { en: 'Strange Sound', es: 'Sonido Extraño', fr: 'Son Étrange' } },
      { emoji: '🧩', text: { en: 'A Puzzle', es: 'Un Rompecabezas', fr: 'Un Puzzle' } },
      { emoji: '💡', text: { en: 'A Discovery', es: 'Un Descubrimiento', fr: 'Une Découverte' } },
      { emoji: '❓', text: { en: 'A Question', es: 'Una Pregunta', fr: 'Une Question' } },
      { emoji: '✅', text: { en: 'Case Solved!', es: '¡Caso Resuelto!', fr: 'Affaire Résolue!' } }
    ]
  },
  animal: {
    title: { en: '🦁 Animal Story Bingo', es: '🦁 Bingo de Animales', fr: '🦁 Bingo d\'Animaux' },
    items: [
      { emoji: '🦁', text: { en: 'A Lion', es: 'Un León', fr: 'Un Lion' } },
      { emoji: '🐘', text: { en: 'An Elephant', es: 'Un Elefante', fr: 'Un Éléphant' } },
      { emoji: '🦊', text: { en: 'A Fox', es: 'Un Zorro', fr: 'Un Renard' } },
      { emoji: '🐻', text: { en: 'A Bear', es: 'Un Oso', fr: 'Un Ours' } },
      { emoji: '🦉', text: { en: 'An Owl', es: 'Un Búho', fr: 'Un Hibou' } },
      { emoji: '🐰', text: { en: 'A Rabbit', es: 'Un Conejo', fr: 'Un Lapin' } },
      { emoji: '🐺', text: { en: 'A Wolf', es: 'Un Lobo', fr: 'Un Loup' } },
      { emoji: '🦅', text: { en: 'An Eagle', es: 'Un Águila', fr: 'Un Aigle' } },
      { emoji: '🐢', text: { en: 'A Turtle', es: 'Una Tortuga', fr: 'Une Tortue' } },
      { emoji: '🦌', text: { en: 'A Deer', es: 'Un Venado', fr: 'Un Cerf' } },
      { emoji: '🐿️', text: { en: 'A Squirrel', es: 'Una Ardilla', fr: 'Un Écureuil' } },
      { emoji: '🦜', text: { en: 'A Parrot', es: 'Un Loro', fr: 'Un Perroquet' } },
      { emoji: '🐼', text: { en: 'A Panda', es: 'Un Panda', fr: 'Un Panda' } },
      { emoji: '🦒', text: { en: 'A Giraffe', es: 'Una Jirafa', fr: 'Une Girafe' } },
      { emoji: '🐨', text: { en: 'A Koala', es: 'Un Koala', fr: 'Un Koala' } },
      { emoji: '🦘', text: { en: 'A Kangaroo', es: 'Un Canguro', fr: 'Un Kangourou' } },
      { emoji: '🦈', text: { en: 'A Shark', es: 'Un Tiburón', fr: 'Un Requin' } },
      { emoji: '🐬', text: { en: 'A Dolphin', es: 'Un Delfín', fr: 'Un Dauphin' } },
      { emoji: '🐧', text: { en: 'A Penguin', es: 'Un Pingüino', fr: 'Un Pingouin' } },
      { emoji: '🦋', text: { en: 'A Butterfly', es: 'Una Mariposa', fr: 'Un Papillon' } },
      { emoji: '🐝', text: { en: 'A Bee', es: 'Una Abeja', fr: 'Une Abeille' } },
      { emoji: '🐜', text: { en: 'An Ant', es: 'Una Hormiga', fr: 'Une Fourmi' } },
      { emoji: '🦆', text: { en: 'A Duck', es: 'Un Pato', fr: 'Un Canard' } },
      { emoji: '🐔', text: { en: 'A Chicken', es: 'Un Pollo', fr: 'Un Poulet' } }
    ]
  }
};

const badges = [
  { id: 'first', emoji: '⭐', name: { en: 'First Mark', es: 'Primera Marca', fr: 'Première Marque' }, condition: 'marks', value: 1 },
  { id: 'five', emoji: '🌟', name: { en: 'Five Marks', es: 'Cinco Marcas', fr: 'Cinq Marques' }, condition: 'marks', value: 5 },
  { id: 'half', emoji: '💫', name: { en: 'Half Card', es: 'Media Tarjeta', fr: 'Demi-Carte' }, condition: 'marks', value: 12 },
  { id: 'bingo', emoji: '🎯', name: { en: 'First Bingo', es: 'Primer Bingo', fr: 'Premier Bingo' }, condition: 'bingo', value: 1 },
  { id: 'fullcard', emoji: '🏆', name: { en: 'Full Card', es: 'Tarjeta Completa', fr: 'Carte Complète' }, condition: 'fullcard', value: 1 },
  { id: 'explorer', emoji: '🗺️', name: { en: 'Card Explorer', es: 'Explorador', fr: 'Explorateur' }, condition: 'themes', value: 2 }
];


export default function BingoDemo({ language }) {
  const [currentTheme, setCurrentTheme] = useState('fairytale');
  const [completedSquares, setCompletedSquares] = useState(new Set([12])); // Free space
  const [hasBingo, setHasBingo] = useState(false);
  const [bingoLines, setBingoLines] = useState([]);
  const [currentCard, setCurrentCard] = useState([]);
  const [bingoCount, setBingoCount] = useState(0);
  const [fullCardCount, setFullCardCount] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState(new Set());
  const [themesPlayed, setThemesPlayed] = useState(new Set(['fairytale']));

  const text = {
    en: {
      title: "Eva's Reading Bingo Adventure",
      subtitle: "Mark off story elements as you read and collect amazing badges!",
      howToPlay: "How to Play:",
      instructions: [
        "Pick a bingo card theme below",
        "Read a story with someone",
        "Click squares when you find those elements",
        "Get 5 in a row to win!",
        "Collect badges for achievements"
      ],
      tip: "Tip: The center square is FREE! You can also win by filling the whole card!",
      chooseTheme: "Choose Your Theme:",
      marked: "Marked",
      badges: "Badges",
      checkBingo: "Check for Bingo!",
      newCard: "New Card",
      clearAll: "Clear All",
      yourBadges: "Your Badge Collection",
      congrats: "BINGO! You're a Reading Champion!",
      noBingoYet: "No BINGO yet! Keep reading and marking squares!",
      youGotBingo: "You got BINGO on:"
    },
    es: {
      title: "Aventura de Bingo de Lectura de Eva",
      subtitle: "¡Marca elementos de la historia mientras lees y colecciona insignias increíbles!",
      howToPlay: "Cómo Jugar:",
      instructions: [
        "Elige un tema de tarjeta de bingo abajo",
        "Lee una historia con alguien",
        "Haz clic en los cuadrados cuando encuentres esos elementos",
        "¡Consigue 5 en fila para ganar!",
        "Colecciona insignias por logros"
      ],
      tip: "Consejo: ¡El cuadrado central es GRATIS! ¡También puedes ganar llenando toda la tarjeta!",
      chooseTheme: "Elige Tu Tema:",
      marked: "Marcadas",
      badges: "Insignias",
      checkBingo: "¡Verificar Bingo!",
      newCard: "Nueva Tarjeta",
      clearAll: "Borrar Todo",
      yourBadges: "Tu Colección de Insignias",
      congrats: "¡BINGO! ¡Eres un Campeón de Lectura!",
      noBingoYet: "¡Aún no hay BINGO! ¡Sigue leyendo y marcando cuadrados!",
      youGotBingo: "¡Conseguiste BINGO en:"
    },
    fr: {
      title: "Aventure de Bingo de Lecture d'Eva",
      subtitle: "Marquez les éléments de l'histoire en lisant et collectionnez des badges incroyables!",
      howToPlay: "Comment Jouer:",
      instructions: [
        "Choisissez un thème de carte de bingo ci-dessous",
        "Lisez une histoire avec quelqu'un",
        "Cliquez sur les cases lorsque vous trouvez ces éléments",
        "Obtenez 5 d'affilée pour gagner!",
        "Collectionnez des badges pour vos réalisations"
      ],
      tip: "Conseil: La case centrale est GRATUITE! Vous pouvez également gagner en remplissant toute la carte!",
      chooseTheme: "Choisissez Votre Thème:",
      marked: "Marquées",
      badges: "Badges",
      checkBingo: "Vérifier le Bingo!",
      newCard: "Nouvelle Carte",
      clearAll: "Tout Effacer",
      yourBadges: "Votre Collection de Badges",
      congrats: "BINGO! Vous êtes un Champion de Lecture!",
      noBingoYet: "Pas encore de BINGO! Continuez à lire et à marquer des cases!",
      youGotBingo: "Vous avez obtenu BINGO sur:"
    }
  };

  const t = text[language] || text.en;

  const generateCard = useCallback(() => {
    const theme = themes[currentTheme];
    const shuffled = [...theme.items].sort(() => Math.random() - 0.5);
    const newCard = shuffled.slice(0, 24);
    newCard.splice(12, 0, { emoji: '⭐', text: { en: 'FREE SPACE', es: 'ESPACIO LIBRE', fr: 'ESPACE LIBRE' }, free: true });
    setCurrentCard(newCard);
    setCompletedSquares(new Set([12]));
  }, [currentTheme]);

  useEffect(() => {
    generateCard();
  }, [generateCard]);

  const checkForBingo = useCallback(() => {
    const lines = [];
    const size = 5;
    
    // Check rows
    for (let row = 0; row < size; row++) {
      const rowIndices = Array.from({ length: size }, (_, i) => row * size + i);
      if (rowIndices.every(i => completedSquares.has(i))) {
        lines.push({ type: 'row', index: row + 1 });
      }
    }
    
    // Check columns
    for (let col = 0; col < size; col++) {
      const colIndices = Array.from({ length: size }, (_, i) => col + i * size);
      if (colIndices.every(i => completedSquares.has(i))) {
        lines.push({ type: 'col', index: col + 1 });
      }
    }
    
    // Check diagonals
    const diagonal1 = [0, 6, 12, 18, 24];
    if (diagonal1.every(i => completedSquares.has(i))) {
      lines.push({ type: 'diag', index: 1 });
    }
    
    const diagonal2 = [4, 8, 12, 16, 20];
    if (diagonal2.every(i => completedSquares.has(i))) {
      lines.push({ type: 'diag', index: 2 });
    }
    
    setBingoLines(lines);
    setHasBingo(lines.length > 0);
    
    // Check for full card
    if (completedSquares.size === 25) {
      setFullCardCount(prev => prev + 1);
    }
    
    if (lines.length > 0) {
      setBingoCount(prev => prev + lines.length);
    }
    
    return lines.length > 0;
  }, [completedSquares]);

  const checkBadgeUnlocks = useCallback(() => {
    badges.forEach(badge => {
      let unlock = false;
      
      switch(badge.condition) {
        case 'marks':
          unlock = completedSquares.size >= badge.value;
          break;
        case 'bingo':
          unlock = bingoCount >= badge.value;
          break;
        case 'fullcard':
          unlock = fullCardCount >= badge.value;
          break;
        case 'themes':
          unlock = themesPlayed.size >= badge.value;
          break;
      }
      
      if (unlock && !unlockedBadges.has(badge.id)) {
        setUnlockedBadges(prev => new Set([...prev, badge.id]));
      }
    });
  }, [completedSquares, bingoCount, fullCardCount, themesPlayed, unlockedBadges]);

  useEffect(() => {
    checkBadgeUnlocks();
  }, [checkBadgeUnlocks]);

  const toggleSquare = (index) => {
    if (currentCard[index]?.free) return;
    
    const newCompleted = new Set(completedSquares);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSquares(newCompleted);
  };

  const handleCheckBingo = () => {
    const hasBingo = checkForBingo();
    if (!hasBingo) {
      alert(t.noBingoYet);
    }
  };

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    setThemesPlayed(prev => new Set([...prev, theme]));
    generateCard();
  };

  const isInBingoLine = (index) => {
    return bingoLines.some(line => {
      if (line.type === 'row') {
        return Math.floor(index / 5) === line.index - 1;
      } else if (line.type === 'col') {
        return index % 5 === line.index - 1;
      } else if (line.type === 'diag') {
        if (line.index === 1) return [0, 6, 12, 18, 24].includes(index);
        if (line.index === 2) return [4, 8, 12, 16, 20].includes(index);
      }
      return false;
    });
  };

  const progress = Math.round((completedSquares.size / 25) * 100);

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-2xl p-6 md:p-8 max-h-[70vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">{t.title}</h3>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">📚🎯</div>
      </div>

      {/* How to Play */}
      <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 mb-6 border-4 border-orange-300">
        <h4 className="font-bold text-lg mb-3 text-orange-700">📖 {t.howToPlay}</h4>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          {t.instructions.map((instruction, i) => (
            <li key={i}>{instruction}</li>
          ))}
        </ol>
        <div className="mt-4 p-3 bg-yellow-200 rounded-lg font-semibold text-sm text-orange-900">
          💡 {t.tip}
        </div>
      </Card>

      {/* Theme Selector & Stats */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <h4 className="font-bold text-lg mb-3 text-purple-700">{t.chooseTheme}</h4>
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.keys(themes).map(themeKey => (
            <Button
              key={themeKey}
              onClick={() => changeTheme(themeKey)}
              className={`rounded-full ${
                currentTheme === themeKey
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {themes[themeKey].title[language]}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-4 justify-center">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 px-6 py-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-purple-600">{completedSquares.size}</div>
            <div className="text-sm text-gray-600">{t.marked}</div>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-orange-100 px-6 py-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-orange-600">{unlockedBadges.size}</div>
            <div className="text-sm text-gray-600">{t.badges}</div>
          </div>
        </div>
      </div>

      {/* Bingo Card */}
      <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl p-6 mb-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-center text-white mb-4">
          {themes[currentTheme].title[language]}
        </h3>
        <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
          {currentCard.map((item, index) => (
            <div
              key={index}
              onClick={() => toggleSquare(index)}
              className={`aspect-square p-2 flex flex-col items-center justify-center text-center text-xs cursor-pointer rounded-xl transition-all shadow-lg ${
                item.free
                  ? 'bg-gradient-to-br from-pink-400 to-red-400 text-white font-bold'
                  : completedSquares.has(index)
                  ? isInBingoLine(index)
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-105 ring-4 ring-yellow-400'
                    : 'bg-gradient-to-br from-green-300 to-teal-300 text-white scale-105'
                  : 'bg-white hover:bg-blue-50 hover:scale-105'
              }`}
            >
              <span className="text-2xl mb-1">{item.emoji}</span>
              <span className="leading-tight">{item.text[language]}</span>
              {completedSquares.has(index) && !item.free && (
                <span className="text-2xl font-bold absolute">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          Progress: {completedSquares.size}/25
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-6 transition-all duration-500 flex items-center justify-center text-white text-sm font-bold"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <Button
          onClick={handleCheckBingo}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-8 py-6 rounded-full shadow-lg"
        >
          <Trophy className="w-5 h-5 mr-2" />
          {t.checkBingo}
        </Button>
        <Button
          onClick={generateCard}
          className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-bold px-8 py-6 rounded-full shadow-lg"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          {t.newCard}
        </Button>
        <Button
          onClick={() => setCompletedSquares(new Set([12]))}
          className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold px-8 py-6 rounded-full shadow-lg"
        >
          {t.clearAll}
        </Button>
      </div>

      {/* Bingo Win Message */}
      {hasBingo && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white rounded-2xl p-8 mb-6 text-center animate-pulse shadow-2xl">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-2">{t.congrats}</h2>
          <div className="text-6xl mb-4">🎉🏆🎊</div>
        </div>
      )}

      {/* Badges */}
      <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-center text-white mb-4">
          <Award className="inline w-6 h-6 mr-2" />
          {t.yourBadges}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`bg-white rounded-xl p-4 text-center transition-all ${
                unlockedBadges.has(badge.id)
                  ? 'opacity-100 transform hover:scale-110 cursor-pointer shadow-lg'
                  : 'opacity-30 grayscale'
              }`}
            >
              <div className="text-4xl mb-2">{badge.emoji}</div>
              <div className="text-xs font-bold text-gray-800">{badge.name[language]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
