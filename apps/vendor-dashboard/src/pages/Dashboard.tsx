import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { Calendar as CalendarIcon, MoreVertical, TrendingUp, TrendingDown, DollarSign, Package, FileText, ChevronRight, Clock, Sparkles, CheckCircle2, Zap, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@ease2event/shared';
import api from '../lib/api';
import { Skeleton, Badge, Avatar, Button } from '@ease2event/ui';

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
 * Standardized with readable fonts and premium alignment.
 */
const StatCard = ({ title, value, trend, direction, icon: Icon, isLoading, currency }: any) => (
  <div className="card-minimal flex flex-col justify-between h-40 group relative overflow-hidden transition-all duration-300">
    {isLoading ? (
      <div className="space-y-4">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" height={32} />
      </div>
    ) : (
      <>
        <div className="space-y-4 z-10">
          <p className="text-sm font-black text-[var(--ease2event-text-secondary)] uppercase tracking-widest leading-none">{title}</p>
          <h3 className="text-4xl md:text-5xl font-black text-[var(--ease2event-text-primary)] tracking-tighter leading-none italic">
            {currency}{value}
          </h3>
        </div>

        <div className="flex items-center justify-between z-10">
          {trend ? (
            <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-lg ${direction === 'up' ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border border-rose-500/20'}`}>
              {direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend}
            </div>
          ) : <div className="h-6" />}
          <div className="p-3.5 rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-secondary)] group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300">
            {Icon && <Icon size={20} />}
          </div>
        </div>
      </>
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const vendorId = user?.vendor?.id || 'mock-id';

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

  const enquiries = [
    { name: 'Sameer Malhotra', event: 'Wedding Protocol', time: '2h ago', avatar: 'S' },
    { name: 'Isha Gupta', event: 'Engagement Node', time: '5h ago', avatar: 'I' },
    { name: 'Rahul Verma', event: 'Corporate Synergy', time: '1d ago', avatar: 'R' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12 pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--ease2event-border-subtle)] pb-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-normal normal-case not-italic tracking-normal leading-normal">Intelligence Hub</h1>
          <p className="text-lg font-semibold text-[var(--ease2event-text-secondary)] uppercase tracking-widest flex items-center gap-2">            <Zap size={16} className="text-blue-500" />
            Neural Analytics & Global Visibility Node
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="btn-secondary h-12 px-8 rounded-xl text-xs font-bold tracking-wider uppercase">
            Export Telemetry
          </Button>
          <Button className="btn-primary h-12 px-8 rounded-xl text-xs font-bold tracking-wider uppercase">
            Initialize Registry
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Active Enquiries" value={stats?.activeEnquiries} trend="+24.2%" direction="up" icon={FileText} isLoading={statsLoading} />
        <StatCard title="Total Listings" value={stats?.totalListings} icon={Package} isLoading={statsLoading} />
        <StatCard title="Confirmed Bookings" value={stats?.confirmedBookings} trend="+8.4%" direction="up" icon={CheckCircle2} isLoading={statsLoading} />
        <StatCard title="Revenue" value={stats?.revenue} currency="₹" trend="+12.8%" direction="up" icon={DollarSign} isLoading={statsLoading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Left Column: Charts and Performance Metrics */}
        <div className="xl:col-span-2 space-y-10">
          {/* Revenue Chart */}
          <div className="card-minimal !p-10 overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight uppercase">Operational Revenue</h2>
                <p className="text-sm font-black text-[var(--ease2event-text-muted)] tracking-widest uppercase opacity-60">Global Currency Flow Index</p>
              </div>
              <div className="flex bg-[var(--ease2event-bg-elevated)] p-1.5 rounded-xl border border-[var(--ease2event-border-subtle)]">
                <button className="px-6 py-2.5 rounded-lg text-xs font-extrabold bg-[var(--ease2event-brand-primary)] text-white shadow-lg shadow-blue-500/20 uppercase tracking-wide">Live Stream</button>
                <button className="px-6 py-2.5 text-xs font-bold text-[var(--ease2event-text-secondary)] hover:text-[var(--ease2event-text-primary)] transition-all uppercase tracking-wide">Archive</button>
              </div>
            </div>

            <div className="h-[400px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ease2event-border-subtle)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--ease2event-text-muted)', fontSize: 11, fontWeight: 600 }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--ease2event-text-muted)', fontSize: 11, fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--ease2event-bg-surface)', borderRadius: '16px', border: '1px solid var(--ease2event-border-subtle)', padding: '16px' }}
                    itemStyle={{ color: 'var(--ease2event-text-primary)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-minimal !p-10 space-y-8 group border-[var(--ease2event-border-subtle)] hover:border-blue-500/30">
              <div className="flex justify-between items-start">
                <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl text-blue-400">
                  <Sparkles size={32} />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest px-4 py-2 h-auto rounded-full">Live Optimization</Badge>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[var(--ease2event-text-primary)] tracking-tight uppercase leading-none">Neural Ad Engine</h3>
                <p className="text-sm text-[var(--ease2event-text-secondary)] font-semibold leading-relaxed tracking-wide opacity-90">Initialize AI-powered marketing nodes for 2.8x higher throughput.</p>
              </div>
              <Button className="btn-primary w-full !h-14 text-sm font-black tracking-widest uppercase rounded-2xl">Initialize Node</Button>
            </div>

            <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white space-y-10 shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="flex justify-between items-start z-10">
                <CalendarIcon size={40} className="text-white/80" />
                <div className="text-right">
                  <p className="text-sm font-black tracking-widest uppercase opacity-70">Strategic Arrival</p>
                  <p className="text-2xl font-bold tracking-tight mt-1 leading-none">JAN 20, 2026</p>
                </div>
              </div>
              <div className="z-10 space-y-4">
                <h3 className="text-2xl font-bold tracking-tight leading-none">HERITAGE GRAND PROTOCOL</h3>
                <p className="text-sm font-black opacity-80 uppercase tracking-widest">12 Operations nodes awaiting manual signoff</p>
              </div>
              <button className="flex items-center justify-between w-full h-14 bg-white/10 hover:bg-white/20 border border-white/10 rounded-[1.25rem] px-8 text-sm font-black uppercase tracking-widest transition-all backdrop-blur-md z-10">
                Review Mission Plan <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Registry Feed */}
        <div className="space-y-10">
          {/* Recent Signals */}
          <div className="card-minimal !p-8 space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-[var(--ease2event-text-secondary)] uppercase tracking-widest leading-none">Incoming Signals</h2>
              <span className="chip chip-soft-blue h-9 px-6 text-[10px] font-black rounded-full uppercase tracking-tighter italic border border-blue-500/20 shadow-lg shadow-blue-500/10">4 NODES ACTIVE</span>
            </div>

            <div className="space-y-8">
              {enquiries.map((e, i) => (
                <div key={i} className="flex items-center gap-5 group cursor-pointer p-2 -m-2 rounded-2xl hover:bg-[var(--ease2event-bg-elevated)] transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] flex items-center justify-center font-bold text-xl text-[var(--ease2event-text-primary)] group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {e.avatar}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="text-xl font-black text-[var(--ease2event-text-primary)] tracking-tighter leading-none italic">{e.name}</h4>
                    <p className="text-sm text-[var(--ease2event-text-muted)] font-black uppercase tracking-tight">{e.event} • <span className="text-blue-500">{e.time}</span></p>
                  </div>
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)] hover:bg-white/10 transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full h-16 text-sm font-black text-[var(--ease2event-text-secondary)] uppercase tracking-[0.2em] border-[var(--ease2event-border-subtle)] hover:bg-[var(--ease2event-bg-elevated)] transition-all mt-8 border rounded-[1.5rem] italic">
              Enter Communication Hub
            </Button>
          </div>

          {/* Visibility Index */}
          <div className="card-minimal !p-10 space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />

            <div className="space-y-4 z-10 relative">
              <h2 className="text-2xl font-bold text-[var(--ease2event-text-primary)] leading-none uppercase tracking-tight">Visibility Index</h2>
              <p className="text-sm font-black text-[var(--ease2event-text-muted)] tracking-widest uppercase opacity-80">Global Marketplace Ranking v4.0</p>
            </div>

            <div className="space-y-10 z-10 relative">
              <div className="flex justify-between items-end h-32 gap-3">
                {[40, 60, 45, 90, 65, 80, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-[var(--ease2event-bg-elevated)] rounded-t-xl relative group overflow-hidden border-x border-t border-[var(--ease2event-border-subtle)]">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className={`absolute bottom-0 left-0 right-0 bg-blue-600/40 group-hover:bg-blue-600 transition-all duration-500`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-[var(--ease2event-bg-elevated)] p-8 rounded-3xl border border-[var(--ease2event-border-subtle)]">
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase tracking-widest opacity-80 leading-none">Growth Delta</p>
                  <p className="text-3xl font-bold tracking-tight text-[var(--ease2event-text-primary)] leading-none">+24.8%</p>
                </div>
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
                  <Activity size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Target Tracker */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Target size={24} className="text-amber-500" />
              <h2 className="text-sm font-black tracking-widest leading-none opacity-80 uppercase">Operational Target</h2>
            </div>
            <div className="bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-subtle)] p-8 rounded-3xl space-y-6 group hover:border-blue-500/30 transition-all duration-500">
              <div className="flex justify-between items-start">
                <p className="text-lg font-bold text-[var(--ease2event-text-primary)] tracking-tight leading-tight">Final Floral Node Protocol</p>
                <span className="text-sm font-black uppercase tracking-widest opacity-60">JAN 18</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-6 h-6 rounded-full border-2 border-blue-600/30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)] animate-pulse" />
                </div>
                <p className="text-md text-[var(--ease2event-text-secondary)] font-semibold opacity-90">Awaiting Curator Registry Signoff</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
