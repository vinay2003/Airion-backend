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

const ShootingStars = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: "-100%", y: "-100%", opacity: 0 }}
                    animate={{
                        x: "200%",
                        y: "200%",
                        opacity: [0, 1, 0.5, 0]
                    }}
                    transition={{
                        duration: Math.random() * 2 + 1.5,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        repeatDelay: Math.random() * 15,
                        ease: "linear"
                    }}
                    className="absolute w-[1px] h-[80px] sm:h-[120px] bg-gradient-to-b from-white via-white/50 to-transparent -rotate-45"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 40 - 20}%`,
                    }}
                />
            ))}
        </div>
    );
};

const Snowfall = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {[...Array(40)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{
                        y: "110vh",
                        x: [
                            `${Math.random() * 100}%`,
                            `${Math.random() * 100 + (Math.random() * 4 - 2)}%`,
                            `${Math.random() * 100}%`
                        ],
                        opacity: [0, 0.4, 0.4, 0]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 20,
                        ease: "linear"
                    }}
                    className="absolute w-[2px] h-[2px] sm:w-[3px] sm:h-[3px] bg-white rounded-full blur-[0.5px]"
                    style={{
                        left: `${Math.random() * 100}%`,
                    }}
                />
            ))}
        </div>
    );
};

const FlowerPetals = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 0, rotate: 0 }}
                    animate={{
                        y: "110vh",
                        x: [
                            `${Math.random() * 100}%`,
                            `${Math.random() * 100 + (Math.random() * 20 - 10)}%`,
                            `${Math.random() * 100}%`
                        ],
                        rotate: [0, 180, 360, 540],
                        opacity: [0, 0.6, 0.6, 0]
                    }}
                    transition={{
                        duration: Math.random() * 15 + 15,
                        repeat: Infinity,
                        delay: Math.random() * 25,
                        ease: "easeInOut"
                    }}
                    className="absolute w-2.5 h-2.5 sm:w-4 sm:h-4 bg-red-400/60 dark:bg-pink-500/40 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        borderRadius: '40% 70% 40% 70%',
                        boxShadow: '0 0 10px rgba(244, 114, 182, 0.2)'
                    }}
                />
            ))}
        </div>
    );
};

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);
    const { theme } = useTheme();

    return (
        <div className="flex min-h-screen bg-[var(--ease2event-bg-base)] text-[var(--ease2event-text-primary)] font-sans antialiased overflow-hidden transition-colors duration-300 relative">
            {theme === 'dark' && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                    <motion.div
                        animate={{
                            filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)']
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute inset-0"
                    >
                        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-red-600/10 dark:bg-red-500/[0.15] blur-[100px] sm:blur-[160px] animate-pulse" />
                        <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] rounded-full bg-blue-600/10 dark:bg-indigo-500/[0.15] blur-[100px] sm:blur-[140px]" />
                        <div className="absolute -bottom-[10%] left-[15%] w-[45%] h-[45%] rounded-full bg-purple-600/10 dark:bg-purple-500/[0.15] blur-[100px] sm:blur-[180px]" />
                    </motion.div>
                    <div className="absolute inset-0 bg-[var(--ease2event-bg-base)]/40 backdrop-blur-[2px]" />
                    <ShootingStars />
                    <Snowfall />
                    <FlowerPetals />
                </div>
            )}

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
