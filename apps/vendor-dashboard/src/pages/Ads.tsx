import React, { useState } from 'react';
import {
    Layout, Plus, Megaphone, TrendingUp, DollarSign, Clock,
    CheckCircle, X, Sparkles, AlertCircle, MoreVertical, Edit,
    Trash2, ExternalLink, Info, Loader2, CreditCard, BarChart2,
    Zap, Rocket, Target, Activity, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@ease2event/shared';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Button, Badge } from '@ease2event/ui';

interface Ad {
    id: string;
    title: string;
    image: string;
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
        image: '',
        budget: ''
    });

    const ads = (user?.vendor?.ads || []) as Ad[];

    const handleCreateAd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adData.title || !adData.budget) {
            toast.error('Required parameters missing');
            return;
        }

        setSubmitting(true);
        try {
            const finalImage = adData.image || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800`;

            await api.post('/vendors/ads', {
                ...adData,
                image: finalImage,
                budget: parseFloat(adData.budget)
            });

            toast.success('Campaign created - Pending Review');
            setShowCreateModal(false);
            setAdData({ title: '', image: '', budget: '' });
            refreshUser();
        } catch (err) {
            toast.error('Failed to create campaign');
        } finally {
            setSubmitting(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors = {
            'Active': 'chip-soft-emerald',
            'Pending': 'chip-soft-amber',
            'Rejected': 'chip-soft-rose'
        }[status] || 'bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-text-secondary)]';

        return (
            <span className={`chip ${colors} h-10 px-8 shadow-2xl backdrop-blur-xl font-semibold text-[10px] tracking-normal border-2`}>
                {status === 'Active' && <CheckCircle size={16} className="mr-2" />}
                {status === 'Pending' && <Clock size={16} className="mr-2" />}
                {status === 'Rejected' && <AlertCircle size={16} className="mr-2" />}
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-24 px-6 sm:px-12 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 sm:gap-10 border-b border-[var(--ease2event-border-subtle)] pb-6 sm:pb-10">
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold tracking-tight">Advertising Campaigns</h1>
                    <p className="text-base font-semibold text-[var(--ease2event-text-secondary)] flex items-center gap-2">
                        Manage your promotions and reach more customers.
                    </p>
                </div>

                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center justify-center h-12 md:h-14 px-6 md:px-10 rounded-2xl text-[10px] md:text-[11px] font-semibold tracking-normal shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
                >
                    <Plus size={18} className="mr-2 md:mr-3" />
                    <span>Create New Campaign</span>
                </Button>
            </div>

            {/* Matrix Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                {[
                    { label: 'Total Reach', value: '14,240', sub: 'High Engagement', icon: TrendingUp, color: 'text-blue-500', trend: '+12%' },
                    { label: 'Average CTR', value: '3.82%', sub: 'Healthy Performance', icon: Sparkles, color: 'text-emerald-500', trend: '+5%' },
                    { label: 'Active Budget', value: '₹4,500', sub: 'Monthly Allotment', icon: CreditCard, color: 'text-amber-500', trend: 'STABLE' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-minimal p-6 sm:!p-8 flex flex-col justify-between group h-48 relative overflow-hidden hover:scale-[1.03] transition-all duration-500 border-[var(--ease2event-border-base)] shadow-2xl"
                    >
                        <div className="flex justify-between items-start z-10">
                            <h3 className="text-[11px] font-bold text-[var(--ease2event-text-secondary)] tracking-normal">{stat.label}</h3>
                            <div className={`p-4 bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] rounded-2xl ${stat.color} shadow-xl transition-all group-hover:border-blue-500/30 group-hover:scale-110`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="z-10 flex items-end justify-between">
                            <div className="space-y-3">
                                <p className="text-3xl font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-none">{stat.value}</p>
                                <p className="text-[11px] font-semibold text-[var(--ease2event-text-secondary)] tracking-normal opacity-100">{stat.sub}</p>
                            </div>
                            <div className="text-sm font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                {stat.trend}
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px] translate-x-12 -translate-y-12"></div>
                    </motion.div>
                ))}
            </div>

            {/* Campaigns Registry */}
            <div className="space-y-8 sm:space-y-12">
                <div className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-[var(--ease2event-bg-elevated)]/30 rounded-2xl sm:rounded-3xl border border-[var(--ease2event-border-subtle)] w-fit pr-6 sm:pr-10">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <Activity size={28} />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Active Ads</h2>
                        <p className="text-[11px] font-semibold text-[var(--ease2event-text-secondary)] tracking-normal">Tracking your current marketing campaigns</p>
                    </div>
                </div>

                {ads.length === 0 ? (
                    <div className="card-minimal !p-12 md:!p-24 flex flex-col items-center justify-center text-center space-y-8 bg-[var(--ease2event-bg-surface)] border-2 border-dashed border-[var(--ease2event-border-base)] rounded-[3rem]">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-500/10 text-blue-500 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-xl border-2 border-blue-500/10 animate-float">
                            <Megaphone size={40} className="md:w-14 md:h-14" />
                        </div>
                        <div className="max-w-xl space-y-4">
                            <h3 className="text-2xl md:text-4xl font-bold text-[var(--ease2event-text-primary)] uppercase tracking-tight">No Ads Found</h3>
                            <p className="text-base md:text-base text-[var(--ease2event-text-secondary)] font-semibold tracking-tight leading-relaxed opacity-100">Create your first advertising campaign to reach more customers and grow your business.</p>
                        </div>
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-secondary !h-12 md:!h-14 px-8 md:px-14 text-[10px] md:text-xs font-semibold tracking-normal border-2 border-[var(--ease2event-border-base)] rounded-2xl md:rounded-3xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-xl"
                        >
                            Launch Campaign
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                        {ads.map((ad, i) => (
                            <motion.div
                                key={ad.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="card-minimal !p-0 overflow-hidden group border-2 border-[var(--ease2event-border-subtle)] hover:border-blue-500/40 flex flex-col h-full shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 rounded-[3.5rem] bg-[var(--ease2event-bg-surface)]"
                            >
                                <div className="h-72 relative overflow-hidden">
                                    <img src={ad.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={ad.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--ease2event-bg-surface)] via-transparent to-transparent opacity-95" />
                                    <div className="absolute top-8 right-8">
                                        <StatusBadge status={ad.status} />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-6 sm:bottom-8 px-6 sm:px-10">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                            <ShieldCheck size={16} className="text-blue-500" />
                                            <span className="text-[10px] sm:text-[11px] text-blue-500 font-semibold tracking-normal">Secure Node</span>
                                        </div>
                                        <h3 className="text-[var(--ease2event-text-primary)] font-semibold text-lg sm:text-xl tracking-tight leading-tight line-clamp-2">{ad.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6 sm:p-10 flex-1 flex flex-col space-y-6 sm:space-y-10">
                                    <div className="flex justify-between items-center bg-[var(--ease2event-bg-elevated)]/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--ease2event-border-subtle)]">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] sm:text-[11px] text-[var(--ease2event-text-secondary)] font-semibold tracking-normal opacity-100">Cycle Budget</span>
                                            <span className="text-xl sm:text-2xl font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-none mt-2 sm:mt-3">₹{ad.budget.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] sm:text-[11px] text-[var(--ease2event-text-secondary)] font-semibold tracking-normal opacity-100">Timestamp</span>
                                            <span className="text-[10px] sm:text-xs font-bold text-[var(--ease2event-text-secondary)] mt-2 sm:mt-3 tracking-normal">{new Date(ad.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-2">
                                        <Button className="btn-secondary !h-12 sm:!h-14 text-[10px] sm:text-[11px] font-semibold tracking-normal rounded-xl sm:rounded-2xl border-2 border-[var(--ease2event-border-subtle)] hover:scale-105 transition-all">
                                            <BarChart2 size={18} className="mr-2" /> View Stats
                                        </Button>
                                        <Button className="btn-secondary !h-12 sm:!h-14 text-[10px] sm:text-[11px] font-semibold tracking-normal rounded-xl sm:rounded-2xl !bg-rose-500/5 !text-rose-500 !border-rose-500/20 hover:!bg-rose-500 hover:!text-white transition-all hover:scale-105">
                                            <Trash2 size={18} className="mr-2" /> Delete ad
                                        </Button>
                                    </div>
                                </div>
                                <div className="h-2 w-0 group-hover:w-full bg-blue-600 transition-all duration-1000 absolute bottom-0 left-0 shadow-[0_0_20px_rgba(37,99,235,0.6)]" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Initialization Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[var(--ease2event-bg-base)]/90 backdrop-blur-2xl overflow-y-auto"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <div className="min-h-full flex items-center justify-center p-4 sm:p-8">
                            <motion.div
                                initial={{ scale: 0.9, y: 60, opacity: 0, rotateX: 10 }}
                                animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
                                exit={{ scale: 0.9, y: 60, opacity: 0, rotateX: 10 }}
                                className="card-minimal !p-6 sm:!p-8 md:!p-12 max-w-3xl w-full border-2 border-[var(--ease2event-border-base)] relative shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-[2rem] sm:rounded-[3rem] bg-[var(--ease2event-bg-surface)] my-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="absolute top-6 right-6 sm:top-12 sm:right-12 text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)] transition-all"
                                >
                                    <X className="size-6 sm:size-10 p-1.5 sm:p-2.5 bg-[var(--ease2event-bg-elevated)] rounded-xl sm:rounded-2xl border-2 border-[var(--ease2event-border-subtle)] hover:border-blue-500/40" />
                                </button>

                                <div className="space-y-6 sm:space-y-10 mt-8 sm:mt-0">
                                    <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-0">
                                        <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500/10 text-blue-500 rounded-xl sm:rounded-2xl border-2 border-blue-500/20 text-[9px] sm:text-[10px] font-bold tracking-normal">
                                            <Rocket className="size-4" /> Professional Campaign Setup
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-none">New Campaign</h2>
                                        <p className="text-[10px] sm:text-xs text-[var(--ease2event-text-secondary)] font-semibold tracking-normal opacity-100">Reach more users across the platform</p>
                                    </div>

                                    <form onSubmit={handleCreateAd} className="space-y-10 sm:space-y-14">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[9px] sm:text-[10px] font-bold text-[var(--ease2event-text-secondary)] tracking-normal pl-4">Campaign Title</label>
                                            <input
                                                required
                                                placeholder="Enter campaign title..."
                                                value={adData.title}
                                                onChange={e => setAdData({ ...adData, title: e.target.value })}
                                                className="w-full input-dark-glass font-medium text-sm sm:text-base h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 focus:ring-8 focus:ring-blue-500/5 transition-all text-[var(--ease2event-text-primary)] placeholder-slate-500 px-6"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16">
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[9px] sm:text-[10px] font-bold text-[var(--ease2event-text-secondary)] tracking-normal pl-4">Daily Budget (₹)</label>
                                                <div className="relative group">
                                                    <DollarSign className="size-5 sm:size-6 absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                                                    <input
                                                        required
                                                        type="number"
                                                        placeholder="500"
                                                        value={adData.budget}
                                                        onChange={e => setAdData({ ...adData, budget: e.target.value })}
                                                        className="w-full input-dark-glass !pl-14 sm:!pl-20 font-medium text-sm sm:text-base h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 focus:ring-8 focus:ring-blue-500/5 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-[9px] sm:text-[10px] font-bold text-[var(--ease2event-text-secondary)] tracking-normal pl-4">Banner Image URL</label>
                                                <div className="relative group">
                                                    <ExternalLink className="size-5 sm:size-6 absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                                                    <input
                                                        placeholder="https://repository.asset..."
                                                        value={adData.image}
                                                        onChange={e => setAdData({ ...adData, image: e.target.value })}
                                                        className="w-full input-dark-glass !pl-14 sm:!pl-20 font-medium text-sm sm:text-base h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 focus:ring-8 focus:ring-blue-500/5 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-minimal !bg-blue-600/5 !border-blue-500/20 p-6 sm:!p-10 flex flex-col sm:flex-row items-start gap-5 sm:gap-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-inner">
                                            <div className="p-4 sm:p-5 bg-blue-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/30 shrink-0">
                                                <Target className="size-6 sm:size-8" />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p className="text-sm font-bold text-[var(--ease2event-text-primary)] tracking-normal leading-none">Deployment Intelligence Protocol</p>
                                                <p className="text-xs text-[var(--ease2event-text-secondary)] font-semibold leading-relaxed sm:leading-loose opacity-100">
                                                    Nodes are verified for marketplace compliance by the Nexus Central Hive. Standard validation cycle: <strong className="text-[var(--ease2event-text-primary)]">2-6 cycles</strong>. Operation initializes immediately post-validation.
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="btn-primary w-full h-16 sm:!h-18 text-[11px] sm:text-sm font-semibold tracking-normal shadow-[0_20px_50px_rgba(37,99,235,0.4)] rounded-2xl sm:rounded-3xl active:scale-95 hover:scale-[1.02] transition-all"
                                        >
                                            {submitting ? <Loader2 className="animate-spin" size={24} /> : "Create Advertising Campaign"}
                                        </Button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Ads;
