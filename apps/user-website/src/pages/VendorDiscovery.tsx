import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar, { FilterValues } from '../components/FilterSidebar';
import ListingCard from '../components/ListingCard';
import SEO from '../components/SEO';
import { fetchVendorDiscovery } from '../lib/api';
import MapView from '../components/MapView';
import { Map, List, ChevronDown, SlidersHorizontal, ArrowUpDown, X, Layers } from 'lucide-react';
import type { Event } from '../types';
import FallingPetals from '../components/FallingPetals';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import { Heart, MapPin, Star } from 'lucide-react';

const SORT_OPTIONS = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Newest', value: 'newest' },
];

const SwipeView: React.FC<{ vendors: Event[] }> = ({ vendors }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { addToWishlist } = useWishlist();

    const activeVendor = vendors[currentIndex];

    const handleSwipe = (direction: 'left' | 'right') => {
        if (direction === 'right' && activeVendor) {
            addToWishlist(activeVendor);
            toast.success(`Wishlisted ${activeVendor.title}!`);
        }
        setCurrentIndex(prev => prev + 1);
    };

    if (currentIndex >= vendors.length) {
        return (
            <div className="h-[450px] flex flex-col items-center justify-center text-center p-8 bg-neutral-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-neutral-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No more vendors to swipe!</h3>
                <p className="text-neutral-500 mb-4">You've swiped through all available nodes.</p>
                <button onClick={() => setCurrentIndex(0)} className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-bold">
                    Start Over
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-[550px] w-full">
            <div className="relative w-full max-w-[360px] h-[460px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeVendor.id}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.x > 100) handleSwipe('right');
                            else if (info.offset.x < -100) handleSwipe('left');
                        }}
                        className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-neutral-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
                    >
                        <div className="relative h-64 overflow-hidden bg-neutral-100 dark:bg-slate-800">
                            <img src={activeVendor.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80'} alt={activeVendor.title} className="w-full h-full object-cover pointer-events-none" />
                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{activeVendor.category}</div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white truncate">{activeVendor.title}</h3>
                                <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 mt-1.5">
                                    <MapPin size={14} className="text-red-500" />
                                    <span>{activeVendor.location}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-t border-neutral-100 dark:border-slate-800 pt-4">
                                <div>
                                    <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Base Price</span>
                                    <span className="text-lg font-black text-neutral-900 dark:text-white">{activeVendor.price}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-lg border border-amber-400/20">
                                    <Star size={12} fill="currentColor" />
                                    <span className="text-xs font-bold">{activeVendor.rating}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            {/* Actions */}
            <div className="flex gap-6 mt-6">
                <button onClick={() => handleSwipe('left')} className="w-14 h-14 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 border border-neutral-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-lg text-red-500 transition-colors">
                    <X size={24} />
                </button>
                <button onClick={() => handleSwipe('right')} className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 transition-transform active:scale-95">
                    <Heart size={24} />
                </button>
            </div>
        </div>
    );
};

const VendorDiscovery: React.FC = () => {
    const [vendors, setVendors] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'map' | 'swipe'>('list');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortBy, setSortBy] = useState('recommended');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [appliedFilters, setAppliedFilters] = useState<FilterValues | null>(null);
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');

    useEffect(() => {
        const loadVendors = async () => {
            try {
                const data = await fetchVendorDiscovery();
                console.log('[VendorDiscovery] Fetched vendors:', data.length);
                setVendors(data);
            } catch (err) {
                console.error('Failed to fetch vendors:', err);
            } finally {
                setLoading(false);
            }
        };
        loadVendors();
    }, []);

    // ✅ Sync search params with filters
    useEffect(() => {
        if (categoryQuery && vendors.length > 0) {
            // Map plural URL params to singular sidebar labels
            let normalized = categoryQuery.charAt(0).toUpperCase() + categoryQuery.slice(1).toLowerCase();
            if (normalized === 'Weddings') normalized = 'Wedding';
            if (normalized === 'Parties') normalized = 'Party';
            if (normalized === 'Birthdays') normalized = 'Birthday';

            const newFilters: FilterValues = {
                locationInput: '',
                priceRange: 1000000,
                selectedEventTypes: [normalized],
                selectedCapacity: '',
                selectedDate: '',
                selectedAmenities: [],
            };

            setAppliedFilters(newFilters);
            setActiveFilters([normalized]);
        }
    }, [categoryQuery, vendors.length > 0]);

    const handleApplyFilters = (filters: FilterValues) => {
        console.log('[VendorDiscovery] Applying filters:', filters);
        setAppliedFilters(filters);
        const chips: string[] = [];
        if (filters.locationInput) chips.push(filters.locationInput);
        filters.selectedEventTypes.forEach(t => chips.push(t));
        if (filters.selectedCapacity) chips.push(filters.selectedCapacity);
        if (filters.selectedDate) chips.push(filters.selectedDate);
        filters.selectedAmenities.forEach(a => chips.push(a));
        setActiveFilters(chips);
        setShowMobileFilters(false);
    };

    const filteredVendors = useMemo(() => {
        if (!appliedFilters) return vendors;

        // ─── Normalization map: sidebar label → canonical lowercase ──────────────
        const CATEGORY_ALIASES: Record<string, string[]> = {
            'wedding': ['wedding', 'weddings'],
            'corporate': ['corporate'],
            'birthday': ['birthday', 'birthdays'],
            'private party': ['private party'],
            'engagement': ['engagement'],
            'party': ['parties', 'party'],
        };

        if (import.meta.env.DEV) {
            console.groupCollapsed('[VendorDiscovery] Filter run');
            console.log('Active filters:', appliedFilters);
            console.log('Total vendors before filter:', vendors.length);
            console.groupEnd();
        }

        const result = vendors.filter(v => {
            const vendorId = v.id;

            // ── 1. Location: case-insensitive, partial match ──────────────────────
            if (appliedFilters.locationInput?.trim()) {
                const needle = appliedFilters.locationInput.toLowerCase().trim();
                const haystack = (v.location || '').toLowerCase();
                if (!haystack.includes(needle)) {
                    if (import.meta.env.DEV) console.log(`[EXCLUDE] ${vendorId} — Location mismatch: "${v.location}" ≠ "${needle}"`);
                    return false;
                }
            }

            // ── 2. Price: skip when at max (1,000,000 = no limit) ─────────────────
            if (appliedFilters.priceRange && appliedFilters.priceRange < 1000000) {
                const raw = typeof v.price === 'string' ? v.price.replace(/[^\d]/g, '') : String(v.price || '');
                const priceValue = raw ? parseInt(raw, 10) : 0;
                if (priceValue > 0 && priceValue > appliedFilters.priceRange) {
                    if (import.meta.env.DEV) console.log(`[EXCLUDE] ${vendorId} — Price mismatch: ₹${priceValue} > ₹${appliedFilters.priceRange}`);
                    return false;
                }
            }

            // ── 3. Event Type: OR logic, alias-aware, no false positives ──────────
            if (appliedFilters.selectedEventTypes?.length > 0) {
                const vCat = (v.category || '').toLowerCase().trim();
                const matchesAnyType = appliedFilters.selectedEventTypes.some(t => {
                    const key = t.toLowerCase().trim();
                    const aliases = CATEGORY_ALIASES[key] ?? [key];
                    // Exact alias match first, then fallback to inclusion
                    return aliases.includes(vCat) || vCat === key;
                });
                if (!matchesAnyType) {
                    if (import.meta.env.DEV) console.log(`[EXCLUDE] ${vendorId} — Category mismatch: "${v.category}" not in [${appliedFilters.selectedEventTypes.join(', ')}]`);
                    return false;
                }
            }

            // ── 4. Date: optional — only filter if a date was selected AND the
            //    vendor has explicit available dates to compare against ─────────────
            if (appliedFilters.selectedDate?.trim()) {
                const vendorDates: string[] = (v as any).availableDates ?? [];
                if (vendorDates.length > 0 && !vendorDates.includes(appliedFilters.selectedDate)) {
                    if (import.meta.env.DEV) console.log(`[EXCLUDE] ${vendorId} — Date mismatch: "${appliedFilters.selectedDate}" not in vendor dates`);
                    return false;
                }
                // If vendor has no date data, we DON'T exclude — assume always available
            }

            // ── 5. Capacity ───────────────────────────────────────────────────────
            if (appliedFilters.selectedCapacity?.trim()) {
                const vCapRaw = (v.capacity || '').toLowerCase();
                if (vCapRaw !== 'contact vendor') {
                    // Handles "500+ guests", "200 guests", "100-200" — takes first number
                    const capNum = parseInt(v.capacity?.match(/\d+/)?.[0] ?? '0', 10);
                    const sel = appliedFilters.selectedCapacity;
                    if (sel === 'Small Intimate' && capNum > 50) { if (import.meta.env.DEV) console.log(`[EXCLUDE] ${vendorId} — Capacity: ${capNum} > 50 for Small Intimate`); return false; }
                    if (sel === 'Medium Gathering' && (capNum < 50 || capNum > 200)) { if (import.meta.env.DEV) console.log(`[EXCLUDE] ${vendorId} — Capacity: ${capNum} out of 50-200`); return false; }
                    if (sel === 'Large Celebration' && capNum < 200) { if (import.meta.env.DEV) console.log(`[EXCLUDE] ${vendorId} — Capacity: ${capNum} < 200 for Large`); return false; }
                }
            }

            // ── 6. Amenities: ALL selected must be present (AND logic) ────────────
            if (appliedFilters.selectedAmenities?.length > 0) {
                const vAmenities = (v.amenities ?? []).map((a: string) => a.toLowerCase());
                const missing = appliedFilters.selectedAmenities.filter(a => !vAmenities.includes(a.toLowerCase()));
                if (missing.length > 0) {
                    if (import.meta.env.DEV) console.log(`[EXCLUDE] ${vendorId} — Missing amenities: [${missing.join(', ')}]`);
                    return false;
                }
            }

            return true;
        });

        if (import.meta.env.DEV) {
            console.log(`[VendorDiscovery] ${result.length}/${vendors.length} vendors passed filters`);
        }

        return result;
    }, [vendors, appliedFilters]);

    const sortedVendors = useMemo(() => {
        const copy = [...filteredVendors];
        switch (sortBy) {
            case 'price_asc':
                return copy.sort((a, b) => {
                    const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/\D/g, '') || '0') : a.price || 0;
                    const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/\D/g, '') || '0') : b.price || 0;
                    return priceA - priceB;
                });
            case 'price_desc':
                return copy.sort((a, b) => {
                    const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/\D/g, '') || '0') : a.price || 0;
                    const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/\D/g, '') || '0') : b.price || 0;
                    return priceB - priceA;
                });
            case 'rating':
                return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default:
                // Return exactly as received from backend (priority sorting applied on server)
                return copy;
        }
    }, [filteredVendors, sortBy]);

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Recommended';

    const removeFilter = (filter: string) => {
        const updated = activeFilters.filter(f => f !== filter);
        setActiveFilters(updated);

        if (updated.length === 0) {
            setAppliedFilters(null);
            return;
        }

        if (appliedFilters) {
            const newFilters = { ...appliedFilters };

            if (newFilters.locationInput === filter) newFilters.locationInput = '';
            if (newFilters.selectedCapacity === filter) newFilters.selectedCapacity = '';
            if (newFilters.selectedDate === filter) newFilters.selectedDate = '';

            newFilters.selectedEventTypes = newFilters.selectedEventTypes.filter(t => t !== filter);
            newFilters.selectedAmenities = newFilters.selectedAmenities.filter(a => a !== filter);

            setAppliedFilters(newFilters);
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-transparent aurora-bg relative transition-colors duration-300 pt-24 pb-12 overflow-x-hidden">
            <FallingPetals />
            <SEO title="Explore Vendors | Ease2event" description="Discover the perfect vendors for your next event." />

            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/60 dark:border-slate-800 pb-6">
                    <div>
                        <h1 className="text-xl md:text-4xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight leading-tight">
                            Everything for Your Event
                        </h1>
                        <p className="text-neutral-500 dark:text-slate-400 font-black text-xs tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            {sortedVendors.length}+ Verified Nodes Active
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
                                <span className="text-xs font-black tracking-[0.2em]">
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

                        {/* Map/List/Swipe Toggle */}
                        <div className="flex items-center gap-6 px-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`group relative py-2 transition-all duration-300 hover:scale-110 hover:brightness-150 ${viewMode === 'list' ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}
                            >
                                <div className="flex items-center gap-2 text-xs font-black tracking-[0.2em]">
                                    <List size={16} className={viewMode === 'list' ? 'text-red-500' : ''} />
                                    List
                                </div>
                                {viewMode === 'list' && (
                                    <motion.div
                                        layoutId="viewUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`group relative py-2 transition-all duration-300 hover:scale-110 hover:brightness-150 ${viewMode === 'map' ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}
                            >
                                <div className="flex items-center gap-2 text-xs font-black tracking-[0.2em]">
                                    <Map size={16} className={viewMode === 'map' ? 'text-red-500' : ''} />
                                    Map
                                </div>
                                {viewMode === 'map' && (
                                    <motion.div
                                        layoutId="viewUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setViewMode('swipe')}
                                className={`group relative py-2 transition-all duration-300 hover:scale-110 hover:brightness-150 ${viewMode === 'swipe' ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}
                            >
                                <div className="flex items-center gap-2 text-xs font-black tracking-[0.2em]">
                                    <Layers size={16} className={viewMode === 'swipe' ? 'text-red-500' : ''} />
                                    Swipe
                                </div>
                                {viewMode === 'swipe' && (
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
                            onClick={() => { setActiveFilters([]); setAppliedFilters(null); }}
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
                            <FilterSidebar
                                onApply={handleApplyFilters}
                                initialFilters={appliedFilters}
                            />
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
                        ) : viewMode === 'map' ? (
                            <div className="h-[calc(100vh-200px)] rounded-3xl overflow-hidden shadow-sm border border-neutral-200/60 dark:border-slate-800">
                                <MapView vendors={sortedVendors} />
                            </div>
                        ) : viewMode === 'swipe' ? (
                            <SwipeView vendors={sortedVendors} />
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
                                                tags={vendor.isSponsored ? ['🌟 Sponsored', 'Verified', 'Premium'] : ['Verified', 'Premium', 'Fast Response']}
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
                                <button className="px-10 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-xs tracking-[0.2em]   transition-all border-2 border-white/10">
                                    View More Vendors
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
