// Text helpers for the worksheets (kept out of the component module for fast refresh).

/** Keep French guillemets and ? ! : ; with their words, so a « never ends a line alone. */
export const nb = (text: string) => text.replace(/« /g, '« ').replace(/ ([»?!:;])/g, ' $1');

/** A fixed, deterministic reordering (prerender-safe) so a matching task is never in order. */
export const DERANGE: Record<number, number[]> = { 4: [2, 3, 1, 0], 5: [2, 4, 0, 3, 1], 6: [3, 5, 4, 0, 2, 1] };
