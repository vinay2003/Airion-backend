import React from 'react';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'url';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'py-2 text-sm',
  md: 'py-3 text-sm',
  lg: 'py-4 text-base',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    const inputClasses = [
      'w-full rounded-xl border bg-[var(--airion-bg-surface)]',
      'text-[var(--airion-text-primary)] placeholder:text-[var(--airion-text-muted)]',
      'outline-none transition-all duration-200',
      'focus:ring-4',
      error
        ? 'border-[var(--airion-brand-danger)] focus:border-[var(--airion-brand-danger)] focus:ring-[rgba(255,107,107,0.12)]'
        : 'border-[var(--airion-border-base)] focus:border-[var(--airion-brand-primary)] focus:ring-[rgba(108,99,255,0.08)]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[inputSize],
      leftIcon  ? 'pl-11 pr-4' : 'px-4',
      rightIcon ? 'pr-11'      : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-[var(--airion-text-muted)] uppercase tracking-widest mb-2 pl-1"
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--airion-text-muted)] group-focus-within:text-[var(--airion-brand-primary)] transition-colors pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type as InputType}
            className={inputClasses}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--airion-text-muted)] pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="mt-1.5 pl-1 text-xs text-[var(--airion-brand-danger)] font-medium">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 pl-1 text-xs text-[var(--airion-text-muted)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'AirionInput';
export default Input;
