import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Zap, Eye, MousePointer, Check } from 'lucide-react';
import { Button, Badge } from '@ease2event/ui';

const Promotions: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-24">
            <header className="space-y-4 border-b border-[var(--ease2event-border-subtle)] pb-10">
                <h1 className="text-3xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Ads & Promotions</h1>
                <p className="text-lg font-semibold text-[var(--ease2event-text-secondary)]">Boost your visibility and get more bookings with our premium promotion tools.</p>
            </header>

            {/* Active Campaigns */}
            <div className="card-minimal !p-10 shadow-xl border-[var(--ease2event-border-base)] rounded-[2.5rem]">
                <h2 className="text-2xl font-bold text-[var(--ease2event-text-primary)] mb-8 tracking-tight">Active Campaigns</h2>
                <div className="p-16 text-center bg-[var(--ease2event-bg-elevated)] rounded-[2rem] border-2 border-dashed border-[var(--ease2event-border-subtle)] space-y-6">
                    <div className="w-24 h-24 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg border border-blue-500/20">
                        <Zap size={48} />
                    </div>
                    <div className="max-w-md mx-auto space-y-3">
                        <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)]">Scale Your Growth</h3>
                        <p className="text-sm text-[var(--ease2event-text-secondary)] font-semibold tracking-tight">You don't have any active campaigns running.</p>
                    </div>
                    <Button className="h-14 px-10 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/10">
                        Create New Campaign
                    </Button>
                </div>
            </div>

            {/* Promotion Packages */}
            <div className="space-y-10">
                <h2 className="text-2xl font-bold text-[var(--ease2event-text-primary)] tracking-tight pl-2">Promotion Packages</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Featured Listing */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="card-minimal !p-10 shadow-xl border-[var(--ease2event-border-base)] rounded-[2.5rem] relative overflow-hidden group hover:border-amber-500/40 transition-all duration-500"
                    >
                        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-8 border border-amber-500/20 shadow-lg group-hover:bg-amber-500 group-hover:text-white transition-all">
                            <Award size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--ease2event-text-primary)] mb-3 tracking-tight">Featured Listing</h3>
                        <p className="text-[var(--ease2event-text-secondary)] text-sm font-semibold mb-6 tracking-tight">Get top placement in your category search results.</p>
                        <div className="text-4xl font-bold text-[var(--ease2event-text-primary)] mb-10 tracking-tighter">₹999<span className="text-sm font-bold text-[var(--ease2event-text-secondary)] ml-2 uppercase tracking-widest">/week</span></div>

                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-4 text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-widest">
                                <div className="p-1.5 bg-green-500/10 rounded-full text-green-500">
                                    <Check size={14} />
                                </div>
                                <span>Top 3 Search Results</span>
                            </li>
                            <li className="flex items-center gap-4 text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-widest">
                                <div className="p-1.5 bg-green-500/10 rounded-full text-green-500">
                                    <Check size={14} />
                                </div>
                                <span>"Featured" Badge</span>
                            </li>
                        </ul>
                        <Button variant="secondary" className="w-full h-14 rounded-2xl font-bold text-xs uppercase tracking-widest border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-elevated)]">
                            Select Plan
                        </Button>
                    </motion.div>

                    {/* Banner Ads */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="card-minimal !p-10 shadow-2xl border-2 border-[var(--ease2event-brand-primary)] rounded-[2.5rem] relative overflow-hidden group transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 bg-[var(--ease2event-brand-primary)] text-white text-[10px] font-bold px-5 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg">POPULAR</div>
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8 border border-blue-500/20 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--ease2event-text-primary)] mb-3 tracking-tight">Homepage Banner</h3>
                        <p className="text-[var(--ease2event-text-secondary)] text-sm font-semibold mb-6 tracking-tight">Display your banner on the main homepage carousel.</p>
                        <div className="text-4xl font-bold text-[var(--ease2event-text-primary)] mb-10 tracking-tighter">₹2,499<span className="text-sm font-bold text-[var(--ease2event-text-secondary)] ml-2 uppercase tracking-widest">/week</span></div>

                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-4 text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-widest">
                                <div className="p-1.5 bg-green-500/10 rounded-full text-green-500">
                                    <Check size={14} />
                                </div>
                                <span>Homepage Visibility</span>
                            </li>
                            <li className="flex items-center gap-4 text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-widest">
                                <div className="p-1.5 bg-green-500/10 rounded-full text-green-500">
                                    <Check size={14} />
                                </div>
                                <span>High CTR Format</span>
                            </li>
                            <li className="flex items-center gap-4 text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-widest">
                                <div className="p-1.5 bg-green-500/10 rounded-full text-green-500">
                                    <Check size={14} />
                                </div>
                                <span>Priority Support</span>
                            </li>
                        </ul>
                        <Button className="w-full h-14 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">
                            Select Plan
                        </Button>
                    </motion.div>

                    {/* Sponsored Package */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="card-minimal !p-10 shadow-xl border-[var(--ease2event-border-base)] rounded-[2.5rem] relative overflow-hidden group hover:border-purple-500/40 transition-all duration-500"
                    >
                        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-8 border border-purple-500/20 shadow-lg group-hover:bg-purple-600 group-hover:text-white transition-all">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--ease2event-text-primary)] mb-3 tracking-tight">Sponsored Package</h3>
                        <p className="text-[var(--ease2event-text-secondary)] text-sm font-semibold mb-6 tracking-tight">Promote your special packages in the Packages section.</p>
                        <div className="text-4xl font-bold text-[var(--ease2event-text-primary)] mb-10 tracking-tighter">₹1,499<span className="text-sm font-bold text-[var(--ease2event-text-secondary)] ml-2 uppercase tracking-widest">/week</span></div>

                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-4 text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-widest">
                                <div className="p-1.5 bg-green-500/10 rounded-full text-green-500">
                                    <Check size={14} />
                                </div>
                                <span>Packages Page Feature</span>
                            </li>
                            <li className="flex items-center gap-4 text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-widest">
                                <div className="p-1.5 bg-green-500/10 rounded-full text-green-500">
                                    <Check size={14} />
                                </div>
                                <span>Search Highlight</span>
                            </li>
                        </ul>
                        <Button variant="secondary" className="w-full h-14 rounded-2xl font-bold text-xs uppercase tracking-widest border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-elevated)]">
                            Select Plan
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Analytics Review */}
            <div className="mt-12 bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] shadow-2xl rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-5 flex-1">
                    <h3 className="text-3xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Track Your Performance</h3>
                    <p className="text-[var(--ease2event-text-secondary)] text-lg font-semibold max-w-xl leading-relaxed">Get detailed insights into how your ads are performing with real-time analytics dashboards.</p>
                </div>
                <div className="flex gap-12 bg-[var(--ease2event-bg-elevated)] px-12 py-8 rounded-[2rem] border border-[var(--ease2event-border-subtle)]">
                    <div className="text-center space-y-2">
                        <div className="text-3xl font-bold text-blue-500">2.4%</div>
                        <div className="text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-widest">Avg CTR</div>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-3xl font-bold text-emerald-500">12x</div>
                        <div className="text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-widest">ROI</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotions;
