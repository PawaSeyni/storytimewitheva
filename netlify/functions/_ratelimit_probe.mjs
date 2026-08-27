// TEMPORARY diagnostic — deleted before merge.
// Distinguishes two hypotheses for why the subscribe rate limit does not fire:
//   (a) deploy previews do not enforce rate limits at all, or
//   (b) requests to the built-in /.netlify/functions/* path bypass the
//       traffic rules attached to a declared route.
// This function is identical in shape to subscribe's config but sits on a
// NORMAL path. If it 429s on the preview, previews DO enforce and (b) is the
// cause. If it does not, (a) is the cause and only production can settle it.
export default async () =>
  new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const config = {
  path: '/api/ratelimit-probe',
  method: 'POST',
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowLimit: 3, windowSize: 60 },
};
