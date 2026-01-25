import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

// Dashboard Components
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyBookings from './pages/dashboard/MyBookings';
import SavedVendors from './pages/dashboard/SavedVendors';
import { Payments, GuestList, DigitalInvites, Support } from './pages/dashboard/Placeholders';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Inspiration = lazy(() => import('./pages/Inspiration'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const PlanEvent = lazy(() => import('./pages/PlanEvent'));
const TrendingWeddings = lazy(() => import('./pages/TrendingWeddings'));
const Packages = lazy(() => import('./pages/Packages'));
const BecomeVendor = lazy(() => import('./pages/BecomeVendor'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="saved" element={<SavedVendors />} />
              <Route path="payments" element={<Payments />} />
              <Route path="guests" element={<GuestList />} />
              <Route path="invites" element={<DigitalInvites />} />
              <Route path="support" element={<Support />} />
            </Route>

            {/* Main Website Routes */}
            <Route path="*" element={
              <div className="min-h-screen bg-white dark:bg-slate-950 grid-bg flex flex-col transition-colors duration-300">
                <Header />
                <div className="flex-grow">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/event/:id" element={<EventDetails />} />
                      <Route path="/category/:category" element={<CategoryPage />} />
                      <Route path="/trending-weddings" element={<TrendingWeddings />} />
                      <Route path="/plan-event" element={<PlanEvent />} />
                      <Route path="/inspiration" element={<Inspiration />} />
                      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="/packages" element={<Packages />} />
                      <Route path="/become-vendor" element={<BecomeVendor />} />
                    </Routes>
                  </Suspense>
                </div>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
