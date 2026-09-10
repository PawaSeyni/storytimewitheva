// One preloadable loader per code-split page (see lib/preloadable.ts). App.tsx builds its
// lazy() components from these, and main.tsx awaits the current route's loaders before the
// first render so the prerendered HTML is never replaced by the Suspense fallback.
import { matchPath } from 'react-router-dom';
import { preloadable } from './lib/preloadable';
import { splitLangFromPath } from './lib/locales';

export const loadBooks = preloadable(() => import('./pages/Books'));
export const loadBookDetail = preloadable(() => import('./pages/BookDetail'));
export const loadCollection = preloadable(() => import('./pages/Collection'));
export const loadJourneys = preloadable(() => import('./pages/Journeys'));
export const loadJourney = preloadable(() => import('./pages/Journey'));
export const loadActivities = preloadable(() => import('./pages/Activities'));
export const loadResources = preloadable(() => import('./pages/Resources'));
export const loadAbout = preloadable(() => import('./pages/About'));
export const loadContact = preloadable(() => import('./pages/Contact'));
export const loadProfile = preloadable(() => import('./pages/Profile'));
export const loadPrivacy = preloadable(() => import('./pages/Privacy'));
export const loadTerms = preloadable(() => import('./pages/Terms'));
export const loadFAQ = preloadable(() => import('./pages/FAQ'));
export const loadSearch = preloadable(() => import('./pages/Search'));
export const loadNotFound = preloadable(() => import('./pages/NotFound'));
export const loadLinks = preloadable(() => import('./pages/Links'));
export const loadDemoPage = preloadable(() => import('./pages/DemoPage'));
export const loadLandingPage = preloadable(() => import('./pages/LandingPage'));

export const loadStoryBuilderDemo = preloadable(() => import('./demos/StoryBuilderDemo'));
export const loadCharacterWorkshopDemo = preloadable(() => import('./demos/CharacterWorkshopDemo'));
export const loadAdventureJournalDemo = preloadable(() => import('./demos/AdventureJournalDemo'));
export const loadBingoDemo = preloadable(() => import('./demos/BingoDemo'));
export const loadBookmarkCraftsDemo = preloadable(() => import('./demos/BookmarkCraftsDemo'));
export const loadCraftCornerDemo = preloadable(() => import('./demos/CraftCornerDemo'));
export const loadColoringDemo = preloadable(() => import('./demos/ColoringDemo'));
export const loadPuzzleAdventuresDemo = preloadable(() => import('./demos/PuzzleAdventuresDemo'));
export const loadWordExplorerDemo = preloadable(() => import('./demos/WordExplorerDemo'));

type Loader = () => Promise<unknown>;

/** Canonical (unprefixed) route patterns and the chunks each one renders. Must list every
 *  code-split route in App.tsx's routeDefs; tests/e2e/no-fallback-flash.spec.ts checks the
 *  behaviour on the heaviest pages. */
export const ROUTE_CHUNKS: ReadonlyArray<{ path: string; loaders: readonly Loader[] }> = [
  { path: '/books', loaders: [loadBooks] },
  { path: '/books/:slug', loaders: [loadBookDetail] },
  { path: '/collections/:collectionId', loaders: [loadCollection] },
  { path: '/journeys', loaders: [loadJourneys] },
  { path: '/journeys/:journeyId', loaders: [loadJourney] },
  { path: '/activities', loaders: [loadActivities] },
  { path: '/activities/story-builder', loaders: [loadDemoPage, loadStoryBuilderDemo] },
  { path: '/activities/character-workshop', loaders: [loadDemoPage, loadCharacterWorkshopDemo] },
  { path: '/activities/adventure-journal', loaders: [loadDemoPage, loadAdventureJournalDemo] },
  { path: '/activities/bingo', loaders: [loadDemoPage, loadBingoDemo] },
  { path: '/activities/bookmark-designer', loaders: [loadDemoPage, loadBookmarkCraftsDemo] },
  { path: '/activities/craft-corner', loaders: [loadDemoPage, loadCraftCornerDemo] },
  { path: '/activities/coloring', loaders: [loadDemoPage, loadColoringDemo] },
  { path: '/activities/puzzles', loaders: [loadDemoPage, loadPuzzleAdventuresDemo] },
  { path: '/activities/word-explorer', loaders: [loadDemoPage, loadWordExplorerDemo] },
  { path: '/resources', loaders: [loadResources] },
  { path: '/about', loaders: [loadAbout] },
  { path: '/contact', loaders: [loadContact] },
  { path: '/faq', loaders: [loadFAQ] },
  { path: '/search', loaders: [loadSearch] },
  { path: '/profile', loaders: [loadProfile] },
  { path: '/privacy', loaders: [loadPrivacy] },
  { path: '/terms', loaders: [loadTerms] },
  { path: '/links', loaders: [loadLinks] },
  { path: '/free/:magnet', loaders: [loadLandingPage] },
];

/** Starts loading the chunks the given pathname renders (any locale prefix) and resolves
 *  when they are in. The home page has no chunk; unknown paths preload the 404 page. */
export function preloadRoute(pathname: string): Promise<unknown> {
  // Prerendered URLs carry a trailing slash (/books/); the patterns do not.
  const rest = (splitLangFromPath(pathname).rest || '/').replace(/\/+$/, '') || '/';
  if (rest === '/' || rest === '/home') return Promise.resolve();
  const hit = ROUTE_CHUNKS.find((r) => matchPath({ path: r.path, end: true }, rest));
  const loaders = hit ? hit.loaders : [loadNotFound];
  return Promise.all(loaders.map((l) => l()));
}
