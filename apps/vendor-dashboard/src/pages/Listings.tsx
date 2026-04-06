import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Star, Edit2, Trash2 } from 'lucide-react';
import api from '../lib/api';
import ListingEditorModal from '../components/ListingEditorModal';
import { Button, Badge, Spinner } from '@airion/ui';

const Listings: React.FC = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
            case 'Under Review':
                return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
            default:
                return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <Spinner size="lg" className="text-[var(--airion-brand-primary)]" />
            </div>
        );
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--airion-text-primary)]">My Listings</h1>
                        <p className="text-[var(--airion-text-muted)]">Manage your venues and services</p>
                    </div>
                    <Button
                        onClick={() => { setEditingListing(null); setIsEditorOpen(true); }}
                        variant="primary"
                        className="font-bold shadow-[var(--airion-shadow-md)]"
                        leftIcon={<Plus size={20} />}
                    >
                        Add New Listing
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <div key={listing.id} className="bg-[var(--airion-bg-base)] rounded-3xl overflow-hidden border border-[var(--airion-border-subtle)] group hover:border-indigo-100 hover:shadow-[0_12px_32px_-8px_rgba(15,23,42,0.04),_0_4px_12px_-4px_rgba(15,23,42,0.02)] transition-all duration-400 ease-out hover:-translate-y-1">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={listing.image}
                                    alt={listing.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-4 right-4">
                                    <Badge variant={listing.status === 'Active' ? 'confirmed' : listing.status === 'Under Review' ? 'pending' : 'default'} className="shadow-md">
                                        {listing.status || 'Active'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-[var(--airion-text-primary)] group-hover:text-[var(--airion-brand-primary)] transition-colors">{listing.title}</h3>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-[var(--airion-text-primary)]">{listing.rating}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[var(--airion-text-secondary)] text-sm mb-1">
                                    <MapPin size={16} />
                                    {listing.location}
                                </div>
                                <p className="text-xs text-[var(--airion-text-muted)] mb-4">{listing.reviews} reviews</p>
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--airion-border-subtle)]">
                                    <span className="font-bold text-[var(--airion-text-primary)] text-lg">{listing.price}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingListing(listing); setIsEditorOpen(true); }}
                                            className="p-2 hover:bg-[rgba(108,99,255,0.05)] rounded-lg text-[var(--airion-text-secondary)] hover:text-[var(--airion-brand-primary)] transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-[rgba(255,107,107,0.05)] rounded-lg text-red-500 hover:text-[var(--airion-brand-danger)] transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
