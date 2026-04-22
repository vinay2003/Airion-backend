import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType } from './types';
import { commonAuth } from './api';
import { tokenService } from './tokenService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState<boolean>(true);

  const fetchUser = useCallback(async () => {
    // Check health in parallel with auth check
    const healthCheckPromise = commonAuth.healthCheck();

    // 🔐 JWT Handshake Protocol: Multi-Portal Monorepo Handoff
    const urlParams = new URL(window.location.href).searchParams;
    const isLogout = urlParams.get('action') === 'logout';

    if (isLogout) {
      tokenService.clearTokens();

      // Clean URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('action');
      window.history.replaceState({ redirected: true }, '', newUrl.pathname + newUrl.search + newUrl.hash);

      setUser(null);
      setIsLoading(false);
      return;
    }

    const urlToken = urlParams.get('token') || urlParams.get('ease2event_token');

    if (urlToken) {
      tokenService.setAccessToken(urlToken);
      // 🔥 Clean URL to prevent re-capturing token on reload or security leaks
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('token');
      newUrl.searchParams.delete('ease2event_token');
      window.history.replaceState({ redirected: true }, '', newUrl.pathname + newUrl.search + newUrl.hash);

      const returnPath = urlParams.get('redirect_to');
      if (returnPath) {
        window.location.href = returnPath;
        return;
      }
    }

    if (!tokenService.hasToken()) {
      const health = await healthCheckPromise;
      setBackendAvailable(health);
      // 🔥 Only clear user if it wasn't set by a late login event
      setUser(prev => prev);
      setIsLoading(false);
      return;
    }

    try {
      const [userData, health] = await Promise.all([
        commonAuth.checkAuth(),
        healthCheckPromise
      ]);

      // 🔥 SYNC PROTOCOL: Always update user state with fresh data from server to ensure gallery/ads are current
      setUser(userData);
      setBackendAvailable(health);
    } catch (error) {
      console.error('[SharedAuth] Auth check failed:', error);
      // 🔥 Don't clear tokens if we just logged in! Only if we are not in login flow.
      // We check if the current user exists; if not, then clear.
      setUser(prev => {
        if (!prev) tokenService.clearTokens();
        return prev;
      });

      const health = await healthCheckPromise;
      setBackendAvailable(health);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const loginWithToken = useCallback(async (token: string) => {
    tokenService.setAccessToken(token);
    await fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await commonAuth.login(email, password);
    tokenService.setAccessToken(response.access_token);
    if (response.refresh_token) {
      tokenService.setRefreshToken(response.refresh_token);
    }
    setUser(response.user);
    setIsLoading(false);
  }, []);

  const loginWithResponse = useCallback((response: any) => {
    tokenService.setAccessToken(response.access_token);
    if (response.refresh_token) {
      tokenService.setRefreshToken(response.refresh_token);
    }
    // 🔥 CRITICAL FIX: Update state and CLEAR loading so ProtectedRoutes can render immediately
    setUser(response.user);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await commonAuth.logout();
    } catch (err) {
      console.warn('[SharedAuth] Logout request failed:', err);
    } finally {
      // Clear tokens immediately
      tokenService.clearTokens();

      // 🚀 Global Identity Reset: Redirect to Central Auth Portal
      const isCentralAuth = window.location.port === '5173';
      const LOGIN_URL = (import.meta.env.VITE_LOGIN_URL as string) || 'http://localhost:5173/login';

      if (!isCentralAuth) {
        // 🔥 CRITICAL FIX: Do not call setUser(null) here!
        // Calling setUser(null) synchronously triggers ProtectedRoute to Navigate to local /login.
        // The local /login (e.g. VendorLogin) unconditionally redirects to /login?portal=vendor,
        // creating a race condition that overrides this action=logout redirect!
        window.location.href = LOGIN_URL + (LOGIN_URL.includes('?') ? '&' : '?') + 'action=logout';
      } else {
        setUser(null);
        window.location.href = '/login?action=logout';
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    backendAvailable,
    login,
    loginWithToken,
    loginWithResponse,
    logout,
    refreshUser: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
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
