// Durable rate limit for the public signup endpoint (audit #1).
//
// Netlify edge rate limiting: when a single IP exceeds windowLimit POSTs in
// windowSize seconds, Netlify returns HTTP 429 BEFORE this edge function or the
// serverless subscribe function runs. Under the limit, we pass the request
// straight through with context.next().
//
// This is the durable, server-side control chosen over Cloudflare Turnstile:
// invisible, no third-party script, no cookie, no user-facing challenge — it
// fits the site's privacy-first posture. It complements (does not replace) the
// honeypot + same-origin checks already in subscribe.mjs.
//
// 10 POSTs / 60s / IP is far above any human signup rate and caps single-source
// floods. Attackers who rotate IPs are bounded per source; the honeypot/origin
// layers catch the rest.
export default async (_request, context) => context.next();

export const config = {
  path: '/.netlify/functions/subscribe',
  method: 'POST',
  rateLimit: {
    windowLimit: 10,
    windowSize: 60,
    aggregateBy: ['ip'],
    // action defaults to 'rate_limit' → 429 when exceeded
  },
};
