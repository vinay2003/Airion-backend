import React, { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Calendar as CalendarIcon, TrendingUp, TrendingDown, DollarSign, Package, Bell, FileText, Settings, Star, Search, Filter } from 'lucide-react';
import { useAuth } from '@airion/shared/auth';
import { useBookingStore } from '@/lib/store/useBookingStore';
import { useListingStore } from '@/lib/store/useListingStore';
import { Button, Card, Skeleton } from '@/components/ui/index'; // I'll consolidate exports

const CHART_DATA = [
  { name: 'Jan', value: 3200 }, { name: 'Feb', value: 4500 }, { name: 'Mar', value: 3800 },
  { name: 'Apr', value: 5200 }, { name: 'May', value: 6100 }, { name: 'Jun', value: 5800 },
  { name: 'Jul', value: 7200 }, { name: 'Aug', value: 8500 }, { name: 'Sep', value: 7800 },
  { name: 'Oct', value: 9200 }, { name: 'Nov', value: 10500 }, { name: 'Dec', value: 12000 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { bookings, stats: bookingStats, fetchVendorBookings, fetchBookingStats } = useBookingStore();
  const { listings, fetchVendorListings } = useListingStore();

  useEffect(() => {
    if (user?.id) {
      fetchVendorBookings(user.id);
      fetchVendorListings(user.id);
      fetchBookingStats(user.id);
    }
  }, [user?.id]);

  const kpis = [
    { label: 'Confirmed Bookings', value: bookingStats?.confirmedCount || '0', trend: '+12%', icon: FileText, color: 'text-purple-500', bg: 'bg-indigo-50' },
    { label: 'Active Listings', value: listings.filter(l => l.status === 'active').length, icon: Package, color: 'text-green-500', bg: 'bg-emerald-50' },
    { label: 'Pending Requests', value: bookingStats?.pendingCount || '0', trend: '+5%', icon: CalendarIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Total Revenue', value: bookingStats?.totalRevenue || '₹0', trend: '+18%', icon: DollarSign, color: 'text-blue-500', bg: 'bg-sky-50' }
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Business Command Center</h1>
          <p className="text-slate-500 font-medium">Real-time overview of your venue performance and operations</p>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" leftIcon={<Search size={18} />}>Command</Button>
            <Button variant="primary" leftIcon={<FileText size={18} />}>Reports</Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="flex flex-col justify-between border-gray-100 shadow-sm hover:shadow-xl transition-all h-full group bg-white rounded-3xl p-8">
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-4 rounded-[1.5rem] ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                    <kpi.icon size={24} />
                 </div>
                 {kpi.trend && (
                    <div className="flex items-center gap-1 text-[10px] font-black px-2 py-1 bg-slate-50 rounded-lg text-emerald-600 uppercase">
                        <TrendingUp size={12} /> {kpi.trend}
                    </div>
                 )}
              </div>
              <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 leading-none">{kpi.value}</h3>
              </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
            { label: 'Add Service', icon: Package, color: 'bg-indigo-500' },
            { label: 'View Calendar', icon: CalendarIcon, color: 'bg-emerald-500' },
            { label: 'Messages', icon: Bell, color: 'bg-amber-500' },
            { label: 'Analytics', icon: TrendingUp, color: 'bg-rose-500' },
            { label: 'Earnings', icon: DollarSign, color: 'bg-sky-500' },
            { label: 'Settings', icon: Settings, color: 'bg-slate-500' },
        ].map((action, idx) => (
            <button key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-red-500/50 hover:shadow-xl transition-all flex flex-col items-center gap-3 group text-center">
                <div className={`p-3 rounded-2xl text-white ${action.color} group-hover:scale-110 transition-transform shadow-lg`}>
                    <action.icon size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-red-500 transition-colors">{action.label}</span>
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-slate-100 bg-white rounded-3xl p-8">
           <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Revenue Dynamics</h2>
             <div className="flex gap-2">
                <button className="bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Monthly</button>
             </div>
           </div>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A0A3B1', fontSize: 10, fontWeight: 800 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0A3B1', fontSize: 10, fontWeight: 800 }} />
                <Tooltip 
                  contentStyle={{ background: '#fff', borderRadius: '1rem', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}}
                  labelStyle={{ fontWeight: 900, color: '#000', marginBottom: '0.25rem'}}
                />
                <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Service / Rating Summary */}
        <Card className="border-slate-100 bg-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative shadow-sm">
            <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Top Performer</h2>
                {listings.length > 0 ? (
                    <div className="space-y-6">
                        <div className="relative h-48 rounded-[2rem] overflow-hidden group shadow-lg">
                            <img src={listings[0].images?.[0] || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80'} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                                <h3 className="text-white font-black uppercase tracking-tight text-xl">{listings[0].name}</h3>
                                <div className="flex items-center gap-2 text-yellow-400">
                                    <Star size={16} className="fill-yellow-400" />
                                    <span className="font-black text-sm">{listings[0].rating} RATING</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion</p>
                                <h4 className="text-xl font-black text-slate-900">82%</h4>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inquiries</p>
                                <h4 className="text-xl font-black text-slate-900">124</h4>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                        <Package size={40} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase">No services yet</p>
                    </div>
                )}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100">
                 <Button variant="ghost" fullWidth>Optimize Performance</Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rotate-45 translate-x-16 -translate-y-16"></div>
        </Card>
      </div>

      {/* Recent Bookings Section */}
      <Card className="border-slate-100 bg-white rounded-3xl p-10 border-none shadow-sm">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recent Pipeline Transactions</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live updates from the last 24 hours</p>
            </div>
            <Button variant="ghost" rightIcon={<TrendingUp size={16} />}>View Full Log</Button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-all group">
                             <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-sm uppercase">
                                        {booking.userName?.charAt(0)}
                                    </div>
                                    <span className="font-black text-sm text-slate-900 uppercase tracking-tight">{booking.userName}</span>
                                </div>
                             </td>
                             <td className="px-6 py-6 text-xs font-bold text-slate-500 uppercase tracking-tighter">{booking.listingName}</td>
                             <td className="px-6 py-6 text-xs font-bold text-slate-400 uppercase">{new Date(booking.eventDate).toLocaleDateString()}</td>
                             <td className="px-6 py-6 text-sm font-black text-slate-900">₹{booking.amount.toLocaleString()}</td>
                             <td className="px-6 py-6">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                    booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 
                                    booking.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                    {booking.status}
                                </span>
                             </td>
                             <td className="px-6 py-6 text-right">
                                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                                    <TrendingUp size={16} />
                                </button>
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
