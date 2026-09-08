// Activities — runtime surface only.
//
// The DATA and the `Activity` type live in ./activities.data.ts (browser-free) so
// build scripts and CI can load them. This module owns localization and the hooks,
// and re-exports the data, so every existing import of './activities' is unchanged.

import { useLanguage, type Language } from '../lib/language';
import { activities, type Activity } from './activities.data';

export { activities };
export type { Activity };

export interface LocalizedActivity {
  slug: string;
  emoji: string;
  ages: string;
  title: string;
  desc: string;
  category: string;
  game?: boolean;
}


function localize(activity: Activity, lang: Language): LocalizedActivity {
  return {
    slug: activity.slug,
    emoji: activity.emoji,
    ages: activity.ages,
    title: activity.title[lang] ?? activity.title.en,
    desc: activity.desc[lang] ?? activity.desc.en,
    category: activity.category[lang] ?? activity.category.en,
    game: activity.game,
  };
}

/** Returns all activities localized for the current language. */
export function useActivities(): LocalizedActivity[] {
  const { language } = useLanguage();
  return activities.map((a) => localize(a, language));
}

/** Returns a single activity localized for the current language, by slug. */
export function useActivity(slug: string): LocalizedActivity | undefined {
  const { language } = useLanguage();
  const found = activities.find((a) => a.slug === slug);
  return found ? localize(found, language) : undefined;
}

/** Raw-metadata lookup (no localization). Used by sitemap and Seo derivations. */
export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}
