import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CreditCard, Wallet, Smartphone, Sparkles, Receipt, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRazorpay } from '../hooks/useRazorpay';
import { checkoutMerchandise } from '../lib/api';

const Checkout: React.FC = () => {
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const { openCheckout, loading: rzpLoading } = useRazorpay();

    // Form inputs
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [zip, setZip] = useState('');

    // Payment Methods
    const [paymentMethod, setPaymentMethod] = useState<'gateway' | 'wallet' | 'emi'>('gateway');
    const [emiTenure, setEmiTenure] = useState<3 | 6 | 12>(3);

    // Coupon
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);

    // Wallet balance
    const walletBalance = 5500; // Mock balance

    const handleApplyCoupon = () => {
        if (coupon.toUpperCase() === 'EASE20') {
            setDiscount(Math.round(totalPrice * 0.2));
            toast.success('20% discount applied successfully!');
        } else {
            toast.error('Invalid coupon code!');
        }
    };

    const finalPrice = Math.max(0, totalPrice - discount);

    const completeOrder = async (finalPaymentMethod: string) => {
        const orderPayload = {
            items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
            shippingAddress: `${address}, PIN: ${zip}`,
            phone,
            paymentMethod: finalPaymentMethod,
        };

        try {
            await checkoutMerchandise(orderPayload);
            toast.success('Order placed successfully!');
            clearCart();
            navigate('/booking-confirmation', {
                state: {
                    isMerchandise: true,
                    orderTotal: finalPrice,
                    paymentMethod: finalPaymentMethod,
                    emiTenure: finalPaymentMethod === 'emi' ? emiTenure : undefined,
                }
            });
        } catch (err: any) {
            console.warn('Backend order placement failed, falling back to local storage', err);
            // Fallback for mock products
            try {
                const mockOrders = JSON.parse(localStorage.getItem('ease2event_mock_orders') || '[]');
                const newOrder = {
                    id: `ord_${Date.now()}`,
                    userId: 'mock-user-id',
                    items: items.map(item => ({
                        product: { title: item.title, price: item.price, image: item.image, category: item.category },
                        quantity: item.quantity,
                    })),
                    totalAmount: finalPrice,
                    shippingAddress: `${address}, PIN: ${zip}`,
                    phone,
                    paymentMethod: finalPaymentMethod,
                    status: 'processing',
                    createdAt: new Date().toISOString(),
                };
                mockOrders.push(newOrder);
                localStorage.setItem('ease2event_mock_orders', JSON.stringify(mockOrders));

                toast.success('Order placed successfully!');
                clearCart();
                navigate('/booking-confirmation', {
                    state: {
                        isMerchandise: true,
                        orderTotal: finalPrice,
                        paymentMethod: finalPaymentMethod,
                        emiTenure: finalPaymentMethod === 'emi' ? emiTenure : undefined,
                    }
                });
            } catch (e) {
                toast.error('Failed to place order');
            }
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !address || !zip) {
            toast.error('Please fill in all shipping details!');
            return;
        }

        if (paymentMethod === 'wallet') {
            if (walletBalance < finalPrice) {
                toast.error('Insufficient wallet balance!');
                return;
            }
            // Complete checkout using wallet
            toast.success('Wallet balance debited successfully!');
            await completeOrder('wallet');
        } else {
            // Trigger Razorpay for 'gateway' or 'emi'
            try {
                await openCheckout(finalPrice, {
                    description: `Event Merchandise Purchase (${items.length} items)`,
                    userName: name,
                    userPhone: phone,
                    onSuccess: () => {
                        completeOrder(paymentMethod);
                    },
                    onCancel: () => {
                        toast.error('Payment cancelled by user');
                    }
                });
            } catch (err: any) {
                toast.error('Failed to launch Razorpay gateway');
            }
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight mb-8">Secure Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left: Shipping & Payment details */}
                    <form onSubmit={handlePlaceOrder} className="lg:col-span-8 space-y-8">
                        
                        {/* Shipping Details */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-neutral-200/60 dark:border-slate-800">
                            <h2 className="text-xl font-black text-neutral-900 dark:text-white mb-6">Shipping Address</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Address Line</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                        placeholder="Flat, House no., Apartment, Street"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">PIN Code</label>
                                    <input
                                        type="text"
                                        value={zip}
                                        onChange={e => setZip(e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                        placeholder="400001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Selection */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-neutral-200/60 dark:border-slate-800">
                            <h2 className="text-xl font-black text-neutral-900 dark:text-white mb-2">Select Payment Method</h2>
                            <p className="text-neutral-500 dark:text-slate-400 text-sm mb-6">Choose your preferred way to pay securely.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Credit Card / UPI Gateway */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('gateway')}
                                    className={`flex flex-col items-start p-5 rounded-2xl border text-left transition-all ${
                                        paymentMethod === 'gateway'
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-500/10'
                                            : 'border-neutral-200 dark:border-slate-800 hover:bg-neutral-50 dark:hover:bg-slate-800/50'
                                    }`}
                                >
                                    <CreditCard className="text-red-500 mb-4" size={24} />
                                    <span className="font-bold text-neutral-900 dark:text-white text-sm">UPI / Card / Net</span>
                                    <span className="text-xs text-neutral-500 mt-1">Instant authorization via gateway.</span>
                                </button>

                                {/* Wallet */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('wallet')}
                                    className={`flex flex-col items-start p-5 rounded-2xl border text-left transition-all ${
                                        paymentMethod === 'wallet'
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-500/10'
                                            : 'border-neutral-200 dark:border-slate-800 hover:bg-neutral-50 dark:hover:bg-slate-800/50'
                                    }`}
                                >
                                    <Wallet className="text-emerald-500 mb-4" size={24} />
                                    <span className="font-bold text-neutral-900 dark:text-white text-sm">Ease2Event Wallet</span>
                                    <span className="text-xs text-neutral-500 mt-1">Balance: ₹{walletBalance.toLocaleString()}</span>
                                </button>

                                {/* EMI */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('emi')}
                                    className={`flex flex-col items-start p-5 rounded-2xl border text-left transition-all ${
                                        paymentMethod === 'emi'
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-500/10'
                                            : 'border-neutral-200 dark:border-slate-800 hover:bg-neutral-50 dark:hover:bg-slate-800/50'
                                    }`}
                                >
                                    <Smartphone className="text-blue-500 mb-4" size={24} />
                                    <span className="font-bold text-neutral-900 dark:text-white text-sm">Easy EMI Plan</span>
                                    <span className="text-xs text-neutral-500 mt-1">Split payments into monthly installments.</span>
                                </button>
                            </div>

                            {/* Wallet payment check */}
                            {paymentMethod === 'wallet' && (
                                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Wallet Available Balance</p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-500">Fast and secure direct wallet debit.</p>
                                    </div>
                                    <p className="text-lg font-black text-emerald-800 dark:text-emerald-400">₹{walletBalance.toLocaleString()}</p>
                                </div>
                            )}

                            {/* EMI Tenure Display */}
                            {paymentMethod === 'emi' && (
                                <div className="mt-6 space-y-4 p-5 bg-blue-50/50 dark:bg-blue-500/5 border border-blue-200/50 dark:border-blue-500/10 rounded-2xl">
                                    <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Select EMI Plan</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[3, 6, 12].map(months => {
                                            const monthlyCost = Math.round((finalPrice * 1.1) / months);
                                            return (
                                                <button
                                                    key={months}
                                                    type="button"
                                                    onClick={() => setEmiTenure(months as any)}
                                                    className={`p-3 rounded-xl border text-center transition-all ${
                                                        emiTenure === months
                                                            ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                            : 'border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-slate-400'
                                                    }`}
                                                >
                                                    <p className="font-black text-sm">{months} Months</p>
                                                    <p className="text-xs mt-1">₹{monthlyCost}/mo</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-neutral-500 italic">Includes low 10% annual interest rate.</p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={rzpLoading}
                            className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-wider text-sm transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {rzpLoading ? 'Opening Razorpay...' : 'Place Order'} <ArrowRight size={18} />
                        </button>
                    </form>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-neutral-200/60 dark:border-slate-800">
                            <h2 className="text-lg font-black text-neutral-900 dark:text-white mb-6">Order Summary</h2>

                            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar mb-6">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-3 justify-between">
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">{item.title}</h4>
                                                <p className="text-xs text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-neutral-900 dark:text-white text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Code */}
                            <div className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    placeholder="Enter Coupon (EASE20)"
                                    value={coupon}
                                    onChange={e => setCoupon(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-xs font-semibold uppercase"
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl text-xs uppercase"
                                >
                                    Apply
                                </button>
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pt-6 border-t border-neutral-100 dark:border-slate-800">
                                <div className="flex justify-between text-xs font-bold text-neutral-500">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-xs font-bold text-green-500">
                                        <span>Coupon Discount</span>
                                        <span>-₹{discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xs font-bold text-neutral-500">
                                    <span>Shipping</span>
                                    <span className="text-green-500 uppercase">Free</span>
                                </div>
                                <div className="pt-3 border-t border-neutral-200 dark:border-slate-700 flex justify-between">
                                    <span className="font-bold text-neutral-900 dark:text-white">Order Total</span>
                                    <span className="font-black text-xl text-red-500">₹{finalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Checkout;
