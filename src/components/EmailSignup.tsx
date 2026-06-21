import { useEffect, useState } from 'react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { track } from '../lib/analytics';

// MailerLite embedded form action — group "storytimewitheva-signups", form
// "Bilingual Starter Kit — site signup". Custom fields `language` and
// `lead_magnet` are pre-registered on the MailerLite account, so they get
// attached to the subscriber on submit. Double opt-in is ON, so MailerLite
// sends the confirmation email; the welcome automation fires once the user
// confirms (subscriber_joins_group trigger).
const MAILERLITE_FORM_ACTION =
  'https://assets.mailerlite.com/jsonp/2363396/forms/187942934227715798/subscribe';

// Lead-magnet registry. Pins/FB posts deep-link to the form with `?lm=<slug>`
// so the right freebie is both tagged on the subscriber AND delivered instantly
// on the success screen — closing the funnel leak where pins used to point
// straight at the ungated PDF and captured no email. Each magnet maps to its
// per-language PDF (single-file trilingual magnets repeat the same path).
type Magnet = { tag: string; pdf: Record<Language, string> };
const LEAD_MAGNETS: Record<string, Magnet> = {
  'bedtime-routine': {
    tag: 'bedtime-routine',
    pdf: { en: '/bedtime-routine.pdf', es: '/bedtime-routine-es.pdf', fr: '/bedtime-routine-fr.pdf' },
  },
  'bilingual-starter-kit': {
    tag: 'bilingual-starter-kit',
    pdf: { en: '/bilingual-starter-kit.pdf', es: '/bilingual-starter-kit.pdf', fr: '/bilingual-starter-kit.pdf' },
  },
  'bilingual-flashcards': {
    tag: 'bilingual-flashcards',
    pdf: { en: '/bilingual-flashcards.pdf', es: '/bilingual-flashcards.pdf', fr: '/bilingual-flashcards.pdf' },
  },
  'parents-guide': {
    tag: 'parents-guide',
    pdf: { en: '/parents-guide.pdf', es: '/parents-guide-es.pdf', fr: '/parents-guide-fr.pdf' },
  },
  'follow-up-activities': {
    tag: 'follow-up-activities',
    pdf: { en: '/follow-up-activities.pdf', es: '/follow-up-activities.pdf', fr: '/follow-up-activities.pdf' },
  },
};
const DEFAULT_MAGNET = 'bilingual-starter-kit';

function readParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(name);
}

function resolveMagnet(): Magnet {
  const slug = (readParam('lm') || '').toLowerCase();
  return LEAD_MAGNETS[slug] ?? LEAD_MAGNETS[DEFAULT_MAGNET];
}

const TRANSLATIONS = {
  en: {
    title: 'Download the FREE 20-Page Bilingual Starter Kit!',
    blurb: 'Join our growing community of parents making reading fun. Get coloring pages, reading guides, and bilingual activities delivered straight to your inbox.',
    bullets: [
      '✓ 20-page activity pack (English, Spanish & French)',
      '✓ Age-appropriate book recommendations',
      '✓ Fun story prompts & creative activities',
      '✓ No spam, unsubscribe anytime',
    ],
    firstNamePlaceholder: 'First name (optional)',
    emailPlaceholder: 'Enter your email address',
    submit: 'Get My Free Kit 🎨',
    submitting: 'Sending…',
    successHeading: 'Success, your download is ready!',
    successDetail: 'Tap below to grab your freebie. We also sent a confirmation email so you don’t miss future printables.',
    download: '📥 Download your free PDF',
    errorMessage: 'Something went wrong. Please try again or email contact@storytimewitheva.com.',
    privacy: '🔒 We respect your privacy. No spam, ever.',
    audienceNote: 'For parents & guardians. Please sign up on your child’s behalf.',
  },
  es: {
    title: '¡Descarga GRATIS el kit bilingüe de 20 páginas!',
    blurb: 'Únete a nuestra comunidad de padres que hacen divertida la lectura. Recibe páginas para colorear, guías de lectura y actividades bilingües directamente en tu correo.',
    bullets: [
      '✓ Pack de 20 páginas de actividades (inglés, español y francés)',
      '✓ Recomendaciones de libros por edad',
      '✓ Divertidas ideas de historias y actividades creativas',
      '✓ Sin spam, cancela cuando quieras',
    ],
    firstNamePlaceholder: 'Nombre (opcional)',
    emailPlaceholder: 'Escribe tu correo electrónico',
    submit: 'Quiero mi kit gratis 🎨',
    submitting: 'Enviando…',
    successHeading: '¡Listo! Tu descarga está disponible.',
    successDetail: 'Toca abajo para obtener tu recurso gratis. También te enviamos un correo de confirmación para que no te pierdas futuros materiales.',
    download: '📥 Descarga tu PDF gratis',
    errorMessage: 'Algo salió mal. Inténtalo de nuevo o escríbenos a contact@storytimewitheva.com.',
    privacy: '🔒 Respetamos tu privacidad. Nunca spam.',
    audienceNote: 'Para padres y tutores. Por favor, regístrate en nombre de tu peque.',
  },
  fr: {
    title: 'Téléchargez gratuitement le kit bilingue de 20 pages !',
    blurb: 'Rejoignez notre communauté de parents qui rendent la lecture amusante. Recevez des pages à colorier, des guides de lecture et des activités bilingues directement dans votre boîte mail.',
    bullets: [
      '✓ Pack d\'activités de 20 pages (anglais, espagnol et français)',
      '✓ Recommandations de livres par tranche d\'âge',
      '✓ Idées d\'histoires et activités créatives',
      '✓ Pas de spam, désinscription à tout moment',
    ],
    firstNamePlaceholder: 'Prénom (facultatif)',
    emailPlaceholder: 'Entrez votre adresse e-mail',
    submit: 'Recevoir mon kit gratuit 🎨',
    submitting: 'Envoi…',
    successHeading: 'C’est fait ! Votre téléchargement est prêt.',
    successDetail: 'Cliquez ci-dessous pour récupérer votre ressource gratuite. Nous avons aussi envoyé un email de confirmation pour ne rien manquer.',
    download: '📥 Téléchargez votre PDF gratuit',
    errorMessage: 'Une erreur est survenue. Réessayez ou écrivez à contact@storytimewitheva.com.',
    privacy: '🔒 Nous respectons votre vie privée. Jamais de spam.',
    audienceNote: 'Pour les parents et tuteurs. Merci de vous inscrire au nom de votre enfant.',
  },
};

export default function EmailSignup() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [magnet] = useState<Magnet>(() => resolveMagnet());

  // Honor `?lang=` from language-targeted pins (e.g. an ES pin links with
  // &lang=es) so the whole page + delivered PDF render in the pin's language,
  // regardless of the visitor's browser locale.
  useEffect(() => {
    const lang = (readParam('lang') || '').toLowerCase();
    if (lang === 'en' || lang === 'es' || lang === 'fr') setLanguage(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'submitting') return;

    setStatus('submitting');

    const trimmedName = firstName.trim();

    const formData = new FormData();
    formData.append('fields[email]', email);
    // MailerLite's default "Name" field has key `name` (id 1). Keep this
    // submission optional — empty names just leave the field blank, which
    // the welcome email handles with a `{$name|default:'…'}` fallback.
    if (trimmedName) formData.append('fields[name]', trimmedName);
    formData.append('fields[language]', language);
    formData.append('fields[lead_magnet]', magnet.tag);
    formData.append('ml-submit', '1');
    formData.append('anticsrf', 'true');

    try {
      // MailerLite's JSONP endpoint doesn't return CORS headers, so we
      // can't read the response. `no-cors` lets the POST go through —
      // double opt-in means MailerLite will email the user the
      // confirmation link regardless of what we surface in the UI.
      await fetch(MAILERLITE_FORM_ACTION, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
      setStatus('submitted');
      track('Signup', { language });
      setEmail('');
      setFirstName('');
    } catch (err) {
      // `no-cors` fetch only throws on hard network failure (offline,
      // DNS, request aborted). Show the inline error so the user can
      // retry or fall back to email.
      console.error('MailerLite signup failed:', err);
      setStatus('error');
    }
  };

  return (
    <section id="email-signup" className="scroll-mt-24 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{t.title}</h2>
        <p className="text-purple-100 text-lg mb-6">{t.blurb}</p>

        <ul className="text-left inline-block text-purple-100 text-sm mb-8 space-y-2">
          {t.bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-2">{item}</li>
          ))}
        </ul>

        {status === 'submitted' ? (
          <div className="bg-white/20 rounded-2xl p-6 text-white">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-bold text-xl">{t.successHeading}</p>
            <p className="text-purple-100 text-sm mt-1 mb-4">{t.successDetail}</p>
            <a
              href={magnet.pdf[language]}
              target="_blank"
              rel="noopener"
              className="inline-block px-6 py-3 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t.download}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder={t.firstNamePlaceholder}
              aria-label={t.firstNamePlaceholder}
              autoComplete="given-name"
              disabled={status === 'submitting'}
              className="w-full px-5 py-3 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-md disabled:opacity-60"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                aria-label={t.emailPlaceholder}
                required
                autoComplete="email"
                disabled={status === 'submitting'}
                className="flex-1 px-5 py-3 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-md disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-6 py-3 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? t.submitting : t.submit}
              </button>
            </div>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-4 text-pink-100 text-sm bg-red-500/30 rounded-full inline-block px-4 py-2">
            {t.errorMessage}
          </p>
        )}

        <p className="text-purple-200 text-xs mt-4">{t.privacy}</p>
        <p className="text-purple-200 text-xs mt-1">{t.audienceNote}</p>
      </div>
    </section>
  );
}
