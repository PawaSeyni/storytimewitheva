import { bookVocab } from '../data/bookVocab.data';
import { useLanguage, useTranslation } from '../lib/language';
import { gameUrl } from '../lib/gameUrl';
import { withSourceBook } from '../lib/sourceBook';
import { track } from '../lib/analytics';
import { Link } from './LocalizedLink';

/**
 * "Story words" on a book page (activities audit 2026-11, bookVocab): the book's eight
 * picturable words in the reader's language, and three word games opened in book mode
 * (?book=<id>), so the games play THIS book's words. Renders nothing for a book without words.
 */
const TRANSLATIONS = {
  en: { heading: 'Story words', sub: 'Eight words and three sentences from this book, in English, Spanish and French. Play them:', flashcards: 'Flashcards', matching: 'Memory match', spelling: 'Spelling bee', sentences: 'Sentence builder', worksheet: 'Printable worksheet' },
  es: { heading: 'Palabras del cuento', sub: 'Ocho palabras y tres frases de este libro, en español, inglés y francés. Juega con ellas:', flashcards: 'Tarjetas', matching: 'Memoria', spelling: 'Deletreo', sentences: 'Frases', worksheet: 'Ficha para imprimir' },
  fr: { heading: 'Les mots de l’histoire', sub: 'Huit mots et trois phrases de ce livre, en français, anglais et espagnol. Joue avec eux :', flashcards: 'Cartes', matching: 'Memory', spelling: 'Épellation', sentences: 'Phrases', worksheet: 'Fiche à imprimer' },
};

const WORD_GAMES = [
  { slug: 'bilingual-flashcards', emoji: '🌍', key: 'flashcards' },
  { slug: 'matching', emoji: '🃏', key: 'matching' },
  { slug: 'spelling-bee', emoji: '🐝', key: 'spelling' },
  { slug: 'sentence-builder', emoji: '🧱', key: 'sentences' },
] as const;

export default function StoryWords({ bookId }: { bookId: string }) {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const words = bookVocab[bookId] ?? [];
  if (words.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 pb-14" data-story-words={bookId}>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{t.heading}</h2>
      <p className="text-gray-500 text-sm mb-4">{t.sub}</p>
      <ul className="flex flex-wrap gap-2 mb-5">
        {words.map((w) => (
          <li key={w.emoji} lang={language} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-purple-100 shadow-xs px-3 py-1.5 text-sm font-semibold text-gray-700">
            <span aria-hidden>{w.emoji}</span>{w[language]}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        {WORD_GAMES.map((g) => (
          <a
            key={g.slug}
            href={withSourceBook(gameUrl(g.slug, language), bookId)}
            onClick={() => track('Continue Journey', { placement: 'detail', destination: 'activity', activity: g.slug, reason: 'story-words', book: bookId })}
            className="inline-flex items-center gap-2 rounded-full border-2 border-purple-300 text-purple-700 font-semibold px-4 py-2 hover:bg-purple-50 transition-colors"
          >
            <span aria-hidden>{g.emoji}</span>{t[g.key]}
          </a>
        ))}
        {/* Leo has a hand-written worksheet; every other book uses the generated one. */}
        <Link
          to={bookId === 'leo-and-the-wolf' ? '/activities/leo-and-the-wolf-worksheet' : withSourceBook('/activities/story-worksheet', bookId)}
          onClick={() => track('Continue Journey', { placement: 'detail', destination: 'activity', activity: bookId === 'leo-and-the-wolf' ? 'leo-and-the-wolf-worksheet' : 'story-worksheet', reason: 'story-words', book: bookId })}
          className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 shadow-xs hover:from-purple-600 hover:to-pink-600 transition-colors"
          data-story-worksheet
        >
          <span aria-hidden>📝</span>{t.worksheet}
        </Link>
      </div>
    </section>
  );
}
