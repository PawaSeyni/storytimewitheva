import { useEffect, useRef, useState } from 'react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { track } from '../lib/analytics';

// MailerLite embedded form action — group "storytimewitheva-signups", form
// "Bilingual Starter Kit — site signup". Custom fields `language` and
// `lead_magnet` are pre-registered on the MailerLite account, so they get
// attached to the subscriber on submit. Single opt-in is ON, so MailerLite
// adds the subscriber directly; the welcome automation fires when the user
// joins (subscriber_joins_group trigger).
// Server-side subscribe endpoint (Netlify Function: netlify/functions/subscribe.mjs).
// Replaces the old browser->MailerLite JSONP POST, which returned 503 and — under
// mode:'no-cors' — silently dropped every email while showing "success". The
// function calls MailerLite's API with the account token and returns a real result.
const SUBSCRIBE_ENDPOINT = '/.netlify/functions/subscribe';

// Lead-magnet registry. Pins/FB posts deep-link to the form with `?lm=<slug>`
// so the right freebie is both tagged on the subscriber AND delivered instantly
// on the success screen — closing the funnel leak where pins used to point
// straight at the ungated PDF and captured no email. Each magnet maps to its
// per-language PDF (single-file bilingual magnets repeat the same path).
type MagnetCopy = { title: string; blurb: string; bullets: string[]; cta: string };
/** One downloadable item inside a multi-resource magnet. */
type BundleItem = { label: Record<Language, string>; href: Record<Language, string> };

type Magnet = {
  tag: string;
  copy: Record<Language, MagnetCopy>;
  /** Primary/fallback download. Also what a single-file magnet delivers. */
  pdf: Record<Language, string>;
  /** Multi-resource magnets deliver this list instead of the single `pdf`.
   *  Rendered as named links rather than a zip on purpose: most of this traffic
   *  is mobile, and a parent on a phone cannot easily open a zip. */
  bundle?: BundleItem[];
  /** Optional product shot. Drop a file in /public and reference it here; the
   *  section renders the preview only when one exists, so art can land later
   *  without another code change. */
  preview?: string;
};

/**
 * The five resources the "Bilingual Learning Bundle" pins and Facebook posts have
 * been promising (P-008, P-015, FB-009/020/023). Before 2026-08-10 that promise
 * resolved to the single 20-page starter kit, so four fifths of the offer was
 * never delivered. These are real files, all verified 200 on production, with the
 * language-specific edition served where one exists.
 */
const BUNDLE_ITEMS: BundleItem[] = [
  {
    label: {
      en: '20-page Trilingual Starter Kit',
      es: 'Kit trilingüe de 20 páginas',
      fr: 'Kit trilingue de 20 pages',
    },
    href: {
      en: '/bilingual-starter-kit.67152acba3fc.pdf',
      es: '/bilingual-starter-kit.67152acba3fc.pdf',
      fr: '/bilingual-starter-kit.67152acba3fc.pdf',
    },
  },
  {
    label: {
      en: '30 Bilingual Flashcards',
      es: '30 tarjetas bilingües',
      fr: '30 cartes bilingues',
    },
    href: {
      en: '/bilingual-flashcards.8d2eff72661a.pdf',
      es: '/bilingual-flashcards.8d2eff72661a.pdf',
      fr: '/bilingual-flashcards.8d2eff72661a.pdf',
    },
  },
  {
    label: {
      en: 'Bedtime Routine Chart',
      es: 'Tabla de rutina de dormir',
      fr: 'Tableau de la routine du soir',
    },
    href: {
      en: '/bedtime-routine.7cdc728eb026.pdf',
      es: '/bedtime-routine-es.9db70549b2cb.pdf',
      fr: '/bedtime-routine-fr.91d87fe35749.pdf',
    },
  },
  {
    label: {
      en: "Parent's Guide to Bilingual Reading",
      es: 'Guía para criar un lector bilingüe',
      fr: 'Guide pour élever un lecteur bilingue',
    },
    href: {
      en: '/parents-guide.12ba12f60096.pdf',
      es: '/parents-guide-es.5c21d77b24d2.pdf',
      fr: '/parents-guide-fr.16a27a138de4.pdf',
    },
  },
  {
    label: {
      en: '5 Follow-Up Activities After Reading',
      es: '5 actividades para después del cuento',
      fr: '5 activités pour après l\'histoire',
    },
    href: {
      en: '/follow-up-activities.43818dc842cc.pdf',
      es: '/follow-up-activities-es.a733da2b2546.pdf',
      fr: '/follow-up-activities-fr.e605cd5fa2d4.pdf',
    },
  },
];

const BUNDLE_COPY: Record<Language, MagnetCopy> = {
  en: {
    title: 'The FREE Bilingual Learning Bundle, all 5 resources',
    blurb: 'Everything we use at home, in one go: the starter kit, the flashcards, the bedtime chart, the parent\'s guide and the follow-up activities.',
    bullets: [
      '✓ 5 printables, not a sample of one',
      '✓ English, Spanish and French throughout',
      '✓ Yours to keep, print as often as you like',
    ],
    cta: 'Send me all 5',
  },
  es: {
    title: 'El Paquete Bilingüe GRATIS, los 5 recursos',
    blurb: 'Todo lo que usamos en casa, de una vez: el kit de inicio, las tarjetas, la tabla de rutina, la guía para padres y las actividades para después del cuento.',
    bullets: [
      '✓ 5 imprimibles, no una muestra',
      '✓ Inglés, español y francés en todo el paquete',
      '✓ Tuyo para siempre, imprímelo las veces que quieras',
    ],
    cta: 'Envíame los 5 recursos',
  },
  fr: {
    title: 'Le Pack Bilingue GRATUIT, les 5 ressources',
    blurb: 'Tout ce que nous utilisons à la maison, d\'un coup : le kit de démarrage, les cartes, le tableau du soir, le guide des parents et les activités d\'après lecture.',
    bullets: [
      '✓ 5 documents à imprimer, pas un échantillon',
      '✓ Anglais, espagnol et français dans tout le pack',
      '✓ À garder, à imprimer autant de fois que vous voulez',
    ],
    cta: 'Envoyez-moi les 5 ressources',
  },
};

const LEAD_MAGNETS: Record<string, Magnet> = {
  'bedtime-routine': {
    tag: 'bedtime-routine',
    preview: '/previews/bedtime-routine.webp',
    copy: {
      en: {
        title: 'Your bedtime reading routine, FREE',
        blurb: 'One printable chart, five steps, in English and Spanish. Put it where they can see it and let the chart do the arguing.',
        bullets: [
          '✓ 5 picture steps, bath to lights out',
          '✓ Two languages side by side on one page',
          '✓ Print it tonight, no printer wizardry needed',
        ],
        cta: 'Send me the routine',
      },
      es: {
        title: 'Tu rutina de lectura antes de dormir, GRATIS',
        blurb: 'Una tabla imprimible, cinco pasos, en español e inglés. Cuélgala donde la vean y deja que la tabla discuta por ti.',
        bullets: [
          '✓ 5 pasos con dibujos, del baño a apagar la luz',
          '✓ Los dos idiomas juntos en una sola hoja',
          '✓ Imprímela esta misma noche',
        ],
        cta: 'Envíame la rutina gratis',
      },
      fr: {
        title: 'Votre routine du soir, GRATUITE',
        blurb: 'Un tableau à imprimer, cinq étapes, en français et en anglais. Affichez-le à leur hauteur et laissez le tableau négocier à votre place.',
        bullets: [
          '✓ 5 étapes illustrées, du bain à l\'extinction des lumières',
          '✓ Les deux langues côte à côte sur une seule page',
          '✓ À imprimer dès ce soir',
        ],
        cta: 'Envoyez-moi la routine',
      },
    },
    pdf: { en: '/bedtime-routine.7cdc728eb026.pdf', es: '/bedtime-routine-es.9db70549b2cb.pdf', fr: '/bedtime-routine-fr.91d87fe35749.pdf' },
  },
  // Every live asset pointing here promises the five-resource bundle (P-008,
  // P-015, FB-009/020/023). Those pins and posts are already published and
  // cannot be edited, so this slug delivers the bundle rather than the single
  // kit. `bilingual-bundle` below is the clearer alias for new links.
  'bilingual-starter-kit': {
    tag: 'bilingual-bundle',
    preview: '/previews/bilingual-bundle.webp',
    copy: BUNDLE_COPY,
    bundle: BUNDLE_ITEMS,
    pdf: { en: '/bilingual-starter-kit.67152acba3fc.pdf', es: '/bilingual-starter-kit.67152acba3fc.pdf', fr: '/bilingual-starter-kit.67152acba3fc.pdf' },
  },
  'bilingual-bundle': {
    tag: 'bilingual-bundle',
    preview: '/previews/bilingual-bundle.webp',
    copy: BUNDLE_COPY,
    bundle: BUNDLE_ITEMS,
    pdf: { en: '/bilingual-starter-kit.67152acba3fc.pdf', es: '/bilingual-starter-kit.67152acba3fc.pdf', fr: '/bilingual-starter-kit.67152acba3fc.pdf' },
  },
  'bilingual-flashcards': {
    tag: 'bilingual-flashcards',
    copy: {
      en: {
        title: '30 bilingual flashcards, FREE to print',
        blurb: 'Animals, colours and numbers on print-and-cut cards. Ten minutes with scissors, months of use.',
        bullets: [
          '✓ 30 cards: animals, colours, numbers',
          '✓ English, Spanish and French on every card',
          '✓ Print, cut, done',
        ],
        cta: 'Send me the flashcards',
      },
      es: {
        title: '30 tarjetas bilingües, GRATIS para imprimir',
        blurb: 'Animales, colores y números en tarjetas para imprimir y recortar. Diez minutos con tijeras, meses de uso.',
        bullets: [
          '✓ 30 tarjetas: animales, colores, números',
          '✓ Inglés, español y francés en cada tarjeta',
          '✓ Imprimir, recortar, listo',
        ],
        cta: 'Envíame las tarjetas',
      },
      fr: {
        title: '30 cartes bilingues, GRATUITES à imprimer',
        blurb: 'Animaux, couleurs et chiffres sur des cartes à imprimer et découper. Dix minutes de ciseaux, des mois d\'usage.',
        bullets: [
          '✓ 30 cartes : animaux, couleurs, chiffres',
          '✓ Anglais, espagnol et français sur chaque carte',
          '✓ Imprimer, découper, terminé',
        ],
        cta: 'Envoyez-moi les cartes',
      },
    },
    pdf: { en: '/bilingual-flashcards.8d2eff72661a.pdf', es: '/bilingual-flashcards.8d2eff72661a.pdf', fr: '/bilingual-flashcards.8d2eff72661a.pdf' },
  },
  'parents-guide': {
    tag: 'parents-guide',
    copy: {
      en: {
        title: "The parent's guide to raising a bilingual reader, FREE",
        blurb: 'Ten pages, no jargon, written by a grandmother of three bilingual grandchildren. You do not have to be fluent to do this.',
        bullets: [
          '✓ What actually works, and what wastes your evening',
          '✓ The one-word-per-page trick',
          '✓ How to handle the "wrong language" phase',
        ],
        cta: 'Send me the guide',
      },
      es: {
        title: 'La guía para criar un lector bilingüe, GRATIS',
        blurb: 'Diez páginas, sin jerga, escritas por una abuela de tres nietos bilingües. No hace falta hablar perfecto para lograrlo.',
        bullets: [
          '✓ Lo que de verdad funciona y lo que te hace perder la noche',
          '✓ El truco de una palabra por página',
          '✓ Qué hacer en la etapa del "idioma equivocado"',
        ],
        cta: 'Envíame la guía gratis',
      },
      fr: {
        title: 'Le guide pour élever un lecteur bilingue, GRATUIT',
        blurb: 'Dix pages, sans jargon, écrites par une grand-mère de trois petits-enfants bilingues. Pas besoin d\'être parfaitement bilingue.',
        bullets: [
          '✓ Ce qui marche vraiment, et ce qui gâche la soirée',
          '✓ L\'astuce d\'un mot par page',
          '✓ Que faire pendant la phase de la "mauvaise langue"',
        ],
        cta: 'Envoyez-moi le guide',
      },
    },
    pdf: { en: '/parents-guide.12ba12f60096.pdf', es: '/parents-guide-es.5c21d77b24d2.pdf', fr: '/parents-guide-fr.16a27a138de4.pdf' },
  },
  'follow-up-activities': {
    tag: 'follow-up-activities',
    copy: {
      en: {
        title: '5 things to do when the story ends, FREE',
        blurb: 'The book is finished and they want more. Five short activities that stretch one story into a whole evening.',
        bullets: [
          '✓ 5 activities, no craft cupboard required',
          '✓ Works with any picture book you already own',
          '✓ Five minutes each, or as long as they last',
        ],
        cta: 'Send me the activities',
      },
      es: {
        title: '5 actividades para después del cuento, GRATIS',
        blurb: 'Se acabó el libro y quieren más. Cinco actividades cortas que estiran un cuento hasta llenar la tarde.',
        bullets: [
          '✓ 5 actividades, sin necesidad de manualidades complicadas',
          '✓ Sirven con cualquier libro que ya tengas',
          '✓ Cinco minutos cada una, o lo que aguanten',
        ],
        cta: 'Envíame las actividades',
      },
      fr: {
        title: '5 activités pour après l\'histoire, GRATUIT',
        blurb: 'Le livre est fini et ils en redemandent. Cinq activités courtes qui prolongent une histoire toute la soirée.',
        bullets: [
          '✓ 5 activités, sans placard à bricolage',
          '✓ Fonctionne avec n\'importe quel album que vous avez déjà',
          '✓ Cinq minutes chacune, ou tant que ça dure',
        ],
        cta: 'Envoyez-moi les activités',
      },
    },
    pdf: { en: '/follow-up-activities.43818dc842cc.pdf', es: '/follow-up-activities-es.a733da2b2546.pdf', fr: '/follow-up-activities-fr.e605cd5fa2d4.pdf' },
  },
};
const DEFAULT_MAGNET = 'bilingual-starter-kit';

function readParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(name);
}

/**
 * Resolve the requested magnet. `focused` is true when the visitor arrived on a
 * `?lm=` deep link, i.e. they clicked a pin/ad for ONE specific freebie. In that
 * case the section becomes a single-offer landing block (its headline, blurb,
 * bullets and button all describe that freebie). Without `?lm=` it stays the
 * general newsletter pitch for people browsing the homepage.
 */
/**
 * True when the URL carries a `?lm=` we recognise, i.e. the visitor arrived from
 * a pin/ad for ONE specific freebie. Home uses this to hoist the offer above the
 * fold for that traffic (see src/pages/Home.tsx).
 */
export function hasLeadMagnetRequest(): boolean {
  return Boolean(LEAD_MAGNETS[(readParam('lm') || '').toLowerCase()]);
}

function resolveMagnet(): { magnet: Magnet; focused: boolean } {
  const slug = (readParam('lm') || '').toLowerCase();
  const match = LEAD_MAGNETS[slug];
  return { magnet: match ?? LEAD_MAGNETS[DEFAULT_MAGNET], focused: Boolean(match) };
}

const TRANSLATIONS = {
  en: {
    blurb: 'Join our growing community of parents making reading fun. Get coloring pages, reading guides, and multilingual activities delivered straight to your inbox.',
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
    successDetail: 'Tap below to grab your freebie. You’re on the list, so new printables and reading tips are on the way.',
    download: '📥 Download your free PDF',
    errorMessage: 'Something went wrong. Please try again or email contact@storytimewitheva.com.',
    privacy: '🔒 We respect your privacy. No spam, ever.',
    audienceNote: 'For parents & guardians. Please sign up on your child’s behalf.',
  },
  es: {
    blurb: 'Únete a nuestra comunidad de padres que hacen divertida la lectura. Recibe páginas para colorear, guías de lectura y actividades multilingües directamente en tu correo.',
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
    successDetail: 'Toca abajo para obtener tu recurso gratis. Ya estás en la lista, así que pronto recibirás más materiales y consejos de lectura.',
    download: '📥 Descarga tu PDF gratis',
    errorMessage: 'Algo salió mal. Inténtalo de nuevo o escríbenos a contact@storytimewitheva.com.',
    privacy: '🔒 Respetamos tu privacidad. Nunca spam.',
    audienceNote: 'Para padres y tutores. Por favor, regístrate en nombre de tu peque.',
  },
  fr: {
    blurb: 'Rejoignez notre communauté de parents qui rendent la lecture amusante. Recevez des pages à colorier, des guides de lecture et des activités multilingues directement dans votre boîte mail.',
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
    successDetail: 'Cliquez ci-dessous pour récupérer votre ressource gratuite. Vous êtes inscrit, de nouveaux imprimables et conseils de lecture arrivent bientôt.',
    download: '📥 Téléchargez votre PDF gratuit',
    errorMessage: 'Une erreur est survenue. Réessayez ou écrivez à contact@storytimewitheva.com.',
    privacy: '🔒 Nous respectons votre vie privée. Jamais de spam.',
    audienceNote: 'Pour les parents et tuteurs. Merci de vous inscrire au nom de votre enfant.',
  },
};

/** Intrinsic sizes of the preview images, so the browser reserves the right box
 *  and the offer does not jump while the art loads (CLS). */
const PREVIEW_DIMS: Record<string, { w: number; h: number }> = {
  '/previews/bedtime-routine.webp': { w: 720, h: 639 },
  '/previews/bilingual-bundle.webp': { w: 720, h: 509 },
};

export default function EmailSignup() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [{ magnet, focused }] = useState(() => resolveMagnet());
  const offer = magnet.copy[language] ?? magnet.copy.en;
  const successRef = useRef<HTMLParagraphElement>(null);

  // Move focus to the success message so screen-reader users learn the signup
  // worked and the download link is available (the form they were on is gone).
  useEffect(() => {
    if (status === 'submitted') successRef.current?.focus();
  }, [status]);

  // Honor `?lang=` from language-targeted pins (e.g. an ES pin links with
  // &lang=es) so the whole page + delivered PDF render in the pin's language,
  // regardless of the visitor's browser locale.
  useEffect(() => {
    const lang = (readParam('lang') || '').toLowerCase();
    if (lang === 'en' || lang === 'es' || lang === 'fr') setLanguage(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A pre-hydration native submit posts to the function, which 303-redirects
  // back with ?signup=<result>. Reflect that so those visitors still see the
  // success screen (or an error) rather than a bare reload.
  useEffect(() => {
    const r = (readParam('signup') || '').toLowerCase();
    if (r === 'ok') setStatus('submitted');
    else if (r === 'invalid' || r === 'error') setStatus('error');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'submitting') return;

    setStatus('submitting');

    const trimmedName = firstName.trim();

    try {
      const res = await fetch(SUBSCRIBE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: trimmedName, language, lead_magnet: magnet.tag }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('submitted');
        track('Signup', { language });
        setEmail('');
        setFirstName('');
      } else {
        // Real failure now surfaces instead of a silent "success" on a lost email.
        console.error('Signup rejected:', res.status, data);
        setStatus('error');
      }
    } catch (err) {
      console.error('Signup request failed:', err);
      setStatus('error');
    }
  };

  return (
    <section id="email-signup" className="scroll-mt-24 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {focused ? offer.title : magnet.copy[language].title}
        </h2>
        <p className="text-purple-100 text-lg mb-6">{focused ? offer.blurb : t.blurb}</p>

        {/* Product shot, so the visitor sees the thing the pin promised before
            being asked for an email. Only rendered when art exists. */}
        {focused && magnet.preview && (
          <img
            src={magnet.preview}
            alt=""
            width={PREVIEW_DIMS[magnet.preview]?.w ?? 720}
            height={PREVIEW_DIMS[magnet.preview]?.h ?? 639}
            loading="eager"
            decoding="async"
            className="mx-auto mb-6 w-64 md:w-80 rounded-2xl shadow-2xl ring-1 ring-white/20"
          />
        )}

        <ul className="text-left inline-block text-purple-100 text-sm mb-8 space-y-2">
          {(focused ? offer.bullets : t.bullets).map((item, i) => (
            <li key={i} className="flex items-start gap-2">{item}</li>
          ))}
        </ul>

        {status === 'submitted' ? (
          <div className="bg-white/20 rounded-2xl p-6 text-white" role="status" aria-live="polite">
            <div className="text-4xl mb-2">🎉</div>
            <p ref={successRef} tabIndex={-1} className="font-bold text-xl outline-none">{t.successHeading}</p>
            <p className="text-purple-100 text-sm mt-1 mb-4">{t.successDetail}</p>
            {magnet.bundle ? (
              /* Multi-resource magnet: one named link per file. Deliberately not
                 a zip — most of this traffic is mobile and a parent on a phone
                 cannot easily open one. */
              <ul className="text-left space-y-2">
                {magnet.bundle.map((item, i) => (
                  <li key={i}>
                    <a
                      href={item.href[language]}
                      download
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 px-4 py-3 bg-white/15 hover:bg-white/25 rounded-xl font-semibold transition-colors duration-200"
                    >
                      <span aria-hidden="true">📥</span>
                      <span>{item.label[language]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <a
                href={magnet.pdf[language]}
                download
                target="_blank"
                rel="noopener"
                className="inline-block px-6 py-3 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                {t.download}
              </a>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            action={SUBSCRIBE_ENDPOINT}
            method="post"
            className="flex flex-col gap-3 max-w-md mx-auto"
          >
            {/* Native-fallback fields: if the form is submitted before React
                hydrates (no onSubmit yet), the browser posts these directly to
                the function, which redirects back — so no email is ever lost to
                a pre-hydration GET. */}
            <input type="hidden" name="language" value={language} />
            <input type="hidden" name="lead_magnet" value={magnet.tag} />
            <input
              type="text"
              name="name"
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
                name="email"
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
                {status === 'submitting' ? t.submitting : focused ? offer.cta : t.submit}
              </button>
            </div>
          </form>
        )}

        {status === 'error' && (
          <p role="alert" className="mt-4 text-pink-100 text-sm bg-red-500/30 rounded-full inline-block px-4 py-2">
            {t.errorMessage}
          </p>
        )}

        <p className="text-purple-200 text-xs mt-4">{t.privacy}</p>
        <p className="text-purple-200 text-xs mt-1">{t.audienceNote}</p>
      </div>
    </section>
  );
}
