import React, { useState } from 'react';
import { DollarSign, Search, Check, X, AlertTriangle } from 'lucide-react';
import { useAdminRefunds, useApproveRefund, useRejectRefund, useCompleteRefund } from '../hooks/useRefunds';

const Refunds = () => {
    const { data: refundsData, isLoading } = useAdminRefunds();
    const approveMutation = useApproveRefund();
    const rejectMutation = useRejectRefund();
    const completeMutation = useCompleteRefund();

    const [searchQuery, setSearchQuery] = useState('');

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        if (action === 'approved') {
            await approveMutation.mutateAsync({ id });
        } else {
            const reason = window.prompt("Reason for rejection:");
            if (reason) {
                await rejectMutation.mutateAsync({ id, adminRemark: reason });
            }
        }
    };

    const handleComplete = async (id: string) => {
        await completeMutation.mutateAsync(id);
    };

    const refunds = Array.isArray(refundsData) ? refundsData : [];

    const filtered = refunds.filter((r: any) => 
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.bookingId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <DollarSign className="text-amber-500" size={32} />
                        Refund Management
                    </h1>
                    <p className="text-gray-500 mt-2">Approve or reject customer refund requests.</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by ID or User..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Refund ID</th>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Reason</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {isLoading && (
                            <tr><td colSpan={7} className="text-center py-4">Loading...</td></tr>
                        )}
                        {!isLoading && filtered.map((refund: any) => (
                            <tr key={refund.id} className=" ">
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{refund.id.split('-')[0]}...</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{refund.bookingId?.split('-')[0]}...</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{refund.userId?.split('-')[0]}...</td>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₹{Number(refund.refundAmount || refund.amount || 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{refund.reason || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                        refund.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                        refund.status === 'processed' ? 'bg-blue-100 text-blue-700' :
                                        refund.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {refund.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {refund.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleAction(refund.id, 'approved')} className="p-2 bg-emerald-50 text-emerald-600  rounded-lg" title="Approve">
                                                <Check size={18} />
                                            </button>
                                            <button onClick={() => handleAction(refund.id, 'rejected')} className="p-2 bg-rose-50 text-rose-600  rounded-lg" title="Reject">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                    {refund.status === 'approved' && (
                                        <button onClick={() => handleComplete(refund.id)} className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600  rounded-lg">
                                            Mark Processed
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <AlertTriangle size={32} className="mb-2 text-gray-400" />
                        No refund requests found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Refunds;
