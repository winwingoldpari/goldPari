/**
 * Утилиты для работы с ZIP архивами
 */

import JSZip from 'jszip';
import { BASE_SIZE, createDataURL, calculatePromoDimensions } from './konva-utils';
import { handleDownloadError, showSuccess } from './toast';

interface BannerItem {
  id: string;
  title: string;
  image?: {
    responsiveImage?: {
      width: number;
      height: number;
    };
  };
}

/**
 * Создает ZIP архив со всеми баннерами
 */
export const createBannersZip = async (
  data: BannerItem[],
  stageRefs: { [key: string]: any },
  promoCodes: string[] = []
): Promise<void> => {
  if (data.length === 0) return;

  const zip = new JSZip();
  const codes = promoCodes.length > 0 ? promoCodes : [''];

  try {
    const promises = data.map(async (item, index) => {
      const stageRef = stageRefs[item.id];
      if (!stageRef) return;

      const propW = item.image?.responsiveImage?.width;
      const fallback = BASE_SIZE;
      const targetW = propW ?? fallback;
      const pixelRatio = Math.max(1, Math.min(16, targetW / stageRef.width()));
      const stageWidth = stageRef.width();
      const stageHeight = stageRef.height();
      const { bottomPad } = calculatePromoDimensions(stageWidth, stageHeight);
      const promoNode = stageRef.findOne?.('.promo-text');
      const original = promoNode
        ? {
            text: promoNode.text(),
            offsetX: promoNode.offsetX(),
            y: promoNode.y(),
            visible: promoNode.visible(),
          }
        : null;

      const titleSafe = item.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40) || 'banner';

      codes.forEach((code, codeIndex) => {
        if (promoNode) {
          const nextText = code ?? '';
          promoNode.text(nextText);
          const w = promoNode.width();
          const h = promoNode.height();
          promoNode.offsetX(w / 2);
          promoNode.y(stageHeight - bottomPad - h);
          promoNode.visible(Boolean(nextText));
          promoNode.getLayer()?.batchDraw();
        }

        const dataURL = createDataURL(stageRef, pixelRatio);
        const base64Data = dataURL.split(',')[1];
        const codeSafe = code ? code.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40) : '';
        const codePart = codeSafe ? `_${codeSafe}` : '';
        const fileName = `${titleSafe}_${index + 1}-${codeIndex + 1}${codePart}.png`;
        zip.file(fileName, base64Data, { base64: true });
      });

      if (promoNode && original) {
        promoNode.text(original.text);
        promoNode.offsetX(original.offsetX);
        promoNode.y(original.y);
        promoNode.visible(original.visible);
        promoNode.getLayer()?.batchDraw();
      }
    });

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `casino-banners-${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    URL.revokeObjectURL(url);

    showSuccess(`All ${data.length * codes.length} banners downloaded successfully!`);
  } catch (error) {
    console.error('Error creating zip:', error);
    handleDownloadError(error, 'banners archive');
    throw error;
  }
};
