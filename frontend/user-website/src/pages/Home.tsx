import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Search, Calendar, Star, Shield, Heart, ArrowRight, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import CategorySlider from '../components/CategorySlider';
import CategorySection from '../components/CategorySection';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';

import { fetchEvents } from '../lib/api';
import { events as mockEvents } from '../data/events';
import type { Event } from '../types';


const Home: React.FC = () => {
    const { showToast } = useToast();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const activeCategory = searchParams.get('category') || 'all';

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWrapper = async () => {
            try {
                const data = await fetchEvents();
                setEvents(data && data.length > 0 ? data : (mockEvents as any[]));
            } catch (err) {
                setEvents(mockEvents as any[]); // Safe fallback on error
            } finally {

                setLoading(false);
            }
        };
        loadWrapper();
    }, []);

    const filteredEvents = activeCategory === 'all'
        ? events
        : events.filter(e => e.category.toLowerCase() === activeCategory.toLowerCase());

    const weddingVenues = events.filter(e => e.category === 'Weddings');
    const birthdayVenues = events.filter(e => e.category === 'Birthdays' || e.category === 'Parties');
    const corporateVenues = events.filter(e => e.category === 'Corporate');

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
            
            <CategorySlider />

            {activeCategory === 'all' ? (
                <>
                    {/* Explore Marketplace Categories */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-7xl mx-auto px-4 md:px-8 py-12"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore Marketplace Categories</h2>
                            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Discover everything you need to make your next event truly unforgettable.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:grid-flow-row-dense">
                            {[
                                { title: 'Weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop', link: '/?category=weddings', class: 'col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 h-64 lg:h-auto' },
                                { title: 'Birthdays', image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?q=80&w=1000&auto=format&fit=crop', link: '/?category=birthdays', class: 'col-span-1 h-64' },
                                { title: 'Corporate', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop', link: '/?category=corporate', class: 'col-span-1 h-64' },
                                { title: 'Parties', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop', link: '/?category=parties', class: 'col-span-1 sm:col-span-2 lg:col-span-2 h-64' },
                                { title: 'Photography', image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop', link: '/?category=photography', class: 'col-span-1 h-64' },
                                { title: 'Catering', image: 'https://images.unsplash.com/photo-1555244166-3f8b320cd56b?q=80&w=1000&auto=format&fit=crop', link: '/?category=catering', class: 'col-span-1 h-64' },
                                { title: 'Decor', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop', link: '/?category=decor', class: 'col-span-1 h-64' },
                                { title: 'Music & DJs', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop', link: '/?category=music', class: 'col-span-1 h-64' },
                                { title: 'Venues', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop', link: '/?category=venues', class: 'col-span-1 sm:col-span-2 lg:col-span-2 h-64' },
                                { title: 'Makeup', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop', link: '/?category=makeup', class: 'col-span-1 h-64' },
                                { title: 'Planning', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop', link: '/?category=planning', class: 'col-span-1 h-64' },
                            ].map((cat, idx) => (
                                <Link key={idx} to={cat.link} className={`group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-slate-800 ${cat.class}`}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity"></div>
                                    <img src={cat.image} alt={cat.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-white text-xl md:text-2xl font-bold tracking-wide mb-1">{cat.title}</h3>
                                        <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 font-semibold">
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
                            <Link to="/search" className="text-red-500 hover:text-red-600 font-bold flex items-center gap-1">
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>
                        <CategorySection title="" items={weddingVenues.slice(0, 4)} />
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

                    {/* Grouped Feeds */}
                    <div className="space-y-12 py-20">
                        <CategorySection title="Trending Weddings" items={weddingVenues.slice(0, 4)} />
                        <CategorySection title="Birthday Bashes" items={birthdayVenues.slice(0, 4)} />
                        
                        <CategorySection title="Expert Photography" items={events.filter(e => e.category === 'Photography').slice(0, 4)} />
                        <CategorySection title="Gourmet Catering" items={events.filter(e => e.category === 'Catering').slice(0, 4)} />
                        <CategorySection title="Stunning Decor" items={events.filter(e => e.category === 'Decor').slice(0, 4)} />

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
                        <CategorySection title="Bridal Makeup" items={events.filter(e => e.category === 'Makeup').slice(0, 4)} />
                        <CategorySection title="Premium Event Planning" items={events.filter(e => e.category === 'Planning').slice(0, 4)} />
                    </div>

                </>
            ) : (
                <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold capitalize text-gray-900 dark:text-white">{activeCategory} Marketplace</h2>
                        <p className="text-gray-500 text-sm mt-1">Discover premium listings specifically tailored for your choice.</p>
                    </div>
                    {filteredEvents.length > 0 ? (
                        <CategorySection title="" items={filteredEvents} />
                    ) : (
                        <div className="text-center py-20">
                            <Sparkles size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No listings found</h3>
                            <p className="text-gray-500 text-sm">Stay tuned! Our vendors are populating this category soon.</p>
                        </div>
                    )}
                </section>
            )}

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
