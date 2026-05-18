import type { FilterEntry } from '@/shared/store/app-store';

export const MOBCASH_CATEGORY_NAME = 'mobcash';

export const isMobcashSelected = (
  categories: FilterEntry[],
  selectedCategoryIds: string[] | null,
): boolean => {
  if (!selectedCategoryIds || selectedCategoryIds.length === 0) return false;
  return selectedCategoryIds.some(
    (id) => categories.find((c) => c.id === id)?.title?.toLowerCase() === MOBCASH_CATEGORY_NAME,
  );
};
