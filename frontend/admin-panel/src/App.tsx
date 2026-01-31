import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Vendors = lazy(() => import('./pages/Vendors'));
const Users = lazy(() => import('./pages/Users'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Settings = lazy(() => import('./pages/Settings'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router basename="/admin">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="vendors" element={<Vendors />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<div className="p-8 dark:text-white">Page not found</div>} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
