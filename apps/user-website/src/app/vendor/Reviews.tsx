import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Filter, Search, ChevronDown, User, Reply, MoreVertical } from 'lucide-react';

const REVIEWS_DATA = [
    {
        id: 1,
        user: 'Rahul Singh',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        rating: 5,
        date: '2 days ago',
        comment: 'Absolutely amazing venue and service! The Grand Ballroom was decorated perfectly for our wedding reception. The staff was incredibly helpful throughout the event.',
        service: 'Grand Ballroom',
        reply: 'Thank you Rahul! It was an honor to host your special day. Wishing you a happy married life!',
    },
    {
        id: 2,
        user: 'Priya Verma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        rating: 4,
        date: '1 week ago',
        comment: 'The Sunset Garden is beautiful! Everything went skip-free. Only reason for 4 stars is that the catering setup took slightly longer than expected, but the food was delicious.',
        service: 'Sunset Garden',
        reply: null,
    },
    {
        id: 3,
        user: 'Vikram Mehta',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Professional staff and great coordination. Highly recommended for corporate events.',
        service: 'Corporate Package',
        reply: 'Glad you liked it Vikram! Looking forward to your next corporate booking.',
    }
];

const Reviews: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');

    const stats = {
        average: 4.8,
        total: 124,
        distribution: [
            { stars: 5, percentage: 85 },
            { stars: 4, percentage: 10 },
            { stars: 3, percentage: 3 },
            { stars: 2, percentage: 1 },
            { stars: 1, percentage: 1 },
        ]
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h1>
                <p className="text-gray-500 dark:text-slate-400">Manage your reputation and interact with your clients</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm text-center">
                        <div className="text-5xl font-black text-gray-900 dark:text-white mb-2">{stats.average}</div>
                        <div className="flex justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={20} className={s <= Math.floor(stats.average) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                            ))}
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-sm">{stats.total} total reviews</p>
                        <div className="mt-8 space-y-3">
                            {stats.distribution.map((d) => (
                                <div key={d.stars} className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-400 w-4">{d.stars}</span>
                                    <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${d.percentage}%` }}></div>
                                    </div>
                                    <span className="text-xs text-gray-500 min-w-[30px]">{d.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg shadow-red-500/20 text-white">
                        <h3 className="font-bold text-lg mb-2">Reputation Tip</h3>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Replying within 24 hours increases your booking probability by 15%. Respond to every review to show you care!
                        </p>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl w-full sm:w-auto">
                            {['all', 'positive', 'negative', 'no_reply'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${filter === t 
                                        ? 'bg-white dark:bg-slate-800 text-red-500 shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {t.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search comments..." 
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {REVIEWS_DATA.map((rev) => (
                            <div key={rev.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 dark:bg-white/5 rounded-bl-full translate-x-8 -translate-y-8"></div>
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <img src={rev.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-red-100 dark:border-slate-800" alt={rev.user} />
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">{rev.user}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} size={12} className={s <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">{rev.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-gray-500 font-bold uppercase mb-2 inline-block">
                                        Service: {rev.service}
                                    </span>
                                    <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed italic">
                                        "{rev.comment}"
                                    </p>
                                </div>

                                {rev.reply ? (
                                    <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl border-l-4 border-red-500 ml-4">
                                        <p className="text-[10px] font-black text-red-500 uppercase mb-1">Your Reply</p>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                                            {rev.reply}
                                        </p>
                                    </div>
                                ) : replyingTo === rev.id ? (
                                    <div className="mt-4 space-y-3">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write your response..."
                                            className="w-full p-4 text-sm bg-gray-50 dark:bg-slate-800 border border-red-100 dark:border-red-500/20 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                                            rows={3}
                                        />
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                                            >
                                                Cancel
                                            </button>
                                            <button className="px-6 py-2 bg-red-500 text-white rounded-lg text-xs font-bold shadow-md shadow-red-500/20 active:scale-95 transition-all">
                                                Send Response
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setReplyingTo(rev.id)}
                                        className="mt-2 flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        <Reply size={14} />
                                        Reply to Review
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
