import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { BrowserRouter as Router } from 'react-router'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.tsx';
import { registerSW } from 'virtual:pwa-register'

const client = new QueryClient();  // A QueryClient instance created, used to cache data

registerSW({
  onNeedRefresh() {
    console.log('New content available')
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

// Renders in the root element in index.html and wraps the App component with necessary providers
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <AuthProvider>
        <Router>
          <App /> 
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)