import React, { useState } from 'react';
import {
  Layout, Plus, Megaphone, TrendingUp, IndianRupee, Clock,
  CheckCircle, X, Sparkles, AlertCircle, MoreVertical, Edit,
  Trash2, ExternalLink, Info, Loader2, CreditCard, BarChart2,
  Zap, Rocket, Target, Activity, ShieldCheck, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@ease2event/shared';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Button, Badge } from '@ease2event/ui';

interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  budget: number;
  status: 'Active' | 'Pending' | 'Rejected';
  createdAt: Date;
}

/**
 * 🚀 Marketing Intelligence: Advertising Engine
 * Modernized with high-legibility fonts, theme-aware nodes, and premium SaaS aesthetics.
 */
const Ads: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [adData, setAdData] = useState({
    title: '',
    imageUrl: '',
    budget: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res: any = await api.post('/uploads/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAdData({ ...adData, imageUrl: res.url });
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const ads = (user?.vendor?.ads || []) as Ad[];

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adData.title || !adData.budget) {
      toast.error('Required parameters missing');
      return;
    }

    setSubmitting(true);
    try {
      const finalImage = adData.imageUrl || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800`;

      await api.post('/vendors/ads', {
        title: adData.title,
        imageUrl: finalImage,
        budget: parseFloat(adData.budget)
      });

      toast.success('Campaign created - Pending Review');
      setShowCreateModal(false);
      setAdData({ title: '', imageUrl: '', budget: '' });

      // 🔥 Sync fresh data from server
      await refreshUser();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create campaign. Database error.');
    } finally {
      setSubmitting(false);
    }
  };

  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  const handleDeleteAd = async (id: string) => {
    try {
      await api.delete(`/vendors/ads/${id}`);
      toast.success('Campaign deleted successfully');
      await refreshUser();
      setAdToDelete(null);
    } catch (err) {
      toast.error('Failed to delete campaign');
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const normalizedStatus = status.toLowerCase();
    const colors = {
      'active': 'chip-soft-emerald',
      'pending': 'chip-soft-amber',
      'rejected': 'chip-soft-rose',
      'paused': 'chip-soft-rose'
    }[normalizedStatus] || 'bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-text-secondary)]';

    return (
      <span className={`chip ${colors} h-10 px-5 backdrop-blur-xl font-semibold text-[10px] tracking-normal border-2 uppercase`}>
        {normalizedStatus === 'active' && <CheckCircle size={16} className="mr-2" />}
        {normalizedStatus === 'pending' && <Clock size={16} className="mr-2" />}
        {normalizedStatus === 'rejected' && <AlertCircle size={16} className="mr-2" />}
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-6 px-6 w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 sm:gap-6 border-b border-[var(--ease2event-border-subtle)] pb-6 sm:pb-6">
        <div className="space-y-6">
          <h1 className="text-xl font-bold tracking-tight">Advertising Campaigns</h1>
          <p className="text-base font-semibold text-[var(--ease2event-text-secondary)] flex items-center gap-2">
            Manage your promotions and reach more customers.
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center h-11 sm:h-12 px-4 sm:px-6 rounded-2xl font-bold text-[9px] sm:text-[11px] tracking-widest bg-[var(--ease2event-brand-primary)] text-white hover:opacity-90 transition-all active:scale-95 whitespace-nowrap w-full md:w-auto"
        >
          <Plus size={18} className="mr-2 md:mr-3" />
          <span>Create New Campaign</span>
        </Button>
      </div>

      {/* Matrix Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6">
        {[
          { label: 'Total Reach', value: '14,240', sub: 'High Engagement', icon: TrendingUp, color: 'text-blue-500', trend: '+12%' },
          { label: 'Average CTR', value: '3.82%', sub: 'Healthy Performance', icon: Sparkles, color: 'text-emerald-500', trend: '+5%' },
          { label: 'Active Budget', value: '₹4,500', sub: 'Monthly Allotment', icon: CreditCard, color: 'text-amber-500', trend: 'STABLE' },
        ].map((stat, i) => (
          <div
            key={i}
            className="card-minimal p-6 sm:p-5 flex flex-col justify-between group h-48 relative overflow-hidden hover:scale-[1.03] transition-all border-[var(--ease2event-border-base)] "
          >
            <div className="flex justify-between items-start z-10">
              <h3 className="text-[11px] font-bold text-[var(--ease2event-text-secondary)] tracking-normal">{stat.label}</h3>
              <div className={`p-4 bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] rounded-2xl ${stat.color} transition-all group- `}>
                <stat.icon size={16} />
              </div>
            </div>
            <div className="z-10 flex items-end justify-between">
              <div className="space-y-3">
                <p className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-none">{stat.value}</p>
                <p className="text-[11px] font-semibold text-[var(--ease2event-text-secondary)] tracking-normal opacity-100">{stat.sub}</p>
              </div>
              <div className="text-sm font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                {stat.trend}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px] translate-x-12 -translate-y-12"></div>
          </div>
        ))}
      </div>

      {/* Campaigns Registry */}
      <div className="space-y-5 sm:space-y-5">
        <div className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-[var(--ease2event-bg-elevated)]/30 rounded-2xl sm:rounded-3xl border border-[var(--ease2event-border-subtle)] w-fit pr-6 sm:pr-10">
          <div className="w-14 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-blue-500/20">
            <Activity size={16} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Active Ads</h2>
            <p className="text-[11px] font-semibold text-[var(--ease2event-text-secondary)] tracking-normal">Tracking your current marketing campaigns</p>
          </div>
        </div>

        {ads.length === 0 ? (
          <div className="card-minimal !p-12 md:!p-24 flex flex-col items-center justify-center text-center space-y-5 bg-[var(--ease2event-bg-surface)] border-2 border-dashed border-[var(--ease2event-border-base)] rounded-xl">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-500/10 text-blue-500 rounded-xl md:rounded-xl flex items-center justify-center border-2 border-blue-500/10 animate-float">
              <Megaphone size={16} className="md:w-14 md:h-10" />
            </div>
            <div className="max-w-xl space-y-4">
              <h3 className="text-lg md:text-lg font-bold text-[var(--ease2event-text-primary)] tracking-tight">No Ads Found</h3>
              <p className="text-base md:text-base text-[var(--ease2event-text-secondary)] font-semibold tracking-tight leading-relaxed opacity-100">Create your first advertising campaign to reach more customers and grow your business.</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="btn-secondary !h-12 md:h-10 px-5 md:px-14 text-[10px] md:text-xs font-semibold tracking-normal border-2 border-[var(--ease2event-border-base)] rounded-2xl md:rounded-3xl hover:bg-blue-600 hover:text-white  transition-all "
            >
              Launch Campaign
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {ads.map((ad, i) => (
              <div
                key={ad.id || i}
                className="card-minimal relative !p-0 overflow-hidden group border-2 border-[var(--ease2event-border-subtle)]  flex flex-col h-full hover:shadow-blue-500/10 transition-all rounded-[3.5rem] bg-[var(--ease2event-bg-surface)]"
              >
                <div className="h-72 relative overflow-hidden bg-[var(--ease2event-bg-elevated)] flex items-center justify-center">
                  <img
                    src={ad.imageUrl}
                    className="absolute inset-0 w-full h-full object-cover transition-transform z-10"
                    alt={ad.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center text-[var(--ease2event-text-secondary)] bg-[var(--ease2event-bg-surface)] p-6 text-center text-sm font-semibold z-0">
                    <div className="flex flex-col items-center gap-2">
                      <Target size={24} className="opacity-50" />
                      <span>{ad.title}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--ease2event-bg-surface)] via-transparent to-transparent opacity-95 z-20 pointer-events-none" />
                  <div className="absolute top-5 right-8">
                    <StatusBadge status={ad.status} />
                  </div>
                  <div className="absolute inset-x-0 bottom-6 sm:bottom-8 px-6 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <ShieldCheck size={16} className="text-blue-500" />
                      <span className="text-[10px] sm:text-[11px] text-blue-500 font-semibold tracking-normal">Secure Node</span>
                    </div>
                    <h3 className="text-[var(--ease2event-text-primary)] font-semibold text-lg sm:text-xl tracking-tight leading-tight line-clamp-2">{ad.title}</h3>
                  </div>
                </div>
                <div className="p-6 sm:p-6 flex-1 flex flex-col space-y-6 sm:space-y-6">
                  <div className="flex justify-between items-center bg-[var(--ease2event-bg-elevated)]/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--ease2event-border-subtle)]">
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] text-[var(--ease2event-text-secondary)] font-semibold tracking-normal opacity-100">Cycle Budget</span>
                      <span className="text-xl sm:text-lg font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-none mt-2 sm:mt-3">₹{ad.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] sm:text-[11px] text-[var(--ease2event-text-secondary)] font-semibold tracking-normal opacity-100">Timestamp</span>
                      <span className="text-[10px] sm:text-xs font-bold text-[var(--ease2event-text-secondary)] mt-2 sm:mt-3 tracking-normal">{new Date(ad.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-2 relative z-10">
                    <Button onClick={() => toast.success('Analytics Dashboard for this campaign will be available soon')} className="btn-secondary !h-12 sm:h-10 text-[10px] sm:text-[11px] font-semibold tracking-normal rounded-xl sm:rounded-2xl border-2 border-[var(--ease2event-border-subtle)]  transition-all cursor-pointer">
                      <BarChart2 size={18} className="mr-2" /> View Stats
                    </Button>
                    <Button
                      onClick={() => setAdToDelete(ad.id)}
                      className="btn-secondary cursor-pointer !h-12 sm:h-10 text-[10px] sm:text-[11px] font-semibold tracking-normal rounded-xl sm:rounded-2xl !bg-rose-500/5 !text-rose-500 !border-rose-500/20 hover:!bg-rose-500 hover:!text-white transition-all ">
                      <Trash2 size={18} className="mr-2" /> Delete ad
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Initialization Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] bg-[var(--ease2event-bg-base)]/90 backdrop-blur-2xl overflow-y-auto" onClick={() => setShowCreateModal(false)}>
            <div className="min-h-full flex items-center justify-center p-4 sm:p-5">
              <div className="card-minimal p-4 sm:p-5 md:!p-12 max-w-3xl w-full border-2 border-[var(--ease2event-border-base)] relative rounded-xl sm:rounded-xl bg-[var(--ease2event-bg-surface)] my-auto" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 sm:top-12 sm:right-12 text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)] transition-all">
                  <X className="size-6 sm:size-10 p-1.5 sm:p-2.5 bg-[var(--ease2event-bg-elevated)] rounded-xl sm:rounded-2xl border-2 border-[var(--ease2event-border-subtle)] " />
                </button>

                <div className="space-y-6 sm:space-y-6 mt-8 sm:mt-0">
                  <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-0">
                    <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500/10 text-blue-500 rounded-xl sm:rounded-2xl border-2 border-blue-500/20 text-[9px] sm:text-[10px] font-bold tracking-normal">
                      <Rocket className="size-4" /> Professional Campaign Setup
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-none">New Campaign</h2>
                    <p className="text-[10px] sm:text-xs text-[var(--ease2event-text-secondary)] font-semibold tracking-normal opacity-100">Reach more users across the platform</p>
                  </div>

                  <form onSubmit={handleCreateAd} className="space-y-6 sm:space-y-14">
                    <div className="flex flex-col gap-3">
                      <label className="text-[9px] sm:text-[10px] font-bold text-[var(--ease2event-text-secondary)] tracking-normal pl-4">Campaign Title</label>
                      <input
                        required
                        placeholder="Enter campaign title..."
                        value={adData.title}
                        onChange={e => setAdData({ ...adData, title: e.target.value })}
                        className="w-full input-dark-glass font-medium text-sm sm:text-base h-12 sm:h-10 rounded-xl sm:rounded-2xl border-2 focus:ring-8 focus:ring-blue-500/5 transition-all text-[var(--ease2event-text-primary)] placeholder-slate-500 px-6"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-16">
                      <div className="flex flex-col gap-3">
                        <label className="text-[9px] sm:text-[10px] font-bold text-[var(--ease2event-text-secondary)] tracking-normal pl-4">Daily Budget (₹)</label>
                        <div className="relative group">
                          <IndianRupee className="size-5 sm:size-6 absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                          <input
                            required
                            type="number"
                            placeholder="500"
                            value={adData.budget}
                            onChange={e => setAdData({ ...adData, budget: e.target.value })}
                            className="w-full input-dark-glass !pl-14 sm:!pl-20 font-medium text-sm sm:text-base h-12 sm:h-10 rounded-xl sm:rounded-2xl border-2 focus:ring-8 focus:ring-blue-500/5 transition-all"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-[9px] sm:text-[10px] font-bold text-[var(--ease2event-text-secondary)] tracking-normal pl-4">Banner Image (URL or File)</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative group flex-1">
                            <ExternalLink className="size-5 sm:size-6 absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                            <input
                              placeholder="https://..."
                              value={adData.imageUrl}
                              onChange={e => setAdData({ ...adData, imageUrl: e.target.value })}
                              className="w-full input-dark-glass !pl-14 sm:!pl-20 font-medium text-sm sm:text-base h-12 sm:h-10 rounded-xl sm:rounded-2xl border-2 focus:ring-8 focus:ring-blue-500/5 transition-all"
                            />
                          </div>
                          <div className="flex items-center justify-center shrink-0">
                            <label className="cursor-pointer bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] hover:border-blue-500/50 hover:bg-blue-500/10 text-[var(--ease2event-text-secondary)] hover:text-blue-500 font-semibold text-xs sm:text-sm h-12 sm:h-10 px-4 rounded-xl sm:rounded-2xl flex items-center gap-2 transition-all">
                              <Upload size={16} />
                              {isUploading ? '...' : 'Upload'}
                              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-minimal !bg-blue-600/5 !border-blue-500/20 p-6 sm:p-6 flex flex-col sm:flex-row items-start gap-5 sm:gap-5 rounded-xl sm:rounded-xl ">
                      <div className="p-4 sm:p-5 bg-blue-600 text-white rounded-2xl sm:rounded-3xl shadow-blue-500/30 shrink-0">
                        <Target className="size-6 sm:size-8" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-bold text-[var(--ease2event-text-primary)] tracking-normal leading-none">Ad Campaign Review Process</p>
                        <p className="text-xs text-[var(--ease2event-text-secondary)] font-semibold leading-relaxed sm:leading-loose opacity-100">
                          Your campaign will be reviewed by our team to ensure it meets our guidelines. Standard review time: <strong className="text-[var(--ease2event-text-primary)]">2-6 hours</strong>. Your ad will go live immediately after approval.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full h-12 sm:!h-18 text-[11px] sm:text-sm font-semibold tracking-normal rounded-2xl sm:rounded-3xl active:scale-95 transition-all"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={16} /> : "Create Advertising Campaign"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {adToDelete && (
          <div
            className="fixed inset-0 z-[100] bg-[var(--ease2event-bg-base)]/90 backdrop-blur-2xl overflow-y-auto flex items-center justify-center p-4"
            onClick={() => setAdToDelete(null)}
          >
            <div
              className="card-minimal p-6 sm:p-8 max-w-sm w-full border-2 border-[var(--ease2event-border-base)] rounded-3xl bg-[var(--ease2event-bg-surface)] text-center space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="mx-auto w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center border-4 border-rose-500/10 mb-2">
                <Trash2 size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Delete Campaign?</h3>
                <p className="text-sm font-semibold text-[var(--ease2event-text-secondary)] opacity-100">
                  This action cannot be undone and will permanently remove this ad campaign from your account.
                </p>
              </div>
              <div className="flex gap-3 mt-8">
                <Button
                  onClick={() => setAdToDelete(null)}
                  className="flex-1 h-12 rounded-xl sm:rounded-2xl font-bold text-[11px] tracking-widest bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] hover:bg-[var(--ease2event-border-base)] transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteAd(adToDelete)}
                  className="flex-1 h-12 rounded-xl sm:rounded-2xl font-bold text-[11px] tracking-widest bg-rose-500 text-white hover:opacity-90 transition-all shadow-lg shadow-rose-500/20"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ads;
