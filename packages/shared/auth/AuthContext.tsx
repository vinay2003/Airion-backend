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
    const urlParams = new URL(window.location.href).searchParams;
    const urlToken = urlParams.get('token') || urlParams.get('ease2event_token');
    
    if (urlToken) {
      tokenService.setAccessToken(urlToken);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('token');
      newUrl.searchParams.delete('ease2event_token');
      window.history.replaceState({}, '', newUrl.pathname + newUrl.search + newUrl.hash);
    }

    if (!tokenService.hasToken()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userData = await commonAuth.checkAuth();
      setUser(userData);
    } catch (error) {
      console.error('[SharedAuth] Auth check failed:', error);
      tokenService.clearTokens();
      setUser(null);
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
      const LOGIN_URL = (import.meta.env.VITE_LOGIN_URL as string) || '/login';

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
