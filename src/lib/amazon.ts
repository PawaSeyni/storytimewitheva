// Amazon Associates affiliate config — single source of truth for the tracking
// tag so every user-facing Amazon link earns commission and is easy to rotate.
// Store: "Eva Gallo" · tracking ID "storytimewi20-20".
export const AMAZON_ASSOCIATE_TAG = 'storytimewi20-20';

/** Append the Associates tag to an amazon.com URL (no-op if the tag is empty). */
export const withAffiliateTag = (url: string): string =>
  AMAZON_ASSOCIATE_TAG ? `${url}${url.includes('?') ? '&' : '?'}tag=${AMAZON_ASSOCIATE_TAG}` : url;

/** Product link for an ASIN, with the affiliate tag. */
export const amazonDp = (asin: string): string =>
  withAffiliateTag(`https://www.amazon.com/dp/${asin}`);

/** Eva's Amazon author/storefront page, with the affiliate tag. */
export const AMAZON_AUTHOR_URL = withAffiliateTag('https://www.amazon.com/author/evagallo');
