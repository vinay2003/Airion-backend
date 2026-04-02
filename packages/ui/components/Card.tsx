import React from 'react';

type CardVariant = 'surface' | 'elevated' | 'glass' | 'premium';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClasses: Record<CardVariant, string> = {
  surface:  'bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)]',
  elevated: 'bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-base)]',
  glass:    'bg-[var(--airion-bg-surface)] backdrop-blur-md border border-[var(--airion-border-subtle)]',
  premium:  'bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)]',
};

const paddingClasses = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'surface',
      hover = variant === 'elevated' || variant === 'premium',
      padding = 'md',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'rounded-2xl transition-all duration-300';
    const hoverClasses = hover
      ? 'hover:-translate-y-[2px] hover:shadow-[var(--airion-shadow-md)] cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={[
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          hoverClasses,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'AirionCard';

/* ── Card sub-components ── */
export const CardHeader = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center justify-between mb-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={`text-lg font-bold text-[var(--airion-text-primary)] ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardBody = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`mt-6 pt-4 border-t border-[var(--airion-border-subtle)] flex items-center justify-between ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
