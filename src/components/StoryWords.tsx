import { bookVocab } from '../data/bookVocab.data';
import { useLanguage, useTranslation } from '../lib/language';
import { gameUrl } from '../lib/gameUrl';
import { withSourceBook } from '../lib/sourceBook';
import { track } from '../lib/analytics';

/**
 * "Story words" on a book page (activities audit 2026-11, bookVocab): the book's eight
 * picturable words in the reader's language, and three word games opened in book mode
 * (?book=<id>), so the games play THIS book's words. Renders nothing for a book without words.
 */
const TRANSLATIONS = {
  en: { heading: 'Story words', sub: 'Eight words from this book, in English, Spanish and French. Play them:', flashcards: 'Flashcards', matching: 'Memory match', spelling: 'Spelling bee' },
  es: { heading: 'Palabras del cuento', sub: 'Ocho palabras de este libro, en español, inglés y francés. Juega con ellas:', flashcards: 'Tarjetas', matching: 'Memoria', spelling: 'Deletreo' },
  fr: { heading: 'Les mots de l’histoire', sub: 'Huit mots de ce livre, en français, anglais et espagnol. Joue avec eux :', flashcards: 'Cartes', matching: 'Memory', spelling: 'Épellation' },
};

export const WORD_GAMES = [
  { slug: 'bilingual-flashcards', emoji: '🌍', key: 'flashcards' },
  { slug: 'matching', emoji: '🃏', key: 'matching' },
  { slug: 'spelling-bee', emoji: '🐝', key: 'spelling' },
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
      </div>
    </section>
  );
}
