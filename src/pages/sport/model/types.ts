export type SelectOption = { label: string; value: string };
export type FilterItem = { id: string; title: string };

export type MultiSelectValue = string | number | Array<string | number> | null;
export type SingleSelectValue = string | number | null;

export type CardInfoViewProps = {
  sportTypeOptions: SelectOption[];
  categoryOptions: SelectOption[];
  formatOptions: SelectOption[];
  locationOptions: SelectOption[];
  selectedSportType: string[] | null;
  selectedCategory: string[] | null;
  selectedFormat: string | null;
  selectedLocation: string | null;
  promocode: string;
  onSportTypeChange: (value: MultiSelectValue) => void;
  onCategoryChange: (value: MultiSelectValue) => void;
  onFormatChange: (value: MultiSelectValue) => void;
  onLocationChange: (value: SingleSelectValue) => void;
  onPromocodeChange: (value: string) => void;
};
