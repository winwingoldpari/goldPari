// Common
export const PROMO_FONT_BASE = 50;
export const BOTTOM_PAD_BASE = 15;

// Square layer (1080x1080 base)
export const PROMO_PILL_SIDE_PAD_BASE = 83;
export const PROMO_PILL_TEXT_PAD_BASE = 60;
export const PROMO_PILL_MIN_W_BASE = 525;
export const PROMO_PILL_H_BASE = 76;
export const PROMO_PILL_RADIUS_BASE = 35;
export const PROMO_PILL_BORDER_BASE = 5;
export const PROMO_LABEL_FONT_BASE = 24;
export const PROMO_LABEL_LETTER_SPACING_BASE = 6;
export const PROMO_LABEL_TO_PILL_GAP_BASE = 17;

// Stories layer (1080x1920 base) — full pill, offset from bottom
export const STORIES_PROMO_FONT_BASE = 66;
export const STORIES_BOTTOM_PAD_BASE = 122;
export const STORIES_PROMO_PILL_W_BASE = 1920;
export const STORIES_PROMO_PILL_H_BASE = 96;
export const STORIES_PROMO_LABEL_FONT_BASE = 32;
export const STORIES_PROMO_LABEL_LETTER_SPACING_BASE = 3;
export const STORIES_PROMO_LABEL_TO_PILL_GAP_BASE = 13;
export const STORIES_PROMO_BOTTOM_PAD_BASE = 108;

// Colors
export const PROMO_PILL_BORDER_COLOR = '#526a11';
export const PROMO_PILL_GRADIENT_STOPS: (number | string)[] = [
  0, '#FFD24C',
  0.4, '#FFD24C',
  0.6, '#FFD24C',
  1, '#FFD24C',
];
export const PROMO_PILL_FILL_COLOR = '#f2b705';
export const PROMO_LABEL_COLOR = '#FFBF00';
export const STORIES_PROMO_LABEL_COLOR = '#FFBF00';

// Label text-shadow (CSS: 0 4px 4px 0 rgba(0, 0, 0, 0.45)).
// Offsets and blur are in BASE_SIZE units; the layer scales them along with the font.
export const PROMO_LABEL_SHADOW_COLOR = '#000000';
export const PROMO_LABEL_SHADOW_OFFSET_X_BASE = 0;
export const PROMO_LABEL_SHADOW_OFFSET_Y_BASE = 4;
export const PROMO_LABEL_SHADOW_BLUR_BASE = 4;
export const PROMO_LABEL_SHADOW_OPACITY = 0.45;
