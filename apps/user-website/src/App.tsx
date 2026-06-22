import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, ProtectedRoute } from '@ease2event/shared';
import { getPortalUrl } from '@ease2event/shared/auth/utils';

// Dashboard Components
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyBookings from './pages/dashboard/MyBookings';
import SavedVendors from './pages/dashboard/SavedVendors';
import BudgetPlanner from './pages/dashboard/BudgetPlanner';
import Inbox from './pages/dashboard/Inbox';
import ProfileSettings from './pages/dashboard/ProfileSettings';

import { Payments, DigitalInvites, Support, Terms, Privacy } from './pages/dashboard/Placeholders';
import GuestList from './pages/dashboard/GuestList';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const VendorDiscovery = lazy(() => import('./pages/VendorDiscovery'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Inspiration = lazy(() => import('./pages/Inspiration'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const UnifiedAuth = lazy(() => import('./pages/UnifiedAuth'));
const PlanEvent = lazy(() => import('./pages/PlanEvent'));
const TrendingWeddings = lazy(() => import('./pages/TrendingWeddings'));
const Packages = lazy(() => import('./pages/Packages'));
const BecomeVendor = lazy(() => import('./pages/BecomeVendor'));
const InterestSelection = lazy(() => import('./pages/InterestSelection'));
const SplashScreen = lazy(() => import('./pages/SplashScreen'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const VendorProfile = lazy(() => import('./pages/VendorProfile'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
  </div>
);

// 🔀 Portal Redirect: Hard-redirects to vendor/admin portals
// Acts as a safety net when the user website's index.html is served for /vendor or /admin paths
const PortalRedirect: React.FC<{ to: 'vendor' | 'admin' }> = ({ to }) => {
  React.useEffect(() => {
    // 🔥 Prevent Infinite Redirect Loop!
    if (window.location.pathname.startsWith(`/${to}`)) {
      console.error(`[PortalRedirect] Infinite loop detected for /${to}. Vercel is serving user-website instead of ${to}-panel!`);
      return;
    }

    const targetUrl = getPortalUrl(to);
    // Preserve any query params (e.g. ?token=...)
    const search = window.location.search;
    window.location.replace(`${targetUrl}${search}`);
  }, [to]);

  if (window.location.pathname.startsWith(`/${to}`)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 p-8">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 mb-4 text-5xl">⚠️</div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Portal Configuration Error</h1>
          <p className="text-gray-600 mb-4">
            The <b>{to}</b> portal is not properly deployed or accessible at this URL.
          </p>
          <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm text-left font-mono">
            <strong>Fix for Vercel:</strong><br />
            Ensure <code>vercel.json</code> rewrites are active, OR set the environment variable <code>VITE_{to.toUpperCase()}_URL</code> to the deployed URL of the {to} portal.
          </div>
          <button 
            onClick={() => window.location.href = '/'} 
            className="mt-6 w-full py-3 bg-[#C25844] text-white rounded-xl font-bold hover:bg-[#a94a38] transition-colors"
          >
            Go back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C25844] mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">Redirecting to {to} portal...</p>
      </div>
    </div>
  );
};

const HardRedirect: React.FC<{ to: string }> = ({ to }) => {
  React.useEffect(() => {
    // 🛑 Loop Guard: Only redirect if the destination is different from current URL
    // Also handles port changes in local development
    const currentUrl = window.location.href;
    const isLocal = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1');
    
    if (isLocal) {
      // In local, we always redirect to cross ports (e.g. 5173 -> 5174)
      window.location.href = to;
    } else {
      // In production, only redirect if the path is actually different or we are stuck in the wrong app
      const targetPath = to.split('?')[0];
      if (!window.location.pathname.startsWith(targetPath)) {
        window.location.href = to;
      }
    }
  }, [to]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center animate-pulse">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium">Switching to Secure Portal...</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Toaster position="top-right" toastOptions={{ duration: 5000, style: { background: '#171717', color: '#fff', borderRadius: '12px' }, success: { iconTheme: { primary: '#dc2626', secondary: '#fff' } } }} />
        <Router>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              {/* Full-screen routes - No Header/Footer */}
              <Route path="/splash" element={
                <Suspense fallback={<PageLoader />}>
                  <SplashScreen />
                </Suspense>
              } />
              <Route path="/onboarding" element={
                <Suspense fallback={<PageLoader />}>
                  <Onboarding />
                </Suspense>
              } />
              <Route path="/login" element={
                <Suspense fallback={<PageLoader />}>
                  <UnifiedAuth />
                </Suspense>
              } />
              <Route path="/signup" element={
                <Suspense fallback={<PageLoader />}>
                  <UnifiedAuth />
                </Suspense>
              } />
              <Route path="/onboarding/interests" element={
                <Suspense fallback={<PageLoader />}>
                  <InterestSelection />
                </Suspense>
              } />

              {/* 🔀 Portal Redirects: Safety net if user-website index.html is served for vendor/admin paths */}
              <Route path="/vendor" element={<PortalRedirect to="vendor" />} />
              <Route path="/vendor/*" element={<PortalRedirect to="vendor" />} />
              <Route path="/admin" element={<PortalRedirect to="admin" />} />
              <Route path="/admin/*" element={<PortalRedirect to="admin" />} />

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['user']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardOverview />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="saved" element={<SavedVendors />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="budget" element={<BudgetPlanner />} />
                <Route path="payments" element={<Payments />} />
                <Route path="settings" element={<ProfileSettings />} />

                <Route path="guests" element={<GuestList />} />
                <Route path="invites" element={<DigitalInvites />} />
                <Route path="support" element={<Support />} />
              </Route>


              {/* Main Website Routes with Header/Footer */}
              <Route path="*" element={
                <div className="min-h-screen bg-white dark:bg-slate-950 grid-bg flex flex-col transition-colors duration-300">
                  <Header />
                  <div className="flex-grow">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/marketplace" element={<VendorDiscovery />} />
                        <Route path="/search" element={<VendorDiscovery />} />
                        <Route path="/event/:id" element={<EventDetails />} />
                        <Route path="/vendors/:id" element={<EventDetails />} />
                        <Route path="/category/:category" element={<CategoryPage />} />
                        <Route path="/trending-weddings" element={<TrendingWeddings />} />
                        <Route path="/plan-event" element={<PlanEvent />} />
                        <Route path="/inspiration" element={<Inspiration />} />
                        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/contact" element={<ContactUs />} />
                        <Route path="/packages" element={<Packages />} />
                        <Route path="/become-vendor" element={<BecomeVendor />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />
                      </Routes>
                    </Suspense>
                  </div>
                  <Footer />
                </div>
              } />
            </Routes>
          </AuthProvider>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
