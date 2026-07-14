import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Download, PartyPopper, Clock, Users, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingConfirmation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState('');

    const { eventName, date, time, guests, package: pkg, occasion, addons, total, isEmi } = location.state || {
        eventName: 'Exclusive Event', date: 'TBD', time: 'TBD', guests: '0', package: 'Standard', occasion: 'Event', addons: [], total: 0, isEmi: false
    };

    useEffect(() => {
        if (!location.state) {
            navigate('/');
        }
        setBookingId(`AIRION-${Math.floor(Math.random() * 900000) + 100000}`);
    }, [location.state, navigate]);

    if (!location.state) return null;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 flex items-center justify-center p-4 pt-24 pb-12 relative overflow-hidden transition-colors">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-4xl w-full relative z-10"
            >
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-neutral-200 dark:border-slate-800 flex flex-col md:flex-row">

                    {/* Left Side: Celebration Hero */}
                    <div className="md:w-5/12 bg-neutral-900 dark:bg-slate-800 p-8 md:p-12 text-white flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className="bg-green-500 w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                        >
                            <CheckCircle size={48} className="text-white" />
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">Booking Confirmed!</h1>
                        <p className="text-neutral-300 font-medium mb-8 text-lg">Your {occasion || 'event'} is officially secured.</p>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-full border border-white/10">
                            <p className="text-sm text-neutral-400 font-medium mb-1 uppercase tracking-wider">Booking ID</p>
                            <p className="text-white font-mono font-bold text-2xl tracking-widest">{bookingId}</p>
                        </div>
                    </div>

                    {/* Right Side: Invoice & Details */}
                    <div className="md:w-7/12 p-8 md:p-12 bg-white dark:bg-slate-900 flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                                <FileText className="text-red-500" /> Itinerary Summary
                            </h2>
                        </div>

                        <div className="space-y-6 grow">
                            <div className="flex items-start gap-4">
                                <div className="bg-red-50 dark:bg-slate-800 p-3.5 rounded-2xl text-red-500 dark:text-red-400 shrink-0">
                                    <PartyPopper size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">Event details</p>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">{eventName}</h3>
                                    <p className="text-neutral-600 dark:text-slate-300 font-medium">{pkg} Package {addons?.length > 0 ? `+ ${addons.length} Add-ons` : ''}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-neutral-50 dark:bg-slate-800 p-3 rounded-xl text-neutral-600 dark:text-slate-300 shrink-0">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">Date</p>
                                        <p className="font-bold text-neutral-900 dark:text-white">{date}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-neutral-50 dark:bg-slate-800 p-3 rounded-xl text-neutral-600 dark:text-slate-300 shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">Time</p>
                                        <p className="font-bold text-neutral-900 dark:text-white">{time}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-neutral-50 dark:bg-slate-800 p-3 rounded-xl text-neutral-600 dark:text-slate-300 shrink-0">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">Guests</p>
                                        <p className="font-bold text-neutral-900 dark:text-white">{guests}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-neutral-50 dark:bg-slate-800 p-3 rounded-xl text-neutral-600 dark:text-slate-300 shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">Location</p>
                                        <p className="font-bold text-neutral-900 dark:text-white">To be finalized</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t-2 border-dashed border-neutral-200 dark:border-slate-800 my-6"></div>

                            <div className="flex justify-between items-end bg-neutral-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-neutral-100 dark:border-slate-800">
                                <div>
                                    <p className="text-sm text-neutral-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Total Paid</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </div>
                                        <p className="text-xs font-medium text-green-600 dark:text-green-400">Payment Successful {isEmi && '(EMI mode)'}</p>
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-neutral-900 dark:text-white">
                                    ₹{total?.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button className="flex-1 border-2 border-neutral-200 dark:border-slate-700  dark: py-4 rounded-xl font-bold text-neutral-700 dark:text-slate-300 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center gap-2 transition-all">
                                <Download size={18} />
                                Invoice
                            </button>
                            <Link to="/dashboard/bookings" className="flex-1 bg-red-600 hover:bg-neutral-900 dark:hover:bg-white text-white dark:hover:text-neutral-900 py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]">
                                View Bookings
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-neutral-500 dark:text-slate-400 font-medium">
                    A detailed receipt has been sent to your email.
                </div>
            </motion.div>
        </div>
    );
};

export default BookingConfirmation;
