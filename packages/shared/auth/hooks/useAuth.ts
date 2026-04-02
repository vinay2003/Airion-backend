/**
 * Shared useAuth Hook
 * Custom React hook for authentication state management
 * Can be adapted for use across all three portals
 */

import { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { commonAuth } from '../api';
import { getToken, setToken as setTokenUtil, removeToken, isTokenExpired } from '../utils';

interface UseAuthOptions {
    requiredRole?: UserRole;
    onUnauthorized?: () => void;
    checkOnMount?: boolean;
}

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    backendAvailable: boolean;
    isAuthenticated: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    hasRole: (role: UserRole) => boolean;
}

/**
 * Custom hook for authentication
 * 
 * @example
 * ```tsx
 * const { user, loading, login, logout } = useAuth({
 *   requiredRole: UserRole.ADMIN,
 *   onUnauthorized: () => navigate('/login')
 * });
 * ```
 */
export const useAuth = (options: UseAuthOptions = {}): UseAuthReturn => {
    const {
        requiredRole,
        onUnauthorized,
        checkOnMount = true
    } = options;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [backendAvailable, setBackendAvailable] = useState(false);

    /**
     * Check authentication status
     */
    const checkAuth = useCallback(async () => {
        console.log('[useAuth] Starting checkAuth...');

        try {
            // Check if token exists and is not expired
            const token = getToken();
            if (!token || isTokenExpired(token)) {
                console.log('[useAuth] No valid token found');
                setUser(null);
                setLoading(false);
                return;
            }

            // Check backend health
            const isHealthy = await commonAuth.healthCheck();
            setBackendAvailable(isHealthy);

            if (!isHealthy) {
                console.warn('[useAuth] Backend unavailable');
                setUser(null);
                setLoading(false);
                return;
            }

            // Fetch current user
            try {
                const currentUser = await commonAuth.checkAuth();
                setUser(currentUser);
                console.log('[useAuth] User authenticated:', currentUser);

                // Check role requirement
                if (requiredRole && currentUser.role !== requiredRole) {
                    console.warn(`[useAuth] User role ${currentUser.role} does not match required role ${requiredRole}`);
                    onUnauthorized?.();
                }
            } catch (authError: any) {
                if (authError.response?.status === 401) {
                    console.log('[useAuth] User not authenticated (401)');
                    removeToken();
                    setUser(null);
                    onUnauthorized?.();
                } else {
                    console.error('[useAuth] Auth error:', authError);
                    setUser(null);
                }
            }
        } catch (error) {
            console.error('[useAuth] Failed to check auth:', error);
            setBackendAvailable(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [requiredRole, onUnauthorized]);

    /**
     * Login with token
     */
    const login = useCallback(async (token: string) => {
        setTokenUtil(token);
        await checkAuth();
    }, [checkAuth]);

    /**
     * Logout
     */
    const logout = useCallback(async () => {
        try {
            await commonAuth.logout();
        } catch (error) {
            console.error('[useAuth] Logout error:', error);
        } finally {
            removeToken();
            setUser(null);
            onUnauthorized?.();
        }
    }, [onUnauthorized]);

    /**
     * Check if user has specific role
     */
    const hasRole = useCallback((role: UserRole): boolean => {
        return user?.role === role;
    }, [user]);

    /**
     * Check auth on mount
     */
    useEffect(() => {
        if (checkOnMount) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, [checkOnMount, checkAuth]);

    return {
        user,
        loading,
        backendAvailable,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
        hasRole,
    };
};

export default useAuth;
