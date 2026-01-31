/**
 * Shared Authentication API
 * Centralized API calls for authentication across all portals
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
    AuthResponse,
    LoginCredentials,
    SignupData,
    OTPRequest,
    OTPVerification,
    User,
    ApiError
} from './types';
import { AUTH_ENDPOINTS, JWT_CONFIG, AUTH_ERRORS } from './constants';
import { getToken, setToken, removeToken, isTokenExpired } from './utils';

/**
 * Create axios instance with base configuration
 */
export const createAuthApi = (baseURL?: string): AxiosInstance => {
    const api = axios.create({
        baseURL: baseURL || import.meta.env.VITE_API_URL || 'http://localhost:3000',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor - Add auth token
    api.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token && !isTokenExpired(token)) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            if (import.meta.env.DEV) {
                console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor - Handle errors and token refresh
    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError<ApiError>) => {
            const originalRequest = error.config as any;

            // Handle 401 Unauthorized
            if (error.response?.status === 401) {
                // Prevent infinite loop
                if (originalRequest._retry) {
                    removeToken();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                originalRequest._retry = true;

                // Try to refresh token
                try {
                    const refreshToken = localStorage.getItem(JWT_CONFIG.REFRESH_TOKEN_KEY);
                    if (refreshToken) {
                        const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN, {
                            refresh_token: refreshToken
                        });

                        setToken(response.data.access_token);

                        // Retry original request
                        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    removeToken();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }

            // Handle other errors
            if (import.meta.env.DEV) {
                console.error('[API Error]', error.response?.data || error.message);
            }

            return Promise.reject(error);
        }
    );

    return api;
};

// Default API instance
export const authApi = createAuthApi();

/**
 * User Authentication APIs
 */
export const userAuth = {
    /**
     * User login with email and password
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await authApi.post<AuthResponse>(AUTH_ENDPOINTS.USER_LOGIN, credentials);
        return response.data;
    },

    /**
     * User signup
     */
    signup: async (data: SignupData): Promise<AuthResponse> => {
        const response = await authApi.post<AuthResponse>(AUTH_ENDPOINTS.USER_SIGNUP, data);
        return response.data;
    },
};

/**
 * Vendor Authentication APIs (OTP-based)
 */
export const vendorAuth = {
    /**
     * Send OTP for vendor login
     */
    sendLoginOTP: async (request: OTPRequest): Promise<{ message: string; otp?: string }> => {
        const response = await authApi.post(AUTH_ENDPOINTS.VENDOR_SEND_OTP, request);
        return response.data;
    },

    /**
     * Verify OTP for vendor login
     */
    verifyLoginOTP: async (verification: OTPVerification): Promise<AuthResponse> => {
        const response = await authApi.post<AuthResponse>(AUTH_ENDPOINTS.VENDOR_VERIFY_OTP, verification);
        return response.data;
    },

    /**
     * Send OTP for vendor signup
     */
    sendSignupOTP: async (request: OTPRequest): Promise<{ message: string; otp?: string }> => {
        const response = await authApi.post(AUTH_ENDPOINTS.VENDOR_SIGNUP_SEND_OTP, request);
        return response.data;
    },

    /**
     * Verify OTP and complete vendor signup
     */
    verifySignupOTP: async (verification: OTPVerification): Promise<AuthResponse> => {
        const response = await authApi.post<AuthResponse>(AUTH_ENDPOINTS.VENDOR_SIGNUP_VERIFY_OTP, verification);
        return response.data;
    },
};

/**
 * Admin Authentication APIs
 */
export const adminAuth = {
    /**
     * Admin login with email, password, and optional 2FA
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await authApi.post<AuthResponse>(AUTH_ENDPOINTS.ADMIN_LOGIN, credentials);
        return response.data;
    },

    /**
     * Create new admin account (restricted)
     */
    signup: async (data: SignupData): Promise<AuthResponse> => {
        const response = await authApi.post<AuthResponse>(AUTH_ENDPOINTS.ADMIN_SIGNUP, data);
        return response.data;
    },
};

/**
 * Common Authentication APIs
 */
export const commonAuth = {
    /**
     * Check current authentication status
     */
    checkAuth: async (): Promise<User> => {
        const response = await authApi.get<User>(AUTH_ENDPOINTS.CHECK_AUTH);
        return response.data;
    },

    /**
     * Logout current user
     */
    logout: async (): Promise<void> => {
        try {
            await authApi.post(AUTH_ENDPOINTS.LOGOUT);
        } finally {
            removeToken();
        }
    },

    /**
     * Check backend health
     */
    healthCheck: async (): Promise<boolean> => {
        try {
            await authApi.get(AUTH_ENDPOINTS.HEALTH_CHECK);
            return true;
        } catch (error) {
            return false;
        }
    },

    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await authApi.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN, {
            refresh_token: refreshToken
        });
        return response.data;
    },
};

/**
 * Social Authentication APIs
 */
export const socialAuth = {
    /**
     * Initiate Google OAuth flow
     */
    googleLogin: (): void => {
        window.location.href = `${authApi.defaults.baseURL}${AUTH_ENDPOINTS.GOOGLE_AUTH}`;
    },

    /**
     * Initiate GitHub OAuth flow
     */
    githubLogin: (): void => {
        window.location.href = `${authApi.defaults.baseURL}${AUTH_ENDPOINTS.GITHUB_AUTH}`;
    },
};

/**
 * Error handler utility
 */
export const handleAuthError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return apiError?.message || AUTH_ERRORS.SERVER_ERROR;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return AUTH_ERRORS.NETWORK_ERROR;
};
