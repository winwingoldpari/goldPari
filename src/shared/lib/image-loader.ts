import { handleImageError } from './toast';

export const loadImageWithFallback = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve(img);
    };
    
    img.onerror = () => {
      console.warn('CORS failed, trying without CORS for:', url);

      const fallbackImg = new window.Image();
      fallbackImg.onload = () => {
        resolve(fallbackImg);
      };
      fallbackImg.onerror = () => {
        console.error('Failed to load image completely:', url);
        handleImageError(new Error(`Failed to load image: ${url}`), url);
        reject(new Error(`Failed to load image: ${url}`));
      };
      fallbackImg.src = url;
    };
    
    img.src = url;
  });
};

export const loadImageViaFetch = async (url: string): Promise<HTMLImageElement> => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const blob = await response.blob();
    const img = new window.Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to create image from blob'));
      img.src = URL.createObjectURL(blob);
    });
    } catch (error) {
      console.warn('Fetch failed, falling back to direct load:', error);
      handleImageError(error, url);
      return loadImageWithFallback(url);
    }
};

const createDatoCMSImageUrl = (url: string): string => {
  if (!url.includes('datocms-assets.com')) {
    return url;
  }
  
  const urlObj = new URL(url);
  urlObj.searchParams.set('auto', 'format');
  urlObj.searchParams.set('fit', 'crop');
  urlObj.searchParams.set('crop', 'faces,entropy');
  
  return urlObj.toString();
};


export const loadImage = async (url: string): Promise<HTMLImageElement> => {
  try {
    const optimizedUrl = createDatoCMSImageUrl(url);
    
    return await loadImageViaFetch(optimizedUrl);
  } catch {
    console.warn('Optimized URL failed, trying original:', url);
    
    try {
      return await loadImageViaFetch(url);
    } catch (fallbackError) {
      console.warn('All image loading methods failed for:', url);
      handleImageError(fallbackError, url);
      throw fallbackError;
    }
  }
};
