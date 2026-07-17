import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Search, Filter, Eye, CheckCircle, XCircle, RefreshCcw, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
    id: string;
    userName: string;
    vendorName: string;
    eventDate: string;
    city: string;
    category: string;
    amount: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Refunded';
}

const Bookings: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [cityFilter, setCityFilter] = useState('All');
    
    // Mock Bookings Data with v2.0 fields
    const [bookingsData, setBookingsData] = useState<Booking[]>([
        { id: '1001', userName: 'Rahul Sharma', vendorName: 'Grand Hotel', category: 'Venue', city: 'Mumbai', eventDate: '2026-05-12', amount: '₹50,000', status: 'Confirmed' },
        { id: '1002', userName: 'Priya Kapoor', vendorName: 'Sunset Resort', category: 'Venue', city: 'Delhi', eventDate: '2026-06-04', amount: '₹80,000', status: 'Pending' },
        { id: '1003', userName: 'Amit Mishra', vendorName: 'Flash Moments', category: 'Photography', city: 'Bangalore', eventDate: '2026-04-20', amount: '₹25,000', status: 'Completed' },
        { id: '1004', userName: 'Neha Verma', vendorName: 'Glow makeup Studio', category: 'Makeup Artist', city: 'Mumbai', eventDate: '2026-05-18', amount: '₹15,000', status: 'Cancelled' },
        { id: '1005', userName: 'Suresh Kumar', vendorName: 'Royal Palace Banquet', category: 'Venue', city: 'Delhi', eventDate: '2026-07-02', amount: '₹1,50,000', status: 'Confirmed' },
    ]);

    const stats = [
        { label: 'Total Bookings', value: '142', icon: Calendar, color: 'blue' },
        { label: 'Confirmed', value: '84', icon: CheckCircle, color: 'emerald' },
        { label: 'Pending Approval', value: '24', icon: Clock, color: 'amber' },
        { label: 'Revenue Generated', value: '₹12.4L', icon: DollarSign, color: 'indigo' },
    ];

    const filteredBookings = bookingsData.filter(b => {
        const matchesSearch = b.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              b.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              b.id.includes(searchTerm);
        const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
        const matchesCity = cityFilter === 'All' || b.city === cityFilter;
        return matchesSearch && matchesStatus && matchesCity;
    });

    const getStatusStyles = (status: Booking['status']) => {
        switch (status) {
            case 'Confirmed': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-500/20';
            case 'Pending': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-500/20';
            case 'Completed': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-500/20';
            case 'Cancelled': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-200 dark:border-rose-500/20';
            case 'Refunded': return 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 border border-purple-200 dark:border-purple-500/20';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const updateStatus = (id: string, newStatus: Booking['status']) => {
        setBookingsData(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        toast.success(`Booking #${id} status updated to ${newStatus}`);
    };

    return (
        <div className="fade-in pb-12">
            <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)] mb-8">Booking Management</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
                        </div>
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search User, Vendor or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-300">
                        <Filter size={16} />
                        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="bg-transparent outline-none cursor-pointer font-bold">
                            <option value="All">All Cities</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-300">
                        <Filter size={16} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent outline-none cursor-pointer font-bold">
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Refunded">Refunded</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Event Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-black text-gray-900 dark:text-white">#{booking.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1 group cursor-pointer">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{booking.userName}</span>
                                            <ExternalLink size={12} className="text-gray-400 group-hover:text-indigo-600" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1 group cursor-pointer">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{booking.vendorName}</span>
                                            <ExternalLink size={12} className="text-gray-400 group-hover:text-indigo-600" />
                                        </div>
                                        <span className="text-xs text-gray-500">{booking.category}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.eventDate}</div>
                                        <div className="text-xs text-gray-500">{booking.city}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{booking.amount}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 rounded-lg text-gray-500" title="View Details">
                                                <Eye size={16} />
                                            </button>
                                            
                                            {booking.status === 'Pending' && (
                                                <button onClick={() => updateStatus(booking.id, 'Confirmed')} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg" title="Confirm Booking">
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            
                                            {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                                                <button onClick={() => updateStatus(booking.id, 'Cancelled')} className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg" title="Cancel Booking">
                                                    <XCircle size={16} />
                                                </button>
                                            )}

                                            {booking.status === 'Cancelled' && (
                                                <button onClick={() => updateStatus(booking.id, 'Refunded')} className="p-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg" title="Process Refund">
                                                    <RefreshCcw size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredBookings.length === 0 && (
                    <div className="p-12 text-center text-gray-500">No bookings match your filters.</div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
