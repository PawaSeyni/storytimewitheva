// Meta descriptions that fit in a search result (site audit 2026-11-18, finding 3 / SW-026).
// BROWSER-FREE. Google shows roughly 155-160 characters; longer text is cut mid-word.
//
// Most descriptions are built from text the page also shows (an activity's blurb plus
// "for ages ...", a collection or unit's intro), so the visible copy stays whole and only the
// meta tag is fitted: keep as many whole sentences as fit; if even the first sentence is too
// long, cut at the last word that fits and add an ellipsis.

export const META_DESCRIPTION_MAX = 155;

const SENTENCE_END = /(?<=[.!?…])\s+(?=[\p{Lu}¿¡«"“(\d])/u;

export function fitDescription(text: string, max = META_DESCRIPTION_MAX): string {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  let out = '';
  for (const sentence of clean.split(SENTENCE_END)) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > max) break;
    out = next;
  }
  if (out) return out;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—–-]+$/u, '')}…`;
}
