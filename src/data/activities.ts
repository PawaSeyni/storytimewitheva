// Canonical list of activities. The Activities page, the Home preview, the
// Profile page, and the DemoPage all import from here so titles/emojis/slugs
// stay in sync.

export interface Activity {
  slug: string; // also used as the route under /activities/{slug}
  emoji: string;
  title: string;
  desc: string;
  ages: string;
  category: string;
}

export const activities: Activity[] = [
  {
    slug: 'story-builder',
    emoji: '✍️',
    title: 'Story Dice Creator',
    desc: 'Roll the dice to mix characters, settings, and plot twists into a brand-new story every time.',
    ages: '6-9',
    category: 'Creative Writing',
  },
  {
    slug: 'character-workshop',
    emoji: '🎭',
    title: 'Character Creation Workshop',
    desc: 'Step-by-step character builder — type, name, look, personality, powers, and backstory.',
    ages: '6-9',
    category: 'Creative Writing',
  },
  {
    slug: 'adventure-journal',
    emoji: '📓',
    title: 'Adventure Reading Journal',
    desc: "A simple journal to record books you've read, your favorite characters and scenes. Saves to your device.",
    ages: '6-9',
    category: 'Reading',
  },
  {
    slug: 'coloring',
    emoji: '🎨',
    title: "Eva's Coloring Adventure",
    desc: 'In-browser coloring book — pick a scene, pick your palette, color it in. Saves what you make.',
    ages: '3-7',
    category: 'Art & Creativity',
  },
  {
    slug: 'craft-corner',
    emoji: '✂️',
    title: "Eva's Craft Corner",
    desc: 'Step-by-step craft instructions — bookmarks, masks, story dioramas built from common materials.',
    ages: '6-9',
    category: 'Crafts',
  },
  {
    slug: 'bookmark-designer',
    emoji: '🔖',
    title: 'Bookmark Designer',
    desc: 'Design and print your own bookmarks with themes from the books, plus a quote you choose.',
    ages: '5-9',
    category: 'Crafts',
  },
  {
    slug: 'bingo',
    emoji: '🎯',
    title: 'Reading Bingo',
    desc: 'Complete reading challenges across a bingo board — five in a row earns a celebration.',
    ages: '6-9',
    category: 'Reading',
  },
  {
    slug: 'puzzles',
    emoji: '🧩',
    title: 'Puzzle Paradise',
    desc: 'Word puzzles and riddles based on the stories — a thinking workout that builds vocabulary.',
    ages: '7-9',
    category: 'Games',
  },
];

export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}
