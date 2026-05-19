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
}

export interface LocalizedActivity {
  slug: string;
  emoji: string;
  ages: string;
  title: string;
  desc: string;
  category: string;
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
];

function localize(activity: Activity, lang: Language): LocalizedActivity {
  return {
    slug: activity.slug,
    emoji: activity.emoji,
    ages: activity.ages,
    title: activity.title[lang] ?? activity.title.en,
    desc: activity.desc[lang] ?? activity.desc.en,
    category: activity.category[lang] ?? activity.category.en,
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
