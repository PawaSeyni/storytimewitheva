import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    seoTitle: 'Story Time with Eva: Links',
    seoDesc: 'Quick links from the Eva Gallo Collection: the books on Amazon, free printables, and where to follow along.',
    tagline: 'Multicultural picture books for curious minds · EN · ES · FR',
    sectionBooks: 'The Books',
    amazonCta: '📚 The Eva Gallo Collection on Amazon',
    amazonSub: 'Browse the full collection: multicultural picture books, ages 3–9',
    sectionFreebies: 'Free Printables',
    bedtimeCta: '🌙 Bilingual Bedtime Routine Chart',
    bedtimeSub: 'Free PDF · EN · ES · FR available',
    starterCta: '🎒 Bilingual Starter Kit',
    starterSub: '20-page free PDF · EN / ES',
    flashCta: '🃏 Bilingual Flashcards (Animals · Colors · Numbers)',
    flashSub: 'Free printable · EN / ES / FR',
    guideCta: '📖 Parent\'s Guide to Bilingual Reading',
    guideSub: 'Free PDF · available in EN · ES · FR',
    sectionFollow: 'Follow Along',
    pinterestCta: '📌 Pinterest: daily reading inspiration',
    instagramCta: '📷 Instagram @evagallo.books',
    threadsCta: '🧵 Threads @evagallo.books',
    tiktokCta: '🎵 TikTok @evagallo8',
    homepageCta: '🏠 Explore storytimewitheva.com',
    sectionEmail: 'Stay in touch',
    emailCta: '💌 Join the newsletter',
    emailSub: 'Bedtime stories, reading tips, free printables, weekly',
    footer: 'Story Time with Eva · An Eva Gallo Collection imprint',
  },
  es: {
    seoTitle: 'Story Time with Eva — Enlaces',
    seoDesc: 'Enlaces rápidos de la Colección Eva Gallo: los libros en Amazon, imprimibles gratis y dónde seguirnos.',
    tagline: 'Libros ilustrados multiculturales para mentes curiosas · EN · ES · FR',
    sectionBooks: 'Los libros',
    amazonCta: '📚 La Colección Eva Gallo en Amazon',
    amazonSub: 'Explora la colección completa — libros ilustrados, 3 a 9 años',
    sectionFreebies: 'Imprimibles gratis',
    bedtimeCta: '🌙 Rutina de la noche bilingüe (PDF)',
    bedtimeSub: 'Gratis · disponible EN · ES · FR',
    starterCta: '🎒 Kit de inicio bilingüe',
    starterSub: 'PDF de 20 páginas · EN / ES',
    flashCta: '🃏 Tarjetas bilingües (Animales · Colores · Números)',
    flashSub: 'Imprimible gratis · EN / ES / FR',
    guideCta: '📖 Guía para padres — lectura bilingüe',
    guideSub: 'PDF gratis · EN · ES · FR',
    sectionFollow: 'Síguenos',
    pinterestCta: '📌 Pinterest — inspiración de lectura diaria',
    instagramCta: '📷 Instagram @evagallo.books',
    threadsCta: '🧵 Threads @evagallo.books',
    tiktokCta: '🎵 TikTok @evagallo8',
    homepageCta: '🏠 Explora storytimewitheva.com',
    sectionEmail: 'Sigamos en contacto',
    emailCta: '💌 Únete al boletín',
    emailSub: 'Cuentos para dormir, consejos de lectura, imprimibles — semanal',
    footer: 'Story Time with Eva · Sello Eva Gallo Collection',
  },
  fr: {
    seoTitle: 'Story Time with Eva — Liens',
    seoDesc: 'Liens rapides de la Collection Eva Gallo : les livres sur Amazon, des imprimés gratuits et où nous suivre.',
    tagline: 'Albums illustrés multiculturels pour les esprits curieux · EN · ES · FR',
    sectionBooks: 'Les livres',
    amazonCta: '📚 La Collection Eva Gallo sur Amazon',
    amazonSub: 'Parcourez la collection — albums jeunesse, 3 à 9 ans',
    sectionFreebies: 'Imprimés gratuits',
    bedtimeCta: '🌙 Routine du coucher bilingue (PDF)',
    bedtimeSub: 'Gratuit · disponible EN · ES · FR',
    starterCta: '🎒 Kit de démarrage bilingue',
    starterSub: 'PDF de 20 pages · EN / ES',
    flashCta: '🃏 Cartes bilingues (Animaux · Couleurs · Nombres)',
    flashSub: 'Imprimé gratuit · EN / ES / FR',
    guideCta: '📖 Guide parental — lecture bilingue',
    guideSub: 'PDF gratuit · EN · ES · FR',
    sectionFollow: 'Suivez-nous',
    pinterestCta: '📌 Pinterest — inspiration lecture quotidienne',
    instagramCta: '📷 Instagram @evagallo.books',
    threadsCta: '🧵 Threads @evagallo.books',
    tiktokCta: '🎵 TikTok @evagallo8',
    homepageCta: '🏠 Découvrez storytimewitheva.com',
    sectionEmail: 'Restons en contact',
    emailCta: '💌 Rejoignez la newsletter',
    emailSub: 'Histoires du soir, astuces de lecture, imprimés — hebdomadaire',
    footer: 'Story Time with Eva · Imprint Eva Gallo Collection',
  },
};

type LinkRow = {
  href: string;
  external?: boolean;
  title: string;
  subtitle?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
};

export default function Links() {
  const t = useTranslation(TRANSLATIONS);

  const sections: { heading: string; rows: LinkRow[] }[] = [
    {
      heading: t.sectionBooks,
      rows: [
        {
          href: 'https://www.amazon.com/author/evagallo',
          external: true,
          title: t.amazonCta,
          subtitle: t.amazonSub,
          variant: 'primary',
        },
      ],
    },
    {
      heading: t.sectionFreebies,
      rows: [
        { href: '/bedtime-routine.pdf', external: true, title: t.bedtimeCta, subtitle: t.bedtimeSub, variant: 'secondary' },
        { href: '/bilingual-starter-kit.pdf', external: true, title: t.starterCta, subtitle: t.starterSub, variant: 'secondary' },
        { href: '/bilingual-flashcards.pdf', external: true, title: t.flashCta, subtitle: t.flashSub, variant: 'secondary' },
        { href: '/parents-guide.pdf', external: true, title: t.guideCta, subtitle: t.guideSub, variant: 'secondary' },
      ],
    },
    {
      heading: t.sectionFollow,
      rows: [
        { href: 'https://www.pinterest.com/storytimewitheva', external: true, title: t.pinterestCta, variant: 'tertiary' },
        { href: 'https://www.instagram.com/evagallo.books', external: true, title: t.instagramCta, variant: 'tertiary' },
        { href: 'https://www.threads.com/@evagallo.books', external: true, title: t.threadsCta, variant: 'tertiary' },
        { href: 'https://www.tiktok.com/@evagallo8', external: true, title: t.tiktokCta, variant: 'tertiary' },
        { href: '/', external: false, title: t.homepageCta, variant: 'tertiary' },
      ],
    },
    {
      heading: t.sectionEmail,
      rows: [
        { href: '/#email-signup', external: false, title: t.emailCta, subtitle: t.emailSub, variant: 'secondary' },
      ],
    },
  ];

  const variantClasses: Record<NonNullable<LinkRow['variant']>, string> = {
    primary:
      'bg-[#E8A053] hover:bg-[#d68f3f] text-white border-transparent shadow-md',
    secondary:
      'bg-[#FBF6EC] hover:bg-[#F2D08A] text-[#2A2018] border-[#E8A053]/40',
    tertiary:
      'bg-white hover:bg-[#FBF6EC] text-[#3B5E7A] border-[#3B5E7A]/30',
  };

  return (
    <>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/links" />
      <div className="min-h-screen bg-gradient-to-b from-[#FBF6EC] via-[#F2D08A]/40 to-[#FBF6EC] py-10 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3" aria-hidden>🌅</div>
            <h1 className="text-2xl font-bold text-[#2A2018] mb-1">
              Story Time with Eva
            </h1>
            <p className="text-sm text-[#3B5E7A] leading-snug">
              {t.tagline}
            </p>
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <section key={section.heading} className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#3B5E7A]/70 mb-3 px-1">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.rows.map((row) => {
                  const classes = `block w-full text-center px-5 py-4 rounded-2xl border transition-colors duration-150 ${
                    variantClasses[row.variant ?? 'secondary']
                  }`;
                  const inner = (
                    <>
                      <div className="font-semibold leading-tight">{row.title}</div>
                      {row.subtitle && (
                        <div className="text-xs mt-1 opacity-80">{row.subtitle}</div>
                      )}
                    </>
                  );
                  return row.external ? (
                    <a
                      key={row.href + row.title}
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link key={row.href + row.title} to={row.href} className={classes}>
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Footer */}
          <p className="text-center text-xs text-[#3B5E7A]/70 mt-8">
            {t.footer}
          </p>
        </div>
      </div>
    </>
  );
}
