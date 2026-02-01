import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Phone, ArrowRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserAuth } from '../contexts/AuthContext';
import api from '../lib/apiClient';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, loginWithToken } = useUserAuth();
    const [searchParams] = useSearchParams();

    // Mode: 'password' | 'otp'
    const [authMode, setAuthMode] = useState<'password' | 'otp'>('otp');
    const [step, setStep] = useState<'phone' | 'otp'>('phone'); // for OTP mode

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle OAuth callback
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            loginWithToken(token);
            navigate('/');
        }
    }, [searchParams, loginWithToken, navigate]);

    // Password Login Handler
    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            setSuccess('Login successful!');
            setTimeout(() => navigate('/'), 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    // OTP Login: Step 1 - Send OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login/send-otp', { phone });
            if (response.data.otp) {
                setSuccess(`OTP sent: ${response.data.otp}`);
            } else {
                setSuccess('OTP sent successfully!');
            }
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'User not found or failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    // OTP Login: Step 2 - Verify OTP
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login/verify-otp', { phone, otp });
            if (response.data.access_token) {
                loginWithToken(response.data.access_token);
                setSuccess('Login successful!');
                setTimeout(() => navigate('/'), 1000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
            <Link
                to="/"
                className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Home</span>
            </Link>

            <Card className="w-full max-w-md shadow-2xl border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="text-center space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-500 text-white p-3 rounded-xl">
                            <span className="text-2xl font-bold font-cursive">Ai</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold dark:text-white">Welcome Back</CardTitle>
                    <CardDescription className="dark:text-slate-400">
                        Login via {authMode === 'otp' ? 'Phone OTP' : 'Email & Password'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm border border-green-100 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400">
                            {success}
                        </div>
                    )}

                    {authMode === 'password' ? (
                        <form onSubmit={handlePasswordLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="pl-10 pr-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-sm text-red-500 hover:text-red-600 font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    ) : (
                        // OTP MODE
                        step === 'phone' ? (
                            <form onSubmit={handleSendOTP} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            required
                                            className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                            placeholder="+91 98765 43210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send OTP'} <ArrowRight size={18} className="ml-2 inline" />
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="otp">One-Time Password</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        required
                                        className="text-center text-2xl tracking-[0.5em] font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white uppercase"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                </Button>
                                <div className="flex justify-between mt-2">
                                    <button type="button" onClick={() => handleSendOTP({ preventDefault: () => { } } as any)} className="text-sm text-red-500 font-medium">Resend</button>
                                    <button type="button" onClick={() => setStep('phone')} className="text-sm text-gray-500">Change Phone</button>
                                </div>
                            </form>
                        )
                    )}
                </CardContent>
                <CardFooter>
                    <div className="w-full text-center space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-slate-800"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-gray-500">OR</span></div>
                        </div>
                        <button
                            onClick={() => {
                                setAuthMode(authMode === 'otp' ? 'password' : 'otp');
                                setStep('phone');
                                setError('');
                            }}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
                        >
                            {authMode === 'otp' ? 'Login with Password' : 'Login with OTP'}
                        </button>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-red-500 hover:text-red-600 font-bold">Sign up</Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
