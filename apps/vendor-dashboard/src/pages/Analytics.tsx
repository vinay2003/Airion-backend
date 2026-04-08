import React from 'react';
import { TrendingUp, Eye, Users, DollarSign, ArrowUpRight, ArrowDownRight, Activity, Zap, BarChart3, Target } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * 🍱 Business Intelligence: Analytics Engine
 * Modernized with 'minimal premium' design system.
 */
const Analytics: React.FC = () => {
    const stats = [
        { label: 'Total Visibility', value: '24.5k', change: '+12%', trend: 'up', icon: Eye, color: 'blue' },
        { label: 'Active Inquiries', value: '142', change: '+5%', trend: 'up', icon: Users, color: 'emerald' },
        { label: 'Network Efficiency', value: '18.2%', change: '-2%', trend: 'down', icon: Zap, color: 'amber' },
        { label: 'Gross Revenue', value: '₹12.4L', change: '+18%', trend: 'up', icon: DollarSign, color: 'primary' },
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

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Intelligence Matrix</h1>
                    <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-widest leading-none">Market Performance • Conversion Nodes • Resource Efficiency</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-inner">
                    <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-white text-primary rounded-lg shadow-sm border border-slate-100">Daily</button>
                    <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Monthly</button>
                    <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Quarter</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="card-minimal p-6 flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-slate-50 text-slate-900 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                                <stat.icon size={20} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <span className={`flex items-center gap-1 text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${stat.trend === 'up'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-rose-50 text-rose-600 border-rose-100'
                                }`}>
                                {stat.change}
                                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visibility Chart */}
                <div className="card-minimal p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Visibility Index</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Node Performance</p>
                            </div>
                        </div>
                        <Activity className="text-slate-200" size={24} />
                    </div>
                    <div className="h-72 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={viewsData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--airion-brand-primary)" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="var(--airion-brand-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--airion-border-subtle)" strokeOpacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '16px', boxShadow: 'var(--airion-shadow-xl)', padding: '12px' }}
                                    itemStyle={{ color: 'var(--airion-brand-primary)', fontWeight: 900, fontSize: '14px' }}
                                    labelStyle={{ color: 'var(--airion-text-muted)', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="var(--airion-brand-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Performance */}
                <div className="card-minimal p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-10 bg-emerald-500 rounded-full"></div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Conversion Flow</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue Capture Delta</p>
                            </div>
                        </div>
                        <BarChart3 className="text-slate-200" size={24} />
                    </div>
                    <div className="h-72 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--airion-border-subtle)" strokeOpacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 900 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '16px', boxShadow: 'var(--airion-shadow-xl)', padding: '12px' }}
                                    itemStyle={{ color: '#3b82f6', fontWeight: 900, fontSize: '14px' }}
                                    labelStyle={{ color: 'var(--airion-text-muted)', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Operational Performers */}
            <div className="card-minimal p-8">
                <div className="flex items-center gap-3 mb-8">
                    <Target className="text-primary" size={24} />
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Operational Efficiency Leaders</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topPerformers.map((venue, idx) => (
                        <div key={idx} className="flex flex-col p-6 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-500 group">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-[10px] font-black mb-4 shadow-lg group-hover:bg-primary transition-colors italic">
                                0{idx + 1}
                            </div>
                            <h3 className="font-black text-slate-900 tracking-tight mb-1 uppercase text-sm italic">{venue.name}</h3>
                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{venue.bookings} BOOKINGS</p>
                                    <p className="font-black text-lg text-slate-900 tracking-tighter mt-1 italic">{venue.revenue}</p>
                                </div>
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 flex items-center justify-center">
                                    <ArrowUpRight size={14} />
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
