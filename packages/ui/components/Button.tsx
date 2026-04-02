import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-[var(--airion-brand-primary)] text-white hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(108,99,255,0.35)] active:translate-y-0',
  secondary: 'bg-[var(--airion-bg-elevated)] text-[var(--airion-text-secondary)] hover:text-[var(--airion-text-primary)] hover:bg-[var(--airion-border-base)]',
  outline:   'border border-[var(--airion-border-active)] text-[var(--airion-brand-primary)] bg-transparent hover:bg-[rgba(108,99,255,0.08)]',
  ghost:     'bg-[rgba(255,255,255,0.05)] text-[var(--airion-text-secondary)] hover:bg-[rgba(255,255,255,0.1)] hover:text-[var(--airion-text-primary)]',
  danger:    'border border-[var(--airion-brand-danger)] text-[var(--airion-brand-danger)] bg-[rgba(255,107,107,0.08)] hover:bg-[rgba(255,107,107,0.18)]',
  gradient:  'bg-gradient-to-br from-[#6C63FF] to-[#4ECDC4] text-white hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(78,205,196,0.3)] active:translate-y-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm:  'px-3.5 py-2 text-xs rounded-[8px] gap-1.5',
  md:  'px-5 py-2.5 text-sm rounded-[10px] gap-2',
  lg:  'px-6 py-3.5 text-base rounded-[12px] gap-2',
  xl:  'px-8 py-4.5 text-lg rounded-[14px] gap-3',
};

const Spinner = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--airion-brand-primary)] focus-visible:ring-offset-2';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading ? (
          <Spinner size={size === 'sm' ? 14 : size === 'xl' ? 20 : 16} />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'AirionButton';
export default Button;
