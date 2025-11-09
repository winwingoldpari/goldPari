import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  fullWidth?: boolean;
};

export const Input = ({
  fullWidth = true,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <div className="inline-flex w-full items-center rounded-full border-2 border-yellow-100 bg-black-100 md:px-8 md:py-4 py-3 px-6 ">
        <input
          {...props}
          className={`w-full bg-transparent text-white font-medium placeholder-white md:text-xl text-lg leading-none outline-none ${className}`}
        />
      </div>
    </div>
  );
};