
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendEmail } from "@/integrations/Core";
import { Mail, Send, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const translations = {
  en: {
    title: "Get in Touch with Eva",
    subtitle: "We'd love to hear from you! Send us a message and we'll get back to you soon.",
    form: {
      name: "Your Name",
      email: "Your Email",
      subject: "Subject",
      message: "Your Message",
      button: "Send Message",
      sending: "Sending..."
    },
    success: "Thank you for your message! We'll get back to you soon. 🎉",
    error: "Oops! Something went wrong. Please try again.",
    info: {
      title: "Contact Information",
      email: "Email",
      emailValue: "hello@storytimewitheva.com", // Keeping this as a translation key for consistency, even if it's hardcoded below
      location: "Location",
      locationValue: "Making reading magical worldwide!",
      hours: "Response Time",
      hoursValue: "We typically respond within 24-48 hours"
    },
    footer: "Let's make reading magical together!"
  },
  es: {
    title: "Ponte en Contacto con Eva",
    subtitle: "¡Nos encantaría saber de ti! Envíanos un mensaje y te responderemos pronto.",
    form: {
      name: "Tu Nombre",
      email: "Tu Correo Electrónico",
      subject: "Asunto",
      message: "Tu Mensaje",
      button: "Enviar Mensaje",
      sending: "Enviando..."
    },
    success: "¡Gracias por tu mensaje! Te responderemos pronto. 🎉",
    error: "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo.",
    info: {
      title: "Información de Contacto",
      email: "Correo",
      emailValue: "hello@storytimewitheva.com",
      location: "Ubicación",
      locationValue: "¡Haciendo la lectura mágica en todo el mundo!",
      hours: "Tiempo de Respuesta",
      hoursValue: "Normalmente respondemos en 24-48 horas"
    },
    footer: "¡Hagamos la lectura mágica juntos!"
  },
  fr: {
    title: "Contactez Eva",
    subtitle: "Nous aimerions avoir de vos nouvelles! Envoyez-nous un message.",
    form: {
      name: "Votre Nom",
      email: "Votre Email",
      subject: "Sujet",
      message: "Votre Message",
      button: "Envoyer le Message",
      sending: "Envoi..."
    },
    success: "Merci pour votre message! Nous vous répondrons bientôt! 🎉",
    error: "Oups! Quelque chose s'est mal passé. Veuillez réessayer.",
    info: {
      title: "Informations de Contact",
      email: "Email",
      emailValue: "hello@storytimewitheva.com",
      location: "Localisation",
      locationValue: "Rendre la lecture magique dans le monde entier!",
      hours: "Temps de Réponse",
      hoursValue: "Nous répondons généralement sous 24-48 heures"
    },
    footer: "Rendons la lecture magique ensemble!"
  }
};

export default function Contact() {
  // Get language from URL parameter to sync with Layout language selector
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    // Listen for language changes from localStorage or URL
    const checkLanguage = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      if (langParam && translations[langParam]) {
        setLanguage(langParam);
      } else if (window.currentLanguage) {
        setLanguage(window.currentLanguage);
      }
    };
    
    checkLanguage();
    window.addEventListener('languagechange', checkLanguage);
    
    return () => window.removeEventListener('languagechange', checkLanguage);
  }, []);

  const t = translations[language] || translations.en;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    try {
      await SendEmail({
        to: "hello@storytimewitheva.com",
        subject: `Contact Form: ${formData.subject}`,
        body: `
          Name: ${formData.name}
          Email: ${formData.email}
          Subject: ${formData.subject}
          
          Message:
          ${formData.message}
        `
      });

      setShowSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Show success toast
      if (window.showToast) {
        window.showToast("Message sent successfully! We'll reply within 24-48 hours. ✓", 'success');
      }
      
      setTimeout(() => setShowSuccess(false), 8000);
    } catch (error) {
      console.error("Error sending email:", error);
      setShowError(true);
      
      // Show error toast
      if (window.showToast) {
        window.showToast("Failed to send message. Please try again or email us directly.", 'error');
      }
      
      setTimeout(() => setShowError(false), 5000);
    }

    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t.info.email,
      value: "hello@storytimewitheva.com", // Changed from t.info.emailValue as per instructions
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      icon: MapPin,
      title: t.info.location,
      value: t.info.locationValue,
      gradient: "from-purple-400 to-pink-400"
    },
    {
      icon: MessageCircle,
      title: t.info.hours,
      value: t.info.hoursValue,
      gradient: "from-orange-400 to-red-400"
    }
  ];

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-5xl mb-3 animate-bounce">📬</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t.title}
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-4 rounded-full" />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400" />
              <CardContent className="p-8">
                {/* Help Text */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> We typically respond within 24-48 hours. For faster answers, check our FAQ section!
                  </p>
                </div>

                {showSuccess ? (
                  <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-2xl p-8 text-center animate-in fade-in-0 zoom-in-95 duration-500">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{t.success}</h3>
                    <p className="mb-4">We've received your message and will get back to you soon!</p>
                    <p className="text-sm">📧 Check your email for a confirmation</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {t.form.name}
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {t.form.email}
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {t.form.subject}
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {t.form.message}
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
                      />
                    </div>

                    {showError && (
                      <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl p-4 text-center animate-in fade-in-0 zoom-in-95 duration-300">
                        <p className="font-semibold mb-2">{t.error}</p>
                        <p className="text-sm">Try emailing us directly at: hello@storytimewitheva.com</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-6 rounded-full text-lg shadow-lg min-h-[56px]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          {t.form.sending}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {t.form.button}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">🐾</div>
                <h3 className="text-xl font-bold mb-2">{t.info.title}</h3>
                <p className="text-purple-100 text-sm">
                  {t.footer}
                </p>
              </CardContent>
            </Card>

            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${info.gradient} flex items-center justify-center mb-4`}>
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{info.title}</h4>
                    <p className="text-gray-600 text-sm">{info.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Fun decorative elements */}
        <div className="text-center mt-16">
          <div className="flex justify-center gap-6 text-6xl mb-6">
            <span className="animate-bounce">📚</span>
            <span className="animate-pulse">✨</span>
            <span className="animate-bounce delay-100">🎨</span>
            <span className="animate-pulse delay-200">🌟</span>
          </div>
          <p className="text-xl text-gray-600 font-medium">
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
}
