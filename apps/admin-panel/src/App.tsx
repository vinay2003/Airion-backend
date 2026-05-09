import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, ProtectedRoute } from '@ease2event/shared';

const queryClient = new QueryClient();

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Vendors = lazy(() => import('./pages/Vendors'));
const Users = lazy(() => import('./pages/Users'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" toastOptions={{ duration: 6000, style: { background: '#ffffff', color: '#1a1a2e', border: '1px solid #f0effe' } }} />
        <Router>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="login" element={<AdminLogin />} />
                <Route path="/" element={
                  <ProtectedRoute 
                    allowedRoles={['admin']} 
                  >
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="vendors" element={<Vendors />} />
                  <Route path="users" element={<Users />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="subscriptions" element={<Subscriptions />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<div className="p-8 text-[var(--ease2event-text-primary)] font-medium">Page not found</div>} />
                </Route>
              </Routes>
            </Suspense>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
