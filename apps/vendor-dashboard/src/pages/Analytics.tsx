import React from 'react';
import { TrendingUp, Eye, Users, DollarSign, ArrowUpRight, ArrowDownRight, Activity, Zap, BarChart3, Target, ShieldCheck, Globe } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * 🍱 Business Intelligence: Analytics Engine
 * Modernized with high-legibility typography, theme-aware nodes, and premium "Matrix" aesthetics.
 */
const Analytics: React.FC = () => {
    const stats = [
        { label: 'Total Visibility', value: '24.5k', change: '+12%', trend: 'up', icon: Eye, color: 'text-blue-500' },
        { label: 'Active Inquiries', value: '142', change: '+5%', trend: 'up', icon: Users, color: 'text-emerald-500' },
        { label: 'Network Efficiency', value: '18.2%', change: '-2%', trend: 'down', icon: Zap, color: 'text-amber-500' },
        { label: 'Gross Revenue', value: '₹12.4L', change: '+18%', trend: 'up', icon: DollarSign, color: 'text-blue-600' },
    ];

    const viewsData = [
        { name: 'Mon', views: 4000, inquiries: 24 },
        { name: 'Tue', views: 3000, inquiries: 13 },
        { name: 'Wed', views: 2000, inquiries: 98 },
        { name: 'Thu', views: 2780, inquiries: 39 },
        { name: 'Fri', views: 1890, inquiries: 48 },
        { name: 'Sat', views: 2390, inquiries: 38 },
        { name: 'Sun', views: 3490, inquiries: 43 },
    ];

    const revenueData = [
        { name: 'Jan', revenue: 45000 },
        { name: 'Feb', revenue: 52000 },
        { name: 'Mar', revenue: 48000 },
        { name: 'Apr', revenue: 61000 },
        { name: 'May', revenue: 55000 },
        { name: 'Jun', revenue: 67000 },
    ];

    const topPerformers = [
        { name: 'Premium Wedding Suite', bookings: 45, revenue: '₹4.2L' },
        { name: 'Open Terrace Garden', bookings: 32, revenue: '₹3.1L' },
        { name: 'Executive Suite', bookings: 28, revenue: '₹5.1L' },
    ];

    const [timeRange, setTimeRange] = React.useState('Daily');

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-24">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 border-b border-[var(--airion-border-subtle)] pb-12">
                <div className="space-y-6">
                    <h1 className="text-xl font-black text-[var(--airion-text-primary)] tracking-tighter leading-none uppercase italic">Intelligence Matrix</h1>
                    <p className="text-lg font-bold text-[var(--airion-text-muted)] uppercase tracking-widest flex items-center gap-4">
                        <Activity size={24} className="text-blue-500 animate-pulse" />
                        Market Performance • Conversion Nodes • Resource Efficiency v4.8
                    </p>
                </div>
                <div className="flex bg-[var(--airion-bg-elevated)]/50 p-1.5 md:p-2 rounded-[2rem] border-2 border-[var(--airion-border-subtle)] shadow-inner w-full md:w-auto overflow-hidden relative z-30">
                    {['Daily', 'Monthly', 'Quarter'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`flex-1 md:flex-none px-4 md:px-10 py-3 md:py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-[1.5rem] cursor-pointer ${timeRange === range
                                ? 'bg-[var(--airion-brand-primary)] text-white shadow-xl shadow-blue-500/20 italic'
                                : 'text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)] hover:bg-white/5'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="card-minimal !p-10 flex flex-col justify-between group h-52 hover:scale-[1.03] transition-all duration-500 border-[var(--airion-border-base)] shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start z-10">
                            <div className="p-4 rounded-2xl bg-[var(--airion-bg-elevated)] border-2 border-[var(--airion-border-subtle)] text-[var(--airion-text-primary)] group-hover:border-blue-500/30 transition-all duration-500 shadow-xl group-hover:scale-110">
                                <stat.icon size={28} className={stat.color} />
                            </div>
                            <span className={`flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-xl border-2 uppercase tracking-widest italic ${stat.trend === 'up'
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5'
                                : 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5'
                                }`}>
                                {stat.change}
                                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
                            </span>
                        </div>
                        <div className="mt-8 z-10">
                            <p className="text-[10px] text-[var(--airion-text-muted)] font-black uppercase tracking-[0.3em] mb-3 italic">{stat.label}</p>
                            <h3 className="text-4xl font-black text-[var(--airion-text-primary)] tracking-tighter leading-none italic">{stat.value}</h3>
                        </div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[40px] translate-x-12 translate-y-12 transition-transform duration-1000 group-hover:scale-150" />
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Visibility Chart */}
                <div className="card-minimal !p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-[var(--airion-border-base)] rounded-[3.5rem] bg-[var(--airion-bg-surface)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    <div className="flex items-center justify-between mb-16 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-2.5 h-16 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)]"></div>
                            <div>
                                <h3 className="text-3xl font-black text-[var(--airion-text-primary)] tracking-tighter uppercase italic leading-none text-glow-blue">Visibility Index</h3>
                                <p className="text-[15px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.3em] mt-3">Node Perception Dynamics</p>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 shadow-inner">
                            <Eye className="text-blue-500 opacity-60" size={32} />
                        </div>
                    </div>
                    <div className="h-[450px] w-full -ml-6 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={viewsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="var(--airion-border-subtle)" strokeOpacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em' }} dy={20} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900 }} dx={-15} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--airion-bg-surface)', border: '2px solid var(--airion-border-base)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', padding: '24px' }}
                                    itemStyle={{ color: '#2563eb', fontWeight: 900, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '-0.02em' }}
                                    labelStyle={{ color: 'var(--airion-text-muted)', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.3em' }}
                                    cursor={{ stroke: 'var(--airion-brand-primary)', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={6} fillOpacity={1} fill="url(#colorViews)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Performance */}
                <div className="card-minimal !p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-[var(--airion-border-base)] rounded-[3.5rem] bg-[var(--airion-bg-surface)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                    <div className="flex items-center justify-between mb-16 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-2.5 h-16 bg-emerald-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>
                            <div>
                                <h3 className="text-3xl font-black text-[var(--airion-text-primary)] tracking-tighter uppercase italic leading-none text-glow-emerald">Conversion Flow</h3>
                                <p className="text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.3em] mt-3">Revenue Delta Synchronization</p>
                            </div>
                        </div>
                        <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 shadow-inner">
                            <BarChart3 className="text-emerald-500 opacity-60" size={32} />
                        </div>
                    </div>
                    <div className="h-[450px] w-full -ml-6 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="var(--airion-border-subtle)" strokeOpacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em' }} dy={20} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900 }} dx={-15} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--airion-bg-surface)', border: '2px solid var(--airion-border-base)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', padding: '24px' }}
                                    itemStyle={{ color: '#10b981', fontWeight: 900, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '-0.02em' }}
                                    labelStyle={{ color: 'var(--airion-text-muted)', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.3em' }}
                                />
                                <Bar dataKey="revenue" fill="#10b981" radius={[12, 12, 0, 0]} barSize={40} animationDuration={2500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Operational Performers */}
            <div className="card-minimal !p-12 shadow-2xl border-[var(--airion-border-base)] rounded-[4rem] relative overflow-hidden bg-[var(--airion-bg-elevated)]/20 backdrop-blur-md">
                <div className="absolute inset-0 bg-blue-500/[0.02] pointer-events-none" />
                <div className="flex items-center gap-8 mb-16 relative z-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
                        <Target size={36} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[var(--airion-text-primary)] tracking-tighter uppercase italic leading-none">Operational Efficiency Leaders</h2>
                        <p className="text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.4em] italic">Network Node Priority Queue</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                    {topPerformers.map((venue, idx) => (
                        <div key={idx} className="relative flex flex-col p-10 pt-16 bg-[var(--airion-bg-surface)] border-2 border-[var(--airion-border-subtle)] rounded-[3.5rem] hover:border-blue-500/30 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] hover:scale-[1.05] transition-all duration-700 group cursor-default shadow-xl">
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[var(--airion-bg-surface)] p-1.5 shadow-2xl z-20 transition-all duration-700 group-hover:scale-110">
                                <div className="w-full h-full rounded-full bg-[var(--airion-bg-elevated)] flex items-center justify-center text-[var(--airion-text-primary)] text-[10px] font-black shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 border-2 border-[var(--airion-border-subtle)] group-hover:border-blue-500 italic tracking-tighter">
                                    NODE 0{idx + 1}
                                </div>
                            </div>
                            <div className="flex justify-end items-start mb-6">
                                <div className="p-3 bg-blue-500/5 text-blue-500 rounded-xl border border-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Globe size={20} className="animate-spin-slow" />
                                </div>
                            </div>
                            <h3 className="font-black text-[var(--airion-text-primary)] tracking-tighter mb-4 uppercase text-xl leading-tight italic group-hover:text-blue-500 transition-colors">{venue.name}</h3>
                            <div className="flex justify-between items-end mt-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <p className="text-[15px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.3em] italic">{venue.bookings} COMPLETED NODES</p>
                                    </div>
                                    <p className="font-black text-3xl text-[var(--airion-text-primary)] tracking-tighter italic">{venue.revenue}</p>
                                </div>
                                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border-2 border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xl">
                                    <ArrowUpRight size={24} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
