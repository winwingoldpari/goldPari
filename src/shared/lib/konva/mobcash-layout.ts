import { BASE_SIZE } from './constants';
import { isStoriesLayout } from './image';
import { calculatePromoLayout } from './promo-layout';
import { measureTextWidth } from './text-measure';
import {
  MOBCASH_VALUE_FONT_FAMILY,
  MOBCASH_VALUE_FONT_STYLE,
  MOBCASH_VALUE_HORIZONTAL_PAD_BASE,
  MOBCASH_VALUE_MIN_FONT_RATIO,
  SQUARE_MOBCASH_BOX_H_BASE,
  SQUARE_MOBCASH_BOX_RADIUS_BASE,
  SQUARE_MOBCASH_BOX_STROKE_BASE,
  SQUARE_MOBCASH_GAP_BASE,
  SQUARE_MOBCASH_GAP_TO_PROMO_BASE,
  SQUARE_MOBCASH_LABEL_FONT_BASE,
  SQUARE_MOBCASH_LABEL_GAP_BASE,
  SQUARE_MOBCASH_SIDE_PAD_BASE,
  SQUARE_MOBCASH_VALUE_FONT_BASE,
  STORIES_MOBCASH_BOX_H_BASE,
  STORIES_MOBCASH_BOX_RADIUS_BASE,
  STORIES_MOBCASH_BOX_STROKE_BASE,
  STORIES_MOBCASH_GAP_BASE,
  STORIES_MOBCASH_GAP_TO_PROMO_BASE,
  STORIES_MOBCASH_LABEL_FONT_BASE,
  STORIES_MOBCASH_LABEL_GAP_BASE,
  STORIES_MOBCASH_TOTAL_W_BASE,
  STORIES_MOBCASH_VALUE_FONT_BASE,
} from './mobcash-constants';

export interface MobcashBoxLayout {
  boxX: number;
  boxY: number;
  boxW: number;
  boxH: number;
  boxRadius: number;
  boxStroke: number;
  labelX: number;
  labelY: number;
  labelW: number;
  labelFontSize: number;
  valueFontSize: number;
  valueX: number;
  valueW: number;
}

export interface MobcashLayout {
  isStories: boolean;
  city: MobcashBoxLayout;
  street: MobcashBoxLayout;
}

export const computeAutoShrinkFontSize = (
  text: string,
  baseFontSize: number,
  maxWidth: number,
): number => {
  if (!text || baseFontSize <= 0 || maxWidth <= 0) return baseFontSize;
  const measured = measureTextWidth(
    text,
    baseFontSize,
    MOBCASH_VALUE_FONT_STYLE,
    MOBCASH_VALUE_FONT_FAMILY,
  );
  if (measured <= maxWidth) return baseFontSize;
  const ratio = maxWidth / measured;
  const minFont = baseFontSize * MOBCASH_VALUE_MIN_FONT_RATIO;
  return Math.max(minFont, baseFontSize * ratio);
};

export const calculateMobcashLayout = (
  stageWidth: number,
  stageHeight: number,
  cityValue: string,
  streetValue: string,
): MobcashLayout => {
  const safeStageWidth = Math.max(1, stageWidth);
  const safeStageHeight = Math.max(1, stageHeight);
  const scale = safeStageWidth / BASE_SIZE;
  const isStories = isStoriesLayout(safeStageWidth, safeStageHeight);

  const promo = calculatePromoLayout(safeStageWidth, safeStageHeight, '');

  const boxHBase = isStories ? STORIES_MOBCASH_BOX_H_BASE : SQUARE_MOBCASH_BOX_H_BASE;
  const gapBase = isStories ? STORIES_MOBCASH_GAP_BASE : SQUARE_MOBCASH_GAP_BASE;
  const labelFontBase = isStories
    ? STORIES_MOBCASH_LABEL_FONT_BASE
    : SQUARE_MOBCASH_LABEL_FONT_BASE;
  const valueFontBase = isStories
    ? STORIES_MOBCASH_VALUE_FONT_BASE
    : SQUARE_MOBCASH_VALUE_FONT_BASE;
  const labelGapBase = isStories
    ? STORIES_MOBCASH_LABEL_GAP_BASE
    : SQUARE_MOBCASH_LABEL_GAP_BASE;
  const gapToPromoBase = isStories
    ? STORIES_MOBCASH_GAP_TO_PROMO_BASE
    : SQUARE_MOBCASH_GAP_TO_PROMO_BASE;
  const radiusBase = isStories
    ? STORIES_MOBCASH_BOX_RADIUS_BASE
    : SQUARE_MOBCASH_BOX_RADIUS_BASE;
  const strokeBase = isStories
    ? STORIES_MOBCASH_BOX_STROKE_BASE
    : SQUARE_MOBCASH_BOX_STROKE_BASE;

  const boxH = boxHBase * scale;
  const gap = gapBase * scale;
  const boxRadius = radiusBase * scale;
  const boxStroke = strokeBase * scale;
  const labelFontSize = Math.max(1, labelFontBase * scale);
  const valueFontBaseScaled = Math.max(1, valueFontBase * scale);
  const labelGap = labelGapBase * scale;
  const gapToPromo = gapToPromoBase * scale;
  const valuePad = MOBCASH_VALUE_HORIZONTAL_PAD_BASE * scale;

  const totalW = isStories
    ? Math.min(STORIES_MOBCASH_TOTAL_W_BASE * scale, safeStageWidth)
    : Math.max(1, safeStageWidth - 2 * SQUARE_MOBCASH_SIDE_PAD_BASE * scale);

  const boxW = (totalW - gap) / 2;
  const startX = (safeStageWidth - totalW) / 2;

  const boxY = promo.labelY - gapToPromo - boxH;
  const labelY = boxY - labelGap - labelFontSize + 1;

  const innerW = Math.max(1, boxW - 2 * valuePad);
  const cityFontSize = computeAutoShrinkFontSize(cityValue, valueFontBaseScaled, innerW);
  const streetFontSize = computeAutoShrinkFontSize(streetValue, valueFontBaseScaled, innerW);

  const cityBoxX = startX + 10;
  const cityBoxW = boxW - 10;
  const streetBoxX = startX + boxW + gap;
  const streetBoxW = boxW - 10;

  return {
    isStories,
    city: {
      boxX: cityBoxX,
      boxY,
      boxW: cityBoxW,
      boxH,
      boxRadius,
      boxStroke,
      labelX: startX + 14,
      labelY,
      labelW: cityBoxW,
      labelFontSize,
      valueFontSize: cityFontSize,
      valueX: cityBoxX + valuePad,
      valueW: Math.max(1, cityBoxW - 2 * valuePad),
    },
    street: {
      boxX: streetBoxX,
      boxY,
      boxW: streetBoxW,
      boxH,
      boxRadius,
      boxStroke,
      labelX: streetBoxX + 8,
      labelY,
      labelW: streetBoxW,
      labelFontSize,
      valueFontSize: streetFontSize,
      valueX: streetBoxX + valuePad,
      valueW: Math.max(1, streetBoxW - 2 * valuePad),
    },
  };
};
