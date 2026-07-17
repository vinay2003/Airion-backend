import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { CompareProvider } from './context/CompareContext';
import { CartProvider } from './context/CartContext';
import { BookingCartProvider } from './context/BookingCartContext';
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
import { Payments, Support, Terms, Privacy } from './pages/dashboard/Placeholders';
import DigitalInvites from './pages/dashboard/DigitalInvites';
import OrderHistory from './pages/dashboard/OrderHistory';
import GuestList from './pages/dashboard/GuestList';

// Page imports
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
import BookingCart from './pages/BookingCart';

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
        <WishlistProvider>
          <RecentlyViewedProvider>
            <CompareProvider>
              <CartProvider>
                <BookingCartProvider>
                  <Router>
                    <AuthProvider>
                      <ScrollToTop />
                      <CartDrawer />
                      <Routes>
                        {/* Full-screen routes – No Header/Footer */}
                        <Route path="/splash" element={<Suspense fallback={<PageLoader />}><SplashScreen /></Suspense>} />
                        <Route path="/onboarding" element={<Suspense fallback={<PageLoader />}><Onboarding /></Suspense>} />
                        <Route path="/login" element={<Suspense fallback={<PageLoader />}><UnifiedAuth /></Suspense>} />
                        <Route path="/signup" element={<Suspense fallback={<PageLoader />}><UnifiedAuth /></Suspense>} />
                        <Route path="/onboarding/interests" element={<Suspense fallback={<PageLoader />}><InterestSelection /></Suspense>} />

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
                          <Route path="orders" element={<OrderHistory />} />
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
                                  <Route path="/booking-cart" element={<BookingCart />} />
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
                                  <Route path="/vendor/:id" element={<VendorProfile />} />
                                </Routes>
                              </Suspense>
                            </div>
                            <Footer />
                          </div>
                        } />
                      </Routes>
                    </AuthProvider>
                  </Router>
                </BookingCartProvider>
              </CartProvider>
            </CompareProvider>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
