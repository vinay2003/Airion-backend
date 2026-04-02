import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore, Booking } from '../../store/useDashboardStore';
import { Calendar, Clock, CreditCard, ArrowRight, Plus, MapPin, Heart, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '@shared/auth/AuthContext';

const OCCASIONS = [
    { label: 'Wedding', emoji: '💍' },
    { label: 'Birthday', emoji: '🎂' },
    { label: 'Anniversary', emoji: '🌹' },
    { label: 'Baby Shower', emoji: '🍼' },
    { label: 'Engagement', emoji: '💐' },
    { label: 'Corporate', emoji: '🏢' },
    { label: 'Festival', emoji: '🪔' },
    { label: 'Housewarming', emoji: '🏠' },
];

const TRENDING_VENDORS = [
    { id: '1', name: 'Royal Photography', category: 'Photographer', rating: 4.9, price: '₹25,000', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400', location: 'Kankarbagh, Patna' },
    { id: '2', name: 'Sharma Tent House', category: 'Decor & Setup', rating: 4.6, price: '₹12,000', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400', location: 'Boring Road, Patna' },
    { id: '3', name: 'Sweets & Caterers', category: 'Catering', rating: 4.7, price: '₹800/plate', image: 'https://images.unsplash.com/photo-1555244166-3f8b320cd56b?w=400', location: 'Bailey Road, Patna' },
    { id: '4', name: 'Dream Decor Events', category: 'Event Planner', rating: 4.5, price: '₹50,000', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400', location: 'Exhibition Road' },
];

const DEAL_BANNERS = [
    { id: 0, title: 'Wedding Season Deals', subtitle: 'Up to 30% Off', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', link: '/marketplace' },
    { id: 1, title: 'Book Now, Pay Later', subtitle: 'EMI on all bookings', image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?w=800', link: '/marketplace' },
    { id: 2, title: 'Premium Vendors in Patna', subtitle: 'Verified & Rated', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', link: '/marketplace' },
];

const DashboardOverview: React.FC = () => {
    const { user } = useAuth();
    const { bookings, budgetItems, totalBudget } = useDashboardStore();
    const [currentBanner, setCurrentBanner] = useState(0);
    const [savedVendors, setSavedVendors] = useState<string[]>([]);

    const activeBookings = bookings.filter(b => b.status === 'Upcoming');
    const totalSpent = budgetItems.reduce((acc, item) => acc + item.spent, 0);
    const remainingBudget = totalBudget - totalSpent;

    const chartData = budgetItems.map(item => ({ name: item.category, value: item.spent }));
    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

    useEffect(() => {
        const interval = setInterval(() => setCurrentBanner(b => (b + 1) % DEAL_BANNERS.length), 4500);
        return () => clearInterval(interval);
    }, []);

    const toggleSave = (id: string) => {
        setSavedVendors(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
    };

    const firstName = user?.name?.split(' ')[0] || 'there';

    return (
        <div className="space-y-8 pb-6">
            {/* Welcome Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
                        Hello, {firstName} 👋
                    </h1>
                    <p className="text-neutral-500 dark:text-slate-400 mt-1">Here's a snapshot of your event planning progress.</p>
                </div>
                <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 font-semibold text-sm hover:bg-red-600 transition"
                >
                    <Plus size={16} />
                    Discover Vendors
                </Link>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: 'Upcoming Events', value: activeBookings.length, icon: Calendar, bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', link: '/dashboard/bookings' },
                    { title: 'Budget Spent', value: `₹${totalSpent.toLocaleString()}`, icon: CreditCard, bg: 'bg-green-50 dark:bg-green-500/10', text: 'text-green-600 dark:text-green-400', link: '/dashboard/budget' },
                    { title: 'Pending Tasks', value: 3, icon: Clock, bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', link: '/dashboard/bookings' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Link
                            to={stat.link}
                            className="p-6 bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl flex items-center gap-4 hover:shadow-md hover:border-red-200 dark:hover:border-red-500/30 transition-all block"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.text}`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 dark:text-slate-400 font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-0.5">{stat.value}</h3>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Occasion Categories */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Plan an Occasion</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
                    {OCCASIONS.map((occ, idx) => (
                        <Link
                            key={idx}
                            to={`/category/${occ.label.toLowerCase().replace(' ', '-')}`}
                            className="flex-shrink-0 flex flex-col items-center gap-2 group"
                        >
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-neutral-100 dark:border-slate-700 group-hover:scale-110 group-hover:shadow-md group-hover:border-red-200 dark:group-hover:border-red-500/30 transition-all duration-200">
                                {occ.emoji}
                            </div>
                            <span className="text-xs font-semibold text-neutral-500 dark:text-slate-400 whitespace-nowrap">{occ.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Promo Banner Slider */}
            <section className="relative h-44 rounded-2xl overflow-hidden shadow-lg">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBanner}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                    >
                        <img src={DEAL_BANNERS[currentBanner].image} alt={DEAL_BANNERS[currentBanner].title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                        <div className="absolute inset-0 p-7 flex flex-col justify-center">
                            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-1">{DEAL_BANNERS[currentBanner].subtitle}</p>
                            <h3 className="text-white text-2xl font-extrabold max-w-[220px] leading-tight mb-3">{DEAL_BANNERS[currentBanner].title}</h3>
                            <Link to={DEAL_BANNERS[currentBanner].link} className="w-fit bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1 transition-all">
                                Explore <ChevronRight size={14} />
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-4 right-5 flex gap-1.5">
                    {DEAL_BANNERS.map((_, i) => (
                        <button key={i} onClick={() => setCurrentBanner(i)} className={`h-1.5 rounded-full transition-all ${i === currentBanner ? 'w-6 bg-red-500' : 'w-1.5 bg-white/40'}`} />
                    ))}
                </div>
            </section>

            {/* Main Grid: Bookings + Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Bookings */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Active Bookings</h2>
                        <Link to="/dashboard/bookings" className="text-sm font-semibold text-red-500 hover:text-red-400 flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {activeBookings.length > 0 ? activeBookings.map((booking: Booking) => (
                            <motion.div
                                key={booking.id}
                                className="bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl p-4 flex gap-4 hover:shadow-md transition cursor-pointer"
                            >
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-slate-800">
                                    <img src={booking.imageUrl} alt={booking.vendorName} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-red-500 tracking-wider uppercase">{booking.category}</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">{booking.status}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1 truncate">{booking.vendorName}</h3>
                                        <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                                            <MapPin size={12} />
                                            <span className="truncate">{booking.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-neutral-100/60 dark:border-slate-800/60 pt-2 mt-2">
                                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-slate-400">
                                            <Calendar size={12} />
                                            {booking.date} at {booking.time}
                                        </div>
                                        <span className="text-sm font-bold text-neutral-900 dark:text-white">₹{booking.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="bg-white dark:bg-slate-900 border border-dashed border-neutral-300 dark:border-slate-800 p-8 rounded-2xl text-center space-y-3">
                                <p className="text-neutral-400 dark:text-slate-500">No active bookings yet.</p>
                                <Link to="/marketplace" className="inline-flex items-center gap-1 text-sm font-bold text-red-500 hover:text-red-600">
                                    Explore Vendors <ArrowRight size={14} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Budget Overview */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Budget Overview</h2>
                    <div className="bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center">
                        <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70}>
                                        {chartData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-neutral-500 dark:text-slate-400">Remaining Budget</p>
                            <h3 className="text-2xl font-black text-neutral-900 dark:text-white">₹{remainingBudget.toLocaleString()}</h3>
                            <p className="text-xs text-neutral-400 mt-0.5">of ₹{totalBudget.toLocaleString()} total</p>
                        </div>
                        <div className="w-full mt-4 bg-neutral-50 dark:bg-slate-800 rounded-xl p-3 flex flex-col gap-2">
                            {budgetItems.slice(0, 4).map((item, i) => (
                                <div key={item.id} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="font-semibold text-neutral-700 dark:text-slate-300 truncate max-w-[100px]">{item.category}</span>
                                    </div>
                                    <span className="text-neutral-500 dark:text-slate-400 font-medium">₹{item.spent.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <Link to="/dashboard/budget" className="w-full text-center text-sm font-semibold text-red-500 hover:text-red-600 mt-4 pt-3 border-t border-neutral-100 dark:border-slate-800 flex items-center justify-center gap-1 transition-colors">
                            Manage Budget <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Trending Vendors */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Trending Near You 🔥</h2>
                    <Link to="/marketplace" className="text-sm font-semibold text-red-500 hover:text-red-400 flex items-center gap-1">
                        View all <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                    {TRENDING_VENDORS.map(vendor => (
                        <div key={vendor.id} className="flex-shrink-0 w-64 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-neutral-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group">
                            <div className="relative h-40">
                                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-neutral-700 dark:text-neutral-300">{vendor.category}</div>
                                <button
                                    onClick={() => toggleSave(vendor.id)}
                                    className="absolute top-3 right-3 w-7 h-7 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                                >
                                    <Heart size={14} className={savedVendors.includes(vendor.id) ? 'fill-red-500 text-red-500' : 'text-neutral-400'} />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-neutral-900 dark:text-white text-sm leading-tight flex-1 pr-2 truncate">{vendor.name}</h3>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Star size={12} className="fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{vendor.rating}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-400 mb-3 flex items-center gap-1">
                                    <MapPin size={10} className="text-red-400" />{vendor.location}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black text-neutral-900 dark:text-white">{vendor.price}</span>
                                    <Link to={`/event/${vendor.id}`} className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                                        Book
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* EMI Tip Banner */}
            <div className="bg-red-50 dark:bg-red-500/5 rounded-2xl p-5 border border-red-100 dark:border-red-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-bold text-red-600 dark:text-red-400">Did you know?</h3>
                    <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-0.5">You can split vendor payments into easy 3–12 month EMIs. Check your eligibility now.</p>
                </div>
                <button className="whitespace-nowrap px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 shadow-md transition-colors">
                    Check Eligibility
                </button>
            </div>
        </div>
    );
};

export default DashboardOverview;
