import { useEffect } from 'react';

/**
 * Injects a JSON-LD <script> into <head> for structured data (schema.org).
 *
 * This site is client-rendered, but Google executes JS before indexing, so
 * effect-injected JSON-LD is read. Each instance is tagged with a stable
 * `data-jsonld` id and removed on unmount / replaced on change, so navigating
 * between routes never leaves stale schema behind.
 */
interface JsonLdProps {
  id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function JsonLd({ id, data }: JsonLdProps) {
  useEffect(() => {
    const selector = `script[type="application/ld+json"][data-jsonld="${id}"]`;
    let el = document.head.querySelector<HTMLScriptElement>(selector);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-jsonld', id);
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);

    return () => {
      document.head.querySelector(selector)?.remove();
    };
  }, [id, data]);

  return null;
}
