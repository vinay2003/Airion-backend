import React, { useState } from 'react';
import { Search, Plus, MapPin, Grid, Languages, Edit2, Trash2, Map, X } from 'lucide-react';
import { 
    useAdminCategories, 
    useCreateCategory, 
    useDeleteCategory, 
    useUpdateCategory, 
    useAdminLocations, 
    useCreateLocation, 
    useDeleteLocation, 
    useUpdateLocation 
} from '../hooks/useCategories';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    name: string;
    vendorsCount: number;
    isActive: boolean;
}

interface Location {
    id: string;
    city: string;
    state: string;
    vendorsCount: number;
    isActive: boolean;
}

const Categories: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'categories' | 'locations' | 'languages'>('categories');
    
    // Modals
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    // Form States
    const [categoryName, setCategoryName] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [city, setCity] = useState('');
    const [stateName, setStateName] = useState('');

    const { data: categories = [], isLoading: isLoadingCategories } = useAdminCategories();
    const { data: locations = [], isLoading: isLoadingLocations } = useAdminLocations();
    
    const createCategoryMutation = useCreateCategory();
    const createLocationMutation = useCreateLocation();
    const deleteCategoryMutation = useDeleteCategory();
    const deleteLocationMutation = useDeleteLocation();
    const updateCategoryMutation = useUpdateCategory();
    const updateLocationMutation = useUpdateLocation();

    const handleDeleteCategory = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            await deleteCategoryMutation.mutateAsync(id);
        }
    };

    const handleDeleteLocation = async (id: string) => {
        if (confirm('Are you sure you want to delete this location?')) {
            await deleteLocationMutation.mutateAsync(id);
        }
    };

    const toggleCategoryStatus = async (id: string, isActive: boolean) => {
        await updateCategoryMutation.mutateAsync({ id, data: { isActive } });
    };

    const toggleLocationStatus = async (id: string, isActive: boolean) => {
        await updateLocationMutation.mutateAsync({ id, data: { isActive } });
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName.trim()) return toast.error('Enter category name');

        try {
            await createCategoryMutation.mutateAsync({
                name: categoryName.trim(),
                sortOrder: sortOrder ? parseInt(sortOrder) : 0,
            });
            setIsCategoryModalOpen(false);
            setCategoryName('');
            setSortOrder('');
        } catch (err) {
            // Hook handles toasts
        }
    };

    const handleCreateLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim() || !stateName.trim()) return toast.error('Enter both city and state');

        try {
            await createLocationMutation.mutateAsync({
                city: city.trim(),
                state: stateName.trim(),
            });
            setIsLocationModalOpen(false);
            setCity('');
            setStateName('');
        } catch (err) {
            // Hook handles toasts
        }
    };

    return (
        <div className="fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">System Data</h1>
                    <p className="text-sm font-medium text-[var(--ease2event-text-secondary)] mt-1">Manage categories, regions and languages</p>
                </div>
                
                {activeTab !== 'languages' && (
                    <button 
                        onClick={() => activeTab === 'categories' ? setIsCategoryModalOpen(true) : setIsLocationModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                    >
                        <Plus size={18} />
                        {activeTab === 'categories' ? 'Add New Category' : 'Add New Region'}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-slate-800 mb-8 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'categories' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <Grid size={18} /> Service Categories
                </button>
                <button
                    onClick={() => setActiveTab('locations')}
                    className={`flex items-center gap-2 pb-4 px-6 text-sm font-bold transition-colors border-b-2 ${activeTab === 'locations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
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
                isLoadingCategories ? (
                    <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category: Category) => (
                            <div key={category.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
                                        {category.name[0]}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleDeleteCategory(category.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.name}</h3>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                                    <span className="text-sm font-medium text-gray-500">{category.vendorsCount || 0} Vendors</span>
                                    <button 
                                        onClick={() => toggleCategoryStatus(category.id, !category.isActive)}
                                        className={`px-2 py-1 rounded-md text-xs font-bold transition-colors ${category.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {activeTab === 'locations' && (
                isLoadingLocations ? (
                    <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
                ) : (
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
                                {locations.map((loc: Location) => (
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
                                            <button 
                                                onClick={() => toggleLocationStatus(loc.id, !loc.isActive)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${loc.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                {loc.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleDeleteLocation(loc.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
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

            {/* Category Creator Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-gray-200 dark:border-slate-800 w-full max-w-md relative p-8">
                        <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add Service Category</h2>
                        <p className="text-sm text-gray-500 mb-6 font-medium">Create a new category for event vendors to list under.</p>
                        
                        <form onSubmit={handleCreateCategory} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Catering, Venue, Photography"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Display Sort Order</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1 (optional)"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={createCategoryMutation.isPending}
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    {createCategoryMutation.isPending ? 'Creating...' : 'Add Category'}
                                </button>
                                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl font-bold transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Location Creator Modal */}
            {isLocationModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-gray-200 dark:border-slate-800 w-full max-w-md relative p-8">
                        <button type="button" onClick={() => setIsLocationModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add New Location</h2>
                        <p className="text-sm text-gray-500 mb-6 font-medium">Add a region or city mapping to filter vendor services by.</p>
                        
                        <form onSubmit={handleCreateLocation} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">City Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. New Delhi, Noida"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">State Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Delhi NCR, Uttar Pradesh"
                                    value={stateName}
                                    onChange={(e) => setStateName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={createLocationMutation.isPending}
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    {createLocationMutation.isPending ? 'Creating...' : 'Add Location'}
                                </button>
                                <button type="button" onClick={() => setIsLocationModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl font-bold transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
