import React, { useState } from 'react';
import { User, Bell, Lock, CreditCard, Globe, Moon, Sun, Save, ShieldCheck, Upload, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '@airion/shared';
import { Input, Button, Avatar } from '@airion/ui';

const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Split name for display
    const displayName = user?.name || user?.email?.split('@')[0] || user?.phoneNumber || 'User';
    const initials = (user?.name?.substring(0, 2) || displayName.substring(0, 2)).toUpperCase();

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'verification', label: 'Verification (KYC)', icon: ShieldCheck },
        { id: 'preferences', label: 'Preferences', icon: Globe },
    ];

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            <div>
                <h1 className="text-2xl font-bold text-[var(--airion-text-primary)]">Settings</h1>
                <p className="text-[var(--airion-text-muted)]">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-[var(--airion-bg-surface)] rounded-2xl shadow-[var(--airion-shadow-sm)] border border-[var(--airion-border-subtle)] p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-[var(--airion-bg-base)] text-[var(--airion-brand-primary)] shadow-[var(--airion-shadow-sm)] font-bold'
                                        : 'text-[var(--airion-text-muted)] hover:bg-[var(--airion-bg-base)] hover:text-[var(--airion-text-secondary)] font-medium'
                                    }`}
                            >
                                <tab.icon size={20} className={activeTab === tab.id ? 'text-[var(--airion-brand-primary)]' : ''} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-[var(--airion-bg-surface)] rounded-2xl shadow-[var(--airion-shadow-sm)] border border-[var(--airion-border-subtle)] p-6 md:p-8">
                        {activeTab === 'profile' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-[var(--airion-text-primary)]">Profile Information</h2>
                                <div className="flex items-center gap-6 pb-6 border-b border-[var(--airion-border-subtle)]">
                                    <Avatar name={displayName} size="xl" />
                                    <div>
                                        <Button variant="outline" size="sm">
                                            Change Photo
                                        </Button>
                                        <p className="text-xs text-[var(--airion-text-muted)] mt-2 font-medium">JPG, GIF or PNG. Max size of 2MB</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Input
                                            label="Display Name"
                                            defaultValue={displayName}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Email"
                                            type="email"
                                            disabled
                                            defaultValue={user?.email || ''}
                                            hint="To change your login email, contact support."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Phone"
                                            type="tel"
                                            defaultValue={user?.phoneNumber || ''}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-xs font-bold text-[var(--airion-text-muted)] uppercase tracking-widest pl-1">Bio</label>
                                        <textarea
                                            rows={4}
                                            defaultValue="Professional event provider on Airion."
                                            className="w-full rounded-xl border bg-[var(--airion-bg-surface)] border-[var(--airion-border-base)] focus:border-[var(--airion-brand-primary)] focus:ring-4 focus:ring-[rgba(108,99,255,0.08)] outline-none transition-all duration-200 px-4 py-3 text-sm text-[var(--airion-text-primary)] resize-none"
                                        />
                                    </div>
                                </div>
                                
                                <div className="pt-4 flex justify-end">
                                    <Button variant="primary" size="lg" leftIcon={<Save size={20} />}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-[var(--airion-text-primary)]">Notification Preferences</h2>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Email Notifications', description: 'Receive email updates about your bookings' },
                                        { label: 'SMS Notifications', description: 'Get text messages for important updates' },
                                        { label: 'Push Notifications', description: 'Receive push notifications on your device' },
                                        { label: 'Marketing Emails', description: 'Receive promotional emails and offers' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] rounded-xl">
                                            <div>
                                                <h3 className="font-bold text-sm text-[var(--airion-text-primary)]">{item.label}</h3>
                                                <p className="text-xs text-[var(--airion-text-muted)] font-medium mt-0.5">{item.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer group">
                                                <input type="checkbox" defaultChecked={idx < 2} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-[var(--airion-border-base)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[rgba(108,99,255,0.15)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--airion-border-subtle)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--airion-brand-primary)] group-hover:bg-[var(--airion-border-active)]"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-[var(--airion-text-primary)]">Security Settings</h2>
                                <div className="space-y-6">
                                    <Input
                                        label="Current Password"
                                        type="password"
                                    />
                                    <Input
                                        label="New Password"
                                        type="password"
                                    />
                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                    />
                                    
                                    <div className="pt-2">
                                        <Button variant="primary">
                                            Update Password
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-[var(--airion-text-primary)]">Billing Information</h2>
                                <div className="p-4 bg-[var(--airion-bg-base)] border border-[var(--airion-border-subtle)] rounded-xl shadow-[var(--airion-shadow-sm)]">
                                    <p className="text-sm text-[var(--airion-text-muted)]">Current Plan: <span className="font-bold text-[var(--airion-text-primary)]">Professional</span></p>
                                    <p className="text-sm text-[var(--airion-text-muted)] mt-1">Next billing date: <span className="font-medium text-[var(--airion-text-primary)]">Jan 1, 2025</span></p>
                                </div>
                                <Button variant="primary">
                                    Manage Subscription
                                </Button>
                            </div>
                        )}

                        {activeTab === 'verification' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-[var(--airion-text-primary)]">Business Verification</h2>
                                    <p className="text-sm text-[var(--airion-text-muted)] mt-1">Submit your official documents to get the "Verified Host" badge and boost your rankings.</p>
                                </div>
                                <div className="grid gap-6">
                                    <div className="p-6 bg-[var(--airion-bg-base)] rounded-2xl border border-[var(--airion-border-subtle)] shadow-[var(--airion-shadow-sm)]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-[var(--airion-text-primary)]">Government ID</h3>
                                                <p className="text-sm text-[var(--airion-text-muted)]">Passport, Aadhar, or Driver's License</p>
                                            </div>
                                            <span className="bg-green-100/50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <CheckCircle size={14} /> Verified
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 bg-[var(--airion-bg-base)] rounded-2xl border border-[var(--airion-border-subtle)] shadow-[var(--airion-shadow-sm)]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-[var(--airion-text-primary)]">Business Registration Proof</h3>
                                                <p className="text-sm text-[var(--airion-text-muted)]">GST Certificate, Trade License, or Incorporation Document</p>
                                            </div>
                                            <span className="bg-yellow-100/50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                Pending Action
                                            </span>
                                        </div>
                                        <div className="mt-4 border-2 border-dashed border-[var(--airion-border-subtle)] rounded-xl p-8 text-center cursor-pointer hover:bg-[var(--airion-bg-surface)] transition-colors group relative">
                                            <Upload className="mx-auto text-[var(--airion-text-muted)] group-hover:text-[var(--airion-brand-primary)] transition-colors mb-2" size={32} />
                                            <p className="font-bold text-[var(--airion-text-primary)]">Click to upload document</p>
                                            <p className="text-xs text-[var(--airion-text-muted)] mt-1">PDF, JPG, or PNG up to 10MB</p>
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                        </div>
                                    </div>
                                </div>
                                <Button variant="primary">
                                    Submit for Review
                                </Button>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-[var(--airion-text-primary)]">Preferences</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-[var(--airion-bg-base)] border border-[var(--airion-border-subtle)] rounded-xl shadow-[var(--airion-shadow-sm)]">
                                        <div>
                                            <h3 className="font-medium text-[var(--airion-text-primary)]">Theme</h3>
                                            <p className="text-sm text-[var(--airion-text-muted)]">Choose your preferred theme</p>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className="flex items-center gap-2 px-4 py-2 bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] rounded-lg hover:bg-[var(--airion-bg-base)] transition-colors"
                                        >
                                            {theme === 'light' ? <Moon size={20} className="text-[var(--airion-text-muted)]" /> : <Sun size={20} className="text-[var(--airion-text-muted)]" />}
                                            <span className="text-sm font-medium text-[var(--airion-text-primary)]">
                                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                                            </span>
                                        </button>
                                    </div>
                                    <div className="p-4 bg-[var(--airion-bg-base)] border border-[var(--airion-border-subtle)] rounded-xl shadow-[var(--airion-shadow-sm)]">
                                        <label className="block text-sm font-medium text-[var(--airion-text-primary)] mb-2">Language</label>
                                        <select className="w-full px-4 py-2 bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--airion-brand-primary)] text-[var(--airion-text-primary)] transition-all">
                                            <option>English</option>
                                            <option>Hindi</option>
                                            <option>Spanish</option>
                                        </select>
                                    </div>
                                    <div className="p-4 bg-[var(--airion-bg-base)] border border-[var(--airion-border-subtle)] rounded-xl shadow-[var(--airion-shadow-sm)]">
                                        <label className="block text-sm font-medium text-[var(--airion-text-primary)] mb-2">Timezone</label>
                                        <select className="w-full px-4 py-2 bg-[var(--airion-bg-surface)] border border-[var(--airion-border-subtle)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--airion-brand-primary)] text-[var(--airion-text-primary)] transition-all">
                                            <option>Asia/Kolkata (IST)</option>
                                            <option>America/New_York (EST)</option>
                                            <option>Europe/London (GMT)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
