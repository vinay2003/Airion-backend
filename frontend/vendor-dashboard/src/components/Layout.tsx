import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

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

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 md:ml-[240px] transition-all duration-300">
                <Topbar title={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-[1200px] mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
