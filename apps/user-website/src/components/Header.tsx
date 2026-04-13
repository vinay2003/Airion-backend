import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Menu, X, Globe, Moon, Sun, Search, Sparkles, ChevronDown, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@ease2event/shared/auth';

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
        { name: 'Packages', path: '/packages' },
        { name: 'Inspiration', path: '/inspiration' },
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
                className="text-3xl md:text-4xl font-bold z-50 hover:scale-105 transition-transform flex items-center gap-2 flex-shrink-0"
            >
                <Sparkles
                    size={28}
                    className="text-red-600 hidden sm:block animate-pulse"
                />

                <span
                    className="tracking-tight text-red-600"
                    style={{ fontFamily: 'Kaushan Script, cursive' }}
                >
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
                                className={`text-sm font-bold transition-all px-4 py-2 rounded-xl flex items-center gap-2 relative ${
                                    isActivePath(item.path)
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
                    <UserProfileMenu />
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
                    className="p-2 text-gray-700 dark:text-slate-300 z-50 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} className="text-gray-900 dark:text-white" /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            {/* Mobile & Tablet Navigation Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden"
                            onClick={toggleMenu}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full xs:w-80 sm:w-96 bg-white dark:bg-[#0F172A] z-[70] flex flex-col shadow-2xl lg:hidden border-l border-gray-100 dark:border-slate-800"
                        >
                            {/* Menu Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-[#0F172A] sticky top-0 z-10">
                                <span className="text-2xl font-black text-red-500 font-cursive flex items-center gap-2 italic">
                                    <Sparkles size={24} className="animate-pulse" />
                                    Explore Airion
                                </span>
                                <button
                                    onClick={toggleMenu}
                                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                                >
                                    <X size={24} className="text-gray-900 dark:text-white" />
                                </button>
                            </div>

                        {/* Menu Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Navigation Links */}
                            <nav className="space-y-1.5">
                                {navItems.map((item) => (
                                    <div key={item.name} className="space-y-1.5">
                                        {item.children ? (
                                            <div className="space-y-1.5 py-2">
                                                <div className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 mt-2 first:mt-0">
                                                    {item.name}
                                                </div>
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        to={child.path}
                                                        onClick={toggleMenu}
                                                        className={`block text-base font-bold py-3 px-4 rounded-xl transition-all ${
                                                            isActivePath(child.path)
                                                                ? 'bg-red-500 text-white shadow-xl shadow-red-500/20'
                                                                : 'text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                        }`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <Link
                                                to={item.path}
                                                onClick={toggleMenu}
                                                className={`block text-lg font-bold py-3.5 px-4 rounded-xl transition-all ${
                                                    isActivePath(item.path)
                                                        ? 'bg-red-500 text-white shadow-xl shadow-red-500/20'
                                                        : 'text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                {item.name}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            <hr className="border-gray-200 dark:border-slate-800" />

                            {/* Options */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 px-4">
                                    <span className="text-base font-bold text-gray-900 dark:text-slate-100">Language</span>
                                    <button className="flex items-center gap-2 text-gray-600 dark:text-slate-400 font-bold hover:text-red-500 transition-colors">
                                        <Globe size={18} />
                                        <span>EN</span>
                                        <ChevronDown size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between py-2 px-4">
                                    <span className="text-base font-bold text-gray-900 dark:text-slate-100">Theme</span>
                                    <button
                                        onClick={toggleTheme}
                                        className="flex items-center gap-2 text-gray-600 dark:text-slate-400 transition-all p-2 bg-gray-50 dark:bg-slate-800/50 rounded-xl"
                                    >
                                        {theme === 'dark' ? (
                                            <>
                                                <Sun size={18} className="text-yellow-500" />
                                                <span className="text-xs font-black uppercase">Light</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon size={18} className="text-blue-500" />
                                                <span className="text-xs font-black uppercase">Dark</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Menu Footer CTA */}
                        <div className="p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 space-y-4">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        onClick={toggleMenu}
                                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-red-500/25 text-center block transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        DASHBOARD
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            toggleMenu();
                                        }}
                                        className="w-full text-gray-500 dark:text-slate-400 py-2 font-bold text-sm hover:text-red-500 transition-colors"
                                    >
                                        Logout Account
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={toggleMenu}
                                        className="w-full bg-red-600 hover:bg-black text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-red-500/20 text-center block transition-all"
                                    >
                                        LOGIN / SIGNUP
                                    </Link>
                                    <Link
                                        to="/contact"
                                        onClick={toggleMenu}
                                        className="w-full border-2 border-red-500 text-red-500 dark:text-red-400 py-4 rounded-2xl font-black text-base text-center block transition-all hover:bg-red-50 dark:hover:bg-red-900/10"
                                    >
                                        LIST YOUR BUSINESS
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
