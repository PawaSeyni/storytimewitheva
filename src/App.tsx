import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from './lib/language';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FeedbackWidget from './components/FeedbackWidget';
import Home from './pages/Home';

// All non-home pages are code-split so the initial bundle only contains what
// the homepage actually needs. The <Suspense> boundary below handles loading.
const Books               = lazy(() => import('./pages/Books'));
const BookDetail          = lazy(() => import('./pages/BookDetail'));
const Activities          = lazy(() => import('./pages/Activities'));
const Resources           = lazy(() => import('./pages/Resources'));
const About               = lazy(() => import('./pages/About'));
const Contact             = lazy(() => import('./pages/Contact'));
const Profile             = lazy(() => import('./pages/Profile'));
const Privacy             = lazy(() => import('./pages/Privacy'));
const Terms               = lazy(() => import('./pages/Terms'));
const FAQ                 = lazy(() => import('./pages/FAQ'));
const Search              = lazy(() => import('./pages/Search'));
const NotFound            = lazy(() => import('./pages/NotFound'));
const Links               = lazy(() => import('./pages/Links'));
const DemoPage            = lazy(() => import('./pages/DemoPage'));

// The 8 interactive demos are also code-split.
// A Suspense boundary (below) renders a fallback while a demo chunk loads; the
// fallback carries data-prerender-loading so the build-time prerender waits for
// the real demo to mount before snapshotting.
const StoryBuilderDemo = lazy(() => import('./demos/StoryBuilderDemo'));
const CharacterWorkshopDemo = lazy(() => import('./demos/CharacterWorkshopDemo'));
const AdventureJournalDemo = lazy(() => import('./demos/AdventureJournalDemo'));
const BingoDemo = lazy(() => import('./demos/BingoDemo'));
const BookmarkCraftsDemo = lazy(() => import('./demos/BookmarkCraftsDemo'));
const CraftCornerDemo = lazy(() => import('./demos/CraftCornerDemo'));
const ColoringDemo = lazy(() => import('./demos/ColoringDemo'));
const PuzzleAdventuresDemo = lazy(() => import('./demos/PuzzleAdventuresDemo'));
const WordExplorerDemo = lazy(() => import('./demos/WordExplorerDemo'));

// Canonical (English) route table. Mounted once per language prefix below so
// every page exists at /path, /es/path, and /fr/path. The active language is
// derived from the URL prefix by LanguageProvider.
const routeDefs = [
  { path: '/', element: <Home /> },
  { path: '/books', element: <Books /> },
  { path: '/books/:slug', element: <BookDetail /> },
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
];

const LANG_PREFIXES = ['', '/es', '/fr'];

const SKIP_LINK = {
  en: { skip: 'Skip to content' },
  es: { skip: 'Saltar al contenido' },
  fr: { skip: 'Aller au contenu' },
};

export default function App() {
  const t = useTranslation(SKIP_LINK);

  // Signal to the build-time prerender crawler that the first render + all
  // child effects (Seo/JsonLd inject the head here) have completed. Child
  // effects flush before this parent effect, so the head is guaranteed present.
  useEffect(() => {
    (window as unknown as { __PRERENDER_READY__?: boolean }).__PRERENDER_READY__ = true;
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-3 focus:left-3 focus:bg-white focus:text-purple-700 focus:font-semibold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        {t.skip}
      </a>
      <Navbar />
      <div className="flex-1 outline-none" id="main-content" tabIndex={-1}>
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
      </div>
      <Footer />
      <FeedbackWidget />
    </div>
  );
}
