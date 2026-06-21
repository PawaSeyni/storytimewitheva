import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLanguage, useTranslation } from '../lib/language';
import { useToast } from '../lib/toast';

// Passive on-site feedback collector. A small floating button opens a compact
// panel asking for a quick rating plus an optional comment. Submissions POST to
// Netlify Forms (form-name "feedback", registered by the static placeholder in
// index.html) so there is no backend and no personal data is collected.

const TRANSLATIONS = {
  en: {
    label: 'Give feedback',
    title: "How's your visit?",
    great: 'Great',
    ok: 'Okay',
    poor: 'Not great',
    commentLabel: 'Anything we could improve? (optional)',
    commentPh: 'Your thoughts…',
    send: 'Send feedback',
    sending: 'Sending…',
    thanks: 'Thank you for the feedback!',
    error: 'Could not send. Please try again.',
    close: 'Close',
    privacy: 'No personal info collected.',
  },
  es: {
    label: 'Enviar comentarios',
    title: '¿Qué tal tu visita?',
    great: 'Genial',
    ok: 'Bien',
    poor: 'Mejorable',
    commentLabel: '¿Algo que podamos mejorar? (opcional)',
    commentPh: 'Tus ideas…',
    send: 'Enviar',
    sending: 'Enviando…',
    thanks: '¡Gracias por tus comentarios!',
    error: 'No se pudo enviar. Inténtalo de nuevo.',
    close: 'Cerrar',
    privacy: 'No recopilamos datos personales.',
  },
  fr: {
    label: 'Donner un avis',
    title: 'Comment se passe ta visite ?',
    great: 'Super',
    ok: 'Bien',
    poor: 'Peu satisfaisant',
    commentLabel: 'Quelque chose à améliorer ? (facultatif)',
    commentPh: 'Tes idées…',
    send: 'Envoyer',
    sending: 'Envoi…',
    thanks: 'Merci pour ton retour !',
    error: "Échec de l'envoi. Réessaie.",
    close: 'Fermer',
    privacy: 'Aucune donnée personnelle collectée.',
  },
};

type Rating = 'great' | 'ok' | 'poor';
type Status = 'idle' | 'submitting' | 'done' | 'error';

const RATINGS: { value: Rating; emoji: string }[] = [
  { value: 'great', emoji: '😊' },
  { value: 'ok', emoji: '🙂' },
  { value: 'poor', emoji: '😞' },
];

function encodeFormData(data: Record<string, string>) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');
}

export default function FeedbackWidget() {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState('');
  const [botField, setBotField] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const panelRef = useRef<HTMLDivElement>(null);
  const firstControlRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstControlRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  async function submit() {
    if (!rating || status === 'submitting') return;
    setStatus('submitting');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData({
          'form-name': 'feedback',
          'bot-field': botField,
          rating,
          comment,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
          language,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('done');
      toast.success(t.thanks);
      setOpen(false);
      setRating(null);
      setComment('');
    } catch {
      setStatus('error');
      toast.error(t.error);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {open && (
        <div
          ref={panelRef}
          id="feedback-panel"
          role="dialog"
          aria-label={t.title}
          className="mb-3 w-72 rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <p className="font-semibold text-gray-800">{t.title}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1 p-1"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex justify-between gap-2 mb-4">
            {RATINGS.map((r, i) => (
              <button
                key={r.value}
                ref={i === 0 ? firstControlRef : undefined}
                type="button"
                onClick={() => setRating(r.value)}
                aria-pressed={rating === r.value}
                aria-label={t[r.value]}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border transition-colors ${
                  rating === r.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {r.emoji}
                </span>
                <span className="text-xs text-gray-600">{t[r.value]}</span>
              </button>
            ))}
          </div>

          <label className="block text-sm text-gray-600 mb-1" htmlFor="feedback-comment">
            {t.commentLabel}
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t.commentPh}
            rows={3}
            className="w-full text-sm rounded-xl border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
          />

          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            className="hidden"
          />

          <button
            type="button"
            onClick={submit}
            disabled={!rating || status === 'submitting'}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-colors"
          >
            <Send size={16} />
            {status === 'submitting' ? t.sending : t.send}
          </button>

          <p className="mt-2 text-center text-[11px] text-gray-400">{t.privacy}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="feedback-panel"
        aria-label={t.label}
        className="ml-auto flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-colors"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
