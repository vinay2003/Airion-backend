import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Award, Zap, Eye, MousePointer, Check, Plus, X } from 'lucide-react';
import { Button } from '@ease2event/ui';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface Ad {
 id: string;
 campaignName: string;
 adType: string;
 status: string;
 dailyBudget: number;
 totalBudget: number;
 impressions: number;
 clicks: number;
}

const Promotions: React.FC = () => {
 const [campaigns, setCampaigns] = useState<Ad[]>([]);
 const [loading, setLoading] = useState(true);
 const [isCreating, setIsCreating] = useState(false);
 
 // Form state
 const [formData, setFormData] = useState({
 campaignName: '',
 adType: 'banner',
 dailyBudget: 500,
 totalBudget: 3500,
 startDate: new Date().toISOString().split('T')[0],
 endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
 });

 const fetchCampaigns = async () => {
 try {
 const data = await api.get('/ads/vendor/me') as any;
 if (Array.isArray(data)) setCampaigns(data);
 else if (data?.data) setCampaigns(data.data);
 } catch (error) {
 toast.error('Failed to load campaigns');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchCampaigns();
 }, []);

 const handleCreateCampaign = async (e: React.FormEvent) => {
 e.preventDefault();
 try {
 const payload = {
 ...formData,
 startDate: new Date(formData.startDate).toISOString(),
 endDate: new Date(formData.endDate).toISOString(),
 dailyBudget: Number(formData.dailyBudget),
 totalBudget: Number(formData.totalBudget)
 };
 await api.post('/ads', payload);
 toast.success('Campaign created and sent for approval!');
 setIsCreating(false);
 fetchCampaigns();
 } catch (error: any) {
 toast.error(error?.response?.data?.message || 'Failed to create campaign');
 }
 };

 const getStatusColor = (status: string) => {
 switch (status) {
 case 'active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
 case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
 case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
 default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
 }
 };

 return (
 <div className="space-y-5 pb-6">
 <header className="flex justify-between items-end border-b border-[var(--ease2event-border-subtle)] pb-6">
 <div className="space-y-4">
 <h1 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Ads & Promotions</h1>
 <p className="text-lg font-semibold text-[var(--ease2event-text-secondary)]">Boost your visibility and get more bookings.</p>
 </div>
 {!isCreating && (
 <Button onClick={() => setIsCreating(true)} className="h-10 px-5 gap-2 rounded-2xl font-bold">
 <Plus size={16} /> Create Campaign
 </Button>
 )}
 </header>

 <AnimatePresence>
 {isCreating && (
 <div className="card-minimal p-6 border-2 border-[var(--ease2event-brand-primary)] rounded-xl">
 <div className="flex justify-between items-center mb-8">
 <h2 className="text-lg font-bold text-[var(--ease2event-text-primary)]">New Campaign</h2>
 <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"><X size={16} /></button>
 </div>
 <form onSubmit={handleCreateCampaign} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-bold mb-2">Campaign Name</label>
 <input required type="text" value={formData.campaignName} onChange={e => setFormData({...formData, campaignName: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent" placeholder="e.g. Diwali Special Booking" />
 </div>
 <div>
 <label className="block text-sm font-bold mb-2">Ad Type</label>
 <select value={formData.adType} onChange={e => setFormData({...formData, adType: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent">
 <option value="banner">Homepage Banner</option>
 <option value="featured">Featured Listing</option>
 <option value="category">Category Highlight</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-bold mb-2">Daily Budget (₹)</label>
 <input required type="number" value={formData.dailyBudget} onChange={e => setFormData({...formData, dailyBudget: Number(e.target.value)})} className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent" />
 </div>
 <div>
 <label className="block text-sm font-bold mb-2">Total Budget (₹)</label>
 <input required type="number" value={formData.totalBudget} onChange={e => setFormData({...formData, totalBudget: Number(e.target.value)})} className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent" />
 </div>
 <div>
 <label className="block text-sm font-bold mb-2">Start Date</label>
 <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent" />
 </div>
 <div>
 <label className="block text-sm font-bold mb-2">End Date</label>
 <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent" />
 </div>
 </div>
 <Button type="submit" className="w-full h-10 rounded-2xl font-bold">Submit for Approval</Button>
 </form>
 </div>
 )}
 </AnimatePresence>

 <div className="card-minimal p-6 border-[var(--ease2event-border-base)] rounded-xl">
 <h2 className="text-lg font-bold text-[var(--ease2event-text-primary)] mb-8 tracking-tight">Your Campaigns</h2>
 
 {loading ? (
 <div className="py-10 text-center"><div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" /></div>
 ) : campaigns.length === 0 ? (
 <div className="p-16 text-center bg-[var(--ease2event-bg-elevated)] rounded-xl border-2 border-dashed border-[var(--ease2event-border-subtle)] space-y-6">
 <div className="w-24 h-24 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20"><Zap size={48} /></div>
 <h3 className="text-xl font-bold">Scale Your Growth</h3>
 <p className="text-sm text-[var(--ease2event-text-secondary)] font-semibold">You don't have any campaigns running.</p>
 <Button onClick={() => setIsCreating(true)} className="h-10 px-6 rounded-2xl font-bold shadow-blue-500/10">Create New Campaign</Button>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {campaigns.map(ad => (
 <div key={ad.id} className="p-6 rounded-3xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] transition-all">
 <div className="flex justify-between items-start mb-4">
 <div>
 <h3 className="font-bold text-lg">{ad.campaignName}</h3>
 <p className="text-xs text-gray-500 uppercase">{ad.adType}</p>
 </div>
 <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase border ${getStatusColor(ad.status)}`}>{ad.status}</span>
 </div>
 <div className="text-lg font-black mb-6">₹{ad.totalBudget}</div>
 <div className="grid grid-cols-2 gap-4 border-t border-[var(--ease2event-border-subtle)] pt-4">
 <div>
 <div className="text-xs text-gray-500 flex items-center gap-1"><Eye size={12}/> Impressions</div>
 <div className="font-bold">{ad.impressions}</div>
 </div>
 <div>
 <div className="text-xs text-gray-500 flex items-center gap-1"><MousePointer size={12}/> Clicks</div>
 <div className="font-bold">{ad.clicks}</div>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
};

export default Promotions;
