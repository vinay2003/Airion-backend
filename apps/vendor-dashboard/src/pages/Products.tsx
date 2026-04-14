import React, { useState, useEffect } from 'react';
import { 
    Plus, Search, Filter, Edit3, X, Loader2, 
    CheckCircle2, Info, Sparkles, Package as PackageIcon, Zap, DollarSign,
    Box, Layers, ArrowUpRight, ChevronRight, Activity, MapPin, Users,
    Globe, ShieldCheck, Star
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button, Badge, Skeleton } from '@ease2event/ui';
import { useAuth } from '@ease2event/shared';
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
 * 📦 Service Inventory: High-Fidelity Asset Management
 * Refactored for 'Premium SaaS' aesthetics with DM Sans & Framer Motion.
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
            toast.error('Protocol ID and Base Capture are required.');
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
            toast.success('Inventory node synchronized!');
            setIsAdding(false);
            const res = await api.get(`/services?vendorId=${vendorId}`) as { data: any[] };
            setProducts(res.data || []);
        } catch (err) {
            toast.error('Failed to synchronize node.');
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

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    if (isAdding) {
        return (
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-6xl mx-auto space-y-12 pb-32 px-4"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-10 border-b border-[var(--ease2event-border-subtle)]">
                    <motion.div variants={itemVariants}>
                        <h1 className="text-4xl font-black text-[var(--ease2event-text-primary)] tracking-tighter leading-none uppercase italic font-display">Inventory Configuration</h1>
                        <div className="flex items-center gap-3 mt-4">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 text-blue-500 text-sm font-black uppercase rounded-full border border-blue-500/20">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                Node Protocol Active
                            </span>
                            <p className="text-[var(--ease2event-text-muted)] font-black text-[11px] uppercase tracking-[0.3em] leading-none opacity-60">Asset Definition • Pricing Matrix</p>
                        </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex items-center gap-4">
                        <Button onClick={() => setIsAdding(false)} className="px-8 h-12 bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] rounded-2xl font-black text-sm uppercase tracking-widest text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)] transition-all">
                            Discard
                        </Button>
                        <Button
                            onClick={handleCreateService}
                            disabled={submitting}
                            className="px-10 h-12 bg-[var(--ease2event-brand-primary)] text-white shadow-xl shadow-[var(--ease2event-brand-primary)]/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all active:scale-95"
                        >
                            {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Synchronize Node'}
                        </Button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        {/* Section: Basic Intelligence */}
                        <motion.div variants={itemVariants} className="card-minimal !p-10 space-y-10 bg-[var(--ease2event-bg-surface)] shadow-2xl">
                            <div className="flex items-center gap-4 border-b border-[var(--ease2event-border-subtle)] pb-8">
                                <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl shadow-sm border border-blue-500/10">
                                    <Box size={24} />
                                </div>
                                <h3 className="text-xl font-black text-[var(--ease2event-text-primary)] italic uppercase font-display">Basic Intelligence</h3>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.2em] italic">Operational Protocol ID</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="E.G. GRAND_BALLROOM_SYNAPSE"
                                        className="w-full h-14 bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-2xl px-6 text-sm font-black italic outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)] uppercase tracking-widest"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.2em] italic">Capability Matrix Description</label>
                                    <textarea 
                                        rows={6}
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="DESCRIBE_OPERATIONAL_PARAMETERS..."
                                        className="w-full min-h-[180px] bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-3xl px-6 py-5 text-sm font-medium leading-relaxed outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)]"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Section: Capacity Hub */}
                        <motion.div variants={itemVariants} className="card-minimal !p-10 space-y-10 bg-[var(--ease2event-bg-surface)] shadow-2xl">
                            <div className="flex items-center gap-4 border-b border-[var(--ease2event-border-subtle)] pb-8">
                                <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl shadow-sm border border-blue-500/10">
                                    <Layers size={24} />
                                </div>
                                <h3 className="text-xl font-black text-[var(--ease2event-text-primary)] italic uppercase font-display">Protocol Capacity</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.2em] italic">Base Capture (₹)</label>
                                    <div className="relative">
                                         <DollarSign size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--ease2event-brand-primary)]" />
                                         <input 
                                             type="number" 
                                             value={formData.basePrice}
                                             onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                                             placeholder="CAPTURE_VAL"
                                             className="w-full h-14 bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-2xl pl-14 pr-6 text-sm font-black italic outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)] uppercase tracking-widest"
                                         />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.2em] italic">Max Node Throughput</label>
                                    <input 
                                        type="number" 
                                        placeholder="UNIT_CAP"
                                        value={formData.guestCapacity}
                                        onChange={(e) => setFormData({...formData, guestCapacity: e.target.value})}
                                        className="w-full h-14 bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-2xl px-6 text-sm font-black italic outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)] uppercase tracking-widest"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-10">
                        {/* Section: Asset Visuals */}
                        <motion.div variants={itemVariants} className="card-minimal !p-8 space-y-8 bg-gradient-to-br from-[var(--ease2event-brand-primary)]/[0.03] to-transparent shadow-xl">
                            <h3 className="text-lg font-black text-[var(--ease2event-text-primary)] italic uppercase font-display tracking-tight">Node Visuals</h3>
                            <div className="aspect-video rounded-2xl border-2 border-dashed border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-elevated)]/30 flex flex-col items-center justify-center text-center p-8 group cursor-pointer hover:bg-[var(--ease2event-bg-elevated)] hover:border-[var(--ease2event-brand-primary)]/30 transition-all">
                                <Plus size={24} className="text-[var(--ease2event-text-muted)] group-hover:text-[var(--ease2event-brand-primary)] group-hover:scale-125 transition-all mb-4" />
                                <p className="text-[9px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.2em] italic">Synchronize Visual Node</p>
                            </div>
                        </motion.div>

                        {/* Section: Operational Stats */}
                        <motion.div variants={itemVariants} className="card-minimal !p-8 bg-[var(--ease2event-bg-surface)] shadow-xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                               <ShieldCheck size={120} />
                           </div>
                           <h3 className="text-lg font-black text-[var(--ease2event-text-primary)] italic uppercase font-display mb-6 tracking-tight relative z-10">Registry Status</h3>
                           <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center py-2 border-b border-[var(--ease2event-border-subtle)]">
                                    <span className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic">Sync Level</span>
                                    <span className="text-sm font-black text-[var(--ease2event-brand-primary)] italic">ALPHA_CMD_01</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-[var(--ease2event-border-subtle)]">
                                    <span className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic">Throughput</span>
                                    <span className="text-sm font-black text-emerald-500 italic">NOMINAL</span>
                                </div>
                                <p className="text-[9px] text-[var(--ease2event-text-muted)] font-black uppercase italic tracking-tighter opacity-60 mt-4">
                                    Synchronizing this node will propagate the registry across the marketplace matrix.
                                </p>
                           </div>
                        </motion.div>
                    </div>
                </div>

                {/* Section: Multi-Tier Architecture */}
                <motion.div variants={itemVariants} className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-black text-[var(--ease2event-text-primary)] italic uppercase font-display tracking-tight">Tier Architecture</h3>
                        <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-4 py-2 rounded-2xl font-black uppercase italic text-sm tracking-widest shadow-sm">Autonomous Tiering Active</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {formData.packages.map((pkg, i) => (
                            <motion.div 
                                key={pkg.name} 
                                whileHover={{ y: -8 }}
                                className={`card-minimal !p-10 transition-all duration-500 border shadow-2xl relative overflow-hidden rounded-[2.5rem] ${pkg.isPopular ? 'bg-gradient-to-br from-[var(--ease2event-brand-primary)]/[0.05] to-transparent border-[var(--ease2event-brand-primary)]/30' : 'bg-[var(--ease2event-bg-surface)] border-[var(--ease2event-border-base)]'}`}
                            >
                                <div className="space-y-10 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-black text-[var(--ease2event-text-primary)] italic uppercase font-display">{pkg.name}</span>
                                        {pkg.isPopular && <Badge className="bg-[var(--ease2event-brand-primary)] text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full shadow-2xl shadow-[var(--ease2event-brand-primary)]/30 italic">Priority Node</Badge>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] italic">Tier Capture (₹)</label>
                                        <input 
                                            type="number" 
                                            value={pkg.price}
                                            onChange={(e) => updatePackage(i, 'price', e.target.value)}
                                            placeholder="VAL"
                                            className="w-full h-12 bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-xl px-4 text-sm font-black italic outline-none text-[var(--ease2event-text-primary)] uppercase tracking-widest"
                                        />
                                    </div>
                                    <div className="space-y-5">
                                        <label className="text-[9px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] italic">Capability Modules</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Catering', 'Decor', 'Audio', 'Visuals'].map(feat => (
                                                <button 
                                                    key={feat}
                                                    onClick={() => {
                                                        const current = pkg.features;
                                                        const next = current.includes(feat) ? current.filter(c => c !== feat) : [...current, feat];
                                                        updatePackage(i, 'features', next);
                                                    }}
                                                    className={`text-[9px] py-2.5 rounded-xl border transition-all font-black uppercase tracking-widest italic ${pkg.features.includes(feat) ? 'bg-[var(--ease2event-brand-primary)] text-white border-[var(--ease2event-brand-primary)] shadow-xl shadow-[var(--ease2event-brand-primary)]/20' : 'bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-text-muted)] border-[var(--ease2event-border-subtle)] hover:text-[var(--ease2event-text-primary)]'}`}
                                                >
                                                    {feat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12 pb-32 px-4 sm:px-6 max-w-7xl mx-auto"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-10 border-b border-[var(--ease2event-border-subtle)]">
                <motion.div variants={itemVariants}>
                    <h1 className="text-4xl font-black text-[var(--ease2event-text-primary)] tracking-tighter leading-none uppercase italic font-display">Inventory Registry</h1>
                    <div className="flex items-center gap-3 mt-4">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-sm font-black uppercase rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            Inventory Synchronized
                        </span>
                        <p className="text-[var(--ease2event-text-muted)] font-black text-[11px] uppercase tracking-[0.3em] leading-none opacity-60">Asset Throughput • Portfolio Matrix</p>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Button 
                        onClick={() => setIsAdding(true)} 
                        className="h-14 px-10 bg-[var(--ease2event-brand-primary)] text-white shadow-2xl shadow-[var(--ease2event-brand-primary)]/30 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:scale-105 transition-all italic active:scale-95"
                        leftIcon={<Plus size={18} />}
                    >
                        Sync New Node
                    </Button>
                </motion.div>
            </div>

            {/* Matrix Filters */}
            <motion.div variants={itemVariants} className="flex flex-col xl:flex-row gap-6 p-4 bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] rounded-3xl shadow-inner">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--ease2event-text-muted)] group-focus-within:text-[var(--ease2event-brand-primary)] transition-colors" size={24} />
                    <input 
                        type="text" 
                        placeholder="SEARCH_REGISTRY_NODES..." 
                        className="w-full bg-transparent border-none rounded-2xl py-5 pl-16 pr-6 text-base font-bold italic text-[var(--ease2event-text-primary)] focus:ring-0 outline-none placeholder:text-[var(--ease2event-text-muted)] uppercase tracking-widest transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-[var(--ease2event-bg-surface)] p-1.5 rounded-2xl border border-[var(--ease2event-border-subtle)] shadow-md">
                    {['ALL_NODES', 'ACTIVE_SYNC', 'ARCHIVE_CMD'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => {}}
                            className={`px-8 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all italic ${tab === 'ALL_NODES' ? 'bg-[var(--ease2event-brand-primary)] text-white shadow-xl shadow-indigo-500/20' : 'text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)]'}`}
                        >
                            {tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Asset Node Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-80 rounded-[3rem] border border-[var(--ease2event-border-subtle)] animate-pulse bg-[var(--ease2event-bg-surface)] shadow-lg"></div>
                    ))
                ) : (
                    <>
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((prod: any, idx: number) => (
                            <motion.div 
                                key={prod.id} 
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="card-minimal !p-0 overflow-hidden group border-[var(--ease2event-border-base)] shadow-2xl bg-[var(--ease2event-bg-surface)] hover:border-[var(--ease2event-brand-primary)]/40 transition-all duration-700 flex flex-col h-full cursor-pointer rounded-[3rem]"
                            >
                                <div className="h-56 bg-slate-900 relative overflow-hidden">
                                    <img 
                                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1000'} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                        alt={prod.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                    <div className="absolute top-6 left-6">
                                        <Badge className="bg-[var(--ease2event-brand-primary)]/20 backdrop-blur-xl border border-[var(--ease2event-brand-primary)]/30 text-white font-black italic uppercase text-[9px] tracking-[0.2em] px-4 py-2 rounded-2xl shadow-2xl">
                                            {prod.guestCapacity ? 'Operational Venue' : 'Service Unit'}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                        <button className="p-3 bg-white/10 backdrop-blur-xl text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all shadow-2xl"><Edit3 size={16} /></button>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-sm font-black text-[var(--ease2event-brand-primary)] uppercase tracking-[0.2em] italic opacity-80">{prod.category?.name || 'GENERIC_PROTOCOL'}</p>
                                        <h3 className="text-xl font-black text-[var(--ease2event-text-primary)] truncate italic font-display uppercase tracking-tight group-hover:text-[var(--ease2event-brand-primary)] transition-colors">{prod.title}</h3>
                                    </div>
                                    <p className="text-xs text-[var(--ease2event-text-muted)] font-medium line-clamp-3 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{prod.description}</p>
                                    
                                    <div className="mt-auto pt-8 flex items-center justify-between border-t border-[var(--ease2event-border-subtle)]">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-[var(--ease2event-text-muted)] font-black uppercase tracking-[0.3em] italic opacity-50">Base Capture</span>
                                            <span className="text-2xl font-black text-[var(--ease2event-text-primary)] mt-1 italic font-display tracking-tighter group-hover:scale-105 transition-transform origin-left">₹{Number(prod.basePrice).toLocaleString()}</span>
                                        </div>
                                        <div className="flex -space-x-3 group-hover:space-x-1 transition-all">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-2xl bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-bg-surface)] text-sm font-black text-[var(--ease2event-text-muted)] flex items-center justify-center shadow-lg group-hover:shadow-[var(--ease2event-brand-primary)]/10 transition-all italic">v{i}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    <motion.div 
                        whileHover={{ y: -5, scale: 1.02 }}
                        onClick={() => setIsAdding(true)}
                        className="card-minimal border-4 border-dashed border-[var(--ease2event-border-subtle)] bg-transparent flex flex-col items-center justify-center gap-6 py-20 hover:border-[var(--ease2event-brand-primary)]/40 hover:bg-[var(--ease2event-brand-primary)]/[0.03] cursor-pointer group transition-all duration-700 shadow-xl rounded-[3rem]"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] flex items-center justify-center text-[var(--ease2event-text-muted)] group-hover:bg-[var(--ease2event-brand-primary)] group-hover:text-white group-hover:rotate-90 group-hover:scale-110 transition-all duration-700 shadow-2xl">
                            <Plus size={32} />
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className="text-lg font-black text-[var(--ease2event-text-primary)] italic uppercase tracking-widest font-display">Sync New Node</h3>
                            <p className="text-sm text-[var(--ease2event-text-muted)] font-black uppercase tracking-[0.4em] italic opacity-60">Expand Operational Reach</p>
                        </div>
                    </motion.div>
                   </>
                )}
            </div>
        </motion.div>
    );
};

export default Products;
