import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { JobProvider } from './context/JobContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <JobProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </JobProvider>
    </AuthProvider>
  </React.StrictMode>
);