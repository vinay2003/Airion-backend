import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const getPageTitle = (pathname: string) => {
    switch (pathname) {
        case '/':
        case '/dashboard': return 'Dashboard Overview';
        case '/events': return 'Event Management';
        case '/bookings': return 'Bookings Management';
        case '/earnings': return 'Earnings & Financials';
        case '/calendar': return 'Calendar View';
        case '/products': return 'Products & Services';
        case '/enquiries': return 'Enquiries Inbox';
        case '/analytics': return 'Popular Events Analytics';
        case '/profile':
        case '/settings': return 'Profile & Settings';
        default: return 'Vendor Dashboard';
    }
};



const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);
    const { theme } = useTheme();

    return (
        <div className="flex min-h-screen bg-[var(--ease2event-bg-base)] text-[var(--ease2event-text-primary)] font-sans antialiased overflow-hidden transition-colors duration-300 relative">


            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 h-screen overflow-hidden relative z-10">
                <Topbar title={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[1440px] mx-auto text-xl relative z-20">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
