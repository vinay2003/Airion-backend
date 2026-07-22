import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Menu, X, Globe, Moon, Sun, Search, Sparkles, ChevronDown, LayoutDashboard, LogOut, Settings, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
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
            className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-transparent  dark:"
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

                        {user?.role === 'vendor' && (
                            <a
                                href="/vendor"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/30 mt-1"
                            >
                                <Sparkles size={18} strokeWidth={2.5} />
                                Vendor Dashboard
                            </a>
                        )}

                        {user?.role === 'admin' && (
                            <a
                                href="/admin"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-blue-100 dark:border-blue-900/30 mt-1"
                            >
                                <Shield size={18} strokeWidth={2.5} />
                                Admin Panel
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
                className="text-2xl md:text-3xl font-bold text-red-500 z-50  transition-transform flex items-center gap-2 flex-shrink-0"
            >
                <Sparkles size={24} className="text-red-500 hidden sm:block" />
                aayojan
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
                <Link to="/" className={`text-sm font-medium transition-colors ${isActivePath('/') ? 'text-red-500' : 'text-neutral-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400'}`}>Home</Link>
                <Link to="/search" className={`text-sm font-medium transition-colors ${isActivePath('/search') ? 'text-red-500' : 'text-neutral-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400'}`}>Venues</Link>
                <Link to="/packages" className={`text-sm font-medium transition-colors ${isActivePath('/packages') ? 'text-red-500' : 'text-neutral-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400'}`}>Packages</Link>
                {/* <Link to="/inspiration" className={`text-sm font-medium transition-colors ${isActivePath('/inspiration') ? 'text-red-500' : 'text-neutral-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400'}`}>Inspiration</Link> */}
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

            {/* Mobile Navigation Portal */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-white dark:bg-slate-950 z-[100] md:hidden flex flex-col"
                    >
                        {/* Menu Header (Solid) */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
                            <span className="text-2xl font-bold text-red-500 uppercase tracking-tighter flex items-center gap-2">
                                <Sparkles size={24} />
                                aayojan
                            </span>
                            <button
                                onClick={toggleMenu}
                                className="p-2.5 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl transition-all shadow-sm"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Menu Content (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-950">
                            <nav className="space-y-4">
                                {[
                                    { name: 'Venues', path: '/search' },
                                    { name: 'Packages', path: '/packages' },
                                    { name: 'Inspiration', path: '/inspiration' },
                                    { name: 'Weddings', path: '/category/weddings' },
                                    { name: 'Parties', path: '/category/parties' }
                                ].map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={toggleMenu}
                                        className={`block text-xl font-black uppercase tracking-tight py-4 px-6 rounded-2xl transition-all ${isActivePath(item.path)
                                            ? 'bg-red-500 text-white shadow-xl shadow-red-500/20'
                                            : 'text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900 border border-transparent '
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800 space-y-4">
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-800 transition-all cursor-pointer select-none active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                            {theme === 'dark' ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-500" />}
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-sm font-bold text-gray-900 dark:text-white">Appearance</span>
                                            <span className="block text-[11px] text-gray-400 font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6.5 p-0.5 rounded-full transition-colors flex items-center ${theme === 'dark' ? 'bg-red-500 justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'}`}>
                                        <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Menu Footer (Fixed at Bottom) */}
                        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 shrink-0">
                            <div className="flex flex-col gap-4">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            onClick={toggleMenu}
                                            className="w-full bg-red-500 hover:bg-black text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 text-center block transition-all"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => { logout(); toggleMenu(); }}
                                            className="w-full bg-white dark:bg-slate-900 border-2 border-red-500/10 text-red-500 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-center block transition-all"
                                        >
                                            Log Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={toggleMenu}
                                            className="w-full bg-red-500 hover:bg-black text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 text-center block transition-all"
                                        >
                                            Login / Signup
                                        </Link>
                                        <Link
                                            to="/contact"
                                            onClick={toggleMenu}
                                            className="w-full bg-white dark:bg-slate-900 border-2 border-red-500/10 text-red-500 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-center block transition-all uppercase"
                                        >
                                            List Your Business
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
