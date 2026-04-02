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
    
    // Check for tokens in the URL (for multi-app monorepo handoff)
    const urlParams = new URL(window.location.href).searchParams;
    const urlToken = urlParams.get('token') || urlParams.get('airion_token');
    
    if (urlToken) {
      tokenService.setAccessToken(urlToken);
      // Clean URL to prevent re-capturing token on reload or copy-paste
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('token');
      newUrl.searchParams.delete('airion_token');
      window.history.replaceState({}, '', newUrl.toString());
    }

    if (!tokenService.hasToken()) {
      const health = await healthCheckPromise;
      setBackendAvailable(health);
      setIsLoading(false);
      return;
    }

    try {
      const [userData, health] = await Promise.all([
        commonAuth.checkAuth(),
        healthCheckPromise
      ]);
      setUser(userData);
      setBackendAvailable(health);
    } catch (error) {
      console.error('[SharedAuth] Auth check failed:', error);
      tokenService.clearTokens();
      setUser(null);
      // Even if auth fails, the backend might still be up
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
    setUser(response.user);
    if (response.refresh_token) {
        tokenService.setRefreshToken(response.refresh_token);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await commonAuth.logout();
    } catch (err) {
      console.warn('[SharedAuth] Logout request failed:', err);
    } finally {
      tokenService.clearTokens();
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    backendAvailable,
    login,
    loginWithToken,
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
