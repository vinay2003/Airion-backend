import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { Calendar as CalendarIcon, MoreVertical, TrendingUp, TrendingDown, DollarSign, Package, FileText, ChevronRight, Clock, Sparkles, CheckCircle2, Zap, Target, Activity, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@ease2event/shared';
import api from '../lib/api';
import { Skeleton, Badge, Avatar, Button } from '@ease2event/ui';
import toast from 'react-hot-toast';

const MOCK_CHART_DATA = [
 { name: 'Jan', revenue: 2400 },
 { name: 'Feb', revenue: 1398 },
 { name: 'Mar', revenue: 9800 },
 { name: 'Apr', revenue: 3908 },
 { name: 'May', revenue: 4800 },
 { name: 'Jun', revenue: 3800 },
 { name: 'Jul', revenue: 4300 },
];

/**
 * 📊 Business Dashboard Overview
 * Professional visualization of key performance indicators and activity.
 */
const StatCard = ({ title, value, trend, direction, icon: Icon, isLoading, currency }: any) => (
 <div className="card-minimal p-5 flex flex-col justify-between h-32 group relative overflow-hidden transition-colors border border-[var(--ease2event-border-subtle)] rounded-xl bg-white dark:bg-slate-900 ">
 {isLoading ? (
 <div className="space-y-4">
 <Skeleton variant="text" width="40%" />
 <Skeleton variant="text" width="80%" height={32} />
 </div>
 ) : (
 <>
 <div className="space-y-2 z-10">
 <p className="text-sm font-semibold text-[var(--ease2event-text-secondary)] normal-case tracking-normal leading-none">{title}</p>
 <h3 className="text-2xl font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-none">
 {currency}{value}
 </h3>
 </div>

 <div className="flex items-center justify-between z-10 mt-4">
 {trend ? (
 <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md ${direction === 'up' ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border border-rose-500/20'}`}>
 {direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
 {trend}
 </div>
 ) : <div className="h-6" />}
 <div className="p-2.5 rounded-lg bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-secondary)] transition-colors group-hover:text-blue-500 group-">
 {Icon && <Icon size={18} />}
 </div>
 </div>
 </>
 )}
 </div>
);

const Dashboard = () => {
 const navigate = useNavigate();
 const { user } = useAuth();
 const vendorId = user?.vendor?.id || 'mock-id';
 const [chartView, setChartView] = React.useState<'live' | 'history'>('live');

 const { data: stats, isLoading: statsLoading } = useQuery({
 queryKey: ['vendor-stats', vendorId],
 queryFn: async () => {
 if (!vendorId || vendorId === 'mock-id') return null;
 try {
 const res: any = await api.get(`/vendors/${vendorId}/stats/bookings`);
 return {
 activeEnquiries: res?.pendingBookings || 0,
 totalListings: res?.totalEvents || 0,
 confirmedBookings: res?.upcomingBookings || 0,
 revenue: res?.totalEarnings || '0'
 };
 } catch (e) {
 console.error('Failed to fetch stats', e);
 return { activeEnquiries: 0, totalListings: 0, confirmedBookings: 0, revenue: '0' };
 }
 },
 enabled: vendorId !== 'mock-id',
 });

 const { data: earningsData } = useQuery({
 queryKey: ['vendor-earnings', vendorId],
 queryFn: async () => {
 if (!vendorId || vendorId === 'mock-id') return null;
 try {
 const res: any = await api.get(`/vendors/${vendorId}/earnings`);
 return res;
 } catch (e) {
 return null;
 }
 },
 enabled: vendorId !== 'mock-id',
 });

 const chartData = earningsData?.monthlyStats?.length ? earningsData.monthlyStats : MOCK_CHART_DATA;
 const enquiriesList = earningsData?.recentTransactions?.slice(0, 3) || [];

 const mockEnquiries = [
 { name: 'Sameer Malhotra', event: 'Wedding Decoration', time: '2h ago', avatar: 'S' },
 { name: 'Isha Gupta', event: 'Birthday Party', time: '5h ago', avatar: 'I' },
 { name: 'Rahul Verma', event: 'Corporate Seminar', time: '1d ago', avatar: 'R' },
 ];

 const handleExport = () => {
 const csvHeader = "Month,Revenue\n";
 const csvRows = chartData.map((data: any) => `${data.name},${data.revenue}`).join("\n");
 const csvString = csvHeader + csvRows;
 
 const blob = new Blob([csvString], { type: 'text/csv' });
 const url = window.URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.setAttribute('href', url);
 a.setAttribute('download', 'vendor_earnings_report.csv');
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 
 toast.success('Data exported successfully! Check your downloads.');
 };

 return (
 <div className=" space-y-8 pb-12 w-full max-w-7xl mx-auto px-6">
 {/* Top Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--ease2event-border-subtle)] pb-6">
 <div className="space-y-2">
 <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
 <p className="text-sm font-semibold text-[var(--ease2event-text-secondary)]">Overview of your business performance and activity.</p>
 </div>
 <div className="flex items-center gap-4">
 <Button
 onClick={handleExport}
 variant="secondary"
 className="h-10 px-6 rounded-lg text-xs font-bold"
 >
 Export Data
 </Button>
 <Button
 onClick={() => navigate('/events')}
 className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center h-11 sm:h-12 px-4 sm:px-6 rounded-2xl font-bold text-[9px] sm:text-[11px] tracking-widest bg-[var(--ease2event-brand-primary)] text-white hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
 >
 <Plus size={14} className="mr-2 sm:mr-3" />
 Add Service
 </Button>
 </div>
 </div>

 {/* KPI Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <StatCard title="Active Enquiries" value={stats?.activeEnquiries} trend="+24.2%" direction="up" icon={FileText} isLoading={statsLoading} />
 <StatCard title="Total Services Listed" value={stats?.totalListings} icon={Package} isLoading={statsLoading} />
 <StatCard title="Confirmed Bookings" value={stats?.confirmedBookings} trend="+8.4%" direction="up" icon={CheckCircle2} isLoading={statsLoading} />
 <StatCard title="Revenue" value={stats?.revenue} currency="₹" trend="+12.8%" direction="up" icon={DollarSign} isLoading={statsLoading} />
 </div>

 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

 {/* Right Column: Registry Feed (Now on the left) */}
 <div className="space-y-6">
 {/* Recent Signals */}
 <div className="card-minimal p-5 rounded-xl border border-[var(--ease2event-border-subtle)] bg-white dark:bg-slate-900 space-y-6">
 <div className="flex justify-between items-center">
 <h2 className="text-sm font-bold text-[var(--ease2event-text-secondary)]">Recent Enquiries</h2>
 <span className="chip px-3 py-1 text-[10px] font-bold rounded-full border border-blue-500/30 text-blue-600 bg-blue-50 dark:bg-blue-500/10">4 Active</span>
 </div>

 <div className="space-y-4">
 {enquiriesList.length > 0 ? (
 enquiriesList.map((e: any, i: number) => (
 <div key={i} onClick={() => navigate('/enquiries')} className="cursor-pointer flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-sm text-[var(--ease2event-text-primary)]">
 {e.client?.charAt(0) || 'C'}
 </div>
 <div className="flex-1 min-w-0">
 <h4 className="text-sm font-bold text-[var(--ease2event-text-primary)] tracking-tight truncate">{e.client || 'Customer'}</h4>
 <p className="text-xs text-[var(--ease2event-text-secondary)] font-medium truncate">{e.service} • <span className="text-blue-600 font-semibold">{e.amount}</span></p>
 </div>

 </div>
 ))
 ) : (
 mockEnquiries.map((e, i) => (
 <div key={i} onClick={() => navigate('/enquiries')} className="cursor-pointer flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-sm text-[var(--ease2event-text-primary)]">
 {e.avatar}
 </div>
 <div className="flex-1 min-w-0">
 <h4 className="text-sm font-bold text-[var(--ease2event-text-primary)] tracking-tight truncate">{e.name}</h4>
 <p className="text-xs text-[var(--ease2event-text-secondary)] font-medium truncate">{e.event} • <span className="text-blue-600 font-semibold">{e.time}</span></p>
 </div>

 </div>
 ))
 )}
 </div>

 <Button
 onClick={() => navigate('/enquiries')}
 variant="outline" className="w-full h-10 text-xs font-bold text-[var(--ease2event-text-secondary)] rounded-lg"
 >
 View All Enquiries
 </Button>
 </div>

 {/* Visibility Index */}
 <div className="card-minimal p-5 rounded-xl border border-[var(--ease2event-border-subtle)] bg-white dark:bg-slate-900 space-y-6 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2" />

 <div className="space-y-2 z-10 relative">
 <h2 className="text-lg font-bold text-[var(--ease2event-text-primary)] leading-none tracking-tight">Store Profile Ranking</h2>
 <p className="text-xs font-medium text-[var(--ease2event-text-secondary)]">Your performance ranking on Airion</p>
 </div>

 <div className="space-y-6 z-10 relative">
 <div className="flex justify-between items-end h-24 gap-2">
 {[40, 60, 45, 90, 65, 80, 70].map((h, i) => (
 <div key={i} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-t-md relative overflow-hidden border-x border-t border-slate-200 dark:border-slate-700">
 <div
 style={{ height: `${h}%` }}
 className={`absolute bottom-0 left-0 right-0 bg-blue-500/80`}
 />
 </div>
 ))}
 </div>

 <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
 <div className="space-y-1">
 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">Growth Delta</p>
 <p className="text-xl font-bold tracking-tight text-[var(--ease2event-text-primary)] leading-none">+24.8%</p>
 </div>
 <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
 <Activity size={20} />
 </div>
 </div>
 </div>
 </div>

 {/* Target Tracker */}
 <div className="space-y-4">
 <div className="flex items-center gap-2">
 <Target size={18} className="text-amber-500" />
 <h2 className="text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-wider">Pending Tasks</h2>
 </div>
 <div className="bg-white dark:bg-slate-900 border border-[var(--ease2event-border-subtle)] p-5 rounded-xl space-y-4 transition-colors ">
 <div className="flex justify-between items-start">
 <p className="text-sm font-bold text-[var(--ease2event-text-primary)] tracking-tight">Setup Decoration Flow</p>
 <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">JAN 18</span>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-4 h-4 rounded-full border border-blue-600/30 flex items-center justify-center">
 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
 </div>
 <p className="text-xs text-[var(--ease2event-text-secondary)] font-medium">Awaiting Vendor Approval</p>
 </div>
 </div>
 </div>
 </div>
 
 {/* Left Column: Charts and Performance Metrics (Now on the right) */}
 <div className="xl:col-span-2 space-y-6">
 {/* Revenue Chart */}
 <div className="card-minimal p-5 rounded-xl border border-[var(--ease2event-border-subtle)] bg-white dark:bg-slate-900">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
 <div className="space-y-1">
 <h2 className="text-lg font-bold text-[var(--ease2event-text-primary)] tracking-tight">Revenue Overview</h2>
 <p className="text-sm font-semibold text-[var(--ease2event-text-secondary)]">Earnings tracking over time</p>
 </div>
 <div className="flex bg-[var(--ease2event-bg-elevated)] p-1 rounded-lg border border-[var(--ease2event-border-subtle)]">
 <button 
 onClick={() => setChartView('live')}
 className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-bold transition-all ${chartView === 'live' ? 'bg-[var(--ease2event-brand-primary)] text-white ' : 'text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-text-primary)]'}`}
 >
 Live
 </button>
 <button 
 onClick={() => setChartView('history')}
 className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-bold transition-all ${chartView === 'history' ? 'bg-[var(--ease2event-brand-primary)] text-white ' : 'text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-text-primary)]'}`}
 >
 History
 </button>
 </div>
 </div>

 <div className="h-[280px] w-full mt-4">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
 <defs>
 <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
 <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ease2event-border-subtle)" />
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--ease2event-text-secondary)', fontSize: 11, fontWeight: 700 }} dy={15} />
 <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--ease2event-text-secondary)', fontSize: 11, fontWeight: 700 }} />
 <Tooltip
 contentStyle={{ backgroundColor: 'var(--ease2event-bg-surface)', borderRadius: '16px', border: '1px solid var(--ease2event-border-subtle)', padding: '16px' }}
 itemStyle={{ color: 'var(--ease2event-text-primary)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}
 />
 <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Feature Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="card-minimal p-6 rounded-xl border border-[var(--ease2event-border-subtle)] bg-white dark:bg-slate-900 space-y-5">
 <div className="flex justify-between items-start">
 <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg text-blue-500">
 <Sparkles size={24} />
 </div>
 <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold not-italic px-3 py-1 rounded-full">Boost Active</Badge>
 </div>
 <div className="space-y-2">
 <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Marketing Engine</h3>
 <p className="text-sm text-[var(--ease2event-text-secondary)] font-medium leading-relaxed">Get more visibility and bookings with smart marketing.</p>
 </div>
 <Button
 onClick={() => navigate('/ads')}
 className="w-full h-10 text-sm font-bold rounded-lg "
 >
 Start Campaign
 </Button>
 </div>

 <div className="bg-blue-600 rounded-xl p-6 text-white space-y-6 flex flex-col justify-between relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
 <div className="flex justify-between items-start z-10">
 <CalendarIcon size={32} className="text-white/80" />
 <div className="text-right">
 <p className="text-xs font-semibold opacity-70">Next Event</p>
 <p className="text-lg font-bold mt-1 leading-none">JAN 20, 2026</p>
 </div>
 </div>
 <div className="z-10 space-y-2">
 <h3 className="text-xl font-bold leading-none">Big Hall Event</h3>
 <p className="text-xs font-medium opacity-80">12 tasks pending completion for this service</p>
 </div>
 <button
 onClick={() => navigate('/bookings')}
 className="cursor-pointer flex items-center justify-between w-full h-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-4 text-sm font-bold transition-all backdrop-blur-sm z-10"
 >
 View Details <ChevronRight size={18} />
 </button>
 </div>
 </div>
 </div>

 </div>
 </div>
 );
};

export default Dashboard;
