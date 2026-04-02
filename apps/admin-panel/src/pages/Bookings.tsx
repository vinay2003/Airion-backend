import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
    id: string;
    userName: string;
    vendorName: string;
    eventDate: string;
    amount: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

const Bookings: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Mock Bookings Data
    const bookingsData: Booking[] = [
        { id: '1001', userName: 'Rahul Sharma', vendorName: 'Grand Hotel', eventDate: '2026-05-12', amount: '₹50,000', status: 'Confirmed' },
        { id: '1002', userName: 'Priya Kapoor', vendorName: 'Sunset Resort', eventDate: '2026-06-04', amount: '₹80,000', status: 'Pending' },
        { id: '1003', userName: 'Amit Mishra', vendorName: 'Flash Moments', eventDate: '2026-04-20', amount: '₹25,000', status: 'Completed' },
        { id: '1004', userName: 'Neha Verma', vendorName: 'Glow makeup Studio', eventDate: '2026-05-18', amount: '₹15,000', status: 'Cancelled' },
        { id: '1005', userName: 'Suresh Kumar', vendorName: 'Royal Palace Banket', eventDate: '2026-07-02', amount: '₹1,50,000', status: 'Confirmed' },
    ];

    const stats = [
        { label: 'Total Bookings', value: '142', icon: Calendar, color: 'blue' },
        { label: 'Confirmed', value: '84', icon: CheckCircle, color: 'green' },
        { label: 'Pending Approval', value: '24', icon: Clock, color: 'yellow' },
        { label: 'Revenue Generated', value: '₹12.4L', icon: DollarSign, color: 'purple' },
    ];

    const filteredBookings = bookingsData.filter(b => {
        const matchesSearch = b.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             b.id.includes(searchTerm);
        const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status: Booking['status']) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400';
            case 'Pending': return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
            case 'Completed': return 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400';
            case 'Cancelled': return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Booking Management</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                        </div>
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
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
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-300">
                        <Filter size={16} />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Booking ID</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Vendor</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Event Date</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredBookings.map((booking, i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">#{booking.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-slate-300 font-medium">{booking.userName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-slate-300 font-medium">{booking.vendorName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{booking.eventDate}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{booking.amount}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" title="View Details">
                                                <Eye size={18} />
                                            </button>
                                            {booking.status === 'Pending' && (
                                                <>
                                                    <button className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg text-gray-400 hover:text-green-600 transition-colors" title="Approve">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="Cancel">
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
