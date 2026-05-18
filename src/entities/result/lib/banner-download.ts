import type Konva from 'konva';
import {
  applyMobcashOverlayToStage,
  applyPromoCodeToStage,
  captureOriginalMobcash,
  createDataURL,
  MAX_EXPORT_RATIO,
  prepareContextsForHQ,
} from '@/shared/lib/konva';
import { findMobcashEntry } from '@/shared/lib/mobcash';
import { useAppStore } from '@/shared/store/app-store';
import { showSuccess } from '@/shared/lib/toast';
import { getActiveFiltersSnapshot } from '@/shared/lib/analytics';
import posthog from 'posthog-js';

const sanitizeFilePart = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);

export const createBannerFileName = (
  title: string | null | undefined,
  code: string | null,
  index: number,
  total: number,
) => {
  if (total <= 1) {
    return `${title}-banner.png`;
  }
  const titleSafe = sanitizeFilePart(title ?? '') || 'banner';
  const codeSafe = code ? sanitizeFilePart(code) : '';
  const codePart = codeSafe ? `_${codeSafe}` : '';
  return `${titleSafe}_${index + 1}${codePart}.png`;
};

const triggerDownload = (dataURL: string, fileName: string) => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataURL;
  link.click();
};

interface DownloadBannerArgs {
  stage: Konva.Stage | null;
  title: string | null | undefined;
  promocode: string;
  promoCodes: string[];
  stageWidth: number;
  targetWidth: number;
}

export const downloadBanner = ({
  stage,
  title,
  promocode,
  promoCodes,
  stageWidth,
  targetWidth,
}: DownloadBannerArgs) => {
  if (!stage) return;

  prepareContextsForHQ(stage);

  const safeStageWidth = Math.max(1, stageWidth);
  const pixelRatio = Math.max(1, Math.min(MAX_EXPORT_RATIO, targetWidth / safeStageWidth));

  const codes = promoCodes.length > 0 ? promoCodes : (promocode ? [promocode] : []);
  const total = codes.length || 1;

  if (codes.length <= 1) {
    const dataURL = createDataURL(stage, pixelRatio);
    triggerDownload(dataURL, createBannerFileName(title, codes[0] ?? null, 0, total));
    showSuccess(`Banner "${title}" downloaded successfully!`);
    posthog.capture('banner_downloaded', {
      banner_title: title,
      promocode_count: codes.length,
      has_promocode: codes.length > 0,
      ...getActiveFiltersSnapshot(),
    });
    return;
  }

  const { mobcashEntries } = useAppStore.getState();
  const originalMobcash = captureOriginalMobcash(stage);

  codes.forEach((code, index) => {
    applyPromoCodeToStage(stage, code);
    applyMobcashOverlayToStage(stage, findMobcashEntry(code, mobcashEntries));
    const dataURL = createDataURL(stage, pixelRatio);
    triggerDownload(dataURL, createBannerFileName(title, code, index, total));
  });

  applyPromoCodeToStage(stage, promocode);
  applyMobcashOverlayToStage(stage, originalMobcash);
  showSuccess(`Downloaded ${codes.length} banners for "${title}"!`);
  posthog.capture('banner_downloaded', {
    banner_title: title,
    promocode_count: codes.length,
    has_promocode: true,
    ...getActiveFiltersSnapshot(),
  });
};
