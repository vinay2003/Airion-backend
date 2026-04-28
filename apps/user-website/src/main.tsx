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
if (typeof window !== 'undefined') {
  const path = window.location.pathname;
  if (path.startsWith('/admin') || path.startsWith('/vendor')) {
    console.warn('[PortalGuard] Landing page blocked on portal route. Redirecting...');
    // If we're stuck here, something is wrong with rewrites, force a clean reload
    if (!window.location.hash.includes('retry')) {
       window.location.replace(window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'retry=1');
    }
    // Stop React from mounting
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
