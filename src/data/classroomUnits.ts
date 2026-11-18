// Classroom units (activities audit 2026-11, §5c item 5): five themed teacher units, each an
// OPEN page at /classroom/<unit-id> plus a GATED printable pack at /free/<unit-id>-pack.
// BROWSER-FREE, so the prerender, the sitemap, the inventory and the funnel tests read the
// same list through scripts/lib/catalog.mjs (loadClassroomUnits).
//
// A unit is a curated five-day plan over things that ALREADY exist: two or three books that
// really carry the unit's theme (validated against books.data themeIds), their Studio
// activities (validated against each book's relatedActivityIds), the story worksheet,
// Pixel's Story Quiz and the word games (anyBook activities, opened in book mode with
// ?book=<id>), the books' own discussion prompts and their story words (bookVocab). Nothing
// here says anything about a book beyond its catalog description.
//
// The pack (EmailSignup UNIT_MAGNETS) delivers, as named links: each book's worksheet and
// quiz, the unit's Studio activities (pages, opened) and the classroom printables listed in
// `resourceIds` (files, downloaded through /download/<slug>). The pack slug must not collide
// with any magnet, learning pack, companion, download or collection (prerender guard and
// tests/funnel/classroom-units.test.mjs).

import { books, type Book } from './books.data';
import { activities } from './activities.data';
import { resources } from './resources';
import { THEME_IDS, type ThemeId } from './taxonomy';
import type { Language } from '../lib/language';
import { LANGUAGES, prefixOf } from '../lib/locales';

type LocalizedText = Record<Language, string>;

/** One thing to open on a day: a book to read (no activityId), or an activity opened in that
 *  book's mode (?book=<id>). The activity must be related to the book or be `anyBook`. The
 *  five-day plans themselves live in ./classroomUnitPlans.ts, so the signup form (which only
 *  needs these records) does not carry 25 days of teacher notes in three languages. */
export interface UnitStep {
  bookId: string;
  activityId?: string;
}

export interface ClassroomUnit {
  /** Route token (/classroom/<id>); the pack slug is `${id}-pack`. */
  id: string;
  themeIds: ThemeId[];
  /** Two or three published books, each carrying one of themeIds. */
  bookIds: string[];
  /** The Studio activities the plan uses, each related to one of the unit's books. These are
   *  what the pack lists as "activities", so a plan step on one of them must appear here. */
  activityIds: string[];
  /** Classroom printables (kind 'download') delivered with the pack. */
  resourceIds: string[];
  emoji: string;
  title: LocalizedText;
  description: LocalizedText;
  publishState: 'draft' | 'published';
}

export const unitPackSlug = (unitId: string) => `${unitId}-pack`;

export const classroomUnits: ClassroomUnit[] = [
  {
    id: 'unit-kindness',
    publishState: 'published',
    themeIds: ['kindness'],
    bookIds: ['sparrow-saved-forest', 'butterfly-effect', 'true-beauty-meadowbrook'],
    activityIds: ['small-noticer', 'kindness-chain', 'kindness-mirror'],
    resourceIds: ['download-parents-guide', 'download-follow-up-activities'],
    emoji: '💛',
    title: {
      en: 'Kindness: small acts that travel',
      es: 'Bondad: pequeños gestos que viajan',
      fr: 'Bonté : de petits gestes qui voyagent',
    },
    description: {
      en: 'A week on kindness with three read-alouds: the smallest sparrow who notices what the big animals miss, one kind act that travels through a whole community, and a quiet girl who shines by being kind. Each day pairs a story with a Studio activity, a worksheet or a word game.',
      es: 'Una semana sobre la bondad con tres lecturas en voz alta: el gorrión más pequeño que nota lo que los animales grandes no ven, un gesto amable que recorre toda una comunidad y una niña tranquila que brilla por su bondad. Cada día combina una historia con una actividad del Estudio, una ficha o un juego de palabras.',
      fr: 'Une semaine sur la bonté avec trois lectures à voix haute : le plus petit moineau qui remarque ce que les grands animaux ne voient pas, un geste gentil qui traverse toute une communauté, et une fille discrète qui brille par sa gentillesse. Chaque jour associe une histoire à une activité du Studio, une fiche ou un jeu de mots.',
    },
  },
  {
    id: 'unit-patience',
    publishState: 'published',
    themeIds: ['patience-mastery'],
    bookIds: ['sanding-block', 'heidis-journey-to-mastery', 'miras-thousand-cubes'],
    activityIds: ['rough-to-smooth', 'inventor-blueprint', 'thousand-cubes-challenge', 'patient-maker-passport'],
    resourceIds: ['download-parents-guide', 'download-follow-up-activities'],
    emoji: '🪵',
    title: {
      en: 'Patience: getting good at something, slowly',
      es: 'Paciencia: aprender algo poco a poco',
      fr: 'Patience : apprendre quelque chose, pas à pas',
    },
    description: {
      en: 'Three apprentices and three patient teachers: a boy handed a sanding block, Heidi handed a broom, and Mira set to carve a thousand plain cubes. A week about the slow road from dreaming to making, with a practice card, a blueprint, a 30-day chart and a passport to show for it.',
      es: 'Tres aprendices y tres maestros pacientes: un niño que recibe un bloque de lijar, Heidi que recibe una escoba y Mira que debe tallar mil cubos iguales. Una semana sobre el camino lento de soñar a hacer, con una tarjeta de práctica, un plano, una tabla de 30 días y un pasaporte para demostrarlo.',
      fr: 'Trois apprentis et trois maîtres patients : un garçon qui reçoit un bloc à poncer, Heidi qui reçoit un balai, et Mira qui doit tailler mille cubes identiques. Une semaine sur le long chemin du rêve à la réalisation, avec une carte d’entraînement, un plan, un tableau de 30 jours et un passeport pour le prouver.',
    },
  },
  {
    id: 'unit-courage',
    publishState: 'published',
    themeIds: ['courage'],
    bookIds: ['diegos-brave-leap', 'leo-and-the-wolf'],
    activityIds: ['first-day-brave-plan', 'brave-breathing', 'trust-meter'],
    resourceIds: ['download-parents-guide', 'download-follow-up-activities'],
    emoji: '🦁',
    title: {
      en: 'Courage: being brave and telling the truth',
      es: 'Valentía: ser valiente y decir la verdad',
      fr: 'Courage : être courageux et dire la vérité',
    },
    description: {
      en: 'Two kinds of courage for the start of a school year: Diego at the edge of the cliff with everyone watching, and Leo, who shouted “Wolf!” for fun and has a long road back to being believed. A brave plan, a breathing break, a trust meter and two worksheets.',
      es: 'Dos clases de valentía para empezar el curso: Diego al borde del acantilado con todos mirando, y Leo, que gritó «¡Lobo!» por diversión y tiene un largo camino hasta que vuelvan a creerle. Un plan valiente, una pausa para respirar, un medidor de confianza y dos fichas.',
      fr: 'Deux sortes de courage pour la rentrée : Diego au bord de la falaise sous tous les regards, et Léo, qui a crié « Au loup ! » pour rire et a un long chemin à faire avant qu’on le croie à nouveau. Un plan courageux, une pause respiration, un baromètre de la confiance et deux fiches.',
    },
  },
  {
    id: 'unit-feelings',
    publishState: 'published',
    themeIds: ['emotions', 'self-worth'],
    bookIds: ['pawa-rainbow-cloud', 'crooked-little-apple-tree'],
    activityIds: ['feelings-weather-report', 'emotion-wheel', 'one-of-a-kind-tree'],
    resourceIds: ['download-parents-guide', 'download-follow-up-activities'],
    emoji: '🌈',
    title: {
      en: 'Feelings: big emotions and being seen',
      es: 'Emociones: sentir mucho y saber que vales',
      fr: 'Émotions : ressentir fort et savoir qu’on compte',
    },
    description: {
      en: 'A gentle week for the youngest classes: Cirro, a little gray cloud who thinks his tears only make a mess, and a crooked apple tree overlooked for years until someone really looks. A weather report for feelings, the feelings wheel, a one-of-a-kind tree for the class orchard wall, and a worksheet.',
      es: 'Una semana suave para las clases más pequeñas: Cirro, una nubecita gris que cree que sus lágrimas solo ensucian, y un manzano torcido ignorado durante años hasta que alguien mira de verdad. Un parte del tiempo emocional, la rueda de las emociones, un árbol único para la pared del aula y una ficha.',
      fr: 'Une semaine douce pour les plus petites classes : Cirro, un petit nuage gris qui croit que ses larmes ne font que du désordre, et un pommier tordu oublié pendant des années jusqu’à ce que quelqu’un regarde vraiment. Une météo des émotions, la roue des émotions, un arbre unique pour le mur de la classe et une fiche.',
    },
  },
  {
    id: 'unit-curiosity',
    publishState: 'published',
    themeIds: ['curiosity'],
    bookIds: ['cloud-collector', 'little-mapmaker', 'colors-mixed-up'],
    activityIds: ['cloud-detective-journal', 'map-my-world', 'color-mix-lab'],
    resourceIds: ['download-parents-guide', 'download-follow-up-activities'],
    emoji: '🔭',
    title: {
      en: 'Curiosity: looking closely at the world',
      es: 'Curiosidad: mirar el mundo de cerca',
      fr: 'Curiosité : regarder le monde de près',
    },
    description: {
      en: 'Three young observers: Luna who wants to catch one cloud of every kind, Maya who draws maps that come true, and Hawel who wakes to a world with every color swapped. A week of looking closely, with a cloud journal, a map of the classroom, a color recipe card and flashcards in three languages.',
      es: 'Tres pequeños observadores: Luna, que quiere atrapar una nube de cada tipo; Maya, que dibuja mapas que se hacen realidad; y Hawel, que despierta en un mundo con todos los colores cambiados. Una semana de mirar de cerca, con un diario de nubes, un mapa del aula, una receta de colores y tarjetas en tres idiomas.',
      fr: 'Trois jeunes observateurs : Luna, qui veut attraper un nuage de chaque sorte ; Maya, qui dessine des cartes qui deviennent vraies ; et Hawel, qui se réveille dans un monde où toutes les couleurs sont échangées. Une semaine à regarder de près, avec un carnet des nuages, une carte de la classe, une recette de couleurs et des cartes en trois langues.',
    },
  },
];

// ---------------------------------------------------------------------------------------
// Derivations and validation
// ---------------------------------------------------------------------------------------

const bookById = new Map(books.map((b) => [b.id, b]));
const activityBySlug = new Map(activities.map((a) => [a.slug, a]));
const resourceById = new Map(resources.map((r) => [r.id, r]));

/** The unit's books, in unit order (missing ids are dropped; the validator reports them). */
export function unitBooks(unit: ClassroomUnit): Book[] {
  return unit.bookIds.map((id) => bookById.get(id)).filter((b): b is Book => b !== undefined);
}

/** "4-9": the youngest low and the oldest high of the unit's books. */
export function unitAgeRange(unit: ClassroomUnit): string {
  const ranges = unitBooks(unit).map((b) => b.ageRange.split('-').map(Number));
  if (ranges.length === 0) return '';
  return `${Math.min(...ranges.map((r) => r[0]))}-${Math.max(...ranges.map((r) => r[1]))}`;
}

/** The story worksheet for a book: Leo has a hand-written one, every other book the generated one. */
export const worksheetSlug = (bookId: string) => (bookId === 'leo-and-the-wolf' ? 'leo-and-the-wolf-worksheet' : 'story-worksheet');

/** A shared tool opened in book mode (worksheet, quiz, word games), as opposed to one of the
 *  unit's own Studio activities. */
export const isSharedTool = (slug: string, bookId: string) => Boolean(activityBySlug.get(slug)?.anyBook) || slug === worksheetSlug(bookId);

/** Whether `?book=<id>` would be accepted on that activity (mirrors lib/journey sourceBookFor). */
export function opensInBookMode(activitySlug: string, bookId: string): boolean {
  const a = activityBySlug.get(activitySlug);
  const b = bookById.get(bookId);
  if (!a || !b) return false;
  return Boolean(a.anyBook) || (b.relatedActivityIds ?? []).includes(activitySlug);
}

/** Site path for one plan step in the visitor's language: the book page, an activity page
 *  in book mode, or a standalone game (language as ?lang=, like gameUrl). */
export function unitStepHref(step: UnitStep, language: Language): string {
  const lang = prefixOf(language);
  if (!step.activityId) return `${lang}/books/${step.bookId}/`;
  const a = activityBySlug.get(step.activityId);
  const q = `?book=${encodeURIComponent(step.bookId)}`;
  if (a?.game) return `/games/${step.activityId}.html${q}${language === 'en' ? '' : `&lang=${language}`}`;
  return `${lang}/activities/${step.activityId}/${q}`;
}

export type UnitPackItemKind = 'worksheet' | 'quiz' | 'activity' | 'resource';
export interface UnitPackItem {
  kind: UnitPackItemKind;
  /** worksheet / quiz: the book. */
  bookId?: string;
  activityId?: string;
  resourceId?: string;
  href: string;
  /** A page on the site (opened), not a file (downloaded). */
  page: boolean;
}

/** What the gated pack delivers, in the visitor's language: each book's worksheet and quiz,
 *  the unit's Studio activities, then the classroom printables (files). */
export function unitPackItems(unit: ClassroomUnit, language: Language): UnitPackItem[] {
  const lang = prefixOf(language);
  const q = (id: string) => `?book=${encodeURIComponent(id)}`;
  const out: UnitPackItem[] = [];
  for (const bookId of unit.bookIds) {
    const ws = worksheetSlug(bookId);
    out.push({ kind: 'worksheet', bookId, activityId: ws, href: `${lang}/activities/${ws}/${q(bookId)}`, page: true });
    out.push({ kind: 'quiz', bookId, activityId: 'pixel-quiz', href: `${lang}/activities/pixel-quiz/${q(bookId)}`, page: true });
  }
  for (const activityId of unit.activityIds) {
    // Open the activity from the first unit book that relates to it, so it lands in book mode.
    const bookId = unit.bookIds.find((id) => opensInBookMode(activityId, id));
    out.push({ kind: 'activity', activityId, bookId, href: unitStepHref({ bookId: bookId ?? unit.bookIds[0], activityId }, language), page: true });
  }
  for (const resourceId of unit.resourceIds) {
    const r = resourceById.get(resourceId);
    if (!r) continue;
    const lq = r.localizedFile && language !== 'en' ? `?lang=${language}` : '';
    out.push({ kind: 'resource', resourceId, href: `/download/${r.slug}${lq}`, page: false });
  }
  return out;
}

/** Every reason a unit RECORD may not publish (books, themes, activities, printables, copy).
 *  Empty = valid. Its five-day plan is validated separately by classroomUnitPlans.unitPlanProblems,
 *  which the tests and the content inventory gate run. */
export function classroomUnitProblems(u: ClassroomUnit): string[] {
  const out: string[] = [];
  if (!/^unit-[a-z0-9-]+$/.test(u.id)) out.push(`id "${u.id}" is not a unit-<name> route token`);
  if (classroomUnits.filter((x) => x.id === u.id).length > 1) out.push(`duplicate unit id "${u.id}"`);
  if (u.themeIds.length === 0) out.push(`${u.id}: no themes`);
  for (const t of u.themeIds) if (!(THEME_IDS as readonly string[]).includes(t)) out.push(`${u.id}: unknown theme "${t}"`);
  if (u.bookIds.length < 2 || u.bookIds.length > 3) out.push(`${u.id}: a unit has two or three books`);
  if (new Set(u.bookIds).size !== u.bookIds.length) out.push(`${u.id}: duplicate book`);
  for (const id of u.bookIds) {
    const b = bookById.get(id);
    if (!b) { out.push(`${u.id}: book "${id}" does not exist`); continue; }
    if (b.status === 'coming-soon') out.push(`${u.id}: book "${id}" is not published`);
    if (!b.themeIds.some((t) => u.themeIds.includes(t))) out.push(`${u.id}: book "${id}" carries none of the unit's themes`);
    if (!(b.discussionQuestions?.length)) out.push(`${u.id}: book "${id}" has no discussion prompts`);
  }
  if (u.activityIds.length === 0) out.push(`${u.id}: no Studio activities`);
  if (new Set(u.activityIds).size !== u.activityIds.length) out.push(`${u.id}: duplicate activity`);
  for (const slug of u.activityIds) {
    const a = activityBySlug.get(slug);
    if (!a) { out.push(`${u.id}: activity "${slug}" does not exist`); continue; }
    if (u.bookIds.some((id) => isSharedTool(slug, id))) out.push(`${u.id}: "${slug}" is a shared tool, not one of the unit's Studio activities`);
    if (!u.bookIds.some((id) => opensInBookMode(slug, id))) out.push(`${u.id}: activity "${slug}" is not related to any unit book`);
  }
  if (u.resourceIds.length === 0) out.push(`${u.id}: no classroom printables`);
  for (const rid of u.resourceIds) {
    const r = resourceById.get(rid);
    if (!r) out.push(`${u.id}: resource "${rid}" does not exist`);
    else if (r.kind !== 'download') out.push(`${u.id}: resource "${rid}" is not a download`);
  }
  for (const l of LANGUAGES) {
    if (!u.title[l]?.trim()) out.push(`${u.id}: missing ${l} title`);
    if (!u.description[l]?.trim() || u.description[l].trim().length < 40) out.push(`${u.id}: missing or thin ${l} description`);
  }
  if (u.title.en.includes('—') || u.description.en.includes('—')) out.push(`${u.id}: em dash in English copy`);
  return out;
}

export const publishedClassroomUnits: ClassroomUnit[] = classroomUnits.filter(
  (u) => u.publishState === 'published' && classroomUnitProblems(u).length === 0,
);
export const CLASSROOM_UNIT_IDS = publishedClassroomUnits.map((u) => u.id);
export const UNIT_PACK_SLUGS = publishedClassroomUnits.map((u) => unitPackSlug(u.id));
export const classroomUnitById: Record<string, ClassroomUnit> = Object.fromEntries(publishedClassroomUnits.map((u) => [u.id, u]));

/** Units that belong on a collection page: share a theme with it AND at least one book. */
export function unitsForCollection(themeIds: readonly string[] | undefined, bookIds: readonly string[]): ClassroomUnit[] {
  return publishedClassroomUnits.filter(
    (u) => u.themeIds.some((t) => (themeIds ?? []).includes(t)) && u.bookIds.some((id) => bookIds.includes(id)),
  );
}
