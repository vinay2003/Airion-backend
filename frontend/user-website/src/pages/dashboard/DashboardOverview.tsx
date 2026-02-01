import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CreditCard } from 'lucide-react';

const DashboardOverview: React.FC = () => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, User!</h1>
                <p className="text-gray-600 dark:text-slate-400">Here's what's happening with your event planning.</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Upcoming Events</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Pending Requests</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Total Spent</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹25,000</h3>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <p className="text-gray-500 dark:text-slate-400 text-center py-8">No recent activity to show.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
