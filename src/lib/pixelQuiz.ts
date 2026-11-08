// Pixel's Story Quiz rounds (activities audit 2026-11, §5c item 4). BROWSER-FREE, so the
// funnel tests can check every book. Used by src/demos/PixelQuizDemo.tsx.
import { books as CATALOG } from '../data/books.data';
import { bookVocab, type VocabWord } from '../data/bookVocab.data';
import type { Language } from './language';

/** Which of the book's eight words are asked: spread across the list. */
const ASKED = [0, 2, 4, 6];
/** Words that may be offered as "not in this story": concrete, distinctive things a child can
 *  picture. Feelings, colours, body parts, times of day, people and everyday nature (sun, rain,
 *  tree...) are left out, because they could easily be in any story even when its catalog text
 *  never names them, and the child would then be told a right answer is wrong. */
const DISTRACTORS = new Set([
  'apple', 'banana', 'basket', 'bed', 'boat', 'bridge', 'broom', 'butterfly', 'car', 'castle', 'crane', 'crown',
  'cube', 'dog', 'dress', 'duckling', 'eagle', 'fish', 'fox', 'gear', 'hammer', 'map', 'mirror', 'net',
  'paint', 'palace', 'pencil', 'recipe', 'robot', 'saw', 'school', 'sheep', 'sparrow', 'toast', 'tower',
  'turtle', 'wolf',
]);

/** A small seeded random generator, so a book always gets the same pictures in the same places
 *  (stable between the server-rendered page and the browser, and between replays). */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export interface QuizRound { answer: VocabWord; choices: VocabWord[] }

/** Four rounds for a book: one of its story words beside two words that are not in it. A
 *  distractor never shares an emoji with the book's words and never appears, in any language,
 *  in the book's own description, so "not in the story" is true by the catalog's own text. */
export function buildRounds(bookId: string): QuizRound[] {
  const own = bookVocab[bookId] ?? [];
  const raw = CATALOG.find((b) => b.id === bookId);
  if (own.length < 8 || !raw) return [];
  // Everything the catalog says about the book: description, subtitle and discussion prompts.
  const desc = (l: Language) => {
    const all = [raw.description?.[l], raw.subtitle?.[l], ...(raw.discussionQuestions ?? []).map((q) => q.prompt[l])].join(' ');
    return ` ${all.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ')} `;
  };
  const texts = { en: desc('en'), es: desc('es'), fr: desc('fr') };
  const emojis = new Set(own.map((w) => w.emoji));
  const seen = new Set<string>();
  const pool: VocabWord[] = [];
  for (const [id, words] of Object.entries(bookVocab)) {
    if (id === bookId) continue;
    for (const w of words) {
      if (!DISTRACTORS.has(w.en) || emojis.has(w.emoji) || seen.has(w.emoji)) continue;
      if ((['en', 'es', 'fr'] as const).some((l) => texts[l].includes(` ${w[l].toLowerCase()} `))) continue;
      seen.add(w.emoji);
      pool.push(w);
    }
  }
  const rnd = seeded(bookId);
  const take = () => pool.splice(Math.floor(rnd() * pool.length), 1)[0];
  // The story picture moves one place each round, so tapping the same spot never wins.
  const start = Math.floor(rnd() * 3);
  return ASKED.map((i, n) => {
    const choices = [take(), take()];
    choices.splice((start + n) % 3, 0, own[i]);
    return { answer: own[i], choices };
  });
}
