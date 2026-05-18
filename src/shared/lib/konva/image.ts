import { BASE_SIZE, STORIES_ASPECT_RATIO, STORIES_ASPECT_TOLERANCE } from './constants';

export const isStoriesLayout = (stageWidth: number, stageHeight: number) => {
  if (stageWidth <= 0 || stageHeight <= 0) return false;
  const ratio = stageHeight / stageWidth;
  return Math.abs(ratio - STORIES_ASPECT_RATIO) <= STORIES_ASPECT_TOLERANCE;
};

/**
 * Вычисляет размеры изображения для адаптивного отображения
 */
export const calculateImageScale = (
  image: HTMLImageElement,
  stageWidth: number,
  stageHeight: number,
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
 * Получает целевой размер для экспорта
 */
export const getTargetSize = (
  image: HTMLImageElement | null,
  responsiveImage?: { width: number; height: number },
) => {
  const propW = responsiveImage?.width;
  const propH = responsiveImage?.height;

  const natW = image?.width;
  const natH = image?.height;

  const w = propW ?? natW ?? BASE_SIZE;
  const h = propH ?? natH ?? BASE_SIZE;

  return { w, h };
};
