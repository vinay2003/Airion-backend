import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, CalendarDays, DollarSign, MessageSquare, Package, Settings, BarChart2, Ticket, X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Ticket, label: 'Events', path: '/events' },
        { icon: Calendar, label: 'Bookings', path: '/bookings' },
        { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
        { icon: DollarSign, label: 'Earnings', path: '/earnings' },
        { icon: MessageSquare, label: 'Enquiries', path: '/enquiries' },
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
            <aside className={`
                fixed md:fixed top-0 left-0 z-50 h-screen w-[240px] bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] 
                flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-[70px] border-b border-[var(--border-subtle)] flex justify-between items-center px-6">
                    <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        <span className="bg-[var(--accent-primary)] text-white p-1 rounded-lg w-8 h-8 flex items-center justify-center">V</span>
                        Vendor
                    </h1>
                    <button onClick={onClose} className="md:hidden text-[var(--text-muted)] hover:text-white">
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
                                    ? 'bg-[rgba(108,99,255,0.12)] text-white font-medium pl-4'
                                    : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.03)] hover:text-white'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-2/3 bg-[var(--accent-primary)] rounded-r-md"></div>
                                    )}
                                    <item.icon size={20} className={isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors"} />
                                    <span className={isActive ? "" : ""}>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">John Doe</p>
                            <p className="text-xs text-[var(--text-secondary)] truncate">View Profile</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
