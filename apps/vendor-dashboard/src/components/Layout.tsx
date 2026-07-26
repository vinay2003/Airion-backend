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
 <div className="flex min-h-screen bg-[var(--ease2event-bg-base)] text-[var(--ease2event-text-primary)] font-sans antialiased transition-colors relative">
 {theme === 'dark' && (
 <div className="fixed inset-0 z-0 pointer-events-none select-none">
 <div className="absolute inset-0">
 <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-red-600/10 dark:bg-red-500/[0.15] blur-[100px] sm:blur-[160px]" />
 <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] rounded-full bg-blue-600/10 dark:bg-indigo-500/[0.15] blur-[100px] sm:blur-[140px]" />
 <div className="absolute -bottom-[10%] left-[15%] w-[45%] h-[45%] rounded-full bg-purple-600/10 dark:bg-purple-500/[0.15] blur-[100px] sm:blur-[180px]" />
 </div>
 <div className="absolute inset-0 bg-[var(--ease2event-bg-base)]/40 backdrop-blur-[2px]" />
 </div>
 )}

 <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
 <div className="flex-1 flex flex-col min-w-0 transition-all relative z-10">
 <div className="sticky top-0 z-30 bg-[var(--ease2event-bg-base)]/80 backdrop-blur-md">
   <Topbar title={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />
 </div>
 <main className="flex-1 p-4 md:p-8 w-full max-w-[1440px] mx-auto text-xl relative z-20">
 <Outlet />
 </main>
 </div>
 </div>
 );
};

export default Layout;
