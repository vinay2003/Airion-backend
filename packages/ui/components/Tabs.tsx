import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'line' | 'premium';
  className?: string;
}

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
  className = '',
}: TabsProps) => {
  return (
    <div className={`flex gap-3 p-2 bg-[var(--ease2event-bg-elevated)]/40 rounded-[1.5rem] border border-[var(--ease2event-border-subtle)] w-fit ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            relative flex items-center gap-4 px-10 py-3.5 rounded-xl transition-all duration-300 select-none outline-none
            ${variant === 'line' ? 'font-black uppercase text-[10px] tracking-[0.25em]' : 'font-black text-[16px] uppercase tracking-tight'}
            ${
              activeTab === tab.id
                ? 'bg-[var(--ease2event-bg-surface)] text-[var(--ease2event-brand-primary)] shadow-xl shadow-black/5 border border-[var(--ease2event-border-subtle)] translate-y-[-1px]'
                : 'text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)] hover:bg-[var(--ease2event-bg-surface)]/60'
            }
          `}
        >
          {tab.icon && (
            <span className={activeTab === tab.id ? 'text-[var(--ease2event-brand-primary)]' : 'text-[var(--ease2event-text-muted)]'}>
              {tab.icon}
            </span>
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
