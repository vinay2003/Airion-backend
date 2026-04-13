import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Store, DollarSign, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Skeleton, SkeletonText } from '@ease2event/ui';

const Dashboard: React.FC = () => {
    const { data: stats, isLoading: statsLoading } = useQuery<any[]>({
        queryKey: ['admin-stats'],
        queryFn: () => Promise.resolve([
            { label: 'Total Revenue', value: '₹45.2L', change: '+12%', icon: DollarSign, color: 'emerald' },
            { label: 'Active Vendors', value: '1,240', change: '+8%', icon: Store, color: 'blue' },
            { label: 'Total Users', value: '85.4k', change: '+24%', icon: Users, color: 'purple' },
            { label: 'Growth Rate', value: '18.2%', change: '+2%', icon: TrendingUp, color: 'rose' },
        ]).then(d => new Promise(resolve => setTimeout(() => resolve(d), 1000))) // Mock delay
    });

    const growthData = [
        { name: 'Jan', users: 4000, vendors: 240 },
        { name: 'Feb', users: 3000, vendors: 139 },
        { name: 'Mar', users: 2000, vendors: 980 },
        { name: 'Apr', users: 2780, vendors: 390 },
        { name: 'May', users: 1890, vendors: 480 },
        { name: 'Jun', users: 2390, vendors: 380 },
        { name: 'Jul', users: 3490, vendors: 430 },
    ];

    const categoryData = [
        { name: 'Venues', value: 400 },
        { name: 'Catering', value: 300 },
        { name: 'Decor', value: 300 },
        { name: 'Photo', value: 200 },
    ];

    const revenueData = [
        { name: 'Jan', revenue: 1200000, commission: 120000 },
        { name: 'Feb', revenue: 1500000, commission: 150000 },
        { name: 'Mar', revenue: 2000000, commission: 200000 },
        { name: 'Apr', revenue: 2200000, commission: 220000 },
        { name: 'May', revenue: 1800000, commission: 180000 },
        { name: 'Jun', revenue: 2800000, commission: 280000 },
    ];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="animate-in fade-in duration-500 pb-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">Platform Intel</h1>
                <div className="text-xs font-bold text-[var(--ease2event-text-muted)] bg-[var(--ease2event-bg-elevated)] px-3 py-1.5 rounded-lg border border-[var(--ease2event-border-subtle)] uppercase tracking-wider">Live System Status: Normal</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card-premium h-[160px] flex flex-col justify-center gap-4">
                            <Skeleton variant="circle" width={48} height={48} />
                            <SkeletonText lines={2} />
                        </div>
                    ))
                ) : stats?.map((stat, idx) => (
                    <div key={idx} className="card-premium">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 border border-${stat.color}-100`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                {stat.change} <ArrowUpRight size={14} />
                            </span>
                        </div>
                        <p className="text-[var(--ease2event-text-secondary)] text-sm font-medium mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 card-premium">
                    <h3 className="text-lg font-bold text-[var(--ease2event-text-primary)] mb-6">Network Growth</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="vendors" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card-premium">
                    <h3 className="text-lg font-bold text-[var(--ease2event-text-primary)] mb-6">Market Share</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {categoryData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs font-bold text-[var(--ease2event-text-secondary)]">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-premium mb-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-[var(--ease2event-text-primary)]">Revenue Projections</h3>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Volume</div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">Commission</div>
                    </div>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                tickFormatter={(val) => `₹${val / 100000}L`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px' }}
                                formatter={(val: number) => `₹${val.toLocaleString()}`}
                            />
                            <Bar dataKey="revenue" name="Total Volume" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
                            <Bar dataKey="commission" name="Commission" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-premium">
                    <h2 className="text-lg font-bold text-[var(--ease2event-text-primary)] mb-6">Verification Queue</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Glow Makeup Studio', type: 'Makeup Artist', city: 'Mumbai' },
                            { name: 'Royal Palace Banquet', type: 'Venue', city: 'Delhi' },
                            { name: 'Flash Moments', type: 'Photography', city: 'Bangalore' }
                        ].map((vendor, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border border-[var(--ease2event-border-subtle)] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100">
                                        {vendor.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--ease2event-text-primary)]">{vendor.name}</p>
                                        <p className="text-xs text-[var(--ease2event-text-muted)] font-medium">{vendor.type} • {vendor.city}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">Review</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-premium">
                    <h2 className="text-lg font-bold text-[var(--ease2event-text-primary)] mb-6">Platform Pulse</h2>
                    <div className="space-y-6">
                        {[
                            { user: 'Rahul S.', type: 'profile_view', target: 'Royal Palace', time: '10 mins ago' },
                            { user: 'Priya K.', type: 'category_view', target: 'Photography', time: '25 mins ago' },
                            { user: 'Amit M.', type: 'save_bookmark', target: 'Flash Moments', time: '1 hour ago' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full ring-4 ring-indigo-50"></div>
                                    {i < 2 && <div className="w-0.5 h-full bg-slate-100 my-1"></div>}
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--ease2event-text-secondary)]">
                                        <span className="font-bold text-[var(--ease2event-text-primary)]">{activity.user}</span> {activity.type === 'profile_view' ? 'viewed' : activity.type === 'save_bookmark' ? 'bookmarked' : 'explored'} <span className="text-indigo-600 font-bold">{activity.target}</span>
                                    </p>
                                    <p className="text-[10px] font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
