// Eva Gallo Collection — published books in the imprint.
//
// Each book carries localized title/subtitle/description/theme. The 3 newer
// titles (Colors Mixed Up, Rainbow Symphony, Tower) have official KDP-published
// French translations; Spanish is in production so we provide good drafts.
// The 8 Amazon-live titles keep their English titles (brand) but have
// translated descriptions, subtitles, and themes.

import { useLanguage, type Language } from '../lib/language';
import colorsMixedUp from '../assets/covers/colors-mixed-up.jpg';
import rainbowSymphony from '../assets/covers/rainbow-symphony.jpg';
import towerTouchedSky from '../assets/covers/tower-touched-sky.jpg';

type LocalizedString = Record<Language, string>;

export interface Book {
  id: string;
  coverImage: string;
  ageRange: string;
  languages: string[];
  amazonUrl: string;
  featured?: boolean;
  title: LocalizedString;
  subtitle?: LocalizedString;
  description: LocalizedString;
  theme: LocalizedString;
}

export interface LocalizedBook {
  id: string;
  coverImage: string;
  ageRange: string;
  languages: string[];
  amazonUrl: string;
  featured?: boolean;
  title: string;
  subtitle?: string;
  description: string;
  theme: string;
}

const AUTHOR_URL = 'https://www.amazon.com/author/evagallo';
const dp = (asin: string) => `https://www.amazon.com/dp/${asin}`;

export const books: Book[] = [
  // ---- 3 newer titles in production ----
  {
    id: 'colors-mixed-up',
    coverImage: colorsMixedUp,
    ageRange: '4-7 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    amazonUrl: AUTHOR_URL,
    featured: true,
    title: {
      en: 'The Day the Colors Got Mixed Up',
      es: 'El día que se mezclaron los colores',
      fr: 'Le jour où les couleurs se sont mélangées',
    },
    subtitle: {
      en: 'A Color Theory Adventure with Pixel and Hawel',
      es: 'Una aventura de la teoría del color con Pixel y Hawel',
      fr: 'Une aventure des couleurs avec Pixel et Hawel',
    },
    description: {
      en: "Hawel wakes to find every color in the world swapped — banana blue, toast purple, sky doing something it shouldn't. With Pixel the butterfly, she sets off to find the Color Keeper and learn how red, yellow, and blue make every other color. A gentle first lesson in color theory.",
      es: 'Hawel despierta y descubre que todos los colores del mundo se han cambiado: el plátano es azul, la tostada morada y el cielo está haciendo algo raro. Con Pixel la mariposa, sale a buscar al Guardián de los Colores y a aprender cómo el rojo, el amarillo y el azul forman todos los demás colores. Una primera lección suave sobre teoría del color.',
      fr: "Hawel se réveille et découvre que toutes les couleurs du monde ont été échangées — la banane est bleue, le pain grillé violet et le ciel fait quelque chose qu'il ne devrait pas. Avec Pixel le papillon, elle part chercher la Gardienne des Couleurs et apprendre comment le rouge, le jaune et le bleu composent toutes les autres couleurs. Une douce première leçon de théorie des couleurs.",
    },
    theme: {
      en: 'Color theory and curiosity',
      es: 'Teoría del color y curiosidad',
      fr: 'Théorie des couleurs et curiosité',
    },
  },
  {
    id: 'rainbow-symphony',
    coverImage: rainbowSymphony,
    ageRange: '3-6 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    amazonUrl: AUTHOR_URL,
    featured: true,
    title: {
      en: 'The Rainbow Symphony',
      es: 'La sinfonía del arcoíris',
      fr: "La symphonie de l'arc-en-ciel",
    },
    subtitle: {
      en: 'A Picture Book About Voices Joining Together',
      es: 'Un álbum sobre voces que se unen',
      fr: 'Un album sur les voix qui se rejoignent',
    },
    description: {
      en: 'In the village of Harmonia, every color sings its own song. When the colors argue about whose song is best, the music breaks apart — and only Pawa, a small glowing light who loves them all, can remind them how the symphony really works.',
      es: 'En el pueblo de Harmonía, cada color canta su propia canción. Cuando los colores se pelean por quién canta mejor, la música se rompe — y solo Pawa, una pequeña luz brillante que los quiere a todos, puede recordarles cómo funciona la verdadera sinfonía.',
      fr: "Dans le village d'Harmonia, chaque couleur chante sa propre chanson. Quand les couleurs se disputent pour savoir quelle chanson est la meilleure, la musique se brise — et seule Pawa, une petite lumière qui les aime toutes, peut leur rappeler comment fonctionne vraiment la symphonie.",
    },
    theme: {
      en: 'Diversity and harmony',
      es: 'Diversidad y armonía',
      fr: 'Diversité et harmonie',
    },
  },
  {
    id: 'tower-touched-sky',
    coverImage: towerTouchedSky,
    ageRange: '5-9 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    amazonUrl: AUTHOR_URL,
    title: {
      en: 'The Tower That Touched the Sky',
      es: 'La torre que tocó el cielo',
      fr: 'La tour qui touchait le ciel',
    },
    subtitle: {
      en: 'A Story About Humility, Listening, and True Brilliance',
      es: 'Una historia sobre humildad, escucha y la verdadera brillantez',
      fr: "Une histoire d'humilité, d'écoute et de véritable brillance",
    },
    description: {
      en: 'Architect Victor Mercer designs the tallest tower ever conceived. Only one junior engineer raises a hand he never sees. When the dust settles, Victor learns how to design with questions rather than certainty.',
      es: 'El arquitecto Victor Mercer diseña la torre más alta jamás concebida. Solo una joven ingeniera levanta una mano que él nunca ve. Cuando el polvo se asienta, Victor aprende a diseñar con preguntas en lugar de certezas.',
      fr: "L'architecte Victor Mercer conçoit la tour la plus haute jamais imaginée. Une seule jeune ingénieure lève une main qu'il ne voit jamais. Quand la poussière retombe, Victor apprend à concevoir avec des questions plutôt qu'avec des certitudes.",
    },
    theme: {
      en: 'Humility and listening',
      es: 'Humildad y escucha',
      fr: 'Humilité et écoute',
    },
  },

  // ---- 8 titles live on Amazon ----
  {
    id: 'mayas-shadow',
    coverImage: 'https://m.media-amazon.com/images/I/619qWXXkRwL.jpg',
    ageRange: '3-7 years',
    languages: ['🇺🇸'],
    amazonUrl: dp('1996972812'),
    featured: true,
    title: {
      en: "The Adventures of Maya's Shadow",
      es: 'Las aventuras de la sombra de Maya',
      fr: "Les aventures de l'ombre de Maya",
    },
    subtitle: {
      en: 'A Story of Nighttime Wonder and Quiet Magic',
      es: 'Una historia de asombro nocturno y magia tranquila',
      fr: "Une histoire d'émerveillement nocturne et de magie tranquille",
    },
    description: {
      en: 'Every night when Maya goes to bed, something magical happens. While Maya sleeps and dreams, her shadow wakes up and slips out the door for adventures of its own. The imprint flagship — quiet wonder, nighttime magic, and morning homecoming.',
      es: 'Cada noche, cuando Maya se va a la cama, ocurre algo mágico. Mientras Maya duerme y sueña, su sombra despierta y se escapa por la puerta hacia aventuras propias. El libro insignia de la colección: asombro tranquilo, magia nocturna y un regreso a casa al amanecer.',
      fr: "Chaque soir, quand Maya va se coucher, quelque chose de magique se produit. Pendant que Maya dort et rêve, son ombre se réveille et se glisse dehors pour vivre ses propres aventures. Le titre phare de la collection — émerveillement tranquille, magie nocturne et retour à la maison au petit matin.",
    },
    theme: {
      en: 'Wonder and imagination',
      es: 'Asombro e imaginación',
      fr: 'Émerveillement et imagination',
    },
  },
  {
    id: 'sparrow-saved-forest',
    coverImage: 'https://m.media-amazon.com/images/I/61+OZTchcCL.jpg',
    ageRange: '4-8 years',
    languages: ['🇺🇸'],
    amazonUrl: dp('1996972685'),
    title: {
      en: 'The Sparrow Who Saved the Forest',
      es: 'El gorrión que salvó el bosque',
      fr: 'Le moineau qui sauva la forêt',
    },
    subtitle: {
      en: 'A Story About Kindness to the Small',
      es: 'Una historia sobre la bondad hacia los más pequeños',
      fr: 'Une histoire sur la bonté envers les plus petits',
    },
    description: {
      en: "When the forest is in trouble, the biggest animals don't notice. The smallest sparrow does. A gentle picture book about how the tiniest acts of kindness can change everything.",
      es: 'Cuando el bosque está en peligro, los animales más grandes no se dan cuenta. El gorrión más pequeño sí. Un álbum tierno sobre cómo los actos de bondad más pequeños pueden cambiarlo todo.',
      fr: "Quand la forêt est en difficulté, les plus grands animaux ne s'en aperçoivent pas. Le plus petit moineau, lui, le voit. Un album tendre sur la façon dont les plus petits gestes de bonté peuvent tout changer.",
    },
    theme: {
      en: 'Kindness and courage',
      es: 'Bondad y valentía',
      fr: 'Bonté et courage',
    },
  },
  {
    id: 'diegos-brave-leap',
    coverImage: 'https://m.media-amazon.com/images/I/71XLCAup1CL.jpg',
    ageRange: '4-8 years',
    languages: ['🇺🇸'],
    amazonUrl: dp('1996972863'),
    title: {
      en: "Diego's Brave Leap",
      es: 'El salto valiente de Diego',
      fr: 'Le saut courageux de Diego',
    },
    subtitle: {
      en: 'A Story About Courage and Chasing Your Dreams',
      es: 'Una historia sobre el valor y perseguir tus sueños',
      fr: 'Une histoire de courage et de poursuite des rêves',
    },
    description: {
      en: "On a sun-warmed cliff above the Mediterranean, Diego stands at the edge. Everyone is watching. The water is far below. A back-to-school picture book about the kind of bravery that doesn't feel brave from the inside.",
      es: 'En un acantilado iluminado por el sol sobre el Mediterráneo, Diego está al borde. Todos miran. El agua está muy abajo. Un álbum de regreso a clases sobre el tipo de valentía que no se siente valiente desde dentro.',
      fr: "Sur une falaise baignée de soleil au-dessus de la Méditerranée, Diego se tient au bord. Tout le monde regarde. L'eau est loin en dessous. Un album de rentrée sur le genre de courage qui ne se sent pas courageux de l'intérieur.",
    },
    theme: {
      en: 'Courage and self-trust',
      es: 'Valor y confianza en uno mismo',
      fr: 'Courage et confiance en soi',
    },
  },
  {
    id: 'butterfly-effect',
    coverImage: 'https://m.media-amazon.com/images/I/71Ihs65rZFL.jpg',
    ageRange: '5-9 years',
    languages: ['🇺🇸'],
    amazonUrl: dp('1996972774'),
    title: {
      en: 'The Butterfly Effect',
      es: 'El efecto mariposa',
      fr: "L'effet papillon",
    },
    subtitle: {
      en: 'A Story About Kindness and What It Grows',
      es: 'Una historia sobre la bondad y lo que hace florecer',
      fr: 'Une histoire sur la bonté et ce qu\'elle fait germer',
    },
    description: {
      en: 'One small kind thing turns into another, and another, and another, until a whole community is changed. A picture book about how kindness travels in ways we don\'t always see.',
      es: 'Un pequeño gesto amable se convierte en otro, y otro, y otro, hasta que una comunidad entera cambia. Un álbum sobre cómo la bondad viaja por caminos que no siempre vemos.',
      fr: "Un petit geste de bonté en entraîne un autre, puis un autre, jusqu'à transformer toute une communauté. Un album sur la façon dont la bonté voyage par des chemins que l'on ne voit pas toujours.",
    },
    theme: {
      en: 'Kindness and ripple effects',
      es: 'Bondad y efectos en cadena',
      fr: 'Bonté et effets en chaîne',
    },
  },
  {
    id: 'emperors-true-treasure',
    coverImage: 'https://m.media-amazon.com/images/I/714jyt2r6TL.jpg',
    ageRange: '5-9 years',
    languages: ['🇺🇸'],
    amazonUrl: dp('199697274X'),
    title: {
      en: "The Emperor's True Treasure",
      es: 'El verdadero tesoro del emperador',
      fr: "Le vrai trésor de l'empereur",
    },
    subtitle: {
      en: 'A Quiet Lesson in Gratitude',
      es: 'Una lección tranquila de gratitud',
      fr: 'Une leçon tranquille sur la gratitude',
    },
    description: {
      en: 'An emperor with a palace full of gold cannot understand why he feels so empty. The villagers, who have almost nothing, seem to have everything that matters. A picture book about where richness actually lives.',
      es: 'Un emperador con un palacio lleno de oro no entiende por qué se siente tan vacío. Los aldeanos, que casi no tienen nada, parecen tener todo lo que importa. Un álbum sobre dónde vive de verdad la riqueza.',
      fr: "Un empereur dont le palais regorge d'or ne comprend pas pourquoi il se sent si vide. Les villageois, qui n'ont presque rien, semblent avoir tout ce qui compte. Un album sur l'endroit où vit vraiment la richesse.",
    },
    theme: {
      en: 'Gratitude and perspective',
      es: 'Gratitud y perspectiva',
      fr: 'Gratitude et perspective',
    },
  },
  {
    id: 'crooked-little-apple-tree',
    coverImage: 'https://m.media-amazon.com/images/I/713GxuodwVL.jpg',
    ageRange: '4-8 years',
    languages: ['🇺🇸'],
    amazonUrl: dp('1996972715'),
    title: {
      en: 'The Crooked Little Apple Tree',
      es: 'El manzanito torcido',
      fr: 'Le petit pommier tordu',
    },
    subtitle: {
      en: 'A Story About Worth, Beauty, and Second Chances',
      es: 'Una historia sobre valor, belleza y segundas oportunidades',
      fr: 'Une histoire sur la valeur, la beauté et les secondes chances',
    },
    description: {
      en: 'The orchard wants only straight, perfect trees. The crooked little apple tree at the edge has been overlooked for years. Until the year someone really looks. A tender story about how worth is seen.',
      es: 'En el huerto solo quieren árboles rectos y perfectos. Al manzanito torcido del borde llevan años sin verlo. Hasta el año en que alguien lo mira de verdad. Una historia tierna sobre cómo se reconoce el valor.',
      fr: "Le verger ne veut que des arbres droits et parfaits. Le petit pommier tordu au bord est resté invisible pendant des années. Jusqu'à l'année où quelqu'un le regarde vraiment. Une histoire tendre sur la manière dont la valeur se voit.",
    },
    theme: {
      en: 'Worth and being seen',
      es: 'Valor propio y ser visto',
      fr: "Valeur et le fait d'être vu",
    },
  },
  {
    id: 'true-beauty-meadowbrook',
    coverImage: 'https://m.media-amazon.com/images/I/712M0yodc0L.jpg',
    ageRange: '4-8 years',
    languages: ['🇺🇸'],
    amazonUrl: dp('1996972650'),
    title: {
      en: 'The True Beauty of Meadowbrook',
      es: 'La verdadera belleza de Meadowbrook',
      fr: 'La vraie beauté de Meadowbrook',
    },
    subtitle: {
      en: 'A Tale of Kindness That Shines Brighter',
      es: 'Un cuento sobre la bondad que brilla más fuerte',
      fr: 'Un conte sur la bonté qui brille plus fort',
    },
    description: {
      en: 'In a town where everyone competes to look the most beautiful, a quiet girl figures out a different way to shine. A picture book about kindness as the kind of beauty that lasts.',
      es: 'En un pueblo donde todos compiten por ser los más bellos, una niña tranquila descubre otra forma de brillar. Un álbum sobre la bondad como esa belleza que perdura.',
      fr: 'Dans une ville où chacun rivalise pour être le plus beau, une fille discrète découvre une autre façon de briller. Un album sur la bonté comme cette beauté qui dure.',
    },
    theme: {
      en: 'Inner beauty and kindness',
      es: 'Belleza interior y bondad',
      fr: 'Beauté intérieure et bonté',
    },
  },
  {
    id: 'sanding-block',
    coverImage: 'https://m.media-amazon.com/images/I/710y9Kd57tL.jpg',
    ageRange: '5-9 years',
    languages: ['🇺🇸'],
    amazonUrl: dp('1996972898'),
    title: {
      en: 'The Sanding Block',
      es: 'El bloque de lijar',
      fr: 'Le bloc à poncer',
    },
    subtitle: {
      en: "A Woodworker's Lesson in Patience",
      es: 'Una lección de paciencia de un carpintero',
      fr: "La leçon de patience d'un menuisier",
    },
    description: {
      en: 'A young boy wants to be a great woodworker today, right now. His grandfather hands him a sanding block. A picture book about the slow craft of becoming good at something, told in a sunlit workshop with shavings on the floor.',
      es: 'Un niño quiere ser un gran carpintero hoy, ya. Su abuelo le entrega un bloque de lijar. Un álbum sobre el oficio lento de llegar a ser bueno en algo, narrado en un taller iluminado por el sol con virutas en el suelo.',
      fr: "Un jeune garçon veut être un grand menuisier aujourd'hui, tout de suite. Son grand-père lui tend un bloc à poncer. Un album sur l'art patient de devenir bon en quelque chose, raconté dans un atelier ensoleillé aux copeaux de bois éparpillés au sol.",
    },
    theme: {
      en: 'Patience and craft',
      es: 'Paciencia y oficio',
      fr: 'Patience et savoir-faire',
    },
  },
];

function localize(book: Book, lang: Language): LocalizedBook {
  return {
    id: book.id,
    coverImage: book.coverImage,
    ageRange: book.ageRange,
    languages: book.languages,
    amazonUrl: book.amazonUrl,
    featured: book.featured,
    title: book.title[lang] ?? book.title.en,
    subtitle: book.subtitle ? (book.subtitle[lang] ?? book.subtitle.en) : undefined,
    description: book.description[lang] ?? book.description.en,
    theme: book.theme[lang] ?? book.theme.en,
  };
}

/** Returns all books localized for the current language. */
export function useBooks(): LocalizedBook[] {
  const { language } = useLanguage();
  return books.map((b) => localize(b, language));
}

/** Returns a single book localized for the current language, by id. */
export function useBook(id: string): LocalizedBook | undefined {
  const { language } = useLanguage();
  const found = books.find((b) => b.id === id);
  return found ? localize(found, language) : undefined;
}
