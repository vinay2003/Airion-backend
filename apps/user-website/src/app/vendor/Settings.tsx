import React, { useState, useRef } from 'react';
import { User, Bell, Lock, CreditCard, Globe, Moon, Sun, Save, ShieldCheck, Upload, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Split name for display
    const displayName = user?.name || user?.email?.split('@')[0] || user?.phoneNumber || 'User';
    const initials = (user?.name?.substring(0, 2) || displayName.substring(0, 2)).toUpperCase();

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { uploadImage, updateProfile } = await import('../../lib/api');
            const { toast } = await import('react-hot-toast');
            const response = await uploadImage(file);
            const url = response?.url || response?.data?.url || (typeof response === 'string' ? response : null);

            if (!url || typeof url !== 'string') {
                throw new Error('Invalid response format');
            }

            await updateProfile({ avatar: url });
            // Since there is no refreshUser in AuthContext exposed here, we might just reload
            window.location.reload();
        } catch (error) {
            console.error('Upload error:', error);
            const { toast } = await import('react-hot-toast');
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'verification', label: 'Verification (KYC)', icon: ShieldCheck },
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
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                                        {uploading ? (
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm">
                                                <Upload className="animate-spin text-white" size={20} />
                                            </div>
                                        ) : user?.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            initials
                                        )}
                                        {!uploading && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Upload className="text-white" size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                                            {uploading ? 'Uploading...' : 'Change Photo'}
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                        />
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">JPG, GIF or PNG. Max size of 2MB</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            defaultValue={displayName}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            disabled
                                            defaultValue={user?.email || ''}
                                            className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg outline-none text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            defaultValue={user?.phoneNumber || ''}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-gray-900 dark:text-slate-200 transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Bio</label>
                                        <textarea
                                            rows={4}
                                            defaultValue="Professional event provider on Ease2event."
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

                        {activeTab === 'verification' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Business Verification</h2>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Submit your official documents to get the "Verified Host" badge and boost your rankings.</p>
                                </div>
                                <div className="grid gap-6">
                                    <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">Government ID</h3>
                                                <p className="text-sm text-gray-500 dark:text-slate-400">Passport, Aadhar, or Driver's License</p>
                                            </div>
                                            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <CheckCircle size={14} /> Verified
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">Business Registration Proof</h3>
                                                <p className="text-sm text-gray-500 dark:text-slate-400">GST Certificate, Trade License, or Incorporation Document</p>
                                            </div>
                                            <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                Pending Action
                                            </span>
                                        </div>
                                        <div className="mt-4 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors group relative">
                                            <Upload className="mx-auto text-gray-400 group-hover:text-red-500 transition-colors mb-2" size={32} />
                                            <p className="font-bold text-gray-700 dark:text-slate-300">Click to upload document</p>
                                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG up to 10MB</p>
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                        </div>
                                    </div>
                                </div>
                                <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-md shadow-red-500/20 w-full sm:w-auto">
                                    Submit for Review
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
