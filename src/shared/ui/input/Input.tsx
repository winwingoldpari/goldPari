import { useCallback, useLayoutEffect, useRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

type InputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  fullWidth?: boolean;
};

export const Input = ({
  fullWidth = true,
  className = '',
  onInput,
  value,
  defaultValue,
  ...props
}: InputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxHeight = 126;

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const nextHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, []);

  useLayoutEffect(() => {
    resize();
  }, [resize, value, defaultValue]);

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <div className={`inline-flex w-full items-start rounded-[30px] border-2 border-yellow-100 bg-black-100 px-6 md:py-1 py-1.5 ${className}`}>
        <textarea
          {...props}
          ref={textareaRef}
          rows={1}
          value={value}
          defaultValue={defaultValue}
          onInput={(event) => {
            resize();
            onInput?.(event);
          }}
          className="w-full bg-transparent text-white font-medium placeholder-[rgba(255, 255, 255, 0.5)] md:text-lg text-[12px] placeholder:md:text-lg placeholder:text-[12px] leading-[1.2] outline-none resize-none"
        />
      </div>
    </div>
  );
};
