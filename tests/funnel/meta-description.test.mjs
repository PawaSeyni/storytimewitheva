// Meta descriptions fit a search result (site audit 2026-11-18, finding 3 / SW-026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadMetaDescription } from '../../scripts/lib/catalog.mjs';

const { fitDescription, META_DESCRIPTION_MAX } = await loadMetaDescription();

test('short text passes through, whitespace tidied', () => {
  assert.equal(fitDescription('  A short   line. '), 'A short line.');
});

test('keeps whole sentences that fit, drops the rest', () => {
  const s = 'Eva Gallo writes multicultural picture books for children ages 3–9. Before she was an author, she spent thirty years in public health. Her stories begin in night and end in morning.';
  assert.equal(fitDescription(s), 'Eva Gallo writes multicultural picture books for children ages 3–9. Before she was an author, she spent thirty years in public health.');
});

test('Spanish and French sentence starts (¿, «, accented capitals) are recognised', () => {
  const es = `${'Una frase bastante larga que ocupa espacio en el resultado de búsqueda '.repeat(1)}y sigue. ¿Quieres más? Él dice que sí, y la frase continúa hasta pasar el límite de caracteres permitido.`;
  assert.equal(fitDescription(es), 'Una frase bastante larga que ocupa espacio en el resultado de búsqueda y sigue. ¿Quieres más?');
  const fr = 'Une phrase assez longue pour remplir une bonne partie du résultat de recherche affiché. « Une citation » suit, puis une autre phrase qui dépasse nettement la limite fixée.';
  assert.ok(fitDescription(fr).endsWith('affiché.'));
});

test('one over-long sentence is cut at a word boundary with an ellipsis', () => {
  const long = 'An activity description that keeps going with many clauses, examples, details and asides, far beyond what a search result can show, without ever reaching a full stop until the very end of it all.';
  const out = fitDescription(long);
  assert.ok(out.length <= META_DESCRIPTION_MAX, String(out.length));
  assert.ok(out.endsWith('…'));
  assert.ok(long.startsWith(out.slice(0, -1)), 'cut text is a prefix of the original');
  assert.doesNotMatch(out, /[ ,;]…$/);
});

test('Seo applies it to every page', () => {
  const seo = readFileSync(new URL('../../src/components/Seo.tsx', import.meta.url), 'utf8');
  assert.match(seo, /description: fitDescription\(description\)/);
});
