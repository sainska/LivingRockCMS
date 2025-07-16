
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardRedirect from '@/components/auth/DashboardRedirect';

// Pages
import Welcome from '@/pages/Welcome';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Members from '@/pages/Members';
import Events from '@/pages/Events';
import Finances from '@/pages/Finances';
import Communication from '@/pages/Communication';
import Ministry from '@/pages/Ministry';
import Reports from '@/pages/Reports';
import ChurchInfo from '@/pages/ChurchInfo';
import Security from '@/pages/Security';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Root route - redirects based on authentication */}
              <Route path="/" element={<DashboardRedirect />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/members" element={
                <ProtectedRoute>
                  <Members />
                </ProtectedRoute>
              } />
              
              <Route path="/events" element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } />
              
              <Route path="/finances" element={
                <ProtectedRoute>
                  <Finances />
                </ProtectedRoute>
              } />
              
              <Route path="/communication" element={
                <ProtectedRoute>
                  <Communication />
                </ProtectedRoute>
              } />
              
              <Route path="/ministry" element={
                <ProtectedRoute>
                  <Ministry />
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              
              <Route path="/church-info" element={
                <ProtectedRoute>
                  <ChurchInfo />
                </ProtectedRoute>
              } />
              
              <Route path="/security" element={
                <ProtectedRoute requiredRole="system_admin">
                  <Security />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
