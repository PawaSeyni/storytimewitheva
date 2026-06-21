import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, Lightbulb, Eye, ChevronRight } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';

type Scramble = { scrambled: string; answer: string; emoji: string; hint: string };
type Pair = { id: number; name: string };
type Riddle = { q: string; a: string; hint: string };
type LogicPuzzle = {
  description: string;
  clues: string[];
  question: string;
  answer: string;
  hint: string;
};

// Per-language scramble pools - the scramble + answer pair must be in the same language.
const SCRAMBLED_BY_LANG: Record<Language, Scramble[]> = {
  en: [
    { scrambled: 'KNITHG', answer: 'KNIGHT', emoji: '⚔️', hint: 'A warrior in shining armor who serves a king or queen.' },
    { scrambled: 'GICALMA', answer: 'MAGICAL', emoji: '✨', hint: 'Describes something with mysterious enchanted powers.' },
    { scrambled: 'REUSTAER', answer: 'TREASURE', emoji: '💰', hint: 'What pirates bury and adventurers seek: gold, gems, and other riches.' },
    { scrambled: 'TEROFS', answer: 'FOREST', emoji: '🌲', hint: 'A large area full of trees where animals live.' },
    { scrambled: 'DRIBS', answer: 'BIRDS', emoji: '🐦', hint: 'Feathered creatures that fly through the sky and sing songs.' },
    { scrambled: 'EVASEL', answer: 'LEAVES', emoji: '🍃', hint: 'Green flat parts of a plant that grow on branches.' },
    { scrambled: 'RVIRE', answer: 'RIVER', emoji: '🏞️', hint: 'A long flowing body of water that runs to the sea.' },
    { scrambled: 'WOLFER', answer: 'FLOWER', emoji: '🌸', hint: 'The colorful part of a plant that bees love to visit.' },
    { scrambled: 'SSKNINED', answer: 'KINDNESS', emoji: '💛', hint: 'Being caring and gentle toward others, the way Eva treats her friends.' },
    { scrambled: 'ROUGACE', answer: 'COURAGE', emoji: '🦁', hint: 'The bravery to do something even when you feel a little scared.' },
    { scrambled: 'RWONDE', answer: 'WONDER', emoji: '🌟', hint: 'The feeling of amazement when you see something magical.' },
    { scrambled: 'DRNEFIS', answer: 'FRIENDS', emoji: '🤝', hint: 'People who care about each other and love to play together.' },
    { scrambled: 'ACEON', answer: 'OCEAN', emoji: '🌊', hint: 'The huge salty body of water that covers most of our planet.' },
  ],
  es: [
    { scrambled: 'BLEACALOR', answer: 'CABALLERO', emoji: '⚔️', hint: 'Un guerrero con armadura brillante que sirve a un rey o una reina.' },
    { scrambled: 'GMICAO', answer: 'MAGICO', emoji: '✨', hint: 'Algo con misteriosos poderes encantados (sin tilde).' },
    { scrambled: 'OTSREO', answer: 'TESORO', emoji: '💰', hint: 'Lo que los piratas entierran y los aventureros buscan: oro, gemas y otras riquezas.' },
    { scrambled: 'VASEL', answer: 'SELVA', emoji: '🌿', hint: 'Un bosque muy denso y verde donde viven muchos animales.' },
    { scrambled: 'ABORL', answer: 'ARBOL', emoji: '🌳', hint: 'Planta grande con tronco, ramas y hojas (sin tilde).' },
    { scrambled: 'LOOB', answer: 'LOBO', emoji: '🐺', hint: 'Animal salvaje que aulla a la luna y aparece en muchos cuentos.' },
    { scrambled: 'LORF', answer: 'FLOR', emoji: '🌸', hint: 'La parte colorida de una planta que visitan las abejas.' },
    { scrambled: 'BSOQUE', answer: 'BOSQUE', emoji: '🌲', hint: 'Un lugar lleno de arboles donde viven los animales del cuento.' },
    { scrambled: 'LLSATERE', answer: 'ESTRELLA', emoji: '⭐', hint: 'Punto de luz brillante que ves en el cielo por la noche.' },
    { scrambled: 'DANDOB', answer: 'BONDAD', emoji: '💛', hint: 'La cualidad de ser amable y generoso con los demas (sin tilde).' },
    { scrambled: 'NARUTAVE', answer: 'AVENTURA', emoji: '🗺️', hint: 'Un viaje emocionante lleno de sorpresas y descubrimientos.' },
    { scrambled: 'LAENVIET', answer: 'VALIENTE', emoji: '🦁', hint: 'Quien tiene valor para hacer algo aunque tenga miedo.' },
    { scrambled: 'SCPEE', answer: 'PECES', emoji: '🐟', hint: 'Animales que viven en el agua y nadan con sus aletas.' },
  ],
  fr: [
    { scrambled: 'VHEACILER', answer: 'CHEVALIER', emoji: '⚔️', hint: 'Un guerrier en armure brillante qui sert un roi ou une reine.' },
    { scrambled: 'IQEUGAM', answer: 'MAGIQUE', emoji: '✨', hint: 'Décrit quelque chose qui a de mystérieux pouvoirs enchantés.' },
    { scrambled: 'ROSTER', answer: 'TRESOR', emoji: '💰', hint: 'Ce que les pirates enterrent et que les aventuriers cherchent : or, gemmes et autres richesses (sans accent).' },
    { scrambled: 'TEROF', answer: 'FORET', emoji: '🌲', hint: 'Une grande etendue pleine d\'arbres ou vivent les animaux (sans accent).' },
    { scrambled: 'UOEIAS', answer: 'OISEAU', emoji: '🐦', hint: 'Une creature a plumes qui vole et chante dans le ciel.' },
    { scrambled: 'EUFIELL', answer: 'FEUILLE', emoji: '🍃', hint: 'La partie verte et plate d\'une plante qui pousse sur les branches.' },
    { scrambled: 'IVIREER', answer: 'RIVIERE', emoji: '🏞️', hint: 'Un long cours d\'eau qui coule vers la mer.' },
    { scrambled: 'LUFRE', answer: 'FLEUR', emoji: '🌸', hint: 'La partie coloree d\'une plante que les abeilles adorent visiter.' },
    { scrambled: 'CENOA', answer: 'OCEAN', emoji: '🌊', hint: 'La grande etendue d\'eau salee qui couvre la majeure partie de notre planete.' },
    { scrambled: 'AGCREOU', answer: 'COURAGE', emoji: '🦁', hint: 'La bravoure necessaire pour faire quelque chose meme quand on a un peu peur.' },
    { scrambled: 'EILLMEVER', answer: 'MERVEILLE', emoji: '🌟', hint: 'Ce qu\'on ressent face a quelque chose de magique et d\'etonnant.' },
    { scrambled: 'IAMITE', answer: 'AMITIE', emoji: '🤝', hint: 'Le lien qui unit des personnes qui se font confiance et jouent ensemble.' },
    { scrambled: 'URTENAVE', answer: 'AVENTURE', emoji: '🗺️', hint: 'Un voyage excitant plein de surprises et de decouvertes.' },
  ],
};

const RIDDLES_BY_LANG: Record<Language, Riddle[]> = {
  en: [
    { q: "I have a crown but I'm not a king. I live in a tower and sometimes I sing. Who am I?", a: 'A Princess! 👑', hint: 'Royal, lives in a castle tower, often the hero of fairy tales.' },
    { q: 'I breathe fire and have scales so bright, I guard treasure both day and night. What am I?', a: 'A Dragon! 🐉', hint: 'A scaly, fire-breathing creature from fantasy stories.' },
    { q: "I'm not real but I feel true, I take you to worlds shiny and new. You find me in books, what am I to you?", a: 'A Story! 📚', hint: "Made of words on pages: you are inside one right now!" },
    { q: 'I wear a pointy hat and cast spells with my wand, I make magic happen with a wave and beyond. Who am I?', a: 'A Wizard! 🧙‍♂️', hint: 'Think of Merlin or Gandalf: uses wands and spells.' },
    { q: 'I come out at night with wings so small, I grant wishes when you call. Sprinkle dust and you might fly. What am I, floating in the sky?', a: 'A Fairy! 🧚', hint: 'Tiny, winged, sprinkles pixie dust.' },
    { q: 'I have no legs but I can run, I start at the mountain and shine in the sun. I flow through forests and fields of green. What am I?', a: 'A River! 🏞️', hint: 'Think about water that moves and flows through the land.' },
    { q: 'I am full of stories but I have no mouth. I can travel the world but I never leave the shelf. What am I?', a: 'A Book! 📖', hint: 'You hold me in your hands when you want to learn or dream.' },
    { q: 'I grow from a tiny seed, reach up to the sky, give shade in summer, and never say goodbye. What am I?', a: 'A Tree! 🌳', hint: 'Tall, has leaves and branches, birds build nests in me.' },
    { q: 'I buzz and I hum and I make something sweet, the flowers I visit are all quite a treat. What am I?', a: 'A Bee! 🐝', hint: 'I make honey and I love visiting flowers.' },
    { q: 'I can roar like thunder but I never get wet. I live in the sky but I am not a bird yet. What am I?', a: 'A Cloud! ⛅', hint: 'Fluffy and white in fair weather, dark and loud in a storm.' },
    { q: 'I wear a shell upon my back, I travel slowly down the track. My home goes everywhere I roam. What am I?', a: 'A Snail! 🐌', hint: 'Very slow, has a spiral shell, leaves a shiny trail.' },
  ],
  es: [
    { q: 'Tengo una corona pero no soy un rey. Vivo en una torre y a veces canto. ¿Quién soy?', a: '¡Una princesa! 👑', hint: 'De la realeza, vive en una torre, suele ser la heroína de los cuentos de hadas.' },
    { q: 'Echo fuego y tengo escamas brillantes, guardo tesoros día y noche. ¿Qué soy?', a: '¡Un dragón! 🐉', hint: 'Una criatura con escamas que escupe fuego, de los cuentos de fantasía.' },
    { q: 'No soy real, pero parezco verdad; te llevo a mundos por descubrir. Me encuentras en libros, ¿qué soy para ti?', a: '¡Un cuento! 📚', hint: '¡Hecho de palabras en páginas: ahora mismo estás dentro de uno!' },
    { q: 'Llevo un sombrero puntiagudo y lanzo hechizos con mi varita, hago magia con un gesto y más allá. ¿Quién soy?', a: '¡Un mago! 🧙‍♂️', hint: 'Piensa en Merlín o Gandalf: usan varita y hechizos.' },
    { q: 'Salgo de noche con alitas pequeñas, cumplo deseos cuando me llaman. Esparzo polvillo y a volar. ¿Qué soy, allí en el cielo?', a: '¡Un hada! 🧚', hint: 'Diminuta, con alas, esparce polvo mágico.' },
    { q: 'No tengo piernas pero puedo correr, empiezo en la montaña y brillo al amanecer. Atravieso bosques y prados verdes. ¿Qué soy?', a: '¡Un río! 🏞️', hint: 'Piensa en el agua que fluye y corre por la tierra.' },
    { q: 'Estoy lleno de historias pero no tengo boca. Puedo viajar por el mundo pero nunca salgo del estante. ¿Qué soy?', a: '¡Un libro! 📖', hint: 'Me tienes en tus manos cuando quieres aprender o soñar.' },
    { q: 'Crezco de una semillita, llego hasta el cielo, doy sombra en verano y nunca me voy. ¿Qué soy?', a: '¡Un árbol! 🌳', hint: 'Alto, tiene hojas y ramas, los pájaros hacen nidos en mí.' },
    { q: 'Zumbo y vibro y produzco algo dulce, las flores que visito son todo un festín. ¿Qué soy?', a: '¡Una abeja! 🐝', hint: 'Hago miel y me encantan las flores.' },
    { q: 'Llevo una concha en la espalda, camino despacio por el camino. Mi casa va a todas partes conmigo. ¿Qué soy?', a: '¡Un caracol! 🐌', hint: 'Muy lento, tiene una concha en espiral, deja un rastro brillante.' },
    { q: 'Puedo rugir como el trueno pero nunca me mojo. Vivo en el cielo pero no soy un pájaro. ¿Qué soy?', a: '¡Una nube! ⛅', hint: 'Esponjosa y blanca cuando hace buen tiempo, oscura y ruidosa en tormenta.' },
  ],
  fr: [
    { q: 'J\'ai une couronne mais je ne suis pas roi. Je vis dans une tour et parfois je chante. Qui suis-je ?', a: 'Une princesse ! 👑', hint: 'De sang royal, vit dans une tour, souvent l\'héroïne des contes de fées.' },
    { q: 'Je crache du feu et j\'ai des écailles brillantes, je garde un trésor jour et nuit. Qui suis-je ?', a: 'Un dragon ! 🐉', hint: 'Une créature à écailles qui crache du feu, venue des contes fantastiques.' },
    { q: 'Je ne suis pas réelle mais je semble vraie, je t\'emmène dans des mondes nouveaux. Tu me trouves dans les livres, qui suis-je pour toi ?', a: 'Une histoire ! 📚', hint: 'Faite de mots sur des pages : tu es en train d\'en lire une !' },
    { q: 'Je porte un chapeau pointu et je jette des sorts avec ma baguette, je fais de la magie d\'un geste et plus encore. Qui suis-je ?', a: 'Un magicien ! 🧙‍♂️', hint: 'Pense à Merlin ou Gandalf : baguette et sortilèges.' },
    { q: 'Je sors la nuit avec de minuscules ailes, j\'exauce les vœux quand on m\'appelle. Saupoudre de la poussière et tu pourrais voler. Qui suis-je, là-haut dans le ciel ?', a: 'Une fée ! 🧚', hint: 'Toute petite, ailée, saupoudre de la poudre magique.' },
    { q: 'Je n\'ai pas de jambes mais je peux courir, je pars de la montagne et brille au soleil. Je traverse forêts et prairies vertes. Qui suis-je ?', a: 'Une rivière ! 🏞️', hint: 'Pense à l\'eau qui coule et s\'écoule à travers les paysages.' },
    { q: 'Je suis plein d\'histoires mais je n\'ai pas de bouche. Je peux voyager dans le monde entier mais je ne quitte jamais l\'étagère. Qui suis-je ?', a: 'Un livre ! 📖', hint: 'Tu me tiens dans les mains quand tu veux apprendre ou rêver.' },
    { q: 'Je pousse d\'une toute petite graine, je monte jusqu\'au ciel, je donne de l\'ombre en été et je ne pars jamais. Qui suis-je ?', a: 'Un arbre ! 🌳', hint: 'Grand, a des feuilles et des branches, les oiseaux font leurs nids en moi.' },
    { q: 'Je bourdonne et je fredonne et je produis quelque chose de sucré, les fleurs que je visite sont un vrai régal. Qui suis-je ?', a: 'Une abeille ! 🐝', hint: 'Je fais du miel et j\'adore les fleurs.' },
    { q: 'Je porte une coquille sur mon dos, j\'avance lentement sur le chemin. Ma maison m\'accompagne partout où je vais. Qui suis-je ?', a: 'Un escargot ! 🐌', hint: 'Très lent, a une coquille en spirale, laisse une trace brillante.' },
    { q: 'Je peux gronder comme le tonnerre mais je ne me mouille jamais. Je vis dans le ciel mais je ne suis pas un oiseau. Qui suis-je ?', a: 'Un nuage ! ⛅', hint: 'Blanc et moelleux par beau temps, sombre et bruyant pendant une tempête.' },
  ],
};

const CHARACTERS_BY_LANG: Record<Language, Pair[]> = {
  en: [
    { id: 1, name: 'Red Riding Hood 🧺' },
    { id: 2, name: 'Cinderella 👗' },
    { id: 3, name: 'Jack 🌱' },
    { id: 4, name: 'Snow White 🍎' },
    { id: 5, name: 'Hansel 🍬' },
    { id: 6, name: 'Sleeping Beauty 🌹' },
    { id: 7, name: 'Pinocchio 🪵' },
    { id: 8, name: 'The Ugly Duckling 🦢' },
  ],
  es: [
    { id: 1, name: 'Caperucita Roja 🧺' },
    { id: 2, name: 'Cenicienta 👗' },
    { id: 3, name: 'Juan 🌱' },
    { id: 4, name: 'Blancanieves 🍎' },
    { id: 5, name: 'Hansel 🍬' },
    { id: 6, name: 'La Bella Durmiente 🌹' },
    { id: 7, name: 'Pinocho 🪵' },
    { id: 8, name: 'El Patito Feo 🦢' },
  ],
  fr: [
    { id: 1, name: 'Le Petit Chaperon Rouge 🧺' },
    { id: 2, name: 'Cendrillon 👗' },
    { id: 3, name: 'Jack 🌱' },
    { id: 4, name: 'Blanche-Neige 🍎' },
    { id: 5, name: 'Hansel 🍬' },
    { id: 6, name: 'La Belle au Bois Dormant 🌹' },
    { id: 7, name: 'Pinocchio 🪵' },
    { id: 8, name: 'Le Vilain Petit Canard 🦢' },
  ],
};

const STORIES_BY_LANG: Record<Language, Pair[]> = {
  en: [
    { id: 3, name: 'Beanstalk 🏰' },
    { id: 1, name: 'Wolf & Grandma 🐺' },
    { id: 4, name: 'Seven Dwarfs ⛏️' },
    { id: 2, name: 'Glass Slipper 👠' },
    { id: 6, name: 'Spinning Wheel 🌀' },
    { id: 8, name: 'Becomes a Swan 🦢' },
    { id: 5, name: 'Gingerbread House 🏠' },
    { id: 7, name: 'Nose Grows 👃' },
  ],
  es: [
    { id: 3, name: 'Habichuelas mágicas 🏰' },
    { id: 1, name: 'Lobo y abuelita 🐺' },
    { id: 4, name: 'Siete enanitos ⛏️' },
    { id: 2, name: 'Zapatilla de cristal 👠' },
    { id: 6, name: 'Rueca encantada 🌀' },
    { id: 8, name: 'Se convierte en cisne 🦢' },
    { id: 5, name: 'Casa de caramelo 🏠' },
    { id: 7, name: 'La nariz crece 👃' },
  ],
  fr: [
    { id: 3, name: 'Haricot magique 🏰' },
    { id: 1, name: 'Loup & Grand-mère 🐺' },
    { id: 4, name: 'Sept Nains ⛏️' },
    { id: 2, name: 'Pantoufle de verre 👠' },
    { id: 6, name: 'Rouet enchanté 🌀' },
    { id: 8, name: 'Devient un cygne 🦢' },
    { id: 5, name: 'Maison en pain d\'épice 🏠' },
    { id: 7, name: 'Le nez qui grandit 👃' },
  ],
};

// Array of logic puzzles per language (puzzle at index i is the same puzzle in all languages)
const LOGIC_PUZZLES_BY_LANG: Record<Language, LogicPuzzle[]> = {
  en: [
    {
      description: 'Three friends went on an adventure. Each found a different magical item.',
      clues: [
        "Emma didn't find the sword",
        'The person who found the crown lives in a castle',
        'Oliver found the magical sword',
        'Sophia lives in the enchanted forest',
      ],
      question: 'Question: Who found the crown?',
      answer: 'EMMA',
      hint: "If Oliver has the sword, Sophia lives in the forest (not a castle), and the crown's owner lives in a castle: who is left?",
    },
    {
      description: 'Three animals live on a farm. Each animal has a favorite food.',
      clues: [
        'The pig does not eat carrots',
        'The rabbit eats the crunchy orange vegetable',
        'The horse eats hay',
        'The pig eats something sweet and round',
      ],
      question: 'Question: What does the pig eat?',
      answer: 'APPLE',
      hint: 'The rabbit eats carrots. The horse eats hay. What sweet round food is left for the pig?',
    },
    {
      description: 'Four children each chose a different color for their kite.',
      clues: [
        'Mia chose either red or blue',
        'Leo did not choose yellow',
        'Zoe chose green',
        'Mia did not choose red',
        'Leo chose red',
      ],
      question: "Question: What color is Mia's kite?",
      answer: 'BLUE',
      hint: 'Zoe has green, Leo has red. Mia wanted red or blue, but red is taken: what color is left for Mia?',
    },
  ],
  es: [
    {
      description: 'Tres amigos salieron de aventura. Cada uno encontró un objeto mágico diferente.',
      clues: [
        'Emma no encontró la espada',
        'La persona que encontró la corona vive en un castillo',
        'Oliver encontró la espada mágica',
        'Sophia vive en el bosque encantado',
      ],
      question: 'Pregunta: ¿Quién encontró la corona?',
      answer: 'EMMA',
      hint: 'Si Oliver tiene la espada y Sophia vive en el bosque (no en un castillo), y quien tiene la corona vive en un castillo, ¿quién queda?',
    },
    {
      description: 'Tres animales viven en una granja. Cada uno tiene una comida favorita.',
      clues: [
        'El cerdo no come zanahorias',
        'El conejo come la verdura naranja y crujiente',
        'El caballo come heno',
        'El cerdo come algo dulce y redondo',
      ],
      question: 'Pregunta: ¿Qué come el cerdo?',
      answer: 'MANZANA',
      hint: 'El conejo come zanahorias. El caballo come heno. ¿Qué comida dulce y redonda le queda al cerdo?',
    },
    {
      description: 'Cuatro niños eligieron un color diferente para su cometa.',
      clues: [
        'Mia eligió rojo o azul',
        'Leo no eligió amarillo',
        'Zoe eligió verde',
        'Mia no eligió rojo',
        'Leo eligió rojo',
      ],
      question: 'Pregunta: ¿De qué color es la cometa de Mia?',
      answer: 'AZUL',
      hint: 'Zoe tiene verde y Leo tiene rojo. Mia quería rojo o azul, pero el rojo ya está tomado: ¿qué color le queda a Mia?',
    },
  ],
  fr: [
    {
      description: "Trois amis partent à l'aventure. Chacun trouve un objet magique différent.",
      clues: [
        "Emma n'a pas trouvé l'épée",
        'La personne qui a trouvé la couronne vit dans un château',
        "Oliver a trouvé l'épée magique",
        'Sophia vit dans la forêt enchantée',
      ],
      question: 'Question : qui a trouvé la couronne ?',
      answer: 'EMMA',
      hint: "Si Oliver a l'épée et que Sophia vit dans la forêt (pas dans un château), et que le propriétaire de la couronne vit dans un château, qui reste-t-il ?",
    },
    {
      description: 'Trois animaux vivent dans une ferme. Chacun a un aliment préféré.',
      clues: [
        'Le cochon ne mange pas de carottes',
        'Le lapin mange le légume orange et croquant',
        'Le cheval mange du foin',
        'Le cochon mange quelque chose de sucré et de rond',
      ],
      question: 'Question : que mange le cochon ?',
      answer: 'POMME',
      hint: 'Le lapin mange des carottes. Le cheval mange du foin. Quel aliment sucré et rond reste-t-il pour le cochon ?',
    },
    {
      description: 'Quatre enfants ont chacun choisi une couleur différente pour leur cerf-volant.',
      clues: [
        'Mia a choisi le rouge ou le bleu',
        "Leo n'a pas choisi le jaune",
        'Zoe a choisi le vert',
        "Mia n'a pas choisi le rouge",
        'Leo a choisi le rouge',
      ],
      question: 'Question : de quelle couleur est le cerf-volant de Mia ?',
      answer: 'BLEU',
      hint: 'Zoe a le vert et Leo a le rouge. Mia voulait le rouge ou le bleu, mais le rouge est déjà pris : quelle couleur reste-t-il pour Mia ?',
    },
  ],
};

const TRANSLATIONS = {
  en: {
    heading: "Eva's Puzzle Paradise",
    subheading: 'Challenge your mind with fun word games and riddles!',
    howToPlay: '✨ How to Play ✨',
    howToPlaySteps: [
      'Try different puzzle types: word scrambles, riddles, matching, and logic!',
      'Use the 💡 Hint button if you get stuck',
      'After 3 tries, you can see the solution',
      'Complete puzzles to earn points',
      'Solve all four sections to become a Puzzle Master!',
    ],
    completed: 'Puzzles Completed:',
    scrambleHeading: '🔄 Unscramble the Story Words',
    scrambleBlurb: 'Can you figure out these mixed-up storybook words?',
    unscramble: 'Unscramble the word...',
    checkAnswer: 'Check Answer',
    getHint: 'Get Hint',
    attemptsLeft: 'Attempts left:',
    showSolution: 'Show Solution',
    answerIs: 'The answer is:',
    correct: 'Correct! Great job!',
    notQuite: 'Not quite. Try again!',
    riddleHeading: '🤔 Storybook Riddles',
    riddleBlurb: 'Can you solve these clever riddles?',
    showAnswer: 'Show Answer',
    hint: 'Hint',
    matchingHeading: '🔗 Match Characters to Their Stories',
    matchingBlurb: 'Click on a character, then click on their story!',
    characters: 'Characters',
    stories: 'Stories',
    matchingHint: 'Match each fairy-tale character to the thing they are most famous for.',
    perfectMatch: 'Perfect match!',
    notMatch: 'Not a match. Try again!',
    allMatched: '🎉 All matched! Nice work!',
    logicHeading: '🧠 Story Logic Puzzle',
    mystery: 'The Mystery:',
    clues: 'Clues:',
    typeName: 'Type the answer...',
    brilliantLogic: 'Brilliant! You solved it!',
    notQuiteLogic: 'Not quite. Read the clues carefully!',
    masterHeading: 'Great Job, Puzzle Master!',
    masterBlurb: 'Keep practicing to become even smarter!',
    tryAnother: 'Try another puzzle →',
    puzzleNumber: 'Puzzle',
    of: 'of',
  },
  es: {
    heading: 'Paraíso de acertijos de Eva',
    subheading: '¡Pon a prueba tu mente con juegos de palabras y acertijos divertidos!',
    howToPlay: '✨ Cómo se juega ✨',
    howToPlaySteps: [
      '¡Prueba distintos tipos de puzzle: anagramas, acertijos, parejas y lógica!',
      'Usa el botón 💡 Pista si te atascas',
      'Tras 3 intentos puedes ver la solución',
      'Completa puzzles para ganar puntos',
      '¡Resuelve las cuatro secciones para ser maestro del puzzle!',
    ],
    completed: 'Acertijos completados:',
    scrambleHeading: '🔄 Descifra las palabras del cuento',
    scrambleBlurb: '¿Puedes descubrir estas palabras mezcladas?',
    unscramble: 'Descifra la palabra...',
    checkAnswer: 'Comprobar respuesta',
    getHint: 'Pedir pista',
    attemptsLeft: 'Intentos restantes:',
    showSolution: 'Ver solución',
    answerIs: 'La respuesta es:',
    correct: '¡Correcto! ¡Muy bien!',
    notQuite: 'No del todo. ¡Inténtalo de nuevo!',
    riddleHeading: '🤔 Acertijos del cuento',
    riddleBlurb: '¿Puedes resolver estos acertijos ingeniosos?',
    showAnswer: 'Ver respuesta',
    hint: 'Pista',
    matchingHeading: '🔗 Une cada personaje con su cuento',
    matchingBlurb: '¡Pulsa un personaje y luego su cuento!',
    characters: 'Personajes',
    stories: 'Cuentos',
    matchingHint: 'Une cada personaje de cuento con aquello por lo que es más famoso.',
    perfectMatch: '¡Pareja perfecta!',
    notMatch: 'No coincide. ¡Inténtalo de nuevo!',
    allMatched: '🎉 ¡Todo emparejado! ¡Buen trabajo!',
    logicHeading: '🧠 Puzzle de lógica del cuento',
    mystery: 'El misterio:',
    clues: 'Pistas:',
    typeName: 'Escribe la respuesta...',
    brilliantLogic: '¡Genial! ¡Lo resolviste!',
    notQuiteLogic: 'No del todo. ¡Lee las pistas con atención!',
    masterHeading: '¡Buen trabajo, maestro del puzzle!',
    masterBlurb: '¡Sigue practicando para ser aún más listo!',
    tryAnother: 'Prueba otro acertijo →',
    puzzleNumber: 'Acertijo',
    of: 'de',
  },
  fr: {
    heading: "Le paradis des énigmes d'Eva",
    subheading: "Mets ton cerveau à l'épreuve avec des jeux de mots et des énigmes !",
    howToPlay: '✨ Comment ça marche ✨',
    howToPlaySteps: [
      'Essaie différents types de puzzles : anagrammes, énigmes, paires et logique !',
      "Utilise le bouton 💡 Indice si tu es bloqué",
      'Après 3 essais, tu peux voir la solution',
      'Complète les puzzles pour gagner des points',
      'Résous les quatre sections pour devenir maître des énigmes !',
    ],
    completed: 'Énigmes complétées :',
    scrambleHeading: '🔄 Déchiffre les mots du conte',
    scrambleBlurb: 'Peux-tu déchiffrer ces mots mélangés ?',
    unscramble: 'Déchiffre le mot...',
    checkAnswer: 'Vérifier',
    getHint: 'Demander un indice',
    attemptsLeft: 'Essais restants :',
    showSolution: 'Voir la solution',
    answerIs: 'La réponse est :',
    correct: 'Bravo ! Bien joué !',
    notQuite: 'Pas tout à fait. Réessaie !',
    riddleHeading: '🤔 Devinettes du conte',
    riddleBlurb: 'Peux-tu résoudre ces devinettes malines ?',
    showAnswer: 'Voir la réponse',
    hint: 'Indice',
    matchingHeading: '🔗 Associe chaque personnage à son histoire',
    matchingBlurb: 'Clique sur un personnage, puis sur son histoire !',
    characters: 'Personnages',
    stories: 'Histoires',
    matchingHint: 'Associe chaque personnage de conte de fées à ce qui le rend le plus célèbre.',
    perfectMatch: 'Bien associé !',
    notMatch: "Ce n'est pas le bon. Réessaie !",
    allMatched: '🎉 Tout est associé ! Bien joué !',
    logicHeading: '🧠 Puzzle de logique du conte',
    mystery: 'Le mystère :',
    clues: 'Indices :',
    typeName: 'Tape la réponse...',
    brilliantLogic: "Génial ! Tu l'as résolu !",
    notQuiteLogic: 'Pas tout à fait. Relis bien les indices !',
    masterHeading: 'Bravo, maître des énigmes !',
    masterBlurb: "Continue à t'entraîner pour devenir encore plus malin !",
    tryAnother: 'Essaie un autre puzzle →',
    puzzleNumber: 'Puzzle',
    of: 'sur',
  },
} satisfies Record<Language, unknown>;

type Feedback = '' | 'correct' | 'incorrect' | 'revealed';

export default function PuzzleAdventuresDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);

  const scrambledWords = SCRAMBLED_BY_LANG[language] ?? SCRAMBLED_BY_LANG.en;
  const riddles = RIDDLES_BY_LANG[language] ?? RIDDLES_BY_LANG.en;
  const characters = CHARACTERS_BY_LANG[language] ?? CHARACTERS_BY_LANG.en;
  const stories = STORIES_BY_LANG[language] ?? STORIES_BY_LANG.en;
  const logicPuzzles = LOGIC_PUZZLES_BY_LANG[language] ?? LOGIC_PUZZLES_BY_LANG.en;

  // Total scorable items: one per scramble word + one per riddle + matching (1) + logic (1).
  // Drives both the progress denominator and the "Puzzle Master" threshold so they
  // reflect the real puzzle count instead of a hardcoded 8.
  const totalPuzzles = scrambledWords.length + riddles.length + 2;

  // Pick a random starting puzzle index on mount (run once; pools are same length across langs)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialLogicIndex = useMemo(() => Math.floor(Math.random() * logicPuzzles.length), []);
  const [logicIndex, setLogicIndex] = useState(initialLogicIndex);
  const logic = logicPuzzles[logicIndex];

  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Scramble state - sized to the pool
  const [scrambleAnswers, setScrambleAnswers] = useState<string[]>(scrambledWords.map(() => ''));
  const [scrambleFeedback, setScrambleFeedback] = useState<Feedback[]>(scrambledWords.map(() => ''));
  const [scrambleAttempts, setScrambleAttempts] = useState<number[]>(scrambledWords.map(() => 0));
  const [scrambleHints, setScrambleHints] = useState<string[]>(scrambledWords.map(() => ''));

  // Riddles state
  const [riddlesRevealed, setRiddlesRevealed] = useState<Set<number>>(new Set());
  const [riddleHints, setRiddleHints] = useState<Set<number>>(new Set());

  // Matching state
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [matchFeedback, setMatchFeedback] = useState('');
  const [matchHint, setMatchHint] = useState('');

  // Logic state
  const [logicAnswer, setLogicAnswer] = useState('');
  const [logicFeedback, setLogicFeedback] = useState<Feedback>('');
  const [logicHint, setLogicHint] = useState('');
  const [logicAttempts, setLogicAttempts] = useState(0);

  // Clear in-progress answers/feedback when the language changes, so the inputs
  // can't go stale against the now-translated prompts.
  useEffect(() => {
    setScrambleAnswers(scrambledWords.map(() => ''));
    setScrambleFeedback(scrambledWords.map(() => ''));
    setScrambleAttempts(scrambledWords.map(() => 0));
    setScrambleHints(scrambledWords.map(() => ''));
    setRiddlesRevealed(new Set());
    setRiddleHints(new Set());
    setSelectedChar(null);
    setMatchedPairs(new Set());
    setMatchFeedback('');
    setMatchHint('');
    setLogicAnswer('');
    setLogicFeedback('');
    setLogicHint('');
    setLogicAttempts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const updateScore = (key: string) => {
    if (!completed.has(key)) {
      setCompleted((prev) => new Set([...prev, key]));
      setScore((prev) => prev + 1);
    }
  };

  // Scramble
  const checkScramble = (index: number) => {
    const answer = scrambleAnswers[index].toUpperCase().trim();
    const fb = [...scrambleFeedback];
    if (answer === scrambledWords[index].answer) {
      fb[index] = 'correct';
      updateScore(`scramble-${index}`);
    } else {
      fb[index] = 'incorrect';
      const att = [...scrambleAttempts];
      att[index] += 1;
      setScrambleAttempts(att);
    }
    setScrambleFeedback(fb);
  };

  const revealScramble = (index: number) => {
    const fb = [...scrambleFeedback];
    fb[index] = 'revealed';
    setScrambleFeedback(fb);
  };

  const showScrambleHint = (index: number) => {
    const h = [...scrambleHints];
    h[index] = scrambledWords[index].hint;
    setScrambleHints(h);
  };

  // Riddles
  const revealRiddle = (idx: number) => {
    setRiddlesRevealed((prev) => new Set([...prev, idx]));
    updateScore(`riddle-${idx}`);
  };

  const showRiddleHint = (idx: number) => {
    setRiddleHints((prev) => new Set([...prev, idx]));
  };

  // Matching
  const handleStoryClick = (storyId: number) => {
    if (selectedChar === null) return;
    if (selectedChar === storyId) {
      const pairs = new Set([...matchedPairs, selectedChar]);
      setMatchedPairs(pairs);
      setMatchFeedback('correct');
      if (pairs.size === characters.length) {
        updateScore('match-all');
      }
    } else {
      setMatchFeedback('incorrect');
    }
    setSelectedChar(null);
  };

  // Logic
  const checkLogic = () => {
    if (logicAnswer.toUpperCase().trim() === logic.answer) {
      setLogicFeedback('correct');
      updateScore('logic');
    } else {
      setLogicFeedback('incorrect');
      setLogicAttempts((p) => p + 1);
    }
  };

  const goToNextLogicPuzzle = () => {
    setLogicIndex((prev) => (prev + 1) % logicPuzzles.length);
    setLogicAnswer('');
    setLogicFeedback('');
    setLogicHint('');
    setLogicAttempts(0);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-purple-700">{t.heading}</h2>
        <p className="text-gray-700 mb-4">{t.subheading}</p>
        <div className="text-5xl mb-4">🧩🧠</div>
      </div>

      <div className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-2xl p-6 mb-6">
        <h3 className="text-2xl font-bold mb-3 text-center">{t.howToPlay}</h3>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          {t.howToPlaySteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-6 text-center text-xl font-bold mb-6">
        ⭐ {t.completed} {score} / {totalPuzzles}
      </div>

      {/* Scrambled Words */}
      <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl p-6 mb-6 border-4 border-cyan-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.scrambleHeading}</h3>
        <p className="text-center mb-4">{t.scrambleBlurb}</p>

        {scrambledWords.map((word, i) => (
          <div key={i} className="mb-6">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white p-4 rounded-xl text-center text-2xl font-bold tracking-wider mb-3">
              {word.emoji} {word.scrambled}
            </div>

            {scrambleAttempts[i] < 3 && scrambleFeedback[i] !== 'correct' && scrambleFeedback[i] !== 'revealed' && (
              <>
                <Input
                  value={scrambleAnswers[i]}
                  onChange={(e) => {
                    const a = [...scrambleAnswers];
                    a[i] = e.target.value;
                    setScrambleAnswers(a);
                  }}
                  placeholder={t.unscramble}
                  className="mb-3 text-lg"
                />
                <div className="flex gap-2 mb-3">
                  <Button
                    onClick={() => checkScramble(i)}
                    className="flex-1 bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white"
                  >
                    {t.checkAnswer}
                  </Button>
                  <Button
                    onClick={() => showScrambleHint(i)}
                    variant="outline"
                    className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {t.getHint}
                  </Button>
                </div>
                {scrambleAttempts[i] > 0 && (
                  <div className="text-center text-sm text-gray-600 mb-2">
                    {t.attemptsLeft} {3 - scrambleAttempts[i]}
                  </div>
                )}
              </>
            )}

            {scrambleAttempts[i] >= 3 && scrambleFeedback[i] !== 'correct' && scrambleFeedback[i] !== 'revealed' && (
              <Button
                onClick={() => revealScramble(i)}
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white mb-3"
              >
                <Eye className="w-4 h-4 mr-2" />
                {t.showSolution}
              </Button>
            )}

            {scrambleHints[i] && (
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{scrambleHints[i]}</p>
                </div>
              </div>
            )}

            {scrambleFeedback[i] && (
              <div
                className={`mt-3 p-3 rounded-lg text-center font-bold ${
                  scrambleFeedback[i] === 'correct'
                    ? 'bg-green-300 text-green-900'
                    : scrambleFeedback[i] === 'revealed'
                    ? 'bg-orange-300 text-orange-900'
                    : 'bg-red-300 text-red-900'
                }`}
              >
                {scrambleFeedback[i] === 'correct' ? (
                  <>
                    <CheckCircle2 className="inline w-5 h-5 mr-2" />
                    {t.correct}
                  </>
                ) : scrambleFeedback[i] === 'revealed' ? (
                  <>
                    {t.answerIs} <strong>{word.answer}</strong>
                  </>
                ) : (
                  <>
                    <XCircle className="inline w-5 h-5 mr-2" />
                    {t.notQuite}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Riddles */}
      <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-6 mb-6 border-4 border-rose-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.riddleHeading}</h3>
        <p className="text-center mb-4">{t.riddleBlurb}</p>

        {riddles.map((r, idx) => (
          <div key={idx} className="mb-6 bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-800 mb-4 italic">"{r.q}"</p>

            {riddleHints.has(idx) && (
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{r.hint}</p>
                </div>
              </div>
            )}

            {!riddlesRevealed.has(idx) ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => revealRiddle(idx)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t.showAnswer}
                </Button>
                {!riddleHints.has(idx) && (
                  <Button onClick={() => showRiddleHint(idx)} variant="outline" className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {t.hint}
                  </Button>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg text-center font-bold text-lg">
                {r.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Matching */}
      <div className="bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl p-6 mb-6 border-4 border-emerald-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{t.matchingHeading}</h3>
        <p className="text-center mb-4">{t.matchingBlurb}</p>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-emerald-800 mb-3 text-center">{t.characters}</h4>
            {characters.map((c) => (
              <Button
                key={c.id}
                onClick={() => setSelectedChar(c.id)}
                disabled={matchedPairs.has(c.id)}
                className={`w-full mb-2 ${
                  matchedPairs.has(c.id)
                    ? 'bg-green-500 text-white'
                    : selectedChar === c.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {c.name}
              </Button>
            ))}
          </div>
          <div>
            <h4 className="font-bold text-emerald-800 mb-3 text-center">{t.stories}</h4>
            {stories.map((s) => (
              <Button
                key={s.id}
                onClick={() => handleStoryClick(s.id)}
                disabled={matchedPairs.has(s.id)}
                className={`w-full mb-2 ${
                  matchedPairs.has(s.id) ? 'bg-green-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {s.name}
              </Button>
            ))}
          </div>
        </div>

        {matchHint && (
          <div className="mt-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{matchHint}</p>
            </div>
          </div>
        )}

        {!matchHint && matchedPairs.size < characters.length && (
          <div className="mt-4 text-center">
            <Button onClick={() => setMatchHint(t.matchingHint)} variant="outline" className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50">
              <Lightbulb className="w-4 h-4 mr-2" />
              {t.getHint}
            </Button>
          </div>
        )}

        {matchFeedback && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-bold ${
              matchFeedback === 'correct' ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'
            }`}
          >
            {matchFeedback === 'correct' ? (
              <>
                <CheckCircle2 className="inline w-5 h-5 mr-2" />
                {t.perfectMatch}
              </>
            ) : (
              <>
                <XCircle className="inline w-5 h-5 mr-2" />
                {t.notMatch}
              </>
            )}
          </div>
        )}

        {matchedPairs.size === characters.length && (
          <div className="mt-4 p-4 rounded-lg text-center font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg">
            {t.allMatched}
          </div>
        )}
      </div>

      {/* Logic */}
      <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 mb-6 border-4 border-orange-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{t.logicHeading}</h3>
          <span className="text-sm text-gray-500">
            {t.puzzleNumber} {logicIndex + 1} {t.of} {logicPuzzles.length}
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 mb-4">
          <p className="font-bold text-gray-800 mb-2">{t.mystery}</p>
          <p className="text-gray-700 mb-3">{logic.description}</p>
          <p className="font-bold text-gray-800 mb-2">{t.clues}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
            {logic.clues.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
          <p className="font-bold text-orange-700">{logic.question}</p>
        </div>

        {logicHint && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{logicHint}</p>
            </div>
          </div>
        )}

        {logicFeedback !== 'correct' && (
          <>
            <Input
              value={logicAnswer}
              onChange={(e) => setLogicAnswer(e.target.value)}
              placeholder={t.typeName}
              className="mb-3 text-lg"
            />
            <div className="flex gap-2">
              <Button
                onClick={checkLogic}
                className="flex-1 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
              >
                {t.checkAnswer}
              </Button>
              {!logicHint && (
                <Button onClick={() => setLogicHint(logic.hint)} variant="outline" className="border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {t.getHint}
                </Button>
              )}
            </div>
            {logicAttempts > 0 && (
              <div className="text-center text-sm text-gray-600 mt-2">
                {t.attemptsLeft} {Math.max(0, 3 - logicAttempts)}
              </div>
            )}
          </>
        )}

        {logicFeedback && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-bold ${
              logicFeedback === 'correct' ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'
            }`}
          >
            {logicFeedback === 'correct' ? (
              <>
                <CheckCircle2 className="inline w-5 h-5 mr-2" />
                {t.brilliantLogic}
              </>
            ) : (
              <>
                <XCircle className="inline w-5 h-5 mr-2" />
                {t.notQuiteLogic}
              </>
            )}
          </div>
        )}

        <div className="mt-4 text-center">
          <Button
            onClick={goToNextLogicPuzzle}
            variant="outline"
            className="border-2 border-orange-400 text-orange-700 hover:bg-orange-50"
          >
            <ChevronRight className="w-4 h-4 mr-1" />
            {t.tryAnother}
          </Button>
        </div>
      </div>

      {score >= totalPuzzles && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white rounded-2xl p-8 mb-6 text-center shadow-2xl">
          <div className="text-6xl mb-4">🏆🎉🏆</div>
          <h2 className="text-3xl font-bold mb-2">{t.masterHeading}</h2>
          <p>{t.masterBlurb}</p>
        </div>
      )}
    </div>
  );
}
