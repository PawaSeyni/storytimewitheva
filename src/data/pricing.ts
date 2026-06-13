// Single source of truth for displayed prices. Books are sold on Amazon, whose
// price is authoritative and can vary by title/region — these are the typical
// US list prices shown on-site to answer "what does it cost?" up front. Update
// here to change everywhere the price appears.
export const PRICING = {
  paperback: '$11.99',
  ebook: '$7.99',
};
