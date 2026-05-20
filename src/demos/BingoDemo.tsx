import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy, Award } from 'lucide-react';
import { useLanguage, useTranslation } from '../lib/language';
import type { Language } from '../lib/language';
import { useToast } from '../lib/toast';

type Item = { emoji: string; text: string; free?: boolean };
type ThemeKey = 'fairytale' | 'adventure' | 'mystery' | 'animal';
type BingoLine = { type: 'row' | 'col' | 'diag'; index: number };

// Item pools per language. Emojis are language-invariant; text labels are localized.
const THEMES: Record<Language, Record<ThemeKey, { title: string; items: Item[] }>> = {
  en: {
    fairytale: {
      title: '🏰 Fairy Tale Bingo',
      items: [
        { emoji: '👑', text: 'A King or Queen' }, { emoji: '🏰', text: 'A Castle' }, { emoji: '🐉', text: 'A Dragon' },
        { emoji: '🧚', text: 'A Fairy' }, { emoji: '✨', text: 'Magic Spell' }, { emoji: '🗡️', text: 'A Sword' },
        { emoji: '👸', text: 'A Princess' }, { emoji: '🧙', text: 'A Wizard' }, { emoji: '🌹', text: 'Enchanted Item' },
        { emoji: '🐸', text: 'Talking Animal' }, { emoji: '🪄', text: 'Magic Wand' }, { emoji: '💎', text: 'A Treasure' },
        { emoji: '🌟', text: 'A Wish' }, { emoji: '🦄', text: 'Mythical Creature' }, { emoji: '📜', text: 'A Quest' },
        { emoji: '🔮', text: 'A Prophecy' }, { emoji: '👹', text: 'A Villain' }, { emoji: '🌙', text: 'Night Scene' },
        { emoji: '🎭', text: 'A Disguise' }, { emoji: '💝', text: 'True Love' }, { emoji: '🔑', text: 'A Secret' },
        { emoji: '🌳', text: 'Enchanted Forest' }, { emoji: '⚡', text: 'A Curse' }, { emoji: '🎪', text: 'Transformation' },
      ],
    },
    adventure: {
      title: '🗺️ Adventure Bingo',
      items: [
        { emoji: '🗺️', text: 'A Map' }, { emoji: '⛰️', text: 'A Mountain' }, { emoji: '🏝️', text: 'An Island' },
        { emoji: '🧭', text: 'A Compass' }, { emoji: '🏕️', text: 'Camping' }, { emoji: '🔥', text: 'A Campfire' },
        { emoji: '🚣', text: 'Boat Journey' }, { emoji: '🌊', text: 'Ocean or Sea' }, { emoji: '🦅', text: 'Wild Animal' },
        { emoji: '💎', text: 'Hidden Treasure' }, { emoji: '🌲', text: 'A Forest' }, { emoji: '⚓', text: 'A Ship' },
        { emoji: '🏜️', text: 'A Desert' }, { emoji: '🧗', text: 'Climbing' }, { emoji: '🎒', text: 'A Backpack' },
        { emoji: '🔦', text: 'A Flashlight' }, { emoji: '🗻', text: 'A Cave' }, { emoji: '🌅', text: 'Sunrise/Sunset' },
        { emoji: '⛺', text: 'A Tent' }, { emoji: '🎣', text: 'Fishing' }, { emoji: '🦜', text: 'Exotic Birds' },
        { emoji: '💪', text: 'A Challenge' }, { emoji: '🏆', text: 'Victory' }, { emoji: '🤝', text: 'Teamwork' },
      ],
    },
    mystery: {
      title: '🔍 Mystery Bingo',
      items: [
        { emoji: '🔍', text: 'A Clue' }, { emoji: '🕵️', text: 'A Detective' }, { emoji: '🔐', text: 'Locked Door' },
        { emoji: '🗝️', text: 'A Key' }, { emoji: '📝', text: 'A Note' }, { emoji: '🕰️', text: 'A Clock' },
        { emoji: '👻', text: 'Something Spooky' }, { emoji: '🏚️', text: 'Old House' }, { emoji: '🔦', text: 'Dark Search' },
        { emoji: '📖', text: 'Secret Message' }, { emoji: '🎭', text: 'A Suspect' }, { emoji: '🔒', text: 'A Safe' },
        { emoji: '📱', text: 'Phone Call' }, { emoji: '👀', text: 'Someone Watching' }, { emoji: '🚪', text: 'Hidden Door' },
        { emoji: '📷', text: 'Evidence' }, { emoji: '🌙', text: 'Night Scene' }, { emoji: '🕷️', text: 'Cobwebs' },
        { emoji: '📜', text: 'Old Map' }, { emoji: '🔊', text: 'Strange Sound' }, { emoji: '🧩', text: 'A Puzzle' },
        { emoji: '💡', text: 'A Discovery' }, { emoji: '❓', text: 'A Question' }, { emoji: '✅', text: 'Case Solved!' },
      ],
    },
    animal: {
      title: '🦁 Animal Story Bingo',
      items: [
        { emoji: '🦁', text: 'A Lion' }, { emoji: '🐘', text: 'An Elephant' }, { emoji: '🦊', text: 'A Fox' },
        { emoji: '🐻', text: 'A Bear' }, { emoji: '🦉', text: 'An Owl' }, { emoji: '🐰', text: 'A Rabbit' },
        { emoji: '🐺', text: 'A Wolf' }, { emoji: '🦅', text: 'An Eagle' }, { emoji: '🐢', text: 'A Turtle' },
        { emoji: '🦌', text: 'A Deer' }, { emoji: '🐿️', text: 'A Squirrel' }, { emoji: '🦜', text: 'A Parrot' },
        { emoji: '🐼', text: 'A Panda' }, { emoji: '🦒', text: 'A Giraffe' }, { emoji: '🐨', text: 'A Koala' },
        { emoji: '🦘', text: 'A Kangaroo' }, { emoji: '🦈', text: 'A Shark' }, { emoji: '🐬', text: 'A Dolphin' },
        { emoji: '🐧', text: 'A Penguin' }, { emoji: '🦋', text: 'A Butterfly' }, { emoji: '🐝', text: 'A Bee' },
        { emoji: '🐜', text: 'An Ant' }, { emoji: '🦆', text: 'A Duck' }, { emoji: '🐔', text: 'A Chicken' },
      ],
    },
  },
  es: {
    fairytale: {
      title: '🏰 Bingo de cuentos de hadas',
      items: [
        { emoji: '👑', text: 'Rey o reina' }, { emoji: '🏰', text: 'Un castillo' }, { emoji: '🐉', text: 'Un dragón' },
        { emoji: '🧚', text: 'Un hada' }, { emoji: '✨', text: 'Un hechizo' }, { emoji: '🗡️', text: 'Una espada' },
        { emoji: '👸', text: 'Una princesa' }, { emoji: '🧙', text: 'Un mago' }, { emoji: '🌹', text: 'Objeto encantado' },
        { emoji: '🐸', text: 'Animal que habla' }, { emoji: '🪄', text: 'Varita mágica' }, { emoji: '💎', text: 'Un tesoro' },
        { emoji: '🌟', text: 'Un deseo' }, { emoji: '🦄', text: 'Criatura mítica' }, { emoji: '📜', text: 'Una misión' },
        { emoji: '🔮', text: 'Una profecía' }, { emoji: '👹', text: 'Un villano' }, { emoji: '🌙', text: 'Escena nocturna' },
        { emoji: '🎭', text: 'Un disfraz' }, { emoji: '💝', text: 'Amor verdadero' }, { emoji: '🔑', text: 'Un secreto' },
        { emoji: '🌳', text: 'Bosque encantado' }, { emoji: '⚡', text: 'Una maldición' }, { emoji: '🎪', text: 'Transformación' },
      ],
    },
    adventure: {
      title: '🗺️ Bingo de aventuras',
      items: [
        { emoji: '🗺️', text: 'Un mapa' }, { emoji: '⛰️', text: 'Una montaña' }, { emoji: '🏝️', text: 'Una isla' },
        { emoji: '🧭', text: 'Una brújula' }, { emoji: '🏕️', text: 'Acampar' }, { emoji: '🔥', text: 'Una fogata' },
        { emoji: '🚣', text: 'Viaje en barca' }, { emoji: '🌊', text: 'Océano o mar' }, { emoji: '🦅', text: 'Animal salvaje' },
        { emoji: '💎', text: 'Tesoro oculto' }, { emoji: '🌲', text: 'Un bosque' }, { emoji: '⚓', text: 'Un barco' },
        { emoji: '🏜️', text: 'Un desierto' }, { emoji: '🧗', text: 'Escalar' }, { emoji: '🎒', text: 'Una mochila' },
        { emoji: '🔦', text: 'Una linterna' }, { emoji: '🗻', text: 'Una cueva' }, { emoji: '🌅', text: 'Amanecer/atardecer' },
        { emoji: '⛺', text: 'Una tienda' }, { emoji: '🎣', text: 'Pescar' }, { emoji: '🦜', text: 'Aves exóticas' },
        { emoji: '💪', text: 'Un reto' }, { emoji: '🏆', text: 'Victoria' }, { emoji: '🤝', text: 'Trabajo en equipo' },
      ],
    },
    mystery: {
      title: '🔍 Bingo de misterio',
      items: [
        { emoji: '🔍', text: 'Una pista' }, { emoji: '🕵️', text: 'Un detective' }, { emoji: '🔐', text: 'Puerta cerrada' },
        { emoji: '🗝️', text: 'Una llave' }, { emoji: '📝', text: 'Una nota' }, { emoji: '🕰️', text: 'Un reloj' },
        { emoji: '👻', text: 'Algo espeluznante' }, { emoji: '🏚️', text: 'Casa antigua' }, { emoji: '🔦', text: 'Búsqueda a oscuras' },
        { emoji: '📖', text: 'Mensaje secreto' }, { emoji: '🎭', text: 'Un sospechoso' }, { emoji: '🔒', text: 'Una caja fuerte' },
        { emoji: '📱', text: 'Una llamada' }, { emoji: '👀', text: 'Alguien observa' }, { emoji: '🚪', text: 'Puerta oculta' },
        { emoji: '📷', text: 'Una prueba' }, { emoji: '🌙', text: 'Escena nocturna' }, { emoji: '🕷️', text: 'Telarañas' },
        { emoji: '📜', text: 'Mapa antiguo' }, { emoji: '🔊', text: 'Sonido extraño' }, { emoji: '🧩', text: 'Un acertijo' },
        { emoji: '💡', text: 'Un descubrimiento' }, { emoji: '❓', text: 'Una pregunta' }, { emoji: '✅', text: '¡Caso resuelto!' },
      ],
    },
    animal: {
      title: '🦁 Bingo de animales',
      items: [
        { emoji: '🦁', text: 'Un león' }, { emoji: '🐘', text: 'Un elefante' }, { emoji: '🦊', text: 'Un zorro' },
        { emoji: '🐻', text: 'Un oso' }, { emoji: '🦉', text: 'Un búho' }, { emoji: '🐰', text: 'Un conejo' },
        { emoji: '🐺', text: 'Un lobo' }, { emoji: '🦅', text: 'Un águila' }, { emoji: '🐢', text: 'Una tortuga' },
        { emoji: '🦌', text: 'Un ciervo' }, { emoji: '🐿️', text: 'Una ardilla' }, { emoji: '🦜', text: 'Un loro' },
        { emoji: '🐼', text: 'Un panda' }, { emoji: '🦒', text: 'Una jirafa' }, { emoji: '🐨', text: 'Un koala' },
        { emoji: '🦘', text: 'Un canguro' }, { emoji: '🦈', text: 'Un tiburón' }, { emoji: '🐬', text: 'Un delfín' },
        { emoji: '🐧', text: 'Un pingüino' }, { emoji: '🦋', text: 'Una mariposa' }, { emoji: '🐝', text: 'Una abeja' },
        { emoji: '🐜', text: 'Una hormiga' }, { emoji: '🦆', text: 'Un pato' }, { emoji: '🐔', text: 'Una gallina' },
      ],
    },
  },
  fr: {
    fairytale: {
      title: '🏰 Bingo des contes de fées',
      items: [
        { emoji: '👑', text: 'Un roi ou une reine' }, { emoji: '🏰', text: 'Un château' }, { emoji: '🐉', text: 'Un dragon' },
        { emoji: '🧚', text: 'Une fée' }, { emoji: '✨', text: 'Un sort' }, { emoji: '🗡️', text: 'Une épée' },
        { emoji: '👸', text: 'Une princesse' }, { emoji: '🧙', text: 'Un magicien' }, { emoji: '🌹', text: 'Objet enchanté' },
        { emoji: '🐸', text: 'Animal qui parle' }, { emoji: '🪄', text: 'Baguette magique' }, { emoji: '💎', text: 'Un trésor' },
        { emoji: '🌟', text: 'Un vœu' }, { emoji: '🦄', text: 'Créature mythique' }, { emoji: '📜', text: 'Une quête' },
        { emoji: '🔮', text: 'Une prophétie' }, { emoji: '👹', text: 'Un méchant' }, { emoji: '🌙', text: 'Scène de nuit' },
        { emoji: '🎭', text: 'Un déguisement' }, { emoji: '💝', text: 'Le grand amour' }, { emoji: '🔑', text: 'Un secret' },
        { emoji: '🌳', text: 'Forêt enchantée' }, { emoji: '⚡', text: 'Une malédiction' }, { emoji: '🎪', text: 'Transformation' },
      ],
    },
    adventure: {
      title: '🗺️ Bingo aventure',
      items: [
        { emoji: '🗺️', text: 'Une carte' }, { emoji: '⛰️', text: 'Une montagne' }, { emoji: '🏝️', text: 'Une île' },
        { emoji: '🧭', text: 'Une boussole' }, { emoji: '🏕️', text: 'Camping' }, { emoji: '🔥', text: 'Un feu de camp' },
        { emoji: '🚣', text: 'Voyage en bateau' }, { emoji: '🌊', text: 'Océan ou mer' }, { emoji: '🦅', text: 'Animal sauvage' },
        { emoji: '💎', text: 'Trésor caché' }, { emoji: '🌲', text: 'Une forêt' }, { emoji: '⚓', text: 'Un navire' },
        { emoji: '🏜️', text: 'Un désert' }, { emoji: '🧗', text: 'Escalade' }, { emoji: '🎒', text: 'Un sac à dos' },
        { emoji: '🔦', text: 'Une lampe' }, { emoji: '🗻', text: 'Une grotte' }, { emoji: '🌅', text: 'Lever / coucher' },
        { emoji: '⛺', text: 'Une tente' }, { emoji: '🎣', text: 'Pêche' }, { emoji: '🦜', text: 'Oiseaux exotiques' },
        { emoji: '💪', text: 'Un défi' }, { emoji: '🏆', text: 'Victoire' }, { emoji: '🤝', text: "Travail d'équipe" },
      ],
    },
    mystery: {
      title: '🔍 Bingo mystère',
      items: [
        { emoji: '🔍', text: 'Un indice' }, { emoji: '🕵️', text: 'Un détective' }, { emoji: '🔐', text: 'Porte fermée' },
        { emoji: '🗝️', text: 'Une clé' }, { emoji: '📝', text: 'Une note' }, { emoji: '🕰️', text: 'Une horloge' },
        { emoji: '👻', text: "Quelque chose d'effrayant" }, { emoji: '🏚️', text: 'Vieille maison' }, { emoji: '🔦', text: 'Recherche dans le noir' },
        { emoji: '📖', text: 'Message secret' }, { emoji: '🎭', text: 'Un suspect' }, { emoji: '🔒', text: 'Un coffre-fort' },
        { emoji: '📱', text: 'Appel téléphonique' }, { emoji: '👀', text: 'Quelqu\'un observe' }, { emoji: '🚪', text: 'Porte cachée' },
        { emoji: '📷', text: 'Une preuve' }, { emoji: '🌙', text: 'Scène de nuit' }, { emoji: '🕷️', text: 'Toiles d\'araignée' },
        { emoji: '📜', text: 'Vieille carte' }, { emoji: '🔊', text: 'Bruit étrange' }, { emoji: '🧩', text: 'Une énigme' },
        { emoji: '💡', text: 'Une découverte' }, { emoji: '❓', text: 'Une question' }, { emoji: '✅', text: 'Affaire résolue !' },
      ],
    },
    animal: {
      title: '🦁 Bingo des animaux',
      items: [
        { emoji: '🦁', text: 'Un lion' }, { emoji: '🐘', text: 'Un éléphant' }, { emoji: '🦊', text: 'Un renard' },
        { emoji: '🐻', text: 'Un ours' }, { emoji: '🦉', text: 'Un hibou' }, { emoji: '🐰', text: 'Un lapin' },
        { emoji: '🐺', text: 'Un loup' }, { emoji: '🦅', text: 'Un aigle' }, { emoji: '🐢', text: 'Une tortue' },
        { emoji: '🦌', text: 'Un cerf' }, { emoji: '🐿️', text: 'Un écureuil' }, { emoji: '🦜', text: 'Un perroquet' },
        { emoji: '🐼', text: 'Un panda' }, { emoji: '🦒', text: 'Une girafe' }, { emoji: '🐨', text: 'Un koala' },
        { emoji: '🦘', text: 'Un kangourou' }, { emoji: '🦈', text: 'Un requin' }, { emoji: '🐬', text: 'Un dauphin' },
        { emoji: '🐧', text: 'Un manchot' }, { emoji: '🦋', text: 'Un papillon' }, { emoji: '🐝', text: 'Une abeille' },
        { emoji: '🐜', text: 'Une fourmi' }, { emoji: '🦆', text: 'Un canard' }, { emoji: '🐔', text: 'Une poule' },
      ],
    },
  },
};

const FREE_SPACE_TEXT: Record<Language, string> = {
  en: 'FREE SPACE',
  es: 'ESPACIO LIBRE',
  fr: 'CASE LIBRE',
};

const BADGE_NAMES: Record<Language, Record<string, string>> = {
  en: {
    first: 'First Mark', five: 'Five Marks', half: 'Half Card',
    bingo: 'First Bingo', fullcard: 'Full Card', explorer: 'Card Explorer',
  },
  es: {
    first: 'Primera marca', five: 'Cinco marcas', half: 'Media tarjeta',
    bingo: 'Primer bingo', fullcard: 'Tarjeta completa', explorer: 'Explorador',
  },
  fr: {
    first: 'Première case', five: 'Cinq cases', half: 'Demi-carte',
    bingo: 'Premier bingo', fullcard: 'Carte pleine', explorer: 'Explorateur',
  },
};

const TRANSLATIONS = {
  en: {
    title: "Eva's Reading Bingo Adventure",
    subtitle: 'Mark off story elements as you read and collect amazing badges!',
    howToPlay: '📖 How to Play:',
    howToList: [
      'Pick a bingo card theme below',
      'Read a story with someone',
      'Click squares when you find those elements',
      'Get 5 in a row to win!',
      'Collect badges for achievements',
    ],
    centerNote: '💡 The center square is FREE! You can also win by filling the whole card!',
    chooseTheme: 'Choose Your Theme:',
    marked: 'Marked',
    badges: 'Badges',
    progress: 'Progress',
    checkBingo: 'Check for Bingo!',
    newCard: 'New Card',
    clearAll: 'Clear All',
    noBingo: 'No BINGO yet! Keep reading and marking squares!',
    winHeading: "BINGO! You're a Reading Champion!",
    badgeCollection: 'Your Badge Collection',
  },
  es: {
    title: 'Bingo de lectura con Eva',
    subtitle: '¡Marca los elementos de la historia mientras lees y consigue insignias geniales!',
    howToPlay: '📖 Cómo jugar:',
    howToList: [
      'Elige un tema de cartón de bingo',
      'Lee una historia con alguien',
      'Pulsa las casillas cuando encuentres esos elementos',
      '¡Consigue 5 en fila para ganar!',
      'Colecciona insignias por tus logros',
    ],
    centerNote: '💡 ¡La casilla central es GRATIS! ¡También ganas si rellenas el cartón entero!',
    chooseTheme: 'Elige tu tema:',
    marked: 'Marcadas',
    badges: 'Insignias',
    progress: 'Progreso',
    checkBingo: '¡Comprobar bingo!',
    newCard: 'Cartón nuevo',
    clearAll: 'Borrar todo',
    noBingo: '¡Aún no hay BINGO! Sigue leyendo y marcando casillas.',
    winHeading: '¡BINGO! ¡Eres un campeón de la lectura!',
    badgeCollection: 'Tu colección de insignias',
  },
  fr: {
    title: 'Bingo de lecture avec Eva',
    subtitle: 'Coche les éléments de l\'histoire en lisant et collectionne des badges !',
    howToPlay: '📖 Comment jouer :',
    howToList: [
      'Choisis un thème de carton de bingo',
      'Lis une histoire avec quelqu\'un',
      'Clique sur les cases quand tu trouves les éléments',
      'Obtiens 5 d\'affilée pour gagner !',
      'Collectionne des badges pour tes réussites',
    ],
    centerNote: '💡 La case centrale est GRATUITE ! Tu peux aussi gagner en remplissant tout le carton !',
    chooseTheme: 'Choisis ton thème :',
    marked: 'Cochées',
    badges: 'Badges',
    progress: 'Progression',
    checkBingo: 'Vérifier le bingo !',
    newCard: 'Nouveau carton',
    clearAll: 'Tout effacer',
    noBingo: 'Pas encore de BINGO ! Continue de lire et de cocher des cases.',
    winHeading: 'BINGO ! Tu es un champion de la lecture !',
    badgeCollection: 'Ta collection de badges',
  },
};

const BADGE_DEFS: { id: string; emoji: string; condition: 'marks' | 'bingo' | 'fullcard' | 'themes'; value: number }[] = [
  { id: 'first', emoji: '⭐', condition: 'marks', value: 1 },
  { id: 'five', emoji: '🌟', condition: 'marks', value: 5 },
  { id: 'half', emoji: '💫', condition: 'marks', value: 12 },
  { id: 'bingo', emoji: '🎯', condition: 'bingo', value: 1 },
  { id: 'fullcard', emoji: '🏆', condition: 'fullcard', value: 1 },
  { id: 'explorer', emoji: '🗺️', condition: 'themes', value: 2 },
];

export default function BingoDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const toast = useToast();
  const themes = THEMES[language] ?? THEMES.en;
  const freeSpace: Item = { emoji: '⭐', text: FREE_SPACE_TEXT[language], free: true };

  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('fairytale');
  const [completedSquares, setCompletedSquares] = useState<Set<number>>(new Set([12]));
  const [hasBingo, setHasBingo] = useState(false);
  const [bingoLines, setBingoLines] = useState<BingoLine[]>([]);
  const [currentCard, setCurrentCard] = useState<Item[]>([]);
  const [bingoCount, setBingoCount] = useState(0);
  const [fullCardCount, setFullCardCount] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());
  const [themesPlayed, setThemesPlayed] = useState<Set<ThemeKey>>(new Set(['fairytale']));

  const generateCard = useCallback(() => {
    const theme = themes[currentTheme];
    const shuffled = [...theme.items].sort(() => Math.random() - 0.5);
    const newCard = shuffled.slice(0, 24);
    newCard.splice(12, 0, freeSpace);
    setCurrentCard(newCard);
    setCompletedSquares(new Set([12]));
    setHasBingo(false);
    setBingoLines([]);
  }, [currentTheme, themes, freeSpace]);

  // Rebuild card whenever language changes so labels match the active locale
  useEffect(() => {
    generateCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme, language]);

  useEffect(() => {
    BADGE_DEFS.forEach((badge) => {
      let unlock = false;
      switch (badge.condition) {
        case 'marks': unlock = completedSquares.size >= badge.value; break;
        case 'bingo': unlock = bingoCount >= badge.value; break;
        case 'fullcard': unlock = fullCardCount >= badge.value; break;
        case 'themes': unlock = themesPlayed.size >= badge.value; break;
      }
      if (unlock && !unlockedBadges.has(badge.id)) {
        setUnlockedBadges((prev) => new Set([...prev, badge.id]));
      }
    });
  }, [completedSquares, bingoCount, fullCardCount, themesPlayed, unlockedBadges]);

  const checkForBingo = (): BingoLine[] => {
    const lines: BingoLine[] = [];
    const size = 5;
    for (let row = 0; row < size; row++) {
      const idx = Array.from({ length: size }, (_, i) => row * size + i);
      if (idx.every((i) => completedSquares.has(i))) lines.push({ type: 'row', index: row + 1 });
    }
    for (let col = 0; col < size; col++) {
      const idx = Array.from({ length: size }, (_, i) => col + i * size);
      if (idx.every((i) => completedSquares.has(i))) lines.push({ type: 'col', index: col + 1 });
    }
    const d1 = [0, 6, 12, 18, 24];
    if (d1.every((i) => completedSquares.has(i))) lines.push({ type: 'diag', index: 1 });
    const d2 = [4, 8, 12, 16, 20];
    if (d2.every((i) => completedSquares.has(i))) lines.push({ type: 'diag', index: 2 });
    return lines;
  };

  const handleCheckBingo = () => {
    const lines = checkForBingo();
    setBingoLines(lines);
    setHasBingo(lines.length > 0);
    if (completedSquares.size === 25) setFullCardCount((p) => p + 1);
    if (lines.length > 0) setBingoCount((p) => p + lines.length);
    if (lines.length === 0) toast(t.noBingo);
  };

  const toggleSquare = (index: number) => {
    if (currentCard[index]?.free) return;
    const next = new Set(completedSquares);
    if (next.has(index)) next.delete(index); else next.add(index);
    setCompletedSquares(next);
  };

  const changeTheme = (theme: ThemeKey) => {
    setCurrentTheme(theme);
    setThemesPlayed((prev) => new Set([...prev, theme]));
  };

  const isInBingoLine = (index: number) =>
    bingoLines.some((line) => {
      if (line.type === 'row') return Math.floor(index / 5) === line.index - 1;
      if (line.type === 'col') return index % 5 === line.index - 1;
      if (line.type === 'diag') {
        if (line.index === 1) return [0, 6, 12, 18, 24].includes(index);
        if (line.index === 2) return [4, 8, 12, 16, 20].includes(index);
      }
      return false;
    });

  const progress = Math.round((completedSquares.size / 25) * 100);
  const badgeNames = BADGE_NAMES[language] ?? BADGE_NAMES.en;

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">{t.title}</h3>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">📚🎯</div>
      </div>

      <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 mb-6 border-4 border-orange-300">
        <h4 className="font-bold text-lg mb-3 text-orange-700">{t.howToPlay}</h4>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          {t.howToList.map((line, i) => <li key={i}>{line}</li>)}
        </ol>
        <div className="mt-4 p-3 bg-yellow-200 rounded-lg font-semibold text-sm text-orange-900">
          {t.centerNote}
        </div>
      </Card>

      <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <h4 className="font-bold text-lg mb-3 text-purple-700">{t.chooseTheme}</h4>
        <div className="flex flex-wrap gap-3 mb-4">
          {(Object.keys(themes) as ThemeKey[]).map((themeKey) => (
            <Button
              key={themeKey}
              onClick={() => changeTheme(themeKey)}
              className={`rounded-full ${
                currentTheme === themeKey
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {themes[themeKey].title}
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

      <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl p-6 mb-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-center text-white mb-4">{themes[currentTheme].title}</h3>
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
              <span className="leading-tight">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">{t.progress}: {completedSquares.size}/25</div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-6 transition-all duration-500 flex items-center justify-center text-white text-sm font-bold"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      </div>

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

      {hasBingo && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white rounded-2xl p-8 mb-6 text-center animate-pulse shadow-2xl">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-2">{t.winHeading}</h2>
          <div className="text-6xl mb-4">🎉🏆🎊</div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-center text-white mb-4">
          <Award className="inline w-6 h-6 mr-2" />
          {t.badgeCollection}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {BADGE_DEFS.map((badge) => (
            <div
              key={badge.id}
              className={`bg-white rounded-xl p-4 text-center transition-all ${
                unlockedBadges.has(badge.id) ? 'opacity-100 hover:scale-110 cursor-pointer shadow-lg' : 'opacity-30 grayscale'
              }`}
            >
              <div className="text-4xl mb-2">{badge.emoji}</div>
              <div className="text-xs font-bold text-gray-800">{badgeNames[badge.id]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
