import { useState } from 'react';
import { useLanguage, useTranslation } from '../lib/language';
import { localizePath } from '../lib/locales';
import { track } from '../lib/analytics';

/**
 * Privacy-conscious sharing (S5-020): the native share sheet where the browser has one,
 * otherwise "copy link". The shared payload is the page title and its URL, nothing about
 * the visitor or a child. One event, `Share`, with the target KIND only.
 */
const TRANSLATIONS = {
  en: { share: 'Share this book', copy: 'Copy link', copied: 'Link copied', failed: 'Could not copy the link' },
  es: { share: 'Compartir este libro', copy: 'Copiar enlace', copied: 'Enlace copiado', failed: 'No se pudo copiar el enlace' },
  fr: { share: 'Partager ce livre', copy: 'Copier le lien', copied: 'Lien copié', failed: 'Impossible de copier le lien' },
};

const SITE_URL = 'https://storytimewitheva.com';

export default function ShareButton({ bookId, title }: { bookId: string; title: string }) {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [note, setNote] = useState('');
  const url = `${SITE_URL}${localizePath(`/books/${bookId}`, language)}/`;
  const canNative = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const onShare = async () => {
    if (canNative) {
      try {
        await navigator.share({ title, url });
        track('Share', { book: bookId, target: 'native', placement: 'detail' });
      } catch {
        /* the visitor dismissed the sheet: no event, no error */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setNote(t.copied);
      track('Share', { book: bookId, target: 'copy', placement: 'detail' });
    } catch {
      setNote(t.failed);
    }
    window.setTimeout(() => setNote(''), 2500);
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-purple-300 hover:text-purple-800 transition-colors"
        data-share-mode={canNative ? 'native' : 'copy'}
      >
        <span aria-hidden>🔗</span> {canNative ? t.share : t.copy}
      </button>
      <span role="status" aria-live="polite" className="text-xs text-gray-600">{note}</span>
    </span>
  );
}
