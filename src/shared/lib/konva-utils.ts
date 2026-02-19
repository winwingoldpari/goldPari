/**
 * Утилиты для работы с Konva
 */

export const BASE_SIZE = 1080;
export const PROMO_FONT_BASE = 50;
export const BOTTOM_PAD_BASE = 15;
export const STORIES_HEIGHT_BASE = 1920;
export const STORIES_PROMO_FONT_BASE = 66;
export const STORIES_BOTTOM_PAD_BASE = 122;
export const MAX_EXPORT_RATIO = 12;
const STORIES_ASPECT_RATIO = STORIES_HEIGHT_BASE / BASE_SIZE;
const STORIES_ASPECT_TOLERANCE = 0.05;

const isStoriesLayout = (stageWidth: number, stageHeight: number) => {
  if (stageWidth <= 0 || stageHeight <= 0) return false;
  const ratio = stageHeight / stageWidth;
  return Math.abs(ratio - STORIES_ASPECT_RATIO) <= STORIES_ASPECT_TOLERANCE;
};

/**
 * Подготавливает контексты для высокого качества рендеринга
 */
export const prepareContextsForHQ = (stageRef: any) => {
  const layers = stageRef?.getLayers?.() ?? [];
  layers.forEach((l: any) => {
    const ctx = l.getContext()._context as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = true;
    (ctx as any).imageSmoothingQuality = 'high';
  });
};

/**
 * Вычисляет размеры изображения для адаптивного отображения
 */
export const calculateImageScale = (
  image: HTMLImageElement,
  stageWidth: number,
  stageHeight: number
) => {
  const safeImgWidth = Math.max(1, image.width);
  const safeImgHeight = Math.max(1, image.height);
  const safeStageWidth = Math.max(1, stageWidth);
  const safeStageHeight = Math.max(1, stageHeight);
  const scale = Math.min(safeStageWidth / safeImgWidth, safeStageHeight / safeImgHeight);
  const scaledWidth = safeImgWidth * scale;
  const scaledHeight = safeImgHeight * scale;
  const x = (safeStageWidth - scaledWidth) / 2;
  const y = (safeStageHeight - scaledHeight) / 2;
  
  return { scaleX: scale, scaleY: scale, x, y };
};

/**
 * Вычисляет пропорциональные размеры для промокода
 */
export const calculatePromoDimensions = (stageWidth: number, stageHeight: number) => {
  const safeStageWidth = Math.max(1, stageWidth);
  const isStories = isStoriesLayout(safeStageWidth, stageHeight);

  const promoFontBase = isStories ? STORIES_PROMO_FONT_BASE : PROMO_FONT_BASE;
  const bottomPadBase = isStories ? STORIES_BOTTOM_PAD_BASE : BOTTOM_PAD_BASE;

  const promoFontSize = Math.max(1, safeStageWidth * (promoFontBase / BASE_SIZE));
  const bottomPad = safeStageWidth * (bottomPadBase / BASE_SIZE);
  
  return { promoFontSize, bottomPad };
};

/**
 * Получает целевой размер для экспорта
 */
export const getTargetSize = (
  image: HTMLImageElement | null,
  responsiveImage?: { width: number; height: number }
) => {
  const propW = responsiveImage?.width;
  const propH = responsiveImage?.height;

  const natW = image?.width;
  const natH = image?.height;

  const w = propW ?? natW ?? BASE_SIZE;
  const h = propH ?? natH ?? BASE_SIZE;

  return { w, h };
};

/**
 * Создает dataURL с fallback для Safari
 */
export const createDataURL = (stageRef: any, pixelRatio: number) => {
  try {
    return stageRef.toDataURL({
      pixelRatio,
      mimeType: 'image/png',
      quality: 1,
    });
  } catch (error) {
    console.warn('Safari fallback for toDataURL:', error);
    return stageRef.toDataURL();
  }
};
