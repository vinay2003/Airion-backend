import React, { useState, useEffect, useRef } from 'react';
import {
    User as UserIcon, Globe, Moon, Sun,
    ChevronDown, LayoutDashboard, LogOut,
    Settings, ArrowRight, X, Menu, Bell, ShoppingCart, CalendarCheck
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAuth, getPortalUrl } from '@ease2event/shared/auth';
import { getSocket } from '@shared/auth/socket';
import { useCart } from '../context/CartContext';
import { useBookingCart } from '../context/BookingCartContext';

// ─────────────────────────────────────────────
// UserProfileMenu — unchanged from original
// ─────────────────────────────────────────────
const UserProfileMenu = ({
    user,
    isUserMenuOpen,
    setIsUserMenuOpen,
    userMenuRef,
    logout,
}: {
    user: any;
    isUserMenuOpen: boolean;
    setIsUserMenuOpen: (o: boolean) => void;
    userMenuRef: React.RefObject<HTMLDivElement>;
    logout: () => Promise<void>;
}) => (
    <div className="relative" ref={userMenuRef}>
        <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-transparent  dark:"
        >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <UserIcon size={20} />}
            </div>
            <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px]">
                    {user?.name || user?.phoneNumber || (user?.email && user.email.split('@')[0]) || 'My Account'}
                </p>
                <p className="text-[10px] text-gray-500 font-medium">Account</p>
            </div>
            <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
            />
        </button>

        <AnimatePresence>
            {isUserMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-[1010]"
                >
                    <div className="p-4 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {user?.name || user?.phoneNumber || (user?.email && user.email.split('@')[0]) || 'My Account'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email || user?.phoneNumber}</p>
                    </div>
                    <div className="p-2">
                        {user?.role === 'user' ? (
                            <Link
                                to="/dashboard"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                            >
                                <LayoutDashboard size={18} />
                                User Dashboard
                            </Link>
                        ) : (
                            <a
                                href={getPortalUrl(user?.role as any)}
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                            >
                                <LayoutDashboard size={18} />
                                {user?.role === 'vendor' ? 'Vendor Dashboard' : 'Admin Panel'}
                            </a>
                        )}
                        <Link
                            to="/dashboard/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-all"
                        >
                            <UserIcon size={18} />
                            Profile Settings
                        </Link>
                    </div>
                    <div className="p-2 border-t border-gray-100 dark:border-slate-800">
                        <button
                            onClick={async () => {
                                setIsUserMenuOpen(false);
                                await logout();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                            <LogOut size={18} />
                            Log Out
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);


// ─────────────────────────────────────────────
// Header Component
// ─────────────────────────────────────────────
const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasNewNotifications, setHasNewNotifications] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const { totalItems, setIsCartOpen } = useCart();
    const { cartCount } = useBookingCart();
    const location = useLocation();
    const userMenuRef = useRef<HTMLDivElement>(null);


    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Vendors', path: '/search' },
        { name: 'Packages', path: '/packages' },
        {
            name: 'Events',
            path: '/category',
            children: [
                { name: 'Weddings', path: '/category/weddings' },
                { name: 'Parties', path: '/category/parties' },
                { name: 'Corporate', path: '/category/corporate' },
            ],
        },
        { name: 'Shop', path: '/merchandise' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    // Close user dropdown on outside click
    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    // Scroll detection
    useEffect(() => {
        const handle = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handle, { passive: true });
        return () => window.removeEventListener('scroll', handle);
    }, []);

    useEffect(() => {
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
    }, [location]);

    // Live Notification Listener
    useEffect(() => {
        if (!user?.id) return;
        const socket = getSocket();

        if (socket) {
            socket.on('notification_received', () => {
                setHasNewNotifications(true);
            });
        }

        return () => {
            if (socket) socket.off('notification_received');
        };
    }, [user?.id]);


    const isActive = (path: string) => location.pathname === path;


    return (
        <header
            className={`w-full py-3 px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-[1000] transition-all duration-300 ${isScrolled
                ? 'bg-white dark:bg-slate-900 shadow-md py-2'
                : 'bg-white dark:bg-slate-900'
                } border-b border-red-100 dark:border-slate-800`}
        >
            {/* ── Logo ── */}
            <Link
                to="/"
                className="z-50  transition-transform flex items-center gap-3 flex-shrink-0"
            >
                <img
                    src="/logo.svg"
                    alt="Ease2Event Logo"
                    className={`${isScrolled ? 'h-10' : 'h-12'} w-auto transition-all duration-300 object-contain drop-shadow-md`}
                />
                <span className={`${isScrolled ? 'text-base' : 'text-lg'} font-black tracking-tight text-gray-900 dark:text-white hidden sm:block transition-all duration-300`}>
                    Ease<span className="text-red-500">2</span>Event
                </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-3">
                {navItems.map((item) => (
                    <div key={item.name} className="relative group px-1">
                        {item.children ? (
                            <div className="flex items-center gap-1 group">
                                <button className="flex items-center gap-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-red-500 transition-all px-4 py-2 rounded-xl group-hover:bg-red-50 dark:group-hover:bg-red-900/20">
                                    {item.name}
                                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                </button>
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                                    <div className="p-2">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                to={child.path}
                                                className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all"
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to={item.path}
                                className={`text-sm font-bold transition-all px-4 py-2 rounded-xl flex items-center gap-2 relative ${isActive(item.path)
                                    ? 'text-red-600'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
                                    }`}
                            >
                                {item.name}
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-red-500 rounded-full"
                                    />
                                )}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                {isAuthenticated && (
                    user?.role === 'user' ? (
                        <Link
                            to="/dashboard"
                            onClick={() => setHasNewNotifications(false)}
                            className="text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 relative group"
                            title="Go to User Dashboard"
                        >
                            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                        </Link>
                    ) : (
                        <a
                            href={getPortalUrl(user?.role as any)}
                            onClick={() => setHasNewNotifications(false)}
                            className="text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 relative group"
                            title={user?.role === 'vendor' ? 'Go to Vendor Dashboard' : 'Go to Admin Panel'}
                        >
                            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                        </a>
                    )
                )}
                {isAuthenticated && (
                    user?.role === 'vendor' ? (
                        <a
                            href={getPortalUrl('vendor' as any) + '/enquiries'}
                            onClick={() => setHasNewNotifications(false)}
                            className="text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 relative"
                            title="Go to Vendor Enquiries"
                        >
                            <Bell size={20} />
                            {hasNewNotifications && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                                />
                            )}
                        </a>
                    ) : (
                        <Link
                            to="/dashboard/bookings"
                            onClick={() => setHasNewNotifications(false)}
                            className="text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 relative"
                            title="View Notifications & Bookings"
                        >
                            <Bell size={20} />
                            {hasNewNotifications && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                                />
                            )}
                        </Link>
                    )
                )}
                <Link
                    to="/cart"
                    className="text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 relative"
                >
                    <ShoppingCart size={20} />
                    {totalItems > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900"
                        >
                            {totalItems}
                        </motion.span>
                    )}
                </Link>
                {/* Booking Cart */}
                <Link
                    to="/booking-cart"
                    className="text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 relative"
                    title="Booking Cart"
                >
                    <CalendarCheck size={20} />
                    {cartCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900"
                        >
                            {cartCount}
                        </motion.span>
                    )}
                </Link>
                <button
                    onClick={toggleTheme}
                    className="text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                {isAuthenticated ? (
                    <UserProfileMenu
                        user={user}
                        isUserMenuOpen={isUserMenuOpen}
                        setIsUserMenuOpen={setIsUserMenuOpen}
                        userMenuRef={userMenuRef}
                        logout={logout}
                    />
                ) : (
                    <Link
                        to="/login"
                        className="text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                        <UserIcon size={24} />
                    </Link>
                )}
            </div>

            <div className="flex lg:hidden items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <Link
                    to="/cart"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 relative"
                    aria-label="Open cart"
                >
                    <ShoppingCart size={18} />
                    {totalItems > 0 && (
                        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                            {totalItems}
                        </span>
                    )}
                </Link>

                <span className="hidden">
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-all active:scale-95"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </span>

                {isAuthenticated ? (
                    <UserProfileMenu
                        user={user}
                        isUserMenuOpen={isUserMenuOpen}
                        setIsUserMenuOpen={setIsUserMenuOpen}
                        userMenuRef={userMenuRef}
                        logout={logout}
                    />
                ) : (
                    <Link
                        to="/login"
                        className="bg-red-500 hover:bg-red-600 text-white px-5 h-[38px] flex items-center justify-center rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-500/30 whitespace-nowrap"
                    >
                        Login
                    </Link>
                )}
            </div>

            {/* Mobile & Tablet Side Drawer Navigation */}
            <AnimatePresence mode="wait">
                {isMenuOpen && (
                    <div key="mobile-menu-portal" className="relative z-[100]">
                        {/* Backdrop with localized blur */}
                        <motion.div
                            key="menu-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-xl z-[100] lg:hidden"
                            onClick={toggleMenu}
                        />

                        {/* Solid Menu Panel */}
                        <motion.div
                            key="menu-panel"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                            className="fixed inset-y-0 right-0 w-full xs:w-80 sm:w-96 bg-white dark:bg-slate-950 z-[110] flex flex-col shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.3)] lg:hidden border-l border-gray-100 dark:border-slate-800"
                        >
                            {/* Drawer Header - FORCED SOLID BACKGROUND */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-[120]">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/logo.svg"
                                        alt="Ease2Event Logo"
                                        className="h-10 w-auto object-contain flex-shrink-0 drop-shadow-md"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black text-gray-900 dark:text-white leading-none">Ease<span className="text-red-500">2</span>Event</span>
                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">Ease2event Menu</span>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleMenu}
                                    className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-gray-900 dark:text-white  transition-all active:scale-90"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Drawer Content - FORCED SOLID BACKGROUND */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-slate-950 custom-scrollbar">
                                {/* Core Navigation */}
                                <nav className="space-y-1.5 px-1">
                                    {navItems.map((item) => (
                                        <div key={item.name} className="space-y-1.5">
                                            {item.children ? (
                                                <div className="space-y-1.5 py-3">
                                                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-slate-500">
                                                        {item.name}
                                                    </div>
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.name}
                                                            to={child.path}
                                                            onClick={toggleMenu}
                                                            className={`flex items-center justify-between group py-3.5 px-4 rounded-2xl transition-all ${isActive(child.path)
                                                                ? 'bg-red-500 text-white shadow-xl shadow-red-500/30'
                                                                : 'bg-gray-50/50 dark:bg-slate-900/50 text-gray-900 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/10'
                                                                }`}
                                                        >
                                                            <span className="text-base font-bold">{child.name}</span>
                                                            <ArrowRight size={16} className={`transition-transform group-hover:translate-x-1 ${isActive(child.path) ? 'opacity-100' : 'opacity-0'}`} />
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Link
                                                    to={item.path}
                                                    onClick={toggleMenu}
                                                    className={`flex items-center justify-between group py-4 px-5 rounded-2xl transition-all ${isActive(item.path)
                                                        ? 'bg-red-500 text-white shadow-xl shadow-red-500/30'
                                                        : 'bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-slate-100  shadow-sm'
                                                        }`}
                                                >
                                                    <span className="text-lg font-black tracking-tight">{item.name}</span>
                                                    <ArrowRight size={18} className={`transition-transform group-hover:translate-x-1 ${isActive(item.path) ? 'opacity-100' : 'opacity-30'}`} />
                                                </Link>
                                            )}
                                        </div>
                                    ))}


                                </nav>

                                {/* Theme & Settings */}
                                <div className="grid grid-cols-1 gap-3 p-1">
                                    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            {theme === 'dark' ? <Moon size={20} className="text-blue-500" /> : <Sun size={20} className="text-yellow-500" />}
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">Appearance</span>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className="w-12 h-6 bg-gray-200 dark:bg-slate-700 rounded-full relative transition-colors"
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <Globe size={20} className="text-gray-400" />
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">Language</span>
                                        </div>
                                        <span className="text-xs font-black text-red-500 uppercase tracking-widest">English</span>
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer - FORCED SOLID BACKGROUND */}
                            <div className="mt-auto p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 sticky bottom-0 z-[120]">
                                {isAuthenticated ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white text-xl font-black">
                                                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <UserIcon size={24} color="white" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 dark:text-white">
                                                    {user?.name || user?.phoneNumber || (user?.email && user.email.split('@')[0]) || 'My Account'}
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user?.email || 'Member ID: #2384'}</span>
                                            </div>
                                        </div>
                                        {user?.role === 'user' ? (
                                            <Link
                                                to="/dashboard"
                                                onClick={toggleMenu}
                                                className="flex items-center justify-center gap-2 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02]"
                                            >
                                                <LayoutDashboard size={18} />
                                                User Dashboard
                                            </Link>
                                        ) : (
                                            <a
                                                href={getPortalUrl(user?.role as any)}
                                                onClick={toggleMenu}
                                                className="flex items-center justify-center gap-2 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02]"
                                            >
                                                <LayoutDashboard size={18} />
                                                {user?.role === 'vendor' ? 'Vendor Portal' : 'Admin Node'}
                                            </a>
                                        )}
                                        <button
                                            onClick={async () => {
                                                toggleMenu();
                                                await logout();
                                            }}
                                            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border-2 border-red-500/10 text-red-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                                        >
                                            <LogOut size={18} />
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        <Link
                                            to="/login"
                                            onClick={toggleMenu}
                                            className="w-full bg-red-600 hover:bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-center shadow-xl shadow-red-500/30"
                                        >
                                            LOGIN / SIGNUP
                                        </Link>
                                        <Link
                                            to="/contact"
                                            onClick={toggleMenu}
                                            className="w-full border-2 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            CONTACT SUPPORT
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;