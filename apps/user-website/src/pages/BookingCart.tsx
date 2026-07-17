import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart, Trash2, Calendar, Clock, Users, Package, Plus, Minus,
    ChevronDown, ChevronUp, MapPin, Sparkles, CreditCard, Smartphone,
    Building, DollarSign, CheckCircle, ArrowRight, X, Info, Percent,
    AlertTriangle, Phone, Home, FileText, Tag
} from 'lucide-react';
import { useBookingCart } from '../context/BookingCartContext';
import { useAuth } from '@shared/auth/AuthContext';
import toast from 'react-hot-toast';

/* ─── Razorpay types ─── */
declare global {
    interface Window { Razorpay: any; }
}

/* ─── Payment method definitions ─── */
const PAYMENT_METHODS = [
    {
        id: 'upi',
        label: 'UPI',
        subtitle: 'PhonePe, GPay, Paytm & more',
        icon: Smartphone,
        subOptions: [
            { id: 'phonepe', label: 'PhonePe', icon: '📱' },
            { id: 'gpay', label: 'Google Pay', icon: '💳' },
            { id: 'paytm', label: 'Paytm', icon: '🅿' },
        ]
    },
    {
        id: 'card',
        label: 'Credit / Debit Card',
        subtitle: 'Visa, Mastercard, Rupay',
        icon: CreditCard,
        subOptions: []
    },
    {
        id: 'netbanking',
        label: 'Net Banking',
        subtitle: 'All major Indian banks',
        icon: Building,
        subOptions: []
    },
    {
        id: 'emi',
        label: 'EMI',
        subtitle: 'Split into easy monthly installments',
        icon: DollarSign,
        subOptions: [
            { id: '3', label: '3 Months', icon: '📅' },
            { id: '6', label: '6 Months', icon: '📅' },
            { id: '12', label: '12 Months', icon: '📅' },
        ]
    },
];

const ADDON_SERVICES = ['Makeup Artist', 'DJ', 'Sweet Shop', 'Florist', 'Valet Parking', 'Security', 'Anchor / Emcee', 'Live Band'];

/* ─── Vendor Item Card ─── */
const VendorBookingCard: React.FC<{ item: any; onUpdate: (updates: any) => void; onRemove: () => void }> = ({ item, onUpdate, onRemove }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-neutral-100 dark:border-slate-800">
                <img src={item.vendorImage} alt={item.vendorName} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider">{item.vendorCategory}</p>
                    <h3 className="font-black text-neutral-900 dark:text-white text-lg truncate">{item.vendorName}</h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1"><MapPin size={12} />{item.vendorCity}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setExpanded(e => !e)} className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-slate-800">
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <button onClick={onRemove} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 space-y-4">
                            {/* Event Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Event Date</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            type="date"
                                            value={item.eventDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={e => onUpdate({ eventDate: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Time</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            type="time"
                                            value={item.eventTime}
                                            onChange={e => onUpdate({ eventTime: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Guest Count & Occasion */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Guests</label>
                                    <div className="relative">
                                        <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            type="number"
                                            value={item.guestCount}
                                            min="1"
                                            onChange={e => onUpdate({ guestCount: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Occasion</label>
                                    <select
                                        value={item.occasion}
                                        onChange={e => onUpdate({ occasion: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                    >
                                        {['Wedding', 'Birthday', 'Anniversary', 'Corporate', 'Baby Shower', 'Graduation', 'Engagement', 'Other'].map(o => (
                                            <option key={o} value={o}>{o}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Package Selection */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Package</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'Basic', price: item.packagePrice * 0.6 },
                                        { id: 'Standard', price: item.packagePrice },
                                        { id: 'Premium', price: item.packagePrice * 1.6 },
                                    ].map(pkg => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => onUpdate({ selectedPackage: pkg.id, packagePrice: Math.round(pkg.price) })}
                                            className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${item.selectedPackage === pkg.id
                                                ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                                : 'border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-400'
                                                }`}
                                        >
                                            <p className="text-xs font-black uppercase">{pkg.id}</p>
                                            <p className="text-sm font-bold mt-0.5">₹{Math.round(pkg.price).toLocaleString()}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Add-On Services */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Add-On Services</label>
                                <div className="flex flex-wrap gap-2">
                                    {ADDON_SERVICES.map(svc => {
                                        const isSelected = item.addOnServices?.includes(svc);
                                        return (
                                            <button
                                                key={svc}
                                                onClick={() => {
                                                    const current = item.addOnServices || [];
                                                    onUpdate({
                                                        addOnServices: isSelected
                                                            ? current.filter((s: string) => s !== svc)
                                                            : [...current, svc]
                                                    });
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${isSelected
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                                    : 'border-neutral-200 dark:border-slate-700 text-neutral-500 dark:text-slate-400'
                                                    }`}
                                            >
                                                {isSelected ? '✓ ' : '+ '}{svc}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Special Instructions */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Special Instructions</label>
                                <textarea
                                    value={item.specialInstructions}
                                    onChange={e => onUpdate({ specialInstructions: e.target.value })}
                                    placeholder="Any specific requirements, themes, dietary restrictions..."
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-red-500 outline-none resize-none"
                                />
                            </div>

                            {/* Item total */}
                            <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-slate-800">
                                <span className="text-sm font-bold text-neutral-500">Vendor Subtotal</span>
                                <span className="font-black text-neutral-900 dark:text-white text-lg">₹{item.packagePrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ─── Main BookingCart Page ─── */
const BookingCart: React.FC = () => {
    const { cartItems, removeFromCart, updateCartItem, clearCart, cartTotal } = useBookingCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Shipping / contact form
    const [form, setForm] = useState({
        fullName: user?.name || '',
        phone: '',
        altPhone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        addressType: 'Home',
    });

    // Payment
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [paymentSubOption, setPaymentSubOption] = useState('gpay');
    const [paymentMode, setPaymentMode] = useState<'full' | 'advance'>('full');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [emiTenure, setEmiTenure] = useState('6');
    const [coupon, setCoupon] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);

    const advanceAmount = Math.round(cartTotal * 0.1);
    const discountAmount = couponApplied ? Math.round(cartTotal * 0.05) : 0;
    const payableAmount = (paymentMode === 'advance' ? advanceAmount : cartTotal) - discountAmount;

    const validateForm = () => {
        if (!form.fullName || !form.phone || !form.addressLine1 || !form.city || !form.pincode) {
            toast.error('Please fill in all required address fields.');
            return false;
        }
        if (!/^\d{10}$/.test(form.phone)) {
            toast.error('Please enter a valid 10-digit phone number.');
            return false;
        }
        if (!/^\d{6}$/.test(form.pincode)) {
            toast.error('Please enter a valid 6-digit PIN code.');
            return false;
        }
        if (cartItems.some(i => !i.eventDate)) {
            toast.error('Please select an event date for all vendors.');
            return false;
        }
        return true;
    };

    const loadRazorpay = (): Promise<boolean> => {
        return new Promise(resolve => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        const loaded = await loadRazorpay();
        if (!loaded) {
            toast.error('Payment gateway failed to load. Please try again.');
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            amount: payableAmount * 100,
            currency: 'INR',
            name: 'Ease2Event',
            description: `Booking for ${cartItems.length} vendor${cartItems.length > 1 ? 's' : ''}`,
            image: '/logo.png',
            prefill: {
                name: form.fullName,
                contact: form.phone,
                email: user?.email || '',
            },
            theme: { color: '#dc2626' },
            handler: (response: any) => {
                // Payment successful
                clearCart();
                navigate('/booking-confirmation', {
                    state: {
                        eventName: cartItems.map(i => i.vendorName).join(', '),
                        date: cartItems[0]?.eventDate || 'TBD',
                        time: cartItems[0]?.eventTime || 'TBD',
                        guests: cartItems[0]?.guestCount || '0',
                        package: cartItems[0]?.selectedPackage || 'Standard',
                        occasion: cartItems[0]?.occasion || 'Event',
                        addons: cartItems[0]?.selectedAddons || [],
                        total: payableAmount,
                        isEmi: paymentMethod === 'emi',
                        isMerchandise: false,
                        paymentMethod,
                        emiTenure: paymentMethod === 'emi' ? emiTenure : undefined,
                        vendorCount: cartItems.length,
                        isAdvancePayment: paymentMode === 'advance',
                        razorpayPaymentId: response.razorpay_payment_id,
                    }
                });
            },
            modal: {
                ondismiss: () => toast('Payment cancelled.', { icon: '⚠️' }),
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handleSaveForLater = () => {
        toast.success('Booking saved! You can complete payment later from your dashboard.');
        navigate('/dashboard/bookings');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 flex items-center justify-center p-8 pt-24">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart size={40} className="text-red-400" />
                    </div>
                    <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-3">Booking Cart is Empty</h2>
                    <p className="text-neutral-500 dark:text-slate-400 font-medium mb-8">Browse vendors and add them to your booking cart to get started.</p>
                    <Link to="/marketplace" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-colors">
                        Browse Vendors <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 pt-20 pb-16 transition-colors">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Timeline Indicator */}
                <div className="py-6 border-b border-neutral-100 dark:border-slate-800 mb-6">
                    <div className="flex items-center gap-4 max-w-3xl mx-auto">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-bold text-sm">
                            <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">1</div>
                            Cart & Customization
                        </div>
                        <div className="flex-1 h-px bg-neutral-200 dark:bg-slate-700" />
                        <div className="flex items-center gap-2 text-neutral-400 font-bold text-sm">
                            <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-slate-800 flex items-center justify-center">2</div>
                            Payment
                        </div>
                        <div className="flex-1 h-px bg-neutral-200 dark:bg-slate-700" />
                        <div className="flex items-center gap-2 text-neutral-400 font-bold text-sm">
                            <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-slate-800 flex items-center justify-center">3</div>
                            Confirmation
                        </div>
                    </div>
                </div>

                {/* Page Title */}
                <div className="pb-8">
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-1">Your Booking Cart</h1>
                    <p className="text-neutral-500 dark:text-slate-400 font-medium">
                        {cartItems.length} vendor{cartItems.length > 1 ? 's' : ''} selected • Review and customize before paying
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8 items-start">
                    {/* LEFT: Vendors + Address + Payment */}
                    <div className="space-y-6">

                        {/* Vendor Cards */}
                        <section>
                            <h2 className="text-lg font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <Package size={20} className="text-red-500" /> Vendors ({cartItems.length})
                            </h2>
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <VendorBookingCard
                                        key={item.vendorId}
                                        item={item}
                                        onUpdate={updates => updateCartItem(item.vendorId, updates)}
                                        onRemove={() => removeFromCart(item.vendorId)}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Contact & Address */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 p-6">
                            <h2 className="text-lg font-black text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                                <Home size={20} className="text-red-500" /> Contact & Billing Address
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                                    <input
                                        value={form.fullName}
                                        onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            value={form.phone}
                                            onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                                            className="w-full pl-9 pr-3 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Alt. Phone</label>
                                    <input
                                        value={form.altPhone}
                                        onChange={e => setForm(f => ({ ...f, altPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Address Line 1 *</label>
                                    <input
                                        value={form.addressLine1}
                                        onChange={e => setForm(f => ({ ...f, addressLine1: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="House no., Building, Street"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Address Line 2</label>
                                    <input
                                        value={form.addressLine2}
                                        onChange={e => setForm(f => ({ ...f, addressLine2: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="Locality, Landmark (optional)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">City *</label>
                                    <input
                                        value={form.city}
                                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">State</label>
                                    <input
                                        value={form.state}
                                        onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="State"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">PIN Code *</label>
                                    <input
                                        value={form.pincode}
                                        onChange={e => setForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="6-digit PIN"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Address Type</label>
                                    <div className="flex gap-2">
                                        {['Home', 'Work', 'Other'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setForm(f => ({ ...f, addressType: t }))}
                                                className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${form.addressType === t ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'border-neutral-200 dark:border-slate-700 text-neutral-500'}`}
                                            >
                                                {t === 'Home' ? '🏠' : t === 'Work' ? '🏢' : '📌'} {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 p-6">
                            <h2 className="text-lg font-black text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                                <CreditCard size={20} className="text-red-500" /> Payment Method
                            </h2>
                            <div className="space-y-3">
                                {PAYMENT_METHODS.map(method => (
                                    <div key={method.id}>
                                        <button
                                            onClick={() => { setPaymentMethod(method.id); if (method.subOptions[0]) setPaymentSubOption(method.subOptions[0].id); }}
                                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === method.id ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-neutral-200 dark:border-slate-700'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === method.id ? 'border-red-500' : 'border-neutral-300'}`}>
                                                {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                                            </div>
                                            <method.icon size={20} className={paymentMethod === method.id ? 'text-red-500' : 'text-neutral-400'} />
                                            <div className="flex-1">
                                                <p className={`font-bold text-sm ${paymentMethod === method.id ? 'text-red-600 dark:text-red-400' : 'text-neutral-800 dark:text-white'}`}>{method.label}</p>
                                                <p className="text-xs text-neutral-500">{method.subtitle}</p>
                                            </div>
                                        </button>

                                        {/* Sub-options */}
                                        {paymentMethod === method.id && method.subOptions.length > 0 && (
                                            <div className="mt-2 ml-4 flex flex-wrap gap-2">
                                                {method.subOptions.map(sub => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => { setPaymentSubOption(sub.id); if (method.id === 'emi') setEmiTenure(sub.id); }}
                                                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${paymentSubOption === sub.id ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-600' : 'border-neutral-200 dark:border-slate-700 text-neutral-500'}`}
                                                    >
                                                        {sub.icon} {sub.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* UPI ID input */}
                                        {paymentMethod === 'upi' && paymentMethod === method.id && (
                                            <div className="mt-3 ml-4">
                                                <input
                                                    value={upiId}
                                                    onChange={e => setUpiId(e.target.value)}
                                                    placeholder="Enter UPI ID (e.g., name@upi)"
                                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                                />
                                            </div>
                                        )}

                                        {/* Card inputs */}
                                        {paymentMethod === 'card' && paymentMethod === method.id && (
                                            <div className="mt-3 ml-4 space-y-3">
                                                <input
                                                    value={cardNumber}
                                                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                    placeholder="Card Number"
                                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        value={cardExpiry}
                                                        onChange={e => setCardExpiry(e.target.value)}
                                                        placeholder="MM / YY"
                                                        className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                                    />
                                                    <input
                                                        value={cardCVV}
                                                        onChange={e => setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                                        placeholder="CVV"
                                                        type="password"
                                                        className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT: Order Summary + CTAs */}
                    <div className="space-y-5 xl:sticky xl:top-28">
                        {/* Payment Mode */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 p-6">
                            <h3 className="text-base font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <Percent size={18} className="text-red-500" /> Payment Plan
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setPaymentMode('full')}
                                    className={`p-4 rounded-xl border-2 text-center transition-all ${paymentMode === 'full' ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-neutral-200 dark:border-slate-700'}`}
                                >
                                    <p className={`text-xs font-black uppercase mb-1 ${paymentMode === 'full' ? 'text-red-600 dark:text-red-400' : 'text-neutral-500'}`}>Full Payment</p>
                                    <p className={`text-lg font-black ${paymentMode === 'full' ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-white'}`}>
                                        ₹{cartTotal.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-neutral-400 mt-0.5">Pay 100% now</p>
                                </button>
                                <button
                                    onClick={() => setPaymentMode('advance')}
                                    className={`p-4 rounded-xl border-2 text-center transition-all ${paymentMode === 'advance' ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-neutral-200 dark:border-slate-700'}`}
                                >
                                    <p className={`text-xs font-black uppercase mb-1 ${paymentMode === 'advance' ? 'text-red-600 dark:text-red-400' : 'text-neutral-500'}`}>10% Advance</p>
                                    <p className={`text-lg font-black ${paymentMode === 'advance' ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-white'}`}>
                                        ₹{advanceAmount.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-neutral-400 mt-0.5">Reserve your slot</p>
                                </button>
                            </div>
                            {paymentMode === 'advance' && (
                                <div className="mt-3 flex items-start gap-2 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20">
                                    <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-amber-700 dark:text-amber-400">Remaining ₹{(cartTotal - advanceAmount).toLocaleString()} to be paid 7 days before the event.</p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 p-6">
                            <h3 className="text-base font-black text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-red-500" /> Order Summary
                            </h3>

                            <div className="space-y-3 mb-4">
                                {cartItems.map(item => (
                                    <div key={item.vendorId} className="flex justify-between items-center text-sm">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-neutral-900 dark:text-white truncate">{item.vendorName}</p>
                                            <p className="text-xs text-neutral-500">{item.selectedPackage} Package{item.eventDate ? ` • ${new Date(item.eventDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}</p>
                                        </div>
                                        <span className="font-bold text-neutral-900 dark:text-white ml-3">₹{item.packagePrice.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon */}
                            <div className="border-t border-neutral-100 dark:border-slate-800 pt-4 mb-4">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            value={coupon}
                                            onChange={e => setCoupon(e.target.value.toUpperCase())}
                                            placeholder="Coupon code"
                                            disabled={couponApplied}
                                            className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none disabled:opacity-60"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (couponApplied) { setCouponApplied(false); setCoupon(''); toast('Coupon removed.'); return; }
                                            if (coupon === 'EASE10') { setCouponApplied(true); toast.success('Coupon applied! 5% off.'); }
                                            else toast.error('Invalid coupon code.');
                                        }}
                                        className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${couponApplied ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'}`}
                                    >
                                        {couponApplied ? '✓ Applied' : 'Apply'}
                                    </button>
                                </div>
                                {couponApplied && <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-1.5 flex items-center gap-1"><CheckCircle size={12} /> EASE10 – 5% discount applied</p>}
                            </div>

                            <div className="space-y-2 border-t border-neutral-100 dark:border-slate-800 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 font-medium">Subtotal ({cartItems.length} vendors)</span>
                                    <span className="font-bold text-neutral-900 dark:text-white">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                {paymentMode === 'advance' && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500 font-medium">Advance (10%)</span>
                                        <span className="font-bold text-amber-600">-₹{(cartTotal - advanceAmount).toLocaleString()}</span>
                                    </div>
                                )}
                                {couponApplied && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600 font-medium">Coupon (EASE10)</span>
                                        <span className="font-bold text-green-600">-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 font-medium">Platform Fee</span>
                                    <span className="font-bold text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-lg font-black pt-2 border-t border-neutral-200 dark:border-slate-800">
                                    <span className="text-neutral-900 dark:text-white">Payable Now</span>
                                    <span className="text-red-600">₹{payableAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <button
                            onClick={handlePlaceOrder}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all shadow-lg shadow-red-500/25 active:scale-[0.98]"
                        >
                            <CreditCard size={20} />
                            Pay & Continue Booking
                        </button>
                        <button
                            onClick={handleSaveForLater}
                            className="w-full border-2 border-neutral-200 dark:border-slate-700 text-neutral-700 dark:text-slate-300 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:border-neutral-400 transition-all"
                        >
                            Save Booking for Later
                        </button>

                        <p className="text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                            <CheckCircle size={12} className="text-green-500" />
                            Secured by Razorpay · 100% Safe Checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCart;
