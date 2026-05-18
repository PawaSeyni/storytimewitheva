export interface Book {
  id: string;
  emoji: string;
  title: string;
  ageRange: string;
  languages: string[];
  description: string;
  theme: string;
  amazonUrl: string;
  featured?: boolean;
}

export const books: Book[] = [
  {
    id: 'tigers-brave-journey',
    emoji: '🐯',
    title: "Tiger's Brave Journey",
    ageRange: '4-8 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    description: 'Follow Tiger and Pawa as they overcome fears and discover the power of friendship in the jungle.',
    theme: 'Bravery and Friendship',
    amazonUrl: 'https://www.amazon.com/author/evagallo',
  },
  {
    id: 'lunas-starlight-adventure',
    emoji: '🌙',
    title: "Luna's Starlight Adventure",
    ageRange: '4-7 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    description: 'Join Luna as she travels through the night sky with Pawa, meeting friendly constellations and learning about courage and wonder.',
    theme: 'Courage and Wonder',
    amazonUrl: 'https://www.amazon.com/author/evagallo',
    featured: true,
  },
  {
    id: 'music-of-colors',
    emoji: '🎨',
    title: 'The Music of Colors',
    ageRange: '5-8 years',
    languages: ['🇺🇸', '🇪🇸'],
    description: 'In a world where colors make music, Pawa teaches everyone that harmony comes from diversity.',
    theme: 'Diversity and Harmony',
    amazonUrl: 'https://www.amazon.com/author/evagallo',
  },
  {
    id: 'rainbows-promise',
    emoji: '🌈',
    title: "Rainbow's Promise",
    ageRange: '3-6 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    description: 'After a storm, Pawa helps a little cloud discover that after every rain comes a beautiful rainbow.',
    theme: 'Hope and Resilience',
    amazonUrl: 'https://www.amazon.com/author/evagallo',
  },
  {
    id: 'counting-with-cultura',
    emoji: '🔢',
    title: 'Counting with Cultura',
    ageRange: '3-6 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    description: 'Learn numbers 1-20 with Pawa through vibrant cultural celebrations from around the world. A joyful journey through diversity!',
    theme: 'Numbers and Culture',
    amazonUrl: 'https://www.amazon.com/author/evagallo',
    featured: true,
  },
  {
    id: 'kindness-garden',
    emoji: '🌱',
    title: 'The Kindness Garden',
    ageRange: '5-9 years',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    description: 'When Maya and Pawa plant seeds of kindness in their community garden, they discover how small acts can bloom into big changes.',
    theme: 'Kindness and Community',
    amazonUrl: 'https://www.amazon.com/author/evagallo',
    featured: true,
  },
];
