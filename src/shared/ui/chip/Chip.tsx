import { useState } from 'react';

export type ChipValue = string | number;
interface ChipProps {
  label: string;
  value: ChipValue;
  defaultActive?: boolean;
  active?: boolean;
  onChange?: (value: ChipValue | null) => void;
  className?: string;
  disabled?: boolean;
}

export const Chip = ({ 
  label,
  value,
  defaultActive = false,
  active: activeProp,
  onChange,
  className = '',
  disabled
}: ChipProps) => {
  const isControlled = typeof activeProp === 'boolean';
  const [internalActive, setInternalActive] = useState(defaultActive);
  const active = isControlled ? (activeProp as boolean) : internalActive;

  const handleClick = () => {
    if (disabled) return;
    const next = !active;
    if (!isControlled) setInternalActive(next);
    onChange?.(next ? value : null);
  };

  const base =
    'md:py-3.5 md:px-8 p-3 min-w-[133px] 2xl:h-12 h-10 border rounded-[30px] 2xl:text-xl text-lg font-medium leading-none flex items-center justify-center transition-colors duration-200 m-0';
  const passive = 'bg-black-100 border-gray-100 text-white';
  const activeCls = 'bg-yellow-100 border-yellow-100 text-black';
  const finalCls = `${base} ${active ? activeCls : passive} ${className}`;

  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={handleClick}
      className={finalCls}
    >
      {label}
    </button>
  );
};