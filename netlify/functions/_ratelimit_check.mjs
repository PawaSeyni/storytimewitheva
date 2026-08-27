// TEMPORARY diagnostic — removed before merge.
// Calls the real limiter with a caller-supplied subject, so the limiter can be
// tested without depending on the caller's IP. Rotating-proxy egress makes
// IP-keyed limiting untestable from this environment; this isolates the logic.
import { checkRate } from './_ratelimit.mjs';

export default async req => {
  const subject = new URL(req.url).searchParams.get('subject') || 'default';
  const r = await checkRate({ ip: `synthetic-${subject}` });
  return new Response(JSON.stringify(r), {
    status: r.allowed ? 200 : 429,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};

export const config = { path: '/api/ratelimit-check' };
