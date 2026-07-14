import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Star, Edit2, Trash2, Search, Filter, MoreVertical, Layers, Calendar, ChevronRight, Users, CheckCircle2, FileText } from 'lucide-react';
import api from '../lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@ease2event/shared';
import ListingEditorModal from '../components/ListingEditorModal';
import { Button, Badge, Skeleton } from '@ease2event/ui';

const Listings: React.FC = () => {
 const { user } = useAuth();
 const vendorId = user?.vendor?.id || 'mock-id';
 const queryClient = useQueryClient();

 const [searchTerm, setSearchTerm] = useState('');

 // Modal State
 const [isEditorOpen, setIsEditorOpen] = useState(false);
 const [editingListing, setEditingListing] = useState<any>(null);

 const { data: listings = [], isLoading: loading, error } = useQuery({
 queryKey: ['services', vendorId],
 queryFn: async () => {
 if (vendorId === 'mock-id') return [];
 const response: any = await api.get(`/services?vendorId=${vendorId}`);
 
 return response.data.map((service: any) => ({
 id: service.id,
 title: service.title,
 image: service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80',
 location: service.availableLocations?.[0] || 'Mumbai',
 rating: service.vendor?.rating || 'New',
 reviews: service.vendor?.totalReviews || 0,
 price: `${service.currency || 'INR'} ${parseFloat(service.basePrice).toLocaleString()}`,
 status: service.isActive ? 'Active' : 'Inactive',
 }));
 },
 enabled: vendorId !== 'mock-id',
 });

 const saveMutation = useMutation({
 mutationFn: async (data: any) => {
 const payload = {
 title: data.title,
 description: data.description,
 basePrice: Number(data.price),
 availableLocations: [data.location],
 guestCapacity: Number(data.capacity) || 0,
 images: data.image ? [data.image] : [],
 locationType: 'onsite'
 };

 if (editingListing) {
 return api.put(`/services/${editingListing.id}`, payload);
 } else {
 return api.post('/services', payload);
 }
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['services', vendorId] });
 setIsEditorOpen(false);
 }
 });

 const deleteMutation = useMutation({
 mutationFn: async (id: string) => {
 return api.delete(`/services/${id}`);
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['services', vendorId] });
 }
 });

 const handleSaveListing = async (data: any) => {
 await saveMutation.mutateAsync(data);
 };

 const handleDelete = async (id: string) => {
 if (!confirm('Are you sure you want to delete this listing?')) return;
 try {
 await deleteMutation.mutateAsync(id);
 } catch (error: any) {
 console.error('Failed to delete listing:', error);
 alert('Failed to delete listing from server.');
 }
 };

 const filteredListings = listings.filter((l: any) =>
 l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
 l.location.toLowerCase().includes(searchTerm.toLowerCase())
 );

 return (
 <div className="space-y-8 pb-12 px-6 w-full max-w-7xl mx-auto">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--ease2event-border-subtle)] pb-6">
 <div className="space-y-2">
 <h1 className="text-2xl font-bold normal-case tracking-normal leading-normal">Event Management</h1>
 <p className="text-sm font-semibold text-slate-500 normal-case tracking-normal flex items-center gap-2">
 Manage and track your event posts easily.
 </p>
 </div>
 <Button
 onClick={() => { setEditingListing(null); setIsEditorOpen(true); }}
 className="h-10 px-6 rounded-lg font-bold text-xs transition-shadow"
 leftIcon={<Plus size={16} />}
 >
 Create New Listing
 </Button>
 </div>

 {/* Quick Stats Bar */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label: 'Active Listings', value: listings.filter((l: any) => l.status === 'Active').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
 { label: 'Total Reach', value: '1.2k', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
 { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
 { label: 'Pending Reviews', value: '12', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
 ].map((stat, i) => (
 <div key={i} className="card-minimal p-5 flex items-center gap-4 rounded-xl border border-[var(--ease2event-border-subtle)] bg-white dark:bg-slate-900">
 <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
 <stat.icon size={24} />
 </div>
 <div className="space-y-1">
 <p className="text-xs font-semibold text-slate-500 uppercase">{stat.label}</p>
 <p className="text-xl font-bold text-[var(--ease2event-text-primary)]">{stat.value}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Filters Bar */}
 <div className="flex flex-col md:flex-row items-center gap-4 bg-[var(--ease2event-bg-elevated)] p-4 rounded-xl border border-[var(--ease2event-border-subtle)] ">
 <div className="relative flex-1 w-full group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ease2event-text-muted)] group-focus-within:text-[var(--ease2event-brand-primary)] transition-colors" size={20} />
 <input
 type="text"
 placeholder="Search listings by title or location..."
 className="w-full h-10 pl-12 pr-4 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)] placeholder-[var(--ease2event-text-secondary)]"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 <div className="flex gap-4 w-full md:w-auto">
 <Button variant="secondary" className="h-10 px-4 rounded-lg border-[var(--ease2event-border-subtle)] font-bold text-xs bg-[var(--ease2event-bg-surface)]" leftIcon={<Filter size={16} />}>
 More Filters
 </Button>
 </div>
 </div>

 {/* Grid List */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {loading ? (
 [1, 2, 3].map((i: number) => (
 <div key={i} className="card-minimal h-80 rounded-xl bg-[var(--ease2event-bg-elevated)] animate-pulse border-[var(--ease2event-border-subtle)]">
 <div className="h-48 bg-[var(--ease2event-bg-surface)] rounded-t-xl"></div>
 <div className="p-5 space-y-4">
 <div className="h-6 bg-[var(--ease2event-bg-surface)] w-3/4 rounded-md"></div>
 <div className="h-4 bg-[var(--ease2event-bg-surface)] w-1/2 rounded-md"></div>
 </div>
 </div>
 ))
 ) : (
 filteredListings.map((listing: any, i: number) => (
 <div key={listing.id || `listing-${i}`} className="card-minimal p-0 overflow-hidden flex flex-col group h-full border-[var(--ease2event-border-subtle)] transition-shadow rounded-xl bg-white dark:bg-slate-900">
 <div className="relative h-48 shrink-0 overflow-hidden">
 <img
 src={listing.image}
 alt={listing.title}
 className="w-full h-full object-cover"
 />
 <div className="absolute top-4 right-4 z-10">
 <Badge variant={listing.status === 'Active' ? 'confirmed' : 'pending'} className="px-3 py-1 text-[10px] font-bold rounded-md bg-white/90 dark:bg-black/90 backdrop-blur-md ">
 {listing.status || 'Active'}
 </Badge>
 </div>
 <div className="absolute bottom-4 left-4 z-10">
 <div className="flex items-center gap-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 rounded-md ">
 <Star size={14} className="text-amber-500 fill-amber-500" />
 <span className="text-xs font-bold text-[var(--ease2event-text-primary)]">{listing.rating}</span>
 </div>
 </div>
 </div>
 <div className="p-5 flex-1 flex flex-col space-y-4">
 <div className="flex justify-between items-start gap-3">
 <h3 className="text-lg font-bold text-[var(--ease2event-text-primary)] leading-snug line-clamp-2">{listing.title}</h3>
 <button
 onClick={() => { setEditingListing(listing); setIsEditorOpen(true); }}
 className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-500 transition-colors"
 >
 <Edit2 size={16} />
 </button>
 </div>
 <div className="flex items-center gap-2 text-slate-500 text-sm">
 <MapPin size={16} />
 {listing.location}
 </div>

 <div className="mt-auto pt-4 border-t border-[var(--ease2event-border-subtle)] flex items-center justify-between">
 <div>
 <p className="text-[10px] font-semibold text-slate-500 uppercase">Base Price</p>
 <p className="text-lg font-bold text-[var(--ease2event-text-primary)]">{listing.price}</p>
 </div>
 <Button
 variant="outline"
 size="sm"
 className="px-3 h-8 rounded-md font-semibold text-xs border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
 leftIcon={<Trash2 size={14} />}
 onClick={(e) => {
 e.stopPropagation();
 handleDelete(listing.id);
 }}
 >
 Delete
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
