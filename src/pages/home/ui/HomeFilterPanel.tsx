import { useMemo } from 'react';
import { ChipsGroup, CustomSelect } from '@/shared/ui';
import { useFilters } from '@/shared/hooks';
import { UPLOAD_DATE_OPTIONS } from '@/shared/lib/upload-date';
import { sortLanguageOptions } from '@/shared/lib/language-sort';
import type { Mode } from '../model/types';
import { ModeTabs } from './ModeTabs';
import { PromocodeBlock } from './PromocodeBlock';

const FORMAT_OPTIONS = [
  { label: 'Square', value: 'square' },
  { label: 'Stories', value: 'stories' },
];

interface ScopeGroup {
  label: string;
  modeIds: { mode: Mode; id: string }[];
}

const groupByLabel = (
  buckets: Array<{ mode: Mode; items: { id: string; title?: string | null }[] }>,
): ScopeGroup[] => {
  const map = new Map<string, ScopeGroup>();
  for (const { mode, items } of buckets) {
    for (const it of items) {
      const label = (it.title ?? '').trim();
      if (!label) continue;
      let g = map.get(label);
      if (!g) {
        g = { label, modeIds: [] };
        map.set(label, g);
      }
      g.modeIds.push({ mode, id: it.id });
    }
  }
  return Array.from(map.values());
};

interface HomeFilterPanelProps {
  modes: Mode[];
  promocode: string;
  onPromocodeChange: (next: string) => void;
  promocodeEnabled: boolean;
  onPromocodeEnabledChange: (next: boolean) => void;
}

export const HomeFilterPanel = ({
  modes,
  promocode,
  onPromocodeChange,
  promocodeEnabled,
  onPromocodeEnabledChange,
}: HomeFilterPanelProps) => {
  const {
    locations,
    creativeFormats,
    casinoTypes,
    sportTypes,
    categories,
    categorySports,
    universalCategories,
    selectedLocation,
    selectedCreativeFormat,
    selectedFormat,
    selectedUploadDate,
    selectedCasinoType,
    selectedSportType,
    selectedCategory,
    selectedCategorySport,
    selectedUniversalCategory,
    setSelectedLocation,
    setSelectedCreativeFormat,
    setSelectedFormat,
    setSelectedUploadDate,
    setSelectedCasinoType,
    setSelectedSportType,
    setSelectedCategory,
    setSelectedCategorySport,
    setSelectedUniversalCategory,
  } = useFilters();

  const showCasino = modes.includes('casino');
  const showSport = modes.includes('sport');
  const showUniversal = modes.includes('universal');

  const locationOptions = useMemo(
    () => sortLanguageOptions(locations.map((l) => ({ label: l.title ?? '', value: l.id }))),
    [locations],
  );
  const creativeFormatOptions = useMemo(
    () => creativeFormats.map((f) => ({ label: f.title ?? '', value: f.id })),
    [creativeFormats],
  );

  const typeGroups = useMemo<ScopeGroup[]>(
    () =>
      groupByLabel([
        ...(showCasino ? [{ mode: 'casino' as const, items: casinoTypes }] : []),
        ...(showSport ? [{ mode: 'sport' as const, items: sportTypes }] : []),
      ]),
    [showCasino, showSport, casinoTypes, sportTypes],
  );

  const typeOptions = useMemo(
    () => typeGroups.map((g) => ({ label: g.label, value: g.label })),
    [typeGroups],
  );

  const typeValue = useMemo(
    () =>
      typeGroups
        .filter((g) =>
          g.modeIds.some(
            ({ mode, id }) =>
              (mode === 'casino' && (selectedCasinoType ?? []).includes(id)) ||
              (mode === 'sport' && (selectedSportType ?? []).includes(id)),
          ),
        )
        .map((g) => g.label),
    [typeGroups, selectedCasinoType, selectedSportType],
  );

  const setTypeValue = (nextLabels: string[]) => {
    const selected = new Set(nextLabels);
    const casino: string[] = [];
    const sport: string[] = [];
    for (const g of typeGroups) {
      if (!selected.has(g.label)) continue;
      for (const { mode, id } of g.modeIds) {
        if (mode === 'casino') casino.push(id);
        else if (mode === 'sport') sport.push(id);
      }
    }
    if (showCasino) setSelectedCasinoType(casino.length ? casino : null);
    if (showSport) setSelectedSportType(sport.length ? sport : null);
  };

  const categoryGroups = useMemo<ScopeGroup[]>(
    () =>
      groupByLabel([
        ...(showCasino ? [{ mode: 'casino' as const, items: categories }] : []),
        ...(showSport ? [{ mode: 'sport' as const, items: categorySports }] : []),
        ...(showUniversal ? [{ mode: 'universal' as const, items: universalCategories }] : []),
      ]),
    [showCasino, showSport, showUniversal, categories, categorySports, universalCategories],
  );

  const categoryOptions = useMemo(
    () => categoryGroups.map((g) => ({ label: g.label, value: g.label })),
    [categoryGroups],
  );

  const categoryValue = useMemo(
    () =>
      categoryGroups
        .filter((g) =>
          g.modeIds.some(
            ({ mode, id }) =>
              (mode === 'casino' && (selectedCategory ?? []).includes(id)) ||
              (mode === 'sport' && (selectedCategorySport ?? []).includes(id)) ||
              (mode === 'universal' && (selectedUniversalCategory ?? []).includes(id)),
          ),
        )
        .map((g) => g.label),
    [categoryGroups, selectedCategory, selectedCategorySport, selectedUniversalCategory],
  );

  const setCategoryValue = (nextLabels: string[]) => {
    const selected = new Set(nextLabels);
    const casino: string[] = [];
    const sport: string[] = [];
    const universal: string[] = [];
    for (const g of categoryGroups) {
      if (!selected.has(g.label)) continue;
      for (const { mode, id } of g.modeIds) {
        if (mode === 'casino') casino.push(id);
        else if (mode === 'sport') sport.push(id);
        else if (mode === 'universal') universal.push(id);
      }
    }
    if (showCasino) setSelectedCategory(casino);
    if (showSport) setSelectedCategorySport(sport.length ? sport : null);
    if (showUniversal) setSelectedUniversalCategory(universal.length ? universal : null);
  };

  return (
    <div className="mt-19 md:mt-10 xl:mt-20 2xl:mt-25  relative bg-[linear-gradient(90deg,#232121_0%,#000_100%)] rounded-[20px] flex flex-col md:gap-7 gap-2 xl:py-12.5 2xl:px-18.5 xl:px-23 p-6">
      <div className="md:hidden text-white text-[14px] font-medium leading-[100%]">Select</div>
      <div className="grid grid-cols-2 2xl:gap-15 xl:gap-30 md:gap-8 gap-4.5 gap-y-2 w-full">
        <div className="contents md:flex md:flex-col md:gap-7">
          <ModeTabs />
          {creativeFormatOptions.length > 0 && (
            <ChipsGroup
              label="Choose the creative format"
              mobileLabel="Format"
              options={creativeFormatOptions}
              mode="multiple"
              value={selectedCreativeFormat ?? []}
              onChange={(value) => {
                const next = Array.isArray(value) ? value.map(String) : [];
                setSelectedCreativeFormat(next.length ? next : null);
              }}
            />
          )}
          {typeOptions.length > 0 && (
            <ChipsGroup
              label="Choose the banner type"
              mobileLabel="Type"
              options={typeOptions}
              mode="multiple"
              value={typeValue}
              onChange={(value) => {
                const arr = Array.isArray(value) ? value.map(String) : [];
                setTypeValue(arr);
              }}
            />
          )}
          {categoryOptions.length > 0 && (
            <ChipsGroup
              label="Choose the banner category"
              mobileLabel="Category"
              options={categoryOptions}
              mode="multiple"
              value={categoryValue}
              onChange={(value) => {
                const arr = Array.isArray(value) ? value.map(String) : [];
                setCategoryValue(arr);
              }}
            />
          )}
        </div>

        <div className="contents md:flex md:flex-col md:gap-7">
          <ChipsGroup
            label="Choose a format"
            mobileLabel="Size"
            options={FORMAT_OPTIONS}
            mode="single"
            value={selectedFormat}
            onChange={(value) => {
              const next = value === null ? null : String(Array.isArray(value) ? value[0] : value);
              setSelectedFormat(next);
            }}
          />
          <ChipsGroup
            label="Upload Date"
            mobileLabel="Date"
            options={UPLOAD_DATE_OPTIONS}
            mode="single"
            value={selectedUploadDate}
            onChange={(value) => {
              const next = value === null ? null : Array.isArray(value) ? value[0] ?? null : value;
              setSelectedUploadDate(next);
            }}
          />
          {locationOptions.length > 0 && (
            <div className="col-span-2 md:col-span-1 md:mt-0 mt-3">
              <CustomSelect
                label="Choose a language"
                options={locationOptions}
                placeholder="Select language"
                value={selectedLocation}
                searchable
                searchPlaceholder="Search language..."
                triggerClassName="max-w-[170px] md:max-w-[270px]"
                menuClassName="max-w-[170px] md:max-w-[270px]"
                onChange={(value) =>
                  setSelectedLocation(
                    value === null ? null : String(Array.isArray(value) ? value[0] : value),
                  )
                }
              />
            </div>
          )}
          <div className="col-span-2 md:col-span-1 md:mt-0 mt-3">
            <PromocodeBlock
              value={promocode}
              onChange={onPromocodeChange}
              enabled={promocodeEnabled}
              onEnabledChange={onPromocodeEnabledChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
