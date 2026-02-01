import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'user';
}

interface UserAuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<any>;
    loginWithToken: (token: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export const useUserAuth = () => {
    const context = useContext(UserAuthContext);
    if (!context) {
        throw new Error('useUserAuth must be used within UserAuthProvider');
    }
    return context;
};

interface UserAuthProviderProps {
    children: ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            localStorage.setItem('token', response.data.access_token);
            setUser(response.data.user);

            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const loginWithToken = async (token: string) => {
        localStorage.setItem('token', token);
        await checkAuth();
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Setup axios interceptor
    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token && config.headers) {
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
                    localStorage.removeItem('token');
                    setUser(null);
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    const value: UserAuthContextType = {
        user,
        login,
        loginWithToken,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <UserAuthContext.Provider value={value}>
            {children}
        </UserAuthContext.Provider>
    );
};

export default UserAuthContext;
