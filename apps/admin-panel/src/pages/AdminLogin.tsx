import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@ease2event/shared';

const AdminLogin: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirection to the Unified Auth System
        // This ensures a single source of truth for authentication
        if (!user) {
            // Redirect to the main website login with portal context
            const authUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5173/login?portal=admin'
                : '/login?portal=admin';
            window.location.href = authUrl;
        } else if (user.role === 'admin') {
            // If already logged in as admin, go to dashboard
            navigate('/');
        } else {
            // If logged in as something else, go back to main dashboard
            window.location.href = '/dashboard';
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Redirecting to Secure Login...</h2>
                <p className="text-gray-500 dark:text-gray-400">Please wait while we connect to the authentication portal.</p>
            </div>
        </div>
    );
};

export default AdminLogin;
