import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
      <Router basename="/vendor">
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<VendorLogin />} />
              <Route path="/signup" element={<VendorSignupBasic />} />
              <Route path="/signup-form" element={<VendorSignupForm />} />

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="listings" element={<Listings />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="plan-event" element={<EventPlanning />} />
                <Route path="promotions" element={<Promotions />} />
                <Route path="*" element={<div className="p-8 dark:text-white">Page not found</div>} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
