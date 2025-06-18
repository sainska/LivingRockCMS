
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes with Layout - Role-based Dashboards */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/system-dashboard" element={
              <ProtectedRoute>
                <Layout><SystemDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/treasurer-dashboard" element={
              <ProtectedRoute>
                <Layout><TreasurerDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/secretary-dashboard" element={
              <ProtectedRoute>
                <Layout><SecretaryDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/clergy-dashboard" element={
              <ProtectedRoute>
                <Layout><ClergyDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/user-dashboard" element={
              <ProtectedRoute>
                <Layout><UserDashboard /></Layout>
              </ProtectedRoute>
            } />
            
            {/* Settings Routes */}
            <Route path="/church-info" element={
              <ProtectedRoute>
                <Layout><ChurchSettings /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/system-overview" element={
              <ProtectedRoute>
                <Layout><SystemSettings /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <Layout><UserManagement /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/backup" element={
              <ProtectedRoute>
                <Layout><BackupSettings /></Layout>
              </ProtectedRoute>
            } />
            
            {/* Security Routes */}
            <Route path="/security-overview" element={
              <ProtectedRoute>
                <Layout><SecurityOverview /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/access-control" element={
              <ProtectedRoute>
                <Layout><UserAccessControl /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/data-protection" element={
              <ProtectedRoute>
                <Layout><DataProtection /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/security-logs" element={
              <ProtectedRoute>
                <Layout><SecurityLogs /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/checkin-security" element={
              <ProtectedRoute>
                <Layout><CheckInSecurity /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/integrations" element={
              <ProtectedRoute>
                <Layout><IntegrationSettings /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
