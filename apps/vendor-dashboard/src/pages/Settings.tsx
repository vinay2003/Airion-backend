import React, { useState, useEffect } from 'react';
import { 
    User, Bell, Lock, Globe, Moon, Sun, Save, ShieldCheck, 
    Upload, Loader2, Briefcase, TrendingUp, Sparkles, AlertCircle, 
    Building, Wallet, Layers, Target, RefreshCcw, Image, Tag, 
    ChevronRight, Plus, Trash2, Camera, MapPin, Mail, Phone, Instagram,
    CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '@airion/shared';
import { Avatar, Badge, Button } from '@airion/ui';
import api from '../lib/api';
import toast from 'react-hot-toast';

/**
 * 🍱 Configuration Genesis: Account & Business Registry
 * Modernized with 'Premium Dark Glassmorphism' design nodes.
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
        <div className="space-y-10 max-w-6xl mx-auto pb-24 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">Registry Overhaul</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] italic">Autonomous Configuration Hub</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 shadow-inner">
                    <div className="flex -space-x-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800" />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic pr-2">Core Registry Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Slim Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-500 font-black text-[10px] uppercase tracking-widest italic group ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20'
                                : 'text-slate-500 hover:text-white hover:bg-white/5 hover:translate-x-1'
                                }`}
                        >
                            <tab.icon size={16} className={`${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                    
                    <div className="mt-12 p-6 card-minimal !bg-blue-500/5 !border-blue-500/10 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase text-slate-500 italic tracking-widest">Visibility Index</span>
                            <span className="text-xs font-black text-blue-400 italic">0{calculateStrength()}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${calculateStrength()}%` }} />
                        </div>
                        <div className="flex items-center gap-2">
                             <TrendingUp size={12} className="text-emerald-400" />
                             <p className="text-[9px] text-slate-500 font-black uppercase tracking-tight italic">Registry Integrity: Optimal</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="card-minimal !p-8 space-y-12">
                        
                        {/* Tab: Personal */}
                        {activeTab === 'personal' && (
                            <div className="space-y-10 animate-in fade-in duration-700">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-glow-custom">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Personal Identity Matrix</h2>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 italic">Neural Node Parameters</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 group">
                                    <Avatar name={personalData.name} src={personalData.profileImage} size="xl" className="shadow-2xl ring-4 ring-white/5 group-hover:ring-blue-500/20 transition-all duration-500" />
                                    <div className="space-y-3">
                                        <h3 className="font-black text-xs text-white uppercase tracking-widest italic">Core Identification Image</h3>
                                        <p className="text-[10px] text-slate-500 font-bold italic uppercase tracking-tighter opacity-70">Standard Marketplace Visual Node</p>
                                        <Button className="btn-secondary h-9 px-6 text-[9px] uppercase italic">Deploy New Visual</Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Identity Descriptor (Name)</label>
                                        <input
                                            value={personalData.name}
                                            onChange={(e: any) => setPersonalData({ ...personalData, name: e.target.value })}
                                            className="input-dark-glass font-black italic tracking-tight"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Neural Connection (Phone)</label>
                                        <input
                                            value={personalData.phone}
                                            onChange={(e: any) => setPersonalData({ ...personalData, phone: e.target.value })}
                                            className="input-dark-glass font-black italic tracking-tight"
                                            placeholder="+91 XXXXXXXXXX"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <Button onClick={handleSavePersonal} disabled={submitting} className="btn-primary h-11 px-10 text-[10px] tracking-[0.2em] italic">
                                        {submitting ? <Loader2 className="animate-spin" /> : <><Save size={14} className="mr-2"/> Commit Identification</>}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Tab: Business */}
                        {activeTab === 'business' && (
                            <div className="space-y-12 animate-in fade-in duration-700">
                                <div className="flex justify-between items-start border-b border-white/5 pb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-glow-custom">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Business Logic Config</h2>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 italic">Registry Handshake Status: Live</p>
                                        </div>
                                    </div>
                                    <Badge className="chip-soft-blue italic">ID: {user?.id?.slice(0, 8)}</Badge>
                                </div>

                                <div className="space-y-16">
                                    {/* Section 01 */}
                                    <div className="space-y-8">
                                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                          <div className="w-2 h-2 bg-blue-600 rounded-sm rotate-45" />
                                          01 Indexing Parameters
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">Core Domain Category</label>
                                                <select value={businessData.categoryId} onChange={(e: any) => setBusinessData({ ...businessData, categoryId: e.target.value })} className="input-dark-glass italic font-black">
                                                    <option value="" className="bg-slate-900">Select Domain...</option>
                                                    {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">Specialty Architecture</label>
                                                <select disabled={!businessData.categoryId} value={businessData.subcategoryId} onChange={(e: any) => setBusinessData({ ...businessData, subcategoryId: e.target.value })} className="input-dark-glass italic font-black disabled:opacity-40">
                                                    <option value="" className="bg-slate-900">Select Specialty...</option>
                                                    {subcategories.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 02 */}
                                    <div className="space-y-8">
                                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                          <div className="w-2 h-2 bg-blue-600 rounded-sm rotate-45" />
                                          02 Institutional Identity
                                        </h3>
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">Public Institutional Name</label>
                                                <input value={businessData.businessName} onChange={(e: any) => setBusinessData({ ...businessData, businessName: e.target.value })} className="input-dark-glass italic font-black" placeholder="Your Business Empire" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Visual Registry Clusters</label>
                                                <div className="flex flex-wrap gap-4">
                                                    {businessData.portfolioImages.map((img, i) => (
                                                        <div key={i} className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/5 relative group transition-all duration-500 hover:scale-110 shadow-2xl">
                                                            <img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                                             <button onClick={() => setBusinessData(p => ({...p, portfolioImages: p.portfolioImages.filter((_, idx) => idx !== i)}))} className="absolute inset-0 bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={16}/></button>
                                                        </div>
                                                    ))}
                                                    <button className="w-16 h-16 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-slate-600 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-500"><Plus size={24}/></button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">Institutional Narrative (Bio)</label>
                                                <textarea value={businessData.description} onChange={(e: any) => setBusinessData({...businessData, description: e.target.value})} rows={5} className="input-dark-glass h-auto min-h-[140px] py-4 italic font-bold leading-relaxed" placeholder="Describe your logic philosophy..." />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 03 */}
                                    <div className="space-y-8">
                                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                          <div className="w-2 h-2 bg-blue-600 rounded-sm rotate-45" />
                                          03 Operational Telemetry
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase italic">Base Operations Hub (City)</label>
                                                <input value={businessData.city} onChange={(e: any) => setBusinessData({...businessData, city: e.target.value})} className="input-dark-glass italic font-black" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase italic">Avg. Terminal Value (₹)</label>
                                                <input type="number" value={businessData.avgBookingPrice} onChange={(e: any) => setBusinessData({...businessData, avgBookingPrice: e.target.value})} className="input-dark-glass italic font-black tracking-tighter" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-10 border-t border-white/5">
                                    <Button onClick={handleSaveBusiness} disabled={submitting} className="btn-primary h-12 px-12 text-[10px] tracking-[0.3em] italic">
                                        {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={16} className="mr-2"/> Update Registry Matrix</>}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-10 animate-in fade-in duration-700">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                                        <Lock size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Vault Access Config</h2>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 italic">Neural Shield Status: Guarded</p>
                                    </div>
                                </div>
                                <div className="max-w-md space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">New Protocol Cipher</label>
                                        <input type="password" placeholder="••••••••" className="input-dark-glass italic font-black tracking-[0.5em]" />
                                    </div>
                                    <Button className="btn-secondary h-11 px-8 text-[10px] tracking-[0.2em] italic text-slate-400 hover:text-white border-white/10">Rotate Access Cipher</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-10 animate-in fade-in duration-700">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Interface Core Preferences</h2>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 italic">UI/UX Engine Parameter: Glassmorphism_v4</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-8 rounded-2xl space-y-6">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Visual Spectrum Config</p>
                                    <Button onClick={toggleTheme} className="btn-secondary h-12 px-8 text-[10px] tracking-[0.2em] italic">
                                        {theme === 'light' ? <Moon size={16} className="mr-3 text-blue-400 shadow-glow-custom"/> : <Sun size={16} className="mr-3 text-amber-400"/>}
                                        {theme === 'light' ? 'Switch to DARK_PRIME' : 'Switch to LIGHT_CLASSIC'}
                                    </Button>
                                    <p className="text-[9px] text-slate-600 font-bold italic uppercase tracking-tighter">* System currently optimized for HIGH_CONTRAST_DARK_GLASS</p>
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
