import React from 'react';
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
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">{title}</h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800 ml-8"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {items.map((item, index) => (
                    <ListingCard key={index} {...item} />
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
