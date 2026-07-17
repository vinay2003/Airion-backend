import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Check, X, Eye, Building2, MapPin, Calendar, ShieldCheck, Zap, Star, AlertTriangle, ArrowUpDown } from 'lucide-react';
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
    plan: string;
    earnings: number;
    bookings: number;
    isFeatured: boolean;
}

const Vendors: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: 'earnings' | 'bookings' | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'desc' });

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                // Mocking data for v2.0 UI
                const mockVendors: Vendor[] = [
                    { id: '1', businessName: 'Glow Makeup Studio', businessType: 'Makeup Artist', city: 'Mumbai', yearsInBusiness: '5', isVerified: true, verificationStatus: 'approved', createdAt: '2023-01-01', plan: 'Premium', earnings: 150000, bookings: 45, isFeatured: true },
                    { id: '2', businessName: 'Royal Palace Banquet', businessType: 'Venue', city: 'Delhi', yearsInBusiness: '12', isVerified: false, verificationStatus: 'pending', createdAt: '2023-06-15', plan: 'Basic', earnings: 0, bookings: 0, isFeatured: false },
                    { id: '3', businessName: 'Flash Moments', businessType: 'Photography', city: 'Bangalore', yearsInBusiness: '3', isVerified: true, verificationStatus: 'approved', createdAt: '2022-11-20', plan: 'Pro', earnings: 85000, bookings: 22, isFeatured: false },
                    { id: '4', businessName: 'Elite Decorators', businessType: 'Decor', city: 'Mumbai', yearsInBusiness: '8', isVerified: false, verificationStatus: 'rejected', createdAt: '2023-08-01', plan: 'Basic', earnings: 0, bookings: 0, isFeatured: false },
                ];
                setTimeout(() => {
                    setVendors(mockVendors);
                    setLoading(false);
                }, 800);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    const handleSort = (key: 'earnings' | 'bookings') => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const handleAction = async (id: string, action: 'approve' | 'reject' | 'feature' | 'flag' | 'kyc') => {
        setVendors(prev => prev.map(v => {
            if (v.id === id) {
                if (action === 'approve') return { ...v, verificationStatus: 'approved', isVerified: true };
                if (action === 'reject') return { ...v, verificationStatus: 'rejected', isVerified: false };
                if (action === 'feature') return { ...v, isFeatured: !v.isFeatured };
                if (action === 'kyc') return { ...v, isVerified: true };
            }
            return v;
        }));
        
        if (action === 'flag') {
            toast.success('Vendor flagged for inappropriate content');
        } else if (action === 'feature') {
            toast.success('Featured status updated');
        } else if (action === 'kyc') {
            toast.success('Instant KYC verification successful');
        } else {
            toast.success(`Vendor ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        }
    };

    let filteredVendors = vendors.filter((vendor) => {
        const matchesFilter = filter === 'all' || vendor.verificationStatus === filter;
        const query = searchQuery.toLowerCase();
        const matchesSearch = vendor.businessName.toLowerCase().includes(query) || vendor.city.toLowerCase().includes(query) || vendor.businessType.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
    });

    if (sortConfig.key) {
        filteredVendors.sort((a, b) => {
            const aVal = a[sortConfig.key as 'earnings' | 'bookings'];
            const bVal = b[sortConfig.key as 'earnings' | 'bookings'];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">Vendor Management</h1>
                    <p className="text-sm font-medium text-[var(--ease2event-text-secondary)] mt-1">{vendors.length} vendors registered</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-colors ${
                            filter === status
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:bg-gray-50'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Business</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-indigo-600" onClick={() => handleSort('earnings')}>
                                    <div className="flex items-center gap-1">Earnings <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-indigo-600" onClick={() => handleSort('bookings')}>
                                    <div className="flex items-center gap-1">Bookings <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                                                {vendor.businessName[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                    {vendor.businessName}
                                                    {vendor.isFeatured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Building2 size={12} /> {vendor.businessType}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                            <MapPin size={14} className="text-gray-400" /> {vendor.city}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Plan: <span className="font-bold text-indigo-600">{vendor.plan}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-emerald-600">₹{vendor.earnings.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-gray-900 dark:text-white">{vendor.bookings}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-2">
                                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusStyles(vendor.verificationStatus)}`}>
                                                {vendor.verificationStatus}
                                            </span>
                                            {vendor.isVerified ? (
                                                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><ShieldCheck size={12} /> KYC Verified</span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-amber-600">KYC Pending</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 rounded-lg text-gray-500" title="View Logs">
                                                <Eye size={16} />
                                            </button>
                                            {!vendor.isVerified && (
                                                <button onClick={() => handleAction(vendor.id, 'kyc')} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg" title="Instant KYC Verify">
                                                    <ShieldCheck size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => handleAction(vendor.id, 'feature')} className={`p-1.5 rounded-lg ${vendor.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`} title="Feature Vendor">
                                                <Star size={16} />
                                            </button>
                                            <button onClick={() => handleAction(vendor.id, 'flag')} className="p-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg" title="Flag Content">
                                                <AlertTriangle size={16} />
                                            </button>
                                            {vendor.verificationStatus === 'pending' && (
                                                <>
                                                    <button onClick={() => handleAction(vendor.id, 'approve')} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg" title="Approve">
                                                        <Check size={16} />
                                                    </button>
                                                    <button onClick={() => handleAction(vendor.id, 'reject')} className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg" title="Reject">
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
                {filteredVendors.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No vendors found</h3>
                        <p className="text-sm text-gray-500 mt-1">Adjust filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vendors;
