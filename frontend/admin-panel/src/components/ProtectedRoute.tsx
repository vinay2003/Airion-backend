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
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Access Denied
                    </h1>
                    <p className="text-gray-400 mb-4">
                        You need administrator privileges to access this area.
                    </p>
                    <a
                        href="/login"
                        className="text-red-400 hover:text-red-300 font-medium"
                    >
                        Return to Login →
                    </a>
                </div>
            </div>
        );
    }

    // User is authenticated and has admin role
    return <>{children}</>;
};

export default ProtectedRoute;
