import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FilterSidebar from '../components/FilterSidebar';
import ListingCard from '../components/ListingCard';
import SEO from '../components/SEO';
import { fetchEvents } from '../lib/api';
import type { Event } from '../types';

const VendorDiscovery: React.FC = () => {
    const [vendors, setVendors] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWrapper = async () => {
            try {
                // Reusing fetchEvents since Event type is currently serving as Vendor representation
                const data = await fetchEvents();
                setVendors(data);
            } catch (err) {
                console.error('Failed to load vendors', err);
            } finally {
                setLoading(false);
            }
        };
        loadWrapper();
    }, []);

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 pt-24 pb-12">
            <SEO title="Explore Vendors" description="Discover the perfect vendors for your next event." />
            
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Explore Vendors</h1>
                    <p className="text-gray-600 dark:text-slate-400">Find and book the best photographers, venues, and caterers.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-1/4 flex-shrink-0">
                        <div className="sticky top-28">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Vendor Grid */}
                    <section className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-80 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {vendors.map((vendor, idx) => (
                                    <motion.div
                                        key={vendor.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    >
                                        <ListingCard
                                            id={vendor.id}
                                            image={vendor.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80'}
                                            title={vendor.title}
                                            rating={vendor.rating}
                                            reviews={vendor.reviews}
                                            location={vendor.location}
                                            price={`₹${vendor.price.toLocaleString()}`}
                                            description=""
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        
                        {!loading && vendors.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                No vendors found matching your criteria.
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default VendorDiscovery;
