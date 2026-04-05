import React, { useState } from 'react';
import { AlertCircle, Flag, Trash2, Eye, ShieldAlert, CheckCircle, XCircle, Search, Filter, Mail, User, Store } from 'lucide-react';

interface Report {
    id: string;
    type: 'Review' | 'Listing' | 'User' | 'Message';
    reporter: string;
    target: string;
    reason: string;
    status: 'Pending' | 'Resolved' | 'Dismissed';
    date: string;
}

const Reports: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const reportsData: Report[] = [
        { id: 'R001', type: 'Review', reporter: 'Rahul S.', target: 'Grand Ballroom', reason: 'Abusive language and fake pictures.', status: 'Pending', date: '2024-03-20' },
        { id: 'R002', type: 'Listing', reporter: 'Priya K.', target: 'Dream Photography', reason: 'Owner using my personal wedding photos without permission.', status: 'Pending', date: '2024-03-18' },
        { id: 'R003', type: 'User', reporter: 'Amit V.', target: 'Suresh Kumar', reason: 'Suspicious activity and spamming inbox.', status: 'Resolved', date: '2024-03-15' },
        { id: 'R004', type: 'Review', reporter: 'Neha G.', target: 'Glow makeup Studio', reason: 'Inaccurate pricing information.', status: 'Dismissed', date: '2024-03-10' },
    ];

    const filteredReports = reportsData.filter(r => {
        const matchesSearch = r.reporter.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             r.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             r.reason.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status: Report['status']) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Dismissed': return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeIcon = (type: Report['type']) => {
        switch (type) {
            case 'Review': return <Mail size={14} className="text-blue-500" />;
            case 'Listing': return <Store size={14} className="text-red-500" />;
            case 'User': return <User size={14} className="text-purple-500" />;
            case 'Message': return <AlertCircle size={14} className="text-orange-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Content Moderation</h1>
                    <p className="text-gray-500 dark:text-slate-400">Reports and Flagged content waiting for review</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-red-500/10 shadow-sm flex items-center gap-4 border-l-4 border-l-red-500">
                    <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center text-red-500"><Flag size={24} /></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Flags</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">12</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-yellow-500/10 shadow-sm flex items-center gap-4 border-l-4 border-l-yellow-500">
                    <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-950/30 rounded-2xl flex items-center justify-center text-yellow-500"><ShieldAlert size={24} /></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Review</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">08</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-green-500/10 shadow-sm flex items-center gap-4 border-l-4 border-l-green-500">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-950/30 rounded-2xl flex items-center justify-center text-green-500"><CheckCircle size={24} /></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resolved Today</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">24</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-500/10 shadow-sm flex items-center gap-4 border-l-4 border-l-slate-400">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500"><AlertCircle size={24} /></div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Average TAT</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">2.4h</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Type</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Reporter</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Target</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Reason</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                            {filteredReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all transition-duration-200 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 font-bold text-xs uppercase dark:text-slate-300">
                                            {getTypeIcon(report.type)}
                                            {report.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                                        {report.reporter}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold uppercase tracking-tight">
                                        {report.target}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-1 italic">
                                            "{report.reason}"
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${getStatusStyles(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-500 transition-colors" title="View Details">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-xl text-green-500 transition-colors" title="Resolve">
                                                <CheckCircle size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-red-500 transition-colors" title="Delete Content">
                                                <Trash2 size={18} />
                                            </button>
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
