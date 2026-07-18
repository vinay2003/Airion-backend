import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Menu, Home, Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@ease2event/shared';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    const handleGoToLanding = () => {
        const landingUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin.replace(':5175', ':5173').replace('admin.', '');
        window.location.href = landingUrl;
    };

    // Derive page title from path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        const segment = path.split('/').filter(Boolean)[0];
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-950 font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navigation Bar — visible on all breakpoints */}
                <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center gap-4">
                    {/* Mobile: hamburger */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 -ml-1 text-gray-600 dark:text-slate-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                        <Menu size={22} />
                    </button>

                    {/* Page title */}
                    <h1 className="text-base font-bold text-gray-900 dark:text-white truncate flex-1">
                        {getPageTitle()}
                    </h1>

                    {/* Desktop: View Website button */}
                    <button
                        onClick={handleGoToLanding}
                        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-800/50"
                        title="Go to website"
                    >
                        <Home size={16} />
                        Go to Homepage
                    </button>

                    {/* Notification bell */}
                    <button className="relative p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                    </button>

                    {/* Admin avatar */}
                    <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-slate-800 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                            {(user?.name || 'A')[0].toUpperCase()}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Super Admin</p>
                        </div>
                        <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
                    </div>

                    {/* Mobile: Home icon */}
                    <button
                        onClick={handleGoToLanding}
                        className="md:hidden p-2 text-gray-600 dark:text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                        title="Go to Homepage"
                    >
                        <Home size={20} />
                    </button>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden min-w-0 w-full max-w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
