import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { Calendar as CalendarIcon, MoreVertical, TrendingUp, TrendingDown, DollarSign, Package, FileText, ChevronRight, Clock, Sparkles, CheckCircle2, Zap, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@airion/shared';
import { Skeleton, Badge, Avatar, Button } from '@airion/ui';

const CHART_DATA = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 1398 },
  { name: 'Wed', value: 9800 },
  { name: 'Thu', value: 3908 },
  { name: 'Fri', value: 4800 },
  { name: 'Sat', value: 3800 },
  { name: 'Sun', value: 4300 },
];

/**
 * 📊 Analytical Node Visualization
 * Standardized with 'Premium Dark Glassmorphism' elevation tokens.
 */
const StatCard = ({ title, value, trend, direction, icon: Icon, isLoading, currency }: any) => (
  <div className="card-minimal flex flex-col justify-between h-36 group relative overflow-hidden transition-all duration-700 bg-white/5 border-white/5 hover:border-blue-500/30">
    {isLoading ? (
       <div className="space-y-4">
          <Skeleton variant="text" width="40%" className="bg-white/5" />
          <Skeleton variant="text" width="80%" height={32} className="bg-white/5" />
       </div>
    ) : (
      <>
        <div className="space-y-2 z-10">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic leading-none">{title}</p>
          <h3 className="text-2xl font-black text-white italic tracking-tighter leading-none">
            {currency}{value}
          </h3>
        </div>

        <div className="flex items-center justify-between z-10">
          {trend ? (
            <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-lg italic ${direction === 'up' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'} shadow-glow-custom`}>
              {direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend}
            </div>
          ) : <div className="h-4" />}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all duration-500 shadow-glow-custom">
             {Icon && <Icon size={16} />}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </>
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const vendorId = user?.vendor?.id || 'mock-id';

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['vendor-stats', vendorId],
    queryFn: () => Promise.resolve({
       activeEnquiries: 14,
       totalListings: 8,
       confirmedBookings: 42,
       revenue: '4.8L'
    })
  });

  const enquiries = [
    { name: 'Sameer Malhotra', event: 'Wedding Protocol', time: '2h ago', avatar: 'S' },
    { name: 'Isha Gupta', event: 'Engagement Node', time: '5h ago', avatar: 'I' },
    { name: 'Rahul Verma', event: 'Corporate Synergy', time: '1d ago', avatar: 'R' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12 pb-24">
      {/* Top Navigation / Matrix Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">Intelligence Hub</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] italic flex items-center gap-2">
            <Zap size={12} className="text-blue-500" />
            Neural Analytics & Global Visibility Node
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="btn-secondary h-11 px-8 rounded-xl text-[10px] tracking-widest italic uppercase">
            Export Telemetry
          </Button>
          <Button className="btn-primary h-11 px-8 rounded-xl text-[10px] tracking-widest italic uppercase">
            Initialize Registry
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Active Enquiries" value={stats?.activeEnquiries} trend="+24.2%" direction="up" icon={FileText} isLoading={statsLoading} />
        <StatCard title="Total Listings" value={stats?.totalListings} icon={Package} isLoading={statsLoading} />
        <StatCard title="Confirmed Bookings" value={stats?.confirmedBookings} trend="+8.4%" direction="up" icon={CheckCircle2} isLoading={statsLoading} />
        <StatCard title="Total Revenue" value={stats?.revenue} currency="₹" icon={DollarSign} isLoading={statsLoading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Left Column: Charts and Performance Metrics */}
        <div className="xl:col-span-2 space-y-10">
          
          {/* Revenue Matrix Tool */}
          <div className="card-minimal !p-10 border-white/5 overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-2">
                <h2 className="text-sm font-black text-white uppercase italic tracking-widest leading-none">Revenue Pulse Matrix</h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] italic opacity-60">System Throughput Performance Node</p>
              </div>
              <div className="flex gap-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl">
                <button className="px-6 py-2 text-[9px] font-black bg-blue-600 text-white rounded-xl shadow-glow-custom italic uppercase tracking-widest">Live Feed</button>
                <button className="px-6 py-2 text-[9px] font-black text-slate-500 hover:text-white transition-all italic uppercase tracking-widest">Archive</button>
              </div>
            </div>
            
            <div className="h-[360px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 900 }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 900 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '12px' }}
                    itemStyle={{ color: '#white', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#chartGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Intelligence Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-minimal !p-8 space-y-8 group border-white/5 hover:border-blue-500/30">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-2xl text-blue-400 shadow-glow-custom">
                      <Sparkles size={24} />
                   </div>
                   <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black italic uppercase tracking-widest px-4 py-1.5 h-auto">Live Optimization</Badge>
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Neural Ad Engine</h3>
                   <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic opacity-70">Initialize AI-powered marketing nodes for 2.8x higher throughput.</p>
                </div>
                <Button className="btn-primary w-full !h-12 text-[10px] font-black italic tracking-[0.2em] uppercase">Initialize Node</Button>
            </div>

            <div className="bg-blue-600 rounded-3xl p-8 text-white space-y-8 shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="flex justify-between items-start z-10">
                   <CalendarIcon size={30} className="text-white/80" />
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Strategic Arrival</p>
                      <p className="text-lg font-black italic tracking-tighter mt-1 leading-none">JAN 20, 2026</p>
                   </div>
                </div>
                <div className="z-10 space-y-2">
                   <h3 className="text-2xl font-black italic tracking-tighter leading-none shadow-text-custom">HERITAGE GRAND PROTOCOL</h3>
                   <p className="text-[10px] opacity-70 font-bold italic uppercase tracking-widest">12 Operations nodes awaiting manual signoff</p>
                </div>
                <button className="flex items-center justify-between w-full h-12 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-6 text-[10px] font-black italic uppercase tracking-[0.2em] transition-all backdrop-blur-md z-10">
                   Review Mission Plan <ChevronRight size={16} />
                </button>
            </div>
          </div>
        </div>

        {/* Right Column: Registry Feed and Visiblity Telemetry */}
        <div className="space-y-10">
          
          {/* Fresh Signals */}
          <div className="card-minimal !p-8 space-y-8 border-white/5">
             <div className="flex justify-between items-center">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic leading-none">Incoming Signals</h2>
                <span className="chip chip-soft-blue h-6 px-4 text-[8px] italic shadow-glow-custom">4 NODES ACTIVE</span>
             </div>
             
             <div className="space-y-7">
                {enquiries.map((e, i) => (
                  <div key={i} className="flex items-center gap-5 group cursor-pointer">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-sm text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-500 shadow-glow-custom italic">
                        {e.avatar}
                     </div>
                     <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-black text-white italic tracking-tighter leading-none">{e.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold italic uppercase tracking-tight opacity-70">{e.event} • <span className="text-blue-400 font-black">{e.time}</span></p>
                     </div>
                     <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                        <MoreVertical size={16} />
                     </button>
                  </div>
                ))}
             </div>
             
             <Button variant="ghost" className="w-full h-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic border-white/5 hover:bg-white/5 transition-all mt-4 border rounded-2xl">
                Enter Communication Hub
             </Button>
          </div>

          {/* Visibility Pulse */}
          <div className="card-minimal !bg-[#020617] !p-8 space-y-10 border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
             
             <div className="space-y-2 z-10 relative">
                <h2 className="text-xl font-black italic text-white leading-none uppercase tracking-tighter">Visibility Index</h2>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic opacity-60">Global Marketplace Ranking v4.0</p>
             </div>

             <div className="space-y-8 z-10 relative">
                <div className="flex justify-between items-end h-28 gap-2.5">
                   {[40, 60, 45, 90, 65, 80, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group overflow-hidden border-x border-t border-white/5">
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${h}%` }}
                           transition={{ delay: i * 0.1, duration: 1 }}
                           className={`absolute bottom-0 left-0 right-0 bg-blue-600/40 group-hover:bg-blue-600 transition-all duration-700 shadow-[0_0_20px_rgba(37,99,235,0.2)]`} 
                         />
                      </div>
                   ))}
                </div>
                
                <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5 shadow-glow-custom">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic leading-none opacity-60">Growth Delta</p>
                      <p className="text-2xl font-black italic tracking-tighter mt-1 text-white leading-none">+24.8%</p>
                   </div>
                   <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shadow-glow-custom">
                      <Activity size={24} />
                   </div>
                </div>
             </div>
          </div>

          {/* Protocol Tracker */}
          <div className="card-minimal !p-8 space-y-6 border-white/5">
             <div className="flex items-center gap-3">
                <Target size={18} className="text-amber-500" />
                <h2 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] italic leading-none">Operational Target</h2>
             </div>
             <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4 group hover:border-blue-500/20 transition-all duration-500">
                <div className="flex justify-between items-start">
                   <p className="text-sm font-black text-white italic tracking-tighter leading-tight">Final Floral Node Protocol</p>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">JAN 18</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-5 h-5 rounded-full border-2 border-blue-600/30 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] animate-pulse" />
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold italic uppercase tracking-widest opacity-70">Awaiting Curator Registry Signoff</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
