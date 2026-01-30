import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        twoFactorCode: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual admin login logic with 2FA
        console.log('Admin login attempt:', formData);
        // For now, just navigate to dashboard
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <Card className="w-full max-w-md shadow-2xl border-slate-700">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-red-500 text-white p-4 rounded-xl">
                            <Shield size={32} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Admin Portal</CardTitle>
                    <CardDescription className="text-center">
                        Secure access to platform administration
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Admin Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@airion.com"
                                    className="pl-10"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
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
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twoFactorCode">Two-Factor Code (Optional)</Label>
                            <Input
                                id="twoFactorCode"
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                className="text-center text-lg tracking-widest"
                                value={formData.twoFactorCode}
                                onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value.replace(/\D/g, '') })}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Enter the 6-digit code from your authenticator app
                            </p>
                        </div>
                        <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                            <Shield className="mr-2 h-4 w-4" />
                            Secure Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-xs text-center text-gray-500">
                        <p>This is a secure admin portal. All access attempts are logged.</p>
                    </div>
                    <div className="text-xs text-center text-gray-500">
                        <p>Looking for different access?</p>
                        <div className="flex items-center justify-center gap-3 mt-2">
                            <a href="http://localhost:5173/login" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                                User Login
                            </a>
                            <span>•</span>
                            <a href="http://localhost:5174/login" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                                Vendor Login
                            </a>
                        </div>
                    </div>
                    <div className="text-xs text-center text-gray-500">
                        <a href="#" className="underline hover:text-gray-400">
                            Contact system administrator
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AdminLogin;
