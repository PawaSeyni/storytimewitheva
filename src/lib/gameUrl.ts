import type { Language } from './language';

/**
 * URL for a standalone game (public/games/<slug>.html).
 *
 * Games live outside the SPA and are NOT language-prefixed — one shared file serves all
 * three languages. The language travels in the query string instead, and public/games/i18n.js
 * reads it FIRST, ahead of localStorage.
 *
 * That ordering is the fix for C6-04: the SPA writes 'preferredLanguage' only when someone
 * clicks the language switcher, so a reader who arrived at /fr/books/... from a search result
 * had nothing stored and every game opened in English. Passing it explicitly also works in
 * private mode and wherever storage is blocked.
 */
export function gameUrl(slug: string, language: Language): string {
  return language === 'en' ? `/games/${slug}.html` : `/games/${slug}.html?lang=${language}`;
}
