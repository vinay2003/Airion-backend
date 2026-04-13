import React, { useState } from 'react';
import { Calendar as CalendarIcon, Search, Clock, MapPin, Users, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Tabs, Input, Button, Badge } from '@airion/ui';

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

const Bookings: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'Confirmed' | 'Pending' | 'Cancelled'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const bookings: Booking[] = [
        {
            id: 1,
            venueName: 'Grand Ballroom',
            clientName: 'Rahul Kumar',
            date: 'Dec 12, 2024',
            time: '6:00 PM - 11:00 PM',
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
            time: '4:00 PM - 10:00 PM',
            guests: 200,
            amount: '₹1,50,000',
            status: 'Pending',
            eventType: 'Birthday Party'
        },
        {
            id: 3,
            venueName: 'Royal Palace Hall',
            clientName: 'Amit Shah',
            date: 'Dec 18, 2024',
            time: '7:00 PM - 12:00 AM',
            guests: 500,
            amount: '₹3,50,000',
            status: 'Confirmed',
            eventType: 'Corporate Event'
        },
        {
            id: 4,
            venueName: 'Grand Ballroom',
            clientName: 'Sneha Gupta',
            date: 'Dec 10, 2024',
            time: '5:00 PM - 10:00 PM',
            guests: 150,
            amount: '₹1,80,000',
            status: 'Cancelled',
            eventType: 'Anniversary'
        },
    ];

    const stats = [
        { label: 'Total Bookings', value: '28', icon: CalendarIcon, color: 'blue' },
        { label: 'Confirmed', value: '18', icon: CheckCircle, color: 'green' },
        { label: 'Pending', value: '7', icon: AlertCircle, color: 'yellow' },
        { label: 'Revenue', value: '₹12.4L', icon: DollarSign, color: 'red' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Confirmed': return <CheckCircle size={16} />;
            case 'Pending': return <AlertCircle size={16} />;
            case 'Cancelled': return <XCircle size={16} />;
        }
    };

    const tabsData = [
        { id: 'all', label: 'All' },
        { id: 'Confirmed', label: 'Confirmed' },
        { id: 'Pending', label: 'Pending' },
        { id: 'Cancelled', label: 'Cancelled' },
    ];

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'all' || booking.status === filter;
        const matchesSearch = booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.venueName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-10 sm:space-y-12 animate-in fade-in duration-500 pb-20">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-[var(--airion-text-primary)] tracking-tight leading-tight">Bookings Management</h1>
                <p className="text-lg font-semibold text-[var(--airion-text-muted)]">Enterprise-grade tracking for all your venue operations</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="card-premium p-8 rounded-[2rem] shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 rounded-2xl bg-[var(--airion-brand-primary)]/10 text-[var(--airion-brand-primary)] shadow-sm">
                                <stat.icon size={32} />
                            </div>
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-3">{stat.label}</p>
                        <h3 className="text-4xl font-bold text-[var(--airion-text-primary)] tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col xl:flex-row gap-8 justify-between items-start xl:items-center bg-[var(--airion-bg-surface)] p-6 rounded-[2rem] border border-[var(--airion-border-subtle)] shadow-inner transition-all hover:shadow-xl hover:scale-[1.01] duration-300">
                <Tabs
                    tabs={tabsData}
                    activeTab={filter}
                    onChange={(id) => setFilter(id as any)}
                    variant="pills"
                    className="w-full xl:w-auto overflow-x-auto scrolbar-hide"
                />
                <div className="relative w-full xl:w-96 group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--airion-brand-primary)] transition-colors">
                        <Search size={24} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search bookings by client or venue..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-16 pl-16 pr-6 bg-[var(--airion-bg-elevated)]/50 border border-[var(--airion-border-subtle)] rounded-2xl text-base font-bold outline-none focus:ring-4 focus:ring-[var(--airion-brand-primary)]/10 transition-all text-[var(--airion-text-primary)] placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-6">
                {filteredBookings.map((booking) => (
                    <div key={booking.id} className="card-premium p-8 rounded-[2.5rem] group hover:border-[var(--airion-brand-primary)]/30 shadow-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-[var(--airion-text-primary)] tracking-tight leading-none">{booking.venueName}</h3>
                                        <p className="text-sm font-semibold text-[var(--airion-text-muted)] uppercase tracking-wide opacity-80">{booking.eventType}</p>
                                    </div>
                                    <Badge
                                        className="h-9 px-5 rounded-full text-xs font-bold uppercase tracking-widest"
                                        variant={booking.status.toLowerCase() as any}
                                    >
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(booking.status)}
                                            {booking.status}
                                        </div>
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                    <div className="flex items-center gap-3 text-md font-semibold text-[var(--airion-text-secondary)]">
                                        <CalendarIcon size={20} className="text-[var(--airion-brand-primary)]" />
                                        {booking.date}
                                    </div>
                                    <div className="flex items-center gap-3 text-md font-semibold text-[var(--airion-text-secondary)]">
                                        <Clock size={20} className="text-[var(--airion-brand-primary)]" />
                                        {booking.time}
                                    </div>
                                    <div className="flex items-center gap-3 text-md font-semibold text-[var(--airion-text-secondary)]">
                                        <Users size={20} className="text-[var(--airion-brand-primary)]" />
                                        {booking.guests} Guests
                                    </div>
                                    <div className="flex items-center gap-3 text-lg font-bold text-[var(--airion-text-primary)]">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <DollarSign size={16} />
                                        </div>
                                        {booking.amount}
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-[var(--airion-border-subtle)] flex items-center justify-between">
                                    <p className="text-md text-[var(--airion-text-muted)] font-semibold">
                                        Client: <span className="font-bold text-[var(--airion-text-primary)] ml-1">{booking.clientName}</span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Active File</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex lg:flex-col gap-3 min-w-[180px]">
                                <Button variant="secondary" size="lg" className="w-full h-15 rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-md hover:scale-[1.01] transition-all italic">
                                    Review Details
                                </Button>
                                {booking.status === 'Pending' && (
                                    <Button variant="primary" size="lg" className="w-full h-15 rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.01] transition-all italic">
                                        Execute Approval
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 && (
                <div className="text-center py-24 bg-[var(--airion-bg-surface)] rounded-[3rem] border-2 border-[var(--airion-border-subtle)] border-dashed shadow-inner">
                    <CalendarIcon size={64} className="mx-auto text-[var(--airion-text-muted)] mb-6 opacity-30" />
                    <h3 className="text-2xl font-bold text-[var(--airion-text-primary)] mb-3">No bookings found</h3>
                    <p className="text-lg text-[var(--airion-text-muted)] font-semibold">Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    );
};

export default Bookings;
