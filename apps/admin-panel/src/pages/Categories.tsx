import React, { useState } from 'react';
import { Search, Plus, MapPin, Grid, Languages, Edit2, Trash2, MoreVertical, Map } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    name: string;
    vendorsCount: number;
    status: 'Active' | 'Inactive';
}

interface Location {
    id: string;
    city: string;
    state: string;
    vendorsCount: number;
    status: 'Active' | 'Inactive';
}

const Categories: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'categories' | 'locations' | 'languages'>('categories');
    
    // Mock Data
    const [categories, setCategories] = useState<Category[]>([
        { id: '1', name: 'Venue', vendorsCount: 45, status: 'Active' },
        { id: '2', name: 'Photography', vendorsCount: 120, status: 'Active' },
        { id: '3', name: 'Makeup Artist', vendorsCount: 85, status: 'Active' },
        { id: '4', name: 'Decor', vendorsCount: 30, status: 'Active' },
        { id: '5', name: 'Catering', vendorsCount: 50, status: 'Inactive' },
    ]);

    const [locations, setLocations] = useState<Location[]>([
        { id: '1', city: 'Mumbai', state: 'Maharashtra', vendorsCount: 150, status: 'Active' },
        { id: '2', city: 'Delhi', state: 'Delhi', vendorsCount: 200, status: 'Active' },
        { id: '3', city: 'Bangalore', state: 'Karnataka', vendorsCount: 120, status: 'Active' },
    ]);

    const handleDeleteCategory = (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
        toast.success('Category deleted');
    };

    const handleDeleteLocation = (id: string) => {
        setLocations(prev => prev.filter(l => l.id !== id));
        toast.success('Location deleted');
    };

    return (
        <div className="fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">System Data</h1>
                    <p className="text-sm font-medium text-[var(--ease2event-text-secondary)] mt-1">Manage categories, regions and languages</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                    <Plus size={18} />
                    <span>Add New {activeTab === 'categories' ? 'Category' : activeTab === 'locations' ? 'Location' : 'Language'}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-slate-800 pb-px">
                <button 
                    onClick={() => setActiveTab('categories')}
                    className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'categories' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <Grid size={18} /> Service Categories
                </button>
                <button 
                    onClick={() => setActiveTab('locations')}
                    className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'locations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <MapPin size={18} /> Regions & Locations
                </button>
                <button 
                    onClick={() => setActiveTab('languages')}
                    className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'languages' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <Languages size={18} /> Languages
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(category => (
                        <div key={category.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
                                    {category.name[0]}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDeleteCategory(category.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.name}</h3>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                                <span className="text-sm font-medium text-gray-500">{category.vendorsCount} Vendors</span>
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${category.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {category.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'locations' && (
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">City</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">State</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Active Vendors</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {locations.map((loc) => (
                                <tr key={loc.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span className="font-bold text-gray-900 dark:text-white">{loc.city}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{loc.state}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Map size={14} className="text-indigo-400" />
                                            <span className="font-bold text-gray-900 dark:text-white">{loc.vendorsCount}</span> mapped
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${loc.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {loc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 rounded-lg text-gray-500 transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDeleteLocation(loc.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'languages' && (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-800 border-dashed">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Languages size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Language Localization</h3>
                    <p className="text-sm text-gray-500 max-w-md">Currently the platform operates in English (Default). Add additional languages here to support localization for Vendors and Users.</p>
                    <button className="mt-6 px-6 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        Configure Languages
                    </button>
                </div>
            )}
        </div>
    );
};

export default Categories;
