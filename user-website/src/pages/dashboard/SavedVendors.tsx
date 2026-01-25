import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedVendors: React.FC = () => {
    // Mock Data (reusing similar structure)
    const saved = [
        { id: '4', title: 'Royal Palace', category: 'Weddings', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop', rating: 4.7, location: 'Jaipur' },
        { id: '7', title: 'Rooftop Lounge', category: 'Parties', image: 'https://images.unsplash.com/photo-1570872626485-d8ffea69f463?q=80&w=1000&auto=format&fit=crop', rating: 4.8, location: 'Mumbai' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Vendors</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {saved.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 group">
                        <div className="h-48 relative">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-sm">
                                <Heart size={16} fill="currentColor" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                    <p className="text-xs text-gray-500">{item.category}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-500/20 px-2 py-1 rounded-lg">
                                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{item.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 dark:text-slate-400 text-sm mb-4">
                                <MapPin size={14} />
                                {item.location}
                            </div>
                            <Link to={`/event/${item.id}`} className="block text-center w-full py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-sm font-bold text-gray-900 dark:text-white transition-colors">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedVendors;
