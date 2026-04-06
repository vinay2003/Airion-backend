import React from 'react';
import { Bell, Search, ChevronDown, Menu, Moon, Sun } from 'lucide-react';
import { useAuth } from '@airion/shared';
import { Avatar } from '@airion/ui';

const useTheme = () => {
    const [theme, setTheme] = React.useState(localStorage.getItem('airion-theme') || 'light');
    React.useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('airion-theme', theme);
    }, [theme]);
    return { theme, toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light') };
};

interface TopbarProps {
    title: string;
    onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ title, onMenuClick }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isNotifOpen, setIsNotifOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    
    // Close menus when clicking outside
    const navRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setIsNotifOpen(false);
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="glass-panel h-[70px] flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-300 border-x-0 border-t-0">
            <div className="flex items-center gap-3 md:gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-[var(--airion-text-secondary)] hover:bg-[rgba(108,99,255,0.05)] rounded-lg shrink-0"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-lg md:text-xl font-bold font-display text-[var(--airion-text-primary)] hidden md:block tracking-wide truncate">
                    {title}
                </h1>
            </div>

            <div className="hidden lg:flex flex-1 justify-center px-4">
                <div className="flex items-center gap-3 max-w-md w-full bg-[var(--airion-bg-surface)] px-4 py-2 rounded-xl border border-[var(--airion-border-subtle)] focus-within:border-[var(--airion-brand-primary)] transition-all">
                    <Search className="text-[var(--airion-text-muted)]" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full outline-none bg-transparent text-sm text-[var(--airion-text-primary)] placeholder-[var(--airion-text-muted)]"
                    />
                </div>
            </div>

            <div ref={navRef} className="flex items-center justify-end gap-2 md:gap-5 flex-1 relative">
                <button onClick={toggleTheme} className="p-2 hover:bg-[rgba(108,99,255,0.05)] rounded-full transition-colors text-[var(--airion-text-secondary)]">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }} 
                        className={`relative p-2 hover:bg-[rgba(108,99,255,0.05)] rounded-full transition-colors text-[var(--airion-text-secondary)] ${isNotifOpen ? 'bg-[rgba(108,99,255,0.08)] text-[var(--airion-brand-primary)]' : ''}`}
                    >
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[var(--airion-bg-surface)] z-10 animate-pulse"></span>
                    </button>
                    
                    {isNotifOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] rounded-2xl shadow-[var(--airion-shadow-lg)] origin-top-right animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div className="p-4 border-b border-[var(--airion-border-subtle)]">
                                <h3 className="font-bold text-[var(--airion-text-primary)]">Notifications</h3>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {[
                                    { title: 'New Booking Request', time: '5m ago', desc: 'Riya sent a request for your venue.', unread: true },
                                    { title: 'Payment Received', time: '2h ago', desc: 'You received ₹50,000 for the Corporate Event.', unread: false },
                                    { title: 'Listing Approved', time: '1d ago', desc: 'Your new listing is now live!', unread: false },
                                ].map((notif, i) => (
                                    <div key={i} className={`p-4 border-b border-[var(--airion-border-subtle)] last:border-0 hover:bg-[var(--airion-bg-elevated)] transition-colors cursor-pointer ${notif.unread ? 'bg-[var(--airion-brand-primary)]/5' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-bold ${notif.unread ? 'text-[var(--airion-text-primary)]' : 'text-[var(--airion-text-secondary)]'}`}>{notif.title}</h4>
                                            <span className="text-[10px] text-[var(--airion-text-muted)]">{notif.time}</span>
                                        </div>
                                        <p className="text-xs text-[var(--airion-text-muted)] font-medium">{notif.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-[var(--airion-border-subtle)] text-center cursor-pointer hover:text-[var(--airion-brand-primary)]">
                                <span className="text-xs font-bold text-[var(--airion-text-secondary)]">Mark all as read</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative border-l border-[var(--airion-border-subtle)] pl-2 md:pl-5">
                    <div 
                        onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                        className={`flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-[rgba(108,99,255,0.05)] p-1 md:pr-3 rounded-xl transition-colors ${isProfileOpen ? 'bg-[rgba(108,99,255,0.05)]' : ''}`}
                    >
                        <Avatar 
                            src={user?.vendor?.logo}
                            name={user?.name || user?.email || 'Vendor'} 
                            size="sm" 
                        />
                        <div className="hidden md:block">
                            <p className="text-sm font-bold text-[var(--airion-text-primary)]">{user?.name || 'Vendor Profile'}</p>
                            <p className="text-[10px] text-[var(--airion-text-muted)] leading-tight capitalize font-medium">{user?.role || 'Vendor'}</p>
                        </div>
                        <ChevronDown size={14} className={`text-[var(--airion-text-muted)] hidden md:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] rounded-2xl shadow-[var(--airion-shadow-lg)] origin-top-right animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
                            <div className="p-4 border-b border-[var(--airion-border-subtle)] bg-[var(--airion-bg-elevated)]/50">
                                <p className="font-bold text-[var(--airion-text-primary)] text-sm truncate">{user?.name || 'Hello, Vendor'}</p>
                                <p className="text-xs text-[var(--airion-text-muted)] truncate">{user?.email || 'vendor@airion.in'}</p>
                            </div>
                            <div className="p-2 space-y-1">
                                <a href="/vendor/settings" className="block px-3 py-2.5 rounded-xl text-sm font-bold text-[var(--airion-text-secondary)] hover:text-[var(--airion-text-primary)] hover:bg-[var(--airion-bg-elevated)] transition-colors">
                                    Account Settings
                                </a>
                                <a href="/vendor" className="block px-3 py-2.5 rounded-xl text-sm font-bold text-[var(--airion-text-secondary)] hover:text-[var(--airion-text-primary)] hover:bg-[var(--airion-bg-elevated)] transition-colors">
                                    Dashboard
                                </a>
                                <button onClick={logout} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
