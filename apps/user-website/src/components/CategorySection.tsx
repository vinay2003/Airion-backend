import React, { useEffect, useRef } from 'react';
import ListingCard from './ListingCard';

interface CategorySectionProps {
    title: string;
    items: Array<{
        id: string;
        image: string;
        title: string;
        rating: number;
        reviews: number;
        location: string;
        capacity: string;
        price: string;
        description: string;
    }>;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, items }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
                }
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            {title && (
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">{title}</h2>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800 ml-8"></div>
                </div>
            )}
            
            <div 
                ref={scrollRef}
                className="flex gap-6 md:gap-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item, index) => (
                    <div key={index} className="min-w-[280px] md:min-w-[320px] snap-start shrink-0">
                        <ListingCard {...item} />
                    </div>
                ))}
            </div>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default CategorySection;
