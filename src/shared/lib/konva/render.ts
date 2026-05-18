import type Konva from 'konva';

/**
 * Подготавливает контексты для высокого качества рендеринга
 */
export const prepareContextsForHQ = (stage: Konva.Stage | null) => {
  const layers = stage?.getLayers?.() ?? [];
  layers.forEach((layer) => {
    const ctx = layer.getContext()._context;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  });
};

/**
 * Создает dataURL с fallback для Safari
 */
export const createDataURL = (stage: Konva.Stage, pixelRatio: number) => {
  try {
    return stage.toDataURL({
      pixelRatio,
      mimeType: 'image/png',
      quality: 1,
    });
  } catch (error) {
    console.warn('Safari fallback for toDataURL:', error);
    return stage.toDataURL();
  }
};
