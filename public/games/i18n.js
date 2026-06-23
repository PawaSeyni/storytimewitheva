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
 */
(function () {
  var COMMON = {
    en: {
      backToActivities: '← Back to Activities',
      markCompleted: '✓ Mark Completed',
      completed: '✅ Completed!',
      howToPlay: '✨ How to Play ✨',
      playAgain: '🔄 Play Again!',
      newGame: '🔄 New Game',
      print: '🖨️ Print',
    },
    es: {
      backToActivities: '← Volver a actividades',
      markCompleted: '✓ Marcar como completado',
      completed: '✅ ¡Completado!',
      howToPlay: '✨ Cómo jugar ✨',
      playAgain: '🔄 ¡Jugar de nuevo!',
      newGame: '🔄 Nuevo juego',
      print: '🖨️ Imprimir',
    },
    fr: {
      backToActivities: '← Retour aux activités',
      markCompleted: '✓ Marquer comme terminé',
      completed: '✅ Terminé !',
      howToPlay: '✨ Comment jouer ✨',
      playAgain: '🔄 Rejouer !',
      newGame: '🔄 Nouvelle partie',
      print: '🖨️ Imprimer',
    },
  };

  function resolveLang() {
    try {
      var p = localStorage.getItem('preferredLanguage');
      return p === 'es' || p === 'fr' ? p : 'en';
    } catch (e) {
      return 'en';
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
  }
  window.applyGameI18n = apply;

  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);
})();
