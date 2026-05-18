export type UploadDate = 'today' | 'this-week' | 'earlier';

export const UPLOAD_DATE_OPTIONS: ReadonlyArray<{ label: string; value: UploadDate }> = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'this-week' },
  { label: 'Earlier', value: 'earlier' },
];

export function getUploadDateRange(value: UploadDate | null | undefined): {
  publishedAtGte?: string;
  publishedAtLt?: string;
} {
  if (!value) return {};

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (value === 'today') {
    return { publishedAtGte: startOfToday.toISOString() };
  }
  if (value === 'this-week') {
    return { publishedAtGte: sevenDaysAgo.toISOString() };
  }

  return {};
}
