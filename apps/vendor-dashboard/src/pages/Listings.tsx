import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Star, Edit2, Trash2, Search, Filter, MoreVertical, Layers, Calendar, ChevronRight, Users, CheckCircle2, FileText } from 'lucide-react';
import api from '../lib/api';
import ListingEditorModal from '../components/ListingEditorModal';
import { Button, Badge, Skeleton } from '@airion/ui';

const Listings: React.FC = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingListing, setEditingListing] = useState<any>(null);

    const handleSaveListing = async (data: any) => {
        // Mock save for now
        if (editingListing) {
            setListings(listings.map(l => l.id === editingListing.id ? { ...l, ...data } : l));
        } else {
            setListings([{ id: Date.now().toString(), ...data, status: 'Active', rating: 'New', reviews: 0 }, ...listings]);
        }
    };

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response: any = await api.get('/services');

                const mapped = response.data.map((service: any) => ({
                    id: service.id,
                    title: service.title,
                    image: service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80',
                    location: service.availableLocations?.[0] || 'Mumbai',
                    rating: service.vendor?.rating || 'New',
                    reviews: service.vendor?.totalReviews || 0,
                    price: `${service.currency || 'INR'} ${parseFloat(service.basePrice).toLocaleString()}`,
                    status: service.isActive ? 'Active' : 'Inactive',
                }));

                setListings(mapped);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const filteredListings = listings.filter(l => 
        l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--airion-text-primary)]">Event Management</h1>
                    <p className="text-[var(--airion-text-muted)] font-medium mt-1">Configure and monitor your active event listings.</p>
                </div>
                <Button
                    onClick={() => { setEditingListing(null); setIsEditorOpen(true); }}
                    variant="primary"
                    size="lg"
                    leftIcon={<Plus size={20} />}
                >
                    Create New Listing
                </Button>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Listings', value: listings.filter(l => l.status === 'Active').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Total Reach', value: '1.2k', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Pending Reviews', value: '12', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="card-premium !p-4 flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-bold text-[var(--airion-text-primary)]">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="card-premium p-4 flex flex-col md:flex-row items-center gap-4 bg-[var(--airion-bg-surface)]/50">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--airion-text-muted)]" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search listings..." 
                        className="w-full bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--airion-brand-primary)]/20 transition-all font-medium text-[var(--airion-text-primary)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="secondary" leftIcon={<Filter size={18} />}>
                        Filter
                    </Button>
                </div>
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="card-premium h-[420px]">
                            <Skeleton variant="rect" width="100%" height={200} />
                            <div className="p-6 space-y-4">
                                <Skeleton variant="text" width="60%" />
                                <Skeleton variant="text" width="90%" />
                                <Skeleton variant="text" width="40%" />
                            </div>
                        </div>
                    ))
                ) : (
                    filteredListings.map((listing) => (
                        <div key={listing.id} className="card-premium p-0 overflow-hidden flex flex-col group h-full hover:shadow-[var(--airion-shadow-glow)] transition-all duration-500">
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={listing.image}
                                    alt={listing.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute top-4 right-4 z-10">
                                    <Badge variant={listing.status === 'Active' ? 'confirmed' : 'pending'} className="shadow-xl backdrop-blur-md">
                                        {listing.status || 'Active'}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-4 left-4 z-10">
                                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                                        <Star size={14} className="text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-black text-white">{listing.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-[var(--airion-text-primary)] group-hover:text-[var(--airion-brand-primary)] transition-colors leading-tight">{listing.title}</h3>
                                    <button
                                        onClick={() => { setEditingListing(listing); setIsEditorOpen(true); }}
                                        className="p-2 hover:bg-[var(--airion-brand-primary)]/10 rounded-xl text-[var(--airion-text-muted)] hover:text-[var(--airion-brand-primary)] transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--airion-text-muted)] text-sm mb-4 font-medium">
                                    <MapPin size={16} className="text-[var(--airion-brand-primary)]" />
                                    {listing.location}
                                </div>
                                
                                <div className="mt-auto pt-6 border-t border-[var(--airion-border-subtle)] flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-widest">Base Price</p>
                                        <p className="text-2xl font-black text-[var(--airion-text-primary)]">{listing.price}</p>
                                    </div>
                                    <Button variant="secondary" size="sm" className="px-3" rightIcon={<ChevronRight size={16} />}>
                                        Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ListingEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                listing={editingListing}
                onSave={handleSaveListing}
            />
        </div>
    );
};



export default Listings;
