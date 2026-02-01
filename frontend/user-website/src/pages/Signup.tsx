import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader, Check, ArrowLeft, Phone } from 'lucide-react';
import { useUserAuth } from '../contexts/AuthContext';
import api from '../lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithToken } = useUserAuth();

    // Step: 'phone' | 'otp'
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Send OTP (Signup endpoint)
            const response = await api.post('/auth/signup/send-otp', {
                phone: phone,
            });

            if (response.data.otp) {
                setSuccess(`OTP sent! Your code is: ${response.data.otp}`);
            } else {
                setSuccess('OTP sent successfully to your phone!');
            }
            setStep('otp');
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError('User already exists with this phone number. Please login.');
            } else {
                setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/signup/verify-otp', {
                phone: phone,
                otp,
                name: `User ${phone}`, // Optional fallback name
            });

            if (response.data.access_token) {
                loginWithToken(response.data.access_token);
                setSuccess('Account created successfully!');
                setTimeout(() => navigate('/'), 1000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
            {/* Back to Home Button */}
            <Link
                to="/"
                className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Home</span>
            </Link>

            <Card className="w-full max-w-md shadow-2xl border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {/* Header */}
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-500 text-white p-3 rounded-xl flex items-center gap-2">
                            <Sparkles size={24} />
                            <span className="text-xl font-bold font-cursive">Airion</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold dark:text-white">
                        {step === 'phone' ? 'Create Account' : 'Verify & Join'}
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                        {step === 'phone' ? 'Enter your mobile number to get started' : `Enter the 6-digit code sent to ${phone}`}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 border border-red-100 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 border border-green-100 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400">
                            <Check size={16} /> {success}
                        </div>
                    )}

                    {step === 'phone' ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="dark:text-slate-300">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl"
                            >
                                {loading ? <Loader className="animate-spin mr-2" /> : null}
                                {loading ? 'Sending...' : 'Send OTP'}
                                {!loading && <ArrowRight size={18} className="ml-2" />}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="dark:text-slate-300">One-Time Password</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    required
                                    value={otp}
                                    maxLength={6}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="text-center text-2xl tracking-[0.5em] font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white uppercase"
                                    placeholder="000000"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl"
                            >
                                {loading ? <Loader className="animate-spin mr-2" /> : null}
                                {loading ? 'Verifying...' : 'Verify & Sign Up'}
                            </Button>

                            <div className="flex justify-between items-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => handleSendOTP({ preventDefault: () => { } } as any)}
                                    className="text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                    disabled={loading}
                                >
                                    Change Number
                                </button>
                            </div>
                        </form>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="w-full text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-red-500 hover:text-red-600 font-bold">
                                Login
                            </Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
