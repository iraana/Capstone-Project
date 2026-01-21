import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
 
import { BrowserRouter as Router } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 

const client = new QueryClient();  // A QueryClient instance created, used to cache data

// Renders in the root element in index.html and wraps the App component with necessary providers
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>

        <Router>
          <App /> 
        </Router>
    </QueryClientProvider>
 
  </React.StrictMode>,
)