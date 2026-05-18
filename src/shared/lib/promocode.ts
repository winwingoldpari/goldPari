export const parsePromocodes = (input: string): string[] =>
  input
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean);

// The new promocode pill (green gradient + label + text) is only drawn on
// banners uploaded after 2026-05-10. Older banners have the old promocode
// baked into the image — the pill must not overlap them.
const PROMO_PILL_CUTOFF_MS = Date.UTC(2026, 4, 10, 23, 59, 59, 999);

export const isPromoPillAllowedForBanner = (publishedAt?: string | null): boolean => {
  if (!publishedAt) return false;
  const ts = new Date(publishedAt).getTime();
  return Number.isFinite(ts) && ts > PROMO_PILL_CUTOFF_MS;
};
