// Puzzle Paradise helpers (re-audit 2026-11-18). BROWSER-FREE, so tests can check every book.
import { shuffled } from './seeded';

/** Letters typed or shown without accents: "plátano" is accepted as "platano". */
export const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim();

/** The scrambled letters of a word: never the word itself, and accent-free so a child can type it. */
export function scrambleWord(word: string, rnd: () => number): string {
  const letters = plain(word).split('');
  for (let i = 0; i < 8; i++) {
    const s = shuffled(letters, rnd).join('');
    if (s !== letters.join('')) return s;
  }
  return [...letters.slice(1), letters[0]].join('');
}

/** The words of a sentence in a different order (or, for a very short sentence, reversed). */
export function scrambleSentence(words: string[], rnd: () => number): string[] {
  for (let i = 0; i < 8; i++) {
    const s = shuffled(words, rnd);
    if (s.join(' ') !== words.join(' ')) return s;
  }
  return [...words].reverse();
}
