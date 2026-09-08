// Age-range parsing, shared by the taxonomy's age model.
//
// `matchesAgeFilter` used to live here and matched a band by OVERLAP ('3-5' surfaced a
// 5-9 item). Taxonomy v1 replaced that everywhere with exact-age containment
// (`supportsAge` in src/data/taxonomy.ts), so it was deleted rather than left as a
// second, contradictory answer to "does this item suit this age?".

export function parseAgeRange(s: string): [number, number] {
  const m = s.match(/(\d+)\s*-\s*(\d+)/);
  if (m) return [parseInt(m[1], 10), parseInt(m[2], 10)];
  const single = s.match(/(\d+)/);
  if (single) {
    const n = parseInt(single[1], 10);
    return [n, n];
  }
  return [0, 99];
}
