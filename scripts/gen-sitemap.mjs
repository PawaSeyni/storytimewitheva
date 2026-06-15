// Generates public/sitemap.xml: every page × {en, es, fr} with reciprocal
// hreflang + x-default. English lives at the root; es/fr use a path prefix.
// Book detail pages are derived from the `id` fields in src/data/books.ts so
// the sitemap can't drift from the catalog. Run: npm run gen:sitemap

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://storytimewitheva.com';
const LANGS = ['en', 'es', 'fr'];

const loc = (p, l) => (l === 'en' ? p : p === '/' ? `/${l}` : `/${l}${p}`);
// Netlify serves prerendered pages at a trailing slash (301s the slashless form
// to it), so the sitemap uses the slashed form to match the canonical exactly.
const slash = (s) => (s.endsWith('/') ? s : `${s}/`);
const url = (p, l) => SITE + slash(loc(p, l));

// Static pages: [path, changefreq, priority]
const staticPages = [
  ['/', 'weekly', '1.0'],
  ['/books', 'weekly', '0.9'],
  ['/activities', 'weekly', '0.8'],
  ['/activities/story-builder', 'monthly', '0.7'],
  ['/activities/character-workshop', 'monthly', '0.7'],
  ['/activities/adventure-journal', 'monthly', '0.7'],
  ['/activities/coloring', 'monthly', '0.7'],
  ['/activities/craft-corner', 'monthly', '0.7'],
  ['/activities/bookmark-designer', 'monthly', '0.7'],
  ['/activities/bingo', 'monthly', '0.7'],
  ['/activities/puzzles', 'monthly', '0.7'],
  ['/activities/word-explorer', 'monthly', '0.7'],
  ['/resources', 'monthly', '0.6'],
  ['/about', 'monthly', '0.6'],
  ['/contact', 'monthly', '0.5'],
  ['/faq', 'monthly', '0.6'],
  ['/privacy', 'yearly', '0.3'],
  ['/terms', 'yearly', '0.3'],
];

// Book detail pages derived from src/data/books.ts `id` fields (top-level,
// quoted — the localize() `id: book.id` has no quotes so it won't match).
const booksSrc = await readFile(path.join(ROOT, 'src/data/books.ts'), 'utf8');
const bookIds = [...booksSrc.matchAll(/^ {4}id: '([^']+)',/gm)].map(m => m[1]);
const bookPages = bookIds.map(id => [`/books/${id}`, 'monthly', '0.8']);

const pages = [...staticPages, ...bookPages];

// Standalone games: single static URL each (self-contained pages with their
// own internal EN/ES/FR toggles), so no per-language hreflang.
const gameFiles = (await readdir(path.join(ROOT, 'public/games'))).filter(f => f.endsWith('.html')).sort();

let out = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
for (const [p, cf, pr] of pages) {
  for (const l of LANGS) {
    out += `  <url>\n    <loc>${url(p, l)}</loc>\n`;
    for (const a of LANGS) out += `    <xhtml:link rel="alternate" hreflang="${a}" href="${url(p, a)}"/>\n`;
    out += `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(p, 'en')}"/>\n`;
    out += `    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>\n`;
  }
}
for (const file of gameFiles) {
  out += `  <url>\n    <loc>${SITE}/games/${file}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
}
out += '</urlset>\n';

await writeFile(path.join(ROOT, 'public/sitemap.xml'), out);
console.log(`sitemap.xml: ${pages.length * LANGS.length} localized URLs + ${gameFiles.length} game URLs (${bookIds.length} book pages)`);
