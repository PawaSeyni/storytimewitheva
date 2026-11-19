// Cover-image helpers shared by BookCard, BookDetail and the thumbnail strips.
//
// Amazon's image CDN resizes on the fly via an "._SX<width>_" modifier before
// the extension (e.g. 619qWXXkRwL.jpg -> 619qWXXkRwL._SX466_.jpg, ~65% smaller).
//
// Local covers (/covers/<name>.webp, 700 x 700) have a 400 px copy at
// /covers/400/<name>.webp, made by scripts/make-cover-variants.py. Any request for
// 400 px or less gets that copy (site audit 2026-11-18, finding 1: phones were
// downloading the 700 px file for a 380 px card).
export function isAmazonCover(url: string): boolean {
  return url.includes('m.media-amazon.com/images/');
}

const LOCAL_COVER = /^\/covers\/([^/]+\.webp)$/;
export const SMALL_COVER_WIDTH = 400;

/** The 400 px copy of a local cover, or null for anything else. */
export function smallLocalCover(url: string): string | null {
  const m = LOCAL_COVER.exec(url);
  return m ? `/covers/${SMALL_COVER_WIDTH}/${m[1]}` : null;
}

export function sizedCover(url: string, width: number): string {
  if (isAmazonCover(url)) return url.replace(/\.(jpe?g|png)(\?.*)?$/i, `._SX${width}_.$1$2`);
  if (width <= SMALL_COVER_WIDTH) return smallLocalCover(url) ?? url;
  return url;
}

/** A srcset for a card-sized cover: Amazon resizes on demand; local covers have 400 and 700. */
export function coverSrcSet(url: string): string | undefined {
  if (isAmazonCover(url)) return `${sizedCover(url, 330)} 330w, ${sizedCover(url, 660)} 660w`;
  const small = smallLocalCover(url);
  return small ? `${small} ${SMALL_COVER_WIDTH}w, ${url} 700w` : undefined;
}
