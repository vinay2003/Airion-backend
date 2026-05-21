import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    React.useEffect(() => {
        // Redirection to the Unified Auth System on Port 5173
        // This ensures a single source of truth for ALL roles including Admin
        if (!user) {
            window.location.href = '/login?portal=admin';
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
            <div className="text-center space-y-10">
                <div className="w-20 h-20 bg-red-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-red-500/30">
                    <Shield className="text-white" size={40} />
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-black text-white tracking-tight">Admin login</h2>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto text-lg">Redirecting you to login...</p>
                </div>
                <div className="w-12 h-12 border-t-4 border-b-4 border-red-500 rounded-full mx-auto animate-spin"></div>
                <p className="text-xs text-slate-500 font-medium tracking-widest">Admin only</p>
            </div>
        </div>
    );
};

export default AdminLogin;
