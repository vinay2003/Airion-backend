import React, { useState } from 'react';
import { Map, Search, Calendar, Users, MapPin } from 'lucide-react';

const FilterSidebar: React.FC = () => {
    const [priceRange, setPriceRange] = useState(50000);
    const [locationInput, setLocationInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Mock data for city suggestions
    const cities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune',
        'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
        'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Ranchi',
        'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi', 'Srinagar',
        'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Howrah', 'Gwalior',
        'Jabalpur', 'Coimbatore', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Chandigarh', 'Guntur',
        'Guwahati', 'Solapur', 'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh',
        'Tiruppur', 'Gurgaon', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal', 'Mira-Bhayandar',
        'Jalgaon', 'Gota', 'Panjim', 'Pondicherry'
    ];

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocationInput(value);
        if (value.length > 0) {
            const filtered = cities.filter(city =>
                city.toLowerCase().startsWith(value.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectLocation = (city: string) => {
        setLocationInput(city);
        setShowSuggestions(false);
    };

    const openMap = () => {
        // ... (existing openMap logic)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    window.open(
                        `https://www.google.com/maps/search/event+venues/@${latitude},${longitude},14z`,
                        '_blank'
                    );
                },
                () => {
                    window.open('https://www.google.com/maps/search/event+venues+india/', '_blank');
                }
            );
        } else {
            window.open('https://www.google.com/maps/search/event+venues+india/', '_blank');
        }
    };

    return (
        <div className="space-y-6 pb-20 relative">
            {/* Map Snippet */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl overflow-hidden relative h-32 border border-blue-100 dark:border-blue-800 cursor-pointer group shadow-sm">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button
                        onClick={openMap}
                        className="bg-white dark:bg-slate-900 text-red-500 dark:text-red-400 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg group-hover:scale-105 transition-transform flex items-center gap-2"
                    >
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
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-neutral-200/60 dark:border-slate-800 shadow-sm relative z-20">
                <h3 className="font-extrabold text-neutral-900 dark:text-white mb-3">Location</h3>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search city, region..."
                        value={locationInput}
                        onChange={handleLocationChange}
                        onFocus={() => locationInput.length > 0 && setShowSuggestions(true)}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-200/80 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm text-neutral-900 dark:text-white transition-all font-medium"
                    />

                    {/* Suggestions List */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {suggestions.map((city, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => selectLocation(city)}
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-neutral-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-3"
                                >
                                    <MapPin size={14} className="opacity-40" />
                                    {city}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Date Picker */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-neutral-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="font-extrabold text-neutral-900 dark:text-white mb-3">Event Date</h3>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-neutral-200/80 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm text-neutral-900 dark:text-white transition-all font-medium"
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
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-neutral-200/60 dark:border-slate-800 shadow-sm mb-6">
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

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
                <button
                    onClick={() => window.location.reload()} // Simplified apply action
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <Search size={18} />
                    Apply Filters
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full py-4 bg-transparent border-2 border-neutral-100 dark:border-slate-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-200 dark:hover:border-slate-700 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;

