import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Home } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleGoToLanding = () => {
        const landingUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin.replace('5175', '5173').replace('admin.', '');
        window.location.href = landingUrl;
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-950 font-sans  ">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-600 dark:text-slate-400  dark: rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
                    <button 
                        onClick={handleGoToLanding}
                        className="p-2 -mr-2 text-gray-600 dark:text-slate-400 rounded-lg"
                        title="View Website"
                    >
                        <Home size={20} />
                    </button>
                </div>

                <div className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden min-w-0 w-full max-w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
