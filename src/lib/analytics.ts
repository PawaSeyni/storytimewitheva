// Custom-event tracker (currently DORMANT).
//
// The site uses Cloudflare Web Analytics (index.html), which is pageviews-only
// and does NOT support custom events. So track() has no compatible global to
// send to and is a safe no-op (window.plausible is undefined -> optional-chain
// short-circuits). The call sites are kept intact so custom events can be
// re-enabled instantly by switching index.html back to an events-capable
// provider (Plausible/Umami) — no app changes needed.
//
// Events wired at call sites (would fire again once a provider is present):
//   - "Signup"           props: { language }            newsletter submit
//   - "Amazon Click"     props: { book }                outbound buy click
//   - "Activity Complete" props: { activity }           a demo marked complete
//   - "Book View"        props: { book }                book detail page viewed
//   - "Read Aloud"       props: { language }            read-along narration started
//   - "Language Switch"  props: { language }            switched to a new language

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props; callback?: () => void }) => void;
  }
}

export function track(event: string, props?: Props): void {
  if (typeof window === 'undefined') return;
  // Skip the build-time prerender crawler (headless Chromium sets navigator.webdriver)
  // so mount-fired events like "Book View" don't send phantom hits on every deploy.
  if (typeof navigator !== 'undefined' && navigator.webdriver) return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // never let analytics break the page
  }
}
