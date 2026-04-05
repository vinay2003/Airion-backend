import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import FilterSidebar from '../components/FilterSidebar';
import SEO from '../components/SEO';
import { fetchEvents } from '../lib/api';
import type { Event } from '../types';

const TrendingWeddings: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            const allEvents = await fetchEvents();
            // Filter specific trending venues as requested
            const trending = allEvents.filter(e =>
                ['Grand Hotel', 'Sunset Resort', 'City Hall', 'Royal Palace'].includes(e.title)
            );
            setEvents(trending);
            setLoading(false);
        };
        loadEvents();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <SEO title="Trending Weddings | Airion" description="Explore the most popular and trending wedding venues tailored for your special day." />

            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[350px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519225448526-0a0295155809?q=80&w=1000&auto=format&fit=crop"
                        alt="Trending Weddings"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-black/40 backdrop-blur-[1px]"></div>
                </div>
                <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center text-white">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors w-fit group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={12} fill="currentColor" />
                            Curated Collection
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Trending Weddings</h1>
                    <p className="text-xl text-white/90 max-w-2xl font-light">
                        The most sought-after venues of the season. Handpicked for their exceptional beauty, service, and grandeur.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Listings - Full Width for this special page or with sidebar? 
                        Let's keep it clean since it's a curated list, but Sidebar helps if they want to filter within trending.
                        For a curated "Top 4" page, maybe just a grid is better. 
                        But reusing standard layout is good. Let's include sidebar for consistent UX.
                    */}
                    <aside className="w-full lg:w-1/4">
                        <div className="sticky top-24">
                            <FilterSidebar />
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="text-red-500" />
                                Top Picks
                            </h2>
                            <span className="text-gray-500 dark:text-slate-400 text-sm">
                                {events.length} Venues Found
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                            {events.map((event) => (
                                <ListingCard key={event.id} {...event} />
                            ))}
                        </div>

                        {/* Additional CTA or Content */}
                        <div className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 text-center">
                            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Don't see what you're looking for?</h3>
                            <p className="text-gray-600 dark:text-slate-400 mb-6">Explore our full collection of wedding venues tailored to every style and budget.</p>
                            <Link to="/category/weddings" className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
                                View All Weddings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendingWeddings;
