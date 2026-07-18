import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
    const navigate = useNavigate();

    const settingCards = [
        {
            title: 'Profile Settings',
            description: 'Manage your personal and business profile, description, and images.',
            icon: User,
            onClick: () => navigate('/profile'),
            active: true
        },
        {
            title: 'Notifications',
            description: 'Choose how and when you want to be notified about bookings and messages.',
            icon: Bell,
            onClick: () => {},
            active: false
        },
        {
            title: 'Security',
            description: 'Update your password and secure your account with two-factor authentication.',
            icon: Shield,
            onClick: () => {},
            active: false
        },
        {
            title: 'Payout Methods',
            description: 'Manage your bank accounts and UPI details for receiving payouts.',
            icon: CreditCard,
            onClick: () => {},
            active: false
        }
    ];

    return (
        <div className="space-y-6 px-6 w-full max-w-5xl mx-auto pb-32 pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--ease2event-border-subtle)] pb-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--ease2event-text-primary)]">Settings Hub</h1>
                    <p className="text-sm font-semibold text-[var(--ease2event-text-secondary)]">Manage your preferences, security, and profile from one place</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {settingCards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={card.onClick}
                        className={`p-6 rounded-2xl border flex items-start gap-5 transition-all group ${
                            card.active 
                                ? 'bg-white dark:bg-slate-900 border-[var(--ease2event-border-subtle)] hover:border-[var(--ease2event-brand-primary)] hover:shadow-md cursor-pointer' 
                                : 'bg-gray-50 dark:bg-slate-900/50 border-dashed border-gray-200 dark:border-slate-800 cursor-not-allowed opacity-70'
                        }`}
                    >
                        <div className={`p-3 rounded-xl flex-shrink-0 ${card.active ? 'bg-[var(--ease2event-brand-primary)]/10 text-[var(--ease2event-brand-primary)]' : 'bg-gray-200 dark:bg-slate-800 text-gray-500'}`}>
                            <card.icon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className={`text-lg font-bold ${card.active ? 'text-[var(--ease2event-text-primary)]' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {card.title}
                                </h3>
                                {!card.active && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md">
                                        Coming Soon
                                    </span>
                                )}
                            </div>
                            <p className={`text-sm ${card.active ? 'text-[var(--ease2event-text-secondary)]' : 'text-gray-500 dark:text-gray-500'}`}>
                                {card.description}
                            </p>
                        </div>
                        {card.active && (
                            <ChevronRight size={20} className="text-[var(--ease2event-text-muted)] group-hover:text-[var(--ease2event-brand-primary)] transform group-hover:translate-x-1 transition-all mt-2" />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
