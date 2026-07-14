import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore, Booking } from '@/store/useDashboardStore';
import { Calendar, Clock, CreditCard, ArrowRight, Plus, MapPin, Heart, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '@ease2event/shared/auth';

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
    { id: '3', name: 'Sweets & Caterers', category: 'Catering', rating: 4.7, price: '₹800/plate', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U3dlZXRzfGVufDB8fDB8fHww', location: 'Bailey Road, Patna' },
    { id: '4', name: 'Dream Decor Events', category: 'Event Planner', rating: 4.5, price: '₹50,000', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400', location: 'Exhibition Road' },
];

const DEAL_BANNERS = [
    { id: 0, title: 'Wedding Season Deals', subtitle: 'Up to 30% Off', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', link: '/marketplace' },
    { id: 1, title: 'Book Now, Pay Later', subtitle: 'EMI on all bookings', image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?w=800', link: '/marketplace' },
    { id: 2, title: 'Premium Vendors in Patna', subtitle: 'Verified & Rated', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', link: '/marketplace' },
];

const UserDashboard: React.FC = () => {
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
        <div className="space-y-8 pb-6 bg-white">
            {/* Welcome Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                        Hello, {firstName} 👋
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Status: Active Event Planner</p>
                </div>
                <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl shadow-xl shadow-red-500/20 font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all "
                >
                    <Plus size={16} />
                    Find Vendors
                </Link>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Upcoming Events', value: activeBookings.length, icon: Calendar, bg: 'bg-blue-50', text: 'text-blue-600', link: '/dashboard/bookings' },
                    { title: 'Budget Status', value: `₹${totalSpent.toLocaleString()}`, icon: CreditCard, bg: 'bg-emerald-50', text: 'text-emerald-600', link: '/dashboard/budget' },
                    { title: 'Pending Tasks', value: 3, icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600', link: '/dashboard/bookings' },
                ].map((stat, i) => (
                    <motion.div key={stat.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Link to={stat.link} className="p-8 bg-white border border-slate-100 rounded-3xl flex items-center gap-6   transition-all block group">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.text} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.title}</p>
                                <h3 className="text-3xl font-black text-slate-900 mt-0.5">{stat.value}</h3>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Occasion Categories */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Plan an Occasion</h2>
                </div>
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                    {OCCASIONS.map((occ, idx) => (
                        <Link key={idx} to={`/category/${occ.label.toLowerCase().replace(' ', '-')}`} className="flex-shrink-0 flex flex-col items-center gap-3 group">
                            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-3xl shadow-sm border border-slate-50 group-hover:scale-110 group- group- transition-all duration-300">
                                {occ.emoji}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 group-hover:text-red-500 uppercase tracking-widest transition-colors">{occ.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Promo Banner Slider */}
            <section className="relative h-56 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.div key={currentBanner} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                        <img src={DEAL_BANNERS[currentBanner].image} alt={DEAL_BANNERS[currentBanner].title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
                        <div className="absolute inset-0 p-10 flex flex-col justify-center">
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-2">{DEAL_BANNERS[currentBanner].subtitle}</p>
                            <h3 className="text-white text-3xl font-black max-w-[300px] leading-tight mb-6 uppercase tracking-tight">{DEAL_BANNERS[currentBanner].title}</h3>
                            <Link to={DEAL_BANNERS[currentBanner].link} className="w-fit bg-red-600 hover:bg-white hover:text-red-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-red-600/20">
                                Explore <ChevronRight size={16} />
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-6 right-10 flex gap-2">
                    {DEAL_BANNERS.map((_, i) => (
                        <button key={i} onClick={() => setCurrentBanner(i)} className={`h-1.5 rounded-full transition-all ${i === currentBanner ? 'w-10 bg-red-600' : 'w-2 bg-white/40'}`} />
                    ))}
                </div>
            </section>

            {/* Main Grid: Bookings + Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Bookings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Active Pipeline</h2>
                        <Link to="/dashboard/bookings" className="text-[10px] font-black text-red-600 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2 transition-colors">
                            Full Schedule <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {activeBookings.length > 0 ? activeBookings.map((booking: Booking) => (
                            <motion.div key={booking.id} className="bg-white border border-slate-100 rounded-3xl p-6 flex gap-6  transition-all cursor-pointer group">
                                <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50  transition-transform">
                                    <img src={booking.imageUrl} alt={booking.vendorName} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-red-600 tracking-widest uppercase">{booking.category}</span>
                                            <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full uppercase tracking-widest">{booking.status}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mt-2 truncate uppercase tracking-tight">{booking.vendorName}</h3>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                            <MapPin size={14} className="text-red-500" />
                                            <span className="truncate">{booking.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <Calendar size={14} />
                                            {booking.date} • {booking.time}
                                        </div>
                                        <span className="text-lg font-black text-slate-900">₹{booking.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-100 p-12 rounded-[2.5rem] text-center space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active strategy found.</p>
                                <Link to="/marketplace" className="inline-flex items-center gap-2 text-[10px] font-black text-red-600 hover:text-slate-900 uppercase tracking-widest transition-colors">
                                    Acquire Vendors <ArrowRight size={16} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Budget Overview */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Global Budget</h2>
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center shadow-sm">
                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5}>
                                        {chartData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capital Remaining</p>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">₹{remainingBudget.toLocaleString()}</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Budgeted: ₹{totalBudget.toLocaleString()}</p>
                        </div>
                        <div className="w-full mt-8 bg-slate-50 rounded-2xl p-6 flex flex-col gap-4">
                            {budgetItems.slice(0, 4).map((item, i) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate max-w-[120px]">{item.category}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">₹{item.spent.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Section */}
            <section className="pt-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Hot Pick Vendors 🔥</h2>
                    <Link to="/marketplace" className="text-[10px] font-black text-red-600 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2 transition-colors">
                        View All Listings <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-6">
                    {TRENDING_VENDORS.map(vendor => (
                        <div key={vendor.id} className="flex-shrink-0 w-72 bg-white rounded-[2rem] overflow-hidden border border-slate-50 shadow-sm  transition-all group">
                            <div className="relative h-48">
                                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-red-600 uppercase tracking-widest shadow-lg">{vendor.category}</div>
                                <button onClick={() => toggleSave(vendor.id)} className="absolute top-4 right-4 w-9 h-9 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-lg hover:bg-red-50 group/save">
                                    <Heart size={18} className={savedVendors.includes(vendor.id) ? 'fill-red-600 text-red-600' : 'text-slate-300 group-hover/save:text-red-400'} />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-slate-900 text-base leading-tight flex-1 pr-2 truncate uppercase tracking-tight">{vendor.name}</h3>
                                    <div className="flex items-center gap-1.5 flex-shrink-0 bg-emerald-50 px-2 py-1 rounded-lg">
                                        <Star size={12} className="fill-emerald-500 text-emerald-500" />
                                        <span className="text-[10px] font-black text-emerald-600">{vendor.rating}</span>
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 mb-6 flex items-center gap-1 uppercase tracking-widest">
                                    <MapPin size={12} className="text-red-500" />{vendor.location}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black text-slate-900">{vendor.price}</span>
                                    <Link to={`/event/${vendor.id}`} className="bg-red-600 hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95">
                                        Acquire
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default UserDashboard;
