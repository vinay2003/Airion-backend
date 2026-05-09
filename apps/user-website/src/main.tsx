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

// 🛑 Portal Guard: Only redirect in local dev. In production, Vercel handles routing via vercel.json.
if (typeof window !== 'undefined' && !(window as any).__IS_PORTAL__) {
  const path = window.location.pathname;
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal && !path.includes('/assets/')) {
    if (path.startsWith('/vendor')) {
      window.location.href = `http://localhost:5174${path}${window.location.search}`;
    } else if (path.startsWith('/admin')) {
      window.location.href = `http://localhost:5175${path}${window.location.search}`;
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
