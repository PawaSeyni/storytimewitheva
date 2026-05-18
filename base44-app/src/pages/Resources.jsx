
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Lightbulb, 
  Star, 
  Search,
  TrendingUp,
  Heart,
  Brain,
  Palette,
  Clock,
  ExternalLink
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { createPageUrl } from "@/utils";

const translations = {
  en: {
    title: "Parent Resources & Guides",
    subtitle: "Expert tips, activities, and strategies to make reading time magical",
    search: "Search resources...",
    categories: {
      readingTips: "Reading Tips",
      activities: "Activity Ideas",
      development: "Child Development",
      engagement: "Building Engagement"
    },
    readTime: "min read",
    popular: "Popular",
    new: "New",
    resources: [
      {
        id: 1,
        category: "readingTips",
        title: "10 Ways to Make Reading Time Magical",
        description: "Transform ordinary reading sessions into memorable adventures your child will love.",
        readTime: 5,
        icon: "✨",
        tips: [
          "Create a cozy reading nook with pillows and soft lighting",
          "Use different voices for different characters",
          "Ask open-ended questions about the story",
          "Let your child choose the books",
          "Make it a daily routine at the same time",
          "Act out parts of the story together",
          "Connect stories to real-life experiences",
          "Celebrate reading milestones with enthusiasm",
          "Keep books accessible and visible",
          "Be patient and let them set the pace"
        ]
      },
      {
        id: 2,
        category: "development",
        title: "Age-Appropriate Reading Milestones",
        description: "What to expect at each stage and how to support your child's literacy journey.",
        readTime: 8,
        icon: "📊",
        content: [
          {
            age: "3-5 Years",
            milestones: [
              "Recognizes familiar words and signs",
              "Can retell familiar stories",
              "Understands that print carries meaning",
              "Begins to recognize letters",
              "Enjoys rhyming games and songs"
            ]
          },
          {
            age: "6-8 Years",
            milestones: [
              "Reads simple books independently",
              "Recognizes common sight words",
              "Uses context clues for new words",
              "Begins to read with expression",
              "Can discuss story elements"
            ]
          },
          {
            age: "9+ Years",
            milestones: [
              "Reads chapter books fluently",
              "Understands complex plots",
              "Makes inferences from text",
              "Develops reading preferences",
              "Can analyze and critique stories"
            ]
          }
        ]
      },
      {
        id: 3,
        category: "activities",
        title: "5 Creative Follow-Up Activities After Reading",
        description: "Extend the learning and fun beyond the last page with these engaging activities.",
        readTime: 6,
        icon: "🎨",
        activities: [
          {
            title: "Story Sequencing",
            description: "Draw or write the beginning, middle, and end of the story in order."
          },
          {
            title: "Character Interviews",
            description: "Pretend to interview a character from the book with your child."
          },
          {
            title: "Alternative Endings",
            description: "Imagine and discuss different ways the story could have ended."
          },
          {
            title: "Book-Inspired Art",
            description: "Create drawings, paintings, or crafts inspired by the story."
          },
          {
            title: "Real-World Connections",
            description: "Find real-life examples of themes or lessons from the book."
          }
        ]
      },
      {
        id: 4,
        category: "engagement",
        title: "Building a Love for Reading in Reluctant Readers",
        description: "Practical strategies to help children who resist reading discover the joy of books.",
        readTime: 7,
        icon: "💪",
        strategies: [
          "Start with topics they're passionate about",
          "Try different formats: comics, magazines, audiobooks",
          "Read together without pressure to finish",
          "Create a reward system for reading time",
          "Visit the library regularly as a fun outing",
          "Model reading behavior yourself",
          "Don't force difficult books - let them choose",
          "Make connections to their favorite shows/games",
          "Celebrate small wins and progress"
        ]
      },
      {
        id: 5,
        category: "readingTips",
        title: "Creating the Perfect Reading Environment",
        description: "Design a space that makes your child excited to pick up a book.",
        readTime: 4,
        icon: "🏠",
        elements: [
          "Good lighting (natural light preferred)",
          "Comfortable seating (bean bags, cushions)",
          "Book display at child's eye level",
          "Minimal distractions (quiet, away from screens)",
          "Personal touches (their artwork, favorite colors)",
          "Variety of genres and formats",
          "Reading buddy (stuffed animal or pet)",
          "Timer for focused reading sessions"
        ]
      },
      {
        id: 6,
        category: "development",
        title: "The Science of Reading: What Parents Need to Know",
        description: "Understanding how children learn to read can help you support them better.",
        readTime: 10,
        icon: "🧠",
        keyPoints: [
          "Phonemic awareness is foundational",
          "Reading is not a natural process - it must be taught",
          "Fluency develops with practice and repetition",
          "Vocabulary exposure matters immensely",
          "Comprehension strategies can be explicitly taught",
          "Reading aloud accelerates development",
          "Every child learns at their own pace",
          "Early intervention makes a huge difference"
        ]
      }
    ]
  },
  es: {
    title: "Recursos y Guías para Padres",
    subtitle: "Consejos expertos, actividades y estrategias para hacer la lectura mágica",
    search: "Buscar recursos...",
    categories: {
      readingTips: "Consejos de Lectura",
      activities: "Ideas de Actividades",
      development: "Desarrollo Infantil",
      engagement: "Construir Compromiso"
    },
    readTime: "min de lectura",
    popular: "Popular",
    new: "Nuevo",
    resources: [
      {
        id: 1,
        category: "readingTips",
        title: "10 Formas de Hacer que la Hora de Lectura Sea Mágica",
        description: "Transforma sesiones de lectura ordinarias en aventuras memorables que tu hijo adorará.",
        readTime: 5,
        icon: "✨",
        tips: [
          "Crea un rincón acogedor de lectura con almohadas e iluminación suave",
          "Usa diferentes voces para diferentes personajes",
          "Haz preguntas abiertas sobre la historia",
          "Deja que tu hijo elija los libros",
          "Hazlo una rutina diaria a la misma hora",
          "Representa partes de la historia juntos",
          "Conecta las historias con experiencias de la vida real",
          "Celebra los hitos de lectura con entusiasmo",
          "Mantén los libros accesibles y visibles",
          "Sé paciente y deja que ellos marquen el ritmo"
        ]
      },
      {
        id: 2,
        category: "development",
        title: "Hitos de Lectura Apropiados para Cada Edad",
        description: "Qué esperar en cada etapa y cómo apoyar el viaje de alfabetización de tu hijo.",
        readTime: 8,
        icon: "📊",
        content: [
          {
            age: "3-5 Años",
            milestones: [
              "Reconoce palabras y señales familiares",
              "Puede volver a contar historias familiares",
              "Entiende que la escritura tiene significado",
              "Comienza a reconocer letras",
              "Disfruta de juegos y canciones con rimas"
            ]
          },
          {
            age: "6-8 Años",
            milestones: [
              "Lee libros simples de forma independiente",
              "Reconoce palabras comunes de uso frecuente",
              "Usa pistas del contexto para nuevas palabras",
              "Comienza a leer con expresión",
              "Puede discutir elementos de la historia"
            ]
          },
          {
            age: "9+ Años",
            milestones: [
              "Lee libros por capítulos con fluidez",
              "Entiende tramas complejas",
              "Hace inferencias del texto",
              "Desarrolla preferencias de lectura",
              "Puede analizar y criticar historias"
            ]
          }
        ]
      },
      {
        id: 3,
        category: "activities",
        title: "5 Actividades Creativas de Seguimiento Después de Leer",
        description: "Extiende el aprendizaje y la diversión más allá de la última página con estas actividades.",
        readTime: 6,
        icon: "🎨",
        activities: [
          {
            title: "Secuenciación de la Historia",
            description: "Dibuja o escribe el principio, medio y final de la historia en orden."
          },
          {
            title: "Entrevistas a Personajes",
            description: "Finge entrevistar a un personaje del libro con tu hijo."
          },
          {
            title: "Finales Alternativos",
            description: "Imagina y discute diferentes formas en que la historia podría haber terminado."
          },
          {
            title: "Arte Inspirado en el Libro",
            description: "Crea dibujos, pinturas o manualidades inspiradas en la historia."
          },
          {
            title: "Conexiones con el Mundo Real",
            description: "Encuentra ejemplos de la vida real de temas o lecciones del libro."
          }
        ]
      },
      {
        id: 4,
        category: "engagement",
        title: "Construir el Amor por la Lectura en Lectores Reacios",
        description: "Estrategias prácticas para ayudar a los niños que resisten la lectura a descubrir la alegría de los libros.",
        readTime: 7,
        icon: "💪",
        strategies: [
          "Comienza con temas que les apasionen",
          "Prueba diferentes formatos: cómics, revistas, audiolibros",
          "Lee juntos sin presión para terminar",
          "Crea un sistema de recompensas por tiempo de lectura",
          "Visita la biblioteca regularmente como una salida divertida",
          "Modela el comportamiento de lectura tú mismo",
          "No fuerces libros difíciles - déjalos elegir",
          "Haz conexiones con sus programas/juegos favoritos",
          "Celebra pequeños logros y progreso"
        ]
      },
      {
        id: 5,
        category: "readingTips",
        title: "Crear el Ambiente Perfecto para Leer",
        description: "Diseña un espacio que haga que tu hijo se emocione por tomar un libro.",
        readTime: 4,
        icon: "🏠",
        elements: [
          "Buena iluminación (luz natural preferida)",
          "Asientos cómodos (puffs, cojines)",
          "Exhibición de libros a la altura de los ojos del niño",
          "Mínimas distracciones (tranquilo, lejos de pantallas)",
          "Toques personales (su arte, colores favoritos)",
          "Variedad de géneros y formatos",
          "Compañero de lectura (animal de peluche o mascota)",
          "Temporizador para sesiones de lectura enfocadas"
        ]
      },
      {
        id: 6,
        category: "development",
        title: "La Ciencia de la Lectura: Lo que los Padres Necesitan Saber",
        description: "Entender cómo los niños aprenden a leer puede ayudarte a apoyarlos mejor.",
        readTime: 10,
        icon: "🧠",
        keyPoints: [
          "La conciencia fonémica es fundamental",
          "La lectura no es un proceso natural - debe ser enseñada",
          "La fluidez se desarrolla con práctica y repetición",
          "La exposición al vocabulario importa inmensamente",
          "Las estrategias de comprensión pueden enseñarse explícitamente",
          "Leer en voz alta acelera el desarrollo",
          "Cada niño aprende a su propio ritmo",
          "La intervención temprana hace una gran diferencia"
        ]
      }
    ]
  },
  fr: {
    title: "Ressources et Guides pour Parents",
    subtitle: "Conseils d'experts, activités et stratégies pour rendre la lecture magique",
    search: "Rechercher des ressources...",
    categories: {
      readingTips: "Conseils de Lecture",
      activities: "Idées d'Activités",
      development: "Développement de l'Enfant",
      engagement: "Engagement"
    },
    readTime: "min de lecture",
    popular: "Populaire",
    new: "Nouveau",
    resources: [
      {
        id: 1,
        category: "readingTips",
        title: "10 Façons de Rendre l'Heure de Lecture Magique",
        description: "Transformez des séances de lecture ordinaires en aventures mémorables que votre enfant adorera.",
        readTime: 5,
        icon: "✨",
        tips: [
          "Créez un coin lecture confortable avec des oreillers et un éclairage doux",
          "Utilisez des voix différentes pour différents personnages",
          "Posez des questions ouvertes sur l'histoire",
          "Laissez votre enfant choisir les livres",
          "Faites-en une routine quotidienne à la même heure",
          "Jouez des parties de l'histoire ensemble",
          "Connectez les histoires aux expériences de la vie réelle",
          "Célébrez les étapes de lecture avec enthousiasme",
          "Gardez les livres accessibles et visibles",
          "Soyez patient et laissez-les définir le rythme"
        ]
      },
      {
        id: 2,
        category: "development",
        title: "Jalons de Lecture Appropriés à l'Âge",
        description: "Ce à quoi s'attendre à chaque étape et comment soutenir le parcours d'alphabétisation de votre enfant.",
        readTime: 8,
        icon: "📊",
        content: [
          {
            age: "3-5 Ans",
            milestones: [
              "Reconnaît les mots et signes familiers",
              "Peut raconter des histoires familières",
              "Comprend que l'écrit véhicule un sens",
              "Commence à reconnaître les lettres",
              "Apprécie les jeux et chansons avec des rimes"
            ]
          },
          {
            age: "6-8 Ans",
            milestones: [
              "Lit des livres simples de manière indépendante",
              "Reconnaît les mots courants fréquemment utilisés",
              "Utilise des indices contextuels pour de nouveaux mots",
              "Commence à lire avec expression",
              "Peut discuter des éléments de l'histoire"
            ]
          },
          {
            age: "9+ Ans",
            milestones: [
              "Lit des livres à chapitres couramment",
              "Comprend des intrigues complexes",
              "Fait des inférences à partir du texte",
              "Développe des préférences de lecture",
              "Peut analyser et critiquer des histoires"
            ]
          }
        ]
      },
      {
        id: 3,
        category: "activities",
        title: "5 Activités Créatives de Suivi Après la Lecture",
        description: "Prolongez l'apprentissage et le plaisir au-delà de la dernière page avec ces activités engageantes.",
        readTime: 6,
        icon: "🎨",
        activities: [
          {
            title: "Séquençage de l'Histoire",
            description: "Dessinez ou écrivez le début, le milieu et la fin de l'histoire dans l'ordre."
          },
          {
            title: "Interviews de Personnages",
            description: "Faites semblant d'interviewer un personnage du livre avec votre enfant."
          },
          {
            title: "Fins Alternatives",
            description: "Imaginez et discutez différentes façons dont l'histoire aurait pu se terminer."
          },
          {
            title: "Art Inspiré du Livre",
            description: "Créez des dessins, peintures ou manualidades inspirées de l'histoire."
          },
          {
            title: "Connexions avec le Monde Réel",
            description: "Trouvez des exemples réels de thèmes ou leçons du livre."
          }
        ]
      },
      {
        id: 4,
        category: "engagement",
        title: "Construire l'Amour de la Lecture chez les Lecteurs Réticents",
        description: "Stratégies pratiques pour aider les enfants qui résistent à la lecture à découvrir la joie des livres.",
        readTime: 7,
        icon: "💪",
        strategies: [
          "Commencez avec des sujets qui les passionnent",
          "Essayez différents formats: bandes dessinées, magazines, livres audio",
          "Lisez ensemble sans pression pour finir",
          "Créez un système de récompenses pour le temps de lecture",
          "Visitez la bibliothèque régulièrement comme sortie amusante",
          "Modélisez le comportement de lecture vous-même",
          "Ne forcez pas les livres difficiles - laissez-les choisir",
          "Faites des connexions avec leurs émissions/jeux préférées",
          "Célébrez les petites victoires et les progrès"
        ]
      },
      {
        id: 5,
        category: "readingTips",
        title: "Créer l'Environnement de Lecture Parfait",
        description: "Concevez un espace qui donne à votre enfant envie de prendre un livre.",
        readTime: 4,
        icon: "🏠",
        elements: [
          "Bon éclairage (lumière naturelle préférée)",
          "Sièges confortables (poufs, coussins)",
          "Affichage de livres à hauteur des yeux de l'enfant",
          "Distractions minimales (calme, loin des écrans)",
          "Touches personnelles (leur art, couleurs préférées)",
          "Variété de genres et formats",
          "Compagnon de lecture (peluche ou animal de compagnie)",
          "Minuteur pour séances de lecture ciblées"
        ]
      },
      {
        id: 6,
        category: "development",
        title: "La Science de la Lecture: Ce que les Parents Doivent Savoir",
        description: "Comprendre comment les enfants apprennent à lire peut vous aider à mieux les soutenir.",
        readTime: 10,
        icon: "🧠",
        keyPoints: [
          "La conscience phonémique est fondamentale",
          "La lecture n'est pas un processus naturel - elle doit être enseignée",
          "La fluidité se développe avec la pratique et la répétition",
          "L'exposition au vocabulaire compte énormément",
          "Les stratégies de compréhension peuvent être enseignées explicitement",
          "La lecture à voix haute accélère le développement",
          "Chaque enfant apprend à son propre rythme",
          "L'intervention précoce fait une énorme différence"
        ]
      }
    ]
  }
};

const categoryIcons = {
  readingTips: BookOpen,
  activities: Palette,
  development: TrendingUp,
  engagement: Heart
};

const categoryColors = {
  readingTips: "bg-blue-100 text-blue-800 border-blue-300",
  activities: "bg-green-100 text-green-800 border-green-300",
  development: "bg-purple-100 text-purple-800 border-purple-300",
  engagement: "bg-orange-100 text-orange-800 border-orange-300"
};

export default function Resources() {
  const [language, setLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedResource, setSelectedResource] = useState(null);

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

  const filteredResources = t.resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const breadcrumbItems = [
    { label: "Resources", href: createPageUrl("Resources") }
  ];

  return (
    <div className="min-h-screen py-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📚</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t.title}
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Compact Search */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-4 text-base rounded-full border-2 border-gray-200 focus:border-purple-400"
            />
          </div>
        </div>

        {/* Compact Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            onClick={() => setSelectedCategory("all")}
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={`text-sm ${selectedCategory === "all" ? "bg-purple-500 text-white" : ""}`}
          >
            All Resources
          </Button>
          {Object.entries(t.categories).map(([key, label]) => {
            const Icon = categoryIcons[key];
            return (
              <Button
                key={key}
                onClick={() => setSelectedCategory(key)}
                variant={selectedCategory === key ? "default" : "outline"}
                className={`text-sm ${selectedCategory === key ? "bg-purple-500 text-white" : ""}`}
              >
                <Icon className="w-3 h-3 mr-1.5" />
                {label}
              </Button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource, index) => {
            const Icon = categoryIcons[resource.category];
            return (
              <Card 
                key={resource.id}
                className="hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-lg"
                onClick={() => setSelectedResource(resource)}
              >
                <div className={`h-2 ${categoryColors[resource.category].replace('text', 'bg').split(' ')[0]}`} />
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-5xl">{resource.icon}</div>
                    <Badge className={`${categoryColors[resource.category]} border`}>
                      {t.categories[resource.category]}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{resource.readTime} {t.readTime}</span>
                    </div>
                    {index < 2 && (
                      <Badge className="bg-orange-100 text-orange-800">
                        {t.popular}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedResource && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in-0"
            onClick={() => setSelectedResource(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 z-10">
                <button
                  onClick={() => setSelectedResource(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
                <div className="text-6xl mb-4">{selectedResource.icon}</div>
                <h2 className="text-3xl font-bold mb-2">{selectedResource.title}</h2>
                <p className="text-lg opacity-90">{selectedResource.description}</p>
              </div>

              <div className="p-8">
                {selectedResource.tips && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Tips & Strategies</h3>
                    <div className="space-y-4">
                      {selectedResource.tips.map((tip, index) => (
                        <div key={index} className="flex gap-4 items-start bg-purple-50 p-4 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedResource.content && (
                  <div className="space-y-8">
                    {selectedResource.content.map((section, index) => (
                      <div key={index} className="bg-blue-50 p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-4 text-blue-900">{section.age}</h3>
                        <ul className="space-y-3">
                          {section.milestones.map((milestone, mIndex) => (
                            <li key={mIndex} className="flex items-start gap-3">
                              <Star className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{milestone}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedResource.activities && (
                  <div className="space-y-6">
                    {selectedResource.activities.map((activity, index) => (
                      <div key={index} className="bg-green-50 p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-2 text-green-900">{activity.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedResource.strategies && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Strategies That Work</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedResource.strategies.map((strategy, index) => (
                        <div key={index} className="flex gap-3 items-start bg-orange-50 p-4 rounded-lg">
                          <Heart className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700">{strategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedResource.elements && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Essential Elements</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedResource.elements.map((element, index) => (
                        <div key={index} className="flex gap-3 items-start bg-blue-50 p-4 rounded-lg">
                          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700">{element}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedResource.keyPoints && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Key Takeaways</h3>
                    <div className="space-y-3">
                      {selectedResource.keyPoints.map((point, index) => (
                        <div key={index} className="flex gap-3 items-start bg-purple-50 p-4 rounded-lg">
                          <Brain className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
