import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Users, Settings, LogOut, Shield, Moon, Sun, X, Calendar, Star, Megaphone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '@ease2event/shared';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Store, label: 'Vendors', path: '/vendors' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: Calendar, label: 'Bookings', path: '/bookings' },
        { icon: Star, label: 'Subscriptions', path: '/subscriptions' },
        { icon: Megaphone, label: 'Advertisements', path: '/advertisements' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm "
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 
                flex flex-col   
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="text-red-500" />
                        <span className="text-gray-900 dark:text-white">Admin</span>
                    </h1>
                    <button onClick={onClose} className="md:hidden text-gray-500  dark:text-slate-400 dark:">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 768 && onClose()}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl   ${isActive
                                    ? 'bg-red-500 text-white font-medium shadow-md shadow-red-500/20'
                                    : 'text-gray-600 dark:text-slate-400  dark:  dark:'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-slate-800 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 dark:text-slate-400  dark:  dark: rounded-xl "
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        {theme === 'light' ? 'Dark mode' : 'Light mode'}
                    </button>
                    <button 
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 dark:text-slate-400  dark:/10  dark: rounded-xl "
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
