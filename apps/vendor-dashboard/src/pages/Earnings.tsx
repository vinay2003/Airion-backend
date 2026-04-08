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
  AlertCircle
} from 'lucide-react';
import { Button, Badge } from '@airion/ui';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@airion/shared';
import { bookingService } from '@airion/shared/lib/services/bookingService';
import { useQuery } from '@tanstack/react-query';

type Period = 'Daily' | 'Weekly' | 'Monthly';

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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Financial Intelligence</h1>
          <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">Revenue Streams • Settlement Matrix • Tax Compliance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" className="hidden sm:flex bg-white h-10 px-6 rounded-lg font-black text-[10px] uppercase tracking-widest" leftIcon={<CalendarIcon size={14} />}>
            Custom Matrix
          </Button>
          <Button variant="primary" leftIcon={<Download size={14} />} className="h-10 px-8 rounded-lg font-black text-[10px] uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20">
            Export Logs
          </Button>
        </div>
      </div>

      {/* Smart Intelligence Banner */}
      <div className="bg-gradient-to-r from-[rgba(79,70,229,0.08)] to-transparent border border-indigo-500/20 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_8px_32px_-4px_rgba(79,70,229,0.1)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex justify-center items-center text-white shadow-lg">
            <Zap size={22} fill="white" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--airion-text-primary)] text-base">Payout Optimization</h3>
            <p className="text-sm text-[var(--airion-text-muted)] font-medium">Switch to <span className="font-bold text-[var(--airion-brand-primary)]">Instant Payouts</span> to receive funds in under 30 minutes.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-white hover:bg-indigo-50 transition-colors border-indigo-200">
          Enable Fast Pass
        </Button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-minimal bg-slate-900 text-white p-7 relative overflow-hidden group border-none">
          <div className="absolute right-0 bottom-0 p-8 opacity-10 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-700">
            <CreditCard size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <p className="text-white/40 font-black text-[9px] uppercase tracking-[0.2em]">Secured Liquidity Node</p>
            </div>
            <h2 className="text-4xl font-black mb-8 leading-none tracking-tighter italic">₹{Number(displayData.totalBalance).toLocaleString('en-IN')}</h2>
            <div className="flex items-center justify-between mt-auto">
                <div className="space-y-1">
                    <p className="text-white/30 text-[8px] font-black uppercase tracking-widest leading-none">Last Synchronization</p>
                    <p className="text-xs font-black text-white/90 leading-none">Oct 15, 2023</p>
                </div>
                <button className="flex items-center gap-1.5 text-[9px] font-black bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/10 transition-all uppercase tracking-widest">
                    Withdrawal Matrix
                </button>
            </div>
          </div>
        </div>

        <div className="card-minimal p-7 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shadow-sm">
                <TrendingUp size={24} />
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                <ArrowUpRight size={14} />
                <span>{displayData.growth}</span>
              </div>
            </div>
            <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mb-2">{activePeriod} Gross Delta</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic">₹{Number(displayData.periodRevenue).toLocaleString('en-IN')}</h2>
          </div>
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
             <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-slate-100 border-2 border-white shadow-sm" />)}
             </div>
             <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Updated <span className="text-emerald-500">Real-time</span></p>
          </div>
        </div>

        <div className="card-minimal p-7 flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mb-1">Target Matrix</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">₹{displayData.payoutTarget.toLocaleString()} Goal</h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl border border-amber-100">
                <Clock size={20} />
            </div>
          </div>
          
          <div className="space-y-4">
              <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000 shadow-lg shadow-amber-500/20" style={{ width: `${displayData.payoutProgress}%` }}></div>
              </div>
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                  <span>{displayData.payoutProgress}% Efficiency</span>
                  <span className="text-primary tracking-tighter">Settlement: {displayData.payoutDate}</span>
              </div>
          </div>
          
          <button className="mt-6 flex items-center justify-between w-full p-4 bg-slate-50/50 hover:bg-slate-100/50 border border-slate-100 rounded-xl transition-all group">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Adjust Operational Target</span>
            <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Revenue Chart Section */}
        <div className="xl:col-span-2 card-premium p-4 sm:p-8 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <div>
                    <h3 className="text-xl font-bold text-[var(--airion-text-primary)]">Revenue Trajectory</h3>
                    <p className="text-xs text-[var(--airion-text-muted)] font-medium mt-1">Detailed performance tracking for {activePeriod.toLowerCase()} timeframe</p>
                </div>
                <div className="bg-[var(--airion-bg-elevated)]/50 p-1.5 rounded-2xl border border-[var(--airion-border-subtle)] flex gap-1 w-full sm:w-auto shadow-inner">
                    {(['Daily', 'Weekly', 'Monthly'] as Period[]).map(period => (
                    <button 
                        key={period} 
                        onClick={() => setActivePeriod(period)}
                        className={`flex-1 sm:flex-none px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${activePeriod === period ? 'bg-[var(--airion-brand-primary)] text-white shadow-xl shadow-indigo-500/30' : 'text-[var(--airion-text-muted)] hover:text-[var(--airion-text-primary)] hover:bg-[var(--airion-bg-base)]'}`}
                    >
                        {period}
                    </button>
                    ))}
                </div>
            </div>
            
            <div className="h-[400px] w-full -ml-4 sm:ml-0 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={periodData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--airion-brand-primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--airion-brand-primary)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--airion-border-subtle)" strokeOpacity={0.5} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 700}} 
                        dy={15}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'var(--airion-text-muted)', fontSize: 10, fontWeight: 700}} 
                        tickFormatter={(val) => `₹${val/1000}k`}
                        dx={-10}
                    />
                    <Tooltip 
                        cursor={{ stroke: 'var(--airion-brand-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        contentStyle={{ 
                            backgroundColor: 'white', 
                            border: 'none', 
                            borderRadius: '20px',
                            boxShadow: 'var(--airion-shadow-xl)',
                            padding: '16px'
                        }}
                        itemStyle={{ color: 'var(--airion-brand-primary)', fontWeight: 900, fontSize: '18px' }}
                        labelStyle={{ color: 'var(--airion-text-muted)', fontWeight: 600, fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.15em' }}
                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Income']}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="var(--airion-brand-primary)" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        animationDuration={2000}
                    />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Breakdown Context */}
        <div className="space-y-6">
            <div className="card-premium p-6 sm:p-8 bg-gradient-to-br from-[var(--airion-brand-primary)]/5 to-transparent">
                <h3 className="text-lg font-bold text-[var(--airion-text-primary)] mb-6 tracking-tight">Payout Schedule</h3>
                <div className="space-y-6">
                    {[
                        { label: 'Upcoming Settlement', amount: '₹12,450', date: 'In 2 days', status: 'processing' },
                        { label: 'Reserve Balance', amount: '₹3,200', date: 'T+7 Policy', status: 'on_hold' },
                        { label: 'Recently Settled', amount: '₹45,800', date: 'Oct 15, 2023', status: 'settled' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between group">
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.status === 'processing' ? 'bg-indigo-50 text-indigo-600' : item.status === 'on_hold' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {item.status === 'processing' ? <Clock size={20}/> : item.status === 'on_hold' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-[var(--airion-text-primary)]">{item.label}</p>
                                    <p className="text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-widest">{item.date}</p>
                                </div>
                            </div>
                            <span className="text-sm font-black text-[var(--airion-text-primary)]">{item.amount}</span>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-8 py-3.5 bg-white border border-[var(--airion-border-subtle)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--airion-text-muted)] hover:text-[var(--airion-brand-primary)] hover:border-[var(--airion-brand-primary)]/30 transition-all">
                    View Withdrawal Logs
                </button>
            </div>

            <div className="card-premium p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                        <TrendingUp size={18} />
                    </div>
                    <h3 className="font-bold text-[var(--airion-text-primary)] tracking-tight">Profitability Insights</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end border-b border-[var(--airion-border-subtle)] pb-4">
                      <div>
                        <p className="text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-widest mb-1">Fee deduction (Avg)</p>
                        <p className="font-black text-xl text-[var(--airion-text-primary)]">3.5%</p>
                      </div>
                      <Badge variant="confirmed">Industry Low</Badge>
                   </div>
                   <p className="text-xs text-[var(--airion-text-muted)] font-medium leading-relaxed">
                       Your tax-ready report is now generated for the last quarter. Ensure all bank details are up to date before Nov 1st.
                   </p>
                </div>
            </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="card-premium p-0 overflow-hidden border border-[var(--airion-border-subtle)] shadow-xl">
        <div className="p-6 sm:p-8 border-b border-[var(--airion-border-subtle)] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-[var(--airion-text-primary)] tracking-tight">Detailed Transactions</h3>
            <p className="text-sm text-[var(--airion-text-muted)] font-medium mt-1">Audit log of all incoming and outgoing capital</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--airion-text-muted)]" size={16} />
                <input type="text" placeholder="Search by ID or Client..." className="w-full pl-11 pr-4 py-3 bg-[var(--airion-bg-elevated)]/50 border border-[var(--airion-border-subtle)] rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[var(--airion-brand-primary)]/20 transition-all text-[var(--airion-text-primary)]" />
            </div>
            <Button variant="secondary" size="md" className="shrink-0 rounded-2xl border-[var(--airion-border-subtle)]">
                More Filters
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[950px]">
            <thead>
              <tr className="bg-[var(--airion-bg-elevated)]/10 border-b border-[var(--airion-border-subtle)]">
                <th className="px-8 py-5 text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Transaction ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Listing / Service</th>
                <th className="px-8 py-5 text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Client</th>
                <th className="px-8 py-5 text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Method</th>
                <th className="px-8 py-5 text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em]">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-[0.2em] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--airion-border-subtle)] text-[var(--airion-text-primary)] font-medium">
              {displayData.recentTransactions.map((trx: any) => (
                <tr key={trx.id} className="hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer group">
                  <td className="px-8 py-6">
                    <span className="font-black text-[var(--airion-brand-primary)] text-xs tracking-tighter opacity-80 group-hover:opacity-100">{trx.id}</span>
                  </td>
                  <td className="px-8 py-6 font-bold group-hover:translate-x-1 transition-transform duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-200 group-hover:bg-[var(--airion-brand-primary)] transition-colors"></div>
                      {trx.service}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-semibold text-[var(--airion-text-primary)]">{trx.client}</td>
                  <td className="px-8 py-6 text-[var(--airion-text-muted)] text-xs font-black uppercase tracking-widest">{trx.date}</td>
                  <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-[var(--airion-bg-elevated)] px-2.5 py-1 rounded-lg border border-[var(--airion-border-subtle)]">{trx.method}</span>
                  </td>
                  <td className="px-8 py-6 font-black text-lg text-[var(--airion-text-primary)] tracking-tight italic">₹{trx.amount.replace('₹', '')}</td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                        <Badge 
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
        
        <div className="p-8 bg-white border-t border-[var(--airion-border-subtle)]">
          <button className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[var(--airion-bg-elevated)] hover:bg-[var(--airion-bg-base)] text-[var(--airion-text-primary)] text-xs font-black hover:gap-3 transition-all uppercase tracking-[0.2em] border border-[var(--airion-border-subtle)]">
            Explore All 1,284 Transactions
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
