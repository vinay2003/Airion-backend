import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface Booking {
    id: string;
    venueName: string;
    image: string;
    date: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    price: string;
    guests: number;
    location: string;
}

const MyBookings: React.FC = () => {
    const bookings: Booking[] = [
        {
            id: '1',
            venueName: 'Grand Hotel Ballroom',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
            date: '2025-12-15',
            status: 'confirmed',
            price: '₹1,50,000',
            guests: 500,
            location: 'Mumbai'
        },
        {
            id: '2',
            venueName: 'Sunset Cafe',
            image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?q=80&w=1000&auto=format&fit=crop',
            date: '2025-11-20',
            status: 'completed',
            price: '₹25,000',
            guests: 50,
            location: 'Goa'
        }
    ];

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
            case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Bookings</h1>

            <div className="space-y-6">
                {bookings.map((booking) => (
                    <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-6"
                    >
                        <div className="md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={booking.image} alt={booking.venueName} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{booking.venueName}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-slate-400 mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-red-500" />
                                    <span>{booking.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-red-500" />
                                    <span>{booking.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-red-500" />
                                    <span>Guests: {booking.guests}</span>
                                </div>
                                <div className="font-bold text-gray-900 dark:text-white">
                                    Total: {booking.price}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors">
                                    View Details
                                </button>
                                {booking.status === 'confirmed' && (
                                    <button className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-sm font-bold transition-colors">
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;
