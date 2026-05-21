import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Check, X, Eye, Building2, MapPin, Calendar, ShieldCheck, Zap } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

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

/**
 * 🏛️ Vendor Registry: Strategic Partnership Hub
 * Orchestrates the onboarding and verification of marketplace service providers.
 * Implements "Bento Box" grid aesthetics and high-visibility status monitoring.
 */
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
                toast.error('Vendor registry sync failed: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'pending':
                return 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
            case 'rejected':
                return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        const targetStatus = action === 'approve' ? 'approved' : 'rejected';
        try {
            await api.patch(`/vendors/${id}/status`, { status: targetStatus });
            setVendors(prev => (prev || []).map(v => v.id === id ? { ...v, verificationStatus: targetStatus } : v));
            toast.success(`Vendor ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        } catch (error: any) {
            toast.error('Action failed: ' + error.message);
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
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-red-500/10 border-t-red-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="text-red-600/40" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Vendors</h1>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-1">{vendors.length} vendors registered</p>
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-80 pl-12 pr-6 h-14 border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex bg-neutral-100 dark:bg-slate-900/50 p-1.5 rounded-[24px] w-fit border border-neutral-100 dark:border-slate-800">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-6 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${filter === status
                            ? 'bg-white dark:bg-slate-800 text-red-600 shadow-xl border border-neutral-100 dark:border-slate-700'
                            : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-50 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                <th className="px-10 py-6 text-left text-xs font-semibold text-gray-400 dark:text-slate-500">Business</th>
                                <th className="px-10 py-6 text-left text-xs font-semibold text-gray-400 dark:text-slate-500">Details</th>
                                <th className="px-10 py-6 text-left text-xs font-semibold text-gray-400 dark:text-slate-500">Status</th>
                                <th className="px-10 py-6 text-right text-xs font-semibold text-gray-400 dark:text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-neutral-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-10 py-8 whitespace-nowrap">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-500/20 uppercase italic">
                                                {vendor.businessName?.[0] || 'V'}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="font-bold text-gray-900 dark:text-white tracking-tight">{vendor.businessName}</div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-slate-400">
                                                    <Building2 size={12} />
                                                    {vendor.businessType}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 whitespace-nowrap">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-slate-300">
                                                <MapPin size={14} className="text-gray-400 dark:text-slate-500" />
                                                {vendor.city || 'Unknown'}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-slate-400">
                                                <Calendar size={12} />
                                                {vendor.yearsInBusiness || 0} yrs experience
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 whitespace-nowrap">
                                        <span className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border ${getStatusStyles(vendor.verificationStatus)}`}>
                                            {vendor.verificationStatus}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                            <button className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-slate-800 hover:bg-[var(--ease2event-brand-primary)] hover:text-white rounded-xl text-gray-500 transition-all shadow-sm">
                                                <Eye size={18} />
                                            </button>
                                            {vendor.verificationStatus === 'pending' && (
                                                <>
                                                    <button onClick={() => handleAction(vendor.id, 'approve')} className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-500/10">
                                                        <Check size={18} />
                                                    </button>
                                                    <button onClick={() => handleAction(vendor.id, 'reject')} className="w-12 h-12 flex items-center justify-center bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm border border-rose-500/10">
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredVendors.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                            <div className="p-10 bg-neutral-50 dark:bg-slate-900 rounded-[50px] border border-neutral-100 dark:border-slate-800">
                                <Zap size={64} className="text-gray-300 dark:text-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No vendors found</h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Try adjusting your search or filters</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Vendors;

