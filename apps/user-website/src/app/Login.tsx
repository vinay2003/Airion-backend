import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Phone, ArrowRight, Loader, Sparkles, Clock } from 'lucide-react';
import { useAuth, otpAuth, commonAuth } from '@airion/shared/auth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import OTPInput from '@airion/shared/components/OTPInput';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const from = location.state?.redirect || '/';

    const [authMode, setAuthMode] = useState<'password' | 'otp'>('otp');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            loginWithToken(token);
            navigate(from);
        }
    }, [searchParams, loginWithToken, navigate, from]);

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await commonAuth.login(email, password);
            const user = response?.user;
            const role = user?.role || 'user';

            loginWithToken(response.access_token);
            toast.success('Welcome back!');
            setTimeout(() => {
                if (role === 'vendor') {
                    window.location.href = 'http://localhost:5174/vendor';
                } else if (role === 'admin') {
                    window.location.href = 'http://localhost:5175/admin';
                } else {
                    navigate(from);
                }
            }, 800);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    const startResendTimer = () => setResendTimer(60);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleSendOTP = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (resendTimer > 0) return;

        setLoading(true);
        try {
            const sanitizedPhone = phone.replace(/\s+/g, '').trim();
            const response = await otpAuth.sendLoginOTP({ phone: sanitizedPhone });

            // Handle dev-only code
            const devCode = (response as any)?._dev_otp || (response as any)?.data?._dev_otp;
            if (import.meta.env.DEV && devCode) {
                console.log('📱 Dev-Only OTP:', devCode);
                toast(`Dev Code: ${devCode}`, { icon: '🔑', duration: 10000 });
            }

            toast.success('Verification code sent');
            setStep('otp');
            startResendTimer();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    }, [phone, resendTimer, navigate]);

    const handleVerifyOTP = async (finalOtp?: string) => {
        const otpValue = finalOtp || otp;
        if (otpValue.length < 6) return;

        setLoading(true);
        try {
            const sanitizedPhone = phone.replace(/\s+/g, '').trim();
            const portalRole = searchParams.get('portal') || 'user';
            const response = await otpAuth.verifyLoginOTP({ 
                phone: sanitizedPhone, 
                otp: otpValue.trim(),
                role: portalRole as any
            });
            if (response.access_token) {
                // Determine portal redirection based on user role
                const user = response?.user;
                const role = user?.role || 'user';

                loginWithToken(response.access_token);
                toast.success('Verified successfully');

                setTimeout(() => {
                    if (role === 'vendor') {
                        window.location.href = 'http://localhost:5174/vendor';
                    } else if (role === 'admin') {
                        window.location.href = 'http://localhost:5175/admin';
                    } else {
                        navigate(from);
                    }
                }, 800);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'The code you entered is incorrect.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex">
            {/* Left Side: Inspiration (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 overflow-hidden bg-neutral-900">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80"
                        alt="Event Setup"
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
                        Your perfect event begins here.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="text-lg text-neutral-300 font-medium mb-12"
                    >
                        Join thousands of users planning remarkable weddings, corporate events, and parties with top-tier vendors.
                    </motion.p>

                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-12 h-12 rounded-full border-2 border-black" />
                            ))}
                        </div>
                        <div className="text-sm font-bold text-white">
                            <p>Over 10,000+</p>
                            <p className="text-neutral-400 font-medium">events successfully hosted</p>
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

                    <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-2">Welcome Back</h2>
                    <p className="text-neutral-500 dark:text-slate-400 font-medium mb-8">
                        {authMode === 'otp' ? 'Login seamlessly with your phone number.' : 'Login with your email and password.'}
                    </p>

                    <div className="mb-4 h-6">
                        {/* Space for layout stability */}
                    </div>

                    {authMode === 'password' ? (
                        <motion.form
                            key="password-form"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            onSubmit={handlePasswordLogin}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-700 dark:text-slate-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-neutral-700 dark:text-slate-300">Password</label>
                                    <Link to="/forgot-password" className="text-xs font-bold text-red-500 hover:text-red-600">Forgot Password?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3.5 bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-neutral-900 dark:hover:bg-white text-white dark:hover:text-neutral-900 py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg active:scale-[0.98] mt-2">
                                {loading ? <Loader className="animate-spin" /> : 'Log in to your account'}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div key="otp-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
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
                                        {loading ? <Loader className="animate-spin" /> : <>Continue securely <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-4 text-center">
                                        <label className="text-sm font-bold text-neutral-700 dark:text-slate-300 block">Verification Code</label>
                                        <p className="text-xs text-neutral-500 font-medium">We've sent a 6-digit code to <span className="font-bold text-neutral-900 dark:text-white">{phone}</span></p>

                                        <OTPInput
                                            length={6}
                                            onComplete={setOtp}
                                            disabled={loading}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleVerifyOTP()}
                                        disabled={loading || otp.length < 6}
                                        className="w-full bg-red-600 hover:bg-neutral-900 dark:hover:bg-white text-white dark:hover:text-neutral-900 py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader className="animate-spin" /> : 'Confirm & Sign In'}
                                    </button>

                                    <div className="flex flex-col gap-4 text-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (resendTimer === 0) handleSendOTP();
                                            }}
                                            disabled={loading || resendTimer > 0}
                                            className={`text-sm font-bold flex items-center justify-center gap-2 ${resendTimer > 0 ? 'text-neutral-400 cursor-not-allowed' : 'text-red-500 hover:text-red-600'}`}
                                        >
                                            {resendTimer > 0 ? (
                                                <><Clock size={16} /> Resend code in {resendTimer}s</>
                                            ) : (
                                                'Didn\'t receive a code? Resend'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep('phone')}
                                            disabled={loading}
                                            className="text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                                        >
                                            Change phone number
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    <div className="mt-10 mb-8 relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200 dark:border-slate-800"></div></div>
                        <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-neutral-400">
                            <span className="bg-white dark:bg-slate-950 px-4">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button onClick={() => { setAuthMode(authMode === 'otp' ? 'password' : 'otp'); setStep('phone'); }}
                            className="w-full bg-white dark:bg-slate-900 border-2 border-neutral-200 dark:border-slate-800 hover:border-neutral-900 dark:hover:border-white text-neutral-900 dark:text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                            {authMode === 'otp' ? <><Mail size={18} /> Login with Email Address</> : <><Phone size={18} /> Login via Mobile OTP</>}
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm font-medium text-neutral-500 dark:text-slate-400">
                        Don't have an account? <Link to="/signup" className="text-red-500 hover:text-red-600 font-bold ml-1">Sign up for free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

