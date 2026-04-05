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
    <div className={`flex gap-1 p-1 bg-[var(--airion-bg-elevated)]/30 rounded-2xl border border-[var(--airion-border-subtle)] w-fit ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            relative flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 select-none
            ${variant === 'line' ? 'font-bold uppercase text-[10px] tracking-widest' : 'font-medium text-sm'}
            ${
              activeTab === tab.id
                ? 'bg-[var(--airion-bg-surface)] text-[var(--airion-brand-primary)] shadow-[var(--airion-shadow-sm)] border border-[var(--airion-border-subtle)]'
                : 'text-[var(--airion-text-muted)] hover:text-[var(--airion-text-secondary)] hover:bg-[var(--airion-bg-surface)]/40'
            }
          `}
        >
          {tab.icon && (
            <span className={activeTab === tab.id ? 'text-[var(--airion-brand-primary)]' : 'text-[var(--airion-text-muted)] transition-colors group-hover:text-[var(--airion-text-secondary)]'}>
              {tab.icon}
            </span>
          )}
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--airion-brand-primary)] rounded-full blur-[4px] opacity-40" />
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
