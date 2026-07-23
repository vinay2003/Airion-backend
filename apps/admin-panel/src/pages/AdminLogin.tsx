import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, ArrowRight } from 'lucide-react';
import { useAuth, adminAuth } from '@ease2event/shared';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
    const { loginWithResponse } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showOTP, setShowOTP] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [tempToken, setTempToken] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Send OTP to admin email
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return toast.error('Enter your admin email');
        setLoading(true);
        try {
            const res = await adminAuth.sendOtp(email.trim());
            toast.success(res.message || 'OTP sent to your email');
            setShowOTP(true);
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Failed to send OTP';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and login
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) return toast.error('Enter the complete 6-digit OTP');
        setLoading(true);
        try {
            const response = await adminAuth.verifyOtp(email.trim(), code);
            if (response.require2fa) {
                setTempToken(response.tempToken || '');
                setShowOTP(false);
                setShow2FA(true);
                setOtp(['', '', '', '', '', '']); // Reset OTP for 2FA
            } else {
                loginWithResponse(response);
                toast.success('Login successful!');
                navigate('/');
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Invalid OTP';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    
    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) return toast.error('Enter the 6-digit Authenticator code');
        setLoading(true);
        try {
            // Note: Add verify2fa to adminAuth in shared package if needed. For now, calling it via axios/api is ideal.
            // Using standard fetch since we might not have it in shared yet.
            const apiRes = await fetch(import.meta.env.VITE_API_URL + '/api/auth/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken, otp: code })
            });
            const data = await apiRes.json();
            if (!apiRes.ok) throw new Error(data.message || 'Invalid 2FA code');
            
            loginWithResponse(data);
            toast.success('Login successful!');
            navigate('/');
        } catch (err: any) {
            toast.error(err.message || 'Invalid 2FA code');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value !== '' && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl  border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="p-8">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <Shield size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                        {showOTP ? 'Two-Factor Auth' : 'Admin Portal'}
                    </h2>
                    <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-8">
                        {showOTP
                            ? `Enter the 6-digit OTP sent to ${email}`
                            : 'Secure access for Ease2event administrators'}
                    </p>

                    {/* Step 1: Email Address */}
                    {!showOTP && !show2FA && (
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                    Admin Email Address
                                </label>
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
                                        placeholder="admin@ease2event.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-red-600  text-white py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-70"
                            >
                                {loading
                                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <><span>Send OTP</span><ArrowRight size={16} /></>}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {showOTP && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-red-600  text-white py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-70"
                            >
                                {loading
                                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : 'Verify & Login'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setShowOTP(false); setOtp(['', '', '', '', '', '']); }}
                                className="w-full text-sm font-medium text-gray-500  "
                            >
                                ← Back / Resend OTP
                            </button>
                        </form>
                    )}
                
                    {/* Step 3: 2FA Verification */}
                    {show2FA && (
                        <form onSubmit={handleVerify2FA} className="space-y-6">
                            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-4">
                                Enter the 6-digit code from your Authenticator app
                            </p>
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-red-600  text-white py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-70"
                            >
                                {loading
                                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : 'Verify Authenticator'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setShow2FA(false); setShowOTP(false); setOtp(['', '', '', '', '', '']); }}
                                className="w-full text-sm font-medium text-gray-500  "
                            >
                                ← Back to Login
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
