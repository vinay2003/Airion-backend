import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const VendorLogin: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login/send-otp', { phone });

            // Dev: Show OTP in alert and console
            if (response.data.otp) {
                console.log('\n' + '='.repeat(60));
                console.log('🔑 LOGIN OTP');
                console.log('Phone:', phone);
                console.log('OTP:', response.data.otp);
                console.log('='.repeat(60) + '\n');
                alert(`🔑 Your login OTP: ${response.data.otp}\n\n(Development only)`);
            }

            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
            console.error('Send OTP Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login/verify-otp', { phone, otp });

            console.log('✅ Login successful, authenticating user...');
            login(response.data.access_token); // Updates AuthContext
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
            console.error('Verify OTP Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (step === 'otp') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-red-500 text-white p-3 rounded-xl">
                                <Shield size={32} />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
                        <CardDescription>
                            Enter the code sent to <br />
                            <span className="font-semibold text-gray-900 dark:text-white">{phone}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value.replace(/\D/g, ''));
                                        setError('');
                                    }}
                                    placeholder="000000"
                                    className="text-center text-2xl tracking-widest font-bold h-14"
                                    autoFocus
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-red-500 hover:bg-red-600"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Verifying...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Verify & Sign In <ArrowRight size={20} />
                                    </span>
                                )}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:underline flex items-center gap-1 mx-auto"
                                >
                                    <ArrowLeft size={16} />
                                    Change phone number
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-red-500 text-white p-3 rounded-xl">
                            <span className="text-2xl font-bold">Ai</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Vendor Portal</CardTitle>
                    <CardDescription className="text-center">
                        Sign in with OTP to manage your business
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="pl-10"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        setError('');
                                    }}
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                We'll send you a one-time password
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    Sending OTP...
                                </span>
                            ) : (
                                'Send OTP'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                        New vendor?{' '}
                        <a href="/signup" className="text-red-500 hover:underline font-medium">
                            Register your business
                        </a>
                    </div>
                    <div className="text-xs text-center text-gray-500">
                        <p>Looking for different access?</p>
                        <div className="flex items-center justify-center gap-3 mt-2">
                            <a href="/login" className="text-red-500 hover:underline">
                                User Login
                            </a>
                            <span>•</span>
                            <a href="/admin/login" className="text-red-500 hover:underline">
                                Admin Login
                            </a>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default VendorLogin;
