import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, User, Mail, Phone, MapPin, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

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

    const [basicDetails, setBasicDetails] = useState<BasicDetails>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        businessName: '',
        city: ''
    });

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

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateBasicDetails();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Send OTP to phone number
            const response = await api.post('/auth/signup/send-otp', {
                phone: basicDetails.phone,
                email: basicDetails.email
            });

            // Display OTP in alert and console for development
            if (response.data.otp) {
                const otpCode = response.data.otp;

                // Console log
                console.log('\n' + '='.repeat(60));
                console.log('📱 OTP RECEIVED FROM BACKEND');
                console.log('Phone:', basicDetails.phone);
                console.log('OTP:', otpCode);
                console.log('='.repeat(60) + '\n');

                // Alert
                alert(`🔑 Your OTP is: ${otpCode}\n\nPhone: ${basicDetails.phone}\n\n(This is for development testing only)`);
            }

            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
            console.error('OTP Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp.trim() || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Verify OTP and create user account with vendor role
            const response = await api.post('/auth/signup/verify-otp', {
                phone: basicDetails.phone,
                otp: otp,
                name: `${basicDetails.firstName} ${basicDetails.lastName}`,
                email: basicDetails.email,
                role: 'vendor'
            });

            // ✅ Properly authenticate user via AuthContext
            if (response.data.access_token) {
                login(response.data.access_token); // Updates AuthContext state
                localStorage.setItem('vendorBasicDetails', JSON.stringify(basicDetails));
            }

            console.log('✅ User authenticated, redirecting to vendor profile form...');

            setStep('verified');
            // Redirect to full vendor form after a short delay
            setTimeout(() => {
                navigate('/signup-form', { state: { basicDetails } });
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
            console.error('OTP Verification Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError('');
        setOtp('');

        try {
            const response = await api.post('/auth/signup/send-otp', {
                phone: basicDetails.phone,
                email: basicDetails.email
            });

            // Display OTP in alert and console
            if (response.data.otp) {
                const otpCode = response.data.otp;
                console.log('\n🔑 Resent OTP:', otpCode, '\n');
                alert(`🔑 Your new OTP is: ${otpCode}\n\n(Sent to ${basicDetails.phone})`);
            } else {
                alert('OTP sent successfully!');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'verified') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full shadow-2xl">
                    <CardContent className="pt-12 pb-8 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
                                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Phone Verified!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Redirecting to complete your vendor profile...
                        </p>
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                    </CardContent>
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
                        <CardDescription className="text-base">
                            We've sent a 6-digit code to <br />
                            <span className="font-semibold text-gray-900 dark:text-white">{basicDetails.phone}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <Label htmlFor="otp" className="text-base">Enter OTP</Label>
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
                                    className="mt-2 text-center text-2xl tracking-widest font-bold h-14"
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Enter the 6-digit code sent to your phone
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Verifying...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Verify & Continue <ArrowRight size={20} />
                                    </span>
                                )}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={loading}
                                    className="text-red-600 dark:text-red-400 hover:underline text-sm font-medium"
                                >
                                    Resend OTP
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep('details')}
                                    className="text-gray-600 dark:text-gray-400 hover:underline text-sm"
                                >
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
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                            <Building className="w-12 h-12 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold">Become a Vendor</CardTitle>
                    <CardDescription className="text-base">
                        Join Bihar's fastest-growing event marketplace
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
    );
};

export default VendorSignupBasic;
