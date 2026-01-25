import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventName: string;
    price: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, eventName, price }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: '',
        package: 'Silver',
        isEmi: false,
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            navigate('/booking-confirmation', { state: { ...formData, eventName, price } });
        }, 1000);
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

                    <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
