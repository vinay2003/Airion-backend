import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin';
}

interface AdminAuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
};

interface AdminAuthProviderProps {
    children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/admin/login', {
                email,
                password,
            });

            // Validate that user has admin role
            if (response.data.user.role !== 'admin') {
                throw new Error('Unauthorized: Admin access required');
            }

            localStorage.setItem('admin_token', response.data.access_token);
            setUser(response.data.user);

            // Log audit event
            await api.post('/auth/audit/log', {
                action: 'ADMIN_LOGIN',
                success: true,
            });

            return response.data;
        } catch (error: any) {
            // Log failed attempt
            await api.post('/auth/audit/log', {
                action: 'ADMIN_LOGIN',
                success: false,
                reason: error.message,
            }).catch(() => { });

            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('admin_token');
            setUser(null);
        }
    };

    const checkAuth = async () => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/auth/admin/me');

            // Verify admin role
            if (response.data.role !== 'admin') {
                throw new Error('Invalid role');
            }

            setUser(response.data);
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('admin_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Setup axios interceptor for admin token
    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('admin_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('admin_token');
                    setUser(null);
                    window.location.href = '/admin/login';
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    const value: AdminAuthContextType = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export default AdminAuthContext;
