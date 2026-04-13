import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  selectedId?: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export const Dropdown = ({
  items,
  selectedId,
  onChange,
  placeholder = 'Select an option',
  className = '',
  label,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItem = items.find((item) => item.id === selectedId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest mb-2 pl-1 select-none">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-5 py-3 rounded-2xl border transition-all duration-200
          ${
            isOpen
              ? 'border-[var(--ease2event-brand-primary)] ring-4 ring-[rgba(108,99,255,0.08)] bg-[var(--ease2event-bg-surface)] shadow-[var(--ease2event-shadow-md)]'
              : 'border-[var(--ease2event-border-base)] bg-[var(--ease2event-bg-surface)] hover:border-[var(--ease2event-border-active)] hover:bg-[var(--ease2event-bg-elevated)]/50'
          }
          text-sm font-bold uppercase tracking-tight
        `}
      >
        <span className={selectedItem ? 'text-[var(--ease2event-text-primary)]' : 'text-[var(--ease2event-text-muted)]'}>
          {selectedItem?.label || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-[var(--ease2event-text-muted)] transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-[var(--ease2event-brand-primary)]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[999] top-full mt-2 w-full bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] rounded-2xl shadow-[var(--ease2event-shadow-lg)] p-2 transition-all duration-200 animate-slideUp overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors select-none text-left
                  ${
                    selectedId === item.id
                      ? 'bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-brand-primary)]'
                      : 'text-[var(--ease2event-text-secondary)] hover:bg-[var(--ease2event-bg-elevated)]/50 hover:text-[var(--ease2event-text-primary)]'
                  }
                  ${item.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
                  font-bold uppercase tracking-tight text-xs
                `}
              >
                <div className="flex items-center gap-3">
                  {item.icon && <span className="text-[var(--ease2event-text-muted)]">{item.icon}</span>}
                  {item.label}
                </div>
                {selectedId === item.id && <Check size={16} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
