import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Check, X, Eye } from 'lucide-react';
import api from '../lib/api';

interface Vendor {
    id: number;
    name: string;
    type: string;
    location: string;
    status: 'Active' | 'Pending' | 'Suspended';
    rating: number;
}

const Vendors: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'Active' | 'Pending' | 'Suspended'>('all');
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await api.get('/vendors');
                setVendors(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
            case 'Pending':
                return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
            case 'Suspended':
                return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
            default:
                return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400';
        }
    };

    const filteredVendors = vendors.filter(vendor => filter === 'all' || vendor.status === filter);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendor Management</h1>
                    <p className="text-gray-500 dark:text-slate-400">Manage and approve vendor registrations</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {['all', 'Active', 'Pending', 'Suspended'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === status
                            ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                            : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-400'
                            }`}
                    >
                        {status === 'all' ? 'All Vendors' : status}
                    </button>
                ))}
            </div>

            {/* Vendors Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">
                                                {vendor.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">{vendor.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-slate-400">ID: #{vendor.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900 dark:text-slate-200">{vendor.type}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900 dark:text-slate-200">{vendor.location}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {vendor.rating > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">★</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{vendor.rating}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 dark:text-slate-500">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(vendor.status)}`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-slate-400 transition-colors" title="View Details">
                                                <Eye size={16} />
                                            </button>
                                            {vendor.status === 'Pending' && (
                                                <>
                                                    <button className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors" title="Approve">
                                                        <Check size={16} />
                                                    </button>
                                                    <button className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors" title="Reject">
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-slate-500 transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
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

export default Vendors;
