// Cover-image helpers shared by BookCard and the BookDetail page.
//
// Amazon's image CDN resizes on the fly via an "._SX<width>_" modifier before
// the extension (e.g. 619qWXXkRwL.jpg -> 619qWXXkRwL._SX466_.jpg, ~65% smaller).
// Local imported covers (the 3 featured titles) are returned unchanged.
export function isAmazonCover(url: string): boolean {
  return url.includes('m.media-amazon.com/images/');
}

export function sizedCover(url: string, width: number): string {
  return isAmazonCover(url) ? url.replace(/\.(jpe?g|png)(\?.*)?$/i, `._SX${width}_.$1$2`) : url;
}
