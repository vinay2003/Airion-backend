import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import FallingLeaves from './FallingLeaves';
import FallingSnow from './FallingSnow';

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
        <div className="flex min-h-screen bg-[var(--airion-bg-base)] text-[var(--airion-text-primary)] font-sans antialiased overflow-hidden transition-colors duration-300 relative">
            <div className="rgb-bg-container">
                <div className="rgb-glow-node node-1" />
                <div className="rgb-glow-node node-2" />
                <div className="rgb-glow-node node-3" />
            </div>

            {/* Dynamic Nature Nodes — Small falling leaves & Shimmering Snow */}
            <FallingLeaves />
            <FallingSnow />

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
