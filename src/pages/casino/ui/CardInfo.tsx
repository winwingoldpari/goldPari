import { ChipsGroup, CustomSelect } from '@/shared/ui';
import { Input } from '@/shared/ui/input/Input';
import { useMemo, useState } from 'react';
import imageUrl from "@/shared/assets/Wheel.png";
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
  categoryOptions,
  formatOptions,
  locationOptions,
  selectedCategory,
  selectedFormat,
  selectedLocation,
  promocode,
  onCategoryChange,
  onFormatChange,
  onLocationChange,
  onPromocodeChange,
}: CardInfoViewProps) => (
  <div className='mt-8 relative overflow-hidden bg-[linear-gradient(90deg,#232121_0%,#000_100%)] rounded-[40px] flex lg:flex-row flex-col md:p-0 p-5'>
    <div className="lg:w-1/2 relative shrink-0">
      <img src={imageUrl} className='absolute 2xl:top-20 top-14 left-0 w-full lg:block hidden 2xl:max-w-[595px] max-w-[579px] right-0 mx-auto'/>
      <div className="font-climate uppercase 2xl:text-[100px] text-[67px] text-white font-black text-center mt-2">Casino</div>
    </div>
    <div className="flex flex-col 2xl:gap-7 gap-6 flex-1 lg:w-1/2 2xl:py-12 lg:py-10 lg:pr-16 p-6">
      <ChipsGroup
        label='Choose banner category'
        options={categoryOptions}
        value={selectedCategory || []}
        onChange={onCategoryChange}
      />
      <CustomSelect
        options={locationOptions}
        placeholder="Select"
        value={selectedLocation}
        onChange={onLocationChange}
      />
      <ChipsGroup
        label='Choose a format'
        options={formatOptions}
        mode="single"
        value={selectedFormat}
        onChange={onFormatChange}
      />
      <div className="flex flex-col 2xl:gap-6 gap-4">
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
    categories, 
    locations,
    selectedCategory,
    selectedLocation,
    selectedFormat,
    setSelectedCategory, 
    setSelectedLocation,
    setSelectedFormat,
  } = useFilters();

  const categoryOptions = useMemo(() => toOptions(categories), [categories]);
  const formatOptions = useMemo(() => FORMAT_OPTIONS, []);
  const locationOptions = useMemo(() => toOptions(locations), [locations]);

  const handlePromocodeChange = (value: string) => {
    setPromocode(value);
    onPromocodeChange(value);
  };

  return (
    <CardInfoView
      categoryOptions={categoryOptions}
      formatOptions={formatOptions}
      locationOptions={locationOptions}
      selectedCategory={selectedCategory}
      selectedFormat={selectedFormat}
      selectedLocation={selectedLocation}
      promocode={promocode}
      onCategoryChange={(value) => setSelectedCategory(toMultiSelection(value))}
      onFormatChange={(value) => setSelectedFormat(toSingleSelectionFromMulti(value))}
      onLocationChange={(value) => setSelectedLocation(toSingleSelection(value))}
      onPromocodeChange={handlePromocodeChange}
    />
  );
};
