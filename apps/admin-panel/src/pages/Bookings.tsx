import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Search, Filter, Eye, CheckCircle, XCircle, RefreshCcw, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminBookings, useUpdateBookingStatus } from '../hooks/useBookings';
import { useAdminLocations } from '../hooks/useCategories';

interface Booking {
    id: string;
    bookingCode: string;
    userName: string;
    vendorName: string;
    eventDate: string;
    city: string;
    category: string;
    amount: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Refunded' | string;
}

const Bookings: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [cityFilter, setCityFilter] = useState('All');
    
    const [page, setPage] = useState(1);
    const { data: bookingsResponse, isLoading } = useAdminBookings(page, 50);
    const updateStatusMutation = useUpdateBookingStatus();
    
    const bookingsData: Booking[] = bookingsResponse?.data || [];
    const totalBookings = bookingsResponse?.total || 0;

    const { data: locations = [] } = useAdminLocations();
    const locationCities = (locations || []).map((l: any) => l.city).filter(Boolean);
    const bookingCities = bookingsData.map(b => b.city).filter(Boolean);
    const uniqueCities = Array.from(new Set([...locationCities, ...bookingCities])).sort();

    const stats = [
        { label: 'Total Bookings', value: totalBookings.toString(), icon: Calendar, color: 'blue' },
        { label: 'Confirmed', value: bookingsData.filter(b => b.status === 'Confirmed').length.toString(), icon: CheckCircle, color: 'emerald' },
        { label: 'Pending Approval', value: bookingsData.filter(b => b.status === 'Pending').length.toString(), icon: Clock, color: 'amber' },
        { label: 'Revenue Generated', value: '₹12.4L', icon: DollarSign, color: 'indigo' }, // Keep static until full transactions tracking is active
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

    const updateStatus = async (id: string, newStatus: Booking['status']) => {
        await updateStatusMutation.mutateAsync({ id, status: newStatus });
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
                        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="bg-transparent outline-none cursor-pointer font-bold text-gray-900 dark:text-white">
                            <option value="All" className="text-gray-900 dark:text-white dark:bg-slate-900">All Cities</option>
                            {uniqueCities.map(city => (
                                <option key={city} value={city} className="text-gray-900 dark:text-white dark:bg-slate-900">{city}</option>
                            ))}
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
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 group cursor-pointer">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{booking.userName}</span>
                                            <ExternalLink size={12} className="text-gray-400 group-hover:text-indigo-600" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 group cursor-pointer">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{booking.vendorName}</span>
                                            <ExternalLink size={12} className="text-gray-400 group-hover:text-indigo-600" />
                                        </div>
                                        <span className="text-xs text-gray-500">{booking.category}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">#{booking.bookingCode || booking.id.substring(0, 8).toUpperCase()}</div>
                                        <div className="text-xs text-gray-500">{booking.eventDate}</div>
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
