// TEMPORARY diagnostic — removed before merge.
// Reports the subject the limiter would derive for THIS caller, and runs the
// real limiter against it. Answers the only open question: is the derived
// subject stable per client? If the hash changes between requests from one
// machine, IP-keyed limiting cannot work and clientIp() must change.
import { checkRate, clientIp, debugState } from './_ratelimit.mjs';
import { createHash } from 'node:crypto';

const mask = ip => {
  const p = String(ip).split('.');
  return p.length === 4 ? `${p[0]}.${p[1]}.x.x` : `${String(ip).slice(0, 6)}…`;
};

export default async req => {
  const headers = Object.fromEntries(req.headers);
  const ip = clientIp(headers);
  const r = await checkRate({ ip });
  return new Response(
    JSON.stringify({
      subject_hash: ip ? createHash('sha256').update(ip).digest('hex').slice(0, 8) : null,
      ip_masked: ip ? mask(ip) : null,
      source: headers['x-nf-client-connection-ip'] ? 'x-nf-client-connection-ip' : (headers['x-forwarded-for'] ? 'x-forwarded-for' : 'none'),
      store: debugState(),
      allowed: r.allowed,
      scope: r.scope,
      degraded: r.degraded,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
  );
};

export const config = { path: '/api/ratelimit-whoami' };
