import { useEffect, useRef, useState } from 'react';
import ChevronDown from '@/shared/assets/icons/shevron.svg?react';

export type SelectValue = string | number;
export type SelectMode = 'single' | 'multiple';

export interface SelectOption<V extends SelectValue> {
  label: string;
  value: V;
  disabled?: boolean;
}

interface CustomSelectProps<V extends SelectValue> {
  options: ReadonlyArray<SelectOption<V>>;
  mode?: SelectMode;
  value?: V | V[] | null;
  defaultValue?: V | V[] | null;
  onChange?: (value: V | V[] | null) => void;
  label?: string;
  placeholder?: string;
  variant?: 'auto' | 'outline' | 'filled';
  disabled?: boolean;
  allowEmpty?: boolean;
  maxWidth?: string | number;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
}

export const CustomSelect = <V extends SelectValue>({
  options,
  mode = 'single',
  value,
  defaultValue,
  onChange,
  label,
  placeholder = 'Select',
  variant = 'auto',
  disabled = false,
  allowEmpty = true,
  maxWidth,
  className = '',
  triggerClassName = '',
  menuClassName = '',
}: CustomSelectProps<V>) => {
  const maxWidthStyle =
    typeof maxWidth === 'number' ? { maxWidth: `${maxWidth}px` } : undefined;

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

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selectedLabels = (() => {
    if (mode === 'multiple') {
      if (!Array.isArray(current) || current.length === 0) return null;
      return options
        .filter((o) => current.includes(o.value))
        .map((o) => o.label)
        .join(', ');
    }
    if (current === null || current === undefined) return null;
    return options.find((o) => o.value === current)?.label ?? null;
  })();

  const hasSelection = selectedLabels !== null;
  const decideVariant =
    variant === 'auto' ? (hasSelection ? 'filled' : 'outline') : variant;

  const filledCls = 'bg-yellow-100 border-yellow-100 text-black hover:border-yellow-100';
  const outlineCls = 'bg-black-100 border-gray-100 hover:border-yellow-100 text-white';

  const triggerCls =
    `flex items-center justify-between gap-2 w-full border rounded-[30px] font-medium leading-none transition-colors duration-200 2xl:h-[50px] md:h-[40px] min-h-[30px] ` +
    `md:px-7.5 2xl:py-[7px] md:py-[0px] md:text-xl px-4 py-0.5 text-[12px] ` +
    `${decideVariant === 'filled' ? filledCls : outlineCls} ` +
    `${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${triggerClassName}`;

  return (
    <div className={`flex flex-col md:gap-4 gap-2 ${className}`}>
      {label && (
        <div className="2xl:text-[28px] md:text-[22px] text-[14px] text-white font-medium leading-[100%]">
          {label}
        </div>
      )}

      <div ref={rootRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={triggerCls}
          style={maxWidthStyle}
        >
          <span className=" text-left capitalize">
            {selectedLabels ?? placeholder}
          </span>
          <ChevronDown
            className={`shrink-0 transition-transform md:w-5 md:h-5 w-4 h-4 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className={`absolute z-20 mt-2 w-full bg-black-100 border border-gray-100 rounded-2xl shadow-xl md:max-h-[240px] max-h-[200px] overflow-y-auto py-2 ${menuClassName}`}
            style={maxWidthStyle}
          >
            {options.length === 0 && (
              <div className="px-4 py-2 md:text-xl text-base leading-none text-white/70">
                Not found
              </div>
            )}

            {options.map((opt) => {
              const active = isActive(opt.value);
              return (
                <button
                  type="button"
                  key={String(opt.value)}
                  role="option"
                  aria-selected={active}
                  disabled={opt.disabled}
                  onClick={() => {
                    toggle(opt.value);
                    if (mode === 'single') setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 md:text-xl text-base leading-none transition-colors ${
                    active ? 'bg-yellow-100 text-black' : 'text-white hover:bg-[#686868]'
                  } ${opt.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
