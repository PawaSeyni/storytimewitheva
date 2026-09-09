// Reading journeys (Sprint 7 S7-003) — BROWSER-FREE content records.
//
// A journey is an ORDERED set of steps over stable ids: read a book, talk about it (its
// own discussion prompts), try a related activity, hand the grown-up a resource, then the
// next book. Nothing here duplicates catalog content: every step is a reference, resolved
// at render time, and every reference is validated at build time (contentIndex.
// journeyProblems) so a published journey can never point at a missing or draft item.
//
// EDITORIAL: the three journeys below are drafted from the strongest existing
// relationships (the kindness pair, the patience trio, the sky/curiosity cluster). Their
// titles and descriptions were APPROVED by the owner on 2026-09-09 (punch list RJ-06);
// change them here and re-run the suites. Step order is editorial and deterministic;
// `optional` marks a step the reader may skip without the journey feeling incomplete.

import type { Language } from '../lib/language';
import type { ThemeId, AgeBandId } from './taxonomy';

type LocalizedText = Record<Language, string>;

export type JourneyStepType = 'book' | 'discussion' | 'activity' | 'resource' | 'next-book';

export interface JourneyStep {
  /** Stable within the journey: `${journeyId}-${n}`. Progress is keyed on it. */
  id: string;
  type: JourneyStepType;
  /** Book id, activity slug, or resource id, by type. `discussion` names the book. */
  contentId: string;
  optional?: boolean;
}

export interface ReadingJourney {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  ageBandIds: AgeBandId[];
  themeIds: ThemeId[];
  steps: JourneyStep[];
  publishState: 'draft' | 'published';
}

export const journeys: ReadingJourney[] = [
  {
    id: 'kindness-that-shines',
    publishState: 'published',
    ageBandIds: ['ages-6-7'],
    themeIds: ['kindness', 'self-worth'],
    title: {
      en: 'Kindness that shines',
      fr: 'La bonté qui rayonne',
      es: 'La bondad que brilla',
    },
    description: {
      en: 'Two stories about being seen for who you are, a feelings game to name what the characters felt, and a guide for the conversation afterwards.',
      fr: 'Deux histoires sur le fait d’être vu pour ce que l’on est, un jeu des émotions pour nommer ce que ressentent les personnages, et un guide pour la conversation qui suit.',
      es: 'Dos historias sobre ser visto tal como eres, un juego de emociones para nombrar lo que sienten los personajes y una guía para la conversación de después.',
    },
    steps: [
      { id: 'kindness-that-shines-1', type: 'book', contentId: 'crooked-little-apple-tree' },
      { id: 'kindness-that-shines-2', type: 'discussion', contentId: 'crooked-little-apple-tree' },
      { id: 'kindness-that-shines-3', type: 'activity', contentId: 'emotion-wheel' },
      { id: 'kindness-that-shines-4', type: 'resource', contentId: 'download-parents-guide', optional: true },
      { id: 'kindness-that-shines-5', type: 'next-book', contentId: 'true-beauty-meadowbrook' },
    ],
  },
  {
    id: 'the-slow-road-to-mastery',
    publishState: 'published',
    ageBandIds: ['ages-8-9'],
    themeIds: ['patience-mastery'],
    title: {
      en: 'The slow road to mastery',
      fr: 'Le long chemin de la maîtrise',
      es: 'El largo camino hacia la maestría',
    },
    description: {
      en: 'A woodworker, an inventor, and a stone carver learn the same thing the slow way. Read, talk, make something with your hands, then read the next one.',
      fr: 'Un menuisier, une inventrice et une sculptrice apprennent la même chose, lentement. Lisez, parlez-en, fabriquez quelque chose de vos mains, puis lisez la suivante.',
      es: 'Un carpintero, una inventora y una escultora aprenden lo mismo, despacio. Lee, conversa, haz algo con las manos y luego lee la siguiente.',
    },
    steps: [
      { id: 'the-slow-road-to-mastery-1', type: 'book', contentId: 'sanding-block' },
      { id: 'the-slow-road-to-mastery-2', type: 'discussion', contentId: 'sanding-block' },
      { id: 'the-slow-road-to-mastery-3', type: 'activity', contentId: 'bookmark-designer' },
      { id: 'the-slow-road-to-mastery-4', type: 'resource', contentId: 'article-follow-up-activities', optional: true },
      { id: 'the-slow-road-to-mastery-5', type: 'next-book', contentId: 'heidis-journey-to-mastery' },
    ],
  },
  {
    id: 'curious-about-the-sky',
    publishState: 'published',
    ageBandIds: ['ages-6-7'],
    themeIds: ['curiosity', 'wonder'],
    title: {
      en: 'Curious about the sky',
      fr: 'Curieux du ciel',
      es: 'Curiosos por el cielo',
    },
    description: {
      en: 'Clouds you cannot keep, a map that comes true, and a story map to explore between them. For the child who asks why the sky does that.',
      fr: 'Des nuages qu’on ne peut pas garder, une carte qui devient vraie, et une carte aux histoires à explorer entre les deux. Pour l’enfant qui demande pourquoi le ciel fait ça.',
      es: 'Nubes que no se pueden guardar, un mapa que se hace realidad y un mapa de historias para explorar entre medias. Para el peque que pregunta por qué el cielo hace eso.',
    },
    steps: [
      { id: 'curious-about-the-sky-1', type: 'book', contentId: 'cloud-collector' },
      { id: 'curious-about-the-sky-2', type: 'discussion', contentId: 'cloud-collector' },
      { id: 'curious-about-the-sky-3', type: 'activity', contentId: 'story-map' },
      { id: 'curious-about-the-sky-4', type: 'resource', contentId: 'article-making-reading-magical', optional: true },
      { id: 'curious-about-the-sky-5', type: 'next-book', contentId: 'little-mapmaker' },
    ],
  },
];
