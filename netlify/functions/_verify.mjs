// Human-verification seam. NO-OP TODAY, ON PURPOSE.
//
// Turnstile is deliberately not implemented yet (it needs Cloudflare keys and a
// client-side widget). This exists so adding it later is a change to THIS file
// plus a hidden field, not a redesign of the endpoint: subscribe.mjs already
// calls verifyHuman() and already handles a `false` result.
//
// The contract a real provider must satisfy:
//   verifyHuman({ token, ip }) -> { ok: boolean, provider: string, reason?: string }
//   - ok:true  => proceed
//   - ok:false => reject as unverified (subscribe.mjs returns 403)
//   - it must NOT throw; a provider outage is the caller's availability problem
//     and should be decided here, not raised into the signup path.
//
// A Turnstile implementation would POST token + secret to
// https://challenges.cloudflare.com/turnstile/v0/siteverify and map `success`.
// Note the CSP in netlify.toml would need the Cloudflare origins added to
// script-src and connect-src before the widget can load.
export async function verifyHuman(_input = {}) {
  return { ok: true, provider: 'none' };
}

/** Whether a real provider is configured — lets callers log meaningfully. */
export function verificationEnabled() {
  return false;
}
