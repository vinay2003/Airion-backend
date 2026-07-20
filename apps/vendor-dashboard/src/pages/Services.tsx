import React, { useState, useEffect } from 'react';
import {
 Plus, Search, Filter, Edit3, Trash2, X, Loader2, Upload, IndianRupee,
 CheckCircle2, Info, Sparkles, Package as PackageIcon, Zap, DollarSign,
 Box, Layers, ArrowUpRight, ChevronRight, Activity, MapPin, Users,
 Globe, ShieldCheck, Star
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button, Badge, Skeleton } from '@ease2event/ui';
import { useAuth } from '@ease2event/shared';
import api, { uploadImage } from '../lib/api';
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
const Services: React.FC = () => {
 const { user } = useAuth();
 const vendorId = user?.vendor?.id || '';
 const [searchTerm, setSearchTerm] = useState('');
 const [isAdding, setIsAdding] = useState(false);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [activeTab, setActiveTab] = useState('ALL_SERVICES');
 const [submitting, setSubmitting] = useState(false);
 const [loading, setLoading] = useState(true);
 const [services, setServices] = useState<any[]>([]);
 const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
 const [isDeleting, setIsDeleting] = useState(false);

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
 const res = await api.get(`/services?vendorId=${vendorId}&limit=100`) as any[];
 setServices(res || []);
 } catch (err: any) {
 setServices([]);
 } finally {
 setLoading(false);
 }
 };
 fetchData();
 }, [vendorId]);

 const resetForm = () => {
 setEditingId(null);
 setFormData({
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
 images: [],
 features: [],
 packages: [
 { name: 'Silver', price: '', description: 'Basic tier with essential features', features: [], isPopular: false },
 { name: 'Gold', price: '', description: 'Most popular choice for premium events', features: [], isPopular: true },
 { name: 'Platinum', price: '', description: 'Luxury all-inclusive experience', features: [], isPopular: false },
 ]
 });
 };

 const handleEditProduct = (product: any) => {
 setEditingId(product.id);
 setFormData({
 title: product.title || '',
 description: product.description || '',
 basePrice: String(product.basePrice || ''),
 categoryId: product.categoryId || '',
 subcategoryId: product.subcategoryId || '',
 guestCapacity: String(product.guestCapacity || ''),
 locationType: product.locationType || 'onsite',
 address: product.address || '',
 city: product.city || '',
 state: product.state || '',
 images: product.images || [],
 features: product.features || [],
 packages: product.packages && product.packages.length > 0 ? product.packages.map((p: any) => ({
 ...p,
 price: String(p.price || '')
 })) : [
 { name: 'Silver', price: '', description: 'Basic tier with essential features', features: [], isPopular: false },
 { name: 'Gold', price: '', description: 'Most popular choice for premium events', features: [], isPopular: true },
 { name: 'Platinum', price: '', description: 'Luxury all-inclusive experience', features: [], isPopular: false },
 ]
 });
 setIsAdding(true);
 };

 const handleDeleteProduct = (id: string) => {
 setServiceToDelete(id);
 };

 const confirmDelete = async () => {
 if (!serviceToDelete) return;
 setIsDeleting(true);
 try {
 await api.delete(`/services/${serviceToDelete}`);
 toast.success('Service deleted successfully!');
 setServiceToDelete(null);
 const res = await api.get(`/services?vendorId=${vendorId}&limit=100`) as any[];
 setServices(res || []);
 } catch (err) {
 console.error('Deletion failed:', err);
 toast.error('Failed to delete service.');
 } finally {
 setIsDeleting(false);
 }
 };


 const handleSaveService = async () => {
 if (!formData.title || !formData.basePrice) {
 toast.error('Product Title and Base Price are required.');
 return;
 }

 setSubmitting(true);
 try {
 const submission = {
 ...formData,
 vendorId,
 // Ensure empty strings don't break UUID validation in backend
 categoryId: formData.categoryId || undefined,
 subcategoryId: formData.subcategoryId || undefined,
 basePrice: Number(formData.basePrice),
 guestCapacity: formData.guestCapacity ? Number(formData.guestCapacity) : undefined,
 packages: formData.packages.map(p => ({
 ...p,
 price: Number(p.price) || 0,
 features: p.features
 }))
 };

 if (editingId) {
 await api.put(`/services/${editingId}`, submission);
 toast.success('Service updated successfully!');
 } else {
 await api.post('/services', submission);
 toast.success('Service created successfully!');
 }
 resetForm();
 setIsAdding(false);
 const res = await api.get(`/services?vendorId=${vendorId}&limit=100`) as any[];
 setServices(res || []);
 } catch (err) {
 console.error('Submission failed:', err);
 toast.error('Failed to save service. Please check your connection.');
 } finally {
 setSubmitting(false);
 }
 };

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;

 toast.loading('Uploading Image...', { id: 'upload' });
 try {
 const data = await uploadImage(file);
 const imageUrl = data.url || data.data?.url || (typeof data === 'string' ? data : null);
 if (imageUrl) {
 setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
 toast.success('Visual Node Linked', { id: 'upload' });
 }
 } catch (err) {
 toast.error('Visual Link Failed', { id: 'upload' });
 }
 };

 const updatePackage = (index: number, field: string, value: any) => {
 const newPackages = [...formData.packages];
 (newPackages[index] as any)[field] = value;
 setFormData({ ...formData, packages: newPackages });
 };

 const filteredServices = services.filter(p => {
 const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
 let matchesTab = true;
 if (activeTab === 'ACTIVE') matchesTab = p.isActive !== false;
 if (activeTab === 'ARCHIVED') matchesTab = p.isActive === false;
 return matchesSearch && matchesTab;
 });

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
 <div
 
 
 
 className="space-y-5 pb-32 px-6 w-full max-w-7xl mx-auto"
 >
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 py-10 border-b border-[var(--ease2event-border-subtle)]">
 <div >
 <h1 className="text-lg font-bold text-[var(--ease2event-text-primary)] tracking-tighter leading-none">Inventory Configuration</h1>
 <div className="flex items-center gap-3 mt-4">
 <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded-full border border-blue-500/20">
 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
 Service Active
 </span>
 <p className="text-[var(--ease2event-text-secondary)] font-bold text-[10px] tracking-widest leading-none">Service & Pricing Details</p>
 </div>
 </div>

 <div className="flex items-center gap-4">
 <Button onClick={() => { resetForm(); setIsAdding(false); }} className="cursor-pointer flex items-center justify-center h-11 sm:h-12 px-4 sm:px-6 rounded-2xl font-bold text-[9px] sm:text-[11px] tracking-widest bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-secondary)] hover:bg-[var(--ease2event-bg-surface)] hover:text-[var(--ease2event-text-primary)] transition-all active:scale-95 whitespace-nowrap">
 Discard
 </Button>
 <Button
 onClick={handleSaveService}
 disabled={submitting}
 className="cursor-pointer px-6 h-12 bg-[var(--ease2event-brand-primary)] text-white rounded-2xl font-bold text-xs tracking-widest transition-all active:scale-95 hover:opacity-90 flex items-center justify-center"
 >
 {submitting ? <Loader2 size={18} className="animate-spin" /> : (editingId ? 'Update Service' : 'Save Service')}
 </Button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 space-y-6">
 {/* Section: Basic Intelligence */}
 <div className="card-minimal p-6 space-y-6 bg-[var(--ease2event-bg-surface)] ">
 <div className="flex items-center gap-4 border-b border-[var(--ease2event-border-subtle)] pb-8">
 <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/10">
 <Box size={16} />
 </div>
 <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)]">Basic Details</h3>
 </div>

 <div className="space-y-5">
 <div className="space-y-3">
 <label className="text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-[0.2em]">Product Title</label>
 <input
 type="text"
 value={formData.title}
 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
 placeholder="E.G. Deluxe Wedding Venue"
 className="w-full h-10 bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-2xl px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)]"
 />
 </div>
 <div className="space-y-3">
 <label className="text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-[0.2em]">Detailed Description</label>
 <textarea
 rows={6}
 value={formData.description}
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 placeholder="Enter full service description..."
 className="w-full min-h-[180px] bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-3xl px-6 py-5 text-sm font-bold leading-relaxed outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)]"
 />
 </div>
 </div>
 </div>

 {/* Section: Capacity Hub */}
 <div className="card-minimal p-6 space-y-6 bg-[var(--ease2event-bg-surface)] ">
 <div className="flex items-center gap-4 border-b border-[var(--ease2event-border-subtle)] pb-8">
 <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/10">
 <Layers size={16} />
 </div>
 <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)]">Capacity Details</h3>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-3">
 <label className="text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-[0.2em]">Base Price (₹)</label>
 <div className="relative">
 <IndianRupee size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--ease2event-brand-primary)]" />
 <input
 type="number"
 value={formData.basePrice}
 onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
 placeholder="0.00"
 className="w-full h-10 bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-2xl pl-14 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)]"
 />
 </div>
 </div>
 <div className="space-y-3">
 <label className="text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-[0.2em]">Max Guest Capacity</label>
 <input
 type="number"
 placeholder="E.G. 500"
 value={formData.guestCapacity}
 onChange={(e) => setFormData({ ...formData, guestCapacity: e.target.value })}
 className="w-full h-10 bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-2xl px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 transition-all text-[var(--ease2event-text-primary)]"
 />
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-6">
 {/* Section: Asset Visuals */}
 <div className="card-minimal p-5 space-y-5 bg-gradient-to-br from-[var(--ease2event-brand-primary)]/[0.05] to-transparent ">
 <h3 className="text-lg font-black text-[var(--ease2event-text-primary)] font-display tracking-tight">Service Images</h3>
 <div className="grid grid-cols-2 gap-4">
 {formData.images.map((img, i) => (
 <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group border border-[var(--ease2event-border-subtle)]">
 <img src={img} className="w-full h-full object-cover transition-transform " alt="Node Visual" />
 <button
 onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
 className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-xl scale-0  transition-all "
 >
 <X size={12} />
 </button>
 </div>
 ))}
 </div>
 <div className="flex flex-col gap-3 col-span-2">
 <div className="flex flex-col sm:flex-row gap-3">
 <input
 placeholder="https://image-url..."
 className="w-full bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] rounded-2xl py-3 px-4 font-bold text-sm text-[var(--ease2event-text-primary)] focus:ring-2 focus:ring-[var(--ease2event-brand-primary)]/20 outline-none placeholder:text-[var(--ease2event-text-secondary)] transition-all"
 onKeyDown={(e) => {
 if (e.key === 'Enter') {
 e.preventDefault();
 const val = (e.target as HTMLInputElement).value;
 if (val) {
 setFormData(prev => ({ ...prev, images: [...prev.images, val] }));
 (e.target as HTMLInputElement).value = '';
 }
 }
 }}
 />
 <label className="cursor-pointer bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] hover:border-[var(--ease2event-brand-primary)]/50 hover:bg-[var(--ease2event-brand-primary)]/10 text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-brand-primary)] font-semibold text-xs sm:text-sm h-12 sm:h-auto px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all shrink-0">
 <Upload size={16} /> Upload Image
 <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
 </label>
 </div>
 <p className="text-xs text-[var(--ease2event-text-secondary)] font-semibold">Press enter to add URL or upload directly from device.</p>
 </div>
 </div>

 {/* Section: Operational Stats */}
 <div className="card-minimal p-5 bg-[var(--ease2event-bg-surface)] relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-5 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
 <ShieldCheck size={120} />
 </div>
 <h3 className="text-lg font-bold text-[var(--ease2event-text-primary)] mb-6 tracking-tight relative z-10">System Status</h3>
 <div className="space-y-6 relative z-10">
 <div className="flex justify-between items-center py-2 border-b border-[var(--ease2event-border-subtle)]">
 <span className="text-sm font-bold text-[var(--ease2event-text-secondary)]">Visibility</span>
 <span className="text-sm font-bold text-[var(--ease2event-brand-primary)]">Public</span>
 </div>
 <div className="flex justify-between items-center py-2 border-b border-[var(--ease2event-border-subtle)]">
 <span className="text-sm font-bold text-[var(--ease2event-text-secondary)]">Performance</span>
 <span className="text-sm font-bold text-emerald-500">Good</span>
 </div>
 <p className="text-[12px] text-[var(--ease2event-text-secondary)] font-bold tracking-tighter opacity-100 mt-4">
 Update this across all platforms. </p>
 </div>
 </div>
 </div>
 </div>

 {/* Section: Multi-Tier Architecture */}
 <div className="space-y-5">
 <div className="flex items-center justify-between px-2">
 <h3 className="text-lg font-bold text-[var(--ease2event-text-primary)] tracking-tight">Tier Architecture</h3>
 <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-4 py-2 rounded-2xl font-bold text-sm tracking-widest ">Autonomous Tiering Active</Badge>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
 {formData.packages.map((pkg, i) => (
 <div
 key={pkg.name}
 className={`card-minimal p-6 transition-all border relative overflow-hidden rounded-xl ${pkg.isPopular ? 'bg-gradient-to-br from-[var(--ease2event-brand-primary)]/[0.05] to-transparent border-[var(--ease2event-brand-primary)]/30' : 'bg-[var(--ease2event-bg-surface)] border-[var(--ease2event-border-base)]'}`}
 >
 <div className="space-y-6 relative z-10">
 <div className="flex justify-between items-center">
 <span className="text-xl font-bold text-[var(--ease2event-text-primary)]">{pkg.name}</span>
 {pkg.isPopular && <Badge className="bg-[var(--ease2event-brand-primary)] text-white text-[9px] font-bold non-italic px-4 py-1.5 rounded-full /30">Popular</Badge>}
 </div>
 <div className="space-y-3">
 <label className="text-[9px] font-bold text-[var(--ease2event-text-secondary)] tracking-[0.3em]">Tier Capture (₹)</label>
 <input
 type="number"
 value={pkg.price}
 onChange={(e) => updatePackage(i, 'price', e.target.value)}
 placeholder="VAL"
 className="w-full h-12 bg-[var(--ease2event-bg-elevated)]/50 border border-[var(--ease2event-border-subtle)] rounded-xl px-4 text-sm font-bold outline-none text-[var(--ease2event-text-primary)] tracking-widest"
 />
 </div>
 <div className="space-y-5">
 <label className="text-[9px] font-bold text-[var(--ease2event-text-secondary)] tracking-[0.3em]">Capability Modules</label>
 <div className="grid grid-cols-2 gap-3">
 {['Catering', 'Decor', 'Audio', 'Visuals'].map(feat => (
 <button
 key={feat}
 onClick={() => {
 const current = pkg.features;
 const next = current.includes(feat) ? current.filter(c => c !== feat) : [...current, feat];
 updatePackage(i, 'features', next);
 }}
 className={`flex items-center justify-center gap-2 h-10 rounded-xl text-[9px] font-bold transition-all border ${pkg.features.includes(feat) ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' : 'bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-text-secondary)] border-[var(--ease2event-border-subtle)]'}`}
 >
 {pkg.features.includes(feat) && <CheckCircle2 size={12} />}
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
 </div>
 );
 }

 return (
 <div
 
 
 
  className="space-y-5 pb-32 px-6 w-full max-w-7xl mx-auto"
  >
  <AnimatePresence>
  {serviceToDelete && (
  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
  >
  <motion.div
  initial={{ scale: 0.95, opacity: 0, y: 20 }}
  animate={{ scale: 1, opacity: 1, y: 0 }}
  exit={{ scale: 0.95, opacity: 0, y: 20 }}
  className="bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
  >
  <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
  <Trash2 size={100} />
  </div>
  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
  <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-2">
  <Trash2 size={32} />
  </div>
  <h2 className="text-2xl font-black text-[var(--ease2event-text-primary)] tracking-tight">Delete Service?</h2>
  <p className="text-sm font-bold text-[var(--ease2event-text-secondary)]">This action cannot be undone. This service will be permanently removed from your inventory.</p>
  <div className="flex w-full gap-4 pt-6">
  <Button
  onClick={() => setServiceToDelete(null)}
  disabled={isDeleting}
  className="flex-1 bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-text-primary)] border border-[var(--ease2event-border-subtle)] font-bold py-3 rounded-2xl flex items-center justify-center"
  >
  Cancel
  </Button>
  <Button
  onClick={confirmDelete}
  disabled={isDeleting}
  className="flex-1 bg-red-500 text-white hover:bg-red-600 font-bold py-3 rounded-2xl flex items-center justify-center"
  >
  {isDeleting ? <Loader2 className="animate-spin" size={20} /> : 'Delete Service'}
  </Button>
  </div>
  </div>
  </motion.div>
  </motion.div>
  )}
  </AnimatePresence>

  {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pt-0 pb-6 border-b border-[var(--ease2event-border-subtle)]">
 <div >
 <h1 className="text-xl font-bold normal-case tracking-normal leading-normal">Services List</h1>
 <div className="flex items-center gap-3 mt-4">
 <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20">
 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
 Active
 </span>
 <p className="text-base font-semibold normal-case tracking-normal flex items-center gap-2">Grid View</p>
 </div>
 </div>
 <div >
 <Button
 onClick={() => setIsAdding(true)}
 className="cursor-pointer flex items-center justify-center h-11 sm:h-12 px-4 sm:px-6 rounded-2xl font-bold text-[9px] sm:text-[11px] tracking-widest bg-[var(--ease2event-brand-primary)] text-white hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
 leftIcon={<Plus size={18} />}
 >
 Add New Service
 </Button>
 </div>
 </div>

 {/* Matrix Filters */}
 <div className="flex flex-col xl:flex-row gap-6 p-4 bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] rounded-3xl ">
 <div className="relative flex-1 group">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--ease2event-text-muted)] group-focus-within:text-[var(--ease2event-brand-primary)] transition-colors" size={16} />
 <input
 type="text"
 placeholder="Search Services..."
 className="w-full bg-transparent border-none rounded-2xl py-5 pl-16 pr-6 text-base font-bold text-[var(--ease2event-text-primary)] focus:ring-0 outline-none placeholder:text-[var(--ease2event-text-secondary)] tracking-widest transition-all"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 <div className="flex flex-wrap gap-5 items-center px-4">
 {['ALL_SERVICES', 'ACTIVE', 'ARCHIVED'].map(tab => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`cursor-pointer py-4 text-sm font-bold tracking-widest transition-all group ${activeTab === tab ? 'text-red-500' : 'text-[var(--ease2event-text-secondary)] hover:text-red-500'}`}
 >
 <span className={`pb-2 border-b-2 transition-all ${activeTab === tab ? 'border-red-500' : 'border-transparent group-'}`}>
 {tab.replace('_', ' ')}
 </span>
 </button>
 ))}
 </div>
 </div>

 {/* Service Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {loading ? (
 [1, 2, 3].map(i => (
 <div key={i} className="h-80 rounded-xl border border-[var(--ease2event-border-subtle)] animate-pulse bg-[var(--ease2event-bg-surface)] "></div>
 ))
 ) : (
 <>
 <AnimatePresence mode="popLayout">
 {filteredServices.map((prod: any, idx: number) => (
 <div
 key={prod.id || idx}
 className="card-minimal !p-0 overflow-hidden group border-[var(--ease2event-border-base)] bg-[var(--ease2event-bg-surface)]  transition-all flex flex-col h-full cursor-pointer rounded-xl"
 >
 <div className="h-56 bg-slate-900 relative overflow-hidden">
 <img
 src={prod.images?.[0] || 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1000'}
 className="w-full h-full object-cover transition-transform opacity-60 group-hover:opacity-100"
 alt={prod.title}
 />
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
 <div className="absolute top-6 left-6">
 <Badge className="bg-[var(--ease2event-brand-primary)]/20 backdrop-blur-xl border border-[var(--ease2event-brand-primary)]/30 text-white font-black text-[9px] tracking-[0.2em] px-4 py-2 rounded-2xl ">
 {prod.guestCapacity ? 'Operational Venue' : 'Service Unit'}
 </Badge>
 </div>
 <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all flex flex-col gap-2">
 <button onClick={(e) => { e.stopPropagation(); handleEditProduct(prod); }} className="cursor-pointer p-3 bg-white/10 backdrop-blur-xl text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all shadow-sm"><Edit3 size={16} /></button>
 <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(prod.id); }} className="cursor-pointer p-3 bg-red-500/80 backdrop-blur-xl text-white rounded-2xl border border-red-500/20 hover:bg-red-500 transition-all shadow-sm"><Trash2 size={16} /></button>
 </div>
 </div>
 <div className="p-5 flex-1 flex flex-col space-y-6">
 <div className="space-y-2">
 <p className="text-[10px] font-bold text-[var(--ease2event-brand-primary)] tracking-widest">{prod.category?.name || 'Service Category'}</p>
 <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)] truncate tracking-tight group-hover:text-[var(--ease2event-brand-primary)] transition-colors">{prod.title}</h3>
 </div>
 <p className="text-xs text-[var(--ease2event-text-secondary)] font-bold line-clamp-3 leading-relaxed opacity-100 group-hover:opacity-100 transition-opacity">{prod.description}</p>

 <div className="mt-auto pt-8 flex items-center justify-between border-t border-[var(--ease2event-border-subtle)]">
 <div className="flex flex-col">
 <span className="text-[10px] text-[var(--ease2event-text-secondary)] font-bold tracking-widest">Base Rate</span>
 <span className="text-lg font-bold text-[var(--ease2event-text-primary)] mt-1 tracking-tighter transition-transform origin-left">₹{Number(prod.basePrice).toLocaleString()}</span>
 </div>
 <div className="flex -space-x-3 group-hover:space-x-1 transition-all">
 {[1, 2, 3].map(i => (
 <div key={i} className="w-10 h-10 rounded-2xl bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-bg-surface)] text-sm font-black text-[var(--ease2event-text-muted)] flex items-center justify-center group-hover:/10 transition-all">v{i}</div>
 ))}
 </div>
 </div>
 </div>
 </div>
 ))}
 </AnimatePresence>

 <div
 
 onClick={() => setIsAdding(true)}
 className="card-minimal border-4 border-dashed border-[var(--ease2event-border-subtle)] bg-transparent flex flex-col items-center justify-center gap-6 py-20  hover:bg-[var(--ease2event-brand-primary)]/[0.03] cursor-pointer group transition-all rounded-xl"
 >
 <div className="w-16 h-12 rounded-3xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] flex items-center justify-center text-[var(--ease2event-text-muted)] group-hover:bg-[var(--ease2event-brand-primary)] group-hover:text-white group-hover:rotate-90 transition-all ">
 <Plus size={16} />
 </div>
 <div className="text-center space-y-3">
 <h3 className="text-lg font-black text-[var(--ease2event-text-primary)] tracking-widest font-display">Add New Product</h3>
 <p className="text-sm text-[var(--ease2event-text-secondary)] font-black -[0.25em] opacity-100">Showcase to the World</p>
 </div>
 </div>
 </>
 )}
 </div>
 </div>
 );
};

export default Services;
