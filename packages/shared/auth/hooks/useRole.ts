import { useAuth } from '../AuthContext';
import { UserRole } from '../types';

/**
 * Hook for role-based access control and utility checks
 */
export const useRole = () => {
    const { user } = useAuth();

    const role = user?.role || UserRole.USER;

    const isUser = role === UserRole.USER;
    const isVendor = role === UserRole.VENDOR;
    const isAdmin = role === UserRole.ADMIN;

    // Helper to check for multiple roles
    const hasRole = (roles: UserRole[]) => roles.includes(role);

    return {
        role,
        isUser,
        isVendor,
        isAdmin,
        hasRole
    };
};
