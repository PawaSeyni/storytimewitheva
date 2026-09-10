// Route-chunk preloading (PD-04).
//
// React's lazy() throws the loader's promise on first render and commits the Suspense
// fallback, even when the chunk is already in cache. On a prerendered page that swaps the
// full server HTML for the fallback, then back: the footer jumps from the viewport to
// 17,000 px down on /books (CLS 0.58, Lighthouse mobile 71).
//
// React 19 replays a suspended render synchronously when the thrown thenable already
// carries `status: 'fulfilled'` and `value`. This wrapper reuses one promise per loader and
// stamps those fields on settlement, so a lazy() whose loader was preloaded before the first
// render resolves in that same render, with no fallback commit.
export type SettledPromise<T> = Promise<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  reason?: unknown;
};

export function preloadable<T>(loader: () => Promise<T>): () => SettledPromise<T> {
  let cached: SettledPromise<T> | undefined;
  return () => {
    if (!cached) {
      const p: SettledPromise<T> = loader();
      p.status = 'pending';
      p.then(
        (value) => {
          p.status = 'fulfilled';
          p.value = value;
        },
        (reason) => {
          p.status = 'rejected';
          p.reason = reason;
          cached = undefined; // a failed chunk load may be retried on the next call
        },
      );
      cached = p;
    }
    return cached;
  };
}
