import React, { useState, useEffect } from 'react';
import {
    User, Bell, Lock, Globe, Moon, Sun, Save, ShieldCheck,
    Upload, Loader2, Briefcase, TrendingUp, Sparkles, AlertCircle,
    Building, Wallet, Layers, Target, RefreshCcw, Image, Tag,
    ChevronRight, Plus, Trash2, Camera, MapPin, Mail, Phone, Instagram,
    CheckCircle2, Cpu, Database, Eye, Activity
} from 'lucide-react';
import { useAuth } from '@ease2event/shared';
import { Avatar, Badge, Button } from '@ease2event/ui';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const useTheme = () => {
    const [theme, setTheme] = React.useState(() => {
        const saved = localStorage.getItem('ease2event-theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    React.useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('ease2event-theme', theme);
    }, [theme]);

    return { theme, toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light') };
};

/**
 * 🍱 Configuration Genesis: Account & Business Registry
 * Modernized with 'Premium SaaS' design tokens and Framer Motion.
 * Features specialized Access Registry Logs and Operational Telemetry.
 */
const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');
    const [submitting, setSubmitting] = useState(false);

    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);

    const [personalData, setPersonalData] = useState({
        name: '',
        phone: '',
        profileImage: ''
    });

    const [businessData, setBusinessData] = useState({
        businessName: '',
        businessEmail: '',
        businessPhone: '',
        gstNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        description: '',
        yearsInBusiness: '',
        avgBookingPrice: '',
        website: '',
        instagram: '',
        monthlyEventVolume: '',
        acquisitionChannels: [] as string[],
        painPoints: [] as string[],
        categoryId: '',
        subcategoryId: '',
        portfolioImages: [] as string[],
    });

    useEffect(() => {
        const fetchRegistry = async () => {
            try {
                const cats = await api.get('/categories') as any[];
                setCategories(cats);
            } catch (err) {
                console.error('Failed to fetch categories');
            }
        };
        fetchRegistry();
    }, []);

    useEffect(() => {
        if (businessData.categoryId) {
            const fetchSubs = async () => {
                try {
                    const subs = await api.get(`/categories/${businessData.categoryId}/subcategories`) as any[];
                    setSubcategories(subs);
                } catch (err) {
                    setSubcategories([]);
                }
            };
            fetchSubs();
        } else {
            setSubcategories([]);
        }
    }, [businessData.categoryId]);

    useEffect(() => {
        if (user) {
            setPersonalData({
                name: user.name || '',
                phone: user.phoneNumber || '',
                profileImage: user.vendor?.logo || ''
            });

            const v = user.vendor;
            if (v) {
                setBusinessData({
                    businessName: v.businessName || '',
                    businessEmail: v.businessEmail || '',
                    businessPhone: v.businessPhone || '',
                    gstNumber: v.gstNumber || '',
                    address: v.businessAddress?.street || v.businessAddress?.address || '',
                    city: v.businessAddress?.city || v.city || '',
                    state: v.businessAddress?.state || '',
                    zipCode: v.businessAddress?.zipCode || '',
                    description: v.businessDescription || '',
                    yearsInBusiness: v.yearsInBusiness || '',
                    avgBookingPrice: v.averageBookingPrice ? String(v.averageBookingPrice) : '',
                    website: v.socialLinks?.website || '',
                    instagram: v.socialLinks?.instagram || '',
                    monthlyEventVolume: v.monthlyEventVolume || '',
                    acquisitionChannels: v.acquisitionChannels || [],
                    painPoints: v.painPoints || [],
                    categoryId: v.categoryId || '',
                    subcategoryId: v.subcategoryId || '',
                    portfolioImages: v.portfolioImages || [],
                });
            }
        }
    }, [user]);

    const handleSavePersonal = async () => {
        setSubmitting(true);
        try {
            await api.patch('/auth/profile', personalData);
            toast.success('Identity sync complete!');
            refreshUser();
        } catch (err) {
            toast.error('Identity collision detected. Sync failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveBusiness = async () => {
        if (!businessData.businessName || !businessData.businessPhone || !businessData.description) {
            toast.error('Critical registry parameters missing.');
            return;
        }

        setSubmitting(true);
        try {
            const submissionData = {
                ...businessData,
                averageBookingPrice: Number(businessData.avgBookingPrice) || 0,
                businessAddress: {
                    street: businessData.address,
                    city: businessData.city,
                    state: businessData.state,
                    country: 'India',
                    zipCode: businessData.zipCode
                },
                socialLinks: {
                    website: businessData.website,
                    instagram: businessData.instagram
                }
            };
            await api.put('/vendors/me', submissionData);
            toast.success('Business logic deployment successful!');
            refreshUser();
        } catch (err) {
            toast.error('Registry write operation failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const calculateStrength = () => {
        const fields = [
            businessData.businessName, businessData.businessPhone,
            businessData.description, businessData.city,
            businessData.yearsInBusiness, businessData.avgBookingPrice,
            businessData.categoryId
        ];
        const filled = fields.filter(f => !!f).length;
        return Math.min(Math.round((filled / fields.length) * 100), 100);
    };

    const tabs = [
        { id: 'personal', label: 'Identity', icon: User, desc: 'Neural Core Identification' },
        { id: 'business', label: 'Business Nodes', icon: Cpu, desc: 'Operational Logic Config' },
        { id: 'security', label: 'Vault Access', icon: Lock, desc: 'Protocol Encryption' },
        { id: 'preferences', label: 'Interface', icon: Activity, desc: 'Visual Spectrum Settings' },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };

    return (
        <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="space-y-10 max-w-7xl mx-auto pb-32 px-4 sm:px-6"
        >
            {/* Header: Matrix Genesis */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-10 border-b border-[var(--ease2event-border-subtle)] relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                    <h1 className="text-4xl font-black text-[var(--ease2event-text-primary)] tracking-tighter uppercase italic font-display leading-none">Registry Overhaul</h1>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--ease2event-brand-primary)]/10 text-[var(--ease2event-brand-primary)] text-sm font-black uppercase rounded-full border border-[var(--ease2event-brand-primary)]/20">
                            <Database size={12} />
                            Core Config v4.2
                        </span>
                        <p className="text-[var(--ease2event-text-muted)] font-black text-[11px] uppercase tracking-[0.3em] italic opacity-60">Autonomous Configuration Hub</p>
                    </div>
                </div>
                
                <div className="relative z-10 flex items-center gap-4 bg-[var(--ease2event-bg-elevated)] p-2 rounded-2xl border border-[var(--ease2event-border-base)] shadow-lg">
                    <div className="flex -space-x-3 px-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--ease2event-bg-base)] bg-[var(--ease2event-brand-primary)] flex items-center justify-center text-[8px] font-black text-white shadow-md">
                                {i}
                            </div>
                        ))}
                    </div>
                    <div className="h-8 w-[1px] bg-[var(--ease2event-border-subtle)] mx-2" />
                    <span className="text-sm font-black text-[var(--ease2event-brand-primary)] uppercase tracking-widest italic pr-4">Active Registry Node</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* 🧭 Navigation Matrix */}
                <div className="lg:col-span-1 space-y-3">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${activeTab === tab.id
                                ? 'bg-[var(--ease2event-brand-primary)] text-white shadow-2xl shadow-[var(--ease2event-brand-primary)]/30 scale-105 z-10'
                                : 'bg-[var(--ease2event-bg-surface)] text-[var(--ease2event-text-muted)] border border-[var(--ease2event-border-base)] hover:border-[var(--ease2event-brand-primary)]/50 hover:text-[var(--ease2event-text-primary)]'
                                }`}
                        >
                            <div className={`p-2.5 rounded-xl scale-110 ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-brand-primary)] group-hover:bg-[var(--ease2event-brand-primary)] group-hover:text-white'} transition-all duration-300`}>
                                <tab.icon size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-[11px] uppercase tracking-widest italic leading-none">{tab.label}</p>
                                <p className={`text-[8px] font-bold uppercase mt-1.5 opacity-60 ${activeTab === tab.id ? 'text-white' : 'text-[var(--ease2event-text-muted)]'}`}>{tab.desc}</p>
                            </div>
                            {activeTab === tab.id && (
                                <motion.div layoutId="tab-indicator" className="absolute right-5 w-2 h-2 rounded-full bg-white shadow-[0_0_15px_white]" />
                            )}
                        </motion.button>
                    ))}
                    
                    <div className="mt-12 p-8 card-minimal !bg-[var(--ease2event-brand-primary)]/5 !border-[var(--ease2event-brand-primary)]/20 space-y-6 relative group overflow-hidden shadow-xl rounded-[2.5rem]">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700">
                            <TrendingUp size={100} />
                        </div>
                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <p className="text-[9px] font-black uppercase text-[var(--ease2event-text-muted)] italic tracking-[0.2em] mb-1">Registry Integrity</p>
                                <p className="text-3xl font-black text-[var(--ease2event-brand-primary)] italic font-display">{calculateStrength()}%</p>
                            </div>
                            <div className="p-3 border border-[var(--ease2event-brand-primary)]/20 rounded-xl bg-[var(--ease2event-bg-surface)] shadow-sm">
                                <ShieldCheck size={24} className="text-[var(--ease2event-brand-primary)]" />
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-[var(--ease2event-bg-elevated)] rounded-full overflow-hidden border border-[var(--ease2event-border-subtle)] relative z-10 shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${calculateStrength()}%` }}
                                transition={{ duration: 1.5, type: "spring" }}
                                className="h-full bg-[var(--ease2event-brand-primary)] shadow-[0_0_20px_var(--ease2event-brand-primary)]" 
                            />
                        </div>
                        <p className="text-[9px] text-[var(--ease2event-text-muted)] font-black italic uppercase tracking-tighter relative z-10 leading-relaxed font-display opacity-70">
                            System analysis indicates optimal identity synchronization. Proceed with node updates.
                        </p>
                    </div>
                </div>

                {/* 🛰️ Registry Content Flow */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="card-minimal !p-12 space-y-16 bg-[var(--ease2event-bg-surface)] border-[var(--ease2event-border-base)] shadow-2xl overflow-hidden rounded-[3rem]"
                        >
                            {/* 👤 Identity Interface */}
                            {activeTab === 'personal' && (
                                <div className="space-y-12">
                                    <div className="flex items-center gap-6 border-b border-[var(--ease2event-border-subtle)] pb-10">
                                        <div className="p-4 rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] text-[var(--ease2event-brand-primary)] shadow-sm">
                                            <User size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-[var(--ease2event-text-primary)] uppercase tracking-tighter italic font-display leading-none">Identity Core</h2>
                                            <p className="text-sm text-[var(--ease2event-text-muted)] font-black uppercase mt-3 tracking-[0.3em] italic opacity-60">Authentication & Identification Nexus</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-12 group bg-[var(--ease2event-bg-elevated)]/30 p-10 rounded-3xl border border-[var(--ease2event-border-subtle)] shadow-inner">
                                        <div className="relative">
                                            <Avatar name={personalData.name} src={personalData.profileImage} size="xl" className="shadow-2xl ring-12 ring-[var(--ease2event-bg-surface)] group-hover:ring-[var(--ease2event-brand-primary)]/20 transition-all duration-700" />
                                            <button className="absolute bottom-1 right-1 p-3 bg-[var(--ease2event-brand-primary)] text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                                                <Camera size={18} />
                                            </button>
                                        </div>
                                        <div className="space-y-5 text-center md:text-left flex-1">
                                            <h3 className="font-black text-sm text-[var(--ease2event-text-primary)] uppercase tracking-[0.2em] italic">Visual Identity Node</h3>
                                            <p className="text-[11px] text-[var(--ease2event-text-muted)] font-black italic uppercase leading-relaxed max-w-sm opacity-60">Provide a high-resolution visual registry for optimized vendor visibility across the network.</p>
                                            <Button className="h-11 px-8 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] text-sm font-black tracking-[0.2em] italic rounded-xl hover:bg-[var(--ease2event-bg-elevated)]">DEPLOY_VISUAL_ASSET</Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] italic ml-1">Identity Tag (Full Name)</label>
                                            <input
                                                value={personalData.name}
                                                onChange={(e: any) => setPersonalData({ ...personalData, name: e.target.value })}
                                                className="w-full h-14 bg-[var(--ease2event-bg-elevated)] px-6 rounded-2xl border border-[var(--ease2event-border-subtle)] font-black italic tracking-wide text-base outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all uppercase"
                                                placeholder="Neural ID Name"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] italic ml-1">Registry Contact (Neural Link)</label>
                                            <input
                                                value={personalData.phone}
                                                onChange={(e: any) => setPersonalData({ ...personalData, phone: e.target.value })}
                                                className="w-full h-14 bg-[var(--ease2event-bg-elevated)] px-6 rounded-2xl border border-[var(--ease2event-border-subtle)] font-black italic tracking-wide text-base outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all uppercase"
                                                placeholder="+91 Matrix Connection"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-12 border-t border-[var(--ease2event-border-subtle)]">
                                        <Button onClick={handleSavePersonal} disabled={submitting} className="h-16 px-14 bg-[var(--ease2event-brand-primary)] text-white text-[11px] font-black tracking-[0.4em] italic rounded-2xl shadow-2xl hover:shadow-[var(--ease2event-brand-primary)]/40 hover:scale-105 transition-all active:scale-[0.98]">
                                            {submitting ? <Loader2 className="animate-spin" /> : <><Save size={20} className="mr-4"/> COMMIT IDENTIFICATION</>}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* 🏢 Business Configuration */}
                            {activeTab === 'business' && (
                                <div className="space-y-20">
                                    <div className="flex justify-between items-start border-b border-[var(--ease2event-border-subtle)] pb-10">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] text-[var(--ease2event-brand-primary)] shadow-sm">
                                                <Cpu size={32} />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-[var(--ease2event-text-primary)] uppercase tracking-tighter italic font-display leading-none">Operational Logic</h2>
                                                <p className="text-sm text-[var(--ease2event-text-muted)] font-black uppercase mt-3 tracking-[0.3em] italic opacity-60">System Registry & Behavioral Parameters</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-[var(--ease2event-brand-primary)]/10 text-[var(--ease2event-brand-primary)] border border-[var(--ease2event-brand-primary)]/20 italic font-black text-sm px-4 py-2 rounded-2xl uppercase tracking-widest shadow-sm">
                                            NODE_ID: {user?.id?.slice(0, 12)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-24">
                                        {/* Section: Indexing */}
                                        <div className="space-y-12">
                                            <h3 className="text-[12px] font-black text-[var(--ease2event-brand-primary)] uppercase tracking-[0.5em] flex items-center gap-6 italic">
                                              <span className="w-16 h-[1.5px] bg-[var(--ease2event-brand-primary)] opacity-40"></span>
                                              SYNC_INDEX_PARAMETERS
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="space-y-4">
                                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic tracking-[0.2em] ml-1">Marketplace Domain</label>
                                                    <select value={businessData.categoryId} onChange={(e: any) => setBusinessData({ ...businessData, categoryId: e.target.value, subcategoryId: '' })} className="w-full h-14 bg-[var(--ease2event-bg-elevated)] px-6 rounded-2xl border border-[var(--ease2event-border-subtle)] italic font-black text-sm outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all uppercase appearance-none cursor-pointer">
                                                        <option value="" className="bg-[var(--ease2event-bg-surface)]">Select Core Domain...</option>
                                                        {categories.map((c: any) => <option key={c._id || c.id} value={c._id || c.id} className="bg-[var(--ease2event-bg-surface)]">{c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic tracking-[0.2em] ml-1">Specialized Logic Node</label>
                                                    <select disabled={!businessData.categoryId} value={businessData.subcategoryId} onChange={(e: any) => setBusinessData({ ...businessData, subcategoryId: e.target.value })} className="w-full h-14 bg-[var(--ease2event-bg-elevated)] px-6 rounded-2xl border border-[var(--ease2event-border-subtle)] italic font-black text-sm outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all uppercase appearance-none cursor-pointer disabled:opacity-30">
                                                        <option value="" className="bg-[var(--ease2event-bg-surface)]">Select Specialty Node...</option>
                                                        {subcategories.map((s: any) => <option key={s._id || s.id} value={s._id || s.id} className="bg-[var(--ease2event-bg-surface)]">{s.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section: Branding */}
                                        <div className="space-y-12">
                                            <h3 className="text-[12px] font-black text-[var(--ease2event-brand-primary)] uppercase tracking-[0.5em] flex items-center gap-6 italic">
                                              <span className="w-16 h-[1.5px] bg-[var(--ease2event-brand-primary)] opacity-40"></span>
                                              INSTITUTIONAL_DYNAMICS
                                            </h3>
                                            <div className="space-y-12">
                                                <div className="space-y-4">
                                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic tracking-[0.2em] ml-1">Public Entity Designation</label>
                                                    <input value={businessData.businessName} onChange={(e: any) => setBusinessData({ ...businessData, businessName: e.target.value })} className="w-full h-16 bg-[var(--ease2event-bg-elevated)] px-8 rounded-3xl border border-[var(--ease2event-border-subtle)] italic font-black text-xl outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all uppercase tracking-tighter" placeholder="Entity Designation" />
                                                </div>
                                                <div className="space-y-6">
                                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.2em] italic ml-1">Registry Visual Clusters (Portfolio)</label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 bg-[var(--ease2event-bg-elevated)]/20 p-10 rounded-[32px] border border-[var(--ease2event-border-subtle)] shadow-inner">
                                                        {businessData.portfolioImages.map((img, i) => (
                                                            <motion.div 
                                                                key={i} 
                                                                whileHover={{ scale: 1.1, rotate: 2 }}
                                                                className="aspect-square rounded-2xl overflow-hidden bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] relative group transition-all duration-700 shadow-xl active:scale-95"
                                                            >
                                                                <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                                <button onClick={() => setBusinessData(p => ({...p, portfolioImages: p.portfolioImages.filter((_, idx) => idx !== i)}))} className="absolute inset-0 bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={24}/></button>
                                                            </motion.div>
                                                        ))}
                                                        <button className="aspect-square rounded-2xl border-2 border-dashed border-[var(--ease2event-border-base)] flex flex-col items-center justify-center text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-brand-primary)] hover:border-[var(--ease2event-brand-primary)]/50 hover:bg-[var(--ease2event-brand-primary)]/5 transition-all duration-500 gap-3 group">
                                                            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">ADD_NODE</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic tracking-[0.2em] ml-1">Operational Narrative (System Description)</label>
                                                    <textarea value={businessData.description} onChange={(e: any) => setBusinessData({...businessData, description: e.target.value})} rows={6} className="w-full h-auto min-h-[200px] bg-[var(--ease2event-bg-elevated)] px-8 py-8 rounded-[32px] border border-[var(--ease2event-border-subtle)] italic font-bold leading-relaxed text-base outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all" placeholder="Define your system philosophy and service level protocols..." />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section: Telemetry */}
                                        <div className="space-y-12">
                                            <h3 className="text-[12px] font-black text-[var(--ease2event-brand-primary)] uppercase tracking-[0.5em] flex items-center gap-6 italic">
                                              <span className="w-16 h-[1.5px] bg-[var(--ease2event-brand-primary)] opacity-40"></span>
                                              OPERATIONAL_TELEMETRY
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="space-y-4">
                                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic tracking-[0.2em] ml-1">Regional Deployment Node (City)</label>
                                                    <input value={businessData.city} onChange={(e: any) => setBusinessData({...businessData, city: e.target.value})} className="w-full h-14 bg-[var(--ease2event-bg-elevated)] px-6 rounded-2xl border border-[var(--ease2event-border-subtle)] italic font-black text-sm outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all uppercase" placeholder="Deployment Hub City" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic tracking-[0.2em] ml-1">Avg. Node Terminal Value (₹)</label>
                                                    <input type="number" value={businessData.avgBookingPrice} onChange={(e: any) => setBusinessData({...businessData, avgBookingPrice: e.target.value})} className="w-full h-14 bg-[var(--ease2event-bg-elevated)] px-6 rounded-2xl border border-[var(--ease2event-border-subtle)] italic font-black text-sm outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all uppercase tracking-tighter" placeholder="75,000" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-12 border-t border-[var(--ease2event-border-subtle)]">
                                        <Button onClick={handleSaveBusiness} disabled={submitting} className="h-18 px-16 bg-[var(--ease2event-brand-primary)] text-white text-[12px] font-black tracking-[0.5em] italic rounded-[24px] shadow-2xl hover:shadow-[var(--ease2event-brand-primary)]/40 hover:scale-105 transition-all active:scale-[0.98]">
                                            {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={24} className="mr-4"/> DEPLOY REGISTRY MATRIX</>}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* 🔒 Security & Vault Access */}
                            {activeTab === 'security' && (
                                <div className="space-y-16">
                                    <div className="flex items-center gap-6 border-b border-[var(--ease2event-border-subtle)] pb-10">
                                        <div className="p-4 rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] text-amber-500 shadow-sm">
                                            <Lock size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-[var(--ease2event-text-primary)] uppercase tracking-tighter italic font-display leading-none">Vault Access</h2>
                                            <p className="text-sm text-[var(--ease2event-text-muted)] font-black uppercase mt-3 tracking-[0.3em] italic opacity-60">Security Protocols & Encryption Keys</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                        <div className="space-y-10 bg-[var(--ease2event-bg-elevated)]/20 p-12 rounded-[32px] border border-[var(--ease2event-border-subtle)] shadow-inner">
                                            <div className="space-y-5">
                                                <label className="text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic tracking-[0.3em] ml-1">New Protocol Cipher (Password)</label>
                                                <input type="password" placeholder="••••••••" className="w-full h-14 bg-[var(--ease2event-bg-surface)] px-6 rounded-2xl border border-[var(--ease2event-border-subtle)] italic font-black tracking-[1em] text-lg outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" />
                                            </div>
                                            <Button className="h-14 w-full bg-amber-500 text-white shadow-xl shadow-amber-500/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] italic hover:scale-105 transition-all">ROTATE ACCESS CIPHER</Button>
                                        </div>

                                        <div className="card-minimal !p-10 bg-gradient-to-br from-amber-500/[0.04] to-transparent border-amber-500/20 flex flex-col justify-between shadow-xl rounded-[2.5rem]">
                                            <div>
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/10">
                                                        <ShieldCheck size={24} />
                                                    </div>
                                                    <h3 className="text-base font-black text-[var(--ease2event-text-primary)] uppercase italic tracking-[0.2em]">Protocol Guard</h3>
                                                </div>
                                                <p className="text-[11px] text-[var(--ease2event-text-muted)] font-black italic uppercase leading-relaxed opacity-60">
                                                    Operational vault is currently encrypted with 256-bit AES registry protocols. All access attempts are monitored live.
                                                </p>
                                            </div>
                                            <div className="mt-10 flex items-center gap-4">
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 italic font-black text-[9px] px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm">NODE_SECURED</Badge>
                                                <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 italic font-black text-[9px] px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm">ENCRYPTED</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 🧾 Access Registry Table */}
                                    <div className="space-y-10">
                                        <div className="flex items-center justify-between px-2">
                                            <div>
                                                <h3 className="text-xl font-black text-[var(--ease2event-text-primary)] italic uppercase font-display tracking-tight">Access Registry Logs</h3>
                                                <p className="text-[9px] text-[var(--ease2event-text-muted)] font-black uppercase mt-2 tracking-[0.3em] italic opacity-60">Node Synchronization History</p>
                                            </div>
                                            <button className="text-sm font-black text-[var(--ease2event-brand-primary)] uppercase tracking-widest italic hover:underline flex items-center gap-3 group">
                                                <Eye size={14} className="group-hover:scale-125 transition-transform" />
                                                ACCESS_FULL_REGISTRY
                                            </button>
                                        </div>
                                        
                                        <div className="overflow-hidden border border-[var(--ease2event-border-subtle)] rounded-[32px] bg-[var(--ease2event-bg-elevated)]/10 shadow-2xl">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-[var(--ease2event-bg-elevated)]/40 border-b border-[var(--ease2event-border-subtle)]">
                                                        <th className="px-10 py-6 text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] italic">Terminal Node</th>
                                                        <th className="px-10 py-6 text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] italic">Access Protocol</th>
                                                        <th className="px-10 py-6 text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] italic">Timestamp</th>
                                                        <th className="px-10 py-6 text-sm font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] italic text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[var(--ease2event-border-subtle)]">
                                                    {[
                                                        { node: 'CHROME_OS_NODE_01', type: 'LOGIN_AUTH', time: 'OCT 15, 14:24', status: 'AUTHORIZED' },
                                                        { node: 'MOBILE_IOS_NX_04', type: 'CIPHER_ROTATION', time: 'OCT 12, 09:15', status: 'AUTHORIZED' },
                                                        { node: 'UNKNOWN_TERMINAL', type: 'FAILED_SYNC', time: 'OCT 10, 23:58', status: 'REJECTED' },
                                                    ].map((log, i) => (
                                                        <tr key={i} className="hover:bg-[var(--ease2event-brand-primary)]/[0.03] transition-all duration-500 cursor-pointer group">
                                                            <td className="px-10 py-7 font-black text-[11px] text-[var(--ease2event-text-primary)] tracking-tight italic uppercase group-hover:translate-x-2 transition-transform duration-500">{log.node}</td>
                                                            <td className="px-10 py-7 text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic tracking-widest opacity-80">{log.type}</td>
                                                            <td className="px-10 py-7 text-sm font-black text-[var(--ease2event-text-muted)] uppercase italic tracking-widest opacity-80">{log.time}</td>
                                                            <td className="px-10 py-7">
                                                                <div className="flex justify-center">
                                                                    <Badge className={`italic font-black text-[9px] px-5 py-2 rounded-2xl uppercase tracking-widest border shadow-sm transition-all duration-500 ${
                                                                        log.status === 'AUTHORIZED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-rose-500/10'
                                                                    }`}>
                                                                        {log.status}
                                                                    </Badge>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ⚙️ Interface Spectrum Matrix */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-16">
                                    <div className="flex items-center gap-6 border-b border-[var(--ease2event-border-subtle)] pb-10">
                                        <div className="p-4 rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] text-emerald-500 shadow-sm">
                                            <Activity size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-[var(--ease2event-text-primary)] uppercase tracking-tighter italic font-display leading-none">Interface Matrix</h2>
                                            <p className="text-sm text-[var(--ease2event-text-muted)] font-black uppercase mt-3 tracking-[0.3em] italic opacity-60">Visual Spectrum & Rendering Config</p>
                                        </div>
                                    </div>
                                    
                                    <div className="max-w-2xl space-y-12 bg-gradient-to-br from-[var(--ease2event-brand-primary)]/[0.02] to-transparent p-12 rounded-[40px] border border-[var(--ease2event-border-subtle)] shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
                                            <Sparkles size={160} />
                                        </div>
                                        <div className="relative z-10 space-y-10">
                                            <div className="space-y-3">
                                                <p className="text-[11px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.4em] italic mb-8">Spectrum Protocol Configuration</p>
                                                <button 
                                                    onClick={toggleTheme} 
                                                    className="w-full flex items-center justify-between p-8 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] rounded-[28px] hover:border-[var(--ease2event-brand-primary)]/50 transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] group/btn"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="p-4 rounded-2xl bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-brand-primary)] group-hover/btn:rotate-12 transition-transform duration-500">
                                                            {theme === 'light' ? <Moon size={28} /> : <Sun size={28} />}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-black text-sm text-[var(--ease2event-text-primary)] uppercase tracking-widest italic">{theme === 'light' ? 'DARK_PRIME_CORE' : 'LIGHT_NEURAL_FIELD'}</p>
                                                            <p className="text-sm text-[var(--ease2event-text-muted)] font-black uppercase mt-2 tracking-tighter opacity-70 italic">Synchronize visual spectrum deployment</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={24} className="text-[var(--ease2event-text-muted)] group-hover/btn:translate-x-2 transition-transform duration-500" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-4 p-5 bg-[var(--ease2event-bg-elevated)]/50 rounded-2xl border border-[var(--ease2event-border-subtle)]">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <p className="text-sm text-[var(--ease2event-text-muted)] font-black italic uppercase tracking-widest opacity-60">
                                                    System calibrated for high-fidelity interactive rendering protocols.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
