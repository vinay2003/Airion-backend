import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Download } from 'lucide-react';

const BookingConfirmation: React.FC = () => {
    const location = useLocation();
    const { eventName, date, time, price } = location.state || {
        eventName: 'Event', date: 'TBD', time: 'TBD', guests: '0', price: '0'
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-3xl w-full relative z-10">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row">
                    {/* Left Side: Celebration */}
                    <div className="md:w-2/5 bg-gradient-to-br from-red-500 to-red-600 p-8 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                        <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mb-6 backdrop-blur-md shadow-lg animate-bounce-slow">
                            <CheckCircle size={48} className="text-white" />
                        </div>

                        <h1 className="text-3xl font-bold mb-2">Woohoo!</h1>
                        <p className="text-red-100 font-medium mb-6">Your booking is confirmed.</p>

                        <div className="text-sm text-red-100/80">
                            Booking ID
                            <div className="text-white font-mono font-bold text-lg tracking-wider mt-1">
                                #AIRION-{Math.floor(Math.random() * 10000)}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Details */}
                    <div className="md:w-3/5 p-8 md:p-10 bg-white dark:bg-slate-900">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Booking Details</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-red-500 dark:text-red-400">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Event</p>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{eventName}</h3>
                                    <p className="text-gray-600 dark:text-slate-300">{date} at {time}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-500 dark:text-blue-400">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Location</p>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mumbai, India</h3>
                                    <p className="text-gray-600 dark:text-slate-300">View on Map</p>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-gray-200 dark:border-slate-700 my-6"></div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Total Amount</p>
                                    <p className="text-xs text-gray-400">Including taxes</p>
                                </div>
                                <div className="text-2xl font-bold text-red-500 dark:text-red-400">{price}</div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button className="flex-1 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 py-3.5 rounded-xl font-bold text-gray-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors">
                                <Download size={18} />
                                Invoice
                            </button>
                            <Link to="/" className="flex-1 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 py-3.5 rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg">
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* What's Next */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                        A confirmation email has been sent to your registered email address.
                        <br />
                        Need help? <Link to="/contact" className="text-red-500 hover:underline">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
