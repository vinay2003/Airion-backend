/**
 * Shared Authentication Types
 * Used across all frontend portals (vendor, admin, user)
 */

export enum UserRole {
    USER = 'user',
    VENDOR = 'vendor',
    ADMIN = 'admin'
}

export interface User {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    phoneNumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    user: User;
    expiresIn?: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
    twoFactorCode?: string;
}

export interface SignupData {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: UserRole;
}

export interface OTPRequest {
    phone: string;
}

export interface OTPVerification {
    phone: string;
    otp: string;
    name?: string;
    email?: string;
    role?: UserRole;
}

export interface TokenPayload {
    sub: string; // user id
    email: string;
    role: UserRole;
    iat: number; // issued at
    exp: number; // expiration
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    backendAvailable: boolean;
    login: (token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}
