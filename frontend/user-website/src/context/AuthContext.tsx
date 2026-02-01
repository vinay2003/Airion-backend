import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/apiClient';

interface User {
    id: string;
    email: string;
    role: string;
    name?: string;
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
        console.log('[User AuthContext] Starting checkAuth...');
        try {
            // Check backend health
            console.log('[User AuthContext] Checking backend health...');
            await api.get('/health');
            setBackendAvailable(true);
            console.log('[User AuthContext] Backend is available');

            // Check authentication
            try {
                console.log('[User AuthContext] Checking authentication...');
                const response = await api.get('/auth/me');
                setUser(response.data);
                console.log('[User AuthContext] User authenticated:', response.data);
            } catch (authError: any) {
                if (authError.response?.status === 401) {
                    console.log('[User AuthContext] User not authenticated (401)');
                    setUser(null);
                } else if (authError.response?.status === 503) {
                    console.warn('[User AuthContext] Database unavailable (503)');
                    setUser(null);
                } else {
                    console.error('[User AuthContext] Auth error:', authError);
                    setUser(null);
                }
                localStorage.removeItem('token');
            }
        } catch (healthError: any) {
            console.error('[User AuthContext] Backend unavailable:', healthError.message);
            setBackendAvailable(false);
            setUser(null);
        } finally {
            console.log('[User AuthContext] Setting loading to false');
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
