// Learning PACKS (Sprint 7 S7-008) — BROWSER-FREE editorial records.
//
// DECISION (Sprint 7 §14, "static files, generated files, or curated groups of existing
// downloads"): a pack is a CURATED GROUP OF EXISTING DOWNLOADS. No new PDFs, no zip
// (most of this traffic is mobile and a parent on a phone cannot open one), no copied
// metadata: each pack lists resource ids from src/data/resources.ts and everything else
// (titles, per-language file, the stable /download link) is resolved from the registry.
//
// A published pack is ALSO a lead magnet: EmailSignup builds its offer from this record,
// so /free/<pack id> is the gated landing page that delivers every file as a named link.
// The pack id is therefore a magnet slug and a route token, and must not collide with a
// registered magnet, a download slug, or a collection id (contentIndex.learningPackProblems).
//
// Items link to /download/<slug>[?lang=xx], never to a hashed filename, so a rebuilt PDF
// never rots a pack (scripts/gen-download-redirects.mjs owns the hash).

import type { Language } from '../lib/language';
import type { ThemeId, AgeBandId } from './taxonomy';
import type { Resource } from './resources';

type LocalizedText = Record<Language, string>;

export type PackAudience = 'parent' | 'educator' | 'both';

export interface LearningPack {
  /** Route token AND lead-magnet slug: /free/<id>, /download/<id>. */
  id: string;
  audience: PackAudience;
  ageBandIds: AgeBandId[];
  themeIds?: ThemeId[];
  /** Ordered ids of kind 'download' resources. At least two, all distinct. */
  resourceIds: string[];
  /** Published collections this pack accompanies (shown on those pages). */
  collectionIds?: string[];
  title: LocalizedText;
  description: LocalizedText;
  publishState: 'draft' | 'published';
  emoji?: string;
}

/** Stable, language-aware link for one printable inside a pack. */
export function packItemHref(r: Resource, language: Language): string {
  const lang = r.localizedFile && language !== 'en' ? `?lang=${language}` : '';
  return `/download/${r.slug}${lang}`;
}

export const learningPacks: LearningPack[] = [
  {
    id: 'classroom-pack',
    audience: 'educator',
    ageBandIds: ['ages-3-5', 'ages-6-7', 'ages-8-9'],
    resourceIds: ['download-parents-guide', 'download-follow-up-activities', 'download-bilingual-flashcards'],
    collectionIds: ['classroom-feelings', 'classroom-bilingual', 'classroom-stem-curiosity'],
    publishState: 'published',
    emoji: '🍎',
    title: {
      en: 'Classroom printables pack',
      fr: 'Pack de fiches pour la classe',
      es: 'Paquete de imprimibles para el aula',
    },
    description: {
      en: 'The three printables teachers reach for most, in one download: the parent and teacher guide with discussion prompts for every story, the follow-up activity sheets, and the bilingual flashcards for vocabulary warm-ups.',
      fr: 'Les trois supports que les enseignants utilisent le plus, en un seul téléchargement : le guide parents et enseignants avec des questions de discussion pour chaque histoire, les fiches d’activités complémentaires et les cartes bilingues pour les échauffements de vocabulaire.',
      es: 'Los tres imprimibles que más usan los docentes, en una sola descarga: la guía para familias y docentes con preguntas para conversar sobre cada historia, las fichas de actividades complementarias y las tarjetas bilingües para calentar el vocabulario.',
    },
  },
  {
    id: 'home-reading-pack',
    audience: 'parent',
    ageBandIds: ['ages-3-5', 'ages-6-7'],
    resourceIds: ['download-bedtime-routine', 'download-parents-guide', 'download-follow-up-activities'],
    collectionIds: ['ages-3-5', 'ages-6-7'],
    publishState: 'published',
    emoji: '🏠',
    title: {
      en: 'Home reading routine pack',
      fr: 'Pack routine de lecture à la maison',
      es: 'Paquete de rutina de lectura en casa',
    },
    description: {
      en: 'Everything for a calm daily reading habit at home: the routine chart to hang on the fridge, the parent guide with prompts to talk about each story, and the follow-up activities for after the last page.',
      fr: 'Tout pour une habitude de lecture quotidienne et sereine à la maison : le tableau de routine à afficher sur le frigo, le guide des parents avec des questions pour parler de chaque histoire, et les activités complémentaires pour après la dernière page.',
      es: 'Todo para un hábito de lectura diario y tranquilo en casa: la tabla de rutina para colgar en la nevera, la guía para familias con preguntas para hablar de cada historia y las actividades complementarias para después de la última página.',
    },
  },
];

export const LEARNING_PACK_IDS = learningPacks.map((p) => p.id);
