import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Search, Filter, Eye, CheckCircle, XCircle, MoreVertical, FileText, Download } from 'lucide-react';

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
        { id: '1001', userName: 'Rahul Sharma', vendorName: 'Grand Hotel', eventDate: '2024-05-12', amount: '₹50,000', status: 'Confirmed' },
        { id: '1002', userName: 'Priya Kapoor', vendorName: 'Sunset Resort', eventDate: '2024-06-04', amount: '₹80,000', status: 'Pending' },
        { id: '1003', userName: 'Amit Mishra', vendorName: 'Flash Moments', eventDate: '2024-04-20', amount: '₹25,000', status: 'Completed' },
        { id: '1004', userName: 'Neha Verma', vendorName: 'Glow makeup Studio', eventDate: '2024-05-18', amount: '₹15,000', status: 'Cancelled' },
        { id: '1005', userName: 'Suresh Kumar', vendorName: 'Royal Palace Banquet', eventDate: '2024-07-02', amount: '₹1,50,000', status: 'Confirmed' },
    ];

    const stats = [
        { label: 'Total Bookings', value: '142', icon: Calendar, color: 'blue' },
        { label: 'Confirmed', value: '84', icon: CheckCircle, color: 'green' },
        { label: 'Pending Approval', value: '24', icon: Clock, color: 'yellow' },
        { label: 'Gross Volume', value: '₹12.4L', icon: DollarSign, color: 'purple' },
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
            case 'Confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Booking Operations</h1>
                    <p className="text-gray-500 dark:text-slate-400">Monitor and manage platform-wide booking activities</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <Download size={16} /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95">
                        <FileText size={16} /> Reports
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</h3>
                        </div>
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-950/30 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters bar */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-2 items-center justify-between">
                <div className="relative w-full md:w-96 pl-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search User, Vendor or Booking ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border-none rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex bg-gray-50 dark:bg-slate-950 p-1 rounded-xl">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${statusFilter === status
                                ? 'bg-white dark:bg-slate-800 text-red-500 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Booking ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">User Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Provider</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                            {filteredBookings.map((booking, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all group">
                                    <td className="px-6 py-4 font-black text-xs text-gray-900 dark:text-white uppercase tracking-tighter">#{booking.id}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-tight">{booking.userName}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-red-600 uppercase tracking-tight">{booking.vendorName}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400">{booking.eventDate}</td>
                                    <td className="px-6 py-4 text-sm font-black text-gray-900 dark:text-white">{booking.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 transition-colors">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Placeholder */}
                <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>Active transactions: {filteredBookings.length}</span>
                    <button className="text-red-500 hover:underline">VIEW FULL LOGS</button>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
