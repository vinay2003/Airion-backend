import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Bell, Shield, Globe, MapPin, Camera, Save, Loader, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@shared/auth/AuthContext';
import { updateProfile, uploadImage } from '../../lib/api';
import { toast } from 'react-hot-toast';

const LANGUAGES = [
    { code: 'en', name: 'English (US)' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'es', name: 'Spanish (Español)' },
];

const CURRENCIES = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)'];

const ProfileSettings: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone] = useState(user?.phoneNumber || '');
    const [location, setLocation] = useState(user?.location || 'Mumbai, IN');
    const [language, setLanguage] = useState(user?.language || 'en');
    const [currency, setCurrency] = useState('INR (₹)');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({
                name,
                email,
                location,
                language,
            });
            await refreshUser();
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { url } = await uploadImage(file);
            await updateProfile({ avatar: url });
            await refreshUser();
            toast.success('Photo uploaded successfully');
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Personal Info', icon: <UserIcon size={18} /> },
        { id: 'preferences', label: 'Preferences', icon: <Globe size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    ];

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight mb-2">Account Settings</h1>
                <p className="text-neutral-500 dark:text-slate-400 font-medium text-lg">Manage your personal information, preferences, and security.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-2 relative">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id
                                    ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}

                    <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-slate-800">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-neutral-600 hover:bg-neutral-100 dark:text-slate-400 dark:hover:bg-slate-800">
                            <HelpCircle size={18} />
                            Help Center
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-slate-800 shadow-sm">
                    {activeTab === 'profile' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Personal Information</h2>

                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-200 dark:border-slate-800">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center overflow-hidden">
                                        {uploading ? (
                                            <Loader className="animate-spin text-red-500" size={32} />
                                        ) : (
                                            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        <Camera size={14} />
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handlePhotoUpload} 
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Profile Photo</h3>
                                    <p className="text-sm text-neutral-500 dark:text-slate-400 mt-1">We recommend a 300x300px image.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700 dark:text-slate-300">Full Name</label>
                                        <Input value={name} onChange={e => setName(e.target.value)} className="bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 py-3 font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700 dark:text-slate-300">Email Address</label>
                                        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 py-3 font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700 dark:text-slate-300">Phone Number</label>
                                        <Input type="tel" value={phone} className="bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 py-3 font-medium text-neutral-500" disabled />
                                        <p className="text-xs text-neutral-400 mt-1">Phone number is used for OTP logins.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700 dark:text-slate-300">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                            <Input value={location} onChange={e => setLocation(e.target.value)} className="pl-10 bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 py-3 font-medium" />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-neutral-900 dark:hover:bg-white text-white dark:hover:text-neutral-900 font-bold px-8 py-4 rounded-xl shadow-lg transition-colors flex items-center gap-2">
                                        {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'preferences' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Global Preferences</h2>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="border border-neutral-200 dark:border-slate-800 rounded-2xl p-6 bg-neutral-50 dark:bg-slate-800/50">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                                <Globe className="text-red-500" size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">Language</h3>
                                                <p className="text-sm text-neutral-500 dark:text-slate-400 mb-4">Select your preferred language for the Ease2event interface.</p>
                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {LANGUAGES.map(lang => (
                                                        <button
                                                            key={lang.code}
                                                            type="button"
                                                            onClick={() => setLanguage(lang.code)}
                                                            className={`p-3 rounded-xl border-2 text-sm font-bold transition-all text-left ${language === lang.code
                                                                    ? 'border-red-500 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm'
                                                                    : 'border-transparent bg-neutral-200/50 dark:bg-slate-900 text-neutral-600 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-800 hover:border-neutral-200 dark:hover:border-slate-700'
                                                                }`}
                                                        >
                                                            {lang.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-neutral-200 dark:border-slate-800 rounded-2xl p-6 bg-neutral-50 dark:bg-slate-800/50">
                                        <div className="flex flex-col md:flex-row gap-8">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">Currency</h3>
                                                <p className="text-sm text-neutral-500 dark:text-slate-400 mb-4">Choose the currency for displaying prices and processing payments.</p>
                                                <select
                                                    value={currency}
                                                    onChange={e => setCurrency(e.target.value)}
                                                    className="w-full max-w-xs bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
                                                >
                                                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-neutral-900 dark:hover:bg-white text-white dark:hover:text-neutral-900 font-bold px-8 py-4 rounded-xl shadow-lg transition-colors flex items-center gap-2">
                                        {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                                        Save Preferences
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {(activeTab === 'notifications' || activeTab === 'security') && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-neutral-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-neutral-400">
                                {activeTab === 'notifications' ? <Bell size={32} /> : <Shield size={32} />}
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Coming Soon</h3>
                            <p className="text-neutral-500 dark:text-slate-400 max-w-sm">This section is currently under development. Check back later for updates!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
