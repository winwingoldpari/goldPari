import { useEffect, useState } from 'react';
import { loadImage } from '@/shared/lib/image-loader';
import { handleImageError } from '@/shared/lib/toast';

export const useBannerImage = (url?: string) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    loadImage(url)
      .then((img: HTMLImageElement) => {
        if (!cancelled) setImageElement(img);
      })
      .catch((error: unknown) => {
        console.error('Failed to load image:', url, error);
        handleImageError(error, url);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return imageElement;
};
