export type SelectOption = { label: string; value: string };
export type FilterItem = { id: string; title: string };

export type MultiSelectValue = string | number | Array<string | number> | null;
export type SingleSelectValue = string | number | null;

export type CardInfoViewProps = {
  categoryOptions: SelectOption[];
  formatOptions: SelectOption[];
  locationOptions: SelectOption[];
  selectedCategory: string[] | null;
  selectedFormat: string | null;
  selectedLocation: string | null;
  promocode: string;
  onCategoryChange: (value: MultiSelectValue | null) => void;
  onFormatChange: (value: MultiSelectValue | null) => void;
  onLocationChange: (value: SingleSelectValue | null) => void;
  onPromocodeChange: (value: string) => void;
};
