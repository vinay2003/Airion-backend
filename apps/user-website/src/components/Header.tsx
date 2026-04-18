import React, { useState, useEffect, useRef } from 'react';
import {
    User as UserIcon, Globe, Moon, Sun,
    Sparkles, ChevronDown, LayoutDashboard, LogOut,
    Settings, ArrowRight
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
// Header Component
// ─────────────────────────────────────────────
const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const userMenuRef = useRef<HTMLDivElement>(null);


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

    useEffect(() => {
        setIsUserMenuOpen(false);
    }, [location]);


    const isActive = (path: string) => location.pathname === path;


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
            </div>

        </header>
    );
};

export default Header;