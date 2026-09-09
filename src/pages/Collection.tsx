// Public collection route — /collections/:collectionId — for THEME collections
// (S7-001, taxonomy v1 §9) and AGE-BAND collections (S7-002).
//
// ELIGIBILITY GATE: a route exists only when the theme or band has at least
// THEME_COLLECTION_MINIMUM published books and a unique EN/FR/ES introduction. Anything
// else, including a valid tag below the minimum (`honesty`, `heritage`), renders a real
// 404 rather than a thin page. The same list (contentIndex.collectionRouteIds) drives
// this page, the sitemap and the prerender guard, so the three cannot disagree.
//
// Theme ids and band ids share the namespace without colliding: bands are `ages-N-M`.
// The route vocabulary stays English at every locale; only the content is localized.
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useBooks } from '../data/books';
import { THEMES, AGE_BANDS, derivePrimaryAgeBand, type ThemeId, type AgeBandId } from '../data/taxonomy';
import { collectionEligibleThemeIds, ageCollectionEligibleBandIds } from '../data/contentIndex';
import CollectionPage from '../components/CollectionPage';
import NotFound from './NotFound';
import { useTranslation, useLanguage } from '../lib/language';

const TRANSLATIONS = {
  en: { browseThemes: 'Browse other themes', browseAges: 'Browse by age', seoTheme: 'Picture books about', seoAge: 'Picture books for' },
  es: { browseThemes: 'Explora otros temas', browseAges: 'Explora por edad', seoTheme: 'Libros ilustrados sobre', seoAge: 'Libros ilustrados para' },
  fr: { browseThemes: 'Explorer d’autres thèmes', browseAges: 'Explorer par âge', seoTheme: 'Albums illustrés sur', seoAge: 'Albums illustrés pour' },
};

export default function Collection() {
  const { collectionId = '' } = useParams();
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();

  const isTheme = (collectionEligibleThemeIds as string[]).includes(collectionId);
  const isBand = (ageCollectionEligibleBandIds as string[]).includes(collectionId);

  const inCollection = useMemo(() => {
    if (isTheme) return books.filter((b) => b.themeIds.includes(collectionId as ThemeId));
    // Primary-fit placement, NOT exact-age containment: each book belongs to exactly one
    // band here (the approved 4 / 10 / 6 split), so the three pages partition the catalog.
    if (isBand) return books.filter((b) => derivePrimaryAgeBand(b.ageRange) === collectionId);
    return [];
  }, [books, collectionId, isTheme, isBand]);

  if (!isTheme && !isBand) return <NotFound />;

  if (isTheme) {
    const theme = THEMES[collectionId as ThemeId];
    const title = theme.labels[language];
    return (
      <CollectionPage
        id={collectionId}
        title={title}
        intro={theme.descriptions[language]}
        seoTitle={`${title} — ${t.seoTheme} ${title.toLowerCase()}`}
        books={inCollection}
        browseOthersHeading={t.browseThemes}
        others={[
          ...(collectionEligibleThemeIds as ThemeId[]).filter((x) => x !== collectionId).map((x) => ({ id: x, label: THEMES[x].labels[language] })),
          ...ageCollectionEligibleBandIds.map((b) => ({ id: b, label: AGE_BANDS[b].labels[language] })),
        ]}
      />
    );
  }

  const band = AGE_BANDS[collectionId as AgeBandId];
  const title = band.labels[language];
  return (
    <CollectionPage
      id={collectionId}
      title={title}
      intro={band.descriptions[language]}
      seoTitle={`${title} — ${t.seoAge} ${title.toLowerCase()}`}
      books={inCollection}
      browseOthersHeading={t.browseAges}
      others={[
        ...ageCollectionEligibleBandIds.filter((x) => x !== collectionId).map((b) => ({ id: b, label: AGE_BANDS[b].labels[language] })),
        ...(collectionEligibleThemeIds as ThemeId[]).map((x) => ({ id: x, label: THEMES[x].labels[language] })),
      ]}
    />
  );
}
