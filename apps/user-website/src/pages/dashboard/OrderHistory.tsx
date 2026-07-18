import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, ChevronRight, Search, RefreshCw, X, CheckCircle, Clock, Truck, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

interface OrderItem {
    id: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    orderCode: string;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    placedAt: string;
    estimatedDelivery?: string;
    items: OrderItem[];
    total: number;
    address: string;
}



const STATUS_CONFIG = {
    processing: { label: 'Processing', icon: Clock, bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', steps: 1 },
    shipped: { label: 'Out for Delivery', icon: Truck, bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', steps: 2 },
    delivered: { label: 'Delivered', icon: CheckCircle, bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', steps: 3 },
    cancelled: { label: 'Cancelled', icon: X, bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', steps: 0 },
};

const TrackingSteps = ({ status }: { status: Order['status'] }) => {
    const steps = ['Order Placed', 'Packed & Shipped', 'Out for Delivery', 'Delivered'];
    const currentStep = STATUS_CONFIG[status].steps;

    return (
        <div className="flex items-center gap-0 mt-4">
            {steps.map((step, idx) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-1 flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 ${idx < currentStep
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : idx === currentStep
                            ? 'bg-white dark:bg-slate-900 border-indigo-500 text-indigo-600'
                            : 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400'
                        }`}>
                            {idx < currentStep ? '✓' : idx + 1}
                        </div>
                        <p className={`text-[9px] font-bold text-center leading-tight ${idx < currentStep ? 'text-emerald-600' : idx === currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                            {step}
                        </p>
                    </div>
                    {idx < steps.length - 1 && (
                        <div className={`h-0.5 flex-1 mb-5 ${idx < currentStep ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-slate-700'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/merchandise/orders');
                const data = (res as any).data || res;
                if (Array.isArray(data)) {
                    setOrders(data.map((o: any) => ({
                        id: o.id,
                        orderCode: `ORD-${o.id.substring(0,6).toUpperCase()}`,
                        status: o.status,
                        placedAt: o.createdAt,
                        estimatedDelivery: o.estimatedDelivery || undefined,
                        total: Number(o.totalAmount),
                        address: o.shippingAddress,
                        items: (o.items || []).map((i: any) => ({
                            id: i.id,
                            productName: i.product?.title || 'Unknown Product',
                            productImage: i.product?.image || '',
                            quantity: i.quantity,
                            price: Number(i.price),
                        }))
                    })));
                }
            } catch (error) {
                toast.error('Failed to load order history');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filtered = orders.filter(o => {
        const matchSearch = o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.items.some(i => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">My Orders</h1>
                    <p className="text-neutral-500 dark:text-slate-400 mt-1 font-medium">Track your Event Shop purchases.</p>
                </div>
                <button onClick={() => navigate('/merchandise')} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors">
                    <ShoppingBag size={16} /> Shop More
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by order ID or product name..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors ${statusFilter === s ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-400'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Order Cards */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Package size={48} className="text-neutral-200 dark:text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No orders found</h3>
                    <p className="text-neutral-400 max-w-xs">Try a different search or head to the Event Shop to place your first order.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(order => {
                        const cfg = STATUS_CONFIG[order.status];
                        const isExpanded = expandedOrder === order.id;
                        return (
                            <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                {/* Order Header */}
                                <div className="flex items-center justify-between p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Package size={22} className="text-neutral-500 dark:text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-black text-neutral-900 dark:text-white text-sm">#{order.orderCode}</p>
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                                            </div>
                                            <p className="text-xs text-neutral-400 mt-0.5">
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''} •
                                                Placed {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} •
                                                ₹{order.total.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                    >
                                        {isExpanded ? 'Hide' : 'Details'}
                                        <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                    </button>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-neutral-100 dark:border-slate-800 p-5 space-y-5">
                                        {/* Items */}
                                        <div className="space-y-3">
                                            {order.items.map(item => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <img src={item.productImage} alt={item.productName} className="w-14 h-14 rounded-xl object-cover bg-neutral-100" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm text-neutral-900 dark:text-white truncate">{item.productName}</p>
                                                        <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-black text-sm text-neutral-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tracking */}
                                        {order.status !== 'cancelled' && (
                                            <div>
                                                <p className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tracking</p>
                                                <TrackingSteps status={order.status} />
                                                {order.estimatedDelivery && order.status !== 'delivered' && (
                                                    <p className="text-xs text-neutral-400 mt-2">
                                                        <Truck size={12} className="inline mr-1" />
                                                        Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Address */}
                                        <div className="flex items-start gap-2">
                                            <MapPin size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                                            <p className="text-xs text-neutral-500 dark:text-slate-400 font-medium">{order.address}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-2">
                                            {order.status === 'delivered' && (
                                                <button
                                                    onClick={() => toast.success('Return request submitted!')}
                                                    className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-slate-800"
                                                >
                                                    <RefreshCw size={13} /> Return / Exchange
                                                </button>
                                            )}
                                            {(order.status === 'processing') && (
                                                <button
                                                    onClick={() => toast.error('Cancellation requested.')}
                                                    className="flex items-center gap-2 px-4 py-2 border border-rose-200 dark:border-rose-500/30 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50"
                                                >
                                                    <X size={13} /> Cancel Order
                                                </button>
                                            )}
                                            <button
                                                onClick={() => toast.success('Invoice downloaded!')}
                                                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-bold"
                                            >
                                                Download Invoice
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
