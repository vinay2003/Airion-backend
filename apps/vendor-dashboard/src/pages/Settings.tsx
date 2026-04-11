import React, { useState, useEffect } from 'react';
import {
    User, Bell, Lock, Globe, Moon, Sun, Save, ShieldCheck,
    Upload, Loader2, Briefcase, TrendingUp, Sparkles, AlertCircle,
    Building, Wallet, Layers, Target, RefreshCcw, Image, Tag,
    ChevronRight, Plus, Trash2, Camera, MapPin, Mail, Phone, Instagram,
    CheckCircle2
} from 'lucide-react';
import { useAuth } from '@airion/shared';
import { Avatar, Badge, Button } from '@airion/ui';
import api from '../lib/api';
import toast from 'react-hot-toast';

const useTheme = () => {
    const [theme, setTheme] = React.useState(() => {
        const saved = localStorage.getItem('airion-theme');
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
        localStorage.setItem('airion-theme', theme);
    }, [theme]);

    return { theme, toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light') };
};

/**
 * 🍱 Configuration Genesis: Account & Business Registry
 * Modernized with high-legibility typography and theme-aware nodes.
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
            toast.success('Profile sync complete!');
            refreshUser();
        } catch (err) {
            toast.error('Failed to sync profile.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveBusiness = async () => {
        if (!businessData.businessName || !businessData.businessPhone || !businessData.description) {
            toast.error('Required fields are missing.');
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
            toast.success('Business registry updated!');
            refreshUser();
        } catch (err) {
            toast.error('Failed to update business registry.');
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
        { id: 'personal', label: 'Identity', icon: User },
        { id: 'business', label: 'Business Nodes', icon: ShieldCheck },
        { id: 'security', label: 'Vault Access', icon: Lock },
        { id: 'preferences', label: 'Interface', icon: Globe },
    ];

    return (
        <div className="space-y-16 max-w-6xl mx-auto pb-24 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-[var(--airion-border-subtle)] pb-12">
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-[var(--airion-text-primary)] tracking-tight leading-loose mb-2">Registry Overhaul</h1>
                    <p className="text-lg font-bold text-[var(--airion-text-secondary)] uppercase tracking-widest mb-4">Autonomous Configuration Hub</p>
                </div>
                <div className="flex items-center gap-6 bg-[var(--airion-bg-elevated)] p-4 rounded-3xl border border-[var(--airion-border-subtle)] shadow-inner">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-[var(--airion-bg-surface)] bg-[var(--airion-bg-surface)]" />
                        ))}
                    </div>
                    <span className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-widest px-4">Core Registry Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Slim Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-5 px-8 py-5 rounded-2xl transition-all duration-500 font-bold text-base uppercase tracking-wider group ${activeTab === tab.id
                                ? 'bg-[var(--airion-brand-primary)] text-white shadow-2xl shadow-blue-500/20'
                                : 'text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)] hover:bg-[var(--airion-bg-elevated)] hover:translate-x-1'
                                }`}
                        >
                            <tab.icon size={22} className={`${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                            <span>{tab.label}</span>
                        </button>
                    ))}

                    <div className="mt-12 p-10 card-minimal !bg-blue-500/5 !border-blue-500/10 space-y-8 rounded-[2.5rem]">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold uppercase text-[var(--airion-text-muted)] tracking-widest">Visibility Index</span>
                            <span className="text-lg font-bold text-blue-500 italic">0{calculateStrength()}%</span>
                        </div>
                        <div className="h-3 w-full bg-[var(--airion-bg-elevated)] rounded-full overflow-hidden border border-[var(--airion-border-subtle)]">
                            <div className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: `${calculateStrength()}%` }} />
                        </div>
                        <div className="flex items-center gap-4">
                            <TrendingUp size={20} className="text-emerald-500" />
                            <p className="text-base text-[var(--airion-text-muted)] font-bold uppercase tracking-tight">Registry Integrity: Optimal</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="card-minimal !p-6 md:!p-14 space-y-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border-[var(--airion-border-base)]">

                        {/* Tab: Personal */}
                        {activeTab === 'personal' && (
                            <div className="space-y-16 animate-in fade-in duration-700">
                                <div className="flex items-center gap-6 border-b border-[var(--airion-border-subtle)] pb-12">
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-subtle)] flex items-center justify-center text-blue-500 shadow-lg">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-[var(--airion-text-primary)] uppercase tracking-wider leading-none mb-3">Personal Identity Matrix</h2>
                                        <p className="text-base text-[var(--airion-text-muted)] font-bold uppercase tracking-widest leading-relaxed">Neural Node Parameters</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12 group">
                                    <Avatar name={personalData.name} src={personalData.profileImage} size="xl" className="shadow-2xl ring-4 ring-[var(--airion-border-subtle)] group-hover:ring-blue-500/20 transition-all duration-500" />
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-xl text-[var(--airion-text-primary)] uppercase tracking-widest mb-2">Core Identification Image</h3>
                                        <p className="text-base text-[var(--airion-text-muted)] font-semibold uppercase tracking-tight opacity-80 mb-4">Standard Marketplace Visual Node</p>
                                        <Button className="btn-secondary h-12 px-10 text-base font-bold uppercase tracking-widest border-[var(--airion-border-subtle)]">Deploy New Visual</Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-[0.2em] pl-1 block mb-4">Identity Descriptor (Name)</label>
                                        <input
                                            value={personalData.name}
                                            onChange={(e: any) => setPersonalData({ ...personalData, name: e.target.value })}
                                            className="input-dark-glass font-bold text-base h-16"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-[0.2em] pl-1 block mb-4">Neural Connection (Phone)</label>
                                        <input
                                            value={personalData.phone}
                                            onChange={(e: any) => setPersonalData({ ...personalData, phone: e.target.value })}
                                            className="input-dark-glass font-bold text-base h-16"
                                            placeholder="+91 XXXXXXXXXX"
                                        />
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-[var(--airion-border-subtle)]">
                                    <Button onClick={handleSavePersonal} disabled={submitting} className="btn-primary w-full md:w-auto h-16 md:h-18 px-8 md:px-16 text-base font-bold tracking-[0.2em] uppercase rounded-2xl">
                                        {submitting ? <Loader2 className="animate-spin" /> : <><Save size={24} className="mr-4" /> Commit Identification</>}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Tab: Business */}
                        {activeTab === 'business' && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 border-b border-[var(--airion-border-subtle)] pb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-xl bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-subtle)] flex items-center justify-center text-blue-500 shadow-lg">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-[var(--airion-text-primary)] uppercase tracking-wider leading-none mb-2">Business Logic Config</h2>
                                            <p className="text-base text-[var(--airion-text-muted)] font-bold uppercase tracking-widest leading-relaxed">Status: Active Registry</p>
                                        </div>
                                    </div>
                                    <Badge className="chip-soft-blue h-10 px-6 md:px-8 font-bold text-sm md:text-base self-start md:self-auto">ID: {user?.id?.slice(0, 8)}</Badge>
                                </div>

                                <div className="space-y-12">
                                    {/* Section 01 */}
                                    <div className="space-y-8">
                                        <h3 className="text-base font-bold text-blue-500 uppercase tracking-[0.4em] flex items-center gap-5 italic mb-4">
                                            <div className="w-3 h-3 bg-blue-600 rounded-sm rotate-45 shadow-lg shadow-blue-500/20" />
                                            01 Indexing Parameters
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-widest block mb-2">Core Domain Category</label>
                                                <select value={businessData.categoryId} onChange={(e: any) => setBusinessData({ ...businessData, categoryId: e.target.value, subcategoryId: '' })} className="input-dark-glass font-bold text-base h-14">
                                                    <option value="" className="bg-[var(--airion-bg-surface)]">Select Domain...</option>
                                                    {categories.map((c: any) => <option key={c._id || c.id} value={c._id || c.id} className="bg-[var(--airion-bg-surface)]">{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-widest block mb-2">Specialty Architecture</label>
                                                <select disabled={!businessData.categoryId} value={businessData.subcategoryId} onChange={(e: any) => setBusinessData({ ...businessData, subcategoryId: e.target.value })} className="input-dark-glass font-bold text-base h-14 disabled:opacity-40">
                                                    <option value="" className="bg-[var(--airion-bg-surface)]">Select Specialty...</option>
                                                    {subcategories.map((s: any) => <option key={s._id || s.id} value={s._id || s.id} className="bg-[var(--airion-bg-surface)]">{s.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 02 */}
                                    <div className="space-y-8">
                                        <h3 className="text-base font-bold text-blue-500 uppercase tracking-[0.4em] flex items-center gap-5 italic mb-4">
                                            <div className="w-3 h-3 bg-blue-600 rounded-sm rotate-45 shadow-lg shadow-blue-500/20" />
                                            02 Institutional Identity
                                        </h3>
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-widest block mb-2">Public Institutional Name</label>
                                                <input value={businessData.businessName} onChange={(e: any) => setBusinessData({ ...businessData, businessName: e.target.value })} className="input-dark-glass font-bold text-base h-14" placeholder="Your Business Empire" />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-widest block mb-2">Visual Registry Clusters</label>
                                                <div className="flex flex-wrap gap-4">
                                                    {businessData.portfolioImages.map((img, i) => (
                                                        <div key={i} className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-subtle)] relative group transition-all duration-500 hover:scale-110 shadow-xl">
                                                            <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                                            <button onClick={() => setBusinessData(p => ({ ...p, portfolioImages: p.portfolioImages.filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={24} /></button>
                                                        </div>
                                                    ))}
                                                    <button className="w-20 h-20 rounded-xl border-2 border-dashed border-[var(--airion-border-base)] flex items-center justify-center text-[var(--airion-text-muted)] hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-500"><Plus size={32} /></button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-widest block mb-2">Institutional Narrative (Bio)</label>
                                                <textarea value={businessData.description} onChange={(e: any) => setBusinessData({ ...businessData, description: e.target.value })} rows={4} className="input-dark-glass h-auto min-h-[140px] py-4 font-bold text-base leading-relaxed" placeholder="Describe your logic philosophy..." />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 03 */}
                                    <div className="space-y-8">
                                        <h3 className="text-base font-bold text-blue-500 uppercase tracking-[0.4em] flex items-center gap-5 italic mb-4">
                                            <div className="w-3 h-3 bg-blue-600 rounded-sm rotate-45 shadow-lg shadow-blue-500/20" />
                                            03 Operational Telemetry
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-widest block mb-2">Base Operations Hub (City)</label>
                                                <input value={businessData.city} onChange={(e: any) => setBusinessData({ ...businessData, city: e.target.value })} className="input-dark-glass font-bold text-base h-14" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-widest block mb-2">Avg. Terminal Value (₹)</label>
                                                <input type="number" value={businessData.avgBookingPrice} onChange={(e: any) => setBusinessData({ ...businessData, avgBookingPrice: e.target.value })} className="input-dark-glass font-bold text-base h-14 tracking-tighter" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-16 border-t border-[var(--airion-border-subtle)]">
                                    <Button onClick={handleSaveBusiness} disabled={submitting} className="btn-primary w-full md:w-auto h-16 md:h-18 px-8 md:px-16 text-base font-bold tracking-[0.25em] uppercase rounded-2xl">
                                        {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={28} className="mr-5" /> Update Registry Matrix</>}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <div className="flex items-center gap-6 border-b border-[var(--airion-border-subtle)] pb-8">
                                    <div className="w-14 h-14 rounded-xl bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-subtle)] flex items-center justify-center text-amber-500 shadow-lg">
                                        <Lock size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--airion-text-primary)] uppercase tracking-wider leading-none mb-2">Vault Access Config</h2>
                                        <p className="text-base text-[var(--airion-text-muted)] font-bold uppercase tracking-widest leading-relaxed">Status: Guarded</p>
                                    </div>
                                </div>
                                <div className="max-w-xl space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-widest block mb-2">New Protocol Cipher</label>
                                        <input type="password" placeholder="••••••••" className="input-dark-glass font-bold text-base h-14 tracking-[0.5em]" />
                                    </div>
                                    <Button className="btn-secondary h-12 px-10 text-base font-bold tracking-[0.2em] uppercase border-[var(--airion-border-subtle)] rounded-xl">Rotate Access Cipher</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <div className="flex items-center gap-6 border-b border-[var(--airion-border-subtle)] pb-8">
                                    <div className="w-14 h-14 rounded-xl bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-subtle)] flex items-center justify-center text-emerald-500 shadow-lg">
                                        <Globe size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--airion-text-primary)] uppercase tracking-wider leading-none mb-2">Interface Core</h2>
                                        <p className="text-base text-[var(--airion-text-muted)] font-bold uppercase tracking-widest leading-relaxed">Engine: Neural_v5</p>
                                    </div>
                                </div>
                                <div className="bg-[var(--airion-bg-surface)] border border-[var(--airion-border-base)] p-10 rounded-2xl space-y-8 shadow-2xl">
                                    <div className="space-y-4">
                                        <p className="text-base font-bold text-[var(--airion-text-muted)] uppercase tracking-[0.3em] pl-1 mb-2">Visual Spectrum Config</p>
                                        <Button onClick={toggleTheme} className="btn-secondary h-14 px-10 text-base font-bold tracking-[0.2em] uppercase rounded-xl border-[var(--airion-border-subtle)]">
                                            {theme === 'light' ? <Moon size={24} className="mr-4 text-blue-500" /> : <Sun size={24} className="mr-4 text-amber-500" />}
                                            {theme === 'light' ? 'Switch to DARK_PRIME' : 'Switch to LIGHT_CLASSIC'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
