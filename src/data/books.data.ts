// Eva Gallo Collection — the catalog data, as a BROWSER-FREE module.
//
// This file is the single source of truth for book content and must import
// nothing that pulls in React, the DOM, or any asset. The only import is a
// type-only `Language`, which is erased at build time. That is what lets build
// scripts (sitemap generation, prerender route discovery, validation, inventory)
// load the real catalog via scripts/lib/catalog.mjs instead of regex-parsing this
// source — see docs/architecture/ARCHITECTURE_ALIGNMENT.md §5 and Sprint 3 S3-004.
//
// Runtime hooks (localize/useBooks) live in ./books.ts, which re-exports this.

import type { Language } from '../lib/language';

export type LocalizedString = Record<Language, string>;

/** One language's Amazon edition and cover art. */
export interface Edition {
  /** ASIN of this language's own Amazon product, if it has one. Absent → the Buy
   *  CTA for this language falls back to the English edition. */
  asin?: string;
  /** Cover image for this language (self-hosted path or absolute URL). Absent →
   *  falls back to the English cover. */
  cover?: string;
}

export interface Book {
  id: string;
  ageRange: string;
  /** Per-language Amazon edition + cover — the single source of truth for covers
   *  and Buy links. `en` is always present; `es`/`fr` appear only where that
   *  language has its own cover and/or its own Amazon product. localize() resolves
   *  the right one per language and falls back to `en`. */
  editions: { en: Edition } & Partial<Record<Language, Edition>>;
  featured?: boolean;
  /** Publication state. Absent/'published' = live with a Buy CTA; 'coming-soon' shows a placeholder. */
  status?: 'published' | 'coming-soon';
  title: LocalizedString;
  subtitle?: LocalizedString;
  description: LocalizedString;
  theme: LocalizedString;
}

/** Every book's page is presented in all three site languages (EN/ES/FR) with
 *  read-aloud and translated copy, so the card always shows all three flags,
 *  independent of which Amazon editions exist. */
export const ALL_LANGUAGES = ['🇺🇸', '🇪🇸', '🇫🇷'];

export const books: Book[] = [
  // ---- 3 newer titles in production ----
  {
    id: 'colors-mixed-up',
    ageRange: '4-7',
    editions: {
      en: { asin: '1997027038', cover: '/covers/colors-mixed-up-en.webp' },
      es: { asin: 'B0HHXNZ2YK', cover: '/covers/colors-mixed-up-es.webp' },
      fr: { asin: 'B0HHYVZBHH', cover: '/covers/colors-mixed-up-fr.webp' },
    },
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
      en: "Hawel wakes to find every color in the world swapped, banana blue, toast purple, sky doing something it shouldn't. With Pixel the butterfly, she sets off to find the Color Keeper and learn how red, yellow, and blue make every other color. A gentle first lesson in color theory.",
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
    ageRange: '3-6',
    editions: {
      en: { asin: '1997027003', cover: '/covers/rainbow-symphony-en.webp' },
      es: { asin: 'B0HHVDPBLD', cover: '/covers/rainbow-symphony-es.webp' },
      fr: { asin: 'B0HG5XPYTD', cover: '/covers/rainbow-symphony-fr.webp' },
    },
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
      en: 'In the village of Harmonia, every color sings its own song. When the colors argue about whose song is best, the music breaks apart, and only Pawa, a small glowing light who loves them all, can remind them how the symphony really works.',
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
    ageRange: '5-9',
    editions: {
      en: { asin: '1996972995', cover: '/covers/tower-touched-sky-en.webp' },
      es: { asin: 'B0HHW37V6W', cover: '/covers/tower-touched-sky-es.webp' },
      fr: { asin: 'B0HG3G7MNQ', cover: '/covers/tower-touched-sky-fr.webp' },
    },
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
    ageRange: '3-7',
    editions: {
      en: { asin: '1996972812', cover: '/covers/mayas-shadow-en.webp' },
      es: { asin: 'B0HHWPG3FS', cover: '/covers/mayas-shadow-es.webp' },
      fr: { asin: '1996972820', cover: '/covers/mayas-shadow-fr.webp' },
    },
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
      en: 'Every night when Maya goes to bed, something magical happens. While Maya sleeps and dreams, her shadow wakes up and slips out the door for adventures of its own. The imprint flagship, quiet wonder, nighttime magic, and morning homecoming.',
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
    ageRange: '4-8',
    editions: {
      en: { asin: '1996972685', cover: '/covers/sparrow-saved-forest-en.webp' },
      es: { asin: 'B0HHTJ3NYP', cover: '/covers/sparrow-saved-forest-es.webp' },
      fr: { asin: '1996972707', cover: '/covers/sparrow-saved-forest-fr.webp' },
    },
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
    ageRange: '4-8',
    editions: {
      en: { asin: '1996972863', cover: '/covers/diegos-brave-leap-en.webp' },
      es: { cover: '/covers/diegos-brave-leap-es.webp' },
      fr: { asin: '199697288X', cover: '/covers/diegos-brave-leap-fr.webp' },
    },
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
    ageRange: '5-9',
    editions: {
      en: { asin: '1996972774', cover: '/covers/butterfly-effect-en.webp' },
      es: { asin: 'B0HH8KM4SX', cover: '/covers/butterfly-effect-es.webp' },
      fr: { asin: '1996972790', cover: '/covers/butterfly-effect-fr.webp' },
    },
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
    ageRange: '5-9',
    editions: {
      en: { asin: '199697274X', cover: '/covers/emperors-true-treasure-en.webp' },
      es: { asin: 'B0HHV9S5B5', cover: '/covers/emperors-true-treasure-es.webp' },
      fr: { cover: '/covers/emperors-true-treasure-fr.webp' },
    },
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
    ageRange: '4-8',
    editions: {
      en: { asin: '1996972715', cover: '/covers/crooked-little-apple-tree-en.webp' },
      es: { asin: 'B0HHT9PY5B', cover: '/covers/crooked-little-apple-tree-es.webp' },
      fr: { asin: '1996972731', cover: '/covers/crooked-little-apple-tree-fr.webp' },
    },
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
    ageRange: '4-8',
    editions: {
      en: { asin: '1996972650', cover: '/covers/true-beauty-meadowbrook-en.webp' },
      es: { asin: 'B0HHW3BG4K', cover: '/covers/true-beauty-meadowbrook-es.webp' },
      fr: { asin: '1996972677', cover: '/covers/true-beauty-meadowbrook-fr.webp' },
    },
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
    ageRange: '5-9',
    editions: {
      en: { asin: '1996972898', cover: '/covers/sanding-block-en.webp' },
      es: { cover: '/covers/sanding-block-es.webp' },
      fr: { asin: '199697291X', cover: '/covers/sanding-block-fr.webp' },
    },
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

  // ---- 7 newer titles, added 2026-05-29 ----
  {
    id: 'leo-and-the-wolf',
    ageRange: '4-8',
    editions: {
      en: { asin: '1997027054', cover: '/covers/leo-and-the-wolf-en.webp' },
      es: { asin: 'B0H6N6ZBRL', cover: '/covers/leo-and-the-wolf-es.webp' },
      fr: { asin: 'B0HFCPRBVL', cover: '/covers/leo-and-the-wolf-fr.webp' },
    },
    title: {
      en: 'Leo and the Wolf',
      es: 'Leo y el lobo',
      fr: 'Léo et le loup',
    },
    subtitle: {
      en: 'A Timeless Illustrated Fable About Honesty, Trust, and Second Chances – The Boy Who Cried Wolf Retold for Kids Ages 4–8',
      es: 'Una fábula ilustrada atemporal sobre la honestidad, la confianza y las segundas oportunidades – El niño que gritó lobo, contado de nuevo para niños de 4 a 8 años',
      fr: 'Une fable illustrée intemporelle sur l’honnêteté, la confiance et les secondes chances – Le garçon qui criait au loup, raconté pour les enfants de 4 à 8 ans',
    },
    description: {
      en: 'Leo loves his first real job as a shepherd. Then the hours get long and a small mischief slips into his face. "WOLF! WOLF!" he shouts. The villagers come running and find nothing. He does it again. They stop coming. And then one evening, yellow eyes appear at the edge of the forest. Real teeth. A real wolf. A retelling of the timeless fable about trust, honesty, and the long road back.',
      es: 'Leo adora su primer trabajo de verdad como pastor. Pero las horas se hacen largas y una pequeña travesura le cruza la cara. «¡LOBO! ¡LOBO!», grita. Los aldeanos vienen corriendo y no encuentran nada. Vuelve a gritar. Dejan de venir. Y una tarde, unos ojos amarillos aparecen al borde del bosque. Dientes reales. Un lobo real. Una nueva versión de la fábula eterna sobre la confianza, la honestidad y el largo camino de vuelta.',
      fr: 'Léo adore son premier vrai métier de berger. Mais les heures s’allongent et une petite malice lui traverse le visage. « LOUP ! LOUP ! », crie-t-il. Les villageois accourent et ne trouvent rien. Il recommence. Ils ne viennent plus. Et un soir, des yeux jaunes apparaissent à la lisière de la forêt. De vraies dents. Un vrai loup. Une nouvelle version de la fable intemporelle sur la confiance, l’honnêteté et le long chemin du retour.',
    },
    theme: {
      en: 'Honesty and trust',
      es: 'Honestidad y confianza',
      fr: 'Honnêteté et confiance',
    },
  },
  {
    id: 'russet-the-fox',
    ageRange: '4-8',
    editions: {
      en: { asin: '1997027046', cover: '/covers/russet-the-fox-en.webp' },
      es: { asin: 'B0H67H9F2W', cover: '/covers/russet-the-fox-es.webp' },
      fr: { asin: 'B0HFCJ1TPG', cover: '/covers/russet-the-fox-fr.webp' },
    },
    title: {
      en: 'Russet the Fox Learns a Lesson',
      es: 'Russet el zorro aprende una lección',
      fr: 'Russet le renard apprend une leçon',
    },
    subtitle: {
      en: 'A Gentle Illustrated Fable About Listening, Humility, and Patience – A Clever Fox Story of Growing Up, for Kids Ages 4–8',
      es: 'Una fábula ilustrada tierna sobre escuchar, la humildad y la paciencia – La historia de un zorro astuto que crece, para niños de 4 a 8 años',
      fr: 'Une douce fable illustrée sur l’écoute, l’humilité et la patience – L’histoire d’un renard malin qui grandit, pour les enfants de 4 à 8 ans',
    },
    description: {
      en: 'Russet is sure he is the cleverest fox in the den. Faster than his siblings. Smarter than the farmer. Too quick to ever get caught. So when his mother warns him about the dogs and the wire fence, he barely listens. Then comes the night the wire wraps around his leg. A picture book fable about humility, listening, and the quiet wisdom of taking your time.',
      es: 'Russet está seguro de ser el zorro más listo de la madriguera. Más rápido que sus hermanos. Más astuto que el granjero. Demasiado veloz para que lo atrapen. Así que cuando su madre le advierte sobre los perros y la alambrada, apenas escucha. Y llega la noche en que el alambre le rodea la pata. Una fábula ilustrada sobre la humildad, escuchar y la sabiduría tranquila de tomarse su tiempo.',
      fr: 'Russet est convaincu d’être le renard le plus malin du terrier. Plus rapide que ses frères. Plus rusé que le fermier. Trop vif pour se faire attraper. Alors quand sa mère le met en garde contre les chiens et la clôture en fil de fer, il écoute à peine. Puis vient la nuit où le fil s’enroule autour de sa patte. Une fable illustrée sur l’humilité, l’écoute et la sagesse tranquille de prendre son temps.',
    },
    theme: {
      en: 'Listening and humility',
      es: 'Escuchar y humildad',
      fr: 'Écoute et humilité',
    },
  },
  {
    id: 'little-boats-big-wish',
    ageRange: '3-7',
    editions: {
      en: { asin: '1997027070', cover: 'https://m.media-amazon.com/images/I/71Zjj22p5sL.jpg' },
    },
    title: {
      en: "A Little Boat's Big Wish",
      es: 'El gran deseo de un pequeño barco',
      fr: 'Le grand rêve d’un petit bateau',
    },
    subtitle: {
      en: "A Calming Illustrated Bedtime Storybook About Contentment, Gratitude, and Wonder – A Little Toy Boat's Big Adventure for Kids Ages 3–7",
      es: 'Un cuento ilustrado y calmante para dormir sobre el contentamiento, la gratitud y el asombro – La gran aventura de un barquito de juguete, para niños de 3 a 7 años',
      fr: 'Une histoire illustrée et apaisante pour le soir sur la satisfaction, la gratitude et l’émerveillement – La grande aventure d’un petit bateau-jouet, pour les enfants de 3 à 7 ans',
    },
    description: {
      en: 'A small yellow wooden boat sits on a shelf above the bathroom sink, watching the moon and dreaming of vast open ocean. Then one morning a boy carries him out to a sparkling puddle, and the adventure begins. A frog, a turtle, a goldfish, a duckling, each tiny water teaches the boat that the ocean was never the point. A gentle bedtime book about contentment and the wonder hidden in small worlds.',
      es: 'Un pequeño barco amarillo de madera está en un estante sobre el lavabo, mirando la luna y soñando con el vasto océano abierto. Hasta que una mañana un niño lo lleva a un charco brillante, y empieza la aventura. Una rana, una tortuga, un pez dorado, un patito — cada pequeño charco enseña al barco que el océano nunca fue lo importante. Un cuento tierno para la hora de dormir sobre el contentamiento y el asombro escondido en los mundos pequeños.',
      fr: 'Un petit bateau jaune en bois posé sur une étagère au-dessus du lavabo regarde la lune et rêve de vastes océans. Puis un matin, un enfant l’emporte vers une flaque scintillante, et l’aventure commence. Une grenouille, une tortue, un poisson rouge, un caneton — chaque petite étendue d’eau enseigne au bateau que l’océan n’était pas l’essentiel. Un doux livre du soir sur la satisfaction et l’émerveillement caché dans les petits mondes.',
    },
    theme: {
      en: 'Contentment and wonder in small worlds',
      es: 'Contentamiento y asombro en los mundos pequeños',
      fr: 'Satisfaction et émerveillement dans les petits mondes',
    },
  },
  {
    id: 'heidis-journey-to-mastery',
    ageRange: '5-9',
    editions: {
      en: { asin: 'B0H35ZJKCR', cover: '/covers/heidis-journey-to-mastery-en.webp' },
      es: { cover: '/covers/heidis-journey-to-mastery-es.webp' },
      fr: { asin: '1997027275', cover: '/covers/heidis-journey-to-mastery-fr.webp' },
    },
    title: {
      en: "Heidi's Journey to Mastery",
      es: 'El camino de Heidi hacia la maestría',
      fr: 'Le chemin de Heidi vers la maîtrise',
    },
    subtitle: {
      en: "An Inspiring Illustrated STEM Storybook About Perseverance, Patience, and Learning by Doing – A Young Inventor's Growth Mindset Story for Kids Ages 5–9",
      es: 'Un álbum ilustrado STEM inspirador sobre la perseverancia, la paciencia y aprender haciendo – La historia de una joven inventora y su mentalidad de crecimiento, para niños de 5 a 9 años',
      fr: 'Un album illustré STEM inspirant sur la persévérance, la patience et l’apprentissage par la pratique – L’histoire d’une jeune inventrice et de son état d’esprit de croissance, pour les enfants de 5 à 9 ans',
    },
    description: {
      en: "Seven-year-old Heidi dreams of inventions. Solar cars. Wind-turbine bridges. A small robot to clean the lake outside her grandfather Anders's workshop in Granholm. So when she finally crosses the threshold expecting gears and tools, she is surprised when he hands her a broom. Month after month, she sweeps. Then she sorts parts. Then she watches. Then she asks. A picture book about the slow patient road from dreaming to making.",
      es: 'Heidi tiene siete años y sueña con inventos. Coches solares. Puentes con turbinas de viento. Un pequeño robot para limpiar el lago frente al taller de su abuelo Anders en Granholm. Por eso, cuando por fin cruza el umbral esperando engranajes y herramientas, se sorprende al recibir una escoba. Mes tras mes, barre. Luego clasifica piezas. Luego observa. Luego pregunta. Un álbum sobre el camino lento y paciente que va del soñar al hacer.',
      fr: 'Heidi a sept ans et rêve d’inventions. De voitures solaires. De ponts à éoliennes. D’un petit robot pour nettoyer le lac devant l’atelier de son grand-père Anders à Granholm. Alors quand elle franchit enfin le seuil en s’attendant à des engrenages et à des outils, elle est surprise qu’il lui tende un balai. Mois après mois, elle balaie. Puis elle trie les pièces. Puis elle observe. Puis elle pose des questions. Un album sur la lente route patiente qui mène du rêve à la fabrication.',
    },
    theme: {
      en: 'Patience and apprenticeship',
      es: 'Paciencia y aprendizaje',
      fr: 'Patience et apprentissage',
    },
  },
  {
    id: 'cloud-collector',
    ageRange: '4-8',
    editions: {
      en: { asin: 'B0H1DXZ1KH', cover: '/covers/cloud-collector-en.webp' },
      es: { asin: 'B0GX32FKCB', cover: '/covers/cloud-collector-es.webp' },
      fr: { asin: '1996972987', cover: '/covers/cloud-collector-fr.webp' },
    },
    title: {
      en: 'The Cloud Collector',
      es: 'La coleccionista de nubes',
      fr: 'La collectionneuse de nuages',
    },
    subtitle: {
      en: 'An Enchanting Illustrated STEM Storybook About Clouds, Weather, and Letting Go – Discovering the Wonders of the Sky for Curious Kids Ages 4–8',
      es: 'Un cuento ilustrado STEM encantador sobre las nubes, el clima y soltar – Descubriendo las maravillas del cielo, para niños curiosos de 4 a 8 años',
      fr: 'Un album illustré STEM enchanteur sur les nuages, la météo et le lâcher-prise – À la découverte des merveilles du ciel, pour les enfants curieux de 4 à 8 ans',
    },
    description: {
      en: 'Luna loves the sky. The way clouds change shape, drift across the horizon, dance with the wind. When Grandpa Chen gives her a butterfly net and a glass jar, she sets out into the meadow with one big plan: collect one cloud of every kind. She meets cumulus clouds that float just out of reach, wispy cirrus painted high across the sky, and slowly learns that some things are too beautiful to keep. A picture book about wonder, attention, and the gift of letting beautiful things stay where they are.',
      es: 'A Luna le encanta el cielo. Cómo las nubes cambian de forma, recorren el horizonte, bailan con el viento. Cuando su abuelo Chen le regala una red de mariposas y un frasco de cristal, sale al prado con un gran plan: coleccionar una nube de cada tipo. Conoce nubes cúmulo que flotan justo fuera de su alcance, finos cirros pintados en lo alto, y poco a poco aprende que algunas cosas son demasiado hermosas para guardarlas. Un álbum sobre el asombro, la atención y el regalo de dejar que las cosas bellas se queden donde están.',
      fr: 'Luna adore le ciel. La façon dont les nuages changent de forme, dérivent à l’horizon, dansent avec le vent. Quand grand-père Chen lui offre un filet à papillons et un bocal en verre, elle part dans la prairie avec un grand projet : collectionner un nuage de chaque sorte. Elle rencontre des cumulus qui flottent juste hors de portée, des cirrus filants peints très haut, et apprend peu à peu que certaines choses sont trop belles pour qu’on les garde. Un album sur l’émerveillement, l’attention et le cadeau de laisser les belles choses là où elles sont.',
    },
    theme: {
      en: 'Wonder and letting go',
      es: 'Asombro y soltar',
      fr: 'Émerveillement et lâcher-prise',
    },
  },
  {
    id: 'little-mapmaker',
    ageRange: '4-8',
    editions: {
      en: { asin: 'B0GZJPZS74', cover: '/covers/little-mapmaker-en.webp' },
      es: { asin: 'B0HHVQ44J8', cover: '/covers/little-mapmaker-es.webp' },
      fr: { asin: 'B0HG3Z4SF8', cover: '/covers/little-mapmaker-fr.webp' },
    },
    title: {
      en: 'The Little Mapmaker',
      es: 'La pequeña cartógrafa',
      fr: 'La petite cartographe',
    },
    subtitle: {
      en: 'An Enchanting Illustrated Storybook About Imagination, Creativity, and Maps – A Magical Drawing Adventure for Curious Kids Ages 4–8',
      es: 'Un cuento ilustrado encantador sobre la imaginación, la creatividad y los mapas – Una aventura mágica de dibujo para niños curiosos de 4 a 8 años',
      fr: 'Un album illustré enchanteur sur l’imagination, la créativité et les cartes – Une aventure magique de dessin pour les enfants curieux de 4 à 8 ans',
    },
    description: {
      en: 'Maya is five, and she draws maps. Maps of her bedroom. Maps of the kitchen. Maps of the backyard with the tire swing. Her dog Pepper sits beside her with a red bandana while she works. Then one day Maya draws a castle deep in the tall grass, and when she walks out to find it, it is exactly where she put it. Soon a river runs through a crack in the sidewalk because she sketched fish in it. A picture book about how imagination, attention, and a pencil are enough to make a world.',
      es: 'Maya tiene cinco años, y dibuja mapas. Mapas de su habitación. Mapas de la cocina. Mapas del jardín con el columpio de neumático. Su perro Pepper se sienta a su lado con un pañuelo rojo mientras trabaja. Hasta que un día Maya dibuja un castillo entre la hierba alta, y cuando sale a buscarlo, está justo donde lo puso. Pronto un río corre por una grieta de la acera porque dibujó peces en ella. Un álbum sobre cómo la imaginación, la atención y un lápiz bastan para crear un mundo.',
      fr: 'Maya a cinq ans, et elle dessine des cartes. Des cartes de sa chambre. Des cartes de la cuisine. Des cartes du jardin avec la balançoire en pneu. Son chien Pepper s’assoit près d’elle avec un bandana rouge pendant qu’elle travaille. Puis un jour Maya dessine un château au fond des hautes herbes, et quand elle sort pour le chercher, il est exactement là où elle l’a posé. Bientôt une rivière coule dans une fissure du trottoir parce qu’elle y a esquissé des poissons. Un album sur la façon dont l’imagination, l’attention et un crayon suffisent à faire un monde.',
    },
    theme: {
      en: 'Imagination and making',
      es: 'Imaginación y crear',
      fr: 'Imagination et création',
    },
  },
  {
    id: 'pawa-rainbow-cloud',
    ageRange: '3-7',
    editions: {
      en: { asin: '1996972936', cover: '/covers/pawa-rainbow-cloud-en.webp' },
      es: { asin: 'B0HH8F8XLQ', cover: '/covers/pawa-rainbow-cloud-es.webp' },
      fr: { asin: '1996972952', cover: '/covers/pawa-rainbow-cloud-fr.webp' },
    },
    title: {
      en: 'Pawa and the Little Rainbow Cloud',
      es: 'Pawa y la pequeña nube arcoíris',
      fr: 'Pawa et le petit nuage arc-en-ciel',
    },
    subtitle: {
      en: 'A Gentle Illustrated Storybook About Big Feelings, Self-Worth, and Rainbows – How Rain and Sunshine Make Something Beautiful, for Kids Ages 3–7',
      es: 'Un cuento ilustrado tierno sobre las emociones grandes, la propia valía y los arcoíris – Cómo la lluvia y el sol crean algo hermoso, para niños de 3 a 7 años',
      fr: 'Un album illustré tout en douceur sur les grandes émotions, l’estime de soi et les arcs-en-ciel – Comment la pluie et le soleil créent quelque chose de beau, pour les enfants de 3 à 7 ans',
    },
    description: {
      en: 'Cirro is a little gray cloud who feels heavy and sad after a storm. He believes his tears only make the world messy and wet. But Pawa the wise Sun knows a quiet secret: when rain meets light, something extraordinary happens. Through Cirro\'s gentle transformation, young readers discover that the feelings that seem like too much are often the very things that make beauty possible.',
      es: 'Cirro es una pequeña nube gris que se siente pesada y triste después de una tormenta. Cree que sus lágrimas solo ensucian y mojan el mundo. Pero Pawa, el sabio Sol, conoce un secreto tranquilo: cuando la lluvia se encuentra con la luz, ocurre algo extraordinario. A través de la suave transformación de Cirro, los lectores pequeños descubren que los sentimientos que parecen demasiado son a menudo precisamente los que hacen posible la belleza.',
      fr: 'Cirro est un petit nuage gris qui se sent lourd et triste après l’orage. Il croit que ses larmes ne font que mouiller et salir le monde. Mais Pawa, le sage Soleil, connaît un secret tranquille : quand la pluie rencontre la lumière, quelque chose d’extraordinaire arrive. À travers la douce transformation de Cirro, les jeunes lecteurs découvrent que les sentiments qui semblent trop grands sont souvent ceux qui rendent la beauté possible.',
    },
    theme: {
      en: 'Self-worth and transformation',
      es: 'Valor propio y transformación',
      fr: 'Estime de soi et transformation',
    },
  },
  {
    id: 'miras-thousand-cubes',
    ageRange: '5-9',
    editions: {
      en: { asin: '1996972839', cover: '/covers/miras-thousand-cubes-en.webp' },
      es: { asin: 'B0HH8KWPD8', cover: '/covers/miras-thousand-cubes-es.webp' },
      fr: { asin: '1996972855', cover: '/covers/miras-thousand-cubes-fr.webp' },
    },
    title: {
      en: "Mira's Thousand Cubes",
      es: 'Los mil cubos de Mira',
      fr: 'Les mille cubes de Mira',
    },
    subtitle: {
      en: 'A Story About Patience, Practice, and Mastery',
      es: 'Una historia sobre la paciencia, la práctica y la maestría',
      fr: 'Une histoire sur la patience, la pratique et la maîtrise',
    },
    description: {
      en: "In a mountain village of stone carvers, young Mira dreams of sculpting eagles and dancing figures. When Master Hiroshi takes her on as his apprentice, her first task is to carve a thousand identical cubes, not eagles, not dancers. Through aching hands and frustration, she finds the lesson hidden in repetition: the quiet art of doing the small thing well, and how great things take time.",
      es: 'En un pueblo de montaña de talladores de piedra, la joven Mira sueña con esculpir águilas y figuras danzantes. Cuando el maestro Hiroshi la acepta como aprendiz, su primera tarea es tallar mil cubos idénticos: ni águilas ni bailarines. Entre manos doloridas y frustración, descubre la lección escondida en la repetición: el arte tranquilo de hacer bien lo pequeño y cómo las grandes cosas llevan tiempo.',
      fr: "Dans un village de montagne réputé pour ses sculpteurs, la jeune Mira rêve de tailler des aigles et des danseurs dans la pierre. Quand Maître Hiroshi la prend enfin comme apprentie, sa première tâche est de sculpter mille cubes identiques — ni aigles, ni danseurs. À travers les mains endolories et la frustration, Mira découvre la leçon cachée dans la répétition : l'art tranquille de bien faire les petites choses, et comment les grandes choses prennent du temps.",
    },
    theme: {
      en: 'Patience and mastery',
      es: 'Paciencia y maestría',
      fr: 'Patience et maîtrise',
    },
  },
  {
    id: 'fig-trees-secret',
    ageRange: '4-8',
    editions: {
      en: { asin: 'B0H36V1P89', cover: '/covers/fig-trees-secret-en.webp' },
      es: { asin: 'B0HHVVK17N', cover: '/covers/fig-trees-secret-es.webp' },
      fr: { asin: 'B0HG3GF4ML', cover: '/covers/fig-trees-secret-fr.webp' },
    },
    title: {
      en: "The Fig Tree's Secret",
      es: 'El secreto de la higuera',
      fr: 'Le secret du figuier',
    },
    subtitle: {
      en: 'A Mediterranean Tale of Heritage, Memory, and Family',
      es: 'Un cuento mediterráneo de herencia, memoria y familia',
      fr: "Un conte méditerranéen d'héritage, de mémoire et de famille",
    },
    description: {
      en: "When Sofia inherits her grandmother's Mediterranean cottage, the gnarled old fig tree in the garden is first on her list to cut down. Then old Mr. Costas comes running through the gate and begins to tell her what the tree has watched: three hundred years of harvests, festivals, and recipes her grandmother kept by hand. A tender story about the trees and people we almost lose by going too fast, and how some inheritances are made of stories.",
      es: 'Cuando Sofía hereda la casita mediterránea de su abuela, la vieja higuera nudosa del jardín es lo primero que quiere talar. Entonces el viejo señor Costas cruza corriendo la verja y empieza a contarle lo que el árbol ha visto: trescientos años de cosechas, fiestas y recetas que su abuela guardaba a mano. Un cuento tierno sobre los árboles y las personas que casi perdemos por ir demasiado deprisa, y sobre cómo algunas herencias están hechas de historias.',
      fr: "Quand Sofia hérite de la maisonnette méditerranéenne de sa grand-mère, le vieux figuier noueux du jardin est la première chose qu'elle veut abattre. Puis le vieux monsieur Costas franchit le portail en courant et se met à lui raconter ce que l'arbre a vu : trois cents ans de récoltes, de fêtes et de recettes que sa grand-mère gardait de sa main. Un conte tendre sur les arbres et les gens que l'on perd presque à aller trop vite, et sur ces héritages qui sont faits d'histoires.",
    },
    theme: {
      en: 'Heritage and memory',
      es: 'Herencia y memoria',
      fr: 'Héritage et mémoire',
    },
  },
];
