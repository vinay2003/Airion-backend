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
import { useTheme } from '../context/ThemeContext';
import api, { uploadImage } from '../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, Variants } from 'framer-motion';



/**
 * 🍱 Account & Business Settings
 * Manage personal profile, business details, security, and preferences.
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

 const [passwords, setPasswords] = useState({
 oldPassword: '',
 newPassword: '',
 confirmPassword: ''
 });

 useEffect(() => {
 const fetchRegistry = async () => {
 try {
 const res = await api.get('/categories') as any;
 const cats = res.data || res;
 if (cats && cats.length > 0) {
 setCategories(cats);
 } else {
 setCategories([
 { id: '1', name: 'Venue & Spaces' },
 { id: '2', name: 'Catering & Food' },
 { id: '3', name: 'Photography & Media' },
 { id: '4', name: 'Decor & Styling' }
 ]);
 }
 } catch (err) {
 console.error('Failed to fetch categories');
 setCategories([
 { id: '1', name: 'Venue & Spaces' },
 { id: '2', name: 'Catering & Food' },
 { id: '3', name: 'Photography & Media' },
 { id: '4', name: 'Decor & Styling' }
 ]);
 }
 };
 fetchRegistry();
 }, []);

 useEffect(() => {
 if (businessData.categoryId) {
 const fetchSubs = async () => {
 try {
 const res = await api.get(`/categories/${businessData.categoryId}/subcategories`) as any;
 const subs = res.data || res;
 if (subs && subs.length > 0) {
 setSubcategories(subs);
 } else {
 throw new Error('No subcategories');
 }
 } catch (err) {
 const dummySubs: any = {
 '1': [{ id: '101', name: 'Banquet Halls' }, { id: '102', name: 'Open Lawns' }, { id: '103', name: 'Resorts' }],
 '2': [{ id: '201', name: 'Multi-Cuisine' }, { id: '202', name: 'Desserts & Bakers' }],
 '3': [{ id: '301', name: 'Candid Photography' }, { id: '302', name: 'Cinematography' }],
 '4': [{ id: '401', name: 'Floral Decor' }, { id: '402', name: 'Lighting & AV' }]
 };
 setSubcategories(dummySubs[businessData.categoryId] || []);
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
 profileImage: (user as any).avatar || user.vendor?.logo || ''
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
 await api.patch('/auth/profile', {
 name: personalData.name || undefined,
 phoneNumber: personalData.phone || undefined,
 avatar: personalData.profileImage || undefined
 });
 toast.success('Profile updated successfully!');
 refreshUser();
 } catch (err: any) {
 const msg = err.response?.data?.message || 'Failed to update profile.';
 toast.error(Array.isArray(msg) ? msg[0] : msg);
 } finally {
 setSubmitting(false);
 }
 };

 const handleSaveBusiness = async () => {
 if (!businessData.businessName || !businessData.description) {
 toast.error('Please fill in all required fields (Name & Description).');
 return;
 }

 setSubmitting(true);
 try {
 // Filter out empty strings and redundant fields for clean submission
 const cleanBusinessData: any = {};
 Object.entries(businessData).forEach(([key, value]) => {
 // Skip specific keys that are handled separately or might be redundant/empty
 const skipKeys = ['address', 'city', 'state', 'zipCode', 'website', 'instagram', 'avgBookingPrice'];
 if (!skipKeys.includes(key) && value !== '' && value !== null && (Array.isArray(value) ? value.length > 0 : true)) {
 cleanBusinessData[key] = value;
 }
 });

 const ensureUrl = (url: string | null) => {
 if (!url) return null;
 if (url.startsWith('http://') || url.startsWith('https://')) return url;
 return `https://${url}`;
 };

 const submissionData = {
 ...cleanBusinessData,
 averageBookingPrice: Number(businessData.avgBookingPrice) || 0,
 businessAddress: {
 street: businessData.address || '',
 city: businessData.city || '',
 state: businessData.state || '',
 country: 'India',
 zipCode: businessData.zipCode || ''
 },
 socialLinks: {
 website: ensureUrl(businessData.website),
 instagram: ensureUrl(businessData.instagram)
 }
 };

 // Remove category/subcategory if they are empty strings (Zod uuid check)
 if (!submissionData.categoryId) delete submissionData.categoryId;
 if (!submissionData.subcategoryId) delete submissionData.subcategoryId;

 await api.put('/vendors/me', submissionData);
 toast.success('Business profile updated!');
 refreshUser();
 } catch (err: any) {
 const msg = err.response?.data?.message || 'Failed to update business profile.';
 toast.error(Array.isArray(msg) ? msg[0] : msg);
 } finally {
 setSubmitting(false);
 }
 };

 const handleUpdatePassword = async () => {
 if (!passwords.newPassword) {
 toast.error('Please enter a new password');
 return;
 }
 if (passwords.newPassword !== passwords.confirmPassword) {
 toast.error('Passwords do not match');
 return;
 }

 setSubmitting(true);
 try {
 await api.post('/auth/change-password', {
 oldPassword: passwords.oldPassword,
 newPassword: passwords.newPassword
 });
 toast.success('Password updated successfully!');
 setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
 } catch (err: any) {
 const msg = err.response?.data?.message || 'Failed to update password.';
 toast.error(Array.isArray(msg) ? msg[0] : msg);
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
 { id: 'personal', label: 'Personal Information', icon: User, desc: 'Your personal profile details' },
 { id: 'business', label: 'Business Details', icon: Briefcase, desc: 'Company and service info' },
 { id: 'security', label: 'Security', icon: Lock, desc: 'Passwords and access logs' },
 { id: 'preferences', label: 'Preferences', icon: Activity, desc: 'Display and notifications' },
 ];

 const containerVariants: Variants = {
 hidden: { opacity: 0, y: 10 },
 visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
 };

 return (
 <div
 
 
 
 className="space-y-6 px-6 w-full max-w-7xl mx-auto pb-32"
 >
 {/* Header: Matrix Genesis */}
 <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pt-0 pb-6 border-b border-[var(--ease2event-border-subtle)] relative overflow-hidden">
 <div className="relative z-10 space-y-3">
 <h1 className="text-xl font-bold tracking-tight leading-normal">Settings</h1>
 <div className="flex items-center gap-3">
 <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--ease2event-brand-primary)]/10 text-[var(--ease2event-brand-primary)] text-sm font-semibold rounded-full border border-[var(--ease2event-brand-primary)]/20">
 Dashboard Settings
 </span>
 <p className="text-base font-semibold tracking-normal flex items-center gap-2">Manage your account</p>
 </div>
 </div>

 <div className="relative z-10 flex items-center gap-4 bg-[var(--ease2event-bg-elevated)] p-2 rounded-2xl border border-[var(--ease2event-border-base)] ">
 <span className="text-sm font-semibold text-[var(--ease2event-brand-primary)] tracking-normal px-4">Profile Completion</span>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
 {/* 🧭 Navigation Matrix */}
 <div className="lg:col-span-1 space-y-3">
 {tabs.map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as any)}
 className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all group relative overflow-hidden ${activeTab === tab.id
 ? 'bg-[var(--ease2event-brand-primary)] text-white /30 scale-105 z-10'
 : 'bg-[var(--ease2event-bg-surface)] text-[var(--ease2event-text-muted)] border border-[var(--ease2event-border-base)] hover:border-[var(--ease2event-brand-primary)]/50 hover:text-[var(--ease2event-text-primary)]'
 }`}
 >
 <div className={`p-2.5 rounded-xl scale-110 ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-brand-primary)] group-hover:bg-[var(--ease2event-brand-primary)] group-hover:text-white'} transition-all `}>
 <tab.icon size={16} />
 </div>
 <div className="text-left">
 <p className="font-semibold text-sm leading-none">{tab.label}</p>
 <p className={`text-[9px] font-normal mt-1.5 ${activeTab === tab.id ? 'text-white' : 'text-[var(--ease2event-text-muted)]'}`}>{tab.desc}</p>
 </div>
 {activeTab === tab.id && (
 <div layoutId="tab-indicator" className="absolute right-5 w-2 h-2 rounded-full bg-white " />
 )}
 </button>
 ))}

 <div className="mt-8 sm:mt-12 p-6 sm:p-5 card-minimal !bg-[var(--ease2event-brand-primary)]/5 border-y sm:border border-x-0 sm:border-x !border-[var(--ease2event-brand-primary)]/20 space-y-5 sm:space-y-6 relative group overflow-hidden rounded-none sm:rounded-xl -mx-4 sm:mx-0">
 <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-5 group-hover:opacity-10 transition-all ">
 <TrendingUp className="size-16 sm:size-[100px]" />
 </div>
 <div className="flex justify-between items-end relative z-10">
 <div>
 <p className="text-[9px] font-bold text-[var(--ease2event-text-muted)] tracking-widest mb-1">Profile Strength</p>
 <p className="text-lg sm:text-xl font-bold text-[var(--ease2event-brand-primary)]">{calculateStrength()}%</p>
 </div>
 <div className="p-2 sm:p-3 border border-[var(--ease2event-brand-primary)]/20 rounded-xl bg-[var(--ease2event-bg-surface)] ">
 <ShieldCheck className="size-5 sm:size-6 text-[var(--ease2event-brand-primary)]" />
 </div>
 </div>
 <div className="h-2 w-full bg-[var(--ease2event-bg-elevated)] rounded-full overflow-hidden border border-[var(--ease2event-border-subtle)] relative z-10 ">
 <div
 style={{ width: `${calculateStrength()}%` }}
 className="h-full bg-[var(--ease2event-brand-primary)] "
 />
 </div>
 <p className="text-[9px] text-[var(--ease2event-text-muted)] font-bold tracking-tight relative z-10 leading-relaxed opacity-70">
 Complete your profile to increase your visibility and trust score on the platform.
 </p>
 </div>
 </div>

 {/* 🛰️ Registry Content Flow */}
 <div className="lg:col-span-3">
 <AnimatePresence mode="wait">
 <motion.div
 key={activeTab}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.2 }}
 className="card-minimal p-6 sm:!p-12 space-y-5 sm:space-y-16 bg-[var(--ease2event-bg-surface)] border-x-0 sm:border-x border-y border-[var(--ease2event-border-base)] overflow-hidden rounded-none sm:rounded-xl -mx-4 sm:mx-0"
 >
 {/* 👤 Identity Interface */}
 {activeTab === 'personal' && (
 <div className="space-y-5">
 <div className="flex items-center gap-4 border-b border-[var(--ease2event-border-subtle)] pb-8">
 <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/10">
 <User size={16} />
 </div>
 <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)]">Personal Information</h3>
 </div>

 <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6 group bg-[var(--ease2event-bg-elevated)]/30 p-6 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--ease2event-border-subtle)] relative">
 <input
 type="file"
 id="profile-upload"
 className="hidden"
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (!file) return;
 const loaderId = toast.loading('Uploading profile picture...');
 try {
 const data = await uploadImage(file);
 const imageUrl = data.url || data.data?.url || (typeof data === 'string' ? data : null);
 if (imageUrl) {
 setPersonalData(prev => ({ ...prev, profileImage: imageUrl }));
 toast.success('Profile picture updated', { id: loaderId });
 }
 } catch (err) {
 toast.error('Upload failed', { id: loaderId });
 }
 }}
 />
 <div className="relative">
 <Avatar name={personalData.name} src={personalData.profileImage} size="xl" className="size-24 sm:size-32 ring-8 sm:ring-12 ring-[var(--ease2event-bg-surface)] group-hover:ring-[var(--ease2event-brand-primary)]/20 transition-all " />
 <label htmlFor="profile-upload" className="cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-auto md:left-auto md:bottom-1 md:right-1 md:translate-x-0 md:translate-y-0 p-3 bg-[var(--ease2event-brand-primary)]/80 md:bg-[var(--ease2event-brand-primary)] text-white rounded-full md:rounded-2xl hover:scale-110 active:scale-95 transition-all backdrop-blur-sm md:backdrop-blur-none z-10">
 <Camera size={18} />
 </label>
 </div>
 <div className="space-y-4 sm:space-y-5 text-center md:text-left flex-1">
 <h3 className="font-bold text-xs sm:text-sm text-[var(--ease2event-text-primary)] tracking-normal ">Profile Picture</h3>
 <p className="text-[10px] sm:text-[11px] text-[var(--ease2event-text-secondary)] font-semibold leading-relaxed max-w-sm">Upload a professional photo to improve your credibility and brand visibility.</p>
 <label htmlFor="profile-upload" className="cursor-pointer inline-flex items-center justify-center h-10 sm:h-11 px-6 sm:px-5 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] text-[10px] sm:text-sm text-[var(--ease2event-text-primary)] font-bold tracking-normal rounded-xl hover:bg-[var(--ease2event-bg-elevated)] w-full sm:w-auto transition-all">
 Update Photo
 </label>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-3">
 <label className="text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-[0.2em]">Participant Name</label>
 <div className="relative group">
 <User className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity" size={16} />
 <input
 type="text"
 value={personalData.name}
 onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
 className="w-full h-10 bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] rounded-2xl pl-16 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[var(--ease2event-text-primary)]"
 />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-[0.2em]">Phone Number</label>
 <div className="relative group">
 <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity" size={16} />
 <input
 type="text"
 value={personalData.phone}
 onChange={(e: any) => setPersonalData({ ...personalData, phone: e.target.value })}
 className="w-full h-10 bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] rounded-2xl pl-16 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-[var(--ease2event-text-primary)]"
 placeholder="+91"
 />
 </div>
 </div>
 </div>

 <div className="pt-12 border-t border-[var(--ease2event-border-subtle)]">
 <Button onClick={handleSavePersonal} disabled={submitting} className="h-12 px-14 bg-[var(--ease2event-brand-primary)] text-white text-[11px] font-bold tracking-widest rounded-2xl hover:/40 hover:scale-105 transition-all active:scale-[0.98]">
 {submitting ? <Loader2 className="animate-spin" /> : <><Save size={16} className="mr-4" /> SAVE CHANGES</>}
 </Button>
 </div>
 </div>
 )}

 {/* 🏢 Business Configuration */}
 {activeTab === 'business' && (
 <div className="space-y-20">
 <div className="flex flex-col xl:flex-row justify-between items-start border-b border-[var(--ease2event-border-subtle)] pb-8 sm:pb-6 gap-6 sm:gap-4 xl:gap-0">
 <div className="flex items-center gap-4 sm:gap-6">
 <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] text-[var(--ease2event-brand-primary)] shrink-0">
 <Briefcase className="size-6 sm:size-8" />
 </div>
 <div>
 <h2 className="text-xl sm:text-lg font-semibold text-[var(--ease2event-text-primary)] leading-none tracking-tight">Business Profile</h2>
 <p className="text-[10px] sm:text-sm text-[var(--ease2event-text-secondary)] font-semibold mt-1.5 sm:mt-3 tracking-normal">Manage your business details and marketplace listing</p>
 </div>
 </div>
 </div>

 <div className="space-y-24">
 {/* Section: Indexing */}
 <div className="space-y-5">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-6">
 <div className="space-y-2">
 <label className="text-sm font-semibold text-[var(--ease2event-text-secondary)] tracking-wide ml-1">Marketplace Domain</label>
 <select value={businessData.categoryId} onChange={(e: any) => setBusinessData({ ...businessData, categoryId: e.target.value, subcategoryId: '' })} className="w-full h-12 sm:h-10 bg-[var(--ease2event-bg-elevated)] px-5 sm:px-6 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)] font-black text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all appearance-none cursor-pointer">
 <option value="" className="bg-[var(--ease2event-bg-surface)]">Select Core Domain...</option>
 {categories.map((c: any, i: number) => <option key={c._id || c.id || i} value={c._id || c.id} className="bg-[var(--ease2event-bg-surface)]">{c.name}</option>)}
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-sm font-semibold text-[var(--ease2event-text-secondary)] tracking-wide ml-1">Specialized Logic Node</label>
 <select disabled={!businessData.categoryId} value={businessData.subcategoryId} onChange={(e: any) => setBusinessData({ ...businessData, subcategoryId: e.target.value })} className="w-full h-12 sm:h-10 bg-[var(--ease2event-bg-elevated)] px-5 sm:px-6 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)] font-black text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all appearance-none cursor-pointer disabled:opacity-30">
 <option value="" className="bg-[var(--ease2event-bg-surface)]">Select Specialty Node...</option>
 {subcategories.map((s: any, i: number) => <option key={s._id || s.id || i} value={s._id || s.id} className="bg-[var(--ease2event-bg-surface)]">{s.name}</option>)}
 </select>
 </div>
 </div>
 </div>

 {/* Section: Branding */}
 <div className="space-y-5">
 <div className="space-y-6 sm:space-y-5">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-6">
 <div className="space-y-2">
 <label className="text-sm font-semibold text-[var(--ease2event-text-secondary)] tracking-wide ml-1">Business Name</label>
 <input value={businessData.businessName} onChange={(e: any) => setBusinessData({ ...businessData, businessName: e.target.value })} className="w-full h-10 bg-[var(--ease2event-bg-elevated)] px-6 rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold text-base outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all tracking-tight" placeholder="Business Name" />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-semibold text-[var(--ease2event-text-secondary)] tracking-wide ml-1">Business Phone</label>
 <input value={businessData.businessPhone} onChange={(e: any) => setBusinessData({ ...businessData, businessPhone: e.target.value })} className="w-full h-10 bg-[var(--ease2event-bg-elevated)] px-6 rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold text-base outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all tracking-tight" placeholder="Business Phone" />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-sm font-semibold text-[var(--ease2event-text-secondary)] tracking-wide ml-1">Portfolio Highlights</label>
 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6 bg-[var(--ease2event-bg-elevated)]/20 p-4 sm:p-6 rounded-xl sm:rounded-xl md:rounded-[32px] border border-[var(--ease2event-border-subtle)] ">
 {businessData.portfolioImages.map((img, i) => (
 <div
 key={i}
 
 className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] relative group transition-all active:scale-95"
 >
 <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
 <button onClick={() => setBusinessData(p => ({ ...p, portfolioImages: p.portfolioImages.filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={16} /></button>
 </div>
 ))}
 <label className="aspect-square rounded-xl sm:rounded-2xl border-2 border-dashed border-[var(--ease2event-border-base)] flex flex-col items-center justify-center text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-brand-primary)] hover:border-[var(--ease2event-brand-primary)]/50 hover:bg-[var(--ease2event-brand-primary)]/5 transition-all gap-2 sm:gap-3 group cursor-pointer">
 <input
 type="file"
 className="hidden"
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (!file) return;

 const loaderId = toast.loading('Synchronizing asset...');
 try {
 const data = await uploadImage(file);
 const imageUrl = data.url || data.data?.url || (typeof data === 'string' ? data : null);
 if (imageUrl) {
 setBusinessData(prev => ({ ...prev, portfolioImages: [...prev.portfolioImages, imageUrl] }));
 toast.success('Asset synchronized', { id: loaderId });
 }
 } catch (err) {
 toast.error('Sync failure', { id: loaderId });
 }
 }}
 />
 <Plus className="size-6 sm:size-8 group-hover:rotate-90 transition-transform " />
 <span className="text-[8px] sm:text-[9px] font-bold tracking-widest">ADD IMAGE</span>
 </label>
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-sm font-semibold text-[var(--ease2event-text-secondary)] tracking-wide ml-1">Business Description</label>
 <textarea value={businessData.description} onChange={(e: any) => setBusinessData({ ...businessData, description: e.target.value })} rows={6} className="w-full h-auto min-h-[160px] sm:min-h-[200px] bg-[var(--ease2event-bg-elevated)] px-6 sm:px-5 py-6 sm:py-8 rounded-2xl sm:rounded-[32px] border border-[var(--ease2event-border-subtle)] font-bold leading-relaxed text-sm sm:text-base outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all" placeholder="Describe your services and business philosophy..." />
 </div>
 </div>
 </div>

 {/* Section: Telemetry */}
 <div className="space-y-5">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-6">
 <div className="space-y-2">
 <label className="text-sm font-semibold text-[var(--ease2event-text-secondary)] tracking-wide ml-1">City</label>
 <input value={businessData.city} onChange={(e: any) => setBusinessData({ ...businessData, city: e.target.value })} className="w-full h-12 sm:h-10 bg-[var(--ease2event-bg-elevated)] px-5 sm:px-6 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all" placeholder="City" />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-semibold text-[var(--ease2event-text-secondary)] tracking-wide ml-1">Average Booking Price (₹)</label>
 <input type="number" value={businessData.avgBookingPrice} onChange={(e: any) => setBusinessData({ ...businessData, avgBookingPrice: e.target.value })} className="w-full h-12 sm:h-10 bg-[var(--ease2event-bg-elevated)] px-5 sm:px-6 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all" placeholder="75,000" />
 </div>
 </div>
 </div>
 </div>

 <div className="pt-12 border-t border-[var(--ease2event-border-subtle)]">
 <Button onClick={handleSaveBusiness} disabled={submitting} className="h-18 px-16 bg-[var(--ease2event-brand-primary)] text-white text-[12px] font-bold tracking-widest rounded-[24px] hover:/40 hover:scale-105 transition-all active:scale-[0.98]">
 {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={16} className="mr-4" /> UPDATE PROFILE</>}
 </Button>
 </div>
 </div>
 )}

 {/* 🔒 Security & Vault Access */}
 {activeTab === 'security' && (
 <div className="space-y-16">
 <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-b border-[var(--ease2event-border-subtle)] pb-6 sm:pb-6">
 <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] text-amber-500 shrink-0">
 <Lock className="size-6 sm:size-8" />
 </div>
 <div>
 <h2 className="text-xl sm:text-lg font-semibold text-[var(--ease2event-text-primary)] leading-none tracking-tight">Security Settings</h2>
 <p className="text-[10px] sm:text-sm text-[var(--ease2event-text-secondary)] font-semibold mt-1.5 sm:mt-3 tracking-normal">Manage your password and security logs</p>
 </div>
 </div>

 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
 <div className="space-y-6 bg-[var(--ease2event-bg-elevated)]/20 p-6 sm:p-12 rounded-xl sm:rounded-[40px] border border-[var(--ease2event-border-subtle)] ">
 <div className="space-y-5">
 <div className="space-y-4 sm:space-y-5">
 <label className="text-[11px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest ml-1">Current Password</label>
 <input
 type="password"
 value={passwords.oldPassword}
 onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
 placeholder="••••••••"
 className="w-full h-12 sm:h-10 bg-[var(--ease2event-bg-surface)] px-5 sm:px-6 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold tracking-widest text-base sm:text-lg outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
 />
 </div>
 <div className="space-y-4 sm:space-y-5">
 <label className="text-[11px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest ml-1">New Password</label>
 <input
 type="password"
 value={passwords.newPassword}
 onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
 placeholder="••••••••"
 className="w-full h-12 sm:h-10 bg-[var(--ease2event-bg-surface)] px-5 sm:px-6 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold tracking-widest text-base sm:text-lg outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
 />
 </div>
 <div className="space-y-4 sm:space-y-5">
 <label className="text-[11px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest ml-1">Confirm New Password</label>
 <input
 type="password"
 value={passwords.confirmPassword}
 onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
 placeholder="••••••••"
 className="w-full h-12 sm:h-10 bg-[var(--ease2event-bg-surface)] px-5 sm:px-6 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold tracking-widest text-base sm:text-lg outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
 />
 </div>
 </div>
 <Button
 onClick={handleUpdatePassword}
 disabled={submitting}
 className="h-12 sm:h-10 w-full bg-amber-500 text-white shadow-amber-500/20 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-bold tracking-widest hover:scale-105 transition-all"
 >
 {submitting ? <Loader2 className="animate-spin mx-auto" /> : 'UPDATE PASSWORD'}
 </Button>
 </div>

 <div className="card-minimal p-6 bg-gradient-to-br from-amber-500/[0.04] to-transparent border-amber-500/20 flex flex-col justify-between rounded-xl">
 <div>
 <div className="flex items-center gap-4 mb-8">
 <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/10">
 <ShieldCheck size={16} />
 </div>
 <h3 className="text-base font-bold text-[var(--ease2event-text-primary)] tracking-widest">Security Status</h3>
 </div>
 <p className="text-[11px] text-[var(--ease2event-text-secondary)] font-bold leading-relaxed">
 Your account is secured with industry-standard encryption. We monitor active sessions for suspicious activity.
 </p>
 </div>
 <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
 <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-[9px] px-4 py-2 rounded-xl tracking-widest w-full sm:w-auto text-center">SECURED</Badge>
 <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold text-[9px] px-4 py-2 rounded-xl tracking-widest w-full sm:w-auto text-center">ENCRYPTED</Badge>
 </div>
 </div>
 </div>

 {/* 🧾 Access Registry Table */}
 <div className="space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4 sm:gap-0">
 <div>
 <h3 className="text-lg sm:text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Recent Login Activity</h3>
 <p className="text-[8px] sm:text-[9px] text-[var(--ease2event-text-secondary)] font-bold mt-1 sm:mt-2 tracking-widest">History of account access</p>
 </div>
 <button className="text-[11px] sm:text-sm font-bold text-[var(--ease2event-brand-primary)] tracking-widest hover:underline flex items-center gap-2 sm:gap-3 group w-fit">
 <Eye size={12} className="sm:size-[14px] group-hover:scale-125 transition-transform" />
 VIEW ALL ACTIVITY
 </button>
 </div>

 <div className="overflow-x-auto border border-[var(--ease2event-border-subtle)] rounded-2xl sm:rounded-[32px] bg-[var(--ease2event-bg-elevated)]/10 ">
 <table className="w-full text-left min-w-[600px] sm:min-w-0">
 <thead>
 <tr className="bg-[var(--ease2event-bg-elevated)]/40 border-b border-[var(--ease2event-border-subtle)]">
 <th className="px-6 sm:px-6 py-5 sm:py-6 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest ">Device / Terminal</th>
 <th className="px-6 sm:px-6 py-5 sm:py-6 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest ">Auth Method</th>
 <th className="px-6 sm:px-6 py-5 sm:py-6 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest ">Timestamp</th>
 <th className="px-6 sm:px-6 py-5 sm:py-6 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest text-center">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[var(--ease2event-border-subtle)]">
 {[
 { node: 'CHROME_OS_NODE_01', type: 'LOGIN_AUTH', time: 'OCT 15, 14:24', status: 'AUTHORIZED' },
 { node: 'MOBILE_IOS_NX_04', type: 'CIPHER_ROTATION', time: 'OCT 12, 09:15', status: 'AUTHORIZED' },
 { node: 'UNKNOWN_TERMINAL', type: 'FAILED_SYNC', time: 'OCT 10, 23:58', status: 'REJECTED' },
 ].map((log, i) => (
 <tr key={i} className="hover:bg-[var(--ease2event-brand-primary)]/[0.03] transition-all cursor-pointer group">
 <td className="px-6 sm:px-6 py-5 sm:py-7 font-bold text-[10px] sm:text-[11px] text-[var(--ease2event-text-primary)] tracking-tight group-hover:translate-x-2 transition-transform ">{log.node}</td>
 <td className="px-6 sm:px-6 py-5 sm:py-7 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest">{log.type}</td>
 <td className="px-6 sm:px-6 py-5 sm:py-7 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest">{log.time}</td>
 <td className="px-6 sm:px-6 py-5 sm:py-7">
 <div className="flex justify-center">
 <Badge className={` font-bold text-[8px] sm:text-[9px] px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl tracking-widest border transition-all ${log.status === 'AUTHORIZED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
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
 <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-b border-[var(--ease2event-border-subtle)] pb-6 sm:pb-6">
 <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] text-emerald-500 shrink-0">
 <Activity className="size-6 sm:size-8" />
 </div>
 <div>
 <h2 className="text-xl sm:text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-none">Appearance Settings</h2>
 <p className="text-[10px] sm:text-sm text-[var(--ease2event-text-secondary)] font-semibold mt-1.5 sm:mt-3 tracking-normal">Customize your dashboard look and feel</p>
 </div>
 </div>

 <div className="max-w-2xl space-y-6 sm:space-y-5 bg-gradient-to-br from-[var(--ease2event-brand-primary)]/[0.02] to-transparent p-6 sm:p-12 rounded-xl sm:rounded-[40px] border border-[var(--ease2event-border-subtle)] relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-6 sm:p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ">
 <Sparkles className="size-32 sm:size-[160px]" />
 </div>
 <div className="relative z-10 space-y-5 sm:space-y-6">
 <div className="space-y-3">
 <p className="text-[10px] sm:text-[11px] font-bold text-[var(--ease2event-text-secondary)] tracking-widest mb-6 sm:mb-8">Theme Preferences</p>
 <button
 onClick={toggleTheme}
 className="w-full flex items-center justify-between p-4 sm:p-5 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] rounded-[20px] sm:rounded-[28px] hover:border-[var(--ease2event-brand-primary)]/50 transition-all active:scale-[0.98] group/btn"
 >
 <div className="flex items-center gap-4 sm:gap-6">
 <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-brand-primary)] group-hover/btn:rotate-12 transition-transform shrink-0">
 {theme === 'light' ? <Moon className="size-6 sm:size-7" /> : <Sun className="size-6 sm:size-7" />}
 </div>
 <div className="text-left">
 <p className="font-bold text-xs sm:text-sm text-[var(--ease2event-text-primary)] tracking-widest ">{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</p>
 <p className="text-[10px] sm:text-sm text-[var(--ease2event-text-secondary)] font-bold mt-1 sm:mt-2 tracking-tighter opacity-70 leading-tight">Adjust the interface for your environment</p>
 </div>
 </div>
 <ChevronRight className="size-5 sm:size-6 text-[var(--ease2event-text-muted)] group-hover/btn:translate-x-2 transition-transform " />
 </button>
 </div>
 <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-[var(--ease2event-bg-elevated)]/50 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)]">
 <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
 <p className="text-xs sm:text-sm text-[var(--ease2event-text-secondary)] font-bold tracking-widest opacity-60">
 Environment calibrated for optimal display performance.
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
 </div>
 );
};

export default Settings;
