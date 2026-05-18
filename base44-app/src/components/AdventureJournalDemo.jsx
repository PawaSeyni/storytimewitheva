
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Calendar, Star, Trash2, Download } from "lucide-react";

export default function AdventureJournalDemo({ language }) {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    bookTitle: '',
    date: new Date().toISOString().split('T')[0],
    rating: 0,
    favoriteCharacter: '',
    favoriteScene: '',
    thoughts: '',
    emoji: '📖'
  });
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('adventureJournal');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const text = {
    en: {
      title: "Journaling with Eva",
      subtitle: "Record your reading adventures and favorite book memories!",
      newEntry: "New Entry",
      bookTitle: "Book Title:",
      bookPlaceholder: "What book did you read?",
      date: "Date:",
      rating: "My Rating:",
      favoriteChar: "Favorite Character:",
      charPlaceholder: "Who was your favorite character?",
      favoriteScene: "Favorite Scene:",
      scenePlaceholder: "What was the best part?",
      thoughts: "My Thoughts:",
      thoughtsPlaceholder: "What did you think about the book? What did you learn?",
      chooseEmoji: "Choose a Book Emoji:",
      saveEntry: "Save Entry",
      myEntries: "My Reading Journal",
      noEntries: "No entries yet! Start recording your reading adventures!",
      downloadJournal: "Download Journal",
      deleteEntry: "Delete"
    },
    es: {
      title: "Diario con Eva",
      subtitle: "¡Registra tus aventuras de lectura y recuerdos favoritos de libros!",
      newEntry: "Nueva Entrada",
      bookTitle: "Título del Libro:",
      bookPlaceholder: "¿Qué libro leíste?",
      date: "Fecha:",
      rating: "Mi Calificación:",
      favoriteChar: "Personaje Favorito:",
      charPlaceholder: "¿Quién fue tu personaje favorito?",
      favoriteScene: "Escena Favorita:",
      scenePlaceholder: "¿Cuál fue la mejor parte?",
      thoughts: "Mis Pensamientos:",
      thoughtsPlaceholder: "¿Qué pensaste del libro? ¿Qué aprendiste?",
      chooseEmoji: "Elige un Emoji de Libro:",
      saveEntry: "Guardar Entrada",
      myEntries: "Mi Diario de Lectura",
      noEntries: "¡Aún no hay entradas! ¡Comienza a registrar tus aventuras de lectura!",
      downloadJournal: "Descargar Diario",
      deleteEntry: "Eliminar"
    },
    fr: {
      title: "Journal avec Eva",
      subtitle: "Enregistrez vos aventures de lecture et vos souvenirs de livres préférés!",
      newEntry: "Nouvelle Entrée",
      bookTitle: "Titre du Livre:",
      bookPlaceholder: "Quel livre avez-vous lu?",
      date: "Date:",
      rating: "Ma Note:",
      favoriteChar: "Personnage Préféré:",
      charPlaceholder: "Qui était votre personnage préféré?",
      favoriteScene: "Scène Préférée:",
      scenePlaceholder: "Quelle était la meilleure partie?",
      thoughts: "Mes Pensées:",
      thoughtsPlaceholder: "Qu'avez-vous pensé du livre? Qu'avez-vous appris?",
      chooseEmoji: "Choisissez un Emoji de Livre:",
      saveEntry: "Sauvegarder",
      myEntries: "Mon Journal de Lecture",
      noEntries: "Pas encore d'entrées! Commencez à enregistrer vos aventures de lecture!",
      downloadJournal: "Télécharger le Journal",
      deleteEntry: "Supprimer"
    }
  };

  const t = text[language] || text.en;

  const bookEmojis = ['📖', '📚', '📕', '📗', '📘', '📙', '📔', '📓', '🎭', '🧙', '🐉', '🏰', '🌟', '✨', '🦄', '🧚'];

  const saveEntry = () => {
    if (!currentEntry.bookTitle) return;
    
    const newEntries = [...entries, { ...currentEntry, id: Date.now() }];
    setEntries(newEntries);
    localStorage.setItem('adventureJournal', JSON.stringify(newEntries));
    
    setCurrentEntry({
      bookTitle: '',
      date: new Date().toISOString().split('T')[0],
      rating: 0,
      favoriteCharacter: '',
      favoriteScene: '',
      thoughts: '',
      emoji: '📖'
    });
    
    setShowForm(false);
  };

  const deleteEntry = (id) => {
    const newEntries = entries.filter(e => e.id !== id);
    setEntries(newEntries);
    localStorage.setItem('adventureJournal', JSON.stringify(newEntries));
  };

  const downloadJournal = () => {
    const content = entries.map(entry => `
${entry.emoji} ${entry.bookTitle}
Date: ${entry.date}
Rating: ${'⭐'.repeat(entry.rating)}
Favorite Character: ${entry.favoriteCharacter}
Favorite Scene: ${entry.favoriteScene}
My Thoughts: ${entry.thoughts}
${'='.repeat(50)}
    `).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-reading-journal.txt';
    a.click();
  };

  return (
    <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 rounded-2xl p-6 md:p-8 max-h-[70vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-orange-700">{t.title}</h3>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">📝✨</div>
      </div>

      {/* How to Play */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-2xl p-6 mb-6">
        <h4 className="text-2xl font-bold mb-3 text-center">✨ How to Play ✨</h4>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          <li>After reading a book, click "New Entry" to start recording</li>
          <li>Fill in the book title and your rating (⭐)</li>
          <li>Share your favorite character and scene</li>
          <li>Write what you thought about the book</li>
          <li>Save your entry and watch your reading journal grow!</li>
        </ol>
      </div>

      {/* New Entry Form */}
      {showForm ? (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-4 border-orange-300">
          <h4 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            {t.newEntry}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t.bookTitle}
              </label>
              <Input
                value={currentEntry.bookTitle}
                onChange={(e) => setCurrentEntry({...currentEntry, bookTitle: e.target.value})}
                placeholder={t.bookPlaceholder}
                className="text-lg border-2 border-orange-300"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t.date}
                </label>
                <Input
                  type="date"
                  value={currentEntry.date}
                  onChange={(e) => setCurrentEntry({...currentEntry, date: e.target.value})}
                  className="border-2 border-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t.rating}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setCurrentEntry({...currentEntry, rating: star})}
                      className="text-3xl transition-transform hover:scale-110"
                    >
                      {star <= currentEntry.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t.favoriteChar}
              </label>
              <Input
                value={currentEntry.favoriteCharacter}
                onChange={(e) => setCurrentEntry({...currentEntry, favoriteCharacter: e.target.value})}
                placeholder={t.charPlaceholder}
                className="border-2 border-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t.favoriteScene}
              </label>
              <Input
                value={currentEntry.favoriteScene}
                onChange={(e) => setCurrentEntry({...currentEntry, favoriteScene: e.target.value})}
                placeholder={t.scenePlaceholder}
                className="border-2 border-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t.thoughts}
              </label>
              <Textarea
                value={currentEntry.thoughts}
                onChange={(e) => setCurrentEntry({...currentEntry, thoughts: e.target.value})}
                placeholder={t.thoughtsPlaceholder}
                rows={4}
                className="border-2 border-orange-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t.chooseEmoji}
              </label>
              <div className="flex flex-wrap gap-2">
                {bookEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setCurrentEntry({...currentEntry, emoji})}
                    className={`text-3xl p-2 rounded-lg transition-all hover:scale-110 ${
                      currentEntry.emoji === emoji 
                        ? 'bg-orange-300 ring-4 ring-orange-500' 
                        : 'bg-gray-100'
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

      {/* Journal Entries */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-2xl font-bold text-orange-700">
            📚 {t.myEntries}
          </h4>
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
            <p className="text-lg text-gray-600">{t.noEntries}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {[...entries].reverse().map((entry) => (
              <Card key={entry.id} className="bg-white p-6 shadow-lg border-l-8 border-orange-400 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{entry.emoji}</span>
                    <div>
                      <h5 className="text-2xl font-bold text-orange-700">{entry.bookTitle}</h5>
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
                    <span className="font-bold text-purple-700">Favorite Character:</span>
                    <span className="ml-2 text-gray-700">{entry.favoriteCharacter}</span>
                  </div>
                )}

                {entry.favoriteScene && (
                  <div className="mb-3">
                    <span className="font-bold text-blue-700">Favorite Scene:</span>
                    <span className="ml-2 text-gray-700">{entry.favoriteScene}</span>
                  </div>
                )}

                {entry.thoughts && (
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg">
                    <span className="font-bold text-orange-700 block mb-2">My Thoughts:</span>
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
