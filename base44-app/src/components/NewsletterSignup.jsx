import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewsletterSubscriber } from "@/entities/NewsletterSubscriber";
import { Mail, Sparkles, CheckCircle2 } from "lucide-react";

const translations = {
  en: {
    title: "Join 10,000+ Parents Making Reading Fun!",
    subtitle: "Get weekly book picks, exclusive activities, and reading tips delivered to your inbox.",
    placeholder: "Enter your email address",
    button: "Get Free Activities",
    sending: "Subscribing...",
    success: "Welcome to Story Time with Eva! 🎉",
    successDetails: "Check your email for your first free activity pack!",
    error: "Please enter a valid email address",
    benefits: [
      "✓ Exclusive coloring pages & printables every week",
      "✓ Age-appropriate book recommendations",
      "✓ Fun story prompts & creative activities",
      "✓ No spam, unsubscribe anytime"
    ],
    social: "Rated 4.9/5 by parents",
    privacy: "We respect your privacy. No spam, ever."
  },
  es: {
    title: "¡Únete a 10,000+ Padres que Hacen la Lectura Divertida!",
    subtitle: "Recibe selecciones semanales de libros, actividades exclusivas y consejos de lectura.",
    placeholder: "Ingresa tu correo electrónico",
    button: "Obtener Actividades Gratis",
    sending: "Suscribiendo...",
    success: "¡Bienvenido a Story Time con Eva! 🎉",
    successDetails: "¡Revisa tu correo para tu primer paquete de actividades gratis!",
    error: "Por favor ingresa un correo válido",
    benefits: [
      "✓ Páginas para colorear exclusivas cada semana",
      "✓ Recomendaciones de libros apropiadas",
      "✓ Actividades divertidas y creativas",
      "✓ Sin spam, cancela cuando quieras"
    ],
    social: "Calificado 4.9/5 por padres",
    privacy: "Respetamos tu privacidad. Sin spam, nunca."
  },
  fr: {
    title: "Rejoignez 10,000+ Parents qui Rendent la Lecture Amusante!",
    subtitle: "Recevez des sélections hebdomadaires, des activités exclusives et des conseils.",
    placeholder: "Entrez votre adresse e-mail",
    button: "Obtenir Activités Gratuites",
    sending: "Inscription...",
    success: "Bienvenue à Story Time avec Eva! 🎉",
    successDetails: "Consultez votre email pour votre premier pack d'activités gratuit!",
    error: "Veuillez entrer un email valide",
    benefits: [
      "✓ Pages de coloriage exclusives chaque semaine",
      "✓ Recommandations de livres adaptées",
      "✓ Activités amusantes et créatives",
      "✓ Pas de spam, désinscrivez-vous à tout moment"
    ],
    social: "Noté 4.9/5 par les parents",
    privacy: "Nous respectons votre vie privée. Pas de spam, jamais."
  }
};

export default function NewsletterSignup({ language: propLanguage }) {
  const [language, setLanguage] = useState(propLanguage || 'en');
  
  useEffect(() => {
    const checkLanguage = () => {
      if (window.currentLanguage) {
        setLanguage(window.currentLanguage);
      }
    };
    
    checkLanguage();
    window.addEventListener('languagechange', checkLanguage);
    
    return () => window.removeEventListener('languagechange', checkLanguage);
  }, []);
  
  const t = translations[language] || translations.en;
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError(t.error);
      return;
    }
    
    if (!validateEmail(email)) {
      setError(t.error);
      return;
    }

    setIsSubmitting(true);
    try {
      await NewsletterSubscriber.create({
        email,
        preferred_language: language
      });
      
      setShowSuccess(true);
      setEmail("");
      
      // Show success toast
      if (window.showToast) {
        window.showToast("Successfully subscribed to newsletter! ✓", 'success');
      }
      
      // Reset success state after 10 seconds
      setTimeout(() => setShowSuccess(false), 10000);
    } catch (error) {
      console.error("Subscription error:", error);
      setError("Something went wrong. Please try again.");
      
      // Show error toast
      if (window.showToast) {
        window.showToast("Failed to subscribe. Please try again.", 'error');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 border-0 shadow-2xl relative overflow-hidden">
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10" />
      
      <CardContent className="relative z-10 p-8 md:p-12 text-white">
        <div className="flex justify-center mb-4">
          <Sparkles className="w-12 h-12 animate-pulse" aria-hidden="true" />
        </div>
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center leading-tight drop-shadow-lg">
          {t.title}
        </h2>
        
        <p className="text-base md:text-lg mb-6 opacity-95 max-w-2xl mx-auto text-center leading-relaxed drop-shadow-md">
          {t.subtitle}
        </p>

        {/* Benefits List */}
        <ul className="mb-8 space-y-2 max-w-xl mx-auto" role="list">
          {t.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-base drop-shadow-md">
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Social Proof */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-sm font-semibold drop-shadow-md">⭐⭐⭐⭐⭐ {t.social}</span>
          </div>
        </div>
        
        {showSuccess ? (
          <div 
            role="status"
            aria-live="polite"
            className="bg-white/20 backdrop-blur-sm rounded-2xl py-6 px-6 text-center animate-in fade-in-0 zoom-in-95 duration-500"
          >
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 animate-bounce" />
            <div className="text-2xl font-bold mb-2">{t.success}</div>
            <p className="text-lg">{t.successDetails}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <label htmlFor="newsletter-email" className="sr-only">
                {t.placeholder}
              </label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder={t.placeholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "email-error" : undefined}
                className="w-full rounded-full px-6 py-6 text-base md:text-lg text-gray-900 border-0 shadow-lg min-h-[56px] focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-500"
              />
              {error && (
                <p id="email-error" role="alert" className="mt-2 text-sm text-white bg-red-500/50 rounded-full px-4 py-2 drop-shadow-lg">
                  {error}
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full px-8 py-6 text-base md:text-lg shadow-lg min-h-[56px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-500 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-2" />
                  {t.sending}
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" aria-hidden="true" />
                  {t.button}
                </>
              )}
            </Button>
            
            <p className="text-sm text-center opacity-90 drop-shadow-md">
              🔒 {t.privacy}
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}