import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from '../components/FilterSidebar';
import ListingCard from '../components/ListingCard';
import SEO from '../components/SEO';
import { fetchEvents } from '../lib/api';
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

const VendorDiscovery: React.FC = () => {
    const [vendors, setVendors] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMapView, setIsMapView] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortBy, setSortBy] = useState('recommended');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    useEffect(() => {
        const loadVendors = async () => {
            try {
                const data = await fetchEvents();
                setVendors(data);
            } catch (err) {
                console.error('Failed to fetch vendors:', err);
            } finally {
                setLoading(false);
                // Simulate some active filter chips for demo
                setActiveFilters(['Patna', 'Wedding']);
            }
        };
        loadVendors();
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
            <SEO title="Explore Vendors | Ease2event" description="Discover the perfect vendors for your next event." />

            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/60 dark:border-slate-800 pb-6">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight leading-tight italic">
                            MARKETPLACE{" "}
                            <span className="text-blue-600 not-italic ml-2">MATRIX</span>
                        </h1>
                        <p className="text-neutral-500 dark:text-slate-400 font-black uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            {sortedVendors.length}+ VERIFIED NODES ACTIVE
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
                                className={`group relative flex items-center gap-2 py-2 px-1 transition-all duration-300 hover:scale-110 hover:brightness-150 ${showSortDropdown ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'}`}
                            >
                                <ArrowUpDown size={15} className={showSortDropdown ? 'text-red-500' : 'text-neutral-400'} />
                                <span className="text-xs font-black uppercase tracking-[0.2em]">
                                    {currentSortLabel}
                                </span>
                                <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-300 ${showSortDropdown ? 'rotate-180 text-red-500' : ''}`} />
                                {sortBy !== 'recommended' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
                                )}
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
                        <div className="flex items-center gap-6 px-1">
                            <button
                                onClick={() => setIsMapView(false)}
                                className={`group relative py-2 transition-all duration-300 hover:scale-110 hover:brightness-150 ${!isMapView ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}
                            >
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
                                    <List size={16} className={!isMapView ? 'text-red-500' : ''} />
                                    List
                                </div>
                                {!isMapView && (
                                    <motion.div
                                        layoutId="viewUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setIsMapView(true)}
                                className={`group relative py-2 transition-all duration-300 hover:scale-110 hover:brightness-150 ${isMapView ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}
                            >
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
                                    <Map size={16} className={isMapView ? 'text-red-500' : ''} />
                                    Map
                                </div>
                                {isMapView && (
                                    <motion.div
                                        layoutId="viewUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                                    />
                                )}
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
                                                marketplaceStatus={(idx % 4 === 0 ? 'FILLING_FAST' : idx % 4 === 1 ? 'TOP_RATED' : idx % 4 === 2 ? 'NEW' : 'AVAILABLE') as any}
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
                            <div className="mt-20 flex justify-center">
                                <button className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:shadow-2xl hover:scale-105 transition-all border-2 border-white/10">
                                    Expand Network Results
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
