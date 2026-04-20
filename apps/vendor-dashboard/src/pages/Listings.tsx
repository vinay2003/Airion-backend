import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Star, Edit2, Trash2, Search, Filter, MoreVertical, Layers, Calendar, ChevronRight, Users, CheckCircle2, FileText } from 'lucide-react';
import api from '../lib/api';
import ListingEditorModal from '../components/ListingEditorModal';
import { Button, Badge, Skeleton } from '@ease2event/ui';

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
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-[var(--ease2event-border-subtle)] pb-12">
                <div className="space-y-4">
                    <h1 className="text-3xl font-normal normal-case not-italic tracking-normal leading-normal">Event Management</h1>
                    <p className="text-base font-normal normal-case not-italic tracking-normal flex items-center gap-2">
                        Configure and monitor your active event listings.
                    </p>
                </div>
                <Button
                    onClick={() => { setEditingListing(null); setIsEditorOpen(true); }}
                    className="h-14 px-10 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl"
                    leftIcon={<Plus size={20} />}
                >
                    Create New Listing
                </Button>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Active Listings', value: listings.filter(l => l.status === 'Active').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Total Reach', value: '1.2k', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Pending Reviews', value: '12', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="card-minimal !p-8 flex items-center gap-6 shadow-xl rounded-[2.5rem] hover:scale-[1.02] transition-all">
                        <div className={`p-4 rounded-[1.5rem] ${stat.bg} ${stat.color} shadow-lg`}>
                            <stat.icon size={32} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest leading-none">{stat.label}</p>
                            <p className="text-3xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-[var(--ease2event-bg-elevated)] p-8 rounded-[2.5rem] border border-[var(--ease2event-border-subtle)] shadow-inner">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-[var(--ease2event-text-muted)] group-focus-within:text-[var(--ease2event-brand-primary)] transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Search listings by title or location..."
                        className="w-full h-16 pl-16 pr-8 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] rounded-[1.5rem] text-base font-bold outline-none focus:ring-4 focus:ring-[var(--ease2event-brand-primary)]/10 transition-all text-[var(--ease2event-text-primary)] placeholder-[var(--ease2event-text-muted)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Button variant="secondary" className="h-16 px-10 rounded-[1.5rem] border-[var(--ease2event-border-subtle)] font-bold text-xs uppercase tracking-widest bg-[var(--ease2event-bg-surface)]" leftIcon={<Filter size={20} />}>
                        More Filters
                    </Button>
                </div>
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="card-minimal h-[480px] rounded-[2.5rem] bg-[var(--ease2event-bg-elevated)] animate-pulse border-[var(--ease2event-border-subtle)]">
                            <div className="h-64 bg-[var(--ease2event-bg-surface)] rounded-t-[2.5rem]"></div>
                            <div className="p-10 space-y-6">
                                <div className="h-10 bg-[var(--ease2event-bg-surface)] w-3/4 rounded-xl"></div>
                                <div className="h-6 bg-[var(--ease2event-bg-surface)] w-1/2 rounded-xl"></div>
                                <div className="h-16 bg-[var(--ease2event-bg-surface)] w-full rounded-[1.5rem] mt-8"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    filteredListings.map((listing) => (
                        <div key={listing.id} className="card-minimal p-0 overflow-hidden flex flex-col group h-full shadow-2xl hover:shadow-[var(--ease2event-shadow-xl)] border-[var(--ease2event-border-subtle)] hover:border-[var(--ease2event-brand-primary)]/40 hover:scale-[1.02] transition-all duration-500 rounded-[3rem]">
                            <div className="relative h-56 md:h-72 shrink-0 overflow-hidden">
                                <img
                                    src={listing.image}
                                    alt={listing.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[var(--ease2event-bg-base)] via-transparent to-transparent opacity-90"></div>
                                <div className="absolute top-8 right-8 z-10">
                                    <Badge variant={listing.status === 'Active' ? 'confirmed' : 'pending'} className="shadow-2xl backdrop-blur-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full">
                                        {listing.status || 'Active'}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-8 left-8 z-10">
                                    <div className="flex items-center gap-3 bg-[var(--ease2event-bg-surface)]/40 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-[var(--ease2event-border-subtle)] shadow-xl">
                                        <Star size={20} className="text-amber-500 fill-amber-500" />
                                        <span className="text-base font-bold text-[var(--ease2event-text-primary)] tracking-tight">{listing.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 flex-1 flex flex-col space-y-8">
                                <div className="flex justify-between items-start gap-5">
                                    <h3 className="text-3xl font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-tight group-hover:text-[var(--ease2event-brand-primary)] transition-colors line-clamp-2">{listing.title}</h3>
                                    <button
                                        onClick={() => { setEditingListing(listing); setIsEditorOpen(true); }}
                                        className="p-4 bg-[var(--ease2event-bg-elevated)] hover:bg-[var(--ease2event-brand-primary)]/10 rounded-2xl text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-brand-primary)] transition-all shadow-md border border-[var(--ease2event-border-subtle)]"
                                    >
                                        <Edit2 size={24} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 text-[var(--ease2event-text-secondary)] text-lg font-bold tracking-tight">
                                    <MapPin size={24} className="text-[var(--ease2event-brand-primary)]" />
                                    {listing.location}
                                </div>

                                <div className="mt-auto pt-10 border-t border-[var(--ease2event-border-subtle)] flex items-center justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest leading-none">Base Price</p>
                                        <p className="text-3xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">{listing.price}</p>
                                    </div>
                                    <Button variant="secondary" size="md" className="px-8 h-14 rounded-2xl font-bold text-xs uppercase bg-[var(--ease2event-bg-elevated)] border-[var(--ease2event-border-subtle)]" rightIcon={<ChevronRight size={20} />}>
                                        Manage
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
