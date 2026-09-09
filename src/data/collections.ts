// Collection RECORDS (Sprint 7 S7-001) — BROWSER-FREE editorial layer over collections.
//
// A record holds only what cannot be derived. For kind 'theme' and 'age', MEMBERSHIP IS
// STILL DERIVED from the taxonomy (themeIds / primary age band) and the record is optional;
// it may reorder books (`bookOrder`, a validated subset), feature activities (validated:
// each related to at least one member book), attach resources, and override the intro.
// Storing membership twice was rejected on purpose: the spec forbids duplicating
// relationship arrays, and a record that repeated the taxonomy would drift from it.
//
// Editorial kinds ('educator', 'seasonal') have no derived membership, so they carry an
// explicit, validated `bookIds` and are routed through the same eligibility gate
// (contentIndex.collectionProblems). Educator records shipped in S7-007; seasonal awaits S7-012.
//
// The activityIds below were generated from relationship frequency and committed as data
// so an editor can change them; the validator keeps them honest.

import type { Language } from '../lib/language';
import type { ThemeId, AgeBandId } from './taxonomy';

type LocalizedText = Record<Language, string>;

export type CollectionKind = 'theme' | 'age' | 'educator' | 'seasonal';

export interface CollectionRecord {
  /** For theme/age kinds this IS the theme id / band id. For editorial kinds, a route token. */
  id: string;
  kind: CollectionKind;
  publishState: 'draft' | 'published';
  /** Editorial kinds only: explicit membership, in order. Forbidden on theme/age. */
  bookIds?: string[];
  /** Theme/age kinds: an editorial ORDER over the derived membership (subset; the rest follow in catalog order). */
  bookOrder?: string[];
  /** Overrides of the taxonomy intro/title. All three languages or none. */
  title?: LocalizedText;
  description?: LocalizedText;
  /** Featured activities, each related to at least one member book. */
  activityIds?: string[];
  /** Resources for the grown-up, by registry id. */
  resourceIds?: string[];
  /** Editorial kinds: the taxonomy facets they belong to, for filtering and validation. */
  themeIds?: ThemeId[];
  ageBandIds?: AgeBandId[];
  /**
   * Seasonal kind only (S7-012): a RECURRING yearly publish window as 'MM-DD' bounds,
   * inclusive, wrapping the year end when from > to (e.g. 11-15 to 01-06). Outside the
   * window the route still exists but renders an empty state, noindex, and is left out
   * of the sitemap. A boundary takes effect for visitors immediately and for crawlers at
   * the next deploy (the prerender snapshot is taken at build time).
   */
  window?: { from: string; to: string };
}

export const collections: CollectionRecord[] = [
  {
    id: 'curiosity',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['bookmark-designer', 'build-a-scene', 'coloring'],
  },
  {
    id: 'diversity',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['bilingual-flashcards', 'adventure-journal', 'emotion-wheel'],
  },
  {
    id: 'humility-listening',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['adventure-journal', 'bingo', 'reading-tracker'],
  },
  {
    id: 'wonder',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['coloring', 'rhyme-singalong', 'story-map'],
  },
  {
    id: 'creativity',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['build-a-scene', 'bookmark-designer', 'coloring'],
  },
  {
    id: 'kindness',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['adventure-journal', 'emotion-wheel', 'bilingual-flashcards'],
  },
  {
    id: 'courage',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['character-workshop', 'finish-the-story', 'adventure-journal'],
  },
  {
    id: 'gratitude',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['adventure-journal', 'bingo', 'reading-tracker'],
  },
  {
    id: 'self-worth',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['emotion-wheel', 'adventure-journal', 'bilingual-flashcards'],
  },
  {
    id: 'patience-mastery',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['bookmark-designer', 'craft-corner', 'build-a-scene'],
  },
  {
    id: 'emotions',
    kind: 'theme',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['emotion-wheel', 'character-workshop', 'coloring'],
  },
  {
    id: 'ages-3-5',
    kind: 'age',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['coloring', 'build-a-scene', 'rhyme-singalong'],
  },
  {
    id: 'ages-6-7',
    kind: 'age',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['adventure-journal', 'bilingual-flashcards', 'bingo'],
  },
  {
    id: 'ages-8-9',
    kind: 'age',
    publishState: 'published',
    // Featured activities: referenced by the most member books (validated: each must be
    // related to at least one book in the collection). Editorial choice within that set.
    activityIds: ['adventure-journal', 'bingo', 'bookmark-designer'],
  },

  // ---- Educator collections (S7-007): explicit membership, own copy, classroom framing ----
  // Drafted for three classroom use cases the catalog genuinely supports. Featured
  // activities are validated to relate to a member book; resources are the existing
  // printables and articles teachers already use. Copy flagged for review.
  {
    id: 'classroom-feelings',
    kind: 'educator',
    publishState: 'published',
    themeIds: ['emotions', 'self-worth', 'kindness'],
    ageBandIds: ['ages-3-5', 'ages-6-7'],
    title: {
      en: 'Feelings in the classroom',
      fr: 'Les émotions en classe',
      es: 'Las emociones en el aula',
    },
    description: {
      en: 'Four read-alouds for a social and emotional learning block: naming a big feeling, being brave when everyone is watching, and being seen for who you are. Pair each with the feelings wheel, then let children write or draw in the journal.',
      fr: 'Quatre lectures à voix haute pour une séquence d’apprentissage social et émotionnel : nommer une grande émotion, être courageux sous les regards, être vu pour ce que l’on est. Associez chacune à la roue des émotions, puis laissez les enfants écrire ou dessiner dans le journal.',
      es: 'Cuatro lecturas en voz alta para un bloque de aprendizaje social y emocional: nombrar una emoción grande, ser valiente cuando todos miran y ser visto tal como eres. Combina cada una con la rueda de emociones y deja que escriban o dibujen en el diario.',
    },
    bookIds: ['pawa-rainbow-cloud', 'diegos-brave-leap', 'crooked-little-apple-tree', 'true-beauty-meadowbrook'],
    activityIds: ['emotion-wheel', 'adventure-journal'],
    resourceIds: ['download-parents-guide', 'download-follow-up-activities'],
  },
  {
    id: 'classroom-bilingual',
    kind: 'educator',
    publishState: 'published',
    themeIds: ['diversity', 'heritage'],
    ageBandIds: ['ages-6-7'],
    title: {
      en: 'Bilingual read-alouds',
      fr: 'Lectures bilingues à voix haute',
      es: 'Lecturas bilingües en voz alta',
    },
    description: {
      en: 'Stories about many voices, many colours and where families come from, read in two languages. Use the flashcards for vocabulary before each story and the journal after; every book plays aloud in English, Spanish and French.',
      fr: 'Des histoires de voix multiples, de couleurs multiples et d’origines familiales, lues en deux langues. Utilisez les cartes de vocabulaire avant chaque histoire et le journal après ; chaque livre se lit à voix haute en anglais, en espagnol et en français.',
      es: 'Historias sobre muchas voces, muchos colores y de dónde vienen las familias, leídas en dos idiomas. Usa las tarjetas de vocabulario antes de cada historia y el diario después; cada libro se escucha en inglés, español y francés.',
    },
    bookIds: ['rainbow-symphony', 'crooked-little-apple-tree', 'true-beauty-meadowbrook', 'fig-trees-secret'],
    activityIds: ['bilingual-flashcards', 'adventure-journal'],
    resourceIds: ['download-bilingual-flashcards', 'article-bilingual-reading'],
  },
  {
    id: 'classroom-stem-curiosity',
    kind: 'educator',
    publishState: 'published',
    themeIds: ['curiosity', 'wonder', 'patience-mastery'],
    ageBandIds: ['ages-6-7', 'ages-8-9'],
    title: {
      en: 'STEM stories for curious classrooms',
      fr: 'Histoires STEM pour classes curieuses',
      es: 'Cuentos STEM para aulas curiosas',
    },
    description: {
      en: 'Clouds and weather, colour mixing, maps, and a young inventor who learns by sweeping the workshop first. Read one, then build the scene, explore the story map, or find the places on the globe.',
      fr: 'Nuages et météo, mélange des couleurs, cartes, et une jeune inventrice qui apprend en balayant d’abord l’atelier. Lisez-en une, puis construisez la scène, explorez la carte aux histoires ou retrouvez les lieux sur le globe.',
      es: 'Nubes y clima, mezcla de colores, mapas y una joven inventora que aprende barriendo primero el taller. Lee una, luego construye la escena, explora el mapa de historias o busca los lugares en el globo.',
    },
    bookIds: ['cloud-collector', 'colors-mixed-up', 'little-mapmaker', 'heidis-journey-to-mastery'],
    activityIds: ['story-map', 'world-geography', 'build-a-scene'],
    resourceIds: ['article-follow-up-activities', 'download-follow-up-activities'],
  },

  // ---- Seasonal collections (S7-012): time-bounded, recurring yearly, existing content only ----
  {
    id: 'back-to-school',
    kind: 'seasonal',
    publishState: 'published',
    window: { from: '08-15', to: '09-30' },
    themeIds: ['courage', 'emotions', 'kindness', 'self-worth'],
    ageBandIds: ['ages-3-5', 'ages-6-7'],
    title: { en: 'Back to school', fr: 'La rentrée', es: 'Vuelta al cole' },
    description: {
      en: 'New classroom, new faces, big feelings. Five stories for the first weeks of school: being brave when everyone is watching, naming a worry, making one kind choice, and finding that you fit exactly as you are.',
      fr: 'Nouvelle classe, nouveaux visages, grandes émotions. Cinq histoires pour les premières semaines d’école : être courageux sous les regards, nommer une inquiétude, faire un geste gentil, et découvrir qu’on a sa place tel qu’on est.',
      es: 'Aula nueva, caras nuevas, emociones grandes. Cinco historias para las primeras semanas de clase: ser valiente cuando todos miran, poner nombre a una preocupación, elegir un gesto amable y descubrir que encajas tal como eres.',
    },
    bookIds: ['diegos-brave-leap', 'pawa-rainbow-cloud', 'crooked-little-apple-tree', 'butterfly-effect', 'sparrow-saved-forest'],
    activityIds: ['emotion-wheel', 'adventure-journal'],
    resourceIds: ['download-bedtime-routine', 'download-parents-guide'],
  },
  {
    id: 'season-of-gratitude',
    kind: 'seasonal',
    publishState: 'published',
    window: { from: '11-01', to: '12-31' },
    themeIds: ['gratitude', 'kindness', 'heritage'],
    ageBandIds: ['ages-3-5', 'ages-6-7', 'ages-8-9'],
    title: { en: 'A season of gratitude', fr: 'La saison de la gratitude', es: 'Temporada de gratitud' },
    description: {
      en: 'Stories for the giving months: a treasure that was never gold, a little boat with a big wish, a fig tree that remembers where a family came from, and one small kindness that keeps travelling.',
      fr: 'Des histoires pour les mois du partage : un trésor qui n’a jamais été en or, un petit bateau au grand souhait, un figuier qui se souvient d’où vient une famille, et une petite gentillesse qui continue de voyager.',
      es: 'Historias para los meses de compartir: un tesoro que nunca fue de oro, un barquito con un gran deseo, una higuera que recuerda de dónde viene una familia y una pequeña bondad que sigue viajando.',
    },
    bookIds: ['emperors-true-treasure', 'little-boats-big-wish', 'fig-trees-secret', 'butterfly-effect'],
    activityIds: ['adventure-journal'],
    resourceIds: ['download-parents-guide', 'article-follow-up-activities'],
  },
  {
    id: 'summer-of-wonder',
    kind: 'seasonal',
    publishState: 'published',
    window: { from: '06-15', to: '08-31' },
    themeIds: ['wonder', 'curiosity', 'creativity'],
    ageBandIds: ['ages-6-7', 'ages-8-9'],
    title: { en: 'A summer of wonder', fr: 'Un été d’émerveillement', es: 'Un verano de asombro' },
    description: {
      en: 'Long days, open skies and questions worth chasing. Five stories for summer: collecting clouds, mapping a neighbourhood, mixing every colour, following a shadow, and wishing on a very small boat.',
      fr: 'Longues journées, grand ciel et questions qui valent le détour. Cinq histoires pour l’été : collectionner les nuages, cartographier un quartier, mélanger toutes les couleurs, suivre une ombre et faire un vœu sur un tout petit bateau.',
      es: 'Días largos, cielos abiertos y preguntas que merecen perseguirse. Cinco historias para el verano: coleccionar nubes, dibujar el mapa del barrio, mezclar todos los colores, seguir una sombra y pedir un deseo en un barquito.',
    },
    bookIds: ['cloud-collector', 'little-mapmaker', 'colors-mixed-up', 'mayas-shadow', 'little-boats-big-wish'],
    activityIds: ['story-map', 'build-a-scene'],
    resourceIds: ['article-follow-up-activities', 'download-follow-up-activities'],
  },
];
