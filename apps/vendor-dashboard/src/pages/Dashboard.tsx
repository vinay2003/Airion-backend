import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot } from 'recharts';
import { Calendar as CalendarIcon, MoreVertical, TrendingUp, TrendingDown, DollarSign, Package, Users, FileText, ChevronLeft, ChevronRight, Clock, Edit, Sparkles, CheckCircle2 } from 'lucide-react';
import { bookingService } from '@airion/shared/lib/services/bookingService';
import { useAuth } from '@airion/shared';
import { Skeleton, SkeletonText, Badge, Avatar, Button } from '@airion/ui';

const CHART_DATA = [
  { name: '5k', value: 20 },
  { name: '10k', value: 35 },
  { name: '15k', value: 50 },
  { name: '20k', value: 60 },
  { name: '25k', value: 75 },
  { name: '30k', value: 90 },
  { name: '35k', value: 100 },
  { name: '40k', value: 85 },
  { name: '45k', value: 70 },
  { name: '50k', value: 60 },
  { name: '55k', value: 45 },
  { name: '60k', value: 30 },
];

const StatCard = ({ title, value, trend, period, unit, currency, direction, icon: Icon, color, bg, isLoading }: any) => (
  <div className="card-premium flex flex-col justify-center min-h-[160px]">
    {isLoading ? (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
           <Skeleton variant="rect" width={48} height={48} />
           <Skeleton variant="text" width={60} />
        </div>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="70%" height={32} />
      </div>
    ) : (
      <>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${bg} ${color}`}>
            {Icon && <Icon size={24} />}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${direction === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
              {direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend}{period ? `/${period}` : ''}
            </div>
          )}
        </div>
        <p className="text-[var(--airion-text-secondary)] text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-[var(--airion-text-primary)] tracking-tight">
          {currency}{value} {unit && <span className="text-lg text-[var(--airion-text-muted)] font-medium">{unit}</span>}
        </h3>
      </>
    )}
  </div>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-[var(--airion-border-subtle)]">
        <p className="text-[var(--airion-text-primary)] font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const vendorId = user?.vendor?.id || user?.id || 'mock-vendor-id';

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['vendor-stats', vendorId],
    queryFn: () => bookingService.getStats(vendorId).catch(() => ({
       pendingBookings: 200,
       totalEvents: 600,
       upcomingBookings: 1789,
       totalEarnings: '32,045'
    }))
  });

  const { data: enquiries, isLoading: enquiriesLoading } = useQuery({
    queryKey: ['vendor-enquiries', vendorId],
    queryFn: () => Promise.resolve([
        { name: 'Riya', event: 'Wedding', status: 'In Progress', statusClass: 'badge-inprogress' },
        { name: 'Shivangi', event: 'Birthday party', status: 'Pending', statusClass: 'badge-pending' },
        { name: 'Sara', event: '-', status: 'New', statusClass: 'badge-new' },
        { name: 'Amit', event: '-', status: 'Pending', statusClass: 'badge-pending' },
        { name: 'Nikhil', event: '-', status: 'Pending', statusClass: 'badge-pending' }
    ]).then(d => d.slice(0, 5))
  });

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-12 max-w-[1600px]">
      {/* Smart Intelligence Banner */}
      <div className="bg-gradient-to-r from-[rgba(108,99,255,0.08)] to-transparent border border-[var(--airion-brand-primary)]/20 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_4px_24px_-4px_rgba(108,99,255,0.12)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[var(--airion-brand-primary)] flex justify-center items-center text-white shadow-[var(--airion-shadow-glow)]">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--airion-text-primary)] tracking-tight">Intelligence Pulse</h3>
            <p className="text-sm text-[var(--airion-text-secondary)] font-medium">You have 3 high-value wedding enquiries expiring soon.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-[var(--airion-bg-base)]">
          Draft Quick Replies
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Main Operating Area */}
        <div className="flex-1 space-y-6">
          
          {/* KPI Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Pending Bookings" 
              value={stats?.pendingBookings} trend="+20%" period="Month" direction="up" 
              icon={FileText} color="text-indigo-600" bg="bg-indigo-50" isLoading={statsLoading} 
            />
            <StatCard title="Total Event Listed" 
              value={stats?.totalEvents} unit="Events" 
              icon={Package} color="text-emerald-600" bg="bg-emerald-50" isLoading={statsLoading} 
            />
            <StatCard title="Upcoming Bookings" 
              value={stats?.upcomingBookings} trend="+97%" direction="up" 
              icon={CalendarIcon} color="text-amber-600" bg="bg-amber-50" isLoading={statsLoading} 
            />
            <StatCard title="Total Earnings" 
              value={stats?.totalEarnings} currency="₹" trend="18%" direction="up" 
              icon={DollarSign} color="text-teal-600" bg="bg-teal-50" isLoading={statsLoading} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Sales Details Chart */}
            <div className="card-premium">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[var(--airion-text-primary)] tracking-tight">Revenue Trajectory</h2>
                <select className="bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] text-[var(--airion-text-primary)] text-sm rounded-lg px-3 py-1.5 outline-none font-medium appearance-none">
                  <option>Current vs Last Month</option>
                  <option>30 Days</option>
                  <option>90 Days</option>
                </select>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--airion-brand-primary)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--airion-brand-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--airion-border-subtle)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 12, fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--airion-text-muted)', fontSize: 12, fontWeight: 500 }} tickFormatter={(val) => `${val}%`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--airion-brand-primary)', opacity: 0.2, strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="value" stroke="var(--airion-brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    <ReferenceDot x="35k" y={100} r={5} fill="var(--airion-brand-primary)" stroke="white" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active Enquiries */}
            <div className="card-premium flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-[var(--airion-text-primary)] tracking-tight">Active Enquiries</h2>
                    <p className="text-xs text-[var(--airion-text-muted)] font-medium mt-1">Clients awaiting your response</p>
                </div>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">View All</Button>
              </div>

              <div className="flex-1 space-y-3">
                {enquiriesLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton variant="circle" width={40} height={40} />
                            <div className="flex-1"><SkeletonText lines={2} /></div>
                        </div>
                    ))
                ) : enquiries && enquiries.length > 0 ? (
                    enquiries.slice(0, 4).map((person: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--airion-bg-surface)] border border-transparent hover:border-[var(--airion-border-base)] transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <Avatar name={person.name} size="md" />
                            <div>
                              <h4 className="font-bold text-sm text-[var(--airion-text-primary)] group-hover:text-[var(--airion-brand-primary)] transition-colors">{person.name}</h4>
                              <p className="text-xs text-[var(--airion-text-secondary)] font-medium">{person.event !== '-' ? person.event : 'Standard Booking'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">Exp. 2h</span>
                             <button className="w-8 h-8 rounded-full bg-white border border-[var(--airion-border-subtle)] flex items-center justify-center text-[var(--airion-text-secondary)] hover:text-[var(--airion-brand-primary)] hover:border-[var(--airion-brand-primary)] transition-all"><CheckCircle2 size={16}/></button>
                          </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-[var(--airion-text-muted)] font-medium">No active enquiries</p>
                    </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right Dashboard Sidebar */}
        <div className="w-full xl:w-[350px] space-y-6 shrink-0">
          
          {/* Priority Event */}
          <div className="card-premium flex flex-col bg-gradient-to-br from-[var(--airion-bg-base)] to-[rgba(108,99,255,0.02)] border-[var(--airion-brand-primary)]/10">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-bold text-[var(--airion-text-primary)] tracking-tight">Priority Event</h2>
              <button className="text-[var(--airion-text-muted)] hover:text-[var(--airion-brand-primary)] transition-colors"><MoreVertical size={20} /></button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {statsLoading ? (
                 <div className="space-y-4">
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="100%" height={32} />
                    <SkeletonText lines={3} />
                 </div>
              ) : (
                  <div className="rounded-2xl bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] relative overflow-hidden">
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4 relative z-10">
                        <span className="badge badge-new bg-[var(--airion-brand-primary)]/10 text-[var(--airion-brand-primary)] border-transparent tracking-widest text-[10px]">Upcoming</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-[var(--airion-text-primary)] relative z-10 tracking-tight">Royal Wedding</h3>
                      <div className="space-y-3 text-sm text-[var(--airion-text-secondary)] relative z-10 font-medium">
                        <div className="flex items-center gap-2"><CalendarIcon size={16} /> January 20, 2026</div>
                        <div className="flex items-center gap-2"><Clock size={16} /> 10:00am - 12:00am</div>
                      </div>
                    </div>
                    
                    {/* Decorative dash line for flight-ticket feel */}
                    <div className="relative">
                      <div className="absolute top-1/2 -left-2 w-4 h-4 bg-[var(--airion-bg-base)] rounded-full -translate-y-1/2 border-r border-[var(--airion-border-subtle)] z-20" />
                      <div className="absolute top-1/2 -right-2 w-4 h-4 bg-[var(--airion-bg-base)] rounded-full -translate-y-1/2 border-l border-[var(--airion-border-subtle)] z-20" />
                      <div className="absolute top-1/2 left-3 right-3 h-px border-b-2 border-dashed border-[var(--airion-border-subtle)] -translate-y-1/2 z-10" />
                    </div>

                    <div className="p-5 relative z-10 flex justify-between items-center font-bold bg-[var(--airion-bg-elevated)]/50">
                       <span className="text-[var(--airion-text-secondary)] text-sm tracking-wide">Expected Revenue</span>
                       <span className="text-lg text-[var(--airion-brand-primary)]">₹50,000</span>
                    </div>
                  </div>
              )}
            </div>
            {!statsLoading && (
                <div className="flex gap-2 mt-5">
                  <Button variant="primary" className="flex-1 w-full shadow-[var(--airion-shadow-md)]">Manage Logistics</Button>
                </div>
            )}
          </div>

          {/* Trending Listings */}
          <div className="card-premium">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-[var(--airion-text-primary)] tracking-tight">Trending Listings</h2>
                  <button className="text-[var(--airion-text-muted)] hover:text-[var(--airion-brand-primary)] transition-colors"><MoreVertical size={20} /></button>
              </div>

              <div className="space-y-5">
                  {[
                      { name: 'Royal Wedding Planner', percentage: 82, images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&q=80', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100&q=80'] },
                      { name: 'Corporate Meetups', percentage: 65, images: ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&q=80', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=100&q=80'] }
                  ].map((event, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex items-center gap-3 mb-2.5">
                          <div className="flex -space-x-2">
                              {event.images.map((img, i) => (
                                  <Avatar key={i} src={img} size="sm" className="border-2 border-[var(--airion-bg-base)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative z-10 hover:z-20 transform hover:scale-110 transition-transform" />
                              ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-[var(--airion-text-primary)] group-hover:text-[var(--airion-brand-primary)] transition-colors truncate">{event.name}</h4>
                          </div>
                          <span className="font-black text-[var(--airion-brand-primary)] text-sm">{event.percentage}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-[var(--airion-bg-elevated)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[rgba(108,99,255,0.7)] to-[var(--airion-brand-primary)] rounded-full transition-all duration-1000" style={{ width: `${event.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-7 p-4 bg-[var(--airion-brand-primary)]/5 border border-[var(--airion-brand-primary)]/10 rounded-2xl flex flex-col items-center text-center">
                 <h4 className="font-bold text-[var(--airion-brand-primary)] text-sm mb-1 tracking-tight">Boost Visibility</h4>
                 <p className="text-[11px] text-[var(--airion-text-secondary)] mb-4 font-medium leading-relaxed">Promote your listings to reach more customers this season.</p>
                 <Button variant="outline" size="sm" className="w-full text-xs bg-white hover:bg-[var(--airion-brand-primary)] hover:text-white border-[var(--airion-brand-primary)]/20 hover:border-transparent transition-all shadow-sm">Start Promotion</Button>
              </div>
          </div>

          {/* Next Milestone */}
          <div className="card-premium">
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-bold text-[var(--airion-text-primary)] tracking-tight">Next Milestone</h2>
                 <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm">
                    <Clock size={16} />
                 </div>
             </div>
             
             <div className="p-4 bg-[var(--airion-bg-surface)] rounded-2xl border border-[var(--airion-border-subtle)] space-y-4">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--airion-brand-primary)] mb-1">Target Date</p>
                    <p className="font-bold text-[var(--airion-text-primary)] text-lg">Jan 28, 2026</p>
                 </div>
                 <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                       <p className="text-sm font-medium text-[var(--airion-text-secondary)] line-through opacity-70">Client Onboarding</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 rounded-full border-2 border-[var(--airion-brand-primary)] shrink-0 shadow-[0_0_8px_rgba(108,99,255,0.3)]" />
                       <p className="text-sm font-bold text-[var(--airion-text-primary)]">Complete floral setup</p>
                    </div>
                 </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
