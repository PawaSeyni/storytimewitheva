/**
 * Tailwind config that builds a static stylesheet for the standalone games in
 * public/games (replacing the Tailwind Play CDN, which isn't meant for prod).
 *
 * The content scan picks up every literal utility class in the game HTML +
 * inline JS. The safelist covers the few classes the games build *dynamically*
 * (so a content scan can't see them): data-driven colors (e.g. emotion-wheel's
 * `${em.bg}` / `${em.border}`, status badges) and grid column counts
 * (`grid-cols-${cols}`). Generous on purpose — correctness over a few KB.
 *
 * Build: npm run build:games-css  →  public/games/games.css
 */
const colors =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const shades = '50|100|200|300|400|500|600|700|800|900|950';

module.exports = {
  content: ['./public/games/*.html'],
  safelist: [
    { pattern: new RegExp(`^(bg|text|border|ring|from|to|via)-(${colors})-(${shades})$`) },
    { pattern: /^grid-cols-([1-9]|1[0-2])$/ },
  ],
  theme: { extend: {} },
  plugins: [],
};
