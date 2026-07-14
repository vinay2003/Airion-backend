import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Sparkles, Heart, Cake, Briefcase,
    PartyPopper, Camera, ChefHat, Palette, Music, Hotel, Sparkle, CalendarCheck
} from 'lucide-react';

const CATEGORIES = [
    { id: 'all', label: 'All', icon: Sparkles, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=200' },
    { id: 'weddings', label: 'Weddings', icon: Heart, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200' },
    { id: 'birthdays', label: 'Birthdays', icon: Cake, image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?q=80&w=200' },
    { id: 'corporate', label: 'Corporate', icon: Briefcase, image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=200' },
    { id: 'parties', label: 'Parties', icon: PartyPopper, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200' },
    { id: 'photography', label: 'Photography', icon: Camera, image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=200' },
    { id: 'catering', label: 'Catering', icon: ChefHat, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=200' },
    { id: 'decor', label: 'Decor', icon: Palette, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=200' },
    { id: 'music', label: 'Music & DJs', icon: Music, image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=200' },
    { id: 'venues', label: 'Venues', icon: Hotel, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=200' },
    { id: 'makeup', label: 'Makeup', icon: Sparkle, image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200' },
    { id: 'planning', label: 'Planning', icon: CalendarCheck, image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=200' },
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

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);

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
        
        // Auto-scroll logic (Infinite Carousel scrolling 1 by 1)
        const interval = setInterval(() => {
            if (scrollRef.current && !isDragging) {
                const { scrollLeft, scrollWidth } = scrollRef.current;
                
                // Calculate width of one item + gap
                const firstChild = scrollRef.current.children[0] as HTMLElement;
                const gap = window.innerWidth >= 768 ? 32 : 24;
                const itemWidth = firstChild ? firstChild.offsetWidth + gap : 142;

                // Since array is duplicated, when we reach halfway, we instantly reset to 0 for infinite loop
                if (scrollLeft >= scrollWidth / 2) {
                    scrollRef.current.scrollLeft = scrollLeft - (scrollWidth / 2);
                    setTimeout(() => {
                        if (scrollRef.current) scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
                    }, 50);
                } else {
                    scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
                }
            }
        }, 2500);

        return () => {
            if (scrollRef.current) scrollRef.current.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            clearInterval(interval);
        };
    }, [isDragging]);

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
                        className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md flex items-center justify-center   transition-all"
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
                className={`flex overflow-x-auto items-center justify-start gap-6 md:gap-8 py-6 px-4 hide-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {[...CATEGORIES, ...CATEGORIES].map((category, index) => {
                    const isActive = activeCategory === category.id;
                    const Icon = category.icon;
                    return (
                        <button
                            key={`${category.id}-${index}`}
                            type="button"
                            onClick={() => !isDragging && handleCategoryClick(category.id)}
                            className={`pointer-events-auto flex flex-col items-center gap-3 group min-w-[90px] md:min-w-[110px] ${isActive
                                ? 'text-red-500 scale-105 transition-all duration-300'
                                : 'text-gray-500 dark:text-slate-400 hover:text-red-500  transition-all duration-300'
                                }`}
                        >
                            <div className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-300 shadow-sm overflow-hidden border-2 ${isActive ? 'border-red-500 shadow-red-500/30 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-slate-800 group- dark:group-'}`}>
                                <img 
                                    src={category.image} 
                                    alt={category.label}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                />
                            </div>
                            <span className={`text-sm whitespace-nowrap ${isActive ? 'font-black text-red-500' : 'font-bold text-gray-700 dark:text-slate-300'}`}>
                                {category.label}
                            </span>
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
                        className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md flex items-center justify-center   transition-all"
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
