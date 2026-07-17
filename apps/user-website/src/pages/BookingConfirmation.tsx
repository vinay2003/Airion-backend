import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Calendar, MapPin, Download, PartyPopper, Clock,
    Users, FileText, Share2, Phone, MessageSquare, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const BookingConfirmation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState('');

    const {
        eventName, date, time, guests, package: pkg, occasion, addons, total,
        isEmi, isMerchandise, orderTotal, paymentMethod, emiTenure,
        vendorCount, isAdvancePayment, razorpayPaymentId
    } = location.state || {
        eventName: 'Exclusive Event', date: 'TBD', time: 'TBD', guests: '0',
        package: 'Standard', occasion: 'Event', addons: [], total: 0, isEmi: false
    };

    const finalTotal = isMerchandise ? orderTotal : total;
    const finalMethodLabel =
        paymentMethod === 'wallet' ? 'Ease2Event Wallet' :
        paymentMethod === 'emi' ? `EMI (${emiTenure} Months)` :
        paymentMethod === 'upi' ? 'UPI' :
        paymentMethod === 'netbanking' ? 'Net Banking' :
        'Credit / Debit Card';

    useEffect(() => {
        if (!location.state) { navigate('/'); return; }
        setBookingId(isMerchandise
            ? `ORD-${Math.floor(Math.random() * 900000) + 100000}`
            : `E2E-${Math.floor(Math.random() * 900000) + 100000}`
        );
    }, [location.state, navigate, isMerchandise]);

    if (!location.state) return null;

    const handleShareWhatsApp = () => {
        const msg = encodeURIComponent(`🎉 My booking is confirmed!\n\nBooking ID: ${bookingId}\nEvent: ${eventName}\nDate: ${date}\nPayment: ₹${finalTotal?.toLocaleString()}\n\nPowered by Ease2Event`);
        window.open(`https://wa.me/?text=${msg}`, '_blank');
    };

    const handleShareEmail = () => {
        const subject = encodeURIComponent(`Booking Confirmation – ${bookingId}`);
        const body = encodeURIComponent(`Booking ID: ${bookingId}\nEvent: ${eventName}\nDate: ${date}\nTotal: ₹${finalTotal?.toLocaleString()}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    };

    const handleDownloadInvoice = () => {
        const win = window.open('', '_blank');
        if (!win) return;
        win.document.write(`
            <html><head><title>Invoice – ${bookingId}</title>
            <style>
                body{font-family:system-ui,sans-serif;padding:40px;color:#111}
                .logo{font-size:22px;font-weight:900;color:#dc2626}
                h1{font-size:28px;font-weight:900;margin:0}
                table{width:100%;border-collapse:collapse;margin:24px 0}
                th{background:#f9fafb;padding:12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280}
                td{padding:12px;border-bottom:1px solid #f3f4f6;font-size:14px}
                .total{font-size:20px;font-weight:900;color:#dc2626}
                .footer{margin-top:40px;color:#9ca3af;font-size:12px;text-align:center}
            </style></head>
            <body>
                <div style="display:flex;justify-content:space-between;border-bottom:2px solid #f3f4f6;padding-bottom:20px;margin-bottom:32px">
                    <div class="logo">Ease2Event</div>
                    <div><h1>INVOICE</h1><p style="color:#6b7280;margin:4px 0">#${bookingId}</p></div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px">
                    <div><p style="font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase">Event Details</p><p style="font-weight:700">${eventName}</p><p style="color:#6b7280">Date: ${date} at ${time}</p></div>
                    <div><p style="font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase">Payment</p><p style="font-weight:700">${finalMethodLabel}</p><p style="color:#6b7280">${isAdvancePayment ? '10% Advance Paid' : 'Full Payment'}</p></div>
                </div>
                <table><thead><tr><th>Description</th><th>Package</th><th>Guests</th><th style="text-align:right">Amount</th></tr></thead>
                <tbody><tr><td>${eventName}</td><td>${pkg}</td><td>${guests}</td><td style="text-align:right;font-weight:700">₹${finalTotal?.toLocaleString()}</td></tr></tbody></table>
                <div style="text-align:right"><p class="total">Total: ₹${finalTotal?.toLocaleString()}</p></div>
                <div class="footer"><p>Thank you for choosing Ease2Event for your special event.</p><p>This is a computer-generated invoice. No signature required.</p></div>
                <script>window.onload=()=>window.print();</script>
            </body></html>
        `);
        win.document.close();
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 flex items-center justify-center p-4 pt-24 pb-16 relative overflow-hidden transition-colors">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-4xl w-full relative z-10"
            >
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-neutral-200 dark:border-slate-800 flex flex-col md:flex-row">

                    {/* Left: Celebration */}
                    <div className="md:w-5/12 bg-neutral-900 dark:bg-slate-800 p-8 md:p-12 text-white flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                            className="bg-green-500 w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                        >
                            <CheckCircle size={48} className="text-white" />
                        </motion.div>

                        <h1 className="text-3xl font-black mb-2 tracking-tight">
                            {isMerchandise ? 'Order Placed!' : 'Booking Confirmed!'}
                        </h1>
                        <p className="text-neutral-300 font-medium text-sm mb-8">
                            {isMerchandise ? 'Your event gear is on its way.' :
                                isAdvancePayment
                                    ? `10% advance secured for your ${occasion || 'event'}.`
                                    : `Your ${occasion || 'event'} is officially secured.`
                            }
                        </p>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-full border border-white/10 mb-4">
                            <p className="text-[10px] text-neutral-400 font-bold mb-1 uppercase tracking-wider">
                                {isMerchandise ? 'Order ID' : 'Booking ID'}
                            </p>
                            <p className="text-white font-mono font-bold text-xl tracking-widest">{bookingId}</p>
                        </div>

                        {vendorCount > 1 && (
                            <div className="bg-white/10 rounded-xl p-3 w-full border border-white/10">
                                <p className="text-xs text-neutral-400">Vendors booked</p>
                                <p className="font-black text-xl">{vendorCount}</p>
                            </div>
                        )}

                        {isAdvancePayment && (
                            <div className="mt-4 bg-amber-500/20 rounded-xl p-3 w-full border border-amber-400/20">
                                <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-1">Advance Paid</p>
                                <p className="text-amber-200 text-sm font-bold">Remaining due 7 days before event</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="md:w-7/12 p-8 md:p-10 bg-white dark:bg-slate-900 flex flex-col">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3 mb-6">
                            <FileText className="text-red-500" />
                            {isMerchandise ? 'Receipt Summary' : 'Booking Summary'}
                        </h2>

                        <div className="space-y-5 grow">
                            {/* Event details */}
                            {!isMerchandise && (
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: PartyPopper, label: 'Event', value: eventName },
                                        { icon: Calendar, label: 'Date', value: date },
                                        { icon: Clock, label: 'Time', value: time },
                                        { icon: Users, label: 'Guests', value: guests },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex items-start gap-3">
                                            <div className="bg-neutral-50 dark:bg-slate-800 p-2.5 rounded-xl text-neutral-600 dark:text-slate-300 shrink-0">
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{label}</p>
                                                <p className="font-bold text-neutral-900 dark:text-white text-sm">{value || 'TBD'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Status banner */}
                            <div className="flex items-center gap-3 bg-green-50 dark:bg-green-500/10 p-4 rounded-2xl border border-green-100 dark:border-green-500/20">
                                <CheckCircle size={20} className="text-green-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-green-800 dark:text-green-300">Status: Confirmed</p>
                                    <p className="text-xs text-green-600 dark:text-green-400">Confirmation email & SMS sent to your registered contact.</p>
                                </div>
                            </div>

                            {/* Payment total */}
                            <div className="flex justify-between items-center bg-neutral-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-neutral-100 dark:border-slate-800">
                                <div>
                                    <p className="text-sm text-neutral-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
                                        {isAdvancePayment ? 'Advance Paid' : 'Total Paid'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="animate-ping inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
                                        <p className="text-[11px] font-bold text-green-600 dark:text-green-400">via {finalMethodLabel}</p>
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-neutral-900 dark:text-white">
                                    ₹{finalTotal?.toLocaleString()}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleDownloadInvoice}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-neutral-200 dark:border-slate-700 text-neutral-700 dark:text-slate-300 font-bold text-sm hover:border-neutral-400 transition-all"
                                >
                                    <Download size={16} /> Download Invoice
                                </button>
                                <Link
                                    to={isMerchandise ? '/merchandise' : '/dashboard/bookings'}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-100 dark:bg-slate-800 text-neutral-900 dark:text-white font-bold text-sm hover:bg-neutral-200 transition-all"
                                >
                                    <Eye size={16} /> View My Bookings
                                </Link>
                                <button
                                    onClick={handleShareWhatsApp}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 font-bold text-sm hover:bg-green-100 transition-all"
                                >
                                    <Share2 size={16} /> Share on WhatsApp
                                </button>
                                <button
                                    onClick={handleShareEmail}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-bold text-sm hover:bg-blue-100 transition-all"
                                >
                                    <MessageSquare size={16} /> Share via Email
                                </button>
                            </div>

                            <Link
                                to="/marketplace"
                                className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]"
                            >
                                Continue Exploring Vendors
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-neutral-500 dark:text-slate-400 font-medium text-sm">
                    A detailed receipt has been sent to your registered email & phone.
                </p>
            </motion.div>
        </div>
    );
};

export default BookingConfirmation;
