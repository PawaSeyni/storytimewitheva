// TEMPORARY diagnostic — do not merge.
//
// A/B test for ONE question: does a Netlify function rate limit apply to the
// built-in /.netlify/functions/* endpoint, or only to a declared normal path?
//
// This function is identical in rate-limit shape to subscribe.mjs but sits on a
// NORMAL path (/api/ratelimit-probe) with a tighter limit. Probing it and
// subscribe from the SAME machine on the SAME deploy isolates the path as the
// only variable.
//
//   probe 429s + subscribe does not  -> reserved path bypasses traffic rules
//   neither 429s                     -> rate limiting is not working site-wide
export default async () =>
  new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const config = {
  path: '/api/ratelimit-probe',
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowLimit: 3, windowSize: 60 },
};
