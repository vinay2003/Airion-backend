import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp, CalendarCheck, Star, Users, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import api from '../lib/api';

const Dashboard = () => {
    const [vendor, setVendor] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await api.get('/vendors/me');
                if (response.data && !response.data.message) {
                    setVendor(response.data);
                    const bookingsRes = await api.get('/bookings/vendor').catch(() => ({ data: [] }));
                    setBookings(bookingsRes.data || []);
                }
            } catch (error) {
                console.log('User is not yet a vendor or not logged in');
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 dark:border-white"></div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-6 text-center">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-10 border border-slate-100 dark:border-slate-800">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Complete your Host Profile</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
                        To start accepting bookings and appearing in search results, you must complete your business verification.
                    </p>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1">
                        Go to Verification
                    </button>
                </div>
            </div>
        );
    }

    const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0);
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;

    const STATS = [
        { label: 'Total Earnings', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
        { label: 'Upcoming Bookings', value: pendingBookings.toString(), icon: CalendarCheck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { label: 'Total Views', value: '1,248', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        { label: 'Overall Rating', value: vendor.rating?.toFixed(1) || 'New', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Welcome back, {vendor.businessName}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Here's what's happening with your business today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                        vendor.isVerified 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                    }`}>
                        {vendor.isVerified ? <CheckCircle size={16} /> : <Clock size={16} />}
                        {vendor.isVerified ? 'Verified Host' : 'Verification Pending'}
                    </span>
                    <button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-bold transition-colors">
                        Preview Listing
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {STATS.map((stat, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                <stat.icon size={24} strokeWidth={2.5} />
                            </div>
                            <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                                <TrendingUp size={12} className="mr-1" />
                                +12%
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings Panel */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Requests</h2>
                        <button className="text-red-500 text-sm font-bold flex items-center gap-1 hover:text-red-600 transition-colors">
                            View All <ArrowRight size={16} />
                        </button>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <CalendarCheck size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No bookings yet</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">When guests book your services, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.slice(0, 4).map((booking, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                            {booking.user?.name ? booking.user.name.charAt(0) : 'G'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{booking.user?.name || 'Guest User'}</h4>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {new Date(booking.eventDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">₹{(parseFloat(booking.totalAmount) || 0).toLocaleString()}</p>
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                            booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                            'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions / Upgrades Panel */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group hover:shadow-2xl transition-all">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                        <div className="relative z-10">
                            <Star className="text-amber-400 mb-4" size={32} />
                            <h3 className="text-2xl font-bold mb-2">Upgrade to Premium</h3>
                            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                                Get prioritized in search results, zero commission fees, and dedicated account management.
                            </p>
                            <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg">
                                View Plans
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            {['Add New Service', 'Update Calendar', 'Manage Promotions', 'Edit Profile'].map((link, i) => (
                                <button key={i} className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm transition-colors flex justify-between items-center group">
                                    {link}
                                    <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// SVG component helper inside same file for quick links
const ChevronRight = ({ size, className }: { size: number, className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export default Dashboard;
