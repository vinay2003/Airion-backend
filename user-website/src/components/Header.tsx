import React, { useState, useEffect } from 'react';
import { User, Menu, X, Globe, Moon, Sun, ChevronDown, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const isActivePath = (path: string) => location.pathname === path;

    return (
        <header
            className={`w-full py-3 md:py-4 px-4 md:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-md'
                : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'
                } border-b border-red-100 dark:border-slate-800`}
        >
            {/* Logo */}
            <Link
                to="/"
                className="text-2xl md:text-3xl font-bold text-red-500 font-cursive z-50 hover:scale-105 transition-transform flex items-center gap-2"
            >
                <Sparkles size={24} className="text-red-500" />
                aayojan
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
                <Link
                    to="/category/weddings"
                    className={`hover:text-red-500 dark:hover:text-red-400 transition-colors ${isActivePath('/category/weddings') ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'
                        }`}
                >
                    Wedding
                </Link>
                <Link
                    to="/category/parties"
                    className={`hover:text-red-500 dark:hover:text-red-400 transition-colors ${isActivePath('/category/parties') ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'
                        }`}
                >
                    Parties
                </Link>
                <Link
                    to="/category/meetups"
                    className={`hover:text-red-500 dark:hover:text-red-400 transition-colors ${isActivePath('/category/meetups') ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'
                        }`}
                >
                    Meetups
                </Link>
                <Link
                    to="/category/seminars"
                    className={`hover:text-red-500 dark:hover:text-red-400 transition-colors ${isActivePath('/category/seminars') ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'
                        }`}
                >
                    Seminars
                </Link>
                <Link
                    to="/about"
                    className={`hover:text-red-500 dark:hover:text-red-400 transition-colors ${isActivePath('/about') ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'
                        }`}
                >
                    About Us
                </Link>
                <Link
                    to="/contact"
                    className={`hover:text-red-500 dark:hover:text-red-400 transition-colors ${isActivePath('/contact') ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'
                        }`}
                >
                    Contact Us
                </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
                <Link
                    to="/plan-event"
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                    Plan Your Event
                </Link>
                <Link
                    to="/login"
                    className="text-gray-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                    <User size={24} />
                </Link>
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
                <Link
                    to="/login"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                >
                    <User size={16} />
                </Link>
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
                            <Link
                                to="/login"
                                onClick={toggleMenu}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-base shadow-lg shadow-red-500/20 text-center block transition-all hover:shadow-red-500/30"
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
