// Parent & educator resources — BROWSER-FREE data module (Sprint 7 prerequisite).
//
// Until now resources existed only as prose inside src/pages/Resources.tsx, so
// `relatedResourceIds` had nothing with stable IDs to point at. This models them.
//
// ID SCHEME — ids are kind-prefixed and GLOBALLY unique. That is not cosmetic: the
// download slug `follow-up-activities` and the article anchor `follow-up-activities`
// collide, and `relatedResourceIds` is a flat string array, so an unprefixed scheme
// would silently resolve a Book -> Resource link to the wrong resource.
//
// Long-form article BODIES stay in Resources.tsx; this registry owns identity and
// summary metadata so nothing is duplicated.

import type { Language } from '../lib/language';

type LocalizedString = Record<Language, string>;

export type ResourceKind = 'article' | 'download';

export interface Resource {
  /** Globally unique, kind-prefixed. Stable — referenced by relatedResourceIds. */
  id: string;
  kind: ResourceKind;
  title: LocalizedString;
  description: LocalizedString;
  /** Article: the /resources anchor. Download: the lead-magnet slug behind /download/. */
  slug: string;
  /** Articles only — estimated reading time in minutes. */
  minutes?: number;
  /** Downloads only — true when -es/-fr file variants exist. */
  localizedFile?: boolean;
  /** Articles only — the /resources filter chip this card belongs to. */
  categoryKey?: ResourceCategoryKey;
  /** Articles only — Tailwind classes for the category pill. */
  categoryColor?: string;
  /** Articles only — shows the "Popular" badge. */
  popular?: boolean;
  emoji?: string;
}

export type ResourceCategoryKey = 'readingTips' | 'activityIdeas' | 'childDev' | 'engagement';

export const resources: Resource[] = [
  // ---- downloads (printables served through /download/<slug>) ----
  {
    id: 'download-parents-guide', kind: 'download', slug: 'parents-guide', localizedFile: true, emoji: '📘',
    title: {
      en: 'Parent & Teacher Guide',
      es: 'Guía para familias y docentes',
      fr: 'Guide parents & enseignants',
    },
    description: {
      en: 'Discussion prompts and read-aloud tips for getting the most from each story.',
      es: 'Preguntas para conversar y consejos de lectura en voz alta para aprovechar cada historia.',
      fr: 'Questions de discussion et conseils de lecture à voix haute pour tirer le meilleur de chaque histoire.',
    },
  },
  {
    id: 'download-bilingual-flashcards', kind: 'download', slug: 'bilingual-flashcards', localizedFile: false, emoji: '🃏',
    title: {
      en: 'Bilingual Flashcards',
      es: 'Tarjetas bilingües',
      fr: 'Cartes bilingues',
    },
    description: {
      en: 'Printable English–Spanish vocabulary cards for classroom or home practice.',
      es: 'Tarjetas de vocabulario en inglés y español para practicar en clase o en casa.',
      fr: 'Cartes de vocabulaire anglais–espagnol à imprimer pour la classe ou la maison.',
    },
  },
  {
    id: 'download-follow-up-activities', kind: 'download', slug: 'follow-up-activities', localizedFile: true, emoji: '✏️',
    title: {
      en: 'Follow-Up Activities',
      es: 'Actividades complementarias',
      fr: 'Activités complémentaires',
    },
    description: {
      en: 'Worksheets and extension activities to do after reading a story.',
      es: 'Fichas y actividades de ampliación para hacer después de leer.',
      fr: 'Fiches et activités de prolongement à faire après la lecture.',
    },
  },
  {
    id: 'download-bedtime-routine', kind: 'download', slug: 'bedtime-routine', localizedFile: true, emoji: '🌙',
    title: {
      en: 'Reading Routine Chart',
      es: 'Tabla de rutina de lectura',
      fr: 'Tableau de routine de lecture',
    },
    description: {
      en: 'A printable chart to help build a daily reading habit.',
      es: 'Una tabla imprimible para crear el hábito diario de leer.',
      fr: 'Un tableau à imprimer pour instaurer une habitude de lecture quotidienne.',
    },
  },

  // ---- articles (long-form guidance rendered on /resources#<slug>) ----
  {
    id: 'article-making-reading-magical', kind: 'article', slug: 'making-reading-magical', minutes: 5, emoji: '✨',
    categoryKey: 'readingTips', categoryColor: 'bg-blue-100 text-blue-700', popular: true,
    title: {
      en: '10 Ways to Make Reading Time Magical',
      es: '10 formas de hacer mágico el tiempo de lectura',
      fr: '10 façons de rendre le temps de lecture magique',
    },
    description: {
      en: 'Transform ordinary reading sessions into memorable adventures your child will love.',
      es: 'Transforma las sesiones de lectura cotidianas en aventuras memorables que tu peque adorará.',
      fr: 'Transformez les séances de lecture ordinaires en aventures inoubliables que votre enfant adorera.',
    },
  },
  {
    id: 'article-age-appropriate-reading', kind: 'article', slug: 'age-appropriate-reading', minutes: 8, emoji: '📊',
    categoryKey: 'childDev', categoryColor: 'bg-green-100 text-green-700', popular: true,
    title: {
      en: 'Age-Appropriate Reading Milestones',
      es: 'Hitos de lectura por edades',
      fr: 'Les étapes de lecture selon l’âge',
    },
    description: {
      en: "What to expect at each stage and how to support your child's literacy journey.",
      es: 'Qué esperar en cada etapa y cómo apoyar el camino lector de tu peque.',
      fr: 'À quoi s’attendre à chaque étape et comment soutenir le parcours de lecture de votre enfant.',
    },
  },
  {
    id: 'article-follow-up-activities', kind: 'article', slug: 'follow-up-activities', minutes: 6, emoji: '🎨',
    categoryKey: 'activityIdeas', categoryColor: 'bg-orange-100 text-orange-700', popular: false,
    title: {
      en: '5 Creative Follow-Up Activities After Reading',
      es: '5 actividades creativas para después de leer',
      fr: '5 activités créatives à faire après la lecture',
    },
    description: {
      en: 'Extend the learning and fun beyond the last page with these engaging activities.',
      es: 'Alarga la diversión y el aprendizaje más allá de la última página con estas actividades.',
      fr: 'Prolongez l’apprentissage et le plaisir au-delà de la dernière page avec ces activités.',
    },
  },
  {
    id: 'article-reluctant-readers', kind: 'article', slug: 'reluctant-readers', minutes: 7, emoji: '💪',
    categoryKey: 'engagement', categoryColor: 'bg-pink-100 text-pink-700', popular: false,
    title: {
      en: 'Building a Love for Reading in Reluctant Readers',
      es: 'Cultivar el amor por la lectura en lectores reticentes',
      fr: 'Faire aimer la lecture aux lecteurs réticents',
    },
    description: {
      en: 'Practical strategies to help children who resist reading discover the joy of books.',
      es: 'Estrategias prácticas para que los niños que se resisten descubran el placer de los libros.',
      fr: 'Stratégies concrètes pour aider les enfants qui résistent à découvrir le plaisir des livres.',
    },
  },
  {
    id: 'article-perfect-reading-environment', kind: 'article', slug: 'perfect-reading-environment', minutes: 4, emoji: '🏠',
    categoryKey: 'readingTips', categoryColor: 'bg-blue-100 text-blue-700', popular: false,
    title: {
      en: 'Creating the Perfect Reading Environment',
      es: 'Crear el ambiente perfecto para leer',
      fr: 'Créer l’environnement de lecture idéal',
    },
    description: {
      en: 'Design a space that makes your child excited to pick up a book.',
      es: 'Diseña un espacio que invite a tu peque a coger un libro con ganas.',
      fr: 'Aménagez un espace qui donne envie à votre enfant de prendre un livre.',
    },
  },
  {
    id: 'article-bilingual-reading', kind: 'article', slug: 'bilingual-reading', minutes: 6, emoji: '🧠',
    categoryKey: 'childDev', categoryColor: 'bg-green-100 text-green-700', popular: false,
    title: {
      en: 'Why Bilingual Reading Matters',
      es: 'Por qué importa leer en dos idiomas',
      fr: 'Pourquoi la lecture bilingue est importante',
    },
    description: {
      en: 'The science behind reading in two languages and why code-switching is a gift, not a problem.',
      es: 'La ciencia detrás de la lectura bilingüe y por qué mezclar idiomas es un don, no un problema.',
      fr: 'La science derrière la lecture en deux langues et pourquoi mélanger les langues est un don.',
    },
  },
];

export const RESOURCE_IDS = resources.map((r) => r.id);
export const isResourceId = (v: string): boolean => RESOURCE_IDS.includes(v);
export const resourceById = (id: string): Resource | undefined => resources.find((r) => r.id === id);

/** Public href for a resource in the given language-prefixed base ('' | '/es' | '/fr'). */
export function resourceHref(r: Resource, prefix = ''): string {
  return r.kind === 'article' ? `${prefix}/resources#${r.slug}` : `/download/${r.slug}`;
}
