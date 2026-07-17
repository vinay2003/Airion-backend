import React, { useState } from 'react';
import { BarChart, DollarSign, TrendingUp, Download, Calendar, Filter, Star, MapPin } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { exportToCSV } from '../utils/exportCsv';
import { exportToPDF } from '../utils/exportPdf';
import { useAdminReports } from '../hooks/useReports';

const Reports: React.FC = () => {
    const [timeRange, setTimeRange] = useState('Month');
    const [reportType, setReportType] = useState<'Revenue' | 'Engagement'>('Revenue');

    const { data: reportData, isLoading } = useAdminReports(timeRange);

    const revenueData = reportData?.revenueData || [];
    const conversionData = reportData?.conversionData || [];
    const topVendors = reportData?.topVendors || [];
    const totalRevenue = reportData?.totalRevenue || 0;
    const commissionEarned = reportData?.commissionEarned || 0;
    const avgConversionRate = reportData?.avgConversionRate || 0;

    const formatCurrency = (val: number) => {
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
        return `₹${val}`;
    };

    const handleExportCSV = () => {
        exportToCSV(revenueData, 'Revenue_Report');
    };

    const handleExportPDF = () => {
        exportToPDF({
            filename: 'Revenue_Report',
            title: 'Platform Revenue Report',
            subtitle: `Data for the last ${timeRange.toLowerCase()}`,
            data: revenueData,
            columns: [
                { header: 'Period', dataKey: 'name' },
                { header: 'Ad Revenue (₹)', dataKey: 'adRevenue' },
                { header: 'Subscriptions (₹)', dataKey: 'subRevenue' },
                { header: 'Commission (₹)', dataKey: 'commission' },
            ]
        });
    };

    return (
        <div className="fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">Analytics & Reports</h1>
                    <p className="text-sm font-medium text-[var(--ease2event-text-secondary)] mt-1">Platform performance and revenue insights</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-1">
                        {['Week', 'Month', 'Year'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${
                                    timeRange === range 
                                    ? 'bg-gray-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' 
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                    >
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <Download size={18} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            {/* Quick KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center justify-between group">
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{formatCurrency(totalRevenue)}</h3>
                        <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-2">
                            <TrendingUp size={12} /> +12.5% vs last {timeRange.toLowerCase()}
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DollarSign size={28} />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center justify-between group">
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1">Commission Earned</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{formatCurrency(commissionEarned)}</h3>
                        <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-2">
                            <TrendingUp size={12} /> +8.2% vs last {timeRange.toLowerCase()}
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BarChart size={28} />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center justify-between group">
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1">Avg. Conversion Rate</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{avgConversionRate}%</h3>
                        <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-2">
                            <TrendingUp size={12} /> +2.1% vs last {timeRange.toLowerCase()}
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingUp size={28} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Breakdown</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setReportType('Revenue')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${reportType === 'Revenue' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}>Revenue</button>
                            <button onClick={() => setReportType('Engagement')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${reportType === 'Engagement' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}>Engagement</button>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            {reportType === 'Revenue' ? (
                                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAd" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="adRevenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAd)" name="Ad Revenue" />
                                    <Area type="monotone" dataKey="subRevenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSub)" name="Subscriptions" />
                                </AreaChart>
                            ) : (
                                <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="adRevenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} name="Active Users" />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Rates by Occasion */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Conversion Rates</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={conversionData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="rate" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} name="Conv. Rate %" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Performing Vendors Leaderboard */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Performing Vendors</h2>
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bookings</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {topVendors.map((vendor, i) => (
                                <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                                            #{i + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white">{vendor.name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={10} /> {vendor.city}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">{vendor.revenue}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{vendor.bookings}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                                            {vendor.rating} <Star size={14} className="text-amber-500 fill-amber-500" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
