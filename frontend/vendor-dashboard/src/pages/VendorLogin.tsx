import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const VendorLogin: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual login logic
        console.log('Vendor login attempt:', formData);
        // For now, just navigate to dashboard
        navigate('/');
    };

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
                        Sign in to manage your listings and bookings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="vendor@example.com"
                                    className="pl-10"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a href="#" className="text-sm text-red-500 hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                                Remember me for 30 days
                            </label>
                        </div>
                        <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                            Sign In to Dashboard
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
                            <a href="http://localhost:5173/login" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
                                User Login
                            </a>
                            <span>•</span>
                            <a href="http://localhost:5175/login" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
                                Admin Login
                            </a>
                        </div>
                    </div>
                    <div className="text-xs text-center text-gray-500">
                        By signing in, you agree to our{' '}
                        <a href="#" className="underline">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="underline">
                            Privacy Policy
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default VendorLogin;
