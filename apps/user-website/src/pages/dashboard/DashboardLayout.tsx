import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    LayoutDashboard,
    Bell,
    Settings,
    Globe,
    Moon,
    Sun,
    Search,
    Sparkles,
    Home
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { useAuth } from '@shared/auth/AuthContext';
import { useTheme } from '../../context/ThemeContext';

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

const DashboardLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // Zustand
    const { notifications, chatThreads } = useDashboardStore();
    const unreadNotifications = notifications.filter(n => !n.read).length;
    const unreadChats = chatThreads.filter(c => c.unread).length;

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };



    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Calendar, label: 'My Bookings', path: '/dashboard/bookings', badge: 0 },
        { icon: Heart, label: 'Saved Vendors', path: '/dashboard/saved' },
        { icon: Mail, label: 'Inbox', path: '/dashboard/inbox', badge: unreadChats },
        { icon: CreditCard, label: 'Budget Planner', path: '/dashboard/budget' },
        { icon: Users, label: 'Guest List', path: '/dashboard/guests' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
        { icon: HelpCircle, label: 'Support', path: '/dashboard/support' },
    ];

    return (
        <div className={`min-h-screen bg-neutral-50 dark:bg-slate-950 flex font-sans transition-colors duration-300`}>
            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-40 h-screen w-68 bg-white dark:bg-slate-900 border-r border-neutral-300/80 dark:border-slate-800
                transform transition-all duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between border-b border-neutral-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                        <span className="text-red-500">Ease2event</span>
                    </h2>
                    <button className="lg:hidden text-neutral-500" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) => `
                                flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-medium text-sm
                                ${isActive
                                    ? 'bg-red-50/80 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold'
                                    : 'text-neutral-600 dark:text-slate-400 hover:bg-neutral-100/80 dark:hover:bg-slate-800/80 hover:text-neutral-900 dark:hover:text-white'
                                }
                            `}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && item.badge > 0 ? (
                                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </>
                            )}
                        </NavLink>
                    ))}

                </nav>

                <div className="p-4 border-t border-neutral-200 dark:border-slate-800 space-y-2">
                    <button
                        onClick={() => {
                            const landingUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin.replace(':5174', ':5173').replace(':5175', ':5173');
                            window.location.href = landingUrl;
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all font-medium text-sm"
                    >
                        <Home size={20} />
                        Go to Homepage
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-neutral-600 dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-all font-medium text-sm"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-neutral-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all font-medium text-sm"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Sub-Nav */}
                <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-neutral-300/60 dark:border-slate-800/60 h-16 flex items-center justify-between px-4 md:px-6">
                    <button className="lg:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                        <Menu size={20} />
                    </button>

                    <div className="flex-1 max-w-md mx-4 hidden md:flex items-center gap-2 bg-neutral-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-neutral-300/30 dark:border-slate-700/50">
                        <Search size={16} className="text-neutral-400" />
                        <input type="text" placeholder="Search budget, vendors..." className="bg-transparent border-none outline-none text-sm text-neutral-700 dark:text-neutral-200 w-full focus:ring-0" />
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <button className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-lg transition">
                            <Globe size={20} />
                        </button>

                        <div className="relative">
                            <button
                                className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-lg transition relative"
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            >
                                <Bell size={20} />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                                )}
                            </button>

                            {/* Notifications Dropdown Drawer Dropdown */}
                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-neutral-300 dark:border-slate-800 rounded-2xl shadow-xl z-20 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-neutral-200 dark:border-slate-800 flex items-center justify-between">
                                                <span className="font-bold text-neutral-900 dark:text-white">Notifications</span>
                                                {unreadNotifications > 0 && (
                                                    <button className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Mark all read</button>
                                                )}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="p-6 text-center text-sm text-neutral-500">No new notifications</div>
                                                ) : notifications.map(n => (
                                                    <div key={n.id} className="p-4 border-b border-neutral-100 dark:border-slate-800/40 hover:bg-neutral-50 dark:hover:bg-slate-800/50 cursor-pointer flex gap-3">
                                                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${n.type === 'offer' ? 'bg-green-100 text-green-600 dark:bg-green-500/20' : n.type === 'booking' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20' : n.type === 'reminder' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20' : 'bg-red-100 text-red-600 dark:bg-red-500/20'}`}>
                                                            {n.type === 'offer' ? <Sparkles size={14} /> : n.type === 'booking' ? <Calendar size={14} /> : <Mail size={14} />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <p className={`text-sm font-bold ${n.read ? 'text-neutral-500 dark:text-slate-400' : 'text-neutral-900 dark:text-white'}`}>{n.title}</p>
                                                                {!n.read && <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />}
                                                            </div>
                                                            <p className="text-xs text-neutral-500 dark:text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                                                            <span className="text-[10px] text-neutral-400 mt-1 block font-medium">{n.date}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-3 border-t border-neutral-200 dark:border-slate-800 text-center">
                                                <button className="text-sm font-bold text-neutral-600 dark:text-slate-300 hover:text-neutral-900 dark:hover:text-white transition-colors">View all</button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-8 w-8 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center font-bold text-xs text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/30">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
                    {/* 🌈 Dynamic RGB Spectrum Background - Only visible in Dark Mode */}
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
                            <div className="absolute inset-0 bg-neutral-50/20 dark:bg-slate-950/40 backdrop-blur-[2px]" />
                            <ShootingStars />
                            <Snowfall />
                            <FlowerPetals />
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto relative z-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
