import React, { useState, useEffect, useRef } from 'react';
import {
    User as UserIcon, Menu, X, Globe, Moon, Sun,
    Sparkles, ChevronDown, LayoutDashboard, LogOut,
    Settings, ArrowRight, Home, ShoppingBag, Package,
    CalendarDays, Info, Phone
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAuth } from '@ease2event/shared/auth';

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
            className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
        >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                {user?.name?.[0] || <UserIcon size={20} />}
            </div>
            <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px]">{user?.name}</p>
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

// ─────────────────────────────────────────────
// Nav icon map for mobile drawer
// ─────────────────────────────────────────────
const navIconMap: Record<string, React.ReactNode> = {
    Home: <Home size={18} />,
    Marketplace: <ShoppingBag size={18} />,
    Packages: <Package size={18} />,
    Events: <CalendarDays size={18} />,
    Weddings: <CalendarDays size={16} />,
    Parties: <CalendarDays size={16} />,
    Corporate: <CalendarDays size={16} />,
    'About Us': <Info size={18} />,
    Contact: <Phone size={18} />,
};

// ─────────────────────────────────────────────
// Header Component
// ─────────────────────────────────────────────
const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const userMenuRef = useRef<HTMLDivElement>(null);

    const openMenu = () => setIsMenuOpen(true);
    const closeMenu = () => { setIsMenuOpen(false); setOpenAccordion(null); };

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Marketplace', path: '/search' },
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

    // Close on route change
    useEffect(() => {
        closeMenu();
        setIsUserMenuOpen(false);
    }, [location]);

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const isActive = (path: string) => location.pathname === path;

    // ── stagger variants for nav items ──
    const listVariants: Variants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
    };
    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -16 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
    };

    return (
        <header
            className={`w-full py-4 px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-[1000] transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-md'
                    : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'
                } border-b border-red-100 dark:border-slate-800`}
        >
            {/* ── Logo ── */}
            <Link
                to="/"
                className="text-2xl md:text-3xl font-bold z-50 hover:scale-105 transition-transform flex items-center gap-2 flex-shrink-0"
            >
                <Sparkles size={28} className="text-red-600 hidden sm:block animate-pulse" />
                <span className="text-red-600">Ease2event</span>
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

            {/* ── Desktop Actions ── */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
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

            {/* ── Mobile Top-Bar Actions ── */}
            <div className="flex lg:hidden items-center gap-2">
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

                {/* Hamburger */}
                <button
                    onClick={openMenu}
                    className="flex h-10 w-10 items-center justify-center text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* ════════════════════════════════════════
                MOBILE SIDE DRAWER
                FIX: position:fixed overlay — does NOT
                push content down. Uses flex col so
                footer always stays pinned at bottom.
            ════════════════════════════════════════ */}
            <AnimatePresence>
                {isMenuOpen && (
                    /* Portal-level wrapper */
                    <div className="fixed inset-0 z-[9999] lg:hidden">

                        {/* Dim backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={closeMenu}
                        />

                        {/* ── Drawer Panel ── */}
                        <motion.div
                            key="drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.8 }}
                            /* 
                              KEY FIX:
                              - w-[82vw] max-w-[340px] → fits small phones (360px) perfectly
                              - h-full (= 100dvh fallback via inset-y-0) 
                              - flex flex-col → header / scroll-area / footer stack correctly
                              - overflow-hidden on panel itself so children control scroll
                            */
                            className="absolute inset-y-0 left-0 w-[82vw] max-w-[340px] h-full flex flex-col
                                       bg-white dark:bg-slate-950
                                       shadow-[20px_0_60px_rgba(0,0,0,0.35)]
                                       border-r border-gray-100 dark:border-slate-800
                                       overflow-hidden"
                        >
                            {/* ── Drawer Header ── */}
                            <div className="flex-shrink-0 flex items-center justify-between px-5 py-4
                                            border-b border-gray-100 dark:border-slate-800
                                            bg-white dark:bg-slate-950">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center shadow-md shadow-red-500/30">
                                        <Sparkles size={18} className="text-white" />
                                    </div>
                                    <div>
                                        {/* FIX: was "AIRION MENU" — corrected to brand name */}
                                        <p className="text-base font-black text-gray-900 dark:text-white leading-none">
                                            Ease2event
                                        </p>
                                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-0.5">
                                            Navigation
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeMenu}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl
                                               bg-gray-100 dark:bg-slate-800
                                               text-gray-700 dark:text-white
                                               hover:bg-red-50 dark:hover:bg-red-900/20
                                               hover:text-red-500 transition-all active:scale-90"
                                    aria-label="Close menu"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* ── Scrollable Body ── 
                                FIX: flex-1 + overflow-y-auto ensures this area
                                fills the middle and scrolls independently,
                                so footer never overlaps content.
                            ── */}
                            <div className="flex-1 overflow-y-auto overscroll-contain
                                            bg-white dark:bg-slate-950
                                            px-4 py-5 space-y-2
                                            [-webkit-overflow-scrolling:touch]">

                                {/* Nav Items */}
                                <motion.nav
                                    variants={listVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-1"
                                >
                                    {navItems.map((item) => (
                                        <motion.div key={item.name} variants={itemVariants}>
                                            {item.children ? (
                                                /* Accordion for children */
                                                <div>
                                                    <button
                                                        onClick={() =>
                                                            setOpenAccordion(
                                                                openAccordion === item.name ? null : item.name
                                                            )
                                                        }
                                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all
                                                            ${openAccordion === item.name
                                                                ? 'bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400'
                                                                : 'bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 hover:bg-red-50 dark:hover:bg-red-900/10'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className={`${openAccordion === item.name ? 'text-red-500' : 'text-gray-400 dark:text-slate-500'}`}>
                                                                {navIconMap[item.name]}
                                                            </span>
                                                            <span className="text-sm font-bold">{item.name}</span>
                                                        </div>
                                                        <ChevronDown
                                                            size={15}
                                                            className={`text-gray-400 transition-transform duration-300
                                                                ${openAccordion === item.name ? 'rotate-180 text-red-500' : ''}`}
                                                        />
                                                    </button>

                                                    <AnimatePresence>
                                                        {openAccordion === item.name && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.22, ease: 'easeInOut' }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="pl-4 pr-1 pt-1.5 pb-1 space-y-1">
                                                                    {item.children.map((child) => (
                                                                        <Link
                                                                            key={child.name}
                                                                            to={child.path}
                                                                            onClick={closeMenu}
                                                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                                                                                ${isActive(child.path)
                                                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                                                                                    : 'text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/15 hover:text-red-600 dark:hover:text-red-400'
                                                                                }`}
                                                                        >
                                                                            <span className={isActive(child.path) ? 'text-white/80' : 'text-gray-400'}>
                                                                                {navIconMap[child.name]}
                                                                            </span>
                                                                            {child.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                <Link
                                                    to={item.path}
                                                    onClick={closeMenu}
                                                    className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all
                                                        ${isActive(item.path)
                                                            ? 'bg-red-500 text-white shadow-xl shadow-red-500/30'
                                                            : 'bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={isActive(item.path) ? 'text-white/80' : 'text-gray-400 dark:text-slate-500'}>
                                                            {navIconMap[item.name]}
                                                        </span>
                                                        <span className="text-sm font-bold">{item.name}</span>
                                                    </div>
                                                    <ArrowRight
                                                        size={15}
                                                        className={`transition-transform group-hover:translate-x-1
                                                            ${isActive(item.path) ? 'opacity-100 text-white' : 'opacity-30'}`}
                                                    />
                                                </Link>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.nav>

                                {/* Divider */}
                                <div className="h-px bg-gray-100 dark:bg-slate-800 mx-1" />

                                {/* Settings Tiles */}
                                <div className="space-y-2 pt-1">
                                    {/* Theme toggle */}
                                    <div className="flex items-center justify-between px-4 py-3.5
                                                    bg-gray-50 dark:bg-slate-900
                                                    rounded-2xl border border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            {theme === 'dark'
                                                ? <Moon size={17} className="text-blue-400" />
                                                : <Sun size={17} className="text-yellow-500" />}
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                            </span>
                                        </div>
                                        {/* Toggle pill */}
                                        <button
                                            onClick={toggleTheme}
                                            aria-label="Toggle theme"
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-300
                                                ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm
                                                    transition-all duration-300
                                                    ${theme === 'dark' ? 'left-6' : 'left-1'}`}
                                            />
                                        </button>
                                    </div>

                                    {/* Language */}
                                    <div className="flex items-center justify-between px-4 py-3.5
                                                    bg-gray-50 dark:bg-slate-900
                                                    rounded-2xl border border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <Globe size={17} className="text-gray-400" />
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">Language</span>
                                        </div>
                                        <span className="text-[11px] font-black text-red-500 uppercase tracking-widest">
                                            English
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Drawer Footer ──
                                FIX: flex-shrink-0 keeps footer pinned at bottom.
                                No longer bleeds into nav content area.
                            ── */}
                            <div className="flex-shrink-0 px-4 py-5
                                            border-t border-gray-100 dark:border-slate-800
                                            bg-gray-50 dark:bg-slate-900">
                                {isAuthenticated ? (
                                    <div className="space-y-3">
                                        {/* User info row */}
                                        <div className="flex items-center gap-3 px-1 pb-1">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-black text-base">
                                                {user?.name?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{user?.name}</p>
                                                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{user?.email}</p>
                                            </div>
                                        </div>

                                        <Link
                                            to="/dashboard"
                                            onClick={closeMenu}
                                            className="flex items-center justify-center gap-2 w-full
                                                       bg-gray-900 dark:bg-white
                                                       text-white dark:text-gray-900
                                                       py-3.5 rounded-2xl font-black text-sm
                                                       uppercase tracking-widest transition-all
                                                       hover:bg-red-600 dark:hover:bg-red-50 active:scale-[0.98]"
                                        >
                                            <LayoutDashboard size={16} />
                                            Dashboard
                                        </Link>

                                        <button
                                            onClick={async () => { closeMenu(); await logout(); }}
                                            className="w-full flex items-center justify-center gap-2
                                                       bg-white dark:bg-slate-800
                                                       border border-red-200 dark:border-red-900/40
                                                       text-red-500 py-3 rounded-2xl font-bold text-sm
                                                       uppercase tracking-wider transition-all
                                                       hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.98]"
                                        >
                                            <LogOut size={16} />
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            to="/login"
                                            onClick={closeMenu}
                                            className="block w-full bg-red-600 hover:bg-red-700 active:scale-[0.98]
                                                       text-white py-3.5 rounded-2xl font-black text-sm
                                                       uppercase tracking-widest text-center
                                                       shadow-lg shadow-red-500/25 transition-all"
                                        >
                                            Login / Sign Up
                                        </Link>
                                        <Link
                                            to="/contact"
                                            onClick={closeMenu}
                                            className="block w-full border border-gray-200 dark:border-slate-700
                                                       text-gray-700 dark:text-white py-3 rounded-2xl font-bold text-sm
                                                       uppercase tracking-wider text-center
                                                       hover:bg-gray-100 dark:hover:bg-slate-800
                                                       active:scale-[0.98] transition-all"
                                        >
                                            Contact Support
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