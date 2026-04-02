import React, { useState } from 'react';
import { Map, Search, Calendar, Users, MapPin } from 'lucide-react';

const FilterSidebar: React.FC = () => {
    const [priceRange, setPriceRange] = useState(50000);

    return (
        <div className="space-y-6">
            {/* Map Snippet */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl overflow-hidden relative h-32 border border-blue-100 dark:border-blue-800 cursor-pointer group shadow-sm">
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

            {/* Location Filter */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-neutral-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-neutral-900 dark:text-white mb-3">Location</h3>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search city, region..."
                        className="w-full pl-10 pr-4 py-3 border border-neutral-200/80 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm text-neutral-900 dark:text-white transition-all font-medium"
                    />
                </div>
            </div>

            {/* Date Picker */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-neutral-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-neutral-900 dark:text-white mb-3">Event Date</h3>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-neutral-200/80 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm text-neutral-900 dark:text-white transition-all font-medium text-neutral-400"
                    />
                </div>
            </div>

            {/* Event Type Filter */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-neutral-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-neutral-900 dark:text-white mb-4">Event Type</h3>
                <div className="space-y-3.5">
                    {['Wedding', 'Corporate', 'Birthday', 'Private Party', 'Engagement'].map((type, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="h-5 w-5 rounded border-neutral-300 dark:border-slate-600 text-red-500 focus:ring-red-500 transition-all dark:bg-slate-800" />
                            <span className="text-neutral-600 dark:text-slate-300 text-sm group-hover:text-neutral-900 dark:group-hover:text-white transition-colors font-medium">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-neutral-200/60 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-extrabold text-neutral-900 dark:text-white">Price Range</h3>
                    <span className="text-sm font-bold text-red-500">Max ₹{priceRange.toLocaleString()}</span>
                </div>
                <div className="px-2">
                    <input
                        type="range"
                        min="5000"
                        max="500000"
                        step="5000"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full accent-red-500 h-2 bg-neutral-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-medium text-neutral-400 mt-2">
                        <span>₹5K</span>
                        <span>₹500K+</span>
                    </div>
                </div>
            </div>

            {/* Guest Capacity Filter */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-neutral-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-neutral-900 dark:text-white mb-4">Guest Capacity</h3>
                <div className="space-y-3.5">
                    {[
                        { label: 'Small Intimate', range: '10 - 50 guests' },
                        { label: 'Medium Gathering', range: '50 - 200 guests' },
                        { label: 'Large Celebration', range: '200+ guests' }
                    ].map((cap, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="capacity" className="h-5 w-5 border-neutral-300 dark:border-slate-600 text-red-500 focus:ring-red-500 transition-all dark:bg-slate-800" />
                            <div className="flex flex-col">
                                <span className="text-neutral-900 dark:text-white text-sm font-medium">{cap.label}</span>
                                <span className="text-neutral-400 text-xs">{cap.range}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Amenities Filter */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-neutral-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-neutral-900 dark:text-white mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                    {['Wifi', 'Parking', 'AC', 'Pool', 'Bar', 'Catering', 'Decor', 'Stage'].map((amenity, idx) => (
                        <label key={idx} className="cursor-pointer group">
                            <input type="checkbox" className="hidden peer" />
                            <span className="inline-block px-4 py-2 bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 text-xs font-bold rounded-full peer-checked:bg-red-500 peer-checked:text-white transition-colors border border-transparent peer-checked:border-red-500 hover:bg-neutral-200 dark:hover:bg-slate-700">
                                {amenity}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;

