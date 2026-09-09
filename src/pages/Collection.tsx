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
import { THEMES, AGE_BANDS, type ThemeId, type AgeBandId } from '../data/taxonomy';
import { collectionEligibleThemeIds, ageCollectionEligibleBandIds, publishedEditorialCollectionIds, collectionRecordById, collectionMembers, packsByCollectionId } from '../data/contentIndex';
import CollectionPage from '../components/CollectionPage';
import NotFound from './NotFound';
import { useTranslation, useLanguage } from '../lib/language';

const TRANSLATIONS = {
  en: { browseThemes: 'Browse other themes', browseAges: 'Browse by age', seoTheme: 'Picture books about', seoAge: 'Picture books for', seoEducator: 'A classroom collection' },
  es: { browseThemes: 'Explora otros temas', browseAges: 'Explora por edad', seoTheme: 'Libros ilustrados sobre', seoAge: 'Libros ilustrados para', seoEducator: 'Una colección para el aula' },
  fr: { browseThemes: 'Explorer d’autres thèmes', browseAges: 'Explorer par âge', seoTheme: 'Albums illustrés sur', seoAge: 'Albums illustrés pour', seoEducator: 'Une collection pour la classe' },
};

export default function Collection() {
  const { collectionId = '' } = useParams();
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();

  const isTheme = (collectionEligibleThemeIds as string[]).includes(collectionId);
  const isBand = (ageCollectionEligibleBandIds as string[]).includes(collectionId);
  const isEditorial = publishedEditorialCollectionIds.includes(collectionId);
  // The editorial layer (S7-001): optional for theme/age, required for editorial kinds.
  const record = collectionRecordById[collectionId];

  const inCollection = useMemo(() => {
    // Membership: derived for theme (themeIds) and age (primary fit, so the three age
    // pages partition the catalog), explicit for editorial kinds. Order: the record's
    // bookOrder first, then catalog order — contentIndex.collectionMembers owns the rule.
    if (!isTheme && !isBand && !isEditorial) return [];
    const byId = new Map(books.map((b) => [b.id, b]));
    return collectionMembers(collectionId).map((id) => byId.get(id)).filter((b) => b !== undefined);
  }, [books, collectionId, isTheme, isBand, isEditorial]);

  if (!isTheme && !isBand && !isEditorial) return <NotFound />;

  const extras = { activityIds: record?.activityIds, resourceIds: record?.resourceIds, packIds: packsByCollectionId[collectionId] };
  const others = [
    ...(collectionEligibleThemeIds as ThemeId[]).filter((x) => x !== collectionId).map((x) => ({ id: x, label: THEMES[x].labels[language] })),
    ...ageCollectionEligibleBandIds.filter((x) => x !== collectionId).map((b) => ({ id: b, label: AGE_BANDS[b].labels[language] })),
    ...publishedEditorialCollectionIds.filter((x) => x !== collectionId).map((x) => ({ id: x, label: collectionRecordById[x]?.title?.[language] ?? x })),
  ];

  if (isEditorial && record?.title && record?.description) {
    const title = record.title[language];
    return (
      <CollectionPage id={collectionId} title={title} intro={record.description[language]} seoTitle={`${title}: ${t.seoEducator}`} books={inCollection} browseOthersHeading={t.browseThemes} others={others} audience={record.kind === 'educator' ? 'educator' : undefined} {...extras} />
    );
  }

  if (isTheme) {
    const theme = THEMES[collectionId as ThemeId];
    const title = record?.title?.[language] ?? theme.labels[language];
    return (
      <CollectionPage
        id={collectionId}
        title={title}
        intro={record?.description?.[language] ?? theme.descriptions[language]}
        seoTitle={`${title} — ${t.seoTheme} ${title.toLowerCase()}`}
        books={inCollection}
        browseOthersHeading={t.browseThemes}
        others={others}
        {...extras}
      />
    );
  }

  const band = AGE_BANDS[collectionId as AgeBandId];
  const title = record?.title?.[language] ?? band.labels[language];
  return (
    <CollectionPage
      id={collectionId}
      title={title}
      intro={record?.description?.[language] ?? band.descriptions[language]}
      seoTitle={`${title} — ${t.seoAge} ${title.toLowerCase()}`}
      books={inCollection}
      browseOthersHeading={t.browseAges}
      others={others}
      {...extras}
    />
  );
}
