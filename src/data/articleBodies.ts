// Parent-guide bodies (EN/ES/FR), one record per guide, keyed by the registry slug in
// src/data/resources.ts.
//
// The text lives in src/data/guides/<lang>.json and ships as hashed JSON ASSETS, not as
// JavaScript (DA-03, 2026-09-18): eight guides in three languages are ~140 KB of prose,
// and bundling them pushed the total-JavaScript budget past its fail line. The page
// fetches the active language's file once (cached, immutable) and reads it with use();
// routeLoaders.ts preloads it with the route chunk so the prerendered page is never
// swapped for the Suspense fallback. Affiliate links are stored as keys and resolved
// here, so the Associates tag stays centralised in lib/amazon.
//
// Brand voice is warm, multilingual, parent-to-parent, lightly poetic. Translations are
// adapted (not literal) so each language reads as if Eva wrote it in that language.
import type { Language } from '../lib/language';
import { preloadable, type SettledPromise } from '../lib/preloadable';
import { amazonDp } from '../lib/amazon';

export type AffiliatePart = { href: string; text: string };
export type BodyPart = string | AffiliatePart;
export type Section = { title: string; body: BodyPart[] };
export type SkipList = { title: string; items: { lead: string; rest: string }[] };

export interface ArticleBody {
  eyebrow: string;
  title: string;
  intro: string;
  /** Ordinary guides: headed sections. */
  sections?: Section[];
  /** Reading-environment guide: the "choose" sections, followed by a skip list. */
  choices?: Section[];
  skip?: SkipList;
}

// Affiliate URLs -- single source of truth. Keep in sync with
// outputs/social_media_infra/trackers/00_master_tracker.xlsx -> Affiliate_Links.
// The Associates tracking ID is centralized in lib/amazon (amazonDp appends it).
export const AFFILIATE = {
  readingLamp: amazonDp('B0FMJRR92L'), // AF-001 -- SMARTERIOR Bedside Table Lamp for Kids
  floorCushion: amazonDp('B0DNZJ2W9C'), // AF-002 -- MAXYOYO 3-in-1 Kids Bean Bag Chair Couch
  bookshelf: amazonDp('B0GJLKWVKJ'), // AF-003 -- Chuiendi 4-Tier Montessori Front-Facing Bookshelf
  storyCubes: amazonDp('B07P3MB9H8'), // AF-004 -- Rory's Story Cubes Classic (Box)
  galaxyProjector: amazonDp('B09Q2WL7C6'), // AF-005 -- SFOUR Astronaut Galaxy Projector
} as const;
export type AffiliateKey = keyof typeof AFFILIATE;

/** The on-disk shape: an affiliate link is stored by key, never by URL. */
type StoredPart = string | { affiliate: AffiliateKey; text: string };
type StoredSection = { title: string; body: StoredPart[] };
export interface StoredArticleBody extends Omit<ArticleBody, 'sections' | 'choices'> {
  sections?: StoredSection[];
  choices?: StoredSection[];
}
export type GuideFile = Record<string, StoredArticleBody>;

/** Registry slugs that have a body. Kept in code so build scripts can check parity without a fetch. */
export const ARTICLE_BODY_SLUGS: readonly string[] = [
  'making-reading-magical',
  'perfect-reading-environment',
  'age-appropriate-reading',
  'follow-up-activities',
  'reluctant-readers',
  'bilingual-reading',
  'bedtime-reading-routine',
  'bilingual-flashcards',
];

// Hashed asset URLs, one per language (Vite emits the JSON as files, not modules).
const GUIDE_URLS = import.meta.glob('./guides/*.json', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const urlFor = (lang: Language): string => GUIDE_URLS[`./guides/${lang}.json`] ?? GUIDE_URLS['./guides/en.json'];

function resolveSection(s: StoredSection): Section {
  return { title: s.title, body: s.body.map((p) => (typeof p === 'string' ? p : { href: AFFILIATE[p.affiliate], text: p.text })) };
}
export function resolveBody(b: StoredArticleBody): ArticleBody {
  return { ...b, sections: b.sections?.map(resolveSection), choices: b.choices?.map(resolveSection) };
}

const loaders = new Map<Language, () => SettledPromise<Record<string, ArticleBody>>>();
/** The active language's guide bodies, fetched once and cached; a settled promise for use(). */
export function guideBodies(lang: Language): SettledPromise<Record<string, ArticleBody>> {
  let load = loaders.get(lang);
  if (!load) {
    load = preloadable(async () => {
      const res = await fetch(urlFor(lang));
      if (!res.ok) throw new Error(`guide bodies ${lang}: HTTP ${res.status}`);
      const file = (await res.json()) as GuideFile;
      return Object.fromEntries(Object.entries(file).map(([slug, b]) => [slug, resolveBody(b)]));
    });
    loaders.set(lang, load);
  }
  return load();
}

/** True when any paragraph of the body carries an affiliate link (drives the FTC disclosure). */
export function hasAffiliateLinks(body: ArticleBody): boolean {
  return [...(body.sections ?? []), ...(body.choices ?? [])].some((s) => s.body.some((p) => typeof p !== 'string'));
}
