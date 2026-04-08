import React, { useState } from 'react';
import { 
    Layout, Plus, Megaphone, TrendingUp, DollarSign, Clock, 
    CheckCircle, X, Sparkles, AlertCircle, MoreVertical, Edit, 
    Trash2, ExternalLink, Info, Loader2, CreditCard, BarChart2,
    Zap, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@airion/shared';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Button } from '@airion/ui';

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
 * Modernized with 'Premium Dark Glassmorphism' design nodes.
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
        }[status] || 'bg-white/5 text-slate-500';

        return (
            <span className={`chip ${colors} h-7 px-4 shadow-glow-custom backdrop-blur-md italic`}>
                {status === 'Active' && <CheckCircle size={10} className="mr-1.5" />}
                {status === 'Pending' && <Clock size={10} className="mr-1.5" />}
                {status === 'Rejected' && <AlertCircle size={10} className="mr-1.5" />}
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">Campaign Matrix</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] italic flex items-center gap-2">
                        <Zap size={12} className="text-blue-500" />
                        Marketing Intelligence Node Deployment
                    </p>
                </div>

                <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary h-12 px-10 rounded-xl text-[10px] tracking-[0.2em] italic"
                >
                    <Plus size={18} className="mr-2" />
                    <span>INITIALIZE CAMPAIGN</span>
                </Button>
            </div>

            {/* Matrix Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Network Reach', value: '14,240', sub: 'THROUGHPUT: HIGH', icon: TrendingUp, color: 'text-blue-400' },
                    { label: 'Avg. CTR Pulse', value: '3.82%', sub: 'NODAL EFFICIENCY: OPTIMAL', icon: Sparkles, color: 'text-emerald-400' },
                    { label: 'Active Budget', value: '₹4,500', sub: 'VALUATION: STABLE', icon: CreditCard, color: 'text-amber-400' },
                ].map((stat, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-minimal !p-6 flex flex-col justify-between group h-36 relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start z-10">
                            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{stat.label}</h3>
                            <div className={`p-2.5 bg-white/5 border border-white/5 rounded-xl ${stat.color} shadow-glow-custom`}>
                                <stat.icon size={16} />
                            </div>
                        </div>
                        <div className="z-10">
                            <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{stat.value}</p>
                            <p className="text-[8px] font-black text-slate-500 mt-2 uppercase tracking-[0.2em] italic opacity-60">{stat.sub}</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </motion.div>
                ))}
            </div>

            {/* Campaigns Registry */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <Layout className="text-blue-500" size={18} />
                    <h2 className="text-sm font-black text-white uppercase tracking-widest italic">Active Campaigns Node</h2>
                </div>

                {ads.length === 0 ? (
                    <div className="card-minimal !p-20 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 border-dashed border-white/10">
                        <div className="w-24 h-24 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center shadow-glow-custom border border-blue-500/20">
                            <Megaphone size={44} />
                        </div>
                        <div className="max-w-md space-y-3">
                            <h3 className="text-lg font-black text-white uppercase italic tracking-widest leading-none">Registry Empty</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight italic opacity-70">Initialize your first marketing node to skyrocket network throughput.</p>
                        </div>
                        <Button 
                            onClick={() => setShowCreateModal(true)}
                            className="btn-secondary h-11 px-8 text-[10px] uppercase italic tracking-[0.2em]"
                        >
                            Force Start Campaign
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ads.map((ad, i) => (
                            <motion.div 
                                key={ad.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="card-minimal !p-0 overflow-hidden group border-white/5 hover:border-blue-500/30 flex flex-col h-full"
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <img src={ad.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-transform duration-1000 group-hover:scale-110" alt={ad.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
                                    <div className="absolute top-4 right-4">
                                        <StatusBadge status={ad.status} />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-4 px-6">
                                        <h3 className="text-white font-black text-xl italic tracking-tighter leading-none line-clamp-1">{ad.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic opacity-60">Daily Allocation</span>
                                            <span className="text-xl font-black text-white italic tracking-tighter leading-none mt-1">₹{ad.budget.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic opacity-60">Created</span>
                                            <span className="text-[11px] font-black text-slate-300 italic mt-1">{new Date(ad.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button className="btn-secondary !h-10 text-[9px] tracking-widest italic">
                                            <BarChart2 size={12} className="mr-2" /> LOGS
                                        </Button>
                                        <Button className="btn-secondary !h-10 text-[9px] tracking-widest italic !bg-rose-600/10 !text-rose-400 !border-rose-600/20 hover:!bg-rose-600 hover:!text-white transition-all">
                                            <Trash2 size={12} className="mr-2" /> PURGE
                                        </Button>
                                    </div>
                                </div>
                                <div className="h-1 w-0 group-hover:w-full bg-blue-600 transition-all duration-700" />
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#020617]/95 backdrop-blur-xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 40, opacity: 0 }}
                            className="card-minimal !p-12 max-w-2xl w-full border-blue-500/20 relative shadow-[0_0_100px_rgba(59,130,246,0.1)]"
                        >
                            <button 
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-all"
                            >
                                <X size={24} className="p-1.5 bg-white/5 rounded-lg border border-white/10" />
                            </button>

                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 text-[9px] font-black uppercase tracking-widest italic">
                                        <Rocket size={12} /> Matrix Protocol Initializer
                                    </div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">New Campaign Node</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Scaling Marketplace Throughput v4.2</p>
                                </div>

                                <form onSubmit={handleCreateAd} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic pl-1">Campaign Descriptor (Title)</label>
                                        <input 
                                            required 
                                            placeholder="e.g. SUMMER WEDDING SYNERGY OFFER"
                                            value={adData.title}
                                            onChange={e => setAdData({...adData, title: e.target.value})}
                                            className="input-dark-glass italic font-black" 
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic pl-1">Daily Resource Allocation (₹)</label>
                                            <div className="relative">
                                                <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                                <input 
                                                    required 
                                                    type="number"
                                                    placeholder="500"
                                                    value={adData.budget}
                                                    onChange={e => setAdData({...adData, budget: e.target.value})}
                                                    className="input-dark-glass !pl-10 italic font-black tracking-tighter" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic pl-1">Visual Asset URL (Optional)</label>
                                            <input 
                                                placeholder="https://..."
                                                value={adData.image}
                                                onChange={e => setAdData({...adData, image: e.target.value})}
                                                className="input-dark-glass italic font-black" 
                                            />
                                        </div>
                                    </div>

                                    <div className="card-minimal !bg-blue-600/5 !border-blue-600/10 !p-6 flex items-start gap-5">
                                        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-glow-custom">
                                            <Info size={20} />
                                        </div>
                                        <div className="space-y-2">
                                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic leading-relaxed">Nexus Protocol Info</p>
                                             <p className="text-[10px] text-slate-500 font-bold italic leading-relaxed opacity-70">
                                                 Nodes are subject to Nexus review prior to live deployment. Resource consumption metrics will initialize upon protocol approval. Standard review window: <strong className="text-white">4-8 Operational Hours</strong>.
                                             </p>
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="btn-primary w-full !h-16 text-[11px] tracking-[0.4em] italic shadow-[0_20px_40px_rgba(59,130,246,0.2)]"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" /> : "LAUNCH CAMPAIGN NODE"}
                                    </Button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Ads;
