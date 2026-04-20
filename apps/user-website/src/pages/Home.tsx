import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Search, Calendar, Star, Shield, Heart, ArrowRight, Sparkles, LayoutDashboard, Clock, CheckCircle2, Wallet } from 'lucide-react';
import Hero from '../components/Hero';
import CategorySlider from '../components/CategorySlider';
import CategorySection from '../components/CategorySection';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';
import ListingCard from '../components/ListingCard';
import { useAuth } from '@ease2event/shared/auth';
import FallingPetals from '../components/FallingPetals';

import { fetchEvents } from '../lib/api';
import type { Event } from '../types';


const Home: React.FC = () => {
    const { showToast } = useToast();
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const activeCategory = searchParams.get('category') || 'all';

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [marketplaceTab, setMarketplaceTab] = useState('All');

    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [subscribeError, setSubscribeError] = useState('');

    useEffect(() => {
        fetchEvents()
            .then(data => {
                setEvents(data);
            })
            .catch(err => {
                console.error('Failed to load events', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredEvents = activeCategory === 'all'
        ? events
        : events.filter(e => e.category.toLowerCase() === activeCategory.toLowerCase());

    const weddingVenues = events.filter(e => e.category === 'Weddings');
    const birthdayVenues = events.filter(e => e.category === 'Birthdays' || e.category === 'Parties');
    const corporateVenues = events.filter(e => e.category === 'Corporate');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        const email = subscribeEmail.trim();
        if (!email) {
            setSubscribeError('Please enter an email address');
            return;
        }
        if (email.length < 6) {
            setSubscribeError('Please enter at least 6 characters');
            return;
        }
        setSubscribeError('');
        setSubscribeEmail('');
        showToast('Successfully subscribed to newsletter!', 'success');
    };



    return (
        <main className="min-h-screen bg-white dark:bg-transparent aurora-bg relative transition-colors duration-300 overflow-x-hidden">
            <FallingPetals />
            <SEO title="Home" description="Find and book the perfect venue for your wedding, birthday, or corporate event with Ease2event." />
            <Hero />

            {/* Dashboard Highlights for Logged-in Users */}
            {isAuthenticated && activeCategory === 'all' && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8 mb-12 relative z-40"
                >
                    <div className="bg-white/95 backdrop-blur-3xl dark:bg-slate-900/95 rounded-[2rem] shadow-xl shadow-black/10 border border-white/20 dark:border-white/10 p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8">
                        <div className="flex-1 w-full text-center lg:text-left">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight uppercase">Your Plan Hub</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-6">Manage your dream event from your personalized dashboard.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0">
                                <div className="p-4 bg-neutral-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-red-100/50 text-red-600 rounded-lg"><Clock size={16} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Next Milestone</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Book Wedding Photographer</p>
                                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Due in 2 days</p>
                                </div>
                                <div className="p-4 bg-neutral-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-green-100/50 text-green-600 rounded-lg"><Wallet size={16} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget Spent</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">₹45,000 / ₹2,00,000</p>
                                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">22.5% of total budget</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 w-full lg:w-auto grid grid-cols-2 gap-3 relative z-50">
                            <Link to="/dashboard" className="flex flex-col items-center justify-center p-4 bg-red-600 text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-red-500/10 group relative pointer-events-auto min-w-[120px]">
                                <LayoutDashboard size={24} className="mb-1.5 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-tight">Overview</span>
                            </Link>
                            <Link to="/dashboard/bookings" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 transition-all shadow-sm relative pointer-events-auto min-w-[120px]">
                                <Calendar size={24} className="mb-1.5" />
                                <span className="text-[10px] font-black uppercase tracking-tight">Bookings</span>
                            </Link>
                            <Link to="/dashboard/inbox" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 transition-all shadow-sm relative pointer-events-auto min-w-[120px]">
                                <Search size={24} className="mb-1.5" />
                                <span className="text-[10px] font-black uppercase tracking-tight">Messages</span>
                            </Link>
                            <Link to="/dashboard/budget" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 transition-all shadow-sm relative pointer-events-auto min-w-[120px]">
                                <Star size={24} className="mb-1.5" />
                                <span className="text-[10px] font-black uppercase tracking-tight">Saved</span>
                            </Link>
                        </div>
                    </div>
                </motion.section>
            )}

            <CategorySlider />


            {activeCategory === 'all' ? (
                <>
                    {/* Explore Marketplace Categories */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-[1536px] mx-auto px-4 md:px-8 py-12"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What you need for your event</h2>
                            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Discover everything you need to make your next event truly unforgettable.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:grid-flow-row-dense">
                            {[
                                { title: 'Weddings', image: 'https://images.unsplash.com/photo-1707374661682-d804856cee22?w=800&auto=format&fit=crop&q=80', link: '/?category=weddings', class: 'col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 h-64 lg:h-auto' },
                                { title: 'Birthdays', image: 'https://images.unsplash.com/photo-1621857426350-ddab819cf0cc?w=800&auto=format&fit=crop&q=80', link: '/?category=birthdays', class: 'col-span-1 h-64' },
                                { title: 'Corporate', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop', link: '/?category=corporate', class: 'col-span-1 h-64' },
                                { title: 'Parties', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop', link: '/?category=parties', class: 'col-span-1 sm:col-span-2 lg:col-span-2 h-64' },
                                { title: 'Photography', image: 'https://plus.unsplash.com/premium_photo-1682097066897-209d0d9e9ae5?w=800&auto=format&fit=crop&q=80', link: '/?category=photography', class: 'col-span-1 h-64' },
                                { title: 'Catering', image: 'https://plus.unsplash.com/premium_photo-1663076035579-727173643e51?w=800&auto=format&fit=crop&q=80', link: '/?category=catering', class: 'col-span-1 h-64' },
                                { title: 'Decor', image: 'https://images.unsplash.com/photo-1636005429050-2fb797c01e6f?w=800&auto=format&fit=crop&q=80', link: '/?category=decor', class: 'col-span-1 h-64' },
                                { title: 'Music & DJs', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop', link: '/?category=music', class: 'col-span-1 h-64' },
                                { title: 'Venues', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop', link: '/?category=venues', class: 'col-span-1 sm:col-span-2 lg:col-span-2 h-64' },
                                { title: 'Makeup', image: 'https://images.unsplash.com/photo-1511923199659-1c16881689de?w=800&auto=format&fit=crop&q=80', link: '/?category=makeup', class: 'col-span-1 h-64' },
                                { title: 'Planning', image: 'https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?w=800&auto=format&fit=crop&q=80', link: '/?category=planning', class: 'col-span-1 h-64' },
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


                    {/* Featured Events This Month */}
                    <section className="max-w-[1536px] mx-auto px-4 md:px-8 py-16">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                            <div className="space-y-1">
                                <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Featured Events This Month</h2>
                                <p className="text-s text-gray-400 font-black tracking-widest opacity-60">Handpicked Premium Experiences</p>
                            </div>
                            <Link to="/marketplace" className="text-white dark:text-white hover:text-red-600 font-black flex items-center gap-2 group text-md tracking-widest bg-red-50 dark:bg-red-500/5 px-5 py-2.5 rounded-full border border-red-500/10 transition-all">
                                See More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {weddingVenues.slice(0, 3).map((item, index) => (
                                <ListingCard
                                    key={index}
                                    {...item}
                                    marketplaceStatus="AVAILABLE"
                                    spotsLeft={42}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Marketplace Section (KEY Tabbed Layout) */}
                    <section className="bg-white/5 backdrop-blur-lg dark:bg-slate-900/20 py-16">
                        <div className="max-w-[1536px] mx-auto px-4 md:px-8">

                            {/* 🔹 Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">

                                <div className="space-y-1">
                                    <h2 className="text-xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                                        Plan Your Event Without Stress
                                    </h2>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide opacity-80">
                                        Real-time status tracking
                                    </p>
                                </div>

                                {/* 🔹 Tabs (FIXED) */}
                                <div className="flex items-center gap-3 md:gap-4 overflow-x-auto hide-scrollbar pb-2">
                                    {['All', 'Available', 'Filling', 'New'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setMarketplaceTab(tab)}
                                            className={`group relative py-2 transition-all duration-300 hover:scale-110 hover:brightness-150 ${marketplaceTab === tab
                                                ? 'text-gray-900 dark:text-white font-black'
                                                : 'text-gray-500 font-semibold'
                                                }`}
                                        >
                                            <span className="text-xs md:text-sm uppercase tracking-[0.2em] whitespace-nowrap">
                                                {tab}
                                            </span>
                                            {marketplaceTab === tab && (
                                                <motion.div
                                                    layoutId="homeMarketUnderline"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 🔹 Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {events.slice(0, 6).map((item, index) => {
                                    const statuses = ['AVAILABLE', 'FILLING_FAST', 'SOLD_OUT', 'COMING_SOON'] as const;
                                    const status = statuses[index % 4];
                                    const spots =
                                        status === 'SOLD_OUT'
                                            ? 0
                                            : status === 'FILLING_FAST'
                                                ? 8
                                                : 42;

                                    // Filtering
                                    if (marketplaceTab === 'Available' && status !== 'AVAILABLE') return null;
                                    if (marketplaceTab === 'Filling' && status !== 'FILLING_FAST') return null;

                                    return (
                                        <div
                                            key={item.id || index}
                                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <ListingCard
                                                {...item}
                                                marketplaceStatus={status}
                                                spotsLeft={spots}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </section>

                    {/* How It Works */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/5 backdrop-blur-md dark:bg-slate-950/20 py-20 transition-colors duration-300 relative z-10"
                    >
                        <div className="max-w-[1536px] mx-auto px-4 md:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                                <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                                    Planning your event has never been easier. Follow these simple steps to book your dream venue.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                                {[
                                    { icon: Search, title: 'Browse & Discover', desc: 'Search events by category, location, and dates to find your perfect match.', path: '/search' },
                                    { icon: Calendar, title: 'Book & Confirm', desc: 'Select your preferred date, fill in your details, and checkout securely.', path: '/search' },
                                    { icon: Star, title: 'Enjoy Your Event', desc: 'Relax and celebrate. Your chosen vendor will take care of absolutely everything else.', path: '/inspiration' },
                                ].map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.2, duration: 0.5 }}
                                    >
                                        <Link
                                            to={step.path}
                                            className="block h-full bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 text-center group cursor-pointer active:scale-95"
                                        >
                                            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                                                <step.icon size={32} className="text-red-500 group-hover:text-white transition-colors" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 transition-colors">{step.title}</h3>
                                            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                                            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                Get Started <ArrowRight size={16} />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                </>
            ) : (
                <section className="max-w-[1536px] mx-auto px-4 md:px-8 py-12">
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
            <section className="bg-slate-50/50 dark:bg-black/20 backdrop-blur-lg text-slate-900 dark:text-white py-20 relative z-10 border-t border-slate-200 dark:border-white/5">
                <div className="max-w-[1536px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-center whitespace-nowrap mb-10 tracking-tight">
                                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                                    Why Ease2event?
                                </span>
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Verified Vendors</h3>
                                        <p className="text-slate-600 dark:text-gray-400">
                                            Every venue and vendor is personally verified by our team to ensure quality and reliability.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Heart size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Best Price Guarantee</h3>
                                        <p className="text-slate-600 dark:text-gray-400">
                                            We negotiate the best rates so you don't have to. Find a lower price? We'll match it.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                                        <p className="text-slate-600 dark:text-gray-400">
                                            Our dedicated support team is available around the clock to assist you with any queries.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-gray-800">
                            <img
                                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop"
                                alt="Event Planning"
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-gray-900 via-transparent to-transparent opacity-60"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Stay Updated</h2>
                    <p className="text-gray-600 dark:text-slate-400 mb-8">Subscribe to our newsletter for the latest venue additions, exclusive offers, and event planning tips.</p>
                    <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto relative" onSubmit={handleSubscribe} noValidate>
                        <div className="flex-1 relative">
                            <input
                                type="email"
                                value={subscribeEmail}
                                onChange={(e) => {
                                    setSubscribeEmail(e.target.value);
                                    if (e.target.value) setSubscribeError('');
                                }}
                                required
                                placeholder="Enter your email address"
                                className={`w-full px-6 py-4 rounded-full border bg-white dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:ring-2 transition-all ${
                                    subscribeError 
                                        ? 'border-red-500 focus:ring-red-500 dark:focus:ring-red-500' 
                                        : 'border-gray-200 dark:border-slate-700 focus:ring-red-500 dark:focus:ring-red-400'
                                }`}
                            />
                            {subscribeError && (
                                <p className="absolute -bottom-6 left-6 text-sm text-red-500 font-bold">{subscribeError}</p>
                            )}
                        </div>
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
