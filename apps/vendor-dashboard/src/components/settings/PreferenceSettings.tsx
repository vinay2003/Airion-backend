import React from 'react';
import { Activity, Sparkles, Moon, Sun, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const PreferenceSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-b border-[var(--ease2event-border-subtle)] pb-6 sm:pb-6">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] text-emerald-500 shrink-0">
          <Activity className="size-6 sm:size-8" />
        </div>
        <div>
          <h2 className="text-xl sm:text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-none">Appearance Settings</h2>
          <p className="text-[10px] sm:text-sm text-[var(--ease2event-text-secondary)] font-semibold mt-1.5 sm:mt-3 tracking-normal">Customize your dashboard look and feel</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6 sm:space-y-5 bg-gradient-to-br from-[var(--ease2event-brand-primary)]/[0.02] to-transparent p-6 sm:p-12 rounded-xl sm:rounded-[40px] border border-[var(--ease2event-border-subtle)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 sm:p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Sparkles className="size-32 sm:size-[160px]" />
        </div>
        <div className="relative z-10 space-y-5 sm:space-y-6">
          <div className="space-y-3">
            <p className="text-[10px] sm:text-[11px] font-bold text-[var(--ease2event-text-secondary)] tracking-widest mb-6 sm:mb-8">Theme Preferences</p>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 sm:p-5 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] rounded-[20px] sm:rounded-[28px] transition-all active:scale-[0.98] group/btn"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-brand-primary)] group-hover/btn:rotate-12 transition-transform shrink-0">
                  {theme === 'light' ? <Moon className="size-6 sm:size-7" /> : <Sun className="size-6 sm:size-7" />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-xs sm:text-sm text-[var(--ease2event-text-primary)] tracking-widest">{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</p>
                  <p className="text-[10px] sm:text-sm text-[var(--ease2event-text-secondary)] font-bold mt-1 sm:mt-2 tracking-tighter opacity-70 leading-tight">Adjust the interface for your environment</p>
                </div>
              </div>
              <ChevronRight className="size-5 sm:size-6 text-[var(--ease2event-text-muted)] group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-[var(--ease2event-bg-elevated)]/50 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)]">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-xs sm:text-sm text-[var(--ease2event-text-secondary)] font-bold tracking-widest opacity-60">
              Environment calibrated for optimal display performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceSettings;
