import type { EventCopiesMap } from './types';

const splitCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (cell !== '' || row.length > 0) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      }
      if (ch === '\r' && text[i + 1] === '\n') i++;
    } else {
      cell += ch;
    }
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim().length > 0));
};

// Known typo in the published Google sheet: "Monserrat" → "Montserrat".
// Project only loads "Montserrat" and "Noto Sans Ethiopic"; without this,
// Konva silently falls back to a serif font for every non-Ethiopic row.
const normaliseFontFamily = (raw: string): string => {
  if (raw.trim().toLowerCase() === 'monserrat') return 'Montserrat';
  return raw;
};

export const parseEventCopySheetCsv = (text: string): EventCopiesMap => {
  const rows = splitCsv(text.replace(/^\uFEFF/, ''));
  const map: EventCopiesMap = {};

  for (const row of rows) {
    const language = (row[0] ?? '').trim();
    const copyText = (row[1] ?? '').trim();
    const fontFamily = normaliseFontFamily((row[2] ?? '').trim());

    if (!language || !copyText || !fontFamily) continue;

    map[language.toLowerCase()] = { text: copyText, fontFamily };
  }

  return map;
};
