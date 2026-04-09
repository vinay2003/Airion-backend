import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from '../components/FilterSidebar';
import ListingCard from '../components/ListingCard';
import SEO from '../components/SEO';
import { events as mockEvents } from '../data/events';
import MapView from '../components/MapView';
import { Map, List, ChevronDown, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import type { Event } from '../types';
import FallingPetals from '../components/FallingPetals';

const SORT_OPTIONS = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Newest', value: 'newest' },
];

const STATUS_BADGES: Record<number, { label: string; color: string }> = {
    0: { label: 'FILLING FAST', color: 'bg-orange-100 text-orange-700' },
    1: { label: 'TOP RATED', color: 'bg-green-100 text-green-700' },
    2: { label: 'NEW', color: 'bg-blue-100 text-blue-700' },
};

const VendorDiscovery: React.FC = () => {
    const [vendors, setVendors] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMapView, setIsMapView] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortBy, setSortBy] = useState('recommended');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    useEffect(() => {
        setVendors(mockEvents as any[]);
        setLoading(false);
        // Simulate some active filter chips for demo
        setActiveFilters(['Patna', 'Wedding']);
    }, []);

    const sortedVendors = useMemo(() => {
        const copy = [...vendors];
        switch (sortBy) {
            case 'price_asc':
                return copy.sort((a, b) => parseInt(a.price?.replace(/\D/g, '') || '0') - parseInt(b.price?.replace(/\D/g, '') || '0'));
            case 'price_desc':
                return copy.sort((a, b) => parseInt(b.price?.replace(/\D/g, '') || '0') - parseInt(a.price?.replace(/\D/g, '') || '0'));
            case 'rating':
                return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default:
                return copy;
        }
    }, [vendors, sortBy]);

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Recommended';

    const removeFilter = (filter: string) => setActiveFilters(prev => prev.filter(f => f !== filter));

    return (
        <main className="min-h-screen bg-white dark:bg-transparent aurora-bg relative transition-colors duration-300 pt-24 pb-12 overflow-x-hidden">
            <FallingPetals />
            <SEO title="Explore Vendors | Airion" description="Discover the perfect vendors for your next event." />

            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/60 dark:border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white mb-2 tracking-tight">
                            Explore the Marketplace
                        </h1>
                        <p className="text-neutral-500 dark:text-slate-400 font-medium">
                            {sortedVendors.length}+ premium vendors match your search.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-slate-700 text-sm font-bold shadow-sm bg-white dark:bg-slate-900"
                        >
                            <SlidersHorizontal size={16} /> Filters
                            {activeFilters.length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                    {activeFilters.length}
                                </span>
                            )}
                        </button>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-slate-700 text-sm font-bold shadow-sm bg-white dark:bg-slate-900 hover:border-red-300 transition-colors"
                            >
                                <ArrowUpDown size={15} className="text-neutral-400" />
                                {currentSortLabel}
                                <ChevronDown size={14} className={`text-neutral-400 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showSortDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-30"
                                    >
                                        {SORT_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                                                className={`w-full text-left px-5 py-3 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ${sortBy === opt.value ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-neutral-700 dark:text-neutral-300'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Map/List Toggle */}
                        <div className="flex bg-neutral-100 dark:bg-slate-800 p-1 rounded-full border border-neutral-200/50 dark:border-slate-700/50">
                            <button
                                onClick={() => setIsMapView(false)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${!isMapView ? 'bg-white dark:bg-slate-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-slate-300'}`}
                            >
                                <List size={16} /> List
                            </button>
                            <button
                                onClick={() => setIsMapView(true)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${isMapView ? 'bg-white dark:bg-slate-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-slate-300'}`}
                            >
                                <Map size={16} /> Map
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Filter Chips */}
                {activeFilters.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                        <span className="text-xs font-semibold text-neutral-500 dark:text-slate-400">Active Filters:</span>
                        {activeFilters.map(filter => (
                            <span key={filter} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-bold border border-red-100 dark:border-red-500/20">
                                {filter}
                                <button onClick={() => removeFilter(filter)} className="hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full p-0.5 transition-colors">
                                    <X size={10} />
                                </button>
                            </span>
                        ))}
                        <button
                            onClick={() => setActiveFilters([])}
                            className="text-xs font-semibold text-neutral-400 hover:text-red-500 underline underline-offset-2 transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 pt-2">
                    {/* Sidebar */}
                    <aside className={`w-full lg:w-[280px] xl:w-[320px] flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
                        <div className="sticky top-28">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Vendor Grid */}
                    <section className="flex-1 min-w-0">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-80 bg-neutral-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
                                ))}
                            </div>
                        ) : isMapView ? (
                            <div className="h-[calc(100vh-200px)] rounded-3xl overflow-hidden shadow-sm border border-neutral-200/60 dark:border-slate-800">
                                <MapView vendors={vendors} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {sortedVendors.map((vendor, idx) => (
                                        <motion.div
                                            key={vendor.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.35, delay: (idx % 9) * 0.05 }}
                                            className="relative"
                                        >
                                            {/* Status badge overlay */}
                                            {STATUS_BADGES[idx % 4] && idx % 4 !== 3 && (
                                                <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider ${STATUS_BADGES[idx % 4].color}`}>
                                                    {STATUS_BADGES[idx % 4].label}
                                                </div>
                                            )}
                                            <ListingCard
                                                id={vendor.id}
                                                image={vendor.image || vendor.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80'}
                                                images={vendor.images}
                                                title={vendor.title}
                                                rating={vendor.rating}
                                                reviews={vendor.reviews}
                                                location={vendor.location}
                                                price={vendor.price}
                                                description={vendor.description}
                                                category={vendor.category}
                                                tags={['Verified', 'Premium', 'Fast Response']}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {!loading && sortedVendors.length === 0 && (
                            <div className="text-center py-32 bg-neutral-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-neutral-200 dark:border-slate-800">
                                <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">No matching vendors</h3>
                                <p className="text-neutral-500">Try adjusting your filters or search term.</p>
                            </div>
                        )}

                        {!loading && sortedVendors.length > 0 && (
                            <div className="mt-16 flex justify-center">
                                <button className="px-8 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:shadow-lg transition-transform hover:-translate-y-1">
                                    Load More Results
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default VendorDiscovery;
