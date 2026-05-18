import type Konva from 'konva';
import { BASE_SIZE } from './constants';
import {
  EVENT_BAND_BOTTOM_Y_BASE,
  EVENT_BAND_TOP_Y_BASE,
  EVENT_OVERLAY_GROUP_NAME,
  EVENT_PROMO_Y_NUDGE_BASE,
} from './event-constants';
import { isStoriesLayout } from './image';
import { measureTextWidth } from './text-measure';
import {
  BOTTOM_PAD_BASE,
  PROMO_FONT_BASE,
  PROMO_LABEL_COLOR,
  PROMO_LABEL_FONT_BASE,
  PROMO_LABEL_LETTER_SPACING_BASE,
  PROMO_LABEL_TO_PILL_GAP_BASE,
  PROMO_PILL_BORDER_BASE,
  PROMO_PILL_H_BASE,
  PROMO_PILL_MIN_W_BASE,
  PROMO_PILL_RADIUS_BASE,
  PROMO_PILL_SIDE_PAD_BASE,
  PROMO_PILL_TEXT_PAD_BASE,
  STORIES_BOTTOM_PAD_BASE,
  STORIES_PROMO_BOTTOM_PAD_BASE,
  STORIES_PROMO_FONT_BASE,
  STORIES_PROMO_LABEL_COLOR,
  STORIES_PROMO_LABEL_FONT_BASE,
  STORIES_PROMO_LABEL_LETTER_SPACING_BASE,
  STORIES_PROMO_LABEL_TO_PILL_GAP_BASE,
  STORIES_PROMO_PILL_H_BASE,
  STORIES_PROMO_PILL_W_BASE,
} from './promo-constants';

export const calculatePromoDimensions = (stageWidth: number, stageHeight: number) => {
  const safeStageWidth = Math.max(1, stageWidth);
  const isStories = isStoriesLayout(safeStageWidth, stageHeight);

  const promoFontBase = isStories ? STORIES_PROMO_FONT_BASE : PROMO_FONT_BASE;
  const bottomPadBase = isStories ? STORIES_BOTTOM_PAD_BASE : BOTTOM_PAD_BASE;

  const promoFontSize = Math.max(1, safeStageWidth * (promoFontBase / BASE_SIZE));
  const bottomPad = safeStageWidth * (bottomPadBase / BASE_SIZE);

  return { promoFontSize, bottomPad };
};

export const PILL_CHROME_HIDDEN_ATTR = 'pillChromeHidden';

export const calculatePromoLayout = (
  stageWidth: number,
  stageHeight: number,
  promoText: string = '',
  isMobcash: boolean = false,
  isEvents: boolean = false,
  pillChromeHidden: boolean = false,
) => {
  const safeStageWidth = Math.max(1, stageWidth);
  const safeStageHeight = Math.max(1, stageHeight);
  const scale = safeStageWidth / BASE_SIZE;
  const isStories = isStoriesLayout(safeStageWidth, safeStageHeight);
  const isSquareMobcash = isMobcash && !isStories;

  const pillHBase = isStories ? STORIES_PROMO_PILL_H_BASE : PROMO_PILL_H_BASE;
  const pillBorderBase = isStories || isSquareMobcash ? 0 : PROMO_PILL_BORDER_BASE;
  const promoFontBase = isStories ? STORIES_PROMO_FONT_BASE : PROMO_FONT_BASE;
  const labelFontBase = isStories ? STORIES_PROMO_LABEL_FONT_BASE : PROMO_LABEL_FONT_BASE;
  const labelLetterSpacingBase = isStories ? STORIES_PROMO_LABEL_LETTER_SPACING_BASE : PROMO_LABEL_LETTER_SPACING_BASE;
  const labelGapBase = isStories ? STORIES_PROMO_LABEL_TO_PILL_GAP_BASE : PROMO_LABEL_TO_PILL_GAP_BASE;

  const pillH = pillHBase * scale;
  const pillFontSize = Math.max(1, promoFontBase * scale);

  let pillW: number;
  if (isStories) {
    pillW = STORIES_PROMO_PILL_W_BASE * scale;
  } else if (isSquareMobcash) {
    pillW = safeStageWidth;
  } else {
    const textW = measureTextWidth(promoText, pillFontSize);
    const target = textW + 2 * PROMO_PILL_TEXT_PAD_BASE * scale;
    const maxW = Math.max(1, safeStageWidth - 2 * PROMO_PILL_SIDE_PAD_BASE * scale);
    const minW = PROMO_PILL_MIN_W_BASE * scale;
    pillW = Math.min(maxW, Math.max(minW, target));
  }

  const pillRadius = isStories ? pillH / 2 : isSquareMobcash ? 0 : PROMO_PILL_RADIUS_BASE * scale;
  const pillBorder = pillBorderBase * scale;
  const pillX = (safeStageWidth - pillW) / 2;
  const bottomPad = isStories ? STORIES_PROMO_BOTTOM_PAD_BASE * scale : 0;
  const defaultPillY = safeStageHeight - bottomPad - pillH;

  const eventsBandCenterY = ((EVENT_BAND_TOP_Y_BASE + EVENT_BAND_BOTTOM_Y_BASE) / 2) * scale;
  const pillY = isEvents
    ? eventsBandCenterY - pillH / 2 + EVENT_PROMO_Y_NUDGE_BASE * scale
    : defaultPillY;
  const cornerRadius: [number, number, number, number] = isStories
    ? [pillRadius, pillRadius, pillRadius, pillRadius]
    : isSquareMobcash
      ? [0, 0, 0, 0]
      : [pillRadius, pillRadius, 0, 0];

  const labelFontSize = Math.max(1, labelFontBase * scale);
  const labelLetterSpacing = labelLetterSpacingBase * scale;
  const labelGap = labelGapBase * scale;
  const labelY = pillY - labelGap - labelFontSize - 2;
  const labelColor = isStories ? STORIES_PROMO_LABEL_COLOR : PROMO_LABEL_COLOR;

  // Events mode: pill / border / label hidden, promo-text rendered as plain black text
  // in the same x/y/width/height as the pill would have occupied.
  // pillChromeHidden mode (banners uploaded before the new-pill cutoff): same as events
  // for pill/label/border — the bare promo text is drawn over the old baked-in pill.
  const showPill = !isEvents && !pillChromeHidden;
  const showBorder = !isEvents && !pillChromeHidden && !isStories && !isSquareMobcash;
  const showLabel = !isEvents && !pillChromeHidden;
  const promoTextFill = isEvents || pillChromeHidden ? '#000000' : '#000';

  return {
    pillW,
    pillH,
    pillRadius,
    pillBorder,
    pillX,
    pillY,
    pillFontSize,
    labelFontSize,
    labelLetterSpacing,
    labelY,
    labelColor,
    isStories,
    isSquareMobcash,
    isEvents,
    cornerRadius,
    showPill,
    showBorder,
    showLabel,
    promoTextFill,
  };
};

export const buildPromoBorderPath = (layout: {
  pillX: number;
  pillY: number;
  pillW: number;
  pillH: number;
  pillRadius: number;
}): string => {
  const { pillX, pillY, pillW, pillH, pillRadius } = layout;
  return `M ${pillX},${pillY + pillH} L ${pillX},${pillY + pillRadius} A ${pillRadius},${pillRadius} 0 0 1 ${pillX + pillRadius},${pillY} L ${pillX + pillW - pillRadius},${pillY} A ${pillRadius},${pillRadius} 0 0 1 ${pillX + pillW},${pillY + pillRadius} L ${pillX + pillW},${pillY + pillH}`;
};

export const applyPromoCodeToStage = (stage: Konva.Stage | null, code: string) => {
  if (!stage) return;
  const stageWidth = stage.width();
  const stageHeight = stage.height();
  const isMobcash = Boolean(stage.findOne('.mobcash-overlay'));
  const isEvents = Boolean(stage.findOne(`.${EVENT_OVERLAY_GROUP_NAME}`));
  const pillChromeHidden = stage.getAttr(PILL_CHROME_HIDDEN_ATTR) === true;
  const layout = calculatePromoLayout(stageWidth, stageHeight, code, isMobcash, isEvents, pillChromeHidden);

  const textNode = stage.findOne<Konva.Text>('.promo-text');
  if (textNode) {
    textNode.text(code);
    textNode.x(layout.pillX);
    textNode.y(layout.pillY);
    textNode.width(layout.pillW);
    textNode.height(layout.pillH);
    textNode.fill(layout.promoTextFill);
    textNode.visible(Boolean(code));
  }

  const pillNode = stage.findOne<Konva.Rect>('.promo-pill');
  if (pillNode) {
    pillNode.x(layout.pillX);
    pillNode.width(layout.pillW);
    pillNode.cornerRadius(layout.cornerRadius);
    pillNode.visible(layout.showPill);
  }

  const borderNode = stage.findOne<Konva.Path>('.promo-border');
  if (borderNode) {
    if (!layout.showBorder) {
      borderNode.visible(false);
    } else {
      borderNode.visible(true);
      borderNode.data(buildPromoBorderPath(layout));
    }
  }

  textNode?.getLayer()?.batchDraw();
};
