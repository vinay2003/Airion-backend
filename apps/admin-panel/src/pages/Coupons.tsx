import React, { useState } from 'react';
import { Search, Plus, Ticket, Calendar, Users, Copy, CheckCircle, Clock, Trash2, Edit2, Percent, DollarSign, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminCoupons, useDeleteCoupon, useCreateCoupon } from '../hooks/useCoupons';

interface Coupon {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    usageLimit: number;
    usedCount: number;
    expiryDate: string;
    status: 'Active' | 'Expired' | 'Depleted';
    applicableTo: 'All' | 'Venue' | 'Photography' | 'Makeup Artist';
}

const Coupons: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [code, setCode] = useState('');
    const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
    const [value, setValue] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [applicableTo, setApplicableTo] = useState('All');

    const { data: couponsData, isLoading } = useAdminCoupons();
    const deleteMutation = useDeleteCoupon();
    const createMutation = useCreateCoupon();

    const coupons: Coupon[] = couponsData || [];

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success(`Coupon code ${code} copied!`);
    };

    const deleteCoupon = async (id: string) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return toast.error('Enter coupon code');
        if (!value) return toast.error('Enter discount value');
        if (!expiryDate) return toast.error('Select expiry date');

        try {
            await createMutation.mutateAsync({
                code: code.trim().toUpperCase(),
                type,
                value: parseFloat(value),
                usageLimit: usageLimit ? parseInt(usageLimit) : 100,
                expiryDate,
                applicableTo,
            });
            setIsModalOpen(false);
            // Reset form
            setCode('');
            setType('percentage');
            setValue('');
            setUsageLimit('');
            setExpiryDate('');
            setApplicableTo('All');
        } catch (err) {
            // Hook handles toasts
        }
    };

    const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()));

    const getStatusStyles = (status: Coupon['status']) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'Expired': return 'bg-rose-50 text-rose-600 border-rose-200';
            case 'Depleted': return 'bg-amber-50 text-amber-600 border-amber-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">Coupons & Discounts</h1>
                    <p className="text-sm font-medium text-[var(--ease2event-text-secondary)] mt-1">Generate and manage promotional codes</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                >
                    <Plus size={18} />
                    <span>Create Coupon</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by coupon code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCoupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[24px] overflow-hidden shadow-sm flex flex-col sm:flex-row">
                        {/* Left - Discount Value */}
                        <div className="bg-indigo-600 p-8 flex flex-col items-center justify-center text-white sm:w-1/3 relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                            {coupon.type === 'percentage' ? (
                                <Percent size={32} className="opacity-50 mb-2" />
                            ) : (
                                <DollarSign size={32} className="opacity-50 mb-2" />
                            )}
                            <h3 className="text-4xl font-black tracking-tighter">
                                {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                            </h3>
                            <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mt-1">OFF</p>
                            
                            {/* Zigzag edge simulation (Desktop) */}
                            <div className="hidden sm:flex absolute -right-2 top-0 bottom-0 flex-col justify-between">
                                {[...Array(15)].map((_, i) => (
                                    <div key={i} className="w-4 h-4 bg-white dark:bg-slate-900 rounded-full -mr-2"></div>
                                ))}
                            </div>
                            {/* Zigzag edge simulation (Mobile) */}
                            <div className="sm:hidden flex absolute -bottom-2 left-0 right-0 justify-between">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="w-4 h-4 bg-white dark:bg-slate-900 rounded-full -mb-2"></div>
                                ))}
                            </div>
                        </div>

                        {/* Right - Details */}
                        <div className="p-6 sm:w-2/3 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div 
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors group"
                                        onClick={() => copyCode(coupon.code)}
                                    >
                                        <span className="font-mono font-bold text-gray-900 dark:text-white tracking-widest">{coupon.code}</span>
                                        <Copy size={14} className="text-gray-400 group-hover:text-indigo-600" />
                                    </div>
                                    <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border ${getStatusStyles(coupon.status)}`}>
                                        {coupon.status}
                                    </span>
                                </div>
                                
                                <p className="text-sm font-medium text-gray-500 mb-6">
                                    Applicable to: <span className="text-gray-900 dark:text-white font-bold">{coupon.applicableTo}</span>
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-gray-500"><Calendar size={16}/> Expires</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{coupon.expiryDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-gray-500"><Users size={16}/> Usage limit</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{coupon.usedCount} / {coupon.usageLimit}</span>
                                    </div>
                                </div>
                                
                                {/* Progress bar */}
                                <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                                    <div 
                                        className={`h-full rounded-full ${coupon.status === 'Depleted' ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                                        style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                                <button onClick={() => deleteCoupon(coupon.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCoupons.length === 0 && (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ticket size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No coupons found</h3>
                </div>
            )}

            {/* Create Coupon Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-gray-200 dark:border-slate-800 w-full max-w-lg relative p-8">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Coupon Code</h2>
                        <p className="text-sm text-gray-500 mb-6 font-medium">Generate a discount code for promotional campaigns.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Coupon Code</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. FESTIVE20"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white uppercase tracking-wider"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Discount Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as any)}
                                        className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Discount Value</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        placeholder={type === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Usage Limit</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="e.g. 100"
                                        value={usageLimit}
                                        onChange={(e) => setUsageLimit(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Expiry Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Applicable To</label>
                                <select
                                    value={applicableTo}
                                    onChange={(e) => setApplicableTo(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Venue">Venue Booking</option>
                                    <option value="Photography">Photography</option>
                                    <option value="Makeup Artist">Makeup Artist</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    {createMutation.isPending ? 'Creating Coupon...' : 'Create Coupon'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
