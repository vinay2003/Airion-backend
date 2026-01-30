import React, { useState } from 'react';
import { User, Bell, Lock, CreditCard, Globe, Moon, Sun, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'preferences', label: 'Preferences', icon: Globe },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-slate-400">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                                        : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
                                        JD
                                    </div>
                                    <div>
                                        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                                            Change Photo
                                        </button>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">JPG, GIF or PNG. Max size of 2MB</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            defaultValue="John"
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Doe"
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            defaultValue="john.doe@example.com"
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            defaultValue="+91 98765 43210"
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Bio</label>
                                        <textarea
                                            rows={4}
                                            defaultValue="Professional event venue provider with 10+ years of experience."
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all resize-none"
                                        />
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-500/20">
                                    <Save size={20} />
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Email Notifications', description: 'Receive email updates about your bookings' },
                                        { label: 'SMS Notifications', description: 'Get text messages for important updates' },
                                        { label: 'Push Notifications', description: 'Receive push notifications on your device' },
                                        { label: 'Marketing Emails', description: 'Receive promotional emails and offers' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                                                <p className="text-sm text-gray-500 dark:text-slate-400">{item.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked={idx < 2} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                        />
                                    </div>
                                    <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-500/20">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Billing Information</h2>
                                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                    <p className="text-sm text-gray-600 dark:text-slate-400">Current Plan: <span className="font-bold text-gray-900 dark:text-white">Professional</span></p>
                                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Next billing date: <span className="font-medium text-gray-900 dark:text-white">Jan 1, 2025</span></p>
                                </div>
                                <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-500/20">
                                    Manage Subscription
                                </button>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">Choose your preferred theme</p>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            {theme === 'light' ? <Moon size={20} className="text-gray-600 dark:text-slate-300" /> : <Sun size={20} className="text-gray-600 dark:text-slate-300" />}
                                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                                            </span>
                                        </button>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Language</label>
                                        <select className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all">
                                            <option>English</option>
                                            <option>Hindi</option>
                                            <option>Spanish</option>
                                        </select>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Timezone</label>
                                        <select className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all">
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
