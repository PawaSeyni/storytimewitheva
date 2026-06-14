import { Link as RouterLink, useLocation } from 'react-router-dom';
import type { ComponentProps } from 'react';
import { splitLangFromPath, localizePath } from '../lib/language';

/**
 * Drop-in replacement for react-router-dom's <Link> that keeps the user in
 * their current language. Internal string paths ("/books") are automatically
 * rewritten to the active language prefix ("/es/books"). Hash links
 * ("#email-signup"), external URLs, and object `to` values pass through
 * untouched.
 *
 * Usage: import { Link } from '../components/LocalizedLink' — every existing
 * `to="/..."` then localizes itself with no other change.
 */
type LinkProps = ComponentProps<typeof RouterLink>;

export function Link({ to, ...rest }: LinkProps) {
  const { lang } = splitLangFromPath(useLocation().pathname);
  const target = typeof to === 'string' && to.startsWith('/') ? localizePath(to, lang) : to;
  return <RouterLink to={target} {...rest} />;
}
