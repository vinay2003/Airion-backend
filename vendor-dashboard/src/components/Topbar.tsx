import React from 'react';
import { Bell, Search, ChevronDown, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TopbarProps {
    onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                >
                    <Menu size={24} />
                </button>

                <div className="hidden md:flex items-center gap-4 w-96 bg-gray-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-transparent focus-within:border-red-500 transition-all">
                    <Search className="text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full outline-none bg-transparent text-gray-600 dark:text-slate-200 placeholder-gray-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-600 dark:text-slate-400"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <button className="relative p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Bell size={20} className="text-gray-600 dark:text-slate-400" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
                </button>

                <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-gray-200 dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-700"
                    />
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-200">John Doe</p>
                        <p className="text-xs text-gray-500 dark:text-slate-500">Vendor Admin</p>
                    </div>
                    <ChevronDown size={16} className="text-gray-400 hidden md:block" />
                </div>
            </div>
        </header>
    );
};

export default Topbar;
