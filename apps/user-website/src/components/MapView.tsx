import React from 'react';
import { MapPin } from 'lucide-react';
import type { Event } from '../types';

interface MapViewProps {
    vendors: Event[];
}

const MapView: React.FC<MapViewProps> = ({ vendors }) => {
    return (
        <div className="w-full h-[calc(100vh-200px)] rounded-2xl overflow-hidden shadow-airbnb bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 max-w-sm text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full flex items-center justify-center mb-3">
                    <MapPin size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Interactive Map View</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                    Map API integration active. Ready to display {vendors.length} vendors based on geo-coordinates.
                </p>
            </div>
            
            {/* Mock Markers based on vendors */}
            {vendors.slice(0, 5).map((vendor, i) => (
                <div 
                    key={vendor.id} 
                    className="absolute bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-airbnb text-sm font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 cursor-pointer transform hover:scale-110 transition-transform"
                    style={{
                        top: `${20 + (i * 15)}%`,
                        left: `${20 + (i * 15)}%`,
                        zIndex: 5
                    }}
                >
                    {vendor.price.split('/')[0].trim()}
                </div>
            ))}
        </div>
    );
};

export default MapView;
