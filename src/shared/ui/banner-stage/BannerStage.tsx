import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type Konva from 'konva';
import { Image, Layer, Stage } from 'react-konva';
import { PILL_CHROME_HIDDEN_ATTR } from '@/shared/lib/konva';
import { PromocodeLayer } from '@/shared/ui/promocode-layer/PromocodeLayer';
import { MobcashOverlay } from '@/shared/ui/mobcash-overlay/MobcashOverlay';
import { EventOverlay } from '@/shared/ui/event-overlay';
import { useImageScale } from '@/shared/hooks/useImageScale';
import { useFontsReady } from '@/shared/hooks/useFontsReady';
import type { MobcashEntry } from '@/shared/store/app-store';
import type { EventCopy } from '@/shared/lib/event-i18n';

interface BannerStageProps {
  stageWidth: number;
  stageHeight: number;
  imageElement: HTMLImageElement | null;
  promocode: string;
  promocodeLabel: string;
  promocodeEnabled?: boolean;
  pillChromeHidden?: boolean;
  isMobcash?: boolean;
  mobcashEntry?: MobcashEntry | null;
  isEvents?: boolean;
  eventCopy?: EventCopy | null;
}

export const BannerStage = forwardRef<Konva.Stage, BannerStageProps>(
  (
    {
      stageWidth,
      stageHeight,
      imageElement,
      promocode,
      promocodeLabel,
      promocodeEnabled = true,
      pillChromeHidden = false,
      isMobcash = false,
      mobcashEntry = null,
      isEvents = false,
      eventCopy = null,
    },
    ref,
  ) => {
    const imageScale = useImageScale(imageElement, stageWidth, stageHeight);
    const fontsReady = useFontsReady();
    const stageRef = useRef<Konva.Stage | null>(null);

    useImperativeHandle(ref, () => stageRef.current as Konva.Stage, []);

    useEffect(() => {
      stageRef.current?.setAttr(PILL_CHROME_HIDDEN_ATTR, pillChromeHidden);
    }, [pillChromeHidden]);

    return (
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        className="w-full h-full md:rounded-2xl rounded-sm overflow-hidden"
      >
        <Layer>
          {imageElement && (
            <Image
              image={imageElement}
              x={imageScale.x}
              y={imageScale.y}
              scaleX={imageScale.scaleX}
              scaleY={imageScale.scaleY}
            />
          )}

          {fontsReady && isEvents && eventCopy && (
            <EventOverlay
              stageWidth={stageWidth}
              copy={eventCopy}
            />
          )}

          {fontsReady && (
            <PromocodeLayer
              stageWidth={stageWidth}
              stageHeight={stageHeight}
              promocode={promocode}
              promocodeLabel={promocodeLabel}
              visible={promocodeEnabled}
              isMobcash={isMobcash}
              isEvents={isEvents}
              pillChromeHidden={pillChromeHidden}
            />
          )}

          {fontsReady && isMobcash && (
            <MobcashOverlay
              stageWidth={stageWidth}
              stageHeight={stageHeight}
              city={mobcashEntry?.city ?? ''}
              street={mobcashEntry?.street ?? ''}
              visible={promocodeEnabled && mobcashEntry !== null}
            />
          )}
        </Layer>
      </Stage>
    );
  },
);

BannerStage.displayName = 'BannerStage';
