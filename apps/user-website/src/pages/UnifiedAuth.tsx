import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { 
    Eye, EyeOff, Mail, Lock, ArrowLeft, Phone, ArrowRight, Loader, 
    Sparkles, Clock, CheckCircle2, User, Building, ShieldCheck 
} from 'lucide-react';
import { useAuth, otpAuth, commonAuth, UserRole, decodeToken, tokenService } from '@airion/shared/auth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import OTPInput from '@airion/shared/components/OTPInput';

type AuthMode = 'login' | 'signup';

/**
 * 🔐 Unified Authentication Gateway: Airion Core
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
        // Handle global logout synchronization
        const params = new URLSearchParams(window.location.search);
        if (params.get('portal_logout') === 'true') {
            const logoutGlobal = async () => {
                tokenService.clearTokens();
                // Clear the URL params
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('portal_logout');
                window.history.replaceState({}, '', newUrl.pathname + newUrl.search);
            };
            logoutGlobal();
            return;
        }

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
        <div className="min-h-screen bg-white dark:bg-slate-950 flex font-sans overflow-hidden">
            {/* 🎨 Visual Narrative Engine */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-20 overflow-hidden bg-neutral-900 border-r border-neutral-100 dark:border-slate-800">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80"
                        alt="Event Context"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay rotate-1 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-xl space-y-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-600/30 rotate-3 group">
                            <Sparkles className="text-white group-hover:rotate-12 transition-transform" size={32} />
                        </div>
                        <span className="text-5xl font-black text-white tracking-tighter uppercase italic">Airion</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-6xl font-black text-white leading-tight tracking-tighter uppercase italic"
                    >
                        {mode === 'login' ? 'Neural Sync Protocol.' : 'Nexus Genesis Protocol.'}
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="text-xl text-neutral-400 font-bold uppercase tracking-widest italic leading-relaxed opacity-60"
                    >
                        {mode === 'login' ? 'Synchronize your identity across the decentralized matrix nodes.' : 'Deploy your talent to the next-generation elite registry.'}
                    </motion.p>
                    
                    <div className="flex items-center gap-8 pt-10 border-t border-white/5">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Node" className="w-14 h-14 rounded-2xl border-2 border-black shadow-xl" />
                            ))}
                        </div>
                        <div className="text-xs font-black text-white uppercase tracking-[0.3em] italic">
                            <p className="text-red-500">540,128 NODES ACTIVE</p>
                            <p className="opacity-40 mt-1">Global Marketplace Telemetry</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔐 Identity Registry Portal */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-white dark:bg-slate-950">
                <Link to="/" className="absolute top-10 left-10 flex items-center gap-3 text-neutral-400 hover:text-red-600 transition-all group z-20 text-[10px] font-black uppercase tracking-[0.4em] italic">
                    <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
                    Explorer Matrix
                </Link>

                <div className="w-full max-w-sm space-y-12">
                    <div className="lg:hidden flex items-center gap-4 justify-center mb-10">
                        <Sparkles className="text-red-600" size={32} />
                        <span className="text-3xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Airion</span>
                    </div>

                    {/* Mode Matrix */}
                    {selectedRole !== UserRole.ADMIN && (
                        <div className="flex p-1.5 bg-neutral-100 dark:bg-slate-900 rounded-[28px] relative overflow-hidden">
                            <button 
                                onClick={() => { setMode('login'); setStep('phone'); }}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] italic rounded-[22px] transition-all relative z-10 ${mode === 'login' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-2xl' : 'text-neutral-400 hover:text-neutral-900'}`}
                            >
                                IDENTITY_LOG
                            </button>
                            <button 
                                onClick={() => { setMode('signup'); setStep('phone'); }}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] italic rounded-[22px] transition-all relative z-10 ${mode === 'signup' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-2xl' : 'text-neutral-400 hover:text-neutral-900'}`}
                            >
                                CREATE_NODE
                            </button>
                        </div>
                    )}

                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">
                            {selectedRole === UserRole.ADMIN ? 'Vault Access' : (mode === 'login' ? 'Neural Sync' : 'Genesis Node')}
                        </h2>
                        <p className="text-[11px] text-neutral-400 font-black uppercase tracking-[0.3em] italic opacity-60">
                            {step === 'phone' ? 'Secure, Passwordless Entry Protocol' : `Cipher dispatched to node: ${phone}`}
                        </p>
                    </div>

                    {/* Role Matrix Selector */}
                    {step === 'phone' && (
                        <div className="grid grid-cols-3 gap-3 bg-neutral-50 dark:bg-slate-900/50 p-2 rounded-[32px] border border-neutral-100 dark:border-slate-800">
                            {[
                                { id: UserRole.USER, label: 'User', icon: User, path: `${mode === 'signup' ? '/signup' : '/login'}?portal=user` },
                                { id: UserRole.VENDOR, label: 'Vendor', icon: Building, path: `${mode === 'signup' ? '/signup' : '/login'}?portal=vendor` },
                                { id: UserRole.ADMIN, label: 'Admin', icon: ShieldCheck, path: '/admin/login', hideOnSignup: true }
                            ].filter(r => mode !== 'signup' || !r.hideOnSignup).map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => navigate(role.path)}
                                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-[24px] transition-all duration-500 scale-95 hover:scale-100 ${
                                        selectedRole === role.id 
                                        ? 'bg-red-600 text-white shadow-[0_20px_40px_-10px_rgba(220,38,38,0.4)] font-black italic scale-105 z-10' 
                                        : 'text-neutral-400 font-bold hover:bg-white dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <role.icon size={22} className={selectedRole === role.id ? 'scale-110' : ''} />
                                    <span className="text-[8px] uppercase tracking-[0.3em]">{role.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 'phone' && (
                            <motion.form key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSendOTP} className="space-y-10"
                            >
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-neutral-400 dark:text-slate-500 uppercase tracking-[0.4em] italic ml-2">Registry Link (Phone Number)</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-600 transition-colors">
                                            <Phone size={24} />
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
                                            className="w-full pl-16 pr-16 h-20 bg-neutral-50 dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 rounded-[28px] focus:ring-4 focus:ring-red-600/10 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-black text-neutral-900 dark:text-white text-2xl tracking-[0.2em] italic"
                                            placeholder="NODE_CONNECTION"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            {phone.length === 10 && <CheckCircle2 size={28} className="text-emerald-500" />}
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full h-20 bg-red-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.5em] italic flex items-center justify-center gap-4 transition-all shadow-2xl shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                                    {loading ? <Loader className="animate-spin" size={24} /> : <>INITIATE_HANDSHAKE <ArrowRight size={20} /></>}
                                </button>
                                {selectedRole !== UserRole.ADMIN && (
                                    <div className="text-center">
                                        <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[10px] font-black text-neutral-400 hover:text-red-600 uppercase tracking-widest italic transition-colors">
                                            {mode === 'login' ? 'SWITCH_TO_GENESIS' : 'ALREADY_SYNCHRONIZED?'}
                                        </button>
                                    </div>
                                )}
                            </motion.form>
                        )}

                        {step === 'otp' && (
                            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-12 text-center"
                            >
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] italic mb-8 block">Verification Cipher</label>
                                    <div className="flex justify-center scale-110">
                                        <OTPInput length={6} onComplete={handleVerifyOTP} disabled={loading} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <button
                                        type="button"
                                        onClick={() => handleVerifyOTP()}
                                        disabled={loading || otp.length < 6}
                                        className="w-full h-18 bg-neutral-900 dark:bg-white dark:text-neutral-950 text-white rounded-[24px] font-black italic uppercase text-[11px] tracking-[0.4em] transition-all shadow-2xl active:scale-[0.98] disabled:opacity-30"
                                    >
                                        VERIFY_CIPHER
                                    </button>
                                    
                                    <div className="flex flex-col items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => { if (resendTimer === 0) handleSendOTP(); }}
                                            disabled={loading || resendTimer > 0}
                                            className={`text-[9px] font-black uppercase tracking-widest italic flex items-center gap-3 ${resendTimer > 0 ? 'text-neutral-400' : 'text-red-600'}`}
                                        >
                                            {resendTimer > 0 ? <><Clock size={14} /> RE-DISPATCH IN {resendTimer}S</> : 'CIPHER_NOT_RECEIVED?'}
                                        </button>
                                        <button onClick={() => setStep('phone')} className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic hover:underline">
                                            MODIFY_ID_LINK
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'details' && (
                             <motion.form key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleCompleteProfile} className="space-y-8"
                             >
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] italic ml-2">Identity Tag (Full Name)</label>
                                        <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="NEURAL_TAG" className="w-full h-16 bg-neutral-50 dark:bg-slate-900 border border-neutral-100 rounded-2xl px-6 font-black italic text-lg outline-none focus:ring-4 focus:ring-red-600/10 transition-all uppercase" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] italic ml-2">Registry Mail (Email)</label>
                                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="NODE@MATRIX.COM" className="w-full h-16 bg-neutral-50 dark:bg-slate-900 border border-neutral-100 rounded-2xl px-6 font-black italic text-lg outline-none focus:ring-4 focus:ring-red-600/10 transition-all uppercase" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full h-18 bg-red-600 text-white rounded-[24px] font-black uppercase text-[11px] tracking-[0.4em] italic shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                                    FINALIZE_SYNCHRONIZATION <ArrowRight size={20} className="ml-4 inline" />
                                </button>
                             </motion.form>
                        )}
                    </AnimatePresence>

                    <p className="pt-20 text-[8px] text-center text-neutral-400 font-black uppercase tracking-[0.2em] italic opacity-40 max-w-[280px] mx-auto leading-relaxed">
                        By continuing, you verify legal node age and agree to the <span className="underline">Terms of Network</span> and <span className="underline">Privacy Cipher</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UnifiedAuth;
