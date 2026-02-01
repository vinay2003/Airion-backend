import React from 'react';
import { Map, Search } from 'lucide-react';

const FilterSidebar: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Map Snippet */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl overflow-hidden relative h-32 border border-blue-100 dark:border-blue-800 cursor-pointer group">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button className="bg-white dark:bg-slate-900 text-red-500 dark:text-red-400 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg group-hover:scale-105 transition-transform flex items-center gap-2">
                        <Map size={16} />
                        View on Map
                    </button>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                    alt="Map"
                    className="w-full h-full object-cover opacity-60 dark:opacity-40 transition-opacity group-hover:opacity-70"
                />
            </div>

            {/* Search Filter */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Search size={18} className="text-red-500" />
                    Search
                </h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search venues..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm text-gray-900 dark:text-white transition-all"
                    />
                </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price Range</h3>
                <div className="space-y-3">
                    {['₹0 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹2,00,000', '₹2,00,000+'].map((range, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" className="peer h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-500 transition-all" />
                            </div>
                            <span className="text-gray-600 dark:text-slate-400 text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{range}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Star Rating</h3>
                <div className="space-y-3">
                    {[5, 4, 3].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-500 transition-all" />
                            <span className="text-gray-600 dark:text-slate-400 text-sm flex items-center gap-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                {rating} Stars
                                <span className="text-yellow-400">★</span>
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Amenities Filter */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Amenities</h3>
                <div className="space-y-3">
                    {['Wifi', 'Parking', 'AC', 'Pool', 'Bar', 'Catering', 'Decor'].map((amenity) => (
                        <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-500 transition-all" />
                            <span className="text-gray-600 dark:text-slate-400 text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
