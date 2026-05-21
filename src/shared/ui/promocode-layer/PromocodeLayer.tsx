import { Group, Rect, Text } from 'react-konva';
import {
  BASE_SIZE,
  calculatePromoLayout,
  PROMO_LABEL_SHADOW_BLUR_BASE,
  PROMO_LABEL_SHADOW_COLOR,
  PROMO_LABEL_SHADOW_OFFSET_X_BASE,
  PROMO_LABEL_SHADOW_OFFSET_Y_BASE,
  PROMO_LABEL_SHADOW_OPACITY,
  PROMO_PILL_FILL_COLOR,
  PROMO_PILL_GRADIENT_STOPS,
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
        name="promo-back"
        x={layout.backX}
        y={layout.backY}
        width={layout.backW}
        height={layout.backH}
        cornerRadius={layout.backCornerRadius}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: layout.backW, y: 0 }}
        fillLinearGradientColorStops={PROMO_PILL_GRADIENT_STOPS}
        visible={layout.showBack}
      />
      <Rect
        name="promo-pill"
        x={layout.pillX}
        y={layout.pillY}
        width={layout.pillW}
        height={layout.pillH}
        cornerRadius={layout.cornerRadius}
        fill={PROMO_PILL_FILL_COLOR}
        visible={layout.showPill}
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
