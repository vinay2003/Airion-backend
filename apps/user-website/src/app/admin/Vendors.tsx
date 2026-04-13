import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Check, X, Eye, Filter, CheckCircle, XCircle, Clock, MapPin, IndianRupee, Layers, ExternalLink } from 'lucide-react';
import api from '../../lib/api';

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
                const response: any = await api.get('/vendors');
                setVendors(response.data || []);
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
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'rejected':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            // await api.patch(`/vendors/${id}/status`, { status: action === 'approve' ? 'approved' : 'rejected' });
            setVendors(prev => prev.map(v => v.id === id ? { ...v, verificationStatus: action === 'approve' ? 'approved' : 'rejected' } : v));
        } catch (error: any) {
            alert('Action failed: ' + error.message);
        }
    };

    const filteredVendors = vendors.filter(vendor => {
        const matchesFilter = filter === 'all' || vendor.verificationStatus === filter;
        const matchesSearch = (vendor.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (vendor.city || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Vendor Onboarding</h1>
                    <p className="text-gray-500 dark:text-slate-400">Total vendors: <span className="font-bold text-gray-900 dark:text-white">{vendors.length}</span></p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2 p-1 bg-gray-50 dark:bg-slate-900/50 rounded-2xl w-fit border border-gray-100 dark:border-slate-800">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === status
                            ? 'bg-white dark:bg-slate-800 text-red-500 shadow-lg shadow-black/5'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Business Info</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Category</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Location</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Experience</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold shadow-md">
                                                    {vendor.businessName?.[0] || 'V'}
                                                </div>
                                                {vendor.isVerified && (
                                                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                                                        <Check size={10} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm flex items-center gap-2">
                                                    {vendor.businessName}
                                                    {vendor.verificationStatus === 'pending' && <Clock size={12} className="text-yellow-500 animate-pulse" />}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Joined: {new Date(vendor.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-tight">
                                            <Layers size={14} className="text-red-500" />
                                            {vendor.businessType}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-tight">
                                            <MapPin size={14} className="text-red-500" />
                                            {vendor.city || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-gray-600 dark:text-slate-300">
                                        {vendor.yearsInBusiness || 'N/A'} YEARS
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${getStatusColor(vendor.verificationStatus)}`}>
                                            {vendor.verificationStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 transition-colors" title="View Portfolio">
                                                <ExternalLink size={18} />
                                            </button>
                                            {vendor.verificationStatus === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleAction(vendor.id, 'approve')} 
                                                        className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors"
                                                        title="Approve Vendor"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(vendor.id, 'reject')} 
                                                        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                                                        title="Reject Vendor"
                                                    >
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
            
            {filteredVendors.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Search size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">No vendors found</h3>
                    <p className="text-gray-500 dark:text-slate-400">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    );
};

export default Vendors;
