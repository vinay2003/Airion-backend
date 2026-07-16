import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import Hero from '../components/Hero';
import CategorySlider from '../components/CategorySlider';
import CategorySection from '../components/CategorySection';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';
import { useAuth } from '@shared/auth';

import { fetchEvents } from '../lib/api';
import type { Event } from '../types';

const Home: React.FC = () => {
    const { showToast } = useToast();
    const { user, isAuthenticated } = useAuth(); // ✅ Auth added

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const activeCategory = searchParams.get('category') || 'all';

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [marketplaceTab, setMarketplaceTab] = useState('All'); // ✅ simple marketplace

    useEffect(() => {
        fetchEvents()
            .then((data) => {
                setEvents(data);
                setLoading(false);
            })
            .catch(() => {
                console.log('API failed');
                setLoading(false);
            });
    }, []);

    const filteredEvents = activeCategory === 'all'
        ? events
        : events.filter(e => e.category.toLowerCase() === activeCategory.toLowerCase());

    const weddingVenues = events.filter(e => e.category === 'Weddings');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        showToast('Successfully subscribed!', 'success');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <main className="min-h-screen">

            <SEO title="Home" description="Find the perfect event vendors with Ease2event." />

            <Hero />

            {/* ✅ Dashboard Highlight */}
            {isAuthenticated && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto px-4 -mt-10 mb-12 relative z-40"
                >
                    <div className="bg-white rounded-3xl shadow-xl p-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-xl">
                                <LayoutDashboard />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">
                                    Welcome back, {user?.name} 👋
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Continue planning your event
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/dashboard"
                            className="bg-black text-white px-6 py-2 rounded-full flex items-center gap-2"
                        >
                            Dashboard <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.section>
            )}

            <CategorySlider />

            {activeCategory === 'all' ? (
                <>
                    {/* ✅ Marketplace Tabs (Simple Version) */}
                    <section className="max-w-6xl mx-auto px-4 py-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Venues</h2>

                            <div className="flex gap-2">
                                {['All', 'Trending', 'New'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setMarketplaceTab(tab)}
                                        className={`px-4 py-1 rounded-full text-sm ${marketplaceTab === tab
                                            ? 'bg-black text-white'
                                            : 'bg-gray-200'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <CategorySection
                            title=""
                            items={
                                marketplaceTab === 'Trending'
                                    ? weddingVenues
                                    : marketplaceTab === 'New'
                                        ? events
                                        : events
                            }
                        />
                    </section>

                    {/* Featured */}
                    <section className="max-w-6xl mx-auto px-4 py-10">
                        <div className="flex justify-between mb-6">
                            <h2 className="text-2xl font-bold">Featured Listings</h2>
                            <Link to="/search" className="text-red-500 flex items-center gap-1">
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>

                        <CategorySection title="" items={weddingVenues} />
                    </section>
                </>
            ) : (
                <section className="max-w-6xl mx-auto px-4 py-10">
                    <h2 className="text-2xl font-bold capitalize mb-6">
                        {activeCategory}
                    </h2>

                    <CategorySection title="" items={filteredEvents} />
                </section>
            )}

            {/* Newsletter */}
            <section className="py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                <form onSubmit={handleSubscribe} className="flex justify-center gap-4">
                    <input
                        type="email"
                        placeholder="Enter email"
                        className="px-4 py-2 border rounded-full"
                    />
                    <button className="bg-red-500 text-white px-6 py-2 rounded-full">
                        Subscribe
                    </button>
                </form>
            </section>
        </main>
    );
};

export default Home;
