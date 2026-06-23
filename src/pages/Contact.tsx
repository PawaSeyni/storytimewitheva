import { useState } from 'react';
import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';
import { AMAZON_AUTHOR_URL } from '../lib/amazon';

const TRANSLATIONS = {
  en: {
    seoTitle: 'Contact',
    seoDesc: "Get in touch with Story Time with Eva. Questions about the books, school visits, or just want to say hi? Send a message and we'll get back to you.",
    heading: 'Get in Touch with Eva',
    subheading: "We'd love to hear from you! Send us a message and we'll get back to you soon.",
    tipLabel: 'Tip',
    tip: 'We typically respond within 24-48 hours. For faster answers, check our FAQ section!',
    successHeading: 'Message Sent!',
    successDetail: 'Thank you for reaching out. Eva will get back to you within 24-48 hours.',
    sendAnother: 'Send Another Message',
    nameLabel: 'Your Name',
    namePlaceholder: 'Jane Smith',
    emailLabel: 'Your Email',
    emailPlaceholder: 'jane@example.com',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'Book inquiry, school visit, etc.',
    messageLabel: 'Your Message',
    messagePlaceholder: 'Tell us how we can help...',
    sendButton: '✉️ Send Message',
    sending: 'Sending…',
    errorMessage: "Hmm, that didn't go through. Please try again or email contact@storytimewitheva.com directly.",
    sidebarHeading: 'Contact Information',
    sidebarBlurb: "Let's make reading magical together!",
    emailTitle: 'Email',
    locationTitle: 'Location',
    locationValue: 'Making reading magical worldwide!',
    responseTitle: 'Response Time',
    responseValue: 'Within 24-48 hours',
    followLabel: 'Follow Eva',
  },
  es: {
    seoTitle: 'Contacto',
    seoDesc: '¿Quieres contactar con Story Time with Eva? Preguntas sobre libros, visitas escolares o simplemente saludar. Escríbenos y te responderemos.',
    heading: 'Ponte en contacto con Eva',
    subheading: '¡Nos encantaría saber de ti! Envíanos un mensaje y te responderemos pronto.',
    tipLabel: 'Consejo',
    tip: 'Normalmente respondemos en 24-48 horas. ¡Para respuestas más rápidas, revisa la sección de preguntas frecuentes!',
    successHeading: '¡Mensaje enviado!',
    successDetail: 'Gracias por escribir. Eva te responderá en 24-48 horas.',
    sendAnother: 'Enviar otro mensaje',
    nameLabel: 'Tu nombre',
    namePlaceholder: 'Juana Pérez',
    emailLabel: 'Tu correo',
    emailPlaceholder: 'juana@ejemplo.com',
    subjectLabel: 'Asunto',
    subjectPlaceholder: 'Consulta sobre un libro, visita escolar, etc.',
    messageLabel: 'Tu mensaje',
    messagePlaceholder: 'Cuéntanos cómo podemos ayudarte...',
    sendButton: '✉️ Enviar mensaje',
    sending: 'Enviando…',
    errorMessage: 'Vaya, no se pudo enviar. Inténtalo de nuevo o escríbenos a contact@storytimewitheva.com.',
    sidebarHeading: 'Información de contacto',
    sidebarBlurb: '¡Hagamos la lectura mágica juntos!',
    emailTitle: 'Correo',
    locationTitle: 'Ubicación',
    locationValue: '¡Haciendo la lectura mágica en todo el mundo!',
    responseTitle: 'Tiempo de respuesta',
    responseValue: 'En 24-48 horas',
    followLabel: 'Sigue a Eva',
  },
  fr: {
    seoTitle: 'Contact',
    seoDesc: 'Contactez Story Time with Eva. Questions sur les livres, visites scolaires ou simplement un bonjour ? Envoyez-nous un message et nous reviendrons vers vous.',
    heading: 'Contactez Eva',
    subheading: 'Nous aimerions avoir de vos nouvelles ! Envoyez-nous un message et nous reviendrons vers vous rapidement.',
    tipLabel: 'Astuce',
    tip: 'Nous répondons généralement sous 24 à 48 heures. Pour des réponses plus rapides, consultez la section FAQ !',
    successHeading: 'Message envoyé !',
    successDetail: 'Merci pour votre message. Eva vous répondra sous 24 à 48 heures.',
    sendAnother: 'Envoyer un autre message',
    nameLabel: 'Votre nom',
    namePlaceholder: 'Jeanne Dupont',
    emailLabel: 'Votre e-mail',
    emailPlaceholder: 'jeanne@exemple.com',
    subjectLabel: 'Sujet',
    subjectPlaceholder: 'Question sur un livre, visite scolaire, etc.',
    messageLabel: 'Votre message',
    messagePlaceholder: 'Dites-nous comment nous pouvons aider...',
    sendButton: '✉️ Envoyer le message',
    sending: 'Envoi…',
    errorMessage: "L'envoi a échoué. Réessayez ou écrivez à contact@storytimewitheva.com.",
    sidebarHeading: 'Coordonnées',
    sidebarBlurb: 'Rendons la lecture magique ensemble !',
    emailTitle: 'E-mail',
    locationTitle: 'Localisation',
    locationValue: 'Rendre la lecture magique partout dans le monde !',
    responseTitle: 'Délai de réponse',
    responseValue: 'Sous 24 à 48 heures',
    followLabel: 'Suivre Eva',
  },
};

// Encode a flat object into URL-encoded body for Netlify Forms. Netlify expects
// `application/x-www-form-urlencoded` (the same content type a native HTML form
// POST would send) with a `form-name` field matching the static placeholder in
// index.html.
function encodeFormData(data: Record<string, string>) {
  return Object.keys(data)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const t = useTranslation(TRANSLATIONS);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData({
          'form-name': 'contact',
          website: '', // honeypot — bots fill it, humans leave it blank
          ...form,
        }),
      });
      if (!res.ok) throw new Error(`Netlify Forms returned ${res.status}`);
      setStatus('submitted');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact form submit failed:', err);
      setStatus('error');
    }
  };

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/contact" />

      <section className="bg-gradient-to-b from-pink-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-50">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-700">
                💡 <strong>{t.tipLabel}:</strong> {t.tip}
              </div>

              {status === 'submitted' ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.successHeading}</h3>
                  <p className="text-gray-500">{t.successDetail}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2.5 border-2 border-purple-400 text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-colors"
                  >
                    {t.sendAnother}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="website"
                >
                  {/* Required by Netlify Forms for SPA submissions */}
                  <input type="hidden" name="form-name" value="contact" />
                  {/* Honeypot: a decoy "Website" field bots fill but humans never see.
                      Neutral name/label so it reads as innocuous even if a crawler or
                      text extractor scrapes the DOM. Hidden via INLINE off-screen styles
                      (CSS-independent, so no pre-CSS flash) + aria-hidden (out of the a11y
                      tree) + tabindex=-1 / autocomplete=off (out of tab order + autofill).
                      Off-screen rather than display:none so bots still fill it. */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                    <label htmlFor="contact-website">Website</label>
                    <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">{t.nameLabel}</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder={t.namePlaceholder}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">{t.emailLabel}</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder={t.emailPlaceholder}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">{t.subjectLabel}</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      placeholder={t.subjectPlaceholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">{t.messageLabel}</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                      placeholder={t.messagePlaceholder}
                    />
                  </div>
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                      ⚠️ {t.errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {status === 'submitting' ? t.sending : t.sendButton}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center shadow-lg">
              <span className="text-4xl">🐾</span>
              <h3 className="font-bold text-xl mt-2 mb-1">{t.sidebarHeading}</h3>
              <p className="text-purple-100 text-sm">{t.sidebarBlurb}</p>
            </div>

            {[
              { emoji: '📧', title: t.emailTitle, value: 'contact@storytimewitheva.com', href: 'mailto:contact@storytimewitheva.com' },
              { emoji: '📍', title: t.locationTitle, value: t.locationValue },
              { emoji: '⏰', title: t.responseTitle, value: t.responseValue },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                    {item.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                    {item.href ? (
                      <a href={item.href} className="text-purple-600 text-sm hover:underline">{item.value}</a>
                    ) : (
                      <p className="text-gray-500 text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-50">
              <p className="font-semibold text-gray-800 text-sm mb-3">{t.followLabel}</p>
              <div className="flex gap-2">
                <a href={AMAZON_AUTHOR_URL} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 bg-orange-50 border border-orange-200 rounded-xl text-center text-sm hover:bg-orange-100 transition-colors">
                  📚 Amazon
                </a>
                <a href="https://www.instagram.com/evagallo.books/" target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 bg-pink-50 border border-pink-200 rounded-xl text-center text-sm hover:bg-pink-100 transition-colors">
                  📷 Instagram
                </a>
                <a href="https://www.youtube.com/@StoryTimeEva" target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 bg-red-50 border border-red-200 rounded-xl text-center text-sm hover:bg-red-100 transition-colors">
                  ▶️ YouTube
                </a>
                <a href="https://www.tiktok.com/@evagallo8" target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 bg-gray-50 border border-gray-200 rounded-xl text-center text-sm hover:bg-gray-100 transition-colors">
                  🎵 TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
