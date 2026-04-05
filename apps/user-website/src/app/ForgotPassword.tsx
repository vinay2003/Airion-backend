import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, ArrowRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import api from '../lib/apiClient';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
            <Link
                to="/login"
                className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Login</span>
            </Link>

            <Card className="w-full max-w-md shadow-2xl border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="text-center space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 text-red-500 p-3 rounded-full">
                            <Mail size={32} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold dark:text-white">Forgot Password?</CardTitle>
                    <CardDescription className="dark:text-slate-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200">
                                <p className="font-semibold">Check your inbox!</p>
                                <p className="text-sm mt-1">If an account exists for {email}, we have sent a password reset link.</p>
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/login">Return to Login</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
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
                            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl" disabled={loading}>
                                {loading ? <Loader className="animate-spin" /> : 'Send Reset Link'}
                                {!loading && <ArrowRight size={18} className="ml-2 inline" />}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
