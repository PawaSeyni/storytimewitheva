import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Calendar, Star, Trash2, Download } from 'lucide-react';
import { useTranslation } from '../lib/language';

type Entry = {
  id: number;
  bookTitle: string;
  date: string;
  rating: number;
  favoriteCharacter: string;
  favoriteScene: string;
  thoughts: string;
  emoji: string;
};

const BOOK_EMOJIS = ['📖', '📚', '📕', '📗', '📘', '📙', '📔', '📓', '🎭', '🧙', '🐉', '🏰', '🌟', '✨', '🦄', '🧚'];

const TRANSLATIONS = {
  en: {
    title: 'Journaling with Eva',
    subtitle: 'Record your reading adventures and favorite book memories!',
    howToPlay: '✨ How to Play ✨',
    howToList: [
      'After reading a book, click "New Entry" to start recording',
      'Fill in the book title and your rating (⭐)',
      'Share your favorite character and scene',
      'Write what you thought about the book',
      'Save your entry and watch your reading journal grow!',
    ],
    newEntry: 'New Entry',
    bookTitleLabel: 'Book Title:',
    bookTitlePlaceholder: 'What book did you read?',
    dateLabel: 'Date:',
    ratingLabel: 'My Rating:',
    favCharLabel: 'Favorite Character:',
    favCharPlaceholder: 'Who was your favorite character?',
    favSceneLabel: 'Favorite Scene:',
    favScenePlaceholder: 'What was the best part?',
    thoughtsLabel: 'My Thoughts:',
    thoughtsPlaceholder: 'What did you think about the book? What did you learn?',
    chooseEmoji: 'Choose a Book Emoji:',
    saveEntry: 'Save Entry',
    journalHeading: '📚 My Reading Journal',
    downloadJournal: 'Download Journal',
    emptyJournal: 'No entries yet! Start recording your reading adventures!',
    entryFavChar: 'Favorite Character:',
    entryFavScene: 'Favorite Scene:',
    entryThoughts: 'My Thoughts:',
    downloadFilename: 'my-reading-journal.txt',
    downloadDateLabel: 'Date',
    downloadRatingLabel: 'Rating',
    downloadFavChar: 'Favorite Character',
    downloadFavScene: 'Favorite Scene',
    downloadThoughts: 'My Thoughts',
  },
  es: {
    title: 'Diario con Eva',
    subtitle: '¡Registra tus aventuras lectoras y tus recuerdos favoritos!',
    howToPlay: '✨ Cómo jugar ✨',
    howToList: [
      'Después de leer un libro, pulsa "Nueva entrada" para empezar',
      'Escribe el título del libro y tu valoración (⭐)',
      'Comparte tu personaje y escena favoritos',
      'Escribe qué te pareció el libro',
      '¡Guarda tu entrada y ve crecer tu diario de lectura!',
    ],
    newEntry: 'Nueva entrada',
    bookTitleLabel: 'Título del libro:',
    bookTitlePlaceholder: '¿Qué libro leíste?',
    dateLabel: 'Fecha:',
    ratingLabel: 'Mi valoración:',
    favCharLabel: 'Personaje favorito:',
    favCharPlaceholder: '¿Quién fue tu personaje favorito?',
    favSceneLabel: 'Escena favorita:',
    favScenePlaceholder: '¿Cuál fue la mejor parte?',
    thoughtsLabel: 'Mis pensamientos:',
    thoughtsPlaceholder: '¿Qué te pareció el libro? ¿Qué aprendiste?',
    chooseEmoji: 'Elige un emoji de libro:',
    saveEntry: 'Guardar entrada',
    journalHeading: '📚 Mi diario de lectura',
    downloadJournal: 'Descargar diario',
    emptyJournal: '¡Aún no hay entradas! Empieza a registrar tus aventuras lectoras.',
    entryFavChar: 'Personaje favorito:',
    entryFavScene: 'Escena favorita:',
    entryThoughts: 'Mis pensamientos:',
    downloadFilename: 'mi-diario-de-lectura.txt',
    downloadDateLabel: 'Fecha',
    downloadRatingLabel: 'Valoración',
    downloadFavChar: 'Personaje favorito',
    downloadFavScene: 'Escena favorita',
    downloadThoughts: 'Mis pensamientos',
  },
  fr: {
    title: "Journal avec Eva",
    subtitle: 'Note tes aventures de lecture et tes souvenirs préférés !',
    howToPlay: '✨ Comment jouer ✨',
    howToList: [
      'Après avoir lu un livre, clique sur « Nouvelle entrée » pour commencer',
      'Indique le titre du livre et ta note (⭐)',
      'Partage ton personnage et ta scène préférés',
      "Écris ce que tu as pensé du livre",
      'Sauvegarde ton entrée et regarde ton journal de lecture grandir !',
    ],
    newEntry: 'Nouvelle entrée',
    bookTitleLabel: 'Titre du livre :',
    bookTitlePlaceholder: 'Quel livre as-tu lu ?',
    dateLabel: 'Date :',
    ratingLabel: 'Ma note :',
    favCharLabel: 'Personnage préféré :',
    favCharPlaceholder: 'Quel était ton personnage préféré ?',
    favSceneLabel: 'Scène préférée :',
    favScenePlaceholder: 'Quel était le meilleur moment ?',
    thoughtsLabel: 'Mes pensées :',
    thoughtsPlaceholder: 'Qu\'as-tu pensé du livre ? Qu\'as-tu appris ?',
    chooseEmoji: 'Choisis un emoji de livre :',
    saveEntry: 'Sauvegarder',
    journalHeading: '📚 Mon journal de lecture',
    downloadJournal: 'Télécharger le journal',
    emptyJournal: "Pas encore d'entrées ! Commence à noter tes aventures de lecture.",
    entryFavChar: 'Personnage préféré :',
    entryFavScene: 'Scène préférée :',
    entryThoughts: 'Mes pensées :',
    downloadFilename: 'mon-journal-de-lecture.txt',
    downloadDateLabel: 'Date',
    downloadRatingLabel: 'Note',
    downloadFavChar: 'Personnage préféré',
    downloadFavScene: 'Scène préférée',
    downloadThoughts: 'Mes pensées',
  },
};

const blankEntry = (): Omit<Entry, 'id'> => ({
  bookTitle: '',
  date: new Date().toISOString().split('T')[0],
  rating: 0,
  favoriteCharacter: '',
  favoriteScene: '',
  thoughts: '',
  emoji: '📖',
});

export default function AdventureJournalDemo() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentEntry, setCurrentEntry] = useState(blankEntry());
  const [showForm, setShowForm] = useState(true);
  const t = useTranslation(TRANSLATIONS);

  useEffect(() => {
    const saved = localStorage.getItem('adventureJournal');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const persist = (next: Entry[]) => {
    setEntries(next);
    // Keep the in-memory state authoritative; a storage failure (Safari private
    // mode, quota) shouldn't throw out of the handler.
    try {
      localStorage.setItem('adventureJournal', JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const saveEntry = () => {
    if (!currentEntry.bookTitle) return;
    persist([...entries, { ...currentEntry, id: Date.now() }]);
    setCurrentEntry(blankEntry());
    setShowForm(false);
  };

  const deleteEntry = (id: number) => {
    persist(entries.filter(e => e.id !== id));
  };

  const downloadJournal = () => {
    const content = entries
      .map(entry => `
${entry.emoji} ${entry.bookTitle}
${t.downloadDateLabel}: ${entry.date}
${t.downloadRatingLabel}: ${'⭐'.repeat(entry.rating)}
${t.downloadFavChar}: ${entry.favoriteCharacter}
${t.downloadFavScene}: ${entry.favoriteScene}
${t.downloadThoughts}: ${entry.thoughts}
${'='.repeat(50)}
      `)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = t.downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-orange-700">{t.title}</h2>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">📝✨</div>
      </div>

      <div className="bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-2xl p-6 mb-6">
        <h3 className="text-2xl font-bold mb-3 text-center">{t.howToPlay}</h3>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          {t.howToList.map((line, i) => <li key={i}>{line}</li>)}
        </ol>
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-4 border-orange-300">
          <h3 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            {t.newEntry}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.bookTitleLabel}</label>
              <Input
                value={currentEntry.bookTitle}
                onChange={(e) => setCurrentEntry({ ...currentEntry, bookTitle: e.target.value })}
                placeholder={t.bookTitlePlaceholder}
                className="text-lg border-2 border-orange-300"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.dateLabel}</label>
                <Input
                  type="date"
                  value={currentEntry.date}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
                  className="border-2 border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.ratingLabel}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCurrentEntry({ ...currentEntry, rating: star })}
                      className="text-3xl transition-transform hover:scale-110"
                    >
                      {star <= currentEntry.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.favCharLabel}</label>
              <Input
                value={currentEntry.favoriteCharacter}
                onChange={(e) => setCurrentEntry({ ...currentEntry, favoriteCharacter: e.target.value })}
                placeholder={t.favCharPlaceholder}
                className="border-2 border-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.favSceneLabel}</label>
              <Input
                value={currentEntry.favoriteScene}
                onChange={(e) => setCurrentEntry({ ...currentEntry, favoriteScene: e.target.value })}
                placeholder={t.favScenePlaceholder}
                className="border-2 border-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.thoughtsLabel}</label>
              <Textarea
                value={currentEntry.thoughts}
                onChange={(e) => setCurrentEntry({ ...currentEntry, thoughts: e.target.value })}
                placeholder={t.thoughtsPlaceholder}
                rows={4}
                className="border-2 border-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.chooseEmoji}</label>
              <div className="flex flex-wrap gap-2">
                {BOOK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setCurrentEntry({ ...currentEntry, emoji })}
                    className={`text-3xl p-2 rounded-lg transition-all hover:scale-110 ${
                      currentEntry.emoji === emoji ? 'bg-orange-300 ring-4 ring-orange-500' : 'bg-gray-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={saveEntry}
              disabled={!currentEntry.bookTitle}
              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold py-6 text-lg"
            >
              <Star className="w-5 h-5 mr-2" />
              {t.saveEntry}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center mb-6">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            {t.newEntry}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-orange-700">{t.journalHeading}</h3>
          {entries.length > 0 && (
            <Button
              onClick={downloadJournal}
              variant="outline"
              className="border-2 border-orange-400 text-orange-700 hover:bg-orange-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {t.downloadJournal}
            </Button>
          )}
        </div>

        {entries.length === 0 ? (
          <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 p-12 text-center border-4 border-dashed border-orange-300">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-lg text-gray-600">{t.emptyJournal}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {[...entries].reverse().map((entry) => (
              <Card key={entry.id} className="bg-white p-6 shadow-lg border-l-8 border-orange-400 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{entry.emoji}</span>
                    <div>
                      <h4 className="text-2xl font-bold text-orange-700">{entry.bookTitle}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {entry.date}
                        </span>
                        <span>{'⭐'.repeat(entry.rating)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                {entry.favoriteCharacter && (
                  <div className="mb-3">
                    <span className="font-bold text-purple-700">{t.entryFavChar}</span>
                    <span className="ml-2 text-gray-700">{entry.favoriteCharacter}</span>
                  </div>
                )}

                {entry.favoriteScene && (
                  <div className="mb-3">
                    <span className="font-bold text-blue-700">{t.entryFavScene}</span>
                    <span className="ml-2 text-gray-700">{entry.favoriteScene}</span>
                  </div>
                )}

                {entry.thoughts && (
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg">
                    <span className="font-bold text-orange-700 block mb-2">{t.entryThoughts}</span>
                    <p className="text-gray-700 leading-relaxed">{entry.thoughts}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
