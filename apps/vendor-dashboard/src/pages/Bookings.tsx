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
            case 'Confirmed': return <CheckCircle size={14} />;
            case 'Pending': return <AlertCircle size={14} />;
            case 'Cancelled': return <XCircle size={14} />;
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
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--airion-text-primary)]">Bookings</h1>
                <p className="text-[var(--airion-text-muted)]">Manage and track all your venue bookings</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="card-premium">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-[rgba(108,99,255,0.08)] text-[var(--airion-brand-primary)]">
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <p className="text-[var(--airion-text-secondary)] text-sm mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-[var(--airion-text-primary)]">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <Tabs 
                    tabs={tabsData} 
                    activeTab={filter} 
                    onChange={(id) => setFilter(id as any)} 
                    variant="pills"
                />
                <div className="relative w-full sm:w-64">
                    <Input
                        leftIcon={<Search size={16} />}
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        inputSize="sm"
                    />
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
                {filteredBookings.map((booking) => (
                    <div key={booking.id} className="card-premium group">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-[var(--airion-text-primary)] mb-1">{booking.venueName}</h3>
                                        <p className="text-sm text-[var(--airion-text-muted)]">{booking.eventType}</p>
                                    </div>
                                    <Badge variant={booking.status.toLowerCase() as any}>
                                        <div className="flex items-center gap-1.5">
                                            {getStatusIcon(booking.status)}
                                            {booking.status}
                                        </div>
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div className="flex items-center gap-2 text-sm text-[var(--airion-text-secondary)]">
                                        <CalendarIcon size={16} className="text-[var(--airion-text-muted)]" />
                                        {booking.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[var(--airion-text-secondary)]">
                                        <Clock size={16} className="text-[var(--airion-text-muted)]" />
                                        {booking.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[var(--airion-text-secondary)]">
                                        <Users size={16} className="text-[var(--airion-text-muted)]" />
                                        {booking.guests} guests
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--airion-text-primary)]">
                                        <DollarSign size={16} className="text-[var(--airion-brand-primary)]" />
                                        {booking.amount}
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-[var(--airion-border-subtle)]">
                                    <p className="text-sm text-[var(--airion-text-muted)]">
                                        Client: <span className="font-semibold text-[var(--airion-text-primary)]">{booking.clientName}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex lg:flex-col gap-2">
                                <Button variant="secondary" size="sm" className="w-full">
                                    View Details
                                </Button>
                                {booking.status === 'Pending' && (
                                    <Button variant="primary" size="sm" className="w-full">
                                        Confirm
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 && (
                <div className="text-center py-16 bg-[var(--airion-bg-surface)] rounded-2xl border border-[var(--airion-border-subtle)] border-dashed">
                    <CalendarIcon size={48} className="mx-auto text-[var(--airion-text-muted)] mb-4 opacity-50" />
                    <h3 className="text-lg font-bold text-[var(--airion-text-primary)] mb-2">No bookings found</h3>
                    <p className="text-[var(--airion-text-muted)]">Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    );
};

export default Bookings;
