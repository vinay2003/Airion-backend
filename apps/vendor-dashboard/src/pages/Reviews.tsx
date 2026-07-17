import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Filter, Search, ChevronDown, User, Reply, MoreVertical, TrendingUp } from 'lucide-react';
import { Button, Badge } from '@ease2event/ui';

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
 <div className="space-y-5 pb-6">
 <header className="space-y-4 border-b border-[var(--ease2event-border-subtle)] pb-6">
 <h1 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Reviews</h1>
 <p className="text-lg font-semibold text-[var(--ease2event-text-secondary)]">Manage your reputation and interact with your clients performance.</p>
 </header>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {/* Stats Sidebar */}
 <div className="lg:col-span-1 space-y-5">
 <div className="card-minimal p-6 rounded-xl border-[var(--ease2event-border-base)] text-center space-y-6">
 <div className="text-6xl font-bold text-[var(--ease2event-text-primary)] tracking-tighter">{stats.average}</div>
 <div className="flex justify-center gap-2">
 {[1, 2, 3, 4, 5].map((s) => (
 <Star key={s} size={16} className={s <= Math.floor(stats.average) ? 'text-yellow-400 fill-yellow-400 drop-' : 'text-[var(--ease2event-border-base)]'} />
 ))}
 </div>
 <p className="text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-widest">{stats.total} Total Reviews</p>

 <div className="mt-12 space-y-4 pt-8 border-t border-[var(--ease2event-border-subtle)]">
 {stats.distribution.map((d) => (
 <div key={d.stars} className="flex items-center gap-4">
 <span className="text-[10px] font-bold text-[var(--ease2event-text-secondary)] w-4 tracking-tighter">{d.stars}★</span>
 <div className="flex-1 h-2.5 bg-[var(--ease2event-bg-elevated)] rounded-full overflow-hidden border border-[var(--ease2event-border-subtle)]">
 <div className="h-full bg-yellow-400 rounded-full " style={{ width: `${d.percentage}%` }}></div>
 </div>
 <span className="text-[10px] font-bold text-[var(--ease2event-text-primary)] min-w-[30px]">{d.percentage}%</span>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-[var(--ease2event-bg-surface)] border border-blue-500/20 p-6 rounded-xl space-y-4 relative overflow-hidden group">
 <div className="absolute -top-6 -right-10 w-32 h-32 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform " />
 <div className="flex items-center gap-3 text-blue-500">
 <TrendingUp size={16} />
 <h3 className="font-bold text-sm uppercase tracking-widest">Growth Insights</h3>
 </div>
 <p className="text-sm font-semibold text-[var(--ease2event-text-primary)] leading-relaxed tracking-tight">
 Replying within <span className="text-blue-500">24 hours</span> increases your conversion probability by <span className="text-emerald-500">15%</span>. Faster responses lead to higher trust.
 </p>
 </div>
 </div>

 {/* Reviews List */}
 <div className="lg:col-span-2 space-y-6">
 <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-[var(--ease2event-bg-elevated)] p-3 rounded-lg border border-[var(--ease2event-border-subtle)] ">
 <div className="flex bg-[var(--ease2event-bg-surface)] p-1.5 rounded-xl w-full sm:w-auto border border-[var(--ease2event-border-subtle)]">
 {['all', 'positive', 'negative', 'no_reply'].map((t) => (
 <button
 key={t}
 onClick={() => setFilter(t)}
 className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all tracking-widest ${filter === t
 ? 'bg-[var(--ease2event-brand-primary)] text-white '
 : 'text-[var(--ease2event-text-muted)] hover:text-[var(--ease2event-text-primary)]'}`}
 >
 {(() => {
 const labels: { [key: string]: string } = {
 all: 'All Reviews',
 positive: 'Positive',
 negative: 'Critical',
 no_reply: 'Pending Reply'
 };
 return labels[t] || t;
 })()}
 </button>
 ))}
 </div>
 <div className="relative w-full sm:w-72 group px-2">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--ease2event-text-secondary)] group-focus-within:text-[var(--ease2event-brand-primary)] transition-colors" size={16} />
 <input
 type="text"
 placeholder="Search reviews..."
 className="w-full pl-14 pr-6 py-3.5 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] rounded-xl text-xs font-bold uppercase tracking-tight focus:ring-4 focus:ring-[var(--ease2event-brand-primary)]/10 text-[var(--ease2event-text-primary)] outline-none placeholder-[var(--ease2event-text-secondary)]"
 />
 </div>
 </div>

 <div className="space-y-6">
 {REVIEWS_DATA.map((rev) => (
 <div key={rev.id} className="card-minimal p-6 rounded-xl border-[var(--ease2event-border-base)] transition-all group relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--ease2event-brand-primary)]/5 rounded-bl-full translate-x-12 -translate-y-12 transition-transform "></div>

 <div className="flex justify-between items-start mb-8 flex-col sm:flex-row gap-6">
 <div className="flex gap-6 items-center">
 <div className="relative">
 <img src={rev.avatar} className="w-16 h-12 rounded-2xl object-cover border-2 border-[var(--ease2event-border-subtle)] transition-transform" alt={rev.user} />
 <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[var(--ease2event-bg-surface)]"></div>
 </div>
 <div className="space-y-1.5">
 <h4 className="font-bold text-xl text-[var(--ease2event-text-primary)] tracking-tight">{rev.user}</h4>
 <div className="flex items-center gap-3">
 <div className="flex gap-1">
 {[1, 2, 3, 4, 5].map((s) => (
 <Star key={s} size={14} className={s <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--ease2event-border-subtle)]'} />
 ))}
 </div>
 <span className="text-[10px] text-[var(--ease2event-text-secondary)] font-bold tracking-widest">{rev.date}</span>
 </div>
 </div>
 </div>
 <Badge className="chip-soft-blue px-5 h-9 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-blue-500/20">
 Service: {rev.service}
 </Badge>
 </div>

 <div className="mb-10 bg-[var(--ease2event-bg-elevated)] p-5 rounded-xl border border-[var(--ease2event-border-subtle)] relative">
 <p className="text-base text-[var(--ease2event-text-primary)] leading-relaxed font-bold">
 "{rev.comment}"
 </p>
 </div>

 {rev.reply ? (
 <div className="bg-[var(--ease2event-bg-surface)] p-5 rounded-xl border-l-8 border-[var(--ease2event-brand-primary)] ml-6 space-y-3">
 <div className="flex items-center gap-3">
 <Reply size={16} className="text-[var(--ease2event-brand-primary)]" />
 <p className="text-[10px] font-bold text-[var(--ease2event-brand-primary)] uppercase tracking-widest">Vendor Response</p>
 </div>
 <p className="text-sm font-bold text-[var(--ease2event-text-secondary)] leading-relaxed">
 {rev.reply}
 </p>
 </div>
 ) : replyingTo === rev.id ? (
 <div className="mt-8 space-y-5 ">
 <textarea
 value={replyText}
 onChange={(e) => setReplyText(e.target.value)}
 placeholder="Write your response to the customer..."
 className="w-full p-5 text-sm font-bold bg-[var(--ease2event-bg-elevated)] border-2 border-[var(--ease2event-border-subtle)] rounded-xl outline-none focus:border-[var(--ease2event-brand-primary)]/40 focus:ring-4 focus:ring-[var(--ease2event-brand-primary)]/5 transition-all resize-none shadow-norm"
 rows={3}
 />
 <div className="flex gap-4">
 <Button
 variant="secondary"
 onClick={() => { setReplyingTo(null); setReplyText(''); }}
 className="px-5 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest"
 >
 Cancel
 </Button>
 <Button className="px-6 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-blue-500/20">
 Send Response
 </Button>
 </div>
 </div>
 ) : (
 <button
 onClick={() => setReplyingTo(rev.id)}
 className="mt-4 flex items-center gap-3 text-[10px] font-bold text-[var(--ease2event-brand-primary)] hover:text-blue-600 transition-all uppercase tracking-widest group"
 >
 <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center transition-transform">
 <Reply size={14} />
 </div>
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
