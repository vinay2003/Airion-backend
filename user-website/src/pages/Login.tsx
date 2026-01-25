import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        otp: '',
    });

    const API_URL = import.meta.env.VITE_API_URL;

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.phone,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

            if (data.otp) {
                // Checking for OTP in response for dev/demo purposes if backend sends it
                // alert(`Dev Mode OTP: ${data.otp}`); 
            }

            toast.success('OTP Sent successfully!');
            setStep('otp');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.phone,
                    otp: formData.otp,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Verification failed');

            // Save Token logic if needed here, but context handles state
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
            }

            // Update Auth Context
            login(data.user);

            toast.success('Login Successful!');
            // Navigation handled by AuthRoute or context, but redundant check:
            navigate('/');

        } catch (error: any) {
            toast.error(error.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 transition-colors duration-300">
            {/* Back to Home Button */}
            <Link
                to="/"
                className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Home</span>
            </Link>

            <Card className="w-full max-w-md shadow-2xl border-gray-200 dark:border-slate-800">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-red-500 text-white p-3 rounded-xl">
                            <span className="text-2xl font-bold font-cursive">Ai</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center dark:text-white">
                        {step === 'phone' ? 'Welcome Back' : 'Verify Login'}
                    </CardTitle>
                    <CardDescription className="text-center dark:text-slate-400">
                        {step === 'phone'
                            ? 'Enter your phone number to sign in'
                            : `Enter the 6-digit code sent to ${formData.phone}`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'phone' ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="dark:text-slate-200">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="9876543210"
                                        className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        minLength={10}
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="dark:text-slate-200">Enter OTP</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500" />
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="123456"
                                        className="pl-10 text-center tracking-widest text-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                        required
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                    {!loading && <CheckCircle2 className="ml-2 h-4 w-4" />}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full dark:text-slate-300 dark:hover:bg-slate-800"
                                    onClick={() => setStep('phone')}
                                >
                                    Change Phone Number
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t dark:border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-900 px-2 text-gray-500 dark:text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Social logins kept as props/placeholders from original file */}
                        <Button variant="outline" type="button" className="dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-200">
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.04-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </Button>
                        <Button variant="outline" type="button" className="dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-200">
                            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            GitHub
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-gray-600 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-red-500 dark:text-red-400 hover:underline font-medium">
                            Sign up
                        </Link>
                    </div>
                    <div className="text-xs text-center text-gray-500 dark:text-slate-500">
                        <p>Looking for vendor or admin access?</p>
                        <div className="flex items-center justify-center gap-3 mt-2">
                            <a href="http://localhost:5174/login" target="_blank" rel="noopener noreferrer" className="text-red-500 dark:text-red-400 hover:underline">
                                Vendor Login
                            </a>
                            <span>•</span>
                            <a href="http://localhost:5175/login" target="_blank" rel="noopener noreferrer" className="text-red-500 dark:text-red-400 hover:underline">
                                Admin Login
                            </a>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
