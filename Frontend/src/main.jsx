import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/app.context.jsx'
import { AuthProvider } from './context/auth.context.jsx'
import { DashboardProvider } from './context/dashboard.context.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <AppProvider>
      <DashboardProvider>
        <App />
        <Toaster position="center-top" />
      </DashboardProvider>
    </AppProvider>
  </AuthProvider>

)
