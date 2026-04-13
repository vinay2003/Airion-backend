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
  Activity,
  Search
} from 'lucide-react';
import { Button, Badge } from '@airion/ui';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@airion/shared';
import { bookingService } from '@airion/shared/lib/services/bookingService';
import { useQuery } from '@tanstack/react-query';

type Period = 'Daily' | 'Weekly' | 'Monthly';

/**
 * 💰 Financial Intelligence Hub
 * Modernized with theme-aware tokens and high-legibility typography.
 */
const Earnings: React.FC = () => {
  const { user } = useAuth();
  const vendorId = user?.vendor?.id || user?.id || '';
  const [activePeriod, setActivePeriod] = useState<Period>('Monthly');

  const { data: earningsData, isLoading } = useQuery({
    queryKey: ['earnings', vendorId, activePeriod],
    queryFn: () => vendorId ? bookingService.getEarnings(vendorId).catch(() => null) : Promise.resolve(null),
    enabled: !!vendorId
  });

  // Mock data for different timeframes
  const periodData = useMemo(() => {
    const dailyStats = [
      { name: '08:00', revenue: 2500, orders: 1 },
      { name: '10:00', revenue: 4200, orders: 2 },
      { name: '12:00', revenue: 15600, orders: 5 },
      { name: '14:00', revenue: 8900, orders: 3 },
      { name: '16:00', revenue: 12400, orders: 4 },
      { name: '18:00', revenue: 18500, orders: 6 },
      { name: '20:00', revenue: 14200, orders: 4 },
    ];

    const weeklyStats = [
      { name: 'Mon', revenue: 12500, orders: 8 },
      { name: 'Tue', revenue: 15200, orders: 10 },
      { name: 'Wed', revenue: 14800, orders: 9 },
      { name: 'Thu', revenue: 21100, orders: 14 },
      { name: 'Fri', revenue: 35500, orders: 22 },
      { name: 'Sat', revenue: 42000, orders: 28 },
      { name: 'Sun', revenue: 28000, orders: 18 },
    ];

    const monthlyStats = [
      { name: 'Jan', revenue: 145000 },
      { name: 'Feb', revenue: 152000 },
      { name: 'Mar', revenue: 148000 },
      { name: 'Apr', revenue: 161000 },
      { name: 'May', revenue: 155000 },
      { name: 'Jun', revenue: 167000 },
      { name: 'Jul', revenue: 172000 },
    ];

    switch (activePeriod) {
      case 'Daily': return dailyStats;
      case 'Weekly': return weeklyStats;
      case 'Monthly': return monthlyStats;
      default: return monthlyStats;
    }
  }, [activePeriod]);

  const displayData = useMemo(() => {
    const stats = {
      Daily: {
        revenue: 76300,
        growth: '+8.2%',
        impressions: '1,240',
        payoutDate: 'Oct 25',
        progress: 65,
        target: 100000
      },
      Weekly: {
        revenue: 169100,
        growth: '+24.1%',
        impressions: '8,420',
        payoutDate: 'Oct 28',
        progress: 82,
        target: 200000
      },
      Monthly: {
        revenue: 1045000,
        growth: '+12.5%',
        impressions: '34,280',
        payoutDate: 'Nov 05',
        progress: 45,
        target: 2500000
      }
    };

    const currentStats = stats[activePeriod];

    return {
      totalBalance: 124500,
      periodRevenue: currentStats.revenue,
      growth: currentStats.growth,
      impressions: currentStats.impressions,
      payoutDate: currentStats.payoutDate,
      payoutProgress: currentStats.progress,
      payoutTarget: currentStats.target,
      recentTransactions: [
        { id: '#TRX-9821', service: 'Wedding Photography', client: 'Rohit Sharma', date: 'Oct 12, 2023', amount: '₹12,500', status: 'Completed', method: 'UPI' },
        { id: '#TRX-9822', service: 'Event Catering', client: 'Anjali Gupta', date: 'Oct 10, 2023', amount: '₹45,000', status: 'Pending', method: 'Bank Transfer' },
        { id: '#TRX-9823', service: 'Floral Decoration', client: 'Vikram Singh', date: 'Oct 08, 2023', amount: '₹8,400', status: 'Completed', method: 'Credit Card' },
        { id: '#TRX-9824', service: 'Music System Rental', client: 'Sneha Rao', date: 'Oct 05, 2023', amount: '₹3,200', status: 'Failed', method: 'Debit Card' },
        { id: '#TRX-9825', service: 'Wedding Photography', client: 'Priya Mehra', date: 'Oct 02, 2023', amount: '₹15,000', status: 'Completed', method: 'UPI' },
      ]
    };
  }, [activePeriod]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-[var(--airion-border-subtle)] padding-bottom-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[var(--airion-text-primary)] tracking-tight leading-tight uppercase">Financial Intelligence</h1>
          <p className="text-lg font-bold text-[var(--airion-text-muted)] flex items-center gap-3">
            <Activity size={20} className="text-blue-500" />
            Revenue Streams • Settlement Matrix • Tax Compliance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <Button variant="secondary" className="hidden sm:flex h-14 px-8 rounded-2xl font-bold text-sm uppercase tracking-widest border-[var(--airion-border-subtle)]" leftIcon={<CalendarIcon size={18} />}>
            Custom Matrix
          </Button>
          <Button variant="primary" leftIcon={<Download size={18} />} className="h-14 px-10 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl">
            Export Logs
          </Button>
        </div>
      </div>

      {/* Smart Intelligence Banner */}
      <div className="bg-[var(--airion-bg-surface)] border border-blue-500/20 rounded-[2.5rem] p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex justify-center items-center text-white shadow-xl">
            <Zap size={36} fill="white" />
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-[var(--airion-text-primary)] text-2xl tracking-tight uppercase">Payout Optimization Active</h3>
            <p className="text-base text-[var(--airion-text-muted)] font-bold uppercase tracking-tight">Switch to <span className="text-blue-500 italic">Instant Payouts</span> to receive funds in under 30 minutes.</p>
          </div>
        </div>
        <Button className="h-16 px-10 btn-secondary border-[var(--airion-border-subtle)] text-sm font-bold uppercase tracking-widest rounded-3xl relative z-10">
          Enable Fast Pass
        </Button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="card-minimal !bg-slate-900 text-white p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] relative overflow-hidden group border-none shadow-2xl">
          {/* Background Gradient Texture (Replacing the colliding icon) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 space-y-8 sm:space-y-10 flex flex-col h-full">
            <div className="flex items-center gap-3 sm:gap-4">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <p className="text-white/60 font-black text-sm uppercase tracking-widest">Secured Liquidity Node</p>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black leading-none tracking-tighter italic break-all">₹{Number(displayData.totalBalance).toLocaleString('en-IN')}</h2>

            <div className="flex flex-col gap-8 mt-auto pt-8 border-t border-white/10">
              <div className="flex flex-row items-center gap-6">
                <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] shrink-0">Last Network Sync</p>
                <div className="h-4 w-px bg-white/10 hidden sm:block" />
                <p className="text-sm sm:text-base font-black text-white/90 whitespace-normal break-words uppercase tracking-widest">OCT 15, 2026 • <span className="text-emerald-500">LIVE</span></p>
              </div>

              <div className="flex items-center gap-4">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 text-xs font-black bg-white/10 hover:bg-blue-600 px-10 py-4 rounded-2xl border border-white/10 transition-all uppercase tracking-[0.2em] shadow-lg italic whitespace-nowrap">
                  Withdrawal Matrix
                </button>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-white/10 transition-all shadow-inner shrink-0">
                  <CreditCard size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-minimal !p-12 rounded-[3.5rem] flex flex-col justify-between shadow-xl border-[var(--airion-border-base)]">
          <div className="space-y-10">
            <div className="flex justify-between items-start">
              <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center border border-blue-500/20 shadow-lg">
                <TrendingUp size={36} />
              </div>
              <div className="flex items-center gap-3 text-emerald-500 text-sm font-black bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20 shadow-md uppercase tracking-widest">
                <ArrowUpRight size={18} />
                <span>{displayData.growth}</span>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[var(--airion-text-muted)] font-black text-sm uppercase tracking-[0.3em] pl-1">{activePeriod} Gross Delta</p>
              <h2 className="text-5xl font-black text-[var(--airion-text-primary)] tracking-tighter leading-none italic">₹{Number(displayData.periodRevenue).toLocaleString('en-IN')}</h2>
            </div>
          </div>
          <div className="flex items-center gap-5 mt-12 pt-8 border-t border-[var(--airion-border-subtle)]">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-[var(--airion-bg-elevated)] border-2 border-[var(--airion-bg-surface)] shadow-lg" />)}
            </div>
            <p className="text-sm text-[var(--airion-text-muted)] font-bold uppercase tracking-widest">Nodes Updated <span className="text-emerald-500 italic">Live</span></p>
          </div>
        </div>

        <div className="card-minimal !p-12 rounded-[3.5rem] flex flex-col justify-between md:col-span-2 lg:col-span-1 shadow-xl border-[var(--airion-border-base)]">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-[var(--airion-text-muted)] font-black text-sm uppercase tracking-[0.3em]">Target Matrix</p>
              <h3 className="text-3xl font-black text-[var(--airion-text-primary)] tracking-tight uppercase italic">₹{displayData.payoutTarget.toLocaleString()} Goal</h3>
            </div>
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center border border-amber-500/20 shadow-md">
              <Clock size={32} />
            </div>
          </div>

          <div className="space-y-6 mt-8">
            <div className="h-6 w-full bg-[var(--airion-bg-elevated)] rounded-full overflow-hidden p-1.5 border border-[var(--airion-border-subtle)] shadow-inner">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.5)]" style={{ width: `${displayData.payoutProgress}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-sm font-black uppercase tracking-[0.25em] text-[var(--airion-text-muted)]">
              <span className="text-[var(--airion-text-primary)] italic">{displayData.payoutProgress}% Efficiency</span>
              <span className="text-blue-500">Settlement Cycle: {displayData.payoutDate}</span>
            </div>
          </div>

          <button className="mt-10 flex items-center justify-between w-full p-8 bg-[var(--airion-bg-surface)] hover:bg-[var(--airion-bg-elevated)] border-2 border-[var(--airion-border-subtle)] rounded-[2rem] transition-all group shadow-inner">
            <span className="text-sm font-black text-[var(--airion-text-primary)] uppercase tracking-widest">Adjust Operational Target</span>
            <ArrowRight size={20} className="text-blue-500 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Main Revenue Chart Section */}
        <div className="xl:col-span-2 card-minimal !p-12 rounded-[3.5rem] flex flex-col shadow-2xl border-[var(--airion-border-base)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 mb-16">
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-[var(--airion-text-primary)] tracking-tight uppercase italic">Revenue Trajectory</h3>
              <p className="text-base text-[var(--airion-text-muted)] font-bold uppercase tracking-tight opacity-80">Detailed performance tracking for {activePeriod.toLowerCase()} timeframe</p>
            </div>
            <div className="bg-[var(--airion-bg-elevated)] p-1.5 md:p-2 rounded-2xl border border-[var(--airion-border-subtle)] flex gap-1.5 md:gap-2 w-full sm:w-auto shadow-inner overflow-hidden">
              {(['Daily', 'Weekly', 'Monthly'] as Period[]).map(period => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  className={`flex-1 sm:flex-none px-4 md:px-8 py-2.5 md:py-3.5 text-xs font-black uppercase tracking-[0.15em] md:tracking-widest rounded-xl transition-all duration-300 ${activePeriod === period ? 'bg-[var(--airion-brand-primary)] text-white shadow-xl shadow-blue-500/20' : 'text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)]'}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[500px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={periodData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--airion-border-subtle)" strokeOpacity={0.4} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--airion-text-muted)', fontSize: 13, fontWeight: 700 }}
                  dy={20}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--airion-text-muted)', fontSize: 13, fontWeight: 700 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  dx={-15}
                />
                <Tooltip
                  cursor={{ stroke: '#2563eb', strokeWidth: 3, strokeDasharray: '4 4' }}
                  contentStyle={{
                    backgroundColor: 'var(--airion-bg-surface)',
                    border: '1px solid var(--airion-border-subtle)',
                    borderRadius: '24px',
                    boxShadow: 'var(--airion-shadow-xl)',
                    padding: '24px'
                  }}
                  itemStyle={{ color: 'var(--airion-brand-primary)', fontWeight: 900, fontSize: '24px', fontStyle: 'italic' }}
                  labelStyle={{ color: 'var(--airion-text-muted)', fontWeight: 800, fontSize: '12px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Income']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={6}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Context */}
        <div className="space-y-10">
          <div className="card-minimal !p-12 rounded-[3rem] bg-gradient-to-br from-blue-500/5 to-transparent border-[var(--airion-border-base)] shadow-2xl">
            <h3 className="text-2xl font-black text-[var(--airion-text-primary)] mb-10 tracking-tight uppercase italic">Payout Schedule</h3>
            <div className="space-y-10">
              {[
                { label: 'Upcoming Settlement', amount: '₹12,450', date: 'In 2 days', status: 'processing' },
                { label: 'Reserve Balance', amount: '₹3,200', date: 'T+7 Policy', status: 'on_hold' },
                { label: 'Recently Settled', amount: '₹45,800', date: 'OCT 15, 2026', status: 'settled' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start justify-between group">
                  <div className="flex gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 transition-transform group-hover:scale-110 ${item.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : item.status === 'on_hold' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                      {item.status === 'processing' ? <Clock size={28} /> : item.status === 'on_hold' ? <AlertCircle size={28} /> : <CheckCircle2 size={28} />}
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-black text-[var(--airion-text-primary)] uppercase tracking-tight leading-none">{item.label}</p>
                      <p className="text-xs font-black text-[var(--airion-text-muted)] uppercase tracking-widest">{item.date}</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-[var(--airion-text-primary)] italic">{item.amount}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-12 py-5 bg-[var(--airion-bg-surface)] border-2 border-[var(--airion-border-subtle)] rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] text-[var(--airion-text-muted)] hover:text-blue-500 hover:border-blue-500/40 hover:shadow-xl transition-all shadow-inner">
              View Withdrawal Logs
            </button>
          </div>

          <div className="card-minimal !p-12 rounded-[3rem] shadow-2xl border-[var(--airion-border-base)] space-y-10">
            <div className="flex items-center gap-5 border-b border-[var(--airion-border-subtle)] padding-bottom-8">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-md">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold text-[var(--airion-text-primary)] uppercase tracking-wider">Profitability Insights</h3>
            </div>
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b border-[var(--airion-border-subtle)] pb-8">
                <div className="space-y-2">
                  <p className="text-xs font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em] mb-1 pl-1">Fee deduction (Avg)</p>
                  <p className="font-black text-5xl text-[var(--airion-text-primary)] tracking-tighter italic leading-none">3.5%</p>
                </div>
                <Badge className="chip-soft-green h-9 px-6 rounded-xl text-xs uppercase font-black tracking-widest border border-emerald-500/20">Industry Low</Badge>
              </div>
              <p className="text-sm text-[var(--airion-text-muted)] font-black uppercase leading-relaxed tracking-tight opacity-90 italic">
                * Your tax-ready report is now generated for the last quarter. Ensure all bank details are up to date before Nov 1st.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="card-minimal !p-0 overflow-hidden border-2 border-[var(--airion-border-base)] rounded-[3.5rem] shadow-2xl bg-[var(--airion-bg-surface)]">
        <div className="p-10 sm:p-14 border-b border-[var(--airion-border-subtle)] bg-[var(--airion-bg-elevated)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="space-y-4">
            <h3 className="text-4xl font-extrabold text-[var(--airion-text-primary)] tracking-tight uppercase italic leading-none">Detailed Transactions</h3>
            <p className="text-lg font-bold text-[var(--airion-text-muted)] uppercase tracking-tight opacity-80">Audit log of all incoming and outgoing capital flows</p>
          </div>
          <div className="flex gap-5 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--airion-text-muted)] group-focus-within:text-blue-500 transition-colors" size={24} />
              <input type="text" placeholder="Filter by ID or Client..." className="w-full h-16 pl-16 pr-8 bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] rounded-[1.25rem] text-sm font-bold uppercase outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-[var(--airion-text-primary)] placeholder-[var(--airion-text-muted)]" />
            </div>
            <Button variant="secondary" size="lg" className="h-16 shrink-0 px-10 rounded-2xl border-[var(--airion-border-subtle)] font-bold text-sm uppercase tracking-widest bg-[var(--airion-bg-surface)]">
              Advanced Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[1200px]">
            <thead>
              <tr className="bg-[var(--airion-bg-elevated)]/50 border-b border-[var(--airion-border-subtle)]">
                <th className="px-12 py-8 text-base font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Transaction ID</th>
                <th className="px-12 py-8 text-base font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Logic / Module</th>
                <th className="px-12 py-8 text-base font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Agent</th>
                <th className="px-12 py-8 text-base font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-12 py-8 text-base font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Method</th>
                <th className="px-12 py-8 text-base font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Value</th>
                <th className="px-12 py-8 text-base font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em] text-center">Protocol Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--airion-border-subtle)]">
              {displayData.recentTransactions.map((trx: any) => (
                <tr key={trx.id} className="hover:bg-[var(--airion-bg-elevated)] transition-all duration-300 cursor-pointer group">
                  <td className="px-12 py-10">
                    <span className="font-extrabold text-blue-500 text-base tracking-widest uppercase">{trx.id}</span>
                  </td>
                  <td className="px-12 py-10 font-black text-lg group-hover:translate-x-2 transition-transform duration-500 text-[var(--airion-text-primary)] uppercase italic leading-none">
                    <div className="flex items-center gap-5">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 group-hover:bg-blue-600 transition-all duration-300 shadow-lg"></div>
                      {trx.service}
                    </div>
                  </td>
                  <td className="px-12 py-10 font-bold text-[var(--airion-text-secondary)] uppercase tracking-tight">{trx.client}</td>
                  <td className="px-12 py-10 text-[var(--airion-text-muted)] text-sm font-black uppercase tracking-[0.2em]">{trx.date}</td>
                  <td className="px-12 py-10">
                    <span className="text-sm font-black uppercase tracking-widest text-[var(--airion-text-primary)]">{trx.method}</span>
                  </td>
                  <td className="px-12 py-10 font-black text-3xl text-[var(--airion-text-primary)] tracking-tighter italic">₹{trx.amount.replace('₹', '')}</td>
                  <td className="px-12 py-10">
                    <div className="flex justify-center">
                      <Badge
                        className="px-6 py-2.5 rounded-full text-sm uppercase font-black tracking-widest shadow-lg"
                        variant={
                          trx.status.toLowerCase() === 'completed' ? 'confirmed' :
                            trx.status.toLowerCase() === 'pending' ? 'pending' : 'cancelled'
                        }
                      >
                        {trx.status}
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-12 bg-[var(--airion-bg-elevated)] border-t border-[var(--airion-border-subtle)]">
          <button className="flex items-center justify-center gap-5 w-full py-6 rounded-[2rem] bg-slate-900 border border-slate-700 text-white text-sm font-black hover:gap-8 transition-all uppercase tracking-[0.25em] shadow-2xl italic group">
            Explore All 1,284 Transmissions
            <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
