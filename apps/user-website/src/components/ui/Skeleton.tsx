import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({
  className = '',
  variant = 'rect',
  width,
  height,
}: SkeletonProps) => {
  const baseClasses = 'animate-pulse bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)]';
  const variantClasses = {
    text: 'h-4 rounded-full',
    rect: 'h-24 rounded-2xl',
    circle: 'rounded-full',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    >
      <div className="w-full h-full bg-gradient-to-r from-transparent via-[var(--airion-bg-elevated)]/20 to-transparent animate-shimmer scale-y-150" />
    </div>
  );
};

export const SkeletonText = ({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={i === lines - 1 ? 'w-2/3' : 'w-full'}
      />
    ))}
  </div>
);

export default Skeleton;
