import { useMemo } from 'react';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { useTranslation } from '../lib/language';
import { PRICING } from '../data/pricing';

// Plain-language FAQ drafted from the site's actual behaviour (ages, languages,
// Amazon purchase/price, read-aloud, free activities, on-device progress,
// privacy, contact). Answers double as schema.org FAQPage structured data for
// rich results. DRAFT for owner review — adjust wording/answers as needed.

interface QA {
  q: string;
  a: string;
}

const TRANSLATIONS = {
  en: {
    seoTitle: 'Frequently Asked Questions',
    seoDesc:
      'Answers about ages, languages, prices, read-aloud, free activities, privacy, and how to buy Eva Gallo’s picture books.',
    heading: 'Frequently Asked Questions',
    subheading: 'Everything parents, caregivers, and teachers ask most',
    faqs: [
      { q: 'What ages are these books for?', a: 'The Eva Gallo Collection is written for children ages 3 to 9. Every book on the Books page shows its own recommended age range so you can pick the right fit.' },
      { q: 'What languages can we read and listen in?', a: 'The whole site works in English, Spanish, and French. Use the EN/ES/FR switch at the top. The activities and the “Listen” read-aloud work in all three. Several books are fully trilingual and more translations are on the way; each book shows the languages it’s available in.' },
      { q: 'How do I buy a book, and what does it cost?', a: `Books are sold on Amazon: paperback ${PRICING.paperback} and eBook ${PRICING.ebook} (USD; Amazon shows the final price and availability). Tap “Buy on Amazon” on any book. Amazon handles payment, shipping, and returns.` },
      { q: 'Can my child listen to a story?', a: 'Yes, tap the 🔊 Listen button on any book to hear it read aloud, with natural pronunciation in the language you’ve selected. Great for pre-readers and for hearing a second language.' },
      { q: 'Are the activities and downloads really free?', a: 'Yes. All of the activities, read-alongs, and the 20-page bilingual starter kit are free. Only the books themselves are paid (on Amazon).' },
      { q: 'Do you collect any information about my child?', a: 'No. There are no child accounts or logins, and we don’t collect personal information from children. Reading progress is saved only in your browser and never sent to us. The only thing we collect is a parent’s email address if you choose to join the newsletter (with confirmation). See our Privacy Policy for details.' },
      { q: 'How is my child’s reading progress saved?', a: 'On your device only, inside the browser. It never leaves your device, so clearing your browser data or using a different device or browser will reset it.' },
      { q: 'Do you have resources for teachers and classrooms?', a: 'Yes, our free printables and activities are classroom-friendly, and you’ll find reading tips and ideas in Parent Resources. More teacher resources are on the way.' },
      { q: 'How do I get in touch?', a: 'Use the Contact page or email contact@storytimewitheva.com. We usually reply within 24–48 hours.' },
    ] as QA[],
  },
  es: {
    seoTitle: 'Preguntas frecuentes',
    seoDesc:
      'Respuestas sobre edades, idiomas, precios, lectura en voz alta, actividades gratuitas, privacidad y cómo comprar los libros de Eva Gallo.',
    heading: 'Preguntas frecuentes',
    subheading: 'Lo que más preguntan padres, cuidadores y docentes',
    faqs: [
      { q: '¿Para qué edades son estos libros?', a: 'La Colección Eva Gallo está escrita para niños de 3 a 9 años. Cada libro en la página de Libros muestra su propio rango de edad recomendado para que elijas el adecuado.' },
      { q: '¿En qué idiomas podemos leer y escuchar?', a: 'Todo el sitio funciona en inglés, español y francés — usa el selector EN/ES/FR de arriba. Las actividades y la lectura en voz alta “Escuchar” funcionan en los tres. Varios libros son totalmente trilingües y vienen más traducciones; cada libro indica en qué idiomas está disponible.' },
      { q: '¿Cómo compro un libro y cuánto cuesta?', a: `Los libros se venden en Amazon — tapa blanda ${PRICING.paperback} y eBook ${PRICING.ebook} (USD; Amazon muestra el precio final y la disponibilidad). Pulsa “Comprar en Amazon” en cualquier libro. Amazon gestiona el pago, el envío y las devoluciones.` },
      { q: '¿Mi peque puede escuchar una historia?', a: 'Sí — pulsa el botón 🔊 Escuchar en cualquier libro para oírlo en voz alta, con pronunciación natural en el idioma que hayas elegido. Ideal para quienes aún no leen y para escuchar un segundo idioma.' },
      { q: '¿Las actividades y descargas son realmente gratis?', a: 'Sí. Todas las actividades, las lecturas en voz alta y el kit de inicio bilingüe de 20 páginas son gratis. Solo los libros tienen costo (en Amazon).' },
      { q: '¿Recopilan información sobre mi hijo/a?', a: 'No. No hay cuentas ni inicios de sesión para niños, y no recopilamos información personal de menores. El progreso de lectura se guarda solo en tu navegador y nunca se nos envía. Lo único que recopilamos es el correo de un adulto si decides unirte al boletín (con confirmación). Consulta nuestra Política de privacidad.' },
      { q: '¿Cómo se guarda el progreso de lectura?', a: 'Solo en tu dispositivo, dentro del navegador. Nunca sale de tu dispositivo, así que borrar los datos del navegador o usar otro dispositivo o navegador lo reiniciará.' },
      { q: '¿Tienen recursos para docentes y aulas?', a: 'Sí — nuestros imprimibles y actividades gratuitos son aptos para el aula, y encontrarás consejos e ideas de lectura en Recursos para padres. Pronto habrá más recursos para docentes.' },
      { q: '¿Cómo me pongo en contacto?', a: 'Usa la página de Contacto o escribe a contact@storytimewitheva.com. Solemos responder en 24–48 horas.' },
    ] as QA[],
  },
  fr: {
    seoTitle: 'Foire aux questions',
    seoDesc:
      'Réponses sur les âges, les langues, les prix, la lecture à voix haute, les activités gratuites, la confidentialité et l’achat des livres d’Eva Gallo.',
    heading: 'Foire aux questions',
    subheading: 'Les questions les plus posées par les parents, accompagnants et enseignants',
    faqs: [
      { q: 'À quel âge s’adressent ces livres ?', a: 'La Collection Eva Gallo est écrite pour les enfants de 3 à 9 ans. Chaque livre de la page Livres indique sa tranche d’âge recommandée pour vous aider à bien choisir.' },
      { q: 'Dans quelles langues peut-on lire et écouter ?', a: 'Tout le site fonctionne en anglais, espagnol et français — utilisez le sélecteur EN/ES/FR en haut. Les activités et la lecture à voix haute « Écouter » fonctionnent dans les trois langues. Plusieurs livres sont entièrement trilingues et d’autres traductions arrivent ; chaque livre indique les langues disponibles.' },
      { q: 'Comment acheter un livre et combien coûte-t-il ?', a: `Les livres sont vendus sur Amazon — livre broché ${PRICING.paperback} et livre numérique ${PRICING.ebook} (USD ; Amazon affiche le prix final et la disponibilité). Appuyez sur « Acheter sur Amazon » sur n’importe quel livre. Amazon gère le paiement, la livraison et les retours.` },
      { q: 'Mon enfant peut-il écouter une histoire ?', a: 'Oui — appuyez sur le bouton 🔊 Écouter sur n’importe quel livre pour l’entendre lu à voix haute, avec une prononciation naturelle dans la langue choisie. Parfait pour les non-lecteurs et pour entendre une seconde langue.' },
      { q: 'Les activités et téléchargements sont-ils vraiment gratuits ?', a: 'Oui. Toutes les activités, les lectures à voix haute et le kit de démarrage bilingue de 20 pages sont gratuits. Seuls les livres sont payants (sur Amazon).' },
      { q: 'Collectez-vous des informations sur mon enfant ?', a: 'Non. Il n’y a ni comptes ni connexions pour les enfants, et nous ne collectons pas d’informations personnelles auprès des mineurs. La progression de lecture est enregistrée uniquement dans votre navigateur et ne nous est jamais envoyée. La seule chose que nous collectons est l’e-mail d’un adulte si vous choisissez de rejoindre la newsletter (avec confirmation). Consultez notre politique de confidentialité.' },
      { q: 'Comment la progression de lecture est-elle enregistrée ?', a: 'Uniquement sur votre appareil, dans le navigateur. Elle ne quitte jamais votre appareil — effacer les données du navigateur ou changer d’appareil ou de navigateur la réinitialise.' },
      { q: 'Avez-vous des ressources pour les enseignants et les classes ?', a: 'Oui — nos imprimables et activités gratuits conviennent à la classe, et vous trouverez des conseils et idées de lecture dans les Ressources pour parents. D’autres ressources pour enseignants arrivent.' },
      { q: 'Comment vous contacter ?', a: 'Utilisez la page Contact ou écrivez à contact@storytimewitheva.com. Nous répondons généralement sous 24 à 48 heures.' },
    ] as QA[],
  },
};

export default function FAQ() {
  const t = useTranslation(TRANSLATIONS);

  const faqSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: t.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }),
    [t.faqs],
  );

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/faq" />
      <JsonLd id="faq" data={faqSchema} />

      <section className="bg-gradient-to-b from-purple-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4" aria-hidden>❓</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {t.faqs.map((f, i) => (
            <details key={i} className="group bg-white rounded-2xl shadow-md border border-gray-50 p-5">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-800 list-none [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <span className="ml-3 text-2xl leading-none text-purple-500 transition-transform duration-200 group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="text-gray-600 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
