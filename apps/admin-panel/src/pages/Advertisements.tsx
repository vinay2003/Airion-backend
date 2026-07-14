import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, PauseCircle, Activity, DollarSign, Eye, MousePointer2 } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface Ad {
    id: string;
    campaignName: string;
    vendorId: string;
    adType: string;
    status: 'draft' | 'pending' | 'active' | 'paused' | 'completed' | 'rejected';
    dailyBudget: number;
    totalBudget: number;
    startDate: string;
    endDate: string;
    impressions: number;
    clicks: number;
    createdAt: string;
}

const Advertisements: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAds = async () => {
        try {
            const data = await api.get('/ads') as any;
            if (Array.isArray(data)) {
                setAds(data);
            } else if (data && Array.isArray(data.data)) {
                setAds(data.data);
            }
        } catch (error: any) {
            toast.error('Failed to load advertisements: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const updateAdStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/ads/${id}/status`, { status });
            toast.success(`Ad status updated to ${status}`);
            fetchAds();
        } catch (error: any) {
            toast.error('Failed to update status');
        }
    };

    const filteredAds = ads.filter(ad => 
        ad.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.adType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className=" rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
            case 'paused': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
            default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        }
    };

    return (
        <div className="space-y-8  fade-in ">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Advertisements</h1>
                    <p className="text-sm font-medium text-gray-400 dark:text-slate-500 mt-2">Manage vendor ad campaigns</p>
                </div>
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 " size={20} />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 h-14 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500  font-medium text-sm dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredAds.map((ad) => (
                    <div key={ad.id} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-gray-50 dark:border-slate-800  ">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{ad.campaignName}</h3>
                                <div className="flex gap-2">
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${getStatusColor(ad.status)}`}>
                                        {ad.status}
                                    </span>
                                    <span className="text-xs px-3 py-1 rounded-full font-bold uppercase border bg-indigo-500/10 text-indigo-600 border-indigo-500/20">
                                        {ad.adType}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-gray-900 dark:text-white">₹{ad.totalBudget}</p>
                                <p className="text-xs text-gray-400 font-medium">₹{ad.dailyBudget}/day</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-500"><Eye size={20}/></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Impressions</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-white">{ad.impressions}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-500"><MousePointer2 size={20}/></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Clicks</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-white">{ad.clicks}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 dark:border-slate-800 flex gap-3">
                            {ad.status === 'pending' && (
                                <>
                                    <button onClick={() => updateAdStatus(ad.id, 'active')} className="flex-1 h-12 bg-emerald-500 text-white rounded-xl font-bold text-sm   flex items-center justify-center gap-2">
                                        <CheckCircle size={18} /> Approve
                                    </button>
                                    <button onClick={() => updateAdStatus(ad.id, 'rejected')} className="flex-1 h-12 bg-red-50 text-red-600 rounded-xl font-bold text-sm   flex items-center justify-center gap-2">
                                        <XCircle size={18} /> Reject
                                    </button>
                                </>
                            )}
                            {ad.status === 'active' && (
                                <button onClick={() => updateAdStatus(ad.id, 'paused')} className="flex-1 h-12 bg-amber-50 text-amber-600 rounded-xl font-bold text-sm   flex items-center justify-center gap-2">
                                    <PauseCircle size={18} /> Pause Campaign
                                </button>
                            )}
                            {(ad.status === 'paused' || ad.status === 'rejected') && (
                                <button onClick={() => updateAdStatus(ad.id, 'active')} className="flex-1 h-12 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm   flex items-center justify-center gap-2">
                                    <Activity size={18} /> Resume Campaign
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredAds.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-8 bg-neutral-50 dark:bg-slate-900 rounded-[40px] mb-4">
                        <DollarSign size={48} className="text-gray-300 dark:text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">No advertisements found</h3>
                </div>
            )}
        </div>
    );
};

export default Advertisements;
