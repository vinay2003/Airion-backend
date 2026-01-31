import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '../../lib/api';
import LoadingButton from '../../../../shared/components/LoadingButton';
import StatusAlert from '../../../../shared/components/StatusAlert';

const VendorSignupBasic: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validatePhone = (phoneNumber: string): boolean => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validatePhone(phone)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/signup/send-otp', { phoneNumber: phone });
            setSuccess('OTP sent successfully! Please check your phone.');
            setStep('otp');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/signup/verify-otp', {
                phoneNumber: phone,
                otp,
                role: 'vendor',
            });

            // Store token
            localStorage.setItem('token', response.data.access_token);

            setSuccess('OTP verified! Redirecting to complete your profile...');

            // Redirect to profile form with basic details
            setTimeout(() => {
                navigate('/vendor/signup-form', {
                    state: {
                        phone,
                        token: response.data.access_token,
                    },
                });
            }, 1500);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Invalid OTP. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post('/auth/signup/send-otp', { phoneNumber: phone });
            setSuccess('OTP resent successfully!');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to resend OTP';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {step === 'phone' ? 'Vendor Signup' : 'Verify OTP'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === 'phone'
                            ? 'Enter your phone number to get started'
                            : `Enter the OTP sent to ${phone}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Success Alert */}
                    {success && (
                        <StatusAlert
                            type="success"
                            title="Success!"
                            message={success}
                            className="mb-4"
                        />
                    )}

                    {/* Error Alert */}
                    {error && (
                        <StatusAlert
                            type="error"
                            title="Error"
                            message={error}
                            className="mb-4"
                        />
                    )}

                    {step === 'phone' ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="9876543210"
                                        className="pl-10"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        disabled={loading}
                                        maxLength={10}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Enter 10-digit mobile number without country code
                                </p>
                            </div>

                            <LoadingButton
                                loading={loading}
                                loadingText="Sending OTP..."
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                Send OTP
                            </LoadingButton>

                            <p className="text-sm text-center text-gray-600">
                                Already have an account?{' '}
                                <a href="/vendor/login" className="text-purple-600 hover:underline">
                                    Login
                                </a>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">OTP</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        className="pl-10 text-center text-2xl tracking-widest"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        required
                                        disabled={loading}
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <LoadingButton
                                loading={loading}
                                loadingText="Verifying..."
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                Verify OTP
                            </LoadingButton>

                            <div className="flex items-center justify-between text-sm">
                                <button
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    className="text-purple-600 hover:underline"
                                    disabled={loading}
                                >
                                    Change number
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="text-purple-600 hover:underline"
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default VendorSignupBasic;
