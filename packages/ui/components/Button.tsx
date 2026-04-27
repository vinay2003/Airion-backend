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
  primary:   'bg-[var(--ease2event-brand-primary)] bg-gradient-to-br from-[#6366f1] to-[var(--ease2event-brand-primary)] text-white shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 border border-indigo-500/50 active:translate-y-0 transition-all',
  secondary: 'bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-text-primary)] hover:bg-[var(--ease2event-border-base)] border border-[var(--ease2event-border-subtle)] shadow-sm',
  outline:   'border-2 border-[var(--ease2event-border-active)] text-[var(--ease2event-brand-primary)] bg-transparent hover:bg-[var(--ease2event-brand-primary)]/5',
  ghost:     'bg-[var(--ease2event-bg-elevated)]/30 text-[var(--ease2event-text-secondary)] hover:bg-[var(--ease2event-bg-elevated)] hover:text-[var(--ease2event-text-primary)] transition-colors',
  danger:    'border border-[var(--ease2event-brand-danger)] text-[var(--ease2event-brand-danger)] bg-[var(--ease2event-brand-danger)]/5 hover:bg-[var(--ease2event-brand-danger)]/15',
  gradient:  'bg-gradient-to-br from-[#6C63FF] to-[#4ECDC4] text-white hover:-translate-y-[2px] shadow-lg hover:shadow-[0_0_25px_rgba(78,205,196,0.3)] active:translate-y-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-xs rounded-[8px] gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-[10px] gap-2',
  lg: 'px-6 py-3.5 text-base rounded-[12px] gap-2',
  xl: 'px-8 py-4.5 text-lg rounded-[14px] gap-3',
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
      'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ease2event-brand-primary)] focus-visible:ring-offset-2';

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

Button.displayName = 'Ease2eventButton';
export default Button;
