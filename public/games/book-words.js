/*
 * Book mode for the word games (activities audit 2026-11, "bookVocab").
 *
 * A book page opens a word game with ?book=<id>. scripts/patch-games.mjs bakes every
 * book's story words into the game as window.STE_BOOK_VOCAB (from src/data/bookVocab.data.ts),
 * so this needs no network. If the id is unknown, window.STE_BOOK stays null and the game
 * behaves exactly as before.
 *
 * Load AFTER i18n.js and the STE_BOOK_VOCAB block, BEFORE the game's own script.
 */
(function () {
  var data = window.STE_BOOK_VOCAB || {};
  var src = null;
  try { src = new URLSearchParams(window.location.search).get('book'); } catch (e) { /* ignore */ }
  var entry = src && Object.prototype.hasOwnProperty.call(data, src) ? data[src] : null;
  var L = window.GAME_LANG || 'en';

  /** { id, title, words: [{ emoji, en, es, fr }] } for the requested book, or null. */
  window.STE_BOOK = entry ? { id: src, title: entry.title[L] || entry.title.en, words: entry.words } : null;

  /**
   * Add a "📖 <book title>" choice in front of a game's existing button group and make it the
   * active one. The clone keeps the group's class, so the game's own click wiring (attached
   * after this runs) picks it up. Returns the new button, or null when not in book mode.
   */
  window.steAddBookButton = function (selector, dataKey) {
    if (!window.STE_BOOK) return null;
    var first = document.querySelector(selector);
    if (!first) return null;
    var all = document.querySelectorAll(selector);
    for (var i = 0; i < all.length; i++) { all[i].classList.remove('active'); all[i].classList.add('text-gray-600'); }
    var btn = first.cloneNode(false);
    btn.removeAttribute('data-i18n'); // i18n.js would overwrite the label
    btn.setAttribute('data-' + dataKey, 'book');
    btn.classList.add('active');
    btn.classList.remove('text-gray-600');
    btn.textContent = '📖 ' + window.STE_BOOK.title;
    first.parentNode.insertBefore(btn, first);

    var banner = document.createElement('p');
    banner.className = 'text-center text-sm font-bold text-purple-700 mb-3';
    banner.textContent = (typeof window.t === 'function' ? window.t('storyWordsFrom') : 'Story words from') + ' ' + window.STE_BOOK.title;
    first.parentNode.parentNode.insertBefore(banner, first.parentNode);
    return btn;
  };

  /** "fox" -> "Fox" (display only). */
  window.steCap = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; };
})();
