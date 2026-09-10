import { Suspense, useEffect } from 'react';
import { chunk } from './lib/chunk';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from './lib/language';
import { LANG_PREFIXES, splitLangFromPath } from './lib/locales';
import * as L from './routeLoaders';

/**
 * Scroll to a #hash target after navigation. React Router doesn't do this for
 * client-side navigations, so links like /#email-signup (and the localized
 * /es/#email-signup) wouldn't scroll to the section on their own.
 *
 * Why `behavior: 'instant'` and not 'smooth' (regression fixed 2026-08-10):
 * every paid and organic lead-magnet deep link (`/?lm=...#email-signup`) was
 * landing visitors at the TOP of a ~5,000px homepage instead of on the signup
 * form ~3,900px down. Measured live on storytimewitheva.com: with the previous
 * `behavior: 'smooth'`, window.scrollY stayed at 0 for the full 3s after
 * scrollIntoView() -- the smooth scroll is silently cancelled here (the app
 * also sets `html { scroll-behavior: smooth }` globally, and Chrome drops a
 * programmatic smooth scroll issued during hydration). The identical call with
 * `behavior: 'instant'` lands on 3884px every time.
 *
 * 'instant' is also the right UX for a deep link: someone arriving from a
 * Pinterest pin should see the offer immediately, not watch a multi-second
 * animation scroll past five screens of unrelated content.
 *
 * We also wait for the target offset to STABILISE before stopping. The page
 * prerenders to static HTML then hydrates while below-the-fold images load, so
 * an early scroll can land against a stale layout.
 */
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return;

    // Stop the browser restoring a previous scroll position on top of ours.
    const previousRestoration = history.scrollRestoration;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let lastTop = -1;
    let settled = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tryScroll = () => {
      // The destination may be a lazy-loaded page, so the target element isn't
      // in the DOM yet. Poll briefly until it appears.
      const el = document.getElementById(id);
      if (!el) {
        if (tries++ < 40) timer = setTimeout(tryScroll, 100); // up to ~4s
        return;
      }

      const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
      // Scroll on every pass so the visitor gets there fast, then keep
      // correcting until the offset stops moving (images/fonts settling).
      el.scrollIntoView({ behavior: 'instant', block: 'start' });

      settled = top === lastTop ? settled + 1 : 0;
      lastTop = top;
      // Two identical offsets in a row = layout settled. Give up after ~4s.
      if (settled < 2 && tries++ < 40) timer = setTimeout(tryScroll, 100);
    };

    tryScroll();
    return () => {
      clearTimeout(timer);
      if ('scrollRestoration' in history) history.scrollRestoration = previousRestoration;
    };
  }, [pathname, hash]);
  return null;
}

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FeedbackWidget from './components/FeedbackWidget';
import Home from './pages/Home';

// All non-home pages are code-split so the initial bundle only contains what
// the homepage actually needs. The <Suspense> boundary below handles loading. The
// loaders live in routeLoaders.ts so main.tsx can preload the current route's chunk
// before the first render (PD-04: no fallback flash over the prerendered HTML).
const Books = chunk(L.loadBooks);
const BookDetail = chunk(L.loadBookDetail);
const Collection = chunk(L.loadCollection);
const Journeys = chunk(L.loadJourneys);
const Journey = chunk(L.loadJourney);
const Activities = chunk(L.loadActivities);
const Resources = chunk(L.loadResources);
const About = chunk(L.loadAbout);
const Contact = chunk(L.loadContact);
const Profile = chunk(L.loadProfile);
const Privacy = chunk(L.loadPrivacy);
const Terms = chunk(L.loadTerms);
const FAQ = chunk(L.loadFAQ);
const Search = chunk(L.loadSearch);
const NotFound = chunk(L.loadNotFound);
const Links = chunk(L.loadLinks);
const DemoPage = chunk(L.loadDemoPage);
const LandingPage = chunk(L.loadLandingPage);

// The 8 interactive demos are also code-split.
// A Suspense boundary (below) renders a fallback while a demo chunk loads; the
// fallback carries data-prerender-loading so the build-time prerender waits for
// the real demo to mount before snapshotting.
const StoryBuilderDemo = chunk(L.loadStoryBuilderDemo);
const CharacterWorkshopDemo = chunk(L.loadCharacterWorkshopDemo);
const AdventureJournalDemo = chunk(L.loadAdventureJournalDemo);
const BingoDemo = chunk(L.loadBingoDemo);
const BookmarkCraftsDemo = chunk(L.loadBookmarkCraftsDemo);
const CraftCornerDemo = chunk(L.loadCraftCornerDemo);
const ColoringDemo = chunk(L.loadColoringDemo);
const PuzzleAdventuresDemo = chunk(L.loadPuzzleAdventuresDemo);
const WordExplorerDemo = chunk(L.loadWordExplorerDemo);

// Canonical (English) route table. Mounted once per language prefix below so
// every page exists at /path, /es/path, and /fr/path. The active language is
// derived from the URL prefix by LanguageProvider.
const routeDefs = [
  { path: '/', element: <Home /> },
  { path: '/books', element: <Books /> },
  { path: '/books/:slug', element: <BookDetail /> },
  { path: '/collections/:collectionId', element: <Collection /> },
  { path: '/journeys', element: <Journeys /> },
  { path: '/journeys/:journeyId', element: <Journey /> },
  { path: '/activities', element: <Activities /> },
  { path: '/activities/story-builder', element: <DemoPage><StoryBuilderDemo /></DemoPage> },
  { path: '/activities/character-workshop', element: <DemoPage><CharacterWorkshopDemo /></DemoPage> },
  { path: '/activities/adventure-journal', element: <DemoPage><AdventureJournalDemo /></DemoPage> },
  { path: '/activities/bingo', element: <DemoPage><BingoDemo /></DemoPage> },
  { path: '/activities/bookmark-designer', element: <DemoPage><BookmarkCraftsDemo /></DemoPage> },
  { path: '/activities/craft-corner', element: <DemoPage><CraftCornerDemo /></DemoPage> },
  { path: '/activities/coloring', element: <DemoPage><ColoringDemo /></DemoPage> },
  { path: '/activities/puzzles', element: <DemoPage><PuzzleAdventuresDemo /></DemoPage> },
  { path: '/activities/word-explorer', element: <DemoPage><WordExplorerDemo /></DemoPage> },
  { path: '/resources', element: <Resources /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/faq', element: <FAQ /> },
  { path: '/search', element: <Search /> },
  { path: '/profile', element: <Profile /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
  { path: '/links', element: <Links /> },
  // Dedicated, distraction-free paid-traffic landing pages. Rendered without the
  // site chrome (see isLanding below); noindex + kept out of the sitemap.
  { path: '/free/:magnet', element: <LandingPage /> },
];

// Every locale prefix from the registry (S8-019): one route table, mounted once per prefix.

const SKIP_LINK = {
  en: { skip: 'Skip to content' },
  es: { skip: 'Saltar al contenido' },
  fr: { skip: 'Aller au contenu' },
};

export default function App() {
  const t = useTranslation(SKIP_LINK);
  const { pathname } = useLocation();

  // Dedicated paid-traffic landing pages (/free/…, /es/free/…, /fr/free/…) render
  // WITHOUT the site chrome — no navbar, footer, feedback widget or skip link —
  // so the whole viewport is the offer. Everything else gets the full shell.
  const isLanding = /^\/free\//.test(splitLangFromPath(pathname).rest);

  // Signal to the build-time prerender crawler that the first render + all
  // child effects (Seo/JsonLd inject the head here) have completed. Child
  // effects flush before this parent effect, so the head is guaranteed present.
  useEffect(() => {
    (window as unknown as { __PRERENDER_READY__?: boolean }).__PRERENDER_READY__ = true;
  }, []);

  const routes = (
    <Suspense
      fallback={
        <div data-prerender-loading className="py-24 text-center text-gray-400">
          …
        </div>
      }
    >
      <Routes>
        {LANG_PREFIXES.flatMap(prefix =>
          routeDefs.map(r => {
            const full = r.path === '/' ? prefix || '/' : `${prefix}${r.path}`;
            return <Route key={full} path={full} element={r.element} />;
          }),
        )}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );

  if (isLanding) {
    return (
      <>
        <ScrollToHash />
        {routes}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ScrollToHash />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-100 focus:top-3 focus:left-3 focus:bg-white focus:text-purple-700 focus:font-semibold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        {t.skip}
      </a>
      <Navbar />
      <div className="flex-1 outline-hidden" id="main-content" tabIndex={-1}>
        {routes}
      </div>
      <Footer />
      <FeedbackWidget />
    </div>
  );
}
