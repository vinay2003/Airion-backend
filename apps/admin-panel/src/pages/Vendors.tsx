import React, { useState } from 'react';
import {
    Search, Check, X, Eye, Building2, MapPin, Calendar, ShieldCheck,
    Star, ArrowUpDown, Phone, Mail, Globe, Instagram, Facebook,
    Clock, Package, ChevronRight
} from 'lucide-react';
import { useAdminVendors, useVerifyVendor, useSuspendVendor } from '../hooks/useVendors';
import toast from 'react-hot-toast';

interface Vendor {
    id: string;
    businessName: string;
    category?: { name: string };
    city: string;
    yearsInBusiness: string;
    isVerified: boolean;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    pricingTier: string;
    totalReviews: number;
    rating: number;
    email?: string;
    phone?: string;
    description?: string;
    portfolioImages?: string[];
    services?: { name: string; startingPrice: number }[];
}

/* ─────────────── Vendor Detail Drawer ─────────────── */
const VendorDetailDrawer: React.FC<{ vendor: Vendor; onClose: () => void; onAction: (id: string, action: 'approve' | 'reject' | 'kyc') => void }> = ({ vendor, onClose, onAction }) => (
    <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                    {vendor.portfolioImages?.[0] && (
                        <img src={vendor.portfolioImages[0]} alt="" className="w-full h-full object-cover opacity-60" />
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/50"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 -mt-6 flex items-end justify-between gap-4">
                    <div className="flex items-end gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-2xl font-black text-indigo-600">
                            {vendor.businessName[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{vendor.businessName}</h2>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Building2 size={12} /> {vendor.category?.name || 'Uncategorized'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        {vendor.isVerified
                            ? <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>
                            : <span className="px-3 py-1 bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold">Unverified</span>
                        }
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Rating', value: `${vendor.rating || '—'} ★`, color: 'text-amber-600' },
                        { label: 'Reviews', value: vendor.totalReviews || 0, color: 'text-indigo-600' },
                        { label: 'Tier', value: vendor.pricingTier || 'Standard', color: 'text-gray-700 dark:text-slate-300' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-gray-100 dark:border-slate-800">
                            <p className={`text-xl font-black ${color}`}>{value}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Info */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Information</h3>
                    <div className="space-y-2">
                        {[
                            { icon: MapPin, label: vendor.city || 'Location not provided' },
                            { icon: Phone, label: vendor.phone || 'Phone not provided' },
                            { icon: Mail, label: vendor.email || 'Email not provided' },
                        ].map(({ icon: Icon, label }, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-300">
                                <Icon size={15} className="text-indigo-400 shrink-0" />
                                <span className="font-medium">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                {vendor.description && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About</h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{vendor.description}</p>
                    </div>
                )}

                {/* Business Details */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Verification Status', value: vendor.verificationStatus, color: vendor.verificationStatus === 'approved' ? 'text-emerald-600' : vendor.verificationStatus === 'pending' ? 'text-amber-600' : 'text-rose-600' },
                            { label: 'Years in Business', value: vendor.yearsInBusiness ? `${vendor.yearsInBusiness} yrs` : 'N/A', color: 'text-gray-900 dark:text-white' },
                            { label: 'Registered', value: vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A', color: 'text-gray-900 dark:text-white' },
                            { label: 'KYC Status', value: vendor.isVerified ? 'Verified' : 'Pending', color: vendor.isVerified ? 'text-emerald-600' : 'text-amber-600' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                                <p className={`font-bold text-sm capitalize ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Services */}
                {vendor.services && vendor.services.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Services</h3>
                        <div className="space-y-2">
                            {vendor.services.map((svc, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800 last:border-0">
                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{svc.name}</span>
                                    <span className="text-sm font-bold text-indigo-600">₹{svc.startingPrice?.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-slate-800 space-y-3">
                {!vendor.isVerified && vendor.verificationStatus !== 'rejected' && (
                    <button
                        onClick={() => { onAction(vendor.id, 'kyc'); onClose(); }}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <ShieldCheck size={16} /> Verify KYC & Approve
                    </button>
                )}
                {vendor.verificationStatus === 'pending' && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => { onAction(vendor.id, 'approve'); onClose(); }}
                            className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <Check size={16} /> Approve
                        </button>
                        <button
                            onClick={() => { onAction(vendor.id, 'reject'); onClose(); }}
                            className="py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <X size={16} /> Reject
                        </button>
                    </div>
                )}
                <button onClick={onClose} className="w-full py-3 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-bold text-sm">
                    Close
                </button>
            </div>
        </div>
    </div>
);

/* ─────────────── Main Vendors Page ─────────────── */
const Vendors: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: '', direction: 'asc' });
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    const { data: response, isLoading: loading } = useAdminVendors(page, 20, searchQuery, filter, 'all');
    const vendors: Vendor[] = response?.data || [];

    const verifyMutation = useVerifyVendor();
    const suspendMutation = useSuspendVendor();

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
            default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
        }
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
        setSortConfig({ key, direction });
    };

    const handleAction = async (id: string, action: 'approve' | 'reject' | 'kyc') => {
        try {
            let rejectionReason: string | undefined;
            if (action === 'reject') {
                const reason = window.prompt('Please provide a reason for rejecting this vendor:');
                if (reason === null) return; // User cancelled
                if (!reason.trim()) {
                    toast.error('Rejection reason is required');
                    return;
                }
                rejectionReason = reason.trim();
            }

            await verifyMutation.mutateAsync({ 
                vendorId: id, 
                status: action === 'approve' || action === 'kyc' ? 'approved' : 'rejected',
                rejectionReason
            });
            toast.success(action === 'approve' ? 'Vendor approved' : action === 'reject' ? 'Vendor rejected' : 'KYC verified');
        } catch (err) {
            toast.error('Action failed. Please try again.');
        }
    };

    let sortedVendors = [...vendors];
    if (sortConfig.key) {
        sortedVendors.sort((a, b) => {
            const aVal = (a as any)[sortConfig.key] || 0;
            const bVal = (b as any)[sortConfig.key] || 0;
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 fade-in pb-12">
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
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-colors ${
                            filter === status
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Business</th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Location & Tier</th>
                                <th
                                    className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-indigo-600"
                                    onClick={() => handleSort('rating')}
                                >
                                    <div className="flex items-center gap-1">Rating <ArrowUpDown size={14} /></div>
                                </th>
                                <th
                                    className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-indigo-600"
                                    onClick={() => handleSort('totalReviews')}
                                >
                                    <div className="flex items-center gap-1">Reviews <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {sortedVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0">
                                                {vendor.businessName[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-gray-900 dark:text-white truncate">{vendor.businessName}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Building2 size={11} /> {vendor.category?.name || 'Uncategorized'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                            <MapPin size={13} className="text-gray-400" /> {vendor.city || '—'}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Tier: <span className="font-bold text-indigo-600">{vendor.pricingTier || 'Standard'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="font-bold text-amber-500 flex items-center gap-1">
                                            <Star size={14} className="fill-amber-400 text-amber-400" /> {vendor.rating || '—'}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="font-bold text-gray-900 dark:text-white">{vendor.totalReviews}</div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="space-y-1.5">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${getStatusStyles(vendor.verificationStatus)}`}>
                                                {vendor.verificationStatus}
                                            </span>
                                            {vendor.isVerified
                                                ? <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><ShieldCheck size={11} /> KYC Verified</div>
                                                : <div className="text-[10px] font-bold text-amber-600">KYC Pending</div>
                                            }
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* View Details — now opens drawer */}
                                            <button
                                                onClick={() => setSelectedVendor(vendor)}
                                                className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {!vendor.isVerified && vendor.verificationStatus !== 'rejected' && (
                                                <button onClick={() => handleAction(vendor.id, 'kyc')} className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 hover:bg-blue-100 rounded-lg" title="KYC Verify">
                                                    <ShieldCheck size={16} />
                                                </button>
                                            )}
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
                {sortedVendors.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No vendors found</h3>
                        <p className="text-sm text-gray-500 mt-1">Adjust filters or search query.</p>
                    </div>
                )}
            </div>

            {/* Vendor Detail Drawer */}
            {selectedVendor && (
                <VendorDetailDrawer
                    vendor={selectedVendor}
                    onClose={() => setSelectedVendor(null)}
                    onAction={handleAction}
                />
            )}
        </div>
    );
};

export default Vendors;
