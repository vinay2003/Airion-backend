import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import FilterSidebar, { FilterValues } from '../components/FilterSidebar';
import { ArrowLeft, ChevronDown, Search } from 'lucide-react';
import { fetchEvents } from '../lib/api';
import type { Event as EventType } from '../types';

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const [categoryEvents, setCategoryEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);
    const [appliedFilters, setAppliedFilters] = useState<FilterValues | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const allEvents = await fetchEvents();
                const catParam = category?.toLowerCase() || '';
                setCategoryEvents(allEvents.filter(e => {
                    const eCat = e.category.toLowerCase();
                    return eCat.includes(catParam) || catParam.includes(eCat);
                }));
            } catch (err) {
                console.error(err);
                setCategoryEvents([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [category]);

    const handleApplyFilters = (filters: FilterValues) => {
        setAppliedFilters(filters);
        setShowMobileFilters(false);
    };

    const filteredEvents = useMemo(() => {
        if (!appliedFilters) return categoryEvents;
        return categoryEvents.filter(v => {
            if (appliedFilters.locationInput) {
                if (!v.location?.toLowerCase().includes(appliedFilters.locationInput.toLowerCase())) return false;
            }
            if (appliedFilters.priceRange) {
                const priceValue = typeof v.price === 'string'
                    ? parseInt(v.price.replace(/\D/g, '') || '0')
                    : v.price || 0;
                if (priceValue > 0 && priceValue > appliedFilters.priceRange) return false;
            }
            if (appliedFilters.selectedEventTypes.length > 0) {
                if (!appliedFilters.selectedEventTypes.some(t =>
                    v.category?.toLowerCase().includes(t.toLowerCase())
                )) return false;
            }
            if (appliedFilters.selectedCapacity) {
                const capacityValue = parseInt(v.capacity?.replace(/\D/g, '') || '0');
                if (v.capacity?.toLowerCase() === 'contact vendor') return true;
                if (appliedFilters.selectedCapacity === 'Small Intimate' && (capacityValue < 10 || capacityValue > 50)) return false;
                if (appliedFilters.selectedCapacity === 'Medium Gathering' && (capacityValue < 50 || capacityValue > 200)) return false;
                if (appliedFilters.selectedCapacity === 'Large Celebration' && capacityValue < 200) return false;
            }
            return true;
        });
    }, [categoryEvents, appliedFilters]);

    const getCategoryHeroImage = (cat: string | undefined) => {
        switch (cat?.toLowerCase()) {
            case 'weddings': return 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&auto=format&fit=crop&q=85';
            case 'parties': return 'https://images.unsplash.com/photo-1559060680-36abfac01944?w=1920&auto=format&fit=crop&q=85';
            case 'seminars': return 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&auto=format&fit=crop&q=85';
            case 'meetups': return 'https://images.unsplash.com/photo-1609103224786-e43d94029557?w=1920&auto=format&fit=crop&q=85';
            default: return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&auto=format&fit=crop&q=85';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (categoryEvents.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <Search size={32} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Category Not Found</h2>
                    <p className="text-gray-500 dark:text-slate-400">We couldn't find any events in this category.</p>
                    <Link to="/" className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-medium">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={getCategoryHeroImage(category)}
                        alt={category}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                </div>
                <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center text-white">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors w-fit">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold capitalize mb-2">{category}</h1>
                    <p className="text-lg text-white/90 max-w-2xl">
                        Discover the best venues and services for your {category} events. Verified listings, transparent pricing, and seamless booking.
                    </p>
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="lg:hidden mt-6 flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-bold text-sm shadow-xl w-fit active:scale-95 transition-all"
                    >
                        <Search size={16} /> Filters
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className={`w-full lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
                        <div className="sticky top-24">
                            <FilterSidebar onApply={handleApplyFilters} />
                        </div>
                    </aside>

                    {/* Listings */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600 dark:text-slate-400">
                                Showing <span className="font-bold text-gray-900 dark:text-white">{filteredEvents.length}</span> properties
                            </p>
                            <div className="relative">
                                <button className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2 hover:border-red-500 dark:hover:border-red-500 transition-colors shadow-sm">
                                    Sort by: Popularity
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event) => (
                                <ListingCard key={event.id} {...event} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
