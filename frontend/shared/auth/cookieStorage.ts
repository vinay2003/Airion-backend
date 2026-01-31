/**
 * Cookie-based Token Storage Utilities
 * Extends shared auth utilities with httpOnly cookie support
 */

import { JWT_CONFIG } from './constants';

/**
 * Get token from cookie or localStorage (fallback)
 */
export const getTokenFromCookie = (): string | null => {
    // Try to get from cookie first (most secure)
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith(`${JWT_CONFIG.TOKEN_KEY}=`));

    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }

    // Fallback to localStorage
    return localStorage.getItem(JWT_CONFIG.TOKEN_KEY);
};

/**
 * Set token in both cookie and localStorage
 * Note: HttpOnly cookies should be set by the backend
 */
export const setTokenWithCookie = (token: string, options?: {
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
}): void => {
    const {
        secure = window.location.protocol === 'https:',
        sameSite = 'strict',
        maxAge = JWT_CONFIG.ACCESS_TOKEN_EXPIRY
    } = options || {};

    // Set non-httpOnly cookie (for client-side access)
    const cookieString = [
        `${JWT_CONFIG.TOKEN_KEY}=${token}`,
        `path=/`,
        `max-age=${maxAge}`,
        `SameSite=${sameSite}`,
        secure ? 'Secure' : ''
    ].filter(Boolean).join('; ');

    document.cookie = cookieString;

    // Also set in localStorage as fallback
    localStorage.setItem(JWT_CONFIG.TOKEN_KEY, token);
};

/**
 * Remove token from cookie and localStorage
 */
export const removeTokenWithCookie = (): void => {
    // Remove cookie
    document.cookie = `${JWT_CONFIG.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${JWT_CONFIG.REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    // Remove from localStorage
    localStorage.removeItem(JWT_CONFIG.TOKEN_KEY);
    localStorage.removeItem(JWT_CONFIG.REFRESH_TOKEN_KEY);
};

/**
 * Check if cookies are enabled
 */
export const areCookiesEnabled = (): boolean => {
    try {
        document.cookie = 'cookietest=1';
        const enabled = document.cookie.indexOf('cookietest=') !== -1;
        document.cookie = 'cookietest=1; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        return enabled;
    } catch {
        return false;
    }
};

/**
 * Get preferred token storage method
 */
export const getTokenStorageMethod = (): 'cookie' | 'localStorage' => {
    return areCookiesEnabled() ? 'cookie' : 'localStorage';
};
