/**
 * Shared Authentication Module
 * Barrel export for easy imports across all portals
 */

// Types
export * from './types';

// Constants
export * from './constants';

// Utilities
export * from './utils';
export * from './tokenService';
export * from './cookieStorage';

// API
export * from './api';

// Context & Hooks
export { AuthProvider, useAuth } from './AuthContext';
export { useRole } from './hooks/useRole';

// Real-time
export * from './socket';
