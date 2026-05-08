import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Check, X, Shield, Star, Users } from 'lucide-react';

// Mock data until API is fully wired
const MOCK_PLANS = [
    { id: '1', name: 'Vendor Basic', type: 'vendor', price: 0, billingCycle: 'monthly', isActive: true, features: ['Standard listing', '5 lead replies/month', 'Basic analytics'] },
    { id: '2', name: 'Vendor Pro', type: 'vendor', price: 1999, billingCycle: 'monthly', isActive: true, features: ['Featured placement', 'Unlimited leads', 'Advanced analytics', 'Pro badge'] },
    { id: '3', name: 'User Prime', type: 'user', price: 999, billingCycle: 'yearly', isActive: true, features: ['Zero platform fees', 'Priority 24/7 support', '1 hr planner consultation', 'Bundle discounts'] },
];

export default function Subscriptions() {
    const [plans, setPlans] = useState(MOCK_PLANS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);

    const handleEdit = (plan: any) => {
        setEditingPlan(plan);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingPlan(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">Subscription Plans</h1>
                    <p className="text-sm text-[var(--ease2event-text-secondary)] mt-1">Manage pricing tiers and features for users and vendors.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                >
                    <Plus size={18} />
                    Create Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white dark:bg-slate-900 border border-[var(--ease2event-border)] rounded-2xl p-6 relative flex flex-col">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${plan.type === 'vendor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                {plan.type}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-4 mt-2">
                            <div className={`p-3 rounded-xl ${plan.type === 'vendor' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
                                {plan.type === 'vendor' ? <Shield size={24} /> : <Star size={24} />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)]">{plan.name}</h3>
                                <div className="text-2xl font-black mt-1">
                                    ₹{plan.price} <span className="text-sm font-medium text-[var(--ease2event-text-secondary)]">/{plan.billingCycle}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 mt-4">
                            <p className="text-xs font-bold text-[var(--ease2event-text-secondary)] uppercase tracking-wider mb-3">Features</p>
                            <ul className="space-y-2">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--ease2event-text-primary)]">
                                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[var(--ease2event-border)] flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                                <span className={`w-2 h-2 rounded-full ${plan.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className={plan.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                    {plan.isActive ? 'Active' : 'Draft'}
                                </span>
                            </div>
                            <button 
                                onClick={() => handleEdit(plan)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                                <Edit size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal structure (to be expanded with actual form fields) */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-[var(--ease2event-border)]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[var(--ease2event-text-primary)]">
                                    {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--ease2event-text-secondary)] mb-1">Plan Name</label>
                                    <input type="text" defaultValue={editingPlan?.name} className="w-full border border-[var(--ease2event-border)] bg-transparent rounded-lg px-3 py-2 text-[var(--ease2event-text-primary)]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--ease2event-text-secondary)] mb-1">Type</label>
                                        <select defaultValue={editingPlan?.type} className="w-full border border-[var(--ease2event-border)] bg-transparent rounded-lg px-3 py-2 text-[var(--ease2event-text-primary)]">
                                            <option value="vendor">Vendor</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--ease2event-text-secondary)] mb-1">Price (₹)</label>
                                        <input type="number" defaultValue={editingPlan?.price} className="w-full border border-[var(--ease2event-border)] bg-transparent rounded-lg px-3 py-2 text-[var(--ease2event-text-primary)]" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[var(--ease2event-text-secondary)] font-medium hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Save Plan</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
