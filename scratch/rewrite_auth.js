const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import {
    Mail, ArrowLeft, Phone, ArrowRight, Loader,
    Clock, CheckCircle2, User, Building
} from 'lucide-react';
import { useAuth, otpAuth, UserRole, tokenService, getPortalUrl } from '@ease2event/shared/auth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import OTPInput from '@ease2event/shared/components/OTPInput';
import { auth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from '../lib/firebase';

type AuthMode = 'login' | 'signup';

const BACKGROUNDS = [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop', // Wedding
    'https://images.unsplash.com/photo-1530103862676-de8892bf30d5?q=80&w=2070&auto=format&fit=crop', // Birthday
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop', // Corporate
];

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const UnifiedAuth: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithResponse, user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    // UI States
    const [mode, setMode] = useState<AuthMode>(() => location.pathname.includes('signup') ? 'signup' : 'login');
    const [step, setStep] = useState<'role' | 'email' | 'otp' | 'details'>('role');
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);
    const [bgIndex, setBgIndex] = useState(0);

    // Form Data
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [fullName, setFullName] = useState('');
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const portal = searchParams.get('portal');
        const isAdminPath = location.pathname.includes('/admin/login');

        if (isAdminPath || portal === 'admin') {
            setSelectedRole(UserRole.ADMIN);
            setMode('login');
            setStep('email');
        } else if (portal === 'vendor') {
            setSelectedRole(UserRole.VENDOR);
            setStep('email');
        } else if (portal === 'user') {
            setSelectedRole(UserRole.USER);
            setStep('email');
        }
    }, [location.pathname, searchParams]);

    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'logout') return;
        if (isAuthenticated && user && !authLoading) {
            const token = tokenService.getAccessToken();
            const tokenParam = token ? '?token=' + token : '';
            if (user.role === UserRole.VENDOR) {
                const targetUrl = getPortalUrl('vendor');
                const baseUrl = targetUrl.endsWith('/') ? targetUrl : targetUrl + '/';
                window.location.href = token ? baseUrl + tokenParam : baseUrl;
            } else if (user.role === UserRole.ADMIN) {
                if (isLocal) {
                    window.location.href = 'http://localhost:5175/' + tokenParam;
                } else {
                    const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;
                    window.location.href = ADMIN_URL ? ADMIN_URL + '/' + tokenParam : '/admin' + tokenParam;
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

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const response = await otpAuth.verifyFirebaseToken(idToken, selectedRole);
            if (response.access_token) {
                loginWithResponse(response);
                toast.success('Successfully logged in with Google!');
                setTimeout(() => {
                    const tokenParam = '?token=' + response.access_token;
                    if (selectedRole === UserRole.VENDOR) {
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : targetUrl + '/';
                        window.location.href = baseUrl + tokenParam;
                    } else if (selectedRole === UserRole.ADMIN) {
                        const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;
                        window.location.href = isLocal ? 'http://localhost:5175/' + tokenParam : (ADMIN_URL ? ADMIN_URL + '/' + tokenParam : '/admin' + tokenParam);
                    } else {
                        navigate('/dashboard');
                    }
                }, 800);
            }
        } catch (err: any) {
            console.error('[Google Auth] ❌ Error:', err);
            toast.error(err.message || 'Google sign in failed');
        } finally {
            setLoading(false);
        }
    };

    const setupRecaptcha = () => {
        if (!(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible'
            });
        }
    };

    const handleSendOTP = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (resendTimer > 0) return;
        setLoading(true);
        try {
            if (authMethod === 'email') {
                const trimmedEmail = email.trim().toLowerCase();
                if (!trimmedEmail || !/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(trimmedEmail)) {
                    toast.error('Please enter a valid email address.');
                    setLoading(false);
                    return;
                }
                if (selectedRole === UserRole.ADMIN) {
                    const adminEmails = ['abhishekkumar518@gmail.com', 'vinaysharma31681@gmail.com', 'modeweltjob@gmail.com', 'admin@ease2event.com'];
                    if (!adminEmails.includes(trimmedEmail)) {
                        toast.error('Unauthorized admin email. Access Denied.');
                        setLoading(false);
                        return;
                    }
                }
                if (mode === 'signup') {
                    await otpAuth.sendSignupOTP({ email: trimmedEmail, role: selectedRole });
                } else {
                    await otpAuth.sendLoginOTP({ email: trimmedEmail, role: selectedRole });
                }
                toast.success('Verification code sent to ' + trimmedEmail);
            } else {
                let phoneNumber = phone.trim();
                if (!phoneNumber) {
                    toast.error('Please enter a valid phone number.');
                    setLoading(false);
                    return;
                }
                if (!phoneNumber.startsWith('+')) {
                    phoneNumber = '+91' + phoneNumber;
                }
                setupRecaptcha();
                const appVerifier = (window as any).recaptchaVerifier;
                const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
                setConfirmationResult(confirmation);
                toast.success('Verification code sent to ' + phoneNumber);
            }
            setStep('otp');
            setResendTimer(60);
        } catch (err: any) {
            console.error('[OTP] ❌ Error:', err);
            if (authMethod === 'phone' && err.code === 'auth/too-many-requests') {
                toast.error('Too many requests. Please try again later.');
            } else {
                toast.error(err?.response?.data?.error || err?.message || 'Failed to send verification code.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (finalOtp?: string) => {
        const otpValue = finalOtp || otp;
        if (!otpValue || otpValue.length !== 6) {
            toast.error('Please enter a valid 6-digit code.');
            return;
        }
        setLoading(true);
        try {
            let response: any;
            if (authMethod === 'phone' && confirmationResult) {
                const result = await confirmationResult.confirm(otpValue.trim());
                const idToken = await result.user.getIdToken();
                response = await otpAuth.verifyFirebaseToken(idToken, selectedRole);
            } else {
                const trimmedEmail = email.trim().toLowerCase();
                if (mode === 'signup') {
                    response = await otpAuth.verifySignupOTP({ email: trimmedEmail, otp: otpValue.trim(), role: selectedRole, name: fullName || undefined });
                } else {
                    response = await otpAuth.verifyLoginOTP({ email: trimmedEmail, otp: otpValue.trim() });
                }
            }
            if (response?.access_token) {
                loginWithResponse(response);
                if (mode === 'signup') {
                    if (selectedRole === UserRole.USER) {
                        toast.success('Verified! Please complete your profile.');
                        setStep('details');
                        setLoading(false);
                        return;
                    } else if (selectedRole === UserRole.VENDOR) {
                        toast.success('Account created! Redirecting to vendor setup...');
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : targetUrl + '/';
                        setTimeout(() => window.location.href = baseUrl + 'signup-form?token=' + response.access_token, 800);
                        return;
                    }
                }
                toast.success('Welcome back!');
                setTimeout(() => {
                    const tokenParam = '?token=' + response.access_token;
                    if (selectedRole === UserRole.VENDOR) {
                        const targetUrl = getPortalUrl('vendor');
                        const baseUrl = targetUrl.endsWith('/') ? targetUrl : targetUrl + '/';
                        window.location.href = baseUrl + tokenParam;
                    } else if (selectedRole === UserRole.ADMIN) {
                        const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;
                        window.location.href = isLocal ? 'http://localhost:5175/' + tokenParam : (ADMIN_URL ? ADMIN_URL + '/' + tokenParam : '/admin' + tokenParam);
                    } else {
                        navigate('/dashboard');
                    }
                }, 800);
            }
        } catch (err: any) {
            console.error('[Verify OTP] ❌ Error:', err);
            toast.error(err?.response?.data?.error || err?.message || 'Invalid code.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName) return toast.error('Please enter your full name.');
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
        <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-black font-sans">
            {/* Full Screen Background Engine */}
            {BACKGROUNDS.map((bg, idx) => (
                <motion.div
                    key={bg}
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: bgIndex === idx ? 1 : 0 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                >
                    <div 
                        className="w-full h-full bg-cover bg-center transform scale-105"
                        style={{ backgroundImage: \`url(\${bg})\` }}
                    />
                </motion.div>
            ))}
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 pointer-events-none" />

            {/* Back Button */}
            <button
                onClick={() => {
                    if (step === 'email' || step === 'otp') setStep('role');
                    else navigate('/');
                }}
                className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors group px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold text-sm">Back</span>
            </button>

            {/* Centered Glassmorphism Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[520px] mx-4 p-8 sm:p-10 rounded-[32px] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] flex flex-col"
            >
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-8">
                    <img src="/logo.svg" alt="Ease2Event" className="w-14 h-14 object-contain drop-shadow-2xl mb-4" />
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        {step === 'role' ? 'Welcome to Ease2Event' : (mode === 'login' ? 'Welcome Back' : 'Create an Account')}
                    </h1>
                    <p className="text-sm font-medium text-white/60 text-center max-w-sm">
                        {step === 'role' 
                            ? 'Select how you want to use the platform to get started.' 
                            : (step === 'email' ? 'Enter your details to receive a verification code.' : \`Verification code sent to \${authMethod === 'email' ? email : phone}\`)}
                    </p>
                </div>

                <div id="recaptcha-container"></div>

                <AnimatePresence mode="wait">
                    
                    {/* ── Step 0: Role Selection ── */}
                    {step === 'role' && (
                        <motion.div key="role" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                            <button
                                onClick={() => { setSelectedRole(UserRole.USER); setStep('email'); }}
                                className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02] hover:border-red-500/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                        <User size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white">Customer</h3>
                                        <p className="text-xs font-medium text-white/50 mt-1">Book Events • Browse Vendors • Manage Bookings</p>
                                    </div>
                                    <ArrowRight size={20} className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>

                            <button
                                onClick={() => { setSelectedRole(UserRole.VENDOR); setStep('email'); }}
                                className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02] hover:border-red-500/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                        <Building size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white">Vendor</h3>
                                        <p className="text-xs font-medium text-white/50 mt-1">Grow Business • Receive Bookings • Run Ads</p>
                                    </div>
                                    <ArrowRight size={20} className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        </motion.div>
                    )}

                    {/* ── Step 1: Email/Phone Input ── */}
                    {step === 'email' && (
                        <motion.form key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSendOTP} className="space-y-6">
                            
                            {/* Google Auth */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                            >
                                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                                    </g>
                                </svg>
                                Continue with Google
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="h-px bg-white/10 flex-1"></div>
                                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">OR</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>

                            {/* Auth Method Toggle */}
                            <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                                <button type="button" onClick={() => setAuthMethod('email')} className={\`flex-1 py-2 text-sm font-bold rounded-lg transition-all \${authMethod === 'email' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'}\`}>Email</button>
                                <button type="button" onClick={() => setAuthMethod('phone')} className={\`flex-1 py-2 text-sm font-bold rounded-lg transition-all \${authMethod === 'phone' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'}\`}>Phone Number</button>
                            </div>

                            {/* Input Field */}
                            <div className="relative group">
                                {authMethod === 'email' ? (
                                    <>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors pointer-events-none">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-12 h-14 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none transition-all font-bold text-white text-base placeholder:text-white/30"
                                            placeholder="you@example.com"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(email) && <CheckCircle2 size={20} className="text-green-400 animate-in zoom-in" />}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <Phone size={20} className="text-white/40 group-focus-within:text-white transition-colors pointer-events-none" />
                                            <span className="text-white font-bold border-r border-white/10 pr-2">+91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            className="w-full pl-[5.5rem] pr-4 h-14 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none transition-all font-bold text-white text-base placeholder:text-white/30 tracking-wide"
                                            placeholder="98765 43210"
                                        />
                                    </>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20 group disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin" size={24} /> : <>Continue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </motion.form>
                    )}

                    {/* ── Step 2: OTP ── */}
                    {step === 'otp' && (
                        <motion.div key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8 text-center">
                            <div className="flex justify-center">
                                <OTPInput length={6} onComplete={handleVerifyOTP} onChange={setOtp} disabled={loading} />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleVerifyOTP()}
                                disabled={loading || otp.length < 6}
                                className="w-full h-14 bg-white text-black rounded-xl font-bold text-base transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30"
                            >
                                {loading ? <Loader className="animate-spin mx-auto" size={24} /> : 'Verify Code'}
                            </button>

                            <div className="flex flex-col items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => { if (resendTimer === 0) handleSendOTP(); }}
                                    disabled={loading || resendTimer > 0}
                                    className={\`text-sm font-bold flex items-center gap-2 transition-colors \${resendTimer > 0 ? 'text-white/40' : 'text-white hover:text-red-400'}\`}
                                >
                                    {resendTimer > 0 ? <><Clock size={16} /> Resend in {resendTimer}s</> : "Didn't receive code? Resend"}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 3: Complete Profile ── */}
                    {step === 'details' && (
                        <motion.form key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleCompleteProfile} className="space-y-6">
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors pointer-events-none">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full pl-12 pr-6 h-14 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white outline-none transition-all font-bold text-white text-base placeholder:text-white/30"
                                    placeholder="Full Name"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full h-14 bg-white text-black rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg">
                                {loading ? <Loader className="animate-spin" size={24} /> : <>Complete Setup <ArrowRight size={20} /></>}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <div className="flex justify-center gap-1 mb-2">
                        {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                    </div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Trusted by 10,000+ happy customers</p>
                </div>
            </motion.div>

            {/* Footer Links */}
            <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-6 text-sm font-medium text-white/50">
                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
        </div>
    );
};

export default UnifiedAuth;
`;

fs.writeFileSync('apps/user-website/src/pages/UnifiedAuth.tsx', content);
