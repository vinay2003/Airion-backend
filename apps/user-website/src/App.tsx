import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { CompareProvider } from './context/CompareContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, ProtectedRoute } from '@ease2event/shared';

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

// Static imports for instant page transitions
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import VendorDiscovery from './pages/VendorDiscovery';
import CategoryPage from './pages/CategoryPage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Inspiration from './pages/Inspiration';
import BookingConfirmation from './pages/BookingConfirmation';
import UnifiedAuth from './pages/UnifiedAuth';
import PlanEvent from './pages/PlanEvent';
import TrendingWeddings from './pages/TrendingWeddings';
import Packages from './pages/Packages';
import BecomeVendor from './pages/BecomeVendor';
import InterestSelection from './pages/InterestSelection';
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import VendorProfile from './pages/VendorProfile';
import Merchandise from './pages/Merchandise';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
  </div>
);


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
        <WishlistProvider>
          <RecentlyViewedProvider>
            <CompareProvider>
              <CartProvider>
                <Router>
                  <AuthProvider>
                    <ScrollToTop />
                    <CartDrawer />
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

                  {/* vendor/admin are served as separate apps from dist/vendor and dist/admin - not handled by user-website */}

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
                            <Route path="/merchandise" element={<Merchandise />} />
                            <Route path="/merchandise/:id" element={<ProductDetails />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/cart" element={<Cart />} />
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
          </CartProvider>
        </CompareProvider>
      </RecentlyViewedProvider>
    </WishlistProvider>
  </ToastProvider>
</ErrorBoundary>
  );
};

export default App;
