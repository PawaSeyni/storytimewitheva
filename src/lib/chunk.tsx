import { use, type ComponentType } from 'react';
import type { SettledPromise } from './preloadable';

/**
 * A code-split page component, like React.lazy but built on `use()`.
 *
 * React.lazy throws its promise on first render and commits the nearest Suspense fallback
 * even when the chunk is already loaded, so a prerendered page is briefly replaced by the
 * fallback and then re-rendered (PD-04: footer jump, CLS 0.58 on /books). `use()` reads a
 * fulfilled promise synchronously, so when main.tsx has preloaded the current route the
 * first commit is the full page. While the chunk is pending it suspends exactly like lazy.
 */
export function chunk<P extends object>(load: () => SettledPromise<{ default: ComponentType<P> }>): ComponentType<P> {
  function Chunk(props: P) {
    // Typed as a plain Promise: React's Usable type otherwise matches the optional
    // `status` field against its own thenable union.
    const pending: Promise<{ default: ComponentType<P> }> = load();
    const Page = use(pending).default;
    return <Page {...props} />;
  }
  return Chunk;
}
