import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, CalendarDays, DollarSign, MessageSquare, Package, Settings, BarChart2, Ticket, X, Megaphone, Camera } from 'lucide-react';
import { useAuth } from '@ease2event/shared';
import { Avatar } from '@ease2event/ui';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Ticket, label: 'Events', path: '/events' },
        { icon: Calendar, label: 'Bookings', path: '/bookings' },
        { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
        { icon: DollarSign, label: 'Earnings', path: '/earnings' },
        { icon: MessageSquare, label: 'Enquiries', path: '/enquiries' },
        { icon: Megaphone, label: 'Ads', path: '/ads' },
        { icon: Camera, label: 'Gallery', path: '/gallery' },
        { icon: Package, label: 'Products', path: '/products' },
        { icon: BarChart2, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-40 w-64 glass-panel border-r border-[var(--ease2event-border-subtle)] transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } flex flex-col`}
            >
                <div className="h-[70px] border-b border-[var(--ease2event-border-subtle)] flex justify-between items-center px-6">
                    <h1 className="text-xl font-display font-bold text-[var(--ease2event-text-primary)] flex items-center gap-2">
                        <span className="bg-[var(--ease2event-brand-primary)] text-white p-1 rounded-lg w-8 h-8 flex items-center justify-center shadow-sm">V</span>
                        Vendor
                    </h1>
                    <button onClick={onClose} className="md:hidden text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)]">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 768 && onClose()}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${isActive
                                    ? 'bg-[var(--ease2event-brand-primary)]/10 text-[var(--ease2event-brand-primary)] font-bold pl-4'
                                    : 'text-[var(--ease2event-text-secondary)] hover:bg-[var(--ease2event-bg-elevated)] hover:text-[var(--ease2event-text-primary)]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-2/3 bg-[var(--ease2event-brand-primary)] rounded-r-md"></div>
                                    )}
                                    <item.icon size={22} className={isActive ? "text-[var(--ease2event-brand-primary)]" : "text-[var(--ease2event-text-muted)] group-hover:text-[var(--ease2event-text-primary)] transition-colors"} />
                                    <span className={`text-md tracking-tight ${isActive ? 'font-bold' : 'font-semibold text-[var(--ease2event-text-secondary)] group-hover:text-[var(--ease2event-text-primary)]'}`}>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-[var(--ease2event-border-subtle)]">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)]">
                        <Avatar 
                            src={user?.vendor?.logo}
                            name={user?.name || user?.email || 'Vendor'} 
                            size="md" 
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[var(--ease2event-text-primary)] truncate">{user?.name || 'Vendor Profile'}</p>
                            <p className="text-xs text-[var(--ease2event-text-muted)] truncate">View Profile</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
