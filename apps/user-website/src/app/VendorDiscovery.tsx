import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from '../components/FilterSidebar';
import ListingCard from '../components/ListingCard';
import SEO from '../components/SEO';
import { fetchEvents } from '../lib/api';
// import MapView from '../components/MapView'; // Commented out to avoid build errors if 
import { Map, List, ChevronDown, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import type { Event } from '../types';

const SORT_OPTIONS = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Highest Rated', value: 'rating' },
];

const STATUS_BADGES: Record<number, { label: string; color: string }> = {
    0: { label: 'FILLING FAST', color: 'bg-red-50 text-red-600' },
    1: { label: 'TOP RATED', color: 'bg-emerald-50 text-emerald-600' },
    2: { label: 'VERIFIED', color: 'bg-indigo-50 text-indigo-600' },
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
        const loadVendors = async () => {
            setLoading(true);
            try {
                const data = await fetchEvents();
                setVendors(data || []);
                setActiveFilters(['Verified', 'Fast Response']);
            } catch (err) {
                console.error("Discovery page fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadVendors();
    }, []);

    const sortedVendors = useMemo(() => {
        const copy = [...vendors];
        if (sortBy === 'price_asc') return copy.sort((a, b) => parseInt(a.price?.replace(/\D/g, '') || '0') - parseInt(b.price?.replace(/\D/g, '') || '0'));
        if (sortBy === 'price_desc') return copy.sort((a, b) => parseInt(b.price?.replace(/\D/g, '') || '0') - parseInt(a.price?.replace(/\D/g, '') || '0'));
        if (sortBy === 'rating') return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        return copy;
    }, [vendors, sortBy]);

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Recommended';

    return (
        <main className="min-h-screen bg-white transition-all duration-500 pt-32 pb-24 selection:bg-red-600 selection:text-white">
            <SEO title="Explore Vendors | Ease2event" description="Discover the perfect verified vendors for your next premium event." />

            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                {/* Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-50 pb-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-sm shadow-red-500/5">
                                <Sparkles size={12} /> Marketplace Hub Live
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">
                            Discover the <span className="text-red-600">Elite</span>
                        </h1>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-loose">
                            Connecting you with {sortedVendors.length}+ premier service providers globally.
                            <span className="hidden md:inline ml-2 text-slate-200">Verified • Rated • Exclusive</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest shadow-sm bg-white hover:border-red-600 transition-all hover:shadow-xl active:scale-95"
                            >
                                <ArrowUpDown size={14} className="text-red-600" />
                                {currentSortLabel}
                                <ChevronDown size={14} className={`text-slate-300 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showSortDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-20" onClick={() => setShowSortDropdown(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-3 w-64 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-30 p-2"
                                        >
                                            {SORT_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                                                    className={`w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${sortBy === opt.value ? 'text-white bg-red-600 shadow-lg shadow-red-600/10' : 'text-slate-400 hover:bg-slate-50 hover:text-red-600'}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                            <button
                                onClick={() => setIsMapView(false)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isMapView ? 'bg-white shadow-xl text-red-600' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                <List size={14} /> Catalog
                            </button>
                            <button
                                onClick={() => setIsMapView(true)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isMapView ? 'bg-white shadow-xl text-red-600' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                <Map size={14} /> Intelligence
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filter Sidebar Placeholder */}
                    <aside className="w-full lg:w-[300px] xl:w-[350px] flex-shrink-0">
                        <div className="sticky top-40 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-base font-black text-slate-900 uppercase tracking-widest">Filter Strategy</h3>
                                <SlidersHorizontal size={18} className="text-slate-300" />
                            </div>
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Result Grid */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-96 bg-slate-50 rounded-[2.5rem] animate-pulse border border-slate-100" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                <AnimatePresence>
                                    {sortedVendors.map((vendor, idx) => (
                                        <motion.div
                                            key={vendor.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: (idx % 6) * 0.1 }}
                                            className="relative group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[2.5rem]"
                                        >
                                            {STATUS_BADGES[idx % 3] && (
                                                <div
                                                    className={`absolute top-5 left-5 z-20 px-3 py-1 rounded-xl text-[9px] font-black tracking-widest shadow-lg ${STATUS_BADGES[idx % 3].color}`}
                                                >
                                                    {STATUS_BADGES[idx % 3].label}
                                                </div>
                                            )}

                                            <ListingCard
                                                {...vendor}
                                                image={vendor.image || vendor.images?.[0]}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {!loading && sortedVendors.length === 0 && (
                            <div className="text-center py-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                <Sparkles size={48} className="mx-auto text-slate-200 mb-6" />
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">No Matching Assets</h3>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Broaden your strategy or check back shortly.</p>
                            </div>
                        )}

                        <div className="mt-20 pt-10 border-t border-slate-50 flex justify-center">
                            <button className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                                Load Additional Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VendorDiscovery;
