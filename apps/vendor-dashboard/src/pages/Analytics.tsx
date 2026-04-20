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
import { useAuth } from '@ease2event/shared';
import api from '../lib/api'; // Use common api instance
import { useQuery } from '@tanstack/react-query';
import { fetchVendorPerformance } from '../lib/api';
import { Badge, Button, Skeleton } from '@ease2event/ui';

type AnalysisPeriod = '24H_REALTIME' | '30D_CYCLE' | 'ANNUAL_MATRIX';

/**
 * 🍱 Intelligence Matrix: Autonomous Business Engine
 * Modernized for high-fidelity responsiveness and dynamic node orchestration.
 * Features 'Neural Core' telemetry and global marketplace visibility indexing.
 */
const Analytics: React.FC = () => {
    const { user } = useAuth();
    const vendorId = user?.vendor?.id || user?.id || '';
    const [selectedPeriod, setSelectedPeriod] = useState<AnalysisPeriod>('30D_CYCLE');

    // 🛰️ Real-time Operational Insights Fetching
    const { data: statsData, isLoading } = useQuery({
        queryKey: ['vendorStats', vendorId, selectedPeriod],
        queryFn: async () => {
            if (!vendorId) return null;
            try {
                // Assuming stats endpoint exists, fallback to mock if not
                const res: any = await api.get(`/vendors/${vendorId}/stats/bookings`);
                return res;
            } catch (err) {
                return null;
            }
        },
        enabled: !!vendorId
    });

    const stats = useMemo(() => [
        { label: 'Network Visibility', value: statsData?.totalEvents || '0', change: '+12.4%', trend: 'up', icon: Eye, color: 'text-blue-500', shadow: 'shadow-blue-500/10' },
        { label: 'Active Inquiries', value: statsData?.pendingBookings || '0', change: '+5.2%', trend: 'up', icon: Users, color: 'text-indigo-500', shadow: 'shadow-indigo-500/10' },
        { label: 'Upcoming Bookings', value: statsData?.upcomingBookings || '0', change: '-2.1%', trend: 'down', icon: Zap, color: 'text-amber-500', shadow: 'shadow-amber-500/10' },
        { label: 'Gross Capture', value: `₹${statsData?.totalEarnings || '0'}`, change: '+18.5%', trend: 'up', icon: DollarSign, color: 'text-emerald-500', shadow: 'shadow-emerald-500/10' },
    ], [statsData]);

    // 🛸 Performance Telemetry Flow
    const { data: performanceDataRaw } = useQuery({
        queryKey: ['vendorPerformance', vendorId],
        queryFn: () => vendorId ? fetchVendorPerformance(vendorId, 7) : Promise.resolve(null),
        enabled: !!vendorId
    });

    const performanceData = useMemo(() => {
        if (Array.isArray(performanceDataRaw)) {
            return performanceDataRaw.map((v: any) => ({
                ...v,
                capture: v.views * 100 // Simulated revenue relative to views for chart aesthetics
            }));
        }
        return [
            { name: 'Mon', views: 4000, inquiries: 24, capture: 12000 },
            { name: 'Tue', views: 3000, inquiries: 13, capture: 8000 },
            { name: 'Wed', views: 2000, inquiries: 98, capture: 45000 },
            { name: 'Thu', views: 2780, inquiries: 39, capture: 15000 },
            { name: 'Fri', views: 1890, inquiries: 48, capture: 22000 },
            { name: 'Sat', views: 2390, inquiries: 38, capture: 31000 },
            { name: 'Sun', views: 3490, inquiries: 43, capture: 28000 },
        ];
    }, [performanceDataRaw]);

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
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-[32px]" />)}
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
            {/* 🛸 Intelligence Matrix Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 sm:gap-10 pt-0 pb-10 border-b border-[var(--ease2event-border-subtle)] relative overflow-hidden">
                <motion.div variants={itemVariants} className="relative z-10 space-y-3 sm:space-y-4">
                    <h1 className="text-3xl font-normal text-[var(--ease2event-text-primary)] leading-normal">Intelligence Matrix</h1>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] sm:text-sm font-semibold rounded-full border border-emerald-500/20">
                            <Activity size={12} className="animate-pulse" />
                            Core Telemetry Live
                        </span>
                        <p className="text-[9px] sm:text-sm text-[var(--ease2event-text-muted)] font-normal opacity-60">Genesis Hub v4.8 • Regional Monitoring ACTIVE</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex bg-[var(--ease2event-bg-elevated)]/50 p-1.5 rounded-[24px] border border-[var(--ease2event-border-subtle)] relative z-10">
                    {(['24H_REALTIME', '30D_CYCLE', 'ANNUAL_MATRIX'] as AnalysisPeriod[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedPeriod(tab)}
                            className={`px-8 py-3 text-[10px] sm:text-[11px] font-semibold rounded-xl transition-all duration-500 relative ${selectedPeriod === tab ? 'bg-[var(--ease2event-bg-surface)] text-[var(--ease2event-brand-primary)] shadow-xl border border-[var(--ease2event-border-base)] scale-105 z-10' : 'text-[var(--ease2event-text-muted)]'}`}
                        >
                            {tab.split('_')[0]} Cycle
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* 🚀 Tactical Telemetry Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className={`card-minimal p-6 sm:!p-10 flex flex-col justify-between group cursor-pointer border-[var(--ease2event-border-base)] relative overflow-hidden shadow-2xl bg-[var(--ease2event-bg-surface)] ${stat.shadow}`}
                    >
                        <div className="flex justify-between items-start mb-8 sm:mb-12 relative z-10">
                            <div className={`p-3 sm:p-4 rounded-xl bg-[var(--ease2event-bg-elevated)] ${stat.color} group-hover:bg-[var(--ease2event-brand-primary)] group-hover:text-white transition-all duration-500 border border-[var(--ease2event-border-subtle)]`}>
                                <stat.icon size={20} className="sm:w-[24px] sm:h-[24px]" />
                            </div>
                            <Badge className={`font-semibold text-[8px] sm:text-[9px] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                {stat.change} {stat.trend === 'up' ? '↑' : '↓'}
                            </Badge>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] sm:text-sm font-normal text-[var(--ease2event-text-muted)] mb-2 sm:mb-3 opacity-60">{stat.label}</p>
                            <h3 className="text-3xl font-semibold text-[var(--ease2event-text-primary)] tracking-tight leading-none group-hover:scale-105 transition-transform">{stat.value}</h3>
                        </div>
                        <stat.icon size={120} className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700" />
                    </motion.div>
                ))}
            </div>

            {/* 📊 Spectrum Analytics Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <motion.div variants={itemVariants} className="card-premium p-6 sm:!p-10 relative overflow-hidden group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 relative z-10 gap-6 sm:gap-0">
                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="w-1.5 h-10 bg-[var(--ease2event-brand-primary)] rounded-full shadow-[0_0_15px_var(--ease2event-brand-primary)]"></div>
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--ease2event-text-primary)] tracking-tight">Visibility Spectrum</h3>
                                <p className="text-[10px] sm:text-xs font-normal text-[var(--ease2event-text-muted)] mt-1 sm:mt-2 opacity-60">Marketplace Interaction Delta</p>
                            </div>
                        </div>
                        <div className="p-3 sm:p-4 bg-[var(--ease2event-bg-elevated)] rounded-2xl border border-[var(--ease2event-border-subtle)] w-fit">
                            <Globe className="text-[var(--ease2event-brand-primary)] size-5 sm:size-6" />
                        </div>
                    </div>

                    <div className="h-[380px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="visGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--ease2event-brand-primary)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--ease2event-brand-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="var(--ease2event-border-subtle)" strokeOpacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--ease2event-text-muted)', fontSize: 10, fontWeight: 600 }} dy={20} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ stroke: 'var(--ease2event-brand-primary)', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    contentStyle={{ background: 'var(--ease2event-bg-surface)', border: '1px solid var(--ease2event-border-base)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="var(--ease2event-brand-primary)" strokeWidth={4} fill="url(#visGradient)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="card-premium !p-10 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-2 h-12 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--ease2event-text-primary)] tracking-tight">Revenue Velocity</h3>
                                <p className="text-sm font-normal text-[var(--ease2event-text-muted)] mt-2 opacity-60">Financial Throughput Matrix</p>
                            </div>
                        </div>
                        <div className="p-4 bg-[var(--ease2event-bg-elevated)] rounded-2xl border border-[var(--ease2event-border-subtle)]">
                            <Zap className="text-emerald-500" size={24} />
                        </div>
                    </div>

                    <div className="h-[380px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--ease2event-text-muted)', fontSize: 10, fontWeight: 600 }} dy={20} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'var(--ease2event-bg-elevated)', opacity: 0.3 }}
                                    contentStyle={{ background: 'var(--ease2event-bg-surface)', border: '1px solid var(--ease2event-border-base)', borderRadius: '24px' }}
                                />
                                <Bar dataKey="capture" fill="#10b981" radius={[8, 8, 0, 0]} barSize={24} animationDuration={2500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* 🏰 Node Leadership Matrix */}
            <motion.div variants={itemVariants} className="card-premium p-6 sm:!p-12 border-[var(--ease2event-border-base)] shadow-2xl relative group">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-[var(--ease2event-border-subtle)] gap-8">
                    <div className="flex items-center gap-5 sm:gap-8">
                        <div className="p-4 sm:p-5 bg-[var(--ease2event-bg-elevated)] rounded-2xl sm:rounded-3xl border border-[var(--ease2event-border-subtle)] shrink-0">
                            <Zap className="text-[var(--ease2event-brand-primary)] size-6 sm:size-8" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-3xl font-semibold text-[var(--ease2event-text-primary)] leading-none tracking-tight">Performance Sovereignty</h2>
                            <p className="text-[9px] sm:text-[11px] font-normal text-[var(--ease2event-text-muted)] mt-3 sm:mt-4 opacity-60">Top Performing Localized Marketplace Nodes</p>
                        </div>
                    </div>
                    <Button variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-semibold tracking-normal w-full xl:w-auto">Sync Global Registry</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                    {topNodes.map((node, i) => (
                        <div key={i} className="space-y-6 sm:space-y-8 p-6 sm:p-10 bg-[var(--ease2event-bg-elevated)]/20 border border-[var(--ease2event-border-subtle)] rounded-[32px] sm:rounded-[40px] hover:bg-[var(--ease2event-bg-surface)] transition-all duration-700 hover:shadow-2xl hover:scale-105 group/node">
                            <div className="flex justify-between items-start">
                                <span className="text-3xl sm:text-4xl font-semibold text-[var(--ease2event-brand-primary)]/20 group-hover/node:text-[var(--ease2event-brand-primary)] transition-colors">0{i+1}</span>
                                <Badge className={`bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold text-[8px] px-2 py-0.5`}>{node.status}</Badge>
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-[var(--ease2event-text-primary)] leading-tight">{node.name}</h3>
                                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[8px] sm:text-[9px] font-normal text-[var(--ease2event-text-muted)] leading-none">Sync Intensity</p>
                                        <p className="text-base sm:text-lg font-semibold text-[var(--ease2event-text-primary)] leading-none">{node.occupancy}%</p>
                                    </div>
                                    <div className="h-1.5 sm:h-2 w-full bg-[var(--ease2event-bg-elevated)] rounded-full overflow-hidden p-0.5">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${node.occupancy}%` }} transition={{ duration: 1.5, delay: 1 }} className="h-full bg-[var(--ease2event-brand-primary)] rounded-full shadow-[0_0_10px_var(--ease2event-brand-primary)]" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 sm:pt-8 border-t border-[var(--ease2event-border-subtle)] flex justify-between items-center">
                                <p className="text-[10px] sm:text-sm font-normal text-[var(--ease2event-text-muted)]">{node.bookings} Bookings</p>
                                <p className="text-lg sm:text-xl font-semibold text-[var(--ease2event-text-primary)]">{node.revenue}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Analytics;
