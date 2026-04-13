import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Search, Clock, Users, DollarSign, CheckCircle, AlertCircle, ChevronRight, User, Filter, XCircle } from 'lucide-react';
import { useBookingStore } from '@ease2event/shared/lib/stores/useBookingStore';
import { useAuth } from '@ease2event/shared/auth';
import { Button, Card, Skeleton, notify } from '@ease2event/ui';

const Bookings: React.FC = () => {
    const { user } = useAuth();
    const { 
        bookings, 
        loading, 
        fetchVendorBookings, 
        updateBookingStatus,
        stats 
    } = useBookingStore();
    
    const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user?.id) {
            fetchVendorBookings(user.id);
        }
    }, [user?.id, fetchVendorBookings]);

    const handleAction = async (id: string, action: 'confirmed' | 'cancelled') => {
        try {
            await updateBookingStatus(id, action);
            notify.success(`Booking ${action === 'confirmed' ? 'accepted' : 'rejected'} successfully!`);
        } catch (err: any) {
            notify.error('Failed to update booking status.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'cancelled':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesTab = booking.status?.toLowerCase() === activeTab;
        const matchesSearch = 
            booking.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.listingName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const displayStats = [
        { label: 'Total Volume', value: stats?.totalVolume || '₹0', icon: CalendarIcon, color: 'blue' },
        { label: 'Confirmed', value: stats?.confirmedCount || '0', icon: CheckCircle, color: 'green' },
        { label: 'Pending', value: stats?.pendingCount || '0', icon: AlertCircle, color: 'yellow' },
        { label: 'Revenue', value: stats?.totalRevenue || '₹0', icon: DollarSign, color: 'red' },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Booking Pipeline</h1>
                <p className="text-gray-500 dark:text-slate-400">Track and manage your upcoming event schedule</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayStats.map((stat, idx) => (
                    <Card key={idx} className="flex flex-col border-none shadow-sm hover:shadow-xl transition-all h-full justify-between group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-4 rounded-3xl bg-[var(--ease2event-bg-elevated)] text-${stat.color}-500/80 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white dark:bg-slate-900 p-2 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex bg-gray-50 dark:bg-slate-950 p-1 rounded-xl">
                    {[
                        { id: 'pending', label: 'Pending' },
                        { id: 'confirmed', label: 'Accepted' },
                        { id: 'cancelled', label: 'Rejected' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-800 text-red-500 shadow-sm'
                                : 'text-gray-500'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80 pr-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search client or listing..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-6">
                {loading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} height={160} className="rounded-3xl" />)
                ) : filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <Card key={booking.id} padding="none" className="hover:shadow-2xl transition-all border-none relative overflow-hidden group">
                           <div className="flex flex-col lg:flex-row lg:items-center p-8 gap-8">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-red-500 border border-gray-100 shadow-sm">
                                                <CalendarIcon size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-2 select-none">{booking.listingName}</h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-tighter">
                                                        <User size={14} className="text-red-500" />
                                                        {booking.userName}
                                                    </div>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest underline underline-offset-4 cursor-pointer">View Contract</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 dark:bg-slate-950/50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Date</p>
                                            <div className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                                                <CalendarIcon size={16} className="text-red-500" />
                                                {new Date(booking.eventDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric'})}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Time</p>
                                            <div className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                                                <Clock size={16} className="text-red-500" />
                                                11:00 AM
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pax Capacity</p>
                                            <div className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
                                                <Users size={16} className="text-red-500" />
                                                400 GUESTS
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gross Value</p>
                                            <div className="flex items-center gap-2 text-sm font-black text-green-600">
                                                <DollarSign size={16} />
                                                ₹{booking.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex lg:flex-col gap-3 min-w-[160px]">
                                    <Button variant="ghost" fullWidth rightIcon={<ChevronRight size={18} />}>
                                        Details
                                    </Button>
                                    {activeTab === 'pending' && (
                                        <>
                                            <Button 
                                                onClick={() => handleAction(booking.id, 'confirmed')}
                                                variant="primary" 
                                                fullWidth
                                                className="shadow-xl shadow-red-500/20"
                                            >
                                                Accept
                                            </Button>
                                            <button 
                                                onClick={() => handleAction(booking.id, 'cancelled')}
                                                className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-tight text-red-500 border border-red-500/20 hover:bg-red-50 transition-all"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                           </div>
                           <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rotate-45 translate-x-12 -translate-y-12"></div>
                        </Card>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-800">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-slate-950 rounded-full flex items-center justify-center text-gray-300 dark:text-slate-800 mb-8 border border-gray-100">
                            <CalendarIcon size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">No {activeTab} bookings</h3>
                        <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">Your pipeline is empty. New booking requests will appear here once users start exploring your listings.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
