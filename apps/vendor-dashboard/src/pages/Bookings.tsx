import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Search,
    Clock,
    MapPin,
    Users,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight,
    MoreVertical,
    Target,
    Activity,
    Zap,
    Filter
} from 'lucide-react';
import { Tabs, Input, Button, Badge } from '@ease2event/ui';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface Booking {
    id: number;
    venueName: string;
    clientName: string;
    date: string;
    time: string;
    guests: number;
    amount: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    eventType: string;
}

/**
 * 🎫 Booking Registry: High-Fidelity Management Interface
 * Refactored for 'Premium SaaS' aesthetics and theme-aware interactivity.
 */
const Bookings: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'Confirmed' | 'Pending' | 'Cancelled'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const bookings: Booking[] = [
        {
            id: 1,
            venueName: 'Grand Ballroom',
            clientName: 'Rahul Kumar',
            date: 'Dec 12, 2024',
            time: '06:00 PM - 11:00 PM',
            guests: 350,
            amount: '₹2,00,000',
            status: 'Confirmed',
            eventType: 'Wedding Reception'
        },
        {
            id: 2,
            venueName: 'Sunset Garden',
            clientName: 'Priya Singh',
            date: 'Dec 15, 2024',
            time: '04:00 PM - 10:00 PM',
            guests: 200,
            amount: '₹1,50,000',
            status: 'Pending',
            eventType: 'Birthday Celebration'
        },
        {
            id: 3,
            venueName: 'Royal Palace Hall',
            clientName: 'Amit Shah',
            date: 'Dec 18, 2024',
            time: '07:00 PM - 12:00 AM',
            guests: 500,
            amount: '₹3,50,000',
            status: 'Confirmed',
            eventType: 'Corporate Summit'
        },
        {
            id: 4,
            venueName: 'Grand Ballroom',
            clientName: 'Sneha Gupta',
            date: 'Dec 10, 2024',
            time: '05:00 PM - 10:00 PM',
            guests: 150,
            amount: '₹1,80,000',
            status: 'Cancelled',
            eventType: 'Anniversary Gala'
        },
    ];

    const stats = [
        { label: 'Total Volume', value: '28', icon: Activity, trend: '+12%' },
        { label: 'Active Pipeline', value: '18', icon: Zap, trend: '+5%' },
        { label: 'Pending Nodes', value: '07', icon: Clock, trend: '-2%' },
        { label: 'Target Capture', value: '₹12.4L', icon: Target, trend: '+18%' },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    const tabsData = [
        { id: 'all', label: 'All Clusters' },
        { id: 'Confirmed', label: 'Confirmed' },
        { id: 'Pending', label: 'In_Hold' },
        { id: 'Cancelled', label: 'Terminated' },
    ];

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'all' || booking.status === filter;
        const matchesSearch = booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.venueName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10 pb-24 px-4 sm:px-6 max-w-7xl mx-auto"
        >
            {/* Header: Operational Matrix */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-10 border-b border-[var(--ease2event-border-subtle)]">
                <motion.div variants={itemVariants}>
                    <h1 className="text-4xl font-black text-[var(--ease2event-text-primary)] tracking-tighter leading-none uppercase italic font-display">Operational Matrix</h1>
                    <div className="flex items-center gap-3 mt-4">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 text-blue-500 text-sm font-black uppercase rounded-full border border-blue-500/20">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            Registry Synchronization
                        </span>
                        <p className="text-[var(--ease2event-text-muted)] font-black text-[11px] uppercase tracking-[0.3em] leading-none opacity-60">Venue Throughput • Client Coordination</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex bg-[var(--ease2event-bg-elevated)] p-1.5 rounded-2xl border border-[var(--ease2event-border-subtle)] shadow-inner">
                    <button className="px-6 py-2.5 text-sm font-black uppercase tracking-widest bg-[var(--ease2event-bg-surface)] text-[var(--ease2event-brand-primary)] rounded-xl shadow-md border border-[var(--ease2event-border-base)] transition-all">Daily</button>
                    <button className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)] transition-all">Weekly</button>
                </motion.div>
            </div>

            {/* Smart Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="card-minimal p-7 flex flex-col justify-between group cursor-pointer hover:shadow-2xl transition-all duration-500 relative overflow-hidden bg-[var(--ease2event-bg-surface)] border-[var(--ease2event-border-base)]"
                    >
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="p-4 rounded-2xl bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-brand-primary)] group-hover:bg-[var(--ease2event-brand-primary)] group-hover:text-white transition-all duration-500 shadow-sm border border-[var(--ease2event-border-subtle)]">
                                <stat.icon size={22} className="group-hover:rotate-12 transition-all duration-500" />
                            </div>
                            <span className="text-sm font-black px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg">{stat.trend}</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[var(--ease2event-text-muted)] font-black text-sm uppercase tracking-[0.3em] mb-2 opacity-70 group-hover:opacity-100 transition-all italic">{stat.label}</p>
                            <h3 className="text-4xl font-black text-[var(--ease2event-text-primary)] tracking-tighter italic leading-none font-display">{stat.value}</h3>
                        </div>
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <stat.icon size={110} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters & Navigation */}
            <div className="flex flex-col xl:flex-row gap-8 justify-between items-start xl:items-center py-6">
                <motion.div variants={itemVariants} className="flex bg-[var(--ease2event-bg-elevated)] p-1.5 rounded-2xl border border-[var(--ease2event-border-subtle)] shadow-inner w-full xl:w-auto overflow-x-auto scrollbar-hide">
                    {tabsData.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as any)}
                            className={`flex-1 sm:flex-none px-8 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all duration-500 italic whitespace-nowrap ${filter === tab.id ? 'bg-[var(--ease2event-brand-primary)] text-white shadow-xl shadow-[var(--ease2event-brand-primary)]/20' : 'text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)]'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </motion.div>
                <motion.div variants={itemVariants} className="relative w-full xl:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--ease2event-text-muted)]" size={18} />
                    <input
                        placeholder="FILTER BY CLIENT / VENUE..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-2xl text-[11px] font-black italic outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)] uppercase tracking-widest"
                    />
                </motion.div>
            </div>

            {/* Registry Flow (The "Table" replacement) */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredBookings.map((booking, idx) => (
                        <motion.div
                            key={booking.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className="card-minimal !p-0 overflow-hidden hover:border-[var(--ease2event-brand-primary)]/40 transition-all duration-500 group bg-[var(--ease2event-bg-surface)] border-[var(--ease2event-border-base)] shadow-lg"
                        >
                            <div className="flex flex-col xl:flex-row xl:items-stretch">
                                {/* Left Side: Branding */}
                                <div className="xl:w-2/3 p-8 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-[var(--ease2event-border-subtle)]">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-2xl font-black text-[var(--ease2event-text-primary)] tracking-tighter italic font-display uppercase leading-tight group-hover:text-[var(--ease2event-brand-primary)] transition-colors">{booking.venueName}</h3>
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            </div>
                                            <p className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.2em] italic opacity-60">PROTOCOL: {booking.eventType}</p>
                                        </div>
                                        <Badge className={`italic font-black text-[9px] px-4 py-2 rounded-2xl uppercase tracking-[0.2em] border shadow-sm ${booking.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                booking.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                            }`}>
                                            {booking.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        <div className="space-y-1.5">
                                            <p className="text-[8px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest opacity-50">Operational Hub</p>
                                            <div className="flex items-center gap-2 text-xs font-black text-[var(--ease2event-text-secondary)] italic">
                                                <MapPin size={14} className="text-[var(--ease2event-brand-primary)]" />
                                                MAIN_LEVEL_HUB
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[8px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest opacity-50">Node Sync Date</p>
                                            <div className="flex items-center gap-2 text-xs font-black text-[var(--ease2event-text-secondary)] italic">
                                                <CalendarIcon size={14} className="text-[var(--ease2event-brand-primary)]" />
                                                {booking.date}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[8px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest opacity-50">Unit Capacity</p>
                                            <div className="flex items-center gap-2 text-xs font-black text-[var(--ease2event-text-secondary)] italic">
                                                <Users size={14} className="text-[var(--ease2event-brand-primary)]" />
                                                {booking.guests} NODES
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[8px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest opacity-50">Capture Value</p>
                                            <div className="flex items-center gap-2 text-xs font-black text-[var(--ease2event-text-primary)] italic">
                                                <DollarSign size={14} className="text-emerald-500" />
                                                {booking.amount}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Actions & Client */}
                                <div className="xl:w-1/3 bg-[var(--ease2event-bg-elevated)]/30 p-8 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest opacity-50 italic">Registry Authority</p>
                                            <h4 className="font-black text-sm text-[var(--ease2event-text-primary)] italic uppercase tracking-tight">{booking.clientName}</h4>
                                        </div>
                                        <button className="p-3 bg-[var(--ease2event-bg-surface)] rounded-2xl border border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-brand-primary)] transition-all">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button className="flex-1 h-12 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] text-[var(--ease2event-text-primary)] rounded-2xl text-[9px] font-black uppercase tracking-widest italic hover:bg-[var(--ease2event-bg-elevated)]">
                                            View Logs
                                        </Button>
                                        {booking.status === 'Pending' && (
                                            <Button className="flex-1 h-12 bg-[var(--ease2event-brand-primary)] text-white shadow-lg shadow-[var(--ease2event-brand-primary)]/20 rounded-2xl text-[9px] font-black uppercase tracking-widest italic hover:scale-105 transition-all">
                                                Confirm Sync
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredBookings.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-[var(--ease2event-bg-elevated)]/30 rounded-3xl border border-[var(--ease2event-border-subtle)] border-dashed"
                    >
                        <AlertCircle size={48} className="mx-auto text-[var(--ease2event-text-muted)] mb-6 opacity-40 animate-pulse" />
                        <h3 className="text-2xl font-black text-[var(--ease2event-text-primary)] italic uppercase font-display tracking-tight">Registry Node Empty</h3>
                        <p className="text-sm text-[var(--ease2event-text-muted)] font-black uppercase tracking-widest mt-3 opacity-60">Modify filters for new unit synchronization</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Bookings;
