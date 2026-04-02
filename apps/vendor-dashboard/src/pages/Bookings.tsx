import React, { useState } from 'react';
import { Calendar as CalendarIcon, Search, Clock, MapPin, Users, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
            case 'Confirmed':
                return <CheckCircle size={16} className="text-green-500" />;
            case 'Pending':
                return <AlertCircle size={16} className="text-yellow-500" />;
            case 'Cancelled':
                return <XCircle size={16} className="text-red-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
            case 'Pending':
                return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
            case 'Cancelled':
                return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
            default:
                return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'all' || booking.status === filter;
        const matchesSearch = booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.venueName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
                <p className="text-gray-500 dark:text-slate-400">Manage and track all your venue bookings</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-500`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex gap-2">
                    {['all', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status as any)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === status
                                ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-400'
                                }`}
                        >
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 transition-all"
                    />
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
                {filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{booking.venueName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">{booking.eventType}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        {booking.status}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                        <CalendarIcon size={16} className="text-gray-400 dark:text-slate-500" />
                                        {booking.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                        <Clock size={16} className="text-gray-400 dark:text-slate-500" />
                                        {booking.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                        <Users size={16} className="text-gray-400 dark:text-slate-500" />
                                        {booking.guests} guests
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                                        <DollarSign size={16} className="text-red-500" />
                                        {booking.amount}
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                                    <p className="text-sm text-gray-600 dark:text-slate-400">
                                        Client: <span className="font-medium text-gray-900 dark:text-white">{booking.clientName}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex lg:flex-col gap-2">
                                <button className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors">
                                    View Details
                                </button>
                                {booking.status === 'Pending' && (
                                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-red-500/20">
                                        Confirm
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                    <CalendarIcon size={48} className="mx-auto text-gray-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookings found</h3>
                    <p className="text-gray-500 dark:text-slate-400">Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    );
};

export default Bookings;
