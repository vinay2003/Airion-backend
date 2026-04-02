import React from 'react';

type BadgeVariant =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'new'
  | 'inprogress'
  | 'verified'
  | 'default';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  confirmed:  'bg-[var(--airion-status-confirmed-bg)]  text-[var(--airion-status-confirmed)]',
  pending:    'bg-[var(--airion-status-pending-bg)]    text-[var(--airion-status-pending)]',
  cancelled:  'bg-[var(--airion-status-cancelled-bg)]  text-[var(--airion-status-cancelled)]',
  new:        'bg-[var(--airion-status-new-bg)]        text-[var(--airion-status-new)]',
  inprogress: 'bg-[var(--airion-status-inprogress-bg)] text-[var(--airion-status-inprogress)]',
  verified:   'bg-[var(--airion-status-confirmed-bg)]  text-[var(--airion-status-verified)]',
  default:    'bg-[var(--airion-bg-elevated)]           text-[var(--airion-text-secondary)]',
};

const dotColors: Record<BadgeVariant, string> = {
  confirmed:  'bg-[var(--airion-status-confirmed)]',
  pending:    'bg-[var(--airion-status-pending)]',
  cancelled:  'bg-[var(--airion-status-cancelled)]',
  new:        'bg-[var(--airion-status-new)]',
  inprogress: 'bg-[var(--airion-status-inprogress)]',
  verified:   'bg-[var(--airion-status-verified)]',
  default:    'bg-[var(--airion-text-muted)]',
};

export const Badge = ({
  variant = 'default',
  dot = false,
  children,
  className = '',
  ...props
}: BadgeProps) => (
  <span
    className={[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
      'text-[11px] font-semibold tracking-wide uppercase',
      variantStyles[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
    )}
    {children}
  </span>
);

export default Badge;
