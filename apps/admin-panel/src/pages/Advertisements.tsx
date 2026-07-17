import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, PauseCircle, Activity, DollarSign, Eye, MousePointer2, Image as ImageIcon, Calendar, Plus, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminAdvertisements, useUpdateAdvertisementStatus } from '../hooks/useAdvertisements';

interface Ad {
    id: string;
    campaignName: string;
    vendorName: string;
    adType: 'Banner' | 'Native' | 'Video';
    status: 'pending' | 'active' | 'paused' | 'rejected';
    dailyBudget: number;
    totalBudget: number;
    startDate: string;
    endDate: string;
    impressions: number;
    clicks: number;
}

const Advertisements: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: adsData, isLoading } = useAdminAdvertisements();
    const updateStatusMutation = useUpdateAdvertisementStatus();

    const ads: Ad[] = adsData || [];

    const updateAdStatus = async (id: string, status: Ad['status']) => {
        await updateStatusMutation.mutateAsync({ id, status });
    };

    const filteredAds = ads.filter(ad => 
        ad.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-200';
            case 'paused': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-indigo-50 text-indigo-600 border-indigo-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">Advertisements</h1>
                    <p className="text-sm font-medium text-[var(--ease2event-text-secondary)] mt-1">Manage vendor ad campaigns and monitor performance</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                    <Plus size={18} />
                    <span>Create Campaign</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search campaigns or vendors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Ad Card (Drag & Drop Preview) */}
                <div className="bg-gray-50 dark:bg-slate-900/50 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-[32px] p-8 flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group min-h-[400px]">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <UploadCloud size={28} className="text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Drag & Drop Media</h3>
                    <p className="text-sm text-gray-500 max-w-sm mb-6">Upload banner images or promotional videos to preview ad placement instantly.</p>
                    <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white font-bold rounded-xl shadow-sm hover:border-indigo-500 transition-colors">
                        Browse Files
                    </button>
                </div>

                {filteredAds.map((ad) => (
                    <div key={ad.id} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col justify-between min-h-[400px]">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{ad.campaignName}</h3>
                                    <p className="text-sm font-medium text-indigo-600 mb-3">{ad.vendorName}</p>
                                    <div className="flex gap-2">
                                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${getStatusColor(ad.status)}`}>
                                            {ad.status}
                                        </span>
                                        <span className="text-xs px-3 py-1 rounded-full font-bold uppercase border bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 flex items-center gap-1">
                                            {ad.adType === 'Video' ? <Activity size={12}/> : <ImageIcon size={12}/>}
                                            {ad.adType}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">₹{ad.totalBudget.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 font-medium">₹{ad.dailyBudget}/day</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-6 text-sm font-medium text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                                <Calendar size={16} className="text-gray-400" />
                                {ad.startDate} — {ad.endDate}
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl flex flex-col gap-1 border border-indigo-100 dark:border-indigo-900/30">
                                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1"><Eye size={12}/> Impressions</p>
                                    <p className="text-lg font-black text-indigo-900 dark:text-indigo-300">{ad.impressions.toLocaleString()}</p>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl flex flex-col gap-1 border border-emerald-100 dark:border-emerald-900/30">
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1"><MousePointer2 size={12}/> Clicks</p>
                                    <p className="text-lg font-black text-emerald-900 dark:text-emerald-300">{ad.clicks.toLocaleString()}</p>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl flex flex-col gap-1 border border-amber-100 dark:border-amber-900/30">
                                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1"><Activity size={12}/> CTR</p>
                                    <p className="text-lg font-black text-amber-900 dark:text-amber-300">
                                        {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0'}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex gap-3">
                            {ad.status === 'pending' && (
                                <>
                                    <button onClick={() => updateAdStatus(ad.id, 'active')} className="flex-1 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                                        <CheckCircle size={18} /> Approve
                                    </button>
                                    <button onClick={() => updateAdStatus(ad.id, 'rejected')} className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                                        <XCircle size={18} /> Reject
                                    </button>
                                </>
                            )}
                            {ad.status === 'active' && (
                                <button onClick={() => updateAdStatus(ad.id, 'paused')} className="flex-1 py-3 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                                    <PauseCircle size={18} /> Pause Campaign
                                </button>
                            )}
                            {(ad.status === 'paused' || ad.status === 'rejected') && (
                                <button onClick={() => updateAdStatus(ad.id, 'active')} className="flex-1 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                                    <Activity size={18} /> Resume Campaign
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Advertisements;
