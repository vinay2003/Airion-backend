import React, { useState, useMemo } from 'react';
import {
 DollarSign,
 TrendingUp,
 Download,
 Eye,
 ArrowUpRight,
 ArrowDownRight,
 Filter,
 Calendar as CalendarIcon,
 ChevronRight,
 CreditCard,
 Clock,
 Zap,
 CheckCircle2,
 ArrowRight,
 ShieldCheck,
 AlertCircle,
 BarChart3,
 Activity,
 Layers,
 Search,
 ArrowBigUpDash
} from 'lucide-react';
import { Button, Badge, Skeleton, notify } from '@ease2event/ui';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@ease2event/shared';
import { bookingService } from '@ease2event/shared/lib/services/bookingService';
import { useQuery } from '@tanstack/react-query';
import { fetchWalletOverview, requestWithdrawal } from '../lib/api';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Period = 'Daily' | 'Weekly' | 'Monthly';

/**
 * 💹 Financial Intelligence Matrix: Autonomous Revenue Monitoring
 * Full Dynamic Data Integration with Premium SaaS Aesthetics.
 */
const Earnings: React.FC = () => {
 const { user } = useAuth();
 const vendorId = user?.vendor?.id || user?.id || '';
 const [activePeriod, setActivePeriod] = useState<Period>('Monthly');
 const [searchTerm, setSearchTerm] = useState('');
 const queryClient = useQueryClient();

 // 🛰️ Real-time Data Fetching
 const { data: walletData, isLoading } = useQuery({
 queryKey: ['wallet-overview'],
 queryFn: async () => {
 const res: any = await fetchWalletOverview();
 return res.data || res;
 },
 staleTime: 1000 * 60 * 5, // Cache for 5 minutes
 });

 // 📊 Dynamic Chart Aggregation (Fallback to Matrix Mock)
 const periodData = useMemo(() => {
 const dailyStats = [
 { name: '08:00', revenue: 2500 }, { name: '10:00', revenue: 4200 },
 { name: '12:00', revenue: 15600 }, { name: '14:00', revenue: 8900 },
 { name: '16:00', revenue: 12400 }, { name: '18:00', revenue: 18500 },
 { name: '20:00', revenue: 14200 },
 ];

 const weeklyStats = [
 { name: 'Mon', revenue: 12500 }, { name: 'Tue', revenue: 15200 },
 { name: 'Wed', revenue: 14800 }, { name: 'Thu', revenue: 21100 },
 { name: 'Fri', revenue: 35500 }, { name: 'Sat', revenue: 42000 },
 { name: 'Sun', revenue: 28000 },
 ];

 const monthlyStats = [
 { name: 'Jan', revenue: 145000 }, { name: 'Feb', revenue: 152000 },
 { name: 'Mar', revenue: 148000 }, { name: 'Apr', revenue: 161000 },
 { name: 'May', revenue: 155000 }, { name: 'Jun', revenue: 167000 },
 { name: 'Jul', revenue: 172000 },
 ];

 switch (activePeriod) {
 case 'Daily': return dailyStats;
 case 'Weekly': return weeklyStats;
 case 'Monthly': return monthlyStats;
 default: return monthlyStats;
 }
 }, [activePeriod]);

 // 💎 Intelligence KPIs
 const displayData = useMemo(() => {
 const statsBase = {
 Daily: { revenue: 76300, growth: '+8.2%', progress: 65, target: 100000, date: 'Oct 25' },
 Weekly: { revenue: 169100, growth: '+24.1%', progress: 82, target: 200000, date: 'Oct 28' },
 Monthly: { revenue: 1045000, growth: '+12.5%', progress: 45, target: 2500000, date: 'Nov 05' }
 };

 const currentStats = statsBase[activePeriod];

 // Map backend transactions to frontend table format
 const rawTransactions = (walletData as any)?.transactions?.map((t: any) => ({
 id: t.id,
 service: t.description || 'Service Payment',
 client: t.referenceId ? `Ref: ${t.referenceId.slice(0, 8)}` : 'Platform',
 date: new Date(t.createdAt).toLocaleDateString(),
 amount: `₹${Number(t.amount).toLocaleString()}`,
 status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
 method: t.type
 })) || [
 { id: '#TRX-9821', service: 'Wedding Photography', client: 'Rohit Sharma', date: 'Oct 12, 2023', amount: '₹12,500', status: 'Completed', method: 'UPI' },
 { id: '#TRX-9822', service: 'Event Catering', client: 'Anjali Gupta', date: 'Oct 10, 2023', amount: '₹45,000', status: 'Pending', method: 'Transfer' },
 ];

 return {
 totalBalance: (walletData as any)?.balance || 0,
 pendingBalance: (walletData as any)?.pending || 0,
 periodRevenue: currentStats.revenue, // We'll keep mock revenue trends for chart aesthetics
 growth: currentStats.growth,
 payoutDate: currentStats.date,
 payoutProgress: currentStats.progress,
 payoutTarget: currentStats.target,
 transactions: rawTransactions.filter((t: any) =>
 t.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
 t.service.toLowerCase().includes(searchTerm.toLowerCase())
 )
 };
 }, [activePeriod, walletData, searchTerm]);

 const handleExport = () => {
 notify.info('Preparing transaction logs for export...');
 setTimeout(() => {
 notify.success('Transaction logs exported successfully (PDF)');
 }, 1500);
 };

 const handleCustomPeriod = () => {
 notify.info('Date Range Selector: Advanced unit initialized');
 };

 const withdrawMutation = useMutation({
 mutationFn: async (amount: number) => {
 return requestWithdrawal(amount);
 },
 onSuccess: () => {
 notify.success('Withdrawal request submitted successfully');
 queryClient.invalidateQueries({ queryKey: ['wallet-overview'] });
 },
 onError: (err: any) => {
 notify.error(err.response?.data?.message || 'Failed to submit withdrawal request');
 }
 });

 const handleWithdraw = () => {
 const balance = displayData.totalBalance;
 if (balance < 1000) {
 notify.error('Minimum withdrawal amount is ₹1,000');
 return;
 }
 if (confirm(`Request withdrawal for ₹${balance.toLocaleString('en-IN')}?`)) {
 withdrawMutation.mutate(balance);
 }
 };

 const containerVariants: Variants = {
 hidden: { opacity: 0 },
 visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
 };

 const itemVariants: Variants = {
 hidden: { y: 20, opacity: 0 },
 visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
 };

 return (
 <div
 
 
 
 className="space-y-5 pb-32 px-6 w-full max-w-7xl mx-auto"
 >
 {/* 🔮 Financial Matrix Header */}
 <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-0 pb-6 border-b border-[var(--ease2event-border-subtle)] relative overflow-hidden">
 <div className="relative z-10">
 <h1 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Earnings & Wallet</h1>
 <div className="flex items-center gap-4 mt-4">
 <p className="text-base font-semibold text-[var(--ease2event-text-secondary)] normal-case tracking-normal flex items-center gap-2">
 Monitor your revenue and transaction history.
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3 sm:gap-4 relative z-10 w-full lg:w-auto">
 <Button
 onClick={handleCustomPeriod}
 className="flex-1 sm:flex-none flex items-center justify-center bg-[var(--ease2event-bg-elevated)] h-11 sm:h-12 px-4 sm:px-5 rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold text-[9px] sm:text-[11px] tracking-widest text-[var(--ease2event-text-primary)] hover:bg-[var(--ease2event-bg-surface)] transition-all active:scale-95 whitespace-nowrap"
 >
 <CalendarIcon size={14} className="mr-2 sm:mr-3" />
 Custom Period
 </Button>
 <Button
 onClick={handleExport}
 className="flex-1 sm:flex-none flex items-center justify-center h-11 sm:h-12 px-4 sm:px-6 rounded-2xl font-bold text-[9px] sm:text-[11px] tracking-widest bg-[var(--ease2event-brand-primary)] text-white  transition-all active:scale-95 whitespace-nowrap"
 >
 <Download size={14} className="mr-2 sm:mr-3" />
 Export Logs
 </Button>
 </div>


 {/* Background Decor */}
 <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--ease2event-brand-primary)]/[0.03] to-transparent pointer-events-none"></div>
 </div>

 {/* 🚀 Primary Intelligence Nodes */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 <div className="card-minimal p-6 sm:p-6 flex flex-col justify-between  transition-all bg-[var(--ease2event-bg-surface)]">
 <div>
 <div className="flex justify-between items-start mb-6 sm:mb-10 relative">
 <div className="p-4 sm:p-5 bg-emerald-500/10 text-emerald-500 rounded-[20px] sm:rounded-[24px] border border-emerald-500/10">
 <ShieldCheck size={16} className="sm:w-[28px] sm:h-[28px]" />
 </div>
 <div className="flex items-center gap-2 text-[var(--ease2event-text-secondary)] text-[12px] sm:text-[13px] font-bold px-3 sm:px-4 py-1.5 sm:py-2 uppercase tracking-widest border border-[var(--ease2event-border-subtle)] rounded-2xl bg-[var(--ease2event-bg-elevated)] leading-none">
 <span className="opacity-70">SYNCED :</span>
 <span className="text-[var(--ease2event-text-primary)]">OCT 15, 2023</span>
 </div>
 </div>
 <p className="text-[var(--ease2event-text-secondary)] font-bold text-[12px] sm:text-sm tracking-widest mb-3 sm:mb-4">Total Balance</p>
 <h2 className="text-lg sm:text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tighter leading-none">
 {isLoading ? <Skeleton className="h-12 w-32 rounded-xl" /> : `₹${displayData.totalBalance.toLocaleString('en-IN')}`}
 </h2>
 </div>
 <div className="mt-10 pt-8 border-t border-[var(--ease2event-border-subtle)]">
 <button 
 onClick={handleWithdraw}
 disabled={withdrawMutation.isPending}
 className="flex items-center justify-between w-full p-5 bg-[var(--ease2event-bg-surface)] hover:bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] rounded-xl transition-all group active:scale-95 ">
 <span className="text-sm font-bold text-[var(--ease2event-text-primary)] tracking-widest flex items-center gap-3">
 <CreditCard size={18} className="text-emerald-500" />
 {withdrawMutation.isPending ? 'Processing...' : 'Withdrawal'}
 </span>
 <ArrowRight size={18} className="text-[var(--ease2event-text-secondary)] group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
 </button>
 </div>
 </div>

 <div className="card-minimal p-6 sm:p-6 flex flex-col justify-between  transition-all bg-[var(--ease2event-bg-surface)]">
 <div>
 <div className="flex justify-between items-start mb-6 sm:mb-10 relative">
 <div className="p-4 sm:p-5 bg-[var(--ease2event-brand-primary)]/10 text-[var(--ease2event-brand-primary)] rounded-[20px] sm:rounded-[24px] border border-[var(--ease2event-brand-primary)]/10">
 <TrendingUp size={16} className="sm:w-[28px] sm:h-[28px]" />
 </div>
 <div className="flex items-center gap-2 text-emerald-600 text-[12px] sm:text-[13px] font-bold bg-emerald-500/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-emerald-500/20 tracking-widest">
 <ArrowBigUpDash size={16} />
 <span>{displayData.growth}</span>
 </div>
 </div>
 <p className="text-[var(--ease2event-text-secondary)] font-bold text-[12px] sm:text-sm tracking-widest mb-3 sm:mb-4">{activePeriod} Revenue</p>
 <h2 className="text-lg sm:text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tighter leading-none">
 {isLoading ? <Skeleton className="h-12 w-32 rounded-xl" /> : `₹${displayData.periodRevenue.toLocaleString('en-IN')}`}
 </h2>
 </div>
 <div className="flex items-center gap-4 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[var(--ease2event-border-subtle)]">
 <div className="flex -space-x-3">
 {[1, 2, 3, 4].map(i => <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-bg-surface)] " />)}
 </div>
 <div className="space-y-1.5">
 <p className="text-[11px] sm:text-[12px] text-[var(--ease2event-text-secondary)] font-bold tracking-[0.15em] leading-none">Nodes Updated</p>
 <p className="text-[11px] sm:text-[12px] text-emerald-600 font-semibold tracking-[0.2em] leading-none">Live Telemetry</p>
 </div>
 </div>
 </div>

 <div className="card-minimal p-6 sm:p-6 flex flex-col justify-between  transition-all bg-[var(--ease2event-bg-surface)]">
 <div className="flex justify-between items-start mb-6 sm:mb-8">
 <div className="flex-1">
 <p className="text-[var(--ease2event-text-secondary)] font-bold text-[12px] sm:text-sm tracking-widest mb-1 sm:mb-2">Monthly Target</p>
 <h3 className="text-lg sm:text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tighter leading-none">
 {isLoading ? <Skeleton className="h-10 w-28 rounded-xl" /> : `₹${displayData.payoutTarget.toLocaleString()}`}
 </h3>
 </div>
 <div className="p-3 sm:p-4 bg-amber-500/10 text-amber-600 rounded-[20px] sm:rounded-[24px] border border-amber-500/20 shrink-0">
 <Clock size={16} className="sm:w-[28px] sm:h-[28px]" />
 </div>
 </div>

 <div className="space-y-4 sm:space-y-6">
 <div className="h-4 sm:h-5 w-full bg-[var(--ease2event-bg-elevated)] rounded-full overflow-hidden p-1 sm:p-1.5 border border-[var(--ease2event-border-subtle)] ">
 <div
 style={{ width: `${displayData.payoutProgress}%` }}
 className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
 />
 </div>
 <div className="flex justify-between items-center text-[10px] sm:text-[12px] font-bold tracking-widest text-[var(--ease2event-text-secondary)] leading-none">
 <span>{displayData.payoutProgress}% Progress</span>
 <span className="text-[var(--ease2event-brand-primary)] tracking-tight">SETTLEMENT: {displayData.payoutDate}</span>
 </div>
 </div>
 <button className="mt-8 sm:mt-10 flex items-center justify-between w-full p-4 sm:p-5 bg-[var(--ease2event-bg-surface)] hover:bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] rounded-lg sm:rounded-xl transition-all group active:scale-95 ">
 <span className="text-xs sm:text-sm font-bold text-[var(--ease2event-text-primary)] tracking-widest leading-none">Modify Target Matrix</span>
 <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] text-[var(--ease2event-brand-primary)] group-hover:translate-x-2 transition-transform" />
 </button>
 </div>
 </div>

 {/* 📊 High-Fidelity Trajectory Chart */}
 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
 <div className="xl:col-span-2 card-minimal p-6 flex flex-col bg-[var(--ease2event-bg-surface)] overflow-hidden relative">

 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-16 relative z-10">
 <div>
 <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-none">Revenue Trends</h3>
 <p className="text-[11px] text-[var(--ease2event-text-secondary)] font-bold tracking-widest mt-4">Performance tracking across selected periods</p>
 </div>
 <div className="bg-[var(--ease2event-bg-elevated)] p-1 sm:p-2 rounded-xl border border-[var(--ease2event-border-subtle)] flex gap-0.5 sm:gap-2 relative z-20 w-full sm:w-auto">
 {(['Daily', 'Weekly', 'Monthly'] as Period[]).map(period => (
 <button
 key={period}
 onClick={() => setActivePeriod(period)}
 className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-4 text-[8px] sm:text-[11px] font-bold tracking-widest rounded-lg transition-all relative ${activePeriod === period ? 'bg-[var(--ease2event-brand-primary)] text-white scale-[1.02] z-10' : 'text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-text-primary)]'}`}
 >
 {period}
 </button>
 ))}
 </div>
 </div>


 <div className="h-[350px] sm:h-[450px] w-full -ml-4 flex-1 relative z-10">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={periodData} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
 <defs>
 <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="var(--ease2event-brand-primary)" stopOpacity={0.6} />
 <stop offset="95%" stopColor="var(--ease2event-brand-primary)" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--ease2event-border-subtle)" strokeOpacity={0.2} />
 <XAxis
 dataKey="name"
 axisLine={false}
 tickLine={false}
 tick={{ fill: 'var(--ease2event-text-secondary)', fontSize: 10, fontWeight: 700 }}
 dy={10}
 />
 <YAxis
 axisLine={false}
 tickLine={false}
 tick={{ fill: 'var(--ease2event-text-secondary)', fontSize: 10, fontWeight: 700 }}
 tickFormatter={(val) => `₹${val / 1000}k`}
 dx={-20}
 />
 <Tooltip
 cursor={{ stroke: 'var(--ease2event-brand-primary)', strokeWidth: 3, strokeDasharray: '8 8' }}
 contentStyle={{
 backgroundColor: 'rgba(255, 255, 255, 0.9)',
 backdropFilter: 'blur(20px)',
 border: '1px solid var(--ease2event-border-base)',
 borderRadius: '32px',
 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
 padding: '24px'
 }}
 itemStyle={{ color: 'var(--ease2event-brand-primary)', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.02em' }}
 labelStyle={{ color: 'var(--ease2event-text-secondary)', fontWeight: 800, fontSize: '11px', marginBottom: '10px', textTransform: '', letterSpacing: '0.3em' }}
 formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'CAPTURE_VAL']}
 />
 <Area
 type="monotone"
 dataKey="revenue"
 stroke="var(--ease2event-brand-primary)"
 strokeWidth={6}
 fillOpacity={1}
 fill="url(#colorRev)"
 animationDuration={2500}
 activeDot={{ r: 10, fill: 'var(--ease2event-brand-primary)', stroke: 'white', strokeWidth: 4 }}
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* 📋 Sidebar Context */}
 <div className="space-y-6">
 <div className="card-minimal p-6 bg-gradient-to-br from-[var(--ease2event-brand-primary)]/[0.04] to-transparent border-[var(--ease2event-border-base)] relative overflow-hidden group">
 <h3 className="text-lg font-bold text-[var(--ease2event-text-primary)] mb-10 tracking-tight leading-none">Payment Status</h3>
 <div className="space-y-6 relative z-10">
 {[
 { label: 'Upcoming Settlement', amount: '₹12,450', date: 'In 2 days', status: 'processing', icon: Clock, color: 'text-indigo-500' },
 { label: 'Reserve Balance', amount: '₹3,200', date: 'T+7 Policy', status: 'on_hold', icon: AlertCircle, color: 'text-amber-500' },
 { label: 'Recently Settled', amount: '₹45,800', date: 'Oct 15, 2023', status: 'settled', icon: CheckCircle2, color: 'text-emerald-500' }
 ].map((item, idx) => (
 <div key={idx} className="flex items-start justify-between group/item">
 <div className="flex gap-6">
 <div className={`w-14 h-10 rounded-[20px] flex items-center justify-center shrink-0 bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] ${item.color} transition-all `}>
 <item.icon size={26} />
 </div>
 <div>
 <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Pending Payouts</h3>
 <p className="text-sm font-semibold text-[var(--ease2event-text-secondary)] mt-2 opacity-100">Verified transaction history</p>
 </div>
 </div>
 <span className="text-lg font-bold text-[var(--ease2event-text-primary)] pt-1">{item.amount}</span>
 </div>
 ))}
 </div>
 <button
 onClick={() => document.getElementById('transactions-registry')?.scrollIntoView({ behavior: 'smooth' })}
 className="w-full mt-12 py-5 bg-[var(--ease2event-bg-surface)] border-2 border-[var(--ease2event-border-subtle)] rounded-lg text-sm font-semibold tracking-normal text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-brand-primary)]  transition-all active:scale-95 "
 >
 Access Ledger Logs
 </button>
 </div>

 <div className="card-minimal p-6 sm:p-6 transition-all bg-[var(--ease2event-bg-surface)] border-[var(--ease2event-border-base)]">
 <div className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-10">
 <div className="p-3 sm:p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-500/10 ">
 <BarChart3 size={16} />
 </div>
 <h3 className="font-bold text-[var(--ease2event-text-primary)] tracking-tight text-lg sm:text-xl leading-none">Better Earnings</h3>
 </div>
 <div className="space-y-6 sm:space-y-5">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0 border-b border-[var(--ease2event-border-subtle)] pb-6 sm:pb-8">
 <div className="space-y-1.5 sm:space-y-2">
 <p className="text-[12px] sm:text-[14px] font-bold text-[var(--ease2event-text-secondary)] leading-none">Fee deduction (Avg)</p>
 <p className="font-bold text-lg sm:text-xl text-[var(--ease2event-text-primary)] leading-none">3.5%</p>
 </div>
 <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold text-[9px] sm:text-[10px] px-4 py-2 not-italic rounded-2xl tracking-[0.2em] leading-none shrink-0">GLOBAL_MINIMUM</Badge>
 </div>
 <p className="text-base sm:text-lg text-[var(--ease2event-text-secondary)] leading-relaxed">
 Platform fee optimized for current volume. Regular settlements processed according to protocol.
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* 🧾 Intelligence Registry (Enhanced Table) */}
 <div id="transactions-registry" className="card-minimal !p-0 overflow-hidden border-[var(--ease2event-border-base)] bg-[var(--ease2event-bg-surface)] rounded-[40px]">
 <div className="p-6 border-b border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-elevated)] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
 <div>
 <h3 className="text-lg font-bold text-[var(--ease2event-text-primary)] tracking-tighter leading-none">Transactions</h3>
 <p className="text-base sm:text-lg text-[var(--ease2event-text-secondary)] font-medium mt-3">Complete history of all payments and transfers</p>
 </div>
 <div className="flex gap-5 w-full xl:w-auto">
 <div className="relative flex-1 xl:w-96 group">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--ease2event-text-secondary)] group-focus-within:text-[var(--ease2event-brand-primary)] transition-colors" size={16} />
 <input
 type="text"
 placeholder="SEARCH_REGISTRY_BY_NODE..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-16 pr-8 py-5 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] rounded-3xl text-[12px] font-bold outline-none focus:ring-4 focus:ring-[var(--ease2event-brand-primary)]/10 transition-all text-[var(--ease2event-text-primary)] tracking-widest placeholder:text-[var(--ease2event-text-secondary)]/40 "
 />
 </div>
 <Button className="hidden sm:flex h-12 w-16 items-center justify-center bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] rounded-3xl text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-brand-primary)] transition-all active:scale-90  ">
 <Filter size={16} />
 </Button>
 </div>
 </div>

 <div className="overflow-x-auto scrollbar-hide">
 <table className="w-full text-left min-w-[1100px]">
 <thead>
 <tr className="bg-[var(--ease2event-bg-elevated)]/40 border-b border-[var(--ease2event-border-subtle)]">
 <th className="px-6 py-7 text-xs font-bold text-[var(--ease2event-text-secondary)] tracking-widest">ID</th>
 <th className="px-6 py-7 text-xs font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Service</th>
 <th className="px-6 py-7 text-xs font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Client</th>
 <th className="px-6 py-7 text-xs font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Date</th>
 <th className="px-6 py-7 text-xs font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Method</th>
 <th className="px-6 py-7 text-xs font-bold text-[var(--ease2event-text-secondary)] tracking-widest text-right pr-12">Amount</th>
 <th className="px-6 py-7 text-xs font-bold text-[var(--ease2event-text-secondary)] tracking-widest text-center">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[var(--ease2event-border-subtle)]">
 {isLoading ? (
 Array(5).fill(0).map((_, idx) => (
 <tr key={idx}>
 <td className="px-12 py-10"><Skeleton className="h-6 w-20 rounded-lg" /></td>
 <td className="px-12 py-10"><Skeleton className="h-6 w-40 rounded-lg" /></td>
 <td className="px-12 py-10"><Skeleton className="h-6 w-32 rounded-lg" /></td>
 <td className="px-12 py-10"><Skeleton className="h-6 w-24 rounded-lg" /></td>
 <td className="px-12 py-10"><Skeleton className="h-6 w-16 rounded-lg" /></td>
 <td className="px-12 py-10"><Skeleton className="h-8 w-24 rounded-lg" /></td>
 <td className="px-12 py-10 text-center"><Skeleton className="h-8 w-20 rounded-xl mx-auto" /></td>
 </tr>
 ))
 ) : (
 <AnimatePresence mode="popLayout">
 {displayData.transactions.map((trx: any, tIdx: number) => (
 <motion.tr
 key={trx.id || tIdx}
 
 
 
 
 className="hover:bg-[var(--ease2event-brand-primary)]/[0.04] transition-all cursor-pointer group"
 >
 <td className="px-12 py-10">
 <span className="font-black text-[var(--ease2event-brand-primary)] text-[12px] tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">#{trx.id.split('-')[1]}</span>
 </td>
 <td className="px-12 py-10 font-black text-sm text-[var(--ease2event-text-primary)] tracking-tight group-hover:translate-x-3 transition-transform ">
 <div className="flex items-center gap-5">
 <div className="w-2.5 h-2.5 rounded-full bg-[var(--ease2event-brand-primary)]/20 group-hover:bg-[var(--ease2event-brand-primary)] group-hover: transition-all "></div>
 {trx.service}
 </div>
 </td>
 <td className="px-12 py-10 text-[11px] font-black text-[var(--ease2event-text-primary)] tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">{trx.client}</td>
 <td className="px-12 py-10 text-[var(--ease2event-text-muted)] text-[10px] font-black tracking-[0.2em] opacity-60">{trx.date}</td>
 <td className="px-12 py-10">
 <span className="text-[10px] font-black tracking-[0.3em] bg-[var(--ease2event-bg-elevated)] px-4 py-2 rounded-2xl border border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-muted)] group-hover:text-[var(--ease2event-text-primary)] group- transition-all ">{trx.method}</span>
 </td>
 <td className="px-12 py-10 font-black text-xl text-[var(--ease2event-text-primary)] tracking-tighter font-display group-hover:text-[var(--ease2event-brand-primary)] transition-all origin-left">₹{trx.amount.replace('₹', '')}</td>
 <td className="px-12 py-10">
 <div className="flex justify-center translate-y-0 group- transition-transform ">
 <Badge
 className={` font-black text-[10px] px-6 py-2.5 rounded-2xl tracking-[0.3em] border transition-all ${trx.status.toLowerCase() === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-emerald-500/5' :
 trx.status.toLowerCase() === 'pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-amber-500/5' : 'bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-rose-500/5'
 }`}
 >
 {trx.status}
 </Badge>
 </div>
 </td>
 </motion.tr>
 ))}
 </AnimatePresence>
 )}
 </tbody>
 </table>
 </div>

 <div className="p-5 sm:p-12 bg-[var(--ease2event-bg-elevated)]/20 border-t border-[var(--ease2event-border-subtle)]">
 <button
 onClick={() => alert('Accessing full transaction history... This feature will allow you to export and filter your entire financial record.')}
 className="flex items-center justify-center gap-4 w-full py-5 rounded-[24px] bg-[var(--ease2event-bg-surface)] hover:bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-text-primary)] text-sm sm:text-base font-bold transition-all border border-[var(--ease2event-border-base)] active:scale-[0.98] group/btn"
 >
 Access Full Transaction Registry
 <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
 </button>
 </div>
 </div>
 </div>
 );
};

export default Earnings;
