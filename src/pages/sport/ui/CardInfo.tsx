import { ChipsGroup, CustomSelect } from '@/shared/ui';
import { Input } from '@/shared/ui/input/Input';
import { useMemo, useState } from 'react';
import imageUrl from "@/shared/assets/ball.png";
import { useFilters } from '@/shared/hooks';
import type { CardInfoViewProps, FilterItem, MultiSelectValue, SelectOption, SingleSelectValue } from '../model/types';

const toOptions = (items: FilterItem[]): SelectOption[] =>
  items.map((item) => ({ label: item.title, value: item.id }));

const FORMAT_OPTIONS: SelectOption[] = [
  { label: 'Square', value: 'square' },
  { label: 'Stories', value: 'stories' },
];

const toMultiSelection = (value: MultiSelectValue): string[] => {
  if (!Array.isArray(value) || value.length === 0) return [];
  return value.map(String);
};

const toSingleSelection = (value: SingleSelectValue): string | null =>
  value === null ? null : String(value);

const toSingleSelectionFromMulti = (value: MultiSelectValue): string | null => {
  if (value === null) return null;
  if (Array.isArray(value)) {
    return value.length > 0 ? String(value[0]) : null;
  }
  return String(value);
};

const CardInfoView = ({
  sportTypeOptions,
  categoryOptions,
  formatOptions,
  locationOptions,
  selectedSportType,
  selectedCategory,
  selectedFormat,
  selectedLocation,
  promocode,
  onSportTypeChange,
  onCategoryChange,
  onFormatChange,
  onLocationChange,
  onPromocodeChange,
}: CardInfoViewProps) => (
  <div className='mt-10 relative overflow-hidden bg-[linear-gradient(90deg,#232121_0%,#000_100%)] rounded-[40px] flex lg:flex-row flex-col lg:p-0 p-5'>
    <div className="lg:w-1/2 relative shrink-0">
      <img src={imageUrl} className='absolute 2xl:top-18 top-10 left-0 w-full lg:block hidden 2xl:max-w-[691px] max-w-[623px] right-0 mx-auto'/>
      <div className="font-climate uppercase 2xl:text-[100px] text-[67px] text-white font-black text-center mt-2">Sport</div>
    </div>
    <div className="flex flex-col 2xl:gap-7 gap-6 flex-1 lg:w-1/2 2xl:py-12 lg:py-10 lg:pr-16">
      <ChipsGroup
        label='Choose the banner type'
        options={sportTypeOptions}
        value={selectedSportType || []}
        onChange={onSportTypeChange}
      />
      <ChipsGroup
        label='Choose the banner category'
        options={categoryOptions}
        value={selectedCategory || []}
        onChange={onCategoryChange}
      />
      <ChipsGroup
        label='Choose a format'
        options={formatOptions}
        mode="single"
        value={selectedFormat}
        onChange={onFormatChange}
      />
      <CustomSelect
        options={locationOptions}
        placeholder="Select"
        value={selectedLocation}
        onChange={onLocationChange}
      />
      <div className="flex flex-col gap-4">
        <div className="2xl:text-[28px] text-[22px] text-white font-medium leading-[100%]">Enter the promocode</div>
        <Input 
          placeholder='PROMOCODEXXX, SPORT123'
          value={promocode}
          onChange={(e) => onPromocodeChange(e.target.value)}
          className='max-w-85'
        />
      </div>  
    </div>
  </div>
);

export const CardInfo = ({ onPromocodeChange }: { onPromocodeChange: (promocode: string) => void }) => {
  const [promocode, setPromocode] = useState<string>('');
  const {
    sportTypes,
    categorySports,
    locations,
    selectedCategory,
    selectedSportType,
    selectedFormat,
    selectedLocation,
    setSelectedSportType,
    setSelectedCategory,
    setSelectedFormat,
    setSelectedLocation
  } = useFilters();

  const sportTypeOptions = useMemo(() => toOptions(sportTypes), [sportTypes]);
  const categoryOptions = useMemo(() => toOptions(categorySports), [categorySports]);
  const formatOptions = useMemo(() => FORMAT_OPTIONS, []);
  const locationOptions = useMemo(() => toOptions(locations), [locations]);

  const handlePromocodeChange = (value: string) => {
    setPromocode(value);
    onPromocodeChange(value);
  };

  return (
    <CardInfoView
      sportTypeOptions={sportTypeOptions}
      categoryOptions={categoryOptions}
      formatOptions={formatOptions}
      locationOptions={locationOptions}
      selectedSportType={selectedSportType}
      selectedCategory={selectedCategory}
      selectedFormat={selectedFormat}
      selectedLocation={selectedLocation}
      promocode={promocode}
      onSportTypeChange={(value) => setSelectedSportType(toMultiSelection(value))}
      onCategoryChange={(value) => setSelectedCategory(toMultiSelection(value))}
      onFormatChange={(value) => setSelectedFormat(toSingleSelectionFromMulti(value))}
      onLocationChange={(value) => setSelectedLocation(toSingleSelection(value))}
      onPromocodeChange={handlePromocodeChange}
    />
  );
};
