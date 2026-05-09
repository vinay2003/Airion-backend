import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, ProtectedRoute } from '@ease2event/shared';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Listings = lazy(() => import('./pages/Listings'));
const Inbox = lazy(() => import('./pages/Inbox'));
const VendorLogin = lazy(() => import('./pages/VendorLogin'));
const VendorSignupBasic = lazy(() => import('./pages/auth/VendorSignupBasic'));
const VendorSignupForm = lazy(() => import('./pages/VendorSignup'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const EventPlanning = lazy(() => import('./pages/EventPlanning'));
const Promotions = lazy(() => import('./pages/Promotions'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Earnings = lazy(() => import('./pages/Earnings'));
const Products = lazy(() => import('./pages/Products'));
const Ads = lazy(() => import('./pages/Ads'));
const Gallery = lazy(() => import('./pages/Gallery'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" toastOptions={{ duration: 6000, style: { background: '#ffffff', color: '#1a1a2e', border: '1px solid #f0effe' } }} />
        <Router basename={import.meta.env.PROD ? '/vendor' : '/'}>
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

                   <Route path="calendar" element={<Calendar />} />
                  <Route path="earnings" element={<Earnings />} />
                  <Route path="products" element={<Products />} />
                  <Route path="ads" element={<Ads />} />
                  <Route path="gallery" element={<Gallery />} />

                  <Route path="plan-event" element={<EventPlanning />} />
                  <Route path="promotions" element={<Promotions />} />
                </Route>

                {/* Catch-all - redirect within the basename context */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
