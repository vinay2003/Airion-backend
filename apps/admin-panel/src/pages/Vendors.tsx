import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Check, X, Eye } from 'lucide-react';
import api from '../lib/api';

interface Vendor {
    id: string;
    businessName: string;
    businessType: string;
    city: string;
    yearsInBusiness: string;
    isVerified: boolean;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

const Vendors: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await api.get('/vendors') as any;
                if (Array.isArray(data)) {
                    setVendors(data);
                } else if (data && Array.isArray(data.data)) {
                    setVendors(data.data);
                } else {
                    setVendors([]);
                }
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
            case 'approved':
                return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
            case 'rejected':
                return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
            default:
                return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400';
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            await api.patch(`/vendors/${id}/status`, { status: action === 'approve' ? 'approved' : 'rejected' });
            setVendors(prev => (prev || []).map(v => v.id === id ? { ...v, verificationStatus: action === 'approve' ? 'approved' : 'rejected' } : v));
        } catch (error: any) {
            alert('Action failed: ' + error.message);
        }
    };

    const filteredVendors = (vendors || []).filter((vendor: any) => {
        const matchesFilter = filter === 'all' || vendor.verificationStatus === filter;
        const businessName = vendor.businessName || '';
        const city = vendor.city || '';
        const matchesSearch = businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>;
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
                            placeholder="Search by name or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === status
                            ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                            : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Vendor</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">City</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Experience</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">
                                                {vendor.businessName?.[0] || 'V'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">{vendor.businessName}</div>
                                                <div className="text-xs text-gray-500">Joined: {new Date(vendor.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{vendor.businessType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{vendor.city || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{vendor.yearsInBusiness || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(vendor.verificationStatus)}`}>
                                            {vendor.verificationStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-slate-400 transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            {vendor.verificationStatus === 'pending' && (
                                                <>
                                                    <button onClick={() => handleAction(vendor.id, 'approve')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                                                        <Check size={16} />
                                                    </button>
                                                    <button onClick={() => handleAction(vendor.id, 'reject')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                                        <X size={16} />
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

export default Vendors;
