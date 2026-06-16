// Thin wrapper over Plausible custom events.
//
// Plausible is loaded in index.html with a queue stub, so calling track()
// before the script finishes loading is safe (calls buffer, then flush). If
// Plausible is blocked (ad blocker, no-JS) this is a silent no-op. Analytics
// must never throw into the app.
//
// Events fired (set these up as Goals in the Plausible dashboard to see
// conversion rates / funnels):
//   - "Signup"           props: { language }            newsletter submit
//   - "Amazon Click"     props: { book }                outbound buy click
//   - "Activity Complete" props: { activity }           a demo marked complete

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props; callback?: () => void }) => void;
  }
}

export function track(event: string, props?: Props): void {
  if (typeof window === 'undefined') return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // never let analytics break the page
  }
}
