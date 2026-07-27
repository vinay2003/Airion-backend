import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { api } from '@ease2event/shared';
import { toast } from 'react-hot-toast';

const ShopOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await api.get<any[]>('/merchandise/admin/orders');
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load shop orders');
        } finally {
            setLoading(false);
        }
    };

    const filtered = orders.filter(o => {
        const matchSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (o.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (loading) {
        return <div className="p-8">Loading Event Shop orders...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <ShoppingBag className="text-indigo-600" />
                        Event Shop Orders
                    </h1>
                    <p className="text-gray-500 mt-2">Monitor all merchandise orders across the platform.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl  border border-gray-100 p-4 mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by Order ID or Customer..." 
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400" size={18} />
                    <select 
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="py-2 pl-3 pr-8 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="ALL">All Statuses</option>
                        {['PENDING', 'PROCESSING', 'PARTIALLY_FULFILLED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl  border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Order ID & Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">No orders found.</td>
                            </tr>
                        ) : filtered.map(order => (
                            <tr key={order.id} className=" transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-gray-900">ORD-{order.id.substring(0,8).toUpperCase()}</div>
                                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="p-4 font-medium text-gray-900">
                                    {order.user?.name || 'Unknown'}
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-medium text-gray-700">
                                        {order.items?.length || 0} items
                                    </div>
                                    <div className="text-xs text-gray-500 truncate max-w-xs">
                                        {order.items?.map((i: any) => i.product?.title).join(', ')}
                                    </div>
                                </td>
                                <td className="p-4 font-black text-indigo-600">
                                    ₹{order.totalAmount}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                                        order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                        order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShopOrders;
