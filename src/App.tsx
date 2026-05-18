import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Books from './pages/Books';
import Activities from './pages/Activities';
import Resources from './pages/Resources';
import About from './pages/About';
import Contact from './pages/Contact';
import DemoPage from './pages/DemoPage';
import StoryBuilderDemo from './demos/StoryBuilderDemo';
import CharacterWorkshopDemo from './demos/CharacterWorkshopDemo';
import AdventureJournalDemo from './demos/AdventureJournalDemo';

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
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
