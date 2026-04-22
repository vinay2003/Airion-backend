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
  confirmed: 'bg-[var(--ease2event-status-confirmed-bg)]  text-[var(--ease2event-status-confirmed)]',
  pending: 'bg-[var(--ease2event-status-pending-bg)]    text-[var(--ease2event-status-pending)]',
  cancelled: 'bg-[var(--ease2event-status-cancelled-bg)]  text-[var(--ease2event-status-cancelled)]',
  new: 'bg-[var(--ease2event-status-new-bg)]        text-[var(--ease2event-status-new)]',
  inprogress: 'bg-[var(--ease2event-status-inprogress-bg)] text-[var(--ease2event-status-inprogress)]',
  verified: 'bg-[var(--ease2event-status-confirmed-bg)]  text-[var(--ease2event-status-verified)]',
  default: 'bg-[var(--ease2event-bg-elevated)]           text-[var(--ease2event-text-secondary)]',
};

const dotColors: Record<BadgeVariant, string> = {
  confirmed: 'bg-[var(--ease2event-status-confirmed)]',
  pending: 'bg-[var(--ease2event-status-pending)]',
  cancelled: 'bg-[var(--ease2event-status-cancelled)]',
  new: 'bg-[var(--ease2event-status-new)]',
  inprogress: 'bg-[var(--ease2event-status-inprogress)]',
  verified: 'bg-[var(--ease2event-status-verified)]',
  default: 'bg-[var(--ease2event-text-muted)]',
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
      'inline-flex items-center gap-2 rounded-full',
      'text-[10px] font-black tracking-[0.2em] uppercase italic',
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
