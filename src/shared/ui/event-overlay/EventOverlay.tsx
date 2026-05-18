import { Group, Text } from 'react-konva';
import {
  calculateEventLayout,
  EVENT_OVERLAY_GROUP_NAME,
  EVENT_TEXT_NODE_NAME,
} from '@/shared/lib/konva';
import type { EventCopy } from '@/shared/lib/event-i18n';
import { useFontLoadedFor } from '@/shared/hooks';

interface EventOverlayProps {
  stageWidth: number;
  copy: EventCopy;
  visible?: boolean;
}

export const EventOverlay = ({
  stageWidth,
  copy,
  visible = true,
}: EventOverlayProps) => {
  const fontLoaded = useFontLoadedFor(copy.fontFamily, copy.text);
  const layout = calculateEventLayout(stageWidth, copy.text.toUpperCase(), copy.fontFamily);
  const lineStepY = layout.fontSize * layout.lineHeight;

  return (
    <Group name={EVENT_OVERLAY_GROUP_NAME} visible={visible && fontLoaded}>
      {layout.lines.map((line, i) => (
        <Text
          key={i}
          name={EVENT_TEXT_NODE_NAME}
          text={line}
          x={layout.x}
          y={layout.y + i * lineStepY}
          width={layout.width}
          fontSize={layout.fontSize}
          fontFamily={layout.fontFamily}
          fontStyle={layout.fontWeight}
          fill={layout.fill}
          align="center"
        />
      ))}
    </Group>
  );
};
