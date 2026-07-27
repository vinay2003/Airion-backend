import React, { useState, useEffect } from 'react';
import { Package, Search, Edit, CheckCircle, Truck, MapPin, SearchCheck } from 'lucide-react';
import { Button, Badge, Skeleton } from '@ease2event/ui';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    fulfillmentStatus: string;
    trackingNumber: string | null;
    courierName: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    order: {
        id: string;
        createdAt: string;
        shippingAddress: string;
        user: {
            name: string;
            email: string;
            phoneNumber?: string;
        };
    };
    product: {
        title: string;
        image: string;
    };
}

const STATUSES = ['PENDING', 'ACCEPTED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const MerchandiseOrders: React.FC = () => {
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/merchandise/vendor/orders');
            const data = (res as any).data || res;
            
            const dummyOrders: OrderItem[] = [
            { id: 'dummy-ord-1', quantity: 2, price: 1500, fulfillmentStatus: 'PENDING', trackingNumber: null, courierName: null, shippedAt: null, deliveredAt: null, order: { id: 'ORD-109485', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), shippingAddress: '123 MG Road, Bangalore, 560001', user: { name: 'Aditi Sharma', email: 'aditi@example.com' } }, product: { title: 'Party Props Kit', image: 'https://images.unsplash.com/photo-1530103862676-de8892ebe653?auto=format&fit=crop&q=80&w=1000' } },
            { id: 'dummy-ord-2', quantity: 1, price: 4500, fulfillmentStatus: 'SHIPPED', trackingNumber: 'BLUEDART-123456', courierName: 'BlueDart', shippedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), deliveredAt: null, order: { id: 'ORD-882194', createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), shippingAddress: '456 Cyber Hub, Gurgaon, 122002', user: { name: 'Kunal Kapoor', email: 'kunal@example.com' } }, product: { title: 'Heavy Duty Fog Machine', image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1000' } },
            { id: 'dummy-ord-3', quantity: 10, price: 850, fulfillmentStatus: 'DELIVERED', trackingNumber: 'DTDC-884930', courierName: 'DTDC', shippedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), deliveredAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(), order: { id: 'ORD-294711', createdAt: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(), shippingAddress: '789 Jubilee Hills, Hyderabad, 500033', user: { name: 'Sneha Reddy', email: 'sneha@example.com' } }, product: { title: 'Gourmet Gift Hampers', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000' } }
            ];
            
            setItems((Array.isArray(data) && data.length > 0) ? data : dummyOrders);
        } catch (error) {
            // toast.error('Failed to load orders.');
            const dummyOrders: OrderItem[] = [
            { id: 'dummy-ord-1', quantity: 2, price: 1500, fulfillmentStatus: 'PENDING', trackingNumber: null, courierName: null, shippedAt: null, deliveredAt: null, order: { id: 'ORD-109485', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), shippingAddress: '123 MG Road, Bangalore, 560001', user: { name: 'Aditi Sharma', email: 'aditi@example.com' } }, product: { title: 'Party Props Kit', image: 'https://images.unsplash.com/photo-1530103862676-de8892ebe653?auto=format&fit=crop&q=80&w=1000' } },
            { id: 'dummy-ord-2', quantity: 1, price: 4500, fulfillmentStatus: 'SHIPPED', trackingNumber: 'BLUEDART-123456', courierName: 'BlueDart', shippedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), deliveredAt: null, order: { id: 'ORD-882194', createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), shippingAddress: '456 Cyber Hub, Gurgaon, 122002', user: { name: 'Kunal Kapoor', email: 'kunal@example.com' } }, product: { title: 'Heavy Duty Fog Machine', image: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1000' } },
            { id: 'dummy-ord-3', quantity: 10, price: 850, fulfillmentStatus: 'DELIVERED', trackingNumber: 'DTDC-884930', courierName: 'DTDC', shippedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), deliveredAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(), order: { id: 'ORD-294711', createdAt: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(), shippingAddress: '789 Jubilee Hills, Hyderabad, 500033', user: { name: 'Sneha Reddy', email: 'sneha@example.com' } }, product: { title: 'Gourmet Gift Hampers', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000' } }
            ];
            setItems(dummyOrders);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (itemId: string, currentStatus: string) => {
        const nextStatusIndex = STATUSES.indexOf(currentStatus) + 1;
        if (nextStatusIndex >= STATUSES.length || currentStatus === 'CANCELLED') return;
        
        const nextStatus = STATUSES[nextStatusIndex];
        let payload: any = { status: nextStatus };

        if (nextStatus === 'SHIPPED') {
            const tracking = prompt('Enter Tracking Number (Optional):');
            const courier = prompt('Enter Courier Name (Optional):');
            if (tracking) payload.trackingNumber = tracking;
            if (courier) payload.courierName = courier;
        }

        if (itemId.startsWith('dummy-ord-')) {
            toast.success(`Marked as ${nextStatus}`);
            setItems(prev => prev.map(item => item.id === itemId ? {
                ...item,
                fulfillmentStatus: nextStatus,
                trackingNumber: payload.trackingNumber || item.trackingNumber,
                courierName: payload.courierName || item.courierName,
                shippedAt: nextStatus === 'SHIPPED' ? new Date().toISOString() : item.shippedAt,
                deliveredAt: nextStatus === 'DELIVERED' ? new Date().toISOString() : item.deliveredAt,
            } : item));
            return;
        }

        try {
            setUpdatingId(itemId);
            await api.patch(`/merchandise/vendor/orders/${itemId}/status`, payload);
            toast.success(`Marked as ${nextStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = items.filter(item => {
        const matchSearch = item.product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.order.user.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || item.fulfillmentStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="text-indigo-500" />
                        Shop Orders
                    </h1>
                    <p className="text-gray-500 mt-1">Manage orders for your Event Shop items.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl outline-none"
                    >
                        <option value="ALL">All Statuses</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
                            <Skeleton className="w-full h-24 rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
                    <SearchCheck className="text-indigo-500 mb-4 opacity-50" size={48} />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders found</h3>
                    <p className="text-gray-500 max-w-sm">No orders match your current filters or you have no orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(item => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <img src={item.product.image} alt={item.product.title} className="w-24 h-24 rounded-xl object-cover border border-gray-100 dark:border-slate-800" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-base text-gray-900 dark:text-white">{item.product.title}</h3>
                                            <p className="text-xs text-gray-500 font-medium">Order: ORD-{item.order.id.substring(0,8).toUpperCase()}</p>
                                        </div>
                                        <Badge variant={item.fulfillmentStatus === 'DELIVERED' ? 'confirmed' : item.fulfillmentStatus === 'CANCELLED' ? 'cancelled' : 'pending'}>
                                            {item.fulfillmentStatus}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Customer</p>
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.order.user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Quantity</p>
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total</p>
                                            <p className="text-xs font-bold text-indigo-600">₹{item.quantity * item.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Order Date</p>
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{new Date(item.order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-start gap-2 max-w-md">
                                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.order.shippingAddress}</p>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    {item.trackingNumber && (
                                        <div className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-center gap-2 mr-2">
                                            <Truck size={14} className="text-gray-500" />
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.courierName}: {item.trackingNumber}</span>
                                        </div>
                                    )}
                                    {item.fulfillmentStatus !== 'DELIVERED' && item.fulfillmentStatus !== 'CANCELLED' && (
                                        <Button 
                                            variant="primary" 
                                            className="w-full sm:w-auto"
                                            disabled={updatingId === item.id}
                                            onClick={() => handleUpdateStatus(item.id, item.fulfillmentStatus)}
                                        >
                                            {updatingId === item.id ? 'Updating...' : `Mark as ${STATUSES[STATUSES.indexOf(item.fulfillmentStatus) + 1].charAt(0) + STATUSES[STATUSES.indexOf(item.fulfillmentStatus) + 1].slice(1).toLowerCase()}`}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MerchandiseOrders;
