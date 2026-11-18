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

//
// `recover` sees a failed load first. When it returns true it has taken over (main.tsx's
// chunk recovery reloads the page once so a stale deploy or a dropped connection fetches
// fresh chunks), and the promise stays pending instead of rejecting into a blank page.
export function preloadable<T>(
  loader: () => Promise<T>,
  recover?: (reason: unknown) => boolean,
): () => SettledPromise<T> {
  let cached: SettledPromise<T> | undefined;
  return () => {
    if (!cached) {
      const p: SettledPromise<T> = recover
        ? loader().catch((reason: unknown) => {
            if (recover(reason)) return new Promise<T>(() => {});
            throw reason;
          })
        : loader();
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
