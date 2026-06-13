// Canonical list of activities. The Activities page, the Home preview, the
// Profile page, and the DemoPage all import from here so titles/emojis/slugs
// stay in sync.
//
// title, desc, and category are localized objects { en, es, fr }. Use the
// useActivities() / useActivity() hooks to read the slice for the current
// language. The raw `activities` export remains available for places where
// raw metadata is needed (sitemap generation, etc.).

import { useLanguage, type Language } from '../lib/language';

type LocalizedString = Record<Language, string>;

export interface Activity {
  slug: string; // also used as the route under /activities/{slug}
  emoji: string;
  ages: string;
  title: LocalizedString;
  desc: LocalizedString;
  category: LocalizedString;
  /** Standalone HTML game served from /public/games/<slug>.html, opened as a
   *  full page (vs an in-app React demo at /activities/<slug>). */
  game?: boolean;
}

export interface LocalizedActivity {
  slug: string;
  emoji: string;
  ages: string;
  title: string;
  desc: string;
  category: string;
  game?: boolean;
}

export const activities: Activity[] = [
  {
    slug: 'story-builder',
    emoji: '✍️',
    ages: '6-9',
    title: {
      en: 'Story Dice Creator',
      es: 'Creador de dados de historia',
      fr: 'Créateur de dés à histoire',
    },
    desc: {
      en: 'Roll the dice to mix characters, settings, and plot twists into a brand-new story every time.',
      es: 'Lanza los dados para mezclar personajes, escenarios y giros en una historia totalmente nueva.',
      fr: 'Lancez les dés pour mélanger personnages, décors et rebondissements en une histoire toute neuve.',
    },
    category: {
      en: 'Creative Writing',
      es: 'Escritura creativa',
      fr: 'Écriture créative',
    },
  },
  {
    slug: 'character-workshop',
    emoji: '🎭',
    ages: '6-9',
    title: {
      en: 'Character Creation Workshop',
      es: 'Taller de creación de personajes',
      fr: 'Atelier de création de personnages',
    },
    desc: {
      en: 'Step-by-step character builder — type, name, look, personality, powers, and backstory.',
      es: 'Constructor de personajes paso a paso — tipo, nombre, apariencia, personalidad, poderes e historia.',
      fr: 'Constructeur de personnages pas à pas — type, nom, apparence, personnalité, pouvoirs et histoire.',
    },
    category: {
      en: 'Creative Writing',
      es: 'Escritura creativa',
      fr: 'Écriture créative',
    },
  },
  {
    slug: 'adventure-journal',
    emoji: '📓',
    ages: '6-9',
    title: {
      en: 'Adventure Reading Journal',
      es: 'Diario de aventuras de lectura',
      fr: 'Journal d\'aventures de lecture',
    },
    desc: {
      en: "A simple journal to record books you've read, your favorite characters and scenes. Saves to your device.",
      es: 'Un diario sencillo para registrar los libros que has leído, tus personajes y escenas favoritas. Se guarda en tu dispositivo.',
      fr: 'Un journal simple pour enregistrer les livres lus, vos personnages et scènes préférés. Sauvegardé sur votre appareil.',
    },
    category: {
      en: 'Reading',
      es: 'Lectura',
      fr: 'Lecture',
    },
  },
  {
    slug: 'coloring',
    emoji: '🎨',
    ages: '3-7',
    title: {
      en: "Eva's Coloring Adventure",
      es: 'Aventura de colorear de Eva',
      fr: 'Aventure de coloriage d\'Eva',
    },
    desc: {
      en: 'In-browser coloring book — pick a scene, pick your palette, color it in. Saves what you make.',
      es: 'Libro de colorear en el navegador — elige una escena, elige tu paleta, coloréalo. Guarda lo que creas.',
      fr: 'Livre de coloriage dans le navigateur — choisissez une scène, choisissez votre palette, coloriez. Garde vos créations.',
    },
    category: {
      en: 'Art & Creativity',
      es: 'Arte y creatividad',
      fr: 'Art et créativité',
    },
  },
  {
    slug: 'craft-corner',
    emoji: '✂️',
    ages: '6-9',
    title: {
      en: "Eva's Craft Corner",
      es: 'Rincón de manualidades de Eva',
      fr: 'Coin bricolage d\'Eva',
    },
    desc: {
      en: 'Step-by-step craft instructions — bookmarks, masks, story dioramas built from common materials.',
      es: 'Instrucciones de manualidades paso a paso — marcapáginas, máscaras y dioramas con materiales comunes.',
      fr: 'Instructions de bricolage pas à pas — marque-pages, masques et dioramas avec des matériaux du quotidien.',
    },
    category: {
      en: 'Crafts',
      es: 'Manualidades',
      fr: 'Bricolage',
    },
  },
  {
    slug: 'bookmark-designer',
    emoji: '🔖',
    ages: '5-9',
    title: {
      en: 'Bookmark Designer',
      es: 'Diseñador de marcapáginas',
      fr: 'Concepteur de marque-pages',
    },
    desc: {
      en: 'Design and print your own bookmarks with themes from the books, plus a quote you choose.',
      es: 'Diseña e imprime tus propios marcapáginas con temas de los libros y una cita que elijas.',
      fr: 'Concevez et imprimez vos propres marque-pages avec des thèmes des livres et une citation à votre choix.',
    },
    category: {
      en: 'Crafts',
      es: 'Manualidades',
      fr: 'Bricolage',
    },
  },
  {
    slug: 'bingo',
    emoji: '🎯',
    ages: '6-9',
    title: {
      en: 'Reading Bingo',
      es: 'Bingo de lectura',
      fr: 'Bingo de lecture',
    },
    desc: {
      en: 'Complete reading challenges across a bingo board — five in a row earns a celebration.',
      es: 'Completa retos de lectura en un cartón de bingo — cinco en fila te dan una celebración.',
      fr: 'Relevez des défis de lecture sur un carton de bingo — cinq d\'affilée et c\'est la fête.',
    },
    category: {
      en: 'Reading',
      es: 'Lectura',
      fr: 'Lecture',
    },
  },
  {
    slug: 'puzzles',
    emoji: '🧩',
    ages: '7-9',
    title: {
      en: 'Puzzle Paradise',
      es: 'Paraíso de rompecabezas',
      fr: 'Paradis des énigmes',
    },
    desc: {
      en: 'Word puzzles and riddles based on the stories — a thinking workout that builds vocabulary.',
      es: 'Acertijos y rompecabezas de palabras inspirados en las historias — un entrenamiento mental que amplía el vocabulario.',
      fr: 'Énigmes et jeux de mots inspirés des histoires — un entraînement mental qui enrichit le vocabulaire.',
    },
    category: {
      en: 'Games',
      es: 'Juegos',
      fr: 'Jeux',
    },
  },

  // --- Standalone interactive games (served from /public/games/<slug>.html) ---
  {
    slug: 'bilingual-flashcards',
    emoji: '🌍',
    ages: '4-8',
    game: true,
    title: { en: 'Bilingual Word Flashcards', es: 'Tarjetas de palabras bilingües', fr: 'Cartes de mots bilingues' },
    desc: {
      en: 'Tap a card to flip it and hear the word in English, Spanish, and French.',
      es: 'Toca una tarjeta para girarla y escuchar la palabra en inglés, español y francés.',
      fr: 'Touchez une carte pour la retourner et entendre le mot en anglais, espagnol et français.',
    },
    category: { en: 'Language Learning', es: 'Aprender idiomas', fr: 'Apprendre les langues' },
  },
  {
    slug: 'matching',
    emoji: '🃏',
    ages: '3-5',
    game: true,
    title: { en: "Eva's Matching Adventure", es: 'La aventura de parejas de Eva', fr: 'Le jeu de paires d\'Eva' },
    desc: {
      en: 'Flip two cards to find the matching pairs — perfect for little ones.',
      es: 'Voltea dos cartas para encontrar las parejas — perfecto para los más pequeños.',
      fr: 'Retournez deux cartes pour trouver les paires — parfait pour les tout-petits.',
    },
    category: { en: 'Games', es: 'Juegos', fr: 'Jeux' },
  },
  {
    slug: 'rhyme-singalong',
    emoji: '🎵',
    ages: '3-7',
    game: true,
    title: { en: 'Rhyme & Sing-Along', es: 'Rimas para cantar', fr: 'Comptines à chanter' },
    desc: {
      en: "Follow the highlighted words as they're read aloud, then sing along in three languages.",
      es: 'Sigue las palabras resaltadas mientras se leen en voz alta y luego canta en tres idiomas.',
      fr: 'Suivez les mots surlignés lus à voix haute, puis chantez dans trois langues.',
    },
    category: { en: 'Music & Literacy', es: 'Música y lectura', fr: 'Musique et lecture' },
  },
  {
    slug: 'spelling-bee',
    emoji: '🐝',
    ages: '5-9',
    game: true,
    title: { en: "Eva's Spelling Bee", es: 'El concurso de ortografía de Eva', fr: 'Le concours d\'orthographe d\'Eva' },
    desc: {
      en: 'Listen to the word, then tap the letters to spell it. Three levels to master.',
      es: 'Escucha la palabra y toca las letras para deletrearla. Tres niveles por superar.',
      fr: 'Écoutez le mot, puis touchez les lettres pour l\'épeler. Trois niveaux à maîtriser.',
    },
    category: { en: 'Games', es: 'Juegos', fr: 'Jeux' },
  },
  {
    slug: 'counting-numbers',
    emoji: '🔢',
    ages: '3-6',
    game: true,
    title: { en: 'Counting & Numbers Game', es: 'Juego de contar y números', fr: 'Jeu de comptage et de chiffres' },
    desc: {
      en: "Count along with Eva's friends and learn numbers through playful stories.",
      es: 'Cuenta con los amigos de Eva y aprende los números con historias divertidas.',
      fr: 'Comptez avec les amis d\'Eva et apprenez les chiffres grâce à des histoires ludiques.',
    },
    category: { en: 'Early Math', es: 'Primeras matemáticas', fr: 'Premières maths' },
  },
  {
    slug: 'emotion-wheel',
    emoji: '🎡',
    ages: '3-7',
    game: true,
    title: { en: 'Emotion & Feelings Wheel', es: 'La rueda de las emociones', fr: 'La roue des émotions' },
    desc: {
      en: 'Spin the wheel to explore feelings and talk about big emotions together.',
      es: 'Gira la rueda para explorar los sentimientos y hablar juntos de las grandes emociones.',
      fr: 'Faites tourner la roue pour explorer les sentiments et parler ensemble des grandes émotions.',
    },
    category: { en: 'Feelings', es: 'Emociones', fr: 'Émotions' },
  },
  {
    slug: 'world-geography',
    emoji: '🗺️',
    ages: '6-9',
    game: true,
    title: { en: 'World Geography Map', es: 'Mapa de geografía del mundo', fr: 'Carte de géographie du monde' },
    desc: {
      en: 'Explore the map to discover countries, flags, and where stories come from.',
      es: 'Explora el mapa para descubrir países, banderas y de dónde vienen las historias.',
      fr: 'Explorez la carte pour découvrir des pays, des drapeaux et l\'origine des histoires.',
    },
    category: { en: 'Discovery', es: 'Descubrimiento', fr: 'Découverte' },
  },
  {
    slug: 'build-a-scene',
    emoji: '🏗️',
    ages: '4-8',
    game: true,
    title: { en: 'Build-a-Scene', es: 'Crea una escena', fr: 'Compose une scène' },
    desc: {
      en: 'Drag characters and props onto the page to build your own story scene.',
      es: 'Arrastra personajes y objetos a la página para crear tu propia escena.',
      fr: 'Glissez personnages et objets sur la page pour composer votre propre scène.',
    },
    category: { en: 'Creativity', es: 'Creatividad', fr: 'Créativité' },
  },
  {
    slug: 'finish-the-story',
    emoji: '✏️',
    ages: '6-9',
    game: true,
    title: { en: 'Finish the Story', es: 'Termina la historia', fr: 'Termine l\'histoire' },
    desc: {
      en: 'Eva starts the story — you write the ending. A fresh prompt every time.',
      es: 'Eva empieza la historia — tú escribes el final. Una nueva propuesta cada vez.',
      fr: 'Eva commence l\'histoire — vous écrivez la fin. Une nouvelle amorce à chaque fois.',
    },
    category: { en: 'Creative Writing', es: 'Escritura creativa', fr: 'Écriture créative' },
  },
  {
    slug: 'sentence-builder',
    emoji: '🧱',
    ages: '5-9',
    game: true,
    title: { en: 'Bilingual Sentence Builder', es: 'Constructor de frases bilingüe', fr: 'Constructeur de phrases bilingue' },
    desc: {
      en: 'Tap words to build sentences in English, Spanish, and French.',
      es: 'Toca palabras para construir frases en inglés, español y francés.',
      fr: 'Touchez des mots pour construire des phrases en anglais, espagnol et français.',
    },
    category: { en: 'Language Learning', es: 'Aprender idiomas', fr: 'Apprendre les langues' },
  },
  {
    slug: 'reading-tracker',
    emoji: '📊',
    ages: '5-9',
    game: true,
    title: { en: 'Reading Tracker', es: 'Registro de lectura', fr: 'Suivi de lecture' },
    desc: {
      en: "Log the books you've read and watch your reading streak grow. Saves to your device.",
      es: 'Registra los libros que has leído y mira crecer tu racha de lectura. Se guarda en tu dispositivo.',
      fr: 'Notez les livres lus et regardez votre série de lecture grandir. Sauvegardé sur votre appareil.',
    },
    category: { en: 'Reading', es: 'Lectura', fr: 'Lecture' },
  },
  {
    slug: 'story-map',
    emoji: '🧭',
    ages: '5-9',
    game: true,
    title: { en: "Eva's Virtual Story Map", es: 'El mapa de historias de Eva', fr: 'La carte aux histoires d\'Eva' },
    desc: {
      en: "Travel Eva's story map and unlock a new adventure at every stop.",
      es: 'Recorre el mapa de historias de Eva y desbloquea una nueva aventura en cada parada.',
      fr: 'Parcourez la carte aux histoires d\'Eva et débloquez une aventure à chaque étape.',
    },
    category: { en: 'Discovery', es: 'Descubrimiento', fr: 'Découverte' },
  },
];

function localize(activity: Activity, lang: Language): LocalizedActivity {
  return {
    slug: activity.slug,
    emoji: activity.emoji,
    ages: activity.ages,
    title: activity.title[lang] ?? activity.title.en,
    desc: activity.desc[lang] ?? activity.desc.en,
    category: activity.category[lang] ?? activity.category.en,
    game: activity.game,
  };
}

/** Returns all activities localized for the current language. */
export function useActivities(): LocalizedActivity[] {
  const { language } = useLanguage();
  return activities.map((a) => localize(a, language));
}

/** Returns a single activity localized for the current language, by slug. */
export function useActivity(slug: string): LocalizedActivity | undefined {
  const { language } = useLanguage();
  const found = activities.find((a) => a.slug === slug);
  return found ? localize(found, language) : undefined;
}

/** Raw-metadata lookup (no localization). Used by sitemap and Seo derivations. */
export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}
