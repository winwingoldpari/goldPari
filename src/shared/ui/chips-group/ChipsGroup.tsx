import { useState } from "react";
import { Chip, type ChipValue } from "../chip/Chip";

type SelectionMode = 'single' | 'multiple';

interface ChipsGroupOption {
  label: string;
  value: ChipValue;
  disabled?: boolean;
}

interface ChipsGroupProps {
  label?: string;
  options: ChipsGroupOption[];
  mode?: SelectionMode;
  value?: ChipValue | ChipValue[] | null;

  defaultValue?: ChipValue | ChipValue[] | null;
  onChange?: (value: ChipValue | ChipValue[] | null) => void;
  allowEmpty?: boolean;
  className?: string;
  chipClassName?: string;
}

export const ChipsGroup = ({
  label,
  options,
  mode = 'multiple',
  value,
  defaultValue,
  onChange,
  allowEmpty = true,
  className = '',
  chipClassName = '',
}: ChipsGroupProps) => {
  const isControlled = typeof value !== 'undefined';

  const [internal, setInternal] = useState<ChipValue | ChipValue[] | null>(
    defaultValue ?? (mode === 'multiple' ? [] : null)
  );

  const current: ChipValue | ChipValue[] | null = isControlled
    ? value!
    : internal;

  const isActive = (v: ChipValue) =>
    mode === 'multiple'
      ? Array.isArray(current) && current.includes(v)
      : current === v;

  const setCurrent = (next: ChipValue | ChipValue[] | null) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const toggle = (v: ChipValue) => {
    if (mode === 'multiple') {
      const set = new Set(Array.isArray(current) ? current : []);
      set.has(v) ? set.delete(v) : set.add(v);
      setCurrent(Array.from(set));
    } else {
      if (current === v) {
        setCurrent(allowEmpty ? null : v);
      } else {
        setCurrent(v);
      }
    }
  };

  return (
    <div role="group" className={`flex flex-col gap-4 ${className}`}>
      {label && <div className="2xl:text-[28px] text-[22px] text-white font-medium leading-[100%]">{label}</div>}
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <Chip
            key={String(opt.value)}
            label={opt.label}
            value={opt.value}
            active={isActive(opt.value)}
            onChange={() => toggle(opt.value)}
            disabled={opt.disabled}
            className={chipClassName}
          />
        ))}
      </div>
    </div>
  );
};