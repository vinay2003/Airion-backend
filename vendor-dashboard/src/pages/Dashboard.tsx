import React, { useState, useEffect } from 'react';
import { Eye, MessageSquare, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
    const [activities, setActivities] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activitiesResponse, eventsResponse] = await Promise.all([
                    fetch('http://localhost:3001/activities'),
                    fetch('http://localhost:3001/events')
                ]);

                if (!activitiesResponse.ok || !eventsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const activitiesData = await activitiesResponse.json();
                const eventsData = await eventsResponse.json();

                setActivities(activitiesData);
                setEvents(eventsData);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = [
        { label: 'Total Views', value: '24.5k', change: '+12%', trend: 'up', icon: Eye, color: 'blue' },
        { label: 'Active Leads', value: '142', change: '+5%', trend: 'up', icon: MessageSquare, color: 'green' },
        { label: 'Bookings', value: '28', change: '-2%', trend: 'down', icon: Calendar, color: 'purple' },
        { label: 'Revenue', value: '₹12.4L', change: '+18%', trend: 'up', icon: TrendingUp, color: 'red' },
    ];

    const data = [
        { name: 'Mon', views: 4000, leads: 24 },
        { name: 'Tue', views: 3000, leads: 13 },
        { name: 'Wed', views: 2000, leads: 98 },
        { name: 'Thu', views: 2780, leads: 39 },
        { name: 'Fri', views: 1890, leads: 48 },
        { name: 'Sat', views: 2390, leads: 38 },
        { name: 'Sun', views: 3490, leads: 43 },
    ];

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                        <p className="text-gray-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
                    </div>
                    <a href="/plan-event" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all hover:-translate-y-1 flex items-center gap-2">
                        <TrendingUp size={20} />
                        Plan New Event
                    </a>
                </div>
            </div>

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
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Views Overview</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
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

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Leads Generated</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                        <button className="text-red-500 text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {activities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 pb-6 border-b border-gray-100 dark:border-slate-800 last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-bold text-gray-500 dark:text-slate-400">
                                    {activity.user[0]}
                                </div>
                                <div>
                                    <p className="text-gray-900 dark:text-slate-200 text-sm">
                                        <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-medium text-red-500">{activity.target}</span>
                                    </p>
                                    <p className="text-gray-400 dark:text-slate-500 text-xs mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Upcoming Bookings</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-gray-900 dark:text-white">Dec {10 + i}</span>
                                    <span className="text-xs bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">Confirmed</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Wedding Reception</p>
                                <p className="text-xs text-gray-400 dark:text-slate-500">10:00 AM - 11:00 PM</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        View Calendar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
