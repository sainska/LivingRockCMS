import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import { AuthProvider } from "./contexts/AuthContext";
import { supabase } from "./integrations/supabase/client";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import DashboardRedirect from "./components/auth/DashboardRedirect";
import Layout from "./components/layout/Layout";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./components/admin/AdminDashboard";
import ChurchInfo from "./pages/ChurchInfo";
import SystemSettings from "./components/admin/SystemSettings";
import UserManagement from "./components/admin/UserManagement";
import BackupSettings from "./components/admin/BackupSettings";
import SystemEvents from "./components/admin/SystemEvents";
import ContentManagement from "./components/admin/ContentManagement";
import SystemCommunications from "./components/admin/SystemCommunications";
import SystemReports from "./components/admin/SystemReports";
import SecurityAccessControl from "./components/admin/SecurityAccessControl";
import SecurityOverview from "./components/security/SecurityOverview";
import UserAccessControl from "./components/security/UserAccessControl";
import DataProtection from "./components/security/DataProtection";
import SecurityLogs from "./components/security/SecurityLogs";
import CheckInSecurity from "./components/security/CheckInSecurity";
import IntegrationSettings from "./components/settings/IntegrationSettings";
import UserProfile from "./components/user/UserProfile";
import NotificationCenter from "./components/notifications/NotificationCenter";
import Members from "./pages/Members";
import Events from "./pages/Events";
import Finances from "./pages/Finances";
import Communication from "./pages/Communication";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import ClergyDashboard from "./components/admin/ClergyDashboard";
import TreasurerDashboard from "./components/admin/TreasurerDashboard";
import SecretaryDashboard from "./components/admin/SecretaryDashboard";
import AuthDebug from "./components/debug/AuthDebug";
import RouteTest from "./components/debug/RouteTest";

const queryClient = new QueryClient();

// Simple Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-foreground">Loading Living Rock CMS...</h2>
      <p className="text-muted-foreground mt-2">Please wait while we initialize the system</p>
    </div>
  </div>
);

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    // Test database connection with timeout
    const testConnection = async () => {
      try {
        console.log('App: Testing database connection...');
        
        // Set a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 5000)
        );

        // Test basic connection
        const connectionPromise = supabase
          .from('user_roles')
          .select('count')
          .limit(1);

        const { data, error } = await Promise.race([connectionPromise, timeoutPromise]);
        
        if (error) {
          console.warn('App: Database connection warning (continuing anyway):', error);
        } else {
          console.log('App: Database connection successful');
        }

        // Test auth session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('App: Current session:', session, 'Error:', sessionError);

        setIsInitialized(true);
        
      } catch (error) {
        console.warn('App: Database connection test failed (continuing anyway):', error);
        setInitError(error.message);
        setIsInitialized(true); // Continue anyway
      }
    };

    testConnection();
  }, []);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Test Route - No Authentication Required */}
              <Route path="/test" element={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">✅ App is Working!</h1>
                    <p className="text-muted-foreground mb-4">Your React app is loading correctly</p>
                    <div className="space-x-4 mb-8">
                      <a href="/welcome" className="text-primary hover:underline">Go to Welcome Page</a>
                      <a href="/auth" className="text-primary hover:underline">Go to Auth Page</a>
                      <a href="/route-test" className="text-primary hover:underline">Test All Routes</a>
                    </div>
                    <AuthDebug />
                  </div>
                </div>
              } />
              
              {/* Route Test - No Authentication Required */}
              <Route path="/route-test" element={<RouteTest />} />
              
              {/* Public Routes */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Main Dashboard Route - Redirects based on role */}
              <Route path="/" element={<DashboardRedirect />} />
              
              {/* System Admin Dashboard Routes */}
              <Route path="/admin/dashboard" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><AdminDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/church-info" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><ChurchInfo /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/system-settings" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SystemSettings /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/user-management" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><UserManagement /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/backup" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><BackupSettings /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/system-events" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SystemEvents /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/content" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><ContentManagement /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/communications" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SystemCommunications /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/reports" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SystemReports /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/security" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SecurityAccessControl /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* User Profile - All authenticated users */}
              <Route path="/profile" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><UserProfile /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Notifications - All authenticated users */}
              <Route path="/notifications" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><NotificationCenter /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Main Module Routes */}
              <Route path="/members" element={
                <RoleBasedRoute allowedRoles={['clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><Members /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/events" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><Events /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/finances" element={
                <RoleBasedRoute allowedRoles={['treasurer', 'system_admin']}>
                  <Layout><Finances /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/communication" element={
                <RoleBasedRoute allowedRoles={['clergy', 'secretary', 'system_admin']}>
                  <Layout><Communication /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/settings" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><Settings /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/security" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><Security /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/clergy/dashboard" element={
                <RoleBasedRoute allowedRoles={['clergy']}>
                  <Layout><ClergyDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/treasurer/dashboard" element={
                <RoleBasedRoute allowedRoles={['treasurer']}>
                  <Layout><TreasurerDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/secretary/dashboard" element={
                <RoleBasedRoute allowedRoles={['secretary']}>
                  <Layout><SecretaryDashboard /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Common Routes for all authenticated users */}
              <Route path="/church-info" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><ChurchInfo /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Security Routes */}
              <Route path="/security-overview" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SecurityOverview /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/access-control" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><UserAccessControl /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/data-protection" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><DataProtection /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/security-logs" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SecurityLogs /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/checkin-security" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><CheckInSecurity /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Additional System Routes */}
              <Route path="/system-overview" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><AdminDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/users" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><UserManagement /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/backup" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><BackupSettings /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/integrations" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><IntegrationSettings /></Layout>
                </RoleBasedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
