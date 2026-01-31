/**
 * Shared Authentication Constants
 * Used across all frontend portals (vendor, admin, user)
 */

import { UserRole } from './types';

// JWT Configuration
export const JWT_CONFIG = {
    TOKEN_KEY: 'token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    ACCESS_TOKEN_EXPIRY: 900, // 15 minutes (enhanced security)
    REFRESH_TOKEN_EXPIRY: 604800, // 7 days in seconds
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
    PASSWORD_MIN_LENGTH: 12,
    PASSWORD_REQUIRE_UPPERCASE: true,
    PASSWORD_REQUIRE_LOWERCASE: true,
    PASSWORD_REQUIRE_NUMBER: true,
    PASSWORD_REQUIRE_SPECIAL: true,

    // Rate Limiting
    LOGIN_MAX_ATTEMPTS: 5,
    LOGIN_RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    OTP_MAX_REQUESTS: 3,
    OTP_RATE_LIMIT_WINDOW: 60 * 60 * 1000, // 1 hour
    IP_BLOCK_THRESHOLD: 10,

    // Session Management
    SESSION_INACTIVITY_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days
    MAX_ACTIVE_SESSIONS: 5,
} as const;

// API Endpoints
export const AUTH_ENDPOINTS = {
    // User Authentication
    USER_LOGIN: '/auth/login',
    USER_SIGNUP: '/auth/signup',

    // Vendor Authentication (OTP-based)
    VENDOR_SEND_OTP: '/auth/login/send-otp',
    VENDOR_VERIFY_OTP: '/auth/login/verify-otp',
    VENDOR_SIGNUP_SEND_OTP: '/auth/signup/send-otp',
    VENDOR_SIGNUP_VERIFY_OTP: '/auth/signup/verify-otp',

    // Admin Authentication
    ADMIN_LOGIN: '/auth/admin/login',
    ADMIN_SIGNUP: '/auth/admin/signup',

    // Common
    CHECK_AUTH: '/auth/me',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    HEALTH_CHECK: '/health',

    // Social Auth
    GOOGLE_AUTH: '/auth/google',
    GITHUB_AUTH: '/auth/github',
} as const;

// User Roles
export const ROLES = {
    USER: UserRole.USER,
    VENDOR: UserRole.VENDOR,
    ADMIN: UserRole.ADMIN,
} as const;

// Role Display Names
export const ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.USER]: 'User',
    [UserRole.VENDOR]: 'Vendor',
    [UserRole.ADMIN]: 'Administrator',
};

// Portal Routes
export const PORTAL_ROUTES = {
    [UserRole.USER]: {
        LOGIN: '/login',
        SIGNUP: '/signup',
        DASHBOARD: '/',
        LOGOUT_REDIRECT: '/login',
    },
    [UserRole.VENDOR]: {
        LOGIN: '/vendor/login',
        SIGNUP: '/vendor/signup',
        DASHBOARD: '/dashboard',
        LOGOUT_REDIRECT: '/vendor/login',
    },
    [UserRole.ADMIN]: {
        LOGIN: '/login',
        SIGNUP: '/signup', // Usually restricted
        DASHBOARD: '/',
        LOGOUT_REDIRECT: '/login',
    },
} as const;

// OTP Configuration
export const OTP_CONFIG = {
    LENGTH: 6,
    EXPIRY_MINUTES: 10,
    MAX_ATTEMPTS: 3,
} as const;

// Error Messages
export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: 'Invalid email or password',
    INVALID_OTP: 'Invalid OTP. Please try again.',
    OTP_EXPIRED: 'OTP has expired. Please request a new one.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    USER_NOT_FOUND: 'User not found.',
    EMAIL_EXISTS: 'An account with this email already exists.',
    PHONE_EXISTS: 'An account with this phone number already exists.',
} as const;

// Success Messages
export const AUTH_SUCCESS = {
    LOGIN: 'Login successful!',
    SIGNUP: 'Account created successfully!',
    LOGOUT: 'Logged out successfully.',
    OTP_SENT: 'OTP sent successfully!',
    PASSWORD_RESET: 'Password reset email sent.',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    REMEMBER_ME: 'remember_me',
    VENDOR_BASIC_DETAILS: 'vendorBasicDetails',
} as const;
