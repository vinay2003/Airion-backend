import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Calendar, Star, Shield, Heart, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';

import { fetchEvents } from '../lib/api';
import type { Event } from '../types';

const Home: React.FC = () => {
    const { showToast } = useToast();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWrapper = async () => {
            try {
                const data = await fetchEvents();
                setEvents(data);
            } catch (err) {
                setError('Failed to load events');
            } finally {
                setLoading(false);
            }
        };
        loadWrapper();
    }, []);

    const weddingVenues = events.filter(e => e.category === 'Weddings');
    const birthdayVenues = events.filter(e => e.category === 'Birthdays' || e.category === 'Parties');
    const corporateVenues = events.filter(e => e.category === 'Corporate' || e.category === 'Seminars');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        showToast('Successfully subscribed to newsletter!', 'success');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            <SEO title="Home" description="Find and book the perfect venue for your wedding, birthday, or corporate event with Airion." />
            <Hero />

            {/* Shop by Category Grid */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 md:px-8 py-12"
            >
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Find Your Perfect Venue</h2>
                    <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Explore our curated collection of venues for every occasion, from intimate gatherings to grand celebrations.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { title: 'Weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop', link: '/category/weddings' },
                        { title: 'Birthdays', image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?q=80&w=1000&auto=format&fit=crop', link: '/category/birthdays' },
                        { title: 'Corporate Events', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop', link: '/category/corporate' },
                    ].map((cat, idx) => (
                        <Link key={idx} to={cat.link} className="group relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-800">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity"></div>
                            <img src={cat.image} alt={cat.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-white text-2xl font-bold tracking-wide mb-2">{cat.title}</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex items-center gap-1">
                                    Explore <ArrowRight size={14} />
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.section>

            {/* Featured Listings (Top Placement) */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured Listings</h2>
                    <Link to="/trending-weddings" className="text-red-500 hover:text-red-600 font-bold flex items-center gap-1">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>
                {/* Reusing CategorySection component structure for now since it takes items */}
                <CategorySection title="" items={weddingVenues.slice(0, 4)} />
            </section>

            {/* Banner Ads / Promo Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 md:p-12 shadow-xl">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">Premium Wedding Packages</h3>
                            <p className="text-indigo-100 mb-6 max-w-lg">Get up to 20% off on complete wedding packages including venue, catering, and decor.</p>
                            <Link to="/packages" className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors">
                                View Packages
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            {/* Placeholder for an ad image or graphic */}
                            <Star size={80} className="text-white/20" />
                        </div>
                    </div>
                </div>
            </section>


            {/* How It Works */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gray-50 dark:bg-slate-900 py-20 transition-colors duration-300"
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                        <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Planning your event has never been easier. Follow these simple steps to book your dream venue.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {[
                            { icon: Search, title: 'Discover', desc: 'Browse through our extensive list of verified venues and services tailored to your needs.' },
                            { icon: Calendar, title: 'Book', desc: 'Check availability and book your preferred date instantly with our secure platform.' },
                            { icon: Star, title: 'Celebrate', desc: 'Enjoy your special day while we handle the coordination and details for you.' },
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.5 }}
                                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 text-center group"
                            >
                                <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <step.icon size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Other Sections */}
            <div className="space-y-12 py-20">
                <CategorySection title="Trending Weddings" items={weddingVenues.slice(0, 4)} />
                <CategorySection title="Birthday Bashes" items={birthdayVenues.slice(0, 4)} />

                {/* Promo Banner 2 */}
                <section className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="relative rounded-3xl overflow-hidden bg-red-500 text-white p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-red-500/20">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 max-w-xl text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Plan Your Dream Event?</h2>
                            <p className="text-white/90 text-lg mb-8">Use our advanced planning wizard to customize every detail of your event in minutes.</p>
                            <Link to="/plan-event" className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg">
                                Start Planning <ArrowRight size={20} />
                            </Link>
                        </div>
                        <div className="relative z-10 hidden md:block">
                            <Calendar size={120} className="text-white/20 rotate-12" />
                        </div>
                    </div>
                </section>

                <CategorySection title="Corporate Events" items={corporateVenues.slice(0, 4)} />
            </div>

            {/* Why Choose Us */}
            <section className="bg-gray-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Airion?</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Verified Vendors</h3>
                                        <p className="text-gray-400">Every venue and vendor is personally verified by our team to ensure quality and reliability.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Heart size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Best Price Guarantee</h3>
                                        <p className="text-gray-400">We negotiate the best rates so you don't have to. Find a lower price? We'll match it.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                                        <p className="text-gray-400">Our dedicated support team is available around the clock to assist you with any queries.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                            <img
                                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop"
                                alt="Event Planning"
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Stay Updated</h2>
                    <p className="text-gray-600 dark:text-slate-400 mb-8">Subscribe to our newsletter for the latest venue additions, exclusive offers, and event planning tips.</p>
                    <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-6 py-4 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-all"
                        />
                        <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-red-500/20 hover:scale-105">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Home;
