import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, ProtectedRoute } from '@shared';

// Dashboard Components
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyBookings from './pages/dashboard/MyBookings';
import SavedVendors from './pages/dashboard/SavedVendors';
import BudgetPlanner from './pages/dashboard/BudgetPlanner';
import Inbox from './pages/dashboard/Inbox';
import ProfileSettings from './pages/dashboard/ProfileSettings';

import { Payments, GuestList, DigitalInvites, Support, Terms, Privacy } from './pages/dashboard/Placeholders';

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
              <Route path="/admin/login" element={
                <Suspense fallback={<PageLoader />}>
                  <UnifiedAuth />
                </Suspense>
              } />
              <Route path="/onboarding/interests" element={
                <Suspense fallback={<PageLoader />}>
                  <InterestSelection />
                </Suspense>
              } />

              <Route path="/user/*" element={<Navigate to="/dashboard" replace />} />

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
