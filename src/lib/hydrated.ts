import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/**
 * False while React hydrates a prerendered page, true right after (and on every
 * non-hydrating render, including the prerender itself). Pages are HYDRATED from their
 * build-time snapshots (src/main.tsx), so anything that depends on this particular browser
 * (feature detection, storage availability) must render its snapshot-time default until
 * this turns true, or hydration fails and the page is repainted.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
