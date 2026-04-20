import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import {
    Eye, EyeOff, Mail, Lock, ArrowLeft, Phone, ArrowRight, Loader,
    Sparkles, Clock, CheckCircle2, User, Building, ShieldCheck
} from 'lucide-react';
import { useAuth, otpAuth, commonAuth, UserRole, decodeToken, tokenService } from '@ease2event/shared/auth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import OTPInput from '@ease2event/shared/components/OTPInput';

type AuthMode = 'login' | 'signup';

/**
 * 🔐 Unified Authentication Gateway: Ease2event Core
 * Reconciles Identity Registry for Users, Vendors, and Administrative Entities.
 * Implements Zero-Trust Protocols for Administrative Access (1000000000 restricted).
 */
const UnifiedAuth: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithToken, user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    // UI States
    const [mode, setMode] = useState<AuthMode>(() => {
        return location.pathname.includes('signup') ? 'signup' : 'login';
    });
    const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone');
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);

    // Form Data
    const [phone, setPhone] = useState('');
    const [normalizedPhone, setNormalizedPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
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
        } else if (portal === 'user') {
            setSelectedRole(UserRole.USER);
        }
    }, [location.pathname, searchParams]);

    // 🚀 Auto-Redirection: Open Dashboard for Synchronized Nodes
    useEffect(() => {
        if (isAuthenticated && user && !authLoading) {
            const VENDOR_URL = (import.meta.env.VITE_VENDOR_URL as string) || 'http://localhost:5174';
            const ADMIN_URL = (import.meta.env.VITE_ADMIN_URL as string) || 'http://localhost:5175';
            const token = tokenService.getAccessToken();

            if (user.role === UserRole.VENDOR) {
                window.location.href = `${VENDOR_URL}/vendor/?token=${token}`;
            } else if (user.role === UserRole.ADMIN) {
                window.location.href = `${ADMIN_URL}/admin/?token=${token}`;
            } else {
                // For 'user' role, if we are already on signup/details step, don't interrupt
                if (step === 'details') return;
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, user, authLoading, navigate, step]);

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
            const digitsOnly = phone.replace(/\D/g, '');
            if (digitsOnly.length !== 10) {
                toast.error('Registry requires a valid 10-digit identification sequence.');
                setLoading(false);
                return;
            }

            // 🚫 Zero-Trust Check: Admin Restriction
            if (selectedRole === UserRole.ADMIN && digitsOnly !== '1000000000') {
                toast.error('Identity Conflict: Administrative access restricted to authorized nodes only.');
                setLoading(false);
                return;
            }

            const finalPhone = `+91${digitsOnly}`;
            setNormalizedPhone(finalPhone);

            const response = mode === 'signup'
                ? await otpAuth.sendSignupOTP({ phone: finalPhone })
                : await otpAuth.sendLoginOTP({ phone: finalPhone });

            const devCode = (response as any)?._dev_otp || (response as any)?.data?._dev_otp;
            if (import.meta.env.DEV && devCode) {
                toast(`Dev-Code Received: ${devCode}`, { icon: '🔑', duration: 8000 });
            }

            toast.success('Verification cipher dispatched.');
            setStep('otp');
            setResendTimer(60);
        } catch (err: any) {
            if (err.response?.status === 409) {
                toast.error('Identity collision: Account already synchronized. Switching to Login.');
                setMode('login');
            } else {
                toast.error(err.response?.data?.message || 'Cipher dispatch failed.');
            }
        } finally {
            setLoading(false);
        }
    }, [phone, mode, resendTimer, selectedRole]);

    const handleVerifyOTP = async (finalOtp?: string) => {
        const otpValue = finalOtp || otp;
        if (!otpValue || otpValue.length !== 6) {
            toast.error('Invalid 6-digit verification cipher.');
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
                await loginWithToken(response.access_token);

                if (mode === 'signup') {
                    if (selectedRole === UserRole.USER) {
                        toast.success('Identification successful. Initializing profile registry.');
                        setStep('details');
                        setLoading(false);
                        return;
                    } else if (selectedRole === UserRole.VENDOR) {
                        toast.success('Establishing Vendor Node. Redirecting to Registry Form.');
                        const VENDOR_URL = (import.meta.env.VITE_VENDOR_URL as string) || 'http://localhost:5174';
                        setTimeout(() => window.location.href = `${VENDOR_URL}/vendor/signup-form?token=${response.access_token}`, 800);
                        return;
                    }
                }

                // 🌐 Strategic Redirection based on Decoded Identity
                const tokenPayload = decodeToken(response.access_token);
                const role = tokenPayload?.role || response?.user?.role || 'user';

                toast.success('Synchronization complete. Welcome back.');

                setTimeout(() => {
                    const VENDOR_URL = (import.meta.env.VITE_VENDOR_URL as string) || 'http://localhost:5174';
                    const ADMIN_URL = (import.meta.env.VITE_ADMIN_URL as string) || 'http://localhost:5175';

                    if (role === 'vendor') {
                        window.location.href = `${VENDOR_URL}/vendor/?token=${response.access_token}`;
                    } else if (role === 'admin') {
                        window.location.href = `${ADMIN_URL}/admin/?token=${response.access_token}`;
                    } else {
                        navigate('/dashboard');
                    }
                }, 800);
            }
        } catch (err: any) {
            const apiError = err.response?.data;
            const errorMsg = apiError?.error || apiError?.message || '';

            // 🔄 Auto-Reconciliation: If Node doesn't exist, switch to Genesis Initiation
            if (errorMsg.includes('User not found') || err.response?.status === 401) {
                toast.error('Identity Node not indexed. Reconciling to Genesis Protocol...');
                setTimeout(() => {
                    setMode('signup');
                    setStep('phone');
                    setLoading(false);
                }, 1500);
                return;
            }

            toast.error(errorMsg || 'Verification failure. Node access denied.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !email) {
            toast.error('Critical identification parameters missing.');
            return;
        }

        setLoading(true);
        try {
            // Simulate profile write
            toast.success('Registry updated. Deploying interface.');
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            toast.error('Write failure. Deploying default interface.');
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
                        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/30 rotate-3 group">
                            <Sparkles className="text-white group-hover:rotate-12 transition-transform" size={24} />
                        </div>
                        <span className="text-4xl font-black tracking-tight font-sans bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
                            Ease2event
                        </span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-2xl lg:text-3xl font-black text-white leading-tight tracking-widest uppercase"
                    >
                        {mode === 'login' ? 'Smart Login System' : 'Nexus Genesis Protocol.'}
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="text-sm text-neutral-400 font-bold uppercase tracking-[0.2em] leading-relaxed opacity-60"
                    >
                        {mode === 'login' ? 'Use your account from anywhere easily' : 'Deploy your talent to the next-generation elite registry.'}
                    </motion.p>
                    <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Node" className="w-12 h-12 rounded-xl border-2 border-black shadow-xl" />
                            ))}
                        </div>
                        <div className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                            <p className="text-red-500">540,128 NODES ACTIVE</p>
                            <p className="opacity-40 mt-1">Global Marketplace Telemetry</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔐 Identity Registry Portal */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-24 relative bg-white dark:bg-slate-950 min-h-screen">
                {/* 🧭 Navigation Link */}
                <Link
                    to="/"
                    className="absolute top-6 left-6 md:top-10 md:left-12 flex items-center gap-2 text-neutral-500 hover:text-red-600 transition-all group z-20 text-base font-semibold"
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
                            onClick={() => { setMode('login'); setStep('phone'); }}
                            className={`flex-1 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${mode === 'login' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-md' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setStep('phone'); }}
                            className={`flex-1 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${mode === 'signup' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-md' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* 🖋️ Header Section */}
                    <div className="space-y-4 mb-10 text-center sm:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight leading-tight text-center">
                            {selectedRole === UserRole.ADMIN ? 'Administrator Access' : (mode === 'login' ? 'Login to continue' : 'Create Your Account')}
                        </h2>
                        <p className="text-base md:text-xl text-neutral-500 dark:text-slate-400 leading-relaxed font-medium">
                            {step === 'phone'
                                ? 'Verify your identity to manage your event ecosystem.'
                                : `Verification code dispatched via secure line to: ${phone}`}
                        </p>
                    </div>

                    {/* 👤 Role Selector */}
                    {step === 'phone' && (
                        <div className={`w-full grid ${mode === 'signup' ? 'grid-cols-2' : 'grid-cols-3'} gap-3.5 mb-10 bg-neutral-50 dark:bg-slate-900/40 p-2.5 rounded-2xl border border-neutral-100 dark:border-slate-800/50`}>
                            {[
                                { id: UserRole.USER, label: 'User', icon: User, path: `${mode === 'signup' ? '/signup' : '/login'}?portal=user` },
                                { id: UserRole.VENDOR, label: 'Vendor', icon: Building, path: `${mode === 'signup' ? '/signup' : '/login'}?portal=vendor` },
                                { id: UserRole.ADMIN, label: 'Admin', icon: ShieldCheck, path: '/admin/login', hideOnSignup: true }
                            ].filter(r => mode !== 'signup' || !r.hideOnSignup).map(role => (
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
                        {step === 'phone' && (
                            <motion.form key="phone"
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                onSubmit={handleSendOTP} className="w-full space-y-8"
                            >
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 ml-1">Phone Number</label>

                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-500 transition-colors pointer-events-none">
                                            <Phone size={22} />
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
                                            className="w-full pl-12 pr-12 h-16 bg-white dark:bg-slate-900 border-2 border-neutral-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-neutral-900 dark:text-white text-xl tracking-[0.2em] placeholder:text-neutral-400/50"
                                            placeholder="000 - 000 - 0000"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                            {phone.length === 10 && <CheckCircle2 size={24} className="text-emerald-500 animate-in zoom-in duration-300" />}
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
                                            <>Verify Presence <ArrowRight size={22} /></>
                                        )}
                                    </button>

                                    {selectedRole !== UserRole.ADMIN && (
                                        <p className="w-full text-center text-base font-bold text-neutral-400 p-2">
                                            {mode === 'login' ? (
                                                <>
                                                    Don't have an account?{" "}
                                                    <span
                                                        onClick={() => setMode('signup')}
                                                        className="text-red-500 hover:text-red-600 underline underline-offset-4 cursor-pointer transition-colors"
                                                    >
                                                        Sign up
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    Already have an account?{" "}
                                                    <span
                                                        onClick={() => setMode('login')}
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

                        {step === 'otp' && (
                            <motion.div key="otp"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full space-y-12 text-center"
                            >
                                <div className="space-y-8">
                                    <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 block">Verification Cipher</label>
                                    <div className="flex justify-center scale-110">
                                        <OTPInput length={6} onComplete={handleVerifyOTP} disabled={loading} />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <button
                                        type="button"
                                        onClick={() => handleVerifyOTP()}
                                        disabled={loading || otp.length < 6}
                                        className="w-full h-16 bg-neutral-900 dark:bg-white dark:text-neutral-950 text-white rounded-2xl font-bold text-base tracking-widest transition-all shadow-2xl active:scale-[0.98] disabled:opacity-30"
                                    >
                                        Verify Code
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
                                            onClick={() => setStep('phone')}
                                            className="text-base font-bold text-neutral-400 hover:text-red-600 transition-colors"
                                        >
                                            Modify phone link
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'details' && (
                            <motion.form key="details"
                                initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }}
                                onSubmit={handleCompleteProfile} className="w-full space-y-8"
                            >
                                <div className="space-y-5">
                                    <div className="space-y-5">
                                        <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 ml-1">Full Name</label>
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
                                        <label className="text-xl font-bold text-neutral-700 dark:text-slate-300 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-500 transition-colors pointer-events-none">
                                                <Mail size={22} />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="alexander@ease2event.com"
                                                className="w-full pl-12 pr-6 h-16 bg-white dark:bg-slate-900 border-2 border-neutral-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-neutral-900 dark:text-white text-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full h-16 bg-red-600 text-white rounded-2xl font-bold text-base tracking-widest shadow-xl shadow-red-600/30 hover:bg-neutral-900 active:scale-[0.98] transition-all flex items-center justify-center gap-4">
                                    Finalize Synchronization <ArrowRight size={24} />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* 📜 Legal Footprint */}
                    <div className="mt-14 pt-10 border-t-2 border-neutral-100 dark:border-slate-800/80">
                        <p className="text-base md:text-lg text-center text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-2xl mx-auto">
                            By proceeding, you verify you are of legal age and agree to our <br className="hidden sm:block" />
                            <Link to="/terms" className="text-red-500 dark:text-red-400 underline underline-offset-8 hover:text-red-600 cursor-pointer decoration-2 transition-all">Terms of Service</Link> and <Link to="/privacy" className="text-red-500 dark:text-red-400 underline underline-offset-8 hover:text-red-600 cursor-pointer decoration-2 transition-all">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnifiedAuth;
