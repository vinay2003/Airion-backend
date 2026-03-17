import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { createBooking, createPaymentOrder, verifyPayment } from '../lib/api';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventName: string;
    price: string;
    vendorId: string; // Added vendor id needed for backend booking
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, eventName, price, vendorId }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: '',
        package: 'Silver',
        isEmi: false,
    });

    if (!isOpen) return null;

    const handlePayment = async (order: any, bookingId: string) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_xxxx', // Fallback or dynamic fetch from backend is better
            amount: order.amount,
            currency: "INR",
            name: "Airion Event Booking",
            description: `Payment for ${eventName}`,
            order_id: order.orderId,
            handler: async (response: any) => {
                setLoading(true);
                try {
                    await verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    }, bookingId);
                    
                    navigate('/booking-confirmation', { state: { ...formData, eventName, price } });
                } catch (error) {
                    alert('Payment Verification Failed');
                } finally {
                    setLoading(false);
                }
            },
            prefill: {
                name: "User",
                email: "user@example.com",
            },
            theme: {
                color: "#ef4444",
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
            const res = await createBooking({
                vendorId,
                totalAmount: numericPrice,
                eventDate: formData.date ? new Date(`${formData.date}T${formData.time || '12:00'}`) : undefined,
                specialRequirements: `Package: ${formData.package}. Standard Requirements.`
            });

            if (res.success && res.booking) {
                // Now create payment order
                const order = await createPaymentOrder(numericPrice, res.booking.id);
                handlePayment(order, res.booking.id);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to initiate booking or payment creation');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Booking</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400">One step away from your event</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500 dark:text-slate-400"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl flex items-center gap-4 border border-red-100 dark:border-red-900/30">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                            <CheckCircle className="text-green-500" size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold tracking-wider">Booking for</p>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">{eventName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Date</label>
                            <div className="relative group">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
                                <input
                                    type="date"
                                    required
                                    className="w-full pl-11 p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-900 dark:text-white"
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Time</label>
                            <div className="relative group">
                                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
                                <input
                                    type="time"
                                    required
                                    className="w-full pl-11 p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-900 dark:text-white"
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Guest Count</label>
                        <div className="relative group">
                            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
                            <input
                                type="number"
                                placeholder="e.g. 200"
                                required
                                className="w-full pl-11 p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Select Package</label>
                        <div className="relative">
                            <select
                                className="w-full p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-900 dark:text-white appearance-none"
                                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                            >
                                <option value="Silver">Silver Package - ₹50,000</option>
                                <option value="Gold">Gold Package - ₹1,00,000</option>
                                <option value="Platinum">Platinum Package - ₹2,00,000</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                id="emi"
                                className="peer w-5 h-5 text-red-500 rounded focus:ring-red-500 border-gray-300"
                                onChange={(e) => setFormData({ ...formData, isEmi: e.target.checked })}
                            />
                        </div>
                        <label htmlFor="emi" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 mb-0.5">
                                <CreditCard size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                                <span className="block font-bold text-gray-900 dark:text-white">Pay with EMI</span>
                            </div>
                            <span className="block text-xs text-gray-500 dark:text-slate-400">Starting at ₹4,500/month with 0% interest</span>
                        </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
