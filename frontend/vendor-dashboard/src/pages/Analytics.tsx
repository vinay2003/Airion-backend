import React from 'react';
import { TrendingUp, Eye, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics: React.FC = () => {
    const stats = [
        { label: 'Total Views', value: '24.5k', change: '+12%', trend: 'up', icon: Eye, color: 'blue' },
        { label: 'Inquiries', value: '142', change: '+5%', trend: 'up', icon: Users, color: 'green' },
        { label: 'Conversion Rate', value: '18.2%', change: '-2%', trend: 'down', icon: TrendingUp, color: 'purple' },
        { label: 'Revenue', value: '₹12.4L', change: '+18%', trend: 'up', icon: DollarSign, color: 'red' },
    ];

    const viewsData = [
        { name: 'Mon', views: 4000, inquiries: 24 },
        { name: 'Tue', views: 3000, inquiries: 13 },
        { name: 'Wed', views: 2000, inquiries: 98 },
        { name: 'Thu', views: 2780, inquiries: 39 },
        { name: 'Fri', views: 1890, inquiries: 48 },
        { name: 'Sat', views: 2390, inquiries: 38 },
        { name: 'Sun', views: 3490, inquiries: 43 },
    ];

    const revenueData = [
        { name: 'Jan', revenue: 45000 },
        { name: 'Feb', revenue: 52000 },
        { name: 'Mar', revenue: 48000 },
        { name: 'Apr', revenue: 61000 },
        { name: 'May', revenue: 55000 },
        { name: 'Jun', revenue: 67000 },
    ];

    const topVenues = [
        { name: 'Grand Ballroom', bookings: 45, revenue: '₹4.2L' },
        { name: 'Sunset Garden', bookings: 32, revenue: '₹3.1L' },
        { name: 'Royal Palace Hall', bookings: 28, revenue: '₹5.1L' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-gray-500 dark:text-slate-400">Track your performance and insights</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all hover:-translate-y-1 transform">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-500`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up'
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                                : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                }`}>
                                {stat.change}
                                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Views & Inquiries Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Views & Inquiries</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={viewsData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#ef4444" fillOpacity={1} fill="url(#colorViews)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Monthly Revenue</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Performing Venues */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Performing Venues</h2>
                <div className="space-y-4">
                    {topVenues.map((venue, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{venue.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">{venue.bookings} bookings</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900 dark:text-white text-lg">{venue.revenue}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Total Revenue</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
