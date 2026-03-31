import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Shield, ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import OTPInput from '@shared/components/OTPInput';

const VendorLogin: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        setError('');

        try {
            const response = await api.post('/auth/login/send-otp', { phone });

            const devCode = (response.data as any)?._dev_otp || (response.data as any)?.data?._dev_otp;
            if (import.meta.env.DEV && devCode) {
                console.log('📱 Dev-Only OTP:', devCode);
                toast(`Dev Code: ${devCode}`, { icon: '🔑', duration: 10000 });
            }

            toast.success('Verification code sent');
            setStep('otp');
            setResendTimer(60);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'User not found or failed to send OTP.');
        } finally {
            setLoading(false);
        }
    }, [phone, resendTimer]);

    const handleVerifyOTP = async (finalOtp?: string) => {
        const otpValue = finalOtp || otp;
        if (!otpValue.trim() || otpValue.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login/verify-otp', { phone, otp: otpValue });

            const { access_token, user } = response.data;
            login(access_token);

            toast.success('Welcome back!');
            
            const role = user?.role || 'user';
            setTimeout(() => {
                if (role === 'admin') window.location.href = '/admin';
                else if (role === 'vendor') window.location.href = '/vendor';
                else window.location.href = '/user';
            }, 800);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'The code you entered is invalid.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'otp') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
                <Card className="w-full max-w-md shadow-2xl transition-all duration-300">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-red-500 text-white p-3 rounded-xl shadow-lg shadow-red-500/20">
                                <Shield size={32} />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
                        <CardDescription className="mt-2">
                            Enter the 6-digit code sent to <br />
                            <span className="font-bold text-gray-900 dark:text-white">{phone}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="text-center">
                                <OTPInput 
                                    length={6} 
                                    onComplete={handleVerifyOTP} 
                                    disabled={loading}
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium">
                                    Didn't receive it? Check your messages.
                                </p>
                            </div>

                            <Button
                                onClick={() => handleVerifyOTP()}
                                className="w-full bg-red-600 hover:bg-neutral-900 transition-all text-white h-12 text-base font-bold shadow-lg shadow-red-500/10 active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Verifying...
                                    </span>
                                ) : (
                                    'Verify & Sign In'
                                )}
                            </Button>

                            <div className="flex flex-col gap-4 text-center">
                                <button
                                    type="button"
                                    onClick={() => handleSendOTP()}
                                    disabled={loading || resendTimer > 0}
                                    className={`text-sm font-bold flex items-center justify-center gap-2 ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 dark:text-red-400 hover:underline'}`}
                                >
                                    {resendTimer > 0 ? (
                                        <><Clock size={16} /> Resend in {resendTimer}s</>
                                    ) : (
                                        'Resend code'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    disabled={loading}
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
                                >
                                    Change phone number
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
            <Card className="w-full max-w-md shadow-2xl transition-all duration-300">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-red-500 text-white p-3 rounded-xl shadow-lg shadow-red-500/20">
                            <span className="text-2xl font-bold">Ai</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Vendor Portal</CardTitle>
                    <CardDescription className="text-center font-medium">
                        Welcome back! manage your business leads.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSendOTP} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="font-bold text-sm text-gray-700 dark:text-slate-300">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-red-500"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-neutral-900 py-6 rounded-xl font-bold transition-all shadow-lg shadow-red-500/10 active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    Sending Code...
                                </span>
                            ) : (
                                'Get Verification Code'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-6 pt-2 pb-8">
                    <div className="text-sm text-center font-medium text-gray-500">
                        New to Airion?{' '}
                        <a href="/signup" className="text-red-500 hover:text-red-600 font-bold underline-offset-4 hover:underline">
                            Register your business
                        </a>
                    </div>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-slate-800"></div></div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                            <span className="bg-white dark:bg-slate-950 px-4">Other Access</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-6">
                        <a href="/login" className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                            User Login
                        </a>
                        <a href="/admin/login" className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                            Admin Login
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default VendorLogin;

