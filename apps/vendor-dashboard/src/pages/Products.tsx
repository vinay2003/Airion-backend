import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, Edit3, X, Loader2,
    CheckCircle2, Info, Sparkles, Package as PackageIcon, Zap, DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Badge, Skeleton } from '@airion/ui';
import { useAuth } from '@airion/shared';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface Package {
    name: string;
    price: string;
    description: string;
    features: string[];
    isPopular: boolean;
}

/**
 * 🍱 Portfolio & Inventory Management
 * Modernized with high-legibility typography and theme-aware nodes.
 */
const Products: React.FC = () => {
    const { user } = useAuth();
    const vendorId = user?.vendor?.id || '';
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        basePrice: '',
        categoryId: user?.vendor?.categoryId || '',
        subcategoryId: user?.vendor?.subcategoryId || '',
        guestCapacity: '',
        locationType: 'onsite',
        address: '',
        city: user?.vendor?.city || '',
        state: '',
        images: [] as string[],
        features: [] as { name: string; included: boolean }[],
        packages: [
            { name: 'Silver', price: '', description: 'Basic tier with essential features', features: [], isPopular: false },
            { name: 'Gold', price: '', description: 'Most popular choice for premium events', features: [], isPopular: true },
            { name: 'Platinum', price: '', description: 'Luxury all-inclusive experience', features: [], isPopular: false },
        ] as Package[]
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!vendorId) return;
            try {
                const res = await api.get(`/services?vendorId=${vendorId}`) as { data: any[] };
                setProducts(res.data || []);
            } catch (err) {
                console.error('Failed to load initial data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [vendorId]);

    const handleCreateService = async () => {
        if (!formData.title || !formData.basePrice) {
            toast.error('Title and Base Price are required.');
            return;
        }

        setSubmitting(true);
        try {
            const submission = {
                ...formData,
                vendorId,
                basePrice: Number(formData.basePrice),
                guestCapacity: formData.guestCapacity ? Number(formData.guestCapacity) : undefined,
                packages: formData.packages.map(p => ({
                    ...p,
                    price: Number(p.price) || 0,
                    features: p.features
                }))
            };

            await api.post('/services', submission);
            toast.success('Service created successfully!');
            setIsAdding(false);
            const res = await api.get(`/services?vendorId=${vendorId}`) as { data: any[] };
            setProducts(res.data || []);
        } catch (err) {
            toast.error('Failed to create service.');
        } finally {
            setSubmitting(false);
        }
    };

    const updatePackage = (index: number, field: string, value: any) => {
        const newPackages = [...formData.packages];
        (newPackages[index] as any)[field] = value;
        setFormData({ ...formData, packages: newPackages });
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isAdding) {
        return (
            <div className="w-full max-w-6xl mx-auto space-y-16 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[var(--airion-border-subtle)] pb-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-[var(--airion-text-primary)] tracking-tight leading-loose uppercase mb-2">Create Service</h1>
                        <p className="text-2xl font-bold text-[var(--airion-text-muted)] mb-4">Configure and publish a new service or venue to your marketplace.</p>
                    </div>
                    <div className="flex items-center gap-5">
                        <Button onClick={() => setIsAdding(false)} className="px-8 py-3 btn-secondary rounded-[1.25rem] text-base font-bold uppercase tracking-widest border-[var(--airion-border-subtle)]">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateService}
                            disabled={submitting}
                            className="px-10 py-3 btn-primary rounded-[1.25rem] text-base font-bold uppercase tracking-widest shadow-xl"
                        >
                            {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Publish Service'}
                        </Button>
                    </div>
                </div>

                <div className="space-y-16">
                    {/* Section 1: Basic Information */}
                    <div className="card-minimal !p-10 md:!p-12 space-y-10 rounded-[2.5rem] shadow-xl border border-[var(--airion-border-subtle)]">
                        <div className="flex items-center gap-5 border-b border-[var(--airion-border-subtle)] pb-8">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-md">
                                <Info size={28} className="text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--airion-text-primary)] uppercase tracking-wider mb-1">Basic Information</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div>
                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-[0.25em] pl-1 block mb-4">Service Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Grand Ballroom at Hotel Saket"
                                    className="input-dark-glass w-full h-14 text-base font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-[0.25em] pl-1 block mb-4">Description</label>
                                <textarea
                                    rows={6}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Provide a comprehensive overview of the service, including amenities, special features, and booking terms..."
                                    className="input-dark-glass w-full min-h-[180px] py-6 text-base font-bold leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Pricing & Capacity */}
                    <div className="card-minimal !p-10 md:!p-12 space-y-10 rounded-[2.5rem] shadow-xl border border-[var(--airion-border-subtle)]">
                        <div className="flex items-center gap-5 border-b border-[var(--airion-border-subtle)] pb-8">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-md">
                                <PackageIcon size={28} className="text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--airion-text-primary)] uppercase tracking-wider mb-1">Pricing & Capacity</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-[0.25em] pl-1 block mb-4">Base Price (₹)</label>
                                <div className="relative">
                                    <DollarSign size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--airion-text-muted)]" />
                                    <input
                                        type="number"
                                        value={formData.basePrice}
                                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                        placeholder="0.00"
                                        className="input-dark-glass w-full h-14 pl-14 text-lg font-bold tracking-tight"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-[0.25em] pl-1 block mb-4">Maximum Guest Capacity</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={formData.guestCapacity}
                                    onChange={(e) => setFormData({ ...formData, guestCapacity: e.target.value })}
                                    className="input-dark-glass w-full h-14 text-lg font-bold tracking-tight"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Service Packages */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-4 mb-6">
                            <h3 className="text-2xl font-bold text-[var(--airion-text-primary)] uppercase tracking-wider">Service Packages</h3>
                            <Badge className="chip-soft-blue px-6 h-10 rounded-xl font-bold text-lg md:text-base">Standard Multi-Tier Enabled</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {formData.packages.map((pkg, i) => (
                                <div key={pkg.name} className={`card-minimal !p-10 transition-all duration-500 border-2 rounded-[2.5rem] shadow-2xl ${pkg.isPopular ? 'bg-blue-500/5 border-blue-500/30' : 'bg-[var(--airion-bg-surface)] border-[var(--airion-border-subtle)] hover:border-blue-500/20'}`}>
                                    <div className="space-y-10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-[var(--airion-text-primary)] uppercase tracking-wide">{pkg.name}</span>
                                            {pkg.isPopular && <Badge className="bg-blue-600 text-white text-base font-bold uppercase px-4 py-1.5 rounded-full shadow-lg">Recommended</Badge>}
                                        </div>
                                        <div>
                                            <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-[0.25em] pl-1 block mb-4">Base Rate (₹)</label>
                                            <input
                                                type="number"
                                                value={pkg.price}
                                                onChange={(e) => updatePackage(i, 'price', e.target.value)}
                                                placeholder="0.00"
                                                className="input-dark-glass w-full h-14 px-6 text-lg font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-[0.25em] pl-1 block mb-4">Included Modules</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Catering', 'Decor', 'Audio', 'Visuals'].map(feat => (
                                                    <button
                                                        key={feat}
                                                        onClick={() => {
                                                            const current = pkg.features;
                                                            const next = current.includes(feat) ? current.filter(c => c !== feat) : [...current, feat];
                                                            updatePackage(i, 'features', next);
                                                        }}
                                                        className={`text-base px-4 py-3 rounded-2xl border transition-all font-bold uppercase tracking-widest ${pkg.features.includes(feat) ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-[var(--airion-bg-elevated)] text-[var(--airion-text-muted)] border-[var(--airion-border-subtle)] hover:border-blue-500/40 hover:text-[var(--airion-text-primary)]'}`}
                                                    >
                                                        {feat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Media Upload & Footer CTA */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 card-minimal flex flex-col items-center justify-center p-14 border-dashed border-[var(--airion-border-base)] bg-[var(--airion-bg-surface)] text-center hover:bg-blue-500/5 transition-all cursor-pointer group rounded-[3rem]">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-subtle)] flex items-center justify-center text-[var(--airion-text-muted)] mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                                <Plus size={36} />
                            </div>
                            <h4 className="text-3xl font-bold text-[var(--airion-text-primary)] mb-4">Upload Visual Assets</h4>
                            <p className="text-lg text-[var(--airion-text-muted)] font-bold uppercase tracking-tight opacity-80 mb-2">Drag and drop high-resolution imagery for your listing.</p>
                        </div>

                        <div className="flex flex-col justify-end">
                            <Button
                                onClick={handleCreateService}
                                disabled={submitting}
                                className="w-full h-full py-10 btn-primary rounded-[2.5rem] text-2xl font-bold flex flex-col gap-4 items-center justify-center shadow-2xl shadow-blue-500/20"
                            >
                                {submitting ? <Loader2 size={32} className="animate-spin" /> : (
                                    <>
                                        <Zap size={32} />
                                        <div className="flex flex-col items-center">
                                            <span>Publish Service</span>
                                            <span className="text-base font-bold uppercase tracking-[0.3em] opacity-80 mt-1">Go live in marketplace</span>
                                        </div>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[var(--airion-border-subtle)] pb-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-[var(--airion-text-primary)] tracking-tight leading-tight uppercase">Services & Inventory</h1>
                    <p className="text-lg font-bold text-[var(--airion-text-secondary)]">Manage and organize your service offerings in the marketplace.</p>
                </div>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="btn-primary h-14 px-10 rounded-[1.25rem] text-base font-bold uppercase tracking-widest shadow-xl"
                >
                    <Plus size={20} className="mr-3" /> Add New Service
                </Button>
            </div>

            {/* Filter Section */}
            <div className="card-minimal !p-3 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 bg-[var(--airion-bg-elevated)] border-[var(--airion-border-subtle)] rounded-[2rem] md:rounded-[3rem] shadow-inner transition-all">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--airion-text-muted)] group-focus-within:text-[var(--airion-brand-primary)] transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="w-full bg-[var(--airion-bg-surface)] md:bg-transparent border border-[var(--airion-border-subtle)] md:border-none rounded-2xl py-4 md:py-5 pl-16 pr-6 text-base font-bold text-[var(--airion-text-primary)] focus:ring-2 md:focus:ring-0 ring-blue-500/20 outline-none placeholder:text-[var(--airion-text-muted)] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-row p-1.5 bg-[var(--airion-bg-surface)] rounded-2xl border border-[var(--airion-border-subtle)] md:mr-2 shadow-md">
                    {['All', 'Active', 'Archived'].map(tab => (
                        <button
                            key={tab}
                            className={`flex-1 md:flex-none px-6 md:px-10 py-3 text-base font-bold rounded-xl transition-all uppercase tracking-widest ${tab === 'All' ? 'bg-[var(--airion-brand-primary)] text-white shadow-xl shadow-blue-500/20' : 'text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)]'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-410px rounded-[3rem] border border-[var(--airion-border-subtle)] animate-pulse bg-[var(--airion-bg-elevated)]"></div>
                    ))
                ) : (
                    <>
                        {filteredProducts.map((prod: any, idx: number) => (
                            <motion.div
                                key={prod.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="card-minimal !p-0 overflow-hidden group border-[var(--airion-border-subtle)] hover:border-[var(--airion-brand-primary)]/40 flex flex-col h-full shadow-2xl hover:scale-[1.02] transition-all duration-500 rounded-[3rem]"
                            >
                                <div className="h-64 bg-[var(--airion-bg-surface)] relative overflow-hidden">
                                    <img
                                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1000'}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                        alt={prod.title}
                                    />
                                    <div className="absolute top-6 left-6">
                                        <Badge className="chip-soft-blue backdrop-blur-xl px-5 h-8 text-base font-bold uppercase tracking-widest border border-white/10 shadow-lg">
                                            {prod.guestCapacity ? 'Venue' : 'Service'}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="p-3 bg-[var(--airion-bg-surface)]/40 backdrop-blur-xl text-[var(--airion-text-primary)] rounded-xl border border-white/20 hover:bg-white/20 transition-all shadow-xl"><Edit3 size={20} /></button>
                                    </div>
                                </div>
                                <div className="p-10 flex-1 flex flex-col space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-base font-bold text-blue-500 uppercase tracking-[0.2em]">{prod.category?.name || 'General'}</p>
                                        <h3 className="text-2xl font-bold text-[var(--airion-text-primary)] tracking-tight line-clamp-2 leading-tight">{prod.title}</h3>
                                    </div>
                                    <p className="text-base text-[var(--airion-text-muted)] font-bold uppercase tracking-tight line-clamp-2 leading-relaxed opacity-80">{prod.description}</p>
                                    <div className="mt-auto pt-8 flex items-center justify-between border-t border-[var(--airion-border-subtle)]">
                                        <div className="flex flex-col space-y-1">
                                            <span className="text-base text-[var(--airion-text-muted)] font-bold uppercase tracking-widest">Starting from</span>
                                            <span className="text-3xl font-bold text-[var(--airion-text-primary)] tracking-tighter italic leading-none">₹{Number(prod.basePrice).toLocaleString()}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {[1, 2].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-xl bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-subtle)] text-base font-bold text-[var(--airion-text-muted)] flex items-center justify-center shadow-sm">v{i}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div
                            onClick={() => setIsAdding(true)}
                            className="card-minimal border-4 border-dashed border-[var(--airion-border-base)] bg-transparent flex flex-col items-center justify-center gap-6 py-20 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer group transition-all duration-500 rounded-[3rem] shadow-inner"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-subtle)] flex items-center justify-center text-[var(--airion-text-muted)] group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                                <Plus size={32} />
                            </div>
                            <div className="text-center space-y-3">
                                <h3 className="text-xl font-bold text-[var(--airion-text-primary)] uppercase tracking-wide">Add New Service</h3>
                                <p className="text-base text-[var(--airion-text-muted)] font-bold uppercase tracking-widest opacity-80">Expand your marketplace catalog</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;
