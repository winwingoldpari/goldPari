interface SwitcherProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  className?: string;
}

export const Switcher = ({
  checked,
  onChange,
  label,
  className = '',
}: SwitcherProps) => {
  const trackCls = 'w-7.5 h-3.5 md:w-12 md:h-6 2xl:w-14 2xl:h-7';
  const thumbCls = 'w-2.5 h-2.5 md:w-5 md:h-5 2xl:w-6 2xl:h-6';
  const translateCls = 'translate-x-4 md:translate-x-6 2xl:translate-x-7';

  return (
    <label
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 border border-[#969696] bg-black-100 ${
          checked ? '' : 'border-gray-100'
        } ${trackCls}`}
      >
        <span
          aria-hidden="true"
          className={`inline-block rounded-full shadow transform transition-transform duration-200 ${thumbCls} ${
            checked ? translateCls : 'translate-x-0.5'
          } ${checked ? 'bg-yellow-100' : 'bg-white'}`}
        />
      </button>
      {label && (
        <span className="text-white text-lg font-medium leading-none">
          {label}
        </span>
      )}
    </label>
  );
};
