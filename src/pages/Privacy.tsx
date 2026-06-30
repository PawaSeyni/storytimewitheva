import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';

// Plain-language privacy policy. Content reflects the site's ACTUAL data
// practices as implemented in code:
//   • Newsletter  -> MailerLite (email + optional first name, double opt-in)
//   • Contact     -> Netlify Forms (name, email, subject, message)
//   • Analytics   -> Plausible (cookieless, aggregate, no personal data)
//   • Feedback widget -> Netlify Forms (rating, page, language, optional comment)
//   • Reading profile -> browser localStorage only, never transmitted
// No child accounts, no advertising trackers, no data sales.
// Operator: Pawa Press Inc., Toronto, Ontario, Canada (confirmed 2026-06-16).
// NOTE FOR OWNER: have counsel review before relying on it.

interface Section {
  heading: string;
  body: string[];
}

const TRANSLATIONS = {
  en: {
    seoTitle: 'Privacy Policy',
    seoDesc:
      'How Story Time with Eva handles your information. We are directed to parents and guardians, use privacy-friendly analytics, and never knowingly collect personal information from children.',
    title: 'Privacy Policy',
    updated: 'Last updated: June 2026',
    intro:
      'Story Time with Eva is operated by Pawa Press Inc. ("we", "us") and publishes the Eva Gallo Collection of picture books. This site is intended for parents, guardians, caregivers, and educators. This page explains, in plain language, what we collect and what we do not.',
    sections: [
      {
        heading: 'A note for families',
        body: [
          'This website is designed for adults to use with or on behalf of children. We do not offer child accounts, logins, chat, comments, or any way for a child to publish or send personal information.',
          'We do not knowingly collect personal information from children. If you believe a child has provided us personal information, email contact@storytimewitheva.com and we will delete it.',
        ],
      },
      {
        heading: 'Reading progress stays on your device',
        body: [
          'The "My Reading Profile" page (books read, want-to-read, completed activities) is saved only in your browser using local storage. It never leaves your device and is never sent to us. Clearing your browser data or switching devices resets it.',
        ],
      },
      {
        heading: 'Newsletter sign-up',
        body: [
          'If you join our mailing list, we collect your email address and, optionally, your first name. This is handled by MailerLite with double opt-in (you must confirm by email). We use it only to send the free activity kit and occasional reading tips and updates. You can unsubscribe at any time using the link in every email.',
        ],
      },
      {
        heading: 'Contact form',
        body: [
          'When you message us, we collect the name, email, subject, and message you provide, via Netlify Forms, so we can reply. We do not use it for marketing. Please do not include sensitive personal information in your message.',
          'Our on-site feedback button also uses Netlify Forms: it records a rating, the page, and your site language, plus any optional comment you choose to write. It never asks for your name or email.',
        ],
      },
      {
        heading: 'Analytics',
        body: [
          'We use Plausible Analytics to understand which pages are popular. Plausible is privacy-friendly: it uses no cookies, does not track you across sites, and collects only aggregate, anonymous statistics. It does not identify you personally.',
        ],
      },
      {
        heading: 'What we do NOT do',
        body: [
          'We do not sell or rent your information. We do not run advertising trackers. We do not use cookies to follow you around the web. We do not build profiles of children.',
        ],
      },
      {
        heading: 'Buying books & affiliate links',
        body: [
          'Our books are sold on Amazon. When you click "Buy", you leave our site and your purchase is governed by Amazon\'s own terms and privacy policy. Some outgoing links may be affiliate links, meaning we may earn a small commission at no extra cost to you.',
        ],
      },
      {
        heading: 'Your choices and rights',
        body: [
          'You can unsubscribe from emails at any time, and you can ask us to access or delete the information you have given us by emailing contact@storytimewitheva.com. Depending on where you live, you may have additional rights under laws such as the GDPR (Europe), UK GDPR, CCPA (California), or PIPEDA / Law 25 (Canada).',
        ],
      },
      {
        heading: 'Changes & contact',
        body: [
          'We may update this policy from time to time; the date above shows the latest version. Questions? Email contact@storytimewitheva.com.',
        ],
      },
    ] as Section[],
  },
  es: {
    seoTitle: 'Política de privacidad',
    seoDesc:
      'Cómo Story Time with Eva trata tu información. Está dirigido a padres y tutores, usa analíticas respetuosas con la privacidad y nunca recopila datos personales de niños a sabiendas.',
    title: 'Política de privacidad',
    updated: 'Última actualización: junio de 2026',
    intro:
      'Story Time with Eva es operado por Pawa Press Inc. ("nosotros") y publica la Colección Eva Gallo de libros ilustrados. Este sitio está dirigido a padres, tutores, cuidadores y educadores. Esta página explica, en lenguaje sencillo, qué recopilamos y qué no.',
    sections: [
      {
        heading: 'Una nota para las familias',
        body: [
          'Este sitio está diseñado para que lo usen personas adultas con los niños o en su nombre. No ofrecemos cuentas para niños, inicios de sesión, chat, comentarios ni ninguna forma de que un niño publique o envíe información personal.',
          'No recopilamos a sabiendas información personal de niños. Si crees que un niño nos ha facilitado datos personales, escribe a contact@storytimewitheva.com y los eliminaremos.',
        ],
      },
      {
        heading: 'El progreso de lectura se queda en tu dispositivo',
        body: [
          'La página "Mi perfil de lectura" (libros leídos, por leer, actividades completadas) se guarda solo en tu navegador mediante el almacenamiento local. Nunca sale de tu dispositivo ni se nos envía. Borrar los datos del navegador o cambiar de dispositivo lo reinicia.',
        ],
      },
      {
        heading: 'Suscripción al boletín',
        body: [
          'Si te unes a nuestra lista, recopilamos tu correo electrónico y, opcionalmente, tu nombre. Lo gestiona MailerLite con doble confirmación (debes confirmar por correo). Lo usamos solo para enviar el kit gratuito y, de vez en cuando, consejos de lectura y novedades. Puedes darte de baja en cualquier momento con el enlace de cada correo.',
        ],
      },
      {
        heading: 'Formulario de contacto',
        body: [
          'Cuando nos escribes, recopilamos el nombre, correo, asunto y mensaje que nos das, a través de Netlify Forms, para poder responderte. No lo usamos para marketing. Por favor, no incluyas información personal sensible en tu mensaje.',
          'Nuestro botón de comentarios del sitio también usa Netlify Forms: registra una valoración, la página y el idioma del sitio, además de cualquier comentario opcional que escribas. Nunca pide tu nombre ni tu correo.',
        ],
      },
      {
        heading: 'Analíticas',
        body: [
          'Usamos Plausible Analytics para saber qué páginas son populares. Plausible respeta la privacidad: no usa cookies, no te rastrea entre sitios y solo recopila estadísticas anónimas y agregadas. No te identifica personalmente.',
        ],
      },
      {
        heading: 'Lo que NO hacemos',
        body: [
          'No vendemos ni alquilamos tu información. No usamos rastreadores publicitarios. No usamos cookies para seguirte por la web. No creamos perfiles de niños.',
        ],
      },
      {
        heading: 'Compra de libros y enlaces de afiliado',
        body: [
          'Nuestros libros se venden en Amazon. Al pulsar "Comprar", sales de nuestro sitio y tu compra se rige por los términos y la política de privacidad de Amazon. Algunos enlaces salientes pueden ser de afiliado, lo que significa que podemos ganar una pequeña comisión sin coste adicional para ti.',
        ],
      },
      {
        heading: 'Tus opciones y derechos',
        body: [
          'Puedes darte de baja de los correos cuando quieras y pedirnos acceder o eliminar la información que nos hayas dado escribiendo a contact@storytimewitheva.com. Según dónde vivas, puedes tener derechos adicionales bajo leyes como el RGPD (Europa), la CCPA (California) o PIPEDA / Ley 25 (Canadá).',
        ],
      },
      {
        heading: 'Cambios y contacto',
        body: [
          'Podemos actualizar esta política de vez en cuando; la fecha de arriba indica la última versión. ¿Preguntas? Escribe a contact@storytimewitheva.com.',
        ],
      },
    ] as Section[],
  },
  fr: {
    seoTitle: 'Politique de confidentialité',
    seoDesc:
      'Comment Story Time with Eva traite vos informations. Le site s\'adresse aux parents et tuteurs, utilise des analyses respectueuses de la vie privée et ne collecte jamais sciemment de données personnelles d\'enfants.',
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : juin 2026',
    intro:
      'Story Time with Eva est exploité par Pawa Press Inc. (« nous ») et publie la Collection Eva Gallo d\'albums illustrés. Ce site s\'adresse aux parents, tuteurs, accompagnants et enseignants. Cette page explique, en langage clair, ce que nous collectons et ce que nous ne collectons pas.',
    sections: [
      {
        heading: 'Une note pour les familles',
        body: [
          'Ce site est conçu pour être utilisé par des adultes avec les enfants ou en leur nom. Nous ne proposons pas de comptes enfants, de connexion, de messagerie, de commentaires, ni aucun moyen pour un enfant de publier ou d\'envoyer des informations personnelles.',
          'Nous ne collectons pas sciemment d\'informations personnelles auprès d\'enfants. Si vous pensez qu\'un enfant nous a transmis des données personnelles, écrivez à contact@storytimewitheva.com et nous les supprimerons.',
        ],
      },
      {
        heading: 'La progression de lecture reste sur votre appareil',
        body: [
          'La page « Mon profil de lecture » (livres lus, à lire, activités terminées) est enregistrée uniquement dans votre navigateur via le stockage local. Elle ne quitte jamais votre appareil et ne nous est jamais envoyée. Effacer les données du navigateur ou changer d\'appareil la réinitialise.',
        ],
      },
      {
        heading: 'Inscription à la newsletter',
        body: [
          'Si vous rejoignez notre liste, nous collectons votre adresse e-mail et, facultativement, votre prénom. Cela est géré par MailerLite avec double opt-in (vous devez confirmer par e-mail). Nous l\'utilisons uniquement pour envoyer le kit gratuit et, occasionnellement, des conseils de lecture et des nouvelles. Vous pouvez vous désinscrire à tout moment via le lien présent dans chaque e-mail.',
        ],
      },
      {
        heading: 'Formulaire de contact',
        body: [
          'Lorsque vous nous écrivez, nous collectons le nom, l\'e-mail, le sujet et le message que vous fournissez, via Netlify Forms, afin de vous répondre. Nous ne l\'utilisons pas à des fins marketing. Merci de ne pas inclure d\'informations personnelles sensibles dans votre message.',
          'Notre bouton d\'avis sur le site utilise aussi Netlify Forms : il enregistre une note, la page et la langue du site, ainsi que tout commentaire facultatif que vous écrivez. Il ne demande jamais votre nom ni votre e-mail.',
        ],
      },
      {
        heading: 'Analyses',
        body: [
          'Nous utilisons Plausible Analytics pour savoir quelles pages sont populaires. Plausible respecte la vie privée : sans cookies, sans suivi entre sites, il ne collecte que des statistiques anonymes et agrégées. Il ne vous identifie pas personnellement.',
        ],
      },
      {
        heading: 'Ce que nous ne faisons PAS',
        body: [
          'Nous ne vendons ni ne louons vos informations. Nous n\'utilisons pas de traceurs publicitaires. Nous n\'utilisons pas de cookies pour vous suivre sur le web. Nous ne créons pas de profils d\'enfants.',
        ],
      },
      {
        heading: 'Achat de livres et liens affiliés',
        body: [
          'Nos livres sont vendus sur Amazon. En cliquant sur « Acheter », vous quittez notre site et votre achat est régi par les conditions et la politique de confidentialité d\'Amazon. Certains liens sortants peuvent être des liens affiliés, ce qui signifie que nous pouvons percevoir une petite commission sans coût supplémentaire pour vous.',
        ],
      },
      {
        heading: 'Vos choix et vos droits',
        body: [
          'Vous pouvez vous désinscrire des e-mails à tout moment et nous demander d\'accéder aux informations que vous nous avez données ou de les supprimer en écrivant à contact@storytimewitheva.com. Selon votre lieu de résidence, vous pouvez disposer de droits supplémentaires en vertu de lois telles que le RGPD (Europe), la CCPA (Californie) ou PIPEDA / Loi 25 (Canada).',
        ],
      },
      {
        heading: 'Modifications et contact',
        body: [
          'Nous pouvons mettre à jour cette politique de temps à autre ; la date ci-dessus indique la dernière version. Des questions ? Écrivez à contact@storytimewitheva.com.',
        ],
      },
    ] as Section[],
  },
};

export default function Privacy() {
  const t = useTranslation(TRANSLATIONS);

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/privacy" />

      <section className="bg-gradient-to-b from-purple-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{t.title}</h1>
          <p className="text-gray-500 text-sm">{t.updated}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 leading-relaxed mb-8">{t.intro}</p>
          <div className="space-y-8">
            {t.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{section.heading}</h2>
                {section.body.map((para, j) => (
                  <p key={j} className="text-gray-600 leading-relaxed mb-3">{para}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
