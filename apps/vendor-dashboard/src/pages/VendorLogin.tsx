import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Shield, ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@ease2event/shared';
import api from '../lib/api';
import toast from 'react-hot-toast';
import OTPInput from '@shared/components/OTPInput';

const VendorLogin: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Redirection to the Unified Auth System on Port 5173
        // This ensures a single source of truth for authentication
        if (!user) {
            window.location.href = '/login?portal=vendor';
        } else if (user.role === 'vendor' || user.role === 'admin') {
            navigate('/');
        } else {
            // User-role accounts should NOT be in vendor dashboard
            window.location.href = '/dashboard';
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans">
            <div className="text-center space-y-6 animate-pulse">
                <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-red-500/20">
                    <Shield className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Redirecting to Secure Login...</h2>
                <p className="text-slate-400 font-medium">Please wait while we connect you to the Ease2event Auth System.</p>
                <div className="w-8 h-8 border-t-2 border-b-2 border-red-500 rounded-full mx-auto animate-spin"></div>
            </div>
        </div>
    );
};

export default VendorLogin;

