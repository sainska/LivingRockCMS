
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { AuthProvider } from "./contexts/AuthContext";
import { supabase } from "./integrations/supabase/client";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import DashboardRedirect from "./components/auth/DashboardRedirect";
import Layout from "./components/layout/Layout";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import RoleBasedRegister from "./pages/RoleBasedRegister";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./components/admin/AdminDashboard";
import SystemDashboard from "./components/admin/SystemDashboard";
import TreasurerDashboard from "./components/admin/TreasurerDashboard";
import SecretaryDashboard from "./components/admin/SecretaryDashboard";
import ClergyDashboard from "./components/admin/ClergyDashboard";
import UserDashboard from "./components/admin/UserDashboard";
import ChurchSettings from "./components/settings/ChurchSettings";
import SystemSettings from "./components/settings/SystemSettings";
import UserManagement from "./components/settings/UserManagement";
import BackupSettings from "./components/settings/BackupSettings";
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
import PrayerRequests from "./pages/PrayerRequests";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Test database connection
    const testConnection = async () => {
      try {
        console.log('App: Testing database connection...');
        
        // Test basic connection
        const { data, error } = await supabase
          .from('user_roles')
          .select('count')
          .limit(1);
        
        if (error) {
          console.error('App: Database connection error:', error);
        } else {
          console.log('App: Database connection successful');
        }

        // Test auth session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('App: Current session:', session, 'Error:', sessionError);

        // Test if we can query user_roles table
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .limit(5);
        
        console.log('App: User roles test:', { rolesData, rolesError });
        
      } catch (error) {
        console.error('App: Database connection test failed:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/role-based-register" element={<RoleBasedRegister />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Main Dashboard Route - Redirects based on role */}
              <Route path="/" element={<DashboardRedirect />} />
              
              {/* Role-based Dashboard Routes */}
              <Route path="/admin-dashboard" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><AdminDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/system-dashboard" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SystemDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/treasurer-dashboard" element={
                <RoleBasedRoute allowedRoles={['treasurer', 'system_admin']}>
                  <Layout><TreasurerDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/secretary-dashboard" element={
                <RoleBasedRoute allowedRoles={['secretary', 'system_admin']}>
                  <Layout><SecretaryDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/clergy-dashboard" element={
                <RoleBasedRoute allowedRoles={['clergy', 'system_admin']}>
                  <Layout><ClergyDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/user-dashboard" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><UserDashboard /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Settings Routes - Admin Only */}
              <Route path="/church-info" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><ChurchSettings /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/system-overview" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SystemSettings /></Layout>
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
              
              {/* Security Routes - Admin Only */}
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
              <Route path="/integrations" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><IntegrationSettings /></Layout>
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
              <Route path="/reports" element={
                <RoleBasedRoute allowedRoles={['clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><Reports /></Layout>
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
              <Route path="/prayers" element={<PrayerRequests />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;