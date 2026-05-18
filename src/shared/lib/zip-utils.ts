/**
 * Утилиты для работы с ZIP архивами
 */

import JSZip from 'jszip';
import type Konva from 'konva';
import {
  applyMobcashOverlayToStage,
  applyPromoCodeToStage,
  BASE_SIZE,
  captureOriginalMobcash,
  createDataURL,
} from './konva';
import { findMobcashEntry } from './mobcash';
import { useAppStore } from '@/shared/store/app-store';
import { handleDownloadError, showSuccess } from './toast';

type BannerKind = 'casino' | 'sport' | 'universal';

const KIND_FOLDER: Record<BannerKind, string> = {
  casino: 'Casino',
  sport: 'Sport',
  universal: 'Universal',
};

interface BannerItem {
  id: string;
  title?: string | null;
  kind?: BannerKind;
  image?: {
    responsiveImage?: {
      width: number;
      height: number;
    } | null;
  } | null;
}

export const createBannersZip = async (
  data: BannerItem[],
  stageRefs: Record<string, Konva.Stage>,
  promoCodes: string[] = []
): Promise<void> => {
  if (data.length === 0) return;

  const zip = new JSZip();
  const codes = promoCodes.length > 0 ? promoCodes : [''];

  const { mobcashEntries } = useAppStore.getState();

  // Determine if we should prefix files with mode folders.
  const distinctKinds = new Set(data.map((d) => d.kind).filter((k): k is BannerKind => Boolean(k)));
  const useFolders = distinctKinds.size >= 2;

  try {
    const promises = data.map(async (item, index) => {
      const stageRef = stageRefs[item.id];
      if (!stageRef) return;

      const propW = item.image?.responsiveImage?.width;
      const fallback = BASE_SIZE;
      const targetW = propW ?? fallback;
      const pixelRatio = Math.max(1, Math.min(16, targetW / stageRef.width()));
      const promoNode = stageRef.findOne<Konva.Text>('.promo-text');
      const originalText = promoNode?.text() ?? '';
      const originalMobcash = captureOriginalMobcash(stageRef);

      const titleSafe = (item.title ?? '').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40) || 'banner';
      const folderPrefix = useFolders && item.kind ? `${KIND_FOLDER[item.kind]}/` : '';

      codes.forEach((code, codeIndex) => {
        applyPromoCodeToStage(stageRef, code);
        applyMobcashOverlayToStage(stageRef, findMobcashEntry(code, mobcashEntries));

        const dataURL = createDataURL(stageRef, pixelRatio);
        const base64Data = dataURL.split(',')[1];
        const codeSafe = code ? code.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40) : '';
        const codePart = codeSafe ? `_${codeSafe}` : '';
        const fileName = `${folderPrefix}${titleSafe}_${index + 1}-${codeIndex + 1}${codePart}.png`;
        zip.file(fileName, base64Data, { base64: true });
      });

      applyPromoCodeToStage(stageRef, originalText);
      applyMobcashOverlayToStage(stageRef, originalMobcash);
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
