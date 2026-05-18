import { useCallback, useEffect, useRef } from 'react';
import type Konva from 'konva';
import { getTargetSize } from '@/shared/lib/konva';
import { getPromocodeLabel } from '@/shared/lib/promocode-i18n';
import { isPromoPillAllowedForBanner } from '@/shared/lib/promocode';
import type { EventCopy } from '@/shared/lib/event-i18n';
import { BannerStage } from '@/shared/ui';
import type { MobcashEntry } from '@/shared/store/app-store';
import { DownloadBannerButton } from './DownloadBannerButton';
import { useBannerImage } from '../lib/useBannerImage';
import { useStageWidth } from '../lib/useStageWidth';
import { downloadBanner } from '../lib/banner-download';

interface BannerItemProps {
  id: string;
  title?: string | null;
  image?: {
    url: string;
    alt?: string | null;
    responsiveImage?: {
      width: number;
      height: number;
    } | null;
  } | null;
  publishedAt?: string | null;
  promocode: string;
  promoCodes: string[];
  promocodeEnabled?: boolean;
  language?: string | null;
  isMobcash?: boolean;
  mobcashEntry?: MobcashEntry | null;
  isEvents?: boolean;
  eventCopy?: EventCopy | null;
  onStageRef: (id: string, ref: Konva.Stage) => void;
}

export const BannerItem = ({
  id,
  title,
  image,
  publishedAt = null,
  promocode,
  promoCodes,
  promocodeEnabled = true,
  language = null,
  isMobcash = false,
  mobcashEntry = null,
  isEvents = false,
  eventCopy = null,
  onStageRef,
}: BannerItemProps) => {
  const promocodeLabel = getPromocodeLabel(language);
  const pillChromeHidden = !isPromoPillAllowedForBanner(publishedAt);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);

  const stageWidth = useStageWidth(containerRef);
  const imageElement = useBannerImage(image?.url);

  const { w: targetW, h: targetH } = getTargetSize(imageElement, image?.responsiveImage ?? undefined);
  const bannerAspectRatio = targetW > 0 && targetH > 0 ? targetH / targetW : 1;
  const stageHeight = Math.max(1, stageWidth * bannerAspectRatio);
  const previewAspectRatio = targetW > 0 && targetH > 0 ? `${targetW} / ${targetH}` : '1 / 1';

  const latestOnStageRef = useRef(onStageRef);
  useEffect(() => {
    latestOnStageRef.current = onStageRef;
  }, [onStageRef]);

  const setStageNode = useCallback(
    (node: Konva.Stage | null) => {
      stageRef.current = node;
      if (node) {
        latestOnStageRef.current(id, node);
      }
    },
    [id],
  );

  const handleDownload = () => {
    downloadBanner({
      stage: stageRef.current,
      title,
      promocode,
      promoCodes,
      stageWidth,
      targetWidth: targetW,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ aspectRatio: previewAspectRatio }}
    >
      <BannerStage
        ref={setStageNode}
        stageWidth={stageWidth}
        stageHeight={stageHeight}
        imageElement={imageElement}
        promocode={promocode}
        promocodeLabel={promocodeLabel}
        promocodeEnabled={promocodeEnabled}
        pillChromeHidden={pillChromeHidden}
        isMobcash={isMobcash}
        mobcashEntry={mobcashEntry}
        isEvents={isEvents}
        eventCopy={eventCopy}
      />

      <DownloadBannerButton title={title} onClick={handleDownload} />
    </div>
  );
};
