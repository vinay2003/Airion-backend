import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User as UserIcon, Bell, Shield, Globe, MapPin, Camera, Save, Loader, HelpCircle, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@shared/auth/AuthContext';
import { updateProfile, uploadImage, changePassword } from '../../lib/api';
import { toast } from 'react-hot-toast';


const CURRENCIES = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)'];

const ProfileSettings: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Form State - Clear default "User +91..." names for a better UX
    const [name, setName] = useState(() => {
        if (!user?.name) return '';
        if (user.name.startsWith('User +')) return '';
        return user.name;
    });
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phoneNumber || '');
    const [location, setLocation] = useState(user?.location || 'Mumbai, IN');
    const [currency, setCurrency] = useState('INR (₹)');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Filter and prepare data
            const updateData: any = {
                name,
                location,
                phoneNumber: phone,
            };

            // Only send email if it's a valid string to avoid unique constraint issues with empty strings
            if (email && email.trim() !== '') {
                updateData.email = email.trim().toLowerCase();
            }

            await updateProfile(updateData);
            await refreshUser();
            toast.success('Profile updated successfully');
        } catch (error: any) {
            console.error('Update failed. Server response:', error.response?.data);
            const message = error.response?.data?.message || 'Failed to update profile';
            toast.error(typeof message === 'string' ? message : 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !currentPassword) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long');
            return;
        }

        setPasswordLoading(true);
        try {
            await changePassword({
                currentPassword,
                newPassword
            });
            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error('Password update failed:', error.response?.data);
            const message = error.response?.data?.message || 'Failed to update password';
            toast.error(typeof message === 'string' ? message : 'Update failed');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await uploadImage(file);
            // Ultra-safe extraction of the URL
            const url = response?.url || response?.data?.url || (typeof response === 'string' ? response : null);

            if (!url || typeof url !== 'string') {
                console.error('Failed to extract URL from:', response);
                throw new Error('Invalid response format');
            }

            await updateProfile({ avatar: url });
            await refreshUser();
            toast.success('Photo updated successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed. Please try again.');
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
                        <button
                            onClick={() => setActiveTab('help')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'help'
                                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                }`}
                        >
                            <HelpCircle size={18} />
                            Help Center
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-slate-800 shadow-sm min-h-[500px]">
                    {activeTab === 'profile' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Personal Information</h2>

                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-200 dark:border-slate-800">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-28 h-28 rounded-full bg-neutral-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center overflow-hidden transition-transform  active:scale-95">
                                        {uploading ? (
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm">
                                                <Loader className="animate-spin text-white" size={32} />
                                            </div>
                                        ) : (
                                            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                                        )}
                                        {!uploading && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Camera className="text-white" size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-red-500 text-white p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 z-10 group-hover:scale-110 transition-transform">
                                        <Camera size={16} />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-xl text-neutral-900 dark:text-white tracking-tight">Profile Photo</h3>
                                    <p className="text-sm font-medium text-neutral-500 dark:text-slate-400">Personalize your identity across the platform.</p>
                                    <p className="text-[10px] font-bold text-red-500 tracking-widest bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded inline-block">Recommended: 300x300px</p>
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
                                        <Input
                                            type="tel"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            className="bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 py-3 font-medium text-neutral-900 dark:text-white"
                                        />
                                        <p className="text-xs text-neutral-400 mt-1">Changing your phone number may require re-verification on next login.</p>
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
                                <div className="border border-neutral-200 dark:border-slate-800 rounded-2xl p-6 bg-neutral-50 dark:bg-slate-800/50">
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

                                <div className="pt-4">
                                    <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-neutral-900 dark:hover:bg-white text-white dark:hover:text-neutral-900 font-bold px-8 py-4 rounded-xl shadow-lg transition-colors flex items-center gap-2">
                                        {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                                        Save Preferences
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Security & Password</h2>

                            <div className="space-y-6">
                                <div className="p-6 border border-neutral-200 dark:border-slate-800 rounded-2xl bg-neutral-50 dark:bg-slate-800/30">
                                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-4">Change Password</h3>
                                    <form onSubmit={handleChangePassword} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-neutral-600 dark:text-slate-400">Current Password</label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="bg-white dark:bg-slate-800 border-neutral-200 dark:border-slate-700"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-neutral-600 dark:text-slate-400">New Password</label>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="bg-white dark:bg-slate-800 border-neutral-200 dark:border-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-neutral-600 dark:text-slate-400">Confirm New Password</label>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="bg-white dark:bg-slate-800 border-neutral-200 dark:border-slate-700"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={passwordLoading}
                                            className="mt-4 bg-black dark:bg-white text-white dark:text-black font-bold px-6 py-2 rounded-xl flex items-center gap-2"
                                        >
                                            {passwordLoading ? <Loader className="animate-spin" size={18} /> : <Lock size={18} />}
                                            Update Password
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-neutral-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-neutral-400">
                                <Bell size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Coming Soon</h3>
                            <p className="text-neutral-500 dark:text-slate-400 max-w-sm">This section is currently under development. Check back later for updates!</p>
                        </div>
                    )}

                    {activeTab === 'help' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Help Center</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { q: 'How do I book a venue?', a: 'Browse vendors, check availability, and click "Book Now" to start.' },
                                    { q: 'Can I cancel a booking?', a: 'Yes, cancellations are managed through your "My Bookings" page.' },
                                    { q: 'How do I contact a vendor?', a: 'Once booked, you can message vendors directly from the dashboard.' },
                                    { q: 'What payment methods are accepted?', a: 'We accept all major cards, UPI, and bank transfers via Razorpay.' }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 border border-neutral-200 dark:border-slate-800 rounded-2xl  transition-colors">
                                        <h4 className="font-bold text-neutral-900 dark:text-white mb-2">{item.q}</h4>
                                        <p className="text-sm text-neutral-500 dark:text-slate-400">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl text-center">
                                <p className="font-bold text-red-600 dark:text-red-400 mb-4">Still need help?</p>
                                <Button
                                    onClick={() => navigate('/dashboard/support')}
                                    className="bg-red-600 text-white font-bold px-8 py-3 rounded-xl"
                                >
                                    Contact Support
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
