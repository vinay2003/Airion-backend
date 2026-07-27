import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Check, X, Tag } from 'lucide-react';
import { api } from '@ease2event/shared';
import { toast } from 'react-hot-toast';

const ShopAdmin = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    React.useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await api.get<any[]>('/merchandise/admin/all');
            setProducts(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await api.put(`/merchandise/${id}/approve`, { status });
            toast.success(`Product ${status}`);
            fetchProducts();
        } catch (error) {
            toast.error('Failed to update product');
        }
    };

    const filtered = products.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.creator?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.approvalStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    if (loading) {
        return <div className="p-8">Loading Event Shop products...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <ShoppingBag className="text-red-500" size={32} />
                        Event Shop Approvals
                    </h1>
                    <p className="text-gray-500 mt-2">Manage vendor products and merchandise.</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products or vendors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white outline-none"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price / Stock</th>
                            <th className="px-6 py-4">Vendor</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {filtered.map((product) => (
                            <tr key={product.id} className=" ">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                            {product.image ? (
                                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <Tag className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{product.title}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{product.category}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 dark:text-white">₹{Number(product.price).toLocaleString()}</span>
                                        <span className="text-xs text-gray-500">{product.stock} in stock</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {product.creator?.name || 'Unknown Vendor'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                        product.approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                        product.approvalStatus === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                                        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                    }`}>
                                        {product.approvalStatus || 'pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {product.approvalStatus === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleApproval(product.id, 'approved')}
                                                className="p-2 bg-emerald-50 text-emerald-600  rounded-lg transition-colors"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleApproval(product.id, 'rejected')}
                                                className="p-2 bg-rose-50 text-rose-600  rounded-lg transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-12 text-center text-gray-500 dark:text-slate-400">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopAdmin;
