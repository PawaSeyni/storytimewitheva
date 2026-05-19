// Eva Gallo Collection — published books in the imprint.
//
// Cover images come from two sources:
//   - 8 Amazon-live titles: stable Amazon CDN URLs (m.media-amazon.com)
//   - 3 newer titles in production (Colors Mixed Up, Rainbow Symphony, Tower):
//     locally-hosted resized covers under src/assets/covers/
//
// `coverImage` is treated as a string passed directly to <img src>. Both
// absolute URLs and Vite-imported local paths work.

import colorsMixedUp from '../assets/covers/colors-mixed-up.jpg';
import rainbowSymphony from '../assets/covers/rainbow-symphony.jpg';
import towerTouchedSky from '../assets/covers/tower-touched-sky.jpg';

export interface Book {
  id: string;
  coverImage: string;
  title: string;
  subtitle?: string;
  ageRange: string;
  languages: string[];
  description: string;
  theme: string;
  amazonUrl: string;
  featured?: boolean;
}

const AUTHOR_URL = 'https://www.amazon.com/author/evagallo';

// Helper: build per-book Amazon detail-page URLs from ASIN.
const dp = (asin: string) => `https://www.amazon.com/dp/${asin}`;

export const books: Book[] = [
  // ---- 3 newer titles in production (local covers, KDP metadata authoritative) ----
  {
    id: 'colors-mixed-up',
    coverImage: colorsMixedUp,
    title: 'The Day the Colors Got Mixed Up',
    subtitle: 'A Color Theory Adventure with Pixel and Hawel',
    ageRange: '4-7 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    description:
      'Hawel wakes to find every color in the world swapped — banana blue, toast purple, sky doing something it shouldn\'t. With Pixel the butterfly, she sets off to find the Color Keeper and learn how red, yellow, and blue make every other color. A gentle first lesson in color theory.',
    theme: 'Color theory and curiosity',
    amazonUrl: AUTHOR_URL, // not yet live on Amazon
    featured: true,
  },
  {
    id: 'rainbow-symphony',
    coverImage: rainbowSymphony,
    title: 'The Rainbow Symphony',
    subtitle: 'A Picture Book About Voices Joining Together',
    ageRange: '3-6 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    description:
      'In the village of Harmonia, every color sings its own song. When the colors argue about whose song is best, the music breaks apart — and only Pawa, a small glowing light who loves them all, can remind them how the symphony really works.',
    theme: 'Diversity and harmony',
    amazonUrl: AUTHOR_URL,
    featured: true,
  },
  {
    id: 'tower-touched-sky',
    coverImage: towerTouchedSky,
    title: 'The Tower That Touched the Sky',
    subtitle: 'A Story About Humility, Listening, and True Brilliance',
    ageRange: '5-9 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    description:
      'Architect Victor Mercer designs the tallest tower ever conceived. Only one junior engineer raises a hand he never sees. When the dust settles, Victor learns how to design with questions rather than certainty.',
    theme: 'Humility and listening',
    amazonUrl: AUTHOR_URL,
  },

  // ---- 8 titles live on Amazon ----
  {
    id: 'mayas-shadow',
    coverImage: 'https://m.media-amazon.com/images/I/619qWXXkRwL.jpg',
    title: "The Adventures of Maya's Shadow",
    subtitle: 'A Story of Nighttime Wonder and Quiet Magic',
    ageRange: '3-7 years',
    languages: ['🇺🇸'],
    description:
      "Every night when Maya goes to bed, something magical happens. While Maya sleeps and dreams, her shadow wakes up and slips out the door for adventures of its own. The imprint flagship — quiet wonder, nighttime magic, and morning homecoming.",
    theme: 'Wonder and imagination',
    amazonUrl: dp('1996972812'),
    featured: true,
  },
  {
    id: 'sparrow-saved-forest',
    coverImage: 'https://m.media-amazon.com/images/I/61+OZTchcCL.jpg',
    title: 'The Sparrow Who Saved the Forest',
    subtitle: 'A Story About Kindness to the Small',
    ageRange: '4-8 years',
    languages: ['🇺🇸'],
    description:
      'When the forest is in trouble, the biggest animals don\'t notice. The smallest sparrow does. A gentle picture book about how the tiniest acts of kindness can change everything.',
    theme: 'Kindness and courage',
    amazonUrl: dp('1996972685'),
  },
  {
    id: 'diegos-brave-leap',
    coverImage: 'https://m.media-amazon.com/images/I/71XLCAup1CL.jpg',
    title: "Diego's Brave Leap",
    subtitle: 'A Story About Courage and Chasing Your Dreams',
    ageRange: '4-8 years',
    languages: ['🇺🇸'],
    description:
      "On a sun-warmed cliff above the Mediterranean, Diego stands at the edge. Everyone is watching. The water is far below. A back-to-school picture book about the kind of bravery that doesn't feel brave from the inside.",
    theme: 'Courage and self-trust',
    amazonUrl: dp('1996972863'),
  },
  {
    id: 'butterfly-effect',
    coverImage: 'https://m.media-amazon.com/images/I/71Ihs65rZFL.jpg',
    title: 'The Butterfly Effect',
    subtitle: 'A Story About Kindness and What It Grows',
    ageRange: '5-9 years',
    languages: ['🇺🇸'],
    description:
      "One small kind thing turns into another, and another, and another, until a whole community is changed. A picture book about how kindness travels in ways we don't always see.",
    theme: 'Kindness and ripple effects',
    amazonUrl: dp('1996972774'),
  },
  {
    id: 'emperors-true-treasure',
    coverImage: 'https://m.media-amazon.com/images/I/714jyt2r6TL.jpg',
    title: "The Emperor's True Treasure",
    subtitle: 'A Quiet Lesson in Gratitude',
    ageRange: '5-9 years',
    languages: ['🇺🇸'],
    description:
      "An emperor with a palace full of gold cannot understand why he feels so empty. The villagers, who have almost nothing, seem to have everything that matters. A picture book about where richness actually lives.",
    theme: 'Gratitude and perspective',
    amazonUrl: dp('199697274X'),
  },
  {
    id: 'crooked-little-apple-tree',
    coverImage: 'https://m.media-amazon.com/images/I/713GxuodwVL.jpg',
    title: 'The Crooked Little Apple Tree',
    subtitle: 'A Story About Worth, Beauty, and Second Chances',
    ageRange: '4-8 years',
    languages: ['🇺🇸'],
    description:
      "The orchard wants only straight, perfect trees. The crooked little apple tree at the edge has been overlooked for years. Until the year someone really looks. A tender story about how worth is seen.",
    theme: 'Worth and being seen',
    amazonUrl: dp('1996972715'),
  },
  {
    id: 'true-beauty-meadowbrook',
    coverImage: 'https://m.media-amazon.com/images/I/712M0yodc0L.jpg',
    title: 'The True Beauty of Meadowbrook',
    subtitle: 'A Tale of Kindness That Shines Brighter',
    ageRange: '4-8 years',
    languages: ['🇺🇸'],
    description:
      'In a town where everyone competes to look the most beautiful, a quiet girl figures out a different way to shine. A picture book about kindness as the kind of beauty that lasts.',
    theme: 'Inner beauty and kindness',
    amazonUrl: dp('1996972650'),
  },
  {
    id: 'sanding-block',
    coverImage: 'https://m.media-amazon.com/images/I/710y9Kd57tL.jpg',
    title: 'The Sanding Block',
    subtitle: "A Woodworker's Lesson in Patience",
    ageRange: '5-9 years',
    languages: ['🇺🇸'],
    description:
      'A young boy wants to be a great woodworker today, right now. His grandfather hands him a sanding block. A picture book about the slow craft of becoming good at something, told in a sunlit workshop with shavings on the floor.',
    theme: 'Patience and craft',
    amazonUrl: dp('1996972898'),
  },
];
