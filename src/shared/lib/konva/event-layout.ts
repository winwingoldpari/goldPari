import { BASE_SIZE } from './constants';
import {
  EVENT_BASE_FONT_SIZE,
  EVENT_BOTTOM_Y_BASE,
  EVENT_FONT_WEIGHT,
  EVENT_LINE_HEIGHT,
  EVENT_LINE_W_BASE,
  EVENT_LINE_Y_BASE,
  EVENT_MIN_FONT_SIZE,
  EVENT_SHRINK_STEP,
  EVENT_TEXT_COLOR,
  EVENT_TEXT_PAD_X_BASE,
  EVENT_TEXT_Y_NUDGE_BASE,
  EVENT_ZONE_PAD_Y_BASE,
} from './event-constants';
import { measureTextWidth } from './text-measure';

export interface EventLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  lineHeight: number;
  lines: string[];
}

const NBSP = '\u00A0';
const GLUE_MAX_LEN = 3;


const glueShortWords = (text: string): string => {
  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length <= 1) return tokens.join(' ');
  const out: string[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    out.push(tokens[i]);
    if (i < tokens.length - 1) {
      const tok = tokens[i];
      const isShort = tok.length <= GLUE_MAX_LEN && /^\p{L}+$/u.test(tok);
      out.push(isShort ? NBSP : ' ');
    }
  }
  return out.join('');
};

const wrapByWords = (
  text: string,
  fontSize: number,
  fontFamily: string,
  fontWeight: string,
  maxWidth: number,
): string[] => {
  const words = text.split(' ').filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    const w = measureTextWidth(candidate, fontSize, fontWeight, fontFamily);
    if (w <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
};

const longestLineWidth = (
  lines: string[],
  fontSize: number,
  fontFamily: string,
  fontWeight: string,
): number =>
  lines.reduce(
    (max, line) =>
      Math.max(max, measureTextWidth(line, fontSize, fontWeight, fontFamily)),
    0,
  );

export const calculateEventLayout = (
  stageWidth: number,
  rawText: string,
  fontFamily: string,
): EventLayout => {
  const safeStageWidth = Math.max(1, stageWidth);
  const scale = safeStageWidth / BASE_SIZE;

  const text = glueShortWords(rawText);

  const zoneWidth = (EVENT_LINE_W_BASE - 2 * EVENT_TEXT_PAD_X_BASE) * scale;
  const zoneHeight = (EVENT_BOTTOM_Y_BASE - EVENT_LINE_Y_BASE - 2 * EVENT_ZONE_PAD_Y_BASE) * scale;
  const x = (safeStageWidth - zoneWidth) / 2;
  const zoneCenterY = ((EVENT_LINE_Y_BASE + EVENT_BOTTOM_Y_BASE) / 2) * scale;

  const minFont = EVENT_MIN_FONT_SIZE * scale;
  let fontSize = EVENT_BASE_FONT_SIZE * scale;
  let lines: string[] = wrapByWords(text, fontSize, fontFamily, EVENT_FONT_WEIGHT, zoneWidth);

  for (let i = 0; i < 64 && fontSize > minFont; i += 1) {
    lines = wrapByWords(text, fontSize, fontFamily, EVENT_FONT_WEIGHT, zoneWidth);
    const widest = longestLineWidth(lines, fontSize, fontFamily, EVENT_FONT_WEIGHT);
    const totalH = lines.length * fontSize * EVENT_LINE_HEIGHT;
    if (widest <= zoneWidth && totalH <= zoneHeight) break;
    fontSize *= EVENT_SHRINK_STEP;
  }
  fontSize = Math.max(minFont, fontSize);
  lines = wrapByWords(text, fontSize, fontFamily, EVENT_FONT_WEIGHT, zoneWidth);

  const textHeight = lines.length * fontSize * EVENT_LINE_HEIGHT;
  const y = zoneCenterY - textHeight / 2 + EVENT_TEXT_Y_NUDGE_BASE * scale;

  return {
    x,
    y,
    width: zoneWidth,
    height: textHeight,
    fontSize,
    fontFamily,
    fontWeight: EVENT_FONT_WEIGHT,
    fill: EVENT_TEXT_COLOR,
    lineHeight: EVENT_LINE_HEIGHT,
    lines,
  };
};
