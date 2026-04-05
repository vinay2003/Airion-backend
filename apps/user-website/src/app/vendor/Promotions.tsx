import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Zap, Eye, MousePointer, Check } from 'lucide-react';

const Promotions: React.FC = () => {
    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ads & Promotions</h1>
                <p className="text-gray-500 dark:text-slate-400">Boost your visibility and get more bookings with our premium promotion tools.</p>
            </header>

            {/* Active Campaigns */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Active Campaigns</h2>
                <div className="p-8 text-center bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                    <Zap size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">You don't have any active campaigns running.</p>
                    <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors">
                        Create New Campaign
                    </button>
                </div>
            </div>

            {/* Promotion Packages */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Promotion Packages</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Featured Listing */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden"
                    >
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-4">
                            <Award size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Featured Listing</h3>
                        <p className="text-gray-500 text-sm mb-4">Get top placement in your category search results.</p>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-6">₹999<span className="text-sm font-normal text-gray-500">/week</span></div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                                <Check size={16} className="text-green-500 mt-0.5" />
                                <span>Top 3 Search Results</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                                <Check size={16} className="text-green-500 mt-0.5" />
                                <span>"Featured" Badge</span>
                            </li>
                        </ul>
                        <button className="w-full py-3 border border-red-500 text-red-500 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                            Select Plan
                        </button>
                    </motion.div>

                    {/* Banner Ads */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border-2 border-red-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Homepage Banner</h3>
                        <p className="text-gray-500 text-sm mb-4">Display your banner on the main homepage carousel.</p>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-6">₹2,499<span className="text-sm font-normal text-gray-500">/week</span></div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                                <Check size={16} className="text-green-500 mt-0.5" />
                                <span>Homepage Visibility</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                                <Check size={16} className="text-green-500 mt-0.5" />
                                <span>High CTR Format</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                                <Check size={16} className="text-green-500 mt-0.5" />
                                <span>Priority Support</span>
                            </li>
                        </ul>
                        <button className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                            Select Plan
                        </button>
                    </motion.div>

                    {/* Sponsored Package */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden"
                    >
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sponsored Package</h3>
                        <p className="text-gray-500 text-sm mb-4">Promote your special packages in the Packages section.</p>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-6">₹1,499<span className="text-sm font-normal text-gray-500">/week</span></div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                                <Check size={16} className="text-green-500 mt-0.5" />
                                <span>Packages Page Feature</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                                <Check size={16} className="text-green-500 mt-0.5" />
                                <span>Search Highlight</span>
                            </li>
                        </ul>
                        <button className="w-full py-3 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            Select Plan
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Analytics Review */}
            <div className="mt-8 bg-gray-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">Track Your Performance</h3>
                    <p className="text-gray-400 max-w-lg">Get detailed insights into how your ads are performing with real-time analytics dashboards.</p>
                </div>
                <div className="flex gap-8">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">2.4%</div>
                        <div className="text-sm text-gray-400">Avg CTR</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">12x</div>
                        <div className="text-sm text-gray-400">ROI</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotions;
