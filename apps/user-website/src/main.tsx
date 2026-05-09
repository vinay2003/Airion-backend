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

// 🛑 Strict Portal Guard: Redirect to correct apps in dev, or let Vercel handle in prod
if (typeof window !== 'undefined' && !(window as any).__IS_PORTAL__) {
  const path = window.location.pathname;
  if (!path.includes('/assets/') && (path.startsWith('/admin') || path.startsWith('/vendor'))) {
    console.warn('[PortalGuard] Landing page detected on portal route. Handling redirect...');
    
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
      if (path.startsWith('/vendor')) {
        window.location.href = `http://localhost:5174${path}${window.location.search}`;
      } else if (path.startsWith('/admin')) {
        window.location.href = `http://localhost:5175${path}${window.location.search}`;
      }
    } else {
      // In production, Vercel rewrite should handle this, but if it falls through, we force a hard reload
      if (!window.location.search.includes('portal_redirect')) {
        const separator = window.location.search ? '&' : '?';
        window.location.replace(window.location.href + separator + 'portal_redirect=1');
      }
    }
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
