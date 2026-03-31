import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore, Booking } from '../../store/useDashboardStore';
import { Calendar, Clock, CreditCard, ArrowRight, CheckCircle, Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DashboardOverview: React.FC = () => {
    const { bookings, budgetItems, totalBudget } = useDashboardStore();

    const activeBookings = bookings.filter(b => b.status === 'Upcoming');
    const totalSpent = budgetItems.reduce((acc, item) => acc + item.spent, 0);
    const budgetStatus = totalSpent > totalBudget ? 'over' : 'under';
    const remainingBudget = totalBudget - totalSpent;

    // Charts data
    const chartData = budgetItems.map(item => ({
        name: item.category,
        value: item.spent
    }));
    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

    return (
        <div className="space-y-8 animate-fadeIn">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">Welcome Back, Divij!</h1>
                    <p className="text-neutral-500 dark:text-slate-400 mt-1">Here's how closer you are to your dream event.</p>
                </div>
                <div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/10 font-semibold text-sm hover:bg-red-600 transition duration-150">
                        <Plus size={16} />
                        Plan New Event
                    </button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Upcoming Events', value: activeBookings.length, icon: Calendar, color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
                    { title: 'Budget Status', value: `₹${totalSpent.toLocaleString()}`, icon: CreditCard, color: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
                    { title: 'Pending Tasks', value: 3, icon: Clock, color: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.text}`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 dark:text-slate-400 font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{stat.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Bookings/Timeline */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Active Bookings</h2>
                        <Link to="/dashboard/bookings" className="text-sm font-semibold text-red-500 hover:text-red-400 flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {activeBookings.length > 0 ? (
                            activeBookings.map((booking: Booking) => (
                                <motion.div
                                    key={booking.id}
                                    className="bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl p-4 flex gap-4 hover:shadow-md transition cursor-pointer"
                                >
                                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-slate-800">
                                        <img src={booking.imageUrl} alt={booking.vendorName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-red-500 tracking-wider uppercase">{booking.category}</span>
                                                <span className="text-xs font-semibold px-2 py-0.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 rounded-full">{booking.status}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1 leading-snug">{booking.vendorName}</h3>
                                            <div className="flex items-center gap-1 text-sm text-neutral-400 mt-1">
                                                <MapPin size={14} />
                                                <span className="truncate">{booking.location}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-neutral-100/60 dark:border-slate-800/60 pt-2 mt-2">
                                            <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-slate-400">
                                                <Calendar size={13} />
                                                {booking.date} at {booking.time}
                                            </div>
                                            <span className="text-sm font-bold text-neutral-900 dark:text-white">₹{booking.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-slate-900 border border-dashed border-neutral-300 dark:border-slate-800 p-8 rounded-2xl text-center">
                                <p className="text-neutral-400">No active bookings. Start exploring vendors!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Budget Peek Chart */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Budget Overview</h2>
                    <div className="bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center">
                        <div className="h-44 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8">
                                        {chartData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-sm text-neutral-500 dark:text-slate-400">Remaining Budget</p>
                            <h3 className="text-xl font-black text-neutral-900 dark:text-white">₹{remainingBudget.toLocaleString()}</h3>
                            <p className="text-xs text-neutral-400">of ₹{totalBudget.toLocaleString()}</p>
                        </div>

                        <div className="w-full mt-4 bg-neutral-100/60 dark:bg-slate-800 rounded-lg p-3 flex flex-col gap-1.5">
                            {budgetItems.slice(0, 3).map((item, i) => (
                                <div key={item.id} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                        <span className="font-semibold text-neutral-700 dark:text-slate-300">{item.category}</span>
                                    </div>
                                    <span className="text-neutral-500">₹{item.spent.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <Link to="/dashboard" className="w-full text-center text-sm font-semibold text-red-500 hover:opacity-80 mt-4 pt-3 border-t border-neutral-100 dark:border-slate-800">
                            Manage Budget
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Tips panel */}
            <div className="bg-red-50 dark:bg-red-500/5 rounded-2xl p-6 border border-red-100 dark:border-red-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Did you know?</h3>
                    <p className="text-sm text-red-600/80 dark:text-red-400/80">You can split your vendor payments into easy EMIs. Check your eligibility now.</p>
                </div>
                <button className="whitespace-nowrap px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 shadow-md">
                    Check Eligibility
                </button>
            </div>
        </div>
    );
};

export default DashboardOverview;
