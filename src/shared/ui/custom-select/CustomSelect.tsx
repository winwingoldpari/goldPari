import React, { useEffect, useMemo, useRef, useState } from 'react';
import ChevronDown from "@/shared/assets/icons/shevron.svg?react";

type Value = string | number;
type Option = { label: string; value: Value; disabled?: boolean };

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  value?: Value | null;
  defaultValue?: Value | null;
  onChange?: (value: Value | null) => void;
  variant?: 'auto' | 'outline' | 'filled';
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
  label?: string;
}

export const CustomSelect = ({
  options,
  placeholder = 'Select',
  value,
  defaultValue = null,
  onChange,
  variant = 'auto',
  className = '',
  menuClassName = '',
  disabled = false,
  label = 'Choose a language'
}: CustomSelectProps) => {
  const isControlled = typeof value !== 'undefined';
  const [internal, setInternal] = useState<Value | null>(defaultValue);
  const selected = (isControlled ? value : internal) ?? null;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hover, setHover] = useState<number>(-1);
  const [focused, setFocused] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedLabel = useMemo(() => {
    const found = options.find(o => o.value === selected);
    return found?.label ?? null;
  }, [options, selected]);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return options;
    return options.filter(o =>
      normalizeText(o.label).includes(q) ||
      normalizeText(String(o.value)).includes(q)
    );
  }, [options, query]);

  const decideVariant =
    variant === 'auto' ? (selected ? 'filled' : 'outline') : variant;

  const base =
    'relative z-50 md:px-7.5 md:py-2 p-3 border rounded-[30px] h-full md:text-xl text-lg font-medium  leading-none transition-colors duration-200 m-0 flex items-center gap-2';
  const outline = 'bg-black-100 border-gray-100 hover:border-yellow-100 text-white';
  const filled = 'bg-yellow-100 border-yellow-100 text-black hover:border-yellow-100';
  const ctrlClasses =
    `${base} ${decideVariant === 'filled' ? filled : outline} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`;

  const inputTextCls =
    decideVariant === 'filled'
      ? 'text-black placeholder-black'
      : 'text-white placeholder-white';

  const openMenu = (nextQuery = '') => {
    if (disabled) return;
    setOpen(true);
    setQuery(nextQuery);
  };
  const closeMenu = () => {
    setOpen(false);
    setQuery('');
    setHover(-1);
  };

  const commit = (opt: Option | null) => {
    const next = opt ? opt.value : null;
    if (!isControlled) setInternal(next);
    onChange?.(next);
    closeMenu();
    setTimeout(() => inputRef.current?.blur(), 0);
  };
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const hasQuery = query.trim().length > 0;
    if (!hasQuery) {
      const idx = filtered.findIndex(o => o.value === selected && !o.disabled);
      if (idx >= 0) {
        setHover(idx);
        return;
      }
    }
    setHover(filtered.findIndex(o => !o.disabled));
  }, [open, filtered, selected, query]);


  useEffect(() => {
    if (!open || hover < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${hover}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, hover]);


  const onKeyDown = (e: React.KeyboardEvent) => {
    const isPrintableKey =
      e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

    if (!open && isPrintableKey) {
      e.preventDefault();
      openMenu(e.key);
      return;
    }

    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      openMenu();
      return;
    }
    if (!open) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!filtered.length) return;
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      let i = hover < 0 ? 0 : hover;
      for (let step = 0; step < filtered.length; step++) {
        i = (i + dir + filtered.length) % filtered.length;
        if (!filtered[i].disabled) { setHover(i); break; }
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (hover >= 0 && !filtered[hover]?.disabled) commit(filtered[hover]);
    }
  };

  const display = open
    ? query
    : (selectedLabel ?? (selected !== null ? String(selected) : ''));

  return (
    <div className="flex flex-col gap-4">
      {label && <div className="2xl:text-[28px] text-[22px] text-white font-medium leading-[100%]">{label}</div>}
      <div ref={rootRef} className="relative inline-block w-[250px] 2xl:h-12.5 h-10" onKeyDown={onKeyDown}>
        <div
          role="combobox"
          aria-expanded={open}
          aria-controls="custom-select-listbox"
          aria-haspopup="listbox"
          className={ctrlClasses}
          onMouseDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-toggle]')) return;
            if (!open) {
              e.preventDefault();
              openMenu();
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }}
        >
          <input
            ref={inputRef}
            className={`bg-transparent outline-none border-0 p-0 m-0 w-full ${open ? '' : 'truncate'} capitalize ${inputTextCls} placeholder:truncate text-left`}
            placeholder={open || focused ? '' : placeholder}
            value={display}
            readOnly={!open}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
              if (!open) openMenu();
              setQuery(e.target.value);
              setHover(0);
            }}
            spellCheck={false}
          />

          <button
            type="button"
            data-toggle
            aria-label={open ? 'Close' : 'Open'}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (open ? closeMenu() : openMenu())}
            className={`inline-flex items-center justify-center shrink-0 rounded-fu ${decideVariant === 'filled' ? 'border-black text-black' : 'border-gray-100 text-white'}`}
          >
            <ChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {open && (
          <div
            id="custom-select-listbox"
            role="listbox"
            ref={listRef}
            className={`absolute -mt-6 pt-8 z-10 text-left w-full bg-black-100 shadow-xl md:max-h-[210px] max-h-[200px] overflow-y-auto ${menuClassName}`}
          >
            {filtered.length === 0 && (
              <div className="px-6 py-4 text-xl leading-none text-white/70">
                Not found
              </div>
            )}

            {filtered.map((opt, i) => {
              const isSel = selected != null && opt.value === selected;
              const baseItem =
                'px-4 py-2 md:text-xl text-lg leading-none cursor-pointer select-none hover:bg-[#686868]';
              const state =
                (isSel ? 'bg-[#686868]' : '')
              return (
                <div
                  key={String(opt.value)}
                  role="option"
                  aria-selected={isSel}
                  data-index={i}
                  onMouseEnter={() => !opt.disabled && setHover(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => !opt.disabled && commit(opt)}
                  className={`${baseItem} text-white ${state} ${opt.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>

  );
};
