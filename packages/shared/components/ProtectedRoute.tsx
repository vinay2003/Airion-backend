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
    if (user.role === 'user') {
      window.location.href = getPortalUrl('user');
      return null;
    }

    if (user.role === 'vendor') {
      window.location.href = getPortalUrl('vendor');
      return null;
    }

    if (user.role === 'admin') {
      window.location.href = getPortalUrl('admin');
      return null;
    }

    // Default failsafe: Clear and go to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;