import { useEffect, useState } from 'react';
import { calculateImageScale } from '@/shared/lib/konva';

interface ImageScale {
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
}

const INITIAL: ImageScale = { scaleX: 1, scaleY: 1, x: 0, y: 0 };

export const useImageScale = (
  image: HTMLImageElement | null,
  stageWidth: number,
  stageHeight: number,
): ImageScale => {
  const [imageScale, setImageScale] = useState<ImageScale>(INITIAL);

  useEffect(() => {
    if (!image || stageWidth <= 0 || stageHeight <= 0) return;
    const next = calculateImageScale(image, stageWidth, stageHeight);
    setImageScale((prev) =>
      prev.scaleX !== next.scaleX ||
      prev.scaleY !== next.scaleY ||
      prev.x !== next.x ||
      prev.y !== next.y
        ? next
        : prev,
    );
  }, [image, stageWidth, stageHeight]);

  return imageScale;
};
