import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, User, Mail, Phone, MapPin, Shield, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/card';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/apiClient';
import toast from 'react-hot-toast';
import OTPInput from '@shared/components/OTPInput';

interface BasicDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessName: string;
    city: string;
}

const VendorSignupBasic: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState<'details' | 'otp' | 'verified'>('details');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const [basicDetails, setBasicDetails] = useState<BasicDetails>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        businessName: '',
        city: ''
    });

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBasicDetails({
            ...basicDetails,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateBasicDetails = () => {
        if (!basicDetails.firstName.trim()) return 'First name is required';
        if (!basicDetails.lastName.trim()) return 'Last name is required';
        if (!basicDetails.email.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basicDetails.email)) return 'Invalid email format';
        if (!basicDetails.phone.trim()) return 'Phone number is required';
        if (!/^[+]?[\d\s-()]{10,}$/.test(basicDetails.phone)) return 'Invalid phone number';
        if (!basicDetails.businessName.trim()) return 'Business name is required';
        if (!basicDetails.city.trim()) return 'City is required';
        return null;
    };

    const handleSendOTP = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (resendTimer > 0) return;

        const validationError = validateBasicDetails();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/signup/send-otp', {
                phone: basicDetails.phone,
                email: basicDetails.email
            });

            const res = response as any;
            const devCode = res?._dev_otp || res?.data?._dev_otp;
            if (import.meta.env.DEV && devCode) {
                console.log('📱 Dev-Only OTP:', devCode);
                toast(`Dev Code: ${devCode}`, { icon: '🔑', duration: 10000 });
            }

            toast.success('Verification code sent');
            setStep('otp');
            setResendTimer(60);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    }, [basicDetails, resendTimer]);

    const handleVerifyOTP = async (finalOtp?: string) => {
        const otpValue = finalOtp || otp;
        if (!otpValue.trim() || otpValue.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/signup/verify-otp', {
                phone: basicDetails.phone,
                otp: otpValue,
                name: `${basicDetails.firstName} ${basicDetails.lastName}`,
                email: basicDetails.email,
                role: 'vendor'
            });

            const authData = response as any;
            if (authData.access_token) {
                login(authData.access_token);
                localStorage.setItem('vendorBasicDetails', JSON.stringify(basicDetails));
            }

            toast.success('Phone verified successfully!');
            setStep('verified');
            
            setTimeout(() => {
                const role = authData.user?.role || 'vendor';
                if (role === 'vendor' || role === 'admin') {
                    navigate('/signup-form', { state: { basicDetails } });
                } else {
                    // Normal users shouldn't be here, send them back to the main site
                    window.location.href = '/dashboard';
                }
            }, 1000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'The code you entered is invalid.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'verified') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full shadow-2xl">
                    <CardBody className="pt-12 pb-8 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
                                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Phone Verified!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                            Setting up your dashboard...
                        </p>
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    if (step === 'otp') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                                <Shield className="w-12 h-12 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold">Verify OTP</CardTitle>
                        <p className="text-base mt-2 text-gray-600 dark:text-slate-400">
                            We've sent a 6-digit code to <br />
                            <span className="font-bold text-gray-900 dark:text-white">{basicDetails.phone}</span>
                        </p>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-8">
                            <div className="text-center">
                                <OTPInput 
                                    length={6} 
                                    onComplete={handleVerifyOTP} 
                                    disabled={loading}
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium">
                                    Please enter the 6-digit verification code.
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
                                    'Confirm & Continue'
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
                                        'Didn\'t receive a code? Resend'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep('details')}
                                    disabled={loading}
                                    className="text-gray-600 dark:text-gray-400 hover:underline text-sm font-medium"
                                >
                                    Change phone number
                                </button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                            <Building className="w-12 h-12 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold">Become a Vendor</CardTitle>
                    <p className="text-base text-gray-600 dark:text-slate-400">
                        Join Bihar's fastest-growing event marketplace
                    </p>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <User size={20} className="text-red-600 dark:text-red-400" />
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={basicDetails.firstName}
                                        onChange={handleInputChange}
                                        placeholder="John"
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={basicDetails.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Doe"
                                        className="mt-1"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address *</Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={basicDetails.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <div className="relative mt-1">
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={basicDetails.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 98765 43210"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    We'll send an OTP to verify your phone number
                                </p>
                            </div>
                        </div>

                        {/* Business Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Building size={20} className="text-red-600 dark:text-red-400" />
                                Business Information
                            </h3>

                            <div>
                                <Label htmlFor="businessName">Business Name *</Label>
                                <Input
                                    id="businessName"
                                    name="businessName"
                                    type="text"
                                    value={basicDetails.businessName}
                                    onChange={handleInputChange}
                                    placeholder="Your Event Company Name"
                                    className="mt-1"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="city">City *</Label>
                                <div className="relative mt-1">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <Input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={basicDetails.city}
                                        onChange={handleInputChange}
                                        placeholder="Patna"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    Sending OTP...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Send OTP <ArrowRight size={20} />
                                </span>
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <a href="/vendor/login" className="text-red-600 dark:text-red-400 hover:underline font-medium">
                                Login here
                            </a>
                        </p>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default VendorSignupBasic;
