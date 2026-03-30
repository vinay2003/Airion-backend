import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot } from 'recharts';
import { Calendar as CalendarIcon, MoreVertical, TrendingUp, TrendingDown, DollarSign, Package, Users, Bell, FileText, ChevronLeft, ChevronRight, CheckCircle, Edit, PlayCircle, PauseCircle, Clock } from 'lucide-react';

const VENDOR_DATA = {
  stats: {
    pendingBookings: { value: 200, trend: '+20%', period: 'Month', direction: 'up', icon: FileText, color: 'text-[#6C63FF]', bg: 'bg-[rgba(108,99,255,0.15)]' },
    totalEvents: { value: 600, unit: 'Events', icon: Package, color: 'text-[#06D6A0]', bg: 'bg-[rgba(6,214,160,0.15)]' },
    upcomingBookings: { value: 1789, trend: '+975%', direction: 'up', icon: CalendarIcon, color: 'text-[#FFD166]', bg: 'bg-[rgba(255,209,102,0.15)]' },
    totalEarnings: { value: '32,045', currency: '$', trend: '18%', direction: 'up', icon: DollarSign, color: 'text-[#4ECDC4]', bg: 'bg-[rgba(78,205,196,0.15)]' }
  },
  upcomingEvent: {
    name: 'Royal Wedding Celebration',
    date: 'January 20, 2026',
    time: '10:00am - 12am',
    bookings: '$50,000',
    lastMonth: true
  },
  enquiries: [
    { name: 'Riya', event: 'Wedding', status: 'In Progress', statusClass: 'badge-inprogress' },
    { name: 'Shivangi', event: 'Birthday party', status: 'Pending', statusClass: 'badge-pending' },
    { name: 'Sara', event: '-', status: 'New', statusClass: 'badge-new' },
    { name: 'Amit', event: '-', status: 'Pending', statusClass: 'badge-pending' },
    { name: 'Nikhil', event: '-', status: 'Pending', statusClass: 'badge-pending' }
  ],
  popularEvents: [
    { name: 'Royal Wedding', percentage: 82, images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&q=80', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100&q=80'] },
    { name: 'Corporate Meetup', percentage: 65, images: ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&q=80', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=100&q=80'] }
  ]
};

const CHART_DATA = [
  { name: '5k', value: 20 },
  { name: '10k', value: 35 },
  { name: '15k', value: 50 },
  { name: '20k', value: 60 },
  { name: '25k', value: 75 },
  { name: '30k', value: 90 },
  { name: '35k', value: 100 }, // Peak
  { name: '40k', value: 85 },
  { name: '45k', value: 70 },
  { name: '50k', value: 60 },
  { name: '55k', value: 45 },
  { name: '60k', value: 30 },
];

const StatCard = ({ title, value, trend, period, unit, currency, direction, Icon, color, bg }: any) => (
  <div className="card-premium flex flex-col justify-center">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${direction === 'up' ? 'text-[#06D6A0] bg-[rgba(6,214,160,0.1)]' : 'text-[#FF6B6B] bg-[rgba(255,107,107,0.1)]'}`}>
          {direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}{period ? `/${period}` : ''}
        </div>
      )}
    </div>
    <p className="text-[var(--text-secondary)] text-sm font-medium mb-1">{title}</p>
    <h3 className="text-3xl font-display font-bold text-white tracking-tight">
      {currency}{value} {unit && <span className="text-lg text-[var(--text-muted)] font-medium">{unit}</span>}
    </h3>
  </div>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-xl shadow-glow-custom">
        <p className="text-white font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  return (
    <div className="animate-slideIn space-y-6">
      
      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pending Bookings" {...VENDOR_DATA.stats.pendingBookings} />
        <StatCard title="Total Event Listed" {...VENDOR_DATA.stats.totalEvents} />
        <StatCard title="Upcoming Bookings" {...VENDOR_DATA.stats.upcomingBookings} />
        <StatCard title="Total Earnings" {...VENDOR_DATA.stats.totalEarnings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Details Chart */}
        <div className="lg:col-span-2 card-premium">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Sales Details</h2>
            <select className="bg-[rgba(255,255,255,0.05)] border border-[var(--border-subtle)] text-white text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A0A3B1', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0A3B1', fontSize: 12 }} tickFormatter={(val) => `${val}%`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="value" stroke="#6C63FF" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                {/* Top Sale Annotation using ReferenceDot */}
                <ReferenceDot x="35k" y={100} r={6} fill="#6C63FF" stroke="white" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Event Card */}
        <div className="card-premium flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold">Upcoming Event</h2>
            <button className="text-[var(--text-muted)] hover:text-white"><MoreVertical size={20}/></button>
          </div>
          
          <div className="mt-4 p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[var(--border-subtle)]">
            <div className="flex justify-between items-center mb-4">
               <span className="badge badge-new">New Event</span>
               {VENDOR_DATA.upcomingEvent.lastMonth && <span className="text-xs font-semibold text-[var(--accent-secondary)]">Last Month</span>}
            </div>
            <h3 className="text-xl font-display font-bold mb-2">{VENDOR_DATA.upcomingEvent.name}</h3>
            <div className="space-y-2 mb-6 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-2"><CalendarIcon size={16}/> {VENDOR_DATA.upcomingEvent.date}</div>
              <div className="flex items-center gap-2"><Clock size={16}/> {VENDOR_DATA.upcomingEvent.time}</div>
              <div className="flex items-center gap-2 mt-4 text-white font-semibold">
                 Total Bookings: <span className="text-[var(--accent-primary)] ml-1">{VENDOR_DATA.upcomingEvent.bookings}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button className="flex-1 btn-outline text-xs py-2"><Edit size={14} className="mr-1"/> Edit</button>
              <button className="flex-1 btn-primary text-xs py-2"><Users size={14} className="mr-1"/> View</button>
              <button className="flex-1 btn-danger text-xs py-2">Pause</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar UI */}
        <div className="card-premium">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold">January 2026</h2>
             <div className="flex gap-2">
               <button className="p-1 rounded bg-[rgba(255,255,255,0.05)] hover:bg-[var(--accent-primary)] transition-colors"><ChevronLeft size={16}/></button>
               <button className="p-1 rounded bg-[rgba(255,255,255,0.05)] hover:bg-[var(--accent-primary)] transition-colors"><ChevronRight size={16}/></button>
             </div>
           </div>
           
           <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[var(--text-muted)] mb-4">
             {['S','M','T','W','T','F','S'].map((d,i) => <div key={i}>{d}</div>)}
           </div>
           
           <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
             {/* Mock Calendar Grid */}
             {Array.from({length: 31}).map((_, i) => {
                const date = i + 1;
                const isSelected = date === 20;
                const hasEvent = [5, 12, 20, 25].includes(date);
                return (
                  <div key={i} className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full relative cursor-pointer
                    ${isSelected ? 'bg-[var(--accent-primary)] text-white shadow-glow-custom' : 'text-white hover:bg-[rgba(255,255,255,0.1)]'}`}>
                    {date}
                    {hasEvent && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-[var(--accent-secondary)] rounded-full"></span>}
                  </div>
                )
             })}
           </div>

           <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
             <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--accent-green)]"></span> Confirmed</div>
             <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--accent-warm)]"></span> Cancelled</div>
             <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]"></span> Pending</div>
           </div>
        </div>

        {/* Recent Enquiries */}
        <div className="card-premium lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Enquiries</h2>
            <button className="text-sm text-[var(--accent-primary)] hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {VENDOR_DATA.enquiries.map((person, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer border border-transparent hover:border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center font-bold">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{person.name}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{person.event !== '-' ? person.event : 'General Inquiry'}</p>
                  </div>
                </div>
                <span className={`badge ${person.statusClass} text-[10px] px-2`}>{person.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Events */}
        <div className="card-premium lg:col-span-1 flex flex-col justify-between">
           <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Popular Events</h2>
                <button className="text-[var(--text-muted)] hover:text-white"><MoreVertical size={20}/></button>
              </div>

              <div className="space-y-6">
                {VENDOR_DATA.popularEvents.map((event, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex -space-x-2">
                        {event.images.map((img, i) => (
                          <img key={i} src={img} className="w-8 h-8 rounded-full border-2 border-[var(--bg-surface)] object-cover" alt="Attendee" />
                        ))}
                      </div>
                      <h4 className="font-semibold text-sm flex-1">{event.name}</h4>
                      <span className="font-bold text-[var(--accent-primary)]">{event.percentage}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full" 
                        style={{ width: `${event.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Order Pending Block inside Popular Events column, as seen in layout requests? Actually, an Order Pending Section is mentioned. I will add it here as a small card */}
           <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[rgba(255,209,102,0.1)] to-[rgba(255,209,102,0.05)] border border-[rgba(255,209,102,0.2)] flex justify-between items-center">
             <div>
               <h4 className="font-bold text-[var(--text-primary)]">Order Pending</h4>
               <p className="text-xs text-[var(--text-secondary)] mt-1">You have 12 pending orders.</p>
             </div>
             <button className="btn-primary py-1.5 px-4 text-xs">Review</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
