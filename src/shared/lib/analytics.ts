import { useAppStore, type FilterEntry } from '@/shared/store/app-store';

const mapIdsToTitles = (ids: string[] | null, ...sources: FilterEntry[][]): string[] => {
  if (!ids?.length) return [];
  const merged = sources.flat();
  return ids.map((id) => merged.find((e) => e.id === id)?.title ?? id);
};

export const getActiveFiltersSnapshot = () => {
  const state = useAppStore.getState();
  const mode = new URLSearchParams(window.location.search).get('mode') ?? 'casino';

  const filterLocation = state.selectedLocation
    ? state.locations.find((l) => l.id === state.selectedLocation)?.title ?? state.selectedLocation
    : null;

  return {
    mode,
    filter_categories: mapIdsToTitles(state.selectedCategory, state.categories, state.categorySports),
    filter_location: filterLocation,
    filter_sport_types: mapIdsToTitles(state.selectedSportType, state.sportTypes),
    filter_creative_formats: mapIdsToTitles(state.selectedCreativeFormat, state.creativeFormats),
    filter_casino_types: mapIdsToTitles(state.selectedCasinoType, state.casinoTypes),
    filter_universal_categories: mapIdsToTitles(state.selectedUniversalCategory, state.universalCategories),
    filter_format: state.selectedFormat,
    filter_upload_date: state.selectedUploadDate,
  };
};
