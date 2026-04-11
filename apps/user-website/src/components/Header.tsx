import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Menu, X, Globe, Moon, Sun, Search, Sparkles, ChevronDown, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { events } from '../data/events';
import { useAuth } from '@shared/auth';

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

    const featuredVendors = events.slice(0, 3);

    const UserProfileMenu = () => (
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
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                            >
                                <LayoutDashboard size={18} />
                                User Dashboard
                            </Link>
                            <Link
                                to="/profile"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-all"
                            >
                                <UserIcon size={18} />
                                Profile Settings
                            </Link>
                        </div>
                        <div className="p-2 border-t border-gray-100 dark:border-slate-800">
                            <button
                                onClick={logout}
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

    return (
        <header
            className={`w-full py-4 px-4 md:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${isScrolled || isSearchOpen
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
                className="text-3xl md:text-4xl font-black text-red-600 font-cursive z-50 hover:scale-105 transition-transform flex items-center gap-2 flex-shrink-0 tracking-tighter italic"
            >
                <Sparkles size={28} className="text-red-600 hidden sm:block animate-pulse" />
                Airion
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
                <Link to="/" className={`text-sm font-medium transition-colors ${isActivePath('/') ? 'text-red-500' : 'text-neutral-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400'}`}>Home</Link>
                <Link to="/search" className={`text-sm font-medium transition-colors ${isActivePath('/search') ? 'text-red-500' : 'text-neutral-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400'}`}>Marketplace</Link>
                <Link to="/packages" className={`text-sm font-medium transition-colors ${isActivePath('/packages') ? 'text-red-500' : 'text-neutral-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400'}`}>Packages</Link>
                <Link to="/inspiration" className={`text-sm font-medium transition-colors ${isActivePath('/inspiration') ? 'text-red-500' : 'text-neutral-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400'}`}>Inspiration</Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                <Link
                    to="/plan-event"
                    className="text-sm font-medium text-neutral-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-slate-800 px-4 py-2.5 rounded-full transition-all"
                >
                    Plan Your Event
                </Link>
                {isAuthenticated ? (
                    <UserProfileMenu />
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

            {/* Tablet Navigation (md to lg) */}
            <div className="hidden md:flex lg:hidden items-center gap-3">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                {isAuthenticated ? (
                    <Link to="/dashboard" className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/20">
                        {user?.name?.[0]}
                    </Link>
                ) : (
                    <Link
                        to="/login"
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                    >
                        <UserIcon size={16} />
                    </Link>
                )}
                <button
                    onClick={toggleMenu}
                    className="p-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>


            {/* Mobile Menu Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-gray-700 dark:text-slate-300 z-50 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Toggle menu"
            >
                {isMenuOpen ? <X size={24} className="text-gray-900 dark:text-white" /> : <Menu size={24} />}
            </button>

            {/* Mobile Navigation Overlay */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                        onClick={toggleMenu}
                    />

                    {/* Menu Panel */}
                    <div className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white dark:bg-slate-900 z-50 flex flex-col shadow-2xl md:hidden transform transition-transform duration-300 ease-out">
                        {/* Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
                            <span className="text-xl font-bold text-red-500 font-cursive flex items-center gap-2">
                                <Sparkles size={20} />
                                Menu
                            </span>
                            <button
                                onClick={toggleMenu}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-gray-700 dark:text-slate-300" />
                            </button>
                        </div>

                        {/* Menu Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Navigation Links */}
                            <nav className="space-y-3">
                                <Link
                                    to="/search"
                                    onClick={toggleMenu}
                                    className={`block text-lg font-medium py-3 px-4 rounded-xl transition-colors ${isActivePath('/search')
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                        : 'text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Marketplace
                                </Link>
                                <Link
                                    to="/packages"
                                    onClick={toggleMenu}
                                    className={`block text-lg font-medium py-3 px-4 rounded-xl transition-colors ${isActivePath('/packages')
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                        : 'text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Packages
                                </Link>
                                <Link
                                    to="/plan-event"
                                    onClick={toggleMenu}
                                    className={`block text-lg font-medium py-3 px-4 rounded-xl transition-colors ${isActivePath('/plan-event')
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                        : 'text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Plan Event
                                </Link>
                                <Link
                                    to="/inspiration"
                                    onClick={toggleMenu}
                                    className={`block text-lg font-medium py-3 px-4 rounded-xl transition-colors ${isActivePath('/inspiration')
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                        : 'text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Inspiration
                                </Link>
                                <Link
                                    to="/category/weddings"
                                    onClick={toggleMenu}
                                    className={`block text-lg font-medium py-3 px-4 rounded-xl transition-colors ${isActivePath('/category/weddings')
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                        : 'text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Weddings
                                </Link>
                                <Link
                                    to="/category/parties"
                                    onClick={toggleMenu}
                                    className={`block text-lg font-medium py-3 px-4 rounded-xl transition-colors ${isActivePath('/category/parties')
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                        : 'text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Parties
                                </Link>
                                <Link
                                    to="/about"
                                    onClick={toggleMenu}
                                    className={`block text-lg font-medium py-3 px-4 rounded-xl transition-colors ${isActivePath('/about')
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                        : 'text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    About Us
                                </Link>
                                <Link
                                    to="/contact"
                                    onClick={toggleMenu}
                                    className={`block text-lg font-medium py-3 px-4 rounded-xl transition-colors ${isActivePath('/contact')
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                        : 'text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Contact Us
                                </Link>
                            </nav>

                            <hr className="border-gray-200 dark:border-slate-800" />

                            {/* Settings */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 px-4">
                                    <span className="text-base font-medium text-gray-900 dark:text-slate-100">Language</span>
                                    <button className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                        <Globe size={20} />
                                        <span>EN</span>
                                        <ChevronDown size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between py-2 px-4">
                                    <span className="text-base font-medium text-gray-900 dark:text-slate-100">Theme</span>
                                    <button
                                        onClick={toggleTheme}
                                        className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                                    >
                                        {theme === 'dark' ? (
                                            <>
                                                <Sun size={20} />
                                                <span className="text-sm">Light</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon size={20} />
                                                <span className="text-sm">Dark</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Menu Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-slate-800 space-y-3">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        onClick={toggleMenu}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-base shadow-lg shadow-red-500/20 text-center block transition-all"
                                    >
                                        My Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            toggleMenu();
                                        }}
                                        className="w-full border-2 border-red-500 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-xl font-bold text-base text-center block transition-colors"
                                    >
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={toggleMenu}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-base shadow-lg shadow-red-500/20 text-center block transition-all"
                                    >
                                        Login / Signup
                                    </Link>
                                    <Link
                                        to="/contact"
                                        onClick={toggleMenu}
                                        className="w-full border-2 border-red-500 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-xl font-bold text-base text-center block transition-colors"
                                    >
                                        List Your Business
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Tablet Menu Overlay (md to lg) */}
            {isMenuOpen && (
                <div className="hidden md:block lg:hidden fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg z-40 pt-20">
                    <div className="max-w-2xl mx-auto px-6 py-8">
                        <nav className="grid grid-cols-2 gap-4 mb-8">
                            <Link
                                to="/plan-event"
                                onClick={toggleMenu}
                                className="text-center py-4 px-6 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-900 dark:text-slate-100 font-medium transition-colors"
                            >
                                Plan Event
                            </Link>
                            <Link
                                to="/inspiration"
                                onClick={toggleMenu}
                                className="text-center py-4 px-6 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-900 dark:text-slate-100 font-medium transition-colors"
                            >
                                Inspiration
                            </Link>
                            <Link
                                to="/category/weddings"
                                onClick={toggleMenu}
                                className="text-center py-4 px-6 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-900 dark:text-slate-100 font-medium transition-colors"
                            >
                                Weddings
                            </Link>
                            <Link
                                to="/category/parties"
                                onClick={toggleMenu}
                                className="text-center py-4 px-6 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-900 dark:text-slate-100 font-medium transition-colors"
                            >
                                Parties
                            </Link>
                            <Link
                                to="/about"
                                onClick={toggleMenu}
                                className="text-center py-4 px-6 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-900 dark:text-slate-100 font-medium transition-colors"
                            >
                                About Us
                            </Link>
                        </nav>
                        <Link
                            to="/contact"
                            onClick={toggleMenu}
                            className="block w-full text-center py-4 px-6 rounded-xl border-2 border-red-500 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-colors"
                        >
                            List Your Business
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
