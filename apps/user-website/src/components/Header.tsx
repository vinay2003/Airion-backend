import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Menu, X, Globe, Moon, Sun, Search, Sparkles, ChevronDown, LayoutDashboard, LogOut, Settings, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@ease2event/shared/auth';

const UserProfileMenu = ({
    user,
    isUserMenuOpen,
    setIsUserMenuOpen,
    userMenuRef,
    logout
}: {
    user: any,
    isUserMenuOpen: boolean,
    setIsUserMenuOpen: (o: boolean) => void,
    userMenuRef: React.RefObject<HTMLDivElement>,
    logout: () => Promise<void>
}) => (
    <div className="relative" ref={userMenuRef}>
        <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
        >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                {user?.name?.[0] || <UserIcon size={20} />}
            </div>
            <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px]">{user?.name}</p>
                <p className="text-[10px] text-gray-500 font-medium">Account</p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
            {isUserMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-[60]"
                >
                    <div className="p-4 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                        <Link
                            to="/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                        >
                            <LayoutDashboard size={18} />
                            User Dashboard
                        </Link>
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

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const userMenuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Marketplace', path: '/search' },
        // { name: 'Inspiration', path: '/inspiration' },
        { name: 'Packages', path: '/packages' },
        {
            name: 'Events',
            path: '/category',
            children: [
                { name: 'Weddings', path: '/category/weddings' },
                { name: 'Parties', path: '/category/parties' },
                { name: 'Corporate', path: '/category/corporate' }
            ]
        },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            if (window.scrollY > 20 && isSearchOpen) setIsSearchOpen(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSearchOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
    }, [location]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen || isSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen, isSearchOpen]);

    const isActivePath = (path: string) => location.pathname === path;

    return (
        <header
            className={`w-full py-4 px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${isScrolled || isSearchOpen
                ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-md'
                : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'
                } border-b border-red-100 dark:border-slate-800`}
        >
            {/* Backdrop for Mega Menu Search */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 top-[72px] bg-black/40 backdrop-blur-sm z-40 hidden lg:block"
                        onClick={() => setIsSearchOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Logo */}
            <Link
                to="/"
                className="text-2xl md:text-3xl font-bold z-50 hover:scale-105 transition-transform flex items-center gap-2 flex-shrink-0"
            >
                <Sparkles
                    size={28}
                    className="text-red-600 hidden sm:block animate-pulse"
                />

                <span className="text-red-600">
                    Ease2event
                </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3">
                {navItems.map((item) => (
                    <div key={item.name} className="relative group px-1">
                        {item.children ? (
                            <div className="flex items-center gap-1 group">
                                <button className="flex items-center gap-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-red-500 transition-all px-4 py-2 rounded-xl group-hover:bg-red-50 dark:group-hover:bg-red-900/20">
                                    {item.name}
                                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                </button>
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
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
                                className={`text-sm font-bold transition-all px-4 py-2 rounded-xl flex items-center gap-2 relative ${isActivePath(item.path)
                                    ? 'text-red-600'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
                                    }`}
                            >
                                {item.name}
                                {isActivePath(item.path) && (
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

            {/* Mapping for Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                {/* <Link
                    to="/plan-event"
                    className="text-sm font-medium text-neutral-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-slate-800 px-4 py-2.5 rounded-full transition-all"
                >
                    Plan Your Event
                </Link> */}
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
                <button
                    onClick={toggleTheme}
                    className="text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Mobile & Tablet Toggle Action Container */}
            <div className="flex lg:hidden items-center gap-2 items-center">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg shadow-red-500/20"
                    >
                        Login
                    </Link>
                )}

                <button
                    onClick={toggleMenu}
                    className="flex h-11 w-11 items-center justify-center text-gray-700 dark:text-slate-300 z-50 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={26} className="text-gray-900 dark:text-white" /> : <Menu size={26} />}
                </button>
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
                                    <div className="w-10 h-10 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                                        <Sparkles size={20} className="text-white animate-pulse" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black text-gray-900 dark:text-white leading-none">Explore</span>
                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">Airion Menu</span>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleMenu}
                                    className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-gray-900 dark:text-white hover:border-red-500 transition-all active:scale-90"
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
                                                            className={`flex items-center justify-between group py-3.5 px-4 rounded-2xl transition-all ${isActivePath(child.path)
                                                                ? 'bg-red-500 text-white shadow-xl shadow-red-500/30'
                                                                : 'bg-gray-50/50 dark:bg-slate-900/50 text-gray-900 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/10'
                                                                }`}
                                                        >
                                                            <span className="text-base font-bold">{child.name}</span>
                                                            <ArrowRight size={16} className={`transition-transform group-hover:translate-x-1 ${isActivePath(child.path) ? 'opacity-100' : 'opacity-0'}`} />
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Link
                                                    to={item.path}
                                                    onClick={toggleMenu}
                                                    className={`flex items-center justify-between group py-4 px-5 rounded-2xl transition-all ${isActivePath(item.path)
                                                        ? 'bg-red-500 text-white shadow-xl shadow-red-500/30'
                                                        : 'bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-slate-100 hover:border-red-500 shadow-sm'
                                                        }`}
                                                >
                                                    <span className="text-lg font-black tracking-tight">{item.name}</span>
                                                    <ArrowRight size={18} className={`transition-transform group-hover:translate-x-1 ${isActivePath(item.path) ? 'opacity-100' : 'opacity-30'}`} />
                                                </Link>
                                            )}
                                        </div>
                                    ))}

                                    {/* Additional CTA: Plan Your Event - Removed as per request */}
                                    {/* <Link
                                        to="/plan-event"
                                        onClick={toggleMenu}
                                        className={`mt-4 flex items-center justify-between group py-5 px-5 rounded-2xl transition-all bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xl shadow-red-500/40 relative overflow-hidden`}
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        <span className="text-lg font-black tracking-tight uppercase relative z-10">Plan Your Event</span>
                                        <Sparkles size={20} className="text-white/80 group-hover:rotate-12 transition-transform" />
                                    </Link> */}
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
                                                {user?.name?.[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 dark:text-white">{user?.name}</span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Member ID: #2384</span>
                                            </div>
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={toggleMenu}
                                            className="flex items-center justify-center gap-2 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02]"
                                        >
                                            <LayoutDashboard size={18} />
                                            Access Dashboard
                                        </Link>
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
                                            className="w-full bg-red-600 hover:bg-black text-white py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest text-center shadow-xl shadow-red-500/30"
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
