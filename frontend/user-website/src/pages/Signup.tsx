import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader, CheckCircle2, ArrowLeft, Phone } from 'lucide-react';
import { useAuth, otpAuth } from '@shared/auth';
import { motion, AnimatePresence } from 'framer-motion';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess(''); setLoading(true);

        try {
            const sanitizedPhone = phone.replace(/\s+/g, '').trim();
            const response = await otpAuth.sendSignupOTP({ phone: sanitizedPhone });
            const devCode = response?.devOtp || response?.otp || (response as any)?.data?.otp;
            if (import.meta.env.DEV) {
                console.log('OTP Response:', response);
                if (devCode) console.log('DEVELOPMENT CODE:', devCode);
            }

            if (devCode) {
                window.alert(`DEVELOPMENT OTP: ${devCode}\n\nUse this code to verify your phone number.`);
                setSuccess('OTP sent successfully to your phone!');
            } else {
                setSuccess('OTP sent successfully to your phone!');
            }
            setStep('otp');
        } catch (err: any) {
            console.error('OTP Signup Send Error:', err.response?.data || err.message);
            if (err.response?.status === 409) {
                setError('User already exists with this phone number. Please login.');
            } else {
                setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);

        try {
            const sanitizedPhone = phone.replace(/\s+/g, '').trim();
            const response = await otpAuth.verifySignupOTP({
                phone: sanitizedPhone,
                otp: otp.trim(),
                name: `User ${sanitizedPhone}`,
            });

            if (response.access_token) {
                loginWithToken(response.access_token);
                setSuccess('Account created successfully! Redirecting...');
                setTimeout(() => navigate('/onboarding/interests'), 1000);
            }
        } catch (err: any) {
            console.error('OTP Verify Error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex">
            {/* Left Side: Inspiration (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 overflow-hidden bg-neutral-900 border-r border-neutral-200 dark:border-slate-800">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519225468359-2996bc01c32c?q=80"
                        alt="Event Decor"
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-lg mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 mb-6"
                    >
                        <Sparkles className="text-red-500" size={32} />
                        <span className="text-3xl font-black text-white tracking-tight font-cursive">Airion</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1]"
                    >
                        Discover the best vendors for your events.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="text-lg text-neutral-300 font-medium mb-12"
                    >
                        Create a free account to unlock exclusive pricing, customized itineraries, and secure online bookings with top-rated professionals.
                    </motion.p>

                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" className="w-12 h-12 rounded-full border-2 border-black" />
                            ))}
                        </div>
                        <div className="text-sm font-bold text-white">
                            <p>Join 50k+ Members</p>
                            <p className="text-neutral-400 font-medium">planning dream events</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-slate-950">
                <Link to="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-neutral-500 hover:text-red-500 font-bold transition-colors group z-20">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="w-full max-w-md mt-16 lg:mt-0 relative z-10">
                    <div className="mb-10 lg:hidden flex items-center gap-2 justify-center">
                        <Sparkles className="text-red-500" size={28} />
                        <span className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight font-cursive">Airion</span>
                    </div>

                    <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-2">Create an Account</h2>
                    <p className="text-neutral-500 dark:text-slate-400 font-medium mb-8">
                        {step === 'phone' ? 'Enter your phone number to get started.' : `Enter the 6-digit code sent to ${phone}.`}
                    </p>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-sm font-bold border border-green-100 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400 flex items-center gap-2">
                                <CheckCircle2 size={18} /> {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div key="signup-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        {step === 'phone' ? (
                            <form onSubmit={handleSendOTP} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-neutral-700 dark:text-slate-300">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                        <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 text-lg tracking-wider"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-neutral-900 dark:hover:bg-white text-white dark:hover:text-neutral-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] mt-2">
                                    {loading ? <Loader className="animate-spin" /> : <>Send OTP Securely <ArrowRight size={18} /></>}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="space-y-5">
                                <div className="space-y-2 text-center">
                                    <label className="text-sm font-bold text-neutral-700 dark:text-slate-300 mb-2 block">Enter the 6-digit OTP sent to {phone}</label>
                                    <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
                                        className="w-full text-center py-4 bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-black text-3xl tracking-[0.5em] text-neutral-900 dark:text-white uppercase"
                                        placeholder="000000"
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-neutral-900 dark:hover:bg-white text-white dark:hover:text-neutral-900 py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] mt-2">
                                    {loading ? <Loader className="animate-spin" /> : 'Create Account & Join'}
                                </button>
                                <div className="flex justify-between items-center px-2">
                                    <button type="button" onClick={() => setStep('phone')} disabled={loading} className="text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Back</button>
                                    <button type="button" onClick={handleSendOTP as any} disabled={loading} className="text-sm font-bold text-red-500 hover:text-red-600">Resend Code</button>
                                </div>
                            </form>
                        )}
                    </motion.div>

                    <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-slate-800">
                        <p className="text-center text-sm font-medium text-neutral-500 dark:text-slate-400">
                            Already have an account? <Link to="/login" className="text-red-500 hover:text-red-600 font-bold ml-1">Log In Instead</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
