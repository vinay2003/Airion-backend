import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    ChevronLeft, ChevronRight, Sparkles, Heart, Cake, Briefcase, 
    PartyPopper, Camera, ChefHat, Palette, Music, Hotel, Sparkle, CalendarCheck 
} from 'lucide-react';

const CATEGORIES = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'weddings', label: 'Weddings', icon: Heart },
    { id: 'birthdays', label: 'Birthdays', icon: Cake },
    { id: 'corporate', label: 'Corporate', icon: Briefcase },
    { id: 'parties', label: 'Parties', icon: PartyPopper },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'catering', label: 'Catering', icon: ChefHat },
    { id: 'decor', label: 'Decor', icon: Palette },
    { id: 'music', label: 'Music & DJs', icon: Music },
    { id: 'venues', label: 'Venues', icon: Hotel },
    { id: 'makeup', label: 'Makeup', icon: Sparkle },
    { id: 'planning', label: 'Planning', icon: CalendarCheck },
];

const CategorySlider: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extract category from URL or default to 'all'
    const searchParams = new URLSearchParams(location.search);
    const activeCategory = searchParams.get('category') || 'all';

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1); // -1 to account for rounding errors
    };

    useEffect(() => {
        if (scrollRef.current) {
            handleScroll();
            scrollRef.current.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);
        }
        return () => {
            if (scrollRef.current) scrollRef.current.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const slide = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const walk = scrollRef.current.clientWidth / 2;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -walk : walk,
            behavior: 'smooth'
        });
    };

    const handleCategoryClick = (categoryId: string) => {
        const params = new URLSearchParams(location.search);
        if (categoryId === 'all') {
            params.delete('category');
        } else {
            params.set('category', categoryId);
        }
        navigate(`/?${params.toString()}`);
    };

    return (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8 bg-white dark:bg-slate-950 z-20">
            {/* Left fade/arrow */}
            {showLeftArrow && (
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent flex items-center pl-4 z-10">
                    <button 
                        onClick={() => slide('left')}
                        className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md flex items-center justify-center hover:scale-105 hover:shadow-lg transition-all"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={16} className="text-gray-700 dark:text-gray-300" />
                    </button>
                </div>
            )}

            {/* Slider track */}
            <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-8 px-4 py-4 hide-scrollbar scroll-smooth snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {CATEGORIES.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`flex flex-col items-center justify-center min-w-max gap-2 group snap-start transition-all ${
                            activeCategory === category.id 
                                ? 'text-gray-900 border-b-2 border-gray-900 pb-2 dark:text-white dark:border-white' 
                                : 'text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-200 pb-2 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-slate-700'
                        }`}
                    >
                        <span className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${activeCategory === category.id ? 'scale-110 text-red-500 dark:text-red-400' : 'group-hover:scale-110'}`}>
                            <category.icon size={24} className={activeCategory === category.id ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'} />
                        </span>
                        <span className="text-sm font-medium whitespace-nowrap">
                            {category.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Right fade/arrow */}
            {showRightArrow && (
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent flex items-center justify-end pr-4 z-10">
                    <button 
                        onClick={() => slide('right')}
                        className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md flex items-center justify-center hover:scale-105 hover:shadow-lg transition-all"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={16} className="text-gray-700 dark:text-gray-300" />
                    </button>
                </div>
            )}
            
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default CategorySlider;
