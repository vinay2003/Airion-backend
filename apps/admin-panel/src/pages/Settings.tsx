import React, { useState } from 'react';
import { User, Bell, Lock, Shield, Globe, Moon, Sun, Save, Server, Database, Key } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'admin', label: 'Admin Users', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'platform', label: 'Platform & Rules', icon: Shield },
        { id: 'advanced', label: 'Advanced', icon: Server },
    ];

    return (
        <div className="fade-in pb-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--ease2event-text-primary)]">Settings</h1>
                <p className="text-sm font-medium text-[var(--ease2event-text-secondary)] mt-1">Manage platform configuration and preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    activeTab === tab.id
                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium'
                                }`}
                            >
                                <tab.icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-8">
                        
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-in fade-in">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">General Settings</h2>
                                    <p className="text-sm text-gray-500">Update basic platform information and appearance</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Appearance Theme</h3>
                                            <p className="text-sm text-gray-500 mt-1">Choose between light or dark mode</p>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            {theme === 'light' ? <Moon size={18} className="text-gray-600" /> : <Sun size={18} className="text-gray-300" />}
                                            <span className="text-sm font-bold text-gray-700 dark:text-slate-200">
                                                {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                                            </span>
                                        </button>
                                    </div>
                                    <div className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Platform Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Airion UI"
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Support Email</label>
                                            <input
                                                type="email"
                                                defaultValue="support@airion.com"
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'platform' && (
                            <div className="space-y-8 animate-in fade-in">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Platform Rules & Commission</h2>
                                    <p className="text-sm text-gray-500">Configure global business rules for vendors and bookings</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Manual Vendor Approval</h3>
                                            <p className="text-sm text-gray-500">Require admins to approve vendors before they can list services</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    <div className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Strict KYC Enforcement</h3>
                                            <p className="text-sm text-gray-500">Vendors must complete KYC to receive payouts</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    <div className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Default Commission Rate</h3>
                                        <p className="text-sm text-gray-500 mb-4">Base percentage taken from all successful bookings</p>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                defaultValue="12"
                                                min="0"
                                                max="100"
                                                className="w-24 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-gray-900 dark:text-white text-center"
                                            />
                                            <span className="font-bold text-gray-500">%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                                        <Save size={18} />
                                        Save Configuration
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fade-in">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Security & Access</h2>
                                    <p className="text-sm text-gray-500">Protect the admin portal and configure login policies</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Two-Factor Authentication (2FA)</h3>
                                            <p className="text-sm text-gray-500">Enforce OTP verification for all admin logins</p>
                                        </div>
                                        <button className="px-5 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-sm font-bold transition-colors border border-emerald-200 flex items-center gap-2">
                                            <Lock size={16} /> Enabled
                                        </button>
                                    </div>
                                    <div className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Session Timeout</h3>
                                        <p className="text-sm text-gray-500 mb-4">Automatically log out idle admins</p>
                                        <select className="w-full md:w-64 px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-gray-900 dark:text-white cursor-pointer">
                                            <option>15 Minutes</option>
                                            <option>30 Minutes</option>
                                            <option>1 Hour</option>
                                            <option>Never</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {['admin', 'notifications', 'advanced'].includes(activeTab) && (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 animate-in fade-in">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <Shield size={24} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Restricted Area</h3>
                                <p className="text-sm">You need Super Admin privileges to view and modify {activeTab} settings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
