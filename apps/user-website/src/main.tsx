import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, 
      retry: 1,
    },
  },
})

// 🛑 Strict Portal Guard: Prevent landing page from mounting on portal routes
if (typeof window !== 'undefined' && !(window as any).__IS_PORTAL__) {
  const path = window.location.pathname;
  // Ignore assets and only block actual application routes for portals
  if (!path.includes('/assets/') && (path.startsWith('/admin') || path.startsWith('/vendor'))) {
    console.warn('[PortalGuard] Landing page blocked on portal route. Redirecting...');
    // Halt React mounting to let Vercel rewrites or forced reloads take over
    throw new Error('Incorrect portal context');
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
