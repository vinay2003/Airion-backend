import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Star, Edit2, Trash2, LayoutGrid, List as ListIcon, Search, Filter } from 'lucide-react';
import { useListingStore } from '@ease2event/shared/lib/stores/useListingStore';
import { useAuth } from '@ease2event/shared/auth';
import ListingEditorModal from '../components/ListingEditorModal';
import { Button, Card, Skeleton, notify } from '@ease2event/ui';

const Listings: React.FC = () => {
    const { user } = useAuth();
    const { 
        listings, 
        loading, 
        fetchVendorListings, 
        createListing, 
        updateListing, 
        deleteListing 
    } = useListingStore();
    
    const [view, setView] = useState<'grid' | 'table'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingListing, setEditingListing] = useState<any>(null);

    useEffect(() => {
        if (user?.id) {
            fetchVendorListings(user.id);
        }
    }, [user?.id, fetchVendorListings]);

    const handleSaveListing = async (data: any) => {
        try {
            if (editingListing) {
                await updateListing(editingListing.id, data);
                notify.success('Listing updated successfully');
            } else {
                await createListing({ ...data, vendorId: user?.id });
                notify.success('Listing created successfully');
            }
            setIsEditorOpen(false);
        } catch (err: any) {
            notify.error('Failed to save listing');
        }
    };

    const handleDeleteListing = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await deleteListing(id);
            notify.success('Listing deleted');
        } catch (err: any) {
            notify.error('Failed to delete listing');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'inactive':
                return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400';
            default:
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        }
    };

    const filteredListings = listings.filter(l => 
        l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Venture Portfolio</h1>
                        <p className="text-gray-500 dark:text-slate-400">Manage your event packages and service offerings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                            <button 
                                onClick={() => setView('grid')}
                                className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-800 text-red-500 shadow-sm' : 'text-gray-500'}`}
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button 
                                onClick={() => setView('table')}
                                className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-white dark:bg-slate-800 text-red-500 shadow-sm' : 'text-gray-500'}`}
                            >
                                <ListIcon size={20} />
                            </button>
                        </div>
                        <Button
                            onClick={() => { setEditingListing(null); setIsEditorOpen(true); }}
                            leftIcon={<Plus size={20} />}
                            variant="primary"
                        >
                            Add Service
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                    <div className="relative w-full sm:w-96 pl-2">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name, location..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 hover:text-red-500 transition-colors">
                        <Filter size={18} />
                        Refine Search
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} height={320} className="rounded-3xl" />)}
                    </div>
                ) : filteredListings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300 dark:text-slate-700 mb-6 group-hover:scale-110 transition-transform">
                            <Plus size={40} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">No listings found</h3>
                        <p className="text-gray-500 dark:text-slate-400 mt-2">Start by creating your first event package.</p>
                        <Button onClick={() => setIsEditorOpen(true)} className="mt-8">Create Listing</Button>
                    </div>
                ) : view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredListings.map((listing) => (
                            <Card key={listing.id} padding="none" className="group overflow-hidden relative border-none shadow-sm hover:shadow-2xl">
                                <div className="relative h-56 overflow-hidden">
                                    <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80'} alt={listing.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg backdrop-blur-md ${getStatusColor(listing.status)}`}>
                                        {listing.status}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <div className="flex gap-2 w-full">
                                            <button onClick={() => { setEditingListing(listing); setIsEditorOpen(true); }} className="flex-1 bg-white text-black py-2 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all">Edit Details</button>
                                            <button onClick={() => handleDeleteListing(listing.id)} className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-black text-lg truncate dark:text-white uppercase tracking-tight">{listing.name}</h3>
                                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-md text-yellow-600">
                                            <Star size={12} className="fill-yellow-600" />
                                            <span className="text-[10px] font-black">{listing.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4 uppercase tracking-tighter">
                                        <MapPin size={14} className="text-red-500" />
                                        {listing.location}
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        {listing.category}
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Base Price</p>
                                            <span className="font-black text-xl text-gray-900 dark:text-white">₹{listing.price.toLocaleString()}</span>
                                        </div>
                                        <div className="text-[10px] font-black text-red-500 underline underline-offset-4 tracking-widest cursor-pointer uppercase">Details</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden animate-fadeIn">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-slate-900/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                                    <th className="px-6 py-4">Service Package</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Pricing</th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {filteredListings.map((listing) => (
                                    <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                                                    <img src={listing.images?.[0]} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-sm dark:text-white uppercase tracking-tight">{listing.name}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase">{listing.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{listing.location}</td>
                                        <td className="px-6 py-4 text-sm font-black dark:text-white">₹{listing.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/30 w-fit px-2 py-0.5 rounded-lg text-yellow-600">
                                                <Star size={12} className="fill-yellow-600" />
                                                <span className="text-[10px] font-black">{listing.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(listing.status)}`}>
                                                {listing.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setEditingListing(listing); setIsEditorOpen(true); }} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-400"><Edit2 size={18} /></button>
                                                <button onClick={() => handleDeleteListing(listing.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-red-500"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ListingEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                listing={editingListing}
                onSave={handleSaveListing}
            />
        </>
    );
};

export default Listings;
