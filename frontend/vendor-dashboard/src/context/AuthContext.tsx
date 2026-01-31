import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface User {
    id: string;
    email: string;
    role: string;
    phoneNumber?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    backendAvailable: boolean;
    login: (token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [backendAvailable, setBackendAvailable] = useState(false);
    const navigate = useNavigate();

    const checkAuth = async () => {
        console.log('[AuthContext] Starting checkAuth...');
        try {
            // First, check if backend is available (health check - no DB needed)
            console.log('[AuthContext] Checking backend health...');
            await api.get('/health');
            setBackendAvailable(true);
            console.log('[AuthContext] Backend is available');

            // Backend is up, now check authentication
            try {
                console.log('[AuthContext] Checking authentication...');
                const response = await api.get('/auth/me');
                setUser(response.data);
                console.log('[AuthContext] User authenticated:', response.data);
            } catch (authError: any) {
                // Handle auth-specific errors
                if (authError.response?.status === 401) {
                    // Not authenticated - this is normal
                    console.log('[AuthContext] User not authenticated (401)');
                    setUser(null);
                } else if (authError.response?.status === 503) {
                    // Database unavailable - log in dev mode only
                    console.warn('[AuthContext] Database unavailable (503)');
                    setUser(null);
                } else {
                    // Other errors
                    console.error('[AuthContext] Auth error:', authError);
                    setUser(null);
                }
                localStorage.removeItem('token');
            }
        } catch (healthError: any) {
            // Backend is completely unavailable
            console.error('[AuthContext] Backend unavailable:', healthError.message);
            setBackendAvailable(false);
            setUser(null);
        } finally {
            console.log('[AuthContext] Setting loading to false');
            setLoading(false);
        }
    };

    const login = (token: string) => {
        localStorage.setItem('token', token);
        checkAuth();
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Silent failure - user is being logged out anyway
            if (import.meta.env.DEV) {
                console.debug('Logout request failed (may be offline)');
            }
        }

        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, backendAvailable, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
