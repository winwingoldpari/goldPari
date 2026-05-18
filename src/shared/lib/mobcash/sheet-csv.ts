import type { MobcashEntry } from '@/shared/store/app-store';

const normaliseCell = (raw: string): string => {
  const trimmed = raw.trim();
  return trimmed === '-' ? '' : trimmed;
};

const findColumnIndex = (header: string[], pattern: RegExp, fallback: number): number => {
  const idx = header.findIndex((h) => pattern.test(h.trim()));
  return idx >= 0 ? idx : fallback;
};

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

export const parseSheetCsv = (text: string): MobcashEntry[] => {
  const rows = splitCsv(text.replace(/^\uFEFF/, ''));
  if (rows.length === 0) return [];

  const header = rows[0];
  const codeIdx = findColumnIndex(header, /^promocode/i, 0);
  const cityIdx = findColumnIndex(header, /^city/i, 1);
  const streetIdx = findColumnIndex(header, /^street/i, 2);

  return rows
    .slice(1)
    .map<MobcashEntry>((row) => ({
      code: normaliseCell(row[codeIdx] ?? ''),
      city: normaliseCell(row[cityIdx] ?? ''),
      street: normaliseCell(row[streetIdx] ?? ''),
    }))
    .filter((e) => e.code.length > 0);
};
