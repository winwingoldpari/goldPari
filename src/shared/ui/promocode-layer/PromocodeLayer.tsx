import { Group, Path, Rect, Text } from 'react-konva';
import {
  BASE_SIZE,
  buildPromoBorderPath,
  calculatePromoLayout,
  PROMO_LABEL_SHADOW_BLUR_BASE,
  PROMO_LABEL_SHADOW_COLOR,
  PROMO_LABEL_SHADOW_OFFSET_X_BASE,
  PROMO_LABEL_SHADOW_OFFSET_Y_BASE,
  PROMO_LABEL_SHADOW_OPACITY,
  PROMO_PILL_BORDER_COLOR,
  PROMO_PILL_FILL_COLOR,
} from '@/shared/lib/konva';

interface PromocodeLayerProps {
  stageWidth: number;
  stageHeight: number;
  promocode: string;
  promocodeLabel: string;
  visible?: boolean;
  isMobcash?: boolean;
  isEvents?: boolean;
  pillChromeHidden?: boolean;
}

export const PromocodeLayer = ({
  stageWidth,
  stageHeight,
  promocode,
  promocodeLabel,
  visible = true,
  isMobcash = false,
  isEvents = false,
  pillChromeHidden = false,
}: PromocodeLayerProps) => {
  const layout = calculatePromoLayout(stageWidth, stageHeight, promocode, isMobcash, isEvents, pillChromeHidden);
  const shadowScale = Math.max(1, stageWidth) / BASE_SIZE;

  return (
    <Group visible={visible}>
      <Text
        text={promocodeLabel}
        x={0}
        y={layout.labelY}
        width={stageWidth}
        fontSize={layout.labelFontSize}
        fontFamily="Montserrat"
        fontStyle="500"
        fill={layout.labelColor}
        align="center"
        letterSpacing={layout.labelLetterSpacing}
        shadowColor={PROMO_LABEL_SHADOW_COLOR}
        shadowBlur={PROMO_LABEL_SHADOW_BLUR_BASE * shadowScale}
        shadowOffsetX={PROMO_LABEL_SHADOW_OFFSET_X_BASE * shadowScale}
        shadowOffsetY={PROMO_LABEL_SHADOW_OFFSET_Y_BASE * shadowScale}
        shadowOpacity={PROMO_LABEL_SHADOW_OPACITY}
        visible={layout.showLabel}
      />
      <Rect
        name="promo-pill"
        x={layout.pillX}
        y={layout.pillY}
        width={layout.pillW}
        height={layout.pillH}
        cornerRadius={layout.cornerRadius}
        fill={PROMO_PILL_FILL_COLOR}
        stroke={layout.isStories ? PROMO_PILL_BORDER_COLOR : undefined}
        strokeWidth={layout.isStories ? layout.pillBorder : undefined}
        visible={layout.showPill}
      />
      <Path
        name="promo-border"
        data={buildPromoBorderPath(layout)}
        stroke={PROMO_PILL_BORDER_COLOR}
        strokeWidth={layout.pillBorder}
        lineJoin="round"
        visible={layout.showBorder}
      />
      <Text
        name="promo-text"
        text={promocode}
        x={layout.pillX}
        y={layout.pillY}
        width={layout.pillW}
        height={layout.pillH}
        fontSize={layout.pillFontSize}
        fontFamily="Montserrat"
        fontStyle="800"
        fill={layout.promoTextFill}
        align="center"
        verticalAlign="middle"
        visible={Boolean(promocode)}
      />
    </Group>
  );
};
