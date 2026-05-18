import { Group, Rect, Text } from 'react-konva';
import {
  BASE_SIZE,
  calculateMobcashLayout,
  MOBCASH_BOX_FILL,
  MOBCASH_CITY_BOX_NAME,
  MOBCASH_CITY_VALUE_NAME,
  MOBCASH_COLOR,
  MOBCASH_LABEL_FONT_FAMILY,
  MOBCASH_LABEL_FONT_STYLE,
  MOBCASH_LABEL_LETTER_SPACING_BASE,
  MOBCASH_OVERLAY_GROUP_NAME,
  MOBCASH_STREET_BOX_NAME,
  MOBCASH_STREET_VALUE_NAME,
  MOBCASH_VALUE_FONT_FAMILY,
  MOBCASH_VALUE_FONT_STYLE,
  MOBCASH_VALUE_TEXT_COLOR,
} from '@/shared/lib/konva';

interface MobcashOverlayProps {
  stageWidth: number;
  stageHeight: number;
  city: string;
  street: string;
  visible?: boolean;
}

export const MobcashOverlay = ({
  stageWidth,
  stageHeight,
  city,
  street,
  visible = true,
}: MobcashOverlayProps) => {
  const cityDisplay = city.toUpperCase();
  const streetDisplay = street.toUpperCase();
  const layout = calculateMobcashLayout(stageWidth, stageHeight, cityDisplay, streetDisplay);
  const scale = Math.max(1, stageWidth) / BASE_SIZE;
  const labelLetterSpacing = MOBCASH_LABEL_LETTER_SPACING_BASE * scale;

  return (
    <Group name={MOBCASH_OVERLAY_GROUP_NAME} visible={visible}>
      <Text
        text="CITY:"
        x={layout.city.labelX}
        y={layout.city.labelY}
        width={layout.city.labelW}
        fontSize={layout.city.labelFontSize}
        fontFamily={MOBCASH_LABEL_FONT_FAMILY}
        fontStyle={MOBCASH_LABEL_FONT_STYLE}
        fill={MOBCASH_COLOR}
        letterSpacing={labelLetterSpacing}
        align="left"
      />
      <Rect
        name={MOBCASH_CITY_BOX_NAME}
        x={layout.city.boxX}
        y={layout.city.boxY}
        width={layout.city.boxW}
        height={layout.city.boxH}
        cornerRadius={layout.city.boxRadius}
        fill={MOBCASH_BOX_FILL}
      />
      <Text
        name={MOBCASH_CITY_VALUE_NAME}
        text={cityDisplay}
        x={layout.city.valueX}
        y={layout.city.boxY}
        width={layout.city.valueW}
        height={layout.city.boxH}
        fontSize={layout.city.valueFontSize}
        fontFamily={MOBCASH_VALUE_FONT_FAMILY}
        fontStyle={MOBCASH_VALUE_FONT_STYLE}
        fill={MOBCASH_VALUE_TEXT_COLOR}
        align="left"
        verticalAlign="middle"
      />

      <Text
        text="STREET:"
        x={layout.street.labelX}
        y={layout.street.labelY}
        width={layout.street.labelW}
        fontSize={layout.street.labelFontSize}
        fontFamily={MOBCASH_LABEL_FONT_FAMILY}
        fontStyle={MOBCASH_LABEL_FONT_STYLE}
        fill={MOBCASH_COLOR}
        letterSpacing={labelLetterSpacing}
        align="left"
      />
      <Rect
        name={MOBCASH_STREET_BOX_NAME}
        x={layout.street.boxX}
        y={layout.street.boxY}
        width={layout.street.boxW}
        height={layout.street.boxH}
        cornerRadius={layout.street.boxRadius}
        fill={MOBCASH_BOX_FILL}
      />
      <Text
        name={MOBCASH_STREET_VALUE_NAME}
        text={streetDisplay}
        x={layout.street.valueX}
        y={layout.street.boxY}
        width={layout.street.valueW}
        height={layout.street.boxH}
        fontSize={layout.street.valueFontSize}
        fontFamily={MOBCASH_VALUE_FONT_FAMILY}
        fontStyle={MOBCASH_VALUE_FONT_STYLE}
        fill={MOBCASH_VALUE_TEXT_COLOR}
        align="left"
        verticalAlign="middle"
      />
    </Group>
  );
};
