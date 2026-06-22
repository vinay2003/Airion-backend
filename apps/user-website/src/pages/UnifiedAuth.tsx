import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import {
    Eye, EyeOff, Mail, Lock, ArrowLeft, Phone, ArrowRight, Loader,
    Sparkles, Clock, CheckCircle2, User, Building, ShieldCheck
} from 'lucide-react';
import { useAuth, otpAuth, commonAuth, UserRole, decodeToken, tokenService, getPortalUrl } from '@ease2event/shared/auth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import OTPInput from '@ease2event/shared/components/OTPInput';

type AuthMode = 'login' | 'signup';

/**
 * 🔐 Unified Authentication Gateway: Ease2event Core
 * Email OTP-based authentication. No Firebase Phone Auth / reCAPTCHA dependency.
 * Reconciles Identity Registry for Users, Vendors, and Administrative Entities.
 */

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const UnifiedAuth: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithResponse, user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    // UI States
    const [mode, setMode] = useState<AuthMode>(() => {
        return location.pathname.includes('signup') ? 'signup' : 'login';
    });
    const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);

    // Form Data
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [loading, setLoading] = useState(false);

    // Identity Configuration & Validation
    useEffect(() => {
        const portal = searchParams.get('portal');
        const isAdminPath = location.pathname.includes('/admin/login');

        if (isAdminPath) {
            setSelectedRole(UserRole.ADMIN);
            setMode('login');
        } else if (portal === 'vendor') {
            setSelectedRole(UserRole.VENDOR);
        } else {
            setSelectedRole(UserRole.USER);
        }
    }, [location.pathname, searchParams]);

    // 🚀 Auto-Redirection: Open Dashboard for Synchronized Nodes
    useEffect(() => {
        const action = searchParams.get('action');

        if (action === 'logout') return;

        if (isAuthenticated && user && !authLoading) {
            const token = tokenService.getAccessToken();
            const tokenParam = token ? `?token=${token}` : '';

            if (user.role === UserRole.VENDOR) {
                const targetUrl = getPortalUrl('vendor');
                const baseUrl = targetUrl.endsWith('/') ? targetUrl : `${targetUrl}/`;
                window.location.href = token ? `${baseUrl}${tokenParam}` : baseUrl;
            } else if (user.role === UserRole.ADMIN) {
                if (isLocal) {
                    window.location.href = `http://localhost:5175/${tokenParam}`;
                } else {
                    const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;
                    window.location.href = ADMIN_URL ? `${ADMIN_URL}/${tokenParam}` : `/admin${tokenParam}`;
                }
            } else {
                if (step === 'details') return;
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, user, authLoading, navigate, step, searchParams]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // ─── Send OTP via Email ────────────────────────────────────────────────────
    const handleSendOTP = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (resendTimer > 0) return;

        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        if (selectedRole === UserRole.ADMIN) {
            toast.error('Admin login uses a different channel. Contact your administrator.');
            return;
        }

        setLoading(true);
        try {
            console.log('[Email OTP] 📧 Sending OTP to:', trimmedEmail, '| Mode:', mode);

            if (mode === 'signup') {
                await otpAuth.sendSignupOTP({ email: trimmedEmail });
            } else {
                await otpAuth.sendLoginOTP({ email: trimmedEmail });
            }

            console.log('[Email OTP] ✅ OTP sent successfully');
            toast.success(`Verification code sent to ${trimmedEmail}`);
            setStep('otp');
            setResendTimer(60);
        } catch (err: any) {
            console.error('[Email OTP] ❌ Error:', err?.response?.data || err?.message);
            const apiMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || '';
            const status = err?.response?.status;

            // ── Network error (backend not ready / offline) ──
            if (!status) {
                toast.error('Cannot reach server. Please wait a moment and try again.', { duration: 4000 });
                return;
            }

            // ── Signup: Email already registered ──
            if (status === 409 && mode === 'signup') {
                toast.error('This email is already registered. Please use the Log in tab.', { duration: 5000 });
                return;
            }

            // ── Login: No account found with this email ──
            if ((status === 404 || apiMsg.toLowerCase().includes('not found') || apiMsg.toLowerCase().includes('user not found')) && mode === 'login') {
                toast.error('No account found with this email. Please Sign up first.', { duration: 5000 });
                return;
            }

            toast.error(apiMsg || 'Failed to send verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [email, mode, resendTimer, selectedRole]);

    // ─── Verify OTP ───────────────────────────────────────────────────────────
    const handleVerifyOTP = async (finalOtp?: string) => {
        const otpValue = finalOtp || otp;
        if (!otpValue || otpValue.length !== 6) {
            toast.error('Please enter a valid 6-digit code.');
            return;
        }

        setLoading(true);
        try {
            const trimmedEmail = email.trim().toLowerCase();
            console.log('[Email OTP] 🔍 Verifying OTP for:', trimmedEmail);

            let response: any;
            if (mode === 'signup') {
                response = await otpAuth.verifySignupOTP({
                    email: trimmedEmail,
                    otp: otpValue.trim(),
                    role: selectedRole,
                    name: fullName || undefined,
                });
            } else {
                response = await otpAuth.verifyLoginOTP({
                    email: trimmedEmail,
                    otp: otpValue.trim(),
                });
            }

            if (response.access_token) {
                loginWithResponse(response);
                console.log('[Email OTP] ✅ Verified. User role:', response?.user?.role);

                if (mode === 'signup') {
                    if (selectedRole === UserRole.USER) {
                        toast.success('Email verified! Please complete your profile.');
                        setStep('details');
                        setLoading(false);
                        return;
                    } else if (selectedRole === UserRole.VENDOR) {
                        toast.success('Account created! Redirecting to vendor setup...');
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : `${targetUrl}/`;
                        setTimeout(() => window.location.href = `${baseUrl}signup-form?token=${response.access_token}`, 800);
                        return;
                    }
                }

                const tokenPayload = decodeToken(response.access_token);
                const role = tokenPayload?.role || response?.user?.role || 'user';
                toast.success('Welcome back!');
                setTimeout(() => {
                    const tokenParam = `?token=${response.access_token}`;
                    if (role === 'vendor') {
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : `${targetUrl}/`;
                        window.location.href = `${baseUrl}${tokenParam}`;
                    } else if (role === 'admin') {
                        const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;
                        window.location.href = isLocal ? `http://localhost:5175/${tokenParam}` : (ADMIN_URL ? `${ADMIN_URL}/${tokenParam}` : `/admin${tokenParam}`);
                    } else {
                        navigate('/dashboard');
                    }
                }, 800);
            }
        } catch (err: any) {
            console.error('[Email OTP] ❌ Verify error:', err?.response?.data || err?.message);
            const errorMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || '';

            if (errorMsg.toLowerCase().includes('user not found') || err?.response?.status === 401) {
                toast.error('Account not found. Redirecting to sign up...');
                setTimeout(() => { setMode('signup'); setStep('email'); setLoading(false); }, 1500);
                return;
            } else if (errorMsg.toLowerCase().includes('expired')) {
                toast.error('Code expired. Please request a new one.');
                setStep('email');
            } else {
                toast.error(errorMsg || 'Invalid code. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // ─── Complete Profile (Signup Step 3) ─────────────────────────────────────
    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName) {
            toast.error('Please enter your full name.');
            return;
        }
        setLoading(true);
        try {
            toast.success('Profile saved! Taking you to your dashboard.');
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            toast.error('Something went wrong. Taking you to dashboard.');
            setTimeout(() => navigate('/dashboard'), 1500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row items-start font-sans relative">
            {/* 🎨 Visual Narrative Engine */}
            <div className="hidden lg:flex w-1/2 h-screen sticky top-0 relative flex-col justify-end p-20 overflow-hidden bg-neutral-900 border-r border-neutral-100 dark:border-slate-800">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80"
                        alt="Event Context"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay rotate-1 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-xl space-y-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                        <img
                            src="/logo.svg"
                            alt="Ease2Event Logo"
                            className="w-12 h-12 object-contain drop-shadow-lg"
                        />
                        <span className="text-4xl font-black tracking-tight font-sans bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
                            Ease2event
                        </span>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <h1 className="text-2xl lg:text-3xl font-black text-white leading-tight tracking-widest">
                                {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                            </h1>
                            <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                                {mode === 'login' ? 'Use your account from anywhere, anytime.' : 'Register and start booking amazing events.'}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Node" className="w-12 h-12 rounded-xl border-2 border-black shadow-xl" />
                            ))}
                        </div>
                        <div className="text-[10px] font-bold text-white tracking-wider">
                            <p className="text-red-500">10,000+ happy users</p>
                            <p className="opacity-40 mt-1">Events planned worldwide</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔐 Identity Registry Portal */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-24 relative bg-white dark:bg-slate-950 min-h-screen">
                {/* 🧭 Navigation Link */}
                <Link
                    to="/"
                    className="absolute top-6 left-2 md:top-10 md:left-12 flex items-center gap-2 text-neutral-500 hover:text-red-600 transition-all group z-20 text-base font-semibold"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
                    Back
                </Link>

                <div className="w-full max-w-lg relative z-10 flex flex-col">
                    {/* 📱 Mobile Branding */}
                    <div className="mb-12 lg:hidden flex items-center gap-4 self-center">
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
                            <Sparkles className="text-white" size={26} />
                        </div>
                        <span className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Ease2event</span>
                    </div>

                    {/* 🔄 Mode Toggle Tabs */}
                    <div className="flex p-1.5 bg-neutral-100 dark:bg-slate-900/80 rounded-2xl mb-10 w-full border border-neutral-200/50 dark:border-slate-800/50">
                        <button
                            onClick={() => { setMode('login'); setStep('email'); setOtp(''); }}
                            className={`flex-1 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${mode === 'login' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-md' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setStep('email'); setOtp(''); }}
                            className={`flex-1 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${mode === 'signup' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-md' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                        >
                            Sign up
                        </button>
                    </div>

                    {/* 🖋️ Header Section */}
                    <div className="mb-10 min-h-[100px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${mode}-${step}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4 text-center sm:text-left"
                            >
                                <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight leading-tight">
                                    {selectedRole === UserRole.ADMIN ? 'Administrator Access' : (mode === 'login' ? 'Login to continue' : 'Create Your Account')}
                                </h2>
                                <p className="text-base md:text-xl text-neutral-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {step === 'email'
                                        ? 'Enter your email to receive a verification code.'
                                        : `Verification code sent to ${email}`}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* 👤 Role Selector */}
                    {step === 'email' && (
                        <div className={`w-full grid grid-cols-2 gap-3.5 mb-10 bg-neutral-50 dark:bg-slate-900/40 p-2.5 rounded-2xl border border-neutral-100 dark:border-slate-800/50`}>
                            {[
                                { id: UserRole.USER, label: 'User', icon: User, path: `${mode === 'signup' ? '/signup' : '/login'}?portal=user` },
                                { id: UserRole.VENDOR, label: 'Vendor', icon: Building, path: `${mode === 'signup' ? '/signup' : '/login'}?portal=vendor` }
                            ].map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => navigate(role.path)}
                                    className={`flex flex-col items-center justify-center gap-3 py-4 rounded-xl transition-all duration-300 border ${selectedRole === role.id
                                        ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20 font-bold'
                                        : 'text-neutral-400 bg-transparent border-transparent font-medium hover:bg-white dark:hover:bg-slate-800 hover:border-neutral-200/50 dark:hover:border-slate-700'
                                        }`}
                                >
                                    <role.icon size={26} className={selectedRole === role.id ? 'scale-110' : 'opacity-60'} />
                                    <span className="text-xs uppercase font-bold tracking-widest">{role.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 🛡️ Secure Forms */}
                    <AnimatePresence mode="wait">

                        {/* ── Step 1: Email Input ── */}
                        {step === 'email' && (
                            <motion.form key="email"
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                onSubmit={handleSendOTP} className="w-full space-y-8"
                            >
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 ml-1">
                                            Email address
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-500 transition-colors pointer-events-none">
                                            <Mail size={22} />
                                        </div>
                                        <input
                                            type="email"
                                            inputMode="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-12 h-16 bg-white dark:bg-slate-900 border-2 border-neutral-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-neutral-900 dark:text-white text-xl placeholder:text-neutral-400/50"
                                            placeholder="you@example.com"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                            {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                                                <CheckCircle2 size={24} className="text-emerald-500 animate-in zoom-in duration-300" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-16 bg-red-600 text-white rounded-2xl font-bold text-base tracking-widest flex items-center justify-center gap-4 transition-all shadow-xl shadow-red-600/30 hover:bg-neutral-900 dark:hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader className="animate-spin" size={24} />
                                        ) : (
                                            <>Send Code <ArrowRight size={22} /></>
                                        )}
                                    </button>

                                    {selectedRole !== UserRole.ADMIN && (
                                        <p className="w-full text-center text-base font-bold text-neutral-400 p-2">
                                            {mode === 'login' ? (
                                                <>
                                                    Don't have an account?{" "}
                                                    <span
                                                        onClick={() => { setMode('signup'); setStep('email'); }}
                                                        className="text-red-500 hover:text-red-600 underline underline-offset-4 cursor-pointer transition-colors"
                                                    >
                                                        Sign up
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    Already have an account?{" "}
                                                    <span
                                                        onClick={() => { setMode('login'); setStep('email'); }}
                                                        className="text-red-500 hover:text-red-600 underline underline-offset-4 cursor-pointer transition-colors"
                                                    >
                                                        Log in
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </motion.form>
                        )}

                        {/* ── Step 2: OTP Verification ── */}
                        {step === 'otp' && (
                            <motion.div key="otp"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full space-y-12 text-center"
                            >
                                <div className="space-y-8">
                                    <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 block">
                                        Enter verification code
                                    </label>
                                    <div className="flex justify-center scale-110">
                                        <OTPInput length={6} onComplete={handleVerifyOTP} onChange={setOtp} disabled={loading} />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <button
                                        type="button"
                                        onClick={() => handleVerifyOTP()}
                                        disabled={loading || otp.length < 6}
                                        className="w-full h-16 bg-neutral-900 dark:bg-white dark:text-neutral-950 text-white rounded-2xl font-bold text-base tracking-widest transition-all shadow-2xl active:scale-[0.98] disabled:opacity-30"
                                    >
                                        {loading ? <Loader className="animate-spin mx-auto" size={24} /> : 'Verify code'}
                                    </button>
                                    <div className="flex flex-col items-center gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { if (resendTimer === 0) handleSendOTP(); }}
                                            disabled={loading || resendTimer > 0}
                                            className={`text-base font-bold flex items-center gap-3 transition-colors ${resendTimer > 0 ? 'text-neutral-400' : 'text-red-600 hover:text-neutral-900 dark:hover:text-white'}`}
                                        >
                                            {resendTimer > 0 ? <><Clock size={22} /> Resend in {resendTimer}s</> : "Didn't receive code? Resend"}
                                        </button>
                                        <button
                                            onClick={() => setStep('email')}
                                            className="text-base font-bold text-neutral-400 hover:text-red-600 transition-colors"
                                        >
                                            Change email address
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Step 3: Complete Profile (Signup → User only) ── */}
                        {step === 'details' && (
                            <motion.form key="details"
                                initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }}
                                onSubmit={handleCompleteProfile} className="w-full space-y-8"
                            >
                                <div className="space-y-5">
                                    <div className="space-y-5">
                                        <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 ml-1">Full name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-500 transition-colors pointer-events-none">
                                                <User size={22} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={fullName}
                                                onChange={e => setFullName(e.target.value)}
                                                placeholder="e.g. Alexander Pierce"
                                                className="w-full pl-12 pr-6 h-16 bg-white dark:bg-slate-900 border-2 border-neutral-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-neutral-900 dark:text-white text-lg"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-5">
                                        <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 ml-1">Email address</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none">
                                                <Mail size={22} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                readOnly
                                                className="w-full pl-12 pr-6 h-16 bg-neutral-50 dark:bg-slate-800 border-2 border-neutral-100 dark:border-slate-700 rounded-2xl outline-none font-bold text-neutral-500 dark:text-slate-400 text-lg cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full h-16 bg-red-600 text-white rounded-2xl font-bold text-base tracking-widest shadow-xl shadow-red-600/30 hover:bg-neutral-900 active:scale-[0.98] transition-all flex items-center justify-center gap-4">
                                    {loading ? <Loader className="animate-spin" size={24} /> : <>Finalize synchronization <ArrowRight size={24} /></>}
                                </button>
                            </motion.form>
                        )}

                    </AnimatePresence>

                    {/* 📜 Legal Footprint */}
                    <div className="mt-14 pt-10 border-t-2 border-neutral-100 dark:border-slate-800/80">
                        <p className="text-base md:text-lg text-center text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-2xl mx-auto">
                            You verify you are of legal age and agree to our <br className="hidden sm:block" />
                            <Link to="/terms" className="text-red-500 dark:text-red-400 underline underline-offset-8 hover:text-red-600 cursor-pointer decoration-2 transition-all">Terms of Service</Link> and <Link to="/privacy" className="text-red-500 dark:text-red-400 underline underline-offset-8 hover:text-red-600 cursor-pointer decoration-2 transition-all">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnifiedAuth;
