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
// (contentIndex.collectionProblems). None exist yet; the model is ready for S7-007/S7-012.
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
];
