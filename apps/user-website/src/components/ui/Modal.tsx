import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)] min-h-[calc(100vh-2rem)] m-4',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />
      <div
        className={[
          'relative w-full bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] rounded-3xl shadow-[var(--airion-shadow-lg)] overflow-hidden transition-all duration-300 animate-slideUp',
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--airion-border-subtle)]">
          {title ? (
            <h3 className="text-xl font-black text-[var(--airion-text-primary)] uppercase tracking-tight">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl hover:bg-[var(--airion-bg-elevated)] text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)] transition-all duration-200"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-8 py-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="px-8 py-5 bg-[var(--airion-bg-elevated)]/50 border-t border-[var(--airion-border-subtle)] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
