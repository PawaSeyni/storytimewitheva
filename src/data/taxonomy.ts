// Catalog taxonomy registries — BROWSER-FREE (loadable by build scripts via the
// projection in scripts/lib/catalog.mjs). Approved in
// docs/architecture/TAXONOMY_PROPOSAL (owner sign-off 2026-09-08), taxonomy v1.
//
// Two rules this file encodes, both deliberate:
//  1. Stable IDs power filtering, collections, search, recommendations and
//     validation. The localized `theme` phrase on each book stays as editorial
//     display copy and is NEVER parsed to infer an ID.
//  2. Age metadata does two different jobs and must not use one rule for both:
//     exact-age containment answers "is this suitable for a child aged X?", while
//     a deterministic primary-fit rule answers "which single collection is the
//     best starting point?". Simple band overlap is rejected — it would place all
//     20 books in both ages-3-5 and ages-6-7, making those collections identical.

import { parseAgeRange } from '../lib/ages';

type Loc = { en: string; fr: string; es: string };

// ---------------------------------------------------------------- themes ----
export const THEME_IDS = [
  'curiosity',
  'diversity',
  'humility-listening',
  'wonder',
  'creativity',
  'kindness',
  'courage',
  'gratitude',
  'self-worth',
  'patience-mastery',
  'emotions',
  'honesty',
  'heritage',
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemeDefinition {
  id: ThemeId;
  labels: Loc;
  descriptions: Loc;
}

/** A theme needs at least this many published books before it may generate a
 *  public collection route (avoids thin pages without corrupting book metadata). */
export const THEME_COLLECTION_MINIMUM = 2;

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  curiosity: {
    id: 'curiosity',
    labels: { en: 'Curiosity & Discovery', fr: 'Curiosité et découverte', es: 'Curiosidad y descubrimiento' },
    descriptions: {
      en: 'Asking questions, observing closely, investigating, and learning how the world works.',
      fr: 'Poser des questions, observer attentivement, explorer et comprendre le monde.',
      es: 'Hacer preguntas, observar con atención, investigar y aprender cómo funciona el mundo.',
    },
  },
  diversity: {
    id: 'diversity',
    labels: { en: 'Diversity & Belonging', fr: 'Diversité et appartenance', es: 'Diversidad y pertenencia' },
    descriptions: {
      en: 'Valuing difference, inclusion, harmony, and the experience of being welcomed or seen.',
      fr: "Valoriser la différence, l'inclusion, l'harmonie et le sentiment d'être accueilli.",
      es: 'Valorar la diferencia, la inclusión, la armonía y la experiencia de ser acogido.',
    },
  },
  'humility-listening': {
    id: 'humility-listening',
    labels: { en: 'Humility & Listening', fr: 'Humilité et écoute', es: 'Humildad y escucha' },
    descriptions: {
      en: 'Learning to listen, reconsider certainty, receive guidance, and recognize other perspectives.',
      fr: "Apprendre à écouter, remettre en question ses certitudes et reconnaître d'autres points de vue.",
      es: 'Aprender a escuchar, cuestionar certezas y reconocer otras perspectivas.',
    },
  },
  wonder: {
    id: 'wonder',
    labels: { en: 'Wonder', fr: 'Émerveillement', es: 'Asombro' },
    descriptions: {
      en: 'Attentiveness to beauty, mystery, nature, and quiet magic.',
      fr: 'Attention à la beauté, au mystère, à la nature et à la magie tranquille.',
      es: 'Atención a la belleza, el misterio, la naturaleza y la magia serena.',
    },
  },
  creativity: {
    id: 'creativity',
    labels: { en: 'Creativity & Imagination', fr: 'Créativité et imagination', es: 'Creatividad e imaginación' },
    descriptions: {
      en: 'Making, imagining, inventing, drawing, music, and expressive problem-solving.',
      fr: "Créer, imaginer, inventer, dessiner, faire de la musique et résoudre avec expressivité.",
      es: 'Crear, imaginar, inventar, dibujar, hacer música y resolver con expresión.',
    },
  },
  kindness: {
    id: 'kindness',
    labels: { en: 'Kindness', fr: 'Bonté', es: 'Bondad' },
    descriptions: {
      en: 'Compassion, generosity, inclusion, care, and helpful action.',
      fr: 'Compassion, générosité, inclusion, attention et gestes utiles.',
      es: 'Compasión, generosidad, inclusión, cuidado y acciones que ayudan.',
    },
  },
  courage: {
    id: 'courage',
    labels: { en: 'Courage', fr: 'Courage', es: 'Valentía' },
    descriptions: {
      en: 'Acting despite fear, telling the truth, protecting others, or trying something difficult.',
      fr: "Agir malgré la peur, dire la vérité, protéger les autres ou tenter quelque chose de difficile.",
      es: 'Actuar a pesar del miedo, decir la verdad, proteger a otros o intentar algo difícil.',
    },
  },
  gratitude: {
    id: 'gratitude',
    labels: { en: 'Gratitude & Contentment', fr: 'Gratitude et contentement', es: 'Gratitud y satisfacción' },
    descriptions: {
      en: 'Appreciating what matters, recognizing enough, and seeing value beyond possessions.',
      fr: "Apprécier l'essentiel, reconnaître ce qui suffit et voir au-delà des possessions.",
      es: 'Apreciar lo que importa, reconocer lo suficiente y ver más allá de las posesiones.',
    },
  },
  'self-worth': {
    id: 'self-worth',
    labels: { en: 'Self-Worth & Being Seen', fr: 'Estime de soi et reconnaissance', es: 'Autoestima y reconocimiento' },
    descriptions: {
      en: 'Recognizing inherent value, inner beauty, belonging, and emotional worth.',
      fr: "Reconnaître sa valeur, sa beauté intérieure, son appartenance et sa valeur émotionnelle.",
      es: 'Reconocer el valor propio, la belleza interior, la pertenencia y el valor emocional.',
    },
  },
  'patience-mastery': {
    id: 'patience-mastery',
    labels: { en: 'Patience & Mastery', fr: 'Patience et maîtrise', es: 'Paciencia y maestría' },
    descriptions: {
      en: 'Practice, persistence, learning over time, careful work, and earned skill.',
      fr: "Pratique, persévérance, apprentissage dans la durée, travail soigné et savoir-faire acquis.",
      es: 'Práctica, persistencia, aprendizaje con el tiempo, trabajo cuidadoso y destreza ganada.',
    },
  },
  emotions: {
    id: 'emotions',
    labels: { en: 'Emotions & Transformation', fr: 'Émotions et transformation', es: 'Emociones y transformación' },
    descriptions: {
      en: 'Naming, accepting, and moving through strong feelings or personal change.',
      fr: 'Nommer, accepter et traverser des émotions fortes ou un changement personnel.',
      es: 'Nombrar, aceptar y atravesar emociones fuertes o un cambio personal.',
    },
  },
  honesty: {
    id: 'honesty',
    labels: { en: 'Honesty & Trust', fr: 'Honnêteté et confiance', es: 'Honestidad y confianza' },
    descriptions: {
      en: 'Truthfulness, consequences, repairing trust, and second chances.',
      fr: 'Vérité, conséquences, réparation de la confiance et secondes chances.',
      es: 'Verdad, consecuencias, reparar la confianza y segundas oportunidades.',
    },
  },
  heritage: {
    id: 'heritage',
    labels: { en: 'Heritage & Memory', fr: 'Héritage et mémoire', es: 'Herencia y memoria' },
    descriptions: {
      en: 'Family history, cultural memory, inherited places, traditions, and stories.',
      fr: 'Histoire familiale, mémoire culturelle, lieux hérités, traditions et récits.',
      es: 'Historia familiar, memoria cultural, lugares heredados, tradiciones y relatos.',
    },
  },
};

export const isThemeId = (v: string): v is ThemeId => (THEME_IDS as readonly string[]).includes(v);

// ------------------------------------------------------------- age bands ----
export const AGE_BAND_IDS = ['ages-3-5', 'ages-6-7', 'ages-8-9'] as const;
export type AgeBandId = (typeof AGE_BAND_IDS)[number];

/**
 * Age bands carry a localized introduction as well as a label because an age collection
 * page (S7-002) is held to the same gate as a theme collection: a unique EN/FR/ES intro,
 * or no route. The intro describes the READING stage, not the child, so it stays true
 * across the whole band.
 */
export const AGE_BANDS: Record<AgeBandId, { id: AgeBandId; labels: Loc; descriptions: Loc }> = {
  'ages-3-5': {
    id: 'ages-3-5',
    labels: { en: 'Ages 3-5', fr: '3-5 ans', es: 'Edades 3-5' },
    descriptions: {
      en: 'First read-alouds: short, gentle stories with a single big feeling, made to be read again tomorrow. Best fit for the youngest listeners, and still loved by their older siblings.',
      fr: 'Premières lectures à voix haute : des histoires courtes et douces, une seule grande émotion, faites pour être relues demain. Idéales pour les plus petits, et toujours aimées de leurs aînés.',
      es: 'Primeras lecturas en voz alta: historias cortas y suaves, con una sola gran emoción, hechas para releerse mañana. Ideales para los más pequeños, y queridas también por sus hermanos mayores.',
    },
  },
  'ages-6-7': {
    id: 'ages-6-7',
    labels: { en: 'Ages 6-7', fr: '6-7 ans', es: 'Edades 6-7' },
    descriptions: {
      en: 'Stories with a real question inside them: kindness, courage, being seen. Long enough for a proper bedtime, short enough to finish. This is where most of the collection lives.',
      fr: 'Des histoires qui portent une vraie question : la bonté, le courage, être vu. Assez longues pour un vrai moment du soir, assez courtes pour être terminées. C’est ici que vit la plus grande partie de la collection.',
      es: 'Historias con una pregunta de verdad dentro: la bondad, el valor, ser visto. Lo bastante largas para una buena hora de dormir, lo bastante cortas para terminarlas. Aquí vive la mayor parte de la colección.',
    },
  },
  'ages-8-9': {
    id: 'ages-8-9',
    labels: { en: 'Ages 8-9', fr: '8-9 ans', es: 'Edades 8-9' },
    descriptions: {
      en: 'For readers who can sit with a harder idea: patience, humility, what we owe each other. Richer language, longer arcs, and endings worth talking about.',
      fr: 'Pour les lecteurs capables de rester avec une idée plus difficile : la patience, l’humilité, ce que nous nous devons les uns aux autres. Une langue plus riche, des arcs plus longs, des fins qui méritent une conversation.',
      es: 'Para lectores que pueden quedarse con una idea más difícil: la paciencia, la humildad, lo que nos debemos unos a otros. Un lenguaje más rico, arcos más largos y finales que merecen una conversación.',
    },
  },
};

/**
 * Suitability filtering — "is this book suitable for a child aged X?"
 * Exact containment, so a 5-9 book never disappears when a parent picks age 5.
 */
export function supportsAge(ageRange: string, age: number): boolean {
  const [min, max] = parseAgeRange(ageRange);
  return age >= min && age <= max;
}

/**
 * Discovery placement — the ONE collection a book leads with. Deterministic, and
 * deliberately not "any overlap" (see the header note). Every published book must
 * resolve to exactly one band; a CI test enforces that.
 * NOTE: this is a starting-point rule, not a claim that the book is unsuitable
 * outside its primary band — suitability is `supportsAge`.
 */
export function derivePrimaryAgeBand(ageRange: string): AgeBandId {
  const [min, max] = parseAgeRange(ageRange);
  if (min <= 3 && max <= 7) return 'ages-3-5';
  if (min >= 5 && max >= 9) return 'ages-8-9';
  return 'ages-6-7';
}
