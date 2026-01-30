import React from 'react';
import { TrendingUp, Users, Store, DollarSign, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
    const stats = [
        { label: 'Total Revenue', value: '₹45.2L', change: '+12%', icon: DollarSign, color: 'green' },
        { label: 'Active Vendors', value: '1,240', change: '+8%', icon: Store, color: 'blue' },
        { label: 'Total Users', value: '85.4k', change: '+24%', icon: Users, color: 'purple' },
        { label: 'Growth Rate', value: '18.2%', change: '+2%', icon: TrendingUp, color: 'red' },
    ];

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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Platform Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                                {stat.change} <ArrowUpRight size={14} />
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User & Vendor Growth</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                                <Line type="monotone" dataKey="vendors" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Vendor Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-4">
                            {categoryData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Vendor Registrations</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center font-bold text-gray-500 dark:text-slate-400">
                                        V
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">New Vendor {i}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">Wedding Venue • Mumbai</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">Pending</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Platform Activity</h2>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                                    <div className="w-0.5 h-full bg-gray-100 dark:bg-slate-800 my-1"></div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-900 dark:text-slate-200"><span className="font-bold">User {i}</span> made a booking for ₹50,000</p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500">2 hours ago</p>
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
