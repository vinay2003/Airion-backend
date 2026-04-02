import React, { useState } from 'react';
import { User, Bell, Lock, Shield, Globe, Moon, Sun, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'admin', label: 'Admin Users', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'platform', label: 'Platform', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-slate-400">Manage platform settings and configurations</p>
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
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">General Settings</h2>
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Platform Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Airion"
                                            className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                        />
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Support Email</label>
                                        <input
                                            type="email"
                                            defaultValue="support@airion.com"
                                            className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                        />
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-500/20">
                                    <Save size={20} />
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {activeTab === 'admin' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Users</h2>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">
                                                    A{i}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">Admin User {i}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-slate-400">admin{i}@airion.com</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors text-sm font-medium">
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-500/20">
                                    Add Admin User
                                </button>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
                                <div className="space-y-4">
                                    {[
                                        { label: 'New Vendor Registrations', description: 'Get notified when new vendors register' },
                                        { label: 'User Reports', description: 'Receive alerts for user-reported issues' },
                                        { label: 'System Alerts', description: 'Important system notifications' },
                                        { label: 'Weekly Reports', description: 'Receive weekly platform analytics' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                                                <p className="text-sm text-gray-500 dark:text-slate-400">{item.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked={idx < 3} className="sr-only peer" />
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
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Add an extra layer of security to your account</p>
                                        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                                            Enable 2FA
                                        </button>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Session Timeout</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Automatically log out after period of inactivity</p>
                                        <select className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all">
                                            <option>15 minutes</option>
                                            <option>30 minutes</option>
                                            <option>1 hour</option>
                                            <option>Never</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'platform' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform Configuration</h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Vendor Approval</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Require manual approval for new vendor registrations</p>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                        </label>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Commission Rate</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Platform commission percentage on bookings</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                defaultValue="10"
                                                min="0"
                                                max="100"
                                                className="w-24 px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                            />
                                            <span className="text-gray-600 dark:text-slate-400">%</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-500/20">
                                    <Save size={20} />
                                    Save Configuration
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
