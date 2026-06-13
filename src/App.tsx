import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from './lib/language';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Activities from './pages/Activities';
import Resources from './pages/Resources';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import Links from './pages/Links';
import DemoPage from './pages/DemoPage';
import StoryBuilderDemo from './demos/StoryBuilderDemo';
import CharacterWorkshopDemo from './demos/CharacterWorkshopDemo';
import AdventureJournalDemo from './demos/AdventureJournalDemo';
import BingoDemo from './demos/BingoDemo';
import BookmarkCraftsDemo from './demos/BookmarkCraftsDemo';
import CraftCornerDemo from './demos/CraftCornerDemo';
import ColoringDemo from './demos/ColoringDemo';
import PuzzleAdventuresDemo from './demos/PuzzleAdventuresDemo';

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
  { path: '/resources', element: <Resources /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/faq', element: <FAQ /> },
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
      </div>
      <Footer />
    </div>
  );
}
