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
    const urlToken = urlParams.get('token') || urlParams.get('airion_token');
    
    if (urlToken) {
      tokenService.setAccessToken(urlToken);
      // 🔥 Clean URL to prevent re-capturing token on reload or security leaks
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('token');
      newUrl.searchParams.delete('airion_token');
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
      
      // 🔥 RACE CONDITION FIX: Do not overwrite if a user is already set (by loginWithResponse)
      setUser(prev => prev || userData);
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
      tokenService.clearTokens();
      setUser(null);
      
      // 🚀 Global Identity Reset: Redirect to Central Auth Portal
      const isCentralAuth = window.location.port === '5173';
      const LOGIN_URL = (import.meta.env.VITE_LOGIN_URL as string) || 'http://localhost:5173/login';
      
      if (!isCentralAuth) {
          window.location.href = `${LOGIN_URL}?portal_logout=true`;
      } else {
          // If we are already on central auth, just navigating to login is enough
          // We can use navigate if we're in a react-router context, but window.location is safer here
          window.location.href = '/login';
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
