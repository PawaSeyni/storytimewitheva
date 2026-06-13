import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Books from './pages/Books';
import Activities from './pages/Activities';
import Resources from './pages/Resources';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
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

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/books" element={<Books />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/story-builder" element={<DemoPage><StoryBuilderDemo /></DemoPage>} />
          <Route path="/activities/character-workshop" element={<DemoPage><CharacterWorkshopDemo /></DemoPage>} />
          <Route path="/activities/adventure-journal" element={<DemoPage><AdventureJournalDemo /></DemoPage>} />
          <Route path="/activities/bingo" element={<DemoPage><BingoDemo /></DemoPage>} />
          <Route path="/activities/bookmark-designer" element={<DemoPage><BookmarkCraftsDemo /></DemoPage>} />
          <Route path="/activities/craft-corner" element={<DemoPage><CraftCornerDemo /></DemoPage>} />
          <Route path="/activities/coloring" element={<DemoPage><ColoringDemo /></DemoPage>} />
          <Route path="/activities/puzzles" element={<DemoPage><PuzzleAdventuresDemo /></DemoPage>} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/links" element={<Links />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
