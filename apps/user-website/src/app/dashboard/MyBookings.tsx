import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Search, Filter, ChevronRight, FileText } from 'lucide-react';

import { fetchMyBookings } from '../../lib/api';

const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Upcoming', 'Pending', 'Completed', 'Cancelled'];

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const response = await fetchMyBookings();
                // response is already unwrapped by axios interceptor to { bookings: [...] } 
                // or just [...] depending on controller.
                // Our standardized controller returns { success: true, data: { bookings: [...] } }
                // Interceptor returns { bookings: [...] }
                if (response && response.bookings) {
                    setBookings(response.bookings);
                } else if (Array.isArray(response)) {
                    setBookings(response);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed': return { bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-700 dark:text-green-400', label: 'Upcoming' };
            case 'pending': return { bg: 'bg-yellow-100 dark:bg-yellow-500/20', text: 'text-yellow-700 dark:text-yellow-400', label: 'Pending Payment' };
            case 'completed': return { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-400', label: 'Completed' };
            case 'cancelled': return { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-400', label: 'Cancelled' };
            default: return { bg: 'bg-neutral-100 dark:bg-slate-800', text: 'text-neutral-700 dark:text-slate-300', label: status };
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Upcoming') return b.status === 'confirmed';
        return b.status.toLowerCase() === activeTab.toLowerCase();
    });

    return (
        <div className="max-w-[1440px] mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white capitalize tracking-tight mb-2">My Bookings</h1>
                    <p className="text-neutral-500 dark:text-slate-400 font-medium tracking-wide">Manage your event reservations and invoices.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search booking ID..."
                        className="w-full pl-11 pr-4 py-3 border border-neutral-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold text-neutral-900 dark:text-white transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Custom Segmented Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-8 p-1 border-b border-neutral-200 dark:border-slate-800 pb-4">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md'
                                : 'bg-transparent text-neutral-500 dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredBookings.length > 0 ? filteredBookings.map((booking) => {
                        const style = getStatusStyles(booking.status);
                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                key={booking.id}
                                className="bg-white dark:bg-slate-800/50 rounded-3xl p-5 shadow-sm border border-neutral-200 dark:border-slate-800   transition-all duration-300 group flex flex-col sm:flex-row gap-6 cursor-pointer"
                            >
                                <div className="sm:w-48 h-40 sm:h-full rounded-2xl overflow-hidden shrink-0 relative">
                                    <img src={booking.vendor?.portfolioImages?.[0]} alt="Venue" className="w-full h-full object-cover transform  transition-transform duration-700" />
                                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 ${style.bg.replace('bg-', 'bg-').split(' ')[0]} ${style.text.split(' ')[0]} bg-opacity-90`}>
                                        {style.label}
                                    </div>
                                </div>

                                <div className="flex-1 py-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs font-bold text-neutral-400 tracking-wider">#{booking.bookingCode}</p>
                                            <button className="text-neutral-400 hover:text-red-500 transition-colors">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-4 line-clamp-1">{booking.vendor?.businessName}</h3>

                                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-neutral-600 dark:text-slate-400 mb-6 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-red-500" />
                                                <span>{new Date(booking.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-red-500" />
                                                <span className="truncate">{booking.vendor?.city}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-100 dark:border-slate-800/80 mt-auto min-h-[52px]">
                                        <div className="shrink-0">
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5 leading-none">Total</p>
                                            <p className="font-black text-neutral-900 dark:text-white text-lg leading-none">₹{parseFloat(booking.totalAmount).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2 justify-end ml-auto shrink-0">
                                            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors shrink-0" title="Download Invoice">
                                                <FileText size={18} />
                                            </button>
                                            <button className="px-5 h-10 flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white rounded-xl text-sm font-bold transition-colors shrink-0 whitespace-nowrap">
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-slate-800/30 rounded-3xl border border-dashed border-neutral-200 dark:border-slate-700">
                            <div className="w-16 h-16 bg-neutral-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                <Filter size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No {activeTab.toLowerCase()} bookings found</h3>
                            <p className="text-neutral-500 font-medium max-w-sm mx-auto">You don't have any bookings matching this status right now.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MyBookings;

