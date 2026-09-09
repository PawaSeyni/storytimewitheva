// Site search index (Sprint 7 S7-015) — BROWSER-FREE.
//
// One record per searchable thing: books, activities, public collections, published
// journeys and resources. Records carry stable id, content type, localized title and
// summary, theme and age ids, the English canonical route (or the game URL), and the
// localized editorial terms (theme and age labels, type label) a parent actually types.
// Search runs within the ACTIVE locale: a French visitor searching "gentillesse" gets the
// kindness collection; the English index is never consulted for a French query.
//
// Seasonal collections are searchable only while their window is open at query time; the
// caller passes the date so this stays pure and testable.

import type { Language } from './language';
import { books } from '../data/books.data';
import { activities } from '../data/activities.data';
import { resources } from '../data/resources';
import { THEMES, AGE_BANDS, type ThemeId, type AgeBandId } from '../data/taxonomy';
import {
  collectionRouteIds, collectionRecordById, collectionEligibleThemeIds, ageCollectionEligibleBandIds, publishedJourneys, seasonalState,
} from '../data/contentIndex';

export type SearchType = 'book' | 'activity' | 'collection' | 'journey' | 'resource';
export const SEARCH_TYPES: SearchType[] = ['book', 'activity', 'collection', 'journey', 'resource'];

type LocalizedText = Record<Language, string>;

export interface SearchRecord {
  id: string;
  type: SearchType;
  title: LocalizedText;
  summary: LocalizedText;
  themeIds: ThemeId[];
  ageBandIds: AgeBandId[];
  /** English canonical app path (LocalizedLink adds the prefix) or a /games/ URL. */
  route: string;
  /** Extra localized terms: theme and age labels, kind labels. */
  terms: LocalizedText;
  /** Only for seasonal collections: searchable while the window is open. */
  seasonalId?: string;
  /** Activities that are standalone games link outside the SPA. */
  game?: boolean;
  emoji?: string;
}

const LANGS: Language[] = ['en', 'fr', 'es'];
const join = (parts: (string | undefined)[]) => parts.filter(Boolean).join(' ');
const themeTerms = (ids: ThemeId[], lang: Language) => ids.map((t) => THEMES[t]?.labels[lang]).filter(Boolean).join(' ');
const ageTerms = (ids: AgeBandId[], lang: Language) => ids.map((b) => AGE_BANDS[b]?.labels[lang]).filter(Boolean).join(' ');
const loc = (f: (lang: Language) => string): LocalizedText => Object.fromEntries(LANGS.map((l) => [l, f(l)])) as LocalizedText;

const TYPE_LABELS: Record<SearchType, LocalizedText> = {
  book: { en: 'Book', fr: 'Livre', es: 'Libro' },
  activity: { en: 'Activity', fr: 'Activité', es: 'Actividad' },
  collection: { en: 'Collection', fr: 'Collection', es: 'Colección' },
  journey: { en: 'Reading journey', fr: 'Parcours de lecture', es: 'Recorrido de lectura' },
  resource: { en: 'Resource', fr: 'Ressource', es: 'Recurso' },
};
export const typeLabel = (type: SearchType, lang: Language) => TYPE_LABELS[type][lang];

/** Age bands a book belongs to, from its range string (e.g. "3-7") against the band bounds. */
function bandsForRange(range: string): AgeBandId[] {
  const m = /(\d+)\D+(\d+)/.exec(range);
  if (!m) return [];
  const lo = Number(m[1]);
  const hi = Number(m[2]);
  return (Object.keys(AGE_BANDS) as AgeBandId[]).filter((b) => {
    const mm = /(\d+)-(\d+)/.exec(b);
    return mm ? Number(mm[1]) <= hi && Number(mm[2]) >= lo : false;
  });
}

export function buildSearchIndex(): SearchRecord[] {
  const out: SearchRecord[] = [];
  for (const b of books) {
    out.push({
      id: b.id, type: 'book', title: b.title, summary: loc((l) => join([b.subtitle?.[l], b.description[l]])),
      themeIds: b.themeIds, ageBandIds: bandsForRange(b.ageRange), route: `/books/${b.id}`,
      terms: loc((l) => join([b.theme?.[l], themeTerms(b.themeIds, l), TYPE_LABELS.book[l]])),
    });
  }
  for (const a of activities) {
    out.push({
      id: a.slug, type: 'activity', title: a.title, summary: a.desc, themeIds: [], ageBandIds: [],
      route: `/activities/${a.slug}`, game: Boolean(a.game), emoji: a.emoji,
      terms: loc((l) => join([a.category[l], a.ages, TYPE_LABELS.activity[l]])),
    });
  }
  for (const id of collectionRouteIds) {
    const rec = collectionRecordById[id];
    const isTheme = (collectionEligibleThemeIds as string[]).includes(id);
    const isBand = (ageCollectionEligibleBandIds as string[]).includes(id);
    const title = rec?.title ?? (isTheme ? THEMES[id as ThemeId].labels : isBand ? AGE_BANDS[id as AgeBandId].labels : null);
    const summary = rec?.description ?? (isTheme ? THEMES[id as ThemeId].descriptions : isBand ? AGE_BANDS[id as AgeBandId].descriptions : null);
    if (!title || !summary) continue;
    const themeIds = rec?.themeIds ?? (isTheme ? [id as ThemeId] : []);
    const ageBandIds = rec?.ageBandIds ?? (isBand ? [id as AgeBandId] : []);
    out.push({
      id, type: 'collection', title, summary, themeIds, ageBandIds, route: `/collections/${id}`,
      terms: loc((l) => join([themeTerms(themeIds, l), ageTerms(ageBandIds, l), TYPE_LABELS.collection[l]])),
      seasonalId: rec?.kind === 'seasonal' ? id : undefined,
    });
  }
  for (const j of publishedJourneys) {
    out.push({
      id: j.id, type: 'journey', title: j.title, summary: j.description, themeIds: j.themeIds, ageBandIds: j.ageBandIds,
      route: `/journeys/${j.id}`, terms: loc((l) => join([themeTerms(j.themeIds, l), ageTerms(j.ageBandIds, l), TYPE_LABELS.journey[l]])),
    });
  }
  for (const r of resources) {
    out.push({
      id: r.id, type: 'resource', title: r.title, summary: r.description, themeIds: r.relatedThemeIds ?? [], ageBandIds: [],
      route: r.kind === 'article' ? `/resources#${r.slug}` : `/free/${r.slug}`, emoji: r.emoji,
      terms: loc((l) => join([themeTerms(r.relatedThemeIds ?? [], l), TYPE_LABELS.resource[l], r.kind === 'download' ? { en: 'printable download PDF', fr: 'imprimable téléchargement PDF', es: 'imprimible descarga PDF' }[l] : ''])),
    });
  }
  return out;
}

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export interface SearchOptions {
  language: Language;
  types?: SearchType[];
  date?: Date;
}

/** Ranked hits within the active locale. Empty or whitespace query returns nothing. */
export function searchRecords(index: SearchRecord[], query: string, opts: SearchOptions): SearchRecord[] {
  const q = fold(query.trim());
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);
  const date = opts.date ?? new Date();
  const types = opts.types && opts.types.length ? opts.types : SEARCH_TYPES;
  const scored: { r: SearchRecord; score: number }[] = [];
  for (const r of index) {
    if (!types.includes(r.type)) continue;
    if (r.seasonalId && seasonalState(r.seasonalId, date)?.open === false) continue;
    const title = fold(r.title[opts.language] ?? '');
    const terms = fold(r.terms[opts.language] ?? '');
    const summary = fold(r.summary[opts.language] ?? '');
    let score = 0;
    for (const w of words) {
      if (title.includes(w)) score += title.startsWith(w) ? 6 : 4;
      else if (terms.includes(w)) score += 2;
      else if (summary.includes(w)) score += 1;
      else { score = 0; break; } // every word must match somewhere
    }
    if (score > 0) scored.push({ r, score });
  }
  const order = (t: SearchType) => SEARCH_TYPES.indexOf(t);
  return scored.sort((a, b) => b.score - a.score || order(a.r.type) - order(b.r.type)).map((x) => x.r);
}
