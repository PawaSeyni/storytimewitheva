// Spot illustrations for the Studio printables (docs/content/ARTWORK_AND_SONGS_BRIEF_2026-11.md §4).
// BROWSER-FREE. First pass: square crops of each book's own English cover, 300 px WebP in
// public/spots/<book-id>.webp, approved by the owner as a starting point; replace any file
// with a dedicated illustration and nothing else changes. A Little Boat's Big Wish has no
// local cover yet, so it has no spot (tracked as SW-003).
export const SPOT_BOOK_IDS: readonly string[] = [
  'butterfly-effect', 'cloud-collector', 'colors-mixed-up', 'crooked-little-apple-tree', 'diegos-brave-leap',
  'emperors-true-treasure', 'fig-trees-secret', 'heidis-journey-to-mastery', 'leo-and-the-wolf', 'little-mapmaker',
  'mayas-shadow', 'miras-thousand-cubes', 'pawa-rainbow-cloud', 'rainbow-symphony', 'russet-the-fox',
  'sanding-block', 'sparrow-saved-forest', 'tower-touched-sky', 'true-beauty-meadowbrook',
];

export const spotFor = (bookId: string | undefined): string | null =>
  bookId && SPOT_BOOK_IDS.includes(bookId) ? `/spots/${bookId}.webp` : null;
