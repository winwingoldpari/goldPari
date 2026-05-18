import { useState } from 'react';
import { Chip, type ChipValue } from '../chip/Chip';
import { CustomSelect } from '../custom-select/CustomSelect';

type SelectionMode = 'single' | 'multiple';

interface ChipsGroupOption<V extends ChipValue> {
  label: string;
  value: V;
  disabled?: boolean;
}

interface ChipsGroupProps<V extends ChipValue> {
  label?: string;
  mobileLabel?: string;
  options: ReadonlyArray<ChipsGroupOption<V>>;
  mode?: SelectionMode;
  value?: V | V[] | null;
  defaultValue?: V | V[] | null;
  onChange?: (value: V | V[] | null) => void;
  allowEmpty?: boolean;
  className?: string;
  chipClassName?: string;
}

export const ChipsGroup = <V extends ChipValue>({
  label,
  mobileLabel,
  options,
  mode = 'multiple',
  value,
  defaultValue,
  onChange,
  allowEmpty = true,
  className = '',
  chipClassName = '',
}: ChipsGroupProps<V>) => {
  const isControlled = typeof value !== 'undefined';

  const [internal, setInternal] = useState<V | V[] | null>(
    defaultValue ?? (mode === 'multiple' ? ([] as V[]) : null),
  );

  const current: V | V[] | null = isControlled ? (value as V | V[] | null) : internal;

  const isActive = (v: V) =>
    mode === 'multiple'
      ? Array.isArray(current) && current.includes(v)
      : current === v;

  const setCurrent = (next: V | V[] | null) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const toggle = (v: V) => {
    if (mode === 'multiple') {
      const set = new Set<V>(Array.isArray(current) ? current : []);
      if (set.has(v)) {
        set.delete(v);
      } else {
        set.add(v);
      }
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
      {label && (
        <div className="hidden md:block 2xl:text-[28px] text-[22px] text-white font-medium leading-[100%]">
          {label}
        </div>
      )}

      {/* Desktop: chips */}
      <div className="hidden md:flex flex-wrap xl:gap-6 gap-4">
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

      {/* Mobile: dropdown */}
      <div className="md:hidden">
        <CustomSelect<V>
          options={options}
          mode={mode}
          value={current}
          onChange={setCurrent}
          placeholder={mobileLabel ?? label ?? 'Select'}
          allowEmpty={allowEmpty}
        />
      </div>
    </div>
  );
};
