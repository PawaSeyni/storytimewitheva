// Who a book is about, in the words of its own catalog description (activities re-audit
// 2026-11-18, §7c item 2: book mode for the generic activities). BROWSER-FREE data.
//
// Used by the Emotion Wheel in book mode ("How did Diego feel in the story?"). Only books
// whose description names or clearly describes a main character are listed; a book without
// an entry simply gets no "How did … feel?" prompt. Wording follows each language's
// description, so nothing here says more about a book than the catalog does.
import type { Language } from '../lib/language';

export type Hero = Record<Language, string>;

export const bookHeroes: Record<string, Hero> = {
  'diegos-brave-leap': { en: 'Diego', es: 'Diego', fr: 'Diego' },
  'pawa-rainbow-cloud': { en: 'Cirro', es: 'Cirro', fr: 'Cirro' },
  'crooked-little-apple-tree': { en: 'the crooked little apple tree', es: 'el pequeño manzano torcido', fr: 'le petit pommier tordu' },
  'true-beauty-meadowbrook': { en: 'the quiet girl', es: 'la niña tranquila', fr: 'la fille discrète' },
  'butterfly-effect': { en: 'the people in the story', es: 'las personas del cuento', fr: 'les personnages de l’histoire' },
};
