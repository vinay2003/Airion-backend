import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Calendar,
    Heart,
    CreditCard,
    Users,
    Mail,
    HelpCircle,
    LogOut,
    Menu,
    X,
    LayoutDashboard
} from 'lucide-react';
import { useState } from 'react';

const DashboardLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Mock logout logic
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Calendar, label: 'My Bookings', path: '/dashboard/bookings' },
        { icon: Heart, label: 'Saved Vendors', path: '/dashboard/saved' },
        { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
        { icon: Users, label: 'Guest List', path: '/dashboard/guests' },
        { icon: Mail, label: 'Digital Invites', path: '/dashboard/invites' },
        { icon: HelpCircle, label: 'Support', path: '/dashboard/support' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
            {/* Mobile Sidebar Toggle */}
            <button
                className="lg:hidden fixed bottom-4 right-4 z-50 bg-red-500 text-white p-3 rounded-full shadow-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="text-red-500">Airion</span> User
                    </h2>
                </div>

                <nav className="px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                                ${isActive
                                    ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                                }
                            `}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
