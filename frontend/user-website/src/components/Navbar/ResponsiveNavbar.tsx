import { useState, useEffect } from 'react';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';

const ResponsiveNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg dark:bg-slate-900/95 dark:text-white' : 'bg-transparent text-gray-800 dark:text-white'
            }`}>
            {/* Mobile Top Bar */}
            <div className="lg:hidden flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="text-xl font-bold">Airion</div>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="p-2">
                        <Search size={20} />
                    </button>
                    <button className="p-2">
                        <User size={20} />
                    </button>
                </div>
            </div>

            {/* Desktop Navbar */}
            <div className="hidden lg:block">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo & Main Navigation */}
                        <div className="flex items-center space-x-12">
                            <div className="text-2xl font-bold text-red-500">Airion</div>

                            <div className="flex items-center space-x-8">
                                <a href="/" className="hover:text-red-500 transition-colors font-medium">Home</a>
                                <div className="relative group">
                                    <button className="flex items-center space-x-1 hover:text-red-500 transition-colors font-medium">
                                        <span>Services</span>
                                        <ChevronDown size={16} />
                                    </button>
                                    <div className="absolute hidden group-hover:block bg-white dark:bg-slate-800 shadow-xl rounded-lg mt-2 p-4 min-w-[200px] border border-gray-100 dark:border-slate-700">
                                        <a href="/category/weddings" className="block py-2 hover:text-red-500">Weddings</a>
                                        <a href="/category/corporate" className="block py-2 hover:text-red-500">Corporate</a>
                                        <a href="/category/birthdays" className="block py-2 hover:text-red-500">Birthdays</a>
                                    </div>
                                </div>
                                <a href="/pricing" className="hover:text-red-500 transition-colors font-medium">Pricing</a>
                                <a href="/contact" className="hover:text-red-500 transition-colors font-medium">Contact</a>
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-6">
                            {/* Search Bar (Responsive) */}
                            <div className="hidden xl:block relative">
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-slate-800"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>

                            <div className="flex items-center space-x-4">
                                <a href="/login" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 font-medium">
                                    Sign In
                                </a>
                                <a href="/signup" className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-bold shadow-lg shadow-red-500/30">
                                    Get Started
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
                    <div
                        className="absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white dark:bg-slate-900 shadow-xl animate-slideIn p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-2xl font-bold text-red-500">Airion</span>
                            <button onClick={() => setIsOpen(false)}><X size={24} /></button>
                        </div>
                        <div className="space-y-6 flex flex-col text-lg">
                            <a href="/" className="font-medium">Home</a>
                            <a href="/services" className="font-medium">Services</a>
                            <a href="/pricing" className="font-medium">Pricing</a>
                            <a href="/contact" className="font-medium">Contact</a>
                            <hr className="border-gray-100 dark:border-slate-800" />
                            <a href="/login" className="font-medium">Sign In</a>
                            <a href="/signup" className="font-bold text-red-500">Get Started</a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default ResponsiveNavbar;
