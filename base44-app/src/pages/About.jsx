
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Heart, Users, Sparkles, Feather } from "lucide-react";
import NewsletterSignup from "../components/NewsletterSignup";

const translations = {
  en: {
    title: "About Story Time with Eva",
    subtitle: "Making reading magical for every child",
    mission: {
      title: "Our Mission",
      desc: "We believe every child deserves access to stories that spark imagination, build empathy, and celebrate the joy of reading with Eva as their guide."
    },
    story: {
      title: "Our Story",
      desc: "Founded by educators and parents who understand the power of storytelling, we created Eva to make quality children's literature accessible to families everywhere. Each book and activity is carefully designed to inspire curiosity and foster a lifelong love of reading."
    },
    why: {
      title: "Why Books Matter",
      desc: "Reading with Eva isn't just about words on a page—it's about opening doorways to new worlds, building vocabulary, strengthening parent-child bonds, and creating precious memories that last forever."
    },
    values: {
      title: "Our Values",
      desc: "Quality storytelling, inclusive representation, educational excellence, and making reading accessible and fun for all families around the world."
    },
    authorNote: {
      title: "A Note from the Author",
      intro: "This children's book is a lively collection of imaginative stories from the author's childhood, created for kids ages 3 to 9.",
      career: "After a lifelong career in public health, the author is now a full-time grandmother, caring for two young granddaughters with an endless appetite for bedtime stories.",
      inspiration: "Her inspiration comes from childhood memories with her mother and aunt.",
      purpose: "This book—and the series it belongs to—is her way of passing down traditions and lessons from a time before digital media.",
      motivation: "Her motivation is simple: to share that magic with a new generation.",
      signature: "Eva Gallo",
      handle: "@StorytimeWithEvaGallo"
    }
  },
  es: {
    title: "Acerca de Hora del Cuento con Eva",
    subtitle: "Haciendo que la lectura sea mágica para cada niño",
    mission: {
      title: "Nuestra Misión",
      desc: "Creemos que cada niño merece acceso a historias que despierten la imaginación, construyan empatía y celebren la alegría de leer con Eva."
    },
    story: {
      title: "Nuestra Historia",
      desc: "Fundado por educadores y padres, creamos a Eva para hacer que la literatura infantil de calidad sea accesible para las familias."
    },
    why: {
      title: "Por Qué Importan los Libros",
      desc: "Leer con Eva se trata de abrir puertas a nuevos mundos, construir vocabulario y crear recuerdos preciosos."
    },
    values: {
      title: "Nuestros Valores",
      desc: "Narración de calidad, representación inclusiva, excelencia educativa y hacer que la lectura sea accesible."
    },
    authorNote: {
      title: "Una Nota de la Autora",
      intro: "Este libro infantil es una colección viva de historias imaginativas de la infancia de la autora, creada para niños de 3 a 9 años.",
      career: "Después de una carrera de toda la vida en salud pública, la autora es ahora una abuela de tiempo completo, cuidando a dos nietas pequeñas con un apetito interminable por cuentos antes de dormir.",
      inspiration: "Su inspiración proviene de recuerdos de la infancia con su madre y tía.",
      purpose: "Este libro, y la serie a la que pertenece, es su forma de transmitir tradiciones y lecciones de una época anterior a los medios digitales.",
      motivation: "Su motivación es simple: compartir esa magia con una nueva generación.",
      signature: "Eva Gallo",
      handle: "@StorytimeWithEvaGallo"
    }
  },
  fr: {
    title: "À Propos de L'Heure du Conte avec Eva",
    subtitle: "Rendre la lecture magique pour chaque enfant",
    mission: {
      title: "Notre Mission",
      desc: "Nous croyons que chaque enfant mérite l'accès à des histoires qui éveillent l'imagination avec Eva."
    },
    story: {
      title: "Notre Histoire",
      desc: "Fondé par des éducateurs et des parents, nous avons créé Eva pour rendre la littérature accessible."
    },
    why: {
      title: "Pourquoi les Livres Comptent",
      desc: "Lire avec Eva concerne l'ouverture de portes vers de nouveaux mondes et la création de souvenirs précieux."
    },
    values: {
      title: "Nos Valeurs",
      desc: "Narration de qualité, représentation inclusive, excellence éducative et accessibilité de la lecture."
    },
    authorNote: {
      title: "Une Note de l'Auteure",
      intro: "Ce livre pour enfants est une collection vivante d'histoires imaginatives de l'enfance de l'auteure, créée pour les enfants de 3 à 9 ans.",
      career: "Après une carrière de toute une vie dans la santé publique, l'auteure est maintenant une grand-mère à temps plein, s'occupant de deux petites-filles avec un appétit sans fin pour les histoires du soir.",
      inspiration: "Son inspiration vient des souvenirs d'enfance avec sa mère et sa tante.",
      purpose: "Ce livre, et la série à laquelle il appartient, est sa façon de transmettre des traditions et des leçons d'une époque avant les médias numériques.",
      motivation: "Sa motivation est simple: partager cette magie avec une nouvelle génération.",
      signature: "Eva Gallo",
      handle: "@StorytimeWithEvaGallo"
    }
  }
};

export default function About() {
  const [language, setLanguage] = React.useState('en');
  
  React.useEffect(() => {
    const checkLanguage = () => {
      // Ensure window is defined before accessing it (for SSR compatibility, though this component likely runs client-side)
      if (typeof window !== 'undefined' && window.currentLanguage) {
        setLanguage(window.currentLanguage);
      }
    };
    
    checkLanguage(); // Check language on initial mount
    
    // Listen for custom 'languagechange' event
    if (typeof window !== 'undefined') {
      window.addEventListener('languagechange', checkLanguage);
    }
    
    // Clean up event listener on component unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('languagechange', checkLanguage);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount
  
  const t = translations[language] || translations.en;

  const features = [
    {
      icon: BookOpen,
      title: t.story.title,
      description: t.story.desc,
      gradient: "from-purple-400 to-pink-400"
    },
    {
      icon: Heart,
      title: t.why.title,
      description: t.why.desc,
      gradient: "from-pink-400 to-red-400"
    },
    {
      icon: Users,
      title: t.mission.title,
      description: t.mission.desc,
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      icon: Sparkles,
      title: t.values.title,
      description: t.values.desc,
      gradient: "from-yellow-400 to-orange-400"
    }
  ];

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t.title}
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Hero Image Section */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4">🐾</div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t.mission.desc}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Author Note Section */}
        <div className="mb-20">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />
            <CardContent className="p-12">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
                  <Feather className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
                {t.authorNote.title}
              </h2>
              
              <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="text-xl font-medium text-purple-700">
                  {t.authorNote.intro}
                </p>
                
                <p>
                  {t.authorNote.career}
                </p>
                
                <p>
                  {t.authorNote.inspiration}
                </p>
                
                <p>
                  {t.authorNote.purpose}
                </p>
                
                <p className="font-semibold text-gray-900">
                  {t.authorNote.motivation}
                </p>
                
                <div className="pt-8 text-center">
                  <p className="text-2xl font-bold text-purple-700 mb-2">
                    {t.authorNote.signature}
                  </p>
                  <p className="text-lg text-gray-600">
                    {t.authorNote.handle}
                  </p>
                  <div className="flex justify-center gap-4 mt-6">
                    <span className="text-4xl">📚</span>
                    <span className="text-4xl">💜</span>
                    <span className="text-4xl">✨</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Newsletter Section */}
        <div className="mb-12">
          <NewsletterSignup language={language} />
        </div>
      </div>
    </div>
  );
}
