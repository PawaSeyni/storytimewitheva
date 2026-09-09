/* Shared game-chrome localization.
 *
 * The standalone games are English-content activities, but their UI chrome
 * (headings, instructions, buttons, celebration text) should follow the site's
 * selected language. The SPA stores that in localStorage 'preferredLanguage'.
 *
 * Usage in a game page:
 *   1. Add data-i18n="key" to any element whose text should localize.
 *   2. (Optional) define window.GAME_I18N = { en:{...}, es:{...}, fr:{...} }
 *      BEFORE this script for game-specific strings.
 *   3. Include <script src="/games/i18n.js"></script> at the end of <head> or body.
 *   4. For JS-generated strings, call window.t('key').
 *
 * Resolution order: per-game[lang] -> COMMON[lang] -> per-game.en -> COMMON.en -> key.
 * Game CONTENT (spelled words, story text) and its TTS stay as-is; only chrome localizes.
 *
 * LANGUAGE SOURCE (C6-04, fixed 2026-09-09): the ?lang= query parameter comes FIRST,
 * localStorage second. localStorage alone was not enough: the SPA writes
 * 'preferredLanguage' only when someone clicks the language switcher, so a visitor who
 * arrived at /fr/books/... from a search result or a shared link had nothing stored and
 * every game rendered in English. Site links now carry ?lang=, which also survives
 * private mode and blocked storage.
 *
 * LINKS BACK TO THE SITE are rewritten to the active language prefix here rather than in
 * twelve HTML files. Without it a French reader who opened a game was returned to the
 * ENGLISH site by every nav link. /games/* links are left alone: games are shared, and
 * carry their language in the query string instead.
 */
(function () {
  var COMMON = {
    en: {
      continueEyebrow: 'Continue the journey',
      readNext: 'Read next',
      browseBooks: 'Browse all books',
      backToActivities: '← Back to Activities',
      markCompleted: '✓ Mark Completed',
      completed: '✅ Completed!',
      howToPlay: '✨ How to Play ✨',
      playAgain: '🔄 Play Again!',
      newGame: '🔄 New Game',
      print: '🖨️ Print',
      footerTagline: 'Where stories come to life! Magical books and activities for curious minds, ages 3–9.',
      rights: 'All rights reserved.',
    },
    es: {
      continueEyebrow: 'Continúa la aventura',
      readNext: 'Sigue leyendo',
      browseBooks: 'Explora todos los libros',
      backToActivities: '← Volver a actividades',
      markCompleted: '✓ Marcar como completado',
      completed: '✅ ¡Completado!',
      howToPlay: '✨ Cómo jugar ✨',
      playAgain: '🔄 ¡Jugar de nuevo!',
      newGame: '🔄 Nuevo juego',
      print: '🖨️ Imprimir',
      footerTagline: '¡Donde las historias cobran vida! Libros y actividades mágicos para mentes curiosas de 3 a 9 años.',
      rights: 'Todos los derechos reservados.',
    },
    fr: {
      continueEyebrow: 'Continuez l’aventure',
      readNext: 'À lire ensuite',
      browseBooks: 'Voir tous les livres',
      backToActivities: '← Retour aux activités',
      markCompleted: '✓ Marquer comme terminé',
      completed: '✅ Terminé !',
      howToPlay: '✨ Comment jouer ✨',
      playAgain: '🔄 Rejouer !',
      newGame: '🔄 Nouvelle partie',
      print: '🖨️ Imprimer',
      footerTagline: 'Où les histoires prennent vie ! Des livres et activités magiques pour les esprits curieux de 3 à 9 ans.',
      rights: 'Tous droits réservés.',
    },
  };

  var NAV = {
    '/': { en: 'Home', es: 'Inicio', fr: 'Accueil' },
    '/books': { en: 'Books', es: 'Libros', fr: 'Livres' },
    '/activities': { en: 'Activities', es: 'Actividades', fr: 'Activités' },
    '/resources': { en: 'Resources', es: 'Recursos', fr: 'Ressources' },
    '/about': { en: 'About', es: 'Sobre Eva', fr: 'À propos' },
  };

  function isLang(v) {
    return v === 'es' || v === 'fr' ? v : null;
  }

  function resolveLang() {
    // 1. explicit ?lang= — set by every in-site link to a game.
    try {
      var m = /[?&]lang=([a-z]{2})/.exec(window.location.search || '');
      if (m && isLang(m[1])) return m[1];
    } catch (e) {
      /* ignore */
    }
    // 2. the switcher's stored preference, when there is one.
    try {
      var p = localStorage.getItem('preferredLanguage');
      if (isLang(p)) return p;
    } catch (e) {
      /* ignore */
    }
    return 'en';
  }

  /** Send site links back to the language the reader came in with. */
  function localizeSiteLinks() {
    var L = window.GAME_LANG;
    if (L === 'en') return;
    var links = document.querySelectorAll('a[href^="/"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href');
      if (!href || href.indexOf('/games/') === 0) continue;      // games are shared
      if (href.indexOf('/es/') === 0 || href.indexOf('/fr/') === 0) continue; // already prefixed
      var label = NAV[href];
      a.setAttribute('href', href === '/' ? '/' + L : '/' + L + href);
      // Nav labels are plain text in the game HTML. Localize them too, unless the element
      // already declares a data-i18n key (which apply() has just set).
      if (label && label[L] && !a.getAttribute('data-i18n')) a.textContent = label[L];
    }
  }

  window.GAME_LANG = resolveLang();

  window.t = function (key) {
    var L = window.GAME_LANG;
    var per = (window.GAME_I18N && window.GAME_I18N[L]) || {};
    var perEn = (window.GAME_I18N && window.GAME_I18N.en) || {};
    if (per[key] != null) return per[key];
    if (COMMON[L] && COMMON[L][key] != null) return COMMON[L][key];
    if (perEn[key] != null) return perEn[key];
    return COMMON.en[key] != null ? COMMON.en[key] : key;
  };

  function apply() {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute('data-i18n');
      var v = window.t(k);
      if (v != null) nodes[i].textContent = v;
    }
    document.documentElement.lang = window.GAME_LANG;
    localizeSiteLinks();
  }
  window.applyGameI18n = apply;

  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);
})();
