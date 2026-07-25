import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader, CheckCircle2, ArrowLeft, Phone, Clock } from 'lucide-react';
import { useAuth, commonAuth, otpAuth, getPortalUrl, UserRole } from '@ease2event/shared/auth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import OTPInput from '@ease2event/shared/components/OTPInput';
import { auth, signInWithPhoneNumber, RecaptchaVerifier } from '../lib/firebase';

declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [confirmationResult, setConfirmationResult] = useState<any>(null);

    const [loading, setLoading] = useState(false);

    const startResendTimer = () => setResendTimer(60);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    useEffect(() => {
        if (window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier.clear();
            } catch (e) {
                // Ignore clear errors
            }
            window.recaptchaVerifier = null;
        }

        try {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
            });
            window.recaptchaVerifier.render();
        } catch (error) {
            console.error("Error initializing recaptcha verifier:", error);
        }

        return () => {
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                } catch (e) {
                    // Ignore clear errors
                }
                window.recaptchaVerifier = null;
            }
        };
    }, []);

    const handleSendOTP = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (resendTimer > 0) return;

        setLoading(true);
        try {
            let sanitizedPhone = phone.replace(/\s+/g, '').trim();
            if (sanitizedPhone.length === 10) {
                sanitizedPhone = '+91' + sanitizedPhone;
            } else if (!sanitizedPhone.startsWith('+')) {
                sanitizedPhone = '+' + sanitizedPhone;
            }

            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, sanitizedPhone, appVerifier);
            setConfirmationResult(confirmation);
            
            toast.success('Verification code sent via Firebase');
            setStep('otp');
            startResendTimer();
        } catch (err: any) {
            console.error("Firebase send OTP error:", err);
            if (err.response?.status === 409 || err.message?.includes('already exists')) {
                toast.error('Account already exists. Please login.');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                toast.error(err.message || 'Failed to send verification code.');
            }
        } finally {
            setLoading(false);
        }
    }, [phone, resendTimer, navigate]);

    const handleVerifyOTP = async (finalOtp?: string) => {
        const otpValue = finalOtp || otp;
        if (otpValue.length < 6) return;
        if (!confirmationResult) {
            return toast.error("Session expired. Please request OTP again.");
        }

        setLoading(true);
        try {
            const result = await confirmationResult.confirm(otpValue.trim());
            const idToken = await result.user.getIdToken();

            // Verify using custom backend via Firebase token
            const response = await otpAuth.verifyFirebaseToken(idToken, UserRole.USER);

            if (response.access_token) {
                const user = response?.user;
                const role = user?.role || 'user';

                loginWithToken(response.access_token);
                toast.success('Account created successfully!');

                setTimeout(() => {
                    if (role === 'vendor') {
                        window.location.href = getPortalUrl('vendor');
                    } else if (role === 'admin') {
                        window.location.href = getPortalUrl('admin');
                    } else {
                        navigate('/onboarding/interests');
                    }
                }, 800);
            }
        } catch (err: any) {
            console.error("OTP verification error:", err);
            toast.error(err.response?.data?.message || err.message || 'The code you entered is invalid.');
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
                        <span className="text-3xl font-black text-white tracking-tight">Ease2event</span>
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
                        <span className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Ease2event</span>
                    </div>

                    <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-2">Create an Account</h2>
                    <p className="text-neutral-500 dark:text-slate-400 font-medium mb-8">
                        {step === 'phone' ? 'Enter your phone number to get started.' : `Enter the 6-digit code sent to ${phone}.`}
                    </p>

                    <div className="mb-4 h-6">
                        {/* Space for layout stability */}
                    </div>

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
                                    {loading ? <Loader className="animate-spin" /> : 'Create Account & Join'}
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

                    <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-slate-800">
                        <p className="text-center text-sm font-medium text-neutral-500 dark:text-slate-400">
                            Already have an account? <Link to="/login" className="text-red-500 hover:text-red-600 font-bold ml-1">Log In Instead</Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* Firebase reCAPTCHA Container */}
            <div id="recaptcha-container"></div>
        </div>
    );
};

export default Signup;
