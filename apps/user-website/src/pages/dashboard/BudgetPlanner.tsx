import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore, BudgetItem } from '../../store/useDashboardStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Plus, Download, AlertCircle, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

const BudgetPlanner: React.FC = () => {
    const { budgetItems, totalBudget, updateBudgetAllocation, addExpense, fetchBudget } = useDashboardStore();
    const [isAddingExpense, setIsAddingExpense] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [expenseAmount, setExpenseAmount] = useState<string>('');

    useEffect(() => {
        fetchBudget();
    }, [fetchBudget]);
    
    const totalSpent = budgetItems.reduce((acc, item) => acc + item.spent, 0);
    const remainingBudget = totalBudget - totalSpent;
    const spentPercentage = (totalSpent / totalBudget) * 100;

    const chartData = budgetItems.map(item => ({
        name: item.category,
        allocated: item.allocated,
        spent: item.spent
    }));

    const handleAddExpense = () => {
        if (!selectedCategory || !expenseAmount) return;
        const item = budgetItems.find(i => i.category === selectedCategory);
        if (item) {
            addExpense(item.id, parseFloat(expenseAmount));
            setExpenseAmount('');
            setIsAddingExpense(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">Budget Planner</h1>
                    <p className="text-neutral-500 dark:text-slate-400 mt-1">Track allocations, spent costs, and auto vendor-cost sync.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 dark:border-slate-800 rounded-xl font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-slate-800 transition">
                        <Download size={16} /> Export PDF
                    </button>
                    <button 
                        onClick={() => setIsAddingExpense(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/10 font-semibold text-sm hover:bg-red-600 transition"
                    >
                        <Plus size={16} /> Add Expense
                    </button>
                </div>
            </header>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-neutral-500">Total Budget</span>
                        <div className="p-2 bg-neutral-100 dark:bg-slate-800 rounded-lg"><DollarSign size={18} /></div>
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white">₹{totalBudget.toLocaleString()}</h2>
                    <div className="w-full bg-neutral-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: `${Math.min(spentPercentage, 100)}%` }} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-neutral-500">Total Spent</span>
                        <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-500"><TrendingUp size={18} /></div>
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white">₹{totalSpent.toLocaleString()}</h2>
                    <p className="text-xs text-neutral-400 mt-1">{spentPercentage.toFixed(1)}% of total budget</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-neutral-500">Remaining</span>
                        <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg text-green-500"><CheckCircle size={18} /></div>
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white">₹{remainingBudget.toLocaleString()}</h2>
                    <p className={`text-xs mt-1 ${remainingBudget < 0 ? 'text-red-500' : 'text-neutral-400'}`}>
                        {remainingBudget < 0 ? 'Over budget' : 'Under budget'}
                    </p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Category Allocation</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} dataKey="spent" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8">
                                    {chartData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4 max-h-32 overflow-y-auto">
                        {budgetItems.map((item, i) => (
                            <div key={item.id} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="font-semibold text-neutral-700 dark:text-slate-300">{item.category}</span>
                                </div>
                                <span className="text-neutral-500 font-medium">₹{item.spent.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Allocated vs Spent</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#a3a3a3" fontSize={11} tickLine={false} />
                                <YAxis stroke="#a3a3a3" fontSize={11} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="allocated" fill="#e5e5e5" radius={[4, 4, 0, 0]} name="Allocated" />
                                <Bar dataKey="spent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Spent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Category Items List */}
            <div className="bg-white dark:bg-slate-900 border border-neutral-200/60 dark:border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-neutral-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Expense Tracker</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-slate-800/50 border-b border-neutral-100 dark:border-slate-800">
                                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-slate-300">Category</th>
                                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-slate-300">Allocated</th>
                                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-slate-300">Spent</th>
                                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-slate-300">Vendor / Services</th>
                                <th className="p-4 font-semibold text-sm text-neutral-600 dark:text-slate-300">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgetItems.map((item: BudgetItem) => (
                                <tr key={item.id} className="border-b border-neutral-50 dark:border-slate-800/40 hover:bg-neutral-50/50 dark:hover:bg-slate-800/40 cursor-pointer">
                                    <td className="p-4 font-bold text-neutral-900 dark:text-white text-sm">{item.category}</td>
                                    <td className="p-4 text-sm text-neutral-600 dark:text-slate-400">₹{item.allocated.toLocaleString()}</td>
                                    <td className="p-4 text-sm font-semibold text-neutral-900 dark:text-white">₹{item.spent.toLocaleString()}</td>
                                    <td className="p-4 text-sm text-neutral-500 dark:text-slate-400">
                                        {item.vendorName ? (
                                            <span className="flex items-center gap-1">
                                                <CheckCircle size={14} className="text-green-500" /> {item.vendorName}
                                            </span>
                                        ) : (
                                            <span className="text-neutral-400 italic">Not Booked</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                                            ${item.status === 'paid' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-500' : ''}
                                            ${item.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500' : ''}
                                            ${item.status === 'over-budget' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-500' : ''}
                                        `}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Add Expense Modal Drawer Modal */}
            <AnimatePresence>
                {isAddingExpense && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingExpense(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200 dark:border-slate-800 w-full max-w-md p-6 z-10 shadow-xl">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                <AlertCircle size={20} className="text-red-500" /> Add Expense
                            </h3>
                            
                            <div className="space-y-4 mt-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-slate-300">Category</label>
                                    <select 
                                        value={selectedCategory} 
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full bg-neutral-100 dark:bg-slate-800 border-none outline-none mt-1 p-2.5 rounded-xl text-neutral-800 dark:text-neutral-200"
                                    >
                                        <option value="">Select Category</option>
                                        {budgetItems.map(item => <option key={item.id} value={item.category}>{item.category}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-slate-300">Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        value={expenseAmount} 
                                        onChange={(e) => setExpenseAmount(e.target.value)}
                                        placeholder="Enter spent amount..." 
                                        className="w-full bg-neutral-100 dark:bg-slate-800 border-none outline-none mt-1 p-2.5 rounded-xl text-neutral-800 dark:text-neutral-200" 
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setIsAddingExpense(false)} className="w-full py-2.5 border border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-slate-300 rounded-xl font-semibold text-sm">Cancel</button>
                                    <button onClick={handleAddExpense} className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-red-500/10">Add</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BudgetPlanner;
