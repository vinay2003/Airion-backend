import React from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'inline' | 'page' | 'overlay';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

const sizePx: Record<SpinnerSize, number> = {
  xs: 14,
  sm: 20,
  md: 32,
  lg: 48,
  xl: 64,
};

/** Ring SVG spinner using brand color */
const Ring = ({ px }: { px: number }) => (
  <svg
    width={px}
    height={px}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="animate-spin text-[var(--airion-brand-primary)]"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const Spinner = ({
  size = 'md',
  variant = 'inline',
  label = 'Loading…',
  className = '',
}: SpinnerProps) => {
  const px = sizePx[size];

  if (variant === 'page') {
    return (
      <div
        role="status"
        aria-label={label}
        className={`min-h-screen bg-[var(--airion-bg-base)] flex flex-col items-center justify-center gap-4 ${className}`}
      >
        <Ring px={px} />
        <p className="text-sm text-[var(--airion-text-muted)] animate-pulse">{label}</p>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        role="status"
        aria-label={label}
        className={`fixed inset-0 z-50 bg-[var(--airion-bg-overlay)] backdrop-blur-sm flex items-center justify-center ${className}`}
      >
        <div className="bg-[var(--airion-bg-surface)] rounded-2xl p-8 flex flex-col items-center gap-4 shadow-[var(--airion-shadow-lg)]">
          <Ring px={px} />
          <p className="text-sm text-[var(--airion-text-secondary)]">{label}</p>
        </div>
      </div>
    );
  }

  // inline (default)
  return (
    <span role="status" aria-label={label} className={`inline-flex ${className}`}>
      <Ring px={px} />
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default Spinner;
