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
 * Modernized with 'Premium Dark Glassmorphism' design nodes.
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
            <div className="w-full max-w-6xl mx-auto space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-10">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Create Service</h1>
                        <p className="text-base text-slate-400 font-medium">Configure and publish a new service or venue to your marketplace.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => setIsAdding(false)} className="px-6 py-2.5 btn-secondary rounded-xl text-sm font-semibold">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreateService} 
                            disabled={submitting}
                            className="px-8 py-2.5 btn-primary rounded-xl text-sm font-semibold"
                        >
                            {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Publish Service'}
                        </Button>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Section 1: Basic Information */}
                    <div className="card-minimal space-y-8 p-8">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Info size={20} className="text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Basic Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-300">Service Title</label>
                                <input 
                                    type="text" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Grand Ballroom at Hotel Saket"
                                    className="input-dark-glass w-full h-12 text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-300">Description</label>
                                <textarea 
                                    rows={6}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Provide a comprehensive overview of the service, including amenities, special features, and booking terms..."
                                    className="input-dark-glass w-full min-h-[160px] py-4 text-sm leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Pricing & Capacity */}
                    <div className="card-minimal space-y-8 p-8">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <PackageIcon size={20} className="text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Pricing & Capacity</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-300">Base Price (₹)</label>
                                <div className="relative">
                                     <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                     <input 
                                         type="number" 
                                         value={formData.basePrice}
                                         onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                                         placeholder="0.00"
                                         className="input-dark-glass w-full h-12 pl-12 text-sm font-bold"
                                     />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-300">Maximum Guest Capacity</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 500"
                                    value={formData.guestCapacity}
                                    onChange={(e) => setFormData({...formData, guestCapacity: e.target.value})}
                                    className="input-dark-glass w-full h-12 text-sm font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Service Packages */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold text-white">Service Packages</h3>
                            <Badge className="chip-soft-blue px-4 py-1.5 rounded-lg font-bold">Standard Multi-Tier Enabled</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {formData.packages.map((pkg, i) => (
                                <div key={pkg.name} className={`card-minimal p-8 transition-all duration-300 border shadow-md ${pkg.isPopular ? 'bg-blue-600/5 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-white">{pkg.name}</span>
                                            {pkg.isPopular && <Badge className="bg-blue-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">Recommended</Badge>}
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Base Rate (₹)</label>
                                            <input 
                                                type="number" 
                                                value={pkg.price}
                                                onChange={(e) => updatePackage(i, 'price', e.target.value)}
                                                placeholder="0.00"
                                                className="input-dark-glass w-full h-11 px-4 text-sm font-bold"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Included Modules</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Catering', 'Decor', 'Audio', 'Visuals'].map(feat => (
                                                    <button 
                                                        key={feat}
                                                        onClick={() => {
                                                            const current = pkg.features;
                                                            const next = current.includes(feat) ? current.filter(c => c !== feat) : [...current, feat];
                                                            updatePackage(i, 'features', next);
                                                        }}
                                                        className={`text-xs px-2 py-2.5 rounded-xl border transition-all font-semibold ${pkg.features.includes(feat) ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'}`}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 card-minimal flex flex-col items-center justify-center p-12 border-dashed border-white/10 bg-transparent text-center hover:bg-white/5 transition-all cursor-pointer group">
                             <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-500 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                 <Plus size={28} />
                             </div>
                             <h4 className="text-lg font-bold text-white mb-2">Upload Visual Assets</h4>
                             <p className="text-sm text-slate-400 font-medium">Drag and drop high-resolution imagery for your listing.</p>
                        </div>
                        
                        <div className="flex flex-col justify-end">
                            <Button 
                                onClick={handleCreateService} 
                                disabled={submitting}
                                className="w-full h-full py-6 btn-primary rounded-2xl text-lg font-bold flex flex-col gap-2 items-center justify-center shadow-xl shadow-blue-500/20"
                            >
                                {submitting ? <Loader2 size={24} className="animate-spin" /> : (
                                    <>
                                        <span>Publish Service</span>
                                        <span className="text-xs font-medium opacity-70">Go live in marketplace</span>
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
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Services & Inventory</h1>
                    <p className="text-sm text-slate-400 font-medium">Manage and organize your service offerings in the marketplace.</p>
                </div>
                <Button 
                    onClick={() => setIsAdding(true)} 
                    className="btn-primary h-10 px-6 rounded-lg text-sm font-semibold"
                >
                    <Plus size={18} className="mr-2" /> Add New Service
                </Button>
            </div>

            {/* Filter Section */}
            <div className="card-minimal !p-2 flex flex-col md:flex-row items-center gap-3 bg-white/5 border-white/10">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search services..." 
                        className="w-full bg-transparent border-none rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium text-white focus:ring-0 outline-none placeholder:text-slate-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/5 mr-1">
                    {['All', 'Active', 'Archived'].map(tab => (
                        <button 
                            key={tab} 
                            className={`px-5 py-1.5 text-[11px] font-bold rounded-md transition-all ${tab === 'All' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-2xl border border-white/5 animate-pulse bg-white/5"></div>
                    ))
                ) : (
                    <>
                    {filteredProducts.map((prod: any, idx: number) => (
                        <motion.div 
                            key={prod.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="card-minimal !p-0 overflow-hidden group border-white/10 hover:border-white/20 flex flex-col h-full"
                        >
                            <div className="h-44 bg-slate-900 relative overflow-hidden">
                                <img 
                                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1000'} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-90"
                                    alt={prod.title}
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="chip-soft-blue backdrop-blur-md px-3 h-7 text-[10px]">
                                        {prod.guestCapacity ? 'Venue' : 'Service'}
                                    </Badge>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button className="p-2 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all"><Edit3 size={14} /></button>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col space-y-3">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{prod.category?.name || 'General'}</p>
                                    <h3 className="text-base font-bold text-white truncate">{prod.title}</h3>
                                </div>
                                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed opacity-90">{prod.description}</p>
                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Starting from</span>
                                        <span className="text-lg font-bold text-white mt-0.5">₹{Number(prod.basePrice).toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-1.5 opacity-50">
                                        {[1,2].map(i => (
                                            <div key={i} className="w-5 h-5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-white/50 flex items-center justify-center">v{i}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    <div 
                        onClick={() => setIsAdding(true)}
                        className="card-minimal border-2 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center gap-4 py-12 hover:border-blue-500/30 hover:bg-blue-500/5 cursor-pointer group transition-all"
                    >
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Plus size={20} />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-sm font-semibold text-white">Add New Service</h3>
                            <p className="text-[11px] text-slate-500 font-medium">Expand your marketplace catalog</p>
                        </div>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;
