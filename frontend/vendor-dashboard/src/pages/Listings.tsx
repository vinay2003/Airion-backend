import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Star, Edit2, Trash2 } from 'lucide-react';

const Listings: React.FC = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch('http://localhost:3001/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch listings');
                }
                const data = await response.json();
                setListings(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
            case 'Under Review':
                return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
            default:
                return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400';
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Listings</h1>
                    <p className="text-gray-500 dark:text-slate-400">Manage your venues and services</p>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all hover:scale-105 transform">
                    <Plus size={20} />
                    Add New Listing
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <div key={listing.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 group hover:shadow-lg transition-all hover:-translate-y-1 transform duration-300">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={listing.image}
                                alt={listing.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className={`absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-md ${getStatusColor(listing.status || 'Active')}`}>
                                {listing.status || 'Active'}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">{listing.title}</h3>
                                <div className="flex items-center gap-1 text-sm">
                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-gray-900 dark:text-white">{listing.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 dark:text-slate-400 text-sm mb-1">
                                <MapPin size={16} />
                                {listing.location}
                            </div>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">{listing.reviews} reviews</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                                <span className="font-bold text-gray-900 dark:text-white text-lg">{listing.price}</span>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Listings;
