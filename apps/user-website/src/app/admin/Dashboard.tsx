import React from 'react';
import { TrendingUp, Users, Store, DollarSign, ArrowUpRight, ShieldAlert, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend, AreaChart, Area } from 'recharts';

const AdminDashboard: React.FC = () => {
    const stats = [
        { label: 'Platform Revenue', value: '₹45.2L', change: '+12%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Active Business Accounts', value: '1,240', change: '+8%', icon: Store, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { label: 'Registered Clients', value: '85.4k', change: '+24%', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50' },
        { label: 'Expansion Rate', value: '18.2%', change: '+2%', icon: TrendingUp, color: 'text-sky-500', bg: 'bg-sky-50' },
    ];

    const growthData = [
        { name: 'Jan', users: 4000, vendors: 240 },
        { name: 'Feb', users: 3000, vendors: 139 },
        { name: 'Mar', users: 5000, vendors: 980 },
        { name: 'Apr', users: 2780, vendors: 390 },
        { name: 'May', users: 4890, vendors: 480 },
        { name: 'Jun', users: 6390, vendors: 380 },
        { name: 'Jul', users: 8490, vendors: 430 },
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

    const COLORS = ['#ef4444', '#0f172a', '#64748b', '#94a3b8'];

    return (
        <div className="space-y-10 animate-fadeIn">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Platform Command Terminal</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Status: Operational • Global Node</p>
                </div>
                <div className="flex gap-3">
                   <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                       <ShieldAlert size={16} /> Security Audit
                   </button>
                   <button className="px-6 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95 flex items-center gap-2">
                       <BarChart3 size={16} /> Export Intel
                   </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-500 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                {stat.change} <ArrowUpRight size={14} className="ml-1" />
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 leading-none">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">User & Business Acquisition</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-600" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">Users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-900" />
                                <span className="text-[10px] font-black text-slate-400 uppercase">Businesses</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
                                    labelStyle={{ color: '#fff', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '10px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                                <Area type="monotone" dataKey="vendors" stroke="#0f172a" strokeWidth={4} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-10">B2B Segments</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {categoryData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{entry.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{((entry.value/1200)*100).toFixed(0)}% SHARE</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Economic Volume vs Commissions</h3>
                    <div className="flex gap-2">
                        <button className="px-5 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">Quarterly View</button>
                    </div>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} tickFormatter={(val) => `₹${val / 100000}L`} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
                                labelStyle={{ color: '#fff', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '10px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(val: number) => `₹${val.toLocaleString()}`}
                            />
                            <Bar dataKey="revenue" name="Volume" fill="#0f172a" radius={[12, 12, 0, 0]} barSize={40} />
                            <Bar dataKey="commission" name="Revenue" fill="#ef4444" radius={[12, 12, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest shadow-red-500/10">Vetting Queue</h2>
                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">3 Actions Required</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Glow Makeup Studio', type: 'Beauty & Wellness', city: 'Mumbai', rate: '92%' },
                            { name: 'Royal Palace Banquet', type: 'Hospitality', city: 'Delhi', rate: '85%' },
                            { name: 'Flash Moments', type: 'Creative Services', city: 'Bangalore', rate: '78%' }
                        ].map((vendor, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-white hover:bg-white hover:shadow-xl transition-all group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-red-50 shadow-red-600/10">
                                        {vendor.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 uppercase tracking-tight">{vendor.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{vendor.type} • {vendor.city}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Score: {vendor.rate}</p>
                                    <span className="text-[10px] font-black bg-white text-slate-400 px-3 py-1 rounded-full uppercase border border-slate-100 group-hover:bg-red-600 group-hover:text-white transition-all">Review Profile</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Global Activity Feed</h2>
                        <Activity size={20} className="text-red-500 animate-pulse" />
                    </div>
                    <div className="space-y-8 flex-1">
                        {[
                            { user: 'Rahul S.', type: 'profile_view', target: 'Royal Palace', time: '10s ago' },
                            { user: 'Priya K.', type: 'category_view', target: 'Photography', time: '2m ago' },
                            { user: 'Amit M.', type: 'save_bookmark', target: 'Flash Moments', time: '1h ago' },
                            { user: 'Admin 04', type: 'audit_log', target: 'Payout Processed', time: '2h ago' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-6 relative group">
                                {i !== 3 && <div className="absolute left-[7px] top-6 w-0.5 h-12 bg-slate-100" />}
                                <div className="flex flex-col items-center flex-shrink-0 z-10">
                                    <div className="w-4 h-4 bg-white border-4 border-red-500 rounded-full shadow-lg group-hover:scale-125 transition-transform"></div>
                                </div>
                                <div className="pb-2">
                                    <p className="text-[12px] text-slate-600 leading-tight">
                                        <span className="font-black text-slate-900 uppercase tracking-tight">{activity.user}</span> 
                                        <span className="text-slate-400 lowercase mx-1">initiated</span>
                                        <span className="font-black text-red-600 uppercase tracking-tight">{activity.type.replace('_', ' ')}</span>
                                        <span className="text-slate-400 lowercase mx-1">on</span>
                                        <span className="font-black text-slate-900 uppercase tracking-tight">{activity.target}</span>
                                    </p>
                                    <p className="text-[10px] font-black text-slate-300 uppercase mt-1 tracking-widest">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
