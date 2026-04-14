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

            toast.success('Campaign initialized - Pending Nexus Review');
            setShowCreateModal(false);
            setAdData({ title: '', image: '', budget: '' });
            refreshUser();
        } catch (err) {
            toast.error('Node initialization failure');
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
            <span className={`chip ${colors} h-10 px-8 shadow-2xl backdrop-blur-xl font-black text-[10px] uppercase tracking-[0.2em] italic border-2`}>
                {status === 'Active' && <CheckCircle size={16} className="mr-2" />}
                {status === 'Pending' && <Clock size={16} className="mr-2" />}
                {status === 'Rejected' && <AlertCircle size={16} className="mr-2" />}
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-24">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 border-b border-[var(--ease2event-border-subtle)] padding-bottom-12">
                <div className="space-y-6">
                    <h1 className="text-4xl font-black text-[var(--ease2event-text-primary)] tracking-tighter leading-none uppercase italic">Campaign Matrix</h1>
                    <p className="text-lg font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest flex items-center gap-3">
                        <Zap size={24} className="text-blue-500 animate-pulse" />
                        Marketing Intelligence Node Deployment • Scaling v5.2
                    </p>
                </div>

                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center justify-center h-12 md:h-16 px-6 md:px-14 rounded-2xl text-[10px] md:text-xs font-black tracking-wider md:tracking-[0.3em] uppercase shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all italic w-full md:w-auto"
                >
                    <Plus size={20} className="mr-2 md:mr-3" />
                    <span className="text-base md:text-lg lg:text-xl font-semibold">
                        Initialize New Campaign Node
                    </span>                </Button>
            </div>

            {/* Matrix Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {[
                    { label: 'Network Reach', value: '14,240', sub: 'THROUGHPUT: HIGH', icon: TrendingUp, color: 'text-blue-500', trend: '+12%' },
                    { label: 'Avg. CTR Pulse', value: '3.82%', sub: 'NODAL EFFICIENCY: OPTIMAL', icon: Sparkles, color: 'text-emerald-500', trend: '+5%' },
                    { label: 'Active Budget', value: '₹4,500', sub: 'VALUATION: STABLE', icon: CreditCard, color: 'text-amber-500', trend: 'NORMAL' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-minimal !p-10 flex flex-col justify-between group h-52 relative overflow-hidden hover:scale-[1.03] transition-all duration-500 border-[var(--ease2event-border-base)] shadow-2xl"
                    >
                        <div className="flex justify-between items-start z-10">
                            <h3 className="text-[15px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] italic">{stat.label}</h3>
                            <div className={`p-4 bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] rounded-2xl ${stat.color} shadow-xl transition-all group-hover:border-blue-500/30 group-hover:scale-110`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="z-10 flex items-end justify-between">
                            <div className="space-y-3">
                                <p className="text-4xl font-black text-[var(--ease2event-text-primary)] tracking-tighter leading-none italic">{stat.value}</p>
                                <p className="text-[15px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.2em] opacity-60">{stat.sub}</p>
                            </div>
                            <div className="text-[15px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 italic">
                                {stat.trend}
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px] translate-x-12 -translate-y-12"></div>
                    </motion.div>
                ))}
            </div>

            {/* Campaigns Registry */}
            <div className="space-y-12">
                <div className="flex items-center gap-6 p-4 bg-[var(--ease2event-bg-elevated)]/30 rounded-3xl border border-[var(--ease2event-border-subtle)] w-fit pr-10">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <Activity size={28} />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-[var(--ease2event-text-primary)] uppercase tracking-tighter italic">Live Registry</h2>
                        <p className="text-[12px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em]">Operational Marketing Sub-Nodes</p>
                    </div>
                </div>

                {ads.length === 0 ? (
                    <div className="card-minimal !p-12 md:!p-24 flex flex-col items-center justify-center text-center space-y-8 bg-[var(--ease2event-bg-surface)] border-2 border-dashed border-[var(--ease2event-border-base)] rounded-[3rem]">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-500/10 text-blue-500 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-xl border-2 border-blue-500/10 animate-float">
                            <Megaphone size={40} className="md:w-14 md:h-14" />
                        </div>
                        <div className="max-w-xl space-y-4">
                            <h3 className="text-2xl md:text-4xl font-black text-[var(--ease2event-text-primary)] uppercase tracking-tighter italic">Registry Data Missing</h3>
                            <p className="text-base md:text-base text-[var(--ease2event-text-muted)] font-bold uppercase tracking-tight leading-relaxed opacity-70">Initialize your first campaign node to enhance network presence and scale operational throughput across the marketplace.</p>
                        </div>
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-secondary !h-12 md:!h-16 px-8 md:px-14 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] border-2 border-[var(--ease2event-border-base)] rounded-2xl md:rounded-3xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-xl italic"
                        >
                            Execute Force Launch
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
                                    <div className="absolute inset-x-0 bottom-8 px-10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <ShieldCheck size={18} className="text-blue-500" />
                                            <span className="text-[15px] text-blue-500 font-black uppercase tracking-[0.3em]">SECURE NODE</span>
                                        </div>
                                        <h3 className="text-[var(--ease2event-text-primary)] font-black text-3xl tracking-tighter uppercase italic leading-none line-clamp-2">{ad.title}</h3>
                                    </div>
                                </div>
                                <div className="p-10 flex-1 flex flex-col space-y-10">
                                    <div className="flex justify-between items-center bg-[var(--ease2event-bg-elevated)]/50 p-6 rounded-3xl border border-[var(--ease2event-border-subtle)]">
                                        <div className="flex flex-col">
                                            <span className="text-[15px] text-[var(--ease2event-text-muted)] font-black uppercase tracking-[0.3em] opacity-80">Cycle Budget</span>
                                            <span className="text-3xl font-black text-[var(--ease2event-text-primary)] tracking-tighter leading-none mt-3 italic">₹{ad.budget.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[15px] text-[var(--ease2event-text-muted)] font-black uppercase tracking-[0.3em] opacity-80">Timestamp</span>
                                            <span className="text-xs font-black text-[var(--ease2event-text-secondary)] mt-3 uppercase tracking-widest">{new Date(ad.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mt-2">
                                        <Button className="btn-secondary !h-14 text-[11px] font-black tracking-[0.2em] uppercase rounded-2xl border-2 border-[var(--ease2event-border-subtle)] hover:scale-105 transition-all italic">
                                            <BarChart2 size={20} className="mr-2" /> Log View
                                        </Button>
                                        <Button className="btn-secondary !h-14 text-[11px] font-black tracking-[0.2em] uppercase rounded-2xl !bg-rose-500/5 !text-rose-500 !border-rose-500/20 hover:!bg-rose-500 hover:!text-white transition-all hover:scale-105 italic">
                                            <Trash2 size={20} className="mr-2" /> Deletion
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
                                className="card-minimal !p-6 sm:!p-12 md:!p-20 max-w-3xl w-full border-2 border-[var(--ease2event-border-base)] relative shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-[2.5rem] sm:rounded-[4rem] bg-[var(--ease2event-bg-surface)] my-auto"
                                onClick={e => e.stopPropagation()}
                            >
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-6 right-6 sm:top-12 sm:right-12 text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)] transition-all"
                            >
                                <X className="size-6 sm:size-10 p-1.5 sm:p-2.5 bg-[var(--ease2event-bg-elevated)] rounded-xl sm:rounded-2xl border-2 border-[var(--ease2event-border-subtle)] hover:border-blue-500/40" />
                            </button>

                            <div className="space-y-8 sm:space-y-16 mt-8 sm:mt-0">
                                <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-0">
                                    <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500/10 text-blue-500 rounded-xl sm:rounded-2xl border-2 border-blue-500/20 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] italic animate-pulse">
                                        <Rocket className="size-4" /> Matrix Protocol Alpha Initialization
                                    </div>
                                    <h2 className="text-3xl sm:text-5xl font-black text-[var(--ease2event-text-primary)] tracking-tighter uppercase leading-none italic">New Campaign Node</h2>
                                    <p className="text-[10px] sm:text-xs text-[var(--ease2event-text-muted)] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-60">Global Reach Index Expansion v7.0</p>
                                </div>

                                <form onSubmit={handleCreateAd} className="space-y-12">
                                    <div className="space-y-3 sm:space-y-4">
                                        <label className="text-[9px] sm:text-[10px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] sm:tracking-[0.4em] pl-2 italic">Campaign Descriptor Registry</label>
                                        <input
                                            required
                                            placeholder="ENTER CAMPAIGN TITLE SEQUENCE..."
                                            value={adData.title}
                                            onChange={e => setAdData({ ...adData, title: e.target.value })}
                                            className="input-dark-glass font-black text-sm sm:text-lg h-12 sm:h-16 rounded-xl sm:rounded-2xl border-2 focus:ring-8 focus:ring-blue-500/5 transition-all text-[var(--ease2event-text-primary)] placeholder-slate-500 italic"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                                        <div className="space-y-3 sm:space-y-4">
                                            <label className="text-[9px] sm:text-[10px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] sm:tracking-[0.4em] pl-2 italic">Daily Credits (₹)</label>
                                            <div className="relative group">
                                                <DollarSign className="size-5 sm:size-6 absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                                                <input
                                                    required
                                                    type="number"
                                                    placeholder="500"
                                                    value={adData.budget}
                                                    onChange={e => setAdData({ ...adData, budget: e.target.value })}
                                                    className="input-dark-glass !pl-12 sm:!pl-16 font-black text-sm sm:text-lg h-12 sm:h-16 rounded-xl sm:rounded-2xl border-2 focus:ring-8 focus:ring-blue-500/5 transition-all italic"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3 sm:space-y-4">
                                            <label className="text-[9px] sm:text-[10px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] sm:tracking-[0.4em] pl-2 italic">Asset URL Link</label>
                                            <div className="relative group">
                                                <ExternalLink className="size-5 sm:size-6 absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                                                <input
                                                    placeholder="HTTPS://REPOSITORY.ASSET..."
                                                    value={adData.image}
                                                    onChange={e => setAdData({ ...adData, image: e.target.value })}
                                                    className="input-dark-glass !pl-12 sm:!pl-16 font-black text-sm sm:text-lg h-12 sm:h-16 rounded-xl sm:rounded-2xl border-2 focus:ring-8 focus:ring-blue-500/5 transition-all italic"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-minimal !bg-blue-600/5 !border-blue-500/20 p-6 sm:!p-10 flex flex-col sm:flex-row items-start gap-5 sm:gap-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-inner">
                                        <div className="p-4 sm:p-5 bg-blue-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/30 shrink-0">
                                            <Target className="size-6 sm:size-8" />
                                        </div>
                                        <div className="space-y-3 sm:space-y-4">
                                            <p className="text-[15px] sm:text-xs text-[var(--ease2event-text-primary)] font-black uppercase tracking-[0.3em] leading-none italic">Deployment Intelligence Protocol</p>
                                            <p className="text-[14px] sm:text-xs text-[var(--ease2event-text-muted)] font-bold leading-relaxed sm:leading-loose opacity-80">
                                                Nodes are verified for marketplace compliance by the Nexus Central Hive. Standard validation cycle: <strong className="text-[var(--ease2event-text-primary)]">2-6 Logged Cycles</strong>. Operation initializes immediately post-validation.
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary w-full h-16 sm:!h-20 text-[11px] sm:text-sm font-black tracking-wider sm:tracking-[0.5em] uppercase shadow-[0_20px_50px_rgba(37,99,235,0.4)] rounded-2xl sm:rounded-3xl active:scale-95 hover:scale-[1.02] transition-all italic"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={24} /> : "Initialize Campaign Node Deployment"}
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
