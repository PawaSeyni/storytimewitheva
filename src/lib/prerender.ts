/**
 * True while the build-time prerender (scripts/prerender.mjs) is snapshotting this page.
 * The prerender sets the flag on every page before navigation. Components whose FIRST
 * render is random (a shuffled bingo card, a random puzzle) use it to render a fixed
 * first state, so the snapshot is byte-identical build to build (S8-006, register BR-02).
 * Visitors never see the flag; the client render after hydration is random as before.
 */
export function isPrerendering(): boolean {
  return typeof window !== 'undefined' && (window as unknown as { __PRERENDERING__?: boolean }).__PRERENDERING__ === true;
}
