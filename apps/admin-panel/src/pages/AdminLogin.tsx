import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@ease2event/shared';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            if (email === 'admin@airion.com' && password === 'admin') {
                setShowOTP(true);
            } else {
                toast.error('Invalid credentials');
            }
        }, 1000);
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) return toast.error('Enter 6-digit OTP');
        
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Simulate successful login
            login('dummy-token', { id: 'admin1', name: 'Super Admin', email: 'admin@airion.com', role: 'admin' });
            toast.success('Login successful');
            navigate('/');
        }, 1000);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value !== '' && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden relative">
                
                <div className="p-8">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <Shield size={32} />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                        {showOTP ? 'Two-Factor Auth' : isForgotPassword ? 'Reset Password' : 'Admin Portal'}
                    </h2>
                    <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-8">
                        {showOTP ? 'Enter the 6-digit code sent to your device' : isForgotPassword ? 'Enter your email to receive a reset link' : 'Secure access for Airion administrators'}
                    </p>

                    {/* Login Form */}
                    {!showOTP && !isForgotPassword && (
                        <form onSubmit={handleLoginSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                        placeholder="admin@airion.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600" />
                                    <span className="text-sm text-gray-600 dark:text-slate-400">Remember me</span>
                                </label>
                                <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm font-medium text-red-600 hover:text-red-500">
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-70"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Secure Login'}
                            </button>
                        </form>
                    )}

                    {/* OTP Form */}
                    {showOTP && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-70"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Verify & Proceed'}
                            </button>
                            <button type="button" onClick={() => setShowOTP(false)} className="w-full text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-slate-300">
                                Back to login
                            </button>
                        </form>
                    )}

                    {/* Forgot Password */}
                    {isForgotPassword && (
                        <form onSubmit={(e) => { e.preventDefault(); toast.success('Reset link sent!'); setIsForgotPassword(false); }} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                    placeholder="admin@airion.com"
                                />
                            </div>
                            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-bold">
                                Send Reset Link
                            </button>
                            <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-slate-300">
                                Back to login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
