import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has vendor role
    if (user.role !== 'vendor') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You need a vendor account to access this area.
                    </p>
                    <a
                        href="/vendor/signup"
                        className="text-red-500 hover:text-red-600 font-medium"
                    >
                        Register as a Vendor →
                    </a>
                </div>
            </div>
        );
    }

    // User is authenticated and has vendor role
    return <>{children}</>;
};

export default ProtectedRoute;
