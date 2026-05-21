import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Search, Filter, ChevronRight, FileText } from 'lucide-react';

import { fetchMyBookings } from '../../lib/api';

const MyBookings: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const navigate = useNavigate();

    const tabs = ['All', 'Upcoming', 'Pending', 'Completed', 'Cancelled'];

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await fetchMyBookings();
                if (data && data.length > 0) {
                    setBookings(data);
                } else {
                    // Inject realistic mock bookings for UI visualization
                    setBookings([
                        {
                            id: '1',
                            bookingCode: 'E2E-847291',
                            eventDate: new Date(Date.now() + 864000000).toISOString(),
                            status: 'confirmed',
                            totalAmount: '250000',
                            vendor: { businessName: 'Royal Palace Events', city: 'Jaipur', portfolioImages: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80'] }
                        },
                        {
                            id: '2',
                            bookingCode: 'E2E-392104',
                            eventDate: new Date(Date.now() + 1728000000).toISOString(),
                            status: 'pending',
                            totalAmount: '45000',
                            vendor: { businessName: 'Aura Photography', city: 'Mumbai', portfolioImages: ['https://images.unsplash.com/photo-1614447413359-5f87a652a269?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBob3RvZ3JhcGh5JTIwZXhoaWJpdGlvbnxlbnwwfHwwfHx8MA%3D%3D'] }
                        },
                        {
                            id: '3',
                            bookingCode: 'E2E-109482',
                            eventDate: new Date(Date.now() - 2592000000).toISOString(),
                            status: 'completed',
                            totalAmount: '120000',
                            vendor: { businessName: 'Gourmet Catering Co.', city: 'Delhi', portfolioImages: ['https://images.unsplash.com/photo-1555244162-803834f70033?q=80'] }
                        },
                        {
                            id: '4',
                            bookingCode: 'E2E-558291',
                            eventDate: new Date(Date.now() - 500000000).toISOString(),
                            status: 'cancelled',
                            totalAmount: '80000',
                            vendor: { businessName: 'Elite Decorators', city: 'Bangalore', portfolioImages: ['https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fGRlY29yfGVufDB8fDB8fHww'] }
                        }
                    ]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed': return { bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-700 dark:text-green-400', label: 'Upcoming' };
            case 'pending': return { bg: 'bg-yellow-100 dark:bg-yellow-500/20', text: 'text-yellow-700 dark:text-yellow-400', label: 'Pending Payment' };
            case 'completed': return { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-400', label: 'Completed' };
            case 'cancelled': return { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-400', label: 'Cancelled' };
            default: return { bg: 'bg-neutral-100 dark:bg-slate-800', text: 'text-neutral-700 dark:text-slate-300', label: status };
        }
    };

    const handleDownloadInvoice = (booking: any) => {
        const invoiceHtml = `
            <html>
                <head>
                    <title>Invoice - ${booking.bookingCode}</title>
                    <style>
                        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 40px; color: #1a1a1a; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 40px; }
                        .logo { font-size: 24px; font-weight: 900; color: #ef4444; text-transform: uppercase; }
                        .invoice-info { text-align: right; }
                        .details { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                        .section-title { font-size: 10px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                        th { text-align: left; background: #f9fafb; padding: 12px; font-size: 12px; font-weight: 700; color: #4b5563; }
                        td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
                        .total-section { display: flex; justify-content: flex-end; }
                        .total-box { width: 250px; background: #1a1a1a; color: white; padding: 20px; border-radius: 12px; }
                        .footer { margin-top: 60px; text-align: center; color: #9ca3af; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">AAYOJAN</div>
                        <div class="invoice-info">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 900;">INVOICE</h1>
                            <p style="margin: 5px 0; color: #6b7280;">#${booking.bookingCode}</p>
                        </div>
                    </div>
                    <div class="details">
                        <div>
                            <div class="section-title">Billed To</div>
                            <div style="font-weight: 700;">${localStorage.getItem('ease2event_user_name') || 'Valued Customer'}</div>
                            <div style="color: #6b7280;">User Dashboard Access</div>
                        </div>
                        <div>
                            <div class="section-title">Vendor</div>
                            <div style="font-weight: 700;">${booking.vendor?.businessName}</div>
                            <div style="color: #6b7280;">${booking.vendor?.city}, India</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Event Date</th>
                                <th>Status</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Reservation for ${booking.vendor?.businessName}</td>
                                <td>${new Date(booking.eventDate).toLocaleDateString()}</td>
                                <td style="text-transform: capitalize;">${booking.status}</td>
                                <td style="text-align: right; font-weight: 700;">₹${parseFloat(booking.totalAmount).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="total-section">
                        <div class="total-box">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="font-size: 12px; opacity: 0.7;">Subtotal</span>
                                <span>₹${parseFloat(booking.totalAmount).toLocaleString()}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 20px; border-top: 1px solid rgba(255,255,255,0.1); pt: 10px;">
                                <span>Total</span>
                                <span>₹${parseFloat(booking.totalAmount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Thank you for choosing Aayojan for your special event.</p>
                        <p>This is a computer-generated invoice. No signature required.</p>
                    </div>
                    <script>window.onload = () => { window.print(); }</script>
                </body>
            </html>
        `;
        const win = window.open('', '_blank');
        win?.document.write(invoiceHtml);
        win?.document.close();
    };

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Upcoming') return b.status === 'confirmed';
        return b.status.toLowerCase() === activeTab.toLowerCase();
    });

    return (
        <div className="max-w-[1440px] mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white capitalize tracking-tight mb-2">My Bookings</h1>
                    <p className="text-neutral-500 dark:text-slate-400 font-medium tracking-wide">Manage your event reservations and invoices.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search booking ID..."
                        className="w-full pl-11 pr-4 py-3 border border-neutral-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold text-neutral-900 dark:text-white transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Custom Segmented Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-8 p-1 border-b border-neutral-200 dark:border-slate-800 pb-4">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md'
                            : 'bg-transparent text-neutral-500 dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredBookings.length > 0 ? filteredBookings.map((booking) => {
                        const style = getStatusStyles(booking.status);
                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                key={booking.id}
                                onClick={() => setSelectedBooking(booking)}
                                className="bg-white dark:bg-slate-800/50 rounded-3xl p-5 shadow-sm border border-neutral-300 dark:border-slate-800 hover:shadow-xl hover:border-red-500/30 transition-all duration-300 group flex flex-col sm:flex-row gap-6 cursor-pointer"
                            >
                                <div className="sm:w-48 h-40 sm:h-full rounded-2xl overflow-hidden shrink-0 relative">
                                    <img src={booking.vendor?.portfolioImages?.[0]} alt="Venue" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 ${style.bg.replace('bg-', 'bg-').split(' ')[0]} ${style.text.split(' ')[0]} bg-opacity-90`}>
                                        {style.label}
                                    </div>
                                </div>

                                <div className="flex-1 py-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs font-bold text-neutral-400 tracking-wider">#{booking.bookingCode}</p>
                                            <button className="text-neutral-400 hover:text-red-500 transition-colors">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-4 line-clamp-1">{booking.vendor?.businessName}</h3>

                                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-neutral-600 dark:text-slate-400 mb-6 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-red-500" />
                                                <span>{new Date(booking.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-red-500" />
                                                <span className="truncate">{booking.vendor?.city}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-slate-800/80">
                                        <div>
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Total</p>
                                            <p className="font-black text-neutral-900 dark:text-white text-lg">₹{parseFloat(booking.totalAmount).toLocaleString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownloadInvoice(booking);
                                                }}
                                                className="p-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors tooltip"
                                                title="Download Invoice"
                                            >
                                                <FileText size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedBooking(booking);
                                                }}
                                                className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white rounded-xl text-sm font-bold transition-colors">
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-slate-800/30 rounded-3xl border border-dashed border-neutral-200 dark:border-slate-700">
                            <div className="w-16 h-16 bg-neutral-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                <Filter size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No {activeTab.toLowerCase()} bookings found</h3>
                            <p className="text-neutral-500 font-medium max-w-sm mx-auto">You don't have any bookings matching this status right now.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Booking Detail Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-neutral-200 dark:border-slate-800"
                        >
                            <div className="h-48 sm:h-64 relative">
                                <img src={selectedBooking.vendor?.portfolioImages?.[0]} alt="Vendor" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="absolute top-6 right-6 w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                                >
                                    <ChevronRight className="rotate-180" size={24} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                    <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedBooking.vendor?.businessName}</h2>
                                    <p className="text-white/70 font-medium flex items-center gap-2 mt-1">
                                        <MapPin size={16} className="text-red-500" /> {selectedBooking.vendor?.city}
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Booking ID</p>
                                        <p className="font-bold text-neutral-900 dark:text-white">#{selectedBooking.bookingCode}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Event Date</p>
                                        <p className="font-bold text-neutral-900 dark:text-white">{new Date(selectedBooking.eventDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</p>
                                        <p className={`font-bold capitalize ${getStatusStyles(selectedBooking.status).text}`}>{selectedBooking.status}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Total Amount</p>
                                        <p className="font-black text-red-500 text-lg">₹{parseFloat(selectedBooking.totalAmount).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-neutral-50 dark:bg-slate-800/50 rounded-3xl border border-neutral-100 dark:border-slate-800">
                                    <h4 className="font-black text-neutral-900 dark:text-white mb-4 uppercase text-xs tracking-widest">Service Overview</h4>
                                    <p className="text-sm text-neutral-600 dark:text-slate-400 leading-relaxed">
                                        You have a confirmed reservation with {selectedBooking.vendor?.businessName}.
                                        Our synchronized protocol ensures all logistics are aligned for your event on {new Date(selectedBooking.eventDate).toLocaleDateString()}.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleDownloadInvoice(selectedBooking)}
                                        className="flex-1 py-4 bg-neutral-100 dark:bg-slate-800 text-neutral-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileText size={18} /> Download Invoice
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedBooking(null);
                                            navigate('/dashboard/inbox');
                                        }}
                                        className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-500/20">
                                        Contact Vendor
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyBookings;

