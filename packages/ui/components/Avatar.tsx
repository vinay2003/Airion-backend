import React from 'react';
import { User } from 'lucide-react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  phoneNumber?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: 'w-6 h-6',   text: 'text-[9px]'  },
  sm: { container: 'w-8 h-8',   text: 'text-xs'     },
  md: { container: 'w-10 h-10', text: 'text-sm'     },
  lg: { container: 'w-12 h-12', text: 'text-base'   },
  xl: { container: 'w-16 h-16', text: 'text-xl'     },
};

/** Derives 1–2 letter initials from name, email, or phone */
function getInitials(name?: string | null, phoneNumber?: string | null): string {
  if (name) {
    return name.trim()[0]?.toUpperCase() ?? '?';
  }
  if (phoneNumber) {
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.slice(-2);
  }
  return '?';
}

export const Avatar = ({
  src,
  name,
  phoneNumber,
  size = 'md',
  className = '',
}: AvatarProps) => {
  const { container, text } = sizeMap[size];
  const initials = getInitials(name, phoneNumber);

  return (
    <div
      className={[
        container,
        'rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden',
        'bg-gradient-to-br from-[var(--ease2event-brand-primary)] to-[var(--ease2event-brand-secondary)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? 'avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // fallback to initials on broken image
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <User className="text-white w-1/2 h-1/2" />
      )}
    </div>
  );
};

export default Avatar;
