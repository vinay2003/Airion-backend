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

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeftState(scrollRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // scroll-fast multiplier
        scrollRef.current.scrollLeft = scrollLeftState - walk;
    };

    return (
        <div className="relative max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8 bg-white dark:bg-slate-950 z-20">
            {/* Left fade/arrow */}
            {showLeftArrow && (
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent flex items-center pl-4 z-10">
                    <button
                        onClick={() => slide('left')}
                        type="button"
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
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                className={`flex overflow-x-auto items-center justify-start md:justify-center gap-8 md:gap-10 py-4 px-4 hide-scrollbar border-b border-gray-200 dark:border-slate-800 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {CATEGORIES.map((category) => {
                    const isActive = activeCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => !isDragging && handleCategoryClick(category.id)}
                            className={`pointer-events-auto ${isActive
                                ? 'text-red-500 scale-110 border-b-2 border-red-500 whitespace-nowrap font-bold transition-all duration-300'
                                : 'text-gray-500 dark:text-slate-400 hover:text-red-500 hover:scale-110 border-b-2 border-transparent hover:border-red-500 transition-all duration-300 whitespace-nowrap font-medium'
                                }`}
                        >
                            {category.label}
                        </button>
                    );
                })}
            </div>

            {/* Right fade/arrow */}
            {showRightArrow && (
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent flex items-center justify-end pr-4 z-10">
                    <button
                        onClick={() => slide('right')}
                        type="button"
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
