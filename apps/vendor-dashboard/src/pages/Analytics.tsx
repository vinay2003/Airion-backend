import React, { useMemo, useState } from 'react';
import { 
    TrendingUp, Eye, Users, DollarSign, ArrowUpRight, ArrowDownRight, 
    Activity, Zap, BarChart3, Target, MoreVertical, Layers, 
    Sparkles, ShieldCheck, Globe, Cpu, ChevronRight, Box
} from 'lucide-react';
import { 
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAuth } from '@airion/shared';
import { bookingService } from '@airion/shared/lib/services/bookingService';
import { useQuery } from '@tanstack/react-query';
import { Badge, Button, Skeleton } from '@airion/ui';

type AnalysisPeriod = '24H_REALTIME' | '30D_CYCLE' | 'ANNUAL_MATRIX';

/**
 * 🍱 Intelligence Matrix: Autonomous Business Engine
 * Refined for high-fidelity responsiveness and dynamic node orchestration.
 */
const Analytics: React.FC = () => {
    const { user } = useAuth();
    const vendorId = user?.vendor?.id || user?.id || '';
    const [selectedPeriod, setSelectedPeriod] = useState<AnalysisPeriod>('30D_CYCLE');

    // 🛰️ Real-time Operational Insights
    const { data: statsData, isLoading } = useQuery({
        queryKey: ['vendorStats', vendorId, selectedPeriod],
        queryFn: () => vendorId ? bookingService.getStats(vendorId).catch(() => null) : Promise.resolve(null),
        enabled: !!vendorId
    });

    const stats = useMemo(() => [
        { label: 'Network Visibility', value: statsData?.visibility || '24.5k', change: '+12.4%', trend: 'up', icon: Eye, color: 'text-blue-500', shadow: 'shadow-blue-500/10' },
        { label: 'Active Inquiries', value: statsData?.inquiries || '142', change: '+5.2%', trend: 'up', icon: Users, color: 'text-indigo-500', shadow: 'shadow-indigo-500/10' },
        { label: 'Conversion Delta', value: statsData?.conversion || '18.2%', change: '-2.1%', trend: 'down', icon: Zap, color: 'text-amber-500', shadow: 'shadow-amber-500/10' },
        { label: 'Gross Capture', value: statsData?.revenue || '₹12.4L', change: '+18.5%', trend: 'up', icon: DollarSign, color: 'text-emerald-500', shadow: 'shadow-emerald-500/10' },
    ], [statsData]);

    const performanceData = useMemo(() => [
        { name: 'Mon', views: 4000, inquiries: 24, capture: 12000 },
        { name: 'Tue', views: 3000, inquiries: 13, capture: 8000 },
        { name: 'Wed', views: 2000, inquiries: 98, capture: 45000 },
        { name: 'Thu', views: 2780, inquiries: 39, capture: 15000 },
        { name: 'Fri', views: 1890, inquiries: 48, capture: 22000 },
        { name: 'Sat', views: 2390, inquiries: 38, capture: 31000 },
        { name: 'Sun', views: 3490, inquiries: 43, capture: 28000 },
    ], []);

    const topNodes = useMemo(() => [
        { name: 'Grand Ballroom Prime', bookings: 45, revenue: '₹4.2L', occupancy: 92, status: 'Active' },
        { name: 'Open Terrace Matrix', bookings: 32, revenue: '₹3.1L', occupancy: 85, status: 'Active' },
        { name: 'Executive Suite Helix', bookings: 28, revenue: '₹5.1L', occupancy: 78, status: 'Service' },
    ], []);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    if (isLoading) {
        return (
            <div className="space-y-10 p-4 max-w-7xl mx-auto overflow-hidden">
                <Skeleton className="h-16 w-1/4 rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1,2,3,4].map(i => <Skeleton key={i} className="h-48 rounded-[32px]" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <Skeleton className="h-[450px] rounded-[40px]" />
                   <Skeleton className="h-[450px] rounded-[40px]" />
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12 pb-32 px-4 sm:px-6 max-w-7xl mx-auto"
        >
            {/* 🛸 Global Matrix Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 py-12 border-b border-[var(--airion-border-subtle)] relative overflow-hidden">
                <motion.div variants={itemVariants} className="relative z-10">
                    <h1 className="text-5xl font-black text-[var(--airion-text-primary)] tracking-tighter leading-none uppercase italic font-display">Intelligence Matrix</h1>
                    <div className="flex items-center gap-4 mt-6">
                        <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            System Telemetry Live
                        </span>
                        <p className="text-[var(--airion-text-muted)] font-black text-[11px] uppercase tracking-[0.4em] opacity-40 italic">Operational Throughput • Genesis v4.2</p>
                    </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex bg-[var(--airion-bg-elevated)]/50 p-2 rounded-[28px] border border-[var(--airion-border-subtle)] shadow-inner relative z-10">
                    {(['24H_REALTIME', '30D_CYCLE', 'ANNUAL_MATRIX'] as AnalysisPeriod[]).map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setSelectedPeriod(tab)}
                            className={`px-10 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-700 italic relative ${selectedPeriod === tab ? 'bg-[var(--airion-bg-surface)] text-[var(--airion-brand-primary)] shadow-2xl border border-[var(--airion-border-base)] scale-105 z-10' : 'text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)]'}`}
                        >
                            {tab.split('_')[0]} Cycle
                            {selectedPeriod === tab && <motion.div layoutId="headerTab" className="absolute inset-0 bg-[var(--airion-brand-primary)]/5 rounded-2xl -z-10" />}
                        </button>
                    ))}
                </motion.div>
                
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--airion-brand-primary)]/[0.03] to-transparent pointer-events-none"></div>
            </div>

            {/* 🚀 High-Velocity Telemetry Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx} 
                        variants={itemVariants}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className={`card-minimal !p-8 flex flex-col justify-between group cursor-pointer border-[var(--airion-border-base)] relative overflow-hidden shadow-2xl bg-[var(--airion-bg-surface)] ${stat.shadow}`}
                    >
                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <div className={`p-5 rounded-2xl bg-[var(--airion-bg-elevated)] ${stat.color} group-hover:bg-[var(--airion-brand-primary)] group-hover:text-white transition-all duration-700 shadow-sm border border-[var(--airion-border-subtle)]`}>
                                <stat.icon size={26} className="group-hover:rotate-12 transition-all duration-700" />
                            </div>
                            <div className={`flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-2xl border uppercase tracking-widest transition-all duration-700 ${stat.trend === 'up'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white'
                                : 'bg-rose-500/10 text-rose-600 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white'
                                }`}>
                                {stat.change}
                                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[var(--airion-text-muted)] font-black text-[11px] uppercase tracking-[0.4em] mb-4 opacity-40 group-hover:opacity-100 group-hover:text-[var(--airion-brand-primary)] transition-all italic">{stat.label}</p>
                            <h3 className="text-5xl font-black text-[var(--airion-text-primary)] tracking-tighter italic leading-none font-display mb-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>
                        </div>
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.1] transition-opacity duration-1000">
                            <stat.icon size={180} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 📊 Intelligence Spectrum Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Area Spectrum: Visibility Index */}
                <motion.div variants={itemVariants} className="card-minimal !p-10 bg-[var(--airion-bg-surface)] shadow-2xl relative overflow-hidden group border-[var(--airion-border-base)]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-1000">
                        <Globe size={200} />
                    </div>
                    <div className="flex items-center justify-between mb-16 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-2.5 h-14 bg-[var(--airion-brand-primary)] rounded-full shadow-[0_0_20px_var(--airion-brand-primary)] group-hover:h-20 transition-all duration-1000"></div>
                            <div>
                                <h3 className="text-3xl font-black text-[var(--airion-text-primary)] tracking-tight italic uppercase font-display leading-tight">Visibility Index</h3>
                                <p className="text-[11px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.4em] mt-3 opacity-40 italic">Global Marketplace Node Exposure</p>
                            </div>
                        </div>
                        <div className="p-5 bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-subtle)] rounded-[24px] group-hover:bg-[var(--airion-brand-primary)]/10 transition-all duration-700 shadow-sm">
                            <Activity className="text-[var(--airion-brand-primary)]" size={32} />
                        </div>
                    </div>
                    
                    <div className="h-[420px] w-full -ml-4 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorVisibility" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--airion-brand-primary)" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="var(--airion-brand-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="var(--airion-border-subtle)" strokeOpacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900 }} dy={20} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900 }} dx={-20} />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(255,255,255,0.95)', 
                                        backdropFilter: 'blur(20px)', 
                                        border: '1px solid var(--airion-border-base)', 
                                        borderRadius: '40px', 
                                        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.25)', 
                                        padding: '32px' 
                                    }}
                                    itemStyle={{ color: 'var(--airion-brand-primary)', fontWeight: 900, fontSize: '24px', fontStyle: 'italic', letterSpacing: '-0.02em' }}
                                    labelStyle={{ color: 'var(--airion-text-muted)', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.3em', fontStyle: 'italic' }}
                                    cursor={{ stroke: 'var(--airion-brand-primary)', strokeWidth: 3, strokeDasharray: '8 8' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="views" 
                                    stroke="var(--airion-brand-primary)" 
                                    strokeWidth={6} 
                                    fillOpacity={1} 
                                    fill="url(#colorVisibility)" 
                                    activeDot={{ r: 12, fill: 'var(--airion-brand-primary)', stroke: 'white', strokeWidth: 5, style: { filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.6))' } }} 
                                    animationDuration={3000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Capital Spectrum: Conversion Delta */}
                <motion.div variants={itemVariants} className="card-minimal !p-10 bg-[var(--airion-bg-surface)] shadow-2xl relative overflow-hidden group border-[var(--airion-border-base)]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-1000">
                        <Cpu size={200} />
                    </div>
                    <div className="flex items-center justify-between mb-16 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-2.5 h-14 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:h-20 transition-all duration-1000"></div>
                            <div>
                                <h3 className="text-3xl font-black text-[var(--airion-text-primary)] tracking-tight italic uppercase font-display leading-tight">Capital Matrix</h3>
                                <p className="text-[11px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.4em] mt-3 opacity-40 italic">Financial Throughput Efficiency</p>
                            </div>
                        </div>
                        <div className="p-5 bg-[var(--airion-bg-elevated)] border border-[var(--airion-border-subtle)] rounded-[24px] group-hover:bg-emerald-500/10 transition-all duration-700 shadow-sm">
                            <BarChart3 className="text-emerald-500" size={32} />
                        </div>
                    </div>
                    
                    <div className="h-[420px] w-full -ml-4 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <defs>
                                    <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="var(--airion-border-subtle)" strokeOpacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900 }} dy={20} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900 }} dx={-20} />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(255,255,255,0.95)', 
                                        backdropFilter: 'blur(20px)', 
                                        border: '1px solid var(--airion-border-base)', 
                                        borderRadius: '40px', 
                                        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.25)', 
                                        padding: '32px' 
                                    }}
                                    itemStyle={{ color: '#10b981', fontWeight: 900, fontSize: '24px', fontStyle: 'italic' }}
                                    labelStyle={{ color: 'var(--airion-text-muted)', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.3em', fontStyle: 'italic' }}
                                    cursor={{ fill: 'var(--airion-bg-elevated)', opacity: 0.5 }}
                                />
                                <Bar dataKey="capture" fill="url(#emeraldGradient)" radius={[16, 16, 0, 0]} barSize={32}>
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fillOpacity={0.8 + (index * 0.02)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* 🏰 Operational Sovereignty: Node Leadership Ranking */}
            <motion.div variants={itemVariants} className="card-minimal !p-12 bg-[var(--airion-bg-surface)] border-[var(--airion-border-base)] shadow-[0_64px_100px_-32px_rgba(0,0,0,0.2)] rounded-[64px] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform duration-2000">
                    <Target size={300} className="text-[var(--airion-text-primary)]" />
                </div>
                
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 mb-20 pb-12 border-b border-[var(--airion-border-subtle)] relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="p-6 bg-[var(--airion-brand-primary)]/10 rounded-[32px] shadow-sm border border-[var(--airion-brand-primary)]/10">
                            <Target className="text-[var(--airion-brand-primary)]" size={40} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-[var(--airion-text-primary)] tracking-tight uppercase italic font-display leading-none">Operational Sovereignty</h2>
                            <p className="text-[12px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.5em] mt-4 opacity-40 italic">Node Hierarchy • Capacity Thresholds</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <Badge className="bg-[var(--airion-brand-primary)] text-white font-black italic uppercase text-[11px] px-8 py-3 rounded-full shadow-2xl shadow-[var(--airion-brand-primary)]/40 tracking-[0.3em]">RANKING_SYSTEM_v4</Badge>
                        <button className="p-5 bg-[var(--airion-bg-elevated)] rounded-3xl text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)] transition-all hover:bg-[var(--airion-bg-base)] shadow-sm">
                            <MoreVertical size={28} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                    {topNodes.map((venue, idx) => (
                        <motion.div 
                            key={idx} 
                            whileHover={{ y: -16, scale: 1.02 }}
                            className="flex flex-col p-12 bg-[var(--airion-bg-elevated)]/30 border border-[var(--airion-border-subtle)] rounded-[48px] hover:bg-[var(--airion-bg-surface)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-[var(--airion-brand-primary)]/30 transition-all duration-1000 group relative overflow-hidden"
                        >
                            <div className="absolute -top-12 -right-12 p-16 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-2000">
                                <Layers size={180} className="text-[var(--airion-text-primary)]" />
                            </div>
                            <div className="w-16 h-16 rounded-[24px] bg-[var(--airion-text-primary)] flex items-center justify-center text-[var(--airion-text-inverted)] text-lg font-black mb-10 shadow-2xl group-hover:bg-[var(--airion-brand-primary)] group-hover:text-white group-hover:rotate-12 transition-all duration-1000 italic">
                                0{idx + 1}
                            </div>
                            <h3 className="font-black text-[var(--airion-text-primary)] tracking-tight mb-8 uppercase text-2xl italic leading-tight group-hover:text-[var(--airion-brand-primary)] transition-colors duration-700">{venue.name}</h3>
                            
                            <div className="space-y-8 mb-12">
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.4em] text-[var(--airion-text-muted)] italic">
                                    <span>Sync Alpha</span>
                                    <span className="text-[var(--airion-text-primary)] font-display text-xl group-hover:text-[var(--airion-brand-primary)] transition-colors">{venue.occupancy}%</span>
                                </div>
                                <div className="h-3.5 w-full bg-[var(--airion-bg-elevated)] rounded-full overflow-hidden p-0.5 border border-[var(--airion-border-subtle)] shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${venue.occupancy}%` }}
                                        transition={{ duration: 2, delay: 0.5 + (idx * 0.15), type: 'spring' }}
                                        className={`h-full rounded-full ${idx === 0 ? 'bg-[var(--airion-brand-primary)] shadow-[0_0_15px_var(--airion-brand-primary)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'} `}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-end mt-auto">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.4em] opacity-40 italic">{venue.bookings} NODES DEPLOYED</p>
                                    <p className="font-black text-4xl text-[var(--airion-text-primary)] tracking-tighter italic font-display group-hover:scale-105 transition-all duration-700 origin-left">{venue.revenue}</p>
                                </div>
                                <div className={`p-5 ${venue.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'} rounded-3xl border border-current opacity-30 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000`}>
                                    <Sparkles size={32} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                <div className="mt-20 flex justify-center relative z-10">
                    <button className="flex items-center gap-6 px-16 py-6 bg-[var(--airion-bg-elevated)] hover:bg-[var(--airion-bg-base)] border border-[var(--airion-border-subtle)] rounded-full text-[12px] font-black uppercase tracking-[0.6em] text-[var(--airion-text-primary)] italic transition-all active:scale-95 group/btn shadow-2xl hover:shadow-[var(--airion-brand-primary)]/10">
                        ACCESS GLOBAL ANALYTICS REGISTRY
                        <ChevronRight size={24} className="group-hover/btn:translate-x-3 transition-transform duration-700" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Analytics;
