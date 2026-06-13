// Age-range helpers shared by the Books and Activities filters.
// Parse "5-9 years" → [5, 9] (or "3-7" → [3, 7]) and check overlap with the
// active filter band. Filter keys: 'All' | '3-5' | '6-8' | '9+'.

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

export function matchesAgeFilter(itemAge: string, filterKey: string): boolean {
  if (filterKey === 'All') return true;
  const [iMin, iMax] = parseAgeRange(itemAge);
  if (filterKey === '9+') return iMax >= 9;
  // For "3-5" and "6-8": overlap between the item range and the filter range.
  const [fMin, fMax] = parseAgeRange(filterKey);
  return iMax >= fMin && iMin <= fMax;
}
