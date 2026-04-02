import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from '@airion/shared/auth/AuthContext';
import ProtectedRoute from '@airion/shared/components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Listings = lazy(() => import('./pages/Listings'));
const Inbox = lazy(() => import('./pages/Inbox'));
const VendorLogin = lazy(() => import('./pages/VendorLogin'));
const VendorSignupBasic = lazy(() => import('./pages/VendorSignupBasic'));
const VendorSignupForm = lazy(() => import('./pages/VendorSignup'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const EventPlanning = lazy(() => import('./pages/EventPlanning'));
const Promotions = lazy(() => import('./pages/Promotions'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" toastOptions={{ duration: 6000, style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' } }} />
      <Router basename="/vendor">
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="login" element={<VendorLogin />} />
              <Route path="signup" element={<VendorSignupBasic />} />
              <Route path="signup-form" element={<VendorSignupForm />} />

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="events" element={<Listings />} />
                <Route path="enquiries" element={<Inbox />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />

                <Route path="calendar" element={<div className="p-8 text-[var(--text-primary)]">Calendar View Placeholder</div>} />
                <Route path="earnings" element={<div className="p-8 text-[var(--text-primary)]">Earnings & Financials Placeholder</div>} />
                <Route path="products" element={<div className="p-8 text-[var(--text-primary)]">Products & Services Placeholder</div>} />

                <Route path="plan-event" element={<EventPlanning />} />
                <Route path="promotions" element={<Promotions />} />
              </Route>

              {/* Catch-all - redirect within the basename context */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
