import React from 'react';
import { Bell, Search, ChevronDown, Menu } from 'lucide-react';

interface TopbarProps {
    title: string;
    onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ title, onMenuClick }) => {
    return (
        <header className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] h-[70px] flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-3 md:gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)] rounded-lg shrink-0"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-lg md:text-xl font-bold font-display text-[var(--text-primary)] hidden md:block tracking-wide truncate">
                    {title}
                </h1>
            </div>

            <div className="hidden lg:flex flex-1 justify-center px-4">
                <div className="flex items-center gap-3 max-w-md w-full bg-[var(--bg-primary)] px-4 py-2 rounded-xl border border-[var(--border-subtle)] focus-within:border-[var(--accent-primary)] transition-all">
                    <Search className="text-[var(--text-muted)]" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full outline-none bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 md:gap-5 flex-1">
                <button className="relative p-2 hover:bg-[rgba(255,255,255,0.05)] rounded-full transition-colors text-[var(--text-secondary)]">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent-warm)] rounded-full"></span>
                </button>

                <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-5 border-l border-[var(--border-subtle)] cursor-pointer hover:bg-[rgba(255,255,255,0.05)] p-1 md:pr-3 rounded-xl transition-colors">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
                        alt="Profile"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">John Doe</p>
                        <p className="text-[10px] text-[var(--text-muted)] leading-tight">Admin</p>
                    </div>
                    <ChevronDown size={14} className="text-[var(--text-muted)] hidden md:block" />
                </div>
            </div>
        </header>
    );
};

export default Topbar;
