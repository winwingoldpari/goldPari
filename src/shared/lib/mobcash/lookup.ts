import type { MobcashEntry } from '@/shared/store/app-store';

export const findMobcashEntry = (
  code: string,
  entries: MobcashEntry[],
): MobcashEntry | null => {
  const trimmed = code.trim();
  if (!trimmed) return null;

  const exact = entries.find((e) => e.code === trimmed);
  if (exact) return exact;

  const lower = trimmed.toLowerCase();
  return entries.find((e) => e.code.toLowerCase() === lower) ?? null;
};
