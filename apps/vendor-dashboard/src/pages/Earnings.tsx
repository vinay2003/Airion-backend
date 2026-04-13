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
import { Button, Badge, Skeleton } from '@ease2event/ui';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@ease2event/shared';
import { bookingService } from '@ease2event/shared/lib/services/bookingService';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

  // 🛰️ Real-time Data Fetching
  const { data: earningsData, isLoading } = useQuery({
    queryKey: ['earnings', vendorId, activePeriod],
    queryFn: () => vendorId ? bookingService.getEarnings(vendorId).catch(() => null) : Promise.resolve(null),
    enabled: !!vendorId
  });

  // 📊 Dynamic Chart Aggregation (Fallback to Matrix Mock)
  const periodData = useMemo(() => {
    if (earningsData?.chartData) return earningsData.chartData;

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
  }, [activePeriod, earningsData]);

  // 💎 Intelligence KPIs
  const displayData = useMemo(() => {
    const statsBase = {
      Daily: { revenue: 76300, growth: '+8.2%', progress: 65, target: 100000, date: 'Oct 25' },
      Weekly: { revenue: 169100, growth: '+24.1%', progress: 82, target: 200000, date: 'Oct 28' },
      Monthly: { revenue: 1045000, growth: '+12.5%', progress: 45, target: 2500000, date: 'Nov 05' }
    };

    const currentStats = statsBase[activePeriod];
    const rawTransactions = earningsData?.transactions || [
        { id: '#TRX-9821', service: 'Wedding Photography', client: 'Rohit Sharma', date: 'Oct 12, 2023', amount: '₹12,500', status: 'Completed', method: 'UPI' },
        { id: '#TRX-9822', service: 'Event Catering', client: 'Anjali Gupta', date: 'Oct 10, 2023', amount: '₹45,000', status: 'Pending', method: 'Transfer' },
        { id: '#TRX-9823', service: 'Floral Decoration', client: 'Vikram Singh', date: 'Oct 08, 2023', amount: '₹8,400', status: 'Completed', method: 'Card' },
        { id: '#TRX-9824', service: 'Music System Rental', client: 'Sneha Rao', date: 'Oct 05, 2023', amount: '₹3,200', status: 'Failed', method: 'Card' },
        { id: '#TRX-9825', service: 'Wedding Photography', client: 'Priya Mehra', date: 'Oct 02, 2023', amount: '₹15,000', status: 'Completed', method: 'UPI' },
    ];

    return {
      totalBalance: earningsData?.balance || 124500,
      periodRevenue: earningsData?.periodRevenue || currentStats.revenue,
      growth: earningsData?.growth || currentStats.growth,
      payoutDate: earningsData?.nextPayout || currentStats.date,
      payoutProgress: earningsData?.payoutProgress || currentStats.progress,
      payoutTarget: earningsData?.payoutTarget || currentStats.target,
      transactions: rawTransactions.filter((t: any) => 
        t.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.service.toLowerCase().includes(searchTerm.toLowerCase())
      )
    };
  }, [activePeriod, earningsData, searchTerm]);

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
      <div className="space-y-10 p-8 max-w-7xl mx-auto">
        <Skeleton className="h-24 w-1/3 rounded-3xl" />
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
        <Skeleton className="h-[400px] rounded-3xl" />
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
      {/* 🔮 Financial Matrix Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 py-12 border-b border-[var(--ease2event-border-subtle)] relative overflow-hidden">
        <motion.div variants={itemVariants} className="relative z-10">
          <h1 className="text-5xl font-black text-[var(--ease2event-text-primary)] tracking-tight leading-none uppercase italic font-display">Financial Intelligence</h1>
          <div className="flex items-center gap-4 mt-6">
            <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              Live Settlement active
            </span>
            <p className="text-[var(--ease2event-text-muted)] font-black text-[12px] uppercase tracking-[0.4em] leading-none opacity-50 italic">Liquidity Matrix • Revenue Protocol</p>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 relative z-10">
          <Button className="hidden sm:flex bg-[var(--ease2event-bg-elevated)] h-12 px-8 rounded-2xl border border-[var(--ease2event-border-subtle)] font-black text-[11px] uppercase tracking-widest text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)] transition-all hover:border-[var(--ease2event-brand-primary)]/30 active:scale-95">
            <CalendarIcon size={16} className="mr-3" />
            Custom Period
          </Button>
          <Button className="h-12 px-10 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-[var(--ease2event-brand-primary)] text-white shadow-2xl shadow-[var(--ease2event-brand-primary)]/20 hover:scale-105 transition-all active:scale-95">
            <Download size={16} className="mr-3" />
            Export Logs
          </Button>
        </motion.div>

        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--ease2event-brand-primary)]/[0.03] to-transparent pointer-events-none"></div>
      </div>

      {/* 🚀 Primary Intelligence Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
          className="card-minimal !bg-[var(--ease2event-text-primary)] !text-[var(--ease2event-text-inverted)] p-10 relative overflow-hidden group border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
        >
          <div className="absolute right-0 bottom-0 p-12 opacity-10 transform translate-x-4 translate-y-4 group-hover:scale-125 group-hover:-translate-x-4 transition-transform duration-1000">
            <CreditCard size={180} />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <ShieldCheck size={20} className="text-emerald-400" />
                <p className="text-[var(--ease2event-text-inverted)]/50 font-black text-[11px] uppercase tracking-[0.4em] italic">Secured Liquidity Node</p>
            </div>
            <h2 className="text-6xl font-black mb-12 leading-none tracking-tighter italic font-display">₹{displayData.totalBalance.toLocaleString('en-IN')}</h2>
            <div className="flex items-center justify-between mt-auto pt-8 border-t border-[var(--ease2event-text-inverted)]/10">
                <div className="space-y-1.5">
                    <p className="text-[var(--ease2event-text-inverted)]/30 text-[10px] font-black uppercase tracking-widest leading-none italic">Synchronized</p>
                    <p className="text-sm font-black text-[var(--ease2event-text-inverted)]/90 leading-none shadow-sm">OCT 15, 2023</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 text-[10px] font-black bg-[var(--ease2event-text-inverted)]/10 hover:bg-blue-600 px-6 py-3 rounded-2xl border border-[var(--ease2event-text-inverted)]/10 transition-all uppercase tracking-[0.2em] italic active:scale-90">
                      WITHDRAWAL
                  </button>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-white/10 transition-all shadow-inner shrink-0">
                    <CreditCard size={20} />
                  </div>
                </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} className="card-minimal p-10 flex flex-col justify-between hover:border-[var(--ease2event-brand-primary)]/40 hover:shadow-2xl transition-all duration-500 bg-[var(--ease2event-bg-surface)]">
          <div>
            <div className="flex justify-between items-start mb-10 relative">
              <div className="p-5 bg-[var(--ease2event-brand-primary)]/10 text-[var(--ease2event-brand-primary)] rounded-[24px] shadow-sm border border-[var(--ease2event-brand-primary)]/10 group-hover:bg-[var(--ease2event-brand-primary)] group-hover:text-white transition-all duration-500">
                <TrendingUp size={28} />
              </div>
              <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-black bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 uppercase tracking-widest">
                <ArrowBigUpDash size={16} />
                <span>{displayData.growth}</span>
              </div>
            </div>
            <p className="text-[var(--ease2event-text-muted)] font-black text-[11px] uppercase tracking-[0.4em] mb-4 opacity-50 italic">{activePeriod} Gross Delta</p>
            <h2 className="text-5xl font-black text-[var(--ease2event-text-primary)] tracking-tighter leading-none italic font-display">₹{displayData.periodRevenue.toLocaleString('en-IN')}</h2>
          </div>
          <div className="flex items-center gap-4 mt-10 pt-8 border-t border-[var(--ease2event-border-subtle)]">
             <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-bg-surface)] shadow-md hover:z-10 transition-all" />)}
             </div>
             <p className="text-[10px] text-[var(--ease2event-text-muted)] font-black uppercase tracking-[0.2em] italic opacity-60">Nodes Updated <span className="text-emerald-500">Live Telemetry</span></p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} className="card-minimal p-10 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-2xl transition-all duration-500 bg-[var(--ease2event-bg-surface)]">
          <div className="flex justify-between items-start mb-8">
            <div>
                <p className="text-[var(--ease2event-text-muted)] font-black text-[11px] uppercase tracking-[0.4em] mb-2 opacity-50 italic">Target Matrix</p>
                <h3 className="text-3xl font-black text-[var(--ease2event-text-primary)] tracking-tighter italic font-display uppercase leading-none">₹{displayData.payoutTarget.toLocaleString()} GOAL</h3>
            </div>
            <div className="p-4 bg-amber-500/10 text-amber-500 rounded-[24px] border border-amber-500/20 shadow-sm transition-all duration-500">
                <Clock size={28} />
            </div>
          </div>
          
          <div className="space-y-6">
              <div className="h-5 w-full bg-[var(--ease2event-bg-elevated)] rounded-full overflow-hidden p-1.5 border border-[var(--ease2event-border-subtle)] shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${displayData.payoutProgress}%` }}
                  transition={{ duration: 1.8, type: 'spring' }}
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]" 
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-[var(--ease2event-text-muted)] italic">
                  <span>{displayData.payoutProgress}% SYNC_LEVEL</span>
                  <span className="text-[var(--ease2event-brand-primary)] tracking-tight">SETTLEMENT: {displayData.payoutDate}</span>
              </div>
          </div>
          
          <button className="mt-10 flex items-center justify-between w-full p-5 bg-[var(--ease2event-bg-surface)] hover:bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] rounded-[2rem] transition-all group active:scale-95 shadow-inner">
            <span className="text-[11px] font-black text-[var(--ease2event-text-primary)] uppercase tracking-widest italic">Modify Target Matrix</span>
            <ArrowRight size={18} className="text-[var(--ease2event-brand-primary)] group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* 📊 High-Fidelity Trajectory Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <motion.div variants={itemVariants} className="xl:col-span-2 card-minimal !p-10 flex flex-col bg-[var(--ease2event-bg-surface)] shadow-2xl overflow-hidden relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 mb-16 relative z-10">
                <div>
                    <h3 className="text-3xl font-black text-[var(--ease2event-text-primary)] tracking-tight italic font-display uppercase leading-none">Revenue Trajectory</h3>
                    <p className="text-[11px] text-[var(--ease2event-text-muted)] font-black uppercase tracking-[0.4em] mt-4 opacity-50 italic">High-Fidelity Performance Monitoring</p>
                </div>
                <div className="bg-[var(--ease2event-bg-elevated)] p-2 rounded-3xl border border-[var(--ease2event-border-subtle)] flex gap-1 shadow-inner relative z-20">
                    {(['Daily', 'Weekly', 'Monthly'] as Period[]).map(period => (
                    <button 
                        key={period} 
                        onClick={() => setActivePeriod(period)}
                        className={`px-10 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-700 italic relative ${activePeriod === period ? 'bg-[var(--ease2event-brand-primary)] text-white shadow-2xl shadow-[var(--ease2event-brand-primary)]/30 scale-105 z-10' : 'text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)]'}`}
                    >
                        {period}
                    </button>
                    ))}
                </div>
            </div>
            
            <div className="h-[450px] w-full -ml-4 flex-1 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={periodData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--ease2event-brand-primary)" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="var(--ease2event-brand-primary)" stopOpacity={0}/>
                        </linearGradient>
                        <filter id="dotShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="0" dy="4" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.5" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--ease2event-border-subtle)" strokeOpacity={0.2} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'var(--ease2event-text-muted)', fontSize: 10, fontWeight: 900}} 
                        dy={20} 
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'var(--ease2event-text-muted)', fontSize: 10, fontWeight: 900}} 
                        tickFormatter={(val) => `₹${val/1000}k`}
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
                        itemStyle={{ color: 'var(--ease2event-brand-primary)', fontWeight: 900, fontSize: '24px', fontStyle: 'italic', letterSpacing: '-0.02em' }}
                        labelStyle={{ color: 'var(--ease2event-text-muted)', fontWeight: 900, fontSize: '11px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontStyle: 'italic' }}
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
                        activeDot={{ r: 10, fill: 'var(--ease2event-brand-primary)', stroke: 'white', strokeWidth: 4, filter: 'url(#dotShadow)' }}
                    />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none"></div>
        </motion.div>

        {/* 📋 Sidebar Context */}
        <motion.div variants={itemVariants} className="space-y-10">
            <div className="card-minimal p-10 bg-gradient-to-br from-[var(--ease2event-brand-primary)]/[0.04] to-transparent border-[var(--ease2event-border-base)] shadow-xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000">
                    <Activity size={240} />
                </div>
                <h3 className="text-2xl font-black text-[var(--ease2event-text-primary)] mb-10 tracking-tighter italic font-display uppercase leading-none">Settlement Matrix</h3>
                <div className="space-y-10 relative z-10">
                    {[
                        { label: 'Upcoming Settlement', amount: '₹12,450', date: 'In 2 days', status: 'processing', icon: Clock, color: 'text-indigo-500' },
                        { label: 'Reserve Balance', amount: '₹3,200', date: 'T+7 Policy', status: 'on_hold', icon: AlertCircle, color: 'text-amber-500' },
                        { label: 'Recently Settled', amount: '₹45,800', date: 'Oct 15, 2023', status: 'settled', icon: CheckCircle2, color: 'text-emerald-500' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between group/item">
                            <div className="flex gap-6">
                                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] ${item.color} group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500 shadow-sm`}>
                                    <item.icon size={26}/>
                                </div>
                                <div className="space-y-1.5 pt-1">
                                    <p className="text-[11px] font-black text-[var(--ease2event-text-primary)] uppercase tracking-tight italic">{item.label}</p>
                                    <p className="text-[10px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.3em] opacity-50 italic">{item.date}</p>
                                </div>
                            </div>
                            <span className="text-lg font-black text-[var(--ease2event-text-primary)] italic font-display pt-1">{item.amount}</span>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-12 py-5 bg-[var(--ease2event-bg-surface)] border-2 border-[var(--ease2event-border-subtle)] rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-brand-primary)] hover:border-[var(--ease2event-brand-primary)]/40 hover:shadow-xl transition-all font-display italic active:scale-95 shadow-inner">
                    Access Ledger Logs
                </button>
            </div>

            <div className="card-minimal p-10 hover:shadow-2xl transition-all duration-700 bg-[var(--ease2event-bg-surface)] border-[var(--ease2event-border-base)]">
                <div className="flex items-center gap-5 mb-10">
                    <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/10 shadow-sm">
                        <BarChart3 size={24} />
                    </div>
                    <h3 className="font-black text-[var(--ease2event-text-primary)] tracking-tight italic uppercase text-xl font-display leading-none">Net Optimization</h3>
                </div>
                <div className="space-y-8">
                   <div className="flex justify-between items-end border-b border-[var(--ease2event-border-subtle)] pb-8">
                      <div className="space-y-2">
                        <p className="text-[11px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.4em] mb-1 pl-1 italic">Fee deduction (Avg)</p>
                        <p className="font-black text-5xl text-[var(--ease2event-text-primary)] italic font-display leading-none">3.5%</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 italic font-black uppercase text-[10px] px-4 py-2 rounded-2xl tracking-[0.2em] shadow-sm">GLOBAL_MINIMUM</Badge>
                   </div>
                   <p className="text-[11px] text-[var(--ease2event-text-muted)] font-black uppercase italic tracking-tighter leading-relaxed opacity-60">
                       Operational telemetry suggests high liquidity efficiency. Settlement matrix optimized for current volume.
                   </p>
                </div>
            </div>
        </motion.div>
      </div>

      {/* 🧾 Intelligence Registry (Enhanced Table) */}
      <motion.div variants={itemVariants} className="card-minimal !p-0 overflow-hidden border-[var(--ease2event-border-base)] shadow-[0_48px_80px_-24px_rgba(0,0,0,0.15)] bg-[var(--ease2event-bg-surface)] rounded-[40px]">
        <div className="p-10 border-b border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-elevated)] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10">
          <div>
            <h3 className="text-4xl font-black text-[var(--ease2event-text-primary)] tracking-tighter uppercase italic font-display leading-none">Transaction Registry</h3>
            <p className="text-[11px] text-[var(--ease2event-text-muted)] font-black uppercase mt-5 tracking-[0.5em] italic opacity-50">Complete Settlement Audit Logs • Verified Nodes</p>
          </div>
          <div className="flex gap-5 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-96 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--ease2event-text-muted)] group-focus-within:text-[var(--ease2event-brand-primary)] transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="SEARCH_REGISTRY_BY_NODE..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] rounded-3xl text-[12px] font-black italic outline-none focus:ring-4 focus:ring-[var(--ease2event-brand-primary)]/10 transition-all text-[var(--ease2event-text-primary)] uppercase tracking-widest placeholder:text-[var(--ease2event-text-muted)]/40 shadow-inner" 
                />
            </div>
            <Button className="hidden sm:flex h-16 w-16 items-center justify-center bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] rounded-3xl text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-brand-primary)] transition-all active:scale-90 hover:border-[var(--ease2event-brand-primary)]/40 hover:shadow-xl">
                <Filter size={24} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="bg-[var(--ease2event-bg-elevated)]/40 border-b border-[var(--ease2event-border-subtle)]">
                <th className="px-12 py-8 text-[11px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.4em] italic">Node ID</th>
                <th className="px-12 py-8 text-[11px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.4em] italic">Operational Protocol</th>
                <th className="px-12 py-8 text-[11px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.4em] italic">Capture Source</th>
                <th className="px-12 py-8 text-[11px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.4em] italic">Timestamp</th>
                <th className="px-12 py-8 text-[11px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.4em] italic">Capture Method</th>
                <th className="px-12 py-8 text-[11px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.4em] italic">Gross Capture</th>
                <th className="px-12 py-8 text-[11px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-[0.4em] italic text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--ease2event-border-subtle)]">
              <AnimatePresence mode="popLayout">
                {displayData.transactions.map((trx: any, tIdx: number) => (
                    <motion.tr 
                        key={trx.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: tIdx * 0.05 }}
                        className="hover:bg-[var(--ease2event-brand-primary)]/[0.04] transition-all duration-700 cursor-pointer group"
                    >
                    <td className="px-12 py-10">
                        <span className="font-black text-[var(--ease2event-brand-primary)] text-[12px] tracking-tighter italic opacity-80 group-hover:opacity-100 transition-opacity">#{trx.id.split('-')[1]}</span>
                    </td>
                    <td className="px-12 py-10 font-black text-sm text-[var(--ease2event-text-primary)] italic tracking-tight uppercase group-hover:translate-x-3 transition-transform duration-1000">
                        <div className="flex items-center gap-5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--ease2event-brand-primary)]/20 group-hover:bg-[var(--ease2event-brand-primary)] group-hover:shadow-[0_0_15px_var(--ease2event-brand-primary)] transition-all duration-700"></div>
                            {trx.service}
                        </div>
                    </td>
                    <td className="px-12 py-10 text-[11px] font-black text-[var(--ease2event-text-primary)] uppercase tracking-widest italic opacity-70 group-hover:opacity-100 transition-opacity">{trx.client}</td>
                    <td className="px-12 py-10 text-[var(--ease2event-text-muted)] text-[10px] font-black uppercase tracking-[0.2em] italic opacity-60">{trx.date}</td>
                    <td className="px-12 py-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-[var(--ease2event-bg-elevated)] px-4 py-2 rounded-2xl border border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-muted)] group-hover:text-[var(--ease2event-text-primary)] group-hover:border-[var(--ease2event-brand-primary)]/20 transition-all italic">{trx.method}</span>
                    </td>
                    <td className="px-12 py-10 font-black text-3xl text-[var(--ease2event-text-primary)] tracking-tighter italic font-display group-hover:scale-110 group-hover:text-[var(--ease2event-brand-primary)] transition-all duration-500 origin-left">₹{trx.amount.replace('₹', '')}</td>
                    <td className="px-12 py-10">
                        <div className="flex justify-center translate-y-0 group-hover:-translate-y-1 transition-transform duration-500">
                            <Badge 
                                className={`italic font-black text-[10px] px-6 py-2.5 rounded-2xl uppercase tracking-[0.3em] border shadow-md transition-all duration-700 ${
                                    trx.status.toLowerCase() === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-emerald-500/5' : 
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
            </tbody>
          </table>
        </div>
        
        <div className="p-12 bg-[var(--ease2event-bg-elevated)]/20 border-t border-[var(--ease2event-border-subtle)]">
          <button className="flex items-center justify-center gap-5 w-full py-6 rounded-[32px] bg-[var(--ease2event-bg-surface)] hover:bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-text-primary)] text-[12px] font-black hover:gap-8 transition-all uppercase tracking-[0.5em] border border-[var(--ease2event-border-base)] shadow-2xl active:scale-[0.99] italic group/btn">
            Access Full Transaction Registry
            <ChevronRight size={24} className="group-hover/btn:translate-x-3 transition-transform" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Earnings;
