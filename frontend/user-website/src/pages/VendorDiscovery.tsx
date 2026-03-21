import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from '../components/FilterSidebar';
import ListingCard from '../components/ListingCard';
import SEO from '../components/SEO';
import { fetchEvents } from '../lib/api';
import { events as mockEvents } from '../data/events';
import MapView from '../components/MapView';
import { Map, List, ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { Event } from '../types';

const VendorDiscovery: React.FC = () => {
    const [vendors, setVendors] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMapView, setIsMapView] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const loadWrapper = async () => {
            try {
                const data = await fetchEvents();
                setVendors(data && data.length > 0 ? data : (mockEvents as any[]));
            } catch (err) {
                setVendors(mockEvents as any[]); // Safe fallback on error
            } finally {
                setLoading(false);
            }
        };
        loadWrapper();
    }, []);

    return (
        <main className="min-h-screen bg-transparent dark:bg-slate-950 transition-colors duration-300 pt-24 pb-12">
            <SEO title="Explore Vendors" description="Discover the perfect vendors for your next event." />
            
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                {/* Header Section */}
                <div className="mb-0 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/60 dark:border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white mb-2 tracking-tight">Explore the Marketplace</h1>
                        <p className="text-neutral-500 dark:text-slate-400 font-medium">Over {vendors.length}+ premium vendors match your search.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Mobile Filter Toggle */}
                        <button 
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-slate-700 text-sm font-bold shadow-sm bg-white dark:bg-slate-900"
                        >
                            <SlidersHorizontal size={16} /> Filters
                        </button>
                        
                        {/* Sort Dropdown */}
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-slate-700 text-sm font-bold shadow-sm bg-white dark:bg-slate-900 group transition">
                            <ArrowUpDown size={16} className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white" />
                            Sort: Recommended
                            <ChevronDown size={14} className="text-neutral-400" />
                        </button>

                        {/* Map/List Toggle Airbnb style */}
                        <div className="flex bg-neutral-100 dark:bg-slate-800 p-1 rounded-full w-fit border border-neutral-200/50 dark:border-slate-700/50">
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

                <div className="flex flex-col lg:flex-row gap-8 pt-8">
                    {/* Sidebar Filters */}
                    <aside className={`w-full lg:w-[280px] xl:w-[320px] flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
                        <div className="sticky top-28">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Vendor Grid */}
                    <section className="flex-1 min-w-0">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-80 bg-neutral-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : isMapView ? (
                            <div className="h-[calc(100vh-200px)] rounded-3xl overflow-hidden shadow-sm border border-neutral-200/60 dark:border-slate-800">
                                <MapView vendors={vendors} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:grid-flow-row-dense">
                                <AnimatePresence>
                                    {vendors.map((vendor, idx) => (
                                        <motion.div
                                            key={vendor.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4, delay: (idx % 10) * 0.05 }}
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
                                                tags={['Verified', 'Premium', 'Fast Response']}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                        
                        {!loading && vendors.length === 0 && (
                            <div className="text-center py-32 bg-neutral-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-neutral-200 dark:border-slate-800">
                                <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">No matching vendors</h3>
                                <p className="text-neutral-500">Try adjusting your filters or search term to see more results.</p>
                            </div>
                        )}

                        {/* Pagination Placeholder */}
                        {!loading && vendors.length > 0 && (
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

