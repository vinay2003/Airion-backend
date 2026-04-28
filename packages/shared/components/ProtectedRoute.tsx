import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getPortalUrl } from '../auth/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  /** Optional URL to redirect to if not authenticated (external or internal) */
  redirectUrl?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, redirectUrl }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (redirectUrl) {
      // If redirectUrl is an external link (different portal)
      if (redirectUrl.startsWith('http')) {
        const currentUrl = encodeURIComponent(window.location.href);
        window.location.href = redirectUrl.includes('?')
          ? `${redirectUrl}&redirect_to=${currentUrl}`
          : `${redirectUrl}?redirect_to=${currentUrl}`;
        return null;
      }
      return <Navigate to={redirectUrl} state={{ redirect: location.pathname }} replace />;
    }
    // Redirect to login but save the current location for comeback
    return <Navigate to="/login" state={{ redirect: location.pathname }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // 🛡️ Role-Based Portal Enforcement
    // Prevents cross-portal access and redirect loops
    const targetUrl = getPortalUrl(user.role as any);
    const currentPath = window.location.pathname;

    // 🛑 Loop Guard: If we are already on the target portal/path, don't redirect again
    const isAlreadyOnTarget = targetUrl.startsWith('http') 
      ? window.location.href.startsWith(targetUrl)
      : currentPath.startsWith(targetUrl) || (targetUrl === '/dashboard' && currentPath.includes('/dashboard'));

    if (isAlreadyOnTarget) {
      console.warn(`[ProtectedRoute] User role ${user.role} is already on target ${targetUrl}. Avoiding redirect loop.`);
      return <>{children}</>;
    }

    window.location.href = targetUrl;
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;