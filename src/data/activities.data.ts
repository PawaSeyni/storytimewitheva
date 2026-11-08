// Activities + games — the DATA, as a BROWSER-FREE module.
//
// Split out of ./activities.ts for the same reason books.data.ts was split out of
// books.ts: the runtime module imports `useLanguage`, which pulls in React and
// react-router-dom, so build scripts and CI could not load it. Book -> activity
// relationships (`relatedActivityIds`) can only be VALIDATED against a module Node
// can import, and an unvalidated reference ships as a dead link.
//
// The only import here is a type-only `Language`, erased at build time.
//
// NOTE ON IDENTITY: `slug` is both the canonical id and the route segment. Books
// reference activities by this value. That conflation predates the taxonomy work and
// is the one place where a content id and a URL concern are still the same string.

import type { Language } from '../lib/language';

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
  /** Opened from EVERY book page (the "Story words" strip), so any valid book is accepted as
   *  the source book (?book=<id>), not only the books that list it in relatedActivityIds. */
  anyBook?: boolean;
  /** Built for specific book(s) (the Activity Studio pages and the Leo worksheet). The hub
   *  shows the book it belongs to, and every book must lead with one (activities-audit test). */
  bookSpecific?: boolean;
}

export const activities: Activity[] = [
  {
    slug: 'story-builder',
    emoji: '📝',
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
      en: 'Step-by-step character builder, type, name, look, personality, powers, and backstory.',
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
      en: 'In-browser coloring book, pick a scene, pick your palette, color it in. Saves what you make.',
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
    emoji: '🧶',
    ages: '6-9',
    title: {
      en: "Eva's Craft Corner",
      es: 'Rincón de manualidades de Eva',
      fr: 'Coin bricolage d\'Eva',
    },
    desc: {
      en: 'Step-by-step craft instructions, bookmarks, masks, story dioramas built from common materials.',
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
      en: 'Complete reading challenges across a bingo board, five in a row earns a celebration.',
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
      en: 'Word puzzles and riddles based on the stories, a thinking workout that builds vocabulary.',
      es: 'Acertijos y rompecabezas de palabras inspirados en las historias — un entrenamiento mental que amplía el vocabulario.',
      fr: 'Énigmes et jeux de mots inspirés des histoires — un entraînement mental qui enrichit le vocabulaire.',
    },
    category: {
      en: 'Games',
      es: 'Juegos',
      fr: 'Jeux',
    },
  },
  {
    slug: 'word-explorer',
    emoji: '🔤',
    ages: '5-9',
    anyBook: true,
    title: { en: 'Word Explorer', es: 'Explorador de palabras', fr: 'Explorateur de mots' },
    desc: {
      en: 'Learn new words in English, Spanish, and French with fun flashcards and quizzes.',
      es: 'Aprende palabras nuevas en inglés, español y francés con tarjetas y cuestionarios.',
      fr: 'Apprends de nouveaux mots en anglais, espagnol et français avec des cartes et des quiz.',
    },
    category: { en: 'Language', es: 'Idioma', fr: 'Langue' },
  },

  // --- Standalone interactive games (served from /public/games/<slug>.html) ---
  {
    slug: 'bilingual-flashcards',
    emoji: '🌍',
    ages: '4-8',
    game: true,
    anyBook: true,
    title: { en: 'Multilingual Word Flashcards', es: 'Tarjetas de palabras multilingües', fr: 'Cartes de mots multilingues' },
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
    anyBook: true,
    title: { en: "Eva's Matching Adventure", es: 'La aventura de parejas de Eva', fr: 'Le jeu de paires d\'Eva' },
    desc: {
      en: 'Flip two cards to find the matching pairs, perfect for little ones.',
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
    anyBook: true,
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
    emoji: '🌍',
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
    emoji: '🎬',
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
    emoji: '📖',
    ages: '6-9',
    game: true,
    title: { en: 'Finish the Story', es: 'Termina la historia', fr: 'Termine l\'histoire' },
    desc: {
      en: 'Eva starts the story, you write the ending. A fresh prompt every time.',
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
    title: { en: 'Multilingual Sentence Builder', es: 'Constructor de frases multilingüe', fr: 'Constructeur de phrases multilingue' },
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
  // ── Activity Studio (2026-09-11): eight book-linked, printable activities. Slugs are the
  // route segments; the book pairings live on the books (relatedActivityIds), first slot.
  {
    slug: 'color-mix-lab',
    bookSpecific: true,
    emoji: '🎨',
    ages: '4-7',
    title: { en: 'Color Keeper’s Mix-It Lab', es: 'El laboratorio de mezclas de la Guardiana de los Colores', fr: 'Le labo des mélanges de la Gardienne des Couleurs' },
    desc: { en: 'Predict what two paint colors will make, mix them, and print a color recipe card in three languages.', es: 'Predice qué color formarán dos pinturas, mézclalas e imprime una tarjeta de receta de color en tres idiomas.', fr: 'Prédis la couleur que donneront deux peintures, mélange-les et imprime une carte-recette de couleur en trois langues.' },
    category: { en: 'Discovery', es: 'Descubrimiento', fr: 'Découverte' },
  },
  {
    slug: 'feelings-weather-report',
    bookSpecific: true,
    emoji: '🌦️',
    ages: '3-7',
    title: { en: 'My Feelings Weather Report', es: 'Mi parte del tiempo emocional', fr: 'Ma météo des émotions' },
    desc: { en: 'Choose a weather icon for today’s feeling, pick one caring next step, and print a take-home report card.', es: 'Elige un icono del tiempo para el sentimiento de hoy, un paso de cuidado e imprime una tarjeta para llevar a casa.', fr: 'Choisis une météo pour l’émotion du jour, un geste de soin, et imprime une carte à rapporter à la maison.' },
    category: { en: 'Feelings', es: 'Emociones', fr: 'Émotions' },
  },
  {
    slug: 'first-day-brave-plan',
    bookSpecific: true,
    emoji: '🚩',
    ages: '4-8',
    title: { en: 'First-Day Brave Plan', es: 'Mi plan valiente para el primer día', fr: 'Mon plan courageux du premier jour' },
    desc: { en: 'Map one worry, one helper, one brave step, and one celebration, with a conversation prompt for the grown-up.', es: 'Anota una preocupación, un ayudante, un paso valiente y una celebración, con una pregunta para el adulto.', fr: 'Note une inquiétude, un aide, un pas courageux et une petite fête, avec une question pour l’adulte.' },
    category: { en: 'Feelings', es: 'Emociones', fr: 'Émotions' },
  },
  {
    slug: 'cloud-detective-journal',
    bookSpecific: true,
    emoji: '☁️',
    ages: '4-8',
    title: { en: 'Cloud Detective Field Journal', es: 'Diario de campo del detective de nubes', fr: 'Carnet de terrain du détective des nuages' },
    desc: { en: 'Observe the sky, match a cloud type, make a forecast, and collect five weather words in three languages.', es: 'Observa el cielo, identifica un tipo de nube, haz un pronóstico y colecciona cinco palabras del tiempo en tres idiomas.', fr: 'Observe le ciel, reconnais un type de nuage, fais une prévision et collectionne cinq mots de météo en trois langues.' },
    category: { en: 'Discovery', es: 'Descubrimiento', fr: 'Découverte' },
  },
  {
    slug: 'shadow-theatre',
    bookSpecific: true,
    emoji: '🌙',
    ages: '3-7',
    title: { en: 'Shadow Theatre at Bedtime', es: 'Teatro de sombras a la hora de dormir', fr: 'Théâtre d’ombres au coucher' },
    desc: { en: 'A printable character kit, torch-light safety tips, story prompts, and a read-aloud cue for a cozy bedtime show.', es: 'Un kit de personajes imprimible, consejos de seguridad con la linterna, consignas y lectura en voz alta para una función acogedora.', fr: 'Un kit de personnages à imprimer, des conseils de sécurité pour la lampe, des amorces d’histoire et une lecture à voix haute.' },
    category: { en: 'Creativity', es: 'Creatividad', fr: 'Créativité' },
  },
  {
    slug: 'kindness-ripple',
    bookSpecific: true,
    emoji: '💗',
    ages: '4-9',
    title: { en: 'Kindness Ripple Challenge', es: 'El reto de las ondas de bondad', fr: 'Le défi des ondes de gentillesse' },
    desc: { en: 'Add one kind act a day to a family or class ripple chart for a week, then reflect on what changed.', es: 'Añade un acto amable al día a una tabla de ondas familiar o de clase durante una semana y reflexiona sobre lo que cambió.', fr: 'Ajoute un geste gentil par jour à un tableau d’ondes en famille ou en classe pendant une semaine, puis réfléchis à ce qui a changé.' },
    category: { en: 'Feelings', es: 'Emociones', fr: 'Émotions' },
  },
  {
    slug: 'story-quilt',
    bookSpecific: true,
    emoji: '🧵',
    ages: '5-9',
    title: { en: 'Grandparent Story Quilt', es: 'La colcha de historias de los abuelos', fr: 'La courtepointe des histoires de grands-parents' },
    desc: { en: 'Interview a family member, collect a phrase, a food, a place, and a memory, and print a quilt square.', es: 'Entrevista a alguien de la familia, recoge una frase, una comida, un lugar y un recuerdo, e imprime un cuadro de colcha.', fr: 'Interroge quelqu’un de la famille, recueille une phrase, un plat, un lieu et un souvenir, et imprime un carré de courtepointe.' },
    category: { en: 'Family Stories', es: 'Historias familiares', fr: 'Histoires de famille' },
  },
  {
    slug: 'patient-maker-passport',
    bookSpecific: true,
    emoji: '🛠️',
    ages: '5-9',
    title: { en: 'The Patient Maker Passport', es: 'El pasaporte del creador paciente', fr: 'Le passeport du fabricant patient' },
    desc: { en: 'Break a goal into small practice steps, record the attempts, and earn a printable completion certificate.', es: 'Divide una meta en pequeños pasos de práctica, registra los intentos y gana un certificado imprimible.', fr: 'Découpe un objectif en petites étapes d’entraînement, note les essais et gagne un certificat à imprimer.' },
    category: { en: 'Creativity', es: 'Creatividad', fr: 'Créativité' },
  },
  // ── Activity Studio, wave 2 (activities audit 2026-11): one book-specific activity for
  // each of the nine books that had none. Same contract as wave 1: the paired book lists
  // the activity FIRST in its relatedActivityIds.
  {
    slug: 'trust-meter',
    bookSpecific: true,
    emoji: '🐑',
    ages: '4-8',
    title: { en: 'The Trust Meter', es: 'El medidor de confianza', fr: 'Le baromètre de la confiance' },
    desc: { en: 'Make Leo’s choices on the hill and watch the village’s trust go down fast and come back slowly, then print an honesty promise.', es: 'Toma las decisiones de Leo en la colina y mira cómo la confianza del pueblo baja rápido y vuelve despacio; luego imprime una promesa de honestidad.', fr: 'Fais les choix de Léo sur la colline et regarde la confiance du village tomber vite et revenir lentement, puis imprime une promesse d’honnêteté.' },
    category: { en: 'Feelings', es: 'Emociones', fr: 'Émotions' },
  },
  {
    slug: 'harmonia-orchestra',
    bookSpecific: true,
    emoji: '🎶',
    ages: '3-6',
    title: { en: 'Harmonia Color Orchestra', es: 'La orquesta de colores de Harmonia', fr: 'L’orchestre des couleurs d’Harmonia' },
    desc: { en: 'Every color sings its own note. Play the symphony with all of them, write an eight-beat song, and print the score to play at home.', es: 'Cada color canta su propia nota. Toca la sinfonía con todos, compón una canción de ocho tiempos e imprime la partitura para tocarla en casa.', fr: 'Chaque couleur chante sa propre note. Joue la symphonie avec toutes, compose une chanson de huit temps et imprime la partition pour la jouer à la maison.' },
    category: { en: 'Music & Literacy', es: 'Música y lectura', fr: 'Musique et lecture' },
  },
  {
    slug: 'ask-first-architect',
    bookSpecific: true,
    emoji: '🏗️',
    ages: '5-9',
    title: { en: 'Ask-First Architect', es: 'Arquitecto que pregunta primero', fr: 'L’architecte qui pose d’abord des questions' },
    desc: { en: 'Build a tower floor by floor, and stop to listen when the junior engineer raises her hand. Print three questions for real block building.', es: 'Construye una torre piso a piso y detente a escuchar cuando la joven ingeniera levante la mano. Imprime tres preguntas para construir con bloques de verdad.', fr: 'Construis une tour étage par étage, et arrête-toi pour écouter quand la jeune ingénieure lève la main. Imprime trois questions pour construire avec de vrais cubes.' },
    category: { en: 'Discovery', es: 'Descubrimiento', fr: 'Découverte' },
  },
  {
    slug: 'true-treasure-chest',
    bookSpecific: true,
    emoji: '👑',
    ages: '5-9',
    title: { en: 'My True Treasure Chest', es: 'Mi cofre del verdadero tesoro', fr: 'Mon coffre au vrai trésor' },
    desc: { en: 'Sort what gold can buy from what makes you truly rich, then fill and print your own treasure chest.', es: 'Separa lo que el oro puede comprar de lo que te hace rico de verdad, y luego llena e imprime tu propio cofre del tesoro.', fr: 'Sépare ce que l’or peut acheter de ce qui te rend vraiment riche, puis remplis et imprime ton propre coffre au trésor.' },
    category: { en: 'Feelings', es: 'Emociones', fr: 'Émotions' },
  },
  {
    slug: 'one-of-a-kind-tree',
    bookSpecific: true,
    emoji: '🍎',
    ages: '4-8',
    title: { en: 'My One-of-a-Kind Tree', es: 'Mi árbol único', fr: 'Mon arbre unique' },
    desc: { en: 'Choose a trunk shape, crooked counts, and grow leaves that say what makes you special. Print it for a class orchard wall.', es: 'Elige la forma del tronco, torcido también vale, y haz crecer hojas que digan qué te hace especial. Imprímelo para un huerto en la pared de la clase.', fr: 'Choisis la forme du tronc, tordu compris, et fais pousser des feuilles qui disent ce qui te rend spécial. Imprime-le pour un verger mural en classe.' },
    category: { en: 'Art & Creativity', es: 'Arte y creatividad', fr: 'Art et créativité' },
  },
  {
    slug: 'kindness-mirror',
    bookSpecific: true,
    emoji: '🪞',
    ages: '4-8',
    title: { en: 'The Kindness Mirror', es: 'El espejo de la bondad', fr: 'Le miroir de la gentillesse' },
    desc: { en: 'A mirror that shows how you shine, not how you look. Pick three ways you shine and make four compliment cards to give away.', es: 'Un espejo que muestra cómo brillas, no cómo te ves. Elige tres maneras en que brillas y crea cuatro tarjetas de cumplidos para regalar.', fr: 'Un miroir qui montre comment tu brilles, pas à quoi tu ressembles. Choisis trois façons de briller et crée quatre cartes de compliments à offrir.' },
    category: { en: 'Feelings', es: 'Emociones', fr: 'Émotions' },
  },
  {
    slug: 'listen-like-a-fox',
    bookSpecific: true,
    emoji: '🦊',
    ages: '4-8',
    title: { en: 'Listen Like a Fox', es: 'Escucha como un zorro', fr: 'Écoute comme un renard' },
    desc: { en: 'Hear Mother Fox’s directions, then lead Russet home step by step, without rushing and away from the fence.', es: 'Escucha las indicaciones de Mamá Zorra y guía a Russet a casa paso a paso, sin prisas y lejos de la alambrada.', fr: 'Écoute les consignes de Maman Renarde, puis ramène Russet au terrier pas à pas, sans te presser et loin de la clôture.' },
    category: { en: 'Games', es: 'Juegos', fr: 'Jeux' },
  },
  {
    slug: 'puddle-voyage',
    bookSpecific: true,
    emoji: '⛵',
    ages: '3-7',
    title: { en: 'Puddle Voyage', es: 'Viaje por el charco', fr: 'Voyage dans la flaque' },
    desc: { en: 'Put the little boat’s new friends in order, test what floats or sinks with a grown-up, and fold a paper boat.', es: 'Ordena a los nuevos amigos del barquito, prueba con un adulto qué flota y qué se hunde, y dobla un barco de papel.', fr: 'Remets dans l’ordre les nouveaux amis du petit bateau, teste avec un adulte ce qui flotte ou coule, et plie un bateau en papier.' },
    category: { en: 'Discovery', es: 'Descubrimiento', fr: 'Découverte' },
  },
  {
    slug: 'map-my-world',
    bookSpecific: true,
    emoji: '🗺️',
    ages: '4-8',
    title: { en: 'Map My World', es: 'El mapa de mi mundo', fr: 'La carte de mon monde' },
    desc: { en: 'Draw a map of your room or yard with stamps and a legend, then hide a castle for a grown-up to find.', es: 'Dibuja un mapa de tu cuarto o tu patio con sellos y una leyenda, y esconde un castillo para que un adulto lo encuentre.', fr: 'Dessine la carte de ta chambre ou de ton jardin avec des tampons et une légende, puis cache un château qu’un adulte devra trouver.' },
    category: { en: 'Creativity', es: 'Creatividad', fr: 'Créativité' },
  },
  // A complete paper worksheet for one book. Separate from the free Leo storybook PDF
  // (/free/leo-and-the-wolf), which serves a different purpose and is left as it is.
  {
    slug: 'leo-and-the-wolf-worksheet',
    bookSpecific: true,
    emoji: '📝',
    ages: '4-8',
    title: { en: 'Leo and the Wolf: Story Worksheet', es: 'Leo y el lobo: ficha del cuento', fr: 'Léo et le loup : fiche de lecture' },
    desc: { en: 'A complete two-page worksheet to print: story words, story order, true or not true, feelings, honest or tricky, writing, drawing and an honesty promise.', es: 'Una ficha completa de dos páginas para imprimir: palabras del cuento, orden, verdadero o falso, sentimientos, honesto o tramposo, escritura, dibujo y una promesa de honestidad.', fr: 'Une fiche complète de deux pages à imprimer : mots de l’histoire, ordre, vrai ou faux, émotions, honnête ou tricheur, écriture, dessin et une promesse d’honnêteté.' },
    category: { en: 'Reading', es: 'Lectura', fr: 'Lecture' },
  },
  // A two-page printable for ANY book, built from its discussion prompts and story words.
  // Offered on every book page (Story words strip), so it accepts any book as ?book=<id>.
  {
    slug: 'story-worksheet',
    emoji: '📚',
    ages: '4-9',
    anyBook: true,
    title: { en: 'Story Worksheet', es: 'Ficha del cuento', fr: 'Fiche de lecture' },
    desc: { en: 'A two-page printable for any book: before, during and after questions, story words to match and translate, a drawing and a review.', es: 'Una ficha de dos páginas para cualquier libro: preguntas para antes, durante y después, palabras del cuento para unir y traducir, un dibujo y una opinión.', fr: 'Une fiche de deux pages pour n’importe quel livre : questions avant, pendant et après, mots de l’histoire à relier et à traduire, un dessin et un avis.' },
    category: { en: 'Reading', es: 'Lectura', fr: 'Lecture' },
  },
];
