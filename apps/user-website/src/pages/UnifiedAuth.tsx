import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import {
    Eye, EyeOff, Mail, Lock, ArrowLeft, Phone, ArrowRight, Loader,
    Sparkles, Clock, CheckCircle2, User, Building, ShieldCheck
} from 'lucide-react';
import { useAuth, otpAuth, commonAuth, UserRole } from '@airion/shared/auth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import OTPInput from '@airion/shared/components/OTPInput';

type AuthMode = 'login' | 'signup';

const UnifiedAuth: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const from = location.state?.redirect || '/';

    // UI States
    const [mode, setMode] = useState<AuthMode>('login');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);

    // Form Data
    const [phone, setPhone] = useState('');
    const [normalizedPhone, setNormalizedPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const startResendTimer = () => setResendTimer(60);

    useEffect(() => {
        const portal = searchParams.get('portal');
        if (portal === 'vendor') setSelectedRole(UserRole.VENDOR);
        if (portal === 'admin') setSelectedRole(UserRole.ADMIN);

        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer, searchParams]);


    const handleSendOTP = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (resendTimer > 0) return;

        setLoading(true);
        try {
            const sanitizedPhone = phone.replace(/\s+/g, '').trim();
            const digitsOnly = sanitizedPhone.replace(/\D/g, '');
            const isTenDigits = digitsOnly.length === 10;

            if (!isTenDigits) {
                toast.error('Please enter a valid 10-digit phone number');
                setLoading(false);
                return;
            }

            // Standardize to e.164 (+91 for India)
            const finalPhone = `+91${digitsOnly}`;
            setNormalizedPhone(finalPhone);

            const response = mode === 'signup'
                ? await otpAuth.sendSignupOTP({ phone: finalPhone })
                : await otpAuth.sendLoginOTP({ phone: finalPhone });

            const devCode = (response as any)?._dev_otp || (response as any)?.data?._dev_otp;
            if (import.meta.env.DEV && devCode) {
                console.log('📱 Dev-Only OTP:', devCode);
                toast(`Dev Code: ${devCode}`, { icon: '🔑', duration: 10000 });
            }

            toast.success('Verification code sent');
            setStep('otp');
            setResendTimer(60);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    }, [phone, mode, resendTimer]);

    const handleVerifyOTP = async (finalOtp?: string) => {
        const otpValue = finalOtp || otp;
        if (!otpValue || otpValue.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        try {
            const response = mode === 'signup'
                ? await otpAuth.verifySignupOTP({
                    phone: normalizedPhone,
                    otp: otpValue.trim(),
                    role: selectedRole
                })
                : await otpAuth.verifyLoginOTP({
                    phone: normalizedPhone,
                    otp: otpValue.trim()
                });

            if (response.access_token) {
                const user = response?.user;
                const role = user?.role || 'user';

                loginWithToken(response.access_token);
                toast.success(mode === 'signup' ? 'Welcome to Ease2event!' : 'Welcome back!');

                setTimeout(() => {
                    const VENDOR_URL_BASE = (import.meta.env.VITE_VENDOR_URL as string) || 'http://localhost:5174';
                    const ADMIN_URL_BASE = (import.meta.env.VITE_ADMIN_URL as string) || 'http://localhost:5175';

                    if (role === 'vendor') {
                        const target = mode === 'signup' ? 'signup-form' : '';
                        const token = response.access_token;
                        window.location.href = `${VENDOR_URL_BASE}/vendor/${target}?token=${token}`;
                    } else if (role === 'admin') {
                        const token = response.access_token;
                        window.location.href = `${ADMIN_URL_BASE}/admin/?token=${token}`;
                    } else {
                        navigate(mode === 'signup' ? '/onboarding/interests' : from);
                    }
                }, 800);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };

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
                const VENDOR_URL_BASE = (import.meta.env.VITE_VENDOR_URL as string) || 'http://localhost:5174';
                const ADMIN_URL_BASE = (import.meta.env.VITE_ADMIN_URL as string) || 'http://localhost:5175';

                if (role === 'vendor') {
                    window.location.href = `${VENDOR_URL_BASE}/vendor`;
                } else if (role === 'admin') {
                    window.location.href = `${ADMIN_URL_BASE}/admin`;
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

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex font-sans">
            {/* Left Side: Branding & Inspiration */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-16 overflow-hidden bg-neutral-900 border-r border-neutral-100 dark:border-slate-900">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80"
                        alt="Event Setup"
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                            <Sparkles className="text-white" size={28} />
                        </div>
                        <span className="text-4xl font-black text-white tracking-tight font-cursive">Ease2event</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight"
                    >
                        {mode === 'login' ? 'Book your next event faster with Ease2event.' : 'Join the elite marketplace for events.'}
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-xl text-neutral-300 font-medium mb-12 max-w-lg leading-relaxed"
                    >
                        {mode === 'login' ? 'Login to manage your bookings, message vendors, and track your event budgets in real-time.' : 'Create an account to discover verified vendors and access professional planning tools for free.'}
                    </motion.p>

                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="User" className="w-12 h-12 rounded-full border-2 border-black" />
                            ))}
                        </div>
                        <div className="text-sm font-bold text-white">
                            <p>Trusted by 50,000+ Members</p>
                            <p className="text-neutral-400 font-medium">making events magical every day</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Logic */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative bg-white dark:bg-slate-950 overflow-y-auto">
                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-neutral-500 hover:text-red-500 font-bold transition-colors group z-20">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Explorer
                </Link>

                <div className="w-full max-w-md mt-12 lg:mt-0 relative z-10">
                    <div className="mb-12 lg:hidden flex items-center gap-2 justify-center">
                        <Sparkles className="text-red-500" size={28} />
                        <span className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight font-cursive tracking-wider">Ease2event</span>
                    </div>

                    {/* Mode Toggle Tabs */}
                    <div className="flex p-1 bg-neutral-100 dark:bg-slate-900 rounded-2xl mb-10 w-full">
                        <button
                            onClick={() => { setMode('login'); setStep('phone'); }}
                            className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${mode === 'login' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setStep('phone'); }}
                            className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${mode === 'signup' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                        >
                            Create Account
                        </button>
                    </div>

                    <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-2">
                        {mode === 'login' ? 'Welcome Back!' : 'Get Started with Ease2event'}
                    </h2>
                    <p className="text-neutral-500 dark:text-slate-400 font-medium mb-8">
                        {step === 'phone' ? 'Secure, passwordless access to your account.' : `We've sent a code to ${phone}.`}
                    </p>

                    {/* Role Selector during Signup */}
                    {mode === 'signup' && step === 'phone' && (
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-10 bg-neutral-50 dark:bg-slate-900/50 p-2 rounded-[2rem] border border-neutral-100 dark:border-slate-800">
                            {[
                                { id: UserRole.USER, label: 'Planner', icon: User },
                                { id: UserRole.VENDOR, label: 'Vendor', icon: Building },
                                { id: UserRole.ADMIN, label: 'Admin', icon: ShieldCheck }
                            ].map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id as UserRole)}
                                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300 ${selectedRole === role.id
                                        ? 'bg-red-600 text-white shadow-xl shadow-red-500/20 font-black scale-[1.05] z-10'
                                        : 'text-neutral-400 font-bold hover:bg-white dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <role.icon size={20} className={selectedRole === role.id ? 'scale-110' : ''} />
                                    <span className="text-[9px] uppercase tracking-[0.15em]">{role.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 'phone' ? (
                            <motion.form key="phone-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSendOTP} className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-neutral-700 dark:text-slate-300 uppercase tracking-widest">Phone Number</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-red-500 transition-colors">
                                            <Phone size={20} />
                                        </div>
                                        <input
                                            type="tel"
                                            inputMode="numeric"
                                            required
                                            value={phone}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setPhone(val);
                                            }}
                                            className="w-full pl-12 pr-12 py-4 bg-neutral-50 dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-neutral-900 dark:text-white text-xl tracking-wider"
                                            placeholder="99999 00000"
                                        />
                                        {phone.length === 10 && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in">
                                                <CheckCircle2 size={24} fill="currentColor" className="text-white dark:text-slate-900" />
                                            </div>
                                        )}
                                        {phone.length > 0 && phone.length < 10 && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 text-xs font-black">
                                                {phone.length}/10
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-black dark:hover:bg-white text-white dark:hover:text-neutral-900 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-500/10 active:scale-[0.98] uppercase tracking-[0.2em] text-xs italic">
                                    {loading ? <Loader className="animate-spin" /> : <>Continue Securely <ArrowRight size={20} /></>}
                                </button>
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                        className="text-sm font-bold text-neutral-500 hover:text-red-500 transition-colors"
                                    >
                                        {mode === 'login' ? 'No account? Join Ease2event here' : 'Already registered? Sign in'}
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div key="otp-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-6 text-center">
                                    <label className="text-xs font-black text-neutral-700 dark:text-slate-300 uppercase tracking-widest block">One-Time Password</label>
                                    <div className="flex justify-center">
                                        <OTPInput length={6} onComplete={handleVerifyOTP} disabled={loading} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleVerifyOTP()}
                                        disabled={loading || otp.length < 6}
                                        className="w-full bg-neutral-900 dark:bg-white dark:text-neutral-950 text-white py-4.5 rounded-2xl font-black flex items-center justify-center transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? <Loader className="animate-spin" /> : 'Confirm & Proceed'}
                                    </button>

                                    <div className="flex flex-col items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => { if (resendTimer === 0) handleSendOTP(); }}
                                            disabled={loading || resendTimer > 0}
                                            className={`text-sm font-black flex items-center gap-2 ${resendTimer > 0 ? 'text-neutral-400' : 'text-red-600 hover:text-red-700'}`}
                                        >
                                            {resendTimer > 0 ? <><Clock size={16} /> Resend in {resendTimer}s</> : 'I didn\'t get a code'}
                                        </button>
                                        <button onClick={() => setStep('phone')} className="text-sm font-bold text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                                            Switch phone number
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p className="mt-12 text-[15px] text-center text-neutral-400 font-bold leading-relaxed uppercase tracking-tighter">
                        By continuing, you verify you are of legal age and agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UnifiedAuth;
