import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit2, Trash2, Check, X, Shield, Star,
    ToggleLeft, ToggleRight, Loader2, AlertTriangle,
    Sparkles, Zap, Crown, Users, TrendingUp,
} from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface Plan {
    id: string;
    name: string;
    description: string;
    type: 'vendor' | 'user';
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
    isActive: boolean;
    priority: number;
}

const EMPTY_FORM: Omit<Plan, 'id'> = {
    name: '',
    description: '',
    type: 'vendor',
    price: 0,
    billingCycle: 'monthly',
    features: [],
    isActive: true,
    priority: 0,
};

const inputCls =
    'w-full bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] rounded-xl px-4 py-3 text-sm text-[var(--ease2event-text-primary)] placeholder:text-[var(--ease2event-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ';

const labelCls = 'block text-xs font-semibold text-[var(--ease2event-text-secondary)] uppercase tracking-wider mb-2';

export default function Subscriptions() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [toggling, setToggling] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [form, setForm] = useState<Omit<Plan, 'id'>>(EMPTY_FORM);
    const [featureInput, setFeatureInput] = useState('');
    const featureRef = useRef<HTMLInputElement>(null);

    const [confirmDelete, setConfirmDelete] = useState<Plan | null>(null);

    // ── Fetch plans from API ──────────────────────────────────────────────
    const fetchPlans = async () => {
        try {
            setLoading(true);
            const data = await api.get('/subscriptions/admin/plans') as Plan[];
            setPlans(Array.isArray(data) ? data : []);
        } catch (err: any) {
            toast.error('Failed to load plans: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    // ── Modal helpers ─────────────────────────────────────────────────────
    const openCreate = () => {
        setEditingPlan(null);
        setForm(EMPTY_FORM);
        setFeatureInput('');
        setIsModalOpen(true);
    };

    const openEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setForm({ ...plan });
        setFeatureInput('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPlan(null);
        setFeatureInput('');
    };

    // ── Feature tag management ────────────────────────────────────────────
    const addFeature = () => {
        const val = featureInput.trim();
        if (!val || form.features.includes(val)) return;
        setForm(f => ({ ...f, features: [...f.features, val] }));
        setFeatureInput('');
        featureRef.current?.focus();
    };

    const removeFeature = (idx: number) => {
        setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));
    };

    // ── Save (create / update) ────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.name.trim()) { toast.error('Plan name is required'); return; }
        if (form.features.length === 0) { toast.error('Add at least one feature'); return; }
        setSaving(true);
        try {
            if (editingPlan) {
                const updated = await api.put(`/subscriptions/admin/plans/${editingPlan.id}`, form) as Plan;
                setPlans(prev => prev.map(p => p.id === editingPlan.id ? updated : p));
                toast.success('Plan updated');
            } else {
                const created = await api.post('/subscriptions/admin/plans', form) as Plan;
                setPlans(prev => [...prev, created]);
                toast.success('Plan created');
            }
            closeModal();
        } catch (err: any) {
            toast.error('Save failed: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    // ── Toggle active ─────────────────────────────────────────────────────
    const handleToggle = async (plan: Plan) => {
        setToggling(plan.id);
        try {
            const updated = await api.patch(`/subscriptions/admin/plans/${plan.id}/toggle`, {}) as Plan;
            setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, isActive: updated.isActive } : p));
            toast.success(`Plan ${updated.isActive ? 'activated' : 'deactivated'}`);
        } catch (err: any) {
            toast.error('Toggle failed: ' + err.message);
        } finally {
            setToggling(null);
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────
    const handleDelete = async (plan: Plan) => {
        setDeleting(plan.id);
        try {
            await api.delete(`/subscriptions/admin/plans/${plan.id}`);
            setPlans(prev => prev.filter(p => p.id !== plan.id));
            toast.success('Plan deleted');
        } catch (err: any) {
            toast.error('Delete failed: ' + err.message);
        } finally {
            setDeleting(null);
            setConfirmDelete(null);
        }
    };

    // ── Derived stats ─────────────────────────────────────────────────────
    const vendorPlans = plans.filter(p => p.type === 'vendor');
    const userPlans   = plans.filter(p => p.type === 'user');
    const activePlans = plans.filter(p => p.isActive);

    // ── Plan card accent config ───────────────────────────────────────────
    const accent = (plan: Plan) =>
        plan.type === 'vendor'
            ? { pill: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', icon: 'bg-purple-500/10 text-purple-400', ring: '/30' }
            : { pill: 'bg-sky-500/10 text-sky-400 border border-sky-500/20', icon: 'bg-sky-500/10 text-sky-400', ring: '/30' };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className=" text-blue-500" size={36} />
        </div>
    );

    return (
        <div className="space-y-8">

            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">Subscription Plans</h1>
                    <p className="text-sm text-[var(--ease2event-text-secondary)] mt-1">
                        Manage pricing tiers and features for users and vendors.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-blue-600  text-white px-5 py-2.5 rounded-xl font-semibold text-sm  shadow-lg shadow-blue-500/20 /30"
                >
                    <Plus size={16} />
                    Create Plan
                </button>
            </div>

            {/* ── Stats row ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total plans',   value: plans.length,        icon: Sparkles,   color: 'text-blue-400' },
                    { label: 'Active plans',  value: activePlans.length,  icon: TrendingUp, color: 'text-green-400' },
                    { label: 'Vendor plans',  value: vendorPlans.length,  icon: Shield,     color: 'text-purple-400' },
                    { label: 'User plans',    value: userPlans.length,    icon: Users,      color: 'text-sky-400' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] rounded-2xl p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-[var(--ease2event-bg-elevated)] ${color}`}>
                            <Icon size={18} />
                        </div>
                        <div>
                            <div className="text-xl font-black text-[var(--ease2event-text-primary)]">{value}</div>
                            <div className="text-xs text-[var(--ease2event-text-muted)]">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Plan cards ───────────────────────────────────────────── */}
            {plans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <div className="p-6 bg-[var(--ease2event-bg-elevated)] rounded-3xl">
                        <Zap size={48} className="text-[var(--ease2event-text-muted)]" />
                    </div>
                    <p className="text-[var(--ease2event-text-secondary)] font-medium">No plans yet. Create your first plan.</p>
                    <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600  text-white px-5 py-2.5 rounded-xl font-semibold text-sm ">
                        <Plus size={16} /> Create Plan
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    <AnimatePresence mode="popLayout">
                        {plans.map(plan => {
                            const a = accent(plan);
                            return (
                                <motion.div
                                    key={plan.id}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animateanimate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`group relative bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] ${a.ring} rounded-2xl p-6 flex flex-col gap-4   ${!plan.isActive ? 'opacity-60' : ''}`}
                                >
                                    {/* Type pill + action buttons */}
                                    <div className="flex items-center justify-between">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${a.pill}`}>
                                            {plan.type === 'vendor' ? <Shield size={11} /> : <Star size={11} />}
                                            {plan.type}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {/* Toggle */}
                                            <button
                                                onClick={() => handleToggle(plan)}
                                                disabled={!!toggling}
                                                title={plan.isActive ? 'Deactivate' : 'Activate'}
                                                className="p-1.5 rounded-lg text-[var(--ease2event-text-muted)] -[var(--ease2event-text-primary)] -[var(--ease2event-bg-elevated)] "
                                            >
                                                {toggling === plan.id
                                                    ? <Loader2 size={16} className="" />
                                                    : plan.isActive ? <ToggleRight size={18} className="text-green-400" /> : <ToggleLeft size={18} />
                                                }
                                            </button>
                                            {/* Edit */}
                                            <button
                                                onClick={() => openEdit(plan)}
                                                title="Edit plan"
                                                className="p-1.5 rounded-lg text-[var(--ease2event-text-muted)]  -[var(--ease2event-bg-elevated)] "
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            {/* Delete */}
                                            <button
                                                onClick={() => setConfirmDelete(plan)}
                                                title="Delete plan"
                                                className="p-1.5 rounded-lg text-[var(--ease2event-text-muted)]  /10 "
                                            >
                                                {deleting === plan.id ? <Loader2 size={15} className="" /> : <Trash2 size={15} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Icon + name + price */}
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${a.icon}`}>
                                            {plan.type === 'vendor' ? <Shield size={22} /> : <Crown size={22} />}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-[var(--ease2event-text-primary)] leading-tight">{plan.name}</h3>
                                            <div className="flex items-baseline gap-1 mt-0.5">
                                                <span className="text-2xl font-black text-[var(--ease2event-text-primary)]">
                                                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
                                                </span>
                                                {plan.price > 0 && (
                                                    <span className="text-xs text-[var(--ease2event-text-muted)]">/{plan.billingCycle}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {plan.description && (
                                        <p className="text-xs text-[var(--ease2event-text-secondary)] leading-relaxed -mt-1">{plan.description}</p>
                                    )}

                                    {/* Features */}
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-[var(--ease2event-text-muted)] uppercase tracking-widest mb-2">Features</p>
                                        <ul className="space-y-1.5">
                                            {plan.features.map((f, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-[var(--ease2event-text-primary)]">
                                                    <Check size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Status bar */}
                                    <div className="pt-4 border-t border-[var(--ease2event-border-subtle)] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${plan.isActive ? 'bg-green-400' : 'bg-slate-500'}`} />
                                            <span className={`text-xs font-semibold ${plan.isActive ? 'text-green-400' : 'text-[var(--ease2event-text-muted)]'}`}>
                                                {plan.isActive ? 'Active' : 'Draft'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-[var(--ease2event-text-muted)] font-medium capitalize">
                                            {plan.billingCycle} billing · Priority {plan.priority}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* ── Create / Edit modal ───────────────────────────────────── */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={e => e.target === e.currentTarget && closeModal()}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
                            className="bg-[var(--ease2event-bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--ease2event-border-base)] overflow-hidden"
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--ease2event-border-subtle)]">
                                <h2 className="text-lg font-bold text-[var(--ease2event-text-primary)]">
                                    {editingPlan ? 'Edit plan' : 'Create new plan'}
                                </h2>
                                <button onClick={closeModal} className="p-1.5 rounded-lg text-[var(--ease2event-text-muted)] -[var(--ease2event-text-primary)] -[var(--ease2event-bg-elevated)] ">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

                                {/* Name */}
                                <div>
                                    <label className={labelCls}>Plan name *</label>
                                    <input
                                        className={inputCls}
                                        placeholder="e.g. Vendor Pro"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={labelCls}>Description</label>
                                    <textarea
                                        rows={2}
                                        className={inputCls + ' resize-none'}
                                        placeholder="Short description of this plan…"
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    />
                                </div>

                                {/* Type + Billing */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Type *</label>
                                        <select
                                            className={inputCls}
                                            value={form.type}
                                            onChange={e => setForm(f => ({ ...f, type: e.target.value as 'vendor' | 'user' }))}
                                        >
                                            <option value="vendor">Vendor</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Billing cycle *</label>
                                        <select
                                            className={inputCls}
                                            value={form.billingCycle}
                                            onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value as 'monthly' | 'yearly' }))}
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Price + Priority */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Price (₹) *</label>
                                        <input
                                            type="number" min={0}
                                            className={inputCls}
                                            placeholder="0"
                                            value={form.price}
                                            onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Priority (sort order)</label>
                                        <input
                                            type="number" min={0}
                                            className={inputCls}
                                            placeholder="0"
                                            value={form.priority}
                                            onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>

                                {/* Features */}
                                <div>
                                    <label className={labelCls}>Features *</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            ref={featureRef}
                                            className={inputCls}
                                            placeholder="Add a feature and press Enter"
                                            value={featureInput}
                                            onChange={e => setFeatureInput(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                                        />
                                        <button
                                            onClick={addFeature}
                                            className="flex-shrink-0 px-4 py-2.5 bg-blue-600  text-white rounded-xl text-sm font-semibold "
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {form.features.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {form.features.map((f, i) => (
                                                <span key={i} className="inline-flex items-center gap-1.5 bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-text-primary)] text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--ease2event-border-subtle)]">
                                                    <Check size={11} className="text-green-400" />
                                                    {f}
                                                    <button onClick={() => removeFeature(i)} className="text-[var(--ease2event-text-muted)]   ml-0.5">
                                                        <X size={11} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Active toggle */}
                                <div className="flex items-center justify-between bg-[var(--ease2event-bg-elevated)] rounded-xl px-4 py-3 border border-[var(--ease2event-border-subtle)]">
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--ease2event-text-primary)]">Active plan</p>
                                        <p className="text-xs text-[var(--ease2event-text-muted)]">Visible to users on the pricing page</p>
                                    </div>
                                    <button
                                        onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                                        className=""
                                    >
                                        {form.isActive
                                            ? <ToggleRight size={28} className="text-green-400" />
                                            : <ToggleLeft size={28} className="text-[var(--ease2event-text-muted)]" />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Modal footer */}
                            <div className="px-6 py-4 border-t border-[var(--ease2event-border-subtle)] flex justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2.5 text-sm font-semibold text-[var(--ease2event-text-secondary)] -[var(--ease2event-text-primary)] -[var(--ease2event-bg-elevated)] rounded-xl "
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600  disabled:opacity-60 text-white font-semibold text-sm rounded-xl  shadow-md shadow-blue-500/20"
                                >
                                    {saving && <Loader2 size={14} className="" />}
                                    {saving ? 'Saving…' : editingPlan ? 'Save changes' : 'Create plan'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Delete confirmation modal ─────────────────────────────── */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-[var(--ease2event-bg-surface)] rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-[var(--ease2event-border-base)] text-center"
                        >
                            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={24} className="text-red-400" />
                            </div>
                            <h3 className="text-base font-bold text-[var(--ease2event-text-primary)] mb-1">Delete "{confirmDelete.name}"?</h3>
                            <p className="text-sm text-[var(--ease2event-text-secondary)] mb-6">This action cannot be undone. Active subscribers will not be affected.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-[var(--ease2event-text-secondary)] -[var(--ease2event-bg-elevated)] rounded-xl  border border-[var(--ease2event-border-subtle)]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(confirmDelete)}
                                    disabled={!!deleting}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600  disabled:opacity-60 text-white font-semibold text-sm rounded-xl "
                                >
                                    {deleting ? <Loader2 size={14} className="" /> : <Trash2 size={14} />}
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
