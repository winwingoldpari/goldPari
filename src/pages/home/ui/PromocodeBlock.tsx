import { Switcher } from '@/shared/ui';
import { Input } from '@/shared/ui/input/Input';

interface PromocodeBlockProps {
  value: string;
  onChange: (next: string) => void;
  enabled: boolean;
  onEnabledChange: (next: boolean) => void;
}

export const PromocodeBlock = ({ value, onChange, enabled, onEnabledChange }: PromocodeBlockProps) => {
  return (
    <div className="flex flex-col md:gap-4 gap-2">
      <div className="flex items-center md:gap-4 gap-2">
        <Switcher
          checked={enabled}
          onChange={onEnabledChange}
        />
        <div className="2xl:text-[28px] md:text-[22px] text-[14px] text-white font-medium leading-[100%]">
          Enter the promocode
        </div>
      </div>
      {enabled && (
        <Input
          placeholder="PROMOCODEXXX, SPORT123"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9,\s]/g, ''))}
        />
      )}
    </div>
  );
};
